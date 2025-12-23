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
document.querySelector('.sticky').setAttribute('style', 'top:' + document.querySelector('.menu').offsetHeight + 'px;')