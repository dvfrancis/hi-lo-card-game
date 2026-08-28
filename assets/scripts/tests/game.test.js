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

describe('judging a guess', () => {
    const {
        judgeGuess
    } = require('../game');

    test('a higher card with a HIGH guess is correct', () => {
        expect(judgeGuess(5, 9, "Higher")).toBe("correct");
    });

    test('a higher card with a LOW guess is wrong', () => {
        expect(judgeGuess(5, 9, "Lower")).toBe("wrong");
    });

    test('a lower card with a LOW guess is correct', () => {
        expect(judgeGuess(9, 5, "Lower")).toBe("correct");
    });

    test('a lower card with a HIGH guess is wrong', () => {
        expect(judgeGuess(9, 5, "Higher")).toBe("wrong");
    });

    test('two cards of the same value are a draw whatever the guess', () => {
        expect(judgeGuess(7, 7, "Higher")).toBe("draw");
        expect(judgeGuess(7, 7, "Lower")).toBe("draw");
    });

    test('a guess that was never made is wrong', () => {
        expect(judgeGuess(5, 9, "")).toBe("wrong");
    });
});

describe('winning a round', () => {
    const {
        roundIsWon
    } = require('../game');

    test('the round is won on the fourth correct guess only', () => {
        expect(roundIsWon(0)).toBe(false);
        expect(roundIsWon(3)).toBe(false);
        expect(roundIsWon(4)).toBe(true);
        expect(roundIsWon(5)).toBe(false);
    });
});

describe('validating a wager', () => {
    const {
        isValidWager
    } = require('../game');

    test('accepts a wager from 1 up to the player points', () => {
        expect(isValidWager(1, 100)).toBe(true);
        expect(isValidWager(50, 100)).toBe(true);
        expect(isValidWager(100, 100)).toBe(true);
    });

    test('rejects a wager above the player points', () => {
        expect(isValidWager(101, 100)).toBe(false);
    });

    test('rejects zero and negative wagers', () => {
        expect(isValidWager(0, 100)).toBe(false);
        expect(isValidWager(-10, 100)).toBe(false);
    });

    test('rejects a wager that is not a number', () => {
        expect(isValidWager(NaN, 100)).toBe(false);
    });
});

describe('valuing the Aces', () => {
    const {
        aceValueFor,
        amendCardsObject,
        decideAces,
        cardsObject
    } = require('../game');
    const aceKeys = ["cardAC", "cardAD", "cardAH", "cardAS"];

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('an Ace is worth 14 when high and 1 otherwise', () => {
        expect(aceValueFor("HIGH")).toBe(14);
        expect(aceValueFor("LOW")).toBe(1);
    });

    test('amendCardsObject sets all four Aces to the round value', () => {
        amendCardsObject("HIGH");
        aceKeys.forEach(key => expect(cardsObject[key]).toBe(14));
        amendCardsObject("LOW");
        aceKeys.forEach(key => expect(cardsObject[key]).toBe(1));
    });

    test('amendCardsObject leaves the other cards alone', () => {
        amendCardsObject("HIGH");
        expect(cardsObject.cardKS).toBe(13);
        expect(cardsObject.card0H).toBe(10);
        expect(cardsObject.card2C).toBe(2);
    });

    test('decideAces makes the Aces high on a low random draw', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.4);
        decideAces();
        aceKeys.forEach(key => expect(cardsObject[key]).toBe(14));
    });

    test('decideAces makes the Aces low on a high random draw', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.9);
        decideAces();
        aceKeys.forEach(key => expect(cardsObject[key]).toBe(1));
    });
});

describe('deciding the next game state', () => {
    const {
        nextGameState
    } = require('../game');

    test('a finished game goes to game over whatever the deck holds', () => {
        expect(nextGameState(true, 30, 100)).toBe("gameOver");
        expect(nextGameState(true, 7, 0)).toBe("gameOver");
    });

    test('a deck between 8 and 47 cards draws again', () => {
        expect(nextGameState(false, 8, 100)).toBe("drawCards");
        expect(nextGameState(false, 47, 100)).toBe("drawCards");
    });

    test('a deck of exactly 7 cards triggers the final round', () => {
        expect(nextGameState(false, 7, 100)).toBe("finalRound");
    });

    test('a player with no points is bankrupt', () => {
        expect(nextGameState(false, 30, 0)).toBe("noPoints");
        expect(nextGameState(false, 7, -5)).toBe("noPoints");
    });

    test('a full deck of 48 or more does nothing', () => {
        expect(nextGameState(false, 48, 100)).toBe("none");
    });

    test('an empty deck with points left does nothing', () => {
        expect(nextGameState(false, 0, 100)).toBe("none");
    });
});

describe('resolving the high score', () => {
    const {
        resolveHighScore
    } = require('../game');

    test('any score beats an empty store', () => {
        expect(resolveHighScore(null, 120)).toEqual({
            highScore: 120,
            improved: true
        });
    });

    test('a better score replaces the stored one', () => {
        expect(resolveHighScore("100", 150)).toEqual({
            highScore: 150,
            improved: true
        });
    });

    test('a worse score keeps the stored one', () => {
        expect(resolveHighScore("200", 150)).toEqual({
            highScore: 200,
            improved: false
        });
    });

    test('an equal score is not an improvement', () => {
        expect(resolveHighScore("150", 150)).toEqual({
            highScore: 150,
            improved: false
        });
    });

    test('a stored zero is beaten by any positive score', () => {
        expect(resolveHighScore("0", 1)).toEqual({
            highScore: 1,
            improved: true
        });
    });
});
