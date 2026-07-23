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
const CDN_BASE = "https://cdn.jsdelivr.net/gh/QuisTech/eib-lms-images@main/the-complete-drone-technology-masterclass";

const COVER_URL = `${CDN_BASE}/cover.png`;

// Hotspots for each lesson (only lessons with generated images get labeledGraphic)
const lessonHotspots: Record<string, { imageFile: string; hotspots: { id: string; x: number; y: number; title: string; content: string }[] }> = {
  "lesson-1-drone-fundamentals": {
    imageFile: "lesson1_aerodynamics.png",
    hotspots: [
      {
        id: "hs-1-1", x: 30, y: 40,
        title: "Wind Tunnel Airflow Visualization",
        content: "Smoke or particle traces reveal how airflow separates and reattaches over the drone's wing, highlighting regions of lift generation and drag formation critical to fixed-wing aerodynamic design."
      },
      {
        id: "hs-1-2", x: 65, y: 25,
        title: "Cambered Wing Cross-Section",
        content: "The asymmetric curvature of the wing accelerates air over the upper surface, creating a pressure differential that produces lift — the fundamental force keeping the drone airborne."
      },
      {
        id: "hs-1-3", x: 50, y: 60,
        title: "Brushless DC Motor & ESC Assembly",
        content: "High-efficiency brushless motors paired with electronic speed controllers deliver precise thrust control. The ESC regulates motor RPM based on flight controller commands."
      },
      {
        id: "hs-1-4", x: 80, y: 50,
        title: "Propeller Pitch & Diameter Optimization",
        content: "Propeller efficiency depends on the ratio of pitch to diameter — a higher pitch moves more air per revolution but requires more torque, while larger diameters improve low-speed thrust."
      }
    ]
  },
  "lesson-2-drone-control-systems": {
    imageFile: "lesson2_control_systems.png",
    hotspots: [
      {
        id: "hs-2-1", x: 35, y: 35,
        title: "PID Controller Tuning Interface",
        content: "The Proportional-Integral-Derivative algorithm is tuned by adjusting Kp, Ki, and Kd gains. Proper tuning eliminates oscillation and ensures crisp, responsive flight characteristics."
      },
      {
        id: "hs-2-2", x: 70, y: 45,
        title: "Flight Control Computer (FCC)",
        content: "The FCC is the central processing unit that fuses sensor data from accelerometers, gyroscopes, and GPS to calculate real-time control commands sent to the ESCs."
      },
      {
        id: "hs-2-3", x: 25, y: 65,
        title: "IMU Sensor Cluster",
        content: "The Inertial Measurement Unit combines 3-axis accelerometers and gyroscopes to track the drone's orientation and angular velocity at high sample rates, feeding data into the control loop."
      },
      {
        id: "hs-2-4", x: 60, y: 20,
        title: "Real-Time Telemetry Dashboard",
        content: "Live telemetry streams roll, pitch, yaw, altitude, and motor RPM data back to the ground station, enabling engineers to monitor flight performance and diagnose control issues."
      },
      {
        id: "hs-2-5", x: 85, y: 70,
        title: "Indoor Flight Test Cage",
        content: "Netted enclosures provide a safe environment for testing control algorithm changes without risk of flyaway incidents or damage to the prototype airframe."
      }
    ]
  },
  "lesson-3-drone-sensors-and-navigation": {
    imageFile: "lesson3_sensors_navigation.png",
    hotspots: [
      {
        id: "hs-3-1", x: 40, y: 50,
        title: "GNSS/GPS Antenna Module",
        content: "Multi-constellation GPS receivers (GPS, GLONASS, Galileo) provide sub-meter positioning accuracy. RTK corrections can further improve this to centimeter-level precision for survey operations."
      },
      {
        id: "hs-3-2", x: 70, y: 35,
        title: "Ground Control Station (GCS)",
        content: "The ruggedized portable GCS displays real-time waypoint maps, satellite lock status, and flight parameters, enabling operators to plan and monitor autonomous survey missions."
      },
      {
        id: "hs-3-3", x: 20, y: 60,
        title: "IMU Calibration Procedure",
        content: "Before each flight, accelerometers and gyroscopes must be calibrated on a level surface to establish accurate reference frames for the navigation Kalman filter."
      },
      {
        id: "hs-3-4", x: 55, y: 75,
        title: "Vision-Based Navigation Backup",
        content: "Optical flow cameras and computer vision algorithms provide redundant positioning data when GPS signals are degraded in urban canyons or under dense canopy."
      }
    ]
  }
};

