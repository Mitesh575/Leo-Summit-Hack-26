// Premium Hackathon - Interactive Script

// Touch device detection
const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Leo Summit: DOM Content Loaded. Initializing components...");

    const initFunctions = [
        { name: 'Touch Detection', fn: () => { if (isTouchDevice()) document.body.classList.add('touch-device'); } },
        { name: 'Custom Cursor', fn: initCustomCursor },
        { name: 'Particles', fn: initParticles },
        { name: 'Progress Bar', fn: initProgressBar },
        { name: 'Header', fn: initHeader },
        { name: 'Mascot', fn: initMascot },
        { name: 'Parallax', fn: initParallax },
        { name: 'Intro Section', fn: initIntroSection },
        { name: 'Highlights', fn: initHighlights },
        { name: 'About Section', fn: initAboutSection },
        { name: 'Domains', fn: initDomains },
        { name: 'Judges', fn: initJudges },
        { name: 'Scope Cards', fn: initScopeCards },
        { name: 'Mobile Carousel', fn: initMobileCarousel },
        { name: 'Ripple Effects', fn: initRippleEffects },
        { name: 'Counter Animation', fn: initCounterAnimation },
        { name: '24h Event Timer', fn: initEventTimer },
        { name: 'Hero Countdown', fn: initHeroCountdown },
        { name: 'Mobile Menu', fn: initMobileMenu },
        { name: 'Smooth Scroll', fn: initSmoothScroll },
        { name: 'Text Reveals', fn: initTextReveals }
    ];

    initFunctions.forEach(comp => {
        try {
            if (typeof comp.fn === 'function') {
                comp.fn();
            }
        } catch (err) {
            console.error(`Leo Summit: Failed to initialize ${comp.name}:`, err);
        }
    });

    // Handle interactive components that check for touch device
    if (!isTouchDevice()) {
        try { initMagneticButtons(); } catch (e) { }
        try { initSpotlightEffects(); } catch (e) { }
        try { init3DMascot(); } catch (e) { }
        try { initHeaderMascot(); } catch (e) { }
    }

    // Auto remove background from mascot
    const mascotImg = document.querySelector('.lion-mascot-img');
    if (mascotImg) {
        mascotImg.crossOrigin = "Anonymous";
        mascotImg.onload = () => removeBackground(mascotImg);
        if (mascotImg.complete) removeBackground(mascotImg);
    }
});

// Glitch Cypher Intro Animation
function initCinematicIntro(onComplete) {
    const overlay = document.getElementById('introOverlay');
    const title = document.querySelector('.intro-title');

    // Check if intro already played
    // Disabled for debugging/development so user can see it
    /*
    if (sessionStorage.getItem('introPlayed') || !overlay) {
        if (overlay) overlay.style.display = 'none';
        onComplete();
        return;
    }
    */
    if (!overlay) { onComplete(); return; }


    // Add scanlines if they don't exist
    if (!document.querySelector('.intro-scanlines')) {
        const scanlines = document.createElement('div');
        scanlines.className = 'intro-scanlines';
        overlay.appendChild(scanlines);
    }

    // Characters for decoding effect
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const targetText = "Leo Summit Hack'26";

    // Clear initial text
    title.innerHTML = '';
    title.setAttribute('data-text', targetText); // For CSS glitch effect

    // Create spans for each character
    const spanningText = targetText.split('').map(char => {
        if (char === ' ') {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'intro-char';
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.style.display = 'inline';
            title.appendChild(spaceSpan);
            return { span: spaceSpan, char, done: true };
        }
        const span = document.createElement('span');
        span.className = 'intro-char';
        span.innerText = chars[Math.floor(Math.random() * chars.length)];
        // Set initial color to white explicitly (or handled by CSS)
        span.style.color = '#ffffff';
        title.appendChild(span);
        return { span, char, done: false };
    });

    let iteration = 0;
    const maxIterations = 20; // How many scrambles before settling

    const interval = setInterval(() => {
        spanningText.forEach((item, index) => {
            if (item.done) return;

            // Randomize character
            if (item.char !== ' ') {
                item.span.innerText = chars[Math.floor(Math.random() * chars.length)];
            }

            // Progressive reveal logic
            if (iteration > (index * 2) && iteration > 5) { // Delay based on index
                item.span.innerText = item.char;
                item.span.style.color = '#FFD700'; // Transform to Gold
                // Sharper Neon glow: Reduced blur radius for crispness
                item.span.style.textShadow = '0 0 5px #FFD700, 0 0 15px #FFD700';
                item.done = true;
            }
        });

        iteration++;

        // Check completion
        if (spanningText.every(item => item.done)) {
            clearInterval(interval);

            // Hold for impact
            setTimeout(() => {
                overlay.style.opacity = '0';

                setTimeout(() => {
                    overlay.style.display = 'none';
                    // sessionStorage.setItem('introPlayed', 'true'); // Debug: unmatched
                    onComplete();
                }, 500); // 0.5s fade out
            }, 1000); // 1s hold
        }
    }, 50); // Speed of cycling (lower is faster)

    // Safety Timeout: Force hide overlay if animation stuck
    setTimeout(() => {
        if (overlay.style.display !== 'none') {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                onComplete();
            }, 500);
        }
    }, 3500); // 3.5s total timeout
}


