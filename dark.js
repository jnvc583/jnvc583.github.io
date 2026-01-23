// 切换深色模式
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// 绑定按钮事件
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
