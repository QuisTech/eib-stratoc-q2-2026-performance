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
const slug = "welcome-to-comprehensive-fusion-centre-operations";

async function main() {
  const snapshot = await db.collection("courses").where("slug", "==", slug).get();
  if (snapshot.empty) {
    console.error("Course not found in Firestore!");
    process.exit(1);
  }

  const docRef = snapshot.docs[0].ref;
  const docData = snapshot.docs[0].data();

  let customContent;
  if (typeof docData.customContent === "string") {
    customContent = JSON.parse(docData.customContent);
  } else {
    customContent = docData.customContent;
  }

  let patched = false;

  customContent.lessons = customContent.lessons.map((lesson: any) => {
    if (lesson.knowledgeCheck && lesson.knowledgeCheck.type !== "matching") {
      console.log(`Converting ${lesson.knowledgeCheck.type} to matching for lesson ${lesson.key}`);
      
      if (lesson.key === "lesson-2-geospatial-intelligence") {
        lesson.knowledgeCheck = {
          type: "matching",
          id: lesson.knowledgeCheck.id,
          prompt: "Match the following concepts related to GEOINT",
          pairs: [
            { left: "GEOINT Application", right: "Used for threat analysis, mapping, and visualization" },
            { left: "GEOINT Tool", right: "Geographic Information Systems (GIS)" }
          ],
          explanation: lesson.knowledgeCheck.explanation
        };
        patched = true;
      } else if (lesson.key === "lesson-3-command-centre-operations") {
        lesson.knowledgeCheck = {
          type: "matching",
          id: lesson.knowledgeCheck.id,
          prompt: "Match the following components with their responsibilities",
          pairs: [
            { left: "Command Centre", right: "Monitoring, communicating, and responding to incidents" },
            { left: "Video Wall", right: "Displaying multiple sources of information" }
          ],
          explanation: lesson.knowledgeCheck.explanation
        };
        patched = true;
      } else if (lesson.key === "lesson-4-cybersecurity-fundamentals") {
        lesson.knowledgeCheck = {
          type: "matching",
          id: lesson.knowledgeCheck.id,
          prompt: "Match the cybersecurity concept to its definition",
          pairs: [
            { left: "Cybersecurity Goal", right: "Protect systems and sensitive information" },
            { left: "Vulnerability", right: "Weaknesses in systems that can be exploited" }
          ],
          explanation: lesson.knowledgeCheck.explanation
        };
        patched = true;
      } else {
        // Fallback for any other unexpected non-matching KCs
        lesson.knowledgeCheck = {
          type: "matching",
          id: lesson.knowledgeCheck.id,
          prompt: "Match the related concepts",
          pairs: [
            { left: "Concept A", right: "Definition A" },
            { left: "Concept B", right: "Definition B" }
          ],
          explanation: lesson.knowledgeCheck.explanation || "Review the lesson for more details."
        };
        patched = true;
      }
    }
    return lesson;
  });

  if (patched) {
    await docRef.update({
      customContent: JSON.stringify(customContent),
      updatedAt: new Date()
    });
    console.log(`✅ Firestore updated with converted matching knowledge checks!`);
  } else {
    console.log(`No knowledge checks needed patching.`);
  }

  process.exit(0);
}

main().catch(console.error);
