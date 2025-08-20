# PortfolioPortal

## Coding Standards Document

### Please refer to our [Google Docs document](https://docs.google.com/document/d/1j0fwH4UwJNHiyEn0N_KdP3u124mgLxRNWcVEKuTFRPc/edit?tab=t.0) for a more detailed specification.

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

> _This document should describe your conventions & styles to ensure uniformity, clarity, flexibility, reliability, and efficiency in your code. Document the file structure of your repository and provide any relevant configurations used to maintain a consistent coding style._

---

## Table of Contents

| #   | Section                                                       |
| --- | ------------------------------------------------------------- |
| 1   | [Introduction](#1-introduction)                               |
| 2   | [Code Styles and Conventions](#2-code-styles-and-conventions) |
| 3   | [Frontend Code Structure](#3-frontend-code-structure)         |
| 4   | [Backend Code Structure](#4-backend-code-structure)           |
| 5   | [Tooling and Configuration](#5-tooling--configuration)        |

---

## 1. Introduction

This document outlines the coding conventions and structural standards followed in the development of our full-stack web application _Portfolio Portal_. The goal is to promote uniformity, clarity, flexibility, reliability, and efficiency across the codebase to ensure easier collaboration, onboarding, and debugging.

---

## 2. Code Styles and Conventions

### 2.1. General Coding Conventions

**Language Standards**

- **Frontend**: React, JavaScript (ES6+), JSX, ThreeJS, Tailwind CSS, Blender
- **Backend**: Node.js with Express
- **Testing**: Jest for unit testing, Postman for API testing, Cypress to be used for end-to-end testing
- **Configuration**: ESLint, Prettier, Tailwind, Vite

---

### 2.2. Naming Conventions

| Element             | Convention           | Example                        |
| ------------------- | -------------------- | ------------------------------ |
| Files (JS/JSX)      | PascalCase           | `AuthLayout.jsx`, `Navbar.jsx` |
| Components          | PascalCase           | `TemplateCard`, `HelpMenu`     |
| Hooks               | camelCase with `use` | `useCVData`                    |
| Variables/Functions | camelCase            | `fetchUserData()`              |
| Constants           | UPPER_SNAKE_CASE     | `MAX_UPLOAD_SIZE`              |
| Folders             | kebab-case           | `3d-models`, `user-profile`    |

---

## 3. Frontend Code Structure

### Frontend File Structure:

```plaintext
frontend/
├── 📁 cypress                    # end-to-end testing framework
├── 📁 public                     # static assets like images, models, HTML
├── 📁 src                        # main source code
│   ├── 📁 components             # reusable UI components
│   │   ├── 📁 3DModels           # 3D model components
│   │   ├── 📁 sections           # page sections
│   │   └── 📁 Templates          # forest, office, space, lab, cave
│   ├── 📁 contexts               # React context providers (global state)
│   ├── 📁 data                   # static data files (e.g., template info)
│   ├── 📁 hooks                  # custom React hooks
│   │   └── useCVData.js          # CV data management hook
│   ├── 📁 pages                  # page-level React components for routing
│   ├── 📁 services               # API & data-fetching logic
│   └── 📁 utils                  # utility functions
├── App.jsx                       # root app component
├── index.css                     # global styles
├── main.jsx                      # entry point for the React app
├── .gitignore                    # Git ignore rules
├── cypress.config.js             # Cypress testing configuration
├── eslint.config.js              # ESLint code quality rules
├── index.html                    # main HTML template
├── package-lock.json             # exact dependency versions
├── package.json                  # project dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.js                # Vite build tool configuration
```

### Frontend Coding Practises:

- Components should be functional and stateless where possible.

- Reusable components must reside in `components/`.

- Keep JSX concise and delegate logic-heavy functions to helpers or services.

- Use Tailwind CSS utility classes consistently for styling.

- Route-related logic lives in `pages/` with meaningful filenames.

- All state shared across components should be lifted to `contexts/`.

---

## 4. Backend Code Structure

### Backend File Structure:

```plaintext
server/
├── 📁 app                       # core application logic
│   ├── 📁 config                # configuration files (e.g., Supabase)
│   ├── 📁 controllers           # route logic handlers
│   ├── 📁 middleware            # Express middleware
│   ├── 📁 models                # database models/schemas
│   ├── 📁 routes                # API route definitions
│   ├── 📁 services              # business logic/services layer
│   ├── 📁 uploads               # uploaded files
│   ├── 📁 utils                 # utility/helper functions (cv-analyzer.js)
│   └── .DS_Store                # macOS system file
├── 📁 tests                     # unit & integration tests
├── 📁 uploads                   # uploaded files storage
├── .DS_Store                    # macOS system file
├── .env                         # environment variables for Supabase
├── .gitignore                   # Git ignore rules
├── app.js                       # app configuration & middleware
├── package-lock.json            # exact dependency versions
├── package.json                 # project dependencies and scripts
└── server.js                    # entry point for backend server
```

### Backend Coding Practises:

- **Controller-Service Pattern:** Controllers handle HTTP, services handle logic.

- Validate input and handle errors in middleware.

- Store business logic in `services/` for separation of concerns.

- Uploads are organized by hash filenames to avoid collisions.

- Avoid placing secrets in code—use `.env` and `dotenv`. Remember to add to `.gitignore`.

---

## 5. Tooling & Configuration

### Linting & Formatting

- **ESLint** ensures consistent JS/JSX code quality.
- **Prettier** handles auto-formatting on save.
- **Tailwind** enforces consistent utility-first styling.

---

### Version Control

- `.gitignore` includes `node_modules`, `.env`, `.DS_Store`, and `uploads/`.
- Commits follow the convention:  
  `type(scope): message`  
  _(e.g., `feat(auth): add login error handler`)_
  > _(To be properly incorporated)_

---

### Testing

- Unit tests for critical utilities and services.
- Tests live under `tests/unit/__tests__/` with filename suffix `.test.js`.

---

### Best Practices Summary

- Keep components small, readable, and single-purpose.
- Avoid duplication — extract common logic into services/hooks.
- Write self-documenting code — clear names > comments.
- Minimize deep nesting in both file structure and logic.
- Maintain separation of concerns across layers (UI, logic, data).

---

By adhering to this coding standards document, we ensure long-term maintainability, a uniform development experience, and easier onboarding for new developers.
