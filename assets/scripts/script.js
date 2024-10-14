// Variable declarations
const cards = [
  document.getElementById("player-card"),
  document.getElementById("card-one"),
  document.getElementById("card-two"),
  document.getElementById("card-three"),
  document.getElementById("card-four"),
]; // References to card divs
let currentCard = 0; // Current card's index
let acesBool; // Used to set Aces true or false
const currAces = decideAces() ? "HIGH" : "LOW"; // Used to set Aces high or low
let playerPoints = 100; // Player's initial points balance
let playerWager = 0; // Player's current wager
let cardChoice; // Player's high or low choice
let deckUrl; // Used to create the drawCards function fetch URL
let dealtCards; // Cards dealt for the game
const changeMsg = document.getElementById("game-messages"); // Reference to game messages div

// Update footer and copyright year
let dateNow = new Date();
let yearNow = dateNow.getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `&#169 ${yearNow} <a href="https://www.dominicfrancis.co.uk/" target="_blank" class="copyright-text" rel="noopener noreferrer" aria-label="Visit Dominic Francis's website">Dominic Francis</a>`;

// Set Aces are true or false
function decideAces() {
  acesBool = Math.random() < 0.5;
  return acesBool;
}

// Display initial card view
cards[0].innerHTML = `<img id="player-card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[1].innerHTML = `<img id="card-one" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[2].innerHTML = `<img id="card-two" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[3].innerHTML = `<img id="card-three" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[4].innerHTML = `<img id="card-four" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;

// Shuffle the deck of cards (via https://www.deckofcardsapi.com)
async function shuffleCards() {
  const shuffleReply = await fetch(
    "https://www.deckofcardsapi.com/api/deck/new/shuffle/"
  );
  const cardDeck = await shuffleReply.json();
  if (shuffleReply.ok) {
    console.log(cardDeck); // Console log the shuffled deck
    deckUrl = cardDeck.deck_id;
    drawCards();
  } else {
    console.error("Error:", shuffleReply.statusText);
  }
}

// Draw cards from the shuffled deck and display the player's card (via https://www.deckofcardsapi.com)
async function drawCards() {
  const drawReply = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckUrl}/draw/?count=5`
  );
  dealtCards = await drawReply.json();
  if (drawReply.ok) {
    console.log(dealtCards); // Console log the drawn cards
    cards[0].innerHTML = `<img id="player-card" src="${dealtCards.cards[0].images.png}" alt="The player's card">`; // Display the player's card
    currentCard++;
    getWager();
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

// Get player's current wager

function getWager() {
  changeMsg.innerHTML = `
  <div>
  <p>You have ${playerPoints} points</p>
  <p>Please enter your wager for this round</p>
  <p>Minimum wager is 1 point, and you cannot wager more than your total points</p>
  <button type="button" id="wager-one">+1</button>
  <button type="button" id="wager-five">+5</button>
  <button type="button" id="wager-ten">+10</button>
  <button type="button" id="wager-fifty">+50</button>
  <button type="button" id="wager-hundred">+100</button>
  <div><button type="submit" id="wager-submit">Submit</button>
 <button type="reset" id="wager-reset">Reset</button></div>
  <div id="total-wager"></div>
  </div>
  `;
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
  let totalWager = document.getElementById("total-wager");
  function setPlayerWager(num) {
    if (playerWager + num > playerPoints) {
      totalWager.innerHTML = `<p>You cannot exceed your total points. Try again.</p>`;
      playerWager = 0;
    } else {
      playerWager += num;
      console.log(playerWager);
      return (totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`);
    }
  }
  const wagerReset = document.getElementById("wager-reset");
  wagerReset.addEventListener("click", function () {
    playerWager = 0;
    totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
  });
  const wagerSubmit = document.getElementById("wager-submit");
  wagerSubmit.addEventListener("click", function () {
    if (playerWager === 0 || playerWager > playerPoints) {
      totalWager.innerHTML = `<p>You have entered an invalid amount. Try again.</p>`;
    } else {
      playerChoice();
    }
  });
}

// Get higher or lower choice from the player
function playerChoice() {
  changeMsg.innerHTML = `
  <div>
  <p>Minimum wager is 1 point</p>
  <p>For this round, Aces are ${currAces}</p>
  <p>Is the next card HIGHER or LOWER than your card?</p>
  <button type="button" id="higher">Higher</button>
  <button type="button" id="lower">Lower</button>
  </div>
  `;
  const highBtn = document.getElementById("higher");
  const lowBtn = document.getElementById("lower");
  highBtn.addEventListener("click", function () {
    cardChoice = "Higher";
    flipCard(currentCard, true);
  });
  lowBtn.addEventListener("click", function () {
    cardChoice = "Lower";
    flipCard(currentCard, true);
  });
}

// Sequentially reveal all cards in the dealtCards array

function flipCard(cardIndex, increment) {
  changeMsg.innerHTML = `
    <div>
    <p>Minimum wager is 1 point</p>
    <p>For this round, Aces are ${currAces}</p>
    <p>The next card is the ${dealtCards.cards[cardIndex].value} of ${dealtCards.cards[cardIndex].suit}!</p>
    <button type="button" id="higher">Higher</button>
    <button type="button" id="lower">Lower</button>
    </div>
    `;
  cards[cardIndex].innerHTML = `
    <img id="card-one" src="${dealtCards.cards[cardIndex].images.png}" alt="The first card">
    `; // Display the flipped card
  console.log(currentCard);
  if (increment) {
    currentCard++;
    if (currentCard === 5) {
      return;
    } else {
      playerChoice();
    }
  }
}

shuffleCards();
