import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Fallback for build time or missing env vars
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
        credential: {
          getAccessToken: () => Promise.resolve({ access_token: 'mock', expires_in: 3600 })
        }
      });
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
      credential: {
        getAccessToken: () => Promise.resolve({ access_token: 'mock', expires_in: 3600 })
      }
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
