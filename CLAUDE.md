# CLAUDE.md

## Context

CS 1710 final project (personal copy): CEO pay vs. median worker pay, for labor union representatives. Right now the site holds two Milestone 6 dashboard prototypes that explore one question: which sectors and companies have the biggest CEO-to-worker pay gaps?

## Commands

```sh
npm install
npm run dev        # http://localhost:5173 (pages: /, /prototype-a, /prototype-b)
npm run build      # static site in build/ (adapter-static, every page pre-rendered)
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`. The workflow sets `BASE_PATH` to the repo name, so links must use `resolve()` and files must use `asset()` from `$app/paths`.

## Stack (same as the course labs)

- SvelteKit 3 on Vite 8, plain JavaScript, Svelte 5 runes forced in `vite.config.js`.
- D3 v7 handles scales, axes, CSV loading and the brush. Svelte renders the marks with `{#each}`. D3 only draws inside its own axis and brush `<g>` elements.
- `src/lib` is imported as `#lib/...`.

## Coordination rules

- Shared selections live in each `+page.svelte`. Each selection has one owner, and components report events through `on...` callbacks.
- Linking = highlight (dim non-matches, remove nothing). Filtering = remove non-matches and recompute. Each filtered view reads the same `$derived` subset.
- Prototype A: sector bars (full data) → hover links the company strip, click filters the strip and summary.
- Prototype B: scatterplot brush (full data) → filters the sector bars and summary. Sector hover links the scatterplot. A dot click picks a company for the workdays card.

## Data: `static/data/ceo_data_pay_merged_sp500.csv`

- Kaggle copy of AFL-CIO Executive Paywatch, 492 S&P 500 companies, fiscal year 2021 (despite the "2022–23" Kaggle title).
- `salary` is the CEO's **total** compensation, not base salary. Money is text ("$25,670,673") and the ratio is text ("1,013:1"). `industry` uses `%20` for spaces. The first column is an unnamed row index.
- Each company defines its own "median employee", so expect outliers. Ratios run 2:1 to 6,474:1, so use log scales.
- Workdays = 260 / pay ratio (260 workdays per year).
