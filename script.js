/* ==========================================
   COUPLES RETREAT LANDING PAGE
   Modern Dark Theme - Mobile First
   Fonts: Playfair Display + DM Sans
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initAccordion();
    initScrollReveal();
    initSmoothScroll();
    initStickyCta();
    initParallax();
    initGalleryVideos();
    initLanguageToggle();
    initLightbox();
    initRegistrationForm();
    initIncludedSlider();
    initCountdown();
    initFlipCards();
    initConfirmModal();
    init3DCards();
    initSnow();
    initSoundToggle();
    initCounterAnimation();
});

/**
 * CONFIRMATION MODAL - For location and calendar buttons
 */
function initConfirmModal() {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('confirmModalTitle');
    const modalText = document.getElementById('confirmModalText');
    const confirmBtn = document.getElementById('confirmModalConfirm');
    const cancelBtn = document.getElementById('confirmModalCancel');
    const locationBtn = document.getElementById('locationBtn');
    const calendarBtn = document.getElementById('calendarBtn');

    if (!modal) return;

    let pendingUrl = '';
    let pendingMode = 'link';

    function showModal(title, text, url, mode = 'link') {
        modalTitle.textContent = title;
        modalText.textContent = text;
        pendingUrl = url;
        pendingMode = mode;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        pendingUrl = '';
        pendingMode = 'link';
    }

    // Location button
    if (locationBtn) {
        locationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = locationBtn.dataset.url;

            // Get current language
            const lang = document.documentElement.lang || 'ua';
            const t = translations[lang] || translations.ua;

            // Use translations if available, fallback to dataset
            const title = t.modals && t.modals.map ? t.modals.map.title : locationBtn.dataset.modalTitle;
            const text = t.modals && t.modals.map ? t.modals.map.text : locationBtn.dataset.modalText;

            showModal(title, text, url, 'link');

            // Show map overlay if it exists
            const modalMap = document.getElementById('modalMap');
            if (modalMap) modalMap.style.display = 'block';
        });
    }
    // Calendar button - opens calendar modal
    const calendarModal = document.getElementById('calendarModal');
    const calendarModalCancel = document.getElementById('calendarModalCancel');
    const calendarModalAdd = document.getElementById('calendarModalAdd');

    if (calendarBtn && calendarModal) {
        calendarBtn.addEventListener('click', () => {
            calendarModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close calendar modal
        const closeCalendarModal = () => {
            calendarModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        calendarModalCancel.addEventListener('click', closeCalendarModal);

        // Close modal when clicking the link
        if (calendarModalAdd) {
            calendarModalAdd.addEventListener('click', closeCalendarModal);
        }

        // Click outside to close
        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                closeCalendarModal();
            }
        });
    }

    // Question modal
    const questionModal = document.getElementById('questionModal');
    const questionForm = document.getElementById('questionForm');
    const questionText = document.getElementById('questionText');
    const questionModalCancel = document.getElementById('questionModalCancel');
    const askQuestionBtn = document.getElementById('askQuestionBtn');

    if (askQuestionBtn && questionModal) {
        askQuestionBtn.addEventListener('click', () => {
            questionModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeQuestionModal = () => {
            questionModal.classList.remove('active');
            document.body.style.overflow = '';
            questionText.value = '';
        };

        questionModalCancel.addEventListener('click', closeQuestionModal);

        questionModal.addEventListener('click', (e) => {
            if (e.target === questionModal) {
                closeQuestionModal();
            }
        });

        // Send question to Telegram
        questionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const question = questionText.value.trim();
            if (!question) return;

            const TELEGRAM_BOT_TOKEN = '8566564117:AAF1h19DyvrqPXt2bylV7FZzjI4vkFuIdQo';
            const TELEGRAM_CHAT_ID = '-1003616470575';

            const message = `❓ *Нове запитання з сайту*\n\n${question}`;

            try {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                });
                alert('Дякуємо! Ваше запитання відправлено.');
            } catch (error) {
                alert('Помилка відправки. Спробуйте пізніше.');
            }
            closeQuestionModal();
        });
    }

    // Confirm button
    confirmBtn.addEventListener('click', () => {
        if (pendingUrl) {
            // Open link in new tab
            window.open(pendingUrl, '_blank');
        }
        hideModal();
    });

    // Cancel button
    cancelBtn.addEventListener('click', hideModal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideModal();
        }
    });
}

/**
 * COUNTDOWN TIMER - Registration deadline
 */
function initCountdown() {
    const DEADLINE = new Date('2026-01-11T23:59:59').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = DEADLINE - now;

        if (distance < 0) {
            // Deadline passed
            const heroTimer = document.getElementById('heroCountdown');
            const formTimer = document.getElementById('formCountdown');
            if (heroTimer) heroTimer.style.display = 'none';
            if (formTimer) formTimer.style.display = 'none';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update hero countdown
        const heroDays = document.getElementById('heroDays');
        const heroHours = document.getElementById('heroHours');
        const heroMinutes = document.getElementById('heroMinutes');
        const heroSeconds = document.getElementById('heroSeconds');

        if (heroDays) heroDays.textContent = String(days).padStart(2, '0');
        if (heroHours) heroHours.textContent = String(hours).padStart(2, '0');
        if (heroMinutes) heroMinutes.textContent = String(minutes).padStart(2, '0');
        if (heroSeconds) heroSeconds.textContent = String(seconds).padStart(2, '0');

        // Update form countdown
        const formDays = document.getElementById('formDays');
        const formHours = document.getElementById('formHours');
        const formMinutes = document.getElementById('formMinutes');
        const formSeconds = document.getElementById('formSeconds');

        if (formDays) formDays.textContent = String(days).padStart(2, '0');
        if (formHours) formHours.textContent = String(hours).padStart(2, '0');
        if (formMinutes) formMinutes.textContent = String(minutes).padStart(2, '0');
        if (formSeconds) formSeconds.textContent = String(seconds).padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * FLIP CARDS - Toggle flip on click/tap
 */
function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    const SWIPE_THRESHOLD = 10; // pixels - if moved more, it's a swipe

    // Function to close all cards except the given one
    const closeOtherCards = (exceptCard) => {
        flipCards.forEach(c => {
            if (c !== exceptCard && c.classList.contains('flipped')) {
                c.classList.remove('flipped');
            }
        });
    };

    // Function to toggle card with accordion behavior
    const toggleCard = (card) => {
        const isOpening = !card.classList.contains('flipped');
        if (isOpening) {
            closeOtherCards(card);
        }
        card.classList.toggle('flipped');
    };

    flipCards.forEach(card => {
        let isScrolling = false;
        let startX = 0;
        let startY = 0;

        // Track touch to distinguish scroll vs tap
        card.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isScrolling = false;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            if (isScrolling) return; // Already detected

            const touch = e.touches[0];
            const diffX = Math.abs(touch.clientX - startX);
            const diffY = Math.abs(touch.clientY - startY);

            // If finger moved more than 10px, assume scrolling
            if (diffX > 10 || diffY > 10) {
                isScrolling = true;
            }
        }, { passive: true });

        // Simple stable click handler
        // touch-action: manipulation in CSS handles native scroll detection
        // but we add isScrolling check as extra safety
        card.addEventListener('click', (e) => {
            if (isScrolling) {
                isScrolling = false; // Reset
                return; // Ignore click if it was a swipe
            }
            toggleCard(card);
        });

        // Keyboard navigation
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard(card);
            }
        });
    });
}

