import win32com.client
import os

word = None
try:
    docx_path = os.path.abspath(r'C:\P\formpilot\manuscript_deliverables\FormPilot_Manuscript_Revised.docx')
    pdf_path = os.path.abspath(r'C:\P\formpilot\manuscript_deliverables\FormPilot_Manuscript_Revised.pdf')

    word = win32com.client.Dispatch('Word.Application')
    word.Visible = False

    print(f"Opening {docx_path} in Word...")
    doc = word.Documents.Open(docx_path)
    print(f"Exporting to {pdf_path}...")
    doc.ExportAsFixedFormat(pdf_path, 17) # 17 = wdExportFormatPDF
    doc.Close(False)

    print(f"[OK] Successfully exported PDF: {pdf_path}")
    print(f"File size: {os.path.getsize(pdf_path)} bytes")
except Exception as e:
    print(f"Error exporting PDF: {e}")
finally:
    if word:
        word.Quit()
