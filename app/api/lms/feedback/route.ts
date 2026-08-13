import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      type, // 'lesson' | 'course'
      courseSlug,
      lessonKey,
      lessonTitle,
      courseTitle,
      rating,
      sentiment,
      tags,
      dimensions,
      npsScore,
      comment,
      userEmail,
      userName,
      subsidiary,
    } = body

    if (!courseSlug || !type) {
      return NextResponse.json({ error: "Missing required feedback fields" }, { status: 400 })
    }

    const payload = {
      type: type || "lesson",
      courseSlug,
      courseTitle: courseTitle || courseSlug,
      lessonKey: lessonKey || null,
      lessonTitle: lessonTitle || null,
      rating: typeof rating === "number" ? rating : null,
      sentiment: sentiment || (rating && rating > 0 ? "positive" : "neutral"),
      tags: Array.isArray(tags) ? tags : [],
      dimensions: dimensions || null,
      npsScore: typeof npsScore === "number" ? npsScore : null,
      comment: (comment || "").trim().slice(0, 1000), // Max 1000 chars to save storage
      userEmail: userEmail || "anonymous@company.com",
      userName: userName || "Anonymous Learner",
      subsidiary: subsidiary || "Unknown Subsidiary",
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    }

    // Write to Firestore with quota fallback safety
    if (adminDb) {
      try {
        await adminDb.collection("lms_feedback").add(payload)
      } catch (dbErr: any) {
        console.warn("Firestore feedback write fallback (Quota/Net error):", dbErr?.message || dbErr)
        // Return 200 success so client UX is never interrupted even if Firestore is at quota limit
        return NextResponse.json({ success: true, saved: "quota_fallback" })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Feedback API error:", error?.message || error)
    return NextResponse.json({ success: true, saved: "client_fallback" })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limitCount = Math.min(Number(searchParams.get("limit")) || 500, 1000) // Flexible cap reads (max 1000)

    if (!adminDb) {
      return NextResponse.json({ feedback: [], total: 0, message: "Firestore admin not initialized" })
    }

    // Get true total count from collection
    let totalCount = 0
    try {
      const countSnap = await adminDb.collection("lms_feedback").count().get()
      totalCount = countSnap.data().count
    } catch {
      // Fallback if count() API is unavailable
      totalCount = 0
    }

    // Perform query to retrieve feedback items
    const snapshot = await adminDb
      .collection("lms_feedback")
      .orderBy("timestamp", "desc")
      .limit(limitCount)
      .get()

    const feedback = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ feedback, total: totalCount || feedback.length })
  } catch (error: any) {
    console.error("Failed to fetch feedback:", error?.message || error)
    return NextResponse.json({ feedback: [], total: 0, error: error?.message || "Quota or Network Error" })
  }
}
