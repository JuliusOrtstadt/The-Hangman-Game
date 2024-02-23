<h1 align="center">The Hangman Game</h1>
<h3 align="center">By Julius Ortstadt</h3>


### Introduction
This game was created during my second year of my Master Studies at Polytech Nice-Sophia.

The idea is pretty simple: make a hangman game using HTML, CSS and Javascript. 

See below for the rules, information and how to set everything up.

### The rules
The Hangman game rules are pretty simple:
1. The player needs to guess the word shown in underscore "**_**". Each underscore represents one letter.
2. If the player finds the word before the Hangman is completed, the player wins. Otherwise, the game is lost.
3. In this particular game the player can choose between 3 difficulty modes:
   - **Easy** which features word with 4-5 letters.
   - **Medium** which features word with 6-8 letters.
   - **Hard** which features word with 8-12 letters.

### How to start
The code has been written and tested for Google Chrome. 
It may not work as intended if other browsers are used.

Furthermore, all instructions below are for Google Chrome and Windows. 
The code works on Apple too, however the command navigation and installation of Node.js may not be the same.

**1/ The book**\
The words used in the game are from the book: Les Misérables by Victor Hugo. You can find it saved in this project as: "Les_miserables.txt".
It is important to note that the words used are those without any special characters, accents, numbers, dashes, underscores etc...
The used alphabet is the latin alphabet.
The words in this book are in French.

If you want to change the book, get a version of the book like the one provided in the code, meaning, it has to be in a .txt format. 
Then do the following steps:
1. Save the file in the current folder (where you can also find the example book).
2. Go to the file called "api.js" and at line 12 change the following code by replacing the path of the old book with the new one:
```JavaScript
//--- Read text file and check error and data in callback ---//
fsModule.readFile('Les_miserables.txt', 'utf-8', (err, data) => { 
```
3. Save and if the new book is compatible with the code, everything should work fine.

**2/ Start the server**\
If you want to play the Hangman game you will need to start a local server.
1. First download and install Node.js from the official website if it's not already installed: https://nodejs.org/en
2. When that is done, download the files in this repo to the computer so that all the code and additional resources are saved localy on the PC.
3. Open a command terminal and navigate to the folder where the code is saved (or click the path in the Explorer and type "cmd").
4. Type **"Node index.js"** and hit enter. 

If everything has been done correctly, nothing should appear and the terminal should wait.

**3/ Start the game**\
Now that the server is started, we need to start the actual game. 
Follow the steps below:
1. Open Google Chrome.
2. In the URL line enter: **http://localhost:8000/**. This should bring up the main game window.

Now the game can start.

**4/ Play a game**\
Since everything is up and running, let's play a game of Hangman !

Here is a description of the different game states:
1. When the start screens pops-up, a difficulty level needs to be selected.\
![Start screen and difficulty](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/c1d46b53-43ad-48dd-a199-09237f53b124)
> **_NOTE:_** If no level is selected the default level is selected: **Medium**.

2. After choosing the difficulty level, the game will request a word from the server. Under normal circumstances this process is really fast. However, if it takes longer, a message will appear indicating was is currently happening.

3. Now the game is ready. We see the hangman to the left, the entry box and word are in the center and the letters on the right.
   - The different parts of the hangman are going to change color depending on the number of errors that are made.\
   ![Hangman colorized](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/ebab7d1e-3fd0-4ae1-9a34-16c30228c92b)
   - Letters can be entered in lower or uppercase. They need to be letters from the latin alphabet otherwise an error message will show up. To submit, either press **Enter** or press the **Submit** button.\
   ![Error no valid letter](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/a7145222-ed8f-491d-bcf7-32418e03ba63)
   - The player can't play the same letter more than once.\
   ![Already tried letter](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/3e302939-e5e8-484c-a4e1-401981bfec6a)
   - The submission box is limited to one character at a time, meaning it is impossible to enter more than one character into the box.
   - The letters on the right show which letter has already been tried. 
      - If the letter is **<span style="color: #c8ad7f"> white </span>** it hasn't been tried yet. 
      - If the letter is **<span style="color: #eb2d3a"> red </span>** it has been tried but was not in the word.
      - If the letter is **<span style="color: #90ee90"> green </span>** it has been tried and is in the word and is therefore displayed there where the word is.\
      ![Colorized letters](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/4c756b06-72bd-4ff3-a77f-4730dbb957a6)
4. Play by entering letters and trying to guess the word. The player has 10 tries to complete the Hangman. 
   - If the word isn't found before the end, the player loses and the word is revealed and the player and start a new game.\
   ![Lost game](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/4ee0a7b2-e93e-44bb-b8fd-85f275d52b30)

   - If the word is guessed before the end, the player wins and can start a new game.\
   ![Victory](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/90df5264-a609-42c5-99f4-b5edb97ae82e)

These are all the steps to play the game ! Enjoy :)


### Additional information 
**1/ Security**\
Different security measures are included in the code so that the player can not cheat.
1. If the player tries to access other parts of the site via the URL to which access is forbidden, a 403 Error message site will appear. This blocks any attempt at cheating.\
![403](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/16ff64f9-0e40-4321-a2fb-3dfebeea65b1)
2. All the logic is on the server side. This means that the front website, which the player can see, has no information about the played word besides the number of letters. This blocks any attempt by the player to try to look in the source code of the site by using the inspection tool.

**2/ Page not found**\
If the player enters a different URL at the start of the game, or during the game and the page can't be found, a 404 Error message will appear indicating that something went wrong.\
![404](https://github.com/JuliusOrtstadt/The-Hangman-Game/assets/120115242/c7f14980-883d-4f48-ace2-8dec9e801865)


### Conclusion
I really enjoyed making this project especially since I always loved playing this game with friends and family. 
Coding this allowed me to learn more about HTML / CSS / Javascript and use it to get a fun result.
I put a lot of time and effort into it. 
I hope that future players will enjoy playing this game as much as I do.


### Credits
I would like to thank my computer science teacher Monsieur Benjamin Vella for helping me with this project.

Fonts:
- 404 Error Font: https://www.fontspace.com/404error-font-f57113

- Dusty Ranch Font: https://www.fontspace.com/dusty-ranch-font-f59009



> **_NOTE:_** This game was not made for commercial use and was only created during a computer science project at Polytech Nice-Sophia.

 
