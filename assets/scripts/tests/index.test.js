describe('startGame function', () => {
    beforeEach(() => {
        document.body.innerHTML = '<input type="submit" id="play-game" value="PLAY">'; // Create mock DOM element for testing
        delete window.location; // Remove current window object
        window.location = {
            href: ''
        }; // Create mock window object
    });

    test('should navigate to game.html when play-game button clicked', () => {
        const {
            startGame
        } = require('../index'); // Import JavaScript file
        startGame(); // Run function to be tested
        const playGame = document.getElementById("play-game");
        playGame.click(); // Simulate play-game button click
        expect(window.location.href).toBe("game.html"); // Assert the result
    });
});