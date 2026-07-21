import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      let pk = process.env.FIREBASE_PRIVATE_KEY;
      pk = pk.replace(/^\"|\"/g, ''); // Remove wrapping quotes if any
      pk = pk.replace(/\\\\n/g, '\n'); // Replace literal \n with actual newlines
      
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
// Firestore Query Deduplication & Caching Layer
// ============================================================================
// Prevents N+1 query patterns and quota exhaustion by:
// 1. Deduplicating concurrent identical requests (Promise-based)
// 2. Caching query results with per-query TTL
// 3. Batching common patterns (e.g., user-scoped queries)

type CacheEntry<T> = {
  data: T | null;
  expires: number;
};

type PendingRequest<T> = {
  promise: Promise<T>;
  startTime: number;
};

const resultCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, PendingRequest<any>>();

const DEFAULT_CACHE_TTL_MS = 5000; // 5 seconds for request deduplication
const USER_QUERY_TTL_MS = 5000; // 5 seconds for user-scoped queries (prevents stale reads across distributed workers)
const COLLECTION_QUERY_TTL_MS = 15000; // 15 seconds for full collection queries
const DEBUG_FIRESTORE_CACHE = process.env.FIRESTORE_CACHE_DEBUG === "true";

// Cache statistics for debugging
const cacheStats = {
  hits: 0,
  misses: 0,
  pending: 0,
  errors: 0,
};

/**
 * Get current cache statistics
 */
export function getCacheStats() {
  return { ...cacheStats };
}

/**
 * Clear cache and stats for testing
 */
export function clearAllCaches() {
  resultCache.clear();
  pendingRequests.clear();
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  cacheStats.pending = 0;
  cacheStats.errors = 0;
}

function deleteCacheKey(key: string) {
  resultCache.delete(key);
  pendingRequests.delete(key);
}

export function invalidateUserCourseCaches(userId: string, courseId?: number) {
  deleteCacheKey(`enrollments:${userId}`);
  deleteCacheKey(`quizAttempts:${userId}`);
  deleteCacheKey(`lessonProgress:${userId}`);
  deleteCacheKey(`certificates:${userId}`);

  if (courseId != null) {
    deleteCacheKey(`quizAttempts:${userId}:${courseId}`);
    deleteCacheKey(`lessonProgress:${userId}:${courseId}`);
    deleteCacheKey(`certificates:${userId}:${courseId}`);
  }
}

function logCacheDebug(message: string) {
  if (DEBUG_FIRESTORE_CACHE) console.debug(message);
}

/**
 * Deduplicate concurrent requests: if 100 requests ask for the same thing,
 * only 1 Firestore read happens. The other 99 await the same Promise.
 */
async function deduplicatedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): Promise<T | null> {
  const now = Date.now();

  // 1. Check if result is cached and not expired
  const cached = resultCache.get(key);
  if (cached && cached.expires > now) {
    cacheStats.hits++;
    logCacheDebug(`[Cache HIT] ${key}`);
    return cached.data;
  }

  // 2. Check if request is already pending
  const pending = pendingRequests.get(key);
  if (pending) {
    cacheStats.pending++;
    logCacheDebug(`[Cache PENDING] ${key} - awaiting in-flight request`);
    try {
      const result = await pending.promise;
      return result;
    } catch (error) {
      console.error(`[Cache ERROR] ${key}:`, error);
      cacheStats.errors++;
      throw error;
    }
  }

  // 3. No cache, no pending request: fetch and cache
  cacheStats.misses++;
  logCacheDebug(`[Cache MISS] ${key} - fetching from Firestore`);

  const promise = (async () => {
    try {
      const data = await fetcher();
      // Cache the result
      resultCache.set(key, {
        data,
        expires: now + ttlMs,
      });
      return data;
    } finally {
      // Remove from pending
      pendingRequests.delete(key);
    }
  })();

  // Register as pending
  pendingRequests.set(key, { promise, startTime: now });

  try {
    return await promise;
  } catch (error) {
    cacheStats.errors++;
    throw error;
  }
}

