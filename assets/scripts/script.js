// Variable declarations
const playerCard = document.getElementById("player-card"); // Store reference to player-card div
const cardOne = document.getElementById("card-one"); // Store reference to card-one div
const cardTwo = document.getElementById("card-two"); // Store reference to card-two div
const cardThree = document.getElementById("card-three"); // Store reference to card-three div
const cardFour = document.getElementById("card-four"); // Store reference to card-four div
const acesHighLow = document.getElementById("aces-high-low"); // Store reference to aces-high-low div
let acesBool; // Used later to store whether Aces are high or low
let playerPoints = 100; // Set player's initial points balance to 100
let playerChoice; // Used to store player's higher or lower choice
let deckUrl;
let drawnCards; // Used to store drawn cards later

// Get current year and update copyright in footer
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `&#169 ${currentYear} <a href="https://www.dominicfrancis.co.uk/" target="_blank" class="copyright-text" rel="noopener noreferrer" aria-label="Visit Dominic Francis's website">Dominic Francis</a>`;

// Set Aces true or false
function decideAces() {
  acesBool = Math.random() < 0.5;
  return acesBool;
}

// Display initial card view
playerCard.innerHTML = `<img id="player-card" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cardOne.innerHTML = `<img id="card-one" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cardTwo.innerHTML = `<img id="card-two" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cardThree.innerHTML = `<img id="card-three" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cardFour.innerHTML = `<img id="card-four" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
acesHighLow.innerText = `For this round, Aces are ${
  decideAces() ? "HIGH" : "LOW"
}`;

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
  drawnCards = await drawReply.json();
  if (drawReply.ok) {
    console.log(drawnCards);
    playerCard.innerHTML = `<img id="player-card" src="${drawnCards.cards[0].images.png}" alt="The player's card">`; // Display the player's card
    playerWagers();
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

// Get higher or lower choice from the player

function playerWagers() {
  let changeMsg = document.getElementById("game-messages");
  changeMsg.innerHTML = `<div><p>Is the next card HIGHER or LOWER than your card?</p><button type="button" id="higher">Higher</button><button type="button" id="lower">Lower</button></div>`;
  const highBtn = document.getElementById("higher");
  const lowBtn = document.getElementById("lower");
  highBtn.addEventListener("click", function () {
    changeMsg.innerHTML = `<div><p>You have chosen HIGHER</p></div>`;
    playerChoice = "Higher";
    cardOne.innerHTML = `<img id="card-one" src="${drawnCards.cards[1].images.png}" alt="The first card">`; // Display the first card
  });
  lowBtn.addEventListener("click", function () {
    changeMsg.innerHTML = `<div><p>You have chosen LOWER</p></div>`;
    playerChoice = "Lower";
    cardOne.innerHTML = `<img id="card-one" src="${drawnCards.cards[1].images.png}" alt="The first card">`; // Display the first card
  });
}

// function randRange(low, high) {
//   let diff = high - low; // find difference between lowest and highest numbers
//   console.log(diff);
//   diff = Math.floor(diff * Math.random()); // multiple the difference by a random number
//   console.log(diff);
//   diff = diff + low; // add the the lowest number back to the new difference
//   console.log(diff);
//   return diff;
// }

// randRange(playerPoints, highWager);

shuffleCards();