// Helper: Remove white background from image using Flood Fill
// Helper: Remove white background from image using Flood Fill & Add Outline
// Helper: Remove background from image using Smart Flood Fill
function removeBackground(img) {
    if (img.dataset.processed) return;
    // Skip SVGs as they are already transparent and we want to keep them as vectors
    if (img.src.includes('.svg')) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width = img.naturalWidth || img.width;
    const h = canvas.height = img.naturalHeight || img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // Sample background color from top-left corner
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    // Tolerance for background color variation
    const tol = 30;

    // Visited array to keep track of checked pixels
    const visited = new Uint8Array(w * h);
    const queue = [];

    // Seed from corners
    const corners = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
    corners.forEach(([x, y]) => {
        queue.push([x, y]);
        visited[y * w + x] = 1;
    });

    // Helper to check if pixel matches background
    const isBg = (idx) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        return Math.abs(r - bgR) < tol && Math.abs(g - bgG) < tol && Math.abs(b - bgB) < tol;
    };

    while (queue.length > 0) {
        const [x, y] = queue.pop();
        const idx = (y * w + x) * 4;

        if (isBg(idx)) {
            // Make transparent
            data[idx + 3] = 0;

            // Add neighbors
            const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
            for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                    const nIdx = ny * w + nx;
                    if (!visited[nIdx]) {
                        visited[nIdx] = 1;
                        queue.push([nx, ny]);
                    }
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
    img.src = canvas.toDataURL();
    img.dataset.processed = 'true';
}

// Problem statements removed

// Domain names
const domainNames = {
    health: "Health & Well-Being",
    planet: "Sustainable Planet & Disaster Resilience",
    equity: "Social Equity & Human Development",
    open: "Open Innovation"
};

// let selectedDomain = null; // Removed
// let selectedProblem = null; // Removed

// Progress Bar
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Header scroll effect
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    });
}

// Mascot interactions
function initMascot() {
    const bubble = document.getElementById('mascotBubble');
    const startBtn = document.getElementById('startBtn');

    setTimeout(() => {
        bubble.classList.add('visible');
        setTimeout(() => bubble.classList.remove('visible'), 4000);
    }, 2000);

    startBtn.addEventListener('click', () => {
        showMascotMessage("Explore our domains! 🌍");
        smoothScrollTo('domains');
    });
}

function showMascotMessage(msg) {
    const bubble = document.getElementById('mascotBubble');
    bubble.textContent = msg;
    bubble.classList.add('visible');
    setTimeout(() => bubble.classList.remove('visible'), 3500);
}

