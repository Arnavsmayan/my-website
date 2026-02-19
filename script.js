// ====================
// Contact Form Handler with Spam Protection & Web3Forms
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

function showSuccessScreen() {
  // Replace the entire form with a success message + home button
  const formContainer = contactForm.parentElement;
  formContainer.innerHTML = `
    <div id="successScreen" style="
      text-align: center;
      padding: 60px 40px;
      background: linear-gradient(135deg, #ffffff 0%, #fdf9f5 100%);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(139, 115, 85, 0.1);
      border: 1px solid rgba(139, 115, 85, 0.1);
      max-width: 600px;
      margin: 0 auto;
      animation: fadeInUp 0.6s ease forwards;
    ">
      <div style="font-size: 72px; margin-bottom: 20px;">✅</div>
      <h3 style="
        font-size: 28px;
        color: #8b7355;
        margin-bottom: 15px;
        font-weight: 700;
        letter-spacing: -0.5px;
      ">Message Sent!</h3>
      <p style="
        color: #666;
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 35px;
        max-width: 380px;
        margin-left: auto;
        margin-right: auto;
      ">Thank you for reaching out. I'll get back to you as soon as possible!</p>
      <a href="#home" id="goHomeBtn" style="
        display: inline-block;
        padding: 14px 45px;
        background: #8b7355;
        color: white;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 700;
        font-size: 15px;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(139, 115, 85, 0.25);
      ">← Back to Home</a>
    </div>
  `;

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Hover effect on the button
  const btn = document.getElementById('goHomeBtn');
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-4px)';
    btn.style.boxShadow = '0 15px 35px rgba(139, 115, 85, 0.35)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 8px 25px rgba(139, 115, 85, 0.25)';
  });
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

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
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;

  try {
    const data = {
      access_key: '66818d8b-131e-41b4-b763-80a2a7dcbf3b',
      name: contactForm.querySelector('[name="name"]').value,
      email: contactForm.querySelector('[name="email"]').value,
      subject: contactForm.querySelector('[name="subject"]')?.value || 'New Contact Form Submission',
      message: contactForm.querySelector('[name="message"]').value,
      from_name: 'Career Coaching Website'
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      incrementSubmissionCount();
      showSuccessScreen(); // 🎉 Show success UI instead of reloading
    } else {
      throw new Error(result.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error:', error);
    formMessage.textContent = '✗ Error sending message. Please try again or email me directly.';
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.classList.remove('error');
    }, 5000);
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