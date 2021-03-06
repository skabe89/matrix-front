const baseUrl = "http://localhost:3000"
const optionsDiv = document.getElementById("optionsWindow")
const optionsArea = document.getElementById("optionsUl")
const scoreBoard = document.getElementById("scoreBoard")
let nameInput = () => document.getElementById("name")
let scoreInput = () => document.getElementById("score")
let startWindow = () => document.getElementById("startWindow")

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
  
  let form = `<h3>Enter Your Name</h3>
  <form id="form">
    <div class="input-field">
      <input type="text" name="name" id="name"/>
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
  if(score === -1){
    score = 0
  }

  let params = {
    "score": score,
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
const scoreDiv = document.getElementById("score")

let score = 0
let theOneUsed = false
renderGameScore()
let bulletSpeeds = [2, 3, 4, 5, 6, 7, 8]

// function renderGameWindow(){
//   let window = `<div id="gameWindow">
//     <div id="score" class="center-align"></div>
//     <div id="player" style="bottom: 0px; left: 120px;"></div>
//     <div id="agent" style="bottom: 0px; left: 720px;"></div>
//     <div id="agentArm" style="bottom: 50px; left: 695px;"></div>
//     <div id="bullet" style="bottom: 58px; left: 685px;"></div>
//     <div id="gun" style="bottom: 55px; left: 685px;"></div>
//     </div>`
//   body.append(window)
  
// }

function renderGameScore(){
  scoreDiv.innerText = score
}


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
    score ++
    checkScore()
    renderGameScore()
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
    score ++
    checkScore()
    renderGameScore()
  }
}

function checkScore(){
  if(score > Game.all[0].score && theOneUsed === false){
    gifOn();
    setTimeout(() => gifOff(), 2000)
    theOneUsed = true
  }
}

let checkHit = function(){
  let bulletLeft = bullet.style.left
  let bottom = player.style.bottom
  let height = player.style.height
  console.log(height)
  if (bullet.style.bottom === "58px"){
    console.log(bulletLeft)
    if(height === "80px" && bulletLeft === "140px", height === "80px" && bulletLeft === "135px", height === "80px" && bulletLeft === "130px"){
      alert("Game Over, high hit")
      theOneUsed = false
      submitScore()
      score = -1
    }
  }
  else if(bullet.style.bottom !== "58px"){
    //lowshot
    if(bottom === "0px" && bulletLeft === "140px", bottom === "0px" && bulletLeft === "135px", bottom === "0px" && bulletLeft === "130px"){
      alert("Game Over, low hit")
      theOneUsed = false
      submitScore()
      score = -1
    } 
  }
}
//left hits 140, 135, 130, 125, 120, 115

let shot = function(){
  let randomNum = Math.floor(Math.random() * 2)
  let shotOptions = [lowBulletMove, highBulletMove]
  let randomShot = Math.floor(Math.random() * 7)
  console.log(randomNum)
  this.intervalId = setInterval(function() {
    shotOptions[randomNum]()
    checkHit()
    //check hit
  }
  , bulletSpeeds[randomShot]);
  //variable to change the speeds 
}


function startGame(){
  startWindow().style.display = "none";
  addGameEvents()
}


function gameOver(){
  startWindow().style.display = "block"
}


function addGameEvents(){
  document.addEventListener("keydown", function(e) {
    if(e.key === "ArrowUp"){
      jump()
    }
    if(e.key === "ArrowDown"){
      duck()
    }
    if(e.keyCode === 32){
      shot()
    }
    if(e.key === "ArrowRight"){
      lowBulletMove()
    }
  })
}

//animations
let theOneGif = document.getElementById("theOne")

function gifOn(){
  startWindow().style.display = "block"
  theOneGif.style.display = "block"
}

function gifOff(){
  startWindow().style.display = "none"
  theOneGif.style.display = "none";
}
