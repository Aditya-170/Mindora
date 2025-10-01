# app.py
from flask import Flask, request, jsonify
import requests
from PyPDF2 import PdfReader
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "PDF Extraction Server is running ✅"}), 200


# PDF extraction route
@app.route("/extract-pdf", methods=["POST"])
def extract_pdf():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # Download PDF
        response = requests.get(url)
        response.raise_for_status()

        # Read PDF
        pdf_file = BytesIO(response.content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        return jsonify({"text": text, "numPages": len(reader.pages)})
    except Exception as e:
        print("Error extracting PDF:", e)
        return jsonify({"error": "Failed to extract PDF"}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
