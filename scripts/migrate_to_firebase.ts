import 'dotenv/config';
import { db } from '../lib/db/index';
import { user, account, courses, enrollments, lessonProgress, quizAttempts, certificates } from '../lib/db/schema';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

// 1. Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../firebase-admin.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Missing firebase-admin.json");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
const app = initializeApp({
  credential: cert(serviceAccount)
});

const firestore = getFirestore(app);
const auth = getAuth(app);

async function migrate() {
  console.log("Starting migration from Postgres to Firebase...");

  // 1. Fetch all data from Postgres
  console.log("Fetching Postgres data...");
  const pgUsers = await db.select().from(user);
  const pgAccounts = await db.select().from(account);
  const pgCourses = await db.select().from(courses);
  const pgEnrollments = await db.select().from(enrollments);
  const pgLessonProgress = await db.select().from(lessonProgress);
  const pgQuizAttempts = await db.select().from(quizAttempts);
  const pgCertificates = await db.select().from(certificates);

  console.log(`Found ${pgUsers.length} users, ${pgCourses.length} courses, ${pgEnrollments.length} enrollments.`);

  // 2. Migrate Users to Firebase Auth & Firestore
  console.log("Migrating users...");
  const authUsers = [];
  
  for (const u of pgUsers) {
    const acc = pgAccounts.find(a => a.userId === u.id);
    let passwordHash = undefined;
    
    if (acc && acc.password) {
      // Better-auth stores full bcrypt hash string (e.g. $2b$10$...)
      // Firebase auth requires it exactly as a buffer
      passwordHash = Buffer.from(acc.password);
    }

    const authUser: any = {
      uid: u.id,
      email: u.email,
      emailVerified: u.emailVerified || false,
      displayName: u.name,
      photoURL: u.image || undefined,
    };

    if (passwordHash) {
      authUser.passwordHash = passwordHash;
    }

    authUsers.push(authUser);

    // Also save user metadata to Firestore
    await firestore.collection('users').doc(u.id).set({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      subsidiary: u.subsidiary || null,
      mustChangePassword: u.mustChangePassword,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    });
  }

  // Batch import to Firebase Auth
  if (authUsers.length > 0) {
    try {
      const importResult = await auth.importUsers(authUsers, {
        hash: {
          algorithm: 'BCRYPT',
        }
      });
      console.log(`Successfully imported ${importResult.successCount} users to Firebase Auth.`);
      if (importResult.failureCount > 0) {
        console.error("Failed to import some users:", importResult.errors);
      }
    } catch (e) {
      console.error("Auth Import Error:", e);
    }
  }

  // 3. Migrate Courses
  console.log("Migrating courses...");
  const batch = firestore.batch();
  for (const c of pgCourses) {
    const docRef = firestore.collection('courses').doc(c.id.toString());
    batch.set(docRef, {
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      category: c.category,
      level: c.level,
      format: c.format,
      durationHours: c.durationHours,
      priceNaira: c.priceNaira,
      subsidiaries: c.subsidiaries,
      initiative: c.initiative,
      videoUrl: c.videoUrl || null,
      imageUrl: c.imageUrl || null,
      customContent: c.customContent || null,
      isBriefing: c.isBriefing,
      authorId: c.authorId || null,
      createdAt: c.createdAt.toISOString(),
    });
  }
  await batch.commit();

  // 4. Migrate Enrollments
  console.log("Migrating enrollments...");
  let eBatch = firestore.batch();
  let count = 0;
  for (const e of pgEnrollments) {
    const docRef = firestore.collection('enrollments').doc(e.id.toString());
    eBatch.set(docRef, {
      id: e.id,
      userId: e.userId,
      courseId: e.courseId,
      status: e.status,
      progress: e.progress,
      enrolledAt: e.enrolledAt.toISOString(),
      completedAt: e.completedAt ? e.completedAt.toISOString() : null,
    });
    count++;
    if (count % 400 === 0) {
      await eBatch.commit();
      eBatch = firestore.batch();
    }
  }
  await eBatch.commit();

  // 5. Migrate Lesson Progress
  console.log("Migrating lesson progress...");
  let lpBatch = firestore.batch();
  count = 0;
  for (const lp of pgLessonProgress) {
    const docRef = firestore.collection('lessonProgress').doc(lp.id.toString());
    lpBatch.set(docRef, {
      id: lp.id,
      userId: lp.userId,
      courseId: lp.courseId,
      lessonKey: lp.lessonKey,
      completedAt: lp.completedAt.toISOString(),
    });
    count++;
    if (count % 400 === 0) {
      await lpBatch.commit();
      lpBatch = firestore.batch();
    }
  }
  await lpBatch.commit();

  // 6. Migrate Quiz Attempts
  console.log("Migrating quiz attempts...");
  let qBatch = firestore.batch();
  count = 0;
  for (const q of pgQuizAttempts) {
    const docRef = firestore.collection('quizAttempts').doc(q.id.toString());
    qBatch.set(docRef, {
      id: q.id,
      userId: q.userId,
      courseId: q.courseId,
      score: q.score,
      total: q.total,
      passed: q.passed,
      answers: q.answers,
      createdAt: q.createdAt.toISOString(),
    });
    count++;
    if (count % 400 === 0) {
      await qBatch.commit();
      qBatch = firestore.batch();
    }
  }
  await qBatch.commit();

  // 7. Migrate Certificates
  console.log("Migrating certificates...");
  let cBatch = firestore.batch();
  count = 0;
  for (const cert of pgCertificates) {
    const docRef = firestore.collection('certificates').doc(cert.id.toString());
    cBatch.set(docRef, {
      id: cert.id,
      userId: cert.userId,
      courseId: cert.courseId,
      serial: cert.serial,
      issuedAt: cert.issuedAt.toISOString(),
    });
    count++;
    if (count % 400 === 0) {
      await cBatch.commit();
      cBatch = firestore.batch();
    }
  }
  await cBatch.commit();

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch(console.error);
