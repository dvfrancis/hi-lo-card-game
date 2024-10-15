// Variable declarations
const cards = [
  document.getElementById("player-card"),
  document.getElementById("card-1"),
  document.getElementById("card-2"),
  document.getElementById("card-3"),
  document.getElementById("card-4"),
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
cards[1].innerHTML = `<img id="card-1" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[2].innerHTML = `<img id="card-2" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[3].innerHTML = `<img id="card-3" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;
cards[4].innerHTML = `<img id="card-4" src="https://www.deckofcardsapi.com/static/img/back.png" alt="The back of a playing card">`;

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
  `; // Display wager instructions and wager buttons
  const WagerOne = document.getElementById("wager-one");
  WagerOne.addEventListener("click", function () {
    setPlayerWager(1);
  }); // Increases wager by 1 when clicked
  const WagerFive = document.getElementById("wager-five");
  WagerFive.addEventListener("click", function () {
    setPlayerWager(5);
  }); // Increases wager by 5 when clicked
  const WagerTen = document.getElementById("wager-ten");
  WagerTen.addEventListener("click", function () {
    setPlayerWager(10);
  }); // Increases wager by 10 when clicked
  const WagerFifty = document.getElementById("wager-fifty");
  WagerFifty.addEventListener("click", function () {
    setPlayerWager(50);
  }); // Increases wager by 50 when clicked
  const WagerHundred = document.getElementById("wager-hundred");
  WagerHundred.addEventListener("click", function () {
    setPlayerWager(100);
  }); // Increases wager by 100 when clicked
  let totalWager = document.getElementById("total-wager");
  totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
  function setPlayerWager(num) {
    if (playerWager + num > playerPoints) {
      totalWager.innerHTML = `<p>Your wager cannot exceed your total points. Please try again.</p>`;
      playerWager = 0;
      setTimeout(() => {
        totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
      }, 1250);
    } else {
      playerWager += num;
      totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
    }
  } // Calculate wager ensuring it is not zero or exceeds available points
  const wagerReset = document.getElementById("wager-reset");
  wagerReset.addEventListener("click", function () {
    playerWager = 0;
    totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
  }); // Reset wager to zero when clicked
  const wagerSubmit = document.getElementById("wager-submit");
  wagerSubmit.addEventListener("click", function () {
    if (playerWager === 0 || playerWager > playerPoints) {
      totalWager.innerHTML = `<p>You have entered an incorrect wager. Please try again.</p>`;
    } else {
      playerChoice();
    }
  }); // Submit wager as long as it is not zero or exceeds available points, then move to next stage
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
  `; // Display higher or lower choice instructions and wager buttons
  const highBtn = document.getElementById("higher"); // Reference to higher button
  const lowBtn = document.getElementById("lower"); // Reference to lower button
  highBtn.addEventListener("click", function () {
    cardChoice = "Higher";
    flipCard(currentCard, true);
  }); // Set card choice to Higher and move to next stage
  lowBtn.addEventListener("click", function () {
    cardChoice = "Lower";
    flipCard(currentCard, true);
  }); // Set card choice to Lower and move to next stage
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
    `; // Display higher or lower choice instructions and wager buttons
  cards[cardIndex].innerHTML = `
    <img id="card-${currentCard}" src="${dealtCards.cards[cardIndex].images.png}" alt="The first card">
    `; // Flip the next card
  if (increment) {
    currentCard++;
    if (currentCard === 5) {
      return;
    } else {
      calculateOutcome(); // Calculate if the player was correct
      playerChoice(); // Choose whether the next card is higher or lower;
    }
  } // Only allow the currentCard variable to be incremented four times
}

// Calculate the outcome of the player's choice
let acesNum = 0;
if(currAces = "HIGH") {
      acesNum = 14;
    } else { 
      acesNum = 0;
    };

    let cardArray = {
      AC: 1,
      2C: 2,
      3C: 3,
      4C: 4,
      5C: 5,
      6C: 6,
      7C: 7,
      8C: 8,
      9C: 9,
      10C: 10,
      JC: 11,
      QC: 12,
      KC: 13,
      AD: 1,
      2D: 2,
      3D: 3,
      4D: 4,
      5D: 5,
      6D: 6,
      7D: 7,
      8D: 8,
      9D: 9,
      10D: 10,
      JD: 11,
      QD: 12,
      KD: 13,
      AH: 1,
      2H: 2,
      3H: 3,
      4H: 4,
      5H: 5,
      6H: 6,
      7H: 7,
      8H: 8,
      9H: 9,
      10H: 10,
      JH: 11,
      QH: 12,
      KH: 13,
      AS: 1,
      2S: 2,
      3S: 3,
      4S: 4,
      5S: 5,
      6S: 6,
      7S: 7,
      8S: 8,
      9S: 9,
      10S: 10,
      JS: 11,
      QH: 12,
      KH: 13,
    };

function calculateOutcome() {
  if (dealtCards.cards[currentCard].value > dealtCards.cards[0].value) {
    console.log("The current card has a higher value");
  } else if (
    (dealtCards.cards[currentCard].value =
      dealtCards.cards[0].value ||
      dealtCards.cards[currentCard].value < dealtCards.cards[0].value)
  ) {
    console.log("The current card is lower or of the same value");
  }
}

shuffleCards();
