import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      let pk = process.env.FIREBASE_PRIVATE_KEY;
      pk = pk.replace(/^"|"$/g, ''); // Remove wrapping quotes if any
      pk = pk.replace(/\\n/g, '\n'); // Replace literal \n with actual newlines
      
      // If Vercel stripped the newlines and replaced them with spaces
      if (!pk.includes('\n') && pk.includes('-----BEGIN PRIVATE KEY-----')) {
        const body = pk.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/ /g, '');
        const chunks = body.match(/.{1,64}/g) || [];
        pk = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;
      }
      
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: pk,
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
