import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

// Load .env.local variables FIRST before any imports that rely on them
dotenv.config({ path: ".env.local" });

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const pathPrefix = process.env.GITHUB_IMAGE_PATH || "course-images";

if (!token || !owner || !repo) {
  console.error("Missing GitHub environment variables in .env.local.");
  process.exit(1);
}

async function uploadToGitHub(base64Content: string, originalFilename: string): Promise<string> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split(".").pop() || "png";
  const filename = `migrated-${timestamp}-${randomString}.${extension}`;
  const fullPath = `${pathPrefix}/${filename}`;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`;
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'EIB-LMS-Migration'
    },
    body: JSON.stringify({
      message: `Migrate ${originalFilename}`,
      content: base64Content,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${errorText}`);
  }

  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@main/${fullPath}`;
}

async function processImage(imageUrl: string, docId: string): Promise<string | null> {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return null; // Already remote

  try {
    if (imageUrl.startsWith("data:image/")) {
      // Base64 Image
      console.log(`[${docId}] Processing Base64 image...`);
      const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        console.warn(`[${docId}] Invalid base64 string`);
        return null;
      }
      const mimeType = matches[1];
      const base64Content = matches[2];
      const ext = mimeType.split('/')[1] || 'png';
      return await uploadToGitHub(base64Content, `image.${ext}`);
    } else if (imageUrl.startsWith("/")) {
      // Local file path
      console.log(`[${docId}] Processing local file: ${imageUrl}`);
      const localPath = path.join(process.cwd(), "public", imageUrl.split('?')[0]);
      try {
        const buffer = await fs.readFile(localPath);
        const base64Content = buffer.toString('base64');
        return await uploadToGitHub(base64Content, path.basename(localPath));
      } catch (e: any) {
        console.warn(`[${docId}] Local file not found: ${localPath}`);
        return null;
      }
    }
  } catch (error) {
    console.error(`[${docId}] Failed to process image:`, error);
  }
  return null;
}

async function migrate() {
  // Dynamically import adminDb AFTER dotenv is loaded
  const { adminDb } = await import("../lib/firebase-admin");

  console.log(`Starting GitHub Image Migration...`);
  console.log(`Target Repo: ${owner}/${repo}`);

  // 1. Migrate Courses
  console.log("\n--- Migrating Courses ---");
  const coursesSnapshot = await adminDb.collection("courses").get();
  for (const doc of coursesSnapshot.docs) {
    const data = doc.data();
    if (data.imageUrl) {
      const newUrl = await processImage(data.imageUrl, `Course: ${data.title}`);
      if (newUrl) {
        await doc.ref.update({ imageUrl: newUrl });
        console.log(`✅ Updated course ${data.title} -> ${newUrl}`);
      }
    }
  }

  // 2. Migrate Labeled Graphics
  console.log("\n--- Migrating Labeled Graphics ---");
  const graphicsSnapshot = await adminDb.collection("labeledGraphics").get();
  for (const doc of graphicsSnapshot.docs) {
    const data = doc.data();
    if (data.imageUrl) {
      const newUrl = await processImage(data.imageUrl, `Graphic: ${doc.id}`);
      if (newUrl) {
        await doc.ref.update({ imageUrl: newUrl });
        console.log(`✅ Updated graphic ${doc.id} -> ${newUrl}`);
      }
    }
  }

  console.log("\nMigration completed successfully.");
}

migrate().catch(console.error);
