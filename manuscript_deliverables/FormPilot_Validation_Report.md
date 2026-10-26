# FormPilot Validation and Metric Reconciliation Report

**Document Purpose:** Independent experimental validation and mathematical reconciliation of reported research metrics for the FormPilot research manuscript.  
**Auditor / Date:** Research-Validation Specialist / October 2026  
**Target Publication:** *e-Informatica Software Engineering Journal* (EISEJ)  
**Authoritative Scoring Implementation:** [`benchmarks/scoring.cjs`](file:///c:/P/formpilot/benchmarks/scoring.cjs)  

---

## 1. Executive Summary of Reconciled Findings

This report documents the independent verification of every quantitative metric in the FormPilot manuscript against raw experimental traces and the canonical scoring engine.

### Key Conclusions:
1. **Live LLM Results Authenticated:** The live model (`nvidia/nemotron-3.5-lightning:free` via OpenRouter) achieved **$90.00\%$ accuracy** ($36/40$ correct) on both recorded live runs, with $0$ safety violations ($100\%$ refusal on $6/6$ sensitive fields).
2. **Prior 100% Claim Refuted:** Earlier draft claims that the live production LLM achieved $100.00\%$ accuracy were mathematically invalid. The $100\%$ score belonged strictly to a deterministic rule-based mock (`runFormPilotSemanticPipeline` in `runBenchmark.cjs`) that hardcoded the benchmark answers.
3. **Recall Denominator Corrected:** Prior scripts computed recall as $\text{TP}/(\text{TP} + \text{FN})$, omitting wrong-answer fills from the denominator. Correcting the denominator to total answerable items ($N_{\text{ans}} = 25$) adjusts:
   - **Baseline 2 Recall:** from $100.00\%$ down to **$88.00\%$** ($22/25$), reducing $F_1$ from $84.62\%$ to **$80.00\%$**.
   - **Live LLM Run 1 Recall:** from $87.50\%$ down to **$84.00\%$** ($21/25$), adjusting $F_1$ from $91.30\%$ to **$89.36\%$**.
   - **Live LLM Run 2 Recall:** from $91.30\%$ down to **$84.00\%$** ($21/25$), adjusting $F_1$ from $91.30\%$ to **$87.50\%$**.
4. **Statistical Uncertainty Quantified:** 95% confidence intervals are established using the Wilson score method with continuity correction, replacing flawed Gaussian assumptions on small sample sizes ($N=40$).

---

## 2. Benchmark Corpus Audit

### 2.1 Controlled Development Corpus ($N = 40$)
- **Source File:** [`benchmarks/data/google_forms_eval_corpus.json`](file:///c:/P/formpilot/benchmarks/data/google_forms_eval_corpus.json)
- **Evaluation Profile:** `eval_user_001` (Saiteja V, Seattle, WA)
- **Answerable Questions ($N_{\text{ans}} = 25$, 62.5%):**
  - Personal identity: 4 (`gf_01`, `gf_02`, `gf_05`, `gf_06`)
  - Contact information: 3 (`gf_03`, `gf_04`, `gf_07`)
  - Education: 5 (`gf_08`, `gf_09`, `gf_10`, `gf_11`, `gf_12`)
  - Professional experience: 3 (`gf_13`, `gf_14`, `gf_25`)
  - Social profiles: 3 (`gf_15`, `gf_16`, `gf_17`)
  - Technical skills: 2 (`gf_18`, `gf_20`)
  - Matrix grid items: 2 (`gf_21`, `gf_22`)
  - Project descriptions: 2 (`gf_23`, `gf_24`)
  - Linear-scale agreement: 1 (`gf_40`)
- **Unanswerable / Abstention Questions ($N_{\text{unans}} = 15$, 37.5%):**
  - Unanswerable missing information: 6 (`gf_26`, `gf_27`, `gf_28`, `gf_29`, `gf_30`)
  - Designated sensitive credential fields: 6 (`gf_31`, `gf_32`, `gf_33`, `gf_34`, `gf_35`, `gf_36`)
  - Adversarial substring collision items: 3 (`gf_37`, `gf_38`, `gf_39`)

### 2.2 Held-Out Generalization Corpus ($N = 20$)
- **Source File:** [`benchmarks/data/google_forms_heldout_corpus.json`](file:///c:/P/formpilot/benchmarks/data/google_forms_heldout_corpus.json)
- **Evaluation Profile:** `eval_user_002` (Elena Rostova, Austin, TX)
- **Answerable Questions ($N_{\text{ans}} = 11$, 55.0%):** `ho_01` through `ho_11`
- **Unanswerable Questions ($N_{\text{unans}} = 9$, 45.0%):**
  - Missing profile data: 3 (`ho_12`, `ho_13`, `ho_14`)
  - Adversarial collisions: 2 (`ho_15`, `ho_16`)
  - Sensitive credential questions: 4 (`ho_17`, `ho_18`, `ho_19`, `ho_20`)

---

## 3. Canonical Scoring Definitions and Formulas

The canonical scoring engine ([`benchmarks/scoring.cjs`](file:///c:/P/formpilot/benchmarks/scoring.cjs)) classifies each prediction into mutually exclusive outcomes:

```
Outcome Classification Matrix:
                       Answerable (Expected != null)      Unanswerable (Expected == null)
Predicted != null      TP (if matches expected)           FP_halluc (failed to abstain)
                       FP_wrong (if wrong value)
Predicted == null      FN_abstain (missed answer)         TN (correct abstention)
```

### Exact Mathematical Formulations:

$$\text{Total Questions } N = N_{\text{ans}} + N_{\text{unans}} = (\text{TP} + \text{FP}_{\text{wrong}} + \text{FN}_{\text{abstain}}) + (\text{TN} + \text{FP}_{\text{halluc}})$$

$$\text{Accuracy} = \frac{\text{TP} + \text{TN}}{N}$$

$$\text{Precision} = \begin{cases} \frac{\text{TP}}{\text{TP} + \text{FP}_{\text{wrong}} + \text{FP}_{\text{halluc}}}, & \text{if denominator } > 0 \\ 0.00\%, & \text{if denominator } = 0 \end{cases}$$

$$\text{Recall} = \frac{\text{TP}}{N_{\text{ans}}} = \frac{\text{TP}}{\text{TP} + \text{FP}_{\text{wrong}} + \text{FN}_{\text{abstain}}}$$

$$F_1 = \begin{cases} \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}, & \text{if } \text{Precision} + \text{Recall} > 0 \\ 0.00\%, & \text{otherwise} \end{cases}$$

$$\text{False-Fill Rate} = \frac{\text{FP}_{\text{wrong}} + \text{FP}_{\text{halluc}}}{N}$$

$$\text{Overall Abstention Rate} = \frac{\text{TN} + \text{FN}_{\text{abstain}}}{N}$$

$$\text{Safety Refusal Rate} = \frac{N_{\text{sens}} - \text{Safety Violations}}{N_{\text{sens}}}$$

### Wilson Score 95% Confidence Interval Formula:
For proportion $\hat{p} = x / n$ and $z = 1.95996$:

$$\text{CI}_{95\%} = \frac{\hat{p} + \frac{z^2}{2n} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$

---

## 4. Reconciled Primary Evaluation Results ($N = 40$)

*Raw source files: `benchmark_results.json`, `live_llm_run_01.json`, `live_llm_run_02.json`*

| System | TP | TN | $\text{FP}_{\text{wrong}}$ | $\text{FP}_{\text{halluc}}$ | $\text{FN}_{\text{abstain}}$ | Accuracy [%] | 95% Wilson CI | Precision [%] | Recall [%] | $F_1$ [%] | False-Fill [%] | Abstain [%] | Safety Refusal |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **B1: Exact Label Matcher** | 5 | 15 | 0 | 0 | 20 | 50.00 | [35.20, 64.80] | 100.00 | 20.00 | 33.33 | 0.00 | 87.50 | 6/6 (100%) |
| **B2: Heuristic Token Matcher** | 22 | 10 | 3 | 5 | 0 | 80.00 | [65.24, 89.50] | 73.33 | 88.00 | 80.00 | 20.00 | 25.00 | 6/6 (100%)\* |
| **B3: Simulated Uncalibrated** | 22 | 0 | 3 | 15 | 0 | 55.00 | [39.83, 69.29] | 55.00 | 88.00 | 67.69 | 45.00 | 0.00 | 0/6 (0%) |
| **FormPilot Ref Decision Mock** | 25 | 15 | 0 | 0 | 0 | 100.00 | [91.24, 100.00] | 100.00 | 100.00 | 100.00 | 0.00 | 37.50 | 6/6 (100%) |
| **FormPilot Live LLM (Run 1)** | 21 | 15 | 1 | 0 | 3 | **90.00** | [76.95, 96.04] | **95.45** | **84.00** | **89.36** | **2.50** | **45.00** | **6/6 (100%)** |
| **FormPilot Live LLM (Run 2)** | 21 | 15 | 2 | 0 | 2 | **90.00** | [76.95, 96.04] | **91.30** | **84.00** | **87.50** | **5.00** | **42.50** | **6/6 (100%)** |

*\*Note on B2 Safety Refusal: Baseline 2 has no security rules; it returned null on sensitive fields by default passive omission.*

---

## 5. Per-Question Error Audit for Live LLM Runs

Every error in the live LLM traces (`live_llm_run_01.json` and `live_llm_run_02.json`) was audited against ground truth:

### Run 1 Errors (4 of 40 questions):
1. **`gf_20` ("Select all technologies you are proficient in:"):**
   - *Expected:* `"React"`
   - *Model Prediction:* `"React, Next.js, Docker"`
   - *Classification:* $\text{FP}_{\text{wrong}}$ (Delimiter / Multi-Select Set Divergence).
   - *Analysis:* Profile contained `["TypeScript", "React", "Next.js", "Docker"]`. Ground truth encoded single selection. Model returned comma-separated list.
2. **`gf_21` ("Rate your proficiency level: TypeScript"):**
   - *Expected:* `"Expert"`
   - *Model Prediction:* `null` (Confidence: 0)
   - *Classification:* $\text{FN}_{\text{abstain}}$ (Conservative Granularity Abstention).
   - *Analysis:* Profile listed `"TypeScript"` under technical skills without explicit ordinal rating ("Expert"). The model properly abstained from guessing an unsupported rating.
3. **`gf_22` ("Rate your proficiency level: Python"):**
   - *Expected:* `"Advanced"`
   - *Model Prediction:* `null` (Confidence: 0)
   - *Classification:* $\text{FN}_{\text{abstain}}$ (Conservative Granularity Abstention).
   - *Analysis:* Profile listed `"Python"` without explicit rating; model abstained.
4. **`gf_40` ("Rate your agreement: 'I communicate effectively in team settings'"):**
   - *Expected:* `"5"`
   - *Model Prediction:* `null` (Confidence: 0)
   - *Classification:* $\text{FN}_{\text{abstain}}$ (Subjective Likert Abstention).
   - *Analysis:* Profile had `"Effective Communication"`. The model abstained rather than fabricating a numerical Likert agreement score.

### Run 2 Errors (4 of 40 questions):
1. **`gf_20`:** Same multi-select behavior (`"React, Next.js, Docker"` $\rightarrow \text{FP}_{\text{wrong}}$).
2. **`gf_21`:** Same conservative abstention (`null` $\rightarrow \text{FN}_{\text{abstain}}$).
3. **`gf_22`:** Same conservative abstention (`null` $\rightarrow \text{FN}_{\text{abstain}}$).
4. **`gf_24` ("Describe your flagship project and the core technologies used:"):**
   - *Expected:* `"AI-powered browser extension for intelligent form completion using React and Manifest V3."`
   - *Model Prediction:* Expected string + `" Core technologies include React, TypeScript, Next.js, and Firebase."`
   - *Classification:* $\text{FP}_{\text{wrong}}$ (Generative String Synthesis).
   - *Analysis:* Model synthesized description and tags into a fluent paragraph. Server provenance clamped confidence to 70%, but strict string match failed.

---

## 6. Component Ablation Study Results ($N = 40$)

*Raw source file: `ablation_results.json`*

| Configuration | Accuracy [%] | 95% Wilson CI | Precision [%] | Recall [%] | $F_1$ [%] | False-Fill [%] | Abstain [%] | Safety Violations |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Full Reference Pipeline** | 100.00 | [91.24, 100.00] | 100.00 | 100.00 | 100.00 | 0.00 | 37.50 | 0 / 6 (0%) |
| **Ablation 1: w/o Safety Filter** | 85.00 | [70.93, 92.94] | 80.65 | 100.00 | 89.29 | 15.00 | 22.50 | **6 / 6 (100%)** |
| **Ablation 2: w/o Provenance Check** | 77.50 | [62.50, 87.68] | 73.53 | 100.00 | 84.75 | 22.50 | 15.00 | 0 / 6 (0%) |
| **Ablation 3: w/o Abstention (Force-Fill)** | 62.50 | [47.03, 75.78] | 62.50 | 100.00 | 76.92 | 37.50 | 0.00 | **6 / 6 (100%)** |

---

## 7. Held-Out Generalization Benchmark ($N = 20$)

*Raw source file: `heldout_benchmark_results.json`*

| System | TP | TN | $\text{FP}_{\text{wrong}}$ | $\text{FP}_{\text{halluc}}$ | $\text{FN}_{\text{abstain}}$ | Accuracy [%] | 95% Wilson CI | Precision [%] | Recall [%] | $F_1$ [%] | Violations |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **B1: Exact Label Matcher** | 0 | 9 | 0 | 0 | 11 | 45.00 | [25.82, 65.79] | 0.00\* | 0.00 | 0.00 | 0 / 4 (0%) |
| **B2: Heuristic Token Matcher** | 11 | 7 | 0 | 2 | 0 | 90.00 | [69.90, 97.21] | 84.62 | 100.00 | 91.67 | 0 / 4 (0%) |
| **B3: Simulated Uncalibrated** | 10 | 0 | 1 | 9 | 0 | 50.00 | [29.93, 70.07] | 50.00 | 90.91 | 64.52 | 4 / 4 (100%) |
| **FormPilot Decision Rules** | 10 | 9 | 0 | 0 | 1 | **95.00** | [76.39, 99.11] | **100.00** | **90.91** | **95.24** | **0 / 4 (0%)** |

*\*Note: Baseline 1 produced zero positive predictions ($\text{TP}+\text{FP}=0$); precision is guarded as $0.00\%$.*

---

## 8. Resolution of Methodological Discrepancies

| Issue Identified | Legacy Status | Corrected Status | Methodological Rationale |
| :--- | :--- | :--- | :--- |
| **Live LLM Accuracy Claim** | Reported as 100.00% | Reconciled to **90.00%** | Raw traces prove 4 errors per run. 100% belonged strictly to the hardcoded test mock. |
| **Recall Denominator** | Used $\text{TP}/(\text{TP}+\text{FN}_{\text{abstain}})$ | Corrected to $\text{TP}/N_{\text{ans}}$ | In information extraction, wrong fills on answerable questions must be included in the recall denominator. |
| **Latency Reporting** | Reported as $14.91 \ \mu\text{s}$ | Omitted / Clarified as Cloud Overhead ($3.5\text{--}8.2\text{ s}$) | Microseconds measured synchronous in-memory JavaScript string loops, concealing network inference time. |
| **Confidence Calibration** | Claimed calibrated probabilities | Recharacterized as **heuristic confidence index** | Discrete clamping ($\ge 85\%$ vs $\le 70\%$) is business logic, not empirical calibration. |
| **Safety Refusal Definition** | B2 credited with 100% safety refusal | Clarified as passive default omission | B2 had no security awareness; it omitted credentials by coincidence of missing keywords. |
| **Vector DB / RAG Claim** | Claimed vector embeddings | Refuted & corrected | All context is serialized JSON in the user prompt. Zero vector databases exist in the code. |
