const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ db \} from "@\/lib\/db"\n?/g, '');
  content = content.replace(/import \{ user \} from "@\/lib\/db\/schema"\n?/g, '');
  content = content.replace(/import \{ courses \} from "@\/lib\/db\/schema"\n?/g, '');
  content = content.replace(/import \{ eq \} from "drizzle-orm"\n?/g, '');
  fs.writeFileSync(file, content);
}

fix('app/lms/[slug]/certificate/page.tsx');
fix('app/lms/admin/courses/[slug]/builder/page.tsx');
fix('app/lms/admin/courses/[slug]/edit/page.tsx');
