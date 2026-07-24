import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(process.cwd(), "firebase-admin.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();
const slug = "welcome-to-comprehensive-fusion-centre-operations";
const baseUrl = "https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/welcome-to-comprehensive-fusion-centre-operations";

const courseImageUrl = `${baseUrl}/fusion_course_cover.jpg`;

const hotspotsMap = {
  "lesson-1-intro-to-fusion-centre-operations": {
    image: `${baseUrl}/fusion_lesson_1.jpg`,
    hotspots: [
      { id: "h1-1", title: "Central Intelligence Display", content: "The main video wall aggregating real-time data from various agencies for centralized situational awareness.", x: 50, y: 30 },
      { id: "h1-2", title: "Operator Console", content: "Individual analyst workstations equipped with secure networks for deep-dive intelligence gathering.", x: 20, y: 70 },
      { id: "h1-3", title: "Multi-agency Liaisons", content: "Designated areas where representatives from different organizations coordinate a unified response.", x: 80, y: 60 }
    ]
  },
  "lesson-2-geospatial-intelligence": {
    image: `${baseUrl}/fusion_lesson_2.jpg`,
    hotspots: [
      { id: "h2-1", title: "Satellite Imagery Overlay", content: "High-resolution overhead imagery used to visually assess physical terrain and infrastructure.", x: 40, y: 40 },
      { id: "h2-2", title: "Threat Proximity Alert", content: "Geospatial markers indicating the distance between potential threats and critical assets.", x: 60, y: 50 },
      { id: "h2-3", title: "GIS Workstation", content: "Advanced mapping software used to layer demographic, environmental, and threat data.", x: 30, y: 80 }
    ]
  },
  "lesson-3-command-centre-operations": {
    image: `${baseUrl}/fusion_lesson_3.jpg`,
    hotspots: [
      { id: "h3-1", title: "Incident Command Board", content: "A dynamic dashboard tracking ongoing incidents, resource allocation, and response times.", x: 50, y: 20 },
      { id: "h3-2", title: "Emergency Response Comm", content: "Direct encrypted communication lines to field operatives and first responders.", x: 25, y: 65 },
      { id: "h3-3", title: "Real-time CCTV Feeds", content: "Live video feeds from strategically placed surveillance cameras across the operational area.", x: 75, y: 45 }
    ]
  },
  "lesson-4-cybersecurity-fundamentals": {
    image: `${baseUrl}/fusion_lesson_4.jpg`,
    hotspots: [
      { id: "h4-1", title: "Network Topology Map", content: "A visual representation of the organization's digital infrastructure, showing active nodes.", x: 45, y: 35 },
      { id: "h4-2", title: "Active Firewall Logs", content: "Real-time monitoring of incoming and outgoing traffic to identify potential intrusion attempts.", x: 15, y: 55 },
      { id: "h4-3", title: "Vulnerability Scanner", content: "Automated tools constantly probing the network for unpatched software or misconfigurations.", x: 85, y: 70 }
    ]
  },
  "lesson-5-data-analysis-and-visualization": {
    image: `${baseUrl}/fusion_lesson_4.jpg`, // Temporarily using lesson 4 image until quota resets
    hotspots: [
      { id: "h5-1", title: "Predictive Heatmap", content: "Visualizing areas with the highest statistical probability of future security incidents.", x: 60, y: 30 },
      { id: "h5-2", title: "Statistical Bar Charts", content: "Aggregated historical data comparing incident frequencies across different timeframes.", x: 20, y: 50 },
      { id: "h5-3", title: "Interactive Data Table", content: "Raw, sortable intelligence reports allowing analysts to drill down into specific events.", x: 80, y: 80 }
    ]
  },
  "lesson-6-unique-id": {
    image: `${baseUrl}/fusion_lesson_4.jpg`, // Temporarily using lesson 4 image
    hotspots: [
      { id: "h6-1", title: "Anomaly Detection Graph", content: "Machine learning output highlighting deviations from normal behavioral baselines.", x: 40, y: 40 },
      { id: "h6-2", title: "Predictive Modeling Engine", content: "Algorithmic forecasting of potential threat vectors based on current intelligence feeds.", x: 70, y: 60 },
      { id: "h6-3", title: "Threat Intelligence Feed", content: "Live streams of compromised indicators (IoCs) shared by global security partners.", x: 30, y: 70 }
    ]
  },
  "lesson-7-unique-id": {
    image: `${baseUrl}/fusion_lesson_4.jpg`, // Temporarily using lesson 4 image
    hotspots: [
      { id: "h7-1", title: "Real-time Analytics Dashboard", content: "Consolidated view of key performance indicators and active threat metrics.", x: 50, y: 25 },
      { id: "h7-2", title: "Cross-agency Data Integration", content: "Seamlessly merging databases from local and federal partners into a single view.", x: 20, y: 55 },
      { id: "h7-3", title: "Algorithmic Threat Scoring", content: "Automated prioritization of incoming threats based on potential impact and severity.", x: 80, y: 65 }
    ]
  },
  "lesson-8-unique-id": {
    image: `${baseUrl}/fusion_lesson_4.jpg`, // Temporarily using lesson 4 image
    hotspots: [
      { id: "h8-1", title: "Dynamic Threat Assessment", content: "Continuously updating profiles of known adversaries based on incoming intelligence.", x: 35, y: 35 },
      { id: "h8-2", title: "Multi-sensor Data Aggregator", content: "Fusing data from radar, cyber logs, and human intelligence into a cohesive narrative.", x: 65, y: 50 },
      { id: "h8-3", title: "Early Warning Alert System", content: "Automated triggers that notify key personnel when specific threat thresholds are breached.", x: 45, y: 80 }
    ]
  },
  "lesson-9-unique-id": {
    image: `${baseUrl}/fusion_lesson_4.jpg`, // Temporarily using lesson 4 image
    hotspots: [
      { id: "h9-1", title: "Secure Communication Gateway", content: "Encrypted channels ensuring that sensitive intelligence cannot be intercepted during transit.", x: 50, y: 40 },
      { id: "h9-2", title: "Data Sharing Agreement Log", content: "Digital records verifying that all information exchange complies with legal frameworks.", x: 20, y: 60 },
      { id: "h9-3", title: "Interoperability Protocol", content: "Standardized data formats allowing disparate agency systems to communicate seamlessly.", x: 80, y: 75 }
    ]
  },
  "lesson-10-advanced-fusion-centre-operations": {
    image: `${baseUrl}/fusion_lesson_4.jpg`, // Temporarily using lesson 4 image
    hotspots: [
      { id: "h10-1", title: "Neural Network Visualizer", content: "Graphical representation of deep learning models identifying complex threat patterns.", x: 40, y: 30 },
      { id: "h10-2", title: "Automated Threat Classifier", content: "AI system that instantly categorizes incoming alerts into specific threat types.", x: 70, y: 55 },
      { id: "h10-3", title: "Cognitive Computing Node", content: "Advanced processing unit capable of natural language processing on raw intelligence reports.", x: 30, y: 80 }
    ]
  }
};

async function main() {
  const snapshot = await db.collection("courses").where("slug", "==", slug).get();
  if (snapshot.empty) {
    console.error("Course not found in Firestore!");
    process.exit(1);
  }

  const docRef = snapshot.docs[0].ref;
  const docData = snapshot.docs[0].data();

  // Inject hotspots into Firestore customContent
  let customContent;
  if (typeof docData.customContent === "string") {
    customContent = JSON.parse(docData.customContent);
  } else {
    customContent = docData.customContent;
  }

  customContent.lessons = customContent.lessons.map((lesson: any) => {
    const config = (hotspotsMap as any)[lesson.key];
    if (config) {
      lesson.labeledGraphic = {
        imageUrl: config.image,
        hotspots: config.hotspots
      };
    }
    return lesson;
  });

  await docRef.update({
    imageUrl: courseImageUrl,
    customContent: JSON.stringify(customContent),
    updatedAt: new Date()
  });

  console.log(`✅ Firestore updated with hotspots and image URLs!`);

  // Update static-lms-courses.ts
  const staticPath = path.join(process.cwd(), "lib", "static-lms-courses.ts");
  let staticContent = fs.readFileSync(staticPath, "utf8");

  const slugPattern = `"slug": "${slug}"`;
  const slugIndex = staticContent.indexOf(slugPattern);
  
  if (slugIndex !== -1) {
    let courseStart = slugIndex;
    while (courseStart > 0 && staticContent[courseStart] !== '{') courseStart--;
    
    let courseEnd = courseStart;
    let braceCount = 0;
    for (let i = courseStart; i < staticContent.length; i++) {
      if (staticContent[i] === '{') braceCount++;
      if (staticContent[i] === '}') braceCount--;
      if (braceCount === 0) {
        courseEnd = i;
        break;
      }
    }
    
    const courseBlock = staticContent.substring(courseStart, courseEnd + 1);
    
    // Replace imageUrl
    let newBlock = courseBlock;
    const imgMatch = courseBlock.match(/"imageUrl":\s*(null|"[^"]+")/);
    if (imgMatch) {
      newBlock = newBlock.replace(imgMatch[0], `"imageUrl": "${courseImageUrl}"`);
    }

    // Replace customContent
    const customContentMatch = courseBlock.match(/"customContent":\s*"((?:[^"\\]|\\.)*)"/);
    if (customContentMatch) {
      const escapedCustomContent = JSON.stringify(JSON.stringify(customContent)).slice(1, -1);
      newBlock = newBlock.replace(customContentMatch[1], escapedCustomContent);
    }

    staticContent = staticContent.replace(courseBlock, newBlock);
    fs.writeFileSync(staticPath, staticContent);
    console.log("✅ static-lms-courses.ts updated!");
  } else {
    console.log("Slug not found in static-lms-courses.ts!");
  }

  process.exit(0);
}

main().catch(console.error);
