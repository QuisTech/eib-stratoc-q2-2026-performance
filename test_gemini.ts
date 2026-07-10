import { generateCourseContentWithGemini } from "./app/actions/gemini.ts";

async function run() {
  try {
    const res = await generateCourseContentWithGemini("Financial Management", "Finance");
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}
run();
