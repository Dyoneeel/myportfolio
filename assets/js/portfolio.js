// ============================================================
// Theme
// ============================================================

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

document.documentElement.dataset.theme = initialTheme;

function updateThemeToggle(theme) {
    if (!themeToggle) return;

    const lightMode = theme === 'light';
    const nextModeLabel = lightMode
        ? 'dark mode'
        : 'light mode';

    themeToggle.setAttribute(
        'aria-pressed',
        String(lightMode)
    );

    themeToggle.setAttribute(
        'aria-label',
        `Switch to ${nextModeLabel}`
    );

    themeToggle.setAttribute(
        'title',
        `Switch to ${nextModeLabel}`
    );

    const label =
        themeToggle.querySelector('.theme-label');

    if (label) {
        label.textContent =
            lightMode ? 'Dark mode' : 'Light mode';
    }
}

updateThemeToggle(initialTheme);

themeToggle?.addEventListener('click', () => {

    const nextTheme =
        document.documentElement.dataset.theme === 'light'
            ? 'dark'
            : 'light';

    document.documentElement.dataset.theme =
        nextTheme;

    localStorage.setItem(
        'portfolio-theme',
        nextTheme
    );

    updateThemeToggle(nextTheme);
});


// ============================================================
// Scroll Reveal
// ============================================================

if (typeof AOS !== 'undefined') {

    AOS.init({
        duration: 650,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        mirror: false
    });

}


// ============================================================
// Mobile Navigation
// ============================================================

const hamburger =
    document.getElementById('hamburger');

const navLinks =
    document.getElementById('navLinks');


function setMenuOpen(open) {

    if (!hamburger || !navLinks) return;

    hamburger.classList.toggle(
        'active',
        open
    );

    navLinks.classList.toggle(
        'active',
        open
    );

    hamburger.setAttribute(
        'aria-expanded',
        String(open)
    );

    hamburger.setAttribute(
        'aria-label',
        open
            ? 'Close navigation'
            : 'Open navigation'
    );

    hamburger.querySelectorAll(
        '.line'
    ).forEach((line, index) => {

        line.style.transform = '';
        line.style.opacity = '';

        if (open && index === 0) {

            line.style.transform =
                'translateY(9px) rotate(45deg)';

        }

        if (open && index === 1) {

            line.style.opacity = '0';

        }

        if (open && index === 2) {

            line.style.transform =
                'translateY(-9px) rotate(-45deg)';

        }

    });

}


hamburger?.addEventListener(
    'click',
    () => {

        setMenuOpen(
            !hamburger.classList.contains(
                'active'
            )
        );

    }
);


document
    .querySelectorAll('#navLinks a')
    .forEach(link => {

        link.addEventListener(
            'click',
            () => setMenuOpen(false)
        );

    });


// ============================================================
// Header Scroll State
// ============================================================

const header =
    document.querySelector('header');

let lastScrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    0;


window.addEventListener(
    'scroll',
    () => {

        if (!header) return;

        const currentScroll =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;

        header.style.boxShadow =
            currentScroll > 50
                ? '0 5px 20px rgba(0,0,0,0.2)'
                : 'none';


        if (
            currentScroll >
                lastScrollTop + 4 &&
            currentScroll > 80
        ) {

            header.classList.add(
                'hide-nav'
            );

        } else if (
            currentScroll <
                lastScrollTop - 4 ||
            currentScroll <= 20
        ) {

            header.classList.remove(
                'hide-nav'
            );

        }


        lastScrollTop =
            Math.max(
                0,
                currentScroll
            );

    },
    {
        passive: true
    }
);


// ============================================================
// Smooth Scrolling
// ============================================================

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            'click',
            function (event) {

                const href =
                    this.getAttribute(
                        'href'
                    );

                if (
                    !href ||
                    href === '#'
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        href
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                window.scrollTo({

                    top:
                        target.offsetTop - 80,

                    behavior:
                        'smooth'

                });

            }
        );

    });


// ============================================================
// EmailJS Contact Form
// ============================================================

const emailJsConfig = {

    publicKey:
        'yipLmWU_DtuGyaVDa',

    serviceId:
        'service_6b0t2o8',

    templateId:
        'template_pctgzjb'

};


