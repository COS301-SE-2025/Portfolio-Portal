# Portfolio Portal OCR Server

This backend Node.js server handles OCR for CVs uploaded as PDFs. It uses `pdf2pic` to convert PDF pages to images, and `node-tesseract-ocr` to extract text from those images.

---

## Requirements

Before running the server, make sure the following system dependencies are installed.

### Ubuntu / Debian
```bash
sudo apt update
sudo apt install graphicsmagick tesseract-ocr poppler-utils ghostscript
```

### macOS (using Homebrew)
```bash
brew install graphicsmagick tesseract poppler ghostscript
```

### Windows
1. [Install GraphicsMagick](http://www.graphicsmagick.org/download.html)
2. [Install Tesseract OCR for Windows](https://github.com/tesseract-ocr/tesseract/wiki#windows)
3. [Install Poppler for Windows](http://blog.alivate.com.au/poppler-windows/)
4. [Install Ghostscript](https://www.ghostscript.com/download/gsdnld.html)
5. Add all installations to your `PATH` environment variable

---

## Setup Instructions

1. **Install Node.js dependencies:**

```bash
npm install
```

2. **Start the server:**

```bash
node server.js
```

The server will start on [http://localhost:5000](http://localhost:5000).

---

## API Usage

### `POST /api/ocr/upload`

**Description**: Upload a PDF CV and extract raw text from it.

**Request**: `multipart/form-data` with key `file`

**Response**:
```json
{
  "success": true,
  "data": {
    "profile": "...",
    "education": [...],
    "experience": [...],
    "skills": [...],
    ...
  }
}
```

---

## Testing with Postman

You can test the OCR endpoint using [Postman](https://www.postman.com/):

1. Open Postman.
2. Set the method to `POST`.
3. Enter the request URL:
   ```
   http://localhost:5000/api/ocr/upload
   ```
4. Go to the **Body** tab.
5. Select **form-data**.
6. In the **Key** field, type:
   ```
   file
   ```
   and set the type to **File** using the dropdown.
7. In the **Value** field, click **Select Files** and upload your `.pdf` CV file.
8. Click **Send**.

You should receive a JSON response containing the extracted and structured CV data.

---

## Project Structure

```
project-root/
├── app.js                        # Express app setup with middleware
├── server.js                     # Starts the server
├── uploads/                      # Temporary PDF storage from multer
│
├── routes/
│   ├── ocr.routes.js             # Handles /api/ocr/upload route
│   └── portfolio.routes.js       # (optional) Future portfolio logic
│
├── controllers/
│   └── ocr.controller.js         # Handles file upload + OCR logic
│
├── services/
│   └── ocr.service.js            # Converts PDF to images + runs OCR
│
├── utils/
│   └── cv-analyzer.js            # Parses raw OCR text into sections (e.g., profile, skills)
│
├── package.json
├── package-lock.json
├── README.md                     # Setup guide with dependencies and usage
```

---