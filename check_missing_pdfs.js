import 'dotenv/config'
import pg from 'pg'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function main() {
  const query = `
    SELECT id, title, slug, "isBriefing", "customContent" 
    FROM courses 
    WHERE title ILIKE '%RAW: Cyber Intelligence%' 
       OR title ILIKE '%SAC: Intelligence Systems%' 
       OR title ILIKE '%DCI-Intel: Information Gathering%'
  `
  const res = await pool.query(query)
  for (const row of res.rows) {
    console.log(`\nID: ${row.id} | Title: ${row.title} | Briefing: ${row.isBriefing}`)
    if (row.customContent) {
      try {
        const parsed = JSON.parse(row.customContent)
        for (const lesson of (parsed.lessons || [])) {
          if (lesson.attachments && lesson.attachments.length > 0) {
            console.log(`  Lesson: "${lesson.title}" -> ATTACHMENTS: ${JSON.stringify(lesson.attachments)}`)
          } else {
             console.log(`  Lesson: "${lesson.title}" -> NO attachments`)
          }
        }
      } catch (e) {
        console.log('  Failed to parse customContent')
      }
    } else {
      console.log('  NO customContent')
    }
  }
  await pool.end()
}
main()
