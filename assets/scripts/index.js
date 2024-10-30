/**
 * Start the game when 'Play' button is clicked 
 */
function startGame() {
  const startGame = document.getElementById("play-game");
  startGame.addEventListener("click", function () {
    window.location.href = "game.html";
  });
}

startGame();