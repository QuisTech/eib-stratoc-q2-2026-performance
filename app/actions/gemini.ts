"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function generateCourseContentWithGemini(title: string, category: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") {
    return { error: "Unauthorized: Only the Super Admin can generate AI content." }
  }

  const apiKey = process.env.GEMINI_API_KEY
  const groqApiKey = process.env.GROQ_API_KEY
  if (!apiKey && !groqApiKey) {
    return { error: "Neither Gemini nor Groq API keys are configured." }
  }

  const prompt = `You are a corporate training expert for EIB Group. Generate a high-quality 5-lesson curriculum and a 10-question multiple choice quiz for a course titled "${title}" in the category of "${category}". Ensure the content is professional, actionable, and substantive. Do not use filler text. Each lesson must have sections and takeaways.`

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
    try {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // Fast and robust for JSON
          messages: [
            {
              role: "system",
              content: `You are a corporate training expert for EIB Group. You MUST return ONLY valid JSON matching this exact structure:
{
  "lessons": [{ "key": "string", "title": "string", "minutes": number, "summary": "string", "sections": [{ "heading": "string", "body": ["string"] }], "takeaways": ["string"] }],
  "quiz": [{ "id": "string", "prompt": "string", "options": ["string"], "correctIndex": number, "explanation": "string" }]
}`
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
        console.error("Groq API Error:", errText);
        return { error: `Gemini and Groq fallback both failed. Groq status: ${groqResponse.status}. Details: ${errText}` };
      }

      const data = await groqResponse.json();
      const textResponse = data.choices?.[0]?.message?.content;
      
      if (!textResponse) {
        return { error: "Invalid response format from Groq fallback API." };
      }
      
      return JSON.parse(textResponse)
    } catch (error: any) {
      console.error("Groq API Error:", error)
      return { error: `Gemini failed, and Groq fallback threw an error: ${error.message}` }
    }
  }

  return { error: "Failed to generate content: Gemini failed and Groq API key is missing." };
}
