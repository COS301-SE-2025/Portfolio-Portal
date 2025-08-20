# PortfolioPortal

## Requirements Specification

### Please refer to our [Google Docs document](https://docs.google.com/document/d/1YuFVzTCzYVBHjqC2GIN7uIED1_1ScgQXl-vynpJZYWY/edit?usp=sharing) for a more detailed specification.

---

**Version:** 3.0

**Date:** 08/2025

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Domain Model](#2-domain-model)
3. [User Stories / User Characteristics](#3-user-stories-user-characteristics)
4. [Use Cases](#4-use-cases)
5. [Functional Requirements](#5-functional-requirements)
6. [Architectural Requirements](#6-architectural-requirements)
   - [6.1 Architectural Design Strategy](#61-architectural-design-strategy)
   - [6.2 Architectural Styles & Architectural Design](#62-architectural-styles--architectural-design)
   - [6.3 Architectural Diagram](#63-architectural-diagram)
   - [6.4 Architectural Quality Requirements](#64-architectural-quality-requirements)
   - [6.5 Architectural Constraints](#65-architectural-constraints)
   - [6.6 Technology Choices](#66-technology-choices)
7. [Technology Requirements](#7-technology-requirements)
8. [Technical Installation Manual](#8-technical-installation-manual)
9. [User Manual](#9-user-manual)
10. [Coding Standards](#10-coding-standards)
11. [Deployment Model](#11-deployment-model)
12. [Live Deployed System](#12-live-deployed-system)
13. [Service Contracts](#13-service-contracts)
14. [Appendix](#14-appendix)

---

## 1. Introduction

PortfolioPortal is an innovative web platform that enables users to create immersive, interactive 3D portfolio websites dynamically by simply uploading their CV. The system uses OCR technology to extract information from CVs and intelligently match it, with the help of a selection algorithm, to appropriate 3D templates to generate personalised portfolio websites.

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

_[Specify & quantify the system’s quality requirements, such as performance, reliability, scalability, security, and maintainability]_

---

## 6.1 Architectural Design Strategy

_[Choose an architecture design strategy for your system. Options include decomposition, design based on quality requirements, and generating test cases. Justify your choice. (graded in Demo 3)]_

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

## 6.2. Architectural Styles & Architectural Design

## Primary Architectural Styles:

Portfolio Portal employs a hybrid architectural approach to effectively separate concerns, facilitate maintainability, and promote scalability. The primary styles are:

## 6.2.1. Client-Server Architecture

This is the foundational pattern. The React frontend (client) runs in the user's browser and communicates over HTTP with a centralised Node.js/Express backend (server). This clear separation allows for independent development, deployment, and scaling of the frontend and backend tiers.

## 6.2.2. Service-Oriented Architecture (SOA)

Our system is decomposed into several clearly defined and independently manageable modules:

- **Authentication and User Management Service** - handles user sign-up, login, and session management via Supabase Auth
- **File Upload and Storage Service** - manages the secure reception and temporary storage of user-uploaded CVs
- **CV Analysis Service** - encapsulates the OCR processing and template selection algorithm
- **Portfolio Generation and 3D Rendering Service** - handles logic for instantiating the chosen 3D template with the user's extracted data
- **Deployment Service** - manages the build process and deployment of the generated portfolio React app to a hosting platform

**Justification:** SOA allows us to develop, update, and scale these capabilities independently. For example, we could swap the OCR provider or change the template selection algorithm, without affecting the file upload or authentication logic. This modularity directly supports maintainability and performance, by allowing potential future scaling of individual services.

Each of these services communicates via well-defined APIs, making SOA an ideal choice. This architecture allows:

- **Separation of concerns** (e.g., OCR is decoupled from frontend logic)

- **Independent testing and development**

Moreover, our backend is built using Node.js + Express.js, which naturally supports REST APIs, aligning well with SOA principles. Enables modular development where different team members can work on OCR processing, template selection algorithms, and 3D rendering independently.

## 6.2.3. Model-View-Controller (MVC)

- **Models** (`server/app/models`): Define the data structure and interact with the Supabase database (e.g., User, Template, Portfolio)
- **Controllers** (`server/app/controllers`): Handle the application logic for specific routes. They process HTTP/REST Model Services, and send responses (e.g., `authController.js`, `portfolioController.js`)
- **Views:** In an API-driven backend, the "View" is the JSON response sent to the client. The React frontend acts as the consumer and presenter of this data.

**Justification:** MVC provides a clean separation of concerns between data management, user interface, and business logic, essential for maintaining the complex 3D rendering and CV processing workflows. This makes the codebase highly organised, testable, and maintainable. It allows multiple developers to work on business logic, data access, and API endpoints simultaneously, without conflict. We chose the MVC pattern because it aligns closely with the structure of our web application and addresses multiple architectural constraints and quality requirements:

- **Separation of concerns** ensures the frontend, backend logic, and data are independently maintainable.

- **Supports modularity and testability**, especially important for a year-long project with evolving features (e.g., adding new 3D templates).

- **Enables our team to work in parallel** — frontend developers focus on the view, while backend developers handle API logic.

- **Enhances security** by centralizing access control logic in the controller layer and enforcing RLS at the model layer.

- **Supports performance and availability** by offloading computation-heavy tasks (like OCR) to the backend, while keeping rendering on the client-side.

- **Fits naturally with our tech stack:** React/Three.js for the View, Node.js/Express for the Controller, and Supabase for the Model.

## Justification for this Hybrid Approach:

The combination of Client-Server, MVC, and SOA is ideal for this project. Client-Server provides the macro-structure, MVC organises the separation of the data and business logic for that data (model), the UI/frontend (view), and the middleman between the model and the view. SOA defines the modular, logical components within the backend. This hybrid directly addresses some of our quality goals:

- **Performance:** Intensive tasks (like OCR) are offloaded to dedicated services on the backend
- **Maintainability:** Changes are isolated to specific services or MVC components
- **Security:** A clear API boundary allows for centralised security middleware (e.g. input validation, authentication checks) in the controllers.

---

## 6.3. Architectural Diagram

Please refer to our [Google Docs document](https://docs.google.com/document/d/1rxkMraYgFYUdMYmQF_VLTrUnhh7xI9QWVL8zSpGn-2w/edit?tab=t.0) for the diagram.

---

## 6.4. Architectural Quality Requirements

_[Prioritize at least five quality requirements (from highest to lowest priority). Each quality requirement must be quantified or specified in a testable way. For example, availability: 99.5% uptime, scalability: 50 requests per second, security: role-based access control. (graded in Demo 2)]_

| Priority | Quality Requirement | Quantification                                                                                                                              |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | **Availability**    | The system must maintain **99.5% uptime** during active development.                                                                        |
| 2        | **Performance**     | OCR + template rendering must complete **within 5 seconds** on average.                                                                     |
| 3        | **Security**        | All users must authenticate via **email & password**; incorrect passwords fail.                                                             |
| 4        | **Usability**       | User can complete CV upload and preview in **under 5 clicks**. Help menu readily available.                                                 |
| 5        | **Maintainability** | **≥80% unit test coverage** across core backend and frontend services (e.g., template selector, OCR service). Make use of React components. |

---

### 6.4.1 Availability

#### Why it matters:

The system must be **reliably accessible** to users whenever they want to upload a CV or preview their portfolio. Since users interact with the system asynchronously (on their own time), the app needs to be **online and stable** to avoid frustrating user experiences or failed sessions — especially during demos, testing phases, or when the user presents their portfolio website to employers.

#### In our context:

- Users expect a smooth, working platform — if it crashes during upload or rendering, the system fails its main goal.
- Our team has limited hosting resources (e.g., free-tier services like Supabase or Vercel), so maximizing uptime is crucial.

---

### 6.4.2 Performance

#### Why it matters:

The system handles potentially **large file uploads** (CVs with multiple pages), **OCR processing**, and **3D scene rendering** in the browser. These are computationally intensive tasks, and delays can break the user's trust or patience. We must ensure that each action (uploading, scanning, selecting a template, rendering) happens **quickly and efficiently**.

#### In our context:

- Users shouldn't wait more than a few seconds to see their 3D portfolio after uploading their CV.
- A slow system could make the 3D feature feel gimmicky rather than impressive.

---

### 6.4.3 Usability

#### Why it matters:

Most users will interact with the system only once — so it needs to be immediately intuitive. The interface must be clean, visually appealing, and require minimal instructions. If users can't figure out how to upload a CV or preview their 3D portfolio quickly, they will likely abandon the system.

#### In our context:

- Our users aren’t necessarily tech experts — they may be job seekers testing it briefly.
- A simple, attractive UI encourages engagement and showcases the 3D portfolio in the best light.
- Usability directly impacts how our project is judged during demos.

---

### 6.4.4 Maintainability

#### Why it matters:

The system is expected to evolve — we may want to add new 3D templates, tweak OCR processing rules, or improve design over time. A maintainable architecture means we can easily update individual components (e.g., swap out one 3D scene) without breaking the entire system.

#### In our context:

- We are using a team-based workflow across multiple technologies (React, Vue, Three.js, Blender, [Node.js](https://nodejs.org)).
- Maintainability reduces bugs, helps with onboarding new developers, and prepares the project for future reuse or extensions (e.g., user profile page, video templates, etc.).

---

### 6.4.5 Security

#### Why it matters:

The users upload **sensitive personal information** (CVs with names, contact info, education, job history, etc.). Even though there are no multiple user roles (like admin or moderator), it is critical to **ensure account isolation, file protection**, and **secure access**.

#### In our context:

- We must **prevent unauthorised access** to user data (via Supabase’s authentication and Row-Level Security).
- File storage must be **private**, and access should be granted only to the authenticated user.
- Input fields and uploaded files must be **validated/sanitised** to prevent script injection, spam, or file-type abuse.

---

## 6.5. Architectural Constraints

_[Identify any constraints affecting the architecture, such as client requirements or deployment limitations. (graded in Demo 2)]_

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

_[Before selecting a technology, assess at least three options for each component. Provide an overview, the pros and cons, and a justification for your final choice, explaining how it fits with the architecture, design, and constraints. (graded in Demo 2)]_

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

## 8. Technical Installation Manual

Please refer to the Technical Installation Manual document found on the repo or at our google docs link.
GitHub Repo: [Technical Installation Manual](./TechnicalInstallationManual.md)
Google Doc: [Google Docs Link](https://docs.google.com/document/d/1KhyXSj1a-Nh9sYJlSksyh8CfJHQmo1Nhs8T0O-OssVc/edit?tab=t.0)

---

## 9. User Manual

Please refer to the User Manual document found on the repo or at our google docs link.
GitHub Repo: [User Manual](./UserManual.md)
Google Doc: [Google Docs Link](https://docs.google.com/document/d/1xpYEr_gpnPbiTEHjSDPLsoRo8oy0msK5yuGsxLp-_v0/edit?tab=t.0)

---

## 10. Coding Standards

Please refer to the User Manual document found on the repo or at our google docs link.
GitHub Repo: [Coding Standards](./CodingStandards.md)
Google Doc: [Google Docs Link](https://docs.google.com/document/d/1j0fwH4UwJNHiyEn0N_KdP3u124mgLxRNWcVEKuTFRPc/edit?tab=t.0)

---

## 11. Deployment Model

Our system will be deployed in a cloud-based environment, leveraging Vercel for frontend hosting and continuous deployment, and Supabase for backend database services. The deployment model is designed for high availability, scalability, and maintainability while remaining cost-effective.

## Target Environment

- **Cloud Deployment:** The entire system is hosted in the cloud.

- **Frontend Hosting:** Vercel, which offers global edge network deployment for fast performance.

- **Backend Database:** Supabase (managed PostgreSQL database with authentication, storage, and API capabilities).

- **Domain:** The system will be accessible via the custom domain portfolioportal.co.za, configured through Vercel's domain management.

## Deployment Topology

The system follows a multi-tier architecture:

1. **Presentation Tier** – The frontend is built with modern web technologies (e.g., React/Next.js) and deployed to Vercel. Vercel provides CDN-based edge caching for global speed and auto-scaling capabilities.

2. **Application/Logic Tier** – Handled via serverless functions provided by Vercel (API routes) or directly through client-side calls to Supabase.

3. **Data Tier** – Supabase manages our PostgreSQL database, authentication services, and file storage.

## Tools & Platforms

- **Vercel** – For frontend deployment, serverless functions, domain management, and CI/CD.

- **Supabase** – For database hosting, authentication, and file storage.

- **GitHub** – Source code management, integrated with Vercel for automated deployment.

- **Custom Domain (portfolioportal.co.za)** – Managed through Vercel DNS.

## Deployment Workflow

1. Developers push changes to the main branch in GitHub.

2. Vercel automatically builds and deploys the updated frontend to its global CDN.

3. Supabase services remain always-on and accessible via secure API calls.

4. The domain **portfolioportal.co.za** points to the Vercel deployment.

## Quality Attributes Supported

- **Scalability** – Vercel's serverless architecture automatically scales to handle varying traffic loads; Supabase supports horizontal scaling of the database.

- **Reliability** – Both Vercel and Supabase provide redundant cloud infrastructure and automatic failover.

- **Maintainability** – CI/CD ensures rapid deployment of updates; the separation of concerns between frontend and backend simplifies maintenance.

- **Security** - HTTPS enforced via Vercel, role-based access control via Supabase, and secure API keys.

## Deployment Model Diagram

Please refer to our [Google Docs document](https://docs.google.com/document/d/1rxkMraYgFYUdMYmQF_VLTrUnhh7xI9QWVL8zSpGn-2w/edit?tab=t.0) for the diagram.

## How each quality attribute is addressed:

### Availability:

- **Global CDN:** Vercel's edge network ensures high availability across geographic regions
- **Managed Infrastructure:** Both Vercel and Supabase handle infrastructure redundancy and automatic failover
- **Auto-scaling:** Auto-scaling prevents resource exhaustion during traffic spikes
- **Always-on Services:** Supabase provides 24/7 database availability

### Maintainability:

- **Automated CI/CD:** GitHub integration with Vercel enables seamless deployment pipeline
- **Separation of Concerns:** Clear boundaries between presentation, application, and data tiers
- **Managed Services:** Reduces operational overhead by offloading infrastructure management
- **Version Control:** GitHub provides robust change tracking and rollback capabilities

### Performance:

- **Edge Caching:** Vercel's CDN delivers content from locations closest to users
- **Serverless Functions:** Reduces cold start latency and scales on demand
- **Optimised Database:** Supabase PostgreSQL is performance-tuned with connection pooling
- **Static Asset Optimisation:** Vercel automatically optimises images and assets

### Security:

- **HTTPS Enforcement:** All traffic is encrypted in transit via Vercel
- **Authentication:** Supabase provides built-in user authentication and authorisation
- **API Security:** Secure API endpoints with proper key management
- **Role-based Access:** permissions controlled through Supabase's auth system

### Usability:

Our deployment model indirectly supports usability through:

- **Fast Load Times:** CDN and edge caching improve user experience
- **High Availability:** Users can reliably access the system
- **Mobile Responsiveness:** Modern React/Next.js stack supports responsive design

---

## 12. Live Deployed System

Demo 4

---

## 13. Service Contracts

_[Explain the API call request, responses & effects **(demo 3)**]_

_Describe the service contracts between the major components or services in your system. This includes API specifications, data formats (e.g., JSON, XML), communication protocols (e.g., REST, gRPC), and any error-handling or timeout mechanisms. Each service contract should be **well-defined**, versioned where applicable, and testable to ensure reliable integration between components. Clear service contracts help enforce loose coupling and enable independent development and testing of services._

## Service: uploadCV

### Request

```http
POST /api/ocr/upload
{
  "file": "<PDF or image>"
}
```

### Responses:

**200 OK:**

```json
{
  "success": true,
  "data": {
    /* structuredCV object */
  },
  "template": {
    /* selectedTemplate object */
  }
}
```

**400 Bad Request:**

```json
{
  "Error": "Authorization token required."
}
```

**415 Unsupported Media Type / 413 Payload Too Large:**

```json
{
  "error": "Unsupported file type or file too large"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Failed to process uploaded CV",
  "error": "<details>"
}
```

### Effect

- Stores the CV file temporarily or in a document store
- Triggers OCR processing and text extraction
- Saves extracted data in the database linked to a `cvId`
- A template suggestion produced by `selectTemplate(structuredCV)`

## Service: selectTemplate

### Request:

```http
POST /api/portfolio/template/select
{
  { "cvData": { /* structured CV object */ } }
}
```

### Response:

```json
{
  "success": true,
  "data": {
    /* templateResult from templateService.selectTemplate */
  }
}
```

### Effect

- Uses extracted CV text to determine the most appropriate template using keyword matching
- Saves selected template info linked to the user/session

## Service: generatePortfolio

### Request:

```http
POST /api/portfolio/generate
{
  "cvData": { /* structured CV */ },
  "templateId": "space-01"
}
```

### Response:

**200 OK:**

```json
{
  "success": true,
  "data": {
    "template": "space",
    "customizations": { /* echoed */ },
    "sections": {
      "header": { "name": "...", "title": "Professional", "summary": "..." },
      "skills": [ { "name": "JavaScript" }, ... ],
      "experience": [
        {
          "title": "...",
          "company": "...",
          "duration": "YYYY-MM - YYYY-MM|Present",
          "description": "..."
        }
      ],
      "education": [
        {
          "degree": "...",
          "institution": "...",
          "duration": "YYYY-MM - YYYY-MM|Present",
          "details": "fieldOfStudy"
        }
      ],
      "projects": [
        { "title": "...", "description": "...", "technologies": ["..."] }
      ]
    }
  }
}
```

### Effect

- Combines extracted CV data with the selected 3D template
- Renders and deploys a personalized portfolio site locally

Creates a folder or static build with HTML/CSS/JS for the portfolio.

## Service: registerUser

### Request:

```http
POST /api/users/register
{
  "name": "Eric",
  "email": "user@example.com",
  "password": "secret123"
}
```

### Response:

**201 Created:**

```json
{
  /* newly created user object as returned by userService.createUser */
}
```

**400 Bad Request:**

```json
{ "error": "Name, email, and password are required" }
```

(or)

```json
{ "error": "Invalid email format" }
```

(or)

```json
{ "error": "Password must be at least 6 characters" }
```

**409 Conflict:**

```json
{ "error": "User already exists" }
```

**500 Internal Server Error:**

```json
{ "error": "Failed to create user" }
```

### Effect

- Creates a Supabase Auth user (email/password) and inserts a corresponding row into users with auth_id and profile fields.

## Service: loginUser

### Request:

```http
POST /api/users/login
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Response:

**200 OK:**

```json
{
  "user": { /* user profile from users table */ },
  "token": "<access_token>",
  "refresh_token": "<refresh_token>",
  "expires_at": <epoch_seconds>
}
```

**400 Bad Request:**

```json
{ "error": "Email and password are required" }
```

**401 Unauthorized:**

```json
{ "error": "Invalid credentials" }
```

**500 Internal Server Error:**

```json
{ "error": "Login failed" }
```

### Effect

- Signs in via Supabase Auth, returns session tokens and the profile from the `users` table.

## Service: logoutUser

### Request:

```http
POST /api/users/logout
Headers: Authorization: Bearer <access_token>
```

### Response:

**200 OK:**

```json
{ "message": "Logged out successfully" }
```

**400 Bad Request:**

```json
{ "error": "Authorization token required" }
```

**500 Internal Server Error:**

```json
{ "error": "Logout failed" }
```

### Effect

- Sets session with the Bearer token and calls Supabase `signOut()`.

## Service: getCurrentUser

### Request:

```http
GET /api/users/me
Headers: Authorization: Bearer <access_token>
```

### Response:

**200 OK:**

```json
{
  /* full current user object from users table */
}
```

**404 Not Found:**

```json
{ "error": "User not found" }
```

### Effect

- Fetches the current user profile (including private fields) from the `users` table

## Service: updateMyProfile

### Request:

```http
PUT /api/users/me/profile
Headers: Authorization: Bearer <access_token>

{
  /* partial fields to update:
  name, bio, cv_url, profile_picture_url, about_paragraphs[],
  certifications[], skills[],
  linkedin, github
  */
}
```

### Response:

**200 OK:**

```json
{
  /* updated user row */
}
```

**400 Bad Request:**

```json
{ "error": "Invalid email format" }
```

**500 Internal Server Error:**

```json
{ "error": "Failed to update profile" }
```

### Effect

- Validates and updates allowed fields in the `users` table for the authenticated user.

## Service: getProfileStats

### Request:

```http
GET /api/users/me/stats
Headers: Authorization: Bearer <access_token>
```

### Response:

**200 OK:**

```json
{
  "profileComplete": <count_of_completed_fields>,
  "totalFields": 10,
  "completedFields": [ "Name", "Bio", ... ],
  "completionPercentage": <0-100>
}
```

**404 Not Found:**

```json
{ "error": "User not found" }
```

### Effect

- Computes completion metrics from user fields (name, bio, profile picture, about_paragraphs, skills, certifications, cv_url, linkedin, github, email).

## Service: uploadProfilePicture

### Request:

```http
POST /api/users/me/profile-picture
Headers: Authorization: Bearer <access_token>
Content-Type: multipart/form-data
Fields:
```

- **profilePicture:** image/jpeg|png|webp|gif (<= 5MB)

### Response:

**200 OK:**

```json
{
  "message": "Profile picture uploaded successfully",
  "profile_picture_url": "<signed or public URL>"
}
```

### Effect

- Validates file type/size → uploads to Supabase Storage

## Service: getProfilePicture

### Request:

```http
GET /api/users/me/profile-picture
Headers: Authorization: Bearer <access_token>
```

### Response:

**200 OK:**

```json
{ "profile_picture_url": "<signed URL>" }
```

### Effect

- Creates a time-limited signed URL from the stored `profile_picture_path`

## Service: deleteProfilePicture

### Request:

```http
DELETE /api/users/me/profile-picture
Headers: Authorization: Bearer <access_token>
```

### Response:

**200 OK:**

```json
{ "message": "Profile picture deleted successfully" }
```

### Effect

- Removes the file from Supabase Storage

## Service: searchUsers

### Request:

```http
GET /api/users/search?q=<term>&page=<n>&limit=<n>
Headers: Authorization: Bearer <access_token>
```

### Response:

**200 OK:**

```json
{
  "users": [ { "id": "...", "name": "...", "email": "...", "bio": "...", "profile_picture_url": "...", "skills": [...] }, ... ],
  "pagination": { "page": 1, "limit": 10, "total": <count_of_returned_items> }
}
```

### Effect

- Performs an `ilike` search over name, email, and bio, returns paginated results

## Service: getUsersBySkills

### Request:

```http
GET /api/users/skills?skills=js,react,node&limit=<n>
```

### Response:

**200 OK:**

```json
[ { "id": "...", "name": "...", "email": "...", "bio": "...", "profile_picture_url": "...", "skills": [...] }, ... ]
```

### Effect

- Filters users whose `skills` array overlaps any of the provided skills

## Service: getPublicProfile

### Request:

```http
GET /api/users/profile/:identifier
```

### Response:

**200 OK:**

```json
{
  "id": "...",
  "name": "...",
  "bio": "...",
  "profile_picture_url": "...",
  "about_paragraphs": [...],
  "skills": [...],
  "certifications": [...],
  "linkedin": "...",
  "github": "...",
  "created_at": "..."
}
```

### Effect

- Resolves by email or by ID

## Service: getUsersByID

### Request:

```http
GET /api/users/:id
```

### Response:

**200 OK:**

```json
{
  /* user object without sensitive fields */
}
```

### Effect

- Fetches a user by id and removes sensitive info (auth_id)

---

## 14. Appendix

_[You do not need a complete or detailed SRS. An incremental approach, as applied to Agile methods, is advised. Update the SRS document over time, placing old sections that have changed in an appendix.]_

---

### 14.1 Architectural Requirements (Demo 1 version):

#### 14.1.1 Quality Requirements

**QR1: Availability**

- Ensure the system has maximum uptime with minimal crashes.

**QR2: Performance**

- Ensure a seamless user experience without too much delay.

**QR3: Usability**

- Design a User Interface that is visually appealing and easy to understand.

**QR4: Maintainability**

- Create a system that allows easy changes to templates or other areas of the system for future changes or expansions.

---

#### 14.1.2 Architectural Patterns

The **Client-Server** Architectural Pattern will be utilized for this project due to its advantages in usability.

It is a computing model in which client devices request services or resources from servers, which in turn provides responses accordingly.

This pattern allows for low coupling and high cohesion. It makes the architecture easy to comprehend and change.

---

### 14.1.3. Design Patterns

#### 14.1.3.1. Strategy:

The Strategy design pattern is a behavioural pattern that enables an object to alter its behaviour dynamically at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern allows the algorithm to vary independently from clients that use it.

This design pattern will be used for the (3D template) selection algorithm portion of the system.

---

#### 14.1.3.2. Abstract Factory

The Abstract Factory pattern is a creational design pattern that provides an interface for creating families of related or dependent objects without specifying their concrete classes. It allows a client to create objects without knowing their specific implementations, promoting loose coupling between client code and the concrete classes it uses.

This design pattern will be used when creating 3D objects to be added to the 3D templates (e.g., planets and stars for the Space template; coffee mugs, water dispensers, stationery for the Office template; trees, bushes and birds for the Forest template; bats and rocks for the Cave template, etc).

---

#### 14.1.3.3. Model-View-Controller (MVC)

The MVC architectural pattern separates an application into three interconnected components:

- the **Model**, responsible for managing data and business logic;
- the **View**, responsible for presenting data to the user and handling UI interactions; and
- the **Controller**, acting as an intermediary between the Model and View, processing user input events and updating the Model or View accordingly.

This design pattern will be used for the PortfolioPortal system to separate concerns, improve maintainability, and support scalable and testable code.

---

#### 14.1.4. Constraints

The use of third-party libraries is restricted, but not entirely ruled out. Discussion may take place as to how and where third-party libraries may be applied.

_Figure: Sprint 1 PortfolioPortal Burndown Chart_
