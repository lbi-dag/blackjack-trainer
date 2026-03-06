# Blackjack Basic Strategy Trainer

A single-page React trainer for memorizing multi-deck blackjack basic strategy under standard casino rules.

## Product Features

- Opening-hand decision training for `Hit`, `Stand`, `Double`, `Split`, and `Surrender`
- Basic strategy engine for standard `4-8 deck`, `S17` (dealer stands on soft 17), and `DAS` (double after split) rules
- Immediate feedback loop:
  - correct answers trigger a short success state and auto-deal the next hand
  - incorrect answers freeze the UI, show the correct move, and explain why it is correct
- Practice modes:
  - `Random Mode`
  - `Soft Hands Only`
- Accuracy tracking with running correct/attempt counts and percentage
- In-app `Rules & Strategy` reference page
- Hint system on the trainer page that shows the matching reference-table rule for the current hand
- Dark casino-style UI with felt/charcoal styling and suit icons on cards

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Vitest

## Architecture Design

### 1. App Shell

The app is a route-free single-page experience managed from [`src/App.tsx`](/Users/bilon/dev/blackjack-trainer/src/App.tsx).

Responsibilities:
- manage current view (`trainer` vs `reference`)
- manage trainer state (`mode`, current hand, accuracy counters, feedback state, hint visibility)
- evaluate the user's move against the strategy engine
- coordinate auto-advance after correct answers

### 2. Domain Model

Shared game and UI types live in [`src/types/game.ts`](/Users/bilon/dev/blackjack-trainer/src/types/game.ts).

This centralizes:
- card shape
- move names
- training modes
- strategy engine input contracts
- feedback/action availability types

### 3. Strategy Layer

#### `strategyEngine`
[`src/utils/strategyEngine.ts`](/Users/bilon/dev/blackjack-trainer/src/utils/strategyEngine.ts)

Responsibilities:
- determine the perfect move for a starting hand
- enforce decision order: surrender -> split -> soft totals -> hard totals
- explain why the correct move is recommended

Implementation notes:
- uses explicit lookup tables for hard totals, soft totals, and pairs
- keeps rule evaluation pure and UI-independent

#### `strategyReference`
[`src/utils/strategyReference.ts`](/Users/bilon/dev/blackjack-trainer/src/utils/strategyReference.ts)

Responsibilities:
- store the summary rules shown on the `Rules & Strategy` page
- map a live player hand to the matching table row for the hint feature

This keeps the hint system and reference page aligned to the same source of truth.

### 4. Card / Hand Utilities

[`src/utils/deckUtils.ts`](/Users/bilon/dev/blackjack-trainer/src/utils/deckUtils.ts)

Responsibilities:
- generate random cards and training hands
- evaluate hand totals
- treat aces as `1` or `11`
- identify soft hands and pairs
- generate mode-specific practice prompts

The trainer uses an infinite-shoe style generator, so each hand is independent and optimized for repetition rather than deck simulation.

### 5. UI Components

- [`src/components/TrainerBoard.tsx`](/Users/bilon/dev/blackjack-trainer/src/components/TrainerBoard.tsx): dealer/player hand layout, hint toggle, feedback, action buttons
- [`src/components/ReferenceGuide.tsx`](/Users/bilon/dev/blackjack-trainer/src/components/ReferenceGuide.tsx): rules and strategy reference page
- [`src/components/StatsBar.tsx`](/Users/bilon/dev/blackjack-trainer/src/components/StatsBar.tsx): running accuracy summary
- [`src/components/ModeSwitch.tsx`](/Users/bilon/dev/blackjack-trainer/src/components/ModeSwitch.tsx): practice-mode selector
- [`src/components/CardPill.tsx`](/Users/bilon/dev/blackjack-trainer/src/components/CardPill.tsx): reusable card presentation

### 6. Styling

- [`src/index.css`](/Users/bilon/dev/blackjack-trainer/src/index.css) contains Tailwind layers plus project-specific visual styles
- [`tailwind.config.js`](/Users/bilon/dev/blackjack-trainer/tailwind.config.js) extends the theme with custom felt, charcoal, brass, and animation tokens

## Repo Structure

```text
.
|-- src/
|   |-- components/
|   |   |-- CardPill.tsx
|   |   |-- ModeSwitch.tsx
|   |   |-- ReferenceGuide.tsx
|   |   |-- StatsBar.tsx
|   |   `-- TrainerBoard.tsx
|   |-- types/
|   |   `-- game.ts
|   |-- utils/
|   |   |-- deckUtils.ts
|   |   |-- deckUtils.test.ts
|   |   |-- strategyEngine.ts
|   |   |-- strategyEngine.test.ts
|   |   |-- strategyReference.ts
|   |   `-- strategyReference.test.ts
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Testing

Vitest coverage currently focuses on the logic layer:

- strategy engine decision correctness
- ace valuation and hand classification
- mode-specific hand generation
- hand-to-reference hint mapping

## Design Constraints

Current trainer scope is intentionally narrow:
- only opening two-card decisions are trained
- no post-hit branching or dealer hand resolution
- no persistence across reloads
- no external state management library

That keeps the app focused on fast repetition and memorization of correct basic strategy.
