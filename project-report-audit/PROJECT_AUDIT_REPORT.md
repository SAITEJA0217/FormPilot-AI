# FormPilot AI: Complete Project Audit & Codebase Inspection Report

> **Document:** `project-report-audit/PROJECT_AUDIT_REPORT.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Institution:** Malla Reddy University — Department of CSE-AIML  
> **Project Title:** FormPilot AI: Semantic Form Understanding and Automatic Field Mapping Browser Extension  
> **Academic Year:** 2026–2027 (Major Project Phase-I)  
> **Project Guide:** Mrs. P. Bhavani  
> **Team Members:**  
> - Kadelaya Preethi (2311CS020290)  
> - Kalangi Samhitha (2311CS020297)  
> - Karka Saiteja Reddy (2311CS020312)  

---

## 1. Executive Summary

This report delivers a comprehensive, evidence-based codebase audit of **FormPilot AI**. Every finding is substantiated by verified static source code, configuration files, and empirical traces from [`c:/P/formpilot`](file:///c:/P/formpilot). 

### Key Findings Summary:
1. **Core Value Proposition & Form Target:** FormPilot is specialized exclusively for **Google Forms** (`https://docs.google.com/forms/*`). It addresses the total failure of standard HTML autocomplete engines by dynamically parsing Google's accessibility tree (`div[role="listitem"]`), deconstructing two-dimensional matrix rating tables (`div[role="grid"]`), and presenting a floating Human-in-the-Loop Review Panel before injection.
2. **Zero Autonomous Submissions (Verified 100%):** The extension code contains **zero** programmatic submit triggers, form submission events, or automatic page advancement. The user is strictly required to review fields and press the native Google Forms "Submit" button manually.
3. **No Graph Neural Networks (GNN):** As explicitly verified across the codebase, **no Graph Neural Networks, PyTorch Geometric, DGL, or graph embedding models are used**. FormPilot utilizes a hybrid pipeline combining deterministic DOM heuristics, a 3-tier collision-free token matcher, and Large Language Model inference via OpenRouter.
4. **Discrepancy in Model Provider:** Project documentation ([`docs/PRD.md:17`](file:///c:/P/formpilot/docs/PRD.md#L17)) states the project calls Google Gemini 2.5 Flash. However, the active implementation ([`frontend/src/lib/openrouter.ts:26,179`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L26)) routes inference to **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`) using the free model `nvidia/nemotron-3.5-lightning:free`. `@google/generative-ai` is installed in `package.json` but is never imported.
5. **Security Risks Identified:** Active credentials (OpenRouter API key, Firebase Service Account private key) reside in [`frontend/.env.local`](file:///c:/P/formpilot/frontend/.env.local), and `window.postMessage` in [`auth-context.tsx:31`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx#L31) broadcasts auth tokens using wildcard origin `'*'`.

---

## 2. Inventory of Source Files & Responsibilities

```
c:\P\formpilot\
├── shared/
│   ├── types/index.ts            # Canonical interfaces (UserProfile, FormQuestion, AIAnswer)
│   ├── prompts/index.ts          # FORMPILOT_SYSTEM_PROMPT with strict null/provenance rules
│   └── utils/firebase.ts         # Dual-runtime Firebase Client SDK configuration
├── extension/
│   ├── manifest.json             # Chromium Manifest V3 configuration (activeTab, storage, scripting)
│   ├── vite.config.ts            # Vite bundler with @crxjs/vite-plugin
│   └── src/
│       ├── background/index.ts   # Service worker: message router, API client & token refresher
│       ├── content/
│       │   ├── index.tsx         # DOM Extractor, tiered question matcher, native event injector
│       │   ├── ReviewPanel.tsx   # Floating React modal with confidence badges and "Why?" links
│       │   └── dashboardSync.ts  # Injected script bridging web postMessage to chrome.storage
│       └── popup/
│           ├── Popup.tsx         # Extension toolbar UI with "Analyze Current Form" CTA
│           └── index.tsx         # React mounter for popup
├── frontend/
│   ├── package.json              # Next.js 16.2.9, React 19.2.4, Tailwind CSS v4, Firebase 12.15.0
│   └── src/
│       ├── app/
│       │   ├── page.tsx          # Landing page with browser detection (Chrome, Edge, Brave)
│       │   ├── login/page.tsx    # Firebase Google Sign-In & Email/Password authentication
│       │   ├── dashboard/        # Dashboard home, profile editor, resume upload UI
│       │   └── api/ai/
│       │       ├── generate/     # Authenticated AI mapping gateway & provenance verification
│       │       ├── parse-resume/ # PDF resume parser (pdf-parse + multimodal fallback)
│       │       └── corrections/  # Few-shot user feedback classifier (fact vs phrasing)
│       └── lib/
│           ├── rate-limiter.ts   # Fail-closed atomic Firestore transaction rate limiter (1000/day)
│           ├── provenance.ts     # Independent server-side JSON path verification
│           ├── cors.ts           # Strict origin equality check & extension ID allowlisting
│           └── openrouter.ts     # OpenRouter client & 7-stage resilient JSON parser
├── benchmarks/                   # 40-question eval corpus, deterministic runner, live LLM trace
├── tests/
│   ├── runAll.cjs                # 17 standalone production reliability and security tests
│   └── googleFormsRegression.test.js # 7 Node.js test runner regression tests
└── firebase/
    └── firestore.rules           # Declarative Firestore security access rules
```

---

## 3. Scope Boundary: What Is Implemented vs. What Is Not

| Capability / Dimension | Implementation Status | Verified Code Evidence |
| :--- | :---: | :--- |
| **Google Forms Support** | **Implemented** | [`extension/manifest.json:36`](file:///c:/P/formpilot/extension/manifest.json#L36), [`extension/src/content/index.tsx:7-105`](file:///c:/P/formpilot/extension/src/content/index.tsx#L7-L105) |
| **2D Matrix Grid Flattening** | **Implemented** | [`extension/src/content/index.tsx:39-65`](file:///c:/P/formpilot/extension/src/content/index.tsx#L39-L65) |
| **Human Review Panel** | **Implemented** | [`extension/src/content/ReviewPanel.tsx:11-164`](file:///c:/P/formpilot/extension/src/content/ReviewPanel.tsx#L11-L164) |
| **Zero Autonomous Submissions** | **Implemented (100%)** | [`extension/src/content/index.tsx:270-507`](file:///c:/P/formpilot/extension/src/content/index.tsx#L270-L507) |
| **Server-Side Provenance & Clamping**| **Implemented** | [`frontend/src/lib/provenance.ts:24-61`](file:///c:/P/formpilot/frontend/src/lib/provenance.ts#L24-L61), [`generate/route.ts:224-235`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L224-L235) |
| **Fail-Closed Rate Limiting** | **Implemented** | [`frontend/src/lib/rate-limiter.ts:62-164`](file:///c:/P/formpilot/frontend/src/lib/rate-limiter.ts#L62-L164) |
| **Resume PDF Text Ingestion** | **Implemented** | [`frontend/src/app/api/ai/parse-resume/route.ts:62-181`](file:///c:/P/formpilot/frontend/src/app/api/ai/parse-resume/route.ts#L62-L181) |
| **Web-to-Extension Live Ping** | **Partially Implemented**| [`frontend/src/hooks/useExtensionDetection.ts:12-23`](file:///c:/P/formpilot/frontend/src/hooks/useExtensionDetection.ts#L12-L23) (Disabled by placeholder ID) |
| **Saved Form History Persistence**| **Planned / Placeholder**| [`frontend/src/app/dashboard/page.tsx:151-160`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L151-L160) (Card displays "Coming Soon") |
| **User Settings Page** | **Planned / Placeholder**| [`frontend/src/app/dashboard/page.tsx:142`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L142) (Card displays "Preferences (Coming soon)") |
| **Multi-Page Form Auto-Advancement**| **Future Scope** | User must manually click "Next" on Google Forms and re-trigger extraction |
| **Microsoft Forms / Typeform** | **Future Scope** | Deliberately excluded from Phase-I per [`docs/PRD.md:9-10`](file:///c:/P/formpilot/docs/PRD.md#L9-L10) |
| **File Upload (`input[type="file"]`)**| **Unsupported** | Browser security sandboxes strictly prevent programmatic file injection |
| **Graph Neural Networks (GNN)** | **NOT PRESENT** | **Zero GNN code exists**; non-GNN hybrid heuristics and LLM inference confirmed |

---

## 4. Major Discrepancies and Inconsistencies Flagged

1. **AI Model Provider Discrepancy:**
   - *Documentation Claim ([`docs/PRD.md:17`](file:///c:/P/formpilot/docs/PRD.md#L17), [`docs/FormPilot_Technical_Project_Documentation.md:7`](file:///c:/P/formpilot/docs/FormPilot_Technical_Project_Documentation.md#L7)):* Claims system calls "Gemini 2.5 Flash via Google Generative AI SDK".
   - *Actual Code ([`frontend/src/lib/openrouter.ts:26,179`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L26)):* Calls OpenRouter endpoint with default model `nvidia/nemotron-3.5-lightning:free`. `@google/generative-ai` is installed in `frontend/package.json` but is never imported anywhere in the project.
2. **Form History Discrepancy:**
   - *Documentation Claim ([`docs/PRD.md:15`](file:///c:/P/formpilot/docs/PRD.md#L15)):* Lists "Form History" as a core dashboard feature.
   - *Actual Code ([`frontend/src/app/dashboard/page.tsx:151-160`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L151-L160)):* Shows a static "Recent Activity — Coming Soon" placeholder. Firestore rules define `forms/{formId}`, but no code in the extension or API writes to or reads from this collection.
3. **Web-to-Extension Ping Discrepancy:**
   - *Documentation Claim:* Landing page dynamically detects if the extension is installed.
   - *Actual Code ([`frontend/src/lib/extension-config.ts:3`](file:///c:/P/formpilot/frontend/src/lib/extension-config.ts#L3)):* `FORM_PILOT_EXTENSION_ID = "PLACEHOLDER_EXTENSION_ID"`. This hardcoded string causes `useExtensionDetection.ts` to immediately return `isInstalled: false`.
