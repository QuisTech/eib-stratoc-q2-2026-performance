import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/')
    const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath)

    console.log("Serving file:", { filePath, fullPath })

    // Check if file exists
    if (!existsSync(fullPath)) {
      console.error("File not found:", fullPath)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check file size
    const stats = await stat(fullPath)
    console.log("File stats:", { size: stats.size, isFile: stats.isFile() })

    // Read file
    const fileBuffer = await readFile(fullPath)
    console.log("File read successfully, size:", fileBuffer.length)

    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'
    console.log("Content type:", contentType)

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error("File serving error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}