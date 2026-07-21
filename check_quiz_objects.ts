import { getCourseBySlug } from './app/actions/lms';
import { getQuiz } from './lib/lms-content';

async function test() {
  const course = await getCourseBySlug('the-intersection-of-cybersecurity-and-computer-networking');
  if (course) {
    const quiz = getQuiz(course, 123);
    for (const q of quiz) {
      if (q.options) {
        for (const opt of q.options) {
          if (typeof opt !== 'string') {
            console.log("FOUND NON-STRING OPTION in Q", q.id, typeof opt, opt);
          }
        }
      }
      if (q.pairs) {
         for (const pair of q.pairs) {
            if (typeof pair.left !== 'string' || typeof pair.right !== 'string') {
               console.log("FOUND NON-STRING PAIR in Q", q.id, typeof pair.left, typeof pair.right, pair);
            }
         }
      }
    }
    console.log("Check complete.");
  }
}
test();
