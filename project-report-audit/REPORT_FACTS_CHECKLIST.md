# FormPilot AI: Report Facts Checklist for B.Tech Major Project Phase-I

> **Document:** `project-report-audit/REPORT_FACTS_CHECKLIST.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Academic Level:** B.Tech Major Project Phase-I Final Documentation  
> **Purpose:** Comprehensive fact-checking reference mapping verified codebase evidence to academic thesis chapters.  

---

## 1. Chapter-by-Chapter Academic Evidence Checklist

### Chapter 1: Introduction & Problem Statement
| Fact / Claim | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| Project name is **FormPilot** (or FormPilot AI). | **Verified** | [`extension/manifest.json:3`](file:///c:/P/formpilot/extension/manifest.json#L3) (`"name": "FormPilot"`) | **Verified in Code** |
| Mission statement: *"Fill your profile once. Use it everywhere."* | **Verified** | [`extension/manifest.json:5`](file:///c:/P/formpilot/extension/manifest.json#L5), [`frontend/src/app/page.tsx:83-86`](file:///c:/P/formpilot/frontend/src/app/page.tsx#L83-L86) | **Verified in Code** |
| Target platform is specifically **Google Forms** (`docs.google.com/forms/*`). | **Verified** | [`docs/PRD.md:9`](file:///c:/P/formpilot/docs/PRD.md#L9), [`extension/manifest.json:36`](file:///c:/P/formpilot/extension/manifest.json#L36) | **Verified in Code** |
| Solves failure of built-in browser autofill on Google Forms dynamic accessibility trees. | **Verified** | [`extension/src/content/index.tsx:10-91`](file:///c:/P/formpilot/extension/src/content/index.tsx#L10-L91) | **Verified in Code** |
| Enforces strict Human-in-the-Loop policy with zero autonomous submissions. | **Verified** | [`extension/src/content/index.tsx:270-507`](file:///c:/P/formpilot/extension/src/content/index.tsx#L270-L507) | **Verified in Code** |

---

### Chapter 2: Literature & Context Discussion
| Context Element | Codebase Status | Guidance for Academic Report |
| :--- | :---: | :--- |
| **Existing Browser Autofill Systems:** Chrome Autofill, 1Password, Bitwarden, LastPass. | **Contextual** | *Action required by student:* Cite literature and documentation explaining standard W3C HTML autocomplete tokens (`autocomplete="name"`, `autocomplete="email"`) vs non-semantic accessibility tree containers. |
| **DOM Parsing & Accessibility Trees:** W3C WAI-ARIA specification (`div[role="listitem"]`, `div[role="grid"]`). | **Contextual** | *Action required by student:* Cite W3C WAI-ARIA 1.2 specifications and academic literature on web accessibility tree parsing. |
| **Generative AI in Web Automation:** LLM grounding, retrieval-augmented form filling, prompt engineering. | **Contextual** | *Action required by student:* Cite papers on prompt engineering, structured JSON extraction from LLMs, and few-shot in-context learning. |
| **Few-Shot Learning from Corrections:** Classifying user feedback into durable facts vs context phrasing. | **Contextual** | *Action required by student:* Cite literature on active learning and user preference alignment (e.g., RLHF, DPO, or few-shot exemplar caching). |

---

### Chapter 3: System Requirements & Feasibility
| Requirement / Specification | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| **Frontend Framework:** Next.js 16.2.9 with React 19.2.4. | **Verified** | [`frontend/package.json:20-25`](file:///c:/P/formpilot/frontend/package.json#L20-L25) | **Verified in Code** |
| **Extension Framework:** React 19.2.7 bundled via Vite 8.1.0 and `@crxjs/vite-plugin` 2.7.0. | **Verified** | [`extension/package.json:13-27`](file:///c:/P/formpilot/extension/package.json#L13-L27) | **Verified in Code** |
| **Chromium Extension Platform:** Manifest V3 (`manifest_version: 3`). | **Verified** | [`extension/manifest.json:2`](file:///c:/P/formpilot/extension/manifest.json#L2) | **Verified in Code** |
| **Authentication Engine:** Firebase Auth Client SDK 12.15.0 (Email/Password & Google Sign-In). | **Verified** | [`frontend/src/lib/auth-context.tsx:4-15`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx#L4-L15) | **Verified in Code** |
| **Server-Side Security:** Firebase Admin SDK 13.10.0 for token verification and Firestore transactions. | **Verified** | [`frontend/src/lib/firebase-admin.ts:1-46`](file:///c:/P/formpilot/frontend/src/lib/firebase-admin.ts#L1-L46) | **Verified in Code** |
| **Transactional Rate Limiting:** Enforces 1,000 req/day (generate), 30 req/day (resume), 200 req/day (corrections). | **Verified** | [`frontend/src/lib/rate-limiter.ts:31-35`](file:///c:/P/formpilot/frontend/src/lib/rate-limiter.ts#L31-L35) | **Verified in Code** |
| **Fail-Closed Security Posture:** Returns HTTP 503 if database rate limiter is unreachable. | **Verified** | [`frontend/src/lib/rate-limiter.ts:70-78`](file:///c:/P/formpilot/frontend/src/lib/rate-limiter.ts#L70-L78) | **Verified in Code** |
| **CORS Policy:** Strict origin equality against `chrome-extension://${ID}` and explicit allowlist. | **Verified** | [`frontend/src/lib/cors.ts:32-69`](file:///c:/P/formpilot/frontend/src/lib/cors.ts#L32-L69) | **Verified in Code** |

---

### Chapter 4: Proposed System & Architecture
| Architectural Property | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| Multi-context architecture decoupled across 4 runtime boundaries. | **Verified** | [`extension/manifest.json`](file:///c:/P/formpilot/extension/manifest.json), [`frontend/src/app`](file:///c:/P/formpilot/frontend/src/app) | **Verified in Code** |
| Cross-context communication map: `postMessage` $\rightarrow$ `runtime.sendMessage` $\rightarrow$ `tabs.sendMessage`. | **Verified** | [`extension/src/content/dashboardSync.ts`](file:///c:/P/formpilot/extension/src/content/dashboardSync.ts), [`background/index.ts`](file:///c:/P/formpilot/extension/src/background/index.ts) | **Verified in Code** |
| Self-healing token refresh loop on HTTP 401 via `REQUEST_TOKEN_REFRESH`. | **Verified** | [`extension/src/background/index.ts:22-51`](file:///c:/P/formpilot/extension/src/background/index.ts#L22-L51), [`auth-context.tsx:61-75`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx#L61-L75) | **Verified in Code** |
| Primary AI Gateway Endpoint: `POST /api/ai/generate`. | **Verified** | [`frontend/src/app/api/ai/generate/route.ts:33`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L33) | **Verified in Code** |
| Actual LLM Provider: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`). | **Verified** | [`frontend/src/lib/openrouter.ts:179`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L179) | **Verified in Code** |
| Default LLM Model: `nvidia/nemotron-3.5-lightning:free`. | **Verified** | [`frontend/src/lib/openrouter.ts:26`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L26) | **Verified in Code** |
| **DISCREPANCY:** Docs claim Gemini 2.5 Flash via Google Generative AI SDK, but code uses OpenRouter. | **DISCREPANCY** | [`docs/PRD.md:17`](file:///c:/P/formpilot/docs/PRD.md#L17) vs [`frontend/src/lib/openrouter.ts:26`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L26) | **Discrepancy Flagged** |

---

### Chapter 5: Methodology & Implementation
| Implementation Technique | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| DOM extraction traverses `div[role="listitem"]` and `div[role="heading"]`. | **Verified** | [`extension/src/content/index.tsx:11-15`](file:///c:/P/formpilot/extension/src/content/index.tsx#L11-L15) | **Verified in Code** |
| 2D rating tables deconstructed into discrete sub-questions (`${Q}: ${Row}`). | **Verified** | [`extension/src/content/index.tsx:55`](file:///c:/P/formpilot/extension/src/content/index.tsx#L55) | **Verified in Code** |
| Native prototype setter invocation (`HTMLInputElement.prototype`). | **Verified** | [`extension/src/content/index.tsx:253-263`](file:///c:/P/formpilot/extension/src/content/index.tsx#L253-L263) | **Verified in Code** |
| Bubbling synthetic events dispatched: `input`, `change`, `blur`. | **Verified** | [`extension/src/content/index.tsx:265-267`](file:///c:/P/formpilot/extension/src/content/index.tsx#L265-L267) | **Verified in Code** |
| Two-pass option matching on Likert scales (exact match first, then $\ge 3$ chars substring). | **Verified** | [`extension/src/content/index.tsx:456-473`](file:///c:/P/formpilot/extension/src/content/index.tsx#L456-L473) | **Verified in Code** |
| Delimited checkbox multi-selection parsing (splitting `,`, `;`, `\n`, `•`). | **Verified** | [`extension/src/content/index.tsx:425-441`](file:///c:/P/formpilot/extension/src/content/index.tsx#L425-L441) | **Verified in Code** |
| Dropdown asynchronous bounded polling (50ms interval, 1500ms timeout). | **Verified** | [`extension/src/content/index.tsx:148-208`](file:///c:/P/formpilot/extension/src/content/index.tsx#L148-L208) | **Verified in Code** |
| Timezone-safe date normalization to strict `YYYY-MM-DD`. | **Verified** | [`extension/src/content/index.tsx:211-238`](file:///c:/P/formpilot/extension/src/content/index.tsx#L211-L238) | **Verified in Code** |
| Resume text extraction via `pdf-parse` with multimodal base64 image fallback. | **Verified** | [`frontend/src/app/api/ai/parse-resume/route.ts:66-176`](file:///c:/P/formpilot/frontend/src/app/api/ai/parse-resume/route.ts#L66-L176) | **Verified in Code** |

---

### Chapter 6: Algorithms & Data Flow
| Algorithm / Data Model | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| **Canonical Data Schemas:** `UserProfile`, `FormQuestion`, `AIAnswer`. | **Verified** | [`shared/types/index.ts:56-86`](file:///c:/P/formpilot/shared/types/index.ts#L56-L86) | **Verified in Code** |
| **Anti-Collision 3-Tier Matcher:** Exact $\rightarrow$ Clean $\rightarrow$ Jaccard $\ge 0.8$ with $|\text{candidates}| = 1$. | **Verified** | [`extension/src/content/index.tsx:342-372`](file:///c:/P/formpilot/extension/src/content/index.tsx#L342-L372) | **Verified in Code** |
| **Independent Provenance Verification:** Resolves JSON path; prevents false claims. | **Verified** | [`frontend/src/lib/provenance.ts:24-61`](file:///c:/P/formpilot/frontend/src/lib/provenance.ts#L24-L61) | **Verified in Code** |
| **Confidence Downgrading:** Inferred answers clamped to a maximum of 70% confidence. | **Verified** | [`frontend/src/app/api/ai/generate/route.ts:233`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L233) | **Verified in Code** |
| **7-Stage Resilient JSON Parser:** Strips reasoning tags, repairs truncation, regex recovery. | **Verified** | [`frontend/src/lib/openrouter.ts:57-135`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L57-L135) | **Verified in Code** |
| **Few-Shot Prompt Classification:** Classifies user edits into `fact-level` vs `phrasing-level`. | **Verified** | [`frontend/src/app/api/ai/corrections/route.ts:87-117`](file:///c:/P/formpilot/frontend/src/app/api/ai/corrections/route.ts#L87-L117) | **Verified in Code** |

---

### Chapter 7: Testing & Results
| Test Category | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| **17-Test Production Reliability Suite:** Rate limiter, CORS, provenance, bounds, parser. | **Verified** | [`tests/runAll.cjs:1-544`](file:///c:/P/formpilot/tests/runAll.cjs#L1-L544) | **Verified in Code** |
| **7-Test Google Forms Regression Suite:** Matching, Likert, dates, hidden CSRF, grids. | **Verified** | [`tests/googleFormsRegression.test.js:1-264`](file:///c:/P/formpilot/tests/googleFormsRegression.test.js#L1-L264) | **Verified in Code** |
| **Controlled 40-Question Corpus:** Synthetic evaluation suite with canonical ground truth. | **Verified** | [`benchmarks/data/google_forms_eval_corpus.json`](file:///c:/P/formpilot/benchmarks/data/google_forms_eval_corpus.json) | **Verified in Code** |
| **Deterministic Reference Evaluation:** 100% precision, 100% recall, 0% hallucinations. | **Verified Trace** | [`benchmarks/benchmark_results.json`](file:///c:/P/formpilot/benchmarks/benchmark_results.json) | **Verified from Traces** |
| **Live Production LLM Evaluation:** 100% accuracy, 100% safety on 40 items; 3.5s - 8.2s latency. | **Verified Trace** | [`benchmarks/live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json) | **Verified from Traces** |
| **Sandboxed Execution Limitation:** `node` is absent on sandbox PATH; tests must run locally. | **Verified** | Sandbox terminal log `task-151.log` | **Verified Runtime Limitation** |

---

### Chapter 8: Limitations & Future Scope
| Limitation / Scope Boundary | Codebase Status | Evidence / Source Reference | Confirmation Status |
| :--- | :---: | :--- | :---: |
| Strictly limited to Google Forms (`docs.google.com/forms/*`). | **Verified** | [`docs/PRD.md:9`](file:///c:/P/formpilot/docs/PRD.md#L9), [`extension/manifest.json:36`](file:///c:/P/formpilot/extension/manifest.json#L36) | **Verified in Code** |
| Microsoft Forms, Typeform, Jotform are out of scope (Future Scope). | **Verified** | [`docs/PRD.md:10`](file:///c:/P/formpilot/docs/PRD.md#L10) | **Verified in Code** |
| File uploads (`input[type="file"]`) cannot be automated due to browser security sandboxes. | **Verified** | [`extension/src/content/index.tsx:30`](file:///c:/P/formpilot/extension/src/content/index.tsx#L30) (excluded) | **Verified in Code** |
| Multi-page forms require sequential user navigation ("Next") and manual trigger. | **Verified** | Single-page extraction in [`extension/src/content/index.tsx:7`](file:///c:/P/formpilot/extension/src/content/index.tsx#L7) | **Verified in Code** |
| Form History is a placeholder ("Coming Soon"); no completed forms are saved. | **Verified** | [`frontend/src/app/dashboard/page.tsx:151-160`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L151-L160) | **Verified in Code** |
| Web-to-Extension ping is inactive due to `"PLACEHOLDER_EXTENSION_ID"`. | **Verified** | [`frontend/src/lib/extension-config.ts:3`](file:///c:/P/formpilot/frontend/src/lib/extension-config.ts#L3) | **Verified in Code** |
| Security Risk: `window.postMessage` wildcard target `'*'` in `auth-context.tsx`. | **Verified** | [`frontend/src/lib/auth-context.tsx:31`](file:///c:/P/formpilot/frontend/src/lib/auth-context.tsx#L31) | **Security Risk Identified** |
| Security Risk: Live API keys and private keys committed in `frontend/.env.local`. | **Verified** | [`frontend/.env.local:8-14`](file:///c:/P/formpilot/frontend/.env.local#L8-L14) | **Security Risk Identified** |
