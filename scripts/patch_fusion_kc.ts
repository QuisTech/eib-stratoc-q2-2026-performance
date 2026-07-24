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
    if (lesson.knowledgeCheck && lesson.knowledgeCheck.type === "fill_in_the_blank" && !lesson.knowledgeCheck.options) {
      console.log(`Patching fill_in_the_blank for lesson ${lesson.key}`);
      lesson.knowledgeCheck.options = [
        lesson.knowledgeCheck.answer,
        "developing predictive models",
        "managing public relations",
        "conducting regular vulnerability assessments"
      ];
      patched = true;
    }
    return lesson;
  });

  if (patched) {
    await docRef.update({
      customContent: JSON.stringify(customContent),
      updatedAt: new Date()
    });
    console.log(`✅ Firestore updated with patched knowledge checks!`);
  } else {
    console.log(`No knowledge checks needed patching.`);
  }

  process.exit(0);
}

main().catch(console.error);
