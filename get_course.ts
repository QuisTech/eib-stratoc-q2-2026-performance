import { adminDb } from './lib/firebase-admin';

async function main() {
  const slug = 'intelligence-cycle';
  const snap = await adminDb.collection('courses').where('slug', '==', slug).get();
  if (snap.empty) {
    console.log("Course not found!");
    return;
  }
  const course = snap.docs[0].data();
  console.log("Course Title:", course.title);
  console.log("Image URL:", course.imageUrl);
  
  const content = typeof course.customContent === 'string' ? JSON.parse(course.customContent) : course.customContent;
  
  if (content && content.lessons) {
    for (let i = 0; i < content.lessons.length; i++) {
      const lesson = content.lessons[i];
      console.log(`\nLesson ${i+1}: ${lesson.title}`);
      console.log(`Video URL: ${lesson.videoUrl}`);
      console.log(`Has Labeled Graphic: ${!!lesson.labeledGraphic}`);
      if (lesson.labeledGraphic) {
        console.log(`Labeled Graphic Image URL: ${lesson.labeledGraphic.imageUrl}`);
      }
    }
  }
}

main().catch(console.error);
