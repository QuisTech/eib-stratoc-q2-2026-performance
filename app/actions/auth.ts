"use server"

import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import { cookies } from "next/headers"
import { revalidateTag, unstable_cache } from "next/cache"

const SESSION_USER_PROFILE_CACHE_TAG = "session-user-profile"

function revalidateCacheTag(tag: string) {
  revalidateTag(tag, "max")
}

const getCachedSessionUserProfile = unstable_cache(
  async (uid: string) => {
    const userDoc = await adminDb.collection("users").doc(uid).get()
    return userDoc.exists ? userDoc.data() : null
  },
  ["session-user-profile-v1"],
  { tags: [SESSION_USER_PROFILE_CACHE_TAG], revalidate: 5 * 60 }
)

function isFirestoreQuotaError(error: unknown) {
  const err = error as { code?: string | number; message?: string; details?: string }
  const text = `${err?.message ?? ""} ${err?.details ?? ""}`
  return (
    err?.code === 8 ||
    err?.code === 4 ||
    err?.code === 14 ||
    err?.code === "resource-exhausted" ||
    err?.code === "deadline-exceeded" ||
    err?.code === "unavailable" ||
    text.includes("RESOURCE_EXHAUSTED") ||
    text.includes("DEADLINE_EXCEEDED") ||
    text.includes("UNAVAILABLE") ||
    text.includes("Quota exceeded") ||
    text.includes("fetch failed") ||
    text.includes("network-request-failed") ||
    text.includes("Too many requests") ||
    text.includes("timeout")
  )
}

function sessionUserFromClaims(decodedClaims: { uid: string; email?: string; name?: string }) {
  const email = decodedClaims.email ?? ""
  const fallbackName = decodedClaims.name || email.split("@")[0] || "Learner"

  return {
    id: decodedClaims.uid,
    name: fallbackName,
    email,
    role: checkIsSuperAdmin(email) ? "admin" : "learner",
    subsidiary: null,
    isProfileFallback: true,
  }
}

export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 7 * 1000 // 1 week
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })
    ;(await cookies()).set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error creating session cookie", error)
    throw new Error("Invalid token")
  }
}

export async function clearSessionCookie() {
  ;(await cookies()).delete("session")
}

export async function getSessionUser() {
  const sessionCookie = (await cookies()).get("session")?.value
  if (!sessionCookie) return null

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)

    let userData = null
    try {
      userData = await getCachedSessionUserProfile(decodedClaims.uid)
    } catch (error) {
      console.error("Firestore error while loading session profile; using auth claims fallback.", error)
      return sessionUserFromClaims(decodedClaims)
    }

    if (!userData) return sessionUserFromClaims(decodedClaims)

    return {
      id: decodedClaims.uid,
      name: userData.name,
      email: decodedClaims.email!,
      role: userData.role,
      subsidiary: userData.subsidiary,
    }
  } catch (error) {
    return null
  }
}

export async function createUserProfile(uid: string, data: { name: string, email: string, role: string, subsidiary: string }) {
  await adminDb.collection("users").doc(uid).set({
    id: uid,
    name: data.name,
    email: data.email,
    role: data.role,
    subsidiary: data.subsidiary,
    createdAt: new Date(),
  })
  revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
}

export async function updateUserDoc(uid: string, data: Partial<{ name: string, role: string, subsidiary: string, mustChangePassword: boolean }>) {
  await adminDb.collection("users").doc(uid).update(data)
  revalidateCacheTag(SESSION_USER_PROFILE_CACHE_TAG)
}
