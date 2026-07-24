import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(process.cwd(), "firebase-admin.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function main() {
  const snapshot = await db.collection("courses").where("slug", "==", "the-complete-drone-technology-masterclass").get();
  if (snapshot.empty) {
    console.error("Course not found!");
    process.exit(1);
  }

  const courseData = snapshot.docs[0].data();
  const customContent = JSON.parse(courseData.customContent);

  console.log("Course Lessons:");
  customContent.lessons.forEach((l: any, i: number) => {
    console.log(`${i + 1}. ${l.title}`);
  });
  
  console.log("\nCourse Title:", courseData.title);
  console.log("Description:", courseData.description);
  
  process.exit(0);
}

main().catch(console.error);
