# FormPilot Manuscript Revision Report

**Document Title:** Manuscript Revision and Defect Remediation Report  
**Target Publication:** *e-Informatica Software Engineering Journal* (EISEJ)  
**Date:** October 2026  
**Auditor / Specialist:** Academic Research Editor & Verification Specialist  

---

## 1. Overview of Revision Objectives

This revision transforms the provisional draft into an empirically grounded, publication-ready research manuscript formatted strictly according to the official *e-Informatica Software Engineering Journal* 2026 guidelines (`einformatica.cls`).

All unverified claims, circular baseline representations, and mathematical denominator defects have been corrected against verified experimental traces and the canonical scoring engine ([`benchmarks/scoring.cjs`](file:///c:/P/formpilot/benchmarks/scoring.cjs)).

---

## 2. Itemized Change Log and Rationale

| # | Manuscript Section | Original Draft Content / Defect | Revised Content | Scientific & Methodological Rationale |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Title** | "FormPilot: Provenance-Aware, Review-Gated LLM Assistance for Semantic Form Filling in Google Forms" | **"FormPilot: Semantic Question Mapping and Provenance-Aware Automated Form Filling"** | Updated to the authoritative research title specified for journal submission. |
| **2** | **Abstract** | Unstructured narrative; claimed 100% live LLM accuracy on the development benchmark. | **Structured abstract** (`Context`, `Objective`, `Method`, `Results`, `Conclusions`). Reported verified live LLM accuracy (**90.00%**, $F_1 = 87.50\text{--}89.36\%$). | e-Informatica requires a structured abstract. 100% claim was empirically refuted by live run traces. |
| **3** | **Declarations** | Duplicate AI writing mentions; generic placeholders (`[NEEDS VERIFICATION...]`). | Removed duplicate declaration. Retained single official `\AIDeclaration` identifying ChatGPT for drafting and formatting assistance. Removed resolved placeholders. | Conforms to e-Informatica template guidelines; removes unprofessional draft markers. |
| **4** | **Project Guide** | Informal mention in acknowledgment without clear guidance on authorship. | Retained in formal Acknowledgment section; created explicit review item in `FormPilot_Author_Confirmation_Checklist.md`. | Adheres to COPE/ICMJE authorship ethics: guides must not be arbitrarily added or excluded without author confirmation. |
| **5** | **Baseline 2 Recall & $F_1$** | Reported Recall as 100.00% and $F_1$ as 84.62%. | Corrected Recall to **88.00%** ($22/25$) and $F_1$ to **80.00%**. | Prior code dropped 3 wrong-answer fills from the recall denominator. The canonical denominator is strictly $N_{\text{ans}} = 25$. |
| **6** | **Live LLM Results (Table 5 & 6)** | Claimed 100.00% live accuracy, 0 errors, 25 TP, 15 TN. | Reported genuine measured performance across two runs: **90.00% accuracy** ($36/40$), **84.00% recall** ($21/25$), **91.30–95.45% precision**, **87.50–89.36% $F_1$**. | Reconciled against raw run files `live_llm_run_01.json` and `live_llm_run_02.json`. |
| **7** | **Error Analysis** | Stated that live run produced zero errors. | Documented all 4 verified errors per run: `gf_20` (multi-select list), `gf_21` & `gf_22` (proficiency rating abstention), `gf_24` (generative synthesis), `gf_40` (Likert abstention). | Full transparency and scientific honesty regarding LLM failure modes. |
| **8** | **FormPilot Reference Pipeline** | Titled "FormPilot Semantic Pipeline", giving impression it was an independent baseline. | Labeled **"FormPilot Reference Decision Rules (Deterministic Mock)"**. | The function hardcodes benchmark strings; presenting it as an autonomous semantic baseline is scientifically misleading. |
| **9** | **Safety Refusal Reporting** | Credited Baseline 2 with "100% Safety Refusal Rate". | Clarified that Baseline 2 had no safety logic and omitted credentials merely by passive omission of keywords. | Prevents false claims regarding baseline security awareness. |
| **10** | **Confidence Calibration** | Described confidence scores as "calibrated probabilities". | Recharacterized as **"heuristic provenance-gated certainty indices"** (clamped to $\ge 85\%$ for verified AST, $\le 70\%$ for ungrounded). | Clamping by business logic is not Bayesian or Platt calibration. |
| **11** | **Statistical Uncertainty** | Reported Clopper-Pearson or Gaussian intervals on skewed latencies. | Applied **Wilson score 95% confidence intervals** for all binomial proportions. Omitted in-memory microsecond latencies. | Rigorous, defensible small-sample statistics ($N=40$). |
| **12** | **Held-Out Generalization** | Held-out set mentioned in report but missing from manuscript. | Added dedicated subsection and table reporting held-out benchmark ($N=20$, Profile: Elena Rostova: **95.00% accuracy**, **100.00% precision**, **90.91% recall**). | Directly validates out-of-distribution generalizability on unseen questions and a separate candidate. |
| **13** | **Bibliography** | 4 citations lacked DOIs, pages, or published proceedings information. | Formatted all 23 references in `FormPilot_References.bib` with verified DOIs, proceedings titles, and accessible URLs. | Fulfills e-Informatica's strict bibliographic quality requirements. |

---

## 3. Comparative Summary of Quantitative Results

### Controlled Benchmark ($N = 40$) Before and After Revision:

| System | Draft Accuracy | Draft Recall | Draft $F_1$ | **Verified Accuracy** | **Verified 95% CI** | **Verified Recall** | **Verified $F_1$** | **Verified Errors** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline 1 (Exact)** | 50.00% | 20.00% | 33.33% | **50.00%** | [35.20, 64.80] | **20.00%** | **33.33%** | 20 FN |
| **Baseline 2 (Keyword)** | 80.00% | 100.00%* | 84.62%* | **80.00%** | [65.24, 89.50] | **88.00%** | **80.00%** | 3 FP_wrong, 5 FP_halluc |
| **Baseline 3 (Simulated)** | 55.00% | 100.00%* | 70.97%* | **55.00%** | [39.83, 69.29] | **88.00%** | **67.69%** | 3 FP_wrong, 15 FP_halluc |
| **Reference Mock** | 100.00% | 100.00% | 100.00% | **100.00%** | [91.24, 100.00] | **100.00%** | **100.00%** | 0 (Hardcoded mock) |
| **Live LLM (Run 1)** | 100.00%* | 100.00%* | 100.00%* | **90.00%** | [76.95, 96.04] | **84.00%** | **89.36%** | 1 FP_wrong, 3 FN_abstain |
| **Live LLM (Run 2)** | 100.00%* | 100.00%* | 100.00%* | **90.00%** | [76.95, 96.04] | **84.00%** | **87.50%** | 2 FP_wrong, 2 FN_abstain |

*\*Indicates distorted or fabricated claims in prior drafts that have been refuted and replaced with verified empirical trace data.*

---

## 4. Deliverables Generated

1. [`FormPilot_Manuscript_Revised.docx`](file:///c:/P/formpilot/manuscript_deliverables/FormPilot_Manuscript_Revised.docx): Complete publication-ready Word manuscript with clean typography, tables, captions, and references.
2. [`FormPilot_Manuscript_Revised.pdf`](file:///c:/P/formpilot/manuscript_deliverables/FormPilot_Manuscript_Revised.pdf): Compiled high-resolution PDF for author and project-guide review.
3. [`FormPilot_Manuscript_Revised.tex`](file:///c:/P/formpilot/manuscript_deliverables/FormPilot_Manuscript_Revised.tex): Official LaTeX manuscript conforming to `einformatica.cls`.
4. [`FormPilot_References.bib`](file:///c:/P/formpilot/manuscript_deliverables/FormPilot_References.bib): Fully formatted BibTeX file with verified DOIs and URLs.
5. [`FormPilot_Validation_Report.md`](file:///c:/P/formpilot/manuscript_deliverables/FormPilot_Validation_Report.md): Complete mathematical trace and metric reconciliation document.
6. [`FormPilot_Author_Confirmation_Checklist.md`](file:///c:/P/formpilot/manuscript_deliverables/FormPilot_Author_Confirmation_Checklist.md): Author checklist covering ORCID IDs, corresponding author, guide authorship, funding, and data availability.
