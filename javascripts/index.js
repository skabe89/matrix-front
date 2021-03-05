const baseUrl = "http://localhost:3000"
const optionsDiv = document.getElementById("optionsWindow")
const optionsArea = document.getElementById("optionsUl")
const scoreBoard = document.getElementById("scoreBoard")
let nameInput = () => document.getElementById("name")
let scoreInput = () => document.getElementById("score")

window.addEventListener('DOMContentLoaded', (event) => {
  // getUsers();
  getScores();
  renderForm();
  addButtonFunctionality();
});


function getUsers(){
  fetch(baseUrl + "/users").then(response => response.json())
    .then(data => {
      data.forEach(user => {
        putUserOnDom(user)
      });
    });
}

function getScores(){
  fetch(baseUrl + "/games").then(response => response.json())
    .then(data => {
      data.forEach(score => {
        putScoresOnDom(score)
      });
    });
}

function renderForm(){
  
  let form = `<h3>Enter Your Initials</h3>
  <form id="form">
    <div class="input-field">
      <input type="text" name="name" id="name"/>
      <input type="text" name="score" id="score"/>
    </div>
    <br>
    <input type="submit" value="Submit" />
  </form>
  `
  optionsDiv.innerHTML = form
}

function addButtonFunctionality(){
  let button = document.getElementById("form").children[2]
  button.addEventListener("click", function(e) {
    e.preventDefault()
    //handle info, start game?
    submitScore()
  })
}

function submitScore(e){
  
  let params = {
    "score": scoreInput().value,
        "user": {
          "name": nameInput().value
        }
    }

  fetch(baseUrl + "/games", {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(params),
    method: "POST"})
    .then(resp => resp.json())
    .then(score => console.log(score))
}

// function putUserOnDom(user){
//   let div = document.createElement("div")
//   let li = document.createElement("li")
//   let p = document.createElement("p")
//   let p2 = document.createElement("p")

//   p.innerText = user.name
//   // p2.innerText = user.id

//   li.append(p, p2)
//   div.append(li)
//   optionsArea.append(div)
// }

function putScoresOnDom(score){
  let div = document.createElement("div")
  let li = document.createElement("li")
  let p = document.createElement("p")
  let p2 = document.createElement("p")

  p.innerText = score.user.name
  p2.innerText = score.score

  li.append(p, p2)
  div.append(li)
  scoreBoard.append(div)

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