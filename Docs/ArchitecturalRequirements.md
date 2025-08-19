# PortfolioPortal

## Architectural Requirements Documentation

### Please refer to our [Google Docs document](https://docs.google.com/document/d/1rxkMraYgFYUdMYmQF_VLTrUnhh7xI9QWVL8zSpGn-2w/edit?tab=t.0) for a more detailed specification.

---

**Version:** 2.0

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

## Table of Contents

| #   | Section                                                                                            |
| --- | -------------------------------------------------------------------------------------------------- |
| 1   | [Architectural structural design & requirements](#1-architectural-structural-design--requirements) |
| 1.1 | [Architectural Design Strategy](#11-architectural-design-strategy)                                 |
| 1.2 | [Architectural Styles & Architectural Design](#12-architectural-styles--architectural-design)      |
| 1.3 | [Architectural Diagram](#13-architectural-diagram)                                                 |
| 1.4 | [Architectural Constraints](#14-architectural-constraints)                                         |
| 2   | [Quality Requirements](#2-quality-requirements)                                                    |
| 3   | [Deployment Model](#3-deployment-model)                                                            |
| 4   | [Service Contracts](#4-service-contracts)                                                          |

---

# 1. Architectural structural design & requirements

# 1.1. Architectural Design Strategy

> _[Choose an architecture design strategy for your system. Options include decomposition, design based on quality requirements, and generating test cases. Justify your choice. (graded in Demo 3)]_

### **Chosen Strategy**: Design Based on Quality Requirements

#### Justification:

Given the innovative and performance-sensitive nature of our system (which includes real-time 3D rendering, OCR processing, and user-generated content), we prioritized non-functional quality requirements that are most critical for a smooth and secure user experience. Key among these are:

- **Availability** (the system should be reliably accessible)
- **Performance** (responsive OCR and 3D rendering)
- **Usability** (clean, intuitive UI)
- **Maintainability** (modular code that supports easy updates like adding new templates)
- **Security** (protecting user data through authentication and safe file handling)

Instead of beginning with functional decomposition or testing strategies, this strategy ensures we focus on building an architecture that can grow, adapt, and remain stable throughout development and user interaction, aligning with our long-term project goals and constraints.

This strategy allows us to build a system that is resilient, performant, and user-friendly, which is crucial for a portfolio generator meant to impress employers.

---

# 1.2. Architectural Styles & Architectural Design

## Primary Architectural Styles:

Portfolio Portal employs a hybrid architectural approach to effectively separate concerns, facilitate maintainability, and promote scalability. The primary styles are:

## 1.2.1. Client-Server Architecture

This is the foundational pattern. The React frontend (client) runs in the user's browser and communicates over HTTP with a centralised Node.js/Express backend (server). This clear separation allows for independent development, deployment, and scaling of the frontend and backend tiers.

## 1.2.2. Service-Oriented Architecture (SOA)

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

## 1.2.3. Model-View-Controller (MVC)

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

## 1.3. Architectural Diagram

Please refer to our [Google Docs document](https://docs.google.com/document/d/1rxkMraYgFYUdMYmQF_VLTrUnhh7xI9QWVL8zSpGn-2w/edit?tab=t.0) for the diagram.

### 1.3.4. How the design decision meets the system constraints

This architecture fits the constraints of:

- **Free-tier and student-level hosting**

- **A non-collaborative, user-isolated system**

- **A need for low-friction, rapid development**

- **Protecting sensitive user-uploaded data**

- **Allowing future extensibility** (e.g., new templates, export formats, or analytics)

---

## 1.4. Architectural Constraints

Our system is currently in development, with key functionality and components being actively implemented. The following architectural constraints have been identified based on client requirements, project timeline, technology choices, and deployment plans:

---

### 1.4.1. Timeline Constraint (Incremental Delivery)

- **Constraint**: The system will only be fully completed by Demo 4. As of Demo 2, only core functionality (CV upload, basic OCR, initial UI) may be functional.

- **Impact**: The architecture must support modular, incremental development — features such as the 3D portfolio generator, full OCR parsing, and template rendering must be developed in parallel and integrated progressively.

- **Design Response**: We chose the MVC pattern to separate frontend and backend logic, allowing each layer to be worked on independently.

---

### 1.4.2. Deployment Constraint (Deferred Hosting)

- **Constraint**: Hosting and deployment have not yet been set up. The final application will be hosted on Vercel, but deployment will only occur closer to Demo 3 and 4.

- **Impact**: The system must be designed to run and test locally during the early stages of development, with easy migration to Vercel for future deployment.

- **Design Response**: We are building the frontend with Vercel-compatible frameworks (React, Vue), and the backend with Node.js/Express, which can be deployed via serverless functions or external APIs. Supabase is already cloud-based, so no changes will be needed for DB deployment.

---

### 1.4.3. Technology Constraints (Free-tier Services)

- **Constraint**: We are using free-tier versions of Supabase and Vercel, which impose:

  - Bandwidth limits
  - API request limits
  - File size restrictions

- **Impact**: OCR processing and file storage must be optimized to remain within these limits. We cannot afford compute-heavy or long-running backend operations.

- **Design Response**: We will restrict file sizes (e.g., max 5MB per CV), optimize OCR calls to run quickly, and offload rendering to the client-side using Three.js for efficient performance.

---

### 1.4.4. User Isolation Requirement

- **Constraint**: Each user can only access their own account and data — no admin roles, shared access, or user-to-user interaction is required or permitted.

- **Impact**: The architecture must enforce strict data isolation at both the backend and database levels.

- **Design Response**: Supabase Row-Level Security (RLS) rules will ensure that users can only read/write their own data. All access is mediated via secure tokens issued after authentication.

---

### 1.4.5. Development Team Constraints

- **Constraint**: Our team consists of five students with different technical strengths. We are balancing frontend, backend, and 3D asset development (Blender).

- **Impact**: The architecture must support parallel development and allow integration without blocking each other.

- **Design Response**: MVC architecture helps split responsibilities — team members can work independently on models, views, and controllers.

---

# 2. Quality Requirements

| Priority | Quality Requirement | Quantification                                                                                                                              |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Availability        | The system must maintain **99.5% uptime** during active development.                                                                        |
| 2        | Performance         | OCR + template rendering must complete **within 5 seconds** on average.                                                                     |
| 3        | Security            | All users must authenticate via **email & password**; incorrect passwords fail.                                                             |
| 4        | Usability           | User can complete CV upload and preview in **under 5 clicks**. Help menu readily available.                                                 |
| 5        | Maintainability     | **≥80% unit test coverage** across core backend and frontend services (e.g., template selector, OCR service). Make use of react components. |

---

## 2.1.1 Availability

### Why it matters:

The system must be **reliably accessible** to users whenever they want to upload a CV or preview their portfolio. Since users interact with the system asynchronously (on their own time), the app needs to be **online and stable** to avoid frustrating user experiences or failed sessions — especially during demos, testing phases, or when the user presents their portfolio website to employers.

### In our context:

- Users expect a smooth, working platform — if it crashes during upload or rendering, the system fails its main goal.
- Our team has limited hosting resources (e.g., free-tier services like Supabase or Vercel), so maximizing uptime is crucial.

---

## 2.1.2 Performance

### Why it matters:

The system handles potentially **large file uploads** (CVs with multiple pages), **OCR processing**, and **3D scene rendering** in the browser. These are computationally intensive tasks, and delays can break the user's trust or patience. We must ensure that each action (uploading, scanning, selecting a template, rendering) happens **quickly and efficiently**.

### In our context:

- Users shouldn't wait more than a few seconds to see their 3D portfolio after uploading their CV.
- A slow system could make the 3D feature feel gimmicky rather than impressive.

---

## 2.1.3 Usability

### Why it matters:

Most users will interact with the system only once — so it needs to be immediately intuitive. The interface must be clean, visually appealing, and require minimal instructions. If users can't figure out how to upload a CV or preview their 3D portfolio quickly, they will likely abandon the system.

### In our context:

- Our users aren’t necessarily tech experts — they may be job seekers testing it briefly.
- A simple, attractive UI encourages engagement and showcases the 3D portfolio in the best light.
- Usability directly impacts how our project is judged during demos.

---

## 2.1.4 Maintainability

### Why it matters:

The system is expected to evolve — we may want to add new 3D templates, tweak OCR processing rules, or improve design over time. A maintainable architecture means we can easily update individual components (e.g., swap out one 3D scene) without breaking the entire system.

### In our context:

- We are using a team-based workflow across multiple technologies (React, Vue, Three.js, Blender, [Node.js](https://nodejs.org)).
- Maintainability reduces bugs, helps with onboarding new developers, and prepares the project for future reuse or extensions (e.g., user profile page, video templates, etc.).

---

## 2.1.5 Security

### Why it matters:

The users upload **sensitive personal information** (CVs with names, contact info, education, job history, etc.). Even though there are no multiple user roles (like admin or moderator), it is critical to **ensure account isolation, file protection**, and **secure access**.

### In our context:

- We must **prevent unauthorised access** to user data (via Supabase’s authentication and Row-Level Security).
- File storage must be **private**, and access should be granted only to the authenticated user.
- Input fields and uploaded files must be **validated/sanitised** to prevent script injection, spam, or file-type abuse.

---

# 3. Deployment Model

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

# 4. Service Contracts

Explanation of the API call request, responses & effects:

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
