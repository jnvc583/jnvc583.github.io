const h1 = document.querySelector('h1');
h1.innerHTML = h1.textContent.replace(/\s/g, '<span>$&</span>');
document.querySelectorALL('span').forEach((span, index) => {
  span.style.setProperty('--delay', `${index*0.1}s`);
})
document.querySelectorALL('button').forEach(button => {
  button.addEventListener('click', e => {
    h1.style.setProperty('--animation', e.target.getAttribute(data-animation));
    h1.classList.remove('animate');
    void h1.offsetWidth;
    h1.classList.add('animate');
  })
})
