document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('open');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl" aria-hidden="true"></i>';
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl" aria-hidden="true"></i>';
    }
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close mobile menu on link click
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                if (mobileMenu.classList.contains('open')) {
                    closeMobileMenu();
                }
            }
        });
        
        // Close mobile menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMobileMenu();
                mobileMenuButton.focus();
            }
        });
    }

    // Section Fade-in Animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = document.querySelectorAll('.section-fade-in');
    
    if (prefersReducedMotion) {
        sections.forEach(section => section.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // Active Navigation Highlighting
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const allSections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.scrollY;
        
        allSections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // Run on load

    // Rotating Text Animation
    const rotatingTextElement = document.getElementById('rotating-text');
    const phrases = [
        'scalable backend systems',
        'secure REST APIs',
        'microservices architecture',
        'AI-powered applications',
        'full-stack solutions'
    ];
    let currentPhraseIndex = 0;
    
    if (rotatingTextElement && !prefersReducedMotion) {
        setInterval(() => {
            rotatingTextElement.style.opacity = '0';
            rotatingTextElement.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                rotatingTextElement.textContent = phrases[currentPhraseIndex];
                rotatingTextElement.style.opacity = '1';
                rotatingTextElement.style.transform = 'translateY(0)';
            }, 300);
        }, 3000);
        
        // Add transition styles
        rotatingTextElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');
    
    // Form validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };
    
    // Validation messages
    const errorMessages = {
        name: 'Please enter a valid name (2-50 letters)',
        email: 'Please enter a valid email address',
        subject: 'Please select a subject',
        message: 'Please enter a message (at least 10 characters)'
    };
    
    // Validate individual field
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}-error`);
        let isValid = true;
        let errorMessage = '';
        
        if (!value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        } else if (fieldName === 'name' && !patterns.name.test(value)) {
            isValid = false;
            errorMessage = errorMessages.name;
        } else if (fieldName === 'email' && !patterns.email.test(value)) {
            isValid = false;
            errorMessage = errorMessages.email;
        } else if (fieldName === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
        
        if (errorElement) {
            errorElement.textContent = isValid ? '' : errorMessage;
        }
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
        } else {
            field.classList.remove('success');
            field.classList.add('error');
        }
        
        return isValid;
    }
    
    // Add blur validation to all form fields
    if (contactForm) {
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        
        formFields.forEach(field => {
            if (field.name && !field.name.startsWith('_')) {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        validateField(field);
                    }
                });
            }
        });
        
        // Form submission - using native form submission for FormSubmit.co
        contactForm.addEventListener('submit', function(e) {
            // Validate all fields first
            let isFormValid = true;
            formFields.forEach(field => {
                if (field.name && !field.name.startsWith('_') && field.required) {
                    if (!validateField(field)) {
                        isFormValid = false;
                    }
                }
            });
            
            if (!isFormValid) {
                e.preventDefault();
                showFormStatus('Please fix the errors above', 'error');
                return;
            }
            
            // Show loading state (form will submit normally)
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').classList.add('hidden');
            submitBtn.querySelector('.btn-loading').classList.remove('hidden');
            
            // Allow form to submit normally to FormSubmit.co
            // FormSubmit will handle the redirect
        });
    }
    
    function showFormStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `text-center p-4 rounded-lg ${type}`;
            formStatus.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                formStatus.classList.add('hidden');
            }, 5000);
        }
    }

    // Smooth Scroll for Safari
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Header Background on Scroll
    const header = document.querySelector('header');
    
    function updateHeaderBackground() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeaderBackground, { passive: true });

});
