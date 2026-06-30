import { NextResponse } from "next/server"
import { pushToCloud, pullFromCloud } from "@/app/actions/sync"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    // A simple secret to prevent unauthorized syncs
    if (authHeader !== `Bearer ${process.env.SYNC_SECRET || 'eib-secret-sync'}`) {
      // Note: for cron jobs running locally, we can also check if remote address is 127.0.0.1
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pullResult = await pullFromCloud(true)
    const pushResult = await pushToCloud(true)

    return NextResponse.json({ 
      success: true, 
      pulled: pullResult.logs,
      pushed: pushResult.logs
    })
  } catch (error: any) {
    console.error("Cron sync failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
