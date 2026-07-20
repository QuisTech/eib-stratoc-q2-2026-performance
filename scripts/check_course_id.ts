import { adminDb } from "../lib/firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function getCourseId() {
  const { adminDb } = await import("../lib/firebase-admin");
  const snapshot = await adminDb.collection("courses").where("title", "==", "Financial Management & Budgeting").get();
  
  if (snapshot.empty) {
    console.log("Course not found in Firestore!");
  } else {
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`Course in Firestore: ID=${doc.id}, data.id=${data.id}`);
    });
  }

  // Let's also check static courses just in case
  const { staticCourses } = await import("../lib/static-lms-courses");
  const staticCourse = staticCourses.find(c => c.title === "Financial Management & Budgeting");
  if (staticCourse) {
    console.log(`Course in static list: ID=${staticCourse.id}`);
  }
}

getCourseId().catch(console.error);
