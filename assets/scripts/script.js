// Variable declarations
// Array of playing card codes from https://www.deckofcardsapi.com/ (with associated values)
let cardsObject = {
  cardAC: 1,
  card2C: 2,
  card3C: 3,
  card4C: 4,
  card5C: 5,
  card6C: 6,
  card7C: 7,
  card8C: 8,
  card9C: 9,
  card0C: 10,
  cardJC: 11,
  cardQC: 12,
  cardKC: 13,
  cardAD: 1,
  card2D: 2,
  card3D: 3,
  card4D: 4,
  card5D: 5,
  card6D: 6,
  card7D: 7,
  card8D: 8,
  card9D: 9,
  card0D: 10,
  cardJD: 11,
  cardQD: 12,
  cardKD: 13,
  cardAH: 1,
  card2H: 2,
  card3H: 3,
  card4H: 4,
  card5H: 5,
  card6H: 6,
  card7H: 7,
  card8H: 8,
  card9H: 9,
  card0H: 10,
  cardJH: 11,
  cardQH: 12,
  cardKH: 13,
  cardAS: 1,
  card2S: 2,
  card3S: 3,
  card4S: 4,
  card5S: 5,
  card6S: 6,
  card7S: 7,
  card8S: 8,
  card9S: 9,
  card0S: 10,
  cardJS: 11,
  cardQS: 12,
  cardKS: 13,
};
// DOM references for card DIVs
const cards = [
  document.getElementById("player-card"),
  document.getElementById("card-1"),
  document.getElementById("card-2"),
  document.getElementById("card-3"),
  document.getElementById("card-4"),
];
// Bootstrap modal template
const modalTemplate = `
<div class="modal fade" id="bootstrap-modal" tabindex="-1" role="dialog" aria-labelledby="BootstrapModalDialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modal-title"></h5>   
      </div>
      <div class="modal-body" id="modal-text"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="modal-btn-2"></button>
        <button type="button" class="btn btn-primary" id="modal-btn-1"></button>
      </div>
    </div>
  </div>
</div>`;
let bsModal = document.getElementById("bootstrap-modal"); // DOM reference to bootstrap-modal DIV
let cardArea = document.getElementById("cards"); // DOM reference for card area
let deckUrl = ""; // Current API deck_id used to complete the drawCards function fetch URL
let dealtCards = ""; // The five cards used for a round of the game
let cardsDrawn = false; // Tracking if cards have already been drawn to prevent multiple draws
let currentCard = 0; // Index of the current card to access the dealtCards array
let playerPoints = 100; // The player's initial points balance
let playerWager = 0; // The player's wager
let cardChoice = ""; // The player's high or low choice
let correctGuesses = 0; // The player's correct guesses
const changeMsg = document.getElementById("game-messages"); // DOM reference to game-messages DIV
let currAces = decideAces(); // The value of an Ace for the round

// Decide whether Aces are high or low and send value to amendCardArray
function decideAces() {
  let acesBool = Math.random() < 0.5;
  let acesResult = acesBool ? "HIGH" : "LOW";
  amendCardsObject(acesResult); // Pass result to amendCardArray
  return acesResult;
}

// Update all Aces in the card array to match the current round's Ace value
function amendCardsObject(acesValue) {
  if (acesValue === "HIGH") {
    cardsObject["cardAC"] = 14;
    cardsObject["cardAD"] = 14;
    cardsObject["cardAH"] = 14;
    cardsObject["cardAS"] = 14;
  } else {
    cardsObject["cardAC"] = 1;
    cardsObject["cardAD"] = 1;
    cardsObject["cardAH"] = 1;
    cardsObject["cardAS"] = 1;
  }
}

// Create Bootstrap modal

function createModal() {
  document.body.insertAdjacentHTML("beforeend", modalTemplate);
  modal = document.getElementById("bootstrap-modal"); // Re-select the modal after insertion
}

// Display Bootstrap modal

function displayModal() {
  if (modal) {
    modal.style.display = "block";
    modal.classList.add("show");
  } else {
    console.error("Modal element not found");
  }
}

// Hide Bootstrap modal

function hideModal() {
  if (modal) {
    modal.style.display = "none";
    modal.classList.add("hide");
  } else {
    console.error("Modal element not found");
  }
}

// Shuffle the deck of cards (via API call to https://www.deckofcardsapi.com)
async function shuffleCards() {
  const shuffleReply = await fetch(
    "https://www.deckofcardsapi.com/api/deck/new/shuffle/"
  );
  const cardDeck = await shuffleReply.json();
  if (shuffleReply.ok) {
    console.log(cardDeck); // Console log the shuffled deck
    deckUrl = cardDeck.deck_id; // Save the deck_id for use in completing the fetch URL
    console.log("drawCards() called from shuffleCards()");
    drawCards();
  } else {
    console.error("Error:", shuffleReply.statusText);
  }
}

