//our html elements
var gameBoard = document.querySelector(".boarddiv")
var scoreDOM = document.querySelector(".score")
var pointsDOM = document.querySelector(".points")
var letterDOM = document.querySelector(".letterDOM")
var playerNameDOM = document.querySelector(".playername")

//sounds
var letterMatch = new Audio("./assets/lettermatch.mp3")
var puzzleWrong = new Audio("./assets/lettermatch.mp3")
var vowelMatch = new Audio("./assets/lettermatch.mp3")
var click = new Audio("./assets/click.wav")

//buttons
var buyBtn = document.querySelector(".buyBtn")
var spinBtn = document.querySelector(".spinBtn")
var solveBtn = document.querySelector(".solveBtn")


// gameplay variables
var letters ='bbccdgghjjkkllmmnnppqrrssttvwwxyyz'
letters=[...letters.split(""),'bonus','double','pay_a_penalty','maggies surprise']
var vowels ='aeiou'.split("")

//init game variables

var globalPhrase=""
var globalPhrases =[]
var score = 0;
var points =0;

const main = async()=>{

// let playerName = prompt("Players name? (Its Mom as default! :)")

let playerName;
if(playerName === "" || playerName === null || playerName === undefined){
    console.log("Mom it is!")
    playerName = "Mom"
}
playerNameDOM.innerHTML = `${playerName}'s `
  
 let data = await fetch('phrases.json')
 let json = await data.json();
//  console.log(json)

let {phrase} = choosePhrase(json)
globalPhrases = json
globalPhrase = phrase;
renderPhrase(phrase)

}


 function choosePhrase(phrases){
    let ourPhrase = phrases[Math.random() * phrases.length | 0]

    // console.log(ourPhrase)
    return ourPhrase
    
}


function renderPhrase(phrase){
    console.log(phrase)
    let html = ""
    phrase.split("").forEach((tile,idx)=>{
        if(tile !== " "){
        html += `<div data-idx=${idx} class='tile letterTile letter'><h3 class='tileh3'>${tile}</h3></div>`
        }
        else{
            html += `<div class='tile'></div>`
        }
    })
    gameBoard.innerHTML = html
}


main()


spinBtn.onclick=spinLetters;

buyBtn.onclick=buyVowel

solveBtn.onclick=solvePuzzle;


function spinLetters(){
    let spinCount = (Math.random() * 20 | 0) + 5;

    renderSpinLetters(spinCount)
}

function renderSpinLetters(count){
    // console.log(count)
        let currentLetter=letters[Math.random() * letters.length | 0];
        letterDOM.innerHTML = currentLetter

    if(count > 0){
    setTimeout(()=>{
        click.play()
        renderSpinLetters(count-1);
    },150);
}

    if(count === 0){
        console.log("fx finished")
        spinResult(currentLetter)
    }

    

}


function spinResult(letter){
    console.log("Letter: " + letter)
    var tiles = document.querySelectorAll(".tile")
    console.log(tiles[0].children[0])
    console.log(globalPhrase)
    globalPhrase.split("").forEach((val,idx)=>{
      
        if(val === letter){
            console.log("we got a match!")
            points+=10;
            pointsDOM.innerHTML = points;
            letterMatch.play()

             tiles[idx].children[0].style.display='block'
        }
    })
}



function buyVowel(){
    if(points < 5){
        alert("Im sorry, you dont have enough points to buy a vowel!")
        return;
    }
    points-=5;
    pointsDOM.innerHTML = points;
    let playerVowel = prompt("What vowel would you like to buy?");
    console.log("You selected " + playerVowel)
    setTimeout(()=>{
    spinResult(playerVowel)
    },1000)
}


function solvePuzzle(){

    let playerAnswer = prompt("And the answer is?")

    if(playerAnswer === globalPhrase){
        alert("You win!")
        winGame()
    }
    else{
        alert("Sorry, not correct!")
    }
}



function winGame(){
    let h3Tiles=document.querySelectorAll(".tileh3")

    for(let i = 0;i<h3Tiles.length;i++){
        setTimeout(()=>{
            h3Tiles[i].style.display='block'

            if( i === h3Tiles.length-1){
                restartGame()
            }
        },i*250)
    }

    //do a score system based on # of unturned tiles

    score+=150

    scoreDOM.innerHTML = score;

}


function restartGame(){
    console.log("game restarted!")
    points=0;
    pointsDOM=0;

    globalPhrase = choosePhrase(globalPhrases).phrase
    renderPhrase(globalPhrase)
    
}
