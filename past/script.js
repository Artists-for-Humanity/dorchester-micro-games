// const e = require("express")

let chosenCards = [];
let finishCards = [];

let currColor = "";
let firstColor = "";

let count = 0;
let first_instance = -1;

var canClick = true;

const winScreen = document.getElementById("winLocation");
const restartIcon = document.getElementById("restartIcon");

document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const colorExist = [
    "url(pastAssets/one.png)",
    "url(pastAssets/two.png)",
    "url(pastAssets/three.jpeg)",
    "url(pastAssets/four.png)",
    "url(pastAssets/five.png)",
    "url(pastAssets/six.webp)",
    "url(pastAssets/seven.png)",
    "url(pastAssets/eight.png)",
    "url(pastAssets/nine.jpeg)",
    // "url(pastAssets/tenA.png)",
    "url(pastAssets/tenB.jpeg)",
    // "url(pastAssets/eleven.jpeg)",
    // "url(pastAssets/twelve.jpeg)",
  ];
  let colorPresent = [...colorExist, ...colorExist];

  function randomizer(originalArray) {
    let array = [...originalArray];
    let shuffledArray = [];
    while (array.length > 0) {
      const randomNumber = [Math.floor(Math.random() * array.length)];
      shuffledArray.push(array[randomNumber]);
      array.splice(randomNumber, 1);
    }
    return shuffledArray;
  }

  function gameCreate() {
    // Create the game function
    let colors = randomizer(colorPresent);
    let colorCardStack = [];

    for (let i = 0; i < colors.length; i++) {
      const colorCard = document.createElement("div"); // Creates all the cards
      colorCard.classList.add("colorCard");
      colorCard.id = i; // ID of the color
      colorCard.style.backgroundImage = colors[i]; // Sets background color to color of the card

      chosenCards[i] = colors[i]; // Puts all colors (IN ORDER) into an array, thats UNAFFECTED by the for loop

      colorCard.style.zIndex = 0;
      colorCard.style.backgroundImage = "url(pastAssets/hide.png)"; // Sets background to black

      gameBoard.appendChild(colorCard);
      colorCardStack.push(colorCard);
    }
    console.log(chosenCards);
    console.log(colorCardStack);

    for (let i = 0; i < colorCardStack.length; i++) {
      colorCardStack[i].addEventListener("click", function () {
        if (canClick) {
          // Execute the click action only if a click is allowed
          changeColor(i);
          canClick = false; // Disable further clicks temporarily
          setTimeout(function () {
            canClick = true;
          }, 600);
        }
      });
    }

    function winCondition(index) {
      if (finishCards.length == 12) {
        colorCardStack[index].style.backgroundImage = chosenCards[index];
        winScreen.style.display = "flex";
        restartIcon.addEventListener("click", function () {
          location.reload();
        });
      }
    }

    function changeColor(index) {
      if (colorCardStack[first_instance] === colorCardStack[index]) {
        colorCardStack[first_instance].style.backgroundImage ===
          colorCardStack[index].style.backgroundImage;
      }

      if (count === 0) {
        // Count = 0, WHICH IS ---->
        colorCardStack[index].style.backgroundImage = chosenCards[index];
        colorCardStack[index].classList.add("flip");
        currColor = chosenCards[index]; // TELLS the computer what the next card should be
        first_instance = index; // Logs the index of the first card in the pair
        chosenCards[index] = colors[index];
        console.log(currColor);
      }
      if (count == 1) {
        // This checks if the card youre clicking on is the second card in the pair
        if (index != first_instance) {
          colorCardStack[index].style.backgroundImage = chosenCards[index];
          colorCardStack[index].classList.add("flip");
          firstColor = chosenCards[index]; // Another version of currColor except that it is for the second card being clicked
          console.log(firstColor);
        }
        setTimeout(() => {
          colorCardStack[first_instance].classList.remove("flip");
          colorCardStack[index].classList.remove("flip");
        }, 500); // Adjust the delay as needed
      }

      count++;

      // CHECK LOGIC
      if (count == 2 && currColor !== firstColor) {
        //If they do not match they wull go back to the color black

        chosenCards[first_instance] = currColor;
        // let first_instance_color  = colorCardStack[first_instance].style.backgroundImage;
        // chosenCards.push(first_instance_color, chosenCards[first_instance])

        // Set timeout for reveal, before going black

        // SET TIMEOUT FUNCION BEFORE RUNNING THIS

        setTimeout(function () {
          console.log(count);
          console.log(colorCardStack[first_instance]);
          console.log(chosenCards);
          colorCardStack[first_instance].style.backgroundImage =
            "url(pastAssets/hide.png)";
          colorCardStack[index].style.backgroundImage =
            "url(pastAssets/hide.png)";
        }, 500);
        count = 0;
      }
      if (count == 2 && currColor === firstColor) {
        //If they match then it resets the count and instance and should do win thing
        if (index != first_instance) {
          console.log("match");

          var indexElement = document.getElementById(index);
          if (indexElement) {
            indexElement.style.pointerEvents = "none";
          }

          var firstInstanceElement = document.getElementById(first_instance);
          if (firstInstanceElement) {
            firstInstanceElement.style.pointerEvents = "none";
          }

          finishCards.push(chosenCards[index]);
          console.log(finishCards);
          setTimeout(function () {
            winCondition(index);
          }, 500);
          currColor = "";
          firstColor = "";
          console.log(currColor);
          console.log(firstColor);
          first_instance = -1; // Basically tells the computer that youre on a new color
          count = 0;
        }
      }
    }
  }

  function game() {
    gameCreate();
  }
  game();
});
