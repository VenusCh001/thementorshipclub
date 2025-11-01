document.querySelectorAll('.faq-item .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// Live search filtering
const searchInput = document.getElementById('faq-search');
const chips = document.querySelectorAll('.faq-chip');
let activeCategory = 'all';

function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.innerText.toLowerCase();
        const cat = item.getAttribute('data-category');
        const matchesText = text.includes(q);
        const matchesCat = activeCategory === 'all' || activeCategory === cat;
        item.style.display = matchesText && matchesCat ? '' : 'none';
    });
}

if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.getAttribute('data-category');
        applyFilters();
    });
});

