"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InteractiveTabs({ tabs }: { tabs: { tabTitle: string; content: string }[] }) {
  if (!tabs || tabs.length === 0) return null

  // Function to parse markdown roughly for the UI
  function parseMarkdown(text: string) {
    let html = text
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:text-primary/80">$1</a>')
    return html
  }

  return (
    <div className="w-full rounded-xl border bg-card text-card-foreground shadow-sm mt-8 overflow-hidden">
      <Tabs defaultValue={tabs[0].tabTitle} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 flex-wrap h-auto">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.tabTitle}
              value={t.tabTitle}
              className="relative rounded-none border-b-2 border-transparent px-6 py-4 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground hover:bg-muted/50 transition-none data-[state=active]:bg-transparent"
            >
              {t.tabTitle}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.tabTitle} value={t.tabTitle} className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="prose dark:prose-invert max-w-none">
              <p 
                className="text-pretty leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(t.content) }}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
