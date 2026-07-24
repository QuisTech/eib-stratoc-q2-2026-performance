import { getSessionUser } from "@/app/actions/auth"
import { NextResponse } from "next/server"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"

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
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Environment Check
    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO
    const pathPrefix = process.env.GITHUB_IMAGE_PATH || "course-images"

    if (!token || !owner || !repo) {
      console.error("Missing GitHub environment variables for image upload.");
      return NextResponse.json({ error: "Server misconfiguration for image uploads." }, { status: 500 })
    }

    // Convert file to Base64 (GitHub API requires Base64 content)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Content = buffer.toString('base64')

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop() || "png"
    const filename = `course-image-${timestamp}-${randomString}.${extension}`
    const fullPath = `${pathPrefix}/${filename}`

    // Upload to GitHub via REST API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'EIB-LMS-Upload'
      },
      body: JSON.stringify({
        message: `Upload ${filename} via Graphic Builder`,
        content: base64Content,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("GitHub API error:", response.status, errorText)
      throw new Error("Failed to upload image to CDN")
    }

    // Construct jsDelivr public URL
    const publicUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${fullPath}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
