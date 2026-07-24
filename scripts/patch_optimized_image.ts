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
  const newImageUrl = "https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/the-complete-drone-technology-masterclass/cover-optimized.jpg";

  const snapshot = await db.collection("courses").where("slug", "==", "advanced-drone-engineering-technology-masterclass").get();
  if (snapshot.empty) {
    console.error("Course not found!");
    process.exit(1);
  }

  const docRef = snapshot.docs[0].ref;

  await docRef.update({
    imageUrl: newImageUrl,
    updatedAt: new Date()
  });

  console.log(`✅ Firestore updated with new optimized imageUrl!`);

  // Update static-lms-courses.ts
  const staticPath = path.join(process.cwd(), "lib", "static-lms-courses.ts");
  let staticContent = fs.readFileSync(staticPath, "utf8");

  const slugPattern = `"slug": "advanced-drone-engineering-technology-masterclass"`;
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
    
    // Replace imageUrl
    const imgMatch = courseBlock.match(/"imageUrl":\s*"[^"]+"/);
    let newBlock = courseBlock;
    if (imgMatch) {
      newBlock = newBlock.replace(imgMatch[0], `"imageUrl": ${JSON.stringify(newImageUrl)}`);
    } else {
      // If it somehow doesn't exist, append it before the last brace
      newBlock = newBlock.replace(/}\s*$/, `,\n  "imageUrl": ${JSON.stringify(newImageUrl)}\n}`);
    }

    staticContent = staticContent.replace(courseBlock, newBlock);
    fs.writeFileSync(staticPath, staticContent);
    console.log("✅ static-lms-courses.ts updated!");
  } else {
    console.log("Slug not found in static-lms-courses.ts!");
  }

  process.exit(0);
}

main().catch(console.error);
