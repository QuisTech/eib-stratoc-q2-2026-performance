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
      
      // Fix syntax errors left over from the first script
      if (content.includes('null })')) {
        content = content.replace(/null \}\)/g, 'null');
        changed = true;
      }
      if (content.includes('import { auth } from "@/lib/auth"')) {
        content = content.replace(/import \{ auth \} from "@\/lib\/auth"\n?/g, '');
        changed = true;
      }
      if (content.includes('import { auth, authClient } from "@/lib/auth"')) {
        content = content.replace(/import \{ auth, authClient \} from "@\/lib\/auth"\n?/g, '');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('./app');
