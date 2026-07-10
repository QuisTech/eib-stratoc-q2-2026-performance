"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// Hardcoded company profile so the AI never confuses EIB Group with the European Investment Bank
const EIB_GROUP_CONTEXT = `
CRITICAL CONTEXT — READ THIS FIRST:
EIB Group is a NIGERIAN private-sector conglomerate headquartered in Nigeria. It is NOT the European Investment Bank. Do NOT reference the EU, European Union, or any European institutions.

EIB Group is led by CEO/Chairman Bright Echefu and operates across multiple subsidiaries in Nigeria and West Africa:
- EIB Stratoc: Strategic operations consulting, corporate governance, and organizational development.
- DCI (Directorate of Clandestine & Intelligence): Intelligence analysis, counter-intelligence, security operations, and covert investigations. Sub-units include DCI-SAC, DCI-RAW, DCI-Intel, and DCI-PSAP.
- BLACK: Specialized clandestine operations and high-risk security services.
- BEF (Bright Echefu Foundation): Foundation for enterprise development, youth empowerment, and social investment.
- Bright FM: Media, radio broadcasting, and corporate communications.
- Luftreiber Automobile: Automotive services, fleet management, and vehicle logistics.
- Giga Forensics: Digital forensics, cyber investigations, and evidence analysis.
- POCTOVA: Financial technology, postal, and logistics services.
- Briech Atlantic: Real Estate company championing IOT in modren buildings.
- Briech UAS: Unmanned aerial systems (drones), surveillance, and aerial intelligence.

The company culture emphasizes operational excellence, security-first thinking, subsidiary compliance, and professional development of all staff. Training content should reflect African/Nigerian corporate environments, use Nigerian Naira (₦) for currency references, and be relevant to the specific subsidiary context when applicable.
`.trim()

export async function generateCourseContentWithGemini(title: string, category: string, customContext?: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized: Only the Super Admin can generate AI content." }
  }

  const apiKey = process.env.GEMINI_API_KEY
  const groqApiKey = process.env.GROQ_API_KEY
  if (!apiKey && !groqApiKey) {
    return { error: "Neither Gemini nor Groq API keys are configured." }
  }

  const customInstructions = customContext?.trim()
    ? `\n\nADDITIONAL INSTRUCTIONS FROM THE ADMIN:\n${customContext.trim()}`
    : ""

  const prompt = `${EIB_GROUP_CONTEXT}

You are a corporate training expert creating curriculum for EIB Group (the Nigerian conglomerate described above). Generate a high-quality curriculum (between 5 and 10 lessons depending on what is appropriate for the topic) and a 10-question multiple choice quiz for a course titled "${title}" in the category of "${category}".

Requirements:
- Content MUST be professional, actionable, and substantive. No filler text.
- Each lesson must have detailed sections with real, practical information.
- Each lesson must include key takeaways.
- Quiz questions must test genuine understanding, not trivial facts.
- All content must be relevant to EIB Group's Nigerian corporate context.
- Do NOT mention the European Investment Bank or the EU anywhere.${customInstructions}`

  const responseSchema = {
    type: "OBJECT",
    properties: {
      lessons: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            key: { type: "STRING", description: "A unique string key for the lesson, e.g. lesson-1-intro" },
            title: { type: "STRING", description: "Lesson title" },
            minutes: { type: "INTEGER", description: "Estimated minutes to complete" },
            summary: { type: "STRING", description: "Brief summary of the lesson" },
            sections: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  heading: { type: "STRING" },
                  body: {
                    type: "ARRAY",
                    items: { type: "STRING", description: "Paragraphs of text. Can use markdown." }
                  }
                },
                required: ["heading", "body"]
              }
            },
            takeaways: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: ["key", "title", "minutes", "summary", "sections", "takeaways"]
        }
      },
      quiz: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING", description: "A unique string ID for the question, e.g. q1" },
            prompt: { type: "STRING", description: "The quiz question" },
            options: {
              type: "ARRAY",
              items: { type: "STRING", description: "Multiple choice option text" }
            },
            correctIndex: { type: "INTEGER", description: "0-indexed integer of the correct option" },
            explanation: { type: "STRING", description: "Explanation of why the answer is correct" }
          },
          required: ["id", "prompt", "options", "correctIndex", "explanation"]
        }
      }
    },
    required: ["lessons", "quiz"]
  }

  // Attempt Gemini first if key exists
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (textResponse) {
          return JSON.parse(textResponse)
        }
      } else {
        console.warn("Gemini API REST Error:", await response.text());
      }
    } catch (error: any) {
      console.warn("Gemini API Failed, falling back...", error);
    }
  }

  // Fallback to Groq if Gemini failed or is unavailable
  if (groqApiKey) {
    const MODEL_TIERS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"] as const;
    const MAX_RETRIES = 2;
    let lastError = "";

    for (const model of MODEL_TIERS) {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`[Groq Fallback] Trying model=${model} attempt=${attempt}/${MAX_RETRIES}`);
          const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content: `${EIB_GROUP_CONTEXT}\n\nYou are a corporate training expert for EIB Group (the Nigerian conglomerate described above). You MUST return ONLY valid JSON matching this exact structure:\n{\n  "lessons": [{ "key": "string", "title": "string", "minutes": number, "summary": "string", "sections": [{ "heading": "string", "body": ["string"] }], "takeaways": ["string"] }],\n  "quiz": [{ "id": "string", "prompt": "string", "options": ["string"], "correctIndex": number, "explanation": "string" }]\n}\nGenerate between 5 and 10 lessons and 10 quiz questions. Do NOT mention the European Investment Bank or the EU.`
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              response_format: { type: "json_object" },
              temperature: 0.7
            })
          });

          if (!groqResponse.ok) {
            const errText = await groqResponse.text();
            lastError = errText;
            console.warn(`[Groq Fallback] Model ${model} attempt ${attempt} failed with status: ${groqResponse.status}. Details: ${errText}`);
            
            // Check if it's a rate limit or server error to decide on retry
            if (![429, 500, 502, 503].includes(groqResponse.status) && !errText.includes("rate limit")) {
              break; // Break retry loop if it's not a retryable error (e.g. 400 Bad Request)
            }
            
            // Backoff before retrying
            if (attempt < MAX_RETRIES) {
              await new Promise(res => setTimeout(res, 1000 * attempt));
            }
            continue;
          }

          const data = await groqResponse.json();
          const textResponse = data.choices?.[0]?.message?.content;

          if (!textResponse) {
            lastError = "Invalid response format from Groq fallback API (empty content).";
            continue;
          }

          console.log(`[Groq Fallback] ✓ Success on model=${model}`);
          return JSON.parse(textResponse);
        } catch (error: any) {
          lastError = error.message;
          console.warn(`[Groq Fallback] Error on model=${model} attempt=${attempt}: ${error.message}`);
          if (attempt < MAX_RETRIES) {
            await new Promise(res => setTimeout(res, 1000 * attempt));
          }
        }
      }
    }

    return { error: `Gemini failed, and all Groq fallback models were exhausted. Last Groq Error: ${lastError}` };
  }

  return { error: "Failed to generate content: Gemini failed and Groq API key is missing." };
}
