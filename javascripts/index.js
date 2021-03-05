const baseUrl = "http://localhost:3000"
const optionsDiv = document.getElementById("optionsWindow")
const optionsArea = document.getElementById("optionsUl")
window.addEventListener('DOMContentLoaded', (event) => {
  getUsers();
});


function getUsers(){
  fetch(baseUrl + "/users").then(response => response.json())
    .then(data => {
      data.forEach(user => {
        putUserOnDom(user)
      });
    });
}

function putUserOnDom(user){
  let div = document.createElement("div")
  let li = document.createElement("li")
  let p = document.createElement("p")
  let p2 = document.createElement("p")

  p.innerText = user.name
  p2.innerText = user.id

  li.append(p, p2)
  div.append(li)
  optionsArea.append(div)
}


// class User {

//   constructor(name){
//     this.name = name
//     User.all.push(this)
//   }

//   static all() {
//     return []
//   }

// }