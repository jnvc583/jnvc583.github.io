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
console.log(document.querySelector('.menu').offsetHeight);
const topValue = document.querySelector('.menu').offsetHeight + 'px';
Array.from(document.getElementsByClassName('sticky')).forEach(el => el.style.top = topValue);

let newScript = document.createElement('script');
newScript.src = "https://jnvc583.github.io/dark.js";
document.body.appendChild(newScript);
let darkModeToggle = document.createElement('button');
darkModeToggle.id = "dark-mode-toggle";
darkModeToggle.innerText = "切换深色模式";
document.querySelector('.menu').appendChild(darkModeToggle);