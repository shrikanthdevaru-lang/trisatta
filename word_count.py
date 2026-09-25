import docx
doc = docx.Document('Full_Research_Paper.docx')
text = " ".join([p.text for p in doc.paragraphs])
words = len(text.split())
print(f"Word count: {words}")
