// jsdom provides no fetch. game.js calls shuffleCards() at import time, so
// requiring it in a suite would otherwise log "Fetch error: ReferenceError:
// fetch is not defined". A never-settling stub lets the module load quietly.
// Suites that need real fetch behaviour should mock it themselves.
global.fetch = () => new Promise(() => {});
