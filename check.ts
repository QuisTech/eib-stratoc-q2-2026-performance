import { adminDb } from './lib/firebase-admin';

async function run() {
  const snap = await adminDb.collection('courses').where('slug', '==', 'financial-management-budgeting').get();
  console.log(JSON.stringify(snap.docs[0].data(), null, 2));
  process.exit(0);
}
run();
