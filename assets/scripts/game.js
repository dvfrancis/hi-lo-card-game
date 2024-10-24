// Variable declarations
// Playing card codes from https://www.deckofcardsapi.com/, adding numeric values for use in the game
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
const cards = [
  document.getElementById("player-card"),
  document.getElementById("card-1"),
  document.getElementById("card-2"),
  document.getElementById("card-3"),
  document.getElementById("card-4"),
];
let modalTemplate = `
<div class="modal fade" id="bootstrap-modal" tabindex="-1" role="dialog" aria-labelledby="BootstrapModalDialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
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
let messageModal = document.getElementById("bootstrap-modal");
let cardArea = document.getElementById("cards");
let deckUrl = ""; // Current API deck_id used to complete the drawCards function fetch URL
let dealtCards = "";
let cardsDrawn = false;
let currentCard = 0;
let playerPoints = 100;
let highScore = 0;
let playerWager = 0;
let bsTitle = document.getElementById("modal-title");
let bsText = document.getElementById("modal-text");
let bsBtn1 = document.getElementById("modal-btn-1");
let bsBtn2 = document.getElementById("modal-btn-2");
let totalWager = document.getElementById("wager");
let hiLoChoice = "";
let correctGuesses = 0;
let gameEnded = false;
let gameStatus = "";
let linkElement = "";
const changeMsg = document.getElementById("game-messages");
let acesValue = decideAces();

/**
 * Decide whether Aces are high or low
 * and send value to amendCardArray
 */
function decideAces() {
  let acesBool = Math.random() < 0.5;
  let acesResult = acesBool ? "HIGH" : "LOW";
  amendCardsObject(acesResult);
  return acesResult;
}

/**
 * Update all Aces in the card array
 * to match the current round's Ace value
 */
function amendCardsObject(result) {
  if (result === "HIGH") {
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

/**
 * Create Bootstrap modal
 */
function createModal() {
  document.body.insertAdjacentHTML("beforeend", modalTemplate);
  messageModal = document.getElementById("bootstrap-modal");
}

/**
 * Display Bootstrap modal
 */
function displayModal() {
  if (messageModal) {
    messageModal.style.display = "block";
    messageModal.classList.add("show");
  } else {
    console.error("Modal element not found");
  }
}

/**
 * Delete Bootstrap modal
 */
function deleteModal() {
  if (messageModal) {
    messageModal.remove();
  } else {
    console.error("Modal element not found");
  }
}

/**
 * Shuffle the deck of cards
 *(via API call to https: //www.deckofcardsapi.com)
 */
async function shuffleCards() {
  try {
    const shuffleReply = await fetch(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/"
    );
    if (!shuffleReply.ok) {
      throw new Error(shuffleReply.statusText);
    }
    const cardDeck = await shuffleReply.json();
    console.log(cardDeck); // Remove before project submission
    playerPoints = 100;
    deckUrl = cardDeck.deck_id;
    drawCards();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

/**
 * Draw cards from the shuffled deck
 *  and display the player's card
 * (via API call to https: //www.deckofcardsapi.com)
 */
async function drawCards() {
  try {
    if (cardsDrawn) {
      return;
    } // Additional check to ensure that the drawCards function is not called multiple times
    cardsDrawn = true;
    const drawReply = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${deckUrl}/draw/?count=5`
    );
    if (!drawReply.ok) {
      throw new Error(drawReply.statusText);
    }
    dealtCards = await drawReply.json();
    console.log(dealtCards); // Remove before project submission
    initialView();
    cards[0].innerHTML = `<img id="player-card" src="${dealtCards.cards[0].images.png}" alt="The player's card">`;
    // Reset values before round
    currentCard = 0;
    correctGuesses = 0;
    playerWager = 0;
    currentCard++;
    getWager();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

/**
 * Display initial card view
 */
function initialView() {
  cards[0].innerHTML = `<img id="player-card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The player's first card">`;
  cards[1].innerHTML = `<img id="card-1" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
  cards[2].innerHTML = `<img id="card-2" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
  cards[3].innerHTML = `<img id="card-3" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
  cards[4].innerHTML = `<img id="card-4" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
}

/**
 * Get player's wager for the current round
 */
