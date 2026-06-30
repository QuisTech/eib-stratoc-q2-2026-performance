"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudDownload, CloudUpload, CheckCircle2, Loader2, Server } from "lucide-react"
import { pushToCloud, pullFromCloud } from "@/app/actions/sync"
import Link from "next/link"

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState("")

  const handlePush = async () => {
    setIsSyncing(true)
    setError("")
    setLogs(["Starting Push to Cloud..."])
    try {
      const res = await pushToCloud()
      if (res.logs) setLogs((prev) => [...prev, ...res.logs, "✅ Push Complete"])
    } catch (err: any) {
      setError(err.message || "Failed to push to cloud")
    } finally {
      setIsSyncing(false)
    }
  }

  const handlePull = async () => {
    setIsSyncing(true)
    setError("")
    setLogs(["Starting Pull from Cloud..."])
    try {
      const res = await pullFromCloud()
      if (res.logs) setLogs((prev) => [...prev, ...res.logs, "✅ Pull Complete"])
    } catch (err: any) {
      setError(err.message || "Failed to pull from cloud")
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/lms/admin" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
          &larr; Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Hybrid Synchronization</h1>
        <p className="text-muted-foreground mt-2 text-balance">
          Manage data synchronization between your local on-premise Postgres database and your Neon Cloud database.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudUpload className="h-5 w-5 text-primary" />
              Push to Cloud
            </CardTitle>
            <CardDescription>
              Uploads all local changes (new users, courses, enrollments) to the Neon database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePush} disabled={isSyncing} className="w-full">
              {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Push Local Data to Cloud"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudDownload className="h-5 w-5 text-primary" />
              Pull from Cloud
            </CardTitle>
            <CardDescription>
              Downloads any new cloud changes and overwrites local data. Useful after a weekend or downtime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePull} disabled={isSyncing} variant="outline" className="w-full">
              {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Pull Cloud Data to Local"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {(logs.length > 0 || error) && (
        <Card className="border-l-4" style={{ borderLeftColor: error ? "var(--destructive)" : "var(--chart-2)" }}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Synchronization Log</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive text-sm font-medium">{error}</p>
            ) : (
              <ul className="space-y-1">
                {logs.map((log, i) => (
                  <li key={i} className="text-sm font-mono text-muted-foreground flex gap-2">
                    <Server className="h-4 w-4" />
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
