# Oregano Site Rebuild

This is a Next.js rebuild based on the saved site snapshots in `../website`.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Routes

- `/` home
- `/blog` blog index
- `/quotes` interactive quotes knowledge graph (3D)
- `/zork` zork page

## Quotes graph

- Page: `app/quotes/page.js`
- Graph component: `components/quotes/QuotesKnowledgeGraph.js`
- Data source: `data/quotes.js`

The graph links quotes by shared secondary hashtags and supports hashtag cluster filtering.

## Scripts

- `npm run dev` start local development server
- `npm run build` production build
- `npm run start` serve production build
- `npm run lint` lint checks
- `npm run clean` remove `.next` build artifacts
