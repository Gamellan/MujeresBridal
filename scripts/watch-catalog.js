import { promises as fs } from "fs";
import path from "path";
import { watch } from "fs";

const catalogDir = path.join(process.cwd(), "public", "catalog");
const outputPath = path.join(process.cwd(), "public", "catalog-data.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

const titleCase = (slug) =>
  slug
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

async function readMeta(metaPath) {
  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

async function collectEntries(root) {
  const entries = [];

  async function walk(dir, relativeRoot = "") {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const metaPath = path.join(dir, "meta.json");
    const hasMeta = dirents.some((d) => d.isFile() && d.name === "meta.json");
    const images = dirents
      .filter((d) => d.isFile() && imageExtensions.has(path.extname(d.name).toLowerCase()))
      .map((d) => path.join("catalog", relativeRoot, d.name).replace(/\\/g, "/"));

    if (hasMeta || images.length > 0) {
      const meta = hasMeta ? await readMeta(metaPath) : null;
      const slug = relativeRoot || path.basename(dir);
      entries.push({
        slug,
        name: meta?.name || titleCase(slug),
        description: meta?.description || "",
        price: typeof meta?.price === "number" ? meta.price : null,
        currency: meta?.currency || "PHP",
        readyToWear: meta?.readyToWear ?? true,
        madeToOrder: meta?.madeToOrder ?? false,
        forSale: meta?.forSale ?? true,
        forRent: meta?.forRent ?? false,
        images,
        cover: images[0] || null,
        tags: Array.isArray(meta?.tags) ? meta.tags : []
      });
    }

    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const nextRel = path.join(relativeRoot, dirent.name);
        await walk(path.join(dir, dirent.name), nextRel);
      }
    }
  }

  await walk(root, "");
  return entries;
}

async function generate() {
  try {
    const entries = await collectEntries(catalogDir);
    const sorted = entries.sort((a, b) => a.name.localeCompare(b.name));
    const payload = { updatedAt: new Date().toISOString(), dresses: sorted };
    await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`✓ Catalog updated: ${sorted.length} entries at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error("✗ Failed to generate catalog", err);
  }
}

// Initial generation
await generate();

// Watch for changes
console.log(`\n👀 Watching ${path.relative(process.cwd(), catalogDir)} for changes...\n`);

const watcher = watch(catalogDir, { recursive: true }, async (eventType, filename) => {
  if (filename) {
    console.log(`Detected ${eventType} in ${filename}`);
    await generate();
  }
});

process.on("SIGINT", () => {
  console.log("\nStopping watcher...");
  watcher.close();
  process.exit(0);
});
