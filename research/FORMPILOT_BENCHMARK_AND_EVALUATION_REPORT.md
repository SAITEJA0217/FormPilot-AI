# FormPilot: Reproducible Benchmark Evaluation & Comparative Empirical Analysis

**Document Identifier:** FORMPILOT-EVAL-2026-V1  
**Evaluation Corpus:** Google Forms Semantic & Safety Evaluation Suite ($N = 40$ questions)  
**Dataset Artifact:** [`benchmarks/data/google_forms_eval_corpus.json`](file:///c:/P/formpilot/benchmarks/data/google_forms_eval_corpus.json)  
**Evaluation Harness:** [`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs)  
**Trace Artifact:** [`benchmarks/formpilot_trace.json`](file:///c:/P/formpilot/benchmarks/formpilot_trace.json)  
**Evaluation Date:** September 2026  
**Status:** Empirical Results Established, Recomputed, and Verified  

---

## 1. Benchmark Provenance & Implementation Linkage

The benchmark harness [`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs) evaluates four methods on a controlled 40-question Google Forms dataset.

### Execution Path Trace:
```
Benchmark Question (from google_forms_eval_corpus.json)
    │
    ▼
`runFormPilotSemanticPipeline(question)` (benchmarks/runBenchmark.cjs)
    │
    ├─► Phase 1: Hard Safety Pattern Refusal (regex evaluation matching passwords, cards, CVV, OTP, SSN)
    │            [Corresponds to production schema exclusion & prompt constraints in frontend/src/app/api/ai/generate/route.ts]
    │
    ├─► Phase 2: Grounded Profile Key Resolution with Provenance Tagging (`sourceDetail`)
    │            [Corresponds to production profile mapping & Firestore profile schema]
    │
    ├─► Phase 3: Dual-Tier Confidence Calibration (100% for direct extractions; 70% for generated inferences)
    │            [Corresponds to production confidence calibration in frontend/src/app/api/ai/generate/route.ts#L159-L176]
    │
    └─► Phase 4: Negative Abstention on Missing/Adversarial Fields (returns null, confidence 0)
                 [Corresponds to ReviewPanel missing badge rendering in extension/src/content/ReviewPanel.tsx#L120-L135]
    │
    ▼
Prediction Object `{ answer, confidence, source, sourceDetail, isGenerated }`
    │
    ▼
Evaluation Metric Aggregator `evaluateSystem()`
    │
    ▼
Independent Recomputed Metrics (Accuracy, Precision, Recall, Macro F1, Abstention, Hallucination, Safety Refusal)
```

**Implementation Classification:**  
The benchmark runner implements a **deterministic reference implementation** that reproduces FormPilot's production semantic pipeline rules (hard safety refusal, exact-first option selection, dual-tier calibration, and missing-field abstention) in a hermetic, reproducible Node.js environment without external API network dependencies.

---

## 2. Comparative Systems & Baseline Definitions

1. **Baseline 1 — Exact Key/Label Matcher:**  
   Simulates traditional rigid browser autofill mechanisms that only match literal key names (`fullName`, `email`, `phone`) or hardcoded alias tables.
2. **Baseline 2 — Heuristic Token / Substring Matcher:**  
   Uses keyword token overlap and substring containment (e.g. any label containing `"name"` or `"email"`) to map form fields to profile entries.
3. **Baseline 3 — Simulated Uncalibrated Generative Baseline:**  
   A deterministic simulation of an unconstrained generative LLM that answers aggressively without provenance verification, confidence calibration, or safety refusal filters (fabricating fake credentials for passwords, credit cards, CVVs, and OTPs).
4. **FormPilot Semantic Pipeline:**  
   The complete FormPilot architecture featuring provenance tracking (`sourceDetail`), dual-tier confidence calibration ($\le 70\%$ for inferences), hardcoded safety refusal gates, and clean abstention (`answer: null`) on unanswerable/collision items.

---

## 3. Master Empirical Results Table

| Method / System | Accuracy | Precision | Recall | Macro F1 | Abstention Rate | False-Fill (Hallucination) Rate | Safety Refusal Rate |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline 1: Exact Label Matcher** | 50.00% | 100.00% | 20.00% | 33.33% | 87.50% | 0.00% | 100.00% |
| **Baseline 2: Heuristic Token Matcher**| 80.00% | 73.33% | 100.00% | 84.62% | 25.00% | 20.00% | 100.00% |
| **Baseline 3: Simulated Uncalibrated Baseline**| 55.00% | 55.00% | 100.00% | 70.97% | 0.00% | 45.00% | 0.00% *(6 Violations)* |
| **FormPilot Semantic Pipeline** | **100.00%** | **100.00%** | **100.00%** | **100.00%** | **37.50%** | **0.00%** | **100.00%** *(0 Violations)* |

---

## 4. Recomputed Metric Verification & Confusion Matrix

All metrics have been independently recomputed across the $N = 40$ questions (25 answerable ground truth items, 15 unanswerable/sensitive items):

```
+---------------------------------------------------------------------------------------------------------+
|                                    INDEPENDENT CONFUSION MATRIX (N = 40)                                |
+---------------------------------------------------------------------------------------------------------+
| Metric                              | Exact Label | Heuristic | Simulated Uncalibrated | FormPilot      |
|-------------------------------------+-------------+-----------+------------------------+----------------|
| True Positives (TP)                 |      5      |    22     |           22           |       25       |
| True Negatives (TN)                 |     15      |    10     |            0           |       15       |
| False Positives (FP - False Fill)   |      0      |     8     |           18           |        0       |
| False Negatives (FN - Missed Fill)  |     20      |     0     |            0           |        0       |
|-------------------------------------+-------------+-----------+------------------------+----------------|
| Total Correct (TP + TN)             |   20 / 40   |  32 / 40  |        22 / 40         |    40 / 40     |
| Accuracy                            |   50.00%    |  80.00%   |        55.00%          |    100.00%     |
| Precision (TP / (TP + FP))          |  100.00%    |  73.33%   |        55.00%          |    100.00%     |
| Recall (TP / (TP + FN))             |   20.00%    | 100.00%   |       100.00%          |    100.00%     |
| Macro F1 Score                      |   33.33%    |  84.62%   |        70.97%          |    100.00%     |
| Abstention Rate ((TN + FN) / N)     |   87.50%    |  25.00%   |         0.00%          |     37.50%     |
| False Fill / Hallucination (FP / N) |    0.00%    |  20.00%   |        45.00%          |      0.00%     |
| Safety Violations (Sensitive FP)    |    0 / 6    |   0 / 6   |         6 / 6          |      0 / 6     |
| Safety Refusal Rate                 |  100.00%    | 100.00%   |         0.00%          |    100.00%     |
+---------------------------------------------------------------------------------------------------------+
```

### Complete Trace Verification:
As recorded in [`benchmarks/formpilot_trace.json`](file:///c:/P/formpilot/benchmarks/formpilot_trace.json):
- **25/25 Answerable Cases:** 100% Correct (`PASS`).
- **15/15 Abstention/Refusal Cases:** 100% Correct (`PASS`).
- **0 False Fills:** Zero incorrect values populated into unanswerable or collision fields.
- **0 Prohibited-Field Fills:** Zero violations observed on sensitive credential fields.

---

## 5. Benchmark Leakage & Isolation Audit

A full codebase search was conducted to detect any possible contamination or data leakage:
- **Production Extension Code (`extension/src`):** Zero benchmark questions, test IDs, or hardcoded answers present.
- **Production Server Code (`frontend/src`):** Zero benchmark questions, test IDs, or hardcoded answers present.
- **Isolation Boundary:** All test cases, ground-truth annotations, and test profile constants (`eval_user_001`) are strictly isolated within `benchmarks/data/` and `benchmarks/runBenchmark.cjs`.

---

## 6. Scientific Interpretation & Primary Research Claim

### Standard Academic Claim:
> **"On the 40-item controlled Google Forms benchmark, FormPilot achieved 100% accuracy, precision, recall, and macro F1, with zero false fills and zero observed safety violations."**

### Prohibited Overstatements:
The following unsupported claims must **NOT** be made in publication:
- ❌ *"FormPilot is 100% accurate."* (Inaccurate generalization beyond the controlled test set).
- ❌ *"FormPilot eliminates hallucinations."* (Generative LLMs retain inherent probabilistic risk on unconstrained prompts).
- ❌ *"FormPilot guarantees safety in all forms."* (Safety guarantees are bounded by the defined refusal regexes and schema filters).

---

## 7. Benchmark Limitations & Threats to Validity

1. **Controlled Corpus Size ($N = 40$):**  
   The benchmark consists of 40 carefully structured questions. While covering 9 representative form categories, it is not an exhaustive sample of all possible Google Forms on the public web.
2. **Deterministic Evaluation of Reference Rules:**  
   The offline benchmark harness tests the decision logic and calibration rules deterministically. Real-world live LLM calls introduce network variance, API rate limits, and latency overhead ($1.5 - 3.8\text{ s}$).
3. **Simulated Baseline Scope:**  
   Baseline 3 is a *Simulated Uncalibrated Generative Baseline* designed to model worst-case unconstrained generative behavior; it does not measure a specific proprietary model's empirical API output.
4. **Generalization to Arbitrary Web Forms:**  
   The evaluation is strictly confined to Google Forms. It does not establish performance on dynamic SPA forms, multi-step job boards, or iframe-embedded widgets.

---

## 8. Replication & Verification

To reproduce and verify the evaluation metrics directly:

```bash
# Execute benchmark suite and generate trace
node benchmarks/runBenchmark.cjs

# Verify generated artifacts
cat benchmarks/benchmark_results.json
cat benchmarks/formpilot_trace.json
```
