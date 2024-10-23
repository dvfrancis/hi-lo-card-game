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
// Bootstrap message modal template
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
let playerWager = 0;
let wagerInfo = `<div>
  <p>You currently have ${playerPoints} points</p>
  <p>What is your wager this round? (min = 1 point, max = total points)</p>
  <div id="wager"></div>
  <button type="button" id="wager-one">+1</button>
  <button type="button" id="wager-five">+5</button>
  <button type="button" id="wager-ten">+10</button>
  <button type="button" id="wager-fifty">+50</button>
  <button type="button" id="wager-hundred">+100</button>
  <div><button type="submit" id="wager-submit">Submit</button>
  </div>`;
let bsTitle = document.getElementById("modal-title");
let bsText = document.getElementById("modal-text");
let bsBtn1 = document.getElementById("modal-btn-1");
let bsBtn2 = document.getElementById("modal-btn-2");
let totalWager = document.getElementById("wager");
let hiLoChoice = "";
let correctGuesses = 0;
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
 * to match the current round 's Ace value
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
 * Hide Bootstrap modal
 */
function hideModal() {
  if (messageModal) {
    messageModal.style.display = "none";
    messageModal.classList.add("hide");
  } else {
    console.error("Modal element not found");
  }
}

/**
 * Shuffle the deck of cards
 *(via API call to https: //www.deckofcardsapi.com)
 */
async function shuffleCards() {
  const shuffleReply = await fetch(
    "https://www.deckofcardsapi.com/api/deck/new/shuffle/"
  );
  const cardDeck = await shuffleReply.json();
  if (shuffleReply.ok) {
    console.log(cardDeck);
    playerPoints = 100;
    deckUrl = cardDeck.deck_id;
    drawCards();
  } else {
    console.error("Error:", shuffleReply.statusText);
  }
}

/**
 * Draw cards from the shuffled deck
 *  and display the player's card
 * (via API call to https: //www.deckofcardsapi.com)
 */
