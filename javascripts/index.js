const baseUrl = "http://localhost:3000"
const optionsDiv = document.getElementById("optionsWindow")
const optionsArea = document.getElementById("optionsUl")
const scoreBoard = document.getElementById("scoreBoard")
let nameInput = () => document.getElementById("name")
let scoreInput = () => document.getElementById("score")
let gameWindow = () => document.getElementById("gameWindow")

window.addEventListener('DOMContentLoaded', (event) => {
  fetchScores();
  renderForm();
  addButtonFunctionality();
});


function fetchScores(){
  Game.all = []
  clearScores()
  fetch(baseUrl + "/games").then(response => response.json())
    .then(data => {
      data.forEach(score => {
        let game = new Game(score)
      });
      renderScores()
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
    .then(score => { 
       
      fetchScores();
    })
  
}

function clearScores(){
  scoreBoard.innerHTML = ""
}

function renderScores(){
  Game.all.forEach(game => putScoresOnDom(game))
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
  
  id = parseInt(e.target.id)
  
  fetch(baseUrl + "/games/" + id, {
    method: "DELETE"
  })
  .then(resp => resp.json())
  .then(function(data){
    Game.all = Game.all.filter(function(game){
      return game.id !== data.id
    })
    updateScores()
  })
  }


function updateScores(){
  clearScores()
  renderScores()
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

// game mechanics

const player = document.getElementById("player")
player.style.height = "80px"
const bullet = document.getElementById("bullet")

// function renderPlayer(){
//   let player = ` <div id="player" style="bottom: 0px; left: 120px;"></div>`
//   gameWindow().append(player)
// }

function jump(){
  player.style.bottom = "40px"
  setTimeout(() => player.style.bottom = "0px", 200)
}

function duck(){
  player.style.left = "40px"
  player.style.height = "20px"
  player.style.width = "80px"
  setTimeout(() => {
    player.style.height = "80px"
    player.style.width = "20px"
    player.style.left = "120px"
  }
  , 300)
}

let highBulletMove = function(){
  let shotMove = bullet.style.left.replace("px", "")
  let left = parseInt(shotMove, 10)

  if (left > 0) {
    bullet.style.left = `${left - 5}px`
  }
  else {
    clearInterval(intervalId)
    bullet.style.left = "685px"
    // score ++
  }
}

let lowBulletMove = function(){
  let shotMove = bullet.style.left.replace("px", "")
  let left = parseInt(shotMove, 10)
  let shotDown = bullet.style.bottom.replace("px", "")
  let bottom = parseInt(shotDown, 10)

  if (left > 0) {
    bullet.style.left = `${left - 5}px`
    if(left % 15 === 0){
      bullet.style.bottom = `${bottom - 1}px`
    }
  }
  else {
    clearInterval(intervalId)
    bullet.style.left = "685px"
    bullet.style.bottom = "58px"
    // score ++
  }
}

let checkHit = function(){
  let bulletLeft = bullet.style.left
  let bottom = player.style.bottom
  let height = player.style.height
  console.log(height)
  if (bullet.style.bottom === "58px"){
    console.log(bulletLeft)
    if(height === "80px" && bulletLeft === "140px"){
      alert("Game Over, high hit")
    }
  }
  else if(bullet.style.bottom !== "58px"){
    //lowshot
    if(bottom === "0px" && bulletLeft === "140px"){
      alert("Game Over, low hit")
    } 
  }
}
//left hits 140, 135, 130, 125, 120, 115

let shot = function(){
  let randomNum = Math.floor(Math.random() * 2)
  let shotOptions = [lowBulletMove, highBulletMove]
  console.log(randomNum)
  this.intervalId = setInterval(function() {
    shotOptions[randomNum]()
    checkHit()
   //check hit
  }
    , 7);
    //number will be variable to change the speeds 
}



document.addEventListener("keydown", function(e) {
  if(e.key === "ArrowUp"){
    jump()
  }
  if(e.key === "ArrowDown"){
    duck()
  }
  if(e.key === "ArrowLeft"){
    shot()
  }
  if(e.key === "ArrowRight"){
    lowBulletMove()
  }
})