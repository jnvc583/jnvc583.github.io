var onbtn= document.getElementById("onbtn");
onbtn.onclick=function(){
  document.getElementById('light').src='light1.gif'
  document.getElementById('bg').style.background='rgb(255,255,255)'
  document.getElementById('text1').style.color='rgb(0,0,0)'
}
var offbtn= document.getElementById("offbtn");
offbtn.onclick=function(){
  document.getElementById('light').src='light.gif'
  document.getElementById('bg').style.background='rgb(0,0,0)'
  document.getElementById('text1').style.color='rgb(255,255,255)'
}
