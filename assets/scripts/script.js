// Get current year and update copyright in footer
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `&#169 ${currentYear} <a href="https://www.dominicfrancis.co.uk/" target="_blank" class="copyright-text" rel="noopener noreferrer" aria-label="Visit Dominic Francis's website">Dominic Francis</a>`;

// Variable declarations

const playerCard = document.getElementById("card-1");
const dealtCardOne = document.getElementById("card-2");
const dealtCardTwo = document.getElementById("card-3");
const dealtCardThree = document.getElementById("card-4");
const dealtCardFour = document.getElementById("card-5");
let playerPoints = 100;
let deckUrl;
const lowWager = Math.ceil(Math.random() * 100);
const highWager = Math.ceil(Math.random() * 100);
const acesBool = Math.random() < 0.5;

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

// Display initial card view

playerCard.innerHTML = `<img class="card-one" src="assets/images/red-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
dealtCardOne.innerHTML = `<img class="card-two" src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
dealtCardTwo.innerHTML = `<img class="card-three" src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
dealtCardThree.innerHTML = `<img class="card-four" src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version
dealtCardFour.innerHTML = `<img class="card-five" src="assets/images/blue-playing-card-back.png" alt="Back of a playing card">`; // Need to change this image for a final credited version

// Shuffle the deck of cards via https://www.deckofcardsapi.com

async function shuffleCards() {
  const shuffleReply = await fetch(
    "https://www.deckofcardsapi.com/api/deck/new/shuffle/"
  );
  const cardDeck = await shuffleReply.json();
  if (shuffleReply.ok) {
    console.log(cardDeck); // Log out the shuffled deck
    deckUrl = cardDeck.deck_id;
    drawCards();
  } else {
    console.error("Error:", shuffleReply.statusText);
  }
}

// Draw cards from the shuffled deck from https://www.deckofcardsapi.com

async function drawCards() {
  const drawReply = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckUrl}/draw/?count=5`
  );
  const drawnCards = await drawReply.json();
  if (drawReply.ok) {
    console.log(drawnCards); // Log out the drawn cards
    console.log(initialWager);
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

shuffleCards();
