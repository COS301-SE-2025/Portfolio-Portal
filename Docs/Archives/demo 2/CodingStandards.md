# PortfolioPortal

## Coding Standards Document

#### _(Demo 2)_

### Please refer to our [Google Docs document](https://docs.google.com/document/d/1j0fwH4UwJNHiyEn0N_KdP3u124mgLxRNWcVEKuTFRPc/edit?tab=t.0) for a more detailed specification.

---

**Version:** 1.0

**Date:** 06/2025

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

| #   | Section                                                       | Page   |
| --- | ------------------------------------------------------------- | ------ |
| 1   | [Introduction](#1-introduction)                               | Page 2 |
| 2   | [Code Styles and Conventions](#2-code-styles-and-conventions) | Page 2 |
| 3   | [Frontend Code Structure](#3-frontend-code-structure)         | Page 3 |
| 4   | [Backend Code Structure](#4-backend-code-structure)           | Page 4 |
| 5   | [Tooling and Configuration](#5-tooling--configuration)        | Page 5 |

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
📁 frontend
├── 📁 public/           # static assets like images, models, HTML
├── 📁 src/              # main source code
│   ├── 📁 components/   # reusable UI components
│   ├── 📁 contexts/     # React context providers (global state)
│   ├── 📁 data/         # static data files (e.g., template info)
│   ├── 📁 hooks/        # custom React hooks
│   ├── 📁 pages/        # page-level React components for routing
│   ├── 📁 services/     # API & data-fetching logic
│   ├── 📁 store/        # global store
│   ├── App.jsx         # root app component
│   └── main.jsx        # entry point for the React app
├── .gitignore
├── eslint.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 4. Backend Code Structure

### Backend File Structure:

```plaintext
📁 server
├── 📁 app/              # core application logic
│   ├── 📁 config/       # configuration files (e.g., Supabase)
│   ├── 📁 controllers/  # route logic handlers
│   ├── 📁 middleware/   # Express middleware
│   ├── 📁 models/       # database models/schemas
│   ├── 📁 routes/       # API route definitions
│   ├── 📁 services/     # business logic/services layer
│   ├── 📁 utils/        # utility/helper functions
│   └── 📁 uploads/      # uploaded files
├── 📁 tests/            # unit & integration tests
├── .env                # environment variables for Supabase
├── app.js              # app configuration & middleware
└── server.js           # entry point for backend server
```

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
