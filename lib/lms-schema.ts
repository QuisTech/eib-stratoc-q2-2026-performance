import { z } from "zod"

export const lessonSchema = z.object({
  key: z.string().describe("A unique string key for the lesson, e.g. lesson-1-intro"),
  title: z.string().describe("Lesson title"),
  minutes: z.number().describe("Estimated minutes to complete"),
  summary: z.string().describe("Brief summary of the lesson"),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.array(z.string()).describe("Paragraphs of text. Can use markdown."),
    })
  ),
  takeaways: z.array(z.string()),
  isPreview: z.boolean().optional().describe("Whether this lesson is a free preview. Defaults to false."),
  labeledGraphic: z
    .object({
      imageUrl: z.string().describe("URL to the background image. Use https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000 as a placeholder."),
      hotspots: z.array(
        z.object({
          id: z.string(),
          x: z.number().describe("X coordinate percentage (0-100)"),
          y: z.number().describe("Y coordinate percentage (0-100)"),
          title: z.string(),
          content: z.string(),
        })
      ),
    })
    .optional()
    .describe("Optional interactive labeled graphic (image map). Only generate if highly relevant to the lesson."),
  knowledgeCheck: z
    .object({
      type: z.literal("matching"),
      id: z.string(),
      prompt: z.string(),
      pairs: z.array(
        z.object({
          left: z.string(),
          right: z.string(),
        })
      ),
      explanation: z.string(),
    })
    .optional()
    .describe("Optional drag-and-drop matching exercise to test the user within the lesson. Include in at least 50% of lessons."),
  interactiveTabs: z
    .array(
      z.object({
        tabTitle: z.string().describe("Short, punchy title for the tab (e.g. 'Technical Solutions')"),
        content: z.string().describe("Detailed content inside the tab. Markdown supported."),
      })
    )
    .optional()
    .describe("Optional interactive tabbed component. Use this to present categorized data, parallel concepts, or steps in a process. Generate 2 to 4 tabs if highly relevant to the lesson."),
})

export const quizSchema = z.array(
  z.object({
    type: z.enum(["multiple_choice", "matching"]),
    id: z.string(),
    prompt: z.string(),
    options: z.array(z.string()).optional(),
    correctIndex: z.number().optional(),
    pairs: z
      .array(
        z.object({
          left: z.string(),
          right: z.string(),
        })
      )
      .optional(),
    explanation: z.string(),
  })
).describe("A 10-question quiz. Include exactly ONE matching question and 9 multiple_choice questions.")

export const courseSchema = z.object({
  lessons: z.array(lessonSchema).optional(),
  quiz: quizSchema.optional(), // Quiz is optional because Append mode doesn't generate it
  error: z.string().optional(),
})
