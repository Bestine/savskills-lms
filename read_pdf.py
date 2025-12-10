import sys
import io

# Set UTF-8 encoding for console output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

try:
    import PyPDF2
    
    pdf_path = r'c:\Users\PC\Desktop\UBUNIFU\Savskills Issue.pdf'
    
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        
        print(f"Total pages: {num_pages}\n")
        
        for i, page in enumerate(reader.pages):
            print(f"--- Page {i+1} ---")
            text = page.extract_text()
            print(text)
            print("\n" + "="*80 + "\n")
            
except ImportError:
    print("PyPDF2 not installed. Attempting to install...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyPDF2"])
    print("PyPDF2 installed. Please run the script again.")
except Exception as e:
    print(f"Error: {e}")
