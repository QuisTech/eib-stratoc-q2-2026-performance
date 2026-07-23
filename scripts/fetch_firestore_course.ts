import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(process.cwd(), "firebase-admin.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

async function fetchCourse() {
  const snapshot = await db.collection("courses").where("slug", "==", "the-complete-drone-technology-masterclass").get();
  
  if (snapshot.empty) {
    console.error("Course not found in Firestore.");
    process.exit(1);
  }

  const course = snapshot.docs[0].data();
  course._docId = snapshot.docs[0].id;
  
  fs.writeFileSync("course.json", JSON.stringify(course, null, 2));
  console.log("Course written to course.json successfully!");
  
  process.exit(0);
}

fetchCourse().catch(console.error);
