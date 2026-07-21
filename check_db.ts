import { getCourseBySlug } from './app/actions/lms';

async function test() {
  const course = await getCourseBySlug('evp-group-hr-sops');
  if (course) {
    console.log("Custom Content length:", course.customContent?.length);
    console.log("Custom Content preview:", course.customContent?.substring(0, 500));
    
    try {
      const parsed = JSON.parse(course.customContent || '{}');
      console.log("Parsed keys:", Object.keys(parsed));
      console.log("Lessons type:", typeof parsed.lessons, Array.isArray(parsed.lessons));
      if (Array.isArray(parsed.lessons)) {
        console.log("First lesson keys:", Object.keys(parsed.lessons[0]));
        console.log("First lesson sections:", parsed.lessons[0].sections);
      }
    } catch(e) {
      console.log("JSON Parse Error", e);
    }
  } else {
    console.log("Course not found");
  }
}
test();
