/* ================================================================
   BRAVO LAWN CARE LLC — main.js
   Built by Faery Tech (faerytech.net)

   What this file does:
   1. Smooth active state on nav links as user scrolls
   2. Navbar shrinks slightly when user scrolls down
   3. Fade-in animation on service cards as they enter viewport
   4. Form submission feedback (success/error message)
================================================================ */


/* ================================================================
   1. SCROLL SPY — highlight active nav link based on scroll position
   Watches which section is currently in view and adds .active
   class to the matching nav link.
================================================================ */

function updateActiveNavLink() {
  /* All the sections that have corresponding nav links */
  const sections = document.querySelectorAll('section[id], div[id]');
  /* All nav links that point to a # anchor */
  const navLinks = document.querySelectorAll('.site-nav .nav-link[href^="#"]');

  let currentSectionId = '';

  sections.forEach(function(section) {
    const sectionTop = section.offsetTop - 100; /* 100px offset so it triggers a bit before the section */
    if (window.scrollY >= sectionTop) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(function(link) {
    link.classList.remove('active');
    /* If this link's href matches the current section, highlight it */
    if (link.getAttribute('href') === '#' + currentSectionId) {
      link.classList.add('active');
    }
  });
}

/* Run on scroll */
window.addEventListener('scroll', updateActiveNavLink);
/* Run once on load to set initial state */
updateActiveNavLink();


/* ================================================================
   2. NAVBAR SHRINK ON SCROLL
   Adds .nav-scrolled class to nav when user scrolls past 60px.
   The CSS can use this to shrink padding, change opacity, etc.
   Currently adds a slightly stronger shadow as a subtle effect.
================================================================ */

const siteNav = document.querySelector('.site-nav');

window.addEventListener('scroll', function() {
  if (window.scrollY > 60) {
    siteNav.classList.add('nav-scrolled');
  } else {
    siteNav.classList.remove('nav-scrolled');
  }
});

/* Add the scrolled style directly — keeps it self-contained in JS */
const navScrollStyle = document.createElement('style');
navScrollStyle.textContent = `
  .nav-scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(navScrollStyle);


/* ================================================================
   3. FADE-IN ON SCROLL (Intersection Observer)
   Service cards and why-items animate in when they enter the
   viewport. Uses IntersectionObserver (no jQuery needed).

   Elements with class .fade-on-scroll start invisible and
   slide up when they come into view.
================================================================ */

/* Add the base invisible state via JS so it only applies when JS is on */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-on-scroll {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);

/* Mark the elements we want to animate */
const animatedElements = document.querySelectorAll(
  '.service-card, .why-item, .contact-card'
);
animatedElements.forEach(function(el) {
  el.classList.add('fade-on-scroll');
});

/* Create the observer */
const fadeObserver = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        /* Stop observing once it's visible — no need to re-animate */
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15, /* Trigger when 15% of the element is visible */
  }
);

animatedElements.forEach(function(el) {
  fadeObserver.observe(el);
});


/* ================================================================
   4. QUOTE FORM — SUBMISSION FEEDBACK
   Shows a success or error message after the form is submitted.

   NOTE: This handles the visual feedback only.
   The actual form submission goes to whatever action= is set
   on the form (Formspree, mailto, etc.).

   If using Formspree with AJAX in the future, swap out the
   standard form submit for a fetch() call here.
================================================================ */

const quoteForm = document.querySelector('.quote-form form');

if (quoteForm) {
  quoteForm.addEventListener('submit', function(e) {
    /* Only intercept if we're using a real endpoint */
    const action = quoteForm.getAttribute('action');

    /* If the endpoint is still the placeholder, warn in console */
    if (!action || action === 'REPLACE_WITH_ENDPOINT') {
      console.warn('Faery Tech: Form action is not set. Update the action= attribute in index.html.');
      /* Don't block the submit in case they want it to fail gracefully */
      return;
    }

    /* If a real endpoint is set, show a "sending" state on the button */
    const submitBtn = quoteForm.querySelector('.btn-quote');
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    /* Note: if using Formspree's standard POST, the page will redirect
       to Formspree's thank-you page. To stay on the page, use Formspree's
       AJAX mode and handle the response with fetch() here instead. */
  });
}