const PptxGenJS = require("pptxgenjs");

let pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";

// Colors
const PRIMARY = "1E3A8A"; 
const SECONDARY = "3B82F6"; 
const TEXT_DARK = "1F2937";
const TEXT_LIGHT = "F9FAFB";

// Master Slide for formatting
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "F3F4F6" },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: PRIMARY } } },
    { text: { text: "EIB Group - Training & Organizational Development", options: { x: 0.5, y: 0.2, w: 5, h: 0.4, color: TEXT_LIGHT, fontSize: 14, bold: true } } },
    { text: { text: "Q3 2026", options: { x: "85%", y: 0.2, w: 1.5, h: 0.4, color: TEXT_LIGHT, fontSize: 14, align: "right" } } }
  ]
});

// Title Slide
let slideTitle = pptx.addSlide();
slideTitle.background = { color: PRIMARY };
slideTitle.addText("Q3 2026 Strategic Performance Report", { x: 1, y: 2, w: 8, h: 1, color: TEXT_LIGHT, fontSize: 36, bold: true, align: "center" });
slideTitle.addText("Office of the Group Head, Training & OD\nMichael Marquis", { x: 1, y: 3.5, w: 8, h: 1, color: "93C5FD", fontSize: 20, align: "center" });

// 1. Consolidated Monthly Performance Report
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addText("1. Consolidated Monthly Performance Report", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide1.addText([
  { text: "Performance Task Force Submissions", options: { bold: true, breakLine: true } },
  { text: "• 7 Subsidiaries submitted detailed performance challenges and skill gaps.", options: { bullet: true } },
  { text: "• 13 distinct skill-gap categories identified across the Group.", options: { bullet: true } },
  { text: "Operational Bottlenecks Addressed", options: { bold: true, breakLine: true } },
  { text: "• Supply chain/spare parts delays (Luftreiber), production volume (Briech UAS).", options: { bullet: true } },
  { text: "• Infrastructure degradation and supervisory burnout (EIB Stratoc).", options: { bullet: true } },
  { text: "KPI Baselines Established", options: { bold: true, breakLine: true } },
  { text: "• Targeted 20% increase in Training Participation.", options: { bullet: true } },
  { text: "• Targeted 10% reduction in Operational Error Rates.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// 2. Strategic Growth Report
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("2. Strategic Growth Report", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide2.addText([
  { text: "Transitioning to a Data-Driven Engine", options: { bold: true, breakLine: true } },
  { text: "• Moving from ad-hoc reactive training to a structured capability development system.", options: { bullet: true } },
  { text: "90-Day Implementation Roadmap", options: { bold: true, breakLine: true } },
  { text: "• Month 1: Diagnosis & Baseline (TNA, Competency Mapping).", options: { bullet: true } },
  { text: "• Month 2: Intervention & System Building (LMS Launch, Knowledge Sharing).", options: { bullet: true } },
  { text: "• Month 3: Performance Optimization (ROI Dashboard, Culture Reinforcement).", options: { bullet: true } },
  { text: "Scalable Learning Infrastructure", options: { bold: true, breakLine: true } },
  { text: "• Deployed Group-Wide LMS capable of serving all subsidiaries and tracking real-time ROI.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// 3. Human Capital Development Report
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("3. Human Capital Development Report", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide3.addText([
  { text: "Curriculum Development & Launch", options: { bold: true, breakLine: true } },
  { text: "• Successfully rolled out 17 targeted courses mapped directly to identified skill gaps.", options: { bullet: true } },
  { text: "• Covered categories: Technical, Reporting, Leadership, M&E, Emerging Tech, etc.", options: { bullet: true } },
  { text: "Competency Enhancements", options: { bold: true, breakLine: true } },
  { text: "• 24-Hour UAV Assembly & Avionics masterclass for Briech UAS.", options: { bullet: true } },
  { text: "• Digital Audience Engagement and Radio Marketing for Bright FM.", options: { bullet: true } },
  { text: "• Project Planning & Financial Management for BEF.", options: { bullet: true } },
  { text: "Measurable Certification", options: { bold: true, breakLine: true } },
  { text: "• Every course requires an 80% pass threshold to earn verified, traceable certification.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// 4. Financial Oversight Report
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("4. Financial Oversight Report", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide4.addText([
  { text: "Value Creation & Cost Efficiency", options: { bold: true, breakLine: true } },
  { text: "• Total internal training value provided: ₦2,640,000 across 17 curated courses.", options: { bullet: true } },
  { text: "• Zero external vendor dependency for LMS platform deployment, saving significant CapEx.", options: { bullet: true } },
  { text: "Subsidiary Budget Rationalization", options: { bold: true, breakLine: true } },
  { text: "• Streamlined BEF's submitted external training budget (₦850k–₦1.9m) by delivering Leadership, Finance, and Project Management courses internally.", options: { bullet: true } },
  { text: "ROI Tracking Alignment", options: { bold: true, breakLine: true } },
  { text: "• Training is no longer an invisible sunk cost; completion data correlates directly with operational error rate reductions.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// 5. Risk, Governance and Compliance Report
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("5. Risk, Governance & Compliance Report", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide5.addText([
  { text: "Operational Risk Mitigation", options: { bold: true, breakLine: true } },
  { text: "• Addressed 'single-point-of-failure' risks at Briech UAS through enforced cross-training and mentorship rotations.", options: { bullet: true } },
  { text: "HSE & Compliance Training", options: { bold: true, breakLine: true } },
  { text: "• Rolled out mandatory 'HSE Awareness & Operational Risk Assessment' for Luftreiber Automobile.", options: { bullet: true } },
  { text: "Data & Reporting Governance", options: { bold: true, breakLine: true } },
  { text: "• Deployed 'MRO Record-Keeping & Technical Documentation' to ensure auditable maintenance logs.", options: { bullet: true } },
  { text: "• Established structured Intelligence Reporting standards for Fusion Centre staff.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// 6. Management Action Implementation Report
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("6. Management Action Implementation Report", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide6.addText([
  { text: "Performance Improvement Task Force", options: { bold: true, breakLine: true } },
  { text: "• Formally constituted and operationalized with representatives from 7 subsidiaries.", options: { bullet: true } },
  { text: "Staff Evaluation Framework", options: { bold: true, breakLine: true } },
  { text: "• Assessments and certifications integrated into the LMS to inform transfers, promotions, and reviews.", options: { bullet: true } },
  { text: "Culture & Accountability Enforcement", options: { bold: true, breakLine: true } },
  { text: "• Training records now centralized, creating undeniable accountability for staff readiness and participation.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// 7. Quarterly SWOT Analysis
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("7. Quarterly SWOT Analysis (Training)", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });

slide7.addText("STRENGTHS\n• Internal LMS infrastructure fully operational.\n• High engagement from Task Force reps.\n• Fully mapped, data-driven curriculum.", { x: 0.5, y: 1.8, w: 4.2, h: 1.5, fill: { color: "D1FAE5" }, fontSize: 14, color: TEXT_DARK, align: "left", valign: "top" });
slide7.addText("WEAKNESSES\n• Aging equipment & infrastructure at EIB Stratoc.\n• Supply chain delays affecting practical training availability (Luftreiber).", { x: 4.8, y: 1.8, w: 4.2, h: 1.5, fill: { color: "FEE2E2" }, fontSize: 14, color: TEXT_DARK, align: "left", valign: "top" });
slide7.addText("OPPORTUNITIES\n• Cross-training to eliminate silos.\n• Revenue growth via upskilled marketing/BD teams (Bright FM, Briech Atlantic).", { x: 0.5, y: 3.5, w: 4.2, h: 1.5, fill: { color: "DBEAFE" }, fontSize: 14, color: TEXT_DARK, align: "left", valign: "top" });
slide7.addText("THREATS\n• Cyber/regulatory threats (UAV missions).\n• Non-compliance/non-reporting from legacy entities (e.g., Luft Pay TV).", { x: 4.8, y: 3.5, w: 4.2, h: 1.5, fill: { color: "FEF3C7" }, fontSize: 14, color: TEXT_DARK, align: "left", valign: "top" });

// 8. Cross-Functional Support Contributions
let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide8.addText("8. Cross-Functional Support Contributions", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide8.addText([
  { text: "Internal Knowledge-Sharing Platform", options: { bold: true, breakLine: true } },
  { text: "• Facilitated cross-subsidiary workshops (e.g., EIB Stratoc and Briech UAS collaborating on report writing and MS Word essentials).", options: { bullet: true } },
  { text: "• Drone Ops & Live-Feed Management combined training for both EIB Stratoc and Luftreiber Automobile.", options: { bullet: true } },
  { text: "Executive Visibility", options: { bold: true, breakLine: true } },
  { text: "• Provided group-wide dashboard giving EXCO a unified view of capability gaps and mitigation efforts.", options: { bullet: true } },
  { text: "Standardizing Group Standards", options: { bold: true, breakLine: true } },
  { text: "• Unified Customer Care and QA standards that apply universally across media, automotive, and technical arms.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

// Summary
let slide9 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide9.addText("Summary of Q3 2026 Performance", { x: 0.5, y: 1, w: 9, h: 0.6, fontSize: 28, color: PRIMARY, bold: true });
slide9.addText([
  { text: "Objective Achieved: The capability engine is live.", options: { bold: true, breakLine: true } },
  { text: "• We successfully transitioned from a reactive training posture to a proactive, measurable capability-development system.", options: { bullet: true } },
  { text: "• 17 curated courses launched, perfectly aligning with 13 identified skill gaps.", options: { bullet: true } },
  { text: "• Substantial cost savings achieved by avoiding external vendor dependency for the learning platform and foundational courses.", options: { bullet: true } },
  { text: "• The Group is now positioned for Q4 with verifiable baseline metrics, a central evaluation framework, and robust cross-functional collaboration.", options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 8.5, h: 3, fontSize: 16, color: TEXT_DARK, lineSpacing: 22 });

pptx.writeFile({ fileName: "EIB_Group_Q3_Performance_Report.pptx" }).then(() => {
  console.log("PPTX generated successfully.");
});
