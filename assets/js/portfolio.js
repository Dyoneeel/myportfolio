// Theme
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
    const label = themeToggle.querySelector('.theme-label');
    if (label) label.textContent = lightMode ? 'Dark mode' : 'Light mode';
}

updateThemeToggle(initialTheme);

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('portfolio-theme', nextTheme);
    updateThemeToggle(nextTheme);
});

// Scroll reveal
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 80, mirror: false });
}

// Mobile navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function setMenuOpen(open) {
    if (!hamburger || !navLinks) return;
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    hamburger.querySelectorAll('.line').forEach((line, index) => {
        line.style.transform = '';
        line.style.opacity = '';
        if (open && index === 0) line.style.transform = 'translateY(9px) rotate(45deg)';
        if (open && index === 1) line.style.opacity = '0';
        if (open && index === 2) line.style.transform = 'translateY(-9px) rotate(-45deg)';
    });
}

hamburger?.addEventListener('click', () => {
    setMenuOpen(!hamburger.classList.contains('active'));
});

document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

// Header scroll state. One listener handles both shadow and hide-on-scroll behavior.
const header = document.querySelector('header');
let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
window.addEventListener('scroll', () => {
    if (!header) return;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    header.style.boxShadow = currentScroll > 50 ? '0 5px 20px rgba(0,0,0,0.2)' : 'none';
    if (currentScroll > lastScrollTop + 4 && currentScroll > 80) {
        header.classList.add('hide-nav');
    } else if (currentScroll < lastScrollTop - 4 || currentScroll <= 20) {
        header.classList.remove('hide-nav');
    }
    lastScrollTop = Math.max(0, currentScroll);
}, { passive: true });

// Smooth scrolling for same-page anchors only.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// EmailJS contact form
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
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!window.emailjs) {
            formStatus.textContent = 'Email delivery is not configured yet. Please contact me directly by email.';
            formStatus.className = 'form-status is-error';
            return;
        }

        submitButton?.setAttribute('disabled', 'disabled');
        if (submitButton) submitButton.textContent = 'Sending...';
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
            submitButton?.removeAttribute('disabled');
            if (submitButton) submitButton.textContent = 'Send Message';
        }
    });
}

// Project carousel
const carouselTimers = [];
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.works-carousel-track');
    const cards = [...carousel.querySelectorAll('.project-card-carousel')];
    if (!track || cards.length < 2) return;

    let activeCard = 0;
    const timer = window.setInterval(() => {
        activeCard = (activeCard + 1) % cards.length;
        track.scrollTo({ left: cards[activeCard].offsetLeft, behavior: 'smooth' });
    }, 4000);
    carouselTimers.push(timer);
});

// Image modal
const imageModal = document.getElementById('imageModal');
const imageModalClose = document.getElementById('imageModalClose');
const imageModalImg = document.getElementById('imageModalImg');

const openImageModal = (trigger) => {
    const imgSrc = trigger?.getAttribute('data-img');
    if (!imgSrc || !imageModal || !imageModalImg) return;

    const imgAlt = trigger.getAttribute('data-img-alt') || 'Project full-size preview';
    imageModalImg.src = imgSrc;
    imageModalImg.alt = imgAlt;
    imageModal.classList.add('open');
    imageModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    imageModalClose?.focus();
};

document.querySelectorAll('.project-image-clickable').forEach(trigger => {
    trigger.addEventListener('click', () => openImageModal(trigger));
});

const closeModal = () => {
    if (!imageModal) return;
    imageModal.classList.remove('open');
    imageModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (imageModalImg) imageModalImg.src = '';
};

imageModalClose?.addEventListener('click', closeModal);
imageModal?.addEventListener('click', event => {
    if (event.target === imageModal) closeModal();
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
});

window.addEventListener('load', () => document.body.classList.add('loaded'));

document.addEventListener('DOMContentLoaded', () => {
    const copyrightElem = document.querySelector('.copyright');
    if (copyrightElem) {
        copyrightElem.textContent = `© ${new Date().getFullYear()} Jonel Andamon. ALL RIGHTS RESERVED.`;
    }
});
