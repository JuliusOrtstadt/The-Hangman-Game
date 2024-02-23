//--- Julius ORTSTADT G4 Peip2 ---//

//--- Game variables ---//
let playedWordLength = 0;
let showedWord = [];

//--- Button to start the game ---//
let playButton = document.getElementById("playButton");
playButton.addEventListener("click", gameStart);

//--- Button to play again ---//
let playAgainButton = document.getElementById("playAgain");
playAgainButton.addEventListener("click", reloadPage);

//--- Button to submit a letter ---//
let submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", submit);

//--- Area to display the word ---//
let word = document.getElementById("word");

//--- Area to display a message relative to the game ---//
let gameMsg = document.getElementById("gameMsg");

//--- Area to display a message relative to server ---//
let statusMsg = document.getElementById("statusMsg");

//--- Area to display the rules ---//
let rules = document.getElementById("rules");
        
//--- Area for letter input ---//
let input = document.querySelector("input");

//--- Pressed key ---//
input.addEventListener("keyup", pressedKey);

//--- Area for start elements ---//
let startElements = document.getElementById("startElements");

//--- Difficulty selection box ---//
let selectDiff = document.querySelector("select");

//--- Button sound effect ---//
playButton.addEventListener("click", buttonSound);
playAgainButton.addEventListener("click", buttonSound);
submitButton.addEventListener("click", buttonSound);

//--- Function called when the game starts ---//
async function gameStart(){
    const idList = ["hangman","letters","guess"];

    //--- Hide all elements after restart ---//
    for (let id of idList){
        let elem = document.getElementById(id);
        elem.classList.add("notDisplayed");
    }

    startElements.classList.remove("notDisplayed");
    playButton.classList.add("notDisplayed");
    selectDiff.classList.add("notDisplayed");
    rules.classList.add("notDisplayed");
    
    //--- Get word from server (word chosen according to difficulty level ---//
    let level = selectDiff.value;
        
    statusMsg.classList.remove("notDisplayed");
    statusMsg.innerText = "Please wait. Getting word from server...";
    playedWordLength = await serverCall(level); 

    startElements.classList.add("notDisplayed");
    
    //--- Displays and hides elements ---//
    for (let id of idList){
        let elem = document.getElementById(id);
        elem.classList.remove("notDisplayed");
    }

    submitButton.classList.remove("notDisplayed");
    input.classList.remove("notDisplayed");

    //--- Hides button and message ---//
    playAgainButton.classList.add("notDisplayed");
    gameMsg.classList.add("notDisplayed");

    //--- Non colored letters ---//
    const idListLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];    
    for (let idLetter of idListLetters){
        let letter = document.getElementById(idLetter);
        letter.style.color = 'white';
    }
    
    //--- Re-initialized hangman ---//
    const hangman = document.querySelectorAll("svg > *");
    for (let elem of hangman){
        elem.style.stroke = 'white'; 
        elem.style.fill = 'white';
        elem.style.opacity = '0.5';
    }

    //--- Creates an array with underscores equal to the length of the word ---//
    for (let i = 0; i < playedWordLength; i++){
        showedWord.push("_");
    }

    //--- Display hidden word ---//
    word.innerText = showedWord.join(' ');

    //--- Sets focus on the input box ---//
    input.focus();

}

//--- Function called when the player submits a letter ---//
async function submit(){
    gameMsg.classList.add("notDisplayed");
    let inputLetter = input.value.toUpperCase();
    let letter = document.getElementById(inputLetter);
    let unicodeVal = inputLetter.charCodeAt();

    //--- More than one character in input box ---//
    if (inputLetter.length > 1){
        return;
    }
    
    //--- Unicode of uppercase letters is between 65 and 90---//
    if (unicodeVal >= 65 && unicodeVal <= 90){
        //--- Send letter to server to check if letter is in the word and if so, at which position(s) ---//
        let gameStatObj = await letterCheck(inputLetter);
        let letterIndexTab = gameStatObj.letterIndex;

        //--- The letter has been tried ---//
        if (letter.style.color != 'white'){
            gameMsg.classList.remove("notDisplayed");
            gameMsg.innerText = "You already tried this letter";
        }

        //--- The letter is in the word somewhere ---//
        else if (letterIndexTab.length != 0){
            //--- Replace "_" with letter according to index given by letterIndexTab ---//
            for (let index of letterIndexTab){
                showedWord[index] = inputLetter;
            }
            
            word.innerText = showedWord.join(' ');
            letter.style.color = '#9ACD32';

            //--- Player guesses the word (Hide unecessary elements / reset variables / display elements to continue) ---//
            if (gameStatObj.victory){
                input.classList.add("notDisplayed");
                submitButton.classList.add("notDisplayed");
                playAgainButton.classList.remove("notDisplayed");
                selectDiff.classList.remove("notDisplayed");
                gameMsg.classList.remove("notDisplayed");
                gameMsg.innerText = "Wow, you won !\nPlay again !";
                playedWordLength = 0;
                showedWord = [];
            }
        }


        
        //--- The letter is NOT in the word ---//
        else if (letterIndexTab.length == 0){
            //--- Color for the chosen letter is set ---//
            letter.style.color = '#FF5349';
            
            //--- Construction of the hangman ---//
            const children = document.querySelector("svg").children;
            const element = children.item(gameStatObj.errors-1);
            element.style.stroke = '#B0744A';
            element.style.fill = '#B0744A';
            element.style.opacity = '1';
        
            if (gameStatObj.errors >= 11){
                input.classList.add("notDisplayed");
                submitButton.classList.add("notDisplayed");
                playAgainButton.classList.remove("notDisplayed");
                selectDiff.classList.remove("notDisplayed");
                gameMsg.classList.remove("notDisplayed");
                gameMsg.innerText = "You lost !\nTry again !\nWord: " + gameStatObj.word;
                playedWordLength = 0;
                showedWord = [];
            }
        }   
    }

    else{
        gameMsg.classList.remove("notDisplayed");
        gameMsg.innerText = "Please enter a valid letter";
    }

    //--- Puts focus on the input box ---//
    input.focus();


    //--- Remove content from the input box---//
    input.value = "";

}

//--- Function that checks if the "enter" key has been pressed (keyCode: 13) ---//
function pressedKey(event){
    if (event.keyCode == 13){
        buttonSound();
        submit();
    }
}

//--- Function for the button sound effect ---//
function buttonSound(){
    let buttonSd = new Audio('./ButtonSound.wav');
    buttonSd.volume = 0.2;
    buttonSd.play();
}

//--- Function to reload the page ---//
function reloadPage(){
    window.location.reload();
}

//--- Function called to get the word from the server ---//
function serverCall(level){
    let request = fetch('http://localhost:8000/api/newGame?level=' + level);
    return request.then(async function(response){
        if (!response.ok){
            let errorMsg = response.status;
            statusMsg.innerText = "Request failed! Error: " + errorMsg.toString() + "\nTrying again."; 
            return serverCall();
        }
        else{
            let wordLength = await response.text();
            return wordLength;
        }
    }); 
}


//--- Check entered letter by sending it to the server ---//
function letterCheck(letter){
    let request = fetch('http://localhost:8000/api/testLetter?letter=' + letter);
    return request.then(async function(response){
        if (!response.ok){
            let errorMsg = response.status;
            statusMsg.innerText = "Request failed! Error: " + errorMsg.toString() + "\nTrying again."; 
            return letterCheck(letter);
        }
        else{
            let res = await response.text();
            let obj = JSON.parse(res);
            return obj;
        }
    });
}