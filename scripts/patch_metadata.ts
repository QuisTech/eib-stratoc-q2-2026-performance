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
  const newTitle = "Advanced Drone Engineering & Technology Masterclass";
  const newDescription = "Master the aerospace engineering, aerodynamics, and control systems behind modern drone technology. Dive deep into PID/MPC flight algorithms, avionics integration, sensor data fusion (LiDAR/Photogrammetry), advanced power propulsion, and autonomous navigation architectures in this highly technical, industrial-standard masterclass.";

  const snapshot = await db.collection("courses").where("slug", "==", "the-complete-drone-technology-masterclass").get();
  if (snapshot.empty) {
    console.error("Course not found!");
    process.exit(1);
  }

  const docRef = snapshot.docs[0].ref;

  await docRef.update({
    title: newTitle,
    description: newDescription,
    updatedAt: new Date()
  });

  console.log(`✅ Firestore updated with new title and description!`);

  // Update static-lms-courses.ts
  const staticPath = path.join(process.cwd(), "lib", "static-lms-courses.ts");
  let staticContent = fs.readFileSync(staticPath, "utf8");

  const slugPattern = `"slug": "the-complete-drone-technology-masterclass"`;
  const slugIndex = staticContent.indexOf(slugPattern);
  
  if (slugIndex !== -1) {
    let courseStart = slugIndex;
    while (courseStart > 0 && staticContent[courseStart] !== '{') courseStart--;
    
    let courseEnd = courseStart;
    let braceCount = 0;
    for (let i = courseStart; i < staticContent.length; i++) {
      if (staticContent[i] === '{') braceCount++;
      if (staticContent[i] === '}') braceCount--;
      if (braceCount === 0) {
        courseEnd = i;
        break;
      }
    }
    
    const courseBlock = staticContent.substring(courseStart, courseEnd + 1);
    
    // Replace Title
    const titleMatch = courseBlock.match(/"title":\s*"[^"]+"/);
    let newBlock = courseBlock;
    if (titleMatch) {
      newBlock = newBlock.replace(titleMatch[0], `"title": ${JSON.stringify(newTitle)}`);
    }

    // Replace Description
    const descMatch = courseBlock.match(/"description":\s*"((?:[^"\\]|\\.)*)"/);
    if (descMatch) {
      newBlock = newBlock.replace(descMatch[0], `"description": ${JSON.stringify(newDescription)}`);
    }

    staticContent = staticContent.replace(courseBlock, newBlock);
    fs.writeFileSync(staticPath, staticContent);
    console.log("✅ static-lms-courses.ts updated!");
  }

  process.exit(0);
}

main().catch(console.error);
