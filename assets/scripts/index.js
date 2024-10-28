/**
 * Save user details and start the game
 */
function startGame() {
  const startGame = document.getElementById("play-game");
  startGame.addEventListener("click", function () {
    window.location.href = "game.html";
  });
}

startGame();