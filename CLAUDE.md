# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hi-Lo (higher-or-lower) card game — a static site originally built as a Code Institute
portfolio project. Vanilla JavaScript, no framework, no bundler, no build step for the
application itself. Bootstrap 5.3.3 and Font Awesome load from CDNs; card data and card
images come from the [Deck of Cards API](https://www.deckofcardsapi.com/).

Four pages at the repo root — `index.html`, `game.html`, `faq.html`, `404.html` — with
`assets/css/styles.css` and `assets/scripts/`.

## Commands

```bash
npm install          # dev dependencies (Jest toolchain only; the site itself has none)
npm test             # 3 suites, all passing
npx jest assets/scripts/tests/general.test.js   # single suite
npx jest -t "should update copyright year"      # single test by name
./build.sh           # build static site into deploy/
./build.sh --deploy  # build, then sync to S3 (prompts before touching the bucket)
```

There is no lint step and no dev server. Open the HTML files directly, or serve the repo
root with any static server; the pages use relative paths and work either way.

## Tests

Three suites, 30 tests, all passing. They live in `assets/scripts/tests/` and cover
`updateCopyrightYear`, `startGame` and `leaveGame`, plus the pure decision helpers
extracted from `game.js` in #84 — `judgeGuess`, `roundIsWon`, `isValidWager`,
`aceValueFor`/`amendCardsObject`/`decideAces`, `nextGameState` and `resolveHighScore`.
Those helpers hold the decisions only; the callers keep every DOM and state side effect,
so the tests never stand up a game DOM. The rest of `game.js` stays uncovered, which is
why statement coverage sits around 24%.

Each script file ends with a guarded export so Jest can `require()` it without breaking the
browser, which never dereferences `module`:

```js
if (typeof module !== "undefined") { module.exports = { updateCopyrightYear }; }
```

This replaced an earlier workflow in which the export lines were added by hand before a test
run and deleted before committing. A bare `module.exports` throws
`Uncaught ReferenceError: module is not defined` in the browser, which is why it was removed
in `c616128`; the guard keeps the export permanently without that cost. [TESTING.md](TESTING.md)
(around line 280) reflects the current arrangement.

`assets/scripts/game.js` calls `shuffleCards()` at the bottom of the file, so merely
requiring it in a suite would fire a `fetch` that jsdom cannot service. `jest.setup.js` stubs
`global.fetch` with a promise that never settles, and `jest.config.js` loads it through
`setupFiles`, so the module imports quietly.

## Architecture

**`assets/scripts/game.js`** holds effectively all the game logic in module-level mutable
state (`playerPoints`, `roundCount`, `currentCardIndex`, `dealtCards`, `gameEnded`, …) with
functions mutating it directly. There is no state container and no separation between logic
and DOM — functions like `calculateOutcome()` update the score and then call
`continueGame()`, which builds a modal. Reading one function rarely tells you the whole
story; trace the call chain.

The round flow is: `shuffleCards()` → `drawCards()` (fetches 5 cards) → `getWager()` →
`handleWagerSubmit()` → `playerChoice()` → `flipCard()` → `calculateOutcome()` →
`continueGame()` → `decideGameState()`, which either draws again, triggers `finalRound()`
(7 cards remaining), `noPoints()` (bankrupt), or `gameOver()` (round 10).

Card values live in `cardsObject`, keyed by the API's card codes (`cardAS`, `card0H` — note
`0` means ten). Aces are re-valued 1 or 14 at random each round by `decideAces()` →
`amendCardsObject()`, so the same key can mean different things between rounds.

Modals are hand-rolled: `createModal()` injects a Bootstrap-markup string into the body and
`deleteModal()` removes it. Bootstrap's JS is not driving them — `displayModal()` sets
`style.display` and adds the `show` class manually. Each `create` must be paired with a
`delete`, or listeners accumulate on stale nodes.

The high score is the only persisted state, in `localStorage` under `high-score`.

`general.js` (copyright year, loaded on every page) and `index.js` (Play button) are a few
lines each.

## Build and deployment

`build.sh` copies an **allowlist** into `deploy/` — `PAGES=(index.html game.html faq.html
404.html)` and `DIRS=(assets)`. A new top-level page will not ship until it is added to that
array. `deploy/` is wiped on every run and is gitignored.

Deployment is S3 + CloudFront in `eu-west-2` (bucket `portfolio-dominicfrancis`, folder
`hi-lo`, distribution `E3BVAHCA09RLS3`). The bucket holds several sites, one folder each.
The distribution reads the folder through an origin path, so page addresses do not change. `.github/workflows/deploy.yml` runs the same `build.sh` on
every push to `main` that touches `*.html`, `assets/**`, `build.sh`, or the workflow itself,
authenticating via OIDC — no stored keys. The IAM role is defined in
`infra/deploy-role.yaml` (CloudFormation stack `hi-lo-card-game-deploy-role`) and is scoped
to the `hi-lo` folder and that one distribution, trusting only this repo's `main` branch. It
cannot touch another site's folder, so a wrong path in `build.sh` cannot erase one.

Because CI and local deploys run the identical script, they cannot drift. Assets upload with
a one-year immutable `Cache-Control`; HTML uploads last with `no-cache`, so a page never goes
live referencing an asset that has not uploaded yet.

The live site is at `hi-lo.dominicfrancis.co.uk`, a CloudFront alias. GitHub Pages served the
original deployment and README.md still documents that setup as history, under its own
heading.

## Repo conventions and leftovers

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`), and work
  merges to `main` via PR.
- `documentation/` is Code Institute assessment material (wireframes, flowcharts, validation
  reports, bug log). It is not part of the site and `build.sh` deliberately excludes it.
- `README.md` and `TESTING.md` are assessment deliverables and are long and structured. Keep
  their existing format if you edit them.
- The Code Institute template scaffolding (`.vscode/`, `.gitpod.yml`, `.gitpod.dockerfile`)
  was removed in #85. It configured Python, Postgres, Mongo and Heroku, none of which this
  project uses. `.gitignore` no longer carries the Python entries either.
