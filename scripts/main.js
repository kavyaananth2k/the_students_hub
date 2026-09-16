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
  // 2. Mobile Navigation Toggle
  // -------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when direct (non-dropdown) nav links are clicked
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach((link) => {
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
      const isAlreadyOpen = wrapper.classList.contains('open');

      // If not yet open, reveal the dropdown menu first so user can choose an item
      if (!isAlreadyOpen) {
        event.preventDefault();
        event.stopPropagation();

        // Close any other open dropdowns
        navDropdownWrappers.forEach((item) => {
          item.classList.remove('open');
          const itemTrigger = item.querySelector('.dropdown-toggle') || item.querySelector('.nav-link');
          if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
        });

        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        // If already open on mobile screen, toggle closed
        if (window.innerWidth <= 768) {
          event.preventDefault();
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close when clicking any dropdown item and close mobile menu
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
    }
  });

  // -------------------------------------------------------------
  // 3. Free Trial / Diagnostic Assessment Modal
  // -------------------------------------------------------------
  const trialModal = document.getElementById('trial-modal');
  const trialCloseBtn = document.getElementById('trial-modal-close');
  const trialTriggers = document.querySelectorAll('.trial-modal-trigger');
  const trialForm = document.getElementById('trial-form');

  function openTrialModal() {
    if (trialModal) {
      trialModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeTrialModal() {
    if (trialModal) {
      trialModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  trialTriggers.forEach((btn) => btn.addEventListener('click', openTrialModal));
  if (trialCloseBtn) trialCloseBtn.addEventListener('click', closeTrialModal);

  if (trialModal) {
    trialModal.addEventListener('click', (e) => {
      if (e.target === trialModal) closeTrialModal();
    });
  }

  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('trial-parent-name')?.value || 'Parent';
      const studentName = document.getElementById('trial-student-name')?.value || 'Student';
      const subject = document.getElementById('trial-subject')?.value || 'Tuition';

      closeTrialModal();
      trialForm.reset();

      window.showHubToast(
        `Thank you ${parentName}! Free trial assessment booked for ${studentName} (${subject}). Our academic advisor will contact you within 2 business hours.`
      );
    });
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

      // Safe lookup for all main sections (supports digit-prefixed IDs like 11plus, 13plus)
      const sectionIds = ['ks2', 'ks3', 'gcse', '11plus', '13plus', 'alevel', 'stem'];
      sectionIds.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec) sectionObserver.observe(sec);
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
});

