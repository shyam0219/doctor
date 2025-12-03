/**
 * Company Doktor - Landing Page JavaScript
 * Handles interactivity, animations, and form submissions
 */

// ================================
// Utility Functions
// ================================

/**
 * Debounce function to limit the rate at which a function can fire
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ================================
// Navigation
// ================================

class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Handle scroll
        window.addEventListener('scroll', debounce(() => this.handleScroll()));
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    smoothScrollTo(targetElement);
                    this.closeMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', debounce(() => this.updateActiveLink()));
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        const icon = this.navToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        const icon = this.navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }
}

// ================================
// Scroll Animations
// ================================

class ScrollAnimations {
    constructor() {
        this.animateElements = document.querySelectorAll('.problem-card, .service-card, .process-step, .testimonial-card, .value-item');
        this.init();
    }
    
    init() {
        // Initial check
        this.checkElements();
        
        // Check on scroll
        window.addEventListener('scroll', debounce(() => this.checkElements(), 50));
    }
    
    checkElements() {
        this.animateElements.forEach((element, index) => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        element.classList.add('animated');
                    });
                }, index * 100);
            }
        });
    }
}

// ================================
// Counter Animation
// ================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.result-number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', debounce(() => this.checkCounters(), 50));
    }
    
    checkCounters() {
        if (this.hasAnimated) return;
        
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection && isInViewport(resultsSection)) {
            this.animateCounters();
            this.hasAnimated = true;
        }
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
}

// ================================
// Scroll to Top Button
// ================================

class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Show/hide button on scroll
        window.addEventListener('scroll', debounce(() => this.toggleButton()));
        
        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    toggleButton() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// ================================
// Contact Form
// ================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.messageDiv = document.getElementById('formMessage');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);

        // Read values for validation
        const data = {
            name: formData.get('name'),
            company: formData.get('company'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            consent: formData.get('consent'),
        };
        
        // Validate
        if (!data.name || !data.company || !data.email || !data.message || !data.consent) {
            this.showMessage('Vänligen fyll i alla obligatoriska fält.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Vänligen ange en giltig e-postadress.', 'error');
            return;
        }
        
        // Button loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skickar...';
        submitButton.disabled = true;
        
        try {
            // 🔑 Send directly to Formspree using the form's action + method
            await this.submitForm(formData);
            
            this.showMessage('Tack för din förfrågan! Vi återkommer inom 24 timmar.', 'success');
            this.form.reset();
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXX',
                    'value': 1.0,
                    'currency': 'SEK'
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Ett fel uppstod. Vänligen försök igen eller kontakta oss direkt.', 'error');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    async submitForm(formData) {
        return fetch(this.form.action, {
            method: this.form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Formspree often returns empty body, so we don't rely on JSON
            return response.text().catch(() => null);
        });
    }
    
    showMessage(message, type) {
        this.messageDiv.style.display = 'block';
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        
        this.messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        if (type === 'success') {
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}


// ================================
// Smooth Scroll for CTA Buttons
// ================================

function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('a[href="#contact"]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                smoothScrollTo(contactSection);
            }
        });
    });
}

// ================================
// Scroll Indicator
// ================================

function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const problemSection = document.querySelector('.problem-section');
            if (problemSection) {
                smoothScrollTo(problemSection);
            }
        });
    }
}

// ================================
// Service Cards Interaction
// ================================

function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle scale animation
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// ================================
// Testimonials Auto-scroll (Optional)
// ================================

class TestimonialsCarousel {
    constructor() {
        this.testimonialsGrid = document.querySelector('.testimonials-grid');
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoScrollInterval = null;
        
        // Only init if on mobile
        if (window.innerWidth <= 768 && this.testimonials.length > 1) {
            this.init();
        }
    }
    
    init() {
        // Convert grid to horizontal scroll on mobile
        if (this.testimonialsGrid) {
            this.testimonialsGrid.style.display = 'flex';
            this.testimonialsGrid.style.overflowX = 'auto';
            this.testimonialsGrid.style.scrollSnapType = 'x mandatory';
            this.testimonialsGrid.style.gap = '1rem';
            this.testimonialsGrid.style.scrollBehavior = 'smooth';
            
            this.testimonials.forEach(card => {
                card.style.minWidth = '85%';
                card.style.scrollSnapAlign = 'center';
            });
        }
    }
}

// ================================
// Performance Optimization
// ================================

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ================================
// Expert Application Form
// ================================

class ExpertApplicationForm {
    constructor() {
        this.form = document.getElementById('expertApplicationForm');
        this.messageDiv = document.getElementById('expertFormMessage');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            linkedin: formData.get('linkedin'),
            expertise: formData.get('expertise'),
            experience: formData.get('experience'),
            message: formData.get('message'),
            cv: formData.get('cv'),
            gdprConsent: formData.get('gdpr-consent'),
            newsletter: formData.get('newsletter'),
            timestamp: new Date().toISOString()
        };
        
        // Validate
        if (!data.name || !data.email || !data.phone || !data.expertise || 
            !data.experience || !data.message || !data.gdprConsent) {
            this.showMessage('Vänligen fyll i alla obligatoriska fält.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Vänligen ange en giltig e-postadress.', 'error');
            return;
        }
        
        // CV validation
        if (!data.cv || data.cv.size === 0) {
            this.showMessage('Vänligen ladda upp ditt CV.', 'error');
            return;
        }
        
        // File size validation (5MB)
        if (data.cv.size > 5 * 1024 * 1024) {
            this.showMessage('CV-filen får inte vara större än 5MB.', 'error');
            return;
        }
        
        // File type validation
        if (data.cv.type !== 'application/pdf') {
            this.showMessage('CV:t måste vara i PDF-format.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Skickar ansökan...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await this.submitForm(formData);
            
            // Success
            this.showMessage(
                'Tack för din ansökan! Vi har mottagit din ansökan och återkommer inom 5 arbetsdagar. ' +
                'Kolla din inkorg (och skräppost) för bekräftelsemail.',
                'success'
            );
            this.form.reset();
            
            // Track conversion
            trackEvent('Expert Application', 'submit', data.expertise);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(
                'Ett fel uppstod vid skickandet. Vänligen försök igen eller kontakta oss direkt på info@keeada.com',
                'error'
            );
        } finally {
            // Restore button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    async submitForm(formData) {
        // Send to Netlify Function with file upload
        return fetch('/.netlify/functions/expert-application', {
            method: 'POST',
            body: formData // Send as multipart/form-data for file upload
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    }
    
    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        
        // Scroll to message
        this.messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide after 10 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, 10000);
        }
    }
}

// ================================
// Language Toggle & Management
// ================================

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'sv';
        this.toggleButton = document.getElementById('languageToggle');
        this.init();
    }
    
    init() {
        // Load translations script if not already loaded
        if (typeof translations === 'undefined') {
            const script = document.createElement('script');
            script.src = 'js/translations.js';
            script.onload = () => this.applyLanguage();
            document.head.appendChild(script);
        } else {
            this.applyLanguage();
        }
        
        // Add click listener
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleLanguage());
        }
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'sv' ? 'en' : 'sv';
        localStorage.setItem('language', this.currentLang);
        this.applyLanguage();
        
        // Track language toggle
        trackEvent('Language', 'toggle', this.currentLang);
    }
    
    applyLanguage() {
        if (typeof translations === 'undefined') return;
        
        const t = translations[this.currentLang];
        const html = document.documentElement;
        
        // Update HTML lang attribute
        html.setAttribute('lang', this.currentLang);
        
        // Update language button
        if (this.toggleButton) {
            const buttonText = this.toggleButton.querySelector('span');
            if (buttonText) {
                buttonText.textContent = this.currentLang === 'sv' ? 'EN' : 'SV';
            }
            this.toggleButton.title = this.currentLang === 'sv' ? 'Switch to English' : 'Byt till Svenska';
        }
        
        // Update all translatable elements
        this.updateElements(t);
        
        // Show notification
        this.showLanguageNotification();
    }
    
    updateElements(t) {
        // Navigation
        this.updateText('[data-translate="nav_home"]', t.nav_home);
        this.updateText('[data-translate="nav_services"]', t.nav_services);
        this.updateText('[data-translate="nav_process"]', t.nav_process);
        this.updateText('[data-translate="nav_results"]', t.nav_results);
        this.updateText('[data-translate="nav_about"]', t.nav_about);
        this.updateText('[data-translate="nav_join"]', t.nav_join);
        this.updateText('[data-translate="nav_contact"]', t.nav_contact);
        this.updateText('[data-translate="nav_cta"]', t.nav_cta);
        
        // Hero Section
        this.updateText('[data-translate="hero_badge"]', t.hero_badge);
        this.updateText('[data-translate="hero_stat1"]', t.hero_stat1);
        this.updateText('[data-translate="hero_stat2"]', t.hero_stat2);
        this.updateText('[data-translate="hero_stat3"]', t.hero_stat3);
        this.updateText('[data-translate="hero_cta1"]', t.hero_cta1);
        this.updateText('[data-translate="hero_cta2"]', t.hero_cta2);
        
        // Update all other sections using data-translate attributes
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (t[key]) {
                element.textContent = t[key];
            }
        });
    }
    
    updateText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) el.textContent = text;
        });
    }
    
    showLanguageNotification() {
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = this.currentLang === 'en' ? 
            '🌍 Language changed to English' : 
            '🌍 Språk ändrat till Svenska';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

function initLanguageToggle() {
    new LanguageManager();
}

// ================================
// Initialize on DOM Ready
// ================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Company Doktor - Initializing...');
    
    // Initialize all components
    new Navigation();
    new ScrollAnimations();
    new CounterAnimation();
    new ScrollToTop();
    //new ContactForm();
    new ExpertApplicationForm();
    new TestimonialsCarousel();
    
    // Initialize other features
    initCTAButtons();
    initScrollIndicator();
    initServiceCards();
    initLanguageToggle();
    lazyLoadImages();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    console.log('Company Doktor - Ready!');
});

// ================================
// Handle Window Resize
// ================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize testimonials carousel if needed
        if (window.innerWidth <= 768) {
            new TestimonialsCarousel();
        }
    }, 250);
});

// ================================
// Analytics & Tracking (Optional)
// ================================

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log('Event tracked:', category, action, label);
}

// Track button clicks
document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn');
    if (target) {
        const buttonText = target.textContent.trim();
        trackEvent('Button', 'click', buttonText);
    }
});

// Track service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const serviceTitle = this.querySelector('.service-title').textContent;
        trackEvent('Service', 'view', serviceTitle);
    });
});