class Game {

  static all = []

  constructor(attr){
    this.id = attr.id
    this.score = attr.score
    this.user = attr.user
  }

  save(){
    Game.all.push(this)
  }

  static create(attr){
    let game = new Game(attr)
    game.save()
    return game
  }

  static clearScores(){
    scoreBoard.innerHTML = ""
  }

  static renderScores(){
    Game.sortedGames().forEach(game => Game.putScoresOnDom(game))
  }

  static sortedGames(){
    let sortedGames = [...Game.all].sort((a ,b) => b.score - a.score)
    return sortedGames
  }

  static updateScores(){
    Game.clearScores()
    Game.renderScores()
  }

  static renderGameScore(){
    scoreDiv.innerText = score
  }

  static deleteButton(){
    let form = document.getElementById("form")
    form.innerHTML = ""
  }

  static putScoresOnDom(score){
    let div = document.createElement("div")
    let li = document.createElement("li")
    let p = document.createElement("h3")
    let btn = document.createElement("button")
  
    if(score.score === 1){
      p.innerText = `${score.user.name}: ${score.score} pt`
    }
    else{
      p.innerText = `${score.user.name}: ${score.score} pts`
    }
   
    btn.innerText = "Delete Score"
    btn.id = score.id
    btn.addEventListener("click", Game.deleteScore)
  
    li.append(p, btn)
    div.append(li)
    scoreBoard.append(div)
  }

  /** requests to the backend */

  static fetchScores = () => {
    Game.all = []
    Game.clearScores()
    fetch(baseUrl + "/games").then(response => response.json())
      .then(data => {
        data.forEach(score => {

          Game.create(score)
        });
        Game.renderScores()
      });
  }

  static submitScore = (e) => {
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
        Game.fetchScores();
      })
  }

  static deleteScore = (e) => {
    
    let id = parseInt(e.target.id)
    
    fetch(baseUrl + "/games/" + id, {
      method: "DELETE"
    })
    .then(resp => resp.json())
    .then(function(data){
      Game.all = Game.all.filter(function(game){
        return game.id !== data.id
      })
      Game.updateScores()
    })
  }
  
}


