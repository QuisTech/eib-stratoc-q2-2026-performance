const { Pool } = require("pg");
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FIB5gDZVS0no@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
});
async function main() {
  const res = await pool.query('SELECT "customContent" FROM courses WHERE title = $1', ['EVP: Standard Operating Procedures & Reporting']);
  const content = res.rows[0].customContent;
  
  if (typeof content === 'string') {
    const parsed = JSON.parse(content);
    parsed.quiz.forEach((q, i) => {
        console.log(`Q${i+1}: ${q.prompt}`);
        console.log(`Answer: ${q.options[q.correctIndex]}`);
    });
  } else {
    content.quiz.forEach((q, i) => {
        console.log(`Q${i+1}: ${q.prompt}`);
        console.log(`Answer: ${q.options[q.correctIndex]}`);
    });
  }

  await pool.end();
}
main().catch(console.error);
