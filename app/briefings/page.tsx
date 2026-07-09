import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getCourses } from "@/app/actions/lms"
import { isCourseVisibleToUser } from "@/lib/utils"
import { FileText, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function BriefingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect("/sign-in")
  }

  const userRole = session.user.role || "learner"
  const userSubsidiary = session.user.subsidiary || null
  const isManager = userRole === "lead" || userRole === "admin" || userRole === "group_head" || userRole === "executive"

  if (!isManager) {
    redirect("/")
  }

  const userEmail = session.user.email || null

  const courses = await getCourses()

  // Filter for Strategic Briefings that this user is allowed to see
  const visibleBriefings = courses.filter((c) => {
    if (!c.isBriefing) return false;

    const courseSubsList = c.subsidiaries ? c.subsidiaries.split(",").map((s) => s.trim().toLowerCase()) : []
    
    // BLACK subsidiary is highly classified. Only admin, DCI, or BLACK users can see it.
    if (courseSubsList.includes("black")) {
      const userSubLower = userSubsidiary?.toLowerCase() || ""
      const isDicoEmail = userEmail?.toLowerCase().endsWith("@dico.eibstratoc.com") || false
      
      return (
        userRole === "admin" ||
        isDicoEmail ||
        userSubLower.startsWith("dci -") ||
        userSubLower === "directorate of clandestine & intelligence" ||
        userSubLower === "black"
      )
    }

    // Since this is the Strategic Briefing view, ALL Managers (Group Heads & Subsidiary Managers) can see it!
    return true;
  })

  // Group briefings by subsidiary tag
  const groupedBriefings: Record<string, typeof courses> = {}
  
  visibleBriefings.forEach(course => {
    // If it has multiple subsidiaries, we'll just use the first one for grouping
    // or group it under the exact string. Let's group by the exact string for simplicity.
    const subs = course.subsidiaries || "Global"
    if (!groupedBriefings[subs]) groupedBriefings[subs] = []
    groupedBriefings[subs].push(course)
  })

  // Sort groups alphabetically
  const sortedGroups = Object.keys(groupedBriefings).sort()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Strategic Briefings</h1>
        <p className="mt-2 text-muted-foreground">
          Access official strategic plans, 90-day action plans, and operational directives from the management retreat.
        </p>
      </div>

      {visibleBriefings.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold">No briefings available</h3>
          <p className="text-sm text-muted-foreground">There are currently no strategic briefings assigned to your subsidiary.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedGroups.map(subsidiary => (
            <div key={subsidiary} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-xl font-semibold tracking-tight">{subsidiary}</h2>
                <Badge variant="secondary" className="rounded-full">{groupedBriefings[subsidiary].length}</Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedBriefings[subsidiary].map(course => {
                  
                  // Extract all PDF attachments from customContent
                  const attachments: { title: string, url: string }[] = []
                  if (course.customContent) {
                    try {
                      const content = typeof course.customContent === "string" 
                        ? JSON.parse(course.customContent) 
                        : course.customContent
                      
                      if (content.lessons && content.lessons.length > 0) {
                        for (const lesson of content.lessons) {
                          if (lesson.attachments && lesson.attachments.length > 0) {
                            for (const att of lesson.attachments) {
                              // Avoid duplicates
                              if (!attachments.find(a => a.url === att.url)) {
                                attachments.push({ title: att.title, url: att.url })
                              }
                            }
                          }
                        }
                      }
                    } catch (e) {
                      console.error("Error parsing customContent for briefing", e)
                    }
                  }

                  return (
                    <div key={course.id} className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-1 flex-col p-6">
                        {course.imageUrl ? (
                          <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-xl border-b aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={course.imageUrl} 
                              alt={course.title} 
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-6 w-6" />
                          </div>
                        )}
                        <h3 className="font-semibold leading-tight line-clamp-2">{course.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {course.description}
                        </p>
                      </div>
                      
                      {attachments.length > 0 ? (
                        <div className="border-t bg-muted/30 px-6 py-4 flex flex-col gap-2">
                          {attachments.map((att, idx) => (
                            <a 
                              key={idx}
                              href={att.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              <Download className="h-3 w-3" />
                              {att.title.replace(" (PDF)", "")}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="border-t bg-muted/30 px-6 py-4">
                          <button 
                            disabled
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
                          >
                            PDF Not Available
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
