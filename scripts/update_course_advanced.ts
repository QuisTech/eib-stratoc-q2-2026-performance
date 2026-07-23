import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../lib/static-lms-courses.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// The file exports STATIC_LMS_COURSE_DATA.
// I need to parse the file, find the object with slug 'advanced-digital-intelligence-operations-manual', and replace its customContent string.
// Since the file is TS, I'll extract the JSON string, parse it, update it, stringify it, and put it back.

const hotspotsConfig = {
  "lesson-1784215481164": { // Intro to Intelligence
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson1_intro.png",
    hotspots: [
      { id: "hs-1", title: "Strategic Dashboard", content: "Displays real-time threat intelligence and geopolitical data essential for modern investigations.", x: 25, y: 30 },
      { id: "hs-2", title: "Intelligence Analyst", content: "Professionals trained to transform raw data into actionable intelligence.", x: 70, y: 50 },
      { id: "hs-3", title: "Real-time Data Feed", content: "Continuous ingestion of global information sources to maintain situational awareness.", x: 50, y: 70 }
    ]
  },
  "lesson-1784218241258": { // The Intelligence Cycle
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson2_intelligence_cycle.png",
    hotspots: [
      { id: "hs-1", title: "Planning & Direction", content: "Defining the intelligence requirements before any collection begins.", x: 20, y: 40 },
      { id: "hs-2", title: "Collection & Processing", content: "Gathering and organizing raw information systematically.", x: 50, y: 20 },
      { id: "hs-3", title: "Analysis & Dissemination", content: "Evaluating evidence to produce intelligence and delivering it to decision-makers.", x: 80, y: 60 }
    ]
  },
  "lesson-1784276766005": { // Critical Thinking
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson3_critical_thinking.png",
    hotspots: [
      { id: "hs-1", title: "Data Visualization", content: "Mapping complex relationships to identify hidden patterns and connections.", x: 30, y: 30 },
      { id: "hs-2", title: "Hypothesis Testing", content: "Applying structured analytical techniques to challenge assumptions.", x: 60, y: 45 },
      { id: "hs-3", title: "Analytical Bias Check", content: "Continuous self-evaluation to ensure objectivity in findings.", x: 40, y: 80 }
    ]
  },
  "lesson-1784278330970": { // Legal Framework
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson4_legal_framework.png",
    hotspots: [
      { id: "hs-1", title: "Regulatory Compliance", content: "Ensuring all investigative actions adhere to national and international laws.", x: 30, y: 60 },
      { id: "hs-2", title: "Privacy Guidelines", content: "Respecting individual privacy rights during data collection.", x: 70, y: 30 },
      { id: "hs-3", title: "Audit Trail", content: "Maintaining a clear, documented record of all investigative steps.", x: 50, y: 50 }
    ]
  },
  "lesson-1784279510711": { // OSINT
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson5_osint.png",
    hotspots: [
      { id: "hs-1", title: "Open Source Feeds", content: "Monitoring publicly available information across the internet and deep web.", x: 40, y: 40 },
      { id: "hs-2", title: "Verification Tools", content: "Using specialized software to authenticate the origin and reliability of data.", x: 80, y: 55 },
      { id: "hs-3", title: "Secure Environment", content: "Conducting investigations from a sanitized, protected digital workspace.", x: 20, y: 70 }
    ]
  },
  "lesson-1784303081006": { // OSINT Methodology
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson6_osint_methodology.png",
    hotspots: [
      { id: "hs-1", title: "Requirement Definition", content: "Establishing clear objectives to guide the OSINT investigation.", x: 25, y: 25 },
      { id: "hs-2", title: "Validation Stage", content: "Cross-referencing collected data to ensure accuracy and eliminate disinformation.", x: 55, y: 50 },
      { id: "hs-3", title: "Production Phase", content: "Synthesizing validated information into a final intelligence product.", x: 75, y: 75 }
    ]
  },
  "lesson-1784304316547": { // Digital Footprints
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson7_digital_footprints.png",
    hotspots: [
      { id: "hs-1", title: "Network Logs", content: "Analyzing IP addresses, connections, and metadata to trace activity.", x: 35, y: 35 },
      { id: "hs-2", title: "Identity Traces", content: "Linking disparate online profiles to a single real-world entity.", x: 65, y: 20 },
      { id: "hs-3", title: "Behavioral Patterns", content: "Observing recurring actions to predict future activities or uncover hidden affiliations.", x: 50, y: 80 }
    ]
  },
  "lesson-1784305452600": { // SEINT
    imageUrl: "/assets/advanced-digital-intelligence-operations-manual/lesson8_seint.png",
    hotspots: [
      { id: "hs-1", title: "Advanced Queries", content: "Utilizing Boolean operators and specialized syntax to refine search results.", x: 20, y: 50 },
      { id: "hs-2", title: "Source Evaluation", content: "Critically assessing the credibility and bias of indexed content.", x: 60, y: 40 },
      { id: "hs-3", title: "Documentation", content: "Preserving search results securely before they are altered or removed.", x: 80, y: 70 }
    ]
  }
};

const { STATIC_LMS_COURSE_DATA } = require('../lib/static-lms-courses');

const targetCourse = STATIC_LMS_COURSE_DATA.find((c: any) => c.slug === 'advanced-digital-intelligence-operations-manual');

if (targetCourse && targetCourse.customContent) {
  const customData = JSON.parse(targetCourse.customContent);
  customData.lessons.forEach((lesson: any) => {
    const config = hotspotsConfig[lesson.key as keyof typeof hotspotsConfig];
    if (config) {
      lesson.labeledGraphic = {
        imageUrl: config.imageUrl,
        hotspots: config.hotspots
      };
    }
  });

  const newCustomContent = JSON.stringify(customData);

  // We need to carefully replace just this course's customContent in the TS file.
  // We can use a regex to find the string block if we format it carefully, but it's risky.
  // Instead, let's read the file, split by slug, and replace the customContent.
  
  // A robust way is to just find: slug: "advanced-digital-intelligence-operations-manual", ... customContent: '...'
  
  // We'll use a regex that matches `slug: "advanced-digital-intelligence-operations-manual"` and the following `customContent: '...'` or `customContent: "..."`
  // Actually, wait. It's safer to just do a string replacement of the old customContent.
  
  const oldCustomContentStr = targetCourse.customContent;
  
  // The file might use single quotes or backticks, let's replace the raw string.
  // Instead of guessing quotes, let's escape it.
  
  // Even better: use string replace.
  
  // Let's just do it directly.
  const escapedOld = JSON.stringify(oldCustomContentStr); // this adds quotes
  const escapedNew = JSON.stringify(newCustomContent); // this adds quotes
  
  // In static-lms-courses.ts, the customContent is likely backtick delimited: customContent: `{"courseTitle...`
  // We can just read the whole file and replace the exact oldCustomContentStr.
  
  let newFileContent = content.replace(oldCustomContentStr, newCustomContent);
  
  fs.writeFileSync(filePath, newFileContent, 'utf-8');
  console.log("Course enriched successfully!");
} else {
  console.error("Course not found");
}
