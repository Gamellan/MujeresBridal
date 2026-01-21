# Configuration Guide

## Overview
- **Purpose:** Simple, static bridal dress catalog
- **Hosting:** GitHub Pages (serves from `docs/`)
- **Data source:** `public/catalog-data.json` generated from `public/catalog/`
- **No admin panel, no local database** – purely static for catalog viewing

## How to Add or Update Dresses

1. Create a folder in `public/catalog/` with a unique name (e.g., `river-gown/`)
2. Add dress images (JPG, PNG, WebP, AVIF, SVG) to that folder
3. Optionally create a `meta.json` file with details:

```json
{
  "name": "River Gown",
  "description": "Bias-cut silk with soft drape.",
  "price": 14500,
  "currency": "PHP",
  "readyToWear": true,
  "madeToOrder": true,
  "forSale": true,
  "forRent": false,
  "tags": ["silk", "bias-cut"]
}
```

4. Run `npm run generate` to rebuild `public/catalog-data.json` from folders
5. Run `npm run build` to build static site (outputs to `docs/`)
6. Commit and push to GitHub — Pages will automatically serve updates

## Local Development

```bash
npm install          # Install dependencies
npm run generate     # Generate catalog data from public/catalog/
npm run dev          # Start dev server at http://localhost:5173/
npm run watch        # Watch public/catalog/ and auto-regenerate data
npm run build        # Build static site to docs/
```

### Development Workflow

For fastest feedback, open two terminals:

**Terminal 1:**
```bash
npm run watch
```
Auto-regenerates `public/catalog-data.json` when you add/edit files or folders.

**Terminal 2:**
```bash
npm run dev
```
Runs Vite dev server with hot reload.

Now you can:
- Add/edit images in `public/catalog/` folders
- Add/update `meta.json` files  
- Watch changes **instantly in the browser**

## Fields in meta.json

All fields are optional (defaults are used if missing):

| Field | Type | Default |
|-------|------|---------|
| `name` | string | Folder name (title-cased) |
| `description` | string | (empty) |
| `price` | number | (null → shows "Request pricing") |
| `currency` | string | `"PHP"` |
| `readyToWear` | boolean | `true` |
| `madeToOrder` | boolean | `false` |
| `forSale` | boolean | `true` |
| `forRent` | boolean | `false` |
| `tags` | array | `[]` |

## Deploying to GitHub Pages

1. Ensure GitHub Pages is set to serve from `main` branch, `docs/` folder
2. After adding/editing dresses:
   ```bash
   npm run generate && npm run build
   ```
3. Commit and push:
   ```bash
   git add -A
   git commit -m "Add new dress or update catalog"
   git push
   ```
4. Pages automatically deploys within seconds

## Cache Busting

The app fetches `catalog-data.json` with a timestamp query parameter (`?t=...`) to avoid stale caches. This ensures users always see the latest catalog after a push.

## Folder Structure Example

```
public/catalog/
├── river-gown/
│   ├── dress-1.jpg
│   ├── dress-2.jpg
│   └── meta.json
├── rose-gown/
│   ├── photo.png
│   └── meta.json
└── sample-dress/
    └── placeholder.svg
```

## Gallery Features

- Responsive grid on catalog page
- Click dress cards to view details
- In detail view:
  - Click thumbnails to change main image
  - Use ‹ › buttons to navigate images
  - Press left/right arrow keys
  - Swipe left/right on mobile
- Filters by ready-to-wear, made-to-order, for sale, for rent

## Troubleshooting

**Catalog not updating after push:**
- Run `npm run generate` to rebuild `catalog-data.json`
- Run `npm run build` to update `docs/`
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R) if needed

**Images not showing:**
- Ensure images are in a subfolder under `public/catalog/`
- Supported formats: JPG, PNG, WebP, AVIF, SVG
- Check file paths in `meta.json` if using custom URLs

**Want to preview locally:**
- Run `npm run dev` and open http://localhost:5173/MujeresBridal
- Or run `npm run build` then open `docs/index.html` in a browser