const contactForm =
    document.getElementById(
        'contactForm'
    );


const formStatus =
    document.getElementById(
        'formStatus'
    );


if (
    contactForm &&
    formStatus
) {

    contactForm.addEventListener(
        'submit',
        async event => {

            event.preventDefault();


            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );


            // ------------------------------------------------
            // Check EmailJS library
            // ------------------------------------------------

            if (!window.emailjs) {

                formStatus.textContent =
                    'EmailJS could not be loaded. Please contact me directly by email.';

                formStatus.className =
                    'form-status is-error';

                console.error(
                    'EMAILJS ERROR: EmailJS library is not available.'
                );

                return;
            }


            // ------------------------------------------------
            // Disable submit button
            // ------------------------------------------------

            submitButton?.setAttribute(
                'disabled',
                'disabled'
            );


            if (submitButton) {

                submitButton.textContent =
                    'Sending...';

            }


            formStatus.textContent = '';

            formStatus.className =
                'form-status';


            try {

                // --------------------------------------------
                // Initialize EmailJS
                // --------------------------------------------

                emailjs.init({

                    publicKey:
                        emailJsConfig.publicKey

                });


                // --------------------------------------------
                // Read form values
                // --------------------------------------------

                const nameValue =
                    contactForm.elements.name?.value.trim() || '';


                const emailValue =
                    contactForm.elements.email?.value.trim() || '';


                const subjectValue =
                    contactForm.elements.subject?.value.trim() || '';


                const messageValue =
                    contactForm.elements.message?.value.trim() || '';


                // --------------------------------------------
                // Create EmailJS-compatible fields
                // --------------------------------------------
                //
                // Your EmailJS template uses:
                //
                // {{name}}
                // {{email}}
                // {{title}}
                // {{message}}
                //
                // Your HTML form uses:
                //
                // name
                // email
                // subject
                // message
                //
                // Therefore "subject" is mapped to "title".
                // --------------------------------------------

                const syncField = (
                    name,
                    value
                ) => {

                    let field =
                        contactForm.querySelector(
                            `[data-emailjs-field="${name}"]`
                        );


                    if (!field) {

                        field =
                            document.createElement(
                                'input'
                            );

                        field.type =
                            'hidden';

                        field.name =
                            name;

                        field.dataset.emailjsField =
                            name;

                        contactForm.appendChild(
                            field
                        );

                    }


                    field.value =
                        value;

                };


                syncField(
                    'user_name',
                    nameValue
                );


                syncField(
                    'user_email',
                    emailValue
                );


                syncField(
                    'title',
                    subjectValue
                );


                syncField(
                    'from_name',
                    nameValue
                );


                syncField(
                    'reply_to',
                    emailValue
                );


                // --------------------------------------------
                // Debug information
                // --------------------------------------------

                console.log(
                    'EMAILJS DEBUG VERSION LOADED'
                );


                console.log(
                    'EmailJS configuration:',
                    {
                        serviceId:
                            emailJsConfig.serviceId,

                        templateId:
                            emailJsConfig.templateId,

                        publicKey:
                            emailJsConfig.publicKey
                    }
                );


                console.log(
                    'EmailJS form data:',
                    {
                        name:
                            nameValue,

                        email:
                            emailValue,

                        title:
                            subjectValue,

                        message:
                            messageValue
                    }
                );


                // --------------------------------------------
                // Send email
                // --------------------------------------------

                await emailjs.sendForm(

                    emailJsConfig.serviceId,

                    emailJsConfig.templateId,

                    contactForm

                );


                // --------------------------------------------
                // Success
                // --------------------------------------------

                contactForm.reset();

                formStatus.textContent =
                    'Your message was sent successfully.';

                formStatus.className =
                    'form-status is-success';


                console.log(
                    'EMAILJS SUCCESS: Message sent successfully.'
                );

            }


            // =================================================
            // EMAILJS ERROR
            // =================================================

            catch (error) {

                console.error(
                    'EMAILJS SEND FAILED:',
                    error
                );


                console.error(
                    'EMAILJS ERROR STATUS:',
                    error?.status
                );


                console.error(
                    'EMAILJS ERROR TEXT:',
                    error?.text
                );


                console.error(
                    'EMAILJS ERROR MESSAGE:',
                    error?.message
                );


                // --------------------------------------------
                // Extract actual error
                // --------------------------------------------

                const errorMessage =

                    error?.text ||

                    error?.message ||

                    'Unknown EmailJS error';


                // --------------------------------------------
                // IMPORTANT:
                // Show the REAL EmailJS error temporarily.
                // --------------------------------------------

                formStatus.textContent =
                    `EmailJS Error: ${errorMessage}`;


                formStatus.className =
                    'form-status is-error';


                console.log(
                    'EmailJS error details:',
                    {

                        status:
                            error?.status,

                        text:
                            error?.text,

                        message:
                            error?.message,

                        fullError:
                            error

                    }
                );

            }


            // =================================================
            // Re-enable button
            // =================================================

            finally {

                submitButton?.removeAttribute(
                    'disabled'
                );


                if (submitButton) {

                    submitButton.textContent =
                        'Send Message';

                }

            }

        }
    );

}


