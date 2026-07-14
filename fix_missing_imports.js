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
      
      if (content.includes('getSessionUser()')) {
        if (!content.includes('import { getSessionUser }')) {
          console.log('Missing import in:', fullPath);
          content = 'import { getSessionUser } from "@/app/actions/auth"\n' + content;
          fs.writeFileSync(fullPath, content);
        }
      }
    }
  }
}

processDir('./app');
