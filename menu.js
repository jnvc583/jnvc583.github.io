// ����������˵�
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    const menu = toggle.nextElementSibling;
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        // �ر������򿪵Ĳ˵�
        document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m !== menu) m.classList.remove('active');
        });  
        menu.classList.toggle('active');
    });
});
// ���ҳ����������رղ˵�
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
});
        
// �ƶ��˲˵��л�
function toggleMobileMenu() {
    const button = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    button.classList.toggle('active');
    menu.classList.toggle('active');
}    
// �ƶ����Ӳ˵��л�
function toggleSubMenu(button) {
    const icon = button.querySelector('i');
    const menu = button.nextElementSibling;
    icon.classList.toggle('transform');
    icon.classList.toggle('rotate-180');
    menu.classList.toggle('hidden');
}