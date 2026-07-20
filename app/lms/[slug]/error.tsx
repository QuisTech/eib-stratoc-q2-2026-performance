"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LmsErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service in a real app
    console.error("LMS Route Error:", error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 text-center shadow-sm">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Content Loading Error</CardTitle>
          <CardDescription className="text-foreground/80 mt-2">
            We encountered a problem loading this course content. This may be caused by a temporary network timeout or a formatting issue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-background/50 p-3 text-left text-xs font-mono text-muted-foreground">
            Error digest: {error.digest || "Unknown"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => reset()} variant="default" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
