import io
import pypdf
import docx

def extract_text_from_file(file_obj, filename: str) -> str:
    """
    Extract text content from uploaded PDF or DOCX file.
    """
    ext = filename.lower().split('.')[-1]
    
    if ext == 'pdf':
        try:
            reader = pypdf.PdfReader(file_obj)
            extracted_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
            full_text = "\n".join(extracted_text).strip()
            if not full_text:
                raise ValueError("PDF file appears to be empty or image-only (scanned).")
            return full_text
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError(f"Could not parse PDF file: {str(e)}")

    elif ext in ['docx', 'doc']:
        try:
            document = docx.Document(file_obj)
            paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
            full_text = "\n".join(paragraphs).strip()
            if not full_text:
                raise ValueError("DOCX file contains no extractable text.")
            return full_text
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError(f"Could not parse DOCX file: {str(e)}")

    elif ext == 'txt':
        try:
            content = file_obj.read().decode('utf-8', errors='ignore').strip()
            if not content:
                raise ValueError("TXT file is empty.")
            return content
        except Exception as e:
            raise ValueError(f"Could not read text file: {str(e)}")

    else:
        raise ValueError(f"Unsupported file format '.{ext}'. Please upload a PDF or DOCX file.")
