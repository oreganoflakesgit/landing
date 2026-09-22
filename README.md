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
- `/zork` zork page
- `/home/` interactive flat viewer

## Update the flat viewer

The Home tab embeds a static build in `public/flat-3d`. GitHub Pages publishes
these files with the rest of the site. The original flat project stays separate.
Only its built viewer and public images are copied; local audits, cached manuals
and other project documents are excluded.

1. Install the flat project's dependencies if needed (`npm ci` in that project).
2. Run `npm run sync:home` here to build a snapshot of `../home/flat-3d`.
3. Run `npm run build` to check the complete site.
4. Commit the updated `public/flat-3d` files with any site changes.
5. Push to `main` to trigger the existing GitHub Pages workflow.

For a different source directory, use `npm run sync:home -- /absolute/path/to/flat-3d`.
Edits to the original project appear online only after this update process.

## Scripts

- `npm run dev` start local development server
- `npm run build` production build
- `npm run start` serve production build
- `npm run lint` lint checks
- `npm run clean` remove `.next` build artifacts