/**
 * PROGRAM TABS - Switch between days
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active to clicked
            button.classList.add('active');
            tabPanels[index].classList.add('active');
        });
    });
}

/**
 * FAQ ACCORDION - Expand/collapse questions
 */
function initAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-header');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * SCROLL REVEAL - Premium one-time animations using IntersectionObserver
 * Supports: .timeline li, .accordion-item, .gallery-item, .feature-card
 */
const REVEAL_SELECTORS = [
    '.timeline li',
    '.accordion-item',
    '.gallery-item',
    '.feature-card'
];

const STAGGER_DELAY = 180; // ms between items in same group

function initScrollReveal(rootEl = document) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup elements with classes and stagger delays
    REVEAL_SELECTORS.forEach(selector => {
        // Group elements by parent to calculate stagger per group
        const groups = new Map();

        rootEl.querySelectorAll(selector).forEach(el => {
            // Skip already initialized
            if (el.classList.contains('scroll-reveal')) return;

            const parent = el.parentElement;
            if (!groups.has(parent)) {
                groups.set(parent, []);
            }
            groups.get(parent).push(el);
        });

        // Apply classes and delays per group
        groups.forEach((elements, parent) => {
            elements.forEach((el, index) => {
                el.classList.add('scroll-reveal');

                // Alternate direction: even from left, odd from right
                if (index % 2 === 0) {
                    el.classList.add('from-left');
                } else {
                    el.classList.add('from-right');
                }

                // Stagger delay
                el.style.setProperty('--reveal-delay', `${index * STAGGER_DELAY}ms`);

                // If reduced motion, reveal instantly
                if (prefersReducedMotion) {
                    el.classList.add('in-view');
                }
            });
        });
    });

    if (prefersReducedMotion) return;

    // IntersectionObserver - trigger 100px before element enters viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    rootEl.querySelectorAll('.scroll-reveal:not(.in-view)').forEach(el => {
        revealObserver.observe(el);
    });

    // Also handle legacy .reveal sections
    const sectionOptions = {
        root: null,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, sectionOptions);

    rootEl.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        sectionObserver.observe(el);
    });
}

// Expose globally for dynamic content (e.g., "Show more" button)
window.initScrollReveal = initScrollReveal;

/**
 * SMOOTH SCROLL - For anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offset = 0;
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * STICKY CTA - Show/hide sticky register button
 */
