// 桌面端下拉菜单
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    const menu = toggle.nextElementSibling;
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        // 关闭其他打开的菜单
        document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m !== menu) m.classList.remove('active');
        });  
        menu.classList.toggle('active');
    });
});
// 点击页面其他区域关闭菜单
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
});
        
// 移动端菜单切换
function toggleMobileMenu() {
    const button = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    button.classList.toggle('active');
    menu.classList.toggle('active');
}    
// 移动端子菜单切换
function toggleSubMenu(button) {
    const icon = button.querySelector('i');
    const menu = button.nextElementSibling;
    icon.classList.toggle('transform');
    icon.classList.toggle('rotate-180');
    menu.classList.toggle('hidden');
}