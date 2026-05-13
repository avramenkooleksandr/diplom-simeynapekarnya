document.addEventListener('DOMContentLoaded', () => {
    const galleryData = {
        'sweet': ['./img/sweet/1.webp', './img/sweet/2.webp', './img/sweet/3.webp', './img/sweet/4.webp', './img/sweet/5.webp', './img/sweet/6.webp', './img/sweet/7.webp', './img/sweet/8.webp', './img/sweet/9.webp'],
        'savory': ['./img/savory/1.webp', './img/savory/2.webp', './img/savory/3.webp', './img/savory/4.webp', './img/savory/5.webp', './img/savory/6.webp', './img/savory/7.webp', './img/savory/8.webp', './img/savory/9.webp', './img/savory/10.webp'],
        'bread': ['./img/bread/1.webp', './img/bread/2.webp', './img/bread/3.webp', './img/bread/4.webp', './img/bread/5.webp', './img/bread/6.webp', './img/bread/7.webp', './img/bread/8.webp', './img/bread/9.webp', './img/bread/10.webp', './img/bread/11.webp'],
        'hotdog': ['./img/hotdog/1.webp', './img/hotdog/2.webp', './img/hotdog/3.webp', './img/hotdog/4.webp', './img/hotdog/5.webp']
    };

    let currentCategory = '';
    let currentGalleryIndex = 0;
    let isAnimating = false;

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lbPrevBtn = document.querySelector('.lightbox-prev');
    const lbNextBtn = document.querySelector('.lightbox-next');

    function changeImage(newIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;
        const exitClass = direction === 'next' ? 'img-hidden-left' : 'img-hidden-right';
        const enterClass = direction === 'next' ? 'img-hidden-right' : 'img-hidden-left';

        lightboxImg.classList.add(exitClass);
        setTimeout(() => {
            currentGalleryIndex = newIndex;
            lightboxImg.src = galleryData[currentCategory][currentGalleryIndex];
            lightboxImg.onload = () => {
                lightboxImg.style.transition = 'none';
                lightboxImg.classList.remove(exitClass);
                lightboxImg.classList.add(enterClass);
                setTimeout(() => {
                    lightboxImg.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                    lightboxImg.classList.remove(enterClass);
                    isAnimating = false;
                }, 50);
            };
        }, 400);
    }

    document.querySelectorAll('.btn-gallery').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = btn.getAttribute('data-category');
            currentGalleryIndex = 0;
            if (galleryData[currentCategory]) {
                lightboxImg.src = galleryData[currentCategory][currentGalleryIndex];
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                const hasMultiple = galleryData[currentCategory].length > 1;
                lbPrevBtn.style.display = hasMultiple ? 'flex' : 'none';
                lbNextBtn.style.display = hasMultiple ? 'flex' : 'none';
            }
        });
    });

    if (lbNextBtn) lbNextBtn.addEventListener('click', (e) => { e.stopPropagation(); changeImage((currentGalleryIndex + 1) % galleryData[currentCategory].length, 'next'); });
    if (lbPrevBtn) lbPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); changeImage((currentGalleryIndex - 1 + galleryData[currentCategory].length) % galleryData[currentCategory].length, 'prev'); });

    const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
    const lbClose = document.querySelector('.lightbox-close');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    const sTrack = document.querySelector('.slider-track');
    const sCards = document.querySelectorAll('.slider-card');
    const sPrevBtn = document.querySelector('.prev-btn');
    const sNextBtn = document.querySelector('.next-btn');

    if (sTrack && sPrevBtn && sNextBtn) {
        let currentSliderIndex = 0;
        const getVisibleCards = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1100) return 2;
            return 3;
        };

        const updateSlider = () => {
            const visibleCards = getVisibleCards();
            const maxIndex = sCards.length - visibleCards;
            if (currentSliderIndex > maxIndex) currentSliderIndex = maxIndex;
            if (currentSliderIndex < 0) currentSliderIndex = 0;
            const cardWidth = sCards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(sTrack).gap) || 0;
            const moveDistance = currentSliderIndex * (cardWidth + gap);
            sTrack.style.transform = `translateX(-${moveDistance}px)`;
            sPrevBtn.disabled = currentSliderIndex === 0;
            sNextBtn.disabled = currentSliderIndex >= maxIndex;
        };

        sNextBtn.addEventListener('click', () => {
            if (currentSliderIndex < sCards.length - getVisibleCards()) {
                currentSliderIndex++;
                updateSlider();
            }
        });
        sPrevBtn.addEventListener('click', () => {
            if (currentSliderIndex > 0) {
                currentSliderIndex--;
                updateSlider();
            }
        });
        window.addEventListener('resize', updateSlider);
        setTimeout(updateSlider, 100);
    }

    const menuLinks = document.querySelectorAll('.menu a');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.header');
    const progressBar = document.querySelector('.scroll-progress-bar');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 60;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }

        let currentId = '';
        const headerHeight = header ? header.offsetHeight : 60;
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop - headerHeight - 120) {
                currentId = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (currentId && currentId !== "1" && link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    });

    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');

    if (burger && menu) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
            burger.textContent = menu.classList.contains('open') ? '✕' : '☰';
        });

        const mobileLinks = menu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                burger.textContent = '☰';
            });
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !burger.contains(e.target)) {
                menu.classList.remove('open');
                burger.textContent = '☰';
            }
        });
    }

    let hasSubmitted = false;

    const emailField = document.querySelector('#email');
    const emailError = document.querySelector('#emailError');

    const validateEmail = () => {
        const email = emailField.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        const isValid = emailPattern.test(email);

        if (!hasSubmitted) {
            emailField.classList.toggle('invalid-field', email !== '' && !isValid);
            emailField.classList.toggle('valid-field', isValid && email !== '');
            return isValid;
        }

        emailError.classList.toggle('active', !isValid);
        emailField.classList.toggle('invalid-field', !isValid);
        emailField.classList.toggle('valid-field', isValid);

        return isValid;
    };

    emailField.addEventListener('input', () => {
        validateEmail();
    });


    const phoneInputField = document.querySelector("#phone");
    let itiInstance;

    const phoneError = document.querySelector('#phoneError');

    const validatePhoneNumber = () => {
        if (!phoneInputField || !itiInstance) return false;

        const phoneNumber = phoneInputField.value.trim();
        const isValid = itiInstance.isValidNumber();
        phoneInputField.classList.toggle('valid-number', isValid && phoneNumber !== '');
        phoneInputField.classList.toggle('invalid-number', phoneNumber !== '' && !isValid);

        if (hasSubmitted) {
            phoneError.classList.toggle('active', !isValid);
        }

        return isValid;
    };

    if (phoneInputField) {
        itiInstance = window.intlTelInput(phoneInputField, {
            initialCountry: "ua",
            autoPlaceholder: "aggressive",
            preferredCountries: ["ua", "pl", "de", "gb"],
            dropdownContainer: document.body,
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.10/build/js/utils.js",
        });

        phoneInputField.addEventListener('input', () => {
            validatePhoneNumber();
        });

        phoneInputField.addEventListener('countrychange', () => {
            validatePhoneNumber();
        });
    }

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.getElementById('closeConsultationModal');
    const openButtons = document.querySelectorAll('.js-open-modal');

    const openModal = (e) => {
        e.preventDefault();
        if (modal) {
            modal.classList.add('active');
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    openButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    const consultationForm = document.querySelector("#consultationForm");
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            hasSubmitted = true;

            const submitError = document.querySelector('#submitError');

            const isPhoneValid = validatePhoneNumber();
            const isEmailValid = validateEmail();

            if (!isPhoneValid || !isEmailValid) {
                submitError.classList.add('active');
                return;
            }

            submitError.classList.remove('active');
            emailError.classList.remove('active');
            phoneError.classList.remove('active');

            emailField.classList.remove('invalid-field', 'valid-field');
            phoneInputField.classList.remove('invalid-number', 'valid-number');

            const fullNumber = itiInstance
                ? itiInstance.getNumber()
                : phoneInputField.value;

            console.log("OK:", fullNumber);

            closeModal();
            consultationForm.reset();
            const successModal = document.querySelector('#successModal');
            successModal.classList.add('active');
            emailField.classList.remove('invalid-field', 'valid-field');
            phoneInputField.classList.remove('invalid-number', 'valid-number');
            hasSubmitted = false;
        });
    }

    const successCloseBtn = document.querySelector('#successCloseBtn');

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            const successModal = document.querySelector('#successModal');
            successModal.classList.remove('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const clearSubmitError = () => {
        const submitError = document.querySelector('#submitError');
        submitError.classList.remove('active');
    };

    const appearanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appeared');

                if (entry.target.classList.contains('milestones')) {
                    entry.target.classList.add('active');
                }

                appearanceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    const sectionsToAnimate = document.querySelectorAll('.hero, .milestones, .assortment, .process-section, .stats-section, .projects-content, .other-projects, .cta-orange, .franchise-section');

    sectionsToAnimate.forEach(section => {
        appearanceObserver.observe(section);
    });
}); 