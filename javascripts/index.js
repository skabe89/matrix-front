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


// function getUsers(){
//   fetch(baseUrl + "/users").then(response => response.json())
//     .then(data => {
//       data.forEach(user => {
//         putUserOnDom(user)
//       });
//     });
// }

function getScores(){
  fetch(baseUrl + "/games").then(response => response.json())
    .then(data => {
      data.forEach(score => {
        let game = new Game(score)
        putScoresOnDom(game)
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

    clearScores();
    getScores();
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

function clearScores(){
  scoreBoard.innerHTML = ""
}

function putScoresOnDom(score){
  let div = document.createElement("div")
  let li = document.createElement("li")
  let p = document.createElement("p")
  let p2 = document.createElement("p")
  let btn = document.createElement("button")

  p.innerText = score.user.name
  p2.innerText = score.score
  btn.innerText = "Delete-Score"
  btn.id = score.id
  btn.addEventListener("click", deleteScore)

  li.append(p, p2, btn)
  div.append(li)
  scoreBoard.append(div)

}

function deleteScore(e){
  console.log(e.target.id)
  id = e.target.id
  fetch(baseUrl + "/games/" + id, {
    method: "DELETE"
  })
  .then(resp => resp.json())
  
  
}



class Game {

  constructor(score){
    this.id = score.id
    this.score = score.score
    this.user = score.user
    Game.all.push(this)
  }

  static all = []

}