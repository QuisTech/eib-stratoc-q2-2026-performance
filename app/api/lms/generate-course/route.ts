import { getSessionUser } from "@/app/actions/auth"
import { headers } from "next/headers"
import { isSuperAdminEmail } from "@/lib/access-control"
import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createGroq } from "@ai-sdk/groq"
import { courseSchema } from "@/lib/lms-schema"

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

  const rawKeys = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!rawKeys) {
    return new Response(JSON.stringify({ error: "API_KEY_MISSING", details: "No Gemini API Key is configured in Vercel Environment Variables." }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

  // Support multiple API keys separated by commas for rate limit rotation
  const keyList = rawKeys.split(",").map(k => k.trim()).filter(Boolean)
  const selectedKey = keyList[Math.floor(Math.random() * keyList.length)]

  const google = createGoogleGenerativeAI({
    apiKey: selectedKey,
  })

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
- CRITICAL ANTI-CHEAT REQUIREMENT: Do NOT make the correct answer the longest option. All options (A, B, C, D) MUST be approximately the exact same length and structure to prevent length-bias guessing.
- DISTRACTOR QUALITY: All wrong options must be highly plausible, convincing, and confusing distractors that require deep conceptual understanding to distinguish. Do not use obvious throwaway answers.
- The correct answer must require intelligent reasoning, not just recalling a basic definition.
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
- CRITICAL DEPTH REQUIREMENT: Content MUST be exceptionally rich, expert-level, actionable, and highly technical or strategic depending on the topic. Provide deep, granular explanations.
- DO NOT write generic fluff or basic definitions. Assume the learner already understands the basics. Dive straight into advanced concepts, case studies, specific methodologies, and real-world execution.
- VOLUMINOUS REQUIREMENT: Provide highly voluminous, dense, and exceptionally long substantive paragraphs for each section. Maximize the breadth and depth of domains covered.
- Include detailed sections with real, practical information and robust paragraphs.
- Include key takeaways.
- All content must be relevant to the Nigerian corporate context.
- CRITICAL: Do NOT use any subsidiary names. Use generic terms like "the organization".
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}`
  } else {
    prompt = `${EIB_GROUP_CONTEXT}

You are generating a full course curriculum.
Course Title: ${title}
Category: ${category}
${customInstructions}

Requirements:
1. Generate a comprehensive course structure with exactly 4 to 6 lessons.
2. You MUST generate a 5-question multiple choice quiz at the end.
3. CRITICAL DEPTH REQUIREMENT: The content MUST be extremely detailed, expert-level, and highly technical or strategic depending on the topic. 
4. DO NOT write generic fluff or basic definitions. Assume the learner already understands the basics. Dive straight into advanced concepts, case studies, specific methodologies, and real-world execution.
5. VOLUMINOUS REQUIREMENT: Provide highly voluminous, dense, and exceptionally long substantive paragraphs for each section. Maximize the breadth and depth of domains covered.
6. Include a 'knowledgeCheck' in at least 1 or 2 of the lessons.
7. QUIZ ANTI-CHEAT REQUIREMENT: For all quiz questions, do NOT make the correct answer the longest option. All options MUST be approximately the exact same length and structure to prevent length-bias guessing. All distractors must be highly plausible, confusing, and require deep reasoning to distinguish.`
  }

  try {
    const promptWithJsonInstruction = prompt + `\n\nCRITICAL: Output ONLY valid JSON. You MUST use this exact structure, including all keys and ensuring arrays are used where specified:
{
  "lessons": [
    {
      "key": "lesson-1-unique-id",
      "title": "Lesson Title",
      "minutes": 15,
      "summary": "Short summary...",
      "sections": [
        {
          "heading": "Section Heading",
          "body": ["Paragraph 1...", "Paragraph 2..."]
        }
      ],
      "takeaways": ["Takeaway 1", "Takeaway 2"]
    }
  ],
  "quiz": [
    {
      "type": "multiple_choice",
      "id": "q1",
      "prompt": "Question prompt?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation..."
    }
  ]
}`

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
    
    // Switch to Groq llama-3.3-70b-versatile as Gemini hit billing limit
    const aiModel = groq("llama-3.3-70b-versatile")

    const result = await generateObject({
      model: aiModel,
      prompt: promptWithJsonInstruction,
      temperature: 0.3, // Slightly reduced temperature for better syntax adherence
      output: 'no-schema',
    })

    return new Response(JSON.stringify(result.object), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error("AI Generation Error:", err)
    return new Response(JSON.stringify({ error: err.message || "Failed to generate course content." }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
