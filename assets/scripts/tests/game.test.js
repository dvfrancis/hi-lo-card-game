describe('gameplay', () => {
    beforeEach(() => {
        document.body.innerHTML = '<input type="submit" id="play-game" value="PLAY">';
        delete window.location;
        window.location = {
            href: ''
        };
    });

    test("leaveGame function should navigate to specified URL", () => {
        const {
            leaveGame
        } = require('../game');
        const testUrl = "index.html";
        leaveGame(testUrl);
        expect(window.location.href).toBe(testUrl);
    });
});