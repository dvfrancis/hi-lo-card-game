// Variable declarations

const playerCard = document.getElementById("player-card");
const cardOne = document.getElementById("card-one");
const cardTwo = document.getElementById("card-two");
const cardThree = document.getElementById("card-three");
const cardFour = document.getElementById("card-four");
let playerPoints = 100;
const acesBool = Math.random() < 0.5; // Generate boolean to determine if aces high or low
let deckUrl;

// Get current year and update copyright in footer
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `&#169 ${currentYear} <a href="https://www.dominicfrancis.co.uk/" target="_blank" class="copyright-text" rel="noopener noreferrer" aria-label="Visit Dominic Francis's website">Dominic Francis</a>`;

// Display initial card view

playerCard.innerHTML = `<img src="assets/images/red-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
cardOne.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
cardTwo.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
cardThree.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
cardFour.innerHTML = `<img src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version

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
