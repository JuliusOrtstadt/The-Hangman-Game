//--- Julius ORTSTADT G4 Peip2 ---//

//--- Empty list for the words ---//
let words = [[]];

//--- Modules for fs and url ---//
const fsModule = require('fs');
const urlModule = require('url');


//--- Read text file and check error and data in callback ---//
fsModule.readFile('Les_miserables.txt', 'utf-8', (err, data) => {
    //--- Return error if unable to read file ---//
    if (err){
        console.error(err);
        return;
    }

    //--- Temporary list for unchecked words ---//
    let tempWords = data.split(/[(\r?\n),. ]/);

    //--- List containing lists where the n-th list contains words with length n / also checks if word is lowercase ---//
    for (elem of tempWords){
        //--- If there is no list for words with length n, add it ---//
        if (!Array.isArray(words[elem.length])){
            words[elem.length] = [];
        }
        
        let counter = 0;
        for (let i = 0; i < elem.length; i++){
            if ((elem.charCodeAt(i) >= 97) && (elem.charCodeAt(i) <= 122)){
                counter++;
            }
        }

        //--- If word is ok: push to word list ---//
        if (counter == elem.length){
            words[elem.length].push(elem);
        } 
    }
});


//--- Init of game variables ---//
let playedWord = "";                // Contains the word that is searched
let errors;                         // Number of errors the player has alreay made
let victory;                        // Indicates if game has been won or lost
let gameStats = {};                 // Dictionary containing the current game statistics
let guessedLetters;                 // List of all the guessed letters in this round
let showedWord;                     // List that will contain the "_" representing the hidden word


async function manageRequest(request, response) {
    //--- Get pathname of the url, then split at "?", then take 1st element using "shift" -> returns string ---//
    //--- Then using the returned string, split again at "/" -> returns array. Then return last element of array using "pop" ---//
    let star = urlModule.parse(request.url).pathname.split("?").shift().split("/").pop();

    
    //--- If getWord is star, return random word ---//
    if (star == "getWord"){
        let responseSent = false; // To know if we already sent a response or not

        //--- Get the word min and max length from the URL ---//
        let fullURL = new URL("https://localhost:8000" + request.url);
        let minLetters = parseInt(fullURL.searchParams.get('minLetters'));
        let maxLetters = parseInt(fullURL.searchParams.get('maxLetters'));

        //--- Check if minLetters and maxLetters verify all parameters ---//
        if (minLetters <= 0 || maxLetters <= 0){
            response.end(`Please enter positive values for minLetters and maxLetters`);
            responseSent = true;
        }

        else if (minLetters > maxLetters){
            response.end(`minLetters can't be greater than maxLetters`);
            responseSent = true;
        }

        else if (maxLetters == null || minLetters == null){
            response.end(`Please enter values for minLetters and maxLetters`);
            responseSent = true;
        }

        //--- If the response hasn't been sent yet ---//
        if (!responseSent){
            let possibleWords = [];     // List that will contain all possible words within the specified word length
        
            //--- Push all the words from the main list that are between minLetter and maxLetter in length ---//
            while (minLetters <= maxLetters){
                for (elem of words[minLetters]){
                    possibleWords.push(elem);
                }
                minLetters++;
            }

            //--- Choose random word from possible words ---//
            playedWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
            response.end(playedWord);
            responseSent = true;
        }
        
    }

    //--- If newGame is star ---//
    else if (star == "newGame"){
        let responseSent = false; // To know if we already sent a response or not

        //--- Init for min and max word length ---//
        let minArg = 0;
        let maxArg = 0;

        //--- Get the level ---//
        let fullURL = new URL("https://localhost:8000" + request.url);
        let level = fullURL.searchParams.get('level');

        //--- Specify min and max word length according to level ---//
        if (level == 'easy'){
            minArg = 4;
            maxArg = 5;
        }
        else if (level == 'medium'){
            minArg = 6;
            maxArg = 8;
        }
        else if (level == 'hard'){
            minArg = 8;
            maxArg = 12;
        }
        else {
            response.end(`Please enter values for minLetters and maxLetters`);
            responseSent = true;
        }

        //--- Get a random word ---//
        playedWord = await getWord(minArg, maxArg);

        //--- Init game variables ---//
        errors = 0;                     
        victory = false;
        guessedLetters = [];
        showedWord = [];

        //--- Generate array of "_" identical in length to the length of the word ---//
        for (let i = 0; i < playedWord.length; i++){
            showedWord.push('_');
        }

        response.end(`${playedWord.length}`);
        responseSent = true;
    }

    //--- If testLetter is star ---//
    else if (star = "testLetter"){
        let wordLetterIndex = []; // Contains the indexes of the letter that the player guessed

        playedWord = playedWord.toLowerCase();  // Make the word lowerCase (just in case)


        //--- Get the letter from the argument in the URL ---//
        let fullURL = new URL("https://localhost:8000" + request.url);
        let letter = fullURL.searchParams.get('letter').toLowerCase();
        
        //--- Player guessed a letter that is in the word ---//
        if (playedWord.includes(letter) && (!guessedLetters.includes(letter))){
            for (let i = 0; i < playedWord.length; i++){
                if (playedWord[i] == letter){
                    wordLetterIndex.push(i);
                    showedWord.pop(); // Player found a letter so the guessing "spaces" are deleted 
                }
            }

            //--- Player guessed all the letters in the word ---//
            if (showedWord.length == 0){
                gameStats['word'] = playedWord;
                victory = true;
            }

            gameStats['word'] = showedWord.join(' ');
        
        }

        //--- Player guesses letter that is not in the word ---//
        else{
            //--- If the player didn't already try this letter ---//
            if (!guessedLetters.includes(letter)){
                errors++;

                //--- Player has lost the game ---//
                if (errors >= 11){
                    gameStats['word'] = playedWord;
                    victory = false;
                }
            }
        }
        
        //--- List containing all guessed letters ---//
        guessedLetters.push(letter);

        //--- Game stats ---//
        gameStats['letterIndex'] = wordLetterIndex;
        gameStats['victory'] = victory;
        gameStats['errors'] = errors;

        response.end(JSON.stringify(gameStats));
    }

    //--- Error if getWord is not star ---//
    else{
        response.statusCode = 404;
        response.end(`Please enter valid command`);
    }
}


//--- Function to get the word according to difficulty level and min and max values given to the function ---//
async function getWord(min, max){
    let request = fetch('http://localhost:8000/api/getWord?minLetters=' + min + '&maxLetters=' + max); 
        return request.then(async function(response){
            if (!response.ok){
                let errorMsg = response.status;
                statusMsg.innerText = "Request failed! Error: " + errorMsg.toString() + "\nTrying again."; 
                return getWord();
            }
            else{
                let word = await response.text();
                return word;
            }
        });
}


exports.manage = manageRequest; 



