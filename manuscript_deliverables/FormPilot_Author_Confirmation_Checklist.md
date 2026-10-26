# FormPilot Author Confirmation and Pre-Submission Checklist

**Target Journal:** *e-Informatica Software Engineering Journal* (EISEJ)  
**Paper Title:** FormPilot: Semantic Question Mapping and Provenance-Aware Automated Form Filling  
**Date:** October 2026  
**Auditor / Editor:** Academic Research Editor & Verification Specialist  

---

## Instructions for Authors
Before finalizing the manuscript for journal submission or review with your project guide, please review and confirm each item below. Do not submit placeholder values or unverified institutional claims.

---

### Item 1: Author Details and Corresponding Author
The manuscript currently lists three student authors from Malla Reddy University:

1. **Kadiyala Preethi**
   - Department: Artificial Intelligence and Machine Learning
   - Affiliation: Malla Reddy University, Hyderabad, Telangana, India
   - Current Email: `kadeyelapreethi2006@gmail.com`
   - *Action Required:* Provide institutional email (`@mallareddyuniversity.ac.in`) if required by the journal, and provide 16-digit ORCID identifier (`https://orcid.org/0000-XXXX-XXXX-XXXX`).
2. **Kalangi Samhitha**
   - Department: Artificial Intelligence and Machine Learning
   - Affiliation: Malla Reddy University, Hyderabad, Telangana, India
   - Current Email: `samhikalangi@gmail.com`
   - *Action Required:* Provide institutional email and ORCID identifier.
3. **Saiteja Reddy Karka**
   - Department: Artificial Intelligence and Machine Learning
   - Affiliation: Malla Reddy University, Hyderabad, Telangana, India
   - Current Email: `karkasaiteja4@gmail.com`
   - *Action Required:* Provide institutional email and ORCID identifier.
4. **Corresponding Author Selection:**
   - *Action Required:* Confirm which author is designated as the Corresponding Author (marked with `*` in the template). Typically, this is Saiteja Reddy Karka or Kadiyala Preethi.

---

### Item 2: Project Guide Treatment (Authorship vs. Acknowledgment)
**Decision Flagged for Authors:**
- *Current Treatment:* Your project guide is acknowledged in the manuscript's **Acknowledgment** section:
  > *"We express our sincere gratitude to our project guide for her valuable guidance, constructive feedback, and continuous encouragement throughout this project."*
- *Criteria for Authorship (COPE / ICMJE / e-Informatica Guidelines):*
  If your guide contributed substantially to:
  1. The conception or design of the research work, or the acquisition, analysis, or interpretation of data; AND
  2. Drafting the work or revising it critically for important intellectual content; AND
  3. Final approval of the version to be published; AND
  4. Agreement to be accountable for all aspects of the work;
  **Then she should be included as a co-author** (e.g., as senior author / corresponding author) with her formal title (Dr./Prof.), full name, department, institutional email, and ORCID ID.
- *If she provided supervision, advice, and departmental facilities without direct co-writing/editing:* Formal acknowledgement with her exact name and title is the ethically appropriate choice under journal guidelines.
- *Action Required:* Discuss this directly with your guide ("Mam") and confirm whether she should be added as a co-author or formally named in the Acknowledgment.

---

### Item 3: CRediT Author Statement Approval
Review the proposed CRediT (Contributor Roles Taxonomy) breakdown:

```latex
\Credits{
Kadiyala Preethi: Conceptualization, Methodology, Software (Chrome extension), Investigation, Writing -- original draft.
Kalangi Samhitha: Data curation, Validation, Software (Frontend & API integration), Formal analysis, Writing -- original draft.
Saiteja Reddy Karka: Project administration, Architecture, Software (Security & Rate limiting), Supervision, Writing -- review and editing.
}
```

- *Action Required:* Confirm or adjust the specific contributions among all authors.

---

### Item 4: Generative AI Assistance Declaration
The manuscript includes one official declaration formatted in accordance with e-Informatica guidelines:

```latex
\AIDeclaration{During the preparation of this work, the authors utilized ChatGPT in order to assist with drafting, language clarity, and formatting assistance. Subsequent to the application of this tool, the authors reviewed and edited the content as necessary and accept full responsibility for the final content of the publication.}
```

- *Action Required:* Confirm that this statement accurately describes the use of AI tools during manuscript drafting. Note that duplicate in-text declarations have been removed.

---

### Item 5: Competing Interests and Funding Declarations
- **Funding:**
  ```latex
  \Funding{This research received no external funding.}
  ```
- **Competing Interests:**
  ```latex
  \CompetingInterests{The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.}
  ```
- *Action Required:* Confirm that no commercial sponsorships, grants, or undisclosed financial arrangements exist.

---

### Item 6: Data and Code Availability
- Proposed Statement:
  ```latex
  \Data{The evaluation corpora, benchmark runner scripts, scoring implementations, and live run traces supporting the findings of this study are available in the project repository at \url{https://github.com/SAITEJA0217/formpilot}.}
  ```
- *Action Required:* Confirm that the GitHub repository (`SAITEJA0217/formpilot`) is publicly accessible and contains no private Firebase credentials, API keys, or unconsented PII before submitting.

---

### Item 7: Test Profile Anonymization
- In the development benchmark, the test profile (`eval_user_001`) contains the name `"Saiteja V"`, email `"saiteja@example.com"`, and project title `"FormPilot AI"`.
- *Action Required:* Confirm whether the authors consent to releasing these values as part of the public benchmark artifact, or if they should be replaced with fictional synthetic placeholders (e.g., `"Alex Jordan"`). Note: Replacing them requires updating expected benchmark answers.

---

### Item 8: Journal Scope and Verification
- *Journal:* *e-Informatica Software Engineering Journal* (EISEJ, Wrocław University of Science and Technology).
- *Indexing:* Scopus, Web of Science (ESCI), DOAJ.
- *Template Check:* The LaTeX source uses `einformatica.cls` and `IEEEtran_for_EI.bst` from the official 2026 Author Guide.
- *Action Required:* Verify final formatting against the journal's author submission portal prior to official submission.
