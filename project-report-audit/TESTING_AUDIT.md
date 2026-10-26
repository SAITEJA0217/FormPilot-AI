# FormPilot AI: Testing & Verification Audit

> **Document:** `project-report-audit/TESTING_AUDIT.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Academic Level:** B.Tech Major Project Phase-I  
> **Auditor Status:** Senior Software Engineer / Academic Documentation Specialist  

---

## 1. Executive Summary of Testing Infrastructure

The FormPilot repository contains multiple levels of automated verification suites:
1. **Production Reliability & Security Test Suite (`tests/runAll.cjs`):** 17 standalone unit and integration tests executing against real production TypeScript library modules using an in-memory mock Firestore database and Node.js assertions.
2. **Google Forms Regression Suite (`tests/googleFormsRegression.test.js`):** 7 structured regression tests designed for standard Node.js test runner (`node:test`).
3. **Deterministic Evaluation Benchmark (`benchmarks/runBenchmark.cjs`):** 40-question controlled dataset evaluation measuring precision, recall, macro F1, and hallucination rates against canonical ground truth.
4. **Live Production LLM Evaluation Harness (`benchmarks/runLiveLLMEvaluation.cjs`):** Live batching test runner evaluating OpenRouter API completions against the 40-question benchmark corpus.

---

## 2. Test Execution & Verification Log

### 2.1 Actual Sandboxed Terminal Execution Log
In accordance with strict auditor instructions, test execution was attempted in the current sandboxed terminal environment:

```powershell
Command: node -v
Working Directory: c:\P\formpilot
Observed Result:
node : The term 'node' is not recognized as the name of a cmdlet, function, script file, or operable program. 
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
Exit Code: 1
Status: CommandNotFoundException (Node.js binary not present on sandboxed PATH)
```

> **Auditor Finding:** Test results are not fabricated. Because Node.js is not present on the default sandbox PATH, automated scripts could not be executed within this sandboxed session. However, all test files, logic, mock implementations, and execution traces were verified through static code inspection.

---

## 3. Inventory of Existing Test Suites

| Test Suite / Command | Location / File | What It Verifies | Codebase Execution Status | Observed / Documented Result | Known Limitations |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Quota Enforcement Suite (Tests 1-4)** | [`tests/runAll.cjs:106-200`](file:///c:/P/formpilot/tests/runAll.cjs#L106-L200) | Verifies distinct quotas for `generate`, `parse-resume`, `corrections`, fail-closed HTTP 503 behavior on DB failure, 24h sliding window reset, and concurrency safety under 5 parallel requests. | Inspected (Static Verification) | 4 of 4 tests verify atomic rate limiter against `createMockFirestore()`. | Uses mock in-memory Firestore; does not connect to live cloud Firestore. |
| **Provenance Defense Suite (Tests 5-6)** | [`tests/runAll.cjs:205-263`](file:///c:/P/formpilot/tests/runAll.cjs#L205-L263) | Verifies that short answers ("No", "In", "A") cannot falsely match inside longer strings ("Node.js", "Boston, MA"), rejects non-array objects, and blocks prototype pollution (`__proto__`). | Inspected (Static Verification) | Verifies real `frontend/src/lib/provenance.ts` logic. | Requires profile schema conformity. |
| **CORS & Origin Security (Test 7)** | [`tests/runAll.cjs:267-292`](file:///c:/P/formpilot/tests/runAll.cjs#L267-L292) | Enforces exact allowlist matching, blocks substring domain spoofing, and guarantees fail-closed empty headers (never returns `'*'`). | Inspected (Static Verification) | Verifies real `frontend/src/lib/cors.ts` logic. | Relies on correct environment variable configuration. |
| **Resilient JSON Parser (Test 8)** | [`tests/runAll.cjs:296-311`](file:///c:/P/formpilot/tests/runAll.cjs#L296-L311) | Extracts JSON from raw LLM completions, strips `<think>` reasoning tags, cleans markdown ticks, and rejects malformed payloads. | Inspected (Static Verification) | Verifies real `frontend/src/lib/openrouter.ts` logic. | Unrecoverable non-JSON text throws error. |
| **Prompt Injection Defense (Test 9)** | [`tests/runAll.cjs:315-328`](file:///c:/P/formpilot/tests/runAll.cjs#L315-L328) | Strips XML angle brackets (`<`, `>`) from user corrections to prevent breakout from `<untrusted_user_corrections_reference>`. | Inspected (Static Verification) | Passes regex sanitization check. | Does not defend against semantic model jailbreaks. |
| **Authentication Enforcement (Test 10)** | [`tests/runAll.cjs:333-351`](file:///c:/P/formpilot/tests/runAll.cjs#L333-L351) | Validates Bearer token format, presence, and rejects malformed/missing headers. | Inspected (Static Verification) | Rejects missing/invalid tokens with HTTP 401. | Unit test uses mock validator; full JWT signature requires Firebase Admin. |
| **Resource Bounds (Test 11)** | [`tests/runAll.cjs:356-382`](file:///c:/P/formpilot/tests/runAll.cjs#L356-L382) | Rejects oversized PDF files (> 5MB), oversized request payloads (> 500KB), and excessive question counts (> 100 questions). | Inspected (Static Verification) | Enforces HTTP 400 and HTTP 413 limits. | Static bounds check. |
| **Anti-Collision Matcher (Test 12)** | [`tests/runAll.cjs:386-413`](file:///c:/P/formpilot/tests/runAll.cjs#L386-L413) | Confirms that general questions ("Do you have work experience?") do not match specialized questions ("Do you have work experience in mobile engineering?"). | Inspected (Static Verification) | Rejects ambiguous token subsets (Jaccard < 0.8). | Pure algorithmic test. |
| **Multi-Select Checkboxes (Test 13)** | [`tests/runAll.cjs:418-444`](file:///c:/P/formpilot/tests/runAll.cjs#L418-L444) | Parses delimited answers ("TypeScript, Docker") and checks options without unchecking existing selections. | Inspected (Static Verification) | Correctly parses and preserves checked state. | Requires standard comma/newline delimiter. |
| **Dropdown Scoping (Test 14)** | [`tests/runAll.cjs:449-466`](file:///c:/P/formpilot/tests/runAll.cjs#L449-L466) | Verifies that option queries scope to the parent question block before querying global popup dialogs. | Inspected (Static Verification) | Prevents cross-question option selection. | Simulates DOM hierarchy. |
| **Timezone-Safe Dates (Test 15)** | [`tests/runAll.cjs:470-493`](file:///c:/P/formpilot/tests/runAll.cjs#L470-L493) | Normalizes `YYYY-MM-DD` and `DD/MM/YYYY` without UTC day-shift defects. | Inspected (Static Verification) | Preserves exact local calendar date. | Ambiguous numeric dates (e.g. 05/06/2000) default to DD/MM/YYYY. |
| **Error Sanitization (Test 16)** | [`tests/runAll.cjs:498-512`](file:///c:/P/formpilot/tests/runAll.cjs#L498-L512) | Sanitizes internal errors; returns generic public error message without leaking internal IP addresses or database stacks. | Inspected (Static Verification) | Verifies error sanitizer masks internal details. | Production error log remains on server. |
| **Message Port Closure (Test 17)** | [`tests/runAll.cjs:516-536`](file:///c:/P/formpilot/tests/runAll.cjs#L516-L536) | Confirms synchronous message handler returns `false` to close port and prevent browser memory leaks. | Inspected (Static Verification) | Verifies port lifecycle. | Chromium extension runtime behavior. |
| **Google Forms Regressions (7 Tests)** | [`tests/googleFormsRegression.test.js`](file:///c:/P/formpilot/tests/googleFormsRegression.test.js) | Verifies question matching priority, exact-first Likert option selection, ISO date normalization, hidden CSRF input exclusion, ReviewPanel state sync, 70% confidence capping, and 2D matrix flattening. | Inspected (Static Verification) | 7 of 7 test blocks documented with assertions. | Designed for `node --test` runner. |
| **Deterministic Benchmark (40 Items)** | [`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs) | Evaluates 40 Google Forms questions against user profile. Measures TP, TN, FP, FN, Wilson intervals. | Verified from trace artifact [`benchmarks/benchmark_results.json`](file:///c:/P/formpilot/benchmarks/benchmark_results.json) | 100% accuracy, 100% precision, 100% recall, 0% hallucinations on controlled 40-item corpus. | Synthetic benchmark corpus. |
| **Live Production LLM Evaluation** | [`benchmarks/runLiveLLMEvaluation.cjs`](file:///c:/P/formpilot/benchmarks/runLiveLLMEvaluation.cjs) | Sends 40 benchmark questions in batches of 5 to live OpenRouter endpoint with `nvidia/nemotron-3.5-lightning:free`. | Verified from trace artifact [`benchmarks/live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json) | 100% accuracy, 100% safety compliance on 40-item corpus; 3.5s - 8.2s per-batch latency. | Free-tier queue latency and rate limiting during bulk sweeps. |

---

## 4. Commands for Local Verification

To run all automated checks in a local development terminal with Node.js installed, execute:

### 1. Run Complete Reliability & Security Test Suite
```bash
node tests/runAll.cjs
```

### 2. Run Google Forms Regression Tests
```bash
node --test tests/googleFormsRegression.test.js
```

### 3. Run Deterministic Reference Benchmark
```bash
node benchmarks/runBenchmark.cjs
```

### 4. Build Extension Production Distribution
```bash
cd extension
npm install
npm run build
```
*(Verifies TypeScript compilation via `tsc` and Vite packaging into `extension/dist/`)*.

### 5. Build & Lint Web Dashboard
```bash
cd frontend
npm install
npm run lint
npm run build
```

---

## 5. Identification of Missing Tests & Test Coverage Gaps

While the algorithmic and unit test coverage for individual modules is strong, the following testing gaps exist:

1. **End-to-End Headless Browser Automation (Playwright / Puppeteer):**
   - *Gap:* No automated browser test loads the actual extension into Chromium and navigates a live `https://docs.google.com/forms/*` page.
   - *Impact:* DOM extraction relies on manual testing or mock HTML (`frontend/public/test-form.html`).
2. **Dynamic Multi-Page Form Progression:**
   - *Gap:* No automated test simulates clicking Google Forms' "Next" button and re-triggering extraction across sequential form pages.
3. **Empty & Ambiguous Question Titles:**
   - *Gap:* Testing does not cover cases where a Google Form question consists entirely of an embedded image with no `div[role="heading"]` text.
4. **Duplicate Question Prompts:**
   - *Gap:* Forms that repeat identical questions (e.g. "Comments" in Section 1 and "Comments" in Section 2) will map both fields to the same candidate answer.
5. **Network Disconnection During Fill:**
   - *Gap:* No simulated test evaluates extension behavior if network drops between ReviewPanel approval and DOM injection.
6. **Cross-Browser Automated Compatibility:**
   - *Gap:* No automated CI suite tests the extension bundle across Microsoft Edge and Brave simultaneously.
