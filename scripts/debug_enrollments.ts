import { adminDb } from "../lib/firebase-admin";
// @ts-ignore - Ignore module resolution typing error for this temporary script
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function check() {
  const { adminDb } = await import("../lib/firebase-admin");
  const snapshot = await adminDb.collection("enrollments").get();
  console.log("Total enrollments:", snapshot.size);
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`Doc ID: ${doc.id}`);
    console.log(`  userId: ${data.userId}`);
    console.log(`  courseId: ${data.courseId} (type: ${typeof data.courseId})`);
    console.log(`  status: ${data.status}`);
  });
}

check().catch(console.error);
