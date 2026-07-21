import { getCourseBySlug } from './app/actions/lms';
import { getLessons } from './lib/lms-content';

async function test() {
  const course = await getCourseBySlug('evp-group-hr-sops');
  if (course) {
    const lessons = getLessons(course);
    const lesson = lessons.find(l => l.key === 'evp-reporting-approval');
    console.log("Lesson found:", !!lesson);
    if (lesson) {
      console.log("Sections count:", lesson.sections?.length);
      console.log("Takeaways count:", lesson.takeaways?.length);
      console.log("Attachments count:", lesson.attachments?.length);
      console.log("InteractiveTabs count:", lesson.interactiveTabs?.length);
      console.log("LabeledGraphic:", !!lesson.labeledGraphic);
      console.log("KnowledgeCheck:", !!lesson.knowledgeCheck);
      
      // Simulate rendering
      try {
        if (lesson.knowledgeCheck) {
          lesson.knowledgeCheck.pairs.forEach(p => {
             const x = p.left;
             const y = p.right;
          })
        }
        if (lesson.labeledGraphic) {
           lesson.labeledGraphic.hotspots.forEach(h => {
             const title = h.title;
             const content = h.content;
           })
        }
        lesson.sections.forEach(s => {
          s.body.forEach(b => {
            const str = String(b);
            str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          })
        })
        console.log("No obvious rendering crash detected");
      } catch(e) {
         console.error("Rendering crash simulation caught:", e);
      }
    } else {
       console.log("Available keys:", lessons.map(l => l.key));
    }
  } else {
    console.log("Course not found");
  }
}
test();
