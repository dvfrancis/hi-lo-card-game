// Save user details and start the game
const startGame = document.getElementById("play-game");
startGame.addEventListener("click", function () {
  window.location.href = "game.html";
});
// Still need to add logic for saving user details in localStorage