# FormPilot AI: Testing & Empirical Evaluation Report

> **Document:** `project-report-audit/TESTING_AND_EVALUATION.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Institution:** Malla Reddy University — Department of CSE-AIML  
> **Academic Level:** B.Tech Major Project Phase-I  
> **Auditor Status:** Software Testing Engineer / Academic Documentation Specialist  

---

## 1. Executive Testing Summary

FormPilot AI's verification architecture spans four distinct evaluation tiers:
1. **Production Reliability & Security Test Suite ([`tests/runAll.cjs`](file:///c:/P/formpilot/tests/runAll.cjs)):** 17 standalone integration and unit tests validating rate-limiting quotas, fail-closed database errors, provenance security, origin validation, bounds checking, and token parsing against real production TypeScript modules.
2. **Google Forms Regression Suite ([`tests/googleFormsRegression.test.js`](file:///c:/P/formpilot/tests/googleFormsRegression.test.js)):** 7 test blocks designed for the standard Node.js test runner (`node:test`) verifying question matching priorities, Likert inversion protection, ISO date normalization, hidden input CSRF filtering, state sync, 70% confidence capping, and 2D matrix flattening.
3. **Deterministic Reference Evaluation Benchmark ([`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs)):** A controlled 40-question Google Forms evaluation corpus measuring information extraction metrics against canonical ground truth.
4. **Live Production LLM Evaluation Harness ([`benchmarks/runLiveLLMEvaluation.cjs`](file:///c:/P/formpilot/benchmarks/runLiveLLMEvaluation.cjs)):** Live batching test runner evaluating OpenRouter API completions against the 40-question benchmark corpus.

---

## 2. Actual Terminal Execution Log

In accordance with strict auditor principles, execution was attempted directly in the sandboxed workspace terminal:

```powershell
Command: node -v
Working Directory: c:\P\formpilot
Observed Result:
node : The term 'node' is not recognized as the name of a cmdlet, function, script file, or operable program. 
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
Exit Code: 1
Status: CommandNotFoundException (Node.js binary not available on sandboxed execution PATH)
```

> **Auditor Verification Note:** Test outcomes are not fabricated. Because Node.js is not present on the default sandbox PATH, automated scripts could not be executed within this sandboxed session. However, all test files, logic, mock implementations, and previously executed execution traces ([`benchmarks/benchmark_results.json`](file:///c:/P/formpilot/benchmarks/benchmark_results.json) and [`benchmarks/live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json)) were inspected and verified statically.

---

## 3. Inventory of Tested Scenarios & Assertions

### 3.1 Production Reliability & Security Suite (`tests/runAll.cjs` — 17 Tests)
1. **Quota Enforcement:** Enforces distinct independent quotas for `generate` (1000/day), `parse-resume` (30/day), and `corrections` (200/day) against in-memory mock Firestore (`lines 106-143`).
2. **Fail-Closed Resilience:** Returns HTTP 503 when Firestore transaction throws a socket/connection error (`lines 148-155`).
3. **Sliding Window Expiry:** Resets request count to 1 after 24-hour duration elapses (`lines 160-177`).
4. **Concurrency Safety:** Simulates 5 parallel requests against a quota of 3; exactly 3 are allowed, 2 blocked (`lines 182-200`).
5. **Short Substring Defect Prevention:** Confirms answers "No", "In", "A" do NOT match inside "Node.js", "Python", or "Boston, MA" (`lines 205-242`).
6. **Object Value Rejection & Prototype Safety:** Rejects non-array objects from matching `[object Object]` and verifies `__proto__`, `constructor`, `prototype` return `undefined` (`lines 247-262`).
7. **CORS Allowlist Security:** Enforces exact origin equality; blocks substring attacks; fails closed without wildcard `'*'` (`lines 267-292`).
8. **Resilient JSON Recovery:** Extracts JSON from raw text, strips reasoning `<think>` tags, and handles markdown code blocks (`lines 296-311`).
9. **Prompt Injection Defense:** Strips angle brackets (`<`, `>`) from user corrections to prevent delimiter breakout (`lines 315-328`).
10. **Authentication Enforcement:** Validates Bearer token presence and format; rejects invalid headers with HTTP 401 (`lines 333-351`).
11. **Resource Bounds Validation:** Rejects PDFs > 5MB, payloads > 500KB, and questions > 100 (`lines 356-382`).
12. **Anti-Collision Question Matcher:** Verifies general questions do not match specialized subset questions (`lines 386-413`).
13. **Multi-Select Checkboxes:** Verifies delimited values check options without unchecking existing selections (`lines 418-444`).
14. **Dropdown Scoping:** Scopes option queries to question block before searching global popups (`lines 449-466`).
15. **Timezone-Safe Dates:** Normalizes `YYYY-MM-DD` and `DD/MM/YYYY` without UTC day-shift defects (`lines 470-493`).
16. **Error Sanitization:** Returns generic public error; prevents leaking database IP or stack traces (`lines 498-512`).
17. **Message Port Closure:** Verifies synchronous message handler returns `false` to prevent channel leaks (`lines 516-536`).

### 3.2 Google Forms Regression Suite (`tests/googleFormsRegression.test.js` — 7 Tests)
1. **Exact-Priority Matching:** "Name" resolves to "John Doe", never "Father's Name" (`lines 9-46`).
2. **Likert Inversion Protection:** "Strongly Agree" selects "Strongly Agree", never "Agree" (`lines 51-96`).
3. **ISO Date Normalization:** Preserves exact calendar date across slashes and dashes (`lines 101-132`).
4. **Hidden CSRF Input Exclusion:** Hidden inputs do not trigger `short_answer` classification (`lines 137-162`).
5. **State Synchronization:** ReviewPanel accepts fresh answers upon re-analysis (`lines 167-185`).
6. **Confidence Clamping:** Generative inferences capped at maximum 70% confidence (`lines 190-238`).
7. **Matrix Grid Flattening:** 2D grid flattens into distinct sub-questions with column options (`lines 243-261`).

---

## 4. Empirical Evaluation Metrics (Benchmark Traces)

The repository records two empirical evaluation runs evaluated on the 40-question controlled dataset ([`benchmarks/data/google_forms_eval_corpus.json`](file:///c:/P/formpilot/benchmarks/data/google_forms_eval_corpus.json)):

| Metric / Property | Experiment A: Deterministic Reference ([`benchmark_results.json`](file:///c:/P/formpilot/benchmarks/benchmark_results.json)) | Experiment B: Live Production LLM ([`live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json)) |
| :--- | :---: | :---: |
| **Evaluated Items ($N$)** | 40 questions | 40 questions |
| **Answerable Fills (TP)** | 25 / 25 (100.00%) | 25 / 25 (100.00%) |
| **Correct Abstentions (TN)** | 15 / 15 (100.00%) | 15 / 15 (100.00%) |
| **False Positive Fills (FP)** | 0 / 40 (0.00%) | 0 / 40 (0.00%) |
| **False Negative Fills (FN)** | 0 / 40 (0.00%) | 0 / 40 (0.00%) |
| **Mean Accuracy** | **100.00%** | **100.00%** |
| **Precision** | **100.00%** | **100.00%** |
| **Recall** | **100.00%** | **100.00%** |
| **Macro F1 Score** | **100.00%** | **100.00%** |
| **Safety Refusal Rate** | **100.00%** (0 / 6 violations) | **100.00%** (0 / 6 violations) |
| **Latency per Batch (5 Questions)**| $< 0.1\text{ ms}$ (Offline) | $3.5\text{ s} - 8.2\text{ s}$ (Live OpenRouter) |

> **Scientific Boundary Note for Academic Report:** This 100% score represents performance on a **controlled, synthetic 40-question benchmark corpus**. It proves the correctness of prompt construction, schema extraction, and provenance calibration on known patterns, but **must not be claimed as a guarantee of 100% accuracy on live, unconstrained, unseen internet forms**.

---

## 5. Local Reproduction Commands

To reproduce test and benchmark execution locally, run the following commands in PowerShell/Bash:

```bash
# 1. Run Complete 17-Test Reliability & Security Suite
node tests/runAll.cjs

# 2. Run Google Forms Regression Tests
node --test tests/googleFormsRegression.test.js

# 3. Run Deterministic Reference Benchmark
node benchmarks/runBenchmark.cjs

# 4. Verify Extension TypeScript Compilation & Build
cd extension
npm run build

# 5. Verify Frontend Next.js Build
cd ../frontend
npm run build
```

---

## 6. Identification of Missing Tests & Proposed Test Plan

| Testing Category | Current Status | Identified Gap | Proposed Phase-II Test Implementation |
| :--- | :---: | :--- | :--- |
| **End-to-End Browser Testing** | Missing | No Playwright/Puppeteer script automates navigating live Google Forms with unpacked extension loaded. | Implement Playwright test suite loading `extension/dist` via `--load-extension` flag. |
| **Multi-Page Pagination Continuity** | Missing | No automated test simulates Google Forms "Next" button click and state persistence. | Add test script verifying `chrome.storage.local` persistence across page transitions. |
| **Graphic Question Extraction** | Missing | Forms with image-only questions lacking `div[role="heading"]` text are untested. | Add mock HTML fixtures containing `<img alt="...">` question items. |
| **Cross-Browser CI Automation** | Missing | Only manual testing on Chrome, Edge, and Brave. | Set up GitHub Actions workflow executing Playwright across Chromium, Edge, and Brave. |
| **Network Interruption Resilience** | Missing | No test evaluates behavior if network drops between ReviewPanel approval and DOM injection. | Add fault-injection proxy test simulating socket termination during `POST /api/ai/generate`. |
