import { getSessionUser } from "@/app/actions/auth"
import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { isSuperAdminEmail } from "@/lib/access-control"

export async function POST(req: Request) {
  try {
    // Authentication check
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Admin role check
    const isSuperAdmin = isSuperAdminEmail(user.email)
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

    // Check environment
    const isVercel = process.env.VERCEL === "1"

    // Validate file size
    const maxSize = 5 * 1024 * 1024 
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // HYBRID FALLBACK: Base64 for Vercel
    if (isVercel) {
      let finalBuffer = buffer;
      let finalMime = file.type;

      try {
        const sharp = (await import('sharp')).default
        // Compress to WebP and resize to max width 1200px to drastically reduce size for Base64
        finalBuffer = await sharp(buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();
          
        finalMime = "image/webp";

        // Fallback for extreme cases
        if (finalBuffer.length > 700 * 1024) {
          finalBuffer = await sharp(buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 50 })
            .toBuffer();
        }
      } catch (e) {
        console.warn("Sharp image compression failed on Vercel fallback:", e);
      }

      if (finalBuffer.length > 700 * 1024) {
         return NextResponse.json({ error: "File is still too large after compression. Please upload a smaller image (under ~1MB) for Vercel preview." }, { status: 400 })
      }

      const base64String = finalBuffer.toString('base64')
      const dataUrl = `data:${finalMime};base64,${base64String}`
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
      })
    }

    // ORIGINAL BEHAVIOR: Local Filesystem for On-Premise VPX
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop() || "png"
    const filename = `course-image-${timestamp}-${randomString}.${extension}`

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "course-images")
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // Write file to disk
    const filePath = path.join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    // Return the local URL through our dynamic serving API route
    const localUrl = `/api/local-images/course-images/${filename}`

    return NextResponse.json({
      success: true,
      url: localUrl,
      filename: filename,
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

