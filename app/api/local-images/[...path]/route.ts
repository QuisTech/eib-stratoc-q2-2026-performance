import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    
    // Construct the absolute path to the file in public/uploads
    // e.g., if url is /api/local-images/course-images/file.jpg, pathSegments = ['course-images', 'file.jpg']
    const filePath = path.join(process.cwd(), "public", "uploads", ...pathSegments)

    // Prevent directory traversal
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!filePath.startsWith(uploadsDir)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return new NextResponse("Not Found", { status: 404 })
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath)

    // Determine content type based on extension
    const ext = path.extname(filePath).toLowerCase()
    let contentType = "application/octet-stream"
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg"
    else if (ext === ".png") contentType = "image/png"
    else if (ext === ".gif") contentType = "image/gif"
    else if (ext === ".webp") contentType = "image/webp"
    else if (ext === ".svg") contentType = "image/svg+xml"

    // Return the file with caching headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Local image serving error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
