"use client"

import React, { createContext, useContext, useState } from "react"

interface KnowledgeCheckContextType {
  isPassed: boolean
  setIsPassed: (val: boolean) => void
}

const KnowledgeCheckContext = createContext<KnowledgeCheckContextType>({
  isPassed: false,
  setIsPassed: () => {},
})

export function KnowledgeCheckProvider({ children }: { children: React.ReactNode }) {
  const [isPassed, setIsPassed] = useState(false)
  return (
    <KnowledgeCheckContext.Provider value={{ isPassed, setIsPassed }}>
      {children}
    </KnowledgeCheckContext.Provider>
  )
}

export function useKnowledgeCheck() {
  return useContext(KnowledgeCheckContext)
}
