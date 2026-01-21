# Mujeres Bridal catalog

Simple, light catalog site for Mujeres Bridal. Built with Vite (vanilla JS) and designed for GitHub Pages. All content is data-driven from the `public/catalog` folder.

## Quick start

1. Install dependencies: `npm install`
2. Generate catalog data from the images/metadata in `public/catalog`: `npm run generate`
3. Start the dev server: `npm run dev`
4. (Optional) In a separate terminal, run `npm run watch` to auto-regenerate catalog data when you add/edit files in `public/catalog`
5. Build static site (outputs to `docs/` for GitHub Pages): `npm run build`

## Development workflow with auto-reload

For the best development experience with automatic updates:

1. Open **two terminals**:
   - Terminal 1: `npm run watch` — auto-regenerates `catalog-data.json` when you add/change images or `meta.json` files
   - Terminal 2: `npm run dev` — runs Vite dev server with hot reload at http://localhost:5173/

2. Now you can:
   - Add/edit images in `public/catalog/` folders
   - Update `meta.json` files
   - Edit CSS or JavaScript
   - See changes **instantly in the browser** without manual refreshes

3. When ready to deploy: `npm run build` (creates/updates `docs/` folder for GitHub Pages)

## Adding dresses

1. Create a folder inside `public/catalog/` (you can nest folders). Example: `public/catalog/river-gown/`.
2. Drop one or more images inside that folder (supported: .jpg, .jpeg, .png, .webp, .avif, .svg).
3. Add an optional `meta.json` next to the images:

```json
{
  "name": "River Gown",
  "description": "Bias-cut silk with soft drape.",
  "price": 1450,
  "currency": "PHP",
  "readyToWear": true,
  "madeToOrder": true,
  "forSale": true,
  "forRent": false,
  "tags": ["silk", "bias-cut"]
}
```

Fields:
- `name` (string) — defaults to the folder name in Title Case.
- `description` (string) — optional.
- `price` (number) — optional; when missing, the UI shows “Request pricing”.
- `currency` (string, ISO code) — defaults to `PHP`.
- `readyToWear` (boolean) — defaults to `true`.
- `madeToOrder` (boolean) — defaults to `false`.
- `forSale` (boolean) — defaults to `true`.
- `forRent` (boolean) — defaults to `false`.
- `tags` (array of strings) — optional, for future use.

4. Run `npm run generate` to rebuild `public/catalog-data.json`.
5. Run `npm run dev` to preview or `npm run build` to publish.

## Deploying to GitHub Pages

- The build outputs to `docs/`, which GitHub Pages can serve from the `main` branch (Settings → Pages → Branch: `main`, Folder: `docs/`).
- After adding new images/metadata, run `npm run generate && npm run build`, commit, and push.

### Fast picture-adding checklist
- Drop new photos (JPG/PNG/WebP/AVIF/SVG) inside a new folder under `public/catalog/<dress-name>/`. Nested folders are fine.
- Add/update `meta.json` in that same folder with price in PHP and flags for ready-to-wear / made-to-order / sale / rent.
- Run `npm run generate` to refresh `catalog-data.json` from the folder contents.
- Run `npm run dev` to preview locally, or `npm run build` to update `docs/` for GitHub Pages.

## Palette

Using a light, bridal-inspired palette drawn from the provided reference:
- Background: #f8f6f3
- Accent: #d3b18f
- Ink: #1f1b16
- Muted: #5f554a
- Soft greens/tans for secondary pills.
