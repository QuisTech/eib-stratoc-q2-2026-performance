const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      if (content.includes('auth.api.getSession')) {
        content = content.replace(/const session = await auth\.api\.getSession\([^)]*\)/g, 'const user = await getSessionUser();\n  const session = user ? { user } : null');
        content = content.replace(/let session = await auth\.api\.getSession\([^)]*\)/g, 'const user = await getSessionUser();\n    let session = user ? { user } : null');
        content = content.replace(/session = await auth\.api\.getSession\([^)]*\)/g, 'const user = await getSessionUser();\n    session = user ? { user } : null');
        
        if (!content.includes('getSessionUser')) {
          content = 'import { getSessionUser } from "@/app/actions/auth"\n' + content;
        }
        
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('./app');
