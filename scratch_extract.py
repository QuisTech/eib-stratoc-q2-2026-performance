import os
import sys
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
import docx2txt

def extract_pptx(filepath):
    prs = Presentation(filepath)
    text_runs = []
    
    print(f"\n--- Extracting PPTX: {filepath} ---")
    for i, slide in enumerate(prs.slides):
        print(f"\nSlide {i + 1}:")
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text:
                print(shape.text.strip())
            
            # Identify tables
            if shape.has_table:
                print("[TABLE FOUND]")
                table = shape.table
                for row in table.rows:
                    row_data = [cell.text.strip().replace('\n', ' ') for cell in row.cells]
                    print(" | ".join(row_data))
                    
            # Identify charts
            if shape.has_chart:
                print("[CHART FOUND]")
                chart = shape.chart
                print(f"Chart Type: {chart.chart_type}")
                if chart.has_title:
                    print(f"Chart Title: {chart.chart_title.text_frame.text}")

def extract_docx(filepath):
    print(f"\n--- Extracting DOCX: {filepath} ---")
    text = docx2txt.process(filepath)
    print(text[:2000] + "\n... (truncated)" if len(text) > 2000 else text)

if __name__ == "__main__":
    giga_path = r"C:\Users\Administrator\Downloads\Presentations\Iheanyi - Giga Forensics\GIGA FORENSICS HALF YEAR PLAN.pptx"
    extract_pptx(giga_path)
    
    gcoo_docx = r"C:\Users\Administrator\Downloads\Presentations\Tes - GCOO\GROUP CHIEF OPERATIONS OFFICER'S COMPREHENSIVE MANAGEMENT REPORT.docx"
    gcoo_pptx = r"C:\Users\Administrator\Downloads\Presentations\Tes - GCOO\GROUP GCOO WORK PLAN 2026.pptx"
    
    if os.path.exists(gcoo_docx):
        extract_docx(gcoo_docx)
    if os.path.exists(gcoo_pptx):
        extract_pptx(gcoo_pptx)
