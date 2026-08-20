import { getSessionUser } from "@/app/actions/auth"
import { headers } from "next/headers"
import { isStrictSuperAdmin } from "@/lib/access-control"
import { generateObject } from "ai"
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
  const user = await getSessionUser()
  if (!user || !isStrictSuperAdmin(user)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized. AI course authoring and refinement is restricted to authorized Super Admins only." }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const rawKeys = process.env.GROQ_API_KEY
  if (!rawKeys) {
    return new Response(JSON.stringify({ error: "API_KEY_MISSING", details: "No Groq API Key is configured in Vercel Environment Variables." }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }

  // Support multiple API keys separated by commas for rate limit rotation
  const keyList = rawKeys.split(",").map(k => k.trim()).filter(Boolean)


  let {
    title,
    category,
    customContext,
    existingLessons,
    existingQuiz,
    action,
    lessonTitle,
    sectionHeading,
    sectionBody,
    lessonSummary,
    feedbackComment,
  } = await req.json()

  // Token Safety: Ensure all data payloads passed into prompts continue to be trimmed/capped appropriately to avoid token context overflow
  title = title ? String(title).substring(0, 300) : title;
  category = category ? String(category).substring(0, 300) : category;
  lessonTitle = lessonTitle ? String(lessonTitle).substring(0, 300) : lessonTitle;
  sectionHeading = sectionHeading ? String(sectionHeading).substring(0, 300) : sectionHeading;
  lessonSummary = lessonSummary ? String(lessonSummary).substring(0, 1000) : lessonSummary;
  
  if (Array.isArray(sectionBody)) {
    sectionBody = sectionBody.map(s => String(s).substring(0, 2000));
  } else if (sectionBody) {
    sectionBody = String(sectionBody).substring(0, 8000);
  }
  
  if (Array.isArray(existingLessons)) {
    existingLessons = existingLessons.slice(-8); // Limit to last 8 lessons
  }
  if (Array.isArray(existingQuiz)) {
    existingQuiz = existingQuiz.slice(-20); // Limit to last 20 quiz questions
  }

  const isAppendMode = action === "append_lesson" || (existingLessons && existingLessons.length > 0 && !action)
  const isAppendQuizMode = action === "append_quiz"
  const isRefineSectionMode = action === "refine_section"
  const isGenerateTabMode = action === "generate_tab"
  const isGenerateKnowledgeCheckMode = action === "generate_knowledge_check"
  const isGenerateTakeawaysMode = action === "generate_takeaways"

  const customInstructions = (customContext || feedbackComment)?.trim()
    ? `\n\nADDITIONAL INSTRUCTIONS / STAFF FEEDBACK:\n${(customContext || feedbackComment).trim().substring(0, 3000)}`
    : ""

  let prompt = ""

  if (isRefineSectionMode) {
    const currentBodyText = Array.isArray(sectionBody) ? sectionBody.join("\n\n") : (sectionBody || "")
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert improving a specific curriculum section for the Nigerian conglomerate described above.
Course Title: "${title}" (${category || "General"})
Lesson: "${lessonTitle || "Lesson"}"
Current Section Heading: "${sectionHeading || "Section"}"

Current Section Content:
${currentBodyText || "No content currently."}
${customInstructions}

Your task: Surgically rewrite and elevate ONLY this specific section.
Requirements:
1. Deliver exceptionally rich, substantive, expert-level, actionable corporate educational content.
2. Directly address any staff feedback, clarity requests, or specific directives provided above.
3. Keep Nigerian Naira (₦) for currency references if applicable, and refer to the company generically as "the organization" or "the company".
4. Do NOT mention European Investment Bank or EU institutions.
5. Return JSON with the revised "heading" and "body" (an array of strings, where each string is a paragraph).

Output ONLY valid JSON with this exact structure:
{
  "heading": "Refined Section Heading",
  "body": [
    "Paragraph 1 with detailed explanations...",
    "Paragraph 2 with actionable methodology...",
    "Paragraph 3 with operational considerations..."
  ]
}`
  } else if (isGenerateTabMode) {
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating an interactive deep-dive tab / case study for a lesson in the Nigerian corporate context.
Course Title: "${title}" (${category || "General"})
Lesson Title: "${lessonTitle || "Lesson"}"
${customInstructions}

Your task: Generate ONE comprehensive, highly detailed interactive tab (e.g. In-Depth Case Study, Step-by-Step Implementation Framework, or Practical Checklist).
Requirements:
1. Write in rich markdown: use subheadings (e.g. ### Background & Context, ### Operational Execution, ### Lessons Learned & Risk Controls) and bullet points (•).
2. Make it deeply educational, highly granular, and directly applicable.
3. Return JSON with "tabTitle" (short, punchy title) and "content" (voluminous markdown text spanning multiple paragraphs and subsections).

Output ONLY valid JSON with this exact structure:
{
  "tabTitle": "Case Study: Practical Operational Execution",
  "content": "### Background & Context\\n\\nDetailed context and organizational challenges...\\n\\n### Operational Execution\\n\\nStep-by-step implementation strategy...\\n\\n### Key Takeaways\\n\\n• Strategic outcome 1\\n• Operational control 2"
}`
  } else if (isGenerateTakeawaysMode) {
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating key takeaways for a lesson.
Course Title: "${title}" (${category || "General"})
Lesson Title: "${lessonTitle || "Lesson"}"
Lesson Summary: "${lessonSummary || ""}"
${customInstructions}

Your task: Generate 3 to 5 extremely crisp, actionable, high-level key takeaways for this lesson.
Requirements:
1. Each takeaway must be a single sentence or a very brief paragraph.
2. Focus on the core strategic and operational insights.
3. Return JSON with a "takeaways" array of strings.

Output ONLY valid JSON with this exact structure:
{
  "takeaways": [
    "First crucial insight and application.",
    "Second operational takeaway.",
    "Third strategic principle."
  ]
}`
  } else if (isGenerateKnowledgeCheckMode) {
    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating an interactive matching knowledge check for a lesson.
Course Title: "${title}" (${category || "General"})
Lesson Title: "${lessonTitle || "Lesson"}"
Lesson Summary: "${lessonSummary || ""}"
${customInstructions}

Your task: Generate ONE interactive matching exercise (type: "matching") specifically testing genuine understanding of the concepts in this lesson.
Requirements:
1. Provide a clear prompt asking learners to match the concepts with their corresponding applications or definitions.
2. Provide exactly 3 or 4 pairs with "left" (concept/term) and "right" (definition/application).
3. Include a comprehensive explanation.
4. Return JSON matching the structure below.

Output ONLY valid JSON with this exact structure:
{
  "knowledgeCheck": {
    "type": "matching",
    "id": "kc-${Date.now()}",
    "prompt": "Match each operational concept with its correct organizational application:",
    "pairs": [
      { "left": "Concept A", "right": "Application A" },
      { "left": "Concept B", "right": "Application B" },
      { "left": "Concept C", "right": "Application C" }
    ],
    "explanation": "Detailed explanation of why these matches are correct."
  }
}`
  } else if (isAppendQuizMode) {
    const existingCount = existingQuiz?.length || 0
    const existingLessonContext = existingLessons && existingLessons.length > 0 
      ? `The course currently has the following lessons:\n` + existingLessons.map((l: any) => `- ${l.title}: ${l.summary || 'No summary'}\n  Key Takeaways: ${l.takeaways?.join(', ') || 'None'}`).join("\n") 
      : "The course currently has no lessons."
    const existingQuizContext = existingQuiz && existingQuiz.length > 0
      ? `The course also currently has the following quiz questions:\n` + existingQuiz.map((q: any) => `- ${q.prompt}`).join("\n")
      : ""

    prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for the Nigerian conglomerate described above.
The course is titled "${title}" in the category of "${category}".

The admin already has ${existingCount} quiz questions and wants to expand their Item Pool.
${existingLessonContext}
${existingQuizContext}

Your task is to generate EXACTLY 10 NEW highly detailed, challenging multiple-choice questions for the course. 
EXTREME DIRECTIVE: The questions MUST STRICTLY AND ONLY test the actual subject matter and concepts taught in the existing lessons provided above. 
Do NOT generate questions about general business strategy, ROI, Nigerian regulations, corporate integration, or facility surveillance unless explicitly mentioned in the lesson summaries. 
If the lessons are about technical engineering (e.g. aerodynamics, PID control, sensors), your questions MUST be about technical engineering.
Ensure they test genuine understanding and are completely unique from standard trivia.

Requirements:
- Generate exactly 10 questions inside the "quiz" array. 
- Do NOT generate any lessons.
- CRITICAL ANTI-DUPLICATION: You MUST review the existing quiz questions above. Your new questions MUST NOT cover the same specific concepts or use similar wording as the existing questions. You must find new angles or different aspects of the lessons to test.
- Include a detailed explanation for every question.
- CRITICAL ANTI-CHEAT REQUIREMENT: Do NOT make the correct answer the longest option. All options (A, B, C, D) MUST be approximately the exact same length and structure to prevent length-bias guessing.
- DISTRACTOR QUALITY: All wrong options must be highly plausible, convincing, and confusing distractors that require deep conceptual understanding to distinguish. Do not use obvious throwaway answers.
- The correct answer must require intelligent reasoning, not just recalling a basic definition.
- All content must be relevant to the Nigerian corporate context.
- CRITICAL: Do NOT use any subsidiary names. Use generic terms like "the organization".
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}

Output ONLY valid JSON with this exact structure:
{
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
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}

Output ONLY valid JSON with this exact structure:
{
  "lessons": [
    {
      "key": "lesson-new-id",
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
          "content": "Detailed content..."
        }
      ]
    }
  ]
}`
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
8. INTERACTIVE TABS & CASE STUDY REQUIREMENT: For EVERY lesson, include an "interactiveTabs" array to create a "Deep Dive" tabbed UI with 4 to 5 voluminous tabs.
   - At least 1 tab per lesson MUST be an in-depth Real-World International Case Study with background context, operational execution, and key lessons learned.
   - Use double-spaced paragraphs (\n\n), bullet points (•), and subheadings (e.g. BACKGROUND:, OUTCOMES:) so the UI renders clean, structured, non-overlapping typography.

Output ONLY valid JSON with this exact structure:
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
  }

  try {
    let result;

    const callGenerate = async (modelName: string) => {
      const startIndex = Math.floor(Math.random() * keyList.length)
      let lastError: any = null

      for (let i = 0; i < keyList.length; i++) {
        const apiKey = keyList[(startIndex + i) % keyList.length]
        const groq = createGroq({ apiKey })
        try {
          return await generateObject({
            model: groq(modelName),
            prompt,
            temperature: 0.3,
            output: 'no-schema',
          })
        } catch (err: any) {
          lastError = err
          console.warn(`Groq API key candidate ${i + 1}/${keyList.length} failed for model ${modelName}:`, err?.message || err)
        }
      }
      throw lastError || new Error(`All Groq API keys failed for model ${modelName}`);
    };

    // Multi-Tier Fallback Cascade
    try {
      // Primary
      result = await callGenerate("openai/gpt-oss-120b");
    } catch (err1: any) {
      console.warn("Primary model (openai/gpt-oss-120b) failed, falling back to Catch 1", err1?.message || err1);
      try {
        // Catch 1 (Fallback)
        result = await callGenerate("llama-3.3-70b-versatile");
      } catch (err2: any) {
        console.warn("Catch 1 (llama-3.3-70b-versatile) failed, falling back to Catch 2", err2?.message || err2);
        // Catch 2 (Lightweight Fallback)
        result = await callGenerate("llama-3.1-8b-instant");
      }
    }

    if (!result) {
      throw new Error("All Groq fallback models failed to return a response.");
    }

    return new Response(JSON.stringify(result.object), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error("AI Generation Error:", err)
    return new Response(JSON.stringify({ error: err.message || "Failed to generate course content." }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
