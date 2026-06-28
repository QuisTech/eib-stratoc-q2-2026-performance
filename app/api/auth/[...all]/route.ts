import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest, NextResponse } from "next/server"

const handler = toNextJsHandler(auth.handler)

export async function POST(req: NextRequest) {
  try {
    const res = await handler.POST(req)
    if (res.status === 500) {
      const text = await res.clone().text()
      console.error("BETTER AUTH 500 ERROR (POST):", text)
    }
    return res
  } catch (err) {
    console.error("FATAL API ERROR (POST):", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const res = await handler.GET(req)
    if (res.status === 500) {
      const text = await res.clone().text()
      console.error("BETTER AUTH 500 ERROR (GET):", text)
    }
    return res
  } catch (err) {
    console.error("FATAL API ERROR (GET):", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
