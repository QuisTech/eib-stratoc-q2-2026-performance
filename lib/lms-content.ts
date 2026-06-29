import type { Course } from "@/lib/db/schema"

// ---------------------------------------------------------------------------
// Curated LMS content lives in code (version-controlled, easy to author well).
// Per-user STATE (lesson completion, quiz attempts, certificates) lives in the
// database, scoped by userId. Lessons and quizzes are derived deterministically
// from each course's metadata so every one of the 17 courses has real,
// readable material and a subject-relevant assessment.
// ---------------------------------------------------------------------------

export const QUIZ_PASS_THRESHOLD = 80 // percent required to pass

export type LessonSection = { heading: string; body: string[] }
export type Lesson = {
  key: string
  title: string
  minutes: number
  summary: string
  videoUrl?: string
  sections: LessonSection[]
  takeaways: string[]
}
export type QuizQuestion = {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const INITIATIVE_NAMES: Record<number, string> = {
  1: "Organization-Wide TNA",
  2: "Staff Competency Mapping",
  3: "Performance Bottleneck Review",
  4: "Capability Improvement Program",
  5: "Staff Evaluation Framework",
  6: "Knowledge Sharing Platform",
  7: "Performance Improvement Task Force",
  8: "Culture & Accountability Reinforcement",
  9: "Training ROI Dashboard",
}

function subsidiaryPhrase(course: Course): string {
  if (!course.subsidiaries) return "your subsidiary"
  const list = course.subsidiaries.split(",").map((s) => s.trim())
  if (list.length === 1) return list[0]
  if (list.length === 2) return `${list[0]} and ${list[1]}`
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`
}

// --- Lessons ---------------------------------------------------------------
// Five lessons per course: Orientation, Core concepts, Hands-on practice,
// Applied workshop, and Review & readiness. Copy is tailored to the course.
export function getLessons(course: Course): Lesson[] {
  const subs = subsidiaryPhrase(course)
  const initiative =
    course.initiative != null ? INITIATIVE_NAMES[course.initiative] ?? null : null
  const perModule = Math.max(1, Math.round(course.durationHours / 5))
  const mins = perModule * 60

  return [
    {
      key: "orientation",
      title: "Orientation & Objectives",
      minutes: Math.round(mins * 0.6),
      summary: `Why ${course.title} matters and what you will be able to do by the end.`,
      videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw", // Sample YouTube Embed
      sections: [
        {
          heading: "What this course is about",
          body: [
            `${course.title} is a ${course.level.toLowerCase()}-level, ${course.format.toLowerCase()} course in the ${course.category} skill area. ${course.description}`,
            `It was built directly from the EIB Group skill-gap analysis for ${subs}, so the skills you practise here map to real, identified needs in the business rather than generic theory.`,
          ],
        },
        {
          heading: "Your learning objectives",
          body: [
            "By the end of this course you will be able to explain the core concepts in your own words, apply them to a realistic task from your day-to-day work, and demonstrate competency through the end-of-course assessment.",
            initiative
              ? `This course supports the "${initiative}" strategic initiative, which is how your progress here feeds the wider 90-day plan and the ROI dashboard.`
              : "Your progress here feeds the wider 90-day capability plan and the ROI dashboard.",
          ],
        },
      ],
      takeaways: [
        `${course.title} targets a real, evidence-based skill gap.`,
        "You will be assessed on applying the skill, not just recalling facts.",
        "Completion is tracked and contributes to measurable capability targets.",
      ],
    },
    {
      key: "core-concepts",
      title: "Core Concepts",
      minutes: mins,
      summary: `The essential knowledge and vocabulary behind ${course.category.toLowerCase()} work.`,
      sections: [
        {
          heading: "The foundations",
          body: [
            `Every strong practitioner in ${course.category} shares the same foundation: a clear mental model of the process, the standards that define "good", and the common failure points to watch for.`,
            `In this lesson we build that shared vocabulary so that conversations across ${subs} are consistent and the rest of the course has a firm base to build on.`,
          ],
        },
        {
          heading: "Standards and quality",
          body: [
            "Professional work is judged against explicit standards. We cover what those standards are for this discipline, how they are measured, and why consistency matters more than occasional brilliance.",
            "We also look at the most frequent mistakes and how a simple checklist mindset prevents the majority of them.",
          ],
        },
      ],
      takeaways: [
        "A shared mental model and vocabulary reduce errors and rework.",
        "Work is measured against explicit, repeatable standards.",
        "Most failures are predictable and preventable with discipline.",
      ],
    },
    {
      key: "hands-on",
      title: "Hands-on Practice",
      minutes: mins,
      summary: "Guided, step-by-step practice on representative scenarios.",
      sections: [
        {
          heading: "Working through a scenario",
          body: [
            `Here you work through a realistic ${course.category.toLowerCase()} scenario drawn from ${subs}, one step at a time, with the reasoning behind each decision made explicit.`,
            "The goal is to move the skill from something you understand into something you can actually do under normal working conditions.",
          ],
        },
        {
          heading: "Building good habits",
          body: [
            "Repetition with feedback is what turns a procedure into a habit. We highlight the small routines — checks, confirmations, and documentation — that separate reliable performers from inconsistent ones.",
          ],
        },
      ],
      takeaways: [
        "Skills become reliable through guided, repeated practice.",
        "Reasoning matters as much as the steps themselves.",
        "Small routines drive consistent, dependable output.",
      ],
    },
    {
      key: "applied-workshop",
      title: "Applied Workshop",
      minutes: mins,
      summary: `Apply the skill end-to-end to a ${subs} use case.`,
      sections: [
        {
          heading: "From practice to the real task",
          body: [
            `This workshop asks you to take everything from the previous lessons and apply it to a complete, realistic task relevant to ${subs}.`,
            "You will plan your approach, carry it out, and review the result against the standards introduced earlier — exactly as you would on the job.",
          ],
        },
        {
          heading: "Reviewing your work",
          body: [
            "Self-review is a core professional skill. We provide a structured way to check your output, identify what to improve, and capture lessons for next time.",
          ],
        },
      ],
      takeaways: [
        "You can carry the skill through a full, realistic task.",
        "Structured self-review catches issues before they reach others.",
        "Reflection turns one task into repeatable capability.",
      ],
    },
    {
      key: "review-readiness",
      title: "Review & Readiness",
      minutes: Math.round(mins * 0.6),
      summary: "Consolidate, self-check, and prepare for the assessment.",
      sections: [
        {
          heading: "Pulling it together",
          body: [
            `You have covered the objectives, the core concepts, hands-on practice, and a full applied task for ${course.title}.`,
            "This final lesson consolidates the key points and gives you a short readiness checklist before the end-of-course assessment.",
          ],
        },
        {
          heading: "What the assessment checks",
          body: [
            `The assessment is a short quiz covering the core concepts of this course and how it fits the EIB Group plan. You need ${QUIZ_PASS_THRESHOLD}% to pass and earn your certificate.`,
            "Re-read any takeaways you are unsure about, then start the quiz when you are ready.",
          ],
        },
      ],
      takeaways: [
        "Revisit the takeaways from each lesson before the quiz.",
        `A score of ${QUIZ_PASS_THRESHOLD}% or higher earns your certificate.`,
        "Completing all lessons plus passing the quiz marks the course complete.",
      ],
    },
  ]
}

export function lessonCount(course: Course): number {
  return getLessons(course).length
}

// --- Quiz ------------------------------------------------------------------
// Subject-matter concept questions per skill-gap category. Each course quiz
// combines a few of these with two guaranteed-correct, data-derived questions.
type BankQuestion = Omit<QuizQuestion, "id">

const CONCEPT_BANK: Record<string, BankQuestion[]> = {
  Technical: [
    {
      prompt: "When diagnosing a technical fault, what is the most reliable first step?",
      options: [
        "Replace the most expensive component first",
        "Gather symptoms and verify the fault systematically before changing parts",
        "Guess based on the last similar job",
        "Restart and hope the fault clears",
      ],
      correctIndex: 1,
      explanation: "Structured diagnosis — observe, verify, then act — avoids costly parts-swapping.",
    },
    {
      prompt: "Why is following a documented procedure important in technical work?",
      options: [
        "It slows the work down on purpose",
        "It ensures consistency, safety, and traceability across technicians",
        "It is only needed for new staff",
        "It replaces the need for training",
      ],
      correctIndex: 1,
      explanation: "Procedures make work consistent, safe, and auditable regardless of who performs it.",
    },
    {
      prompt: "What best describes competency in a technical discipline?",
      options: [
        "Knowing the theory only",
        "Being able to apply the right method correctly and safely under real conditions",
        "Owning the newest tools",
        "Working as fast as possible",
      ],
      correctIndex: 1,
      explanation: "Competency is reliable, safe application of the correct method in practice.",
    },
  ],
  "Reporting & Documentation": [
    {
      prompt: "What makes a report effective?",
      options: [
        "It is as long as possible",
        "It is clear, accurate, well-structured, and tailored to its reader",
        "It uses the most complex language",
        "It avoids any numbers",
      ],
      correctIndex: 1,
      explanation: "Good reports are clear, accurate, structured, and audience-appropriate.",
    },
    {
      prompt: "Why is consistent documentation important?",
      options: [
        "It creates a reliable, traceable record others can act on",
        "It is only for legal teams",
        "It makes files larger",
        "It is optional once you are experienced",
      ],
      correctIndex: 0,
      explanation: "Consistent records are traceable and let others act with confidence.",
    },
    {
      prompt: "Which is a good documentation habit?",
      options: [
        "Recording details from memory days later",
        "Capturing accurate information at the time, using a standard format",
        "Leaving out anything inconvenient",
        "Using a different structure each time",
      ],
      correctIndex: 1,
      explanation: "Timely, accurate, standardized capture produces trustworthy documentation.",
    },
  ],
  Operational: [
    {
      prompt: "What is the main benefit of prioritizing your workload?",
      options: [
        "Doing the easiest tasks first",
        "Focusing effort on the highest-impact, time-critical work",
        "Avoiding planning entirely",
        "Working longer hours",
      ],
      correctIndex: 1,
      explanation: "Prioritization directs limited time to the work that matters most.",
    },
    {
      prompt: "How can a team reduce operational delays?",
      options: [
        "Ignore bottlenecks until they escalate",
        "Identify bottlenecks early and address root causes",
        "Add more steps to every process",
        "Stop measuring turnaround times",
      ],
      correctIndex: 1,
      explanation: "Spotting and fixing root-cause bottlenecks early prevents delays.",
    },
    {
      prompt: "What is a quality inspection primarily for?",
      options: [
        "Blaming individuals",
        "Catching and preventing defects before they reach the customer",
        "Slowing production",
        "Replacing training",
      ],
      correctIndex: 1,
      explanation: "Inspections exist to detect and prevent defects, protecting the customer.",
    },
  ],
  "Emerging Tech": [
    {
      prompt: "When operating drones or new technology, what comes first?",
      options: [
        "Speed of deployment",
        "Safety, regulatory compliance, and proper pre-operation checks",
        "Skipping checklists to save time",
        "Using maximum settings",
      ],
      correctIndex: 1,
      explanation: "Safety, compliance, and pre-flight checks must precede operation.",
    },
    {
      prompt: "Why is calibration important for sensor-based equipment?",
      options: [
        "It is purely decorative",
        "It ensures accurate, reliable readings and safe operation",
        "It voids the warranty",
        "It is only needed once ever",
      ],
      correctIndex: 1,
      explanation: "Calibration keeps readings accurate and operation safe and repeatable.",
    },
    {
      prompt: "What is a key advantage of live-feed management?",
      options: [
        "It removes the need for operators",
        "It enables real-time decisions from accurate, routed information",
        "It is slower than recordings",
        "It only works offline",
      ],
      correctIndex: 1,
      explanation: "Live feeds support timely decisions when captured and routed correctly.",
    },
  ],
  "Safety & Compliance": [
    {
      prompt: "What is the purpose of a risk assessment?",
      options: [
        "To create paperwork",
        "To identify hazards and control them before work begins",
        "To assign blame after an incident",
        "To slow down operations",
      ],
      correctIndex: 1,
      explanation: "Risk assessment identifies and controls hazards proactively.",
    },
    {
      prompt: "What does a strong safety culture look like?",
      options: [
        "Hiding near-misses",
        "Everyone reporting hazards and following controls without exception",
        "Safety being only the manager's job",
        "Skipping PPE when busy",
      ],
      correctIndex: 1,
      explanation: "Shared responsibility and open reporting define a strong safety culture.",
    },
    {
      prompt: "When should safety controls be applied?",
      options: [
        "Only after an incident",
        "Before and during the activity, as identified by the assessment",
        "Only during inspections",
        "Whenever convenient",
      ],
      correctIndex: 1,
      explanation: "Controls must be in place before and throughout the activity.",
    },
  ],
  "Customer-Facing": [
    {
      prompt: "What is at the heart of good customer care?",
      options: [
        "Closing the conversation as fast as possible",
        "Understanding the customer's need and responding clearly and helpfully",
        "Avoiding difficult questions",
        "Promising anything to end a complaint",
      ],
      correctIndex: 1,
      explanation: "Listening, understanding, and helpful clarity drive good service.",
    },
    {
      prompt: "How should a service advisor handle a complaint?",
      options: [
        "Dismiss it",
        "Listen, acknowledge, and work toward a fair resolution",
        "Blame another department",
        "Ignore it until the customer leaves",
      ],
      correctIndex: 1,
      explanation: "Acknowledging and resolving complaints fairly retains customers.",
    },
    {
      prompt: "Why does front-desk communication matter?",
      options: [
        "It is the customer's first and lasting impression of the business",
        "It has no measurable impact",
        "It only matters for sales",
        "It can be left entirely to chance",
      ],
      correctIndex: 0,
      explanation: "First impressions at the front desk shape the whole customer relationship.",
    },
  ],
  "Project Management": [
    {
      prompt: "What is the purpose of a project plan?",
      options: [
        "To guarantee nothing changes",
        "To define scope, schedule, resources, and how progress is tracked",
        "To replace communication",
        "To impress stakeholders only",
      ],
      correctIndex: 1,
      explanation: "A plan aligns scope, schedule, and resources and enables tracking.",
    },
    {
      prompt: "How is project risk best handled?",
      options: [
        "Ignore it until it happens",
        "Identify risks early and plan mitigations proactively",
        "Assume the plan is perfect",
        "Only review risk at the end",
      ],
      correctIndex: 1,
      explanation: "Proactive identification and mitigation reduce project risk.",
    },
    {
      prompt: "Why report progress regularly?",
      options: [
        "To create busywork",
        "To catch slippage early and keep stakeholders aligned",
        "Because it is legally required everywhere",
        "To avoid having to plan",
      ],
      correctIndex: 1,
      explanation: "Regular reporting surfaces slippage early and maintains alignment.",
    },
  ],
  "M&E / Data": [
    {
      prompt: "What is the purpose of monitoring and evaluation?",
      options: [
        "To collect data nobody uses",
        "To measure whether activities achieve their intended outcomes",
        "To replace program delivery",
        "To make reports longer",
      ],
      correctIndex: 1,
      explanation: "M&E measures real outcomes so programs can improve.",
    },
    {
      prompt: "What makes data useful for decisions?",
      options: [
        "It is accurate, relevant, and analyzed in context",
        "It is large in volume only",
        "It is collected once and never checked",
        "It is kept private from decision-makers",
      ],
      correctIndex: 0,
      explanation: "Accurate, relevant, well-analyzed data supports good decisions.",
    },
    {
      prompt: "Why establish a baseline?",
      options: [
        "To have a starting point against which to measure change",
        "Because it is tradition",
        "To delay the project",
        "It serves no analytical purpose",
      ],
      correctIndex: 0,
      explanation: "A baseline is the reference point for measuring impact over time.",
    },
  ],
  Financial: [
    {
      prompt: "What is the purpose of a budget?",
      options: [
        "To restrict all spending to zero",
        "To plan and control resources against expected activity",
        "To be ignored once approved",
        "To impress auditors only",
      ],
      correctIndex: 1,
      explanation: "Budgets plan and control resource use against planned activity.",
    },
    {
      prompt: "What is budget control?",
      options: [
        "Comparing actuals to plan and acting on variances",
        "Spending the full budget regardless of need",
        "Never reviewing spend",
        "Only a year-end task",
      ],
      correctIndex: 0,
      explanation: "Control means tracking actuals vs. plan and responding to variances.",
    },
    {
      prompt: "Why does financial discipline matter for a program?",
      options: [
        "It has no effect on outcomes",
        "It ensures resources are available to deliver the intended results",
        "It is only the finance team's concern",
        "It discourages planning",
      ],
      correctIndex: 1,
      explanation: "Sound finances keep resources available to deliver results.",
    },
  ],
  Leadership: [
    {
      prompt: "What is effective delegation?",
      options: [
        "Dumping unwanted tasks",
        "Assigning the right work with clarity, authority, and support",
        "Doing everything yourself",
        "Avoiding accountability",
      ],
      correctIndex: 1,
      explanation: "Delegation pairs the right task with clarity, authority, and support.",
    },
    {
      prompt: "How does a good leader build a team?",
      options: [
        "By withholding feedback",
        "By setting clear goals, giving feedback, and developing people",
        "By avoiding difficult conversations",
        "By taking all the credit",
      ],
      correctIndex: 1,
      explanation: "Clear goals, honest feedback, and development grow strong teams.",
    },
    {
      prompt: "What underpins accountability in a team?",
      options: [
        "Clear expectations and consistent follow-through",
        "Frequent blame",
        "Vague responsibilities",
        "Ignoring results",
      ],
      correctIndex: 0,
      explanation: "Accountability rests on clear expectations and consistent follow-through.",
    },
  ],
  "Media & Content": [
    {
      prompt: "What is key to effective on-air presentation?",
      options: [
        "Speaking as fast as possible",
        "Clear delivery, structure, and connecting with the audience",
        "Reading without preparation",
        "Avoiding any storytelling",
      ],
      correctIndex: 1,
      explanation: "Clarity, structure, and audience connection drive strong presentation.",
    },
    {
      prompt: "Why does storytelling matter in broadcast content?",
      options: [
        "It makes content forgettable",
        "It engages the audience and makes the message memorable",
        "It is only for fiction",
        "It replaces accuracy",
      ],
      correctIndex: 1,
      explanation: "Storytelling engages audiences and makes messages stick.",
    },
    {
      prompt: "What is good content development?",
      options: [
        "Planning content around audience needs and a clear purpose",
        "Posting at random",
        "Copying others exactly",
        "Ignoring feedback",
      ],
      correctIndex: 0,
      explanation: "Strong content is planned around audience needs and clear intent.",
    },
  ],
  "Digital Media": [
    {
      prompt: "How do you grow an online audience?",
      options: [
        "Post once and stop",
        "Publish relevant content consistently and engage with the audience",
        "Buy unrelated followers",
        "Ignore analytics",
      ],
      correctIndex: 1,
      explanation: "Consistency, relevance, and genuine engagement grow audiences.",
    },
    {
      prompt: "Why use analytics in digital media?",
      options: [
        "To understand what resonates and improve over time",
        "They are decorative",
        "To avoid making content",
        "They cannot be measured",
      ],
      correctIndex: 0,
      explanation: "Analytics reveal what works so content can improve.",
    },
    {
      prompt: "What is audience engagement?",
      options: [
        "One-way broadcasting only",
        "Two-way interaction that builds a relationship with the audience",
        "Ignoring comments",
        "Posting only ads",
      ],
      correctIndex: 1,
      explanation: "Engagement is two-way interaction that builds loyalty.",
    },
  ],
  "Marketing & Sales": [
    {
      prompt: "What is the goal of sponsorship and ad sales?",
      options: [
        "To give away airtime",
        "To create mutually valuable partnerships that grow revenue",
        "To avoid talking to clients",
        "To lower the station's profile",
      ],
      correctIndex: 1,
      explanation: "Sales and sponsorship create value for both partner and station, growing revenue.",
    },
    {
      prompt: "What underpins a good marketing approach?",
      options: [
        "Understanding the audience and the value you offer them",
        "Guessing what to sell",
        "Ignoring the competition",
        "Never measuring results",
      ],
      correctIndex: 0,
      explanation: "Effective marketing starts from audience insight and clear value.",
    },
    {
      prompt: "How is sales success best sustained?",
      options: [
        "One-off deals only",
        "Building relationships and delivering on promises",
        "Over-promising to close fast",
        "Avoiding follow-up",
      ],
      correctIndex: 1,
      explanation: "Lasting sales come from trust, relationships, and delivery.",
    },
  ],
}

// Build the quiz for a course: concept questions for its category plus two
// data-derived questions whose answers come straight from the course record.
export function getQuiz(course: Course): QuizQuestion[] {
  const concept = (CONCEPT_BANK[course.category] ?? []).slice(0, 3)
  const questions: QuizQuestion[] = concept.map((q, i) => ({ id: `c${i + 1}`, ...q }))

  // Data-derived: delivery format.
  const formats = ["Workshop", "Online", "Blended"]
  questions.push({
    id: "d-format",
    prompt: `What is the primary delivery format of "${course.title}"?`,
    options: formats,
    correctIndex: Math.max(0, formats.indexOf(course.format)),
    explanation: `This course is delivered as a ${course.format.toLowerCase()}.`,
  })

  // Data-derived: strategic initiative (only when the course maps to one).
  if (course.initiative != null && INITIATIVE_NAMES[course.initiative]) {
    const correct = INITIATIVE_NAMES[course.initiative]
    const distractors = Object.values(INITIATIVE_NAMES)
      .filter((n) => n !== correct)
      .slice(0, 3)
    const options = shuffleDeterministic([correct, ...distractors], course.id)
    questions.push({
      id: "d-initiative",
      prompt: `Which EIB Group strategic initiative does "${course.title}" primarily support?`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `This course feeds the "${correct}" initiative in the 90-day plan.`,
    })
  } else {
    const levels = ["Beginner", "Intermediate", "Advanced"]
    questions.push({
      id: "d-level",
      prompt: `What is the level of "${course.title}"?`,
      options: levels,
      correctIndex: Math.max(0, levels.indexOf(course.level)),
      explanation: `This course is pitched at the ${course.level.toLowerCase()} level.`,
    })
  }

  return questions
}

// Stable shuffle so option order is consistent per course between renders.
function shuffleDeterministic<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed + 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function gradeQuiz(
  course: Course,
  answers: number[],
): { score: number; total: number; percent: number; passed: boolean } {
  const quiz = getQuiz(course)
  const total = quiz.length
  let score = 0
  quiz.forEach((q, i) => {
    if (answers[i] === q.correctIndex) score++
  })
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  return { score, total, percent, passed: percent >= QUIZ_PASS_THRESHOLD }
}
