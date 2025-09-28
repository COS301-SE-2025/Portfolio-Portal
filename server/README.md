# Portfolio Portal OCR Server

This backend Node.js server handles OCR for CVs uploaded as PDFs/images/office files.  
It rasterizes pages, runs Tesseract OCR, extracts sections, and saves structured data to Supabase.

---

## Requirements

Before running the server, make sure the following system dependencies are installed.

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install graphicsmagick tesseract-ocr poppler-utils ghostscript libreoffice
```

### macOS (using Homebrew)

```bash
brew install graphicsmagick tesseract poppler ghostscript
brew install --cask libreoffice
```

### Windows

1. [Install GraphicsMagick](http://www.graphicsmagick.org/download.html)
2. [Install Tesseract OCR for Windows](https://github.com/tesseract-ocr/tesseract/wiki#windows)
3. [Install Poppler for Windows](http://blog.alivate.com.au/poppler-windows/)
4. [Install Ghostscript](https://www.ghostscript.com/download/gsdnld.html)
5. Install libre office
6. Add all installations to your `PATH` environment variable

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

The server will start on [http://localhost:5050](http://localhost:5050).

---

## API Usage

### `POST /api/ocr/upload`

**Description**: Upload a PDF CV and extract raw text from it.

**Request**: `multipart/form-data` with key `cv`

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

You can test the OCR endpoint using [Postman](https://www.postman.com/).  
⚠️ Note: You must **log in first to get a JWT token** before uploading a CV.

### Step 1 — Log in and get a token

1. Open Postman.
2. Set the method to `POST`.
3. Enter the request URL:
   ```
   http://localhost:5050/api/users/login
   ```
4. Go to the **Body** tab.
5. Select **raw**.
6. Choose JSON.
7. Paste valid credentials, e.g:
   ```json
   {
     "email": "valid_email",
     "password": "password"
   }
   ```
8. Click **send**.
9. Copy the token (excluding quotations)

### Step 2 — Upload a CV

1. Open Postman.
2. Set the method to `POST`.
3. Enter the request URL:
   ```
   http://localhost:5050/api/ocr/upload
   ```
4. Go to the **Header** tab.
5. Add a key **Authorization**, wiht the value:

```
Bearer <paste-your-token-here>
```

6. Go to the **Body** tab.
7. Select **form-data**.
8. Add a new field,

```
key: cv
Type: file
Value: your file that you want to upload
```

9. Click **send**

---

## Project Structure

```
server/
├── app.js
├── server.js
├── .env
├── templates/
│   ├── cave-portfolio/
│   ├── forest-portfolio/
│   ├── office-portfolio/
│   ├── react-portfolio/
│   └── space-portfolio/
├── tests/
│   └── unit/__tests__/sectionizer.test.js
├── app/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── cv.controller.js
│   │   ├── github.controller.js
│   │   ├── ocr.controller.js
│   │   ├── portfolio.controller.js
│   │   └── users.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── profileValidation.js
│   │   └── upload.js
│   ├── models/
│   │   ├── CVData.js
│   │   ├── Portfolio.js
│   │   ├── profileUser.js
│   │   └── User.js
│   ├── routes/
│   │   ├── cv.routes.js
│   │   ├── github.routes.js
│   │   ├── ocr.routes.js
│   │   ├── portfolio.routes.js
│   │   └── users.routes.js
│   ├── services/
│   │   ├── cv.service.js
│   │   ├── extractor.service.js
│   │   ├── github.service.js
│   │   ├── ocr.service.js
│   │   └── template.service.js
│   └── utils/
│       ├── section-keywords.js
│       └── sectionizer.js
├── uploads/
└── app/uploads/

```

---
