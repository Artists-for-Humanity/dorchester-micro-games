// const e = require("express")

let chosenCards = []
let finishCards = []

let currColor = ''
let firstColor = ''

let count = 0
let first_instance = -1 

var canClick = true;

const winScreen = document.getElementById('winLocation')
const restartIcon = document.getElementById('restartIcon')

document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const colorExist = [
        // "url(FILE_PATH)"
        "red", 
        "orange", 
        "yellow", 
        "green", 
        "blue", 
        "indigo", 
        "violet", 
        "white", 
        "maroon", 
        "purple", 
        "pink", 
        "brown", ]
    let colorPresent = [ ...colorExist, ...colorExist]

    function randomizer(originalArray){
        let array = [...originalArray];
        let shuffledArray = [];
        while (array.length > 0){
            const randomNumber = [Math.floor(Math.random() * array.length)];
            shuffledArray.push(array[randomNumber]);
            array.splice(randomNumber , 1);
        }
        return shuffledArray;
    }
    
    function gameCreate(){     // Create the game function 
        let colors = randomizer(colorPresent)   
        let colorCardStack = []

        for(let i=0; i < colors.length; i++){
            const colorCard = document.createElement('div')     // Creates all the cards
            colorCard.classList.add('colorCard');
            colorCard.id = i    // ID of the color 
            colorCard.style.backgroundColor = colors [i] // Sets background color to color of the card

            chosenCards[i] = colors[i] // Puts all colors (IN ORDER) into an array, thats UNAFFECTED by the for loop

            colorCard.style.zIndex = 0;
            colorCard.style.backgroundColor = "#808080" // Sets background to black 
                     
            gameBoard.appendChild(colorCard)
            colorCardStack.push(colorCard);
        }
        console.log(chosenCards)
        console.log(colorCardStack)

        for (let i = 0; i < colorCardStack.length; i++) {
            colorCardStack[i].addEventListener("click", function() {
                if (canClick) {
                    // Execute the click action only if a click is allowed
                    changeColor(i);
                    canClick = false; // Disable further clicks temporarily
                    setTimeout(function() {
                        canClick = true;
                    }, 600);
                }
            });
        }
        
        function winCondition(index){
            if(finishCards.length == 2 ){
                colorCardStack[index].style.backgroundColor = chosenCards[index]
                winScreen.style.display = 'flex';
                restartIcon.addEventListener("click", function(){
                    location.reload();
                })
            }
        }
        

        function changeColor(index) {
            if(colorCardStack[first_instance] === colorCardStack[index]){
                colorCardStack[first_instance].style.backgroundColor === colorCardStack[index].style.backgroundColor
            }

            if(count == 0){ // Count = 0, WHICH IS ----> 
                colorCardStack[index].style.backgroundColor = chosenCards[index]
                colorCardStack[index].classList.add('flip');
                currColor = chosenCards[index] // TELLS the computer what the next card should be 
                first_instance = index; // Logs the index of the first card in the pair
                chosenCards[index] = "#808080"
                console.log(currColor)
            }
            if(count == 1){ // This checks if the card youre clicking on is the second card in the pair
                if(index != first_instance){
                    colorCardStack[index].style.backgroundColor = chosenCards[index]
                    colorCardStack[index].classList.add('flip');
                    firstColor = chosenCards[index] // Another version of currColor except that it is for the second card being clicked
                    console.log(firstColor)
                }
                setTimeout(() => {
                    colorCardStack[first_instance].classList.remove('flip');
                    colorCardStack[index].classList.remove('flip');
                }, 500); // Adjust the delay as needed
                
            }

            count++

            // CHECK LOGIC
            if(count == 2 && currColor !== firstColor ){ //If they do not match they wull go back to the color black

                chosenCards[first_instance] = currColor
                // let first_instance_color  = colorCardStack[first_instance].style.backgroundColor;
                // chosenCards.push(first_instance_color, chosenCards[first_instance])

                // Set timeout for reveal, before going black

                // SET TIMEOUT FUNCION BEFORE RUNNING THIS    

                setTimeout(function(){ 
                    console.log(count)
                    console.log(colorCardStack[first_instance])
                    console.log(chosenCards)
                    colorCardStack[first_instance].style.backgroundColor = "#808080"  
                    colorCardStack[index].style.backgroundColor = "#808080"
                    
                 }, 500);
                count = 0
            }
            if(count == 2 && currColor === firstColor){ //If they match then it resets the count and instance and should do win thing
                if(index != first_instance){
                    console.log("match")
                    finishCards.push(chosenCards[index])
                    console.log(finishCards)
                    setTimeout(function(){ 
                        winCondition(index)
                     }, 500);
                     currColor = ''
                     firstColor = ''
                     console.log(currColor)
                     console.log(firstColor)
                    first_instance = -1; // Basically tells the computer that youre on a new color
                    count = 0
                }
                
                
            }
        }


    }   

    function game(){
        gameCreate()
    }
    game()
    });

    // BUGS TO FIX //
    // 1. Clicking the SAME card and it still resets count // HARDEST BUG
    // window.location.reload()