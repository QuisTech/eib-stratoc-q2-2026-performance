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
  const snapshot = await db.collection("courses").where("slug", "==", "welcome-to-comprehensive-fusion-centre-operations").get();
  if (snapshot.empty) {
    console.error("Course not found in Firestore!");
    process.exit(1);
  }

  const docData = snapshot.docs[0].data();
  console.log(JSON.stringify(docData, null, 2));
  fs.writeFileSync(path.join(process.cwd(), "temp_fusion_course.json"), JSON.stringify(docData, null, 2));
  process.exit(0);
}

main().catch(console.error);
