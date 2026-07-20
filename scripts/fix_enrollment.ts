import { adminDb } from "../lib/firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function fix() {
  const { adminDb } = await import("../lib/firebase-admin");
  const userId = "0749SsKMaRNQlUpPcrnKREdWLb7Kqdy8";
  const courseId = 4;

  const snap = await adminDb.collection("enrollments").where("userId", "==", userId).get();
  let found = false;
  for (const d of snap.docs) {
    if (Number(d.data().courseId) === courseId) {
      console.log(`Found a matching doc with ID: ${d.id}`);
      await adminDb.collection("enrollments").doc(d.id).delete();
      console.log("Deleted.");
      found = true;
    }
  }
  if (!found) console.log("Could not find any enrollment for this course.");

  // Also fix the enrollment count
  await adminDb.collection("courses").doc(String(courseId)).update({
    enrollmentCount: 0 // Just in case it's negative
  });
  console.log("Reset enrollment count to 0.");
}

fix().catch(console.error);