function initStickyCta() {
    const stickyCta = document.querySelector('.sticky-cta');
    if (!stickyCta) return;

    const registerSection = document.querySelector('#register');
    if (!registerSection) return;

    const checkPosition = () => {
        const registerTop = registerSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (registerTop > windowHeight) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', checkPosition, { passive: true });
    checkPosition();
}

/**
 * PARALLAX EFFECT - Disabled to keep background fixed
 * The hero-bg is now position:fixed and should not move
 */
function initParallax() {
    // Parallax disabled - hero-bg is fixed and should not transform
    return;
}

/**
 * GALLERY VIDEOS - Open in fullscreen lightbox
 */
function initGalleryVideos() {
    const videoItems = document.querySelectorAll('.gallery-item-video');
    const videoLightbox = document.getElementById('videoLightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const videoLightboxClose = document.getElementById('videoLightboxClose');

    if (!videoLightbox || !lightboxVideo || !videoLightboxClose) return;

    // Click on video item to open in lightbox
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const video = item.querySelector('video');
            if (!video) return;

            const source = video.querySelector('source');
            if (source) {
                lightboxVideo.src = source.src;
                videoLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                lightboxVideo.play();
            }
        });
    });

    // Close video lightbox
    const closeVideoLightbox = () => {
        videoLightbox.classList.remove('active');
        lightboxVideo.pause();
        lightboxVideo.src = '';
        document.body.style.overflow = '';
    };

    videoLightboxClose.addEventListener('click', closeVideoLightbox);
    videoLightbox.addEventListener('click', (e) => {
        if (e.target === videoLightbox) {
            closeVideoLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoLightbox.classList.contains('active')) {
            closeVideoLightbox();
        }
    });

    // Show more videos button
    const showMoreBtn = document.getElementById('showMoreVideos');
    const galleryExtra = document.getElementById('galleryExtra');

    if (showMoreBtn && galleryExtra) {
        showMoreBtn.addEventListener('click', () => {
            const isExpanding = !galleryExtra.classList.contains('visible');

            showMoreBtn.classList.toggle('expanded');
            galleryExtra.classList.toggle('visible');

            if (isExpanding) {
                // Scroll to show new content when expanding
                setTimeout(() => {
                    galleryExtra.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 200);
            } else {
                // Scroll back to button when collapsing
                setTimeout(() => {
                    showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        });
    }
}


// ==========================================
// LANGUAGE TOGGLE - UA/RU
// ==========================================

// Повні переклади для всіх елементів сторінки
const translations = {
    ua: {
        page: {
            title: 'Зимовий Табір у Горах | 4 дні для молодих сімей'
        },
        nav: {
            langLabel: 'Змінити мову'
        },
        hero: {
            location: 'Willingen, Німеччина',
            title: 'Зимовий табір<br><em>для молодих сімей</em>',
            subtitle: 'Християнський табір для молодих пар — лижі, спорт, тренінги та духовне зростання разом.',
            dates: '9–12 лютого',
            couples: 'до 30 сімей'
        },
        about: {
            title: 'Що це таке?',
            lead: 'Чотири дні в горах — щоб провести час разом як сім\'я, навчитися новому і зміцнити стосунки в оточенні інших молодих пар.',
            text1: 'Це не просто відпочинок. Не тільки навчання. Не лише спорт.',
            text2: 'Це <strong>час для вашої сімʼї</strong> — для активного відпочинку, практичних тренінгів з фінансів та служіння, і глибокого спілкування з Богом та одне з одним.'
        },
        features: {
            ski: {
                title: 'Лижі',
                desc: 'Катання на підйомниках та схилах'
            },
            training: {
                title: 'Тренінги',
                desc: 'Фінанси та проповіді'
            },
            activities: {
                title: 'Активності, вікторини',
                desc: 'Баня, більярд, боулінг, волейбол'
            },
            spiritual: {
                title: 'Духовна частина',
                desc: 'Молитва, навчання і спілкування'
            }
        },
        program: {
            title: 'Програма табору',
            subtitle: 'Чотири насичені дні — активності, навчання та спілкування з Богом.',
            days: {
                day1: 'День 1',
                day2: 'День 2',
                day3: 'День 3',
                day4: 'День 4'
            },
            day1: {
                title: 'Понеділок, 9 лютого',
                event1: 'Заїзд та заселення',
                event2: 'Спільна вечеря',
                event3: 'Програма табору, бесіда, розкриття теми',
                event4: 'Спілкування: чай, ігри, вікторини',
                note: 'Заїзд 👋'
            },
            day2: {
                title: 'Вівторок, 10 лютого',
                event1: 'Сніданок',
                event2: 'Ранкове зібрання',
                event3: 'Дозвілля',
                event4: 'Обід',
                event5: 'Дозвілля',
                event6: 'Вечеря',
                event7: 'Загальне зібрання',
                event8: 'Спілкування, ігри, вікторини',
                note: 'Входим в ритм ☕'
            },
            day3: {
                title: 'Середа, 11 лютого',
                event1: 'Сніданок',
                event2: 'Ранкове зібрання',
                event3: 'Дозвілля',
                event4: 'Обід',
                event5: 'Дозвілля',
                event6: 'Вечеря',
                event7: 'Загальне зібрання',
                event8: 'Спілкування, ігри, вікторини',
                note: 'День відпочинку ⛷'
            },
            day4: {
                title: 'Четвер, 12 лютого',
                event1: 'Сніданок',
                event2: 'Ранкове зібрання, підсумки',
                event3: 'Збір речей',
                event4: 'Обід',
                event5: 'Виїзд з табору',
                event6: 'Катання на ковзанах ⛸',
                note: 'Додому 🧳'
            }
        },
        speaker: {
            title: 'Спікери',
            subtitle: 'З нами будуть досвідчені служителі.',
            speaker1: {
                name: 'Віталій Єременко',
                role: 'Пастор та проповідник',
                bio: 'Віталій має досвід пасторського служіння та буде доступний для духовної підтримки.',
                topic1: 'Духовна підтримка'
            },
            speaker2: {
                name: 'Давид Акопян',
                role: 'Служитель та наставник',
                bio: 'Давид братиме участь у духовному служінні табору та проведе бесіду для братів.',
                topic1: 'Як приготувати проповідь'
            },
            speaker3: {
                name: 'В\'ячеслав Марфіч',
                role: 'Пастор та вчитель',
                bio: 'В\'ячеслав братиме участь у програмі табору з темою взаємодії християнина з церквою.',
                topic: 'Я і церква'
            },
            additional: {
                title: 'Додаткові тренінги'
            },
            trainer1: {
                topic: '💰 Фінанси',
                name: 'Руслан Акопян',
                tag: '👨 братам'
            },
            trainer2: {
                topic: '👩‍👧 Роль жінки в сім\'ї',
                name: 'Алла Акопян',
                tag: '👩 сестрам'
            },
            trainer3: {
                topic: '💑 Жінка-помічниця',
                name: 'Егіне Акопян',
                tag: '👩 сестрам'
            }
        },
        gallery: {
            title: 'Як це виглядає',
            subtitle: 'Фото та відео що вас очікує.',
            showMore: 'Більше відео',
            showLess: 'Менше відео'
        },
        included: {
            title: 'Що входить',
            stay: 'Проживання 3 ночі',
            food: 'Повне харчування',
            ski: 'Лижні підйомники',
            trainings: 'Бесіди та тренінги',
            sports: 'Спортивні активності',
            entertainment: 'Баня та розваги'
        },
        faq: {
            title: 'Часті запитання',
            subtitle: 'Те, що важливо знати перед рішенням.',
            q1: {
                question: 'Хто може поїхати на табір?',
                answer: 'Табір для християнських сімей до 10 років спільного життя. Якщо ви хочете активно провести час, навчитися новому та поспілкуватися з Богом — ви запрошені!'
            },
            q2: {
                question: 'Чи можна приїхати з дітьми?',
                answer: '<strong>Так.</strong> Вкажіть інформацію про дітей у додатковій інформації при реєстрації.'
            },
            q4: {
                question: 'Що брати з собою?',
                answer: 'Постільну білизну, теплий одяг (для гір), засоби гігієни, Біблію та гарний настрій!'
            },
            q5: {
                question: 'Скільки коштує участь?',
                answer: 'Орієнтовно <strong>450€ на сімʼю</strong> (проживання, харчування, програма, підйомники).'
            },
            q6: {
                question: 'Які розваги будуть у таборі?',
                answer: 'Катання на лижах, баня, більярд, боулінг, волейбол, настільні ігри та багато іншого! Вечорами — спільний час, співи та спілкування.'
            },
            askMore: 'Є питання, на яке хочеш почути відповідь у таборі? Напиши анонімно.',
            askButton: 'Написати'
        },
        register: {
            title: 'Готові?',
            subtitle: 'Місць обмаль — до 30 пар. Заповніть форму, і ми зв\'яжемося з вами.',
            form: {
                family: 'Прізвище сім\'ї *',
                husband: 'Ім\'я чоловіка',
                wife: 'Ім\'я дружини',
                country: 'Країна телефону *',
                countryUA: '🇺🇦 Україна',
                countryDE: '🇩🇪 Німеччина',
                phone: 'Телефон *',
                phonePlaceholder: 'XXX XXXXXXX',
                phoneHint: 'Приклад: +380 50 123 45 67',
                children: 'Діти (якщо їдуть)',
                addChild: 'Додати дитину',
                childName: 'Ім\'я дитини',
                childAge: 'Вік',
                agePlaceholder: 'напр. 2 р. або 5 міс.',
                childLabel: 'Дитина',
                comments: 'Коментарі або запитання',
                commentsPlaceholder: 'Додаткова інформація, особливі потреби, запитання...'
            },
            submit: 'Відправити заявку',
            note: 'Реєстрація — вносить вас у список і за вами буде заброньовано місце.',
            deadline: 'Реєстрація відкрита до 11 січня 2026',
            success: {
                title: 'Дякуємо за реєстрацію!',
                message: 'Ми зв\'яжемося з вами найближчим часом.',
                joinGroup: 'Приєднатися'
            },
            closed: {
                title: 'Реєстрацію закрито',
                message: 'Реєстрація на табір завершилась 11 січня 2026.'
            }
        },
        countdown: {
            title: '⏰ До закінчення реєстрації',
            label: 'До закінчення реєстрації:',
            days: 'днів',
            hours: 'годин',
            minutes: 'хвилин',
            seconds: 'секунд'
        },
        footer: {
            copyright: '© 2026 Зимовий Табір для молодих сімей',
            location: 'Willingen, Німеччина',
            contact: 'Питання?',
            credit: 'Зроблено'
        },
        modals: {
            confirm: {
                open: 'Відкрити',
                cancel: 'Скасувати'
            },
            calendar: {
                title: '📅 Додати в календар',
                text: 'Зимовий табір: 9–12 лютого 2026',
                add: 'Додати',
                cancel: 'Скасувати'
            },
            question: {
                title: 'Анонімне запитання ❓',
                text: 'Відповідь почуєш у таборі',
                placeholder: 'Твоє запитання...',
                submit: 'Відправити',
                cancel: 'Скасувати'
            },
            map: {
                title: 'Відкрити Google Maps?',
                text: 'Переглянути розташування табору у Willingen'
            }
        }
    },
    ru: {
        page: {
            title: 'Зимний Лагерь в Горах | 4 дня для молодых семей'
        },
        nav: {
            langLabel: 'Изменить язык'
        },
        hero: {
            location: 'Willingen, Германия',
            title: 'Зимний лагерь<br><em>для молодых семей</em>',
            subtitle: 'Христианский лагерь для молодых пар — лыжи, спорт, тренинги и духовный рост вместе.',
            dates: '9–12 февраля',
            couples: 'до 30 семей'
        },
        about: {
            title: 'Что это такое?',
            lead: 'Четыре дня в горах — чтобы провести время вместе как семья, научиться новому и укрепить отношения в окружении других молодых пар.',
            text1: 'Это не просто отдых. Не только обучение. Не только спорт.',
            text2: 'Это <strong>время для вашей семьи</strong> — для активного отдыха, практических тренингов по финансам и служению, и глубокого общения с Богом и друг с другом.'
        },
        features: {
            ski: {
                title: 'Лыжи',
                desc: 'Катание на подъёмниках и склонах'
            },
            training: {
                title: 'Тренинги',
                desc: 'Финансы и проповеди'
            },
            activities: {
                title: 'Активности, викторины',
                desc: 'Баня, бильярд, боулинг, волейбол'
            },
            spiritual: {
                title: 'Духовная часть',
                desc: 'Молитва, обучение и общение'
            }
        },
        program: {
            title: 'Программа лагеря',
            subtitle: 'Четыре насыщенных дня — активности, обучение и общение с Богом.',
            days: {
                day1: 'День 1',
                day2: 'День 2',
                day3: 'День 3',
                day4: 'День 4'
            },
            day1: {
                title: 'Понедельник, 9 февраля',
                event1: 'Заезд и заселение',
                event2: 'Совместный ужин',
                event3: 'Программа лагеря, беседа, раскрытие темы',
                event4: 'Общение: чай, игры, викторины',
                note: 'Заезд 👋'
            },
            day2: {
                title: 'Вторник, 10 февраля',
                event1: 'Завтрак',
                event2: 'Утреннее собрание',
                event3: 'Досуг',
                event4: 'Обед',
                event5: 'Досуг',
                event6: 'Ужин',
                event7: 'Общее собрание',
                event8: 'Общение, игры, викторины',
                note: 'Входим в ритм ☕'
            },
            day3: {
                title: 'Среда, 11 февраля',
                event1: 'Завтрак',
                event2: 'Утреннее собрание',
                event3: 'Досуг',
                event4: 'Обед',
                event5: 'Досуг',
                event6: 'Ужин',
                event7: 'Общее собрание',
                event8: 'Общение, игры, викторины',
                note: 'День отдыха ⛷'
            },
            day4: {
                title: 'Четверг, 12 февраля',
                event1: 'Завтрак',
                event2: 'Утреннее собрание, итоги',
                event3: 'Сбор вещей',
                event4: 'Обед',
                event5: 'Выезд из лагеря',
                event6: 'Катание на коньках ⛸',
                note: 'Домой 🧳'
            }
        },
        speaker: {
            title: 'Спикеры',
            subtitle: 'С нами будут опытные служители.',
            speaker1: {
                name: 'Виталий Еременко',
                role: 'Пастор и проповедник',
                bio: 'Виталий имеет опыт пасторского служения и будет доступен для духовной поддержки.',
                topic1: 'Духовная поддержка'
            },
            speaker2: {
                name: 'Давид Акопян',
                role: 'Служитель и наставник',
                bio: 'Давид будет участвовать в духовном служении лагеря и проведёт беседу для братьев.',
                topic1: 'Как подготовить проповедь'
            },
            speaker3: {
                name: 'Вячеслав Марфич',
                role: 'Пастор и учитель',
                bio: 'Вячеслав будет участвовать в программе лагеря с темой взаимодействия христианина с церковью.',
                topic: 'Я и церковь'
            },
            additional: {
                title: 'Дополнительные тренинги'
            },
            trainer1: {
                topic: '💰 Финансы',
                name: 'Руслан Акопян',
                tag: '👨 братьям'
            },
            trainer2: {
                topic: '👩‍👧 Роль женщины в семье',
                name: 'Алла Акопян',
                tag: '👩 сёстрам'
            },
            trainer3: {
                topic: '💑 Женщина-помощница',
                name: 'Эгине Акопян',
                tag: '👩 сёстрам'
            }
        },
        gallery: {
            title: 'Как это выглядит',
            subtitle: 'Фото и видео, что вас ждёт.',
            showMore: 'Больше видео',
            showLess: 'Меньше видео'
        },
        included: {
            title: 'Что включено',
            stay: 'Проживание 3 ночи',
            food: 'Полное питание',
            ski: 'Лыжные подъёмники',
            trainings: 'Беседы и тренинги',
            sports: 'Спортивные активности',
            entertainment: 'Баня и развлечения'
        },
        faq: {
            title: 'Частые вопросы',
            subtitle: 'То, что важно знать перед решением.',
            q1: {
                question: 'Кто может поехать в лагерь?',
                answer: 'Лагерь для христианских семей до 10 лет совместной жизни. Если вы хотите активно провести время, научиться новому и пообщаться с Богом — вы приглашены!'
            },
            q2: {
                question: 'Можно ли приехать с детьми?',
                answer: '<strong>Да.</strong> Укажите информацию о детях в дополнительной информации при регистрации.'
            },
            q4: {
                question: 'Что брать с собой?',
                answer: 'Постельное бельё, тёплую одежду (для гор), средства гигиены, Библию и хорошее настроение!'
            },
            q5: {
                question: 'Сколько стоит участие?',
                answer: 'Ориентировочно <strong>450€ на семью</strong> (проживание, питание, программа, подъёмники).'
            },
            q6: {
                question: 'Какие развлечения будут в лагере?',
                answer: 'Катание на лыжах, баня, бильярд, боулинг, волейбол, настольные игры и много другого! Вечерами — совместное время, пение и общение.'
            },
            askMore: 'Есть вопрос, на который хочешь услышать ответ в лагере? Напиши анонимно.',
            askButton: 'Написать'
        },
        register: {
            title: 'Готовы?',
            subtitle: 'Мест мало — до 30 пар. Заполните форму, и мы свяжемся с вами.',
            form: {
                family: 'Фамилия семьи *',
                husband: 'Имя мужа',
                wife: 'Имя жены',
                country: 'Страна телефона *',
                countryUA: '🇺🇦 Украина',
                countryDE: '🇩🇪 Германия',
                phone: 'Телефон *',
                phonePlaceholder: 'XXX XXXXXXX',
                phoneHint: 'Пример: +380 50 123 45 67',
                children: 'Дети (если едут)',
                addChild: 'Добавить ребёнка',
                childName: 'Имя ребёнка',
                childAge: 'Возраст',
                agePlaceholder: 'напр. 2 г. или 5 мес.',
                childLabel: 'Ребёнок',
                comments: 'Комментарии или вопросы',
                commentsPlaceholder: 'Дополнительная информация, особые потребности, вопросы...'
            },
            submit: 'Отправить заявку',
            note: 'Регистрация — вносит вас в список и за вами будет забронировано место.',
            deadline: 'Регистрация открыта до 11 января 2026',
            success: {
                title: 'Спасибо за регистрацию!',
                message: 'Мы свяжемся с вами в ближайшее время.',
                joinGroup: 'Присоединиться'
            },
            closed: {
                title: 'Регистрация закрыта',
                message: 'Регистрация на лагерь завершилась 11 января 2026.'
            }
        },
        countdown: {
            title: '⏰ До окончания регистрации',
            label: 'До окончания регистрации:',
            days: 'дней',
            hours: 'часов',
            minutes: 'минут',
            seconds: 'секунд'
        },
        footer: {
            copyright: '© 2026 Зимний лагерь для молодых семей',
            location: 'Willingen, Германия',
            contact: 'Вопросы?',
            credit: 'Сделано'
        },
        modals: {
            confirm: {
                open: 'Открыть',
                cancel: 'Отмена'
            },
            calendar: {
                title: '📅 Добавить в календарь',
                text: 'Зимний лагерь: 9–12 февраля 2026',
                add: 'Добавить',
                cancel: 'Отмена'
            },
            question: {
                title: 'Анонимный вопрос ❓',
                text: 'Ответ услышишь в лагере',
                placeholder: 'Твой вопрос...',
                submit: 'Отправить',
                cancel: 'Отмена'
            },
            map: {
                title: 'Открыть Google Maps?',
                text: 'Посмотреть расположение лагеря в Willingen'
            }
        }
    }
};

// Список доступних мов для перемикання
const languages = ['ua', 'ru'];

// Detect browser language if no saved preference
const browserLang = navigator.language || navigator.userLanguage;
const defaultLang = (browserLang && browserLang.toLowerCase().startsWith('ru')) ? 'ru' : 'ua';

let currentLang = localStorage.getItem('language') || defaultLang;

// Safety check
if (!languages.includes(currentLang)) currentLang = 'ua';

function initLanguageToggle() {
    const toggle = document.getElementById('languageToggle');
    if (!toggle) return;


    // Встановити початковий текст
    updateLanguage(currentLang);

    // Обробник кліку - перемикання між мовами
    toggle.addEventListener('click', () => {
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        currentLang = languages[nextIndex];
        localStorage.setItem('language', currentLang);
        updateLanguage(currentLang);
    });
}

function updateLanguage(lang) {
    const toggle = document.getElementById('languageToggle');
    const langText = toggle.querySelector('.lang-text');

    // Оновити текст на кнопці (показуємо код мови)
    langText.textContent = lang.toUpperCase();
    toggle.setAttribute('aria-label', translations[lang].nav.langLabel);

    // Оновити мову в HTML
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang;

    const t = translations[lang];

    // Оновити всі елементи з data-i18n атрибутом
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(t, key);

        if (value) {
            // Якщо елемент має data-i18n-html="true", використати innerHTML
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = value;
            } else {
                el.textContent = value;
            }
        }
    });

    // Оновити placeholder'и
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = getNestedValue(t, key);
        if (value) {
            el.placeholder = value;
        }
    });

    // Оновити aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const value = getNestedValue(t, key);
        if (value) {
            el.setAttribute('aria-label', value);
        }
    });
}

