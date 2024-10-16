// Variable declarations
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
  card10C: 10,
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
  card10D: 10,
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
  card10H: 10,
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
  card10S: 10,
  cardJS: 11,
  cardQS: 12,
  cardKS: 13,
}; // Array of playing card codes from https://www.deckofcardsapi.com/ (with associated values)
const cards = [
  document.getElementById("player-card"),
  document.getElementById("card-1"),
  document.getElementById("card-2"),
  document.getElementById("card-3"),
  document.getElementById("card-4"),
]; // DOM references for card DIVs
let deckUrl; // Current API deck_id used to complete the drawCards function fetch URL
let dealtCards; // The five cards used for a round of the game
let currentCard = 0; // Index of the current card to access the dealtCards array
let playerPoints = 100; // The player's initial points balance
let playerWager = 0; // The player's wager
let cardChoice; // The player's high or low choice
let correctGuesses = 0; // The player's correct guesses
const changeMsg = document.getElementById("game-messages"); // DOM reference to game-messages DIV
let currAces = decideAces(); // The value of an Ace for the round

// Decide whether Aces are high or low and send value to amendCardArray
function decideAces() {
  let acesBool = Math.random() < 0.5;
  let acesResult = acesBool ? "HIGH" : "LOW";
  amendCardsObject(acesResult); // Pass result to amendCardArray
  return acesResult;
}

// Update all Aces in the card array to match the current round's Ace value
function amendCardsObject(acesValue) {
  if (acesValue === "HIGH") {
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

// Update copyright year in footer
let dateNow = new Date();
let yearNow = dateNow.getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `&#169 ${yearNow} <a href="https://www.dominicfrancis.co.uk/" target="_blank" class="copyright-text" rel="noopener noreferrer" aria-label="Visit Dominic Francis's website">Dominic Francis</a>`;

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
    deckUrl = cardDeck.deck_id; // Save the deck_id for use in completing the fetch URL
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
    currentCard++; // Increment currentCard which is used to specify the index of the next card in the deck of dealt cards
    getWager();
  } else {
    console.error("Error:", drawReply.statusText);
  }
}

// Get player's current wager
function getWager() {
  // Display wager instructions and wager buttons
  changeMsg.innerHTML = `
  <div>
  <p>You currently have ${playerPoints} points</p>
  <p>Please enter your wager for this round (minimum = 1 point, maximum = your total points)</p>
  <div id="wager"></div>
  <button type="button" id="wager-one">+1</button>
  <button type="button" id="wager-five">+5</button>
  <button type="button" id="wager-ten">+10</button>
  <button type="button" id="wager-fifty">+50</button>
  <button type="button" id="wager-hundred">+100</button>
  <div><button type="submit" id="wager-submit">Submit</button>
  <button type="reset" id="wager-reset">Reset</button></div>
  </div>
  `;
  // DOM reference to total-wager DIV
  const totalWager = document.getElementById("wager");
  // Calculate wager ensuring it is not zero or exceeds available points
  function setPlayerWager(num) {
    if (playerWager + num > playerPoints) {
      totalWager.innerHTML = `<p>Your wager cannot exceed your total points. Please try again.</p>`;
      playerWager = 0;
      setTimeout(() => {
        totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
      }, 1500);
    } else {
      playerWager += num;
      totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
    }
  }
  // Increase playerWager by 1 when clicked
  const WagerOne = document.getElementById("wager-one");
  WagerOne.addEventListener("click", function () {
    setPlayerWager(1);
  });
  // Increase playerWager by 5 when clicked
  const WagerFive = document.getElementById("wager-five");
  WagerFive.addEventListener("click", function () {
    setPlayerWager(5);
  });
  // Increase playerWager by 10 when clicked
  const WagerTen = document.getElementById("wager-ten");
  WagerTen.addEventListener("click", function () {
    setPlayerWager(10);
  });
  // Increase playerWager by 50 when clicked
  const WagerFifty = document.getElementById("wager-fifty");
  WagerFifty.addEventListener("click", function () {
    setPlayerWager(50);
  });
  // Increase playerWager by 100 when clicked
  const WagerHundred = document.getElementById("wager-hundred");
  WagerHundred.addEventListener("click", function () {
    setPlayerWager(100);
  });
  // Reset wager to zero when clicked
  totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
  const wagerReset = document.getElementById("wager-reset");
  wagerReset.addEventListener("click", function () {
    playerWager = 0;
    totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
  });
  // Submit wager as long as it is not zero or exceeds available points, then move to next stage
  const wagerSubmit = document.getElementById("wager-submit");
  wagerSubmit.addEventListener("click", function () {
    if (playerWager === 0 || playerWager > playerPoints) {
      totalWager.innerHTML = `<p>You have entered an incorrect wager. Please try again.</p>`;
      setTimeout(() => {
        totalWager.innerHTML = `<p>Total wager: ${playerWager}</p>`;
      }, 1500);
    } else {
      playerChoice();
    }
  });
}

