/**
 * The Students Hub - Main Application Script
 * Navigation, Trial Modal, Grade Calculator, Testimonial Toggles, and Toast Notifications
 */

// Global Toast System
window.showHubToast = function (message) {
  let container = document.getElementById('hub-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'hub-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#34d399" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
};

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Sticky Navigation & Header Scroll State
  // -------------------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // -------------------------------------------------------------
  // 2. Mobile Navigation Toggle & Dropdown Flow
  // -------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when nav links are clicked
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const navDropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
  navDropdownWrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector('.dropdown-toggle') || wrapper.querySelector('.nav-link');
    const dropdownMenu = wrapper.querySelector('.nav-dropdown-menu');

    if (!trigger) return;

    // Handle touch & click on the dropdown trigger
    trigger.addEventListener('click', (event) => {
      const isMobile = window.innerWidth <= 1140;

      // On mobile screens, tapping toggles the accordion
      if (isMobile) {
        event.preventDefault();
        event.stopPropagation();
        const isAlreadyOpen = wrapper.classList.contains('open');

        // Close any other open dropdowns
        navDropdownWrappers.forEach((item) => {
          item.classList.remove('open');
          const itemTrigger = item.querySelector('.dropdown-toggle') || item.querySelector('.nav-link');
          if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
        });

        if (!isAlreadyOpen) {
          wrapper.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
      // On desktop, hover handles revealing the menu and clicking navigates directly
    });

    // Close when clicking any dropdown item
    if (dropdownMenu) {
      dropdownMenu.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          if (navMenu) {
            navMenu.classList.remove('open');
            mobileToggle?.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  });

  // Global click/touch outside to close dropdowns
  document.addEventListener('click', (event) => {
    navDropdownWrappers.forEach((wrapper) => {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.dropdown-toggle') || wrapper.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Escape key closes dropdown
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navDropdownWrappers.forEach((wrapper) => {
        wrapper.classList.remove('open');
        const trigger = wrapper.querySelector('.dropdown-toggle') || wrapper.querySelector('.nav-link');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
          trigger.blur();
        }
      });
      closeTrialModal();
    }
  });

  // Automatically update active nav link state across all pages
  function syncNavActiveLinks() {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const currentPath = rawPath === '' ? 'index.html' : rawPath;

    const codingHashes = ['#stem', '#scratch', '#webdesign', '#gamedev', '#python', '#javascript', '#canva', '#cybersecurity', '#robotics', '#ai', '#arduino', '#raspberrypi', '#microbit'];

    document.querySelectorAll('#primary-nav .nav-link').forEach((link) => {
      const id = link.id;

      if (id === 'coding-courses-nav') {
        if (currentPath === 'coding.html') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
        return;
      }

      if (id === 'academic-tuition-nav') {
        if (currentPath === 'courses.html' && currentHash !== '#fees' && currentHash !== '#schedule') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
        return;
      }

      if (id === 'services-nav') {
        if (currentPath === 'guidance.html') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
        return;
      }

      if (id === 'fees-schedule-nav') {
        if (currentPath === 'courses.html' && (currentHash === '#fees' || currentHash === '#schedule')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
        return;
      }

      if (id === 'free-resources-nav') {
        if (currentPath === 'shop.html') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
        return;
      }

      const href = link.getAttribute('href');
      if (!href) return;

      const [linkFile, linkHash] = href.split('#');
      const normalizedLinkFile = linkFile || currentPath;

      if (linkHash) {
        if (currentHash === '#' + linkHash && normalizedLinkFile === currentPath) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } else if (normalizedLinkFile === currentPath && !currentHash) {
        link.classList.add('active');
      } else if (normalizedLinkFile !== currentPath) {
        link.classList.remove('active');
      }
    });
  }

  syncNavActiveLinks();
  window.addEventListener('hashchange', syncNavActiveLinks);

  // Coding courses filter buttons click & scroll spy handling
  const codingFilterBtns = document.querySelectorAll('.coding-filter-btn');
  const codingCards = document.querySelectorAll('.coding-card');

  if (codingFilterBtns.length > 0 && codingCards.length > 0) {
    codingFilterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            codingFilterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            targetEl.scrollIntoView({ behavior: 'smooth' });
            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
          }
        }
      });
    });

    const updateActiveCodingFilter = () => {
      const scrollPos = window.scrollY + 220;
      let currentCardId = '';
      codingCards.forEach((card) => {
        const top = card.offsetTop;
        const height = card.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentCardId = card.getAttribute('id');
        }
      });
      if (currentCardId) {
        codingFilterBtns.forEach((btn) => {
          if (btn.getAttribute('href') === `#${currentCardId}`) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    };

    window.addEventListener('scroll', updateActiveCodingFilter, { passive: true });
    updateActiveCodingFilter();
  }

  // -------------------------------------------------------------
  // 3. Free Trial / Diagnostic Assessment Modal
  // -------------------------------------------------------------
  function ensureTrialModalElement() {
    let modal = document.getElementById('trial-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-backdrop';
      modal.id = 'trial-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'trial-modal-title');
      modal.innerHTML = `
        <div class="modal-window">
          <div class="modal-header">
            <h3 class="modal-title" id="trial-modal-title">Book a Free Assessment</h3>
            <button class="modal-close-btn" id="trial-modal-close" aria-label="Close dialog">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
              Claim a 100% free, no-obligation 45-minute diagnostic assessment. We evaluate baseline knowledge, highlight exam strengths, and recommend a bespoke learning plan.
            </p>
            <form id="trial-form">
              <div class="form-group">
                <label class="form-label" for="trial-parent-name">Parent / Guardian Full Name *</label>
                <input type="text" id="trial-parent-name" class="form-control" placeholder="e.g. Sarah Jenkins" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="trial-student-name">Student Full Name *</label>
                <input type="text" id="trial-student-name" class="form-control" placeholder="e.g. James Jenkins" required>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="trial-email">Contact Email *</label>
                  <input type="email" id="trial-email" class="form-control" placeholder="parent@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="trial-phone">Contact Phone *</label>
                  <input type="tel" id="trial-phone" class="form-control" placeholder="07405 860115" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="trial-subject">Target Academic Programme / Course *</label>
                <select id="trial-subject" class="form-control" required>
              <option value="" disabled selected>Select an academic programme or coding course...</option>

              <optgroup label="── Academic Tuition Programmes ──">
                <option value="Academic Tuition">All Academic Tuition Programmes (General Inquiry)</option>
                <option value="11+ Grammar Entrance Prep">11+ Grammar School Entrance Prep (GL &amp; CEM)</option>
                <option value="13+ Common Entrance Prep">13+ Common Entrance &amp; Scholarships</option>
                <option value="Key Stage 2 Maths &amp; English">Key Stage 2 (Years 3–6) Primary Tuition</option>
                <option value="Key Stage 3 Secondary Core">Key Stage 3 (Years 7–9) Secondary Core</option>
                <option value="GCSE / IGCSE Exam Mastery">GCSE / IGCSE Exam Preparation (Years 10–11)</option>
                <option value="A-Level / Sixth Form Tutoring">A-Level / Sixth Form Tutoring (Years 12–13)</option>
              </optgroup>

              <optgroup label="── Coding, AI &amp; STEM Courses (All 12 Modules) ──">
                <option value="Coding &amp; STEM">All Coding &amp; STEM Academy Courses (General Inquiry)</option>
                <option value="Coding in Scratch">Coding in Scratch (Ages 7–14)</option>
                <option value="Web Design">Web Design &amp; Development (Ages 10–16)</option>
                <option value="Game Development">Game Development with Python &amp; Arcade (Ages 10–16)</option>
                <option value="Coding in Python">Coding in Python &amp; Algorithms (Ages 10–16)</option>
                <option value="Coding in JavaScript">Coding in JavaScript &amp; Web Apps (Ages 11–16)</option>
                <option value="Designing Using Canva">Designing Using Canva &amp; Digital Media (Ages 8–16)</option>
                <option value="Cyber Security Essentials">Cyber Security Essentials &amp; Online Safety (Ages 10–16)</option>
                <option value="Robotics">Robotics &amp; Physical Computing (Ages 8–14)</option>
                <option value="Artificial Intelligence">Artificial Intelligence &amp; Machine Learning (Ages 11–16)</option>
                <option value="Programming with Arduino">Programming with Arduino &amp; Circuits (Ages 11–16)</option>
                <option value="Raspberry Pi Projects">Raspberry Pi Projects &amp; Linux (Ages 11–16)</option>
                <option value="BBC Micro:bit Programming">BBC Micro:bit Programming (Ages 8–14)</option>
              </optgroup>

              <optgroup label="── Primary Academic Subjects (KS2) ──">
                <option value="Year 3 Maths">Year 3 Primary Maths</option>
                <option value="Year 3 English">Year 3 Primary English</option>
                <option value="Year 4 Maths">Year 4 Primary Maths</option>
                <option value="Year 4 English">Year 4 Primary English</option>
                <option value="Year 5 Maths">Year 5 Primary Maths</option>
                <option value="Year 5 English">Year 5 Primary English</option>
                <option value="Year 6 Maths">Year 6 Primary Maths &amp; SATs</option>
                <option value="Year 6 English">Year 6 Primary English &amp; SATs</option>
              </optgroup>

              <optgroup label="── Secondary Academic Subjects (KS3) ──">
                <option value="Year 7 Maths">Year 7 Secondary Maths</option>
                <option value="Year 7 English">Year 7 Secondary English</option>
                <option value="Year 7 Science">Year 7 Secondary Science</option>
                <option value="Year 7 Computer Science">Year 7 Computer Science</option>
                <option value="Year 8 Maths">Year 8 Secondary Maths</option>
                <option value="Year 8 English">Year 8 Secondary English</option>
                <option value="Year 8 Science">Year 8 Secondary Science</option>
                <option value="Year 8 Computer Science">Year 8 Computer Science</option>
                <option value="Year 9 Maths">Year 9 Secondary Maths</option>
                <option value="Year 9 English">Year 9 Secondary English</option>
                <option value="Year 9 Science">Year 9 Secondary Science</option>
                <option value="Year 9 Computer Science">Year 9 Computer Science</option>
              </optgroup>

              <optgroup label="── GCSE &amp; IGCSE Exam Preparation ──">
                <option value="Year 10 Maths">Year 10 Maths (GCSE / IGCSE)</option>
                <option value="Year 10 English">Year 10 English (Language &amp; Literature)</option>
                <option value="Year 10 Science">Year 10 Science (Biology, Chemistry, Physics)</option>
                <option value="Year 10 Computer Science">Year 10 Computer Science</option>
                <option value="Year 11 Maths">Year 11 Maths (GCSE Exam Prep)</option>
                <option value="Year 11 English">Year 11 English (GCSE Exam Prep)</option>
                <option value="Year 11 Science">Year 11 Science (GCSE Exam Prep)</option>
                <option value="Year 11 Computer Science">Year 11 Computer Science (GCSE Exam Prep)</option>
              </optgroup>

              <optgroup label="── 11+ &amp; 13+ Entrance Exam Subjects ──">
                <option value="11+ Mathematics">11+ Mathematics &amp; Numerical Reasoning</option>
                <option value="11+ English">11+ English &amp; Creative Writing</option>
                <option value="11+ Verbal Reasoning">11+ Verbal Reasoning</option>
                <option value="11+ Non-Verbal Reasoning">11+ Non-Verbal Reasoning</option>
                <option value="13+ Mathematics">13+ Mathematics</option>
                <option value="13+ English (Reading &amp; Writing)">13+ English (Reading &amp; Writing)</option>
                <option value="13+ Verbal Reasoning">13+ Verbal Reasoning</option>
                <option value="13+ Non-Verbal Reasoning">13+ Non-Verbal Reasoning</option>
              </optgroup>

              <optgroup label="── A-Level &amp; Sixth Form Subjects ──">
                <option value="A-Level Mathematics">A-Level Mathematics</option>
                <option value="A-Level Further Mathematics">A-Level Further Mathematics</option>
                <option value="A-Level Biology">A-Level Biology</option>
                <option value="A-Level Chemistry">A-Level Chemistry</option>
                <option value="A-Level Physics">A-Level Physics</option>
              </optgroup>
            </select>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
                Confirm Free Assessment Booking
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    return modal;
  }

  function openTrialModal(e, triggerEl) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const modal = ensureTrialModalElement();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Auto-select subject if triggered from a specific subject/course card
    const trigger = triggerEl || (e && e.target ? e.target.closest('.trial-modal-trigger, a[href$="#trial"], a[href$="#trial-modal"]') : null);
    if (trigger && trigger.dataset && trigger.dataset.subject) {
      const subjectSelect = modal.querySelector('#trial-subject');
      if (subjectSelect) {
        const val = trigger.dataset.subject.trim();
        // Prioritize exact match, then fall back to includes
        for (let i = 0; i < subjectSelect.options.length; i++) {
          const opt = subjectSelect.options[i];
          if (opt.value && opt.value.toLowerCase() === val.toLowerCase()) {
            opt.selected = true;
            matched = true;
            break;
          }
        }
        if (!matched) {
          for (let i = 0; i < subjectSelect.options.length; i++) {
            const opt = subjectSelect.options[i];
            if (opt.value && (opt.value.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(opt.value.toLowerCase()))) {
              opt.selected = true;
              matched = true;
              break;
            }
          }
        }
        if (!matched && val) {
          const newOpt = new Option(val, val, true, true);
          subjectSelect.add(newOpt);
        }
      }
    }

    const closeBtn = modal.querySelector('#trial-modal-close');
    if (closeBtn && !closeBtn._hasCloseBound) {
      closeBtn.addEventListener('click', closeTrialModal);
      closeBtn._hasCloseBound = true;
    }

    if (!modal._hasBackdropBound) {
      modal.addEventListener('click', (ev) => {
        if (ev.target === modal) closeTrialModal();
      });
      modal._hasBackdropBound = true;
    }

    const form = modal.querySelector('#trial-form');
    if (form && !form._hasSubmitBound) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const parentName = document.getElementById('trial-parent-name')?.value || 'Parent';
        const studentName = document.getElementById('trial-student-name')?.value || 'Student';
        const subject = document.getElementById('trial-subject')?.value || 'Tuition';

        closeTrialModal();
        form.reset();

        window.showHubToast(
          `Thank you ${parentName}! Free trial assessment booked for ${studentName} (${subject}). Our academic advisor will contact you within 2 business hours.`
        );
      });
      form._hasSubmitBound = true;
    }
  }

  function closeTrialModal() {
    const modal = document.getElementById('trial-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Handle all Free Trial button triggers (header, floating, cards)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.trial-modal-trigger, a[href$="#trial"], a[href$="#trial-modal"]');
    if (trigger) {
      e.preventDefault();
      openTrialModal(e, trigger);
    }
  });

  // Open modal if page loaded with #trial hash
  if (window.location.hash === '#trial' || window.location.hash === '#trial-modal') {
    setTimeout(openTrialModal, 300);
  }

  // -------------------------------------------------------------
  // 4. Interactive Grade Booster Roadmap Calculator
  // -------------------------------------------------------------
  const calcYear = document.getElementById('calc-year');
  const calcSubject = document.getElementById('calc-subject');
  const calcCurrent = document.getElementById('calc-current');
  const calcTarget = document.getElementById('calc-target');
  const targetGradeDisplay = document.getElementById('calc-target-display');
  const calcRoadmap = document.getElementById('calc-roadmap-desc');

  function updateGradeCalculator() {
    if (!calcCurrent || !calcTarget || !targetGradeDisplay || !calcRoadmap) return;

    const currentVal = calcCurrent.value;
    const targetVal = calcTarget.value;
    const subject = calcSubject ? calcSubject.value : 'Subject';

    targetGradeDisplay.textContent = targetVal;

    let strategy = '';
    if (targetVal.includes('9') || targetVal.includes('A*') || targetVal.includes('Grammar')) {
      strategy = `Targeting top 5% performance in ${subject}. Recommended plan: 2 hours weekly 1-to-1 masterclass + bi-weekly timed exam mocks with personalized error analytics.`;
    } else if (targetVal.includes('8') || targetVal.includes('A')) {
      strategy = `Excellent progression from ${currentVal} to ${targetVal}. Recommended plan: 1.5 hours weekly intensive mastery + targeted exam technique worksheets.`;
    } else {
      strategy = `Structured core reinforcement plan for ${subject}. Focus on foundational key concepts, confidence-building drills, and homework review.`;
    }

    calcRoadmap.textContent = strategy;
  }

  if (calcYear) calcYear.addEventListener('change', updateGradeCalculator);
  if (calcSubject) calcSubject.addEventListener('change', updateGradeCalculator);
  if (calcCurrent) calcCurrent.addEventListener('change', updateGradeCalculator);
  if (calcTarget) calcTarget.addEventListener('change', updateGradeCalculator);

  // Run initial calculator evaluation
  updateGradeCalculator();

  // -------------------------------------------------------------
  // 5. Interactive FAQ Accordion
  // -------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach((item) => {
    const headerBtn = item.querySelector('.faq-header');
    headerBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((i) => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // -------------------------------------------------------------
  // 6. Contact Form Submission (if on contact page)
  // -------------------------------------------------------------
  const contactForm = document.getElementById('hub-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Parent';
      contactForm.reset();
      window.showHubToast(
        `Thank you ${name}! Your enquiry has been received. One of our academy coordinators will call you shortly.`
      );
    });
  }

  // -------------------------------------------------------------
  // 7. Interactive Curriculum Navigation & Smooth Scroll Flow
  // -------------------------------------------------------------
  function setupCurriculumFlow() {
    // Ensure all year panels and cards are visible for a continuous, seamless flow
    const allYearPanels = document.querySelectorAll('.curriculum-year-panel, .gcse-year-panel');
    allYearPanels.forEach((panel) => {
      panel.classList.add('active');
      panel.style.display = 'block';
    });

    const allCards = document.querySelectorAll('.curriculum-subject-card, .gcse-subject-card');
    allCards.forEach((card) => {
      card.style.display = 'flex';
    });

    // Helper to safely get an element by ID or selector without throwing SyntaxErrors on digit-prefixed IDs (e.g. #11plus, #13plus)
    function safeGetElement(selectorOrId) {
      if (!selectorOrId || selectorOrId === '#') return null;
      if (selectorOrId.startsWith('#')) {
        const id = selectorOrId.slice(1);
        return document.getElementById(id);
      }
      try {
        return document.querySelector(selectorOrId);
      } catch (e) {
        return null;
      }
    }

    // Helper to smooth scroll to target with proper offset and pulse animation
    function scrollToTarget(targetId) {
      if (!targetId || targetId === '#') return;
      const targetElem = safeGetElement(targetId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetElem.classList.add('card-highlight-pulse');
        setTimeout(() => targetElem.classList.remove('card-highlight-pulse'), 1600);
      }
    }

    // Handle Year Navigation clicks (KS2, KS3, GCSE, 11+, 13+)
    const yearBtns = document.querySelectorAll('.curriculum-year-btn, .gcse-year-btn');
    yearBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        const dataYear = btn.getAttribute('data-year');
        const targetId = href || (dataYear ? `#${dataYear}` : null);

        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          scrollToTarget(targetId);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, targetId);
          }

          // Update active button in this switcher
          const parentNav = btn.closest('.curriculum-year-switcher, .gcse-year-switcher');
          if (parentNav) {
            parentNav.querySelectorAll('.curriculum-year-btn, .gcse-year-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
          }
        }
      });
    });

    // Handle Subject Navigation clicks
    const subjectBtns = document.querySelectorAll('.curriculum-subject-btn, .gcse-subject-btn');
    subjectBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        const filter = btn.getAttribute('data-filter');

        let targetId = href && href.startsWith('#') ? href : null;
        if (!targetId && filter && filter !== 'all') {
          const parentBlock = btn.closest('.curriculum-year-panel, .gcse-year-panel, .section');
          const targetCard = parentBlock ? parentBlock.querySelector(`[data-subject="${filter}"]`) : null;
          if (targetCard && targetCard.id) {
            targetId = '#' + targetCard.id;
          }
        } else if (!targetId && filter === 'all') {
          const parentBlock = btn.closest('.curriculum-year-panel, .gcse-year-panel, .section');
          if (parentBlock && parentBlock.id) {
            targetId = '#' + parentBlock.id;
          }
        }

        if (targetId && targetId !== '#') {
          e.preventDefault();
          scrollToTarget(targetId);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, targetId);
          }

          // Update active button in this subject bar
          const parentNav = btn.closest('.curriculum-subject-nav, .gcse-subject-nav');
          if (parentNav) {
            parentNav.querySelectorAll('.curriculum-subject-btn, .gcse-subject-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
          }
        }
      });
    });

    // Handle Top Chips Navigation clicks (.nav-strip .chip)
    const chips = document.querySelectorAll('.nav-strip .chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const href = chip.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          scrollToTarget(href);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, href);
          }
          chips.forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
        }
      });
    });

    // Scrollspy: Automatically sync active navigation buttons as the user scrolls
    if ('IntersectionObserver' in window) {
      // 1. Observe main curriculum sections for top nav-strip chips
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const secId = entry.target.getAttribute('id');
              if (secId) {
                chips.forEach((chip) => {
                  if (chip.getAttribute('href') === `#${secId}`) {
                    chip.classList.add('active');
                  } else {
                    chip.classList.remove('active');
                  }
                });
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: '-130px 0px -65% 0px' }
      );

      // Safe lookup for all main sections and any nav-strip chips
      const sectionIds = ['ks2', 'ks3', 'gcse', '11plus', '13plus', 'alevel', 'stem', 'school-partnership', 'academic-guidance', 'grammar-schools', 'revision-workshops', 'booster-classes', 'career-guidance'];
      sectionIds.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec) sectionObserver.observe(sec);
      });
      chips.forEach((chip) => {
        const targetId = chip.getAttribute('href')?.replace('#', '');
        if (targetId) {
          const sec = document.getElementById(targetId);
          if (sec) sectionObserver.observe(sec);
        }
      });

      // 2. Observe year panels to sync Year switcher buttons
      const yearObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const yearId = entry.target.id;
              if (yearId) {
                const matchedBtn = document.querySelector(`.curriculum-year-btn[href="#${yearId}"], .gcse-year-btn[href="#${yearId}"], .curriculum-year-btn[data-year="${yearId}"], .gcse-year-btn[data-year="${yearId}"]`);
                if (matchedBtn) {
                  const switcher = matchedBtn.closest('.curriculum-year-switcher, .gcse-year-switcher');
                  if (switcher) {
                    switcher.querySelectorAll('.curriculum-year-btn, .gcse-year-btn').forEach((b) => b.classList.remove('active'));
                    matchedBtn.classList.add('active');
                  }
                }
              }
            }
          });
        },
        { threshold: 0.15, rootMargin: '-140px 0px -55% 0px' }
      );

      allYearPanels.forEach((panel) => {
        if (panel.id) yearObserver.observe(panel);
      });

      // 3. Observe subject cards to sync panel subject buttons & module switchers
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target;
              const cardId = card.id;
              const parentPanel = card.closest('.curriculum-year-panel, .gcse-year-panel, .section');
              if (parentPanel && cardId) {
                const subjectNav = parentPanel.querySelector('.curriculum-subject-nav, .gcse-subject-nav');
                if (subjectNav) {
                  const matchedSubjectBtn = subjectNav.querySelector(`[href="#${cardId}"]`);
                  if (matchedSubjectBtn) {
                    subjectNav.querySelectorAll('.curriculum-subject-btn, .gcse-subject-btn').forEach((b) => b.classList.remove('active'));
                    matchedSubjectBtn.classList.add('active');
                  }
                }

                // Also sync any module switcher buttons targeting this card (e.g. #btn-11plus-maths)
                const switcher = parentPanel.querySelector('.curriculum-year-switcher');
                if (switcher) {
                  const matchedSwitcherBtn = switcher.querySelector(`[href="#${cardId}"]`);
                  if (matchedSwitcherBtn) {
                    switcher.querySelectorAll('.curriculum-year-btn').forEach((b) => b.classList.remove('active'));
                    matchedSwitcherBtn.classList.add('active');
                  }
                }
              }
            }
          });
        },
        { threshold: 0.35, rootMargin: '-140px 0px -40% 0px' }
      );

      allCards.forEach((card) => {
        if (card.id) cardObserver.observe(card);
      });

      // 4. Observe panel/section headers to reset to "ALL SUBJECTS" when at top of section
      const headerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const header = entry.target;
              const parentPanel = header.closest('.curriculum-year-panel, .gcse-year-panel, .section');
              if (parentPanel) {
                const subjectNav = parentPanel.querySelector('.curriculum-subject-nav, .gcse-subject-nav');
                if (subjectNav) {
                  const allBtn = subjectNav.querySelector('a:first-child');
                  if (allBtn) {
                    subjectNav.querySelectorAll('.curriculum-subject-btn, .gcse-subject-btn').forEach((b) => b.classList.remove('active'));
                    allBtn.classList.add('active');
                  }
                }
              }
            }
          });
        },
        { threshold: 0.5, rootMargin: '-120px 0px -50% 0px' }
      );

      document.querySelectorAll('.curriculum-panel-header, .gcse-panel-header').forEach((h) => headerObserver.observe(h));
    }

    // Deep linking on initial load & hashchange
    function handleInitialHash() {
      const hash = window.location.hash;
      if (!hash) return;
      setTimeout(() => scrollToTarget(hash), 150);
    }

    handleInitialHash();
    window.addEventListener('hashchange', handleInitialHash);
  }

  setupCurriculumFlow();

  // setupCurriculumFlow completed
});

