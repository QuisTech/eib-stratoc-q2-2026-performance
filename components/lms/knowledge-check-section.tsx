"use client"

import { KnowledgeMatch } from "./knowledge-match"

type MatchingQuestion = {
  id: string
  prompt: string
  pairs: { left: string; right: string }[]
  explanation: string
}

export function KnowledgeCheckSection({ question }: { question: MatchingQuestion }) {
  const handlePassed = (passed: boolean) => {
    if (passed) {
      const section = document.getElementById("knowledge-check-section")
      if (section) {
        section.dataset.passed = "true"
      }
    }
  }

  return (
    <div id="knowledge-check-section" className="mt-12 scroll-mt-24">
      <KnowledgeMatch question={question} onPassed={handlePassed} />
    </div>
  )
}