async function main() {
  // 1. Fetch the course from Firestore
  const snapshot = await db.collection("courses").where("slug", "==", "the-complete-drone-technology-masterclass").get();
  if (snapshot.empty) {
    console.error("Course not found!");
    process.exit(1);
  }

  const docRef = snapshot.docs[0].ref;
  const courseData = snapshot.docs[0].data();

  // 2. Parse customContent
  let customContent: any;
  try {
    customContent = JSON.parse(courseData.customContent);
  } catch (e) {
    console.error("Failed to parse customContent:", e);
    process.exit(1);
  }

  // 3. Inject labeledGraphic into lessons that have images
  let injectedCount = 0;
  for (const lesson of customContent.lessons) {
    const hotspotData = lessonHotspots[lesson.key];
    if (hotspotData) {
      lesson.labeledGraphic = {
        imageUrl: `${CDN_BASE}/${hotspotData.imageFile}`,
        hotspots: hotspotData.hotspots
      };
      injectedCount++;
      console.log(`  ✅ Injected hotspots for: ${lesson.title} (${hotspotData.hotspots.length} hotspots)`);
    } else {
      console.log(`  ⏭️ Skipping (no image yet): ${lesson.title}`);
    }
  }

  // 4. Update Firestore
  const updatedCustomContent = JSON.stringify(customContent);
  await docRef.update({
    customContent: updatedCustomContent,
    imageUrl: COVER_URL,
    updatedAt: new Date()
  });

  console.log(`\n✅ Firestore updated! Cover image set. ${injectedCount} lessons enriched with hotspots.`);

  // 5. Also update static-lms-courses.ts
  const staticPath = path.join(process.cwd(), "lib", "static-lms-courses.ts");
  let staticContent = fs.readFileSync(staticPath, "utf8");

  // Find the drone course entry and update its imageUrl and customContent
  const courseIdStr = String(courseData.id);
  
  // Use a regex to find the course block by slug
  const slugPattern = `"slug": "the-complete-drone-technology-masterclass"`;
  const slugIndex = staticContent.indexOf(slugPattern);
  
  if (slugIndex === -1) {
    console.log("⚠️ Course not found in static-lms-courses.ts — skipping static update.");
  } else {
    // Find the opening brace of this course object
    let braceCount = 0;
    let courseStart = slugIndex;
    while (courseStart > 0 && staticContent[courseStart] !== '{') {
      courseStart--;
    }
    
    // Find the closing brace
    let courseEnd = courseStart;
    braceCount = 0;
    for (let i = courseStart; i < staticContent.length; i++) {
      if (staticContent[i] === '{') braceCount++;
      if (staticContent[i] === '}') braceCount--;
      if (braceCount === 0) {
        courseEnd = i;
        break;
      }
    }
    
    const courseBlock = staticContent.substring(courseStart, courseEnd + 1);
    
    // Replace customContent in the block
    const oldCustomContentMatch = courseBlock.match(/"customContent":\s*"((?:[^"\\]|\\.)*)"/);
    if (oldCustomContentMatch) {
      const escapedCustomContent = JSON.stringify(updatedCustomContent).slice(1, -1); // Remove outer quotes
      const newBlock = courseBlock
        .replace(oldCustomContentMatch[0], `"customContent": ${JSON.stringify(updatedCustomContent)}`)
        .replace(/"imageUrl":\s*[^,}]*/, `"imageUrl": "${COVER_URL}"`);
      
      // If imageUrl doesn't exist in the block, add it before enrollmentCount
      if (!courseBlock.includes('"imageUrl"')) {
        const enrollmentIndex = newBlock.indexOf('"enrollmentCount"');
        if (enrollmentIndex !== -1) {
          const updatedBlock = newBlock.substring(0, enrollmentIndex) + `"imageUrl": "${COVER_URL}",\n    ` + newBlock.substring(enrollmentIndex);
          staticContent = staticContent.replace(courseBlock, updatedBlock);
        }
      } else {
        staticContent = staticContent.replace(courseBlock, newBlock);
      }
      
      fs.writeFileSync(staticPath, staticContent);
      console.log("✅ static-lms-courses.ts updated!");
    } else {
      console.log("⚠️ Could not find customContent in static course block.");
    }
  }

  process.exit(0);
}

main().catch(console.error);
