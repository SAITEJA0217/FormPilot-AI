# FormPilot AI: Screenshot & Demonstration Checklist

> **Document:** `project-report-audit/SCREENSHOT_CHECKLIST.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Institution:** Malla Reddy University — Department of CSE-AIML  
> **Academic Level:** B.Tech Major Project Phase-I  
> **Auditor Status:** Senior Software Engineer / Academic Documentation Specialist  

---

## 1. Executive Summary

This checklist outlines the **10 genuine, real-world screenshots** required to document the FormPilot AI Major Project Phase-I report. 

> **Important Academic Guideline:** Never present Figma mockups, generic browser screenshots, or AI-generated synthetic interfaces as real project evidence. Every screenshot below must be captured from the actual running codebase.

---

## 2. Prerequisites for Screenshot Collection

1. **Start the Web Dashboard:**
   ```bash
   cd frontend
   npm run dev
   ```
   Confirm the dashboard is active at [`http://localhost:3000`](http://localhost:3000).

2. **Build and Load the Extension:**
   ```bash
   cd extension
   npm run build
   ```
   Open `chrome://extensions/` (or `edge://extensions/`), enable **Developer mode**, click **Load unpacked**, and select `c:\P\formpilot\extension\dist`.

---

## 3. Prioritized Screenshot Inventory & Capture Instructions

### [SS-01] Landing Page & Dynamic Browser Environment Detection
- **Target URL:** `http://localhost:3000/`
- **File / Component:** [`frontend/src/app/page.tsx:76-135`](file:///c:/P/formpilot/frontend/src/app/page.tsx#L76-L135), [`frontend/src/lib/browser-detection.ts`](file:///c:/P/formpilot/frontend/src/lib/browser-detection.ts)
- **What to Capture:** The Hero section showing the headline *"Fill your profile once. Use it everywhere."* and the dynamically rendered installation button (e.g. *"Install for Chrome"* or *"Install for Edge"*).
- **Report Chapter:** Chapter 4 (Proposed System) / Chapter 8 (User Interface).

### [SS-02] Authentication View (Firebase Auth Gateway)
- **Target URL:** `http://localhost:3000/login`
- **File / Component:** [`frontend/src/app/login/page.tsx`](file:///c:/P/formpilot/frontend/src/app/login/page.tsx)
- **What to Capture:** The login card showing the Google Sign-In button, email/password input fields, and the "Quick Sign-In (Demo User)" button.
- **Report Chapter:** Chapter 5 (Methodology & Implementation: Security & Authentication).

### [SS-03] Web Dashboard Home & Profile Readiness Metrics
- **Target URL:** `http://localhost:3000/dashboard`
- **File / Component:** [`frontend/src/app/dashboard/page.tsx:48-125`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L48-L125)
- **What to Capture:** The personalized greeting, the Profile Completion progress bar (e.g., 85% or 100%), and the Extension Status card ("Active & Ready").
- **Report Chapter:** Chapter 4 (System Architecture) / Chapter 8 (User Interface).

### [SS-04] Centralized Profile Knowledge Base Editor
- **Target URL:** `http://localhost:3000/dashboard/profile`
- **File / Component:** [`frontend/src/components/profile/ProfileForm.tsx`](file:///c:/P/formpilot/frontend/src/components/profile/ProfileForm.tsx)
- **What to Capture:** The 6-tab interface with the **Education** or **Skills** tab active, showing populated fields (degree, college, CGPA, technical skills tag inputs) and the debounced auto-save status.
- **Report Chapter:** Chapter 5 (Implementation: Identity Management).

### [SS-05] Resume Ingestion & Parsing Dropzone
- **Target URL:** `http://localhost:3000/dashboard/resume`
- **File / Component:** [`frontend/src/app/dashboard/resume/page.tsx`](file:///c:/P/formpilot/frontend/src/app/dashboard/resume/page.tsx)
- **What to Capture:** The drag-and-drop PDF dropzone showing an uploaded resume and the extracted profile preview.
- **Report Chapter:** Chapter 5 (Implementation: Document Ingestion).

### [SS-06] Extension Toolbar Popup (FormPilot Action View)
- **Target View:** Browser Toolbar $\rightarrow$ Click FormPilot puzzle/pinned icon.
- **File / Component:** [`extension/src/popup/Popup.tsx`](file:///c:/P/formpilot/extension/src/popup/Popup.tsx)
- **What to Capture:** The 320px dark-themed extension popup showing the "Profile Ready" green badge and the blue "Analyze Current Form" CTA button.
- **Report Chapter:** Chapter 4 (System Architecture) / Chapter 8 (User Interface).

### [SS-07] Target Google Form Before Analysis
- **Target URL:** Any live Google Form (`https://docs.google.com/forms/d/e/.../viewform`) or the offline mock form [`http://localhost:3000/test-form.html`](http://localhost:3000/test-form.html).
- **What to Capture:** The empty form showing text fields, radio buttons, checkboxes, dates, and a 2D matrix rating grid.
- **Report Chapter:** Chapter 5 (Methodology: DOM Accessibility Extraction).

### [SS-08] Injected ReviewPanel Overlay with Provenance Trails
- **Target View:** On the Google Form page after clicking "Analyze Current Form".
- **File / Component:** [`extension/src/content/ReviewPanel.tsx:64-162`](file:///c:/P/formpilot/extension/src/content/ReviewPanel.tsx#L64-L162)
- **What to Capture:** The floating modal in the upper-right corner displaying extracted questions, color-coded confidence badges (e.g. "100% Match", "70% Match"), and an expanded **"Why?"** box showing the provenance trail (e.g. `education[0].degree`).
- **Report Chapter:** Chapter 4 (Proposed Architecture) / Chapter 6 (Algorithms).

### [SS-09] ReviewPanel Inline Answer Editing & Few-Shot Learning
- **Target View:** Inside the ReviewPanel on the Google Form page.
- **File / Component:** [`extension/src/content/ReviewPanel.tsx:126-135`](file:///c:/P/formpilot/extension/src/content/ReviewPanel.tsx#L126-L135)
- **What to Capture:** An active inline editing input with the user adjusting an answer, showing the checkmark save button and the confirmation toast: *"Got it — I'll remember this phrasing for future forms."*
- **Report Chapter:** Chapter 5 (Implementation: Few-Shot Correction Learning).

### [SS-10] Native Autofill Completed with Zero Autonomous Submission
- **Target View:** On the Google Form page immediately after clicking "Autofill Form".
- **File / Component:** [`extension/src/content/index.tsx:501-524`](file:///c:/P/formpilot/extension/src/content/index.tsx#L501-L524)
- **What to Capture:** All form fields filled with user data, the floating green toast in the lower right (*"Form autofilled: all X fields completed!"*), and the **Google Forms "Submit" button clearly visible and UNCLICKED**.
- **Report Chapter:** Chapter 4 & 5 (Zero Autonomous Submission Verification & HITL Agency).
