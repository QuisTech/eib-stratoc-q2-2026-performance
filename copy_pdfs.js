const fs = require('fs');
const path = require('path');

const srcBase = 'C:\\Users\\Administrator\\Downloads\\Presentations';
const destBase = path.join(__dirname, 'public', 'docs');

// Mapping: destination filename -> source PDF path (relative to srcBase)
const pdfMap = {
  // scratch_seeder.js - GCOO courses
  'gcoo-management-report.pdf': 'Tes - GCOO/GROUP CHIEF OPERATIONS OFFICER\'S COMPREHENSIVE MANAGEMENT REPORT.pdf',
  'gcoo-work-plan-2026.pdf': 'Tes - GCOO/GROUP GCOO WORK PLAN 2026.pdf',
  // scratch_seeder.js - Giga Forensics
  'giga-forensics-half-year-plan.pdf': 'Iheanyi - Giga Forensics/GIGA FORENSICS HALF YEAR PLAN.pdf',

  // scratch_seeder_batch2.js - EIB Stratoc
  'eib-stratoc-90-day-plan.pdf': 'Helen - EIB Stratoc/EIB STRATOC LTD-90 DAY PLAN.pdf',
  // scratch_seeder_batch2.js - Briech Hospital
  'briech-hospital-six-months-plan.pdf': 'Joy - Briech Hospital/Briech Hospital Six months plan.pdf',
  // scratch_seeder_batch2.js - GHRM
  'ghrm-presentation-2026.pdf': 'Judith -GHR/GHRM PRESENTATION,2026..pdf',
  'ghrm-appraisal.pdf': 'Judith -GHR/GROUP HUMAN RESOURCES MANAGER APPRAISAL .pdf',

  // scratch_seeder_batch3.js - CTO / IT
  'cto-strategic-plans.pdf': 'Engr Ladan - CTO/CTO Strategic Plans (AutoRecovered).pdf',
  // scratch_seeder_batch3.js - Arch Giwa (Hospital Design)
  'briech-hospital-wards-2026.pdf': 'Arch Giwa/BRIECH HOSP WARDS_2026.pdf',
  'briech-hospital-project-appraisal.pdf': 'Arch Giwa/Briech Hospital Project Appraisal.pdf',
  'construction-operation-sequence.pdf': 'Arch Giwa/Construction Operation Sequence.pdf',
  'group-chief-architect-desk.pdf': 'Arch Giwa/Group_Chief Architect Desk.pdf',
  // scratch_seeder_batch3.js - Business Development
  'business-development-strategic-plan.pdf': 'Solomon - Business Development/Business Development Strategic Plan.pdf',
  'eib-90-day-business-development-plan.pdf': 'Solomon - Business Development/EIB_Group_90-Day_Business_Development_Strategic_Plan.pdf',

  // scratch_seeder_batch4.js - BEF
  'bef-q3-2026-workplan.pdf': 'Ali -BEF/BEF_Q3_2026_Workplan_Table.pdf',
  // scratch_seeder_batch4.js - Bright FM
  'bright-fm-90-day-action-plan.pdf': 'Anita - Bright FM/Bright FM 90 Day Action Plan.pdf',
  'bright-fm-lean-growth-budget.pdf': 'Anita - Bright FM/Bright FM 3 Month Lean Growth Budget Plan.pdf',
  // scratch_seeder_batch4.js - Interface & Workflow
  'eib-organizational-structure-optimization.pdf': 'Anthony - Interface & Workflow/EIB-Group-Organizational-Structure-and-Process-Optimization (1).pdf',

  // scratch_seeder_batch5.js - Camps Security
  'camps-security-strategic-plan-2026.pdf': 'Apeh Monday/STRATEGIC PLAN FOR CAMPS SECURITY FOR 2026 A.pdf',
  // scratch_seeder_batch5.js - EAs
  'eas-presentation.pdf': 'EAs To Chairman/EAs Presentation.pdf',
  // scratch_seeder_batch5.js - Luftreiber
  'luftreiber-h2-2026-strategic-plan.pdf': 'Junaid -Luftreiber Automobile/Luftreiber H2 2026 Strategic Plan-Final.pdf',

  // scratch_seeder_batch6.js - EVP / SOPs
  'evp-hr-sop.pdf': 'EVP/Human Resources Standard Operating Procedure.pdf',
  'evp-onboarding-offboarding.pdf': 'EVP/ONBOARDING AND OFFBOARDING DOCUMENT.pdf',
  'evp-senior-management-reporting.pdf': 'EVP/SENIOR MANAGEMENT AND EXECUTIVE MANAGEMENT REPORTING (1).pdf',
  'evp-simple-sop.pdf': 'EVP/SIMPLE STANDARD OPERATING PROCEDURES.pdf',
  // scratch_seeder_batch6.js - M&E
  'me-q3-action-report.pdf': 'Ken Onuh - Monitoring & Evaluation/MONITORING & EVALUATION Q3 ACTION REPORT FOR EIB GROUP.pdf',
  // scratch_seeder_batch6.js - POCTOVA
  'poctova-departmental-workflow.pdf': 'Princess Edwards - POCTOVA/DEPARTMENTAL WORKFLO1 pdf.pdf',
  'poctova-strategic-projection-plan.pdf': 'Princess Edwards - POCTOVA/POCTOVA_Strategic_Projection_Plan.pdf',
  'poctova-presentation-july-december.pdf': 'Princess Edwards - POCTOVA/PRESENTATION JULY- DECEMBER.pdf',

  // scratch_seeder_batch7.js - Briech Atlantic
  'briech-atlantic-90-day-projection-plan.pdf': 'Mr Kenneth Mbadugha- Briech Atlantic/BRIECH ATLANTIC LTD 90-DAY PROJECTION PLAN, .pdf',
  'briech-atlantic-project-plan.pdf': 'Mr Kenneth Mbadugha- Briech Atlantic/BRIECH ATLANTIC PROJECT PLAN.pdf',
  'briech-atlantic-six-month-strategic-plan.pdf': 'Mr Kenneth Mbadugha- Briech Atlantic/SIX-MONTH STRATEGIC PROJECTION PLAN (Q3-Q4) FROM JULY TO DECEMBER 2026.pdf',
  'briech-atlantic-daily-workers-register.pdf': 'Mr Kenneth Mbadugha- Briech Atlantic/BRIECH ATLANTIC LTD DAILY WORKERS REGISTER.pdf',
  'briech-atlantic-materials-request-form.pdf': 'Mr Kenneth Mbadugha- Briech Atlantic/BRIECH ATLANTIC LTD MATERIALS REQUEST FORM.pdf',
  'briech-atlantic-project-completion-form.pdf': 'Mr Kenneth Mbadugha- Briech Atlantic/BRIECH ATLANTIC LTD PROJECT COMPLETION AND HANDOVER FORM.pdf',
  // scratch_seeder_batch7.js - Task Force Report (Mr Marquis)
  'eib-task-force-q3-intelligence-report.pdf': 'Mr Marquis - Training/EIB Task Force Q3 Intelligence Report.pdf',
  // scratch_seeder_batch7.js - PSAP
  'psap-90-day-strategy-plan.pdf': 'Mrs Joy - PSAP/90 DAY STRATEGY PLAN.pdf',

  // scratch_seeder_batch8.js - Procurement (Mr Donald)
  'procurement-90-day-plan.pdf': 'Mr Donald/COMPREHENSIVE 90-DAY PLAN FOR THE PROCUREMENT DEPARTMENT OF.pdf',
  // scratch_seeder_batch8.js - Facility & Power (Mr Paul)
  'general-power-generator-report.pdf': 'Mr Paul/General_Power_Generator_Report_Presentation [Autosaved] 006.pdf',
  'janitors-budget-proposal.pdf': 'Mr Paul/3_Month_Janitors_Budget_Proposal.pdf',
  // scratch_seeder_batch8.js - Document Control (Nancy)
  'document-control-90-days-report.pdf': 'Nancy - Group Head Doc Control/90 DAYS REPORT AND DOCUMENT CONTROL DEPARTMENT.pdf',
  'document-control-department-report.pdf': 'Nancy - Group Head Doc Control/REPORT & DOCUMENT CONTROL DEPARTMENT.pdf',

  // scratch_seeder_batch9.js - Corporate Comms (Saadat)
  'eib-90-day-strategic-plan-corp-comms.pdf': 'Saadat - Corp Corps/EIB 90Day Strategic Plan copy.pdf',
  // scratch_seeder_batch9.js - Briech UAS (Sani)
  'briech-uas-q1-progress-report.pdf': 'Sani -Briech UAS/BRIECH UAS FIRST QUARTERLY 2026 PROGRESS REPORT.pdf',
  'briech-uas-q3-plan.pdf': 'Sani -Briech UAS/Briech UAS Third Quarter Plan for Year 2026.PDF',
  'briech-uas-gm-report-march-june.pdf': 'Sani -Briech UAS/GM BRIECH UAS REPORT FOR MARCH TO 11 JUNE 2026.pdf',
  // scratch_seeder_batch9.js - Black (Yemi)
  'black-mid-year-presentation.pdf': 'Yemi - Black/Mid Year Black Presentation N.pdf',

  // scratch_seeder_batch10.js - DCI / Training Gap Analysis
  // (uses same Black + Training sources)
};

fs.mkdirSync(destBase, { recursive: true });

let copied = 0;
let errors = 0;

for (const [destName, srcRelative] of Object.entries(pdfMap)) {
  const srcPath = path.join(srcBase, srcRelative);
  const destPath = path.join(destBase, destName);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    const sizeMB = (fs.statSync(destPath).size / 1024 / 1024).toFixed(2);
    console.log(`✓ ${destName} (${sizeMB} MB)`);
    copied++;
  } else {
    console.error(`✗ NOT FOUND: ${srcPath}`);
    errors++;
  }
}

console.log(`\nDone: ${copied} copied, ${errors} errors`);
