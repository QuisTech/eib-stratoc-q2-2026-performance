import { getCourseBySlug } from './app/actions/lms';
import { getLessons } from './lib/lms-content';

async function test() {
  const course = await getCourseBySlug('the-intersection-of-cybersecurity-and-computer-networking');
  if (course) {
    try {
      const lessons = getLessons(course);
      console.log("Lessons count:", lessons.length);
      console.log("First lesson:", lessons[0].key);
    } catch(e) {
      console.log("Lessons Error", e);
    }
  } else {
    console.log("Course not found");
  }
}
test();
