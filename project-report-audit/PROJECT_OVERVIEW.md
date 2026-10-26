# FormPilot AI: Project Overview & Fact Sheet

> **Document:** `project-report-audit/PROJECT_OVERVIEW.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Academic Level:** B.Tech Major Project Phase-I  
> **Audit Date:** October 2026  
> **Auditor Status:** Senior Software Engineer / Codebase Auditor  

---

## 1. Actual Project Identity & Purpose

- **Official Project Name:** **FormPilot** (referred to in documentation and manuscript as **FormPilot AI**).
- **Core Tagline:** *"Fill your profile once. Use it everywhere."*
- **Application Type:** Multi-component hybrid software system consisting of:
  1. A **Chromium Browser Extension** (Manifest V3) running on Google Chrome, Microsoft Edge, and Brave.
  2. A **Web Application & Dashboard** built with Next.js 16 (React 19) providing identity management and AI gateway endpoints.
  3. A **Cloud Backend & Database** hosted on Google Cloud Firebase (Authentication, Firestore NoSQL database, and Security Rules).
  4. An **External AI Inference Gateway** routing form questions and user profiles to Large Language Models (LLMs).
- **Primary Mission:** Eliminate redundant manual data entry for students and job seekers filling online Google Forms (`https://docs.google.com/forms/*`) for campus placements, internships, hackathons, and scholarship applications, while enforcing strict user governance and zero autonomous submissions.

---

## 2. Problem Statement Addressed

When applicants apply for academic and professional opportunities, organizers frequently deploy Google Forms rather than corporate Applicant Tracking Systems (e.g., Workday, Greenhouse). This introduces four fundamental technical and usability challenges:

1. **Repetitive Low-Level Data Entry:** Applicants repeatedly re-type identical demographic, contact, academic (CGPA, graduation year, degree), and professional details across dozens of application questionnaires, inducing cognitive fatigue and clerical errors.
2. **Failure of Standard Browser Autofill Engines:** Built-in browser autofill mechanisms (e.g., Chrome Autofill) depend on standard HTML form semantics such as `<input name="email">` or `autocomplete="email"`. Google Forms renders an abstract, JavaScript-driven accessibility tree composed of non-semantic `div[role="listitem"]`, `div[role="radiogroup"]`, `div[role="grid"]`, and `div[role="listbox"]` containers. Standard autofill extensions cannot parse or map these elements.
3. **Contextual & Generative Questions:** Forms often pose open-ended qualitative prompts (e.g., *"Summarize your experience with React"* or *"Describe a challenging project you engineered"*). Standard form autofill engines cannot synthesize grounded responses from a resume or profile knowledge base.
4. **Autonomous Submission Risk:** Unsupervised web automation tools risk submitting incomplete, erroneous, or hallucinated data without applicant consent. FormPilot strictly addresses this with an un-bypassable Human-in-the-Loop (HITL) Review Panel and zero autonomous form submission code paths.

---

## 3. Target Users & Verified Real-World Use Cases

