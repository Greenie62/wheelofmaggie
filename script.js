//our html elements
var gameBoard = document.querySelector(".boarddiv")
var scoreDOM = document.querySelector(".score")
var pointsDOM = document.querySelector(".points")
var letterDOM = document.querySelector(".letterDOM")
var playerNameDOM = document.querySelector(".playername")
var captionsDOM = document.querySelector(".captions")
var wheel = document.querySelector(".wheel");
wheel.style.display = 'none'

//sounds
var letterMatch = new Audio("./assets/lettermatch.mp3")
var puzzleWrong = new Audio("./assets/lettermatch.mp3")
var vowelMatch = new Audio("./assets/lettermatch.mp3")
var click = new Audio("./assets/click.wav")

//buttons
var buyBtn = document.querySelector(".buyBtn")
var spinBtn = document.querySelector(".spinBtn")
var solveBtn = document.querySelector(".solveBtn")
var desperateBtn = document.querySelector(".desperateBtn")

desperateBtn.style.display='none'

// gameplay variables
var letters ='bbccdgghjjkkllmmnnppqrrssttvwwxyyz'
letters=[...letters.split(""),'bonus','double','pay_a_penalty','maggies surprise']
let ref = [..."bbccdgghjjkkllmmnnppqrrssttvwwxyyz".split(""),'bonus','double','pay_a_penalty','maggies surprise']
var vowels ='aeiou'.split("")

//init game variables

var globalPhrase=""
var globalPhrases =[]
var score = 0;
var points =0;
var applyDouble = false;
var applyBonus = false;
var desperateCount = 0;



//speech functions
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

var recognition = new SR();

recognition.onstart=()=>{
    console.log("recording has started")
}

recognition.onend=()=>{
    console.log("recording has ended")
}

recognition.onresult=(e)=>{

    console.log(e.results[0][0])
    var playerAnswer = e.results[0][0].transcript
    console.log(playerAnswer)

    if(playerAnswer === null){
        console.log("they must have typed")
        return;
    }
    captionsDOM.innerHTML = `${playerNameDOM.innerHTML} answer: ${playerAnswer}`
    setTimeout(()=>{clearCaptions()
    },1500);
    var answer =[];
    playerAnswer.split("").forEach(l=>{
        if(l !== "'"){
            answer.push(l.toLowerCase())
        }
    })
    console.log(answer.join(""))

     if(answer.join("") === globalPhrase){
        alert("You win!")
        winGame()
    }
    
    else{
        alert("Sorry, you did not say the right answer!")
    }

}





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

desperateBtn.onclick=freeLetterChoice;


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
    
    // var letterTiles = document.querySelectorAll(".letterTile")
    var emptyGuess = true
    
    console.log("Letter: " + letter)
    if(letter.length > 1){
        specialRound(letter);
        return;
    }
    var tiles = document.querySelectorAll(".tile")
    console.log(tiles[0].children[0])
    console.log(globalPhrase)
    globalPhrase.split("").forEach((val,idx)=>{
      
        if(val === letter){
            emptyGuess = false;
            desperateCount = 0;
            captionsDOM.innerHTML = "Nice! 👍🏾"
            clearCaptions()
            console.log("we got a match!")
            spliceLetter(letter)
            console.log("LettersLength: " + letters.length)

if(vowels.indexOf(letter) === -1){
            if(applyDouble){
                points+=10;
                applyDouble = false;
            }
            if(applyBonus){
                points+=3
                applyBonus = false;
            }

            points+=10;
            pointsDOM.innerHTML = points;
        }

            letterMatch.play()
             tiles[idx].className += " light-tile"
             tiles[idx].children[0].style.display='block'
        }
        // else{
        //     desperateCount++;
        //     console.log("desperateCount: " + desperateCount)

        //     if(desperateCount === 3){
        //         desperateBtn.style.display='block'
        //         desperateCount = 0
        //     }
        // }
    })
    if(emptyGuess){
        console.log("Bad luck mate")
        desperateIncrement()
    }
}


