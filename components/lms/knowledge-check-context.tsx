"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from "react"

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
  
  const handleSetIsPassed = useCallback((val: boolean) => {
    setIsPassed(val)
  }, [])
  
  const contextValue = useMemo(() => ({
    isPassed,
    setIsPassed: handleSetIsPassed
  }), [isPassed, handleSetIsPassed])
  
  return (
    <KnowledgeCheckContext.Provider value={contextValue}>
      {children}
    </KnowledgeCheckContext.Provider>
  )
}

export function useKnowledgeCheck() {
  return useContext(KnowledgeCheckContext)
}