// Допоміжна функція для отримання вкладених значень (наприклад, "hero.location")
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}


/**
 * LIGHTBOX - Open images AND videos in fullscreen with navigation
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImage || !lightboxClose) return;

    // Collect all gallery items (images and videos) in DOM order
    const allGalleryItems = [];

    // Get all gallery items in DOM order
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (item.classList.contains('gallery-item-video')) {
            // Video item
            const video = item.querySelector('video');
            const source = video?.querySelector('source');
            const poster = video?.getAttribute('poster') || '';
            if (source) {
                allGalleryItems.push({
                    type: 'video',
                    src: source.src,
                    poster: poster,
                    element: item
                });
            }
        } else {
            // Image item
            const img = item.querySelector('img');
            if (img) {
                allGalleryItems.push({ type: 'image', src: img.src, alt: img.alt, element: item });
            }
        }
    });

    let currentIndex = 0;

    // Create or get lightbox video element
    let lightboxVideo = lightbox.querySelector('.lightbox-video');
    if (!lightboxVideo) {
        lightboxVideo = document.createElement('video');
        lightboxVideo.className = 'lightbox-video lightbox-image';
        lightboxVideo.controls = true;
        lightboxVideo.playsInline = true;
        lightboxVideo.style.display = 'none';
        lightboxImage.parentNode.insertBefore(lightboxVideo, lightboxImage.nextSibling);
    }

    // Create navigation arrows if they don't exist
    let prevBtn = lightbox.querySelector('.lightbox-prev');
    let nextBtn = lightbox.querySelector('.lightbox-next');
    let counter = lightbox.querySelector('.lightbox-counter');

    if (!prevBtn) {
        prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-prev';
        prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        prevBtn.setAttribute('aria-label', 'Попереднє');
        lightbox.appendChild(prevBtn);
    }

    if (!nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-next';
        nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        nextBtn.setAttribute('aria-label', 'Наступне');
        lightbox.appendChild(nextBtn);
    }

    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        lightbox.appendChild(counter);
    }

    // Show item at index
    const showItem = (index) => {
        if (index < 0) index = allGalleryItems.length - 1;
        if (index >= allGalleryItems.length) index = 0;

        currentIndex = index;
        const item = allGalleryItems[currentIndex];

        // Stop any playing video
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.src = "";

        // Also pause all grid videos to prevent background audio
        document.querySelectorAll('.gallery-video').forEach(vid => vid.pause());

        if (item.type === 'image') {
            lightboxImage.src = item.src;
            lightboxImage.alt = item.alt || '';
            lightboxImage.style.display = 'block';
            lightboxVideo.style.display = 'none';
        } else if (item.type === 'video') {
            lightboxVideo.src = item.src;
            lightboxVideo.removeAttribute('poster'); // No poster in lightbox
            lightboxImage.style.display = 'none';
            lightboxVideo.style.display = 'block';

            // Small timeout to ensure clean state
            setTimeout(() => {
                lightboxVideo.play().catch(e => console.log('Autoplay prevented:', e));
            }, 50);
        }

        counter.textContent = `${currentIndex + 1} / ${allGalleryItems.length}`;
    };

    // Open lightbox from gallery items
    allGalleryItems.forEach((item, index) => {
        item.element.addEventListener('click', (e) => {
            // Don't double-handle video items (they have their own handler)
            if (item.type === 'video') return;

            currentIndex = index;
            showItem(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Override video item clicks to use unified lightbox
    document.querySelectorAll('.gallery-item-video').forEach((videoItem, vIndex) => {
        videoItem.addEventListener('click', (e) => {
            e.stopPropagation();
            // Find this video in our items array
            const itemIndex = allGalleryItems.findIndex(item => item.element === videoItem);
            if (itemIndex !== -1) {
                currentIndex = itemIndex;
                showItem(currentIndex);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Navigation
    const goNext = () => showItem(currentIndex + 1);
    const goPrev = () => showItem(currentIndex - 1);

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goNext();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goPrev();
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
        lightboxVideo.src = "";
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            goNext();
        } else if (e.key === 'ArrowLeft') {
            goPrev();
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goNext(); // Swipe left -> next
            } else {
                goPrev(); // Swipe right -> prev
            }
        }
    }, { passive: true });
}

/**
 * REGISTRATION FORM - Handle dynamic children fields and form submission
 */
