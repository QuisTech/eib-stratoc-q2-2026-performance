import { getSessionUser } from "@/app/actions/auth";
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control";
import { adminDb } from "@/lib/firebase-admin";
import { STATIC_LMS_COURSE_DATA } from "@/lib/static-lms-courses";

export async function POST(req: Request) {
  // Authorization check (optional if we just want to run it via curl, but let's be safe or bypass for local)
  const isLocal = process.env.NODE_ENV === "development" || req.headers.get("host")?.includes("localhost");
  
  if (!isLocal) {
    const user = await getSessionUser();
    if (!user || !checkIsSuperAdmin(user)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  }

  try {
    let count = 0;
    
    for (const staticCourse of STATIC_LMS_COURSE_DATA) {
      if (staticCourse.isDeleted) continue;
      
      const hasLocalImage = staticCourse.imageUrl?.startsWith("/thumbnails/");
      const customContentStr = typeof staticCourse.customContent === 'string' ? staticCourse.customContent : JSON.stringify(staticCourse.customContent || "");
      const hasLocalContentImages = customContentStr.includes("/thumbnails/");
      
      if (hasLocalImage || hasLocalContentImages) {
        console.log(`Updating course in Firestore: ${staticCourse.slug}`);
        const courseRef = adminDb.collection("courses").doc(String(staticCourse.id));
        
        const updateData: any = {};
        if (hasLocalImage) {
          updateData.imageUrl = staticCourse.imageUrl;
        }
        if (hasLocalContentImages && typeof staticCourse.customContent !== 'string') {
          updateData.customContent = staticCourse.customContent;
        }
        
        await courseRef.update(updateData).catch(err => {
          console.error(`Failed to update ${staticCourse.slug}`, err.message);
        });
        count++;
      }
    }
    
    return new Response(JSON.stringify({ success: true, count }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
