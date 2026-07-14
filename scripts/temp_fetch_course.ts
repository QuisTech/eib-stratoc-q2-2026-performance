import { db } from "../lib/db"
import { courses } from "../lib/db/schema"
import { eq } from "drizzle-orm"
import fs from "fs"

async function run() {
  const courseList = await db.select().from(courses).where(eq(courses.slug, "financial-management-budgeting"))
  if (courseList.length === 0) {
    console.error("Course not found!")
    process.exit(1)
  }
  const course = courseList[0]
  if (!course.customContent) {
    console.error("No custom content found!")
    process.exit(1)
  }
  const data = JSON.parse(course.customContent)
  fs.writeFileSync("temp_course_data.json", JSON.stringify(data.lessons, null, 2))
  console.log("Successfully fetched course data to temp_course_data.json")
}

run().catch(console.error).finally(() => process.exit(0))
