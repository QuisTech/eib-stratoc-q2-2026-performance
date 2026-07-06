import csv
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
    admin_emails = {
        "muhammad.bashir@eibgroup.com", "kenneth.onuh@eibgroup.com", "solomon.jideobi@eibgroup.com",
        "michael.marquis@eibgroup.com", "emanuella.ezenwochi@eibgroup.com", "paul.wokili@eibgroup.com",
        "anthony.itegbe@eibgroup.com", "bwala.dalta@eibgroup.com", "tesini.dombo@eibgroup.com",
        "ibrahim.ladan@eibgroup.com", "celina.john@eibgroup.com", "ayodeji.giwa@eibgroup.com",
        "nancy.manuezeuko@eibgroup.com", "donald.oshoke@eibgroup.com", "judith.sylvanus@eibgroup.com",
        "kate.edward@poctova.com", "marvis.okharedia@poctova.com", "iheanyichukwu.okpo@gigaforensics.com",
        "deborah.eyefia@gigaforensics.com", "mubarak.sani@briechuas.com", "helen.chikwem@eibstratoc.com",
        "helen.chikwem@dico.eibstratoc.com", "benjamin.antah@eibstratoc.com", "kenneth.mbadugha@briechatlantic.com",
        "junaid.raza@luftreiber.com", "anita.erukunuakpor@brightfm.com", "daniel.ejike@brightfm.com",
        "alinwaeze.jude@bef.com", "joy.abraham@briechhospital.com", "joyce.ibrahim@eibgroup.com"
    }

    subsidiaries = {}

    with open('master_staff_emails_complete.csv', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            email = row.get('Email', '')
            if email in admin_emails:
                sub = "ADMINISTRATION (GROUP HEADS & SUBSIDIARY MANAGERS)"
            else:
                sub = row.get('Subsidiary', 'Unassigned')
                
            if sub not in subsidiaries:
                subsidiaries[sub] = []
            subsidiaries[sub].append({
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
    
    # Red lines (Border color)
    pdf.set_draw_color(220, 38, 38)
    pdf.set_line_width(0.8)
    
    # Highlight (Fill color: light red/pink)
    pdf.set_fill_color(254, 242, 242)
    
    # Text color (Dark red)
    pdf.set_text_color(185, 28, 28)
    
    notice = (
        "SECURITY NOTICE: REQUIRED PASSWORD UPDATE\n\n"
        "Welcome! Your account was generated using a temporary default password during our system rollout.\n\n"
        "To ensure the complete privacy and security of your account, you are required to set a personal password before accessing the platform. This guarantees that only you have access to your account."
    )
    
    # MultiCell with borders, centered, filled
    pdf.multi_cell(0, 8, notice, border=1, align='C', fill=True)
    pdf.ln(10)
    
    # Reset colors for the rest of the document
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.2)
    pdf.set_text_color(0, 0, 0)
    
    first_page = True
    
    for sub in sorted(subsidiaries.keys()):
        if first_page:
            first_page = False
        else:
            pdf.add_page()
            
        pdf.set_font('Arial', 'B', 14)
        pdf.set_text_color(37, 99, 235)
        pdf.cell(0, 10, sub.upper(), 0, 1, 'L')
        pdf.set_font('Arial', '', 10)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(0, 6, f'Total Staff: {len(subsidiaries[sub])}', 0, 1, 'L')
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
        for staff in subsidiaries[sub]:
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

    pdf.output('EIB_Group_Staff_Credentials.pdf', 'F')
    print("PDF successfully created.")

if __name__ == '__main__':
    main()
