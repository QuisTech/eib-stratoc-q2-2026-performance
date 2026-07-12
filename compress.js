const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'thumbnails');
const MAX_SIZE = 290 * 1024; // 290 KB

async function compressImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.size > MAX_SIZE) {
      console.log(`Compressing ${file} (${(stat.size / 1024).toFixed(2)} KB)...`);
      const tempPath = path.join(dir, 'temp_' + file);
      
      try {
        if (file.endsWith('.png')) {
          await sharp(filePath)
            .resize(800) // WhatsApp max dimension is around 800-1200 anyway
            .png({ quality: 60, compressionLevel: 9 })
            .toFile(tempPath);
        } else {
          await sharp(filePath)
            .resize(800)
            .jpeg({ quality: 60 })
            .toFile(tempPath);
        }
        
        fs.renameSync(tempPath, filePath);
        const newStat = fs.statSync(filePath);
        console.log(`Success! New size: ${(newStat.size / 1024).toFixed(2)} KB`);
      } catch (err) {
        console.error(`Error compressing ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
}

compressImages();
