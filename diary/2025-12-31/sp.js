const script = document.getElementById('scriptpaper');

function enterFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE11 */
        video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) { /* Firefox */
        video.mozRequestFullScreen();
    }
}
function videoexitFullscreen() {
    if (video.exitFullscreen) {
        video.exitFullscreen();
    } else if (video.webkitExitFullscreen) { /* Safari */
        video.webkitExitFullscreen();
    } else if (video.msExitFullscreen) { /* IE11 */
        video.msExitFullscreen();
    } else if (video.mozCancelFullScreen) { /* Firefox */
        video.mozCancelFullScreen();
    }
}
function backtop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function picturefullscreen() {
    const img = event.target;
    if (img.requestFullscreen) {
        img.requestFullscreen();
    } else if (img.webkitRequestFullscreen) { /* Safari */
        img.webkitRequestFullscreen();
    } else if (img.msRequestFullscreen) { /* IE11 */
        img.msRequestFullscreen();
    } else if (img.mozRequestFullScreen) { /* Firefox */
        img.mozRequestFullScreen();
    }
}

Array.from(document.getElementsByTagName('video')).forEach(el => {
    el.setAttribute('controls', 'true');
    el.innerHTML += '视频不支持您的浏览器，请升级到最新版本。';
    el.addEventListener('play', () => {
        enterFullscreen();
    });
    el.addEventListener('pause', () => {
        videoexitFullscreen();
    });
    el.addEventListener('ended', () => {
        videoexitFullscreen();
    });
});
script.addEventListener('copy', (e) => {
    e.preventDefault();
    alert('不准复制这段文字，但其他的可以。');
    // 将“不准复制这段文字”写入剪切板
    if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '不准复制这段文字');
    }
});