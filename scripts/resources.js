// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
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

// Filter tags functionality
const filterTags = document.querySelectorAll('.filter-tag');
const resourcesCards = document.querySelectorAll('.resources-card');

filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // Set active class on tag
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');

        const filterValue = tag.getAttribute('data-filter');

        // Show/hide cards based on filter
        resourcesCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Scroll animations for cards
const cardObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, cardObserverOptions);

const filterTagsContainer = document.querySelector('.filter-tags');
resourcesCards.forEach(card => cardObserver.observe(card));
cardObserver.observe(filterTagsContainer);

