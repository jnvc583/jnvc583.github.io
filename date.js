function getCurrentDate() {
const date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

console.log(getCurrentDate());