import textwrap
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.set_text_color(15, 23, 42)
        self.cell(0, 10, 'EIB GROUP', 0, 1, 'L')
        self.set_font('Arial', '', 12)
        self.set_text_color(71, 85, 105)
        self.cell(0, 8, 'Training Programme Development & Strategic Alignment', 0, 1, 'L')
        self.ln(5)
        self.set_draw_color(37, 99, 235)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Page {self.page_no()} | Office of the Group Head, Training & Organizational Development', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 14)
        self.set_fill_color(241, 245, 249)
        self.set_text_color(15, 23, 42)
        self.cell(0, 10, f' {title}', 0, 1, 'L', 1)
        self.ln(4)

    def section_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.set_text_color(30, 64, 175)
        self.cell(0, 8, title, 0, 1, 'L')

    def body_text(self, text):
        self.set_font('Arial', '', 11)
        self.set_text_color(51, 65, 85)
        self.multi_cell(0, 6, text)
        self.ln(3)
        
    def bullet_point(self, text):
        self.set_font('Arial', '', 11)
        self.set_text_color(51, 65, 85)
        # Indent bullet points
        self.set_x(15)
        self.multi_cell(0, 6, f"- {text}")

def main():
    pdf = PDF()
    pdf.add_page()

    # Introduction
    pdf.chapter_title('1. Executive Summary')
    pdf.body_text(
        "Following the recent executive management meeting, the EIB Group is launching a massive strategic pivot. "
        "We are opening our world-class training infrastructure to government agencies, security institutions, and corporate partners. "
        "This high-tier, project-based training will run throughout the year in structured two-week residential cycles, "
        "providing a premium professional development experience valued at approximately N4 million per participant."
    )
    pdf.ln(2)

    # Corrected Subsidiary Alignment
    pdf.chapter_title('2. Accurate Subsidiary Alignment & Proposed Course Domains')
    pdf.body_text(
        "To ensure our external marketing is accurate, we must align our training offerings with the actual operational reality "
        "of our subsidiaries. The following defines the correct operational capabilities and the respective high-value courses "
        "the Training Department will immediately begin developing:"
    )

    pdf.section_title("Giga Forensics")
    pdf.body_text("Core Capability: Digital forensics, cybersecurity, and advanced intelligence applications.")
    pdf.bullet_point("Course: Advanced Cybersecurity & Threat Intelligence")
    pdf.bullet_point("Course: Digital Forensics & Evidence Recovery")
    pdf.ln(3)

    pdf.section_title("Briech UAS")
    pdf.body_text("Core Capability: Unmanned Aerial Systems (Drone) operations, maintenance, and spatial intelligence.")
    pdf.bullet_point("Course: Geographic Information Systems (GIS) Mapping & Spatial Analytics")
    pdf.bullet_point("Course: Commercial Drone Piloting & Aerial Surveillance")
    pdf.ln(3)

    pdf.section_title("EIB Stratoc")
    pdf.body_text("Core Capability: Advanced security, defense technology, and surveillance systems.")
    pdf.bullet_point("Course: Strategic Security Operations & Defense Technology Management")
    pdf.bullet_point("Course: Advanced Surveillance & Reconnaissance")
    pdf.ln(3)

    pdf.section_title("POCTOVA")
    pdf.body_text("Core Capability: Industrial garment manufacturing, tactical gear, and uniform production.")
    pdf.bullet_point("Course: Industrial Garment Production & Workflow Optimization")
    pdf.bullet_point("Course: Tactical Gear Manufacturing & Quality Control")
    pdf.ln(3)

    pdf.section_title("Luftreiber Automobile")
    pdf.body_text("Core Capability: Automotive engineering, fleet maintenance, and mobility technical solutions.")
    pdf.bullet_point("Course: Advanced Fleet Management & Automotive Diagnostics")
    pdf.bullet_point("Course: Heavy Machinery & Armored Vehicle Maintenance")
    pdf.ln(3)

    pdf.section_title("Briech Atlantic")
    pdf.body_text("Core Capability: Heavy project management, operations, and strategic maritime logistics.")
    pdf.bullet_point("Course: Large-Scale Project Management & Logistics Optimization")
    pdf.ln(5)

    # Execution Framework
    pdf.add_page()
    pdf.chapter_title('3. Delivery Framework & Immediate Action Plan')
    pdf.body_text(
        "As Group Head of Training, the responsibility of mobilizing this immense architecture lies with our department. "
        "We are executing the following immediately:"
    )

    pdf.section_title("A. Annual Calendar & Timetable Development")
    pdf.body_text(
        "We are constructing a full 1-year training calendar broken down into two-week intensive cycles. "
        "This calendar will be meticulously aligned with government budget cycles to maximize agency adoption."
    )

    pdf.section_title("B. Agency Invitation Protocol")
    pdf.body_text(
        "Following the Chairman's preliminary briefings, we are drafting tailored, official invitation letters "
        "to targeted government Ministries, Departments, and Agencies (MDAs), and security organizations (e.g., Nigerian Air Force), "
        "requesting formal participant nominations."
    )

    pdf.section_title("C. Content & LMS Preparation")
    pdf.body_text(
        "The Training Department is actively developing comprehensive, project-based course modules for GIS, Cybersecurity, "
        "Forensics, and operational management. These modules will be deployed directly onto our digital Learning Management "
        "System (LMS), complete with automated certification frameworks that validate participants' professional qualifications upon graduation."
    )

    pdf.output("Management_Training_Programme_Proposal.pdf", 'F')
    print("PDF generated successfully.")

if __name__ == '__main__':
    main()
