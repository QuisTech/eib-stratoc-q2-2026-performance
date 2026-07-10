import 'dotenv/config'
import pg from 'pg'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function main() {
  // Check a working briefing with PDF for reference (PSAP)
  const res = await pool.query(`SELECT id, slug, title, "isBriefing", "customContent" FROM courses WHERE title ILIKE '%PSAP%' AND "isBriefing" = true LIMIT 2`)
  for (const row of res.rows) {
    console.log('\n=== COURSE ===')
    console.log('ID:', row.id)
    console.log('Title:', row.title)
    console.log('isBriefing:', row.isBriefing)
    if (row.customContent) {
      const parsed = JSON.parse(row.customContent)
      for (const lesson of (parsed.lessons || [])) {
        console.log(`  Lesson: "${lesson.title}"`)
        if (lesson.attachments && lesson.attachments.length > 0) {
          console.log('    ATTACHMENTS:', JSON.stringify(lesson.attachments))
        }
      }
    }
  }

  // Also check what the SAC briefing USED to look like — check git or look for similar courses with attachments
  const res2 = await pool.query(`SELECT id, title, "customContent" FROM courses WHERE "customContent" ILIKE '%attachment%' OR "customContent" ILIKE '%.pdf%' LIMIT 10`)
  console.log('\n\n=== ALL COURSES WITH PDF ATTACHMENTS ===')
  for (const row of res2.rows) {
    console.log(`\nID: ${row.id} | Title: ${row.title}`)
    if (row.customContent) {
      const parsed = JSON.parse(row.customContent)
      for (const lesson of (parsed.lessons || [])) {
        if (lesson.attachments && lesson.attachments.length > 0) {
          console.log(`  Lesson: "${lesson.title}" -> ${JSON.stringify(lesson.attachments)}`)
        }
      }
    }
  }

  await pool.end()
}
main()
