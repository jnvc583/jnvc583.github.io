Array.from(document.getElementsByTagName('img')).forEach(el => {
    el.addEventListener('click', () => {
        enterFullscreen();
    });
});