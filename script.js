// ====================
// Contact Form Handler with Spam Protection
// ====================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Spam protection: Max 2 submissions per browser session
const MAX_SUBMISSIONS = 2;
const SUBMISSION_KEY = 'contactFormSubmissions';

function checkSpamLimit() {
  const submissions = JSON.parse(sessionStorage.getItem(SUBMISSION_KEY)) || 0;
  return submissions < MAX_SUBMISSIONS;
}

function incrementSubmissionCount() {
  const submissions = JSON.parse(sessionStorage.getItem(SUBMISSION_KEY)) || 0;
  sessionStorage.setItem(SUBMISSION_KEY, JSON.stringify(submissions + 1));
}

// ⚠️  IMPORTANT: Replace 'YOUR_WEB3FORMS_ACCESS_KEY' below with your real key.
//     Get a free key at https://web3forms.com — just enter your email.
const WEB3FORMS_ACCESS_KEY = '66818d8b-131e-41b4-b763-80a2a7dcbf3b';

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // ← Prevents page reload (was missing before!)

  // Check spam limit
  if (!checkSpamLimit()) {
    formMessage.textContent = '✗ You have reached the maximum submissions for this session (2). Please try again later.';
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.classList.remove('error');
    }, 5000);
    return;
  }

  // Show loading state
  const submitButton = contactForm.querySelector('.submit-button');
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;

  try {
    // Build the form payload
    const formData = new FormData(contactForm);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    // Actually send the email via Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Success — increment count and show success message
      incrementSubmissionCount();
      formMessage.textContent = '✓ Message sent! I\'ll get back to you shortly.';
      formMessage.classList.add('success');
      formMessage.classList.remove('error');
      contactForm.reset();
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    // Something went wrong — show error, do NOT increment count
    console.error('Form submission error:', err);
    formMessage.textContent = '✗ Something went wrong. Please try again or email me directly.';
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
  } finally {
    // Always restore the button
    submitButton.textContent = 'Send Message';
    submitButton.disabled = false;

    // Auto-clear the message after 6 seconds
    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.classList.remove('success', 'error');
    }, 6000);
  }
});

// ====================
// Smooth Scrolling
// ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ====================
// Active Navigation Link
// ====================

window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ====================
// Scroll Animation
// ====================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const isCard = element.classList.contains('highlight-card') ||
                     element.classList.contains('rating-card') ||
                     element.classList.contains('package-card');

      if (isCard) {
        const delay = index % 4 * 100;
        setTimeout(() => {
          element.style.animation = 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }, delay);
      } else if (element.classList.contains('form-group')) {
        const delay = index % 5 * 80;
        setTimeout(() => {
          element.style.animation = 'slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }, delay);
      } else {
        element.style.animation = 'fadeInUp 0.6s ease forwards';
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.highlight-card, .rating-card, .package-card, .form-group').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Animate section headings
const headings = document.querySelectorAll('h2');
headings.forEach(heading => {
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
        headingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  heading.style.opacity = '0';
  headingObserver.observe(heading);
});

// ====================
// CSS Animations (injected)
// ====================

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  .nav-menu a.active {
    color: var(--accent);
    border-bottom: 3px solid var(--accent);
    padding-bottom: 5px;
  }
`;
document.head.appendChild(style);

console.log('✓ Career Coach website loaded successfully!');