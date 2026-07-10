import 'dotenv/config'
import pg from 'pg'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function main() {
  const query = `
    SELECT id, title, "customContent" 
    FROM courses 
    WHERE title ILIKE '%RAW: Cyber Intelligence%' 
       OR title ILIKE '%SAC: Intelligence Systems%' 
       OR title ILIKE '%DCI-Intel: Information Gathering%'
  `
  const res = await pool.query(query)
  for (const row of res.rows) {
    if (row.customContent) {
      try {
        const parsed = JSON.parse(row.customContent)
        if (parsed.lessons && parsed.lessons.length > 0) {
          // Attach PDF to the first lesson
          const firstLesson = parsed.lessons[0]
          if (!firstLesson.attachments) {
            firstLesson.attachments = []
          }
          
          let pdfUrl = '/docs/black-mid-year-presentation.pdf'
          let pdfTitle = 'Black Mid-Year Presentation (PDF)'
          
          // Clear previous attachments to make sure it's only the correct one
          firstLesson.attachments = []
          firstLesson.attachments.push({
            title: pdfTitle,
            url: pdfUrl
          })
            
            // Update in DB
            await pool.query('UPDATE courses SET "customContent" = $1 WHERE id = $2', [JSON.stringify(parsed), row.id])
            console.log(`Updated course ID ${row.id} ("${row.title}") with attachment.`)
        }
      } catch (e) {
        console.log(`Failed to parse customContent for ID ${row.id}`)
      }
    }
  }
  await pool.end()
}
main()
