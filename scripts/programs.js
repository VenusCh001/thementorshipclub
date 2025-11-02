document.querySelectorAll('.expand-item .expand-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.closest('.expand-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.expand-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// Hackathons countdown (next event placeholder date)
(function(){
    const container = document.getElementById('hack-countdown');
    if (!container) return;
    // Set a placeholder next event 30 days from now
    const target = new Date(Date.now() + 30*24*60*60*1000);
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    function tick(){
        const now = new Date();
        let diff = Math.max(0, target - now);
        const days = Math.floor(diff / (24*60*60*1000)); diff -= days*24*60*60*1000;
        const hours = Math.floor(diff / (60*60*1000)); diff -= hours*60*60*1000;
        const mins = Math.floor(diff / (60*1000)); diff -= mins*60*1000;
        const secs = Math.floor(diff / 1000);
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
})();

