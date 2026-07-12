import { db } from "../lib/db"
import { courses } from "../lib/db/schema"
import { eq } from "drizzle-orm"

async function run() {
  console.log("Fetching course...")
  const courseList = await db.select().from(courses).where(eq(courses.slug, "the-intersection-of-cybersecurity-and-computer-networking"))
  if (courseList.length === 0) {
    console.error("Course not found!")
    process.exit(1)
  }
  
  const course = courseList[0]
  if (!course.customContent) {
    console.error("No custom content found!")
    process.exit(1)
  }
  
  const data = JSON.parse(course.customContent)
  
  // Lesson 1
  const lesson1 = data.lessons.find((l: any) => l.title.includes("Introduction to Cybersecurity") || l.title.includes("Synergy"))
  if (lesson1) {
    lesson1.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson1_intro.png",
      hotspots: [
        { id: "hotspot-1-1", x: 50, y: 50, title: "CIA Triad", content: "Confidentiality, Integrity, and Availability form the foundation of cybersecurity. Every security control should protect sensitive information, maintain data accuracy, and ensure systems remain accessible when needed." },
        { id: "hotspot-1-2", x: 80, y: 50, title: "Cyber Threats", content: "Cyber threats such as malware, phishing, ransomware, and insider attacks continuously evolve, making proactive monitoring and awareness essential." },
        { id: "hotspot-1-3", x: 20, y: 50, title: "Security Operations Center", content: "The Security Operations Center (SOC) serves as the organization's central hub for continuously monitoring, detecting, analyzing, and responding to cybersecurity incidents." }
      ]
    }
    console.log("Updated Lesson 1")
  }

  // Lesson 2
  const lesson2 = data.lessons.find((l: any) => l.title.includes("Core Networking Concepts") || l.title.includes("Risk Management"))
  if (lesson2) {
    lesson2.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson2_risk_mgmt.png",
      hotspots: [
        { id: "hotspot-2-1", x: 50, y: 50, title: "Risk Assessment", content: "Organizations identify valuable assets, evaluate potential threats and vulnerabilities, and determine the likelihood and impact of cyber risks before selecting appropriate controls." },
        { id: "hotspot-2-2", x: 20, y: 20, title: "Security Governance", content: "Effective governance establishes policies, assigns responsibilities, and ensures cybersecurity aligns with organizational objectives and regulatory requirements." },
        { id: "hotspot-2-3", x: 80, y: 80, title: "Compliance Management", content: "Compliance with standards, regulations, and organizational policies helps reduce legal risk while strengthening overall cybersecurity maturity." }
      ]
    }
    console.log("Updated Lesson 2")
  }

  // Lesson 3
  const lesson3 = data.lessons.find((l: any) => l.title.includes("Network Security Architectures") || l.title.includes("Infrastructure Protection"))
  if (lesson3) {
    lesson3.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson3_network_sec.png",
      hotspots: [
        { id: "hotspot-3-1", x: 50, y: 50, title: "Network Segmentation", content: "Segmenting enterprise networks limits the spread of cyberattacks and improves security by separating critical systems from general user environments." },
        { id: "hotspot-3-2", x: 80, y: 50, title: "Firewall Protection", content: "Firewalls inspect and control incoming and outgoing network traffic, preventing unauthorized access while allowing legitimate communications." },
        { id: "hotspot-3-3", x: 20, y: 50, title: "Intrusion Detection", content: "Intrusion detection and monitoring systems continuously analyze network activity to identify suspicious behavior and support rapid incident response." }
      ]
    }
    console.log("Updated Lesson 3")
  }

  // Lesson 4
  const lesson4 = data.lessons.find((l: any) => l.title.includes("Identity and Access Management") || l.title.includes("Common Network Attacks"))
  if (lesson4) {
    lesson4.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson4_iam.png",
      hotspots: [
        { id: "hotspot-4-1", x: 50, y: 50, title: "Multi-Factor Authentication", content: "Multi-factor authentication strengthens account security by requiring users to verify their identity using two or more independent authentication factors before gaining access." },
        { id: "hotspot-4-2", x: 20, y: 45, title: "Role-Based Access Control", content: "Role-Based Access Control (RBAC) ensures users receive only the permissions required for their job responsibilities, reducing unnecessary access and limiting security risks." },
        { id: "hotspot-4-3", x: 80, y: 45, title: "Privileged Access Management", content: "Privileged accounts require additional monitoring and protection because they provide elevated access to critical systems and sensitive organizational resources." }
      ]
    }
    console.log("Updated Lesson 4")
  }

  // Lesson 5
  const lesson5 = data.lessons.find((l: any) => l.title.includes("Incident Response") || l.title.includes("Secure Network Protocols"))
  if (lesson5) {
    lesson5.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson5_incident_response.png",
      hotspots: [
        { id: "hotspot-5-1", x: 50, y: 40, title: "Incident Lifecycle", content: "Effective incident response follows a structured process including preparation, identification, containment, eradication, recovery, and lessons learned to minimize business disruption." },
        { id: "hotspot-5-2", x: 25, y: 75, title: "Digital Evidence", content: "Digital forensic investigations preserve and analyze electronic evidence to determine how an incident occurred and support legal or regulatory requirements." },
        { id: "hotspot-5-3", x: 75, y: 50, title: "Threat Containment", content: "Rapid containment prevents attackers from spreading through enterprise systems while response teams work to eliminate the threat and restore operations." }
      ]
    }
    console.log("Updated Lesson 5")
  }

  // Lesson 6
  const lesson6 = data.lessons.find((l: any) => l.title.includes("Cloud Security") || l.title.includes("Emerging Technologies") || l.title.includes("Network Forensics"))
  if (lesson6) {
    lesson6.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson6_cloud_security.png",
      hotspots: [
        { id: "hotspot-6-1", x: 50, y: 45, title: "Cloud Security", content: "Cloud security protects applications, data, and infrastructure through secure configurations, encryption, continuous monitoring, and shared responsibility between providers and customers." },
        { id: "hotspot-6-2", x: 20, y: 50, title: "Zero Trust", content: "Zero Trust assumes no user or device is automatically trusted, requiring continuous verification before granting or maintaining access to organizational resources." },
        { id: "hotspot-6-3", x: 80, y: 50, title: "AI-Powered Security", content: "Artificial intelligence strengthens cybersecurity by identifying anomalies, detecting threats faster, and automating security monitoring and response activities." }
      ]
    }
    console.log("Updated Lesson 6")
  }

  // Lesson 7
  const lesson7 = data.lessons.find((l: any) => l.title.includes("Data Protection") || l.title.includes("Regulatory Compliance"))
  if (lesson7) {
    lesson7.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson7_compliance.png",
      hotspots: [
        { id: "hotspot-7-1", x: 50, y: 45, title: "Data Privacy", content: "Organizations must protect personal and sensitive information throughout its lifecycle by implementing appropriate security controls, access restrictions, and privacy policies." },
        { id: "hotspot-7-2", x: 25, y: 55, title: "NDPR Compliance", content: "Compliance with the Nigeria Data Protection Regulation (NDPR) helps organizations safeguard personal data, maintain public trust, and avoid regulatory penalties." },
        { id: "hotspot-7-3", x: 75, y: 50, title: "Data Encryption", content: "Encryption protects sensitive information by converting readable data into a secure format that can only be accessed by authorized users with the correct decryption keys." }
      ]
    }
    console.log("Updated Lesson 7")
  }

  // Lesson 8
  const lesson8 = data.lessons.find((l: any) => l.title.includes("Business Continuity") || l.title.includes("Disaster Recovery") || l.title.includes("Emerging Threats"))
  if (lesson8) {
    lesson8.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson8_disaster_recovery.png",
      hotspots: [
        { id: "hotspot-8-1", x: 50, y: 40, title: "Business Continuity", content: "Business continuity planning ensures that critical operations continue during cyber incidents, natural disasters, or system failures with minimal disruption." },
        { id: "hotspot-8-2", x: 80, y: 50, title: "Disaster Recovery", content: "Disaster recovery focuses on restoring systems, applications, and data quickly after an incident to minimize downtime and business losses." },
        { id: "hotspot-8-3", x: 25, y: 70, title: "Backup Strategy", content: "Regular, secure, and tested backups provide organizations with the ability to recover essential information following ransomware attacks or infrastructure failures." }
      ]
    }
    console.log("Updated Lesson 8")
  }

  // Lesson 9
  const lesson9 = data.lessons.find((l: any) => l.title.includes("Future Trends") || l.title.includes("Emerging Threats"))
  if (lesson9) {
    lesson9.labeledGraphic = {
      imageUrl: "/assets/cyber/lesson9_future_trends.png",
      hotspots: [
        { id: "hotspot-9-1", x: 50, y: 45, title: "Artificial Intelligence", content: "Artificial Intelligence is transforming cybersecurity by automating threat detection, improving predictive analytics, and accelerating incident response across enterprise environments." },
        { id: "hotspot-9-2", x: 20, y: 50, title: "Zero Trust Evolution", content: "Modern Zero Trust architectures continuously verify users, devices, and applications to reduce attack surfaces and strengthen enterprise security." },
        { id: "hotspot-9-3", x: 80, y: 45, title: "Quantum-Ready Security", content: "Organizations are preparing for the impact of quantum computing by researching quantum-resistant encryption methods that will protect future digital communications." }
      ]
    }
    console.log("Updated Lesson 9")
  }

  console.log("Updating database...")
  await db.update(courses)
    .set({ 
      customContent: JSON.stringify(data),
      imageUrl: "/assets/cyber/course_cover_cybersecurity.png"
    })
    .where(eq(courses.slug, "the-intersection-of-cybersecurity-and-computer-networking"))
  
  console.log("Done! 🎉")
  process.exit(0)
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
