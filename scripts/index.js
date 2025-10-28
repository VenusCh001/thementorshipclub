// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    e.target.reset();
});

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.mobile-nav');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// Dark/Light mode toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        themeToggle.classList.remove('fa-sun');
        themeToggle.classList.add('fa-moon');
        localStorage.removeItem('theme');
    }
});

// Check for saved theme in localStorage
if (localStorage.getItem('theme') === 'dark-mode') {
    body.classList.add('dark-mode');
    themeToggle.classList.remove('fa-moon');
    themeToggle.classList.add('fa-sun');
}



// Testimonials Slider - Infinite Loop
(function() {
    const track = document.querySelector('.testimonials-track');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-nav.prev');
    const nextBtn = document.querySelector('.testimonial-nav.next');
    
    if (!track) return;
    const slides = Array.from(track.children);

    const totalSlides = slides.length;
    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval;
    const autoSlideDelay = 5000;

    if (totalSlides === 0) return;

    // Clone first and last slides for infinite loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const dots = Array.from(dotsContainer.children);

    track.style.transform = `translateX(-100%)`;

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    track.style.transform = `translateX(-100%)`;

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function moveToSlide(slideIndex) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        const offset = -(slideIndex + 1) * 100;
        track.style.transform = `translateX(${offset}%)`;

        if (slideIndex >= totalSlides) {
            currentIndex = 0;
        } else if (slideIndex < 0) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = slideIndex;
        }
        updateDots();
    }

    function nextSlide() {
        moveToSlide(currentIndex + 1);
    }

    function prevSlide() {
        moveToSlide(currentIndex - 1);
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (track.style.transform === `translateX(-${(totalSlides + 1) * 100}%)`) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(-100%)'; 
        }
        if (track.style.transform === 'translateX(0%)') {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${totalSlides * 100}%)`; 
        }
    });

    function startAutoSlide() {
        stopAutoSlide(); 
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index !== currentIndex) {
                moveToSlide(index);
                resetAutoSlide();
            }
        });
    });

    // Pause on hover
    const testimonialWrapper = document.querySelector('.testimonials-wrapper');
    if (testimonialWrapper) {
        testimonialWrapper.addEventListener('mouseenter', stopAutoSlide);
        testimonialWrapper.addEventListener('mouseleave', startAutoSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (testimonialWrapper) {
        testimonialWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
                resetAutoSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });
    }

    // Start auto-slide
    startAutoSlide();
})();