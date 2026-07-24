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
    const existingLessonContext = existingLessons && existingLessons.length > 0 
      ? `The course currently has the following lessons:\n` + existingLessons.map((l: any) => `- ${l.title}: ${l.summary || 'No summary'}\n  Key Takeaways: ${l.takeaways?.join(', ') || 'None'}`).join("\n") 
      : "The course currently has no lessons."

    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for the Nigerian conglomerate described above.
The course is titled "${title}" in the category of "${category}".

The admin already has ${existingCount} quiz questions and wants to expand their Item Pool.
${existingLessonContext}

Your task is to generate EXACTLY 10 NEW highly detailed, challenging multiple-choice questions for the course. 
EXTREME DIRECTIVE: The questions MUST STRICTLY AND ONLY test the actual subject matter and concepts taught in the existing lessons provided above. 
Do NOT generate questions about general business strategy, ROI, Nigerian regulations, corporate integration, or facility surveillance unless explicitly mentioned in the lesson summaries. 
If the lessons are about technical engineering (e.g. aerodynamics, PID control, sensors), your questions MUST be about technical engineering.
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
    const existingLessonContext = existingLessons && existingLessons.length > 0 
      ? existingLessons.map((l: any) => `- ${l.title}: ${l.summary || 'No summary'}\n  Key Takeaways: ${l.takeaways?.join(', ') || 'None'}`).join("\n") 
      : "None"
    const existingQuizContext = existingQuiz && existingQuiz.length > 0
      ? `The course also currently has the following quiz questions:\n` + existingQuiz.map((q: any) => `- ${q.prompt}`).join("\n")
      : ""

    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for the Nigerian conglomerate described above.
The course is titled "${title}" in the category of "${category}".

The admin has already generated the following lessons:
${existingLessonContext}

${existingQuizContext}

Your task is to generate EXACTLY ONE highly detailed, rich, and substantive NEW lesson that logically follows the existing ones to continue the curriculum. If there are existing quiz questions, ensure your lesson content helps cover those topics where relevant.

EXTREME DIRECTIVE: The new lesson MUST STRICTLY align with the specific technical or thematic depth of the existing lessons provided above. 
Do NOT generate content about general business strategy, ROI, Nigerian regulations, corporate integration, or facility surveillance unless explicitly relevant to the established curriculum. 
If the existing lessons are about technical engineering (e.g. aerodynamics, PID control, sensors), your new lesson MUST be purely about technical engineering.

Requirements:
- Generate exactly ONE lesson inside the "lessons" array. Do NOT generate a quiz.
- CRITICAL DEPTH REQUIREMENT: Content MUST be exceptionally rich, expert-level, actionable, and highly technical or strategic depending on the topic. Provide deep, granular explanations.
- DO NOT write generic fluff or basic definitions. Assume the learner already understands the basics. Dive straight into advanced concepts, case studies, specific methodologies, and real-world execution.
- VOLUMINOUS REQUIREMENT: Provide highly voluminous, dense, and exceptionally long substantive paragraphs for each section. Maximize the breadth and depth of domains covered.
- Include detailed sections with real, practical information and robust paragraphs.
- Include key takeaways.
- INTERACTIVE TABS REQUIREMENT: You MUST include an "interactiveTabs" array to create a "Deep Dive" tabbed UI for this lesson. This should contain 2-4 tabs exploring specific sub-topics, frameworks, or case studies in extreme detail.
- All content must be relevant to the Nigerian corporate context.
- CRITICAL: Do NOT use any subsidiary names. Use generic terms like "the organization".
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}`
  } else {
    const existingLessonContext = existingLessons && existingLessons.length > 0 
      ? `\n\nExisting Lessons to build upon:\n` + existingLessons.map((l: any) => `- ${l.title}: ${l.summary || 'No summary'}\n  Key Takeaways: ${l.takeaways?.join(', ') || 'None'}`).join("\n") 
      : ""
    const existingQuizContext = existingQuiz && existingQuiz.length > 0
      ? `\n\nExisting Quiz Questions to cover:\n` + existingQuiz.map((q: any) => `- ${q.prompt}`).join("\n")
      : ""

    prompt = `${EIB_GROUP_CONTEXT}

You are generating a full course curriculum.
Course Title: ${title}
Category: ${category}
${customInstructions}${existingLessonContext}${existingQuizContext}

Requirements:
1. Generate a comprehensive course structure with EXACTLY 10 highly detailed lessons.
2. You MUST generate a 5-question multiple choice quiz at the end. Make sure the quiz questions directly test the material taught in the lessons.
3. CRITICAL DEPTH REQUIREMENT: The content MUST be extremely detailed, expert-level, and highly technical or strategic depending on the topic. 
4. DO NOT write generic fluff or basic definitions. Assume the learner already understands the basics. Dive straight into advanced concepts, case studies, specific methodologies, and real-world execution.
5. VOLUMINOUS REQUIREMENT: Provide highly voluminous, dense, and exceptionally long substantive paragraphs for each section. Maximize the breadth and depth of domains covered.
6. Include a 'knowledgeCheck' in at least 1 or 2 of the lessons. EXTREME DIRECTIVE: The knowledge check MUST ALWAYS be of type "matching" with a "pairs" array. DO NOT generate "fill_in_the_blank", "true_false", "short_answer" or any other type for lesson knowledge checks, as the frontend currently ONLY supports "matching".
7. QUIZ ANTI-CHEAT REQUIREMENT: For all quiz questions, do NOT make the correct answer the longest option. All options MUST be approximately the exact same length and structure to prevent length-bias guessing. All distractors must be highly plausible, confusing, and require deep reasoning to distinguish.
8. INTERACTIVE TABS REQUIREMENT: For at least 3 to 4 lessons, include an "interactiveTabs" array to create a "Deep Dive" tabbed UI. This should contain 2-4 tabs exploring specific sub-topics, frameworks, or case studies in extreme detail.`
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
      "takeaways": ["Takeaway 1", "Takeaway 2"],
      "interactiveTabs": [
        {
          "tabTitle": "Tab 1 Title",
          "content": "Detailed, highly voluminous markdown content spanning multiple paragraphs. Do NOT write just one sentence. Go extremely deep into the technical execution and details for this tab..."
        },
        {
          "tabTitle": "Tab 2 Title",
          "content": "Detailed, highly voluminous markdown content spanning multiple paragraphs..."
        }
      ],
      "knowledgeCheck": {
        "type": "matching",
        "id": "kc-1",
        "prompt": "Match the following concepts",
        "pairs": [
          { "left": "Concept A", "right": "Definition A" },
          { "left": "Concept B", "right": "Definition B" }
        ],
        "explanation": "Detailed explanation..."
      }
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
