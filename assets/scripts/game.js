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
<div class="modal fade" id="bootstrap-modal" tabindex="-1" role="dialog" aria-labelledby="BootstrapModalDialog">
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
let currentCardIndex = 0;
let currentCardCount = 0;
let totalCards = 0;
let playerPoints = 100;
let highScore = 0;
let playerWager = 0;
let errorMessage = "";
let bsTitle = document.getElementById("modal-title");
let bsText = document.getElementById("modal-text");
let bsBtn1 = document.getElementById("modal-btn-1");
let bsBtn2 = document.getElementById("modal-btn-2");
const wagerInfo = document.getElementById("wager");
const pointsInfo = document.getElementById("points-info");
const cardInfo = document.getElementById("card-info");
const roundInfo = document.getElementById("round-info");
const acesInfo = document.getElementById("aces-info");
const changeMsg = document.getElementById("game-messages");
let acesValue = "";
let roundCount = 0;
let hiLoChoice = "";
let correctGuesses = 0;
let gameEnded = false;
let gameStatus = "";
let linkElement = "";

/**
 * Display player's points
 */
function displayPoints() {
  pointsInfo.innerHTML = `${playerPoints}`;
}

/**
 * Decide whether Aces are high or low
 * and send value to amendCardArray
 */
function decideAces() {
  let acesBool = Math.random() < 0.5;
  let acesResult = acesBool ? "HIGH" : "LOW";
  amendCardsObject(acesResult);
  acesValue = acesResult;
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
 * Display whether Aces High or Low
 */
function displayAces() {
  acesInfo.innerHTML = `${acesValue}`;
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
    totalCards = 0;
    currentCardCount = 0;
    roundCount = 0;
    displayPoints();
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
    displayWager();
    cards[0].innerHTML = `<img id="player-card" src="${dealtCards.cards[0].images.png}" alt="The player's card">`;
    // Reset values before round
    currentCardIndex = 0;
    correctGuesses = 0;
    playerWager = 0;
    roundCount++;
    currentCardIndex++;
    totalCards++;
    currentCardCount += 5;
    decideAces();
    displayAces();
    displayRound();
    getWager();
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

/**
 * Display current round
 */
function displayRound() {
  roundInfo.innerHTML = `${roundCount}`;
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
    <label for="wager-amount">What is your wager for this round?</label>
    <input type="number" id="wager-amount" min="1" max="${playerPoints}" required>
    <button id="wager-submit" aria-label="Submit Wager">Submit</button>
    <span id="error-message"></span>
  </div>`;
  displayCard();
  displayWager();
  const wagerSubmit = document.getElementById("wager-submit");
  document.getElementById("wager-amount").focus();
  wagerSubmit.removeEventListener("click", handleWagerSubmit);
  wagerSubmit.addEventListener("click", handleWagerSubmit);
}

/**
 * Handle Wager Submissions
 */

function handleWagerSubmit() {
  const wagerAmount = +document.getElementById("wager-amount").value;
  errorMessage = document.getElementById("error-message");
  if (isNaN(wagerAmount) || wagerAmount > playerPoints || wagerAmount < 1) {
    errorMessage.innerHTML = `<p>Your wager must be a number between 1 and ${playerPoints}. Please try again.</p>`;
    document.getElementById("wager-amount").value = "";
    playerWager = 0;
    displayCard();
    displayWager();
  } else {
    playerWager = wagerAmount;
    displayCard();
    displayWager();
    playerChoice();
  }
}

/**
 * Display player's wager
 */
function displayWager() {
  setTimeout(() => {
    errorMessage.innerHTML = ``;
  }, 2000);
  wagerInfo.innerHTML = `${playerWager}`;
}

/**
 * Get higher or lower choice from the player
 */
function playerChoice() {
  changeMsg.innerHTML = `
  <div>
  <p>Is the next card HIGHER or LOWER than your card?</p>
  <button type="button" id="higher-button">Higher</button>
  <button type="button" id="lower-button">Lower</button>
  </div>
  `;
  const highBtn = document.getElementById("higher-button");
  const lowBtn = document.getElementById("lower-button");
  highBtn.addEventListener("click", function () {
    hiLoChoice = "Higher";
    flipCard(currentCardIndex);
  });
  lowBtn.addEventListener("click", function () {
    hiLoChoice = "Lower";
    flipCard(currentCardIndex);
  });
}

/**
 * Sequentially reveal all cards
 * in the dealtCards array
 */
function flipCard(cardIndex) {
  cards[cardIndex].innerHTML = `
    <img id="card-${currentCardIndex}" src="${dealtCards.cards[cardIndex].images.png}" alt="The next game card">
    `;
  calculateOutcome();
  currentCardIndex++;
  totalCards += 1;
  displayCard();
  playerChoice();
}

/**
 * Display current card's position in the pack
 */
function displayCard() {
  cardInfo.innerHTML = `${totalCards}`;
}

/**
 * Calculate whether player choices
 * were correct or incorrect
 */
function calculateOutcome() {
  let prevCard = cardsObject["card" + dealtCards.cards[currentCardIndex - 1].code];
  let currCard = cardsObject["card" + dealtCards.cards[currentCardIndex].code];
  if (currCard > prevCard && hiLoChoice === "Higher") {
    correctGuesses += 1;
    if (correctGuesses === 4) {
      playerPoints += playerWager;
      displayPoints();
      gameStatus = "win";
      continueGame(gameStatus);
    } else {
      playerChoice();
    }
  } else if (currCard < prevCard && hiLoChoice === "Lower") {
    correctGuesses += 1;
    if (correctGuesses === 4) {
      playerPoints += playerWager;
      displayPoints();
      gameStatus = "win";
      continueGame(gameStatus);
    } else {
      playerChoice();
    }
  } else if (currCard === prevCard) {
    totalCards += (currentCardCount - totalCards) - 1;
    gameStatus = "draw"
    continueGame(gameStatus);
  } else {
    totalCards += (currentCardCount - totalCards) - 1;
    playerPoints -= playerWager;
    displayPoints();
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
    bsBtn2.addEventListener("click", function () {
      displayScore();
      setTimeout(() => {
        leaveGame("index.html")
      }, 5000);

    });
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
  let storedScore = localStorage.getItem("high-score");
  highScore = storedScore ? +storedScore : 0;
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
  bsBtn2.addEventListener("click", function () {
    leaveGame("index.html")
  });
  displayModal();
}

/**
 * Display player's most recent score
 */
function displayScore() {
  gameEnded = true;
  deleteModal();
  createModal();
  bsTitle = document.getElementById("modal-title");
  bsText = document.getElementById("modal-text");
  bsBtn1 = document.getElementById("modal-btn-1");
  bsBtn2 = document.getElementById("modal-btn-2");
  bsBtn1.remove();
  bsBtn2.remove();
  bsTitle.innerText = "THANKS FOR PLAYING";
  bsText.innerText = "Your final score was " + playerPoints + " points";
  displayModal();
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
  bsBtn2.addEventListener("click", function () {
    displayScore();
    setTimeout(() => {
      leaveGame(linkElement.href);
    }, 5000);
  });
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
  bsBtn2.addEventListener("click", function () {
    displayScore();
    setTimeout(() => {
      leaveGame(linkElement.href);
    }, 5000);
  });
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
        displayScore();
        setTimeout(() => {
          leaveGame(linkElement.href);
        }, 5000);
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