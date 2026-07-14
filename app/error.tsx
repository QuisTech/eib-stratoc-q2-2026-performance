"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-4 text-2xl font-bold text-destructive">Something went wrong!</h2>
      <p className="mb-6 max-w-lg text-muted-foreground">
        We've encountered an unexpected error. 
      </p>
      
      <div className="mb-8 w-full max-w-2xl rounded-lg bg-muted p-4 text-left font-mono text-sm text-muted-foreground overflow-auto">
        <p className="font-bold text-foreground">Error Details:</p>
        <p>{error.message}</p>
        {error.stack && (
          <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
        )}
      </div>

      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
