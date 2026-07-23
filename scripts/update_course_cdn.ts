import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../lib/static-lms-courses.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace /assets/advanced-digital-intelligence-operations-manual/ with https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/advanced-digital-intelligence-operations-manual/
const oldUrl = '/assets/advanced-digital-intelligence-operations-manual/';
const newUrl = 'https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/advanced-digital-intelligence-operations-manual/';

let newContent = content.split(oldUrl).join(newUrl);

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log("URLs updated successfully.");
