import csv
import re
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 18)
        self.set_text_color(15, 23, 42)
        self.cell(0, 10, 'EIB GROUP', 0, 1, 'C')
        self.set_font('Arial', '', 12)
        self.set_text_color(71, 85, 105)
        self.cell(0, 8, 'Staff Login Credentials Directory', 0, 1, 'C')
        self.ln(5)

def main():
    executives = []

    executives_list = [
        "chairman@eibgroup.com",
        "evp-ops-admin@eibgroup.com",
        "evp-finance-commercial@eibgroup.com"
    ]

    with open('master_staff_emails_complete.csv', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            email = row.get('Email', '')
            if email in executives_list:
                executives.append({
                    'first': row.get('First Name', ''),
                    'last': row.get('Last Name', ''),
                    'role': row.get('Job Title', ''),
                    'email': email,
                    'pwd': row.get('Password', 'Changepwd')
                })

    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # --- ADD THE SECURITY NOTICE ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 11)
    
    pdf.set_draw_color(220, 38, 38)
    pdf.set_line_width(0.8)
    pdf.set_fill_color(254, 242, 242)
    pdf.set_text_color(185, 28, 28)
    
    notice = (
        "SECURITY NOTICE: REQUIRED PASSWORD UPDATE\n\n"
        "Welcome! Your account was generated using a temporary default password during our system rollout.\n\n"
        "To ensure the complete privacy and security of your account, you are required to set a personal password before accessing the platform. This guarantees that only you have access to your account.\n\n"
        "AHEAD OF THE CURVE: We are continuously expanding our training catalog, actively populating the platform with world-class, industry-standard courses designed to elevate your professional capabilities and drive our Group forward.\n\n"
        "STRATEGIC ALIGNMENT: All Executive Retreat Briefings are securely available on the platform for direct consulting, reference, and strategic alignment (Accessible exclusively to Group Heads and Subsidiary Managers)."
    )
    
    pdf.multi_cell(0, 6, notice, border=1, align='C', fill=True)
    pdf.ln(10)
    
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.2)
    pdf.set_text_color(0, 0, 0)
    
    # Add Title
    pdf.set_font('Arial', 'B', 14)
    pdf.set_text_color(37, 99, 235)
    pdf.cell(0, 10, "EIB GROUP EXECUTIVES", 0, 1, 'L')
    pdf.set_font('Arial', '', 10)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 6, f'Total Executives: {len(executives)}', 0, 1, 'L')
    pdf.ln(5)
    
    # Table Header
    pdf.set_font('Arial', 'B', 8)
    pdf.set_fill_color(15, 23, 42)
    pdf.set_text_color(255, 255, 255)
    
    col_widths = [25, 30, 45, 65, 25]
    headers = ['First Name', 'Last Name', 'Job Title / Role', 'Login Email', 'Temp Pwd']
    
    for i, h in enumerate(headers):
        pdf.cell(col_widths[i], 8, h, 1, 0, 'C', 1)
    pdf.ln()
    
    # Table Body
    pdf.set_font('Arial', '', 7)
    pdf.set_text_color(51, 65, 85)
    pdf.set_fill_color(248, 250, 252)
    
    fill = False
    for staff in executives:
        fn = staff['first'][:20]
        ln = staff['last'][:20]
        role = staff['role'][:35]
        email = staff['email'][:45]
        pwd = staff['pwd']
        
        pdf.cell(col_widths[0], 6, fn, 1, 0, 'L', fill)
        pdf.cell(col_widths[1], 6, ln, 1, 0, 'L', fill)
        pdf.cell(col_widths[2], 6, role, 1, 0, 'L', fill)
        pdf.cell(col_widths[3], 6, email, 1, 0, 'L', fill)
        pdf.cell(col_widths[4], 6, pwd, 1, 0, 'C', fill)
        pdf.ln()
        fill = not fill

    pdf.output("Executives_Credentials.pdf", 'F')
    print("Generated Executives_Credentials.pdf")

if __name__ == '__main__':
    main()
