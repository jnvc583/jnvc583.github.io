const button1 = document.getElementById('chgdgc1');
const button2 = document.getElementById('chgdgc2');
const button3 = document.getElementById('chgdgc3');
const dial = document.getElementById('dial1');
button1.addEventListener('click', function() {
    dial.setAttribute('class', 'dialogue');
});
button2.addEventListener('click', function () {
    dial.setAttribute('class', 'green-dialogue');
});
button3.addEventListener('click', function () {
    dial.setAttribute('class', 'dark-dialogue');
});