function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const addChildBtn = document.getElementById('addChildBtn');
    const childrenContainer = document.getElementById('childrenContainer');
    const formSuccess = document.getElementById('formSuccess');

    if (!form || !addChildBtn || !childrenContainer) return;

    // Check registration deadline
    const REGISTRATION_DEADLINE = new Date('2026-01-11T23:59:59');
    const now = new Date();

    if (now > REGISTRATION_DEADLINE) {
        // Registration is closed - show message
        form.innerHTML = `
            <div class="registration-closed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 data-i18n="register.closed.title">Реєстрацію закрито</h3>
                <p data-i18n="register.closed.message">Реєстрація на табір завершилась 20 січня 2026.</p>
            </div>
        `;
        // Apply translations to the new content
        if (typeof applyPageTranslations === 'function') {
            applyPageTranslations();
        }
        return;
    }

    // Country Selector Dropdown
    const countrySelector = document.getElementById('countrySelector');
    const countryDropdown = document.getElementById('countryDropdown');
    const selectedFlag = document.getElementById('selectedFlag');
    const selectedCode = document.getElementById('selectedCode');
    const phoneCountryInput = document.getElementById('phoneCountry');
    const phoneInput = document.getElementById('phone');

    if (countrySelector && countryDropdown) {
        // Toggle dropdown
        countrySelector.addEventListener('click', (e) => {
            e.stopPropagation();
            countrySelector.classList.toggle('open');
        });

        // Select country option
        countryDropdown.querySelectorAll('.country-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                const country = option.dataset.country;
                const flag = option.dataset.flag;
                const code = option.dataset.code;

                selectedFlag.textContent = flag;
                selectedCode.textContent = code;
                phoneCountryInput.value = country;

                // Update placeholder based on country
                if (country === 'ukraine') {
                    phoneInput.placeholder = 'XX XXX XX XX';
                } else {
                    phoneInput.placeholder = 'XXX XXXXXXX';
                }

                // Mark selected
                countryDropdown.querySelectorAll('.country-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');

                countrySelector.classList.remove('open');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            countrySelector.classList.remove('open');
        });

        // Set initial selected state for Germany
        const germanyOption = countryDropdown.querySelector('[data-country="germany"]');
        if (germanyOption) {
            germanyOption.classList.add('selected');
        }
    }

    // Add child entry
    addChildBtn.addEventListener('click', () => {
        const childEntry = createChildEntry();
        childrenContainer.insertAdjacentHTML('beforeend', childEntry);
        renumberChildren();

        // Add remove event listener to the new button
        const allEntries = childrenContainer.querySelectorAll('.child-entry');
        const lastEntry = allEntries[allEntries.length - 1];
        const removeBtn = lastEntry.querySelector('.btn-remove-child');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                lastEntry.remove();
                renumberChildren();
            });
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);

        // Collect children data
        const childNames = formData.getAll('childFirstName[]');
        const childAges = formData.getAll('childAge[]');
        const children = childNames.map((name, index) => ({
            firstName: name,
            age: childAges[index]
        }));

        // Get country code from selector (e.g. "+49" or "+380")
        const countryCodeEl = document.getElementById('selectedCode');
        const countryCode = countryCodeEl ? countryCodeEl.textContent.trim() : '+49';
        const rawPhone = formData.get('phone').trim();

        // Check if user already entered full international number
        let fullPhone;
        if (rawPhone.startsWith('+') || rawPhone.startsWith('00')) {
            // User entered full number with country code - use as is (normalize 00 to +)
            fullPhone = rawPhone.replace(/^00/, '+');
        } else {
            // Local number - add country code and remove leading zero
            fullPhone = countryCode + rawPhone.replace(/^0+/, '');
        }

        const data = {
            familyName: formData.get('familyName'),
            husbandName: formData.get('husbandName'),
            wifeName: formData.get('wifeName'),
            phoneCountry: formData.get('phoneCountry'),
            phone: fullPhone, // Now includes country code
            children: children,
            comments: formData.get('comments')
        };

        // Send to Telegram
        sendToTelegram(data);

        // Send to Google Sheets (if configured)
        sendToGoogleSheets(data);
    });

    // TODO: Вставте сюди URL вашого Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyI4lqjAtZyTuc82T5rxSqmPki08LxDY1Todolg0UsBtBWcAtpZ9pcqbjdJihAF-IzZ/exec';

    async function sendToGoogleSheets(data) {
        if (!GOOGLE_SCRIPT_URL) return;

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Forms/Scripts
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log('✅ Заявка відправлена в Google Sheets');
        } catch (error) {
            console.error('❌ Помилка Google Sheets:', error);
            // Don't block success flow if Sheets fails
        }
    }

    async function sendToTelegram(data) {
        // TODO: Замініть на ваші дані
        const TELEGRAM_BOT_TOKEN = '8566564117:AAF1h19DyvrqPXt2bylV7FZzjI4vkFuIdQo';
        const TELEGRAM_CHAT_ID = '-1003368695156';

        // Get submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        btnText.textContent = 'Відправляємо...';

        // Format message
        const message = formatTelegramMessage(data);

        // Prepare Telegram Confirmation Link
        // Remove all non-digits from phone for the link
        const cleanPhone = data.phone.replace(/\D/g, '');
        // Note: Telegram doesn't officially support pre-filled text for direct phone links like WhatsApp does
        // But we can open the chat
        const tgLink = `https://t.me/+${cleanPhone}`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "💬 Написати в Telegram",
                                    url: tgLink
                                }
                            ]
                        ]
                    }
                })
            });

            if (response.ok) {
                console.log('✅ Заявка відправлена в Telegram');
                // Show success message
                form.style.display = 'none';

                // Hide header and countdown
                const registerTitle = document.querySelector('.register-content h2');
                const countdownTitle = document.querySelector('.countdown-title');
                const countdownPill = document.getElementById('formCountdown');

                if (registerTitle) registerTitle.style.display = 'none';
                if (countdownTitle) countdownTitle.style.display = 'none';
                if (countdownPill) countdownPill.style.display = 'none';

                formSuccess.style.display = 'block';
                // Launch confetti celebration! 🎊
                launchConfetti();
            } else {
                console.error('❌ Помилка відправки в Telegram:', await response.text());
                alert('Помилка відправки заявки. Спробуйте пізніше.');
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            }
        } catch (error) {
            console.error('❌ Помилка:', error);
            alert('Помилка відправки заявки. Перевірте підключення до інтернету.');
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            btnText.textContent = originalText;
        }
    }

    function formatTelegramMessage(data) {
        let message = '🎿 <b>Нова заявка на табір!</b>\n';
        message += '━━━━━━━━━━━━━━━━━━━━\n';

        // Прізвище сім'ї
        message += `👨‍👩‍👧‍👦 <b>Сім'я:</b> ${data.familyName}\n`;

        // Чоловік
        if (data.husbandName) {
            message += `👨 <b>Чоловік:</b> ${data.husbandName}\n`;
        }

        // Дружина
        if (data.wifeName) {
            message += `👩 <b>Дружина:</b> ${data.wifeName}\n`;
        }

        // Діти
        if (data.children.length > 0) {
            message += `👶 <b>Діти:</b>\n`;
            data.children.forEach((child, index) => {
                message += `   ${index + 1}. ${child.firstName} - ${child.age}\n`;
            });
        } else {
            message += '👶 <b>Діти:</b> Без дітей\n';
        }

        // Телефон з кодом країни
        const countryCode = data.phoneCountry === 'ukraine' ? '+380' : '+49';
        const fullPhone = countryCode + data.phone;
        message += `📱 <b>Телефон:</b> ${fullPhone}\n`;

        // Коментарі
        if (data.comments) {
            message += `━━━━━━━━━━━━━━━━━━━━\n`;
            message += `💬 <b>Коментарі:</b>\n${data.comments}`;
        }

        return message;
    }

    function createChildEntry() {
        const t = translations[currentLang].register.form;
        return `
            <div class="child-entry">
                <div class="child-entry-header">
                    <h4 class="child-entry-title">${t.childLabel || 'Дитина'} ${childrenContainer.children.length + 1}</h4>
                    <button type="button" class="btn-remove-child" aria-label="Видалити дитину">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>${t.childName}</label>
                        <input type="text" name="childFirstName[]" required>
                    </div>
                    <div class="form-group">
                        <label>${t.childAge}</label>
                        <input type="text" name="childAge[]" placeholder="${t.agePlaceholder || 'напр. 2 р. або 5 міс.'}" required>
                    </div>
                </div>
            </div>
        `;
    }

    function renumberChildren() {
        const childEntries = childrenContainer.querySelectorAll('.child-entry');
        const t = translations[currentLang].register.form;
        childEntries.forEach((entry, index) => {
            const title = entry.querySelector('.child-entry-title');
            if (title) {
                title.textContent = `${t.childLabel || 'Дитина'} ${index + 1}`;
            }
        });
    }
}

