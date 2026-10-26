import React from 'react';
import { createRoot } from 'react-dom/client';
import type { FormQuestion, QuestionType, AIAnswer } from '../../../shared/types';
import ReviewPanel from './ReviewPanel';
import '../style.css';

function extractGoogleFormQuestions(): FormQuestion[] {
  const questions: FormQuestion[] = [];

  // Google Forms structure: div[role="listitem"] represents a question block
  const questionBlocks = document.querySelectorAll('div[role="listitem"]');

  questionBlocks.forEach((block, index) => {
    // Heading div usually contains the question text
    const titleElement = block.querySelector('div[role="heading"]');
    if (!titleElement) return;

    const fullText = titleElement.textContent || '';
    const ariaRequired = block.querySelector('[aria-required="true"]') !== null;
    const requiredClass = block.querySelector('.freebirdFormviewerViewItemsItemRequiredAsterisk') !== null;
    const required = fullText.includes('*') || ariaRequired || requiredClass;
    const questionText = fullText.replace(/\*/g, '').trim();
    if (!questionText) return;

    let type: QuestionType = 'unsupported';
    const options: string[] = [];

    // Detect Input Types
    const hasTextInput = block.querySelector('input[type="text"], input[type="email"], input[type="number"], input[type="tel"], input[type="url"]') || 
                         (block.querySelector('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]):not([type="date"]):not([type="time"]):not([type="hidden"])'));
    if (hasTextInput) {
      type = 'short_answer';
    } else if (block.querySelector('textarea')) {
      type = 'paragraph';
    } else if (block.querySelector('input[type="date"]')) {
      type = 'date';
    } else if (block.querySelector('input[type="time"]')) {
      type = 'time';
    } else if (block.querySelector('div[role="grid"]')) {
      // It's a grid! We need to extract the columns first
      const grid = block.querySelector('div[role="grid"]');
      const columnHeaders = grid?.querySelectorAll('div[role="columnheader"]') || [];
      const columns = Array.from(columnHeaders).map(h => h.textContent || '').filter(Boolean);

      const rows = grid?.querySelectorAll('div[role="row"]') || [];

      // Skip the first row (headers), process the rest
      const isCheckboxGrid = !!grid?.querySelector('div[role="checkbox"]');
      const gridType: QuestionType = isCheckboxGrid ? 'checkbox' : 'radio';

      rows.forEach((row, rIndex) => {
        if (rIndex === 0) return; // Skip header row
        const rowHeader = row.querySelector('div[role="rowheader"]');
        if (rowHeader && rowHeader.textContent) {
          const rowQuestionText = `${questionText}: ${rowHeader.textContent.trim()}`;
          questions.push({
            id: `q_${index}_r${rIndex}`,
            question: rowQuestionText,
            type: gridType,
            required,
            options: columns
          });
        }
      });
      return; // Skip normal pushing since we pushed flattened rows
    } else if (block.querySelector('div[role="radiogroup"]')) {
      // Linear Scale or normal Radio
      const isLinearScale = block.querySelectorAll('div[role="radio"]').length > 0 && !!block.querySelector('div[role="presentation"]');
      type = isLinearScale ? 'linear_scale' : 'radio';

      // Extract options
      const labels = block.querySelectorAll('div[role="radio"]');
      labels.forEach(l => {
        const text = l.getAttribute('data-value') || l.getAttribute('aria-label') || l.textContent || '';
        if (text && text.trim()) options.push(text.trim());
      });
    } else if (block.querySelector('div[role="listbox"]')) {
      type = 'dropdown';
      const listOptions = block.querySelectorAll('div[role="option"]');
      listOptions.forEach(o => {
        const val = o.getAttribute('data-value') || o.textContent;
        if (val && val !== 'Choose' && val.trim()) options.push(val.trim());
      });
    } else if (block.querySelectorAll('div[role="checkbox"]').length > 0) {
      type = 'checkbox';
      const checkboxes = block.querySelectorAll('div[role="checkbox"]');
      checkboxes.forEach(c => {
        const val = c.getAttribute('aria-label') || c.getAttribute('data-value') || c.textContent || '';
        if (val && val.trim()) options.push(val.trim());
      });
    }

    if (type !== 'unsupported') {
      questions.push({
        id: `q_${index}`,
        question: questionText,
        type,
        required,
        ...(options.length > 0 ? { options } : {})
      });
    }
  });

  return questions;
}

// ─── Content-Script Message Handler with Input Validation ─────────────────────
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (!request || typeof request !== 'object' || typeof request.action !== 'string') {
    sendResponse({ error: 'Malformed message request' });
    return false;
  }

  if (request.action === 'EXTRACT_QUESTIONS') {
    try {
      const questions = extractGoogleFormQuestions();
      sendResponse({ questions });
    } catch (err: any) {
      sendResponse({ error: err.message || 'Failed to extract form questions' });
    }
    return false;
  }

  if (request.action === 'SHOW_REVIEW_PANEL') {
    if (!Array.isArray(request.answers)) {
      sendResponse({ error: 'Invalid payload: answers must be an array' });
      return false;
    }
    try {
      injectReviewPanel(request.answers);
      sendResponse({ success: true });
    } catch (err: any) {
      sendResponse({ error: err.message || 'Failed to inject review panel' });
    }
    return false;
  }

  sendResponse({ error: `Unsupported action: ${request.action}` });
  return false;
});

let rootNode: ReturnType<typeof createRoot> | null = null;

// ─── Asynchronous Bounded Dropdown Option Selection ───────────────────────────
async function selectDropdownOption(
  block: Element,
  answerText: string,
  maxWaitMs = 1500,
  intervalMs = 50
): Promise<boolean> {
  const listbox = block.querySelector('div[role="listbox"]');
  if (!listbox) return false;

  (listbox as HTMLElement).click();

  const startTime = Date.now();
  const normAns = answerText.toLowerCase().trim();

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      // Scope option search to current block or active dropdown popup to prevent cross-question collision
      let options = block.querySelectorAll('div[role="option"]');
      if (options.length === 0) {
        const activePopup = document.querySelector('.exportSelectPopup, .quantumWizMenuPaperselectPopup, div[role="listbox"][aria-expanded="true"]');
        if (activePopup) {
          options = activePopup.querySelectorAll('div[role="option"]');
        } else {
          options = document.querySelectorAll('div[role="option"]:not([aria-hidden="true"])');
        }
      }
      let foundOption: HTMLElement | null = null;

      // Pass 1: exact option match
      options.forEach(opt => {
        if (foundOption) return;
        const val = (opt.getAttribute('data-value') || opt.textContent || '').toLowerCase().trim();
        if (val && val !== 'choose' && val === normAns) {
          foundOption = opt as HTMLElement;
        }
      });

      // Pass 2: substring fallback if length >= 3
      if (!foundOption && normAns.length >= 3) {
        options.forEach(opt => {
          if (foundOption) return;
          const val = (opt.getAttribute('data-value') || opt.textContent || '').toLowerCase().trim();
          if (val && val !== 'choose' && val.length >= 3 && (normAns.includes(val) || val.includes(normAns))) {
            foundOption = opt as HTMLElement;
          }
        });
      }

      if (foundOption) {
        clearInterval(timer);
        (foundOption as HTMLElement).click();
        resolve(true);
        return;
      }

      if (Date.now() - startTime >= maxWaitMs) {
        clearInterval(timer);
        console.warn(`[FormPilot Content] Timed out waiting for dropdown option for: "${answerText}"`);
        // Close dropdown
        (listbox as HTMLElement).click();
        resolve(false);
      }
    }, intervalMs);
  });
}

function parseSafeDate(rawDateStr: string): string | null {
  const trimmed = rawDateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    const p1 = parseInt(match[1], 10);
    const p2 = parseInt(match[2], 10);
    const year = match[3];
    if (p1 > 12 && p2 <= 12) {
      return `${year}-${p2.toString().padStart(2, '0')}-${p1.toString().padStart(2, '0')}`;
    } else if (p2 > 12 && p1 <= 12) {
      return `${year}-${p1.toString().padStart(2, '0')}-${p2.toString().padStart(2, '0')}`;
    } else if (p1 <= 12 && p2 <= 12) {
      // Default to DD/MM/YYYY for ambiguous numbers
      return `${year}-${p2.toString().padStart(2, '0')}-${p1.toString().padStart(2, '0')}`;
    }
  }
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return null;
}

