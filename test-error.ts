import { db } from "./lib/db/db"
import { enrollments, lessonProgress, quizAttempts, certificates, courses } from "./lib/db/schema"
import { eq, and } from "drizzle-orm"

async function run() {
  const ens = await db.query.enrollments.findMany({ limit: 50 });
  const crs = await db.query.courses.findMany({ limit: 50 });
  
  console.log("Enrollments:", ens.length);
  console.log(ens.slice(0, 5));
  
  const certs = await db.query.certificates.findMany({ limit: 50 });
  console.log("Certs:", certs.length);
  console.log(certs.slice(0, 5));
  
  process.exit(0);
}
run().catch(console.error);
