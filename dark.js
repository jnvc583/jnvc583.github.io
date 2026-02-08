const DARK_MODE_KEY = 'darkMode';

function enableDarkMode() {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, 'true');
}

function disableDarkMode() {
    document.documentElement.classList.remove('dark-mode');
    document.body.classList.remove('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, 'false');
}

function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark-mode') || document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

window.toggleDarkMode = toggleDarkMode;
window.enableDarkMode = enableDarkMode;
window.disableDarkMode = disableDarkMode;

document.addEventListener('DOMContentLoaded', function() {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved === 'true') {
        enableDarkMode();
    } else if (saved === 'false') {
        disableDarkMode();
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    }

    const btn = document.getElementById('dark-mode-toggle');
    if (btn) {
        btn.addEventListener('click', toggleDarkMode);
    }
});