function injectReviewPanel(answers: AIAnswer[]) {
  let container = document.getElementById('formpilot-review-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'formpilot-review-root';
    document.body.appendChild(container);
  }

  if (!rootNode) {
    rootNode = createRoot(container);
  }

  function setNativeInputValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  const handleFill = async (finalAnswers: AIAnswer[]) => {
    const questionBlocks = document.querySelectorAll('div[role="listitem"]');
    let filledCount = 0;
    let totalCount = 0;
    let skippedCount = 0;

    for (const block of Array.from(questionBlocks)) {
      const titleElement = block.querySelector('div[role="heading"]');
      if (!titleElement) continue;
      const questionText = (titleElement.textContent || '').replace(/\*/g, '').trim();
      const normQ = questionText.toLowerCase().trim();

      // Handle Grid questions
      const grid = block.querySelector('div[role="grid"]');
      if (grid) {
        const rows = grid.querySelectorAll('div[role="row"]');
        rows.forEach((row, rIndex) => {
          if (rIndex === 0) return;
          const rowHeader = row.querySelector('div[role="rowheader"]');
          if (rowHeader && rowHeader.textContent) {
            totalCount++;
            const rowQuestionText = `${questionText}: ${rowHeader.textContent.trim()}`;
            const normRowQ = rowQuestionText.toLowerCase().trim();
            
            const answerObj = finalAnswers.find(a =>
              a.question === rowQuestionText ||
              a.question.toLowerCase().trim() === normRowQ
            );

            if (answerObj && answerObj.answer) {
              const targetAns = answerObj.answer.toLowerCase().trim();
              const options = row.querySelectorAll('div[role="radio"], div[role="checkbox"]');
              let matchedOption: HTMLElement | null = null;

              // Pass 1: exact match
              options.forEach(opt => {
                const val = (opt.getAttribute('data-value') || opt.getAttribute('aria-label') || opt.textContent || '').toLowerCase().trim();
                if (val && val === targetAns) {
                  matchedOption = opt as HTMLElement;
                }
              });

              // Pass 2: substring fallback only if length >= 3
              if (!matchedOption && targetAns.length >= 3) {
                options.forEach(opt => {
                  const val = (opt.getAttribute('data-value') || opt.getAttribute('aria-label') || opt.textContent || '').toLowerCase().trim();
                  if (val && val.length >= 3 && (targetAns.includes(val) || val.includes(targetAns))) {
                    if (!matchedOption) matchedOption = opt as HTMLElement;
                  }
                });
              }

              if (matchedOption) {
                const isChecked = (matchedOption as HTMLElement).getAttribute('aria-checked') === 'true';
                if (!isChecked) {
                  (matchedOption as HTMLElement).click();
                }
                filledCount++;
              } else {
                skippedCount++;
              }
            } else {
              skippedCount++;
            }
          }
        });
        continue;
      }

      // Non-grid question matching using tiered collision-free matcher
      totalCount++;
      
      // Step 1: Exact string match
      let answerObj = finalAnswers.find(a => a.question.toLowerCase().trim() === normQ);
      
      // Step 2: Normalized alphanumeric match
      if (!answerObj) {
        const normalizeStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        const normQClean = normalizeStr(questionText);
        answerObj = finalAnswers.find(a => normalizeStr(a.question) === normQClean);
      }

      // Step 3: Unambiguous Token Similarity (Rejects subset collisions)
      if (!answerObj) {
        const extractTokens = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
        const qTokens = new Set(extractTokens(questionText));
        
        if (qTokens.size > 0) {
          const candidates = finalAnswers.filter(a => {
            const aTokens = extractTokens(a.question);
            if (aTokens.length === 0) return false;
            const intersection = aTokens.filter(t => qTokens.has(t)).length;
            const union = new Set([...aTokens, ...qTokens]).size;
            const jaccard = intersection / union;
            return jaccard >= 0.8;
          });

          // Safe: Only accept if there is exactly ONE unambiguous match
          if (candidates.length === 1) {
            answerObj = candidates[0];
          }
        }
      }

      if (!answerObj || !answerObj.answer) {
        skippedCount++;
        continue;
      }
      const answerText = answerObj.answer;

      // 1. Date Inputs
      const dateInput = block.querySelector('input[type="date"]') as HTMLInputElement;
      if (dateInput) {
        const formattedDate = parseSafeDate(answerText);
        if (formattedDate) {
          try {
            setNativeInputValue(dateInput, formattedDate);
            filledCount++;
          } catch (e) {
            console.warn("Could not set date format:", formattedDate);
            skippedCount++;
          }
        } else {
          skippedCount++;
        }
        continue;
      }

      // 2. Time Inputs
      const timeInput = block.querySelector('input[type="time"]') as HTMLInputElement;
      if (timeInput) {
        setNativeInputValue(timeInput, answerText);
        filledCount++;
        continue;
      }

      // 3. Text Inputs
      const textInput = block.querySelector('input[type="text"], input[type="email"], input[type="number"], input[type="tel"], input[type="url"], input:not([type="radio"]):not([type="checkbox"]):not([type="date"]):not([type="time"]):not([type="hidden"])') as HTMLInputElement;
      if (textInput) {
        setNativeInputValue(textInput, answerText);
        filledCount++;
        continue;
      }

      // 4. Textareas
      const textarea = block.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        setNativeInputValue(textarea, answerText);
        filledCount++;
        continue;
      }

      // 5a. Checkboxes (Multi-Select Support)
      const checkboxes = block.querySelectorAll('div[role="checkbox"]');
      if (checkboxes.length > 0) {
        const targetValues = answerText
          .split(/[,;\n•]+/)
          .map(s => s.toLowerCase().trim())
          .filter(Boolean);

        let anyChecked = false;
        checkboxes.forEach(cb => {
          const val = (cb.getAttribute('data-value') || cb.getAttribute('aria-label') || cb.textContent || '').toLowerCase().trim();
          const matches = targetValues.some(tv => val === tv || (tv.length >= 3 && (val.includes(tv) || tv.includes(val))));
          if (matches) {
            const isChecked = cb.getAttribute('aria-checked') === 'true';
            if (!isChecked) {
              (cb as HTMLElement).click();
            }
            anyChecked = true;
          }
        });
        if (anyChecked) {
          filledCount++;
        } else {
          skippedCount++;
        }
        continue;
      }

      // 5b. Radio Buttons & Linear Scale (Single-Choice Select)
      const radios = block.querySelectorAll('div[role="radio"]');
      if (radios.length > 0) {
        const normAns = answerText.toLowerCase().trim();
        let matchedRadio: HTMLElement | null = null;

        // Pass 1: exact match
        radios.forEach(opt => {
          const val = (opt.getAttribute('data-value') || opt.getAttribute('aria-label') || opt.textContent || '').toLowerCase().trim();
          if (val && val === normAns) {
            matchedRadio = opt as HTMLElement;
          }
        });

        // Pass 2: fallback substring if length >= 3
        if (!matchedRadio && normAns.length >= 3) {
          radios.forEach(opt => {
            const val = (opt.getAttribute('data-value') || opt.getAttribute('aria-label') || opt.textContent || '').toLowerCase().trim();
            if (val && val.length >= 3 && (normAns.includes(val) || val.includes(normAns))) {
              if (!matchedRadio) matchedRadio = opt as HTMLElement;
            }
          });
        }

        if (matchedRadio) {
          const isChecked = (matchedRadio as HTMLElement).getAttribute('aria-checked') === 'true';
          if (!isChecked) {
            (matchedRadio as HTMLElement).click();
          }
          filledCount++;
        } else {
          skippedCount++;
        }
        continue;
      }

      // 6. Dropdowns with Bounded Async Wait
      const listbox = block.querySelector('div[role="listbox"]');
      if (listbox) {
        const selected = await selectDropdownOption(block, answerText);
        if (selected) {
          filledCount++;
        } else {
          skippedCount++;
        }
        continue;
      }

      // If we reach here, field was unsupported
      skippedCount++;
    }

    if (skippedCount > 0) {
      toastMessage(`Autofill complete: ${filledCount} fields filled, ${skippedCount} skipped for manual review.`);
    } else {
      toastMessage(`Form autofilled: all ${filledCount} fields completed!`);
    }
  };

  function toastMessage(msg: string) {
    const t = document.createElement('div');
    t.innerText = msg;
    t.style.position = 'fixed';
    t.style.bottom = '20px';
    t.style.right = '20px';
    t.style.background = '#10B981';
    t.style.color = 'white';
    t.style.padding = '12px 24px';
    t.style.borderRadius = '8px';
    t.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    t.style.fontWeight = '500';
    t.style.zIndex = '999999';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  const handleClose = () => {
    if (rootNode) {
      rootNode.unmount();
      rootNode = null;
    }
    if (container) {
      container.remove();
    }
  };

  rootNode.render(
    <React.StrictMode>
      <ReviewPanel answers={answers} onFill={handleFill} onClose={handleClose} />
    </React.StrictMode>
  );
}
