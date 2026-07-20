import { getSessionUser } from "@/app/actions/auth"
import { headers } from "next/headers"
import { isSuperAdminEmail } from "@/lib/access-control"
import { streamObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { courseSchema } from "@/lib/lms-schema"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Allow streaming responses up to 5 minutes to prevent Vercel hobby timeouts on Edge/Node
export const maxDuration = 300

const EIB_GROUP_CONTEXT = `
CRITICAL CONTEXT — READ THIS FIRST:
EIB Group is a NIGERIAN private-sector corporate conglomerate headquartered in Nigeria. It is NOT the European Investment Bank. Do NOT reference the EU, European Union, or any European institutions.

The company culture emphasizes operational excellence, security-first thinking, strict compliance, and the professional development of all staff. 
Training content should reflect professional African/Nigerian corporate environments and use Nigerian Naira (₦) for currency references when applicable.

IMPORTANT INSTRUCTION ON TONE AND NEUTRALITY:
Write the content using highly professional, neutral corporate language. 
CRITICAL RULE: NEVER use the terms "EIB Group", "DCI", "BLACK", "Giga Forensics", "POCTOVA", "BEF", "Bright FM", or any specific company or subsidiary names in the generated content. ALWAYS refer to the company generically as "the organization", "the company", or "the business". Focus entirely on delivering exceptionally rich, substantive, and highly detailed educational material.
`.trim()



export async function POST(req: Request) {
  // bypassed

  const { title, category, customContext, existingLessons, existingQuiz, action } = await req.json()
  const isAppendMode = action === "append_lesson" || (existingLessons && existingLessons.length > 0 && !action)
  const isAppendQuizMode = action === "append_quiz"

  const customInstructions = customContext?.trim()
    ? `\n\nADDITIONAL INSTRUCTIONS FROM THE ADMIN:\n${customContext.trim()}`
    : ""

  let prompt = ""

  if (isAppendQuizMode) {
    const existingCount = existingQuiz?.length || 0
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for the Nigerian conglomerate described above.
The course is titled "${title}" in the category of "${category}".

The admin already has ${existingCount} quiz questions and wants to expand their Item Pool.
Your task is to generate EXACTLY 10 NEW highly detailed, challenging multiple-choice questions for the course.
Ensure they test genuine understanding and are completely unique from standard trivia.

Requirements:
- Generate exactly 10 questions inside the "quiz" array. 
- Do NOT generate any lessons.
- Include a detailed explanation for every question.
- All content must be relevant to the Nigerian corporate context.
- CRITICAL: Do NOT use any subsidiary names. Use generic terms like "the organization".
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}`
  } else if (isAppendMode) {
    const existingTitles = existingLessons.map((l: any) => l.title).join(", ")
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for the Nigerian conglomerate described above.
The course is titled "${title}" in the category of "${category}".

The admin has already generated ${existingLessons.length} lessons: [${existingTitles}].
Your task is to generate EXACTLY ONE highly detailed, rich, and substantive NEW lesson that logically follows the existing ones to continue the curriculum.

Requirements:
- Generate exactly ONE lesson inside the "lessons" array. Do NOT generate a quiz.
- Content MUST be exceptionally rich, actionable, and substantive. Provide deep explanations.
- Include detailed sections with real, practical information and robust paragraphs.
- Include key takeaways.
- All content must be relevant to the Nigerian corporate context.
- CRITICAL: Do NOT use any subsidiary names. Use generic terms like "the organization".
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}`
  } else {
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for the Nigerian conglomerate described above.
Generate a highly detailed, rich, and substantive curriculum. You MUST generate AT LEAST 7 lessons (up to 10) to ensure comprehensive coverage of the topic, and a 10-question multiple choice quiz for a course titled "${title}" in the category of "${category}".

Requirements:
- Content MUST be exceptionally rich, actionable, and substantive. Provide deep explanations, not just high-level fluff.
- Each lesson must have detailed sections with real, practical information and robust paragraphs.
- Each lesson must include key takeaways.
- Include a 'knowledgeCheck' (drag-and-drop matching exercise) in at least 50% of the lessons to reinforce learning.
- Quiz questions must test genuine understanding, not trivial facts.
- Include exactly ONE 'matching' question in the final quiz, and the rest should be 'multiple_choice' questions.
- All content must be relevant to the Nigerian corporate context.
- CRITICAL: Do NOT use any subsidiary names in the content. Use generic terms like "the organization".
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}`
  }

  try {
    const result = streamObject({
      model: google("gemini-2.5-flash"),
      schema: courseSchema,
      prompt: prompt,
      temperature: 0.7,
      providerOptions: {
        google: {
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          ]
        }
      }
    })

    return result.toTextStreamResponse()
  } catch (err: any) {
    console.error("AI Generation Error:", err)
    return new Response(JSON.stringify({ error: err.message || "Failed to generate course content." }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
