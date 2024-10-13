// Variable declarations
const cards = [
  document.getElementById("player-card"),
  document.getElementById("card-one"),
  document.getElementById("card-two"),
  document.getElementById("card-three"),
  document.getElementById("card-four"),
]; // Stores references to card placement divs
let acesBool; // Used later to store whether Aces are high or low
let playerPoints = 100; // Set player's initial points balance to 100
let cardChoice; // Used to store player's higher or lower choice
let deckUrl; // Used to create the drawCards function fetch URL
let drawnCards; // Used to store drawn cards later
let currentCard = 0; // Used to store current card in play
let changeMsg = document.getElementById("game-messages");

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
    console.log(dealtCards);
    cards[0].innerHTML = `<img id="player-card" src="${dealtCards.cards[0].images.png}" alt="The player's card">`; // Display the player's card
    currentCard++;
    playerChoice();
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

//

function flipCard(cardIndex, increment) {
  changeMsg.innerHTML = `
    <div>
    <p>For this round, Aces are ${decideAces() ? "HIGH" : "LOW"}</p>
    <p>The next card is the ${dealtCards.cards[cardIndex].value} of ${
    dealtCards.cards[cardIndex].suit
  }!</p>
    <button type="button" id="higher">Higher</button>
    <button type="button" id="lower">Lower</button>
    </div>
    `;
  cards[cardIndex].innerHTML = `
    <img id="card-one" src="${dealtCards.cards[cardIndex].images.png}" alt="The first card">
    `; // Display the flipped card
  if (increment) {
    currentCard++;
    if (currentCard === 5) {
      return;
    } else {
      playerChoice();
    }
  }
}

// Get higher or lower choice from the player
function playerChoice() {
  changeMsg.innerHTML = `
  <div>
  <p>For this round, Aces are ${decideAces() ? "HIGH" : "LOW"}</p>
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

shuffleCards();
