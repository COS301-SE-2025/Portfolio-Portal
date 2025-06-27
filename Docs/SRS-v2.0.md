# PortfolioPortal

## Requirements Specification

### Please refer to our [Google Docs document](https://docs.google.com/document/d/1YuFVzTCzYVBHjqC2GIN7uIED1_1ScgQXl-vynpJZYWY/edit?usp=sharing) for a more detailed specification.

---

**Version:** 2.0 

**Date:** 06/2025

---

## Table of Contents

1. [Introduction](#1-introduction)  
2. [Domain Model](#2-domain-model)  
3. [User Stories / User Characteristics](#3-user-stories-user-characteristics)  
4. [Use Cases](#4-use-cases)  
5. [Functional Requirements](#5-functional-requirements)  
6. [Architectural Requirements](#6-architectural-requirements)  
   - [6.1 Architectural Design Strategy](#61-architectural-design-strategy)  
   - [6.2 Architectural Strategies/Styles](#62-architectural-strategies-styles)  
   - [6.3 Architectural Quality Requirements](#63-architectural-quality-requirements) 
   - [6.4 Architectural Design and Patterns](#64-architectural-design-and-patterns) 
   - [6.5 Architectural Constraints](#65-architectural-constraints)
   - [6.6 Technology Choices](#66-technology-choices)  
7. [Technology Requirements](#7-technology-requirements)  
8. [Deployment Model (Demo 3)](#8-deployment-model)  
9. [Live Deployed System (Demo 4)](#9-live-deployed-system)  
10. [Service Contracts](#10-service-contracts)  
11. [Appendix](#11-appendix)

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

# 6. Architectural Requirements  
*[Specify & quantify the system’s quality requirements, such as performance, reliability, scalability, security, and maintainability]*

---

## 6.1 Architectural Design Strategy  
*[Choose an architecture design strategy for your system. Options include decomposition, design based on quality requirements, and generating test cases. Justify your choice. (graded in Demo 3)]*

**Chosen Strategy**: **Design Based on Quality Requirements**

### Justification:

Given the innovative and performance-sensitive nature of our system (which includes real-time 3D rendering, OCR processing, and user-generated content), we prioritized non-functional quality requirements that are most critical for a smooth and secure user experience. Key among these are:

- **Availability** (the system should be reliably accessible)
- **Performance** (responsive OCR and 3D rendering)
- **Usability** (clean, intuitive UI)
- **Maintainability** (modular code that supports easy updates like adding new templates)
- **Security** (protecting user data through authentication and safe file handling)

Instead of beginning with functional decomposition or testing strategies, this strategy ensures we focus on building an architecture that can grow, adapt, and remain stable throughout development and user interaction, aligning with our long-term project goals and constraints.

This strategy allows us to build a system that is resilient, performant, and user-friendly, which is crucial for a portfolio generator meant to impress employers.

---

## 6.2. Architectural Strategies/Styles  
*[Architectural styles are categorized by components, connectors, and constraints. Choose one that best fits your project’s needs and justify your decision. A list of styles can be found on [Wikipedia](https://en.wikipedia.org/wiki/List_of_software_architecture_styles_and_patterns) (graded in Demo 3)]*

**Chosen Strategy/Style**: **Service-Oriented Architecture (SOA)**

### Justification:

Our system involves several clearly defined and independently manageable modules:

- OCR service  
- Template selection engine  
- 3D rendering service  
- User management  
- File storage  

Each of these services communicates via well-defined APIs, making SOA an ideal choice. This architecture allows:

- **Separation of concerns** (e.g., OCR is decoupled from frontend logic)  
- **Independent testing and development**

Moreover, our backend is built using **Node.js + Express.js**, which naturally supports REST APIs, aligning well with SOA principles.

---

## 6.3. Architectural Quality Requirements  
*[Prioritize at least five quality requirements (from highest to lowest priority). Each quality requirement must be quantified or specified in a testable way. For example, availability: 99.5% uptime, scalability: 50 requests per second, security: role-based access control. (graded in Demo 2)]*

| Priority | Quality Requirement | Quantification |
|----------|----------------------|----------------|
| 1        | **Availability**     | The system must maintain **99.5% uptime** during active development. |
| 2        | **Performance**      | OCR + template rendering must complete **within 5 seconds** on average. |
| 3        | **Security**         | All users must authenticate via **email & password**; incorrect passwords fail. |
| 4        | **Usability**        | User can complete CV upload and preview in **under 5 clicks**. Help menu readily available. |
| 5        | **Maintainability**  | **≥80% unit test coverage** across core backend and frontend services (e.g., template selector, OCR service). Make use of React components. |

---

### 6.3.1 Availability

#### Why it matters:

The system must be **reliably accessible** to users whenever they want to upload a CV or preview their portfolio. Since users interact with the system asynchronously (on their own time), the app needs to be **online and stable** to avoid frustrating user experiences or failed sessions — especially during demos, testing phases, or when the user presents their portfolio website to employers.

#### In our context:

- Users expect a smooth, working platform — if it crashes during upload or rendering, the system fails its main goal.
- Our team has limited hosting resources (e.g., free-tier services like Supabase or Vercel), so maximizing uptime is crucial.

---

### 6.3.2 Performance

#### Why it matters:

The system handles potentially **large file uploads** (CVs with multiple pages), **OCR processing**, and **3D scene rendering** in the browser. These are computationally intensive tasks, and delays can break the user's trust or patience. We must ensure that each action (uploading, scanning, selecting a template, rendering) happens **quickly and efficiently**.

#### In our context:

- Users shouldn't wait more than a few seconds to see their 3D portfolio after uploading their CV.  
- A slow system could make the 3D feature feel gimmicky rather than impressive.

---

### 6.3.3 Usability

#### Why it matters:

Most users will interact with the system only once — so it needs to be immediately intuitive. The interface must be clean, visually appealing, and require minimal instructions. If users can't figure out how to upload a CV or preview their 3D portfolio quickly, they will likely abandon the system.

#### In our context:

- Our users aren’t necessarily tech experts — they may be job seekers testing it briefly.  
- A simple, attractive UI encourages engagement and showcases the 3D portfolio in the best light.  
- Usability directly impacts how our project is judged during demos.

---

### 6.3.4 Maintainability

#### Why it matters:

The system is expected to evolve — we may want to add new 3D templates, tweak OCR processing rules, or improve design over time. A maintainable architecture means we can easily update individual components (e.g., swap out one 3D scene) without breaking the entire system.

#### In our context:

- We are using a team-based workflow across multiple technologies (React, Vue, Three.js, Blender, [Node.js](https://nodejs.org)).  
- Maintainability reduces bugs, helps with onboarding new developers, and prepares the project for future reuse or extensions (e.g., user profile page, video templates, etc.).

---

### 6.3.5 Security

#### Why it matters:

The users upload **sensitive personal information** (CVs with names, contact info, education, job history, etc.). Even though there are no multiple user roles (like admin or moderator), it is critical to **ensure account isolation, file protection**, and **secure access**.

#### In our context:

- We must **prevent unauthorised access** to user data (via Supabase’s authentication and Row-Level Security).  
- File storage must be **private**, and access should be granted only to the authenticated user.  
- Input fields and uploaded files must be **validated/sanitised** to prevent script injection, spam, or file-type abuse.

---

### 6.4. Architectural Design and Patterns
*[Provide an overview of the system’s architecture, including a diagram that shows each component and how it fits into the selected architectural pattern. Justify each design decision and explain how it meets the system’s constraints. A list of patterns can be found on [Wikipedia](https://en.wikipedia.org/wiki/List_of_software_architecture_styles_and_patterns) (graded in Demo 3)]*

---

#### 6.6.4.1. Overview of the System Architecture

Our system follows the **Model–View–Controller (MVC)** architectural pattern to clearly separate concerns between data handling, business logic, and user interface rendering. This structure improves maintainability, testability, and scalability by isolating each responsibility into distinct layers.

The system is composed of the following components:

- **Model (Data Layer)**:  
  Supabase serves as our database management system and includes authentication, file storage, and PostgreSQL for structured CV and user data. It also enforces Row-Level Security (RLS) to ensure each user can only access their own data.

- **View (Presentation Layer)**:  
  The frontend is built using a combination of React, Vue.js, and Three.js. React and Vue manage the interface and user interaction, while Three.js renders the interactive 3D portfolio templates (forest, cave, space, office). This view layer retrieves data from the backend and updates the UI accordingly.

- **Controller (Logic Layer)**:  
  The backend is implemented with Node.js and Express.js. It acts as an intermediary between the frontend and the model layer, handling:

  - File uploads  
  - OCR processing  
  - Template selection logic  
  - Data validation and access control  
  - Communication with Supabase

---

### 6.6.4.2. Architectural Diagram

Please refer to our [Google Docs document](https://docs.google.com/document/d/1YuFVzTCzYVBHjqC2GIN7uIED1_1ScgQXl-vynpJZYWY/edit?usp=sharing) to view the full architectural diagram.

---

### 6.6.4.3. Justification for MVC Pattern

We chose the MVC pattern because it aligns closely with the structure of our web application and addresses multiple architectural constraints and quality requirements:

- **Separation of concerns** ensures the frontend, backend logic, and data are independently maintainable.

- Supports **modularity and testability**, especially important for a year-long project with evolving features (e.g., adding new 3D templates).

- Enables our team to **work in parallel** — frontend developers focus on the view, while backend developers handle API logic.

- Enhances security by centralizing access control logic in the controller layer and enforcing RLS at the model layer.

- Supports performance and availability by offloading computation-heavy tasks (like OCR) to the backend, while keeping rendering on the client-side.

- Fits naturally with our tech stack: React/Three.js for the View, Node.js/Express for the Controller, and Supabase for the Model.

---

### 6.6.4.4. How the design decision meets the system constraints

This architecture fits the constraints of:

- **Free-tier and student-level hosting** (e.g., Supabase, Vercel)
- A **non-collaborative, user-isolated system**
- A need for **low-friction, rapid development**
- **Protecting sensitive user-uploaded data**
- Allowing **future extensibility** (e.g., new templates, export formats, or analytics)

---

## 6.5. Architectural Constraints  
*[Identify any constraints affecting the architecture, such as client requirements or deployment limitations. (graded in Demo 2)]*

Our system is currently in development, with key functionality and components being actively implemented. The following architectural constraints have been identified based on client requirements, project timeline, technology choices, and deployment plans:

### 6.5.1. Timeline Constraint (Incremental Delivery)

- **Constraint**: The system will only be fully completed by Demo 4. As of Demo 2, only core functionality (CV upload, basic OCR, initial UI) may be functional.

- **Impact**: The architecture must support modular, incremental development — features such as the 3D portfolio generator, full OCR parsing, and template rendering must be developed in parallel and integrated progressively.

- **Design Response**: We chose the MVC pattern to separate frontend and backend logic, allowing each layer to be worked on independently.

---

### 6.5.2. Deployment Constraint (Deferred Hosting)

- **Constraint**: Hosting and deployment have not yet been set up. The final application will be hosted on Vercel, but deployment will only occur closer to Demo 3 and 4.

- **Impact**: The system must be designed to run and test locally during the early stages of development, with easy migration to Vercel for future deployment.

- **Design Response**: We are building the frontend with Vercel-compatible frameworks (React, Vue), and the backend with Node.js/Express, which can be deployed via serverless functions or external APIs. Supabase is already cloud-based, so no changes will be needed for DB deployment.

---

### 6.5.3. Technology Constraints (Free-tier Services)

- **Constraint**: We are using free-tier versions of Supabase and Vercel, which impose:

  - Bandwidth limits  
  - API request limits  
  - File size restrictions

- **Impact**: OCR processing and file storage must be optimized to remain within these limits. We cannot afford compute-heavy or long-running backend operations.

- **Design Response**: We will restrict file sizes (e.g., max 5MB per CV), optimize OCR calls to run quickly, and offload rendering to the client-side using Three.js for efficient performance.

---

### 6.5.4. User Isolation Requirement

- **Constraint**: Each user can only access their own account and data — no admin roles, shared access, or user-to-user interaction is required or permitted.

- **Impact**: The architecture must enforce strict data isolation at both the backend and database levels.

- **Design Response**: Supabase Row-Level Security (RLS) rules will ensure that users can only read/write their own data. All access is mediated via secure tokens issued after authentication.

---

### 6.5.5. Development Team Constraints

- **Constraint**: Our team consists of five students with different technical strengths. We are balancing frontend, backend, and 3D asset development (Blender).

- **Impact**: The architecture must support parallel development and allow integration without blocking each other.

- **Design Response**: MVC architecture helps split responsibilities — team members can work independently on models, views, and controllers.

---

## 6.6. Technology Choices  
*[Before selecting a technology, assess at least three options for each component. Provide an overview, the pros and cons, and a justification for your final choice, explaining how it fits with the architecture, design, and constraints. (graded in Demo 2)]*

---

### 6.6.1. Database Management System

#### Project Needs:

We required a database that supports relational data (users, resumes, template metadata), integrates easily with JavaScript-based frameworks, offers scalability, and ideally offers a free tier suitable for year-long use without needing trial resets.

#### Options Considered:

- **Firebase**  
  - **Pros**: Very user-friendly, easy setup with real-time sync, good frontend integration.  
  - **Cons**: Free tier has strict limits and a 30-day trial constraint we’d need to work around.

- **MongoDB Atlas**  
  - **Pros**: Flexible NoSQL model, great for rapid development, schema-less design.  
  - **Cons**: We needed more structured relational capabilities (e.g., joins, constraints); also has tier limitations.

- **Supabase (PostgreSQL-based)**  
  - **Pros**: Fully open-source, free tier generous enough for academic projects, supports SQL queries and relations, includes built-in authentication and storage.  
  - **Cons**: Slightly steeper learning curve than Firebase, community still growing.

#### Final Choice: Supabase

**Justification**:  
Supabase uses PostgreSQL, which supports our need for structured relational data (e.g., associating a CV with a user and selected 3D template). Its generous free tier allowed us to avoid constant re-setup, unlike Firebase. It also fits well with our JavaScript stack and supports file storage (for uploaded CVs), user authentication, and real-time data — all valuable in our architecture.

---

### 6.6.2. Frontend Frameworks & 3D Rendering

#### Project Needs:

We needed a dynamic and interactive UI framework that can support a responsive web interface, integrate with WebGL ([Three.js](https://threejs.org) is built directly on WebGL) for 3D content, and allow each team member to contribute modularly. Additionally, since our templates are 3D environments, we required a rendering engine that supports interactive 3D scenes in the browser.

#### Options Considered:

- **React**  
  - **Pros**: Popular, component-based, excellent ecosystem (e.g., React Three Fiber), strong community support.  
  - **Cons**: Slightly more boilerplate than Vue, requires more setup for small reactive bindings.

- **Vue.js**  
  - **Pros**: Lightweight, intuitive syntax, reactive two-way binding out of the box.  
  - **Cons**: Smaller ecosystem compared to React; limited integration with some 3D libraries.

- **Angular**  
  - **Pros**: Full-fledged framework with batteries included.
  - **Cons**: Heavyweight, more complex than needed for our relatively small web interface.

- **Three.js**  
  - **Pros**: Industry standard for 3D rendering on the web, robust documentation and examples.  
  - **Cons**: Low-level — requires more boilerplate code unless wrapped with helper libraries like `react-three-fiber`.

---

#### Final Choice: React, Vue.js, and Three.js

**Justification**:  
We adopted a hybrid approach: React is used as our core frontend framework due to its modularity and compatibility with `react-three-fiber` for rendering 3D templates. Vue.js was used for lighter components and quick prototyping due to its simplicity. Three.js powers the actual 3D rendering in our templates. This combination allows flexibility, team collaboration, and performance — essential for rendering interactive 3D portfolio sites.

---

### 6.6.3. Backend Server & API Testing

#### Project Needs:

We needed a lightweight, performant backend to handle file uploads, manage API endpoints, integrate with the database, and test core functionality (such as text extraction, template matching).

#### Options Considered:

- **Django (Python)**  
  - **Pros**: Great for rapid development, built-in admin and ORM.  
  - **Cons**: Python-based, less natural fit for our full JavaScript stack.

- **Spring Boot (Java)**  
  - **Pros**: Very robust, great for large enterprise applications.  
  - **Cons**: Overhead too high for a lean student project; slower to prototype.

- **Node.js with Express.js**  
  - **Pros**: Fast, event-driven, works seamlessly with frontend JS frameworks, massive ecosystem.  
  - **Cons**: Requires more effort for structure and security unless planned well.

- **Testing: Postman and Jest**  
  - **Postman Pros**: Easy API testing, automated test scripts.  
  - **Jest Pros**: Simple yet powerful JavaScript testing framework, great for unit/integration testing.  
  - **Cons**: Postman doesn’t cover unit-level testing, Jest requires test writing discipline.

---

#### Final Choices: Node.js + Express.js, Postman, and Jest

**Justification**:  
Node.js and Express.js allowed us to maintain a consistent language (JavaScript) across the full stack, simplifying development. It integrates smoothly with Supabase and supports fast prototyping of APIs. Postman facilitated API endpoint testing during integration. Jest was selected for backend unit testing to ensure stability of critical functions like text extraction and template selection.

---

### 6.6.4. 3D Model Creation Tools

#### Project Needs:

We needed a tool to create custom 3D templates (e.g., space station, cave, forest, office) that could be exported to formats compatible with Three.js.

#### Options Considered:

- **Maya**  
  - **Pros**: Industry standard, highly advanced.  
  - **Cons**: Expensive and overpowered for our needs.

- **Cinema 4D**  
  - **Pros**: Intuitive UI, good for animation.  
  - **Cons**: Also costly; not ideal for web export formats.

- **Blender**  
  - **Pros**: Free and open-source, powerful feature set, supports WebGL-compatible formats (e.g., glTF), large community and tutorials.  
  - **Cons**: Learning curve, especially for new 3D artists.

---

#### Final Choice: Blender

**Justification**:  
Blender offered us a powerful, free tool for creating and exporting our 3D environments. Its compatibility with glTF and direct integration with Three.js made it ideal for our pipeline. Additionally, the active Blender community provided us with assets, plug-ins, and tutorials, accelerating our learning and development process.

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

## 8. Deployment Model  
*[To be completed for Demo 3.]*

---

## 9. Live Deployed System  
*[To be completed for Demo 4.]*

---

## 10. Service Contracts

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

## 11. Appendix  
*[You do not need a complete or detailed SRS. An incremental approach, as applied to Agile methods, is advised. Update the SRS document over time, placing old sections that have changed in an appendix.]*

---

### 11.1 Architectural Requirements (Demo 1 version):

#### 11.1.1 Quality Requirements

**QR1: Availability**  
- Ensure the system has maximum uptime with minimal crashes.

**QR2: Performance**  
- Ensure a seamless user experience without too much delay.

**QR3: Usability**  
- Design a User Interface that is visually appealing and easy to understand.

**QR4: Maintainability**  
- Create a system that allows easy changes to templates or other areas of the system for future changes or expansions.

---

#### 11.1.2 Architectural Patterns

The **Client-Server** Architectural Pattern will be utilized for this project due to its advantages in usability.

It is a computing model in which client devices request services or resources from servers, which in turn provides responses accordingly.

This pattern allows for low coupling and high cohesion. It makes the architecture easy to comprehend and change.

---

### 11.1.3. Design Patterns

#### 11.1.3.1. Strategy:
The Strategy design pattern is a behavioural pattern that enables an object to alter its behaviour dynamically at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern allows the algorithm to vary independently from clients that use it.

This design pattern will be used for the (3D template) selection algorithm portion of the system.

---

#### 11.1.3.2. Abstract Factory
The Abstract Factory pattern is a creational design pattern that provides an interface for creating families of related or dependent objects without specifying their concrete classes. It allows a client to create objects without knowing their specific implementations, promoting loose coupling between client code and the concrete classes it uses.

This design pattern will be used when creating 3D objects to be added to the 3D templates (e.g., planets and stars for the Space template; coffee mugs, water dispensers, stationery for the Office template; trees, bushes and birds for the Forest template; bats and rocks for the Cave template, etc).

---

#### 11.1.3.3. Model-View-Controller (MVC)
The MVC architectural pattern separates an application into three interconnected components:  
- the **Model**, responsible for managing data and business logic;  
- the **View**, responsible for presenting data to the user and handling UI interactions; and  
- the **Controller**, acting as an intermediary between the Model and View, processing user input events and updating the Model or View accordingly.

This design pattern will be used for the PortfolioPortal system to separate concerns, improve maintainability, and support scalable and testable code.

---

#### 11.1.4. Constraints

The use of third-party libraries is restricted, but not entirely ruled out. Discussion may take place as to how and where third-party libraries may be applied.

*Figure: Sprint 1 PortfolioPortal Burndown Chart*
