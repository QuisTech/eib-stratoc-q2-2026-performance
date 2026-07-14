import { db } from "../lib/db"
import { courses } from "../lib/db/schema"
import { eq } from "drizzle-orm"

async function run() {
  console.log("Fetching course...")
  const courseList = await db.select().from(courses).where(eq(courses.slug, "financial-management-budgeting"))
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
  const lesson1 = data.lessons.find((l: any) => l.key === "lesson-1-intro")
  if (lesson1) {
    lesson1.labeledGraphic = {
      imageUrl: "/assets/finance/course_1_finance.png",
      hotspots: [
        { id: "hotspot-1-1", x: 45, y: 50, title: "Subsidiary Funding Allocation", content: "Resource allocation is prioritized based on the strategic objectives and market potential of each subsidiary, balancing high-growth entities with foundational operations." },
        { id: "hotspot-1-2", x: 75, y: 40, title: "Market Volatility Buffer", content: "Treasury reserves are strictly maintained to absorb fluctuations in the Naira and ensure operational continuity during economic downturns." },
        { id: "hotspot-1-3", x: 25, y: 60, title: "Cross-Entity Synergies", content: "Intercompany financial transactions are managed transparently to maximize group efficiency while maintaining strict regulatory compliance across all sectors." },
        { id: "hotspot-1-4", x: 60, y: 25, title: "Performance Metrics", content: "Real-time dashboards aggregate financial performance data from all subsidiaries, enabling agile decision-making at the executive level." }
      ]
    }
  }

  // Lesson 2
  const lesson2 = data.lessons.find((l: any) => l.key === "lesson-2-budgeting-fundamentals")
  if (lesson2) {
    lesson2.labeledGraphic = {
      imageUrl: "/assets/finance/course_2_finance.png",
      hotspots: [
        { id: "hotspot-2-1", x: 50, y: 55, title: "Capital Expenditure (CapEx)", content: "Long-term investments in physical assets, such as new infrastructure or technology platforms, are planned meticulously to ensure return on investment." },
        { id: "hotspot-2-2", x: 80, y: 35, title: "Operational Expenditure (OpEx)", content: "Day-to-day running costs are tracked closely against forecasts to prevent budget overruns and maintain healthy profit margins." },
        { id: "hotspot-2-3", x: 20, y: 45, title: "Contingency Planning", content: "Budgets must include contingency funds (typically 5-10%) to handle unexpected market shifts or emergency operational requirements." }
      ]
    }
  }

  // Lesson 3
  const lesson4 = data.lessons.find((l: any) => l.key === "lesson-3-cost-management")
  if (lesson4) {
    lesson4.labeledGraphic = {
      imageUrl: "/assets/finance/course_3_finance.png",
      hotspots: [
        { id: "hotspot-3-1", x: 40, y: 60, title: "Fixed Overhead Burden", content: "Fixed costs such as leases and core salaries must be optimized across the group to lower the breakeven point." },
        { id: "hotspot-3-2", x: 70, y: 40, title: "Variable Cost Control", content: "Direct costs related to specific projects or production are monitored continuously. Procurement strategies play a major role in reducing these expenses." },
        { id: "hotspot-3-3", x: 30, y: 30, title: "Variance Analysis", content: "Any deviation between budgeted and actual costs is immediately flagged for investigation, ensuring financial accountability." },
        { id: "hotspot-3-4", x: 85, y: 65, title: "Efficiency Ratios", content: "Key Performance Indicators (KPIs) track how effectively resources are converted into revenue, guiding cost-reduction initiatives." }
      ]
    }
  }

  // Lesson 4
  const lesson5 = data.lessons.find((l: any) => l.key === "lesson-4-cash-flow-management")
  if (lesson5) {
    lesson5.labeledGraphic = {
      imageUrl: "/assets/finance/course_4_finance.png",
      hotspots: [
        { id: "hotspot-4-1", x: 55, y: 45, title: "Liquidity Reserves", content: "Adequate cash reserves are maintained to meet short-term obligations, ensuring the group can always pay suppliers and staff on time." },
        { id: "hotspot-4-2", x: 25, y: 65, title: "Accounts Receivable", content: "Strict credit control policies ensure that invoices are paid promptly, accelerating cash inflows and minimizing bad debts." },
        { id: "hotspot-4-3", x: 80, y: 30, title: "Accounts Payable", content: "Payment terms are negotiated strategically to optimize cash outflows without damaging critical supplier relationships." }
      ]
    }
  }

  // Lesson 5
  const lesson6 = data.lessons.find((l: any) => l.key === "lesson-5-financial-reporting")
  if (lesson6) {
    lesson6.labeledGraphic = {
      imageUrl: "/assets/finance/course_5_finance.png",
      hotspots: [
        { id: "hotspot-5-1", x: 50, y: 50, title: "IFRS Compliance", content: "All financial statements are prepared in strict accordance with International Financial Reporting Standards as adopted in Nigeria." },
        { id: "hotspot-5-2", x: 20, y: 40, title: "Audit Trail", content: "Robust internal controls ensure every financial transaction is verifiable, preparing the organization for external audits." },
        { id: "hotspot-5-3", x: 75, y: 60, title: "Consolidated Balance Sheet", content: "The financial health of all subsidiaries is aggregated to provide stakeholders with a comprehensive view of the group's total assets and liabilities." },
        { id: "hotspot-5-4", x: 85, y: 30, title: "Profitability Metrics", content: "Net profit margins and EBITDA are highlighted to demonstrate the core earning power of the enterprise." }
      ]
    }
  }

  // Lesson 6
  const lesson7 = data.lessons.find((l: any) => l.key === "lesson-6-risk-management")
  if (lesson7) {
    lesson7.labeledGraphic = {
      imageUrl: "/assets/finance/course_6_finance.png",
      hotspots: [
        { id: "hotspot-6-1", x: 45, y: 45, title: "Market Volatility Assessment", content: "Continuous monitoring of inflation, interest rates, and currency fluctuations allows the group to proactively adjust its financial strategies." },
        { id: "hotspot-6-2", x: 15, y: 60, title: "Counterparty Credit Risk", content: "Thorough vetting of partners and clients minimizes the risk of default, protecting the group's financial interests." },
        { id: "hotspot-6-3", x: 85, y: 50, title: "Regulatory Compliance Risk", content: "Dedicated teams ensure adherence to CBN and SEC regulations, mitigating the risk of fines and reputational damage." }
      ]
    }
  }

  // Lesson 7
  const lesson8 = data.lessons.find((l: any) => l.key === "lesson-7-strategic-planning")
  if (lesson8) {
    lesson8.labeledGraphic = {
      imageUrl: "/assets/finance/course_7_finance.png",
      hotspots: [
        { id: "hotspot-7-1", x: 55, y: 55, title: "Net Present Value (NPV)", content: "Proposed investments are rigorously evaluated based on the present value of their future cash flows, ensuring they add real value." },
        { id: "hotspot-7-2", x: 25, y: 35, title: "Internal Rate of Return", content: "Projects must exceed the group's hurdle rate to be considered viable, maximizing the return on deployed capital." },
        { id: "hotspot-7-3", x: 75, y: 65, title: "Optimal Capital Structure", content: "The mix of debt and equity is carefully managed to minimize the cost of capital while avoiding excessive financial leverage." },
        { id: "hotspot-7-4", x: 15, y: 80, title: "Strategic Alignment", content: "Every major financial decision is cross-referenced with the long-term vision of EIB Group's leadership." }
      ]
    }
  }

  console.log("Updating database...")
  await db.update(courses)
    .set({ 
      customContent: JSON.stringify(data),
      imageUrl: "/assets/finance/course_cover_finance.png"
    })
    .where(eq(courses.slug, "financial-management-budgeting"))
  
  console.log("Done! 🎉")
  process.exit(0)
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
