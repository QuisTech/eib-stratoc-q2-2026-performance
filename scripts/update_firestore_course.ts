import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { STATIC_LMS_COURSE_DATA } from '../lib/static-lms-courses';
import path from 'path';

// Load the service account key JSON file
const serviceAccount = require('../firebase-admin.json');

initializeApp({
  credential: cert(serviceAccount)
});

const adminDb = getFirestore();

async function main() {
  const slug = 'advanced-digital-intelligence-operations-manual';
  
  // 1. Find the local static course data
  const staticCourse = STATIC_LMS_COURSE_DATA.find(c => c.slug === slug);
  if (!staticCourse) {
    throw new Error('Course not found in STATIC_LMS_COURSE_DATA');
  }

  console.log(`Found static course: ${staticCourse.title} (ID: ${staticCourse.id})`);

  // 2. Fetch the current course from Firestore
  const snapshot = await adminDb.collection("courses").where("slug", "==", slug).limit(1).get();
  
  if (snapshot.empty) {
    console.log('Course not found in Firestore. Creating...');
    await adminDb.collection("courses").doc(String(staticCourse.id)).set(staticCourse);
    console.log('Created successfully.');
  } else {
    const docId = snapshot.docs[0].id;
    console.log(`Found course in Firestore with ID: ${docId}. Updating customContent...`);
    
    const updateData: any = {
      customContent: staticCourse.customContent
    };
    if (staticCourse.imageUrl !== undefined) {
      updateData.imageUrl = staticCourse.imageUrl;
    }
    await adminDb.collection("courses").doc(docId).update(updateData);
    
    console.log('Updated successfully.');
  }

  process.exit(0);
}

main().catch(console.error);
