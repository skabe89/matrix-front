

const baseUrl = "http://localhost:3001"
const optionsDiv = document.getElementById("optionsWindow")
const optionsArea = document.getElementById("optionsUl")
const scoreBoard = document.getElementById("scoreBoard")
const theOneGif = document.getElementById("theOne")
const codeHallGif = document.getElementById("codeHall")
const player = document.getElementById("player")
const bullet = document.getElementById("bullet")
const scoreDiv = document.getElementById("score")

const nameInput = () => document.getElementById("name")
const scoreInput = () => document.getElementById("score")
const startWindow = () => document.getElementById("startWindow")
const startText = () => document.getElementById("startText")

let userName = ""
let stringToRender = ""
let gunCock = new Audio('https://www.soundjay.com/mechanical/sounds/gun-cocking-01.mp3')
let gunShot = new Audio('https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3')
let shellDrop = new Audio('https://www.soundjay.com/mechanical/sounds/empty-bullet-shell-fall-02.mp3')

let score = 0
let theOneUsed = false
let bulletSpeeds = [2, 3, 4, 5, 6, 7, 8]


