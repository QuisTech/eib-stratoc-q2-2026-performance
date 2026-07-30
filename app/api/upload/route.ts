import { getSessionUser } from "@/app/actions/auth"
import { NextResponse } from "next/server"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    // Authentication check
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Admin role check
    const isSuperAdmin = checkIsSuperAdmin(user)
    if (!isSuperAdmin && user.role !== "admin" && user.role !== "super_admin" && user.role !== "group_head" && user.role !== "lead") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, and PPTX are allowed." }, { status: 400 })
    }

    // Validate file size (25MB limit for documents, 5MB for images)
    const isDocument = file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    const maxSize = isDocument ? 25 * 1024 * 1024 : 5 * 1024 * 1024 
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Maximum size is ${isDocument ? "25MB" : "5MB"}.` }, { status: 400 })
    }

    // Environment Check
    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO
    
    // Determine path based on file type
    const pathPrefix = isDocument 
      ? (process.env.GITHUB_DOCUMENT_PATH || "course-documents") 
      : (process.env.GITHUB_IMAGE_PATH || "course-images")

    if (!token || !owner || !repo) {
      console.error("Missing GitHub environment variables for file upload.");
      return NextResponse.json({ error: "Server misconfiguration for file uploads." }, { status: 500 })
    }

    // Convert file to Base64 (GitHub API requires Base64 content)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Content = buffer.toString('base64')

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop() || (isDocument ? "pdf" : "png")
    const filePrefix = isDocument ? "course-document" : "course-image"
    const filename = `${filePrefix}-${timestamp}-${randomString}.${extension}`
    const fullPath = `${pathPrefix}/${filename}`

    // Upload to GitHub via REST API
    let publicUrl = ""
    let githubSuccess = false
    
    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'EIB-LMS-Upload'
        },
        body: JSON.stringify({
          message: `Upload ${filename} via Course Builder`,
          content: base64Content,
        })
      })

      if (response.ok) {
        githubSuccess = true
        // Construct jsDelivr public URL
        publicUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${fullPath}`
      } else {
        const errorText = await response.text()
        console.error("GitHub API error:", response.status, errorText)
        console.error("GitHub API details:", { apiUrl, owner, repo, fullPath, fileSize: file.size })
      }
    } catch (githubError) {
      console.error("GitHub upload failed:", githubError)
    }

    // Fallback to local VPS storage
    const localUploadDir = path.join(process.cwd(), 'public', 'uploads', isDocument ? 'documents' : 'images')
    
    // Create directory if it doesn't exist
    if (!existsSync(localUploadDir)) {
      await mkdir(localUploadDir, { recursive: true })
    }
    
    // Create directory if it doesn't exist
    if (!existsSync(localUploadDir)) {
      await mkdir(localUploadDir, { recursive: true })
    }

    // Save file locally
    const localFilePath = path.join(localUploadDir, filename)
    await writeFile(localFilePath, buffer)

    // Use local URL if GitHub failed, otherwise use CDN URL
    const finalUrl = githubSuccess ? publicUrl : `/api/uploads/${isDocument ? 'documents' : 'images'}/${filename}`

    return NextResponse.json({
      success: true,
      url: finalUrl,
      filename: filename,
      source: githubSuccess ? 'github' : 'local'
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 })
  }
}
