import { getCourseBySlug } from './app/actions/lms';
import { getQuiz } from './lib/lms-content';

async function test() {
  const course = await getCourseBySlug('the-intersection-of-cybersecurity-and-computer-networking');
  if (course) {
    console.log("Custom Content length:", course.customContent?.length);
    console.log("Custom Content preview:", course.customContent?.substring(0, 500));
    
    try {
      const quiz = getQuiz(course, 123);
      console.log("Quiz length:", quiz.length);
      console.log("First question:", quiz[0]);
    } catch(e) {
      console.log("Quiz Error", e);
    }
  } else {
    console.log("Course not found");
  }
}
test();
