"use server"

import { adminAuth, adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

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
    
    // Fetch custom user profile from Firestore
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get()
    if (!userDoc.exists) return null

    const userData = userDoc.data()!
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
}

export async function updateUserDoc(uid: string, data: Partial<{ name: string, role: string, subsidiary: string, mustChangePassword: boolean }>) {
  await adminDb.collection("users").doc(uid).update(data)
}
