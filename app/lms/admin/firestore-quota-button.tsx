"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ServerCrash } from "lucide-react"
import { runFirestoreQuotaScript } from "@/app/actions/system"

export function FirestoreQuotaButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckQuota() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await runFirestoreQuotaScript()
      if (res.error) {
        setError(res.error)
      } else if (res.output) {
        setResult(res.output)
      }
    } catch (err: any) {
      setError(err.message || "Failed to run quota script")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button 
        onClick={handleCheckQuota} 
        disabled={loading} 
        variant="outline"
        className="w-full sm:w-auto self-start"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && <ServerCrash className="mr-2 h-4 w-4" />}
        Run Hourly Quota Check (GCloud)
      </Button>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-semibold mb-2">Error running script:</p>
          <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-[300px]">{error}</pre>
        </div>
      )}

      {result && (
        <div className="rounded-md border bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Script Output</p>
          <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[400px] text-foreground">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
