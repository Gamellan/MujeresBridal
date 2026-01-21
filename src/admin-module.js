import { ADMIN_PASSWORD } from "./admin-config.js";
import { githubModule } from "./github-module.js";

const DB_NAME = "MujeresBridalDB";
const STORE_NAME = "dresses";

// IndexedDB setup
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "slug" });
      }
    };
  });
};

export const adminModule = {
  isLoggedIn: false,
  dresses: [],
  db: null,

  // Initialize DB
  async init() {
    try {
      this.db = await initDB();
      await this.loadDresses();
    } catch (err) {
      console.error("Failed to init DB:", err);
    }
  },

  // Login
  login(password) {
    if (password === ADMIN_PASSWORD) {
      this.isLoggedIn = true;
      sessionStorage.setItem("adminLoggedIn", "true");
      return true;
    }
    return false;
  },

  logout() {
    this.isLoggedIn = false;
    sessionStorage.removeItem("adminLoggedIn");
  },

  checkSession() {
    this.isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
    return this.isLoggedIn;
  },

  // Load dresses from IndexedDB or fallback to passed data
  async loadDresses(fallbackData = []) {
    return new Promise((resolve) => {
      if (!this.db) {
        this.dresses = fallbackData;
        resolve();
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        this.dresses = request.result.length > 0 ? request.result : fallbackData;
        resolve();
      };

      request.onerror = () => {
        this.dresses = fallbackData;
        resolve();
      };
    });
  },

  // Save dresses to IndexedDB
  async saveDresses() {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Clear and re-add all
      store.clear();
      this.dresses.forEach((dress) => store.add(dress));

      transaction.onsuccess = async () => {
        // Trigger GitHub Action workflow to update catalog
        const payload = {
          updatedAt: new Date().toISOString(),
          dresses: this.dresses
        };
        const success = await githubModule.saveCatalogToGitHub(payload);
        if (success) {
          console.log("📤 Catalog sync triggered. Changes will appear in ~30 seconds.");
        } else {
          console.warn("⚠️ Catalog sync failed. Changes saved locally only.");
        }
        resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  },

  // CRUD operations
  async addDress(dress) {
    const newDress = {
      slug: this.generateSlug(dress.name),
      name: dress.name,
      description: dress.description,
      price: dress.price ? parseFloat(dress.price) : null,
      currency: dress.currency || "PHP",
      readyToWear: dress.readyToWear || false,
      madeToOrder: dress.madeToOrder || false,
      forSale: dress.forSale || false,
      forRent: dress.forRent || false,
      images: dress.images || [],
      cover: dress.cover || null,
      tags: dress.tags || []
    };
    this.dresses.push(newDress);
    await this.saveDresses();
    return newDress;
  },

  async updateDress(slug, updates) {
    const index = this.dresses.findIndex((d) => d.slug === slug);
    if (index !== -1) {
      this.dresses[index] = { ...this.dresses[index], ...updates };
      await this.saveDresses();
      return this.dresses[index];
    }
    return null;
  },

  async deleteDress(slug) {
    const index = this.dresses.findIndex((d) => d.slug === slug);
    if (index !== -1) {
      const removed = this.dresses.splice(index, 1);
      await this.saveDresses();
      return removed[0];
    }
    return null;
  },

  getDress(slug) {
    return this.dresses.find((d) => d.slug === slug);
  },

  getDresses() {
    return this.dresses;
  },

  // Image handling
  async convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Utility
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },

  exportJSON() {
    const payload = {
      updatedAt: new Date().toISOString(),
      dresses: this.dresses
    };
    return JSON.stringify(payload, null, 2);
  },

  async importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.dresses)) {
        this.dresses = data.dresses;
        await this.saveDresses();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Import failed:", err);
      return false;
    }
  }
};
