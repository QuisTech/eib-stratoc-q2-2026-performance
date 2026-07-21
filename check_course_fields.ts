import { adminDb } from './lib/firebase-admin';

async function test() {
  const snap = await adminDb.collection('courses').get();
  for (const doc of snap.docs) {
    const data = doc.data();
    for (const key of ['title', 'description', 'category', 'level', 'initiative']) {
      if (data[key] !== null && data[key] !== undefined && typeof data[key] === 'object') {
        console.log(`FOUND OBJECT IN COURSE ${doc.id} FIELD ${key}:`, data[key]);
      }
    }
  }
  console.log("Course field check complete.");
}
test();
