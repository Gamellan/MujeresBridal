# Mujeres Bridal Catalog

Simple, elegant bridal dress catalog for Mujeres Bridal. Built with Vite (vanilla JS) and hosted on GitHub Pages. All content is data-driven from the `public/catalog/` folder structure.

**No admin panel. No database. Just beautiful dresses.**

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add a dress:**
   - Create folder: `public/catalog/my-dress-name/`
   - Drop images inside (JPG, PNG, WebP, AVIF, SVG)
   - Optionally add `meta.json` with name, price, description, flags

3. **Generate catalog data:**
   ```bash
   npm run generate
   ```

4. **Preview locally:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173/MujeresBridal

5. **Build and deploy:**
   ```bash
   npm run build
   npm run generate
   ```
   Commit and push. GitHub Pages auto-deploys.

## Development Workflow (Recommended)

Open two terminals:

**Terminal 1 – Watch for changes:**
```bash
npm run watch
```
Auto-regenerates `public/catalog-data.json` whenever you add/edit images or metadata.

**Terminal 2 – Dev server:**
```bash
npm run dev
```
Hot-reload at http://localhost:5173/MujeresBridal

Now you can:
- Add/edit images in `public/catalog/` folders
- Add/update `meta.json` files
- See changes **instantly** in the browser

## Adding a Dress

### Minimal (no metadata)
```
public/catalog/
└── my-dress/
    ├── image1.jpg
    ├── image2.png
    └── image3.webp
```

The app auto-generates the name from the folder (e.g., "My Dress").

### With Metadata
```
public/catalog/
└── my-dress/
    ├── image1.jpg
    ├── image2.png
    └── meta.json
```

**meta.json:**
```json
{
  "name": "Elegant Rose Gown",
  "description": "Hand-finished silk with delicate beading.",
  "price": 18500,
  "currency": "PHP",
  "readyToWear": true,
  "madeToOrder": true,
  "forSale": true,
  "forRent": false,
  "tags": ["silk", "elegant", "beaded"]
}
```

### Metadata Fields

All fields are **optional**. Defaults are used if omitted:

| Field | Type | Default |
|-------|------|---------|
| name | string | Folder name (title-cased) |
| description | string | (empty) |
| price | number | null → "Request pricing" |
| currency | string | "PHP" |
| readyToWear | boolean | true |
| madeToOrder | boolean | false |
| forSale | boolean | true |
| forRent | boolean | false |
| tags | array | [] |

## Image Formats Supported

- **JPG / JPEG** – High compression, fast
- **PNG** – Lossless, good for graphics
- **WebP** – Modern, smaller file sizes
- **AVIF** – Next-gen compression
- **SVG** – Vector, perfect for logos/graphics

Recommended: WebP for photos, SVG for illustrations. Optimize images before adding (smaller = faster load).

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Build static site to docs/
npm run generate     # Regenerate catalog-data.json from public/catalog/
npm run watch        # Watch public/catalog and auto-regenerate
```

## Deployment

### GitHub Pages (Recommended)

1. Ensure repo settings → Pages → Branch: `main`, Folder: `docs/`
2. When ready to deploy:
   ```bash
   npm run generate && npm run build
   git add -A && git commit -m "Update catalog" && git push
   ```
3. Pages auto-deploys within ~1 minute

### Cache Busting

The app automatically adds a timestamp to catalog fetches (`?t=...`), so users always see the latest version after a push. Hard refresh (Ctrl+Shift+R) will clear any browser cache.

## Features

- **Responsive grid** – Auto-layouts on mobile, tablet, desktop
- **Catalog filters** – By ready-to-wear, made-to-order, for sale, for rent
- **Detail view** – Click dress card to see full gallery
- **Image gallery:**
  - Click thumbnails to change main image
  - Use ‹ › buttons to navigate
  - Keyboard arrows (← →) for navigation
  - Swipe left/right on mobile
- **No dependencies on server** – All static, client-side
- **Fast** – Minimal JS, optimized CSS, instant page loads

## Color Palette

- Background: `#f8f6f3` (soft cream)
- Accent: `#d3b18f` (warm tan)
- Ink: `#1f1b16` (dark brown)
- Muted: `#5f554a` (medium brown)

Perfect for a bridal aesthetic.

## Troubleshooting

**Catalog not updating:**
- Run `npm run generate` to rebuild from `public/catalog/`
- Run `npm run build` to update `docs/`
- Push to GitHub; Pages should update within 1 min
- Hard refresh browser if needed

**Images not showing:**
- Check images are in a subfolder under `public/catalog/`
- Verify file formats (JPG, PNG, WebP, AVIF, SVG)
- Optimize large images (>2MB per image)

**Want to preview without pushing:**
- Run `npm run dev` then open http://localhost:5173/MujeresBridal
- Or build locally: `npm run build` then open `docs/index.html`

## Project Structure

```
.
├── public/
│   ├── logo.png
│   └── catalog/              # Add dresses here
│       ├── dress-1/
│       │   ├── image.jpg
│       │   └── meta.json
│       └── dress-2/
│           └── image.png
├── src/
│   ├── main.js              # App logic
│   └── style.css            # Styles
├── docs/                    # GitHub Pages output
├── scripts/
│   ├── generate-catalog.js  # Builds catalog-data.json
│   └── watch-catalog.js     # Watches for changes
└── vite.config.js          # Build config
```

## License

Mujeres Bridal © 2026. All rights reserved.
