import { adminDb } from "../lib/firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function findUser() {
  const { adminDb } = await import("../lib/firebase-admin");
  const users = await adminDb.collection("users").get();
  users.forEach(doc => {
    const data = doc.data();
    if (data.email && data.email.includes("michquis") || data.name && data.name.includes("Mich")) {
      console.log(`Found user: ${doc.id} - ${data.email} - ${data.name}`);
    }
  });
}

findUser().catch(console.error);
