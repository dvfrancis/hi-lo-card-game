describe('updateCopyrightYear function', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="copyright"></div>';
    });

    test('should update copyright year', () => {
        const {
            updateCopyrightYear
        } = require('../general');
        updateCopyrightYear();
        const yearNow = new Date().getFullYear();
        expect(document.getElementById('copyright').innerHTML).toBe(` ${yearNow} `);
    });
});