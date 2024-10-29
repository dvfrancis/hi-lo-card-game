describe('gameplay', () => {
    beforeEach(() => {
        document.body.innerHTML = '<input type="submit" id="play-game" value="PLAY">'; // Create mock DOM element for testing
        delete window.location; // Remove current window object
        window.location = {
            href: ''
        }; // Create mock window object
    });

    test("leaveGame function should navigate to specified URL", () => {
        const {
            leaveGame
        } = require('../game'); // Import JavaScript file
        const testUrl = "index.html";
        leaveGame(testUrl);
        expect(window.location.href).toBe(testUrl);
    });
});