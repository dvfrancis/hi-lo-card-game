// Variable declarations
const playerCard = document.getElementById("player-card"); // Store reference to player-card div
const cardOne = document.getElementById("card-one"); // Store reference to card-one div
const cardTwo = document.getElementById("card-two"); // Store reference to card-two div
const cardThree = document.getElementById("card-three"); // Store reference to card-three div
const cardFour = document.getElementById("card-four"); // Store reference to card-four div
const acesHighLow = document.getElementById("aces-high-low"); // Store reference to aces-high-low div
let acesBool; // Used later to store whether Aces are high or low
let playerPoints = 100; // Set player's initial points balance to 100

let deckUrl;

// Get current year and update copyright in footer
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `&#169 ${currentYear} <a href="https://www.dominicfrancis.co.uk/" target="_blank" class="copyright-text" rel="noopener noreferrer" aria-label="Visit Dominic Francis's website">Dominic Francis</a>`;

// Set Aces high or low
function aces() {
  acesBool = Math.random() < 0.5;
  return acesBool;
}

// Display initial card view
playerCard.innerHTML = `<img src="assets/images/red-playing-card-back.png" alt="Back of a playing card">`;
cardOne.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`;
cardTwo.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`;
cardThree.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`;
cardFour.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`;
acesHighLow.innerText = `For this round, Aces are ${aces() ? "HIGH" : "LOW"}`;

// Shuffle the deck of cards via https://www.deckofcardsapi.com
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

// Draw cards from the shuffled deck via https://www.deckofcardsapi.com
async function drawCards() {
  const drawReply = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckUrl}/draw/?count=5`
  );
  const drawnCards = await drawReply.json();
  if (drawReply.ok) {
    console.log(drawnCards); // Console log the drawn cards
  } else {
    console.error("Error:", drawReply.statusText);
  }
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