// ============================================================================
// User-scoped query caching helpers
// ============================================================================

export async function getEnrollmentsByUser(userId: string): Promise<any[]> {
  return deduplicatedQuery(
    `enrollments:${userId}`,
    async () => {
      const snap = await adminDb.collection('enrollments').where('userId', '==', userId).get();
      return snap.docs.map((d: any) => d.data());
    },
    USER_QUERY_TTL_MS
  );
}

export async function getQuizAttemptsByUser(userId: string, courseId?: number): Promise<any[]> {
  const key = courseId ? `quizAttempts:${userId}:${courseId}` : `quizAttempts:${userId}`;
  return deduplicatedQuery(
    key,
    async () => {
      let query: any = adminDb.collection('quizAttempts').where('userId', '==', userId);
      if (courseId) query = query.where('courseId', '==', courseId);
      const snap = await query.get();
      return snap.docs.map((d: any) => d.data());
    },
    USER_QUERY_TTL_MS
  );
}

export async function getLessonProgressByUser(userId: string, courseId?: number): Promise<any[]> {
  const key = courseId ? `lessonProgress:${userId}:${courseId}` : `lessonProgress:${userId}`;
  return deduplicatedQuery(
    key,
    async () => {
      let query: any = adminDb.collection('lessonProgress').where('userId', '==', userId);
      if (courseId) query = query.where('courseId', '==', courseId);
      const snap = await query.get();
      return snap.docs.map((d: any) => d.data());
    },
    USER_QUERY_TTL_MS
  );
}

export async function getCertificatesByUser(userId: string, courseId?: number): Promise<any[]> {
  const key = courseId ? `certificates:${userId}:${courseId}` : `certificates:${userId}`;
  return deduplicatedQuery(
    key,
    async () => {
      let query: any = adminDb.collection('certificates').where('userId', '==', userId);
      if (courseId) query = query.where('courseId', '==', courseId);
      const snap = await query.get();
      return snap.docs.map((d: any) => d.data());
    },
    USER_QUERY_TTL_MS
  );
}

export async function getUserById(userId: string): Promise<any | null> {
  return deduplicatedQuery(
    `user:${userId}`,
    async () => {
      const doc = await adminDb.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    },
    USER_QUERY_TTL_MS
  );
}

export async function getAllUsers(): Promise<any[]> {
  return deduplicatedQuery(
    'users:all',
    async () => {
      const snap = await adminDb.collection('users').get();
      return snap.docs.map((d: any) => d.data());
    },
    COLLECTION_QUERY_TTL_MS
  );
}

export async function getAllEnrollments(): Promise<any[]> {
  return deduplicatedQuery(
    'enrollments:all',
    async () => {
      const snap = await adminDb.collection('enrollments').get();
      return snap.docs.map((d: any) => d.data());
    },
    COLLECTION_QUERY_TTL_MS
  );
}

export async function getAllCertificates(): Promise<any[]> {
  return deduplicatedQuery(
    'certificates:all',
    async () => {
      const snap = await adminDb.collection('certificates').get();
      return snap.docs.map((d: any) => d.data());
    },
    COLLECTION_QUERY_TTL_MS
  );
}

export async function getCoursesByAuthor(authorId: string): Promise<any[]> {
  return deduplicatedQuery(
    `courses:author:${authorId}`,
    async () => {
      const snap = await adminDb.collection('courses').where('authorId', '==', authorId).get();
      return snap.docs.map((d: any) => d.data());
    },
    USER_QUERY_TTL_MS
  );
}

// ============================================================================
// Cleanup on process exit
// ============================================================================

process.on('SIGTERM', () => {
  clearAllCaches();
});

process.on('SIGINT', () => {
  clearAllCaches();
});
