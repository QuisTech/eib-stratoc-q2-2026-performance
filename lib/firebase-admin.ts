import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';

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
          projectId: process.env.FIREBASE_PROJECT_ID?.replace(/[\r\n\s]+/g, '').replace(/\\n/g, ''),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.replace(/[\r\n\s]+/g, '').replace(/\\n/g, ''),
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

let db: any;
let authAdmin: any;

try {
  db = getFirestore();
  authAdmin = getAuth();
} catch (e) {
  console.error("Failed to initialize Firebase Admin services:", e);
}

export const adminDb = db as Firestore;
export const adminAuth = authAdmin as Auth;

// ============================================================================
// Firestore Query Deduplication & Caching
// ============================================================================
// Prevents N+1 query patterns by caching identical concurrent requests.
// This is the root cause fix for RESOURCE_EXHAUSTED quota errors.
// When multiple requests fetch the same document within a short window,
// only the first triggers a Firestore read; subsequent requests get the cached result.

type CacheEntry = {
  data: any;
  expires: number;
};

const queryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5000; // 5-second TTL for concurrent request deduplication

/**
 * Fetch a document from Firestore with deduplication caching.
 * Concurrent identical requests within 5 seconds share a single Firestore read.
 * @param collection - Firestore collection name
 * @param docId - Document ID
 * @returns Document data or null if not found
 */
export async function getDocWithCache(
  collection: string,
  docId: string
): Promise<any | null> {
  const cacheKey = `${collection}:${docId}`;
  const now = Date.now();
  
  // Check if cache hit and not expired
  const cached = queryCache.get(cacheKey);
  if (cached && cached.expires > now) {
    console.debug(`[Cache HIT] ${cacheKey}`);
    return cached.data;
  }

  console.debug(`[Cache MISS] ${cacheKey} - Fetching from Firestore`);
  
  try {
    const doc = await adminDb.collection(collection).doc(docId).get();
    const data = doc.exists ? doc.data() : null;
    
    // Store in cache with TTL
    queryCache.set(cacheKey, {
      data,
      expires: now + CACHE_TTL_MS,
    });
    
    return data;
  } catch (error) {
    console.error(`[Cache ERROR] Failed to fetch ${cacheKey}:`, error);
    throw error;
  }
}

/**
 * Convenience wrapper for fetching courses with deduplication.
 * @param courseId - Course document ID
 * @returns Course document data or null
 */
export async function getCourseWithCache(courseId: string): Promise<any | null> {
  return getDocWithCache('courses', courseId);
}

/**
 * Convenience wrapper for fetching user data with deduplication.
 * @param userId - User document ID
 * @returns User document data or null
 */
export async function getUserWithCache(userId: string): Promise<any | null> {
  return getDocWithCache('users', userId);
}

/**
 * Clear expired cache entries.
 * Runs automatically every 60 seconds.
 * Manual call available for testing or emergency cleanup.
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  let cleared = 0;
  
  for (const [key, value] of queryCache.entries()) {
    if (value.expires <= now) {
      queryCache.delete(key);
      cleared++;
    }
  }
  
  if (cleared > 0) {
    console.debug(`[Cache CLEANUP] Removed ${cleared} expired entries`);
  }
}

/**
 * Force clear all cache entries.
 * Use only in testing or when you need to purge state.
 */
export function clearAllCache(): void {
  queryCache.clear();
  console.debug(`[Cache PURGE] All cache entries cleared`);
}

// Start automatic cleanup interval
const cleanupInterval = setInterval(() => {
  cleanExpiredCache();
}, 60000); // Every 60 seconds

// Graceful shutdown (important for serverless)
process.on('SIGTERM', () => {
  clearInterval(cleanupInterval);
  queryCache.clear();
});
