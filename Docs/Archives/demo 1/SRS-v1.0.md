# PortfolioPortal

## Requirements Specification

**Version:** 1.0 
**Date:** 05/2025

---

## Table of Contents

1. [Introduction](#1️-introduction)
2. [Domain Model](#2-domain-model)
3. [User Stories/ User Characteristics](#3-user-stories-user-characteristics)
4. [Use Cases](#4-use-cases)
5. [Functional Requirements](#5-functional-requirements)
6. [Architectural Requirements](#6-architectural-requirements)
7. [Technology Requirements](#7-technology-requirements)
8. [Service Contracts](#8-service-contracts)
9. [Burndown Chart](#9-burndown-chart)
10. [Appendix](#10-appendix)

---

## 1. Introduction

### Purpose

The purpose of this document is to document the iterative process of evaluating the client’s needs. A software engineering methodology is used to elicit, plan, and design the solution based on the requirements recorded here.

### Overview

PortfolioPortal is an innovative web platform that enables users to create immersive, interactive 3D portfolio websites dynamically by simply uploading their CV. The system uses OCR technology to extract information from CVs and intelligently match it with appropriate 3D templates to generate personalized portfolio websites.

---

## 2. Domain Model

Please refer to [this link](https://docs.google.com/document/d/1br4loDNRrGsrz9mSQ0SoNAe4SZyIbOtNAWUlk0Hqpd4/edit?tab=t.0) for the Google Docs document containg the Domain Model diagram.

---

## 3. User Stories/ User Characteristics

### 3.1 User Characteristics

---

### Primary User Types

**1. Job Seekers/ Fresh Graduates**

- **Demographics:** 22-35 years old, recent graduates or early-career professionals.
- **Technical Skills:** Basic to intermediate computer literacy, familiar with web browsing.
- **Goals:** Create impressive portfolio websites to stand out to employers.
- **Pain Points:** Limited web development skills, time constraints, lack of design expertise.
- **Motivations:** Career advancement, professional presentation, competitive advantage.

**2. Creative Professionals**

- **Demographics:** 25-45 years old, designers, artists, photographers, architects.
- **Technical Skills:** Intermediate to advanced design skills, moderate technical knowledge.
- **Goals:** Showcase creative work in an innovative, interactive format.
- **Pain Points:** Need unique presentation methods, want to demonstrate technical awareness.
- **Motivations:** Client acquisition, portfolio differentiation, artistic expression.

**3. Students (Computer Science/ IT)**

- **Demographics:** 18-25 years old, undergraduate/postgraduate students.
- **Technical Skills:** Good technical understanding, learning web technologies.
- **Goals:** Create portfolios for internships, demonstrate technical projects.
- **Pain Points:** Limited professional experience, need to showcase potential.
- **Motivations:** Academic requirements, internship applications, skill demonstration.

**4. Freelancers & Consultants**

- **Demographics:** 28-50 years old, independent professionals across various fields.
- **Technical Skills:** Variable, usually business-focused rather than technical.
- **Goals:** Professional credibility, client acquisition, service differentiation.
- **Pain Points:** Limited marketing budget, need professional presence quickly.
- **Motivations:** Business growth, client trust, competitive positioning.

---

### 3.2 User Stories

---

**Epic 1: CV Upload and Processing**

**Core Functionality Stories**

**US001: Upload CV**

- **As a** job seeker  
- **I want to** upload my CV in various formats (PDF, DOC, DOCX)  
- **So that** I can quickly create a portfolio website without manual data entry  
- **Acceptance Criteria**:
  - System accepts PDF, DOC, and DOCX file formats
  - File size limit of 10MB enforced
  - Progress indicator shows upload status
  - Error messages for unsupported formats or oversized files

**US002: OCR Text Extraction**

- **As a** user
- **I want** the system to automatically extract text from my uploaded CV
- **So that** I don't have to manually input my information
- **Acceptance Criteria:**
  - OCR successfully extracts text with 95% accuracy
  - System identifies key sections (contact info, experience, education, skills)
  - Extracted data is displayed for user verification
  - User can edit extracted information before proceeding

**US003: Template Selection Algorithm**

- **As a** user  
- **I want** the system to automatically suggest the most suitable 3D template  
- **So that** my portfolio matches my professional profile and industry  
- **Acceptance Criteria**:
  - Algorithm analyzes CV content and suggests appropriate template
  - System provides reasoning for template selection
  - User can override automatic selection
  - At least 4 template options available (office, space, forest, cave)

---

**Epic 2: 3D Portfolio Generation**

**US004: 3D Website Generation**

- **As a** user  
- **I want** my portfolio data automatically populated into a 3D template  
- **So that** I can have an interactive portfolio website without coding  
- **Acceptance Criteria**:
  - Personal information correctly mapped to template sections
  - Work experience displayed chronologically in 3D environment
  - Skills and achievements highlighted appropriately
  - Navigation between sections is intuitive and smooth

**US005: Template Customization**

- **As a** creative professional  
- **I want to** customize colors, layouts, and elements within my chosen template  
- **So that** my portfolio reflects my personal brand and style  
- **Acceptance Criteria**:
  - Color scheme can be modified
  - Text fonts and sizes are adjustable
  - 3D objects can be repositioned within limits
  - Changes preview in real-time

**US006: Multiple View Modes**

- **As a** user  
- **I want to** explore my 3D portfolio in different viewing modes  
- **So that** I can choose the most engaging presentation style  
- **Acceptance Criteria**:
  - First-person navigation mode available
  - Third-person/fly-through mode available
  - Smooth transitions between view modes
  - Controls are intuitive and responsive

---

**Epic 3: Portfolio Management**

**US007: Preview and Testing**

- **As a** user  
- **I want to** preview my 3D portfolio before publishing  
- **So that** I can ensure everything looks professional and functions correctly  
- **Acceptance Criteria**:
  - Full preview mode with all functionality
  - Performance metrics displayed (load time, frame rate)
  - Mobile responsiveness testing available
  - Option to make adjustments based on preview

**US008: Code Download and Sharing**

- **As a** developer  
- **I want to** download the generated portfolio code  
- **So that** I can host it on my own domain or make advanced customizations  
- **Acceptance Criteria**:
  - Complete HTML, CSS, and JavaScript files provided
  - Code is well-commented and organized
  - README file with deployment instructions included
  - Option to share via GitHub or other platforms

**US009: Account Management**

- **As a** frequent user  
- **I want to** create an account to save and manage multiple portfolios  
- **So that** I can maintain different versions for different purposes  
- **Acceptance Criteria**:
  - User registration and authentication system
  - Dashboard showing all saved portfolios
  - Version history and comparison features
  - Easy portfolio duplication and modification

---

**Epic 4: Advanced Features**

**US010: Custom Template Upload**

- **As a** advanced user  
- **I want to** upload my own 3D template  
- **So that** I can have a completely unique portfolio design  
- **Acceptance Criteria**:
  - Template validation ensures compatibility
  - Support for common 3D formats (GLTF, OBJ)
  - Template meets accessibility and performance standards
  - Clear guidelines provided for template creation

**US011: Dynamic Content Editor**

- **As a** user  
- **I want to** modify elements within my 3D portfolio after generation  
- **So that** I can keep my portfolio updated without regenerating everything  
- **Acceptance Criteria**:
  - In-scene editing capabilities
  - Drag-and-drop element replacement
  - Real-time updates to portfolio content
  - Undo/redo functionality for changes

**US012: Theme Management**

- **As a** user  
- **I want to** apply different visual themes to the platform interface  
- **So that** I can personalize my user experience  
- **Acceptance Criteria**:
  - Multiple theme options available
  - Dark/light mode toggle
  - Themes persist across sessions
  - Custom theme creation tools

---

## 4. Use Cases

Please refer to [this link](https://docs.google.com/document/d/1br4loDNRrGsrz9mSQ0SoNAe4SZyIbOtNAWUlk0Hqpd4/edit?tab=t.0) for the Google Docs document containg the Use Case diagrams.

---

## 5. Functional Requirements

> Specify the functional requirements to satisfy the use cases. Assign the requirements to subsystems.

### FR1: OCR Scanner
- **FR1.1**: The system shall allow users to upload a CV in image or PDF format.
- **FR1.2**: The system shall use Optical Character Recognition (OCR) to extract text content from the uploaded CV.
- **FR1.3**: The system shall analyze the extracted CV content and determine the most suitable 3D template based on predefined criteria or an algorithm.
- **FR1.4**: The system shall display the selected template to the user for confirmation or customization.

### FR2: 3D Website Templates
- **FR2.1**: The system shall provide at least four predefined 3D templates: office, space, forest, and cave.
- **FR2.2**: The system shall allow the user to preview each 3D template.
- **FR2.3**: The system shall allow the user to customize content within the selected 3D template (e.g., insert CV details, images, links).

### FR3: Deploy Site on Localhost
- **FR3.1**: The system shall generate a deployable version of the customized portfolio website.
- **FR3.2**: The system shall automatically deploy the generated website to localhost for local viewing.
- **FR3.3**: The system shall notify the user of the localhost address/port where the site is viewable.

### FR4: Code Sharing/Download
- **FR4.1**: The system shall generate the full source code for the customized portfolio website.
- **FR4.2**: The system shall allow users to download the generated website code as a ZIP file.
- **FR4.3**: The system shall provide sharing options (e.g., GitHub link generation or direct share to platforms, if applicable).
- **FR4.4**: The system shall ensure that the downloaded/shared code includes all assets and configurations necessary to run the website.

---

## 6. Architectural Requirements

### 6.1 Quality Requirements

- **QR1: Availability**  
  Ensure the system has maximum uptime with minimal crashes.

- **QR2: Performance**  
  Ensure a seamless user experience without too much delay.

- **QR3: Usability**  
  Design a User Interface that is visually appealing and easy to understand.

- **QR4: Maintainability**  
  Create a system that allows easy changes to templates or other areas of the system for future changes or expansions.

---

### 6.2 Architectural Patterns

**Client-Server Pattern**

The Client-Server Architectural Pattern will be utilized for this project due to its advantages in usability. It is a computing model in which client devices request services or resources from servers, which in turn provide responses accordingly.  
This pattern allows for low coupling and high cohesion, making the architecture easy to comprehend and change.

---

### 6.3 Design Patterns

#### 6.3.1 Strategy Pattern
The Strategy design pattern is a behavioural pattern that enables an object to alter its behaviour dynamically at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable.  
**Usage**: 3D template selection algorithm.

#### 6.3.2 Abstract Factory Pattern
The Abstract Factory pattern provides an interface for creating families of related objects without specifying their concrete classes.  
**Usage**: Creation of 3D objects in templates (e.g. planets, trees, furniture).

#### 6.3.3 Model-View-Controller (MVC)
The MVC pattern separates an application into Model (data/business logic), View (UI), and Controller (input handling).  
**Usage**: Core PortfolioPortal system structure.

---

### 6.4 Constraints

- The use of third-party libraries is restricted but not entirely ruled out.
- Discussion may take place to approve library usage as needed.

---

## 7. Technology Requirements

### 7.1 Software Requirements

- **Programming Languages**: JavaScript
- **Frameworks/Libraries**: React, Vite, Angular
- **Databases**: MongoDB
- **Development Tools**: VS Code, Maven, Gradle, Git
- **APIs**: RESTful APIs

---

### 7.2 Security Requirements

- **Authentication**: OAuth2, JWT, Multi-factor authentication
- **Authorization**: One user per account at a time (no roles)
- **Data Encryption**: SSL/TLS (in transit), AES (at rest)
- **Compliance**: GDPR, HIPAA, PCI-DSS

---

### 7.3 Network & Communication Requirements

- **Protocols**: HTTP/HTTPS, TCP/IP, WebSockets, MQTT
- **Latency/Bandwidth**: Minimum acceptable thresholds
- **Connectivity**: Online/offline access, synchronization, real-time updates

---

### 7.4 Testing & Quality Assurance

- **Unit Testing**: JUnit, PyTest, NUnit
- **CI/CD**: GitHub Actions, GitLab CI
- **Static Analysis**: ESLint
- **Automated Testing**: Jest, Cypress, Postman

---

### 7.5 Deployment Requirements

- **Hosting Environment**: Vercel
- **Containerization**: Docker
- **Monitoring & Logging**: Prometheus, Grafana, ELK stack (to be verified)

---

## 8. Service Contracts

### Service: `uploadCV`

**Request**
`POST /api/cv/upload`

```json
{
  "file": "<binary PDF or image>"
}
```

**Response**
```json
{
  "cvId": "abc123",
  "status": "uploaded",
  "extractedText": "John Doe, Software Engineer, JavaScript, React, Three.js..."
}
```

**Effect**
- Stores the CV file temporarily or in a document store.
- Triggers OCR processing and text extraction.
- Saves extracted data in the database linked to a `cvId`.

---

### Service: `selectTemplate`

**Request**
`POST /api/template/select`

```json
{
  "cvId": "abc123"
}
```

**Response**
```json
{
  "templateId": "space-theme-01",
  "templateName": "Outer Space Portfolio",
  "matchedKeywords": ["JavaScript", "3D", "Three.js"]
}
```

**Effect**
- Uses extracted CV text to determine the most appropriate template using keyword matching or an ML model.
- Saves selected template info linked to the user/session.

---

### Service: `generatePortfolio`

**Request**
`POST /api/portfolio/generate`

```json
{
  "cvId": "abc123",
  "templateId": "space-theme-01"
}
```

**Response**
```json
{
  "portfolioUrl": "http://localhost:3000/portfolio/abc123",
  "status": "generated"
}
```

**Effect**
- Combines extracted CV data with the selected 3D template.
- Renders and deploys a personalized portfolio site locally.
- Creates a folder or static build with HTML/CSS/JS for the portfolio.

---

### Service: `downloadSourceCode`

**Request**
`GET /api/portfolio/download?cvId=abc123`

**Response**
- Binary `.zip` file  
- Header:
```
Content-Disposition: attachment; filename="portfolio-source.zip"
```

**Effect**
- Bundles the generated portfolio website’s source code.
- Allows user to save or share the code offline.

---

## 9. Burndown Chart

Please refer to [this link](https://docs.google.com/document/d/1br4loDNRrGsrz9mSQ0SoNAe4SZyIbOtNAWUlk0Hqpd4/edit?tab=t.0) for the Google Docs document containg the Burndown Chart for sprint 1.

---

## 10. Appendix

> You do not need a complete or detailed SRS. An incremental approach, as applied to Agile methods, is advised. Update the SRS document over time, placing old sections that have changed in an appendix.