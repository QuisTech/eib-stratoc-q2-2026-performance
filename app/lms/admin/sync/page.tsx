"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Server, CheckCircle2, XCircle } from "lucide-react"

export default function HybridSyncPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  async function handleSync() {
    setLoading(true)
    setSuccess(false)
    setError(null)
    setLogs(["Starting Hybrid Sync..."])

    try {
      const response = await fetch("/api/admin/sync", { method: "POST" })
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response stream")
      
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter(l => l.trim())
          lines.forEach(line => {
            try {
              const data = JSON.parse(line)
              if (data.log) {
                setLogs(prev => [...prev, data.log])
              } else if (data.error) {
                throw new Error(data.error)
              }
            } catch (e) {
              if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                throw e
              }
            }
          })
      }

      setSuccess(true)
      setLogs(prev => [...prev, "Sync completed successfully! Vercel is deploying and the VPS is restarting."])
      
      // Wait 15 seconds before refreshing to give PM2 and Next.js time to fully reboot
      setTimeout(() => {
        router.refresh()
      }, 15000)

    } catch (err: any) {
      setError(err.message || "An error occurred during sync")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Hybrid Sync
          </CardTitle>
          <CardDescription>
            This process pulls the latest courses from Firestore, regenerates the static catalog, and pushes all local uploads to GitHub to trigger a fresh Vercel deployment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="rounded-md bg-muted p-4 font-mono text-sm h-64 overflow-y-auto flex flex-col gap-1">
              {logs.length === 0 ? (
                <span className="text-muted-foreground">Ready to sync. Click the button below to start.</span>
              ) : (
                logs.map((log, i) => (
                  <span key={i} className="text-foreground">{`> ${log}`}</span>
                ))
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                <XCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle2 className="h-4 w-4" />
                Successfully pushed to GitHub. Vercel deployment has started.
              </div>
            )}

            <button
              onClick={handleSync}
              disabled={loading}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Syncing..." : "Start Hybrid Sync"}
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
