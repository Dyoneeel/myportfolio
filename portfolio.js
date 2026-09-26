// Restore the visitor's theme before initializing page interactions.
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

document.documentElement.dataset.theme = initialTheme;

function updateThemeToggle(theme) {
    if (!themeToggle) return;

    const lightMode = theme === 'light';
    const nextModeLabel = lightMode ? 'dark mode' : 'light mode';
    themeToggle.setAttribute('aria-pressed', String(lightMode));
    themeToggle.setAttribute('aria-label', `Switch to ${nextModeLabel}`);
    themeToggle.setAttribute('title', `Switch to ${nextModeLabel}`);
    themeToggle.querySelector('.theme-label').textContent = lightMode ? 'Dark mode' : 'Light mode';
}

updateThemeToggle(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem('portfolio-theme', nextTheme);
        updateThemeToggle(nextTheme);
    });
}

// Initialize AOS once so scroll reveals remain stable and do not replay while scrolling.
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 650,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        mirror: false
    });
}

// Mobile Menu Functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Hamburger animation
    hamburger.querySelectorAll('.line').forEach((line, index) => {
        if(index === 0) line.style.transform = hamburger.classList.contains('active') 
            ? 'translateY(9px) rotate(45deg)' 
            : '';
        if(index === 1) line.style.opacity = hamburger.classList.contains('active') 
            ? '0' 
            : '';
        if(index === 2) line.style.transform = hamburger.classList.contains('active') 
            ? 'translateY(-9px) rotate(-45deg)' 
            : '';
    });
}

// Event Listeners
hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking links (mobile)
document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
        if(window.innerWidth <= 768) toggleMenu();
    });
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.style.boxShadow = window.scrollY > 50 
        ? '0 5px 20px rgba(0,0,0,0.2)'
        : 'none';
});

// Set active page in navigation
const currentPage = location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(link => {
    if(link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Contact Alert Function
function contactAlert() {
    alert("Thanks for your interest! I'll get back to you soon.");
}

// Dynamic Content Toggling
function showMore(section) {
    const content = document.getElementById(`${section}-more`);
    if(content) {
        content.style.maxHeight = content.classList.contains('visible') 
            ? '0' 
            : `${content.scrollHeight}px`;
        content.classList.toggle('visible');
    }
}

// Smooth Scroll Functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// EmailJS contact form. Replace these values with the IDs from your EmailJS account.
const emailJsConfig = {
    publicKey: 'yipLmWU_DtuGyaVDa',
    serviceId: 'service_6b0t2o8',
    templateId: 'template_pctgzjb'
};

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        if (!window.emailjs || Object.values(emailJsConfig).some(value => value.startsWith('YOUR_'))) {
            formStatus.textContent = 'Email delivery is not configured yet. Please contact me directly by email.';
            formStatus.className = 'form-status is-error';
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        try {
            emailjs.init({ publicKey: emailJsConfig.publicKey });
            await emailjs.sendForm(emailJsConfig.serviceId, emailJsConfig.templateId, contactForm);
            contactForm.reset();
            formStatus.textContent = 'Your message was sent successfully.';
            formStatus.className = 'form-status is-success';
        } catch (error) {
            formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
            formStatus.className = 'form-status is-error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// Advance the homepage project carousel automatically every three seconds.
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.works-carousel-track');
    const cards = [...carousel.querySelectorAll('.project-card-carousel')];

    if (!track || cards.length < 2) return;

    let activeCard = 0;
    window.setInterval(() => {
        activeCard = (activeCard + 1) % cards.length;
        track.scrollTo({
            left: cards[activeCard].offsetLeft,
            behavior: 'smooth'
        });
    }, 3000);
});

// Icon Button Functionality
document.querySelectorAll('.icon-button').forEach(button => {
    button.addEventListener('click', function() {
        const buttonGroup = this.closest('.button-group');
        const actionButton = buttonGroup.querySelector('.action-button');
        if(actionButton) actionButton.click();
    });
});

// Page Load Effects
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop) {
        // Scrolling down
        header.classList.add("hide-nav");
    } else {
        // Scrolling up
        header.classList.remove("hide-nav");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});

// Image Modal Functionality
document.querySelectorAll('.project-image-clickable').forEach(imgDiv => {
    imgDiv.addEventListener('click', function() {
        const imgSrc = imgDiv.getAttribute('data-img');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('imageModalImg');
        modalImg.src = imgSrc;
        modal.classList.add('open');
    });
    imgDiv.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            imgDiv.click();
        }
    });
});

const imageModal = document.getElementById('imageModal');
const imageModalClose = document.getElementById('imageModalClose');

if (imageModal && imageModalClose) {
    imageModalClose.addEventListener('click', function() {
        imageModal.classList.remove('open');
    });
    imageModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('open');
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            imageModal.classList.remove('open');
        }
    });
}

// Automatically update copyright year
document.addEventListener('DOMContentLoaded', () => {
    const copyrightElem = document.querySelector('.copyright');
    if (copyrightElem) {
        copyrightElem.textContent = `© ${new Date().getFullYear()} Jonel Andamon. ALL RIGHTS RESERVED.`;
    }
});
