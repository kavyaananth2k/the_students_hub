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

    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

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
});
