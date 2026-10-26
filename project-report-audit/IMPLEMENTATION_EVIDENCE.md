# FormPilot AI: Implementation Evidence & Code Audit

> **Document:** `project-report-audit/IMPLEMENTATION_EVIDENCE.md`  
> **Repository:** [`c:/P/formpilot`](file:///c:/P/formpilot)  
> **Academic Level:** B.Tech Major Project Phase-I  
> **Auditor Status:** Senior Software Engineer / Academic Documentation Specialist  

---

## 1. Executive Implementation Summary

FormPilot AI exhibits a high degree of implementation completeness for its core Google Forms automation and safety objectives. The codebase is organized as a modern monorepo containing a Chromium Manifest V3 browser extension, a Next.js 16 App Router web dashboard, shared TypeScript type definitions, deterministic regression test suites, and empirical evaluation benchmarks.

### Implementation Status Matrix

| Feature / Subsystem | Status | Primary Implementation File | Verification Summary |
| :--- | :---: | :--- | :--- |
| **Google Forms DOM Extractor** | **Implemented** | [`extension/src/content/index.tsx:7-105`](file:///c:/P/formpilot/extension/src/content/index.tsx#L7-L105) | Traverses `div[role="listitem"]` to discover questions, required status, and input types. |
| **2D Matrix Grid Deconstruction** | **Implemented** | [`extension/src/content/index.tsx:39-65`](file:///c:/P/formpilot/extension/src/content/index.tsx#L39-L65) | Flattens `div[role="grid"]` columns and rowheaders into discrete promptable sub-questions. |
| **Dashboard-to-Extension Sync** | **Implemented** | [`extension/src/content/dashboardSync.ts:2-21`](file:///c:/P/formpilot/extension/src/content/dashboardSync.ts#L2-L21) | Bridges profile and auth tokens across window boundaries via `postMessage`. |
| **Self-Healing Token Refresh** | **Implemented** | [`extension/src/background/index.ts:22-51`](file:///c:/P/formpilot/extension/src/background/index.ts#L22-L51) | Catches HTTP 401 and broadcasts `REQUEST_TOKEN_REFRESH` to recover active tokens. |
| **AI Form Mapping Gateway** | **Implemented** | [`frontend/src/app/api/ai/generate/route.ts:33-247`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L33-L247) | Authenticates requests, compiles prompts, invokes OpenRouter, and returns structured answers. |
| **7-Stage Resilient JSON Parser** | **Implemented** | [`frontend/src/lib/openrouter.ts:57-135`](file:///c:/P/formpilot/frontend/src/lib/openrouter.ts#L57-L135) | Strips reasoning `<think>` tags, extracts markdown blocks, repairs truncated JSON, and regex items. |
| **Independent Provenance Verification** | **Implemented** | [`frontend/src/lib/provenance.ts:24-61`](file:///c:/P/formpilot/frontend/src/lib/provenance.ts#L24-L61) | Dynamically verifies JSON paths against profile schema; rejects false claims. |
| **Confidence Downgrading (Cap @ 70%)** | **Implemented** | [`frontend/src/app/api/ai/generate/route.ts:224-235`](file:///c:/P/formpilot/frontend/src/app/api/ai/generate/route.ts#L224-L235) | Clamps ungrounded generative inferences at a maximum of 70% confidence. |
| **Human Review Panel (Injected UI)** | **Implemented** | [`extension/src/content/ReviewPanel.tsx:11-164`](file:///c:/P/formpilot/extension/src/content/ReviewPanel.tsx#L11-L164) | Injected floating React modal displaying match confidence, provenance, and inline edit controls. |
| **Few-Shot Correction Learning** | **Implemented** | [`frontend/src/app/api/ai/corrections/route.ts:87-129`](file:///c:/P/formpilot/frontend/src/app/api/ai/corrections/route.ts#L87-L129) | Classifies user corrections as `fact-level` or `phrasing-level` and stores in Firestore. |
| **Synthetic Event Bypass (`setNativeInputValue`)** | **Implemented** | [`extension/src/content/index.tsx:252-268`](file:///c:/P/formpilot/extension/src/content/index.tsx#L252-L268) | Invokes prototype property setter and dispatches `input`, `change`, and `blur` events. |
| **Anti-Collision Question Matcher** | **Implemented** | [`extension/src/content/index.tsx:342-372`](file:///c:/P/formpilot/extension/src/content/index.tsx#L342-L372) | 3-tier matching (Exact $\rightarrow$ Normalized $\rightarrow$ Jaccard $\ge 0.8$) rejecting ambiguous subset collisions. |
| **Multi-Select Checkbox Handling** | **Implemented** | [`extension/src/content/index.tsx:423-448`](file:///c:/P/formpilot/extension/src/content/index.tsx#L423-L448) | Parses delimited answers and checks matching options without unchecking existing selections. |
| **Likert Option Protection** | **Implemented** | [`extension/src/content/index.tsx:456-473`](file:///c:/P/formpilot/extension/src/content/index.tsx#L456-L473) | Exact-first pass prevents inversion on Likert options ("Agree" vs "Strongly Agree"). |
| **Timezone-Safe ISO Date Normalization** | **Implemented** | [`extension/src/content/index.tsx:211-238`](file:///c:/P/formpilot/extension/src/content/index.tsx#L211-L238) | Parses dates into `YYYY-MM-DD` strings without triggering UTC day-shift defects. |
| **PDF Resume Parsing & Auto-Population** | **Implemented** | [`frontend/src/app/api/ai/parse-resume/route.ts:62-181`](file:///c:/P/formpilot/frontend/src/app/api/ai/parse-resume/route.ts#L62-L181) | Extracts PDF text with `pdf-parse` and falls back to multimodal base64 image parsing. |
| **Fail-Closed Transactional Rate Limiting** | **Implemented** | [`frontend/src/lib/rate-limiter.ts:62-164`](file:///c:/P/formpilot/frontend/src/lib/rate-limiter.ts#L62-L164) | Atomic Firestore transaction enforcing 1,000 req/day; fails closed (HTTP 503) on DB failure. |
| **Zero Autonomous Submission Safeguard** | **Verified (100%)** | [`extension/src/content/index.tsx:270-507`](file:///c:/P/formpilot/extension/src/content/index.tsx#L270-L507) | No code path clicks submit or advances pages. Grep search confirms zero submit triggers. |
| **Web-to-Extension Ping Detector** | **Partially Implemented** | [`frontend/src/hooks/useExtensionDetection.ts:12-23`](file:///c:/P/formpilot/frontend/src/hooks/useExtensionDetection.ts#L12-L23) | Hook exists, but [`extension-config.ts:3`](file:///c:/P/formpilot/frontend/src/lib/extension-config.ts#L3) has `"PLACEHOLDER_EXTENSION_ID"`. |
| **Saved Form History Collection** | **Planned / Placeholder** | [`frontend/src/app/dashboard/page.tsx:151-160`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L151-L160) | UI card shows "Coming Soon". Security rules exist in Firestore, but no writing code exists. |
| **Settings / Preferences Page** | **Planned / Placeholder** | [`frontend/src/app/dashboard/page.tsx:142`](file:///c:/P/formpilot/frontend/src/app/dashboard/page.tsx#L142) | UI card shows "Coming soon"; inactive button. |
| **Microsoft Forms / Typeform Compatibility**| **Planned (Future Scope)**| [`docs/PRD.md:9-10`](file:///c:/P/formpilot/docs/PRD.md#L9-L10) | PRD explicitly restricts scope to Google Forms only. |

---

## 2. Detailed Feature Audits

```
========================================================================================
FEATURE 1: Google Forms Accessibility Tree Question Extractor
========================================================================================
- Feature: Google Forms Question Extraction & Control Typing
- Status: Implemented
- Evidence: extension/src/content/index.tsx, lines 7-105 (extractGoogleFormQuestions)
- Implementation explanation:
    1. Traverses the live DOM using document.querySelectorAll('div[role="listitem"]').
    2. Identifies question titles inside child containers: div[role="heading"].
    3. Detects mandatory questions by inspecting fullText.includes('*'), [aria-required="true"],
       or class '.freebirdFormviewerViewItemsItemRequiredAsterisk'. Strips asterisks for clean text.
    4. Categorizes the underlying form control:
       - input[type="text" | "email" | "number" | "tel" | "url"] -> 'short_answer'
       - textarea -> 'paragraph'
       - input[type="date"] -> 'date'
       - input[type="time"] -> 'time'
       - div[role="grid"] -> 2D Matrix (delegates to Matrix Grid Flattening)
       - div[role="radiogroup"] -> 'linear_scale' (if presentation div exists) or 'radio'
       - div[role="listbox"] -> 'dropdown'
       - div[role="checkbox"] -> 'checkbox'
- Inputs: Live webpage DOM of Google Forms.
- Outputs: Array of FormQuestion objects: { id, question, type, required, options? }.
- Limitations: Only extracts fields visible on the active page. Hidden sections or multi-page
  forms require sequential user navigation.
- Report chapter where it belongs: Chapter 5: Methodology & Implementation; Chapter 6: Algorithms.

========================================================================================
FEATURE 2: 2D Matrix Grid Flattening Algorithm
========================================================================================
- Feature: Multi-Dimensional Rating Table Deconstruction
- Status: Implemented
- Evidence: extension/src/content/index.tsx, lines 39-65
- Implementation explanation:
    1. Locates div[role="grid"] within a question block.
    2. Queries all column header labels: div[role="columnheader"], extracting option text.
    3. Traverses each row element: div[role="row"]. Skips row 0 (column header container).
    4. Extracts row title from div[role="rowheader"].
    5. Flattens each row into an independent, promptable sub-question:
       rowQuestionText = `${questionText}: ${rowHeader.textContent.trim()}`
    6. Appends distinct sub-questions with id `q_${index}_r${rIndex}` and the extracted columns.
- Inputs: div[role="grid"] DOM container.
- Outputs: Multiple discrete FormQuestion objects with type 'radio' or 'checkbox'.
- Limitations: Assumes standard Google Forms accessibility table layout; does not support
  custom nested matrices or script-altered table views.
- Report chapter where it belongs: Chapter 5: Methodology & Implementation; Chapter 6: Algorithms.

========================================================================================
FEATURE 3: Synthetic Event Bypass & Native Value Injection
========================================================================================
- Feature: Prototype Value Setter & Event Dispatcher
- Status: Implemented
- Evidence: extension/src/content/index.tsx, lines 252-268 (setNativeInputValue)
- Implementation explanation:
    1. Bypasses JavaScript framework setters (Closure/React) that intercept `element.value = "..."`.
    2. Retrieves the native prototype descriptor:
       Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    3. Invokes prototype setter: prototypeValueSetter.call(element, value).
    4. Dispatches bubbling synthetic events in succession:
       - element.dispatchEvent(new Event('input', { bubbles: true }))
       - element.dispatchEvent(new Event('change', { bubbles: true }))
       - element.dispatchEvent(new Event('blur', { bubbles: true }))
- Inputs: HTMLInputElement or HTMLTextAreaElement reference and formatted string value.
- Outputs: Value persisted in Google Forms internal state tree.
- Limitations: Does not bypass CAPTCHA or programmatic anti-bot verification challenges.
- Report chapter where it belongs: Chapter 5: Methodology & Implementation.

========================================================================================
FEATURE 4: Anti-Collision Question Matching & Ambiguity Rejection
========================================================================================
- Feature: Tiered Collision-Free Question Matcher
- Status: Implemented
- Evidence: extension/src/content/index.tsx, lines 342-372
- Implementation explanation:
    1. Tier 1 (Exact String Match): Matches exact lowercased, trimmed question string.
    2. Tier 2 (Normalized Exact Match): Strips punctuation, non-alphanumeric symbols, and
       collapses whitespace before matching.
    3. Tier 3 (Unambiguous Token Similarity): Tokenizes strings into words (> 2 chars).
       Calculates Jaccard similarity coefficient: J = |A ∩ B| / |A ∪ B|.
       Requires J >= 0.8 AND enforces candidates.length === 1.
       If multiple candidates match or if a question is an ambiguous subset of another,
       the match is rejected (fails safe) rather than injecting into the wrong field.
- Inputs: Target question title from Google Forms and finalAnswers array from ReviewPanel.
- Outputs: Matched AIAnswer object or undefined (field skipped for safety).
- Limitations: If question phrasing is drastically reworded without shared keywords, Tier 3
  abtains and leaves field blank for manual user input.
- Report chapter where it belongs: Chapter 6: Algorithms and Data Flow.

========================================================================================
FEATURE 5: Human-in-the-Loop Review Panel
========================================================================================
- Feature: Injected Floating React Modal for Pre-Fill Verification
- Status: Implemented
- Evidence: extension/src/content/ReviewPanel.tsx, lines 11-164
- Implementation explanation:
    1. Mounts via createRoot onto a dedicated div#formpilot-review-root container in the DOM.
    2. Displays color-coded match confidence badges:
       - Green (>= 80%): Direct profile match.
       - Yellow/Orange (50-70%): Generative/inferred answer.
       - Yellow Alert: Missing profile data.
    3. Renders interactive "Why?" link revealing the exact profile provenance path (e.g.
       `education[0].degree`) and explicitly flagging generated answers.
    4. Provides inline editing controls (`Edit2` icon) and skip controls (`X` icon).
    5. Dispatches "Autofill Form" only upon user click; calls onFill(answers) prop callback.
- Inputs: AIAnswer[] array received from background service worker.
- Outputs: User-verified finalAnswers[] array passed to native DOM filling routine.
- Limitations: Injected modal z-index (999999) can occasionally collide with full-screen
  Google Workspace modals if custom CSS styles are injected by enterprise themes.
- Report chapter where it belongs: Chapter 4: System Architecture; Chapter 8: User Interface.

========================================================================================
FEATURE 6: Server-Side Independent Provenance & Confidence Clamping
========================================================================================
- Feature: Grounding Verification & Hallucination Mitigation
- Status: Implemented
- Evidence: frontend/src/lib/provenance.ts, lines 24-61 (verifyProvenance) and
            frontend/src/app/api/ai/generate/route.ts, lines 224-235
- Implementation explanation:
    1. Server intercepts LLM-generated answers containing self-reported `sourceDetail` paths.
    2. Invokes getNestedValue(profile, path) to resolve the actual profile data at that JSON path.
    3. Protects against prototype pollution by discarding '__proto__', 'constructor', 'prototype'.
    4. Evaluates match:
       - Exact case-insensitive match -> verified.
       - Substring match allowed ONLY if both strings have >= 3 chars (prevents "No", "In", "A"
         from matching inside "Node.js" or "Boston").
    5. If verified and not generated: source = 'profile', confidence clamped to >= 85%.
    6. If unverified or inferred: source = 'generated', confidence clamped to MAXIMUM 70%.
- Inputs: UserProfile object and AIAnswer candidate.
- Outputs: Calibrated AIAnswer object with verified provenance path and clamped confidence.
- Limitations: Only validates paths within the standard UserProfile schema.
- Report chapter where it belongs: Chapter 5: Methodology; Chapter 6: Algorithms.

========================================================================================
FEATURE 7: Fail-Closed Transactional Rate Limiting
========================================================================================
- Feature: Atomic Quota Enforcement Engine
- Status: Implemented
- Evidence: frontend/src/lib/rate-limiter.ts, lines 62-164 (enforceRateLimit)
- Implementation explanation:
    1. Constructs rateLimit document key: `${cleanUid}_${action}` in Firestore.
    2. Executes within db.runTransaction:
       - If doc does not exist: initializes count = 1, timestamp = now.
       - If sliding window (24h) expired: resets count = 1, timestamp = now.
       - If count >= quota: throws RateLimitExceeded error.
       - If within quota: increments count by 1.
    3. Fails closed: If Firestore transaction throws a network or socket error, re-throws
       and returns HTTP 503 Service Unavailable, strictly preventing quota bypass.
- Inputs: User UID, action ('generate' | 'parse-resume' | 'corrections'), Firestore adminDb instance.
- Outputs: RateLimitResult { allowed: boolean, status: 200 | 429 | 503, remaining, resetTime }.
- Limitations: Requires active Firestore network connectivity; cannot operate offline.
- Report chapter where it belongs: Chapter 5: Methodology & Implementation.

========================================================================================
FEATURE 8: Multi-Stage Resilient JSON Parser
========================================================================================
- Feature: Robust AI Output Parser & Code Block Recovery
- Status: Implemented
- Evidence: frontend/src/lib/openrouter.ts, lines 57-135 (extractJsonFromResponse)
- Implementation explanation:
    1. Step 1: Strips `<think>...</think>` tags emitted by reasoning models (e.g. DeepSeek R1).
    2. Step 2: Extracts code blocks matching ```(?:json)? ... ```.
    3. Step 3: Explicitly searches for `"answers"` array substring.
    4. Step 4: Repairs truncated JSON strings by identifying the last closed bracket and appending `]}`.
    5. Step 5: Executes fallback regex parsing to isolate individual `{ "question": ..., "answer": ... }` blocks.
    6. Step 6: Finds outermost curly braces `{ ... }`.
    7. Step 7: Strips trailing commas and executes cleanAndParse.
- Inputs: Raw string output from LLM chat completion endpoint.
- Outputs: Parsed JavaScript object containing valid answers array.
- Limitations: Fails if AI emits non-JSON explanatory prose containing zero JSON structures.
- Report chapter where it belongs: Chapter 5: Methodology; Chapter 6: Algorithms.

========================================================================================
FEATURE 9: PDF Resume Ingestion & Parsing
========================================================================================
- Feature: Automated Profile Population from Resume
- Status: Implemented
- Evidence: frontend/src/app/api/ai/parse-resume/route.ts, lines 62-181
- Implementation explanation:
    1. Enforces PDF file type and 5MB size limit.
    2. Reads buffer and attempts text extraction using `pdf-parse`.
    3. If extracted text > 50 characters: constructs text prompt and dispatches to OpenRouter.
    4. If extracted text <= 50 characters (scanned image): converts PDF to base64 buffer and
       dispatches multimodal vision prompt via `data:application/pdf;base64,...`.
    5. Sanitizes null values to empty strings ("") to prevent React uncontrolled input warnings.
- Inputs: Multipart form data containing PDF resume file and Bearer authorization token.
- Outputs: Structured UserProfile JSON object matching the 6-tab profile schema.
- Limitations: Accuracy depends on visual formatting of resume; non-standard multi-column
  creative resumes may require manual user adjustment in the profile editor.
- Report chapter where it belongs: Chapter 5: Methodology; Chapter 8: User Interface.

========================================================================================
FEATURE 10: Strict CORS Origin & Extension ID Validation
========================================================================================
- Feature: Fail-Closed Cross-Origin Security Filter
- Status: Implemented
- Evidence: frontend/src/lib/cors.ts, lines 32-69 (isOriginAllowed)
- Implementation explanation:
    1. Checks request origin header against explicit ALLOWED_ORIGINS allowlist.
    2. Checks origin against `chrome-extension://${allowedExtensionId}` using exact equality.
    3. If NODE_ENV !== 'production', permits http://localhost:3000, 127.0.0.1:3000, localhost:5173.
    4. Rejects substring spoofs (`evil.com?origin=localhost:3000` or `attacker.com`).
    5. Fails closed: if origin is unauthorized, returns empty string for Access-Control-Allow-Origin
       and rejects preflight OPTIONS requests with HTTP 403 Forbidden.
- Inputs: Request Origin header string.
- Outputs: Boolean validation flag and CORS response headers.
- Limitations: Requires EXTENSION_ID environment variable to be configured in production.
- Report chapter where it belongs: Chapter 3: System Requirements & Security.

========================================================================================
FEATURE 11: Zero Autonomous Submission Safeguard
========================================================================================
- Feature: Anti-Autonomous Submission Verification
- Status: Implemented & 100% Verified in Codebase
- Evidence: extension/src/content/index.tsx, lines 270-507 (handleFill)
- Implementation explanation:
    1. Complete codebase search (ripgrep) for "submit", "submitButton", or form dispatchers:
       ZERO submission triggers found.
    2. handleFill() iterates strictly over question blocks (div[role="listitem"]).
    3. It injects text, checks radio/checkbox options, and selects dropdown values.
    4. At completion, it calls toastMessage(`Form autofilled: X fields completed!`).
    5. It terminates execution without dispatching form submit events or clicking buttons.
    6. The user is strictly required to review fields and press the Google Forms Submit button manually.
- Inputs: User click on "Autofill Form" inside ReviewPanel.
- Outputs: Injected DOM field values; zero autonomous form submission.
- Limitations: None; strictly upholds the Human-in-the-Loop policy.
- Report chapter where it belongs: Chapter 4: Proposed System Architecture; Chapter 5: Methodology.
```
