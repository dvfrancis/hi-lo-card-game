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
const initialWager = 100;
const acesBool = Math.random() < 0.5;

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
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

shuffleCards();
