let avt = document.getElementById("avatar");
function getCurrentDate() {
    const date = new Date();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    let day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
}
console.log(getCurrentDate());
if (getCurrentDate() === "12-13" || getCurrentDate() === "12-14") {
    document.documentElement.style.filter = "grayscale(100%)";
    document.documentElement.style.webkitFilter = "grayscale(100%)";
    avt.src = "./sadavatar.png";
}
let newScript = document.createElement('script');
newScript.src = "https://jnvc583.github.io/dark.js";
document.body.appendChild(newScript);
let darkModeToggle = document.createElement('button');
darkModeToggle.id = "dark-mode-toggle";
darkModeToggle.innerText = "切换深色模式";
document.querySelector('.menu').appendChild(darkModeToggle);
console.log(document.querySelector('.menu').offsetHeight);
const topValue = document.querySelector('.menu').offsetHeight + 'px';
Array.from(document.getElementsByClassName('sticky')).forEach(el => el.style.top = topValue);

let bgbox = document.createElement('div');
bgbox.id = "bg";
document.querySelector('.root').appendChild(bgbox);
let addedbgbox = document.getElementById('bg');
let backgroundCircle1 = document.createElement('span');
let backgroundCircle2 = document.createElement('span');
let backgroundCircle3 = document.createElement('span');
addedbgbox.appendChild(backgroundCircle1);
addedbgbox.appendChild(backgroundCircle2);
addedbgbox.appendChild(backgroundCircle3);
let charsetmeta = document.querySelector('meta');
charsetmeta.setAttribute('charset', 'utf-8');