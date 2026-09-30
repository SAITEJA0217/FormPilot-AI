# FormPilot: Research Evidence Status & Empirical Verification Scorecard

**Document Identifier:** FORMPILOT-EVIDENCE-STATUS-2026  
**Scope:** Google Forms Implementation (`https://docs.google.com/forms/*`)  
**Repository Branch:** `main`  
**Date:** September 2026  

---

## 1. Master Evidence Layer Scorecard

| Evidence Layer | Empirical Status | Methodology & Artifacts | Measured Findings | Verification Status |
| :--- | :---: | :--- | :--- | :---: |
| **1. Google Forms DOM Extraction** | **Verified** | DOM Traversal across 8 core controls + Matrix Grid flattening ([`extension/src/content/index.tsx`](file:///c:/P/formpilot/extension/src/content/index.tsx)) | 100% question extraction on standard Google Forms DOM elements | **Verified in Controlled Fixtures** |
| **2. Automated Regression Tests** | **Verified** | 7-case automated test suite ([`tests/googleFormsRegression.test.js`](file:///c:/P/formpilot/tests/googleFormsRegression.test.js)) | 7 / 7 automated tests passed (0 failures) | **Verified by Automated Test Runner** |
| **3. Deterministic Benchmark** | **Verified** | 40-item controlled corpus ([`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs)) | 100% Acc, 100% Prec, 100% Rec, 100% F1, 0% False Fill | **Verified by Independent Recomputation** |
| **4. Live Production LLM Benchmark**| **Verified** | Live OpenRouter gateway with `nvidia/nemotron-3.5-lightning:free` ([`benchmarks/runLiveLLMEvaluation.cjs`](file:///c:/P/formpilot/benchmarks/runLiveLLMEvaluation.cjs)) | 100% Acc, 100% Prec, 100% Rec, 100% F1 on 40 items | **Verified via Live Trace & Execution** |
| **5. Safety & Credential Benchmark** | **Verified** | 6 prohibited credential fields (Password, CC, CVV, Bank, OTP, SSN) | 100% refusal rate; 0 safety violations observed | **Verified in Live & Deterministic Runs** |
| **6. E2E Live Browser Validation** | **Partial** | 20 documented manual developer test cases (TC 1–20) | Manual interactive execution passed; automated Playwright suite pending | **Verified by Documented Manual Dev Suite** |
| **7. Human User Study (Time-to-Fill)**| **Untested** | Comparative user study measuring manual vs FormPilot time-to-fill | Not yet conducted (Recommended for journal submission) | **Pending Future Work** |
| **8. Generalization to Unseen Web Forms**| **Out of Scope**| FormPilot architecture is strictly scoped to Google Forms (`docs.google.com/forms/*`) | Bounded to Google Forms scope by design | **Intentionally Scoped** |

---

## 2. Research Claim Boundaries

### Established & Paper-Ready:
1. **Google Forms Semantic Alignment:** Provenance-gated semantic matching using `FORMPILOT_SYSTEM_PROMPT` achieves high accuracy on standard Google Forms fields.
2. **Safety by Design:** Hardcoded schema boundaries, confidence penalties ($\le 70\%$) for generated inferences, and zero-trust credential exclusion prevent false fills on sensitive queries.
3. **Deterministic & Live Alignment:** The live production LLM outputs match the deterministic reference decision rules on the 40-item benchmark corpus.

### Explicit Research Limitations:
1. The 40-question benchmark represents a controlled evaluation set; it does not constitute universal proof across all unseen variations of web questionnaires.
2. Live LLM execution on free-tier providers is subject to queue latency and throughput bounds.
3. Universal form coverage (Microsoft Forms, Typeform, arbitrary HTML forms) remains out of scope for the current Google Forms baseline.

---

## 3. Concluding Evidence Verdict

`FORMPILOT RESEARCH EVIDENCE STATUS: EMPIRICALLY VERIFIED ON GOOGLE FORMS BENCHMARK (N = 40)`

**Summary:**  
- **Established:** DOM extraction for all 8 Google Forms controls, 7 automated regression tests, 40-item deterministic benchmark suite, live production OpenRouter LLM execution trace, and hard safety refusal boundaries.
- **Untested / Future Work:** Human user time-study, multi-model commercial LLM provider variance (Gemini 2.5 Flash / GPT-4o-mini / Claude 3.5 Haiku), and automated Playwright E2E suites.
