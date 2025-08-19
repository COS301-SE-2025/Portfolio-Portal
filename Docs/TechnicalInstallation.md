# PortfolioPortal

## Technical Installation Manual

### Please refer to our [Google Docs document](https://docs.google.com/document/d/1KhyXSj1a-Nh9sYJlSksyh8CfJHQmo1Nhs8T0O-OssVc/edit?tab=t.0) for a more detailed specification.

---

**Version:** 1.0

**Date:** 08/2025

---

**Group name:** Ctrl Freaks

---

### Team Members

| Name and Surname | Student Number |
| ---------------- | -------------- |
| Eric Booyens     | u05127824      |
| Angelique Breedt | u23542838      |
| Nabegh Muhra     | u23661268      |
| Keegan Walker    | u22693760      |
| Christopher Yoko | u22857941      |

---

> \_The technical installation manual should detail all the information to clone your main branch and configure your system to run and install. This includes all the necessary installation of additional software needed by your system. It would be best to cater for multiple operating systems depending on your system requirements. Provide detailed instructions with screenshots to improve the quality of the installation manual. There is no specifc structure to this document since it would be system specific, but ensure you include the following aspects:
> • Introduction- a paragraph on how the system works and what needs installation. For example, if your system has a front and back end, you need to mention the various aspects that must be installed before the detailed explanation/guide.
> • Prerequisites- any software or packages needed for your system to work. You should list the requirements rst. After that, specify a resource or provide instructions on how to install the prerequisites.
> • Installation- this describes how the installation of your system would work.
> • Deployment/Running- detail how your system should be executed and provide the link to your user manual on how the system should be used.
> Note: Be sure to specify version numbers for everything (packages, dependencies, etc.); this is key in ensuring the maintainability and correct installation of your system post-development.
> \_

---

## Table of Contents

| #   | Section                                           | Page |
| --- | ------------------------------------------------- | ---- |
| 1   | [Introduction](#1-introduction)                   | 2    |
| 2   | [Prerequisites](#2-prerequisites)                 | 3    |
| 3   | [Installation Steps](#3-installation-steps)       | 4    |
| 4   | [Deployment & Running](#4-deployment--running)    | 5    |
| 5   | [Production Deployment](#5-production-deployment) | 6    |

---

# 1. Introduction

The Portfolio Portal system consists of two main components:

1. **Backend Server** – A Node.js service that processes uploaded CV PDFs by extracting text using OCR (Optical Character Recognition).

2. **Frontend Web Application** – A modern React-based interface that allows users to upload CVs, choose templates, and view the generated 3D portfolio.

Both components must be installed and configured before running the system. This guide provides detailed steps for installing prerequisites, setting up the system, and running it on **Windows, macOS, or Linux (Ubuntu/Debian)**.

---

# 2. Prerequisites

## 2.1 Backend (OCR Server)

**Software Requirements:**

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes bundled with Node.js)
- **GraphicsMagick**
- **Tesseract OCR**
- **Poppler**
- **Ghostscript**

## OS-specific Installation:

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install graphicsmagick tesseract-ocr poppler-utils ghostscript
```

### macOS (using Homebrew)

```bash
brew install graphicsmagick tesseract poppler ghostscript
```

### Windows

1. Install GraphicsMagick

2. Install Tesseract OCR for Windows

3. Install Poppler for Windows

4. Install Ghostscript

5. Add all installations to your **PATH** environment variable.

## 2.2 Frontend

**Software Requirements:**

- **Node.js** v18.x or higher

- **npm** or **yarn** package manager

---

# 3 Installation Steps

## 3.1 Clone the Repository

```bash
git clone https://github.com/COS301-SE-2025/Portfolio-Portal
```

## 3.2 Backend Installation

1. Navigate to the backend folder:

```bash
cd Portfolio-Portal/server
```

2. Install dependencies:

```bash
npm install
```

3. Verify that required OCR tools are installed (see prerequisites).

4. (Optional) Create an `.env` file for environment-specific settings.

## 3.3 Frontend Installation

1. Navigate to the frontend folder:

```bash
cd Portfolio-Portal/frontend
```

2. Install dependencies:

```bash
npm install
```

---

# 4 Deployment & Running

## 4.1 Running Backend (OCR Server)

```bash
cd Portfolio-Portal/server
node server.js
```

The server will run on:

```
http://localhost:5050
```

## 4.2 Running Frontend

In a new terminal:

```bash
cd Portfolio-Portal/frontend
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

## 4.3 API Test (Optional)

To test OCR API with Postman:

1. Set method to **POST**.

2. Use URL:

```
http://localhost:5050/api/ocr/upload
```

3. Select **form-data** with key **cv** (type: File).

4. Upload a **.pdf** CV.

5. Click **Send** and check for JSON response.

---

# 5 Production Deployment

For production:

1. **Backend**: Deploy to a Node-compatible hosting service (e.g., Heroku, AWS EC2, Render).

2. **Frontend**: Build and deploy to static hosting (Vercel)

```bash
cd Portfolio-Portal/frontend
npm run build
```

Deploy the `dist/` folder.

## Additional Notes

- Ensure **all OCR dependencies** are installed and accessible via PATH (especially on Windows).

- Screenshots of terminal commands, folder structure, and running application should be added for clarity. _(Insert placeholders in final document for screenshots.)_

- Link to **User Manual** for using the system:

```
https://docs.google.com/document/d/1xpYEr_gpnPbiTEHjSDPLsoRo8oy0msK5yuGsxLp-_v0/edit?usp=sharing
```
