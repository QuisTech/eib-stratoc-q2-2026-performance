const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const fs = require('fs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  try {
    const mapping = JSON.parse(fs.readFileSync('mapping.json', 'utf8'));
    const { rows: courses } = await pool.query('SELECT id, title, slug FROM courses');
    
    const files = fs.readdirSync('public/thumbnails').filter(f => f.endsWith('.png'));
    
    let updates = 0;

    for (const file of files) {
      const baseName = file.replace('.png', '');
      let prompt = mapping[baseName];
      
      // If we have an exact mapping for a specific duplicate like course_44_1783350438, use that.
      // But typically we just use mapping[baseName].
      if (!prompt) {
        // Find if there's a key in mapping that starts with this basename
        const possibleKey = Object.keys(mapping).find(k => k.startsWith(baseName + '_'));
        if (possibleKey) prompt = mapping[possibleKey];
      }

      if (prompt) {
        // Find best matching course
        let bestCourse = null;
        let bestScore = 0;
        
        for (const course of courses) {
          const normTitle = course.title.toLowerCase();
          const normPrompt = prompt.toLowerCase();
          
          let score = 0;
          if (normPrompt.includes(normTitle) || normTitle.includes(normPrompt.split('.')[0])) {
            score += 100;
          }
          
          // Keyword overlap
          const words = normTitle.split(/[^a-z0-9]+/).filter(w => w.length > 3);
          for (const w of words) {
            if (normPrompt.includes(w)) score += 10;
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestCourse = course;
          }
        }
        
        if (bestCourse && bestScore > 0) {
          console.log(`Matched ${file} to "${bestCourse.title}" (Score: ${bestScore})`);
          await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', ['/thumbnails/'+file, bestCourse.id]);
          updates++;
        } else {
          console.log(`Could not find a match for ${file} with prompt: ${prompt.substring(0, 50)}...`);
        }
      } else {
        // If there's no prompt, maybe it's 1-14 which map directly to ID.
        const idMatch = file.match(/^course_(\d+)\.png$/);
        if (idMatch) {
          const id = parseInt(idMatch[1], 10);
          if (id <= 21) {
             // For standard courses, they were mapped exactly to 1-21 originally.
             console.log(`Fallback exact match ${file} to ID ${id}`);
             await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', ['/thumbnails/'+file, id]);
             updates++;
          }
        }
      }
    }
    
    console.log(`Total updates: ${updates}`);

    // Let's hardcode some specific ones if they miss:
    // global_orientation.png -> EIB Group Global Orientation
    await pool.query(`UPDATE courses SET "imageUrl" = '/thumbnails/global_orientation.png' WHERE slug = 'eib-group-global-orientation'`);
    await pool.query(`UPDATE courses SET "imageUrl" = '/thumbnails/camps_security.png' WHERE slug = 'camps-security-strategic-plan'`);
    await pool.query(`UPDATE courses SET "imageUrl" = '/thumbnails/dci_black.png' WHERE slug = 'black-intelligence-clandestine-ops'`);

  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
