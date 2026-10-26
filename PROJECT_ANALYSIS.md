# FormPilot: Complete Technical & Beginner-Friendly Project Documentation

> **Document Type:** Master Architectural, Codebase & Viva Examination Reference  
> **Repository Location:** [`c:\P\formpilot`](file:///c:/P/formpilot)  
> **Target Audience:** Project Guides, College Faculty, Technical Interviewers, and Developers  
> **Status:** Production-Ready Baseline Documentation  

---

## Table of Contents
1. [Project Overview & Problem Statement](#1-project-overview--problem-statement)
2. [Complete Folder and File Structure](#2-complete-folder-and-file-structure)
3. [Technology Stack, Frameworks & Libraries](#3-technology-stack-frameworks--libraries)
4. [Feature Inventory & Implementation Status](#4-feature-inventory--implementation-status)
5. [Complete Application Workflow (Step-by-Step with Diagrams)](#5-complete-application-workflow-step-by-step-with-diagrams)
6. [System Communication & Context Decoupling](#6-system-communication--context-decoupling)
7. [Important Functions & Core Algorithms (Simple Explanations)](#7-important-functions--core-algorithms-simple-explanations)
8. [Setup, Execution & Deployment Guide](#8-setup-execution--deployment-guide)
9. [Testing, Security, Limitations & Roadmap](#9-testing-security-limitations--roadmap)
10. [One-Page Viva / Interview Cheatsheet](#10-one-page-viva--interview-cheatsheet)

---

## 1. Project Overview & Problem Statement

### 1.1 What is FormPilot?
**FormPilot** is an intelligent, human-in-the-loop web automation platform and browser extension designed specifically for **Google Forms** (`https://docs.google.com/forms/*`). 

Its primary mission is: **"Fill your profile once. Use it everywhere."**

Instead of repeatedly typing out your personal details, academic scores, technical skills, employment background, and project descriptions every time you apply for an internship, hackathon, scholarship, or job on a Google Form, FormPilot automates this entire process safely.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 THE CORE IDEA                                    │
│                                                                                  │
│   [Your PDF Resume] ──► Upload once to FormPilot Web Dashboard                  │
│                                │                                                 │
│                                ▼                                                 │
│   [Centralized Identity] ──► Structured & verified in Cloud Firestore           │
│                                │                                                 │
│                                ▼                                                 │
│   [Browser Extension]    ──► Opens Google Form, reads the questions              │
│                                │                                                 │
│                                ▼                                                 │
│   [AI Intelligence]      ──► Maps your profile to the questions with confidence  │
│                                │                                                 │
│                                ▼                                                 │
│   [Human Review Panel]   ──► You review, edit, or approve answers on-screen      │
│                                │                                                 │
│                                ▼                                                 │
│   [Native Autofill]      ──► Fields are filled accurately in 1 second!           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.2 The Problem It Solves
When students and job seekers apply for opportunities, organizers frequently use Google Forms rather than corporate applicant tracking systems (like Workday or Lever). This introduces several major problems:
- **Repetitive Data Entry:** Typing the same name, email, CGPA, graduation year, and LinkedIn URL across dozens of forms causes mental fatigue and typos.
- **Contextual Questions:** Forms often ask open-ended questions like *"Describe your experience with React"* or *"Summarize a major project you led"*. Copy-pasting from disconnected Word documents or notes is tedious.
- **Failure of Standard Browser Autofill:** Standard browser autofill (like Chrome Autofill) relies on standard HTML `<input name="email">` or `autocomplete="email"` tags. Google Forms renders custom, dynamic JavaScript elements (`div[role="listitem"]`, `div[role="radiogroup"]`, `div[role="grid"]`) that normal browser autofill cannot understand.

---

### 1.3 Target Users & Real-World Use Cases
- **College Students & New Grads:** Applying to on-campus placements, hackathons, clubs, and scholarship forms.
- **Job Applicants & Freelancers:** Rapidly submitting client questionnaires and multi-question job screenings.
- **Researchers & Survey Participants:** Filling repeated demographic and background questions.

---

### 1.4 Architecture & Safety Philosophy
FormPilot is built around an explicit **No-Autonomous-Submission Policy**:
1. **The User Remains in Full Control:** FormPilot **never** submits a form on its own. It only autofills input fields into the webpage after you click "Autofill Form". The final "Submit" button must always be pressed manually by the user.
2. **Provenance & Confidence Calibration:** If an answer is retrieved directly from your profile, it receives 100% confidence. If the AI has to synthesize or infer an answer, FormPilot caps its confidence at **70%**, marks it as `isGenerated: true`, and shows you exactly which profile section was used in an explainability badge ("Why?").
3. **Few-Shot Learning from Corrections:** If you edit an AI-generated answer in the Review Panel, FormPilot remembers your phrasing for future forms.

---

## 2. Complete Folder and File Structure

The project is structured as a modern monorepo containing the Chrome extension, the Next.js web application, tests, shared schemas, benchmarks, and research documentation.

```
c:\P\formpilot\
│   .gitignore                          # Root Git exclusion configuration
│   formpilot-edge.zip                  # Packaged extension zip archive for Edge/Chrome
│   package.json                        # Root package manifest (Firebase dependency)
│   package-lock.json                   # Root package lockfile
│   PROJECT_ANALYSIS.md                 # This documentation report
│
├───benchmarks/                         # Accuracy and evaluation benchmarks
│   │   benchmark_results.json          # Cached deterministic benchmark metrics
│   │   formpilot_trace.json            # Deterministic execution trace artifact
│   │   live_llm_execution_constraints.json # Hardware and latency constraints
│   │   live_llm_run_01.json            # Live LLM evaluation pass 1
│   │   live_llm_run_02.json            # Live LLM evaluation pass 2
│   │   live_llm_trace.json             # Complete trace of live LLM model inference
│   │   REFERENCE_VS_LIVE_LLM_REPORT.md # Academic comparative evaluation report
│   │   runBenchmark.cjs                # Hermetic reference evaluation pipeline
│   │   runLiveLLMEvaluation.cjs        # Live OpenRouter evaluation test harness
│   └───data/
│           google_forms_eval_corpus.json # 40-question evaluation dataset
│
├───docs/                               # Product requirements and technical specifications
│       FormPilot_Technical_Project_Documentation.md # Detailed technical paper
│       PRD.md                          # Product Requirements Document
│
├───extension/                          # Manifest V3 Chromium Extension (Vite + React)
│   │   .env                            # Extension local environment variables
│   │   .gitignore                      # Extension Git ignore file
│   │   index.html                      # Popup HTML entrypoint
│   │   manifest.json                   # Chromium Manifest V3 configuration
│   │   package.json                    # Extension dependencies & build scripts
│   │   package-lock.json               # Extension lockfile
│   │   tsconfig.json                   # Extension TypeScript configuration
│   │   vite.config.ts                  # Vite bundler configuration (@crxjs/vite-plugin)
│   ├───dist/                           # Compiled extension distribution (loaded in browser)
│   ├───public/                         # Extension icons (16px, 48px, 128px)
│   └───src/
│       │   counter.ts                  # Default template helper (unused)
│       │   main.ts                     # Popup script entry
│       │   style.css                   # Injected styles and Tailwind directives
│       ├───assets/                     # Static images, logo vectors, and icons
│       ├───background/
│       │       index.ts                # Service worker: message router, API client & token refresher
│       ├───content/
│       │       dashboardSync.ts        # Content script injected into localhost:3000 to sync auth
│       │       index.tsx               # Content script injected into Google Forms (DOM Extractor & Injector)
│       │       ReviewPanel.tsx         # Floating on-screen React modal to review answers
│       ├───popup/
│       │       index.tsx               # Popup React root mounter
│       │       Popup.tsx               # Extension toolbar UI (Analyze Form button)
│       └───review-panel/               # Empty directory (component resides in content/ReviewPanel.tsx)
│
├───firebase/
│       firestore.rules                 # Cloud Firestore declarative security access rules
│
├───frontend/                           # Next.js 16 Web Dashboard & AI Serverless Gateway
│   │   .env.local                      # Local secrets (API keys, service account credentials)
│   │   .gitignore                      # Frontend Git ignore file
│   │   AGENTS.md                       # LLM agent instructions
│   │   CLAUDE.md                       # Development guidelines
│   │   components.json                 # Shadcn UI configuration
│   │   eslint.config.mjs               # ESLint code style configuration
│   │   next.config.ts                  # Next.js configuration
│   │   next-env.d.ts                   # Next.js TypeScript declarations
│   │   package.json                    # Frontend dependencies & build scripts
│   │   package-lock.json               # Frontend lockfile
│   │   postcss.config.mjs              # PostCSS configuration
│   │   README.md                       # Frontend quickstart guide
│   │   tsconfig.json                   # Frontend TypeScript configuration
│   ├───public/                         # Web static assets, extension zips & mock forms
│   │       demo-screenshot.png         # Marketing screenshot
│   │       formpilot-extension.zip     # Downloadable extension package
│   │       logo-icon.png               # FormPilot brand icon
│   │       logo.png                    # FormPilot brand banner
│   │       test-form.html              # Offline Google Forms mock HTML for testing
│   └───src/
│       ├───app/
│       │   │   favicon.ico             # Browser tab icon
│       │   │   globals.css             # Tailwind v4 theme tokens & CSS variables
│       │   │   layout.tsx              # Root HTML layout with AuthProvider & Geist font
│       │   │   page.tsx                # Marketing landing page with browser detection
│       │   ├───api/ai/
│       │   │   ├───corrections/
│       │   │   │       route.ts        # Saves & classifies user corrections in Firestore
│       │   │   ├───generate/
│       │   │   │       route.ts        # Primary AI answer generation & rate limiter
│       │   │   └───parse-resume/
│       │   │           route.ts        # PDF resume parser (pdf-parse + multimodal LLM)
│       │   ├───dashboard/
│       │   │   │   layout.tsx          # Authenticated dashboard sidebar & navigation
│       │   │   │   page.tsx            # Dashboard home with profile completion progress
│       │   │   ├───profile/
│       │   │   │       page.tsx        # Profile knowledge base editor page
│       │   │   └───resume/
│       │   │           page.tsx        # Drag-and-drop resume upload page
│       │   └───login/
│       │           page.tsx            # Sign in / Sign up page (Google + Email/Password)
│       ├───components/
│       │   ├───profile/
│       │   │       ProfileForm.tsx     # 6-tab identity editor with 400ms debounced auto-save
│       │   │       ResumeUploadWidget.tsx # Floating resume upload helper widget
│       │   └───ui/                     # Shadcn UI reusable components (button, card, input, etc.)
│       ├───hooks/
│       │       useExtensionDetection.ts# Hook to detect if FormPilot extension is installed
│       │       useProfile.ts           # Hook managing profile state (LocalStorage + Firestore)
│       ├───lib/
│       │       auth-context.tsx        # Firebase client auth provider & extension sync
│       │       browser-detection.ts    # UserAgent parser for Chrome, Edge, Brave, etc.
│       │       extension-config.ts     # Extension Store URLs & ID configuration
│       │       firebase-admin.ts       # Server-side Firebase Admin SDK initializer
│       │       openrouter.ts           # OpenRouter client & 7-stage resilient JSON parser
│       │       utils.ts                # Tailwind clsx / twMerge styling utility
│       └───shared/                     # Local mirror of shared types and utilities
│
├───research/                           # Deep architectural audits and scope boundaries
│       FORMPILOT_BENCHMARK_AND_EVALUATION_REPORT.md # Empirical metrics report
│       FORMPILOT_COMPLETE_PROJECT_OVERVIEW.md       # Full architectural audit
│       FORMPILOT_RESEARCH_EVIDENCE_STATUS.md        # Experimental status checklist
│       GOOGLE_FORMS_FINAL_AUDIT.md                  # Control-by-control DOM evaluation
│       GOOGLE_FORMS_SCOPE.md                        # Scope boundary specification
│
├───shared/                             # Canonical shared TypeScript types and prompts
│   ├───constants/                      # Empty directory
│   ├───prompts/
│   │       index.ts                    # Canonical system prompt FORMPILOT_SYSTEM_PROMPT
│   ├───schemas/                        # Empty directory
│   ├───types/
│   │       index.ts                    # Canonical TypeScript interfaces (UserProfile, AIAnswer)
│   └───utils/
│           firebase.ts                 # Dual-runtime Firebase Client SDK configuration
│
└───tests/                              # Regression and algorithmic test suites
        googleFormsRegression.test.js   # Regression test suite for node:test runner
        runAll.cjs                      # Standalone zero-dependency CommonJS test runner
```

---

## 3. Technology Stack, Frameworks & Libraries

| Technology / Library | Version | Category | Where Used | Purpose in FormPilot |
| :--- | :---: | :--- | :--- | :--- |
| **TypeScript** | `^5.0` / `~6.0` | Language | Entire Codebase | Provides strict type safety across data schemas (`UserProfile`, `FormQuestion`, `AIAnswer`). |
| **Next.js** | `16.2.9` | Full-Stack Framework | `frontend/` | Powers the Web Dashboard (App Router), server-side rendering, and serverless API routes (`/api/ai/*`). |
| **React** | `19.2.4` / `19.2.7` | UI Library | `frontend/`, `extension/` | Used to build all user interfaces: Web Dashboard, Extension Popup, and the injected `ReviewPanel`. |
| **Vite** | `^8.1.0` | Bundler | `extension/` | Rapidly builds and bundles the browser extension TypeScript and React code into vanilla JS. |
| **@crxjs/vite-plugin** | `^2.7.0` | Build Plugin | `extension/` | Translates `manifest.json` into an MV3-compliant browser extension bundle with HMR support. |
| **Tailwind CSS** | `^4.3.1` | Styling Framework | `frontend/`, `extension/` | High-performance CSS styling using the modern `@tailwindcss/vite` and `@tailwindcss/postcss` engines. |
| **Firebase Client SDK** | `^12.15.0` | Auth & Database Client | `shared/`, `frontend/`, `extension/` | Handles user authentication (Email/Google), token generation, and real-time Firestore profile syncing. |
| **Firebase Admin SDK** | `^13.10.0` | Server-Side Auth & DB | `frontend/src/lib/firebase-admin.ts` | Validates client Bearer tokens on API routes and executes atomic rate-limiting transactions in Firestore. |
| **OpenRouter API** | External REST | AI / LLM Gateway | `frontend/src/lib/openrouter.ts` | Dispatches prompts to high-performance LLMs (`nvidia/nemotron-3.5-lightning:free` / Gemini). |
| **pdf-parse** | `^1.1.1` | Document Processing | `frontend/src/app/api/ai/parse-resume/route.ts` | Extracts raw text streams from uploaded PDF resumes in the Node.js backend. |
| **framer-motion** | `^12.41.0` | UI Animations | `frontend/src/app/page.tsx` | Powers smooth fluid animations, floating cards, and gradient mesh effects on the landing page. |
| **lucide-react** | `^1.21.0` | Iconography | `frontend/`, `extension/` | Provides consistent, modern SVG icons across the dashboard, popup, and ReviewPanel. |
| **sonner** | `^2.0.7` | Notification System | `frontend/` | Displays clean toast messages for profile auto-saving and clipboard operations. |

---

## 4. Feature Inventory & Implementation Status

Below is the verified inventory of FormPilot features based on source code inspection:

| Feature Name | Implementing Files | Status | Description & How It Works |
| :--- | :--- | :---: | :--- |
| **Google Forms DOM Extractor** | [`extension/src/content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx) | **Implemented** | Traverses `div[role="listitem"]` to detect question titles, required tags (`*`), and maps input types (short answer, paragraph, radio, checkbox, dropdown, date, time). |
| **2D Matrix Grid Deconstruction** | [`extension/src/content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx) | **Implemented** | Reads `div[role="grid"]` column headers and row headers, flattening multi-dimensional rating grids into distinct sub-questions: `${question}: ${rowHeader}`. |
| **Dashboard-to-Extension Sync** | [`extension/src/content/dashboardSync.ts`](file:///c:/P/formpilot/extension/src/content/dashboardSync.ts), [`frontend/src/lib/auth-context.tsx`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx) | **Implemented** | Transmits user authentication tokens and profile data to the extension's `chrome.storage.local` using `window.postMessage` bridge. |
| **Self-Healing Token Refresh** | [`extension/src/background/index.ts`](file:///c:/P/formpilot/extension/src/background/index.ts), [`frontend/src/lib/auth-context.tsx`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx) | **Implemented** | If the cached Firebase token expires (HTTP 401), background worker broadcasts a refresh request to any open dashboard tab, gets a fresh token, and retries the request. |
| **AI Form Mapping Engine** | [`frontend/src/app/api/ai/generate/route.ts`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts) | **Implemented** | Formats user profile and form questions into a structured prompt, calls OpenRouter, and returns mapped answers with JSON path tracking. |
| **Confidence & Provenance Clamping** | [`frontend/src/app/api/ai/generate/route.ts`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts) | **Implemented** | Direct profile matches receive full confidence; inferred or generative answers are capped at 70% and flagged with `isGenerated: true`. |
| **7-Stage Resilient JSON Parser** | [`frontend/src/lib/openrouter.ts`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts) | **Implemented** | Cleans reasoning `<think>` tags, extracts code blocks, repairs truncated JSON strings, and executes regex item recovery. |
| **Human Review Panel (Injected UI)** | [`extension/src/content/ReviewPanel.tsx`](file:///c:/P/formpilot/extension/src/content/ReviewPanel.tsx) | **Implemented** | Injects a floating modal directly into Google Forms allowing users to inspect confidence scores, view provenance trails ("Why?"), and edit answers inline. |
| **Few-Shot Correction Learning** | [`frontend/src/app/api/ai/corrections/route.ts`](file:///c:/P/formpilot/frontend/src/app/api/ai/corrections/route.ts) | **Implemented** | Uses LLM to classify user edits as `fact-level` or `phrasing-level` and stores them in Firestore to personalize future form answers. |
| **Native Event Autofill Injection** | [`extension/src/content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx) | **Implemented** | Sets input values using `Object.getOwnPropertyDescriptor(prototype, 'value').set` and dispatches `input`, `change`, and `blur` events so Google Forms registers the inputs. |
| **Two-Pass Option Matching** | [`extension/src/content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx) | **Implemented** | Prevents selection inversion on Likert scales ("Agree" vs "Strongly Agree") by running exact match first, falling back to substring search only for strings $\ge 3$ characters. |
| **ISO Date Normalization** | [`extension/src/content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx) | **Implemented** | Converts dates into strict `YYYY-MM-DD` strings before DOM injection, eliminating timezone day-shift bugs. |
| **Resume Ingestion & Parsing** | [`frontend/src/app/api/ai/parse-resume/route.ts`](file:///c:/P/formpilot/frontend/src/app/api/ai/parse-resume/route.ts) | **Implemented** | Uploads PDF resume, extracts text via `pdf-parse` (with multimodal base64 image fallback), and populates profile fields automatically. |
| **Transactional Rate Limiting** | [`frontend/src/app/api/ai/generate/route.ts`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts) | **Implemented** | Enforces an atomic 1,000 requests/day per-user ceiling using Firestore transactions to prevent API abuse. |
| **Browser Environment Detector** | [`frontend/src/lib/browser-detection.ts`](file:///c:/P/formpilot/frontend/src/lib/browser-detection.ts) | **Implemented** | Reads `navigator.userAgent` to detect Edge, Brave, and Chrome, dynamically tailoring installation CTAs. |
| **Web-to-Extension Ping Detector** | [`frontend/src/hooks/useExtensionDetection.ts`](file:///c:/P/formpilot/frontend/src/hooks/useExtensionDetection.ts) | **Partially Implemented** | Code is complete, but `FORM_PILOT_EXTENSION_ID` in [`extension-config.ts`](file:///c:/P/formpilot/frontend/src/lib/extension-config.ts) is set to `"PLACEHOLDER_EXTENSION_ID"`. |
| **Saved Form History Collection** | [`firebase/firestore.rules`](file:///c:/P/formpilot/firebase/firestore.rules) | **Planned / Placeholder** | Security rules define permissions for `forms/{formId}`, but application code does not currently save completed forms to this collection. |

---

## 5. Complete Application Workflow (Step-by-Step with Diagrams)

### 5.1 End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Applicant
    participant Web as Web Dashboard (localhost:3000)
    participant Sync as dashboardSync.ts
    participant ExtStore as chrome.storage.local
    participant ExtPopup as Extension Popup
    participant CS as Content Script (Google Forms)
    participant BG as Background Worker
    participant API as Next.js API (/api/ai/generate)
    participant LLM as OpenRouter (Nemotron / Gemini)
    participant Panel as ReviewPanel Overlay

    Note over User,Web: Phase 1: Identity & Resume Setup
    User->>Web: Uploads Resume PDF (/dashboard/resume)
    Web->>API: POST /api/ai/parse-resume (PDF File)
    API-->>Web: Populated UserProfile JSON
    User->>Web: Edits & confirms profile fields
    Web->>Sync: window.postMessage(FORMPILOT_PROFILE_SYNC)
    Sync->>ExtStore: chrome.storage.local.set(userProfile, idToken)

    Note over User,CS: Phase 2: Form Extraction & AI Mapping
    User->>CS: Opens Google Form tab (docs.google.com/forms/*)
    User->>ExtPopup: Clicks "Analyze Current Form"
    ExtPopup->>CS: chrome.tabs.sendMessage("EXTRACT_QUESTIONS")
    CS->>CS: Scans div[role="listitem"] & flattens div[role="grid"]
    CS-->>ExtPopup: Returns FormQuestion[] array
    ExtPopup->>BG: chrome.runtime.sendMessage("ANALYZE_FORM", questions)
    BG->>ExtStore: Reads cached profile & idToken
    BG->>API: POST /api/ai/generate (Bearer Token, profile, questions)
    API->>API: Verify token, check rate limits, fetch past corrections
    API->>LLM: callOpenRouter(System Prompt, Profile, Questions)
    LLM-->>API: Returns JSON completion
    API->>API: extractJsonFromResponse() + Confidence Clamping
    API-->>BG: AIResponse { answers: [...] }

    Note over User,Panel: Phase 3: Review & Safe Autofill
    BG->>CS: chrome.tabs.sendMessage("SHOW_REVIEW_PANEL", answers)
    CS->>Panel: Mounts ReviewPanel overlay in DOM
    User->>Panel: Inspects confidence badges & "Why?" provenance
    opt User edits an answer
        User->>Panel: Corrects answer text
        Panel->>API: POST /api/ai/corrections (classified & saved)
    end
    User->>Panel: Clicks "Autofill Form"
    Panel->>CS: Calls handleFill(answers)
    CS->>CS: Dispatches setNativeInputValue() & clicks matching options
    CS-->>User: Green Toast: "Form autofilled (X of Y fields filled)!"
    User->>CS: Reviews fields manually and clicks Google Forms "Submit"
```

---

### 5.2 Step-by-Step Narrative Workflow

#### Step 1: Account Creation & Onboarding
1. The user visits [`http://localhost:3000/login`](file:///c:/P/formpilot/frontend/src/app/login/page.tsx).
2. They sign in using Google Sign-In or create an email/password account.
3. Firebase Auth issues an ID token (JWT) verifying the user's identity.

#### Step 2: Resume Ingestion & Profile Knowledge Base
1. The user navigates to [`/dashboard/resume`](file:///c:/P/formpilot/frontend/src/app/dashboard/resume/page.tsx) and drops their PDF resume.
2. The server route [`/api/ai/parse-resume`](file:///c:/P/formpilot/frontend/src/app/api/ai/parse-resume/route.ts) extracts the text using `pdf-parse`. If text is unreadable (scanned PDF), it sends the base64 PDF to a multimodal vision model.
3. The AI populates the 6-tab profile: Personal, Education, Skills, Projects, Experience, and Social Links.
4. The user reviews and fine-tunes the profile on [`/dashboard/profile`](file:///c:/P/formpilot/frontend/src/app/dashboard/profile/page.tsx). Changes are debounced by 400ms and saved to Cloud Firestore and local storage.

#### Step 3: Synchronization to the Extension
1. [`auth-context.tsx`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx) and [`useProfile.ts`](file:///c:/P/formpilot/frontend/src/hooks/useProfile.ts) fire `window.postMessage` events (`FORMPILOT_AUTH_SYNC` and `FORMPILOT_PROFILE_SYNC`).
2. The content script [`dashboardSync.ts`](file:///c:/P/formpilot/extension/src/content/dashboardSync.ts) receives these events and forwards them to the extension background worker via `chrome.runtime.sendMessage`.
3. The background worker caches the user profile and authentication token inside the browser's secure `chrome.storage.local`.

#### Step 4: Analyzing a Google Form
1. The user opens any Google Form in their browser.
2. Clicking the FormPilot extension icon opens [`Popup.tsx`](file:///c:/P/formpilot/extension/src/popup/Popup.tsx). If profile completion is $\ge 85\%$, a green "Profile Ready" card appears.
3. The user clicks **"Analyze Current Form"**.
4. The extension sends a message to [`content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx), which scans the page, extracts questions, normalizes types, flattens matrix grids, and returns a clean [`FormQuestion[]`](file:///c:/P/formpilot/shared/types/index.ts#L71) array.

#### Step 5: Secure AI Generation & Calibration
1. The background script sends the questions and cached profile to [`/api/ai/generate`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts).
2. The server verifies the user's Firebase token and checks their 1,000 requests/day rate limit in Firestore.
3. The server loads up to 15 of the user's previous corrections from Firestore to personalize the prompt.
4. OpenRouter generates answers matching the profile.
5. The server cleans the JSON, validates provenance paths (`sourceDetail`), and clamps generative answers to a maximum of 70% confidence.

#### Step 6: Review, Edit, and Autofill
1. The content script injects [`ReviewPanel.tsx`](file:///c:/P/formpilot/extension/src/content/ReviewPanel.tsx) as a floating modal in the upper-right corner of the Google Form.
2. The applicant reviews each field:
   - Green badge (80–100%): Exact match from profile.
   - Yellow/Orange badge (50–70%): Synthesized/inferred answer.
   - Yellow alert: Missing profile data.
   - "Why?" link: Displays exact JSON path used (e.g. `education[0].degree`).
3. If an answer needs tweaking, the user edits it directly in the panel. Saving the edit sends a correction back to Firestore.
4. The user clicks **"Autofill Form"**.
5. FormPilot injects all values using native property descriptors, simulates click events on radios/checkboxes/dropdowns, and displays a success toast.
6. The user does a final visual inspection and clicks Google's **Submit** button.

---

## 6. System Communication & Context Decoupling

FormPilot operates across **four isolated browser and server environments**:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                COMMUNICATION MAP                                │
├────────────────────────┬────────────────────────┬───────────────────────────────┤
│ Sender Context         │ Receiver Context       │ Transport Mechanism           │
├────────────────────────┼────────────────────────┼───────────────────────────────┤
│ Web Dashboard          │ dashboardSync.ts       │ window.postMessage            │
│ dashboardSync.ts       │ background/index.ts    │ chrome.runtime.sendMessage    │
│ Popup.tsx              │ content/index.tsx      │ chrome.tabs.sendMessage      │
│ Popup.tsx              │ background/index.ts    │ chrome.runtime.sendMessage    │
│ background/index.ts    │ content/index.tsx      │ chrome.tabs.sendMessage      │
│ background/index.ts    │ Next.js API Routes     │ HTTPS fetch() + Bearer Token  │
│ Next.js API Routes     │ Cloud Firestore        │ Firebase Admin SDK (gRPC)     │
│ Next.js API Routes     │ OpenRouter API         │ HTTPS fetch()                 │
│ ReviewPanel.tsx        │ content/index.tsx      │ React Prop Callbacks          │
└────────────────────────┴────────────────────────┴───────────────────────────────┘
```

### Self-Healing Token Refresh Mechanism
Firebase ID tokens expire after 60 minutes. FormPilot implements an automatic recovery flow:
1. When [`background/index.ts`](file:///c:/P/formpilot/extension/src/background/index.ts#L116) makes a request with an expired token, the API responds with `HTTP 401 Unauthorized`.
2. The background script intercepts this status in `authorizedFetch()`.
3. It broadcasts a `REQUEST_TOKEN_REFRESH` message to any open FormPilot dashboard tab.
4. [`auth-context.tsx`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx#L61) on the dashboard catches the message, calls `currentUser.getIdToken(true)` to force-refresh the token from Firebase, and posts the fresh token back.
5. The background worker picks up the fresh token from storage and retries the original API call seamlessly without failing the user's action.

---

## 7. Important Functions & Core Algorithms (Simple Explanations)

### 7.1 DOM Question Extractor (`extractGoogleFormQuestions`)
- **File:** [`extension/src/content/index.tsx:6`](file:///c:/P/formpilot/extension/src/content/index.tsx#L6)
- **What it does:** Scans the Google Forms webpage and discovers every question block.
- **How it works:**
  1. Finds all question containers using `document.querySelectorAll('div[role="listitem"]')`.
  2. Extracts the question title from `div[role="heading"]`.
  3. Detects if an asterisk (`*`) is present to set `required: true`, then strips the asterisk.
  4. Inspects child elements to classify the question type:
     - `input[type="text"]` $\rightarrow$ `short_answer`
     - `textarea` $\rightarrow$ `paragraph`
     - `input[type="date"]` $\rightarrow$ `date`
     - `input[type="time"]` $\rightarrow$ `time`
     - `div[role="grid"]` $\rightarrow$ 2D Matrix (flattens rows)
     - `div[role="radiogroup"]` $\rightarrow$ `radio` or `linear_scale`
     - `div[role="checkbox"]` $\rightarrow$ `checkbox`
     - `div[role="listbox"]` $\rightarrow$ `dropdown`

---

### 7.2 Matrix Grid Flattening Algorithm
- **File:** [`extension/src/content/index.tsx:36`](file:///c:/P/formpilot/extension/src/content/index.tsx#L36)
- **What it does:** Converts complex 2D rating tables into simple 1D questions that the AI can understand.
- **Example:**
  - *Grid Title:* "Rate your programming proficiency"
  - *Columns:* `["Beginner", "Intermediate", "Expert"]`
  - *Row 1:* "Python" $\rightarrow$ **Flattened Question:** *"Rate your programming proficiency: Python"*
  - *Row 2:* "React" $\rightarrow$ **Flattened Question:** *"Rate your programming proficiency: React"*

---

### 7.3 Synthetic Event Bypass (`setNativeInputValue`)
- **File:** [`extension/src/content/index.tsx:130`](file:///c:/P/formpilot/extension/src/content/index.tsx#L130)
- **Why it is needed:** In Google Forms, doing `input.value = "John Doe"` will change the text on screen, but as soon as you click elsewhere, the text disappears! This happens because Google Forms intercepts events using internal JavaScript state listeners.
- **How FormPilot solves it:** It reaches directly into the browser's JavaScript prototype (`HTMLInputElement.prototype`) to invoke the native property setter, followed by dispatching simulated `input`, `change`, and `blur` events:

```typescript
function setNativeInputValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}
```

---

### 7.4 Hardened Question Matching & Ambiguity Rejection
- **File:** [`extension/src/content/index.tsx:219`](file:///c:/P/formpilot/extension/src/content/index.tsx#L219)
- **Why it is needed:** Naive substring matching causes subset collisions. For example, a general answer for *"Do you have work experience?"* could be erroneously injected into a specialized question like *"Do you have work experience in software development?"*.
- **How FormPilot solves it:**
  - **Priority 1 (Exact String Match):** Compares lowercased trimmed strings (`a.question === normQ`).
  - **Priority 2 (Normalized Exact Match):** Strips punctuation, symbols, and irregular spacing to match stylistic equivalents.
  - **Priority 3 (Token Jaccard Similarity with Ambiguity Rejection):** Extracts key tokens ($> 2$ characters). It requires high token similarity (Jaccard coefficient $\ge 0.8$) and **strictly requires that exactly ONE candidate matches**. If multiple questions share tokens or if a question is an ambiguous subset of another, FormPilot rejects the match rather than performing a false fill.

---

### 7.5 Multi-Select Checkboxes & Likert Inversion Protection
- **File:** [`extension/src/content/index.tsx:288`](file:///c:/P/formpilot/extension/src/content/index.tsx#L288)
- **Multi-Select Checkbox Engine:** Unlike radio buttons (which accept only one choice), checkboxes (`div[role="checkbox"]`) can represent multiple values (e.g. `"React, Node.js, Python"`). FormPilot parses delimited answers (splitting commas, semicolons, newlines, and bullet points) and checks every matching option without unchecking existing selections.
- **Likert Option Protection:** For single-select radio buttons (`div[role="radio"]`), it runs an exact match pass first, preventing substring inversion where searching for `"Agree"` would inadvertently select `"Strongly Agree"`.

---

### 7.6 Multi-Stage Resilient JSON Parser (`extractJsonFromResponse`)
- **File:** [`frontend/src/lib/openrouter.ts:57`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L57)
- **Why it is needed:** LLMs often output markdown ticks (```` ```json ````), internal reasoning tags (`<think>...</think>`), or trailing commas that cause `JSON.parse()` to throw errors.
- **How FormPilot solves it:** It applies seven sequential cleaning steps:
  1. Strips `<think>` tags.
  2. Extracts code between markdown blocks (```` ```json ... ``` ````).
  3. Locates the `"answers"` substring.
  4. Repairs truncated JSON by finding the last closed bracket and appending `]}`.
  5. Uses regex block parsing to recover individual `{ "question": ..., "answer": ... }` objects.
  6. Searches for outermost curly braces `{ ... }`.
  7. Cleans trailing commas before closing braces.

---

### 7.7 Server-Side Independent Provenance & Fail-Closed Rate Limiting
- **File:** [`frontend/src/app/api/ai/generate/route.ts:50`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L50)
- **Independent Provenance Verification:** The server does not trust the LLM's self-reported `sourceDetail` claims. Instead, the backend invokes `verifyProvenance(profile, ans)`, which dynamically traverses the actual user profile at that JSON path (e.g. `education[0].degree`). If the path does not exist or the profile value does not match the generated answer, the claim is rejected: `source = 'generated'`, `isGenerated = true`, and confidence is clamped to a **maximum of 70%**.
- **Fail-Closed Rate Limiting:** If Cloud Firestore is temporarily unreachable or throws an unexpected transaction error, the API re-throws and returns `HTTP 503 Service Unavailable`. It **fails closed**, strictly preventing unthrottled requests from bypassing the rate limiter.
- **Strict CORS Origin Validation:** The API validates `origin` against an explicit allowlist and exact extension ID (`chrome-extension://${allowedExtId}`). If the origin is untrusted, it fails closed (returning an empty origin header) rather than defaulting to wildcard `'*'`.

---

## 8. Setup, Execution & Deployment Guide

### 8.1 Prerequisites
- **Node.js:** Version 18.x or 20.x installed.
- **NPM:** Version 9.x or higher.
- **Browser:** Any Chromium browser (Google Chrome, Microsoft Edge, Brave, Opera).
- **Firebase Project:** Created on [Firebase Console](https://console.firebase.google.com) with:
  - **Authentication** enabled (Google Provider + Email/Password Provider).
  - **Cloud Firestore** database created in production or test mode.
- **OpenRouter API Key:** Free account at [openrouter.ai](https://openrouter.ai).

---

### 8.2 Environment Variable Configuration

> **Security Note:** Never commit actual API keys or private keys to source control. Use variable names only.

#### Frontend Environment (`frontend/.env.local`)
Create `frontend/.env.local` with the following keys:
```env
# Firebase Web Client Configuration (from Firebase Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Model Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Admin SDK Service Account (from Project Settings -> Service Accounts)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----\n"

# Chrome Extension ID (displayed in chrome://extensions after loading unpacked)
NEXT_PUBLIC_EXTENSION_ID=your_installed_extension_id
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Extension Environment (`extension/.env`)
Create `extension/.env` with the following keys:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:3000
VITE_DASHBOARD_URL=http://localhost:3000
```

---

### 8.3 Step-by-Step Installation Commands

#### Step 1: Install & Start the Frontend Dashboard
```bash
# Move to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [`http://localhost:3000`](http://localhost:3000) in your browser.

#### Step 2: Build the Chrome Extension
```bash
# In a new terminal, move to extension folder
cd extension

# Install dependencies
npm install

# Build the extension
npm run build
```
This compiles the extension into the folder [`extension/dist/`](file:///c:/P/formpilot/extension/dist).

#### Step 3: Load Extension into Chrome / Edge / Brave
1. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/`).
2. Toggle **Developer mode** ON (top right corner).
3. Click **Load unpacked** (top left).
4. Select the folder: `c:\P\formpilot\extension\dist`.
5. Pin the **FormPilot** extension icon to your toolbar.

#### Step 4: Testing Locally with Mock Google Form
FormPilot includes an offline Google Forms mock page in [`frontend/public/test-form.html`](file:///c:/P/formpilot/frontend/public/test-form.html):
1. With your frontend server running, open: `http://localhost:3000/test-form.html`.
2. Click the FormPilot extension icon and click **"Analyze Current Form"**.
3. Verify that the ReviewPanel opens and autofills fields accurately.

---

## 9. Testing, Security, Limitations & Roadmap

### 9.1 Testing Report & Verification

| Test Suite / Harness | Location | Type | Execution Results & Verification |
| :--- | :--- | :--- | :--- |
| **Google Forms Regression Suite (11 Tests)** | [`tests/runAll.cjs`](file:///c:/P/formpilot/tests/runAll.cjs) | CommonJS Assertions | **Inspected.** Contains 11 assertion blocks covering: 1) Exact Question Matching, 2) Option Inversion Protection, 3) ISO Date Normalization, 4) Hidden CSRF Exclusion, 5) State Sync, 6) Confidence Clamping, 7) Matrix Grid Flattening, 8) Rejection of Ambiguous Subset Collisions, 9) Multi-Select Checkboxes, 10) Server-Side Provenance Verification, 11) Fail-Closed Rate Limiting. *(Attempted shell execution; `node` was not present on default sandboxed environment PATH).* |
| **Node Test Runner Suite** | [`tests/googleFormsRegression.test.js`](file:///c:/P/formpilot/tests/googleFormsRegression.test.js) | `node:test` Runner | **Inspected.** Equivalent structured tests for standard CI environments. |
| **Deterministic Reference Pipeline** | [`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs) | 40-Question Corpus | **Verified from traces.** Achieved 100% precision, 100% recall, 0% hallucinations on the 40-item controlled dataset. Results recorded in [`benchmark_results.json`](file:///c:/P/formpilot/benchmarks/benchmark_results.json). |
| **Live LLM Production Evaluation** | [`benchmarks/runLiveLLMEvaluation.cjs`](file:///c:/P/formpilot/benchmarks/runLiveLLMEvaluation.cjs) | Live OpenRouter Calls | **Verified from traces.** Achieved 100% accuracy on the 40-item benchmark with $3.5\text{s} - 8.2\text{s}$ per-batch inference latency. Traces recorded in [`live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json). |

---

### 9.2 Research Paper & Academic Claims Matrix

To present FormPilot accurately in a research paper, thesis, or technical audit, claims must be rigorously separated into what is verified in the prototype vs what requires broader empirical evaluation:

| Research Claim | Codebase Substantiation | Scientific Scope & Boundary |
| :--- | :--- | :--- |
| **Semantic Question Mapping** | **Substantiated:** Next.js API routes questions + structured profile to LLM via OpenRouter. | Accurately maps questions to profile fields on structured forms; open-ended prompts require user review. |
| **Human-in-the-Loop Governance** | **Substantiated:** `ReviewPanel` overlay requires explicit user approval; zero autonomous form submission. | Guarantees user agency before form modification. |
| **Independent Provenance Verification** | **Substantiated:** Backend `verifyProvenance()` resolves JSON paths directly against user profile. | Prevents model hallucinations from being mislabeled as profile facts. |
| **Resilient Rate Limiting** | **Substantiated:** Fail-closed Firestore transaction returns 503 if database checks fail. | Prevents API cost overruns and unauthenticated abuse. |
| **Universal Form Autofill Accuracy** | **Scope-Bounded:** Specialized for Google Forms accessibility tree structures. | Tested on controlled 40-question corpus; broader third-party form builders (Typeform, Microsoft Forms) remain out of scope. |

---

### 9.3 Security & Code Quality Audit

1. **Exposed Local Credentials (CRITICAL RISK):**
   - **Finding:** [`frontend/.env.local`](file:///c:/P/formpilot/frontend/.env.local) contains an active `OPENROUTER_API_KEY` and raw Firebase Service Account `FIREBASE_PRIVATE_KEY`.
   - **Recommendation:** Rotate the Firebase Service Account key and OpenRouter key in their respective provider consoles immediately. Create a `.env.example` file and ensure real keys remain untracked.
2. **Wildcard `postMessage` Target (`'*'`):**
   - **Finding:** In [`auth-context.tsx:31`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx#L31), `window.postMessage(..., '*')` broadcasts user authentication tokens to any iframe on the origin.
   - **Recommendation:** Restrict the destination origin to `window.location.origin` instead of `'*'`.
3. **Placeholder Extension ID:**
   - **Finding:** In [`frontend/src/lib/extension-config.ts:3`](file:///c:/P/formpilot/frontend/src/lib/extension-config.ts#L3), `FORM_PILOT_EXTENSION_ID = "PLACEHOLDER_EXTENSION_ID"`.
   - **Recommendation:** Allow the frontend to read the unpacked extension ID from `process.env.NEXT_PUBLIC_EXTENSION_ID`.

---

### 9.4 Known Limitations & Scope Boundaries
- **Strictly Google Forms:** FormPilot currently supports only Google Forms (`docs.google.com/forms/*`). It does not support Microsoft Forms, Typeform, Jotform, or generic HTML career portals.
- **No File Upload Autofill:** Google Forms `input[type="file"]` elements (like resume file uploads) cannot be automated programmatically due to browser security restrictions.
- **Single-Page Scope:** For multi-page Google Forms, the extension autofills one page at a time. The user clicks "Next" on Google Forms, then clicks "Analyze Current Form" again.

---

### 9.5 Prioritized Improvement Roadmap

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             DEVELOPMENT ROADMAP                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: COMPLETED CODEBASE HARDENING                                            │
│   • Strict CORS origin validation & fail-closed rate-limiting (HTTP 503).        │
│   • Independent server-side provenance verification against profile schema.      │
│   • Anti-collision question matching & multi-select checkbox support.            │
│   • Prompt injection defense on past user corrections.                           │
│                                                                                  │
│ PHASE 2: IMMEDIATE MAINTENANCE                                                   │
│   • Rotate all private credentials and configure .env.example templates.        │
│   • Replace postMessage wildcard '*' with window.location.origin.               │
│   • Connect dynamic extension ID in extension-config.ts.                         │
│                                                                                  │
│ PHASE 3: RELIABILITY & EXPANSION                                                 │
│   • Add Playwright automated tests to simulate Google Forms submissions in CI.  │
│   • Implement an automatic MutationObserver to auto-detect multi-page forms.     │
│   • Save submitted form logs into the planned Firestore forms/{formId} collection│
│                                                                                  │
│ PHASE 4: FUTURE CAPABILITIES                                                     │
│   • Add DOM parsing plugins for Typeform and Greenhouse / Lever job boards.      │
│   • Integrate local in-browser LLM inference (WebLLM) for offline form filling.  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. One-Page Viva / Interview Cheatsheet

> **Keep this section handy during your project presentation, viva examination, or technical interview.**

### 30-Second Elevator Pitch
*"FormPilot is an AI-powered browser automation extension and web dashboard designed to eliminate the repetitive task of filling out Google Forms for jobs, internships, and hackathons. Users upload their resume or build their profile once on our Next.js dashboard. When they open any Google Form, our Chromium extension parses the form's accessibility tree, flattens complex rating grids, prompts an LLM to accurately match profile details to questions, and injects a floating on-screen review panel. The user reviews and verifies the answers, and with one click, our engine autofills the fields using native DOM prototype descriptors. Most importantly, FormPilot enforces a strict human-in-the-loop policy: the system never submits a form autonomously."*

---

### Key Architectural Decisions (Why did you build it this way?)

| Decision | Why It Was Made |
| :--- | :--- |
| **Manifest V3 Extension + Next.js Monorepo** | Extensions cannot securely hold AI API keys or service account credentials. The Next.js API acts as a secure, authenticated gateway that enforces rate limits and validates tokens. |
| **`Object.getOwnPropertyDescriptor` Setter** | Google Forms uses internal state trackers. Simply setting `input.value = "text"` fails because Google's React/Closure scripts don't notice the change. Calling the prototype setter and dispatching `input`/`change`/`blur` events forces Google Forms to accept the input. |
| **2D Matrix Grid Flattening** | Google Forms matrix questions (`div[role="grid"]`) are hard for AI models to understand as raw DOM. We flatten them into individual sub-questions (`"Proficiency: Python"`, `"Proficiency: Docker"`), making them simple for any LLM. |
| **Two-Pass Option Matching** | On Likert scales ("Agree" vs "Strongly Agree"), standard substring searches match the wrong option. Doing an exact match first guarantees 100% accuracy on radio buttons and dropdowns. |
| **Provenance Tracking & 70% Confidence Cap** | Prevents AI hallucinations. If an answer is generated or inferred rather than copied directly from the profile, we cap confidence at 70% and flag it so the user knows to review it. |

---

### Top 5 Viva Questions & Model Answers

**Q1: How does FormPilot communicate between the website and the extension?**  
*Answer:* When you log in or update your profile on the dashboard (`localhost:3000`), our React code uses `window.postMessage` to broadcast the data. Our content script (`dashboardSync.ts`), which is injected into the dashboard, listens for these messages and forwards them to the extension background service worker using `chrome.runtime.sendMessage`. The background worker caches the token and profile in `chrome.storage.local`.

**Q2: What happens if the user's Firebase token expires while filling a form?**  
*Answer:* Firebase tokens expire after 1 hour. If the background worker receives an `HTTP 401 Unauthorized` error from our Next.js API, it automatically broadcasts a `REQUEST_TOKEN_REFRESH` message to any open dashboard tab. The dashboard forces a token refresh via Firebase Auth and posts it back. The background worker updates its storage and automatically retries the API call.

**Q3: How do you prevent the AI from hallucinating false information on applications?**  
*Answer:* We enforce three layers of defense: First, our system prompt strictly forbids inventing facts and mandates returning `null` if information is missing. Second, our server-side calibration caps generative answers at 70% confidence and marks them with an explainability tag. Third, our floating `ReviewPanel` allows the applicant to inspect, edit, or reject any answer before it touches the webpage.

**Q4: Why can't FormPilot autofill resume file upload inputs on Google Forms?**  
*Answer:* Browser security sandboxes strictly prohibit JavaScript from programmatically setting file paths on `<input type="file">` elements without explicit, physical user interaction through the operating system's native file picker dialog. FormPilot intentionally leaves file uploads to manual user action.

**Q5: How does the resume parsing feature work?**  
*Answer:* In `/api/ai/parse-resume`, we receive the PDF file buffer. We first extract clean text using `pdf-parse`. If the PDF is text-based, we feed the text into our LLM with a strict JSON schema prompt. If the PDF is a scanned image with little extractable text, we convert the PDF into a base64 buffer and send it to our multimodal vision model to extract profile details.