function desperateIncrement(){
    desperateCount++;
    console.log("desperateCount: " + desperateCount)

    if(desperateCount === 3){
        desperateBtn.style.display='block'
        desperateCount = 0
    }
}


function freeLetterChoice(){

    let freeLetter = prompt("Hey looks like we're in a drought, so you get a Maggie letter wish!")

    while(!checkVowel(freeLetter)){
        freeLetter = prompt("Ohh, Im sorry, you cant have that for free, pick a consonant")
    }

    console.log("FreeLetter: " + freeLetter)
    spinResult(freeLetter)
    desperateBtn.style.display = 'none'
    return;

}

function checkVowel(letter){
    if(vowels.indexOf(letter) !== -1){
            return false;
    }
    else{
        return true;
    }
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
    recognition.start()
    // alert("And the answer is?")
     let playerAnswer = prompt("And the answer is? (You can speak or type it! :) )")
    console.log(playerAnswer)
    if(playerAnswer === globalPhrase){
        alert("You win!")
        winGame()
    }
    else if(playerAnswer === null || playerAnswer === "")return;
    else{
        alert("Sorry, not correct!")
    }
}



function winGame(){
    let h3Tiles=document.querySelectorAll(".tileh3")

    for(let i = 0;i<h3Tiles.length;i++){
        setTimeout(()=>{
            h3Tiles[i].parentElement.className += " light-tile"
            h3Tiles[i].style.display = 'block'
            letterMatch.play()

            if( i === h3Tiles.length-1){
                
                // restartGame()
                showMaggie()
            }
        },i*250)
    }

    //do a score system based on # of unturned tiles

    score+=150;

    scoreDOM.innerHTML = score;

}

function showMaggie(){
    wheel.style.display = 'block'
    wheel.classList.add('spin-wheel')

    setTimeout(()=>{
        restartGame()
        wheel.classList.remove("spin-wheel")
        wheel.style.display = 'none'

    },2500)
}


function restartGame(){
    console.log("game restarted!")
    points=0;
    pointsDOM=0;
    letters = [..."bbccdgghjjkkllmmnnppqrrssttvwwxyyz".split(""),'bonus','double','pay_a_penalty','maggies surprise']

    globalPhrase = choosePhrase(globalPhrases).phrase
    renderPhrase(globalPhrase)
    
}


function spliceLetter(letter){
    console.log(letters)
    let idx = letters.indexOf(letter);
    console.log("idx: " + idx)
     return letters.splice(idx,1)[0]
}


function specialRound(special){
    
    switch(special){

        case "bonus":
            applyBonus = true;
            captionsDOM.innerHTML = "Nice! Plus 3 points for each match on your next spin! 🙂"
            clearCaptions()

            break;

        case "double":
            applyDouble = true
            captionsDOM.innerHTML = "Wow! Double points for each match on your next spin! 🤞🙈😏"
            clearCaptions()

             break;


       
        case "pay_a_penalty":
            points-=5;
            pointsDOM.innerHTML = points;
            captionsDOM.innerHTML = "Ouch thats gonna cost ya 5! 🤪"
            clearCaptions()

            break;


            
        case "maggies surprise":
            let result=""
            Math.random() < .3 ? ()=>{score-=5; scoreDOM.innerHTML=score} 
                               : Math.random() < .7 
                               ? ()=>{applyBonus = true; result = 'bonus'}
                               : ()=>{applyDouble = true; result = 'double'}
        readMaggieResult(result)
        clearCaptions()
   
        break;
    }


}




function clearCaptions(){
    setTimeout(()=>{
        captionsDOM.innerHTML = ""
    },2000)
}


function readMaggieResult(str){
    if(str === "bonus"){
        captionsDOM.innerHTML = "Maggie awarded you a bonus if your next spin has a match(s) (+3 for each! 😄 )"
    }
    else if(str === "double"){
        captionsDOM.innerHTML = "Maggie awarded you a bonus if your next spin has a match(s) (+3 for each! 😎 )"
        }
    else {
        captionsDOM.innerHTML="Ahhh, she penalized you, 5 poitns! 😄🤣"
        points -= 5
        pointsDOM.innerHTML = points;
    }

}






