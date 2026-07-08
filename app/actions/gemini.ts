"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function generateCourseContentWithGemini(title: string, category: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Only the Super Admin can generate AI content.")
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.")
  }

  const prompt = `You are a corporate training expert for EIB Group. Generate a high-quality 5-lesson curriculum and a 5-question multiple choice quiz for a course titled "${title}" in the category of "${category}". Ensure the content is professional, actionable, and substantive. Do not use filler text. Each lesson must have sections and takeaways.`

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

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API REST Error:", errText);
      throw new Error(`Failed to communicate with Gemini API: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("Invalid response format from Gemini API.");
    }
    
    return JSON.parse(textResponse)
  } catch (error: any) {
    console.error("Gemini API Error:", error)
    throw new Error(error.message || "Failed to communicate with Gemini API.")
  }
}
