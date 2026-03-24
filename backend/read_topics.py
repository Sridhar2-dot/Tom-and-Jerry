import PyPDF2
reader = PyPDF2.PdfReader('c:/Users/Abcom/Documents/Game/frontend/src/components/PythonAdvance-UJRo3sUP (1).pdf')
text = ""
for i, page in enumerate(reader.pages):
    if i > 20: break
    text += page.extract_text() + "\n"
print(text)