// Get higher or lower choice from the player
function playerChoice() {
  changeMsg.innerHTML = `
  <div>
  <p>You currently have ${playerPoints} points</p>
  <p>Your wager for this round is ${playerWager}</p>
  <p>For this round, Aces are ${currAces}</p>
  <p>Is the next card HIGHER or LOWER than your card?</p>
  <button type="button" id="higher">Higher</button>
  <button type="button" id="lower">Lower</button>
  </div>
  `;
  const highBtn = document.getElementById("higher"); // Reference to higher button
  const lowBtn = document.getElementById("lower"); // Reference to lower button
  highBtn.addEventListener("click", function () {
    cardChoice = "Higher";
    changeMsg.innerHTML = `
  <div>
    <p>Your card choice was ${cardChoice}</p>
  </div>
  `;
    flipCard(currentCard, true);
  }); // Set card choice to Higher and move to next stage
  lowBtn.addEventListener("click", function () {
    cardChoice = "Lower";
    changeMsg.innerHTML = `
  <div>
    <p>Your card choice was ${cardChoice}</p>
   </div>
  `;
    console.log("Card choice is", cardChoice);
    flipCard(currentCard, true);
  }); // Set card choice to Lower and move to next stage
}

// Sequentially reveal all cards in the dealtCards array
function flipCard(cardIndex, increment) {
  cards[cardIndex].innerHTML = `
    <img id="card-${currentCard}" src="${dealtCards.cards[cardIndex].images.png}" alt="The next game card">
    `; // Flip the next card
  if (increment) {
    currentCard++;
    if (currentCard === 5) {
    //   changeMsg.innerHTML = `
    // <div>
    // <p>You currently have ${playerPoints} points</p>
    // <p>For this round, Aces are ${currAces}</p>
    // <p>You guessed that the next card was ${cardChoice}</p>
    // <p>The next card is the ${dealtCards.cards[cardIndex].value} of ${dealtCards.cards[cardIndex].suit}!</p>
    // <button type="button" id="higher">Higher</button>
    // <button type="button" id="lower">Lower</button>
    // </div>
    // `; // Display higher or lower choice instructions and wager buttons
      calculateOutcome();
    } else {
    //   changeMsg.innerHTML = `
    // <div>
    // <p>You currently have ${playerPoints} points</p>
    // <p>For this round, Aces are ${currAces}</p>
    // <p>You guessed that the next card was ${cardChoice}</p>
    // <p>The next card is the ${dealtCards.cards[cardIndex].value} of ${dealtCards.cards[cardIndex].suit}!</p>
    // <button type="button" id="higher">Higher</button>
    // <button type="button" id="lower">Lower</button>
    // </div>
    // `; // Display higher or lower choice instructions and wager buttons
      calculateOutcome(); // Calculate if the player was correct
      playerChoice(); // Choose whether the next card is higher or lower;
    }
  } // Only allow the currentCard variable to be incremented four times
}

// Calculate the outcome of the player's choice
function calculateOutcome() {
  let prevCard = cardsObject["card" + dealtCards.cards[currentCard - 2].code];
  let currCard = cardsObject["card" + dealtCards.cards[currentCard - 1].code];
  if (currCard > prevCard && cardChoice === "Higher") {
    correctGuesses += 1;
    console.log("CONGRATULATIONS your card is higher in value");
  } else if (currCard < prevCard && cardChoice === "Lower") {
    correctGuesses += 1;
    console.log("CONGRATULATIONS your card is lower in value");
  } else if (currCard === prevCard) {
    correctGuesses += 1;
    console.log(
      "Your card is of the same value - you don't win but you don't lose either"
    );
  } else {
    playerPoints -= playerWager;
    console.log(
      "Sorry that was an incorrect choice. You have lost your wager!"
    );
    checkSuccess();
  }
}

// Check whether all cards were guessed successfully in the round

function checkSuccess() {
  if (correctGuesses === 4) {
    return playerPoints += playerWager;
  } else {
    return playerPoints -= playerWager;
  }
}

shuffleCards();