// -------------------------------------------------------------
// Floating Actions Controller (WhatsApp & Back to Top)
// Independent, fail-safe module ensuring 100% reliable functionality
// -------------------------------------------------------------
(function initFloatingActions() {
  function setupFloatingButtons() {
    try {
      // 1. WhatsApp Floating Button Check
      let waBtn = document.querySelector('.whatsapp-float');
      if (!waBtn) {
        waBtn = document.createElement('a');
        waBtn.href = 'https://wa.me/447424044851';
        waBtn.className = 'whatsapp-float';
        waBtn.target = '_blank';
        waBtn.rel = 'noopener noreferrer';
        waBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
        waBtn.setAttribute('title', 'Chat with us on WhatsApp');
        waBtn.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.82 2.41h-.01c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.18 8.18 0 0 1-1.25-4.36c0-4.54 3.7-8.24 8.27-8.24zm4.53 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.05.15 1.72-.71 1.96-1.39.24-.68.24-1.27.17-1.39-.07-.12-.25-.19-.5-.32z"/>
          </svg>
          <span class="whatsapp-float-tooltip">Chat with us</span>
        `;
        document.body.appendChild(waBtn);
      } else {
        waBtn.setAttribute('href', 'https://wa.me/447424044851');
        waBtn.setAttribute('target', '_blank');
        waBtn.setAttribute('rel', 'noopener noreferrer');
      }

      // 2. Back to Top Button Check & Scroll Behavior
      let backBtn = document.getElementById('back-to-top');
      if (!backBtn) {
        backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.id = 'back-to-top';
        backBtn.className = 'back-to-top-btn';
        backBtn.setAttribute('aria-label', 'Back to top');
        backBtn.setAttribute('title', 'Back to top');
        backBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          <span class="back-to-top-tooltip">Back to top</span>
        `;
        document.body.appendChild(backBtn);
      }

      // Cross-browser reliable scroll offset calculation
      function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      }

      function updateBackToTop() {
        if (!backBtn) return;
        if (getScrollTop() > 200) {
          backBtn.classList.add('visible');
        } else {
          backBtn.classList.remove('visible');
        }
      }

      window.addEventListener('scroll', updateBackToTop, { passive: true });
      window.addEventListener('resize', updateBackToTop, { passive: true });
      updateBackToTop();

      if (!backBtn._hasClickBound) {
        backBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          // Smooth scroll to top using the exact requirement
          try {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } catch (err) {
            window.scrollTo(0, 0);
          }

          if (document.documentElement && document.documentElement.scrollTop > 0) {
            try {
              document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
              document.documentElement.scrollTop = 0;
            }
          }
          if (document.body && document.body.scrollTop > 0) {
            document.body.scrollTop = 0;
          }
        });
        backBtn._hasClickBound = true;
      }
    } catch (e) {
      console.warn('Floating actions init notice:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFloatingButtons);
  } else {
    setupFloatingButtons();
  }
  window.addEventListener('load', setupFloatingButtons);
})();

