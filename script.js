/* ============================================================
   GREAT BOOKS PORTFOLIO — JavaScript
   Features: Navigation, Scroll Spy, Modals, Animations
   ============================================================ */

'use strict';

// ── DOM References ──────────────────────────────────────────
const sidebar    = document.getElementById('sidebar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');
const cards      = document.querySelectorAll('.analysis-card');
const modals     = document.querySelectorAll('.modal-overlay');
const closeButtons = document.querySelectorAll('.modal-close');

// ── Hamburger / Mobile Menu ─────────────────────────────────
hamburger.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close sidebar on nav link click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Scroll Spy (Active Nav Highlighting) ───────────────────
const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      setActiveNav(id);
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

function setActiveNav(sectionId) {
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === sectionId);
  });
}

// Smooth scroll on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Fade-In on Scroll ───────────────────────────────────────
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ── Analysis Card Modals ────────────────────────────────────

// Open modal on card click
cards.forEach(card => {
  card.addEventListener('click', () => {
    const cardId = card.getAttribute('id').replace('card-', '');
    openModal(`modal-${cardId}`);
  });

  // Keyboard accessibility
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const cardId = card.getAttribute('id').replace('card-', '');
      openModal(`modal-${cardId}`);
    }
  });
});

// Open modal function
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus first focusable element inside modal
  const focusable = modal.querySelector('button, [tabindex="0"]');
  if (focusable) setTimeout(() => focusable.focus(), 100);

  // Store which card triggered the modal (for returning focus)
  const cardNum = modalId.replace('modal-', '');
  modal.dataset.triggeredBy = `card-${cardNum}`;
}

// Close modal on X button
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal-overlay');
    closeModal(modal);
  });
});

// Close modal on overlay click
modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal-overlay.open');
    if (openModal) closeModal(openModal);
  }
});

// Close modal function
function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';

  // Return focus to trigger card
  const triggeredBy = modal.dataset.triggeredBy;
  if (triggeredBy) {
    const card = document.getElementById(triggeredBy);
    if (card) card.focus();
  }
}

// ── Scroll-Based Hero Parallax (subtle) ─────────────────────
const homeSection = document.getElementById('home');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (homeSection && scrollY < window.innerHeight) {
    const offset = scrollY * 0.3;
    homeSection.style.backgroundPositionY = `${offset}px`;
  }
}, { passive: true });

// ── Page Load: trigger initial visible elements ─────────────
window.addEventListener('load', () => {
  // Trigger fade-in for elements already in view
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });

  // Set initial active nav
  setActiveNav('home');
});

// ── Typewriter effect on profile name (subtle) ─────────────
function initTypewriter() {
  const heading = document.querySelector('#profile-heading');
  if (!heading) return;

  const originalText = heading.innerHTML;
  heading.innerHTML = '';
  heading.style.minHeight = '1.25em';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalText;
  const textContent = tempDiv.textContent;

  let i = 0;
  const interval = setInterval(() => {
    if (i < textContent.length) {
      heading.textContent = textContent.slice(0, i + 1);
      i++;
    } else {
      heading.innerHTML = originalText;
      clearInterval(interval);
    }
  }, 40);
}

// Run typewriter after a brief delay
setTimeout(initTypewriter, 600);

// ── Reading Progress Bar ─────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'reading-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #2d5a3d, #7a9e87, #c8a84b);
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  progressBar.style.width = `${Math.min(scrolled, 100)}%`;
}, { passive: true });

// ── Back-to-Top on Logo Click ────────────────────────────────
const sidebarLogo = document.querySelector('.sidebar-logo');
if (sidebarLogo) {
  sidebarLogo.style.cursor = 'pointer';
  sidebarLogo.addEventListener('click', () => {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });
}

console.log('%c📖 My Literary Journey — Great Books Portfolio', 'color: #2d5a3d; font-size: 14px; font-weight: bold;');
console.log('%cCasungcad, Carla D. | BS Information Technology | GEC-GB-NRt 1561', 'color: #7a9e87; font-size: 11px;');