function getWager() {
  changeMsg.innerHTML = `<div>
    <p>You currently have ${playerPoints} points</p>
    <label for="wager-amount">What is your wager for this round?</label>
    <input type="number" id="wager-amount" min="1" max="${playerPoints}" required>
    <button id="wager-submit" aria-label="Submit Wager">Submit</button>
    <div id="wager"></div>
  </div>`;
  totalWager = document.getElementById("wager");
  totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
  const wagerSubmit = document.getElementById("wager-submit");
  wagerSubmit.addEventListener("click", function () {
    const wagerAmount = +document.getElementById("wager-amount").value;
    setPlayerWager(wagerAmount);
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

/**
 * Calculate wager ensuring it is
 * not zero or exceeds available points
 */
function setPlayerWager(num) {
  totalWager = document.getElementById("wager");
  if (num > playerPoints || num < 1) {
    totalWager.innerHTML = `<p>Your wager cannot be less than one or exceed your total points. Please try again.</p>`;
    document.getElementById("wager-amount").value = "";
    playerWager = 0;
    setTimeout(() => {
      totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
    }, 1500);
  } else {
    playerWager = num;
    totalWager.innerHTML = `<p>Wager is ${playerWager}</p>`;
  }
}

/**
 * Get higher or lower choice from the player
 */
function playerChoice() {
  guessInfo();
  const highBtn = document.getElementById("higher-button");
  const lowBtn = document.getElementById("lower-button");
  highBtn.addEventListener("click", function () {
    hiLoChoice = "Higher";
    flipCard(currentCard);
  });
  lowBtn.addEventListener("click", function () {
    hiLoChoice = "Lower";
    flipCard(currentCard);
  });
}

/**
 * Display card guess information
 */
function guessInfo() {
  changeMsg.innerHTML = `
  <div>
  <p>You currently have ${playerPoints} points</p>
  <p>Your wager for this round is ${playerWager}</p>
  <p>For this round, Aces are ${acesValue}</p>
  <p>Is the next card HIGHER or LOWER than your card?</p>
  <button type="button" id="higher-button">Higher</button>
  <button type="button" id="lower-button">Lower</button>
  </div>
  `;
}

/**
 * Sequentially reveal all cards
 * in the dealtCards array
 */
function flipCard(cardIndex) {
  cards[cardIndex].innerHTML = `
    <img id="card-${currentCard}" src="${dealtCards.cards[cardIndex].images.png}" alt="The next game card">
    `;
  calculateOutcome();
  currentCard++;
  playerChoice();
}

/**
 * Calculate whether player choices
 * were correct or incorrect
 */
function calculateOutcome() {
  let prevCard = cardsObject["card" + dealtCards.cards[currentCard - 1].code];
  let currCard = cardsObject["card" + dealtCards.cards[currentCard].code];
  if (currCard > prevCard && hiLoChoice === "Higher") {
    correctGuesses += 1;
    if (correctGuesses === 4) {
      playerPoints += playerWager;
      gameStatus = "win";
      continueGame(gameStatus);
    } else {
      playerChoice();
    }
  } else if (currCard < prevCard && hiLoChoice === "Lower") {
    correctGuesses += 1;
    if (correctGuesses === 4) {
      playerPoints += playerWager;
      gameStatus = "win";
      continueGame(gameStatus);
    } else {
      playerChoice();
    }
  } else if (currCard === prevCard) {
    gameStatus = "draw"
    continueGame(gameStatus);
  } else {
    playerPoints -= playerWager;
    gameStatus = "lose"
    continueGame(gameStatus);
  }
}

/**
 * Ask player if they wish to
 * continue playing the game
 */
function continueGame(status) {
  const modalStatus = ["win", "lose", "draw"];
  const modalTitles = ["YOU WON THE ROUND!", "YOU LOST THE ROUND!", "IT'S A DRAW!"];
  const modalBtns = ["Yes", "No"];
  if (modalStatus.includes(status)) {
    createModal();
    bsTitle = document.getElementById("modal-title");
    bsText = document.getElementById("modal-text");
    bsBtn1 = document.getElementById("modal-btn-1");
    bsBtn2 = document.getElementById("modal-btn-2");
    const statusIndex = modalStatus.indexOf(status);
    bsTitle.innerText = modalTitles[statusIndex];
    bsText.innerText = "Continue to the next round?";
    bsBtn1.innerText = modalBtns[0];
    bsBtn2.innerText = modalBtns[1];
    bsBtn1.addEventListener("click", newDeck);
    bsBtn2.addEventListener("click", gameOver);
    displayModal();
  }
}

/**
 * Start a new round
 */
function newDeck() {
  deleteModal();
  cardsDrawn = false; // Set cardsDrawn to false to allow new deck to be drawn
  if (gameEnded) {
    shuffleCards();
  } else if ((gameStatus === "win" || gameStatus === "lose" || gameStatus === "draw") && dealtCards.remaining > 7 && dealtCards.remaining <= 47 && playerPoints > 0) {
    drawCards();
  } else if ((gameStatus === "win" || gameStatus === "lose" || gameStatus === "draw") && dealtCards.remaining === 7 && playerPoints > 0) {
    finalRound();
  } else if ((gameStatus === "win" || gameStatus === "lose" || gameStatus === "draw") && dealtCards.remaining === 2 && playerPoints > 0) {
    gameOver();
  } else if (playerPoints <= 0) {
    noPoints();
  }
}

/**
 * Display final points at the end of the game
 */
function gameOver() {
  if (dealtCards.remaining < 3) {
    let storedScore = localStorage.getItem("high-score");
    highScore = storedScore ? +storedScore : 0;
    console.log("Current High Score:", highScore);
    if (playerPoints > highScore) {
      localStorage.setItem("high-score", playerPoints);
      highScore = playerPoints;
    }
    gameEnded = true;
    deleteModal();
    createModal();
    bsTitle = document.getElementById("modal-title");
    bsText = document.getElementById("modal-text");
    bsBtn1 = document.getElementById("modal-btn-1");
    bsBtn2 = document.getElementById("modal-btn-2");
    bsBtn1.innerText = "Yes";
    bsBtn2.innerText = "No";
    bsTitle.innerText = "CONGRATULATIONS - YOU FINISHED THE GAME!";
    bsText.innerHTML = `<p>Your score was ${playerPoints} points</p><p>Your highest score so far has been ${highScore} points</p><p>Play again?</p>`;
    bsBtn1.addEventListener("click", function () {
      deleteModal();
      shuffleCards();
    });
    bsBtn2.addEventListener("click", leaveGame);
    displayModal();
  } else {
    gameEnded = true;
    deleteModal();
    createModal();
    bsTitle = document.getElementById("modal-title");
    bsText = document.getElementById("modal-text");
    bsBtn1 = document.getElementById("modal-btn-1");
    bsBtn2 = document.getElementById("modal-btn-2");
    bsBtn1.innerText = "Yes";
    bsBtn2.innerText = "No";
    bsTitle.innerText = "GAME OVER";
    bsText.innerText = "You scored " + playerPoints + " points. Do you wish to play again?";
    bsBtn1.addEventListener("click", function () {
      deleteModal();
      shuffleCards();
    });
    bsBtn2.addEventListener("click", leaveGame);
    displayModal();
  }
}

/**
 * Final round notification
 */
function finalRound() {
  createModal();
  bsTitle = document.getElementById("modal-title");
  bsText = document.getElementById("modal-text");
  bsBtn1 = document.getElementById("modal-btn-1");
  bsBtn2 = document.getElementById("modal-btn-2");
  bsTitle.innerText = "LAST ROUND";
  bsText.innerText = "This is your final round of cards from this deck";
  bsBtn1.innerText = "OK";
  bsBtn2.innerText = "Exit";
  bsBtn1.addEventListener("click", function () {
    deleteModal();
    drawCards();
  });
  bsBtn2.addEventListener("click", leaveGame);
  displayModal();
}

/**
 * End the game if the player has no points
 */
function noPoints() {
  createModal();
  bsTitle = document.getElementById("modal-title");
  bsText = document.getElementById("modal-text");
  bsBtn1 = document.getElementById("modal-btn-1");
  bsBtn2 = document.getElementById("modal-btn-2");
  bsTitle.innerText = "YOU'RE BANKRUPT!";
  bsText.innerText = "You cannot play without any points. Start over?";
  bsBtn1.innerText = "Yes";
  bsBtn2.innerText = "No";
  bsBtn1.addEventListener("click", function () {
    deleteModal();
    shuffleCards();
  });
  bsBtn2.addEventListener("click", leaveGame);
  displayModal();
}

/**
 * Leave the game
 */
const linkIds = ["home-page-link", "faq-page-link"];
linkIds.forEach(id => {
  const linkElement = document.getElementById(id);
  if (linkElement) {
    linkElement.addEventListener("click", function (event) {
      event.preventDefault();
      createModal();
      bsTitle = document.getElementById("modal-title");
      bsText = document.getElementById("modal-text");
      bsBtn1 = document.getElementById("modal-btn-1");
      bsBtn2 = document.getElementById("modal-btn-2");
      bsTitle.innerText = "LEAVE THE GAME";
      bsText.innerText = "Are you sure you want to abandon the game?";
      bsBtn1.innerText = "Yes";
      bsBtn2.innerText = "No";
      bsBtn1.addEventListener("click", function () {
        leaveGame(linkElement.href);
      });
      bsBtn2.addEventListener("click", function () {
        deleteModal();
      });
      displayModal();
    });
  }
});

/**
 * Leave game.html and return to the specified URL
 */

function leaveGame(url) {
  window.location.href = url || "index.html";
}

shuffleCards();