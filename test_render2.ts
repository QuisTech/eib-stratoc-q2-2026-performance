import { getCourseBySlug } from './app/actions/lms';
import { getLessons } from './lib/lms-content';

function parseMarkdown(text: string) {
  let html = text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return html
}

async function test() {
  const course = await getCourseBySlug('the-intersection-of-cybersecurity-and-computer-networking');
  if (course) {
    const lessons = getLessons(course);
    
    // Simulate rendering for ALL lessons
    try {
      for (const lesson of lessons) {
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
            parseMarkdown(str);
          })
        })
        if (lesson.interactiveTabs) {
          lesson.interactiveTabs.forEach(t => {
            parseMarkdown(String(t.content || ""));
            String(t.tabTitle || "");
          })
        }
        if (lesson.takeaways) {
          lesson.takeaways.forEach(t => {
            String(t);
          })
        }
        if (lesson.attachments) {
          lesson.attachments.forEach(a => {
            const url = a.url;
            const title = a.title;
          })
        }
      }
      console.log("No obvious rendering crash detected for ALL lessons");
    } catch(e) {
       console.error("Rendering crash simulation caught:", e);
    }
  } else {
    console.log("Course not found");
  }
}
test();