| Target User Group | Real-World Use Case | Codebase Verification |
| :--- | :--- | :--- |
| **Undergraduate & Graduate Students** | Applying to university placement drives, hackathon team registrations, club inductions, and scholarship Google Forms. | Verified: 6-tab profile schema accommodates university, college, branch, CGPA, graduation year in [`shared/types/index.ts:12-20`](file:///c:/P/formpilot/shared/types/index.ts#L12-L20). |
| **Job Applicants & Interns** | Submitting screening forms, technical questionnaires, and role-fit surveys requiring portfolio links and project summaries. | Verified: Project and Experience structures in [`shared/types/index.ts:28-46`](file:///c:/P/formpilot/shared/types/index.ts#L28-L46) with provenance tracking. |
| **Survey Participants** | Completing repetitive academic, demographic, and multi-dimensional Likert-scale rating surveys. | Verified: 2D Matrix grid flattening algorithm in [`extension/src/content/index.tsx:39-65`](file:///c:/P/formpilot/extension/src/content/index.tsx#L39-L65). |

---

## 4. Project Objectives: Achieved vs. Pending

### 4.1 Objectives Fully Achieved in Code
- [x] **Universal Google Forms Accessibility Tree Parser:** Dynamically traverses `div[role="listitem"]` to discover question titles, required status (`*` or `aria-required`), and control types.
- [x] **2D Matrix Grid Deconstruction:** Flattens complex two-dimensional rating tables (`div[role="grid"]`) into discrete, promptable sub-questions (`Question: RowHeader`).
- [x] **Centralized Identity Knowledge Base:** 6-tab web editor (Personal, Education, Skills, Projects, Experience, Social) with 400ms debounced persistence.
- [x] **PDF Resume Parsing & Auto-Population:** Serverless PDF text extraction (`pdf-parse`) with multimodal base64 image fallback to auto-populate identity profiles.
- [x] **Context-Decoupled Dashboard-to-Extension Sync:** Bidirectional cross-context synchronization bridging Web, Content Script, Background Worker, and `chrome.storage.local`.
- [x] **Self-Healing Token Refresh Lifecycle:** Automated background token recovery (handling HTTP 401 via `REQUEST_TOKEN_REFRESH`) without interrupting form completion.
- [x] **Semantic AI Mapping Engine:** Serverless AI gateway assembling structured system prompts, profile context, and question schemas.
- [x] **Server-Side Independent Provenance Verification:** Server rejects LLM self-reported provenance claims; verifies JSON paths dynamically against the profile and clamps ungrounded generative confidence at 70%.
- [x] **Interactive Human-in-the-Loop Review Panel:** Injected React modal enabling per-field confidence inspection, provenance ("Why?") inspection, inline answer editing, and field skipping.
- [x] **Few-Shot Correction Learning:** Classifies user edits (`fact-level` vs `phrasing-level`) and injects past phrasing into future prompts.
- [x] **Synthetic Event & Prototype Bypass Injection:** Sets input values via native prototype descriptors (`HTMLInputElement.prototype`) and dispatches simulated `input`, `change`, and `blur` events.
- [x] **Zero Autonomous Submission Safeguard:** Code inspection confirms **0% autonomous submissions**; no code path triggers form submission or page advancement.
- [x] **Fail-Closed Transactional Rate Limiting:** Enforces daily request quotas via atomic Firestore transactions; fails closed (HTTP 503) if database is unreachable.
- [x] **Strict CORS Origin Validation:** Rejects wildcard origin reflections; enforces exact extension ID and localhost allowlists.

### 4.2 Objectives Partially Implemented
- [ ] **Web-to-Extension Live Ping Detection:** Code exists in [`frontend/src/hooks/useExtensionDetection.ts`](file:///c:/P/formpilot/frontend/src/hooks/useExtensionDetection.ts), but [`frontend/src/lib/extension-config.ts`](file:///c:/P/formpilot/frontend/src/lib/extension-config.ts) sets `FORM_PILOT_EXTENSION_ID = "PLACEHOLDER_EXTENSION_ID"`, disabling runtime ping verification on the web dashboard.

### 4.3 Objectives Pending / Planned / Future Scope
- [ ] **Saved Form History Feature:** Mentioned in PRD and Firestore security rules (`forms/{formId}` in [`firebase/firestore.rules:17-22`](file:///c:/P/formpilot/firebase/firestore.rules#L17-L22)), but dashboard UI displays a static "Recent Activity — Coming Soon" placeholder ([`frontend/src/app/dashboard/page.tsx:151-160`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L151-L160)) and no form logging code exists in the extension.
- [ ] **User Settings / Preferences Page:** UI card displays "Settings — Preferences (Coming soon)" ([`frontend/src/app/dashboard/page.tsx:142`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L142)); inactive button.
- [ ] **Multi-Page Automatic Form Navigation:** Current implementation requires the user to click Google Forms' native "Next" button and trigger "Analyze Current Form" per page.
- [ ] **Third-Party Form Platforms (Microsoft Forms, Typeform, Jotform):** Strictly out of scope in Phase-I as mandated by [`docs/PRD.md:9-10`](file:///c:/P/formpilot/docs/PRD.md#L9-L10).
- [ ] **File Upload Control Automation:** Programmatic attachment to `<input type="file">` is prevented by browser operating system security sandboxes.

---

## 5. Scope & Boundary Matrix

| Dimension | Supported in Phase-I Codebase | Deliberately Out of Scope |
| :--- | :--- | :--- |
| **Form Host** | Google Forms (`https://docs.google.com/forms/*`) | Microsoft Forms, Typeform, Jotform, Workday, Lever |
| **Field Types** | Short answer, Paragraph, Radio, Checkbox, Dropdown, Date, Time, Linear Scale, 2D Matrix Grids | File uploads (`input[type="file"]`), CAPTCHA, payment widgets |
| **Submission** | Manual by applicant (Strict Zero Autonomous Submission) | Autonomous submit, automatic pagination click |
| **Authentication** | Firebase Auth (Google Sign-In, Email/Password) | Multi-tenant SSO, Enterprise SAML |
| **LLM Inference** | Serverless OpenRouter REST Gateway (`nemotron-3.5-lightning:free` / Gemini) | Local on-device LLM (WebLLM / Ollama) |
