const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const rootDir = path.join(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');

if (fs.existsSync(standaloneDir)) {
  console.log('Copying public directory to standalone...');
  copyDir(path.join(rootDir, 'public'), path.join(standaloneDir, 'public'));
  
  console.log('Copying static directory to standalone...');
  copyDir(path.join(rootDir, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));
  
  console.log('Post-build asset copy completed successfully!');
} else {
  console.log('Standalone directory not found, skipping copy.');
}
