import { ADMIN_PASSWORD } from "./admin-config.js";

export const adminModule = {
  isLoggedIn: false,
  dresses: [],

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

  // Load dresses from localStorage or passed data
  loadDresses(catalogData) {
    const stored = localStorage.getItem("mujersBridalDresses");
    if (stored) {
      try {
        this.dresses = JSON.parse(stored);
      } catch (err) {
        this.dresses = catalogData || [];
      }
    } else {
      this.dresses = catalogData || [];
      this.saveDresses();
    }
  },

  saveDresses() {
    localStorage.setItem("mujersBridalDresses", JSON.stringify(this.dresses));
  },

  // CRUD operations
  addDress(dress) {
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
    this.saveDresses();
    return newDress;
  },

  updateDress(slug, updates) {
    const index = this.dresses.findIndex((d) => d.slug === slug);
    if (index !== -1) {
      this.dresses[index] = { ...this.dresses[index], ...updates };
      this.saveDresses();
      return this.dresses[index];
    }
    return null;
  },

  deleteDress(slug) {
    const index = this.dresses.findIndex((d) => d.slug === slug);
    if (index !== -1) {
      const removed = this.dresses.splice(index, 1);
      this.saveDresses();
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
  }
};
