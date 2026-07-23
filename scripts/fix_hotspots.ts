import fs from 'fs';
import path from 'path';
import { STATIC_LMS_COURSE_DATA } from '../lib/static-lms-courses';

const slug = 'advanced-digital-intelligence-operations-manual';

const customizedHotspots = [
  // Lesson 1: Introduction
  [
    { id: "hotspot-0-1", x: 25, y: 35, title: "Information vs Intelligence", content: "Raw data must be processed and analyzed to become actionable intelligence." },
    { id: "hotspot-0-2", x: 65, y: 45, title: "Actionable Insights", content: "Intelligence supports informed decision-making and strategic operational objectives." },
    { id: "hotspot-0-3", x: 45, y: 75, title: "Proactive Posture", content: "Enables organizations to anticipate threats and opportunities rather than just reacting." }
  ],
  // Lesson 2: Intelligence Cycle
  [
    { id: "hotspot-1-1", x: 20, y: 30, title: "Planning & Direction", content: "Defining intelligence requirements and determining exactly what needs to be known." },
    { id: "hotspot-1-2", x: 50, y: 50, title: "Collection & Processing", content: "Gathering raw data from sources and converting it into a usable, structured format." },
    { id: "hotspot-1-3", x: 80, y: 70, title: "Analysis & Dissemination", content: "Interpreting data to produce intelligence and delivering it effectively to decision-makers." }
  ],
  // Lesson 3: Critical Thinking
  [
    { id: "hotspot-2-1", x: 30, y: 40, title: "Cognitive Biases", content: "Recognizing and mitigating inherent biases that can distort analytical reasoning." },
    { id: "hotspot-2-2", x: 70, y: 35, title: "Structured Techniques", content: "Using formal methodologies to ensure objective, rigorous, and consistent analysis." },
    { id: "hotspot-2-3", x: 50, y: 75, title: "Hypothesis Testing", content: "Continuously evaluating competing explanations against the available verified evidence." }
  ],
  // Lesson 4: Legal Framework
  [
    { id: "hotspot-3-1", x: 25, y: 45, title: "Rule of Law", content: "Ensuring all intelligence gathering complies strictly with legal boundaries and jurisdictions." },
    { id: "hotspot-3-2", x: 75, y: 40, title: "Privacy Rights", content: "Respecting individual privacy rights and avoiding unauthorized data intrusion." },
    { id: "hotspot-3-3", x: 50, y: 80, title: "Ethical Standards", content: "Maintaining professional integrity to produce credible, court-defensible evidence." }
  ],
  // Lesson 5: OSINT
  [
    { id: "hotspot-4-1", x: 35, y: 30, title: "Publicly Available Data", content: "Sourcing valuable investigative intelligence from open, unclassified, and accessible sources." },
    { id: "hotspot-4-2", x: 65, y: 55, title: "Disciplined Methodology", content: "Applying systematic collection and rigorous evaluation to vast public information streams." },
    { id: "hotspot-4-3", x: 45, y: 80, title: "Operational Value", content: "Transforming scattered digital footprints into a cohesive and actionable intelligence picture." }
  ],
  // Lesson 6: OSINT Methodology
  [
    { id: "hotspot-5-1", x: 20, y: 40, title: "Intelligence Requirements", content: "Starting every investigation with clear, well-defined operational objectives." },
    { id: "hotspot-5-2", x: 60, y: 35, title: "Validation Process", content: "Verifying the authenticity, accuracy, and reliability of all collected sources." },
    { id: "hotspot-5-3", x: 80, y: 75, title: "Continuous Review", content: "Evaluating the intelligence lifecycle to refine collection methods and improve quality." }
  ],
  // Lesson 7: Digital Footprints
  [
    { id: "hotspot-6-1", x: 25, y: 45, title: "Active vs Passive Traces", content: "Differentiating between intentionally shared data and unintentional background metadata." },
    { id: "hotspot-6-2", x: 70, y: 40, title: "Correlation of Indicators", content: "Combining multiple independent data points to reveal behavioral patterns and timelines." },
    { id: "hotspot-6-3", x: 50, y: 80, title: "Identity Attribution", content: "Linking digital behavior and artifact traces to real-world individuals and networks." }
  ],
  // Lesson 8: SEINT
  [
    { id: "hotspot-7-1", x: 30, y: 30, title: "Advanced Operators", content: "Using specific search syntax (e.g., site:, filetype:) to narrow and target search results precisely." },
    { id: "hotspot-7-2", x: 75, y: 50, title: "Source Evaluation", content: "Critically assessing the credibility, bias, and context of search engine findings." },
    { id: "hotspot-7-3", x: 40, y: 75, title: "Systematic Documentation", content: "Recording search strategies and results meticulously to ensure reproducible intelligence." }
  ]
];

function updateStaticCourses() {
  const filePath = path.resolve(__dirname, '../lib/static-lms-courses.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // The file exports STATIC_LMS_COURSE_DATA as a JSON-like array assignment
  // This is tricky to parse safely if we just read it, but we can do a targeted string replacement
  // by parsing the course customContent string directly since it's a known format.
  
  // Actually, rewriting the whole file based on the memory object is safer if it's perfectly standard,
  // but it contains dates. Let's do a regex replacement for this specific course.

  const courseIndex = STATIC_LMS_COURSE_DATA.findIndex(c => c.slug === slug);
  if (courseIndex === -1) throw new Error("Course not found");

  const course = STATIC_LMS_COURSE_DATA[courseIndex];
  const customContent = JSON.parse(course.customContent);
  
  customContent.lessons.forEach((lesson: any, i: number) => {
    if (lesson.labeledGraphic && customizedHotspots[i]) {
      lesson.labeledGraphic.hotspots = customizedHotspots[i];
    }
  });

  const updatedCustomContentString = JSON.stringify(customContent);
  
  course.customContent = updatedCustomContentString;

  // Re-generate the entire file
  const fileContent = `import type { Course } from "@/lib/types"

export type StaticLmsCourse = Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string | Date
  updatedAt: string | Date
}

// Generated by Hybrid Sync
export const STATIC_LMS_COURSE_DATA: StaticLmsCourse[] = ${JSON.stringify(STATIC_LMS_COURSE_DATA, null, 2)}

function hydrateCourse(course: StaticLmsCourse): Course {
  return {
    ...course,
    createdAt: course.createdAt instanceof Date ? course.createdAt : new Date(course.createdAt),
    updatedAt: course.updatedAt instanceof Date ? course.updatedAt : new Date(course.updatedAt),
  }
}

export function getStaticLmsCourses(): Course[] {
  return STATIC_LMS_COURSE_DATA.map(hydrateCourse).sort((a, b) => {
    const category = a.category.localeCompare(b.category)
    return category !== 0 ? category : a.title.localeCompare(b.title)
  })
}

export function hasStaticLmsCourses(): boolean {
  return STATIC_LMS_COURSE_DATA.length > 0
}

export function getStaticLmsCourseBySlug(slug: string): Course | null {
  const course = STATIC_LMS_COURSE_DATA.find((item) => item.slug === slug)
  return course ? hydrateCourse(course) : null
}

export function getStaticLmsCourseById(id: number): Course | null {
  const course = STATIC_LMS_COURSE_DATA.find((item) => item.id === id)
  return course ? hydrateCourse(course) : null
}
`;

  fs.writeFileSync(filePath, fileContent);
  console.log("Updated static-lms-courses.ts with customized hotspots.");
}

updateStaticCourses();
