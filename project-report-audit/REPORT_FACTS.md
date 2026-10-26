# FormPilot AI: Single Source of Truth & Project Fact Sheet

> **Document:** `project-report-audit/REPORT_FACTS.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Institution:** Malla Reddy University — Department of CSE-AIML  
> **Academic Level:** B.Tech Major Project Phase-I  
> **Status:** Verified Source of Truth for Final University Report Compilation  

---

## 1. Metadata & Team Identification

- **Project Title:** **FormPilot AI: Semantic Form Understanding and Automatic Field Mapping Browser Extension**
- **Short Name:** FormPilot
- **Tagline:** *"Fill your profile once. Use it everywhere."*
- **Institution:** Malla Reddy University
- **Department:** Computer Science and Engineering (Artificial Intelligence & Machine Learning)
- **Academic Year:** 2026–2027
- **Project Type:** B.Tech Major Project Phase-I
- **Project Guide:** Mrs. P. Bhavani
- **Student Team:**
  1. **Kadelaya Preethi** — Roll No: `2311CS020290`
  2. **Kalangi Samhitha** — Roll No: `2311CS020297`
  3. **Karka Saiteja Reddy** — Roll No: `2311CS020312`
- **Architectural Paradigm:** Human-in-the-Loop Web Automation Extension (Non-Autonomous, Non-GNN)

---

## 2. Confirmed Technology Stack

| Component / Layer | Technology | Actual Version in Codebase | Verification File |
| :--- | :--- | :---: | :--- |
| **Language** | TypeScript | `^5.0` (Web) / `~6.0.2` (Ext) | [`shared/types/index.ts`](file:///c:/P/formpilot/shared/types/index.ts), [`extension/tsconfig.json`](file:///c:/P/formpilot/extension/tsconfig.json) |
| **Web Dashboard** | Next.js (App Router) | `16.2.9` | [`frontend/package.json:20`](file:///c:/P/formpilot/frontend/package.json#L20) |
| **Frontend UI** | React / React DOM | `19.2.4` (Web) / `19.2.7` (Ext) | [`frontend/package.json:24`](file:///c:/P/formpilot/frontend/package.json#L24), [`extension/package.json:25`](file:///c:/P/formpilot/extension/package.json#L25) |
| **Extension Platform** | Chromium Extensions | Manifest V3 (`manifest_version: 3`) | [`extension/manifest.json:2`](file:///c:/P/formpilot/extension/manifest.json#L2) |
| **Extension Bundler** | Vite + `@crxjs/vite-plugin` | Vite `^8.1.0` / CRXJS `^2.7.0` | [`extension/package.json:13,20`](file:///c:/P/formpilot/extension/package.json#L13) |
| **Styling Engine** | Tailwind CSS | `^4.3.1` (`@tailwindcss/vite`) | [`extension/package.json:18`](file:///c:/P/formpilot/extension/package.json#L18), [`frontend/package.json:38`](file:///c:/P/formpilot/frontend/package.json#L38) |
| **Client Authentication**| Firebase Client SDK | `^12.15.0` | [`shared/utils/firebase.ts:1-46`](file:///c:/P/formpilot/shared/utils/firebase.ts#L1-L46) |
| **Server Admin & DB** | Firebase Admin SDK | `^13.10.0` | [`frontend/src/lib/firebase-admin.ts:1-46`](file:///c:/P/formpilot/frontend/src/lib/firebase-admin.ts#L1-L46) |
| **Document Ingestion** | pdf-parse | `^1.1.1` | [`frontend/src/app/api/ai/parse-resume/route.ts:66`](file:///c:/P/formpilot/frontend/src/app/api/ai/parse-resume/route.ts#L66) |
| **Active AI Gateway** | OpenRouter REST API | Model: `nvidia/nemotron-3.5-lightning:free` | [`frontend/src/lib/openrouter.ts:26,179`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L26) |
| **Animation Library** | framer-motion | `^12.41.0` | [`frontend/package.json:18`](file:///c:/P/formpilot/frontend/package.json#L18) |
| **Iconography** | lucide-react | `^1.21.0` | [`frontend/package.json:19`](file:///c:/P/formpilot/frontend/package.json#L19), [`extension/package.json:24`](file:///c:/P/formpilot/extension/package.json#L24) |
| **Notifications** | sonner | `^2.0.7` | [`frontend/package.json:27`](file:///c:/P/formpilot/frontend/package.json#L27) |

---

## 3. Confirmed Core Algorithms

1. **Accessibility Tree Extraction (`extractGoogleFormQuestions`):** Scans `div[role="listitem"]`, reads `div[role="heading"]`, extracts `*` or `aria-required` tags, and discovers input types ([`extension/src/content/index.tsx:7-105`](file:///c:/P/formpilot/extension/src/content/index.tsx#L7-L105)).
2. **2D Matrix Grid Flattening:** Deconstructs `div[role="grid"]` column headers and rowheaders into distinct, promptable sub-questions (`${Q}: ${Row}`) ([`extension/src/content/index.tsx:39-65`](file:///c:/P/formpilot/extension/src/content/index.tsx#L39-L65)).
3. **Anti-Collision 3-Tier Matcher:** Exact match $\rightarrow$ Normalized clean match $\rightarrow$ Token Jaccard similarity ($\ge 0.8$ with strictly $|\text{candidates}| = 1$) to prevent subset collisions ([`extension/src/content/index.tsx:342-372`](file:///c:/P/formpilot/extension/src/content/index.tsx#L342-L372)).
4. **Synthetic Event & Prototype Bypass (`setNativeInputValue`):** Directly invokes native `HTMLInputElement.prototype` value setter and dispatches bubbling `input`, `change`, and `blur` events ([`extension/src/content/index.tsx:252-268`](file:///c:/P/formpilot/extension/src/content/index.tsx#L252-L268)).
5. **Two-Pass Option Matching:** Exact match pass followed by substring fallback ($\ge 3$ chars) to prevent Likert inversion ("Agree" vs "Strongly Agree") ([`extension/src/content/index.tsx:456-473`](file:///c:/P/formpilot/extension/src/content/index.tsx#L456-L473)).
6. **Multi-Select Checkbox Splitting:** Parses delimited strings (commas, semicolons, newlines, bullets) and toggles options without unchecking existing selections ([`extension/src/content/index.tsx:423-448`](file:///c:/P/formpilot/extension/src/content/index.tsx#L423-L448)).
7. **Timezone-Safe Date Normalization:** Preserves exact local calendar dates in strict `YYYY-MM-DD` format without UTC offset day-shift defects ([`extension/src/content/index.tsx:211-238`](file:///c:/P/formpilot/extension/src/content/index.tsx#L211-L238)).
8. **Asynchronous Bounded Dropdown Polling:** Clicks listbox, polls options every 50ms, selects matching option, and closes dropdown after 1500ms timeout ([`extension/src/content/index.tsx:145-209`](file:///c:/P/formpilot/extension/src/content/index.tsx#L145-L209)).
9. **Independent Provenance Verification (`verifyProvenance`):** Server traverses user profile JSON paths dynamically; unverified or generative answers are clamped at maximum 70% confidence ([`frontend/src/lib/provenance.ts:24-61`](file:///c:/P/formpilot/frontend/src/lib/provenance.ts#L24-L61), [`generate/route.ts:224-235`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L224-L235)).
10. **Fail-Closed Transactional Rate Limiting:** Enforces daily user quotas via atomic Firestore transactions; fails closed (HTTP 503) if Firestore fails ([`frontend/src/lib/rate-limiter.ts:62-164`](file:///c:/P/formpilot/frontend/src/lib/rate-limiter.ts#L62-L164)).
11. **7-Stage Resilient JSON Parser:** Strips reasoning `<think>` tags, extracts markdown blocks, repairs truncated arrays, and executes regex item recovery ([`frontend/src/lib/openrouter.ts:57-135`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L57-L135)).
12. **Few-Shot User Correction Classification:** Classifies user edits into `fact-level` or `phrasing-level` via LLM prompt and stores in Firestore ([`frontend/src/app/api/ai/corrections/route.ts:87-129`](file:///c:/P/formpilot/frontend/src/app/api/ai/corrections/route.ts#L87-L129)).
13. **Zero Autonomous Submission Safeguard:** Strictly 0% autonomous submissions. No code path clicks submit or advances pages ([`extension/src/content/index.tsx:270-507`](file:///c:/P/formpilot/extension/src/content/index.tsx#L270-L507)).

---

## 4. Confirmed Absence of Graph Neural Networks (GNN)

> **Explicit University Clarification:** FormPilot AI **does NOT use Graph Neural Networks (GNNs)**, Graph Convolutional Networks (GCNs), Graph Attention Networks (GATs), or graph embedding libraries (PyTorch Geometric, DGL).  
> The project architecture is a **hybrid semantic web automation system** combining:
> 1. Deterministic accessibility tree DOM traversal heuristics.
> 2. Token-based Jaccard similarity and normalized string distance algorithms.
> 3. Large Language Model prompt-based reasoning and in-context learning via OpenRouter.
> Any claims in early proposals regarding GNNs must be corrected to reflect this verified implementation.

---

## 5. Confirmed Testing & Benchmark Evidence

- **Unit & Integration Suite ([`tests/runAll.cjs`](file:///c:/P/formpilot/tests/runAll.cjs)):** 17 tests covering rate limiting, provenance, CORS, JSON parsing, prompt injection defense, authentication, resource bounds, matching, dates, and dropdown scoping.
- **Google Forms Regression Suite ([`tests/googleFormsRegression.test.js`](file:///c:/P/formpilot/tests/googleFormsRegression.test.js)):** 7 test blocks verifying matching priorities, Likert protection, ISO dates, hidden CSRF exclusions, ReviewPanel sync, 70% confidence capping, and grid flattening.
- **Deterministic Evaluation Benchmark ([`benchmarks/benchmark_results.json`](file:///c:/P/formpilot/benchmarks/benchmark_results.json)):** 40-question controlled dataset evaluation: **100.00% precision, 100.00% recall, 100.00% accuracy, 0.00% false-fill rate**.
- **Live Production LLM Evaluation ([`benchmarks/live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json)):** 40-question live batch evaluation via OpenRouter: **100.00% accuracy, 100.00% safety refusal rate, 3.5s - 8.2s batch latency**.

---

## 6. Scope Boundaries & Future Scope (Phase-II Roadmap)

### Phase-I Scope Boundaries:
- Specialized strictly for Google Forms (`https://docs.google.com/forms/*`).
- Does not automate `<input type="file">` file uploads (prevented by operating system security).
- Multi-page forms require sequential user navigation ("Next") and manual trigger.
- Form History is a placeholder ("Coming Soon").
- Web-to-extension live ping is inactive due to `"PLACEHOLDER_EXTENSION_ID"`.

### Proposed Phase-II Scope:
- Integration of a `MutationObserver` to auto-detect multi-page Google Forms transitions.
- Expansion of DOM parsing adapters to support Microsoft Forms and Typeform.
- Activation of the Firestore `forms/{formId}` collection for historical form logging.
- Integration of in-browser WebLLM / ONNX Runtime Web for offline, privacy-preserving client-side inference.