/**
 * Initialize Included Slider (Infinite Loop)
 */
function initIncludedSlider() {
    const slider = document.getElementById('includedSlider');
    const prevBtn = document.getElementById('includedPrev');
    const nextBtn = document.getElementById('includedNext');
    const dotsContainer = document.getElementById('includedDots');

    if (!slider || !prevBtn || !nextBtn || !dotsContainer) return;

    const items = slider.querySelectorAll('.included-item');
    let itemsPerView = getItemsPerView();
    const totalItems = items.length;
    const totalSlides = Math.ceil(totalItems / itemsPerView);
    let currentIndex = 0;
    let isTransitioning = false;

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Слайд ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function getItemsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function updateSlider() {
        // З padding-right та box-sizing просто рухаємо по 100% на слайд
        const offsetPercentage = -(currentIndex * 100);
        slider.style.transform = `translateX(${offsetPercentage}%)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (isTransitioning) return;

        // Циклічне перемикання
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newItemsPerView = getItemsPerView();
            if (newItemsPerView !== itemsPerView) {
                itemsPerView = newItemsPerView;
                currentIndex = 0;
                createDots();
                updateSlider();
            }
        }, 250);
    });

    // Initialize
    createDots();
    updateSlider();
}

/**
 * SCROLL PROGRESS BAR
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * 3D CARD TILT EFFECT
 */
function init3DCards() {
    const cards = document.querySelectorAll('.feature-card-inner, .glass-card, .service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/**
 * SNOW PARTICLES ANIMATION
 */
function initSnow() {
    const canvas = document.getElementById('snowCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let snowflakes = [];
    const maxSnowflakes = 20;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake symbols
    // Snowflake symbols (classics only)
    const snowSymbols = ['❄', '❅', '❆'];

    class Snowflake {
        constructor() {
            this.symbol = snowSymbols[Math.floor(Math.random() * snowSymbols.length)];
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 1 + 0.5;
            this.wind = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.6 + 0.3;
            // Rotation
            this.angle = Math.random() * Math.PI * 2;
            this.spin = Math.random() * 0.05 - 0.025; // Random spin speed
        }

        update() {
            this.y += this.speed;
            this.x += this.wind;
            this.angle += this.spin; // Update rotation

            if (this.y > canvas.height) {
                this.reset();
                this.y = -10;
            }
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle); // Apply rotation
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.font = `${this.size * 4}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
    }

    // Create snowflakes
    for (let i = 0; i < maxSnowflakes; i++) {
        snowflakes.push(new Snowflake());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * CONFETTI CELEBRATION - Launch confetti on successful registration 🎊
 */
function launchConfetti() {
    const duration = 3000;
    const particleCount = 100;
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#DDA0DD', '#fff'];

    // Create confetti container
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
        overflow: hidden;
    `;
    document.body.appendChild(container);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const startY = -10;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 500;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${startX}%;
            top: ${startY}%;
            transform: rotate(${rotation}deg);
            opacity: 1;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;

        container.appendChild(particle);

        // Animate particle
        const endX = startX + (Math.random() - 0.5) * 40;
        const endY = 110;
        const animDuration = duration + Math.random() * 1000;

        particle.animate([
            { transform: `translate(0, 0) rotate(${rotation}deg)`, opacity: 1 },
            { transform: `translate(${(endX - startX)}vw, ${endY}vh) rotate(${rotation + 720}deg)`, opacity: 0 }
        ], {
            duration: animDuration,
            delay: delay,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
    }

    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, duration + 1500);
}

/**
 * SOUND TOGGLE - Ambient snow/wind sound
 */
function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;

    // Create audio element
    const audio = new Audio('media/fireplace-opt.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Soft background volume

    let isPlaying = false;

    soundToggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            soundToggle.classList.remove('playing');
            soundToggle.setAttribute('aria-label', 'Увімкнути звук снігу');
        } else {
            audio.play().catch(e => console.log('Audio play failed:', e));
            soundToggle.classList.add('playing');
            soundToggle.setAttribute('aria-label', 'Вимкнути звук снігу');
        }
        isPlaying = !isPlaying;
    });

    // Pause audio when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            audio.pause();
        } else if (!document.hidden && isPlaying) {
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    });
}

/**
 * TYPING EFFECT - Animate hero title typing
 */
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Store original HTML for reset
    const originalHTML = heroTitle.innerHTML;
    const textContent = heroTitle.textContent;

    // Only run typing effect on first load
    if (sessionStorage.getItem('typingDone')) {
        return;
    }

    // Clear and prepare for typing
    heroTitle.innerHTML = '';
    heroTitle.classList.add('typing-cursor');

    let charIndex = 0;
    const typingSpeed = 50; // ms per character

    function typeChar() {
        if (charIndex < textContent.length) {
            heroTitle.textContent += textContent.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        } else {
            // Typing complete - restore HTML and remove cursor
            setTimeout(() => {
                heroTitle.innerHTML = originalHTML;
                heroTitle.classList.remove('typing-cursor');
                sessionStorage.setItem('typingDone', 'true');
            }, 500);
        }
    }

    // Start typing after a brief delay
    setTimeout(typeChar, 500);
}

/**
 * COUNTER ANIMATION - Animate numbers counting up
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.counter);
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    };

    // Use IntersectionObserver to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}


