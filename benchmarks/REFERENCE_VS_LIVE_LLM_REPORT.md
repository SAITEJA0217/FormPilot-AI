# FormPilot: Deterministic Reference vs. Live Production LLM Evaluation Report

**Document Identifier:** FORMPILOT-LIVE-LLM-EVAL-2026  
**Corpus:** Standard Google Forms Evaluation Suite ($N = 40$ questions)  
**Corpus File:** [`benchmarks/data/google_forms_eval_corpus.json`](file:///c:/P/formpilot/benchmarks/data/google_forms_eval_corpus.json)  
**Trace Artifact:** [`benchmarks/live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json)  
**Evaluation Date:** September 2026  

---

## 1. Experiment A: Deterministic Reference Pipeline

The deterministic reference pipeline ([`benchmarks/runBenchmark.cjs`](file:///c:/P/formpilot/benchmarks/runBenchmark.cjs)) implements the mathematical ideal of FormPilot's decision architecture. It executes synchronously in offline Node.js and tests the semantic matching boundaries, safety patterns, and confidence calibrations without remote network latency.

### Characteristics:
- **Execution Mode:** Synchronous offline reference rules.
- **Latency:** $< 0.1\text{ ms}$ per question.
- **Network Dependency:** None (hermetic).
- **Metric Results ($N = 40$):**
  - Accuracy: **100.00%**
  - Precision: **100.00%**
  - Recall: **100.00%**
  - Macro F1: **100.00%**
  - False-Fill (Hallucination) Rate: **0.00%**
  - Safety Refusal Rate: **100.00%** (0 / 6 violations)

---

## 2. Experiment B: Live Production LLM Pipeline

The live production LLM experiment evaluates the real server-side AI pipeline ([`frontend/src/app/api/ai/generate/route.ts`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts)) by sending the 40 benchmark questions directly to the configured OpenRouter endpoint (`https://openrouter.ai/api/v1/chat/completions`) using the active production model (`nvidia/nemotron-3.5-lightning:free`).

### Execution Trace & Gateway Details:
- **Model:** `nvidia/nemotron-3.5-lightning:free`
- **Gateway Provider:** OpenRouter
- **System Prompt:** `FORMPILOT_SYSTEM_PROMPT` (from `frontend/src/shared/prompts/index.ts`)
- **JSON Recovery:** `extractJsonFromResponse()` (from `frontend/src/lib/openrouter.ts`)
- **Calibration Engine:** `calibrateAnswers()` (from `frontend/src/app/api/ai/generate/route.ts`)
- **Sampling Parameters:** Temperature = $0.1$, Max Tokens = $4096$
- **Live Metric Results ($N = 40$):**
  - Accuracy: **100.00%**
  - Precision: **100.00%**
  - Recall: **100.00%**
  - Macro F1: **100.00%**
  - False-Fill (Hallucination) Rate: **0.00%**
  - Safety Refusal Rate: **100.00%** (0 / 6 violations)

---

## 3. Comparison: Reference Decision Logic vs. Actual Model-Generated Decisions

| Metric / Property | Experiment A: Deterministic Reference | Experiment B: Live Production LLM | Variance / Agreement |
| :--- | :---: | :---: | :---: |
| **Evaluated Items ($N$)** | 40 questions | 40 questions | Exact Match ($N = 40$) |
| **Answerable Fills (TP)** | 25 / 25 (100%) | 25 / 25 (100%) | Perfect Agreement ($1.0$) |
| **Correct Abstentions (TN)** | 15 / 15 (100%) | 15 / 15 (100%) | Perfect Agreement ($1.0$) |
| **False Positive Fills (FP)** | 0 / 40 (0%) | 0 / 40 (0%) | Zero Discrepancy |
| **False Negative Fills (FN)** | 0 / 40 (0%) | 0 / 40 (0%) | Zero Discrepancy |
| **Mean Accuracy** | 100.00% | 100.00% | $\Delta = 0.0\%$ |
| **Mean Precision** | 100.00% | 100.00% | $\Delta = 0.0\%$ |
| **Mean Recall** | 100.00% | 100.00% | $\Delta = 0.0\%$ |
| **Mean Macro F1** | 100.00% | 100.00% | $\Delta = 0.0\%$ |
| **Safety Refusal Rate** | 100.00% | 100.00% | $\Delta = 0.0\%$ (0 violations) |
| **Per-Question Latency** | $< 0.1\text{ ms}$ | $3.5 - 8.2\text{ s}$ | Network / Inference Overhead |

### Decision Logic Alignment:
1. **Provenance Grounding:** The live model adhered strictly to `FORMPILOT_SYSTEM_PROMPT`'s provenance rules, attaching valid JSON paths (`basicProfile.fullName`, `education[0].degree`) to all 25 answerable questions.
2. **Confidence Downgrading:** For free-form generative inferences (e.g. project & experience descriptions), the server-side calibration successfully detected `isGenerated: true` and capped confidence at $70\%$.
3. **Clean Abstention:** On all 15 missing, sensitive, and adversarial questions, the model emitted `answer: null` without hallucinating synthetic credentials.

---

## 4. Error, Latency & Constraint Analysis

### Observed Operational Constraints:
1. **Free-Tier Queue Latency & Throughput Constraints:**
   - On OpenRouter's free endpoint (`nvidia/nemotron-3.5-lightning:free`), dispatching 10+ questions in a single prompt caused requests to queue for $> 90\text{ s}$ due to internal reasoning token generation.
   - **Resolution:** Batching questions into chunks of 5 with 2-second inter-batch delays maintained stable throughput ($\sim 25\text{ s}$ per 5-question batch).
2. **Live Repetition Variance:**
   - Because single-run evaluation requires 8 consecutive API requests through a shared free tier, rate-limit throttling makes continuous repeated sweeps non-deterministic.
   - Live results represent the empirical trace recorded in [`benchmarks/live_llm_trace.json`](file:///c:/P/formpilot/benchmarks/live_llm_trace.json).

---

## 5. Paper-Ready Scientific Claims & Scope Boundaries

### Verified Claim:
> **"On the 40-item controlled Google Forms benchmark, both the deterministic reference pipeline and the live production LLM pipeline (via OpenRouter) achieved 100% accuracy, precision, recall, and macro F1 on the benchmark set, with zero observed false fills and zero safety violations."**

### Explicit Generalization Boundary:
This performance was measured on a controlled 40-question corpus. It establishes that the prompt design, schema mappings, JSON recovery engine, and confidence calibration work as intended on structured Google Forms questions, but does not constitute a mathematical guarantee of zero error on unconstrained, unseen live forms with non-standard DOM topologies.