// ============================================================
// Project Carousel
// ============================================================

const carouselTimers = [];


document
    .querySelectorAll('[data-carousel]')
    .forEach(carousel => {

        const track =
            carousel.querySelector(
                '.works-carousel-track'
            );


        const cards = [
            ...carousel.querySelectorAll(
                '.project-card-carousel'
            )
        ];


        if (
            !track ||
            cards.length < 2
        ) {

            return;

        }


        let activeCard = 0;


        const timer =
            window.setInterval(
                () => {

                    activeCard =
                        (
                            activeCard + 1
                        ) %
                        cards.length;


                    track.scrollTo({

                        left:
                            cards[
                                activeCard
                            ].offsetLeft,

                        behavior:
                            'smooth'

                    });

                },
                4000
            );


        carouselTimers.push(
            timer
        );

    });


// ============================================================
// Image Modal
// ============================================================

const imageModal =
    document.getElementById(
        'imageModal'
    );


const imageModalClose =
    document.getElementById(
        'imageModalClose'
    );


const imageModalImg =
    document.getElementById(
        'imageModalImg'
    );


const openImageModal =
    trigger => {

        const imgSrc =
            trigger?.getAttribute(
                'data-img'
            );


        if (
            !imgSrc ||
            !imageModal ||
            !imageModalImg
        ) {

            return;

        }


        const imgAlt =
            trigger.getAttribute(
                'data-img-alt'
            ) ||
            'Project full-size preview';


        imageModalImg.src =
            imgSrc;


        imageModalImg.alt =
            imgAlt;


        imageModal.classList.add(
            'open'
        );


        imageModal.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.classList.add(
            'modal-open'
        );


        imageModalClose?.focus();

    };


document
    .querySelectorAll(
        '.project-image-clickable'
    )
    .forEach(trigger => {

        trigger.addEventListener(
            'click',
            () => {

                openImageModal(
                    trigger
                );

            }
        );

    });


const closeModal =
    () => {

        if (!imageModal) {
            return;
        }


        imageModal.classList.remove(
            'open'
        );


        imageModal.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.classList.remove(
            'modal-open'
        );


        if (imageModalImg) {

            imageModalImg.src = '';

        }

    };


imageModalClose?.addEventListener(
    'click',
    closeModal
);


imageModal?.addEventListener(
    'click',
    event => {

        if (
            event.target ===
            imageModal
        ) {

            closeModal();

        }

    }
);


document.addEventListener(
    'keydown',
    event => {

        if (
            event.key ===
            'Escape'
        ) {

            closeModal();

        }

    }
);


// ============================================================
// Page Loaded State
// ============================================================

window.addEventListener(
    'load',
    () => {

        document.body.classList.add(
            'loaded'
        );

    }
);


// ============================================================
// Dynamic Copyright Year
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const copyrightElem =
            document.querySelector(
                '.copyright'
            );


        if (copyrightElem) {

            copyrightElem.textContent =
                `© ${new Date().getFullYear()} Jonel Andamon. ALL RIGHTS RESERVED.`;

        }

    }
);
