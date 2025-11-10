// Logseq Publisher JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('Logseq Publisher initialized');

    // Add click handlers for navigation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('wiki-link')) {
            // Let browser handle navigation normally
            console.log('Navigate to:', e.target.getAttribute('href'));
        }
    });
});
