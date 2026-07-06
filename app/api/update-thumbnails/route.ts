import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');
    const files = fs.readdirSync(thumbnailsDir);
    let updatedCount = 0;
    
    for (const file of files) {
      if (file.startsWith('course_') && file.endsWith('.png')) {
        const idStr = file.replace('course_', '').replace('.png', '');
        const id = parseInt(idStr, 10);
        
        if (!isNaN(id)) {
          const imageUrl = `/thumbnails/${file}`;
          await db.update(courses)
            .set({ imageUrl })
            .where(eq(courses.id, id));
          updatedCount++;
        }
      }
    }
    
    return NextResponse.json({ success: true, message: `Updated ${updatedCount} courses with their thumbnails.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
