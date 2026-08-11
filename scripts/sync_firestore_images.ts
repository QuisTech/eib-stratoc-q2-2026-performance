import { adminDb } from "../lib/firebase-admin";
import { STATIC_LMS_COURSE_DATA } from "../lib/static-lms-courses";

async function run() {
  console.log("Updating Firestore courses to use local thumbnails...");
  let count = 0;
  
  for (const staticCourse of STATIC_LMS_COURSE_DATA) {
    if (staticCourse.isDeleted) continue;
    
    const hasLocalImage = staticCourse.imageUrl?.startsWith("/thumbnails/");
    
    let hasLocalContentImages = false;
    let customContentStr = "";
    if (staticCourse.customContent) {
      if (typeof staticCourse.customContent === "string") {
        customContentStr = staticCourse.customContent;
      } else {
        customContentStr = JSON.stringify(staticCourse.customContent);
      }
      hasLocalContentImages = customContentStr.includes("/thumbnails/");
    }
    
    if (hasLocalImage || hasLocalContentImages) {
      console.log(`Updating course in Firestore: ${staticCourse.slug}`);
      const courseRef = adminDb.collection("courses").doc(String(staticCourse.id));
      
      const updateData: any = {};
      if (hasLocalImage) {
        updateData.imageUrl = staticCourse.imageUrl;
      }
      if (hasLocalContentImages) {
        updateData.customContent = staticCourse.customContent;
      }
      
      if (Object.keys(updateData).length > 0) {
        await courseRef.update(updateData).catch(err => {
          console.error(`Failed to update ${staticCourse.slug}`, err.message);
        });
        count++;
      }
    }
  }
  
  console.log(`Successfully updated ${count} courses in Firestore.`);
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