// Parallax effect
function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Intro Section Animation
function initIntroSection() {
    const introCards = document.querySelectorAll('.intro-card');
    const eventBanner = document.querySelector('.event-banner');

    // Animate intro cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 200);
            }
        });
    }, { threshold: 0.2 });

    introCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.8s var(--transition)';
        cardObserver.observe(card);
    });

    // Animate event banner
    if (eventBanner) {
        eventBanner.style.opacity = '0';
        eventBanner.style.transform = 'scale(0.95)';
        eventBanner.style.transition = 'all 0.8s var(--transition)';

        const bannerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    eventBanner.style.opacity = '1';
                    eventBanner.style.transform = 'scale(1)';
                }, 400);
            }
        }, { threshold: 0.3 });

        bannerObserver.observe(eventBanner);
    }

    // Animate stats counter
    const statValues = document.querySelectorAll('.stat-value');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => statsObserver.observe(stat));
}

// Highlights scroll animation
function initHighlights() {
    const cards = document.querySelectorAll('.highlight-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) * 150;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}

// Domain selection
function initDomains() {
    const tiles = document.querySelectorAll('.domain-tile');

    tiles.forEach(tile => {
        // 3D tilt effect - only on non-touch devices
        if (!isTouchDevice()) {
            tile.addEventListener('mousemove', e => {
                const rect = tile.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                tile.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 10}deg) translateY(-10px)`;
            });

            tile.addEventListener('mouseleave', () => {
                if (!tile.classList.contains('selected')) {
                    tile.style.transform = '';
                }
            });
        }

        // Selection logic removed
        /*
        // Selection
        tile.addEventListener('click', () => {
            tiles.forEach(t => {
                t.classList.remove('selected');
                t.style.transform = '';
            });

            tile.classList.add('selected');
            selectedDomain = tile.dataset.domain;

            document.getElementById('domainInput').value = domainNames[selectedDomain];
            updateStep(2);

            showProblems(selectedDomain);
            showMascotMessage("Great pick! Now select a challenge 💡");

            setTimeout(() => smoothScrollTo('problems'), 400);
        });
        */
    });
}

// Show problems helper removed
// initProblemCards removed

// Judges animation
function initJudges() {
    const cards = document.querySelectorAll('.judge-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 120);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}



// Mobile Navigation
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const closeBtn = document.getElementById('mobileNavClose');
    const links = document.querySelectorAll('.mobile-link');
    const body = document.body;

    if (!hamburger || !mobileNav) {
        console.error('Mobile menu elements not found!');
        return;
    }

    console.log('Mobile Menu Initialized.');

    const openMenu = () => {
        hamburger.classList.add('active');
        mobileNav.classList.add('active');
        body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.classList.remove('no-scroll');
    };

    // Hamburger Toggles
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        if (mobileNav.classList.contains('active')) closeMenu();
        else openMenu();
    });

    // Close Button within Sidebar
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
        });
    }

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}


// Registration logic removed



// Step indicator functions removed

// Smooth scroll utility
function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Custom Cursor
function initCustomCursor() {
    // Only on desktop
    if (window.innerWidth < 1024) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX - 4 + 'px';
        dot.style.top = mouseY - 4 + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX - 20 + 'px';
        ring.style.top = ringY - 20 + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .domain-tile, .problem-card, .highlight-card, .judge-card, input, .cta-primary');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

// Floating Particles
function initParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.prepend(container);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// Ripple Effects
function initRippleEffects() {
    const buttons = document.querySelectorAll('.cta-primary, .submit-btn, .domain-tile, .problem-card');

    buttons.forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Counter Animation
function initCounterAnimation() {
    const prizeAmount = document.querySelector('.prize-amount');
    if (!prizeAmount) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(prizeAmount, 0, 15000, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(prizeAmount);
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(start + (end - start) * easeProgress);
        element.textContent = '₹' + current.toLocaleString('en-IN') + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// About Section Animation
function initAboutSection() {
    const detailItems = document.querySelectorAll('.detail-item');
    const prizesCard = document.querySelector('.prizes-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
            }
        });
    }, { threshold: 0.2 });

    detailItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s var(--transition)';
        observer.observe(item);
    });

    if (prizesCard) {
        prizesCard.style.opacity = '0';
        prizesCard.style.transform = 'translateX(50px)';
        prizesCard.style.transition = 'all 0.8s var(--transition)';

        const prizesObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    prizesCard.style.opacity = '1';
                    prizesCard.style.transform = 'translateX(0)';
                }, 400);
            }
        }, { threshold: 0.3 });

        prizesObserver.observe(prizesCard);
    }
}

// Enhanced Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Typing effect utility
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Tilt effect for cards (enhanced)
function addTiltEffect(element, intensity = 15) {
    element.addEventListener('mousemove', e => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        element.style.transform = `
            perspective(1000px) 
            rotateY(${x * intensity}deg) 
            rotateX(${-y * intensity}deg)
            translateZ(10px)
        `;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = '';
        element.style.transition = 'transform 0.5s ease';
    });

    element.addEventListener('mouseenter', () => {
        element.style.transition = 'transform 0.1s ease';
    });
}

// 3D Mascot Interaction
function init3DMascot() {
    const hero = document.querySelector('.hero');
    const wrapper = document.querySelector('.mascot-wrapper');

    if (!hero || !wrapper) return;

    // Mouse movement tracking
    let bounds;
    let rafId;

    function update(e) {
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate rotation (max 20 degrees)
        const rotateY = (mouseX / bounds.width) * 40;
        const rotateX = -(mouseY / bounds.height) * 40;

        wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        rafId = null;
    }

    hero.addEventListener('mouseenter', () => {
        bounds = hero.getBoundingClientRect();
    });

    hero.addEventListener('mousemove', (e) => {
        if (!bounds) return;
        if (!rafId) {
            rafId = requestAnimationFrame(() => update(e));
        }
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
        bounds = null;
    });

    // Roar on click
    wrapper.addEventListener('click', () => {
        if (!wrapper.classList.contains('roaring')) {
            wrapper.classList.add('roaring');
            // showMascotMessage("ROAAAAR! 🦁"); // Assuming showMascotMessage is defined elsewhere
            // Add slight vibration to device if supported
            if (navigator.vibrate) navigator.vibrate(50);

            setTimeout(() => wrapper.classList.remove('roaring'), 600);
        }
    });
}

// Countdown Timer logic
function initCountdown() {
    // Target Date: February 23, 2026 09:00:00
    const targetDate = new Date('February 23, 2026 09:00:00').getTime();

    // Check if element exists
    const daysEl = document.getElementById('days');
    if (!daysEl) return;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Event started
            const container = document.querySelector('.countdown-container');
            if (container) {
                container.innerHTML = '<div class="event-live" style="color:#ffd700; font-weight:bold; font-size:1.5rem;">HACKATHON IS LIVE! 🚀</div>';
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById('days')) document.getElementById('days').textContent = String(days).padStart(2, '0');
        if (document.getElementById('hours')) document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        if (document.getElementById('minutes')) document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        if (document.getElementById('seconds')) document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    };

    // Update immediately
    updateCountdown();
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Header Mascot Interaction (Subtle Tilt)
function initHeaderMascot() {
    const header = document.querySelector('.header');
    const mascot = document.querySelector('.header-mascot-3d');

    if (!header || !mascot) return;

    let bounds;
    let rafId;

    function update(e) {
        const mouseX = e.clientX - (bounds.left + bounds.width / 2);
        const mouseY = e.clientY - (bounds.top + bounds.height / 2);

        // Very subtle rotation for the small header logo
        const rotateY = (mouseX / bounds.width) * 30;
        const rotateX = -(mouseY / bounds.height) * 30;

        mascot.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        rafId = null;
    }

    header.addEventListener('mouseenter', () => {
        bounds = header.getBoundingClientRect();
    });

    header.addEventListener('mousemove', (e) => {
        if (!bounds) return;
        if (!rafId) {
            rafId = requestAnimationFrame(() => update(e));
        }
    });

    header.addEventListener('mouseleave', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        mascot.style.transform = 'rotateX(0deg) rotateY(0deg)';
        bounds = null;
    });
}

// Obsolete Listeners Removed (Consolidated at the top)

// Mobile Navigation Logic
// Mobile Navigation Logic - CONSOLIDATED IN initMobileMenu (Removed duplicate)

// PREMIUM ANIMATIONS

// 1. Smooth Scrolling (Lenis)
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// 2. Magnetic Buttons
// 2. Magnetic Buttons
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-button, .start-btn, .submit-btn, .nav-link');

    buttons.forEach(btn => {
        btn.classList.add('magnetic-btn');
        let bounds;
        let rafId;

        function update(e) {
            const x = e.clientX - bounds.left - bounds.width / 2;
            const y = e.clientY - bounds.top - bounds.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            rafId = null;
        }

        btn.addEventListener('mouseenter', () => {
            bounds = btn.getBoundingClientRect();
        });

        btn.addEventListener('mousemove', (e) => {
            if (!bounds) return;
            if (!rafId) {
                rafId = requestAnimationFrame(() => update(e));
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            btn.style.transform = 'translate(0px, 0px)';
            bounds = null;
        });
    });
}

// Obsolete Premium Animation Listeners Removed (Consolidated at the top)



// 3. Scroll Text Reveals
function initTextReveals() {
    const headings = document.querySelectorAll('h2, .section-title, .hero-title');

    headings.forEach(heading => {
        heading.classList.add('reveal-text');

        // Split text into words
        // Normalize all whitespace (newlines, tabs, multiple spaces → single space)
        const text = heading.textContent.replace(/\s+/g, ' ').trim();
        const words = text.split(' ');
        heading.textContent = ''; // Clear content

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.transitionDelay = `${index * 0.05}s`;
            heading.appendChild(span);
            // Append space as a text node so browsers never collapse it
            if (index < words.length - 1) {
                heading.appendChild(document.createTextNode(' '));
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    headings.forEach(h => observer.observe(h));
}

// 4. Spotlight Hover Effects
function initSpotlightEffects() {
    const cards = document.querySelectorAll('.domain-tile, .problem-card, .scope-card, .highlight-card');

    cards.forEach(card => {
        card.classList.add('spotlight-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// 4. Constellation Particles (Neural Network Effect)
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Mobile Optimization: Reduce count
    const particleCount = isTouchDevice() ? 30 : 80;
    const connectionDistance = isTouchDevice() ? 100 : 150;

    // Mouse interaction params
    let mouse = { x: null, y: null, radius: 200 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse interaction (Desktop only to save mobile perf)
    if (!isTouchDevice()) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Slow velocity
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = '#f59e0b'; // Gold
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse repulsion (subtle)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    init();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connect();
        requestAnimationFrame(animate);
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                    ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                if (distance < (connectionDistance * connectionDistance)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(245, 158, 11,' + opacityValue * 0.2 + ')'; // Gold line
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    animate();
}

// Mobile 3D Carousel Logic - Optimized for Universal Compatibility (Android/iOS)
// Scope Member Card Flip Logic
function initScopeCards() {
    const cards = document.querySelectorAll('.scope-card');

    cards.forEach(card => {
        const handleFlip = (e) => {
            // Don't flip if clicking a link (email)
            if (e.target.closest('a')) return;
            e.preventDefault();
            // Check if card has a back face before flipping
            if (card.querySelector('.scope-card-back')) {
                card.classList.toggle('flipped');
            }
        };

        // Standard click
        card.addEventListener('click', handleFlip);
        // Better mobile response
        card.addEventListener('touchstart', handleFlip, { passive: true });

        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {

                e.preventDefault();
                handleFlip(e);
            }
        });
    });
}

function initMobileCarousel() {
    if (window.innerWidth > 1024) return;

    const containers = document.querySelectorAll('.scope-grid, .core-team-grid');
    if (!containers.length) return;


    // Use native scrolling for better performance and momentum
    containers.forEach(container => {
        container.style.scrollBehavior = 'smooth';
        container.style.overflowX = 'auto';
        container.style.webkitOverflowScrolling = 'touch';
    });

    // Attach click listeners to scroll buttons
    document.querySelectorAll('.scroll-button').forEach(btn => {
        // Remove inline onclick to avoid errors if function is not global
        btn.removeAttribute('onclick');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const direction = btn.classList.contains('scroll-left') ? -1 : 1;

            // Find the closest section then the grid within it
            const section = btn.closest('section');
            if (section) {
                const container = section.querySelector('.scope-grid, .core-team-grid');
                if (container) {
                    const scrollAmount = 300; // Adjust scroll amount as needed
                    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
                }
            }
        });
    });




    // DEACTIVATED: Legacy 3D Gallery Carousel replaced by React ImageAutoSlider
    // See index.html and widget.js for the new implementation.
    /*
    function initGalleryCarousel() {
        ...
    }
    */



    // --- Domain Problem Statements Logic ---
}

// --- Domain Problem Statements Logic ---

const domainData = {
    health: {
        title: "Health & Well-Being",
        icon: "🏥",
        statements: [
            {
                id: "LHS 1A",
                title: "Early Warning System for Water-Borne Diseases in Rural India",
                desc: "Water-borne diseases claim over 500,000 lives annually in India, with rural areas bearing 70% of the burden due to contaminated water sources and fragmented surveillance. Local health workers rely on manual reporting, leading to delayed outbreak detection. High mobile penetration offers untapped potential for community-driven data collection.",
                challenges: "Integrating multi-modal data (symptoms, water quality, weather), building predictive models, ensuring low-cost scalability, and enabling actionable alerts without overwhelming infrastructure. Solutions must prioritize data privacy, offline functionality, and multilingual interfaces."
            },
            {
                id: "LHS 1B",
                title: "AI-Powered Mental Health Stress Detection and Intervention",
                desc: "Mental health disorders impact 150 million Indians, with stress as a primary trigger often undetected. Traditional interventions are reactive and inaccessible. Stigma and privacy fears limit adoption.",
                challenges: "challenges involve visual recognition of diverse Indian foods via scans or photos, generating context-aware meal recommendations integrated with user health metrics, promoting waste minimization, and ensuring affordability and offline access for rural/low-income users."
            },
            {
                id: "LHS 1C",
                title: "Personalized Nutrition Advisory for Malnutrition and Lifestyle Diseases",
                desc: "Malnutrition affects 35% of children under 5 in India, while lifestyle diseases surge among adults due to unbalanced diets and significant food wastage. Manual diet logging is tedious and inaccurate; existing apps cater to urban elites and overlook cultural diversity.",
                challenges: "Innovate intelligent systems that scan household food items, analyze nutritional profiles against individual goals, suggest customized meal plans with recipes, and provide sustainability insights to combat malnutrition and chronic diseases effectively."
            }
        ]
    },
    planet: {
        title: "Sustainable Planet & Disaster Resilience",
        icon: "🌍",
        statements: [
            {
                id: "LHS 2A",
                title: "Scalable Community-Scale Plastic Waste to Biogas Conversion",
                desc: "India generates over 26,000 tonnes of plastic waste daily. Current pyrolysis technology is inefficient or lacks scalability for decentralized community use, perpetuating energy poverty. Small-scale setups fail due to inconsistent feedstock and manual controls.",
                challenges: "Real-time process optimization for maximum yield and minimal emissions, handling variable plastic types/sizes, ensuring operator safety, and achieving economic viability through byproduct valorization. Solutions must be modular and solar-powered where possible."
            },
            {
                id: "LHS 2B",
                title: "AI-Enabled Real-Time Flash Flood Forecasting and Alert System",
                desc: "Flash floods displace millions annually in regions like Northeast and Western Ghats. Predictions rely on coarse data, ignoring hyper-local factors like soil moisture and rainfall patterns, resulting in delayed evacuations.",
                challenges: "Fusing heterogeneous data sources (drones, IoT, satellites), delivering sub-hour forecasts with 90%+ accuracy, broadcasting alerts via multi-channel (SMS, sirens) in low-connectivity areas, and integrating with disaster response teams."
            },
            {
                id: "LHS 2C",
                title: "Gamified Carbon Footprint Visualization and Reduction Platform",
                desc: "India's per capita carbon emissions are rising, yet individuals lack engaging tools to track and reduce footprints. Static calculators fail to motivate sustained change or aggregate urban data for policy.",
                challenges: "Precise, real-time emission computation from transport/energy/consumption, immersive visualizations (AR preferred), incentive mechanisms (rewards/leaderboards), and scalability to municipal dashboards. Privacy and baseline accuracy are paramount."
            }
        ]
    },
    equity: {
        title: "Social Equity & Human Development",
        icon: "🤝",
        statements: [
            {
                id: "LHS 3A",
                title: "Bias-Free Skills-Based Job Matching and Recommendation System",
                desc: "India's youth unemployment stands at 23%, disproportionately affecting women and rural graduates due to biased resume screening and credential-focused hiring. Traditional platforms amplify inequalities by favoring elite networks.",
                challenges: "Anonymizing profiles to eliminate biases, advanced NLP for extracting verifiable skills from diverse formats, ensuring algorithmic fairness through audits, and integrating real-time upskilling paths. Scalability for millions of users is critical."
            },
            {
                id: "LHS 3B",
                title: "Real-Time Inclusive Sign Language Translation for Multilingual Contexts",
                desc: "Over 15 million hearing-impaired individuals in India face communication barriers due to scarce interpreters. Existing apps lack support for Indian Sign Language (ISL) dialects or real-time translation to regional spoken languages.",
                challenges: "Precise gesture recognition in varied lighting/angles, contextual disambiguation across dialects, seamless speech/text output with AR overlays, and low-latency processing on edge devices."
            },
            {
                id: "LHS 3C",
                title: "Voice-First Micro-Learning Platform for Gig Workers' Upskilling",
                desc: "India's 15 million gig workers lack flexible, bite-sized vocational training tailored to irregular schedules and low literacy. Online courses are text-heavy with high dropout rates.",
                challenges: "Delivering audio-based modules via WhatsApp/USSD, adaptive learning paths, credible micro-certifications linked to jobs, and scalability in regional languages with offline sync. Engagement retention is vital."
            }
        ]
    },
    open: {
        title: "Open Innovation",
        icon: "💡",
        statements: [
            {
                id: "LHS 4A",
                title: "Post-Quantum Cryptography Implementation for Everyday Secure Communications",
                desc: "Advancements in quantum computing threaten to break widely used encryption like RSA and ECC within a decade, exposing sensitive communications in banking, healthcare, and government.",
                challenges: "Developing efficient, quantum-resistant protocols for mobile/low-resource devices, ensuring backward compatibility, rigorous performance benchmarking, and public-key infrastructure migration strategies."
            },
            {
                id: "LHS 4B",
                title: "Comprehensive Open-Source AI Ethics Auditing and Mitigation Toolkit",
                desc: "AI deployments embed biases causing harms like discriminatory lending or facial recognition failures. Audits are manual, inconsistent, and soiled, hindering trustworthy AI adoption.",
                challenges: "Automated scanning of models for fairness/privacy/toxicity, generating interpretable reports with fixes, supporting multiple frameworks (TensorFlow, PyTorch), and community-driven benchmarks."
            },
            {
                id: "LHS 4C",
                title: "Immersive Holographic Collaboration Environments for Remote Teams",
                desc: "Hybrid work sees 40% productivity dips from poor remote presence. VR/AR tools cause motion sickness and high barriers, while 2D video lacks spatial interaction for design/engineering tasks.",
                challenges: "Low-latency hand-tracked holograms, cross-device synchronization, collaborative whiteboard in 3D space, and scalability for 100+ participants. Bandwidth efficiency is vital."
            }
        ]
    }
};


function initDomains() {
    const tiles = document.querySelectorAll('.domain-tile');
    const modal = document.getElementById('domainModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalIcon = modal.querySelector('.modal-icon'); // Assuming you add this for icon display

    function openModal(domainKey) {
        const data = domainData[domainKey];
        if (!data) return;

        modalTitle.textContent = data.title;
        if (modalIcon) modalIcon.textContent = data.icon;

        let htmlContent = '';
        data.statements.forEach(ps => {
            htmlContent += `
                <div class="ps-item">
                    <div class="ps-id">${ps.id}</div>
                    <h4 class="ps-title">${ps.title}</h4>
                    <p class="ps-desc">${ps.desc}</p>
                    <div class="ps-challenges">
                        <h5>Key Challenges & Innovation:</h5>
                        <p>${ps.challenges}</p>
                    </div>
                </div>
            `;
        });

        modalBody.innerHTML = htmlContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Tile Click Events
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const domainKey = tile.getAttribute('data-domain');
            openModal(domainKey);
        });
    });

    // Close Events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// 24-Hour Event Timer Logic - Robust Version
// 24-Hour Event Timer Logic - Robust Version
function initEventTimer() {
    const refs = { h: 'event-h', m: 'event-m', s: 'event-s', start: 'start-timer-btn', reset: 'reset-timer-btn' };
    const els = Object.fromEntries(Object.entries(refs).map(([k, v]) => [k, document.getElementById(v)]));
    if (!els.h || !els.m || !els.s) return;

    let interval = null;
    const TOTAL = 86400000;

    const update = (rem) => {
        const ms = Math.max(0, rem);
        const hh = Math.floor(ms / 3600000);
        const mm = Math.floor((ms % 3600000) / 60000);
        const ss = Math.floor((ms % 60000) / 1000);

        [els.h, els.m, els.s].forEach((el, i) => {
            const val = [hh, mm, ss][i];
            const str = String(val).padStart(2, '0');
            el.style.setProperty('--value', val);
            el.textContent = str;
        });

        if (ms <= 0 && interval) {
            clearInterval(interval);
            interval = null;
            localStorage.removeItem('_timer_target');
            if (els.start) { els.start.disabled = false; els.start.style.opacity = '1'; }
        }
    };

    const start = (resuming) => {
        let t = localStorage.getItem('_timer_target');
        if (!resuming || !t) {
            t = Date.now() + TOTAL;
            localStorage.setItem('_timer_target', t);
        }
        if (interval) clearInterval(interval);
        interval = setInterval(() => update(t - Date.now()), 1000);
        update(t - Date.now());
        if (els.start) {
            els.start.disabled = true;
            els.start.style.opacity = '0.5';
            els.start.innerHTML = '<span class="btn-icon">⏱</span> Counting Down...';
        }
    };

    const reset = () => {
        clearInterval(interval);
        interval = null;
        localStorage.removeItem('_timer_target');
        update(TOTAL);
        if (els.start) {
            els.start.disabled = false;
            els.start.style.opacity = '1';
            els.start.innerHTML = '<span class="btn-icon">▶</span> Start Timer';
        }
    };

    if (els.start) els.start.onclick = () => start(false);
    if (els.reset) els.reset.onclick = reset;

    const saved = localStorage.getItem('_timer_target');
    if (saved && parseInt(saved) > Date.now()) start(true);
    else update(TOTAL);
}

// Hero Launch Timer - Robust handling for Hero Section
function initHeroCountdown() {
    const targetDate = new Date('February 23, 2026 09:00:00').getTime();

    // Select Hero Section IDs
    const hDays = document.getElementById('days');
    const hHours = document.getElementById('hours');
    const hMinutes = document.getElementById('minutes');
    const hSeconds = document.getElementById('seconds');

    // Select Sidebar (Nav) IDs
    const nDays = document.getElementById('nav-days');
    const nHours = document.getElementById('nav-hours');
    const nMinutes = document.getElementById('nav-minutes');
    const nSeconds = document.getElementById('nav-seconds');

    const updateHero = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            const containers = document.querySelectorAll('.countdown-container, .mobile-nav-timer');
            containers.forEach(container => {
                container.innerHTML = '<div class="live-badge" style="color:#ffd700; font-weight:bold; font-size:1.2rem; text-align:center;">EVENT LIVE 🚀</div>';
            });
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        const dStr = String(d).padStart(2, '0');
        const hStr = String(h).padStart(2, '0');
        const mStr = String(m).padStart(2, '0');
        const sStr = String(s).padStart(2, '0');

        // Update Hero timer
        if (hDays) hDays.textContent = dStr;
        if (hHours) hHours.textContent = hStr;
        if (hMinutes) hMinutes.textContent = mStr;
        if (hSeconds) hSeconds.textContent = sStr;

        // Update Sidebar timer
        if (nDays) nDays.textContent = dStr;
        if (nHours) nHours.textContent = hStr;
        if (nMinutes) nMinutes.textContent = mStr;
        if (nSeconds) nSeconds.textContent = sStr;
    };

    updateHero();
    setInterval(updateHero, 1000);
}