// Display initial card view
function initialView() {
  cards[0].innerHTML = `<img id="player-card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The player's first card">`;
  cards[1].innerHTML = `<img id="card-1" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
  cards[2].innerHTML = `<img id="card-2" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
  cards[3].innerHTML = `<img id="card-3" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
  cards[4].innerHTML = `<img id="card-4" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
}

// Draw cards from the shuffled deck and display the player's card (via API call to https://www.deckofcardsapi.com)
async function drawCards() {
  const drawReply = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckUrl}/draw/?count=5` // URL dynamically updated based on previously shuffled deck_id value
  );
  if (cardsDrawn) {
    return;
  } // Additional check to ensure that the drawCards function is not called multiple times
  cardsDrawn = true; // Set cardsDrawn to true when deck drawn
  dealtCards = await drawReply.json();
  if (drawReply.ok) {
    console.log(dealtCards); // Console log the drawn cards
    initialView();
    cards[0].innerHTML = `<img id="player-card" src="${dealtCards.cards[0].images.png}" alt="The player's card">`; // Display the player's card
    currentCard = 0; // Reset currentCard count before new round
    correctGuesses = 0; // Reset correctGuesses count before new round
    playerWager = 0; // Reset playerWager amount before new round
    currentCard++; // Increment currentCard to specify the index of the next card in dealtCards
    getWager();
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

// Display wager information
function wagerInfo() {
  changeMsg.innerHTML = `
  <div>
  <p>You currently have ${playerPoints} points</p>
  <p>What is your wager this round? (min = 1 point, max = total points)</p>
  <div id="wager"></div>
  <button type="button" id="wager-one">+1</button>
  <button type="button" id="wager-five">+5</button>
  <button type="button" id="wager-ten">+10</button>
  <button type="button" id="wager-fifty">+50</button>
  <button type="button" id="wager-hundred">+100</button>
  <div><button type="submit" id="wager-submit">Submit</button>
  <button type="reset" id="wager-reset">Reset</button></div>
  </div>
  `;
}

// Get player's current wager
function getWager() {
  wagerInfo(); // Display wager instructions and wager buttons
  // DOM reference to wager DIV
  const totalWager = document.getElementById("wager");
  // Increase playerWager by 1 when clicked
  const WagerOne = document.getElementById("wager-one");
  WagerOne.addEventListener("click", function () {
    setPlayerWager(1);
  });
  // Increase playerWager by 5 when clicked
  const WagerFive = document.getElementById("wager-five");
  WagerFive.addEventListener("click", function () {
    setPlayerWager(5);
  });
  // Increase playerWager by 10 when clicked
  const WagerTen = document.getElementById("wager-ten");
  WagerTen.addEventListener("click", function () {
    setPlayerWager(10);
  });
  // Increase playerWager by 50 when clicked
  const WagerFifty = document.getElementById("wager-fifty");
  WagerFifty.addEventListener("click", function () {
    setPlayerWager(50);
  });
  // Increase playerWager by 100 when clicked
  const WagerHundred = document.getElementById("wager-hundred");
  WagerHundred.addEventListener("click", function () {
    setPlayerWager(100);
  });
  // Calculate wager ensuring it is not zero or exceeds available points
  function setPlayerWager(num) {
    if (playerWager + num > playerPoints) {
      totalWager.innerHTML = `<p>Your wager cannot exceed your total points. Please try again.</p>`;
      playerWager = 0;
      setTimeout(() => {
        totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
      }, 1500);
    } else {
      playerWager += num;
      totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
    }
  }
  // Reset wager to zero when clicked
  totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
  const wagerReset = document.getElementById("wager-reset");
  wagerReset.addEventListener("click", function () {
    playerWager = 0;
    totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
  });
  // Submit wager as long as it is not zero or exceeds available points, then move to next stage
  const wagerSubmit = document.getElementById("wager-submit");
  wagerSubmit.addEventListener("click", function () {
    if (playerWager === 0 || playerWager > playerPoints) {
      totalWager.innerHTML = `<p>Your wager is not valid - please try again.</p>`;
      setTimeout(() => {
        totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
      }, 1500);
    } else {
      playerChoice();
    }
  });
}

// Display card guess information
function guessInfo() {
  changeMsg.innerHTML = `
  <div>
  <p>You currently have ${playerPoints} points</p>
  <p>Your wager for this round is ${playerWager}</p>
  <p>For this round, Aces are ${currAces}</p>
  <p>Is the next card HIGHER or LOWER than your card?</p>
  <button type="button" id="higher">Higher</button>
  <button type="button" id="lower">Lower</button>
  </div>
  `;
}

// Get higher or lower choice from the player
function playerChoice() {
  guessInfo();
  const highBtn = document.getElementById("higher"); // DOM reference to Higher button
  const lowBtn = document.getElementById("lower"); // DOM reference to Lower button
  highBtn.addEventListener("click", function () {
    cardChoice = "Higher";
    flipCard(currentCard);
  }); // Set card choice to Higher and move to next stage
  lowBtn.addEventListener("click", function () {
    cardChoice = "Lower";
    flipCard(currentCard);
  }); // Set card choice to Lower and move to next stage
}

// Sequentially reveal all cards in the dealtCards array
function flipCard(cardIndex) {
  cards[cardIndex].innerHTML = `
    <img id="card-${currentCard}" src="${dealtCards.cards[cardIndex].images.png}" alt="The next game card">
    `; // Flip the next card
  calculateOutcome(); // Calculate if the player was correct
  currentCard++;
  playerChoice(); // Choose whether the next card is higher or lower;
}

// Calculate whether player choices were correct or incorrect
function calculateOutcome() {
  let prevCard = cardsObject["card" + dealtCards.cards[currentCard - 1].code];
  let currCard = cardsObject["card" + dealtCards.cards[currentCard].code];
  if (currCard > prevCard && cardChoice === "Higher") {
    correctGuesses += 1;
    console.log("CONGRATULATIONS your card is higher in value");
    checkSuccess();
    return;
  } else if (currCard < prevCard && cardChoice === "Lower") {
    correctGuesses += 1;
    console.log("CONGRATULATIONS your card is lower in value");
    checkSuccess();
    return;
  } else if (currCard === prevCard) {
    console.log(
      "Sorry you got a match, and there's nothing for two - not in this game!"
    );
    checkSuccess();
  } else {
    console.log(
      "Sorry that was an incorrect choice. You have lost your wager!"
    );
    checkSuccess();
  }
}

// Check whether the player won or lost the round
function checkSuccess() {
  if (correctGuesses === 4) {
    playerPoints += playerWager;
    continueGame("win");
  } else if (correctGuesses < 4) {
    playerChoice();
  } else {
    playerPoints -= playerWager;
    continueGame("lose");
  }
}

// Event listener to handle continue click in continueGame function
function handleClick() {
  hideModal();
  console.log("drawCards() called from continueGame() - 'win'");
  cardsDrawn = false; // Set cardsDrawn to false to allow new deck to be drawn
  drawCards();
}

// Ask player if they wish to continue playing the game
function continueGame(status) {
  if (status === "win" && playerPoints > 0 && dealtCards.remaining >= 5) {
    createModal();
    const bsTitle = document.getElementById("modal-title");
    const bsText = document.getElementById("modal-text");
    const bsBtn1 = document.getElementById("modal-btn-1");
    const bsBtn2 = document.getElementById("modal-btn-2");
    bsTitle.innerText = "Continue Game?";
    bsText.innerText = "Do you wish to proceed to the next round?";
    bsBtn1.innerText = "Yes";
    bsBtn2.innerText = "No";
    bsBtn1.removeEventListener("click", handleClick); // Remove event listener from bsBtn1 button to prevent drawCards being called multiple times
    bsBtn1.addEventListener("click", handleClick);
    // Add removeEventListener if more than one function called by bsBtn2 below
    bsBtn2.addEventListener("click", function () {
      hideModal();
      // DISPLAY SCORE AND HIGH-SCORES
    });
    displayModal();
  } else if (
    status === "lose" &&
    playerPoints > 0 &&
    dealtCards.remaining >= 5
  ) {
    createModal();
    const bsTitle = document.getElementById("modal-title");
    const bsText = document.getElementById("modal-text");
    const bsBtn1 = document.getElementById("modal-btn-1");
    const bsBtn2 = document.getElementById("modal-btn-2");
    bsTitle.innerText = "Play Again?";
    bsText.innerText = "Do you wish to play again?";
    bsBtn1.innerText = "Yes";
    bsBtn2.innerText = "No";
    bsBtn1.addEventListener("click", function () {
      hideModal();
      console.log("drawCards() called from continueGame() - 'lose'");
      cardsDrawn = false;
      drawCards();
    });
    bsBtn2.addEventListener("click", function () {
      hideModal();
      // DISPLAY SCORE AND HIGH-SCORES
    });
    displayModal();
    // shuffleCards();
  } else {
    // DISPLAY SCORE AND HIGH-SCORES
  }
}

// Keep copyright year current, in the footer
let dateNow = new Date();
let yearNow = dateNow.getFullYear();
document.getElementById("copyright").innerHTML = ` ${yearNow} `;

shuffleCards();
