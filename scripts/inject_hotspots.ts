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

// Hotspots for each lesson
const lessonHotspots: Record<string, { imageFile: string; hotspots: { id: string; x: number; y: number; title: string; content: string }[] }> = {
  "lesson-1-drone-fundamentals": {
    imageFile: "lesson1_aerodynamics.png",
    hotspots: [
      { id: "hs-1-1", x: 30, y: 40, title: "Wind Tunnel Airflow Visualization", content: "Smoke or particle traces reveal how airflow separates and reattaches over the drone's wing, highlighting regions of lift generation and drag formation critical to fixed-wing aerodynamic design." },
      { id: "hs-1-2", x: 65, y: 25, title: "Cambered Wing Cross-Section", content: "The asymmetric curvature of the wing accelerates air over the upper surface, creating a pressure differential that produces lift — the fundamental force keeping the drone airborne." },
      { id: "hs-1-3", x: 50, y: 60, title: "Brushless DC Motor & ESC Assembly", content: "High-efficiency brushless motors paired with electronic speed controllers deliver precise thrust control. The ESC regulates motor RPM based on flight controller commands." },
      { id: "hs-1-4", x: 80, y: 50, title: "Propeller Pitch & Diameter Optimization", content: "Propeller efficiency depends on the ratio of pitch to diameter — a higher pitch moves more air per revolution but requires more torque, while larger diameters improve low-speed thrust." }
    ]
  },
  "lesson-2-drone-control-systems": {
    imageFile: "lesson2_control_systems.png",
    hotspots: [
      { id: "hs-2-1", x: 35, y: 35, title: "PID Controller Tuning Interface", content: "The Proportional-Integral-Derivative algorithm is tuned by adjusting Kp, Ki, and Kd gains. Proper tuning eliminates oscillation and ensures crisp, responsive flight characteristics." },
      { id: "hs-2-2", x: 70, y: 45, title: "Flight Control Computer (FCC)", content: "The FCC is the central processing unit that fuses sensor data from accelerometers, gyroscopes, and GPS to calculate real-time control commands sent to the ESCs." },
      { id: "hs-2-3", x: 25, y: 65, title: "IMU Sensor Cluster", content: "The Inertial Measurement Unit combines 3-axis accelerometers and gyroscopes to track the drone's orientation and angular velocity at high sample rates, feeding data into the control loop." },
      { id: "hs-2-4", x: 60, y: 20, title: "Real-Time Telemetry Dashboard", content: "Live telemetry streams roll, pitch, yaw, altitude, and motor RPM data back to the ground station, enabling engineers to monitor flight performance and diagnose control issues." },
      { id: "hs-2-5", x: 85, y: 70, title: "Indoor Flight Test Cage", content: "Netted enclosures provide a safe environment for testing control algorithm changes without risk of flyaway incidents or damage to the prototype airframe." }
    ]
  },
  "lesson-3-drone-sensors-and-navigation": {
    imageFile: "lesson3_sensors_navigation.png",
    hotspots: [
      { id: "hs-3-1", x: 40, y: 50, title: "GNSS/GPS Antenna Module", content: "Multi-constellation GPS receivers (GPS, GLONASS, Galileo) provide sub-meter positioning accuracy. RTK corrections can further improve this to centimeter-level precision for survey operations." },
      { id: "hs-3-2", x: 70, y: 35, title: "Ground Control Station (GCS)", content: "The ruggedized portable GCS displays real-time waypoint maps, satellite lock status, and flight parameters, enabling operators to plan and monitor autonomous survey missions." },
      { id: "hs-3-3", x: 20, y: 60, title: "IMU Calibration Procedure", content: "Before each flight, accelerometers and gyroscopes must be calibrated on a level surface to establish accurate reference frames for the navigation Kalman filter." },
      { id: "hs-3-4", x: 55, y: 75, title: "Vision-Based Navigation Backup", content: "Optical flow cameras and computer vision algorithms provide redundant positioning data when GPS signals are degraded in urban canyons or under dense canopy." }
    ]
  },
  "lesson-4-drone-communication-systems": {
    imageFile: "lesson4_communication.png",
    hotspots: [
      { id: "hs-4-1", x: 45, y: 40, title: "RF Spectrum Analyzer", content: "Analyzes the frequency spectrum to identify signal interference, measure signal strength, and ensure the communication link operates on clean, legal frequency bands." },
      { id: "hs-4-2", x: 75, y: 55, title: "Antenna Array Design", content: "High-gain directional and omnidirectional antennas are positioned to optimize signal propagation and minimize dead zones during long-range flights." },
      { id: "hs-4-3", x: 25, y: 65, title: "Data Link Dashboard", content: "Monitors packet loss, latency, and signal-to-noise ratio in real-time, providing critical feedback on the health of the command and control (C2) link." }
    ]
  },
  "lesson-5-drone-power-and-propulsion": {
    imageFile: "lesson5_power_propulsion.png",
    hotspots: [
      { id: "hs-5-1", x: 50, y: 50, title: "High-Capacity LiPo Battery", content: "Lithium Polymer batteries offer high energy density and discharge rates, essential for powering heavy-lift multirotors during sustained flight operations." },
      { id: "hs-5-2", x: 30, y: 35, title: "Thermal Imaging of ESCs", content: "Monitoring heat dissipation is critical. Overheating ESCs can lead to system failure; thermal analysis ensures proper cooling design." },
      { id: "hs-5-3", x: 70, y: 60, title: "Heavy-Duty Brushless Motor", content: "Large stator and high-quality magnets provide the immense torque required to spin large diameter propellers for enterprise payloads." }
    ]
  },
  "lesson-6-drone-aerodynamics-and-performance": {
    imageFile: "lesson6_aerodynamics_performance.png",
    hotspots: [
      { id: "hs-6-1", x: 40, y: 45, title: "CFD Heat Map", content: "Computational Fluid Dynamics simulations visualize pressure gradients and velocity vectors, allowing engineers to optimize the airframe for maximum lift-to-drag ratio." },
      { id: "hs-6-2", x: 80, y: 65, title: "3D Printed Prototype Wing", content: "Rapid prototyping allows for physical wind tunnel validation of aerodynamic designs conceptualized in CAD software." },
      { id: "hs-6-3", x: 20, y: 30, title: "Performance Analysis Dashboard", content: "Metrics such as theoretical endurance, cruise speed, and stall speed are calculated based on aerodynamic efficiency and propulsion specifications." }
    ]
  },
  "lesson-7-drone-stability-and-control": {
    imageFile: "lesson7_stability_control.png",
    hotspots: [
      { id: "hs-7-1", x: 55, y: 45, title: "Multi-Axis Gimbal Test Stand", content: "Allows the drone to rotate freely on multiple axes, enabling engineers to safely test the flight controller's ability to recover from extreme attitudes." },
      { id: "hs-7-2", x: 35, y: 60, title: "Dynamic Stability Graphs", content: "Real-time plotting of the drone's orientation against setpoints helps evaluate the damping and response time of the stability augmentation system." },
      { id: "hs-7-3", x: 75, y: 30, title: "Remote Override Controller", content: "Ensures that engineers can manually intervene or cut power instantly if the automated control algorithms induce dangerous oscillations." }
    ]
  },
  "lesson-8-drone-sensors-and-data-fusion": {
    imageFile: "lesson8_sensors_fusion.png",
    hotspots: [
      { id: "hs-8-1", x: 45, y: 55, title: "LiDAR Payload", content: "Light Detection and Ranging sensors create highly accurate 3D point clouds of the environment, crucial for mapping and obstacle avoidance." },
      { id: "hs-8-2", x: 65, y: 40, title: "Multispectral Camera", content: "Captures data across specific wavelengths of light, useful in precision agriculture and environmental monitoring." },
      { id: "hs-8-3", x: 25, y: 50, title: "Sensor Data Fusion Engine", content: "Advanced algorithms like the Kalman filter combine data from LiDAR, cameras, and IMUs to create a robust and accurate representation of the drone's state and surroundings." }
    ]
  },
  "lesson-9-drone-communication-and-navigation": {
    imageFile: "lesson9_communication_navigation.png",
    hotspots: [
      { id: "hs-9-1", x: 50, y: 40, title: "Satellite Tracking Data", content: "Monitoring the constellation of visible GPS satellites and their signal strengths ensures reliable navigation data for autonomous waypoint missions." },
      { id: "hs-9-2", x: 30, y: 60, title: "Encrypted RF Links", content: "Secure communication protocols protect command and control data from interception or spoofing during sensitive operations." },
      { id: "hs-9-3", x: 75, y: 45, title: "Global Map Interface", content: "Provides the operator with situational awareness, displaying the drone's live position, planned route, and no-fly zones." }
    ]
  },
  "advanced-drone-system-integration": {
    imageFile: "lesson10_system_integration.png",
    hotspots: [
      { id: "hs-10-1", x: 40, y: 50, title: "Avionics Wiring Harness", content: "Careful routing and shielding of communication and power cables are essential to prevent electromagnetic interference (EMI) between subsystems." },
      { id: "hs-10-2", x: 70, y: 65, title: "Carbon Fiber Payload Bay", content: "Lightweight and rigid materials are used to construct the airframe and payload bays, maximizing the drone's carrying capacity and flight endurance." },
      { id: "hs-10-3", x: 25, y: 45, title: "Pre-Flight Diagnostics", content: "Comprehensive software checks verify the health and calibration of all integrated systems—propulsion, sensors, and communications—before launch." }
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
  const slugPattern = `"slug": "the-complete-drone-technology-masterclass"`;
  const slugIndex = staticContent.indexOf(slugPattern);
  
  if (slugIndex === -1) {
    console.log("⚠️ Course not found in static-lms-courses.ts — skipping static update.");
  } else {
    let braceCount = 0;
    let courseStart = slugIndex;
    while (courseStart > 0 && staticContent[courseStart] !== '{') {
      courseStart--;
    }
    
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
    
    const oldCustomContentMatch = courseBlock.match(/"customContent":\s*"((?:[^"\\]|\\.)*)"/);
    if (oldCustomContentMatch) {
      const escapedCustomContent = JSON.stringify(updatedCustomContent).slice(1, -1);
      const newBlock = courseBlock
        .replace(oldCustomContentMatch[0], `"customContent": ${JSON.stringify(updatedCustomContent)}`)
        .replace(/"imageUrl":\s*[^,}]*/, `"imageUrl": "${COVER_URL}"`);
      
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
