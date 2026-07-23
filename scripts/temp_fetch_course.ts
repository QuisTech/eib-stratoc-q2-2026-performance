import { STATIC_LMS_COURSE_DATA } from "../lib/static-lms-courses";
import fs from "fs";

const course = STATIC_LMS_COURSE_DATA.find(c => c.slug === "the-complete-drone-technology-masterclass");
if (course) {
  fs.writeFileSync("course.json", JSON.stringify(course, null, 2));
  console.log("Course written to course.json");
} else {
  console.log("Course not found");
}
