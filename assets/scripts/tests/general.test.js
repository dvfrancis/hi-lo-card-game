describe('updating the copyright year', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="copyright"></div>'; // Create mock DOM element for testing
    });

    test('should update copyright year', () => {
        const {
            updateCopyrightYear
        } = require('../general'); // Import JavaScript file
        updateCopyrightYear(); // Run function to be tested
        const yearNow = new Date().getFullYear(); // Create yearNow variable for testing below
        expect(document.getElementById('copyright').innerHTML).toBe(` ${yearNow} `); // Assert the result
    });
});