async function drawCards() {
  const drawReply = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckUrl}/draw/?count=5`
  );
  if (cardsDrawn) {
    return;
  } // Additional check to ensure that the drawCards function is not called multiple times
  cardsDrawn = true;
  dealtCards = await drawReply.json();
  if (drawReply.ok) {
    console.log(dealtCards);
    initialView();
    cards[0].innerHTML = `<img id="player-card" src="${dealtCards.cards[0].images.png}" alt="The player's card">`;
    // Reset values before round
    currentCard = 0;
    correctGuesses = 0;
    playerWager = 0;
    currentCard++;
    getWager();
  } else {
    console.error("Error:", drawReply.statusText);
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
 * Get player 's current wager
 */
function getWager() {
  changeMsg.innerHTML = wagerInfo;
  totalWager = document.getElementById("wager");
  const WagerOne = document.getElementById("wager-one");
  WagerOne.addEventListener("click", function () {
    setPlayerWager(1);
  });
  const WagerFive = document.getElementById("wager-five");
  WagerFive.addEventListener("click", function () {
    setPlayerWager(5);
  });
  const WagerTen = document.getElementById("wager-ten");
  WagerTen.addEventListener("click", function () {
    setPlayerWager(10);
  });
  const WagerFifty = document.getElementById("wager-fifty");
  WagerFifty.addEventListener("click", function () {
    setPlayerWager(50);
  });
  const WagerHundred = document.getElementById("wager-hundred");
  WagerHundred.addEventListener("click", function () {
    setPlayerWager(100);
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

/**
 * Calculate wager ensuring it is
 * not zero or exceeds available points
 */
function setPlayerWager(num) {
  totalWager = document.getElementById("wager");
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
    console.log("The card is higher in value.");
    console.log(correctGuesses);
    if (correctGuesses === 4) {
      playerPoints += playerWager;
      continueGame("win");
    } else {
      return;
    }
  } else if (currCard < prevCard && hiLoChoice === "Lower") {
    correctGuesses += 1;
    console.log("The card is lower in value.");
    console.log(correctGuesses);
    if (correctGuesses === 4) {
      playerPoints += playerWager;
      continueGame("win");
    } else {
      playerChoice();
    }
    return;
  } else if (currCard === prevCard) {
    console.log(
      "You got a match, and there's nothing for two - not in this game!"
    );
    playerPoints -= playerWager;
    continueGame("lose");
  } else {
    console.log("Incorrect choice. You have lost your wager.");
    playerPoints -= playerWager;
    continueGame("lose");
  }
}

/**
 * Ask player if they wish to
 * continue playing the game
 */
function continueGame(status) {
  if (status === "win") {
    createModal();
    bsTitle = document.getElementById("modal-title");
    bsText = document.getElementById("modal-text");
    bsBtn1 = document.getElementById("modal-btn-1");
    bsBtn2 = document.getElementById("modal-btn-2");
    bsTitle.innerText = "YOU WON THE ROUND! 😄";
    bsText.innerText = "Do you wish to proceed to the next round?";
    bsBtn1.innerText = "Yes";
    bsBtn2.innerText = "No";
    bsBtn1.addEventListener("click", newDeck);
    bsBtn2.addEventListener("click", gameOver);
    displayModal();
  } else if (status === "lose") {
    createModal();
    bsTitle = document.getElementById("modal-title");
    bsText = document.getElementById("modal-text");
    bsBtn1 = document.getElementById("modal-btn-1");
    bsBtn2 = document.getElementById("modal-btn-2");
    bsTitle.innerText = "YOU LOST THE ROUND! 😭";
    bsText.innerText = "Do you wish to play again?";
    bsBtn1.innerText = "Yes";
    bsBtn2.innerText = "No";
    bsBtn1.addEventListener("click", newDeck);
    bsBtn2.addEventListener("click", gameOver);
    displayModal();
  } else {
    hideModal();
    createModal();
    let bsTitle = document.getElementById("modal-title");
    let bsText = document.getElementById("modal-text");
    bsTitle.innerText = "GAME OVER 😭";
    bsText.innerText = "You currently have " + playerPoints + " points";
    displayModal();
  }
}

/**
 * Start a new round
 */
function newDeck() {
  hideModal();
  cardsDrawn = false; // Set cardsDrawn to false to allow new deck to be drawn
  if (dealtCards.remaining >= 5 && playerPoints > 0) {
    drawCards();
  } else if (dealtCards.remaining < 5 || playerPoints < 1) {
    shuffleCards();
  } else {
    endGame();
  }
}

/**
 * Display final points
 */
function gameOver() {
  hideModal();
  createModal();
  bsTitle = document.getElementById("modal-title");
  bsText = document.getElementById("modal-text");
  bsBtn1 = document.getElementById("modal-btn-1");
  bsBtn2 = document.getElementById("modal-btn-2");
  bsBtn1.remove();
  bsBtn2.remove();
  bsTitle.innerText = "GAME OVER 😭";
  bsText.innerText = "You scored " + playerPoints + " points";
  displayModal();
}

/**
 * End the game
 */
function endGame() {
  createModal();
  bsTitle = document.getElementById("modal-title");
  bsText = document.getElementById("modal-text");
  bsBtn1 = document.getElementById("modal-btn-1");
  bsBtn2 = document.getElementById("modal-btn-2");
  bsTitle.innerText = "BAD LUCK";
  bsText.innerText = "You have used all of your points / cards. Play again?";
  bsBtn1.innerText = "Yes";
  bsBtn2.innerText = "No";
  bsBtn1.addEventListener("click", newDeck);
  bsBtn2.addEventListener("click", gameOver);
  displayModal();
}

/**
 * Leave the game
 */
const linkIDs = ["home-page-link", "faq-page-link"];
linkIDs.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", function (event) {
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
        window.location.href = "index.html";
      });
      bsBtn2.addEventListener("click", function () {
        hideModal();
      });
      displayModal();
    })
  }
})


shuffleCards();