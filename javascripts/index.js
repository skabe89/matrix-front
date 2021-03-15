
/** Window displays */

window.addEventListener('DOMContentLoaded', (event) => {
  Game.fetchScores();
  Game.renderGameScore();
  renderForm();
  addButtonFunctionality();
  player.style.height = "80px"
});

let renderForm = () => {
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

let renderControlMenu = () => {
  let form = `    
    <h2><u>Controls</u></h2>
    <h4>Press the UP arrow to Jump</h4>
    <h4>Press the Down arrow to Duck</h4>
    <h4>Press the spacebar to have the agent fire a shot</h4>
    <h4>Get the Highscore to become the ONE!</h4>`

  optionsDiv.innerHTML = form
}

let addButtonFunctionality = () => {
  let button = document.getElementById("form").children[2]

  button.addEventListener("click", function(e) {
    userName = nameInput().value
    
    if(userName === ""){
      alert("Please enter a name")
    }
    else {
      changePlayerColorIfEnoch()
      let openingLine = `Wake up, ${userName}...`
      Game.deleteButton()
      renderControlMenu()
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


/**  game mechanics */


let jump = () =>{
  player.style.bottom = "40px"
  setTimeout(() => player.style.bottom = "0px", 200)
}

let duck = () =>{
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

let highBulletMove = () => {
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
    Game.renderGameScore()
  }
}

let lowBulletMove = () => {
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
    Game.renderGameScore()
  }
}

let checkScore = () => {
  if(score > Game.sortedGames()[0]?.score && theOneUsed === false) {
    console.log('%cChecking Score', "color: red")
    renderBackground()
    gifOn();
    setTimeout(() => gifOff(), 1800)
    setTimeout(() => codeHallOn(), 1800)
    setTimeout(() => codeHallOff(), 3000)
    theOneUsed = true
  }
}

let checkHit = () => {
  let bulletLeft = bullet.style.left
  let bottom = player.style.bottom
  let height = player.style.height
  // console.log(bulletLeft)
  // console.log(bullet.style.bottom)
  if (bullet.style.bottom === "58px") {
    // console.log("the height is right")
    if(height === "80px" && bulletLeft === "140px", height === "80px" && bulletLeft === "135px", height === "80px" && bulletLeft === "130px") {
      alert("Game Over, high hit")
      theOneUsed = false
      resetBackground()
      Game.submitScore()
      clearInterval(intervalId)
      bullet.style.left = "685px"
      score = 0
      Game.renderGameScore()
    }
  }
  else if(bullet.style.bottom !== "58px") {
    //lowshot
    if(bottom === "0px" && bulletLeft === "140px", bottom === "0px" && bulletLeft === "135px", bottom === "0px" && bulletLeft === "130px") {
      // gameOver()
      alert("Game Over, low hit")
      theOneUsed = false
      resetBackground()
      clearInterval(intervalId)
      Game.submitScore()
      bullet.style.left = "685px"
      bullet.style.bottom = "58px"
      score = 0
      Game.renderGameScore()
    } 
  }
}
//left hits 140, 135, 130, 125, 120, 115
let shot = function() {
  let randomNum = Math.floor(Math.random() * 2)
  let shotOptions = [lowBulletMove, highBulletMove]
  let randomShot = Math.floor(Math.random() * 7)
  gunShot.play()
  
  this.intervalId = setInterval(function() {
    shotOptions[randomNum]()+
    checkHit()
  }
  , bulletSpeeds[randomShot]);
}

let startGame = () => {
  startWindow().style.display = "none";
  addGameEvents()
}

// function gameOver(){
//   startWindow().style.display = "block"
// } 

let addGameEvents = () => {
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


/** Animations and Sounds */


let gifOn = () => {
  startText().innerHTML = ""
  startWindow().style.display = "block"
  theOneGif.style.display = "block"
}

let gifOff = () => {
  startWindow().style.display = "none"
  theOneGif.style.display = "none";
}

let codeHallOn = () => {
  startWindow().style.display = "block"
  codeHallGif.style.display = "block"
}

let codeHallOff = () => {
  startWindow().style.display = "none"
  codeHallGif.style.display = "none"
}

let renderStartText = () => {
  startText().style.left = "30%"
  startText().innerText = stringToRender + "_"
}

let typeName = (string) => {
  for(let i = 0; i < string.length; i++){
    setTimeout(() => {
      stringToRender = stringToRender.concat(string[i]);
      renderStartText()
    }, i * 270)
  }
}

let renderBackground = () => {
  document.body.style.backgroundImage = `url("https://media1.tenor.com/images/84bb08e499749a5729fde83700d1351e/tenor.gif?itemid=9435293")`
}

let resetBackground = () => {
  document.body.style.backgroundImage = ""
}

let changePlayerColorIfEnoch = () => {
  if(userName.toLowerCase() === "enoch") {
    player.style.background = '#283593'
  }
}
