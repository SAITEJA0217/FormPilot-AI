import fitz

pdf_path = r'C:\P\formpilot\manuscript_deliverables\FormPilot_Manuscript_Revised.pdf'
doc = fitz.open(pdf_path)
print('PDF Verification:')
print('Total Pages:', len(doc))
for i in range(len(doc)):
    page = doc[i]
    text = page.get_text()
    first_line = text.splitlines()[0] if text.splitlines() else ''
    last_line = text.splitlines()[-1] if text.splitlines() else ''
    print(f'Page {i+1}: length={len(text)} chars | starts="{first_line[:50]}" | ends="{last_line[:50]}"')
