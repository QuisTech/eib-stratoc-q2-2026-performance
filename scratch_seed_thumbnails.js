const { Pool } = require('pg');
require('dotenv').config({ path: '.env.production' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const categoryImages = {
  "Technical": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
  "Reporting & Documentation": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2940&auto=format&fit=crop",
  "Operational": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop",
  "Emerging Tech": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2940&auto=format&fit=crop",
  "Safety & Compliance": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2940&auto=format&fit=crop",
  "Customer-Facing": "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2940&auto=format&fit=crop",
  "Project Management": "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
  "M&E / Data": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop",
  "Financial": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop",
  "Leadership": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop",
  "Media & Content": "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=2940&auto=format&fit=crop",
  "Digital Media": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop",
  "Marketing & Sales": "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2940&auto=format&fit=crop",
  "Intelligence & Security": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2940&auto=format&fit=crop",
  "Default": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop"
};

async function run() {
  try {
    const res = await pool.query('SELECT id, title, category FROM courses');
    for (const row of res.rows) {
      let imageUrl = categoryImages[row.category] || categoryImages["Default"];
      
      // Override with custom AI images for specific courses
      if (row.title === "EIB Group Global Orientation") {
        imageUrl = "/thumbnails/global_orientation.png";
      } else if (row.title.includes("Camps Security")) {
        imageUrl = "/thumbnails/camps_security.png";
      } else if (row.title.includes("(BLACK)")) {
        imageUrl = "/thumbnails/dci_black.png";
      }

      await pool.query('UPDATE courses SET "imageUrl" = $1 WHERE id = $2', [imageUrl, row.id]);
    }
    console.log(`Updated ${res.rows.length} courses with thumbnails.`);
  } catch(e) {
    console.error(e)
  } finally {
    pool.end();
  }
}
run();
