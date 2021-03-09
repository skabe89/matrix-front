const baseUrl = "http://localhost:3000"
const optionsDiv = document.getElementById("optionsWindow")
const optionsArea = document.getElementById("optionsUl")
const scoreBoard = document.getElementById("scoreBoard")
let nameInput = () => document.getElementById("name")
let scoreInput = () => document.getElementById("score")
let startWindow = () => document.getElementById("startWindow")
let userName = ""
let stringToRender = ""

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
  
  let form = `<h2>Enter Your Name</h2>
  <form id="form">
    <div class="input-field">
      <input type="text" name="name" id="name"/>
    </div>
    <br>
    <input type="submit" value="Start Game" />
  </form>
  `
  optionsDiv.innerHTML = form
}

function addButtonFunctionality(){
  let button = document.getElementById("form").children[2]
  button.addEventListener("click", function(e) {

    userName = nameInput().value
    
    if(userName === ""){
      alert("Please enter a name")
    }
    else {
      changePlayerColorIfEnoch()
      let openingLine = `Wake up, ${userName}...`
      document.querySelector("h3").innerText = userName
      deleteButton()
      e.preventDefault()
      typeName(openingLine)
      setTimeout(() => {
        console.log("starting")
        startGame();
        gunCock.play()
      }, 6000)
    }

  })
}

function deleteButton(){
  let form = document.getElementById("form")
  form.innerHTML = ""
}



function submitScore(e){

  let params = {
    "score": score,
        "user": {
          "name": userName
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
    .then(() => { 
      fetchScores();
    })
  
}

function clearScores(){
  scoreBoard.innerHTML = ""
}

function renderScores(){
  let sortedGames = [...Game.all].sort((a ,b) => b.score - a.score)
  sortedGames.forEach(game => putScoresOnDom(game))
}

function putScoresOnDom(score){
  let div = document.createElement("div")
  let li = document.createElement("li")
  let p = document.createElement("h3")
  // let p2 = document.createElement("p")
  let btn = document.createElement("button")

  p.innerText = `${score.user.name}: ${score.score} pts`
  // p2.innerText = score.score
  btn.innerText = "Delete Score"
  btn.id = score.id
  btn.addEventListener("click", deleteScore)

  li.append(p, btn)
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
    renderBackground()
    gifOn();
    setTimeout(() => gifOff(), 1800)
    setTimeout(() => codeHallOn(), 1800)
    setTimeout(() => codeHallOff(), 3000)
    theOneUsed = true
  }
}

let checkHit = function(){
  let bulletLeft = bullet.style.left
  let bottom = player.style.bottom
  let height = player.style.height
  // console.log(height)
  if (bullet.style.bottom === "58px"){
    // console.log(bulletLeft)
    if(height === "80px" && bulletLeft === "140px", height === "80px" && bulletLeft === "135px", height === "80px" && bulletLeft === "130px"){
      alert("Game Over, high hit")
      theOneUsed = false
      resetBackground()
      submitScore()
      clearInterval(intervalId)
      bullet.style.left = "685px"
      score = 0
      renderGameScore()
    }
  }
  else if(bullet.style.bottom !== "58px"){
    //lowshot
    if(bottom === "0px" && bulletLeft === "140px", bottom === "0px" && bulletLeft === "135px", bottom === "0px" && bulletLeft === "130px"){
      alert("Game Over, low hit")
      theOneUsed = false
      resetBackground()
      clearInterval(intervalId)
      submitScore()
      bullet.style.left = "685px"
      bullet.style.bottom = "58px"
      score = 0
      renderGameScore()
    } 
  }
}
//left hits 140, 135, 130, 125, 120, 115

let shot = function(){
  let randomNum = Math.floor(Math.random() * 2)
  let shotOptions = [lowBulletMove, highBulletMove]
  let randomShot = Math.floor(Math.random() * 7)
  gunShot.play()
  
  this.intervalId = setInterval(function() {
    shotOptions[randomNum]()+
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
let codeHallGif = document.getElementById("codeHall")
let gunCock = new Audio('https://www.soundjay.com/mechanical/sounds/gun-cocking-01.mp3')
let gunShot = new Audio('https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3')
let shellDrop = new Audio('https://www.soundjay.com/mechanical/sounds/empty-bullet-shell-fall-02.mp3')
// let bgroundMusic = new Audio('https://voca.ro/1ojszmorAV4z')

function gifOn(){
  startText().innerHTML = ""
  startWindow().style.display = "block"
  theOneGif.style.display = "block"
}

function gifOff(){
  startWindow().style.display = "none"
  theOneGif.style.display = "none";
}

function codeHallOn(){
  startWindow().style.display = "block"
  codeHallGif.style.display = "block"
}

function codeHallOff(){
  startWindow().style.display = "none"
  codeHallGif.style.display = "none"
}

let startText = () => document.getElementById("startText")



function renderStartText(){
  startText().style.left = "30%"
  startText().innerText = stringToRender + "_"
}

function typeName(string){
  for(let i = 0; i < string.length; i++){
    setTimeout(() => {
      stringToRender = stringToRender.concat(string[i]);
      renderStartText()
    }, i * 270)
  }
}

function renderBackground(){
  document.body.style.backgroundImage = `url("https://media1.tenor.com/images/84bb08e499749a5729fde83700d1351e/tenor.gif?itemid=9435293")`
}

function resetBackground(){
  document.body.style.backgroundImage = ""
}

function changePlayerColorIfEnoch(){
  if(userName.toLowerCase() === "enoch") {
    player.style.background = '#283593'
  }
}

