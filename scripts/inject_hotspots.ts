import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'lib/static-lms-courses.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// The course starts somewhere around "slug": "advanced-digital-intelligence-operations-manual"
const slugMatch = content.indexOf('"slug": "advanced-digital-intelligence-operations-manual"');
if (slugMatch === -1) {
  console.error("Course not found!");
  process.exit(1);
}

// Find the customContent key after the slug
const customContentKey = '"customContent": "';
const customContentStart = content.indexOf(customContentKey, slugMatch);
if (customContentStart === -1) {
  console.error("customContent not found for course!");
  process.exit(1);
}

const jsonStart = customContentStart + customContentKey.length;
// Find the end of the JSON string (a double quote not preceded by a backslash)
let jsonEnd = -1;
for (let i = jsonStart; i < content.length; i++) {
  if (content[i] === '"' && content[i-1] !== '\\') {
    jsonEnd = i;
    break;
  }
}

if (jsonEnd === -1) {
  console.error("Could not find end of customContent JSON string!");
  process.exit(1);
}

const escapedJsonStr = content.substring(jsonStart, jsonEnd);
// Unescape the string to get actual JSON
const jsonStr = escapedJsonStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

let customContentObj;
try {
  customContentObj = JSON.parse(jsonStr);
} catch (e) {
  console.error("Failed to parse customContent JSON:", e);
  process.exit(1);
}

const imageNames = [
  "lesson1_intro.png",
  "lesson2_intelligence_cycle.png",
  "lesson3_critical_thinking.png",
  "lesson4_legal_framework.png",
  "lesson5_osint.png",
  "lesson6_osint_methodology.png",
  "lesson7_digital_footprints.png",
  "lesson8_seint.png"
];

customContentObj.lessons.forEach((lesson: any, index: number) => {
  if (index < imageNames.length) {
    lesson.labeledGraphic = {
      imageUrl: `https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/advanced-digital-intelligence-operations-manual/${imageNames[index]}`,
      hotspots: [
        {
          id: `hotspot-${index}-1`,
          x: 25,
          y: 40,
          title: "Key Concept 1",
          content: "This area highlights the primary foundation of this lesson."
        },
        {
          id: `hotspot-${index}-2`,
          x: 65,
          y: 35,
          title: "Strategic Dashboard",
          content: "Observe the analytical metrics that drive decision-making."
        },
        {
          id: `hotspot-${index}-3`,
          x: 45,
          y: 75,
          title: "Action Item",
          content: "Critical path for executing this intelligence operation."
        }
      ]
    };
  }
});

const newJsonStr = JSON.stringify(customContentObj);
// Escape back for the TS string literal
const newEscapedJsonStr = newJsonStr.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const newContent = content.substring(0, jsonStart) + newEscapedJsonStr + content.substring(jsonEnd);
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log("Successfully injected labeledGraphic with CDN images and hotspots!");
