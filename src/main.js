import "./style.css";
import { adminModule } from "./admin-module.js";

const app = document.querySelector("#app");

const state = {
  dresses: [],
  filters: {
    readyToWear: false,
    madeToOrder: false,
    forSale: false,
    forRent: false
  },
  currentView: "catalog",
  selectedDress: null
};

const formatPrice = (price, currency = "PHP") => {
  if (typeof price !== "number") return "Request pricing";
  try {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(price);
  } catch (err) {
    return `${price} ${currency}`;
  }
};

const tag = (label, variant = "") => {
  const span = document.createElement("span");
  span.className = `pill ${variant}`.trim();
  span.textContent = label;
  return span;
};

const renderLayout = () => {
  app.innerHTML = `
    <main class="page">
      <header class="logo-header">
        <div class="logo-container">
          <img src="logo.png" alt="Mujeres Bridal" class="logo" />
          <button id="admin-toggle-btn" class="admin-toggle" title="Admin panel">⚙️</button>
        </div>
      </header>
      
      <section class="hero">
        <div class="hero__content">
          <p class="lede">
            Bridal gowns crafted by independent tailors in Vietnam. Discover ready-to-wear silhouettes and made-to-order pieces with transparent pricing.
          </p>
          <div class="hero__pills">
            <span class="pill soft">Ready to wear</span>
            <span class="pill soft">Made to order</span>
            <span class="pill outline">For sale</span>
            <span class="pill outline">For rent</span>
          </div>
        </div>
        <div class="hero__card">
          <div class="hero__badge">Catalog</div>
          <p class="hero__metric">Tailored with care</p>
          <p class="hero__sub">Independent ateliers • Minimal silhouettes • Honest pricing</p>
        </div>
      </section>

      <section class="filters" aria-label="catalog filters">
        <div class="filter-group">
          <button class="filter" data-filter="readyToWear" aria-pressed="false">Ready to wear</button>
          <button class="filter" data-filter="madeToOrder" aria-pressed="false">Made to order</button>
          <button class="filter" data-filter="forSale" aria-pressed="false">For sale</button>
          <button class="filter" data-filter="forRent" aria-pressed="false">For rent</button>
        </div>
        <div class="meta" id="result-meta"></div>
      </section>

      <section id="catalog" class="catalog" aria-live="polite"></section>
    </main>
  `;
};

const applyFilters = () => {
  const { dresses, filters } = state;
  const hasActiveFilters = Object.values(filters).some(v => v === true);
  
  if (!hasActiveFilters) return dresses;
  
  return dresses.filter((dress) => {
    const matchesReady = filters.readyToWear ? dress.readyToWear : false;
    const matchesMade = filters.madeToOrder ? dress.madeToOrder : false;
    const matchesSale = filters.forSale ? dress.forSale : false;
    const matchesRent = filters.forRent ? dress.forRent : false;
    return matchesReady || matchesMade || matchesSale || matchesRent;
  });
};

const renderCatalog = () => {
  const list = applyFilters();
  const catalogEl = document.querySelector("#catalog");
  const metaEl = document.querySelector("#result-meta");

  if (!catalogEl || !metaEl) return;

  metaEl.textContent = `${list.length} style${list.length === 1 ? "" : "s"} shown`;

  if (list.length === 0) {
    catalogEl.innerHTML = `<p class="empty">No dresses match these filters yet. Try toggling another option.</p>`;
    return;
  }

  catalogEl.innerHTML = "";

  for (const dress of list) {
    const card = document.createElement("article");
    card.className = "card";
    card.style.cursor = "pointer";

    const cover = document.createElement("div");
    cover.className = "card__cover";
    if (dress.cover) {
      cover.style.backgroundImage = `url(${dress.cover})`;
    }

    const badgeRow = document.createElement("div");
    badgeRow.className = "card__badges";

    if (dress.readyToWear) badgeRow.appendChild(tag("Ready to wear", "soft"));
    if (dress.madeToOrder) badgeRow.appendChild(tag("Made to order", "soft"));
    if (dress.forSale) badgeRow.appendChild(tag("For sale", "outline"));
    if (dress.forRent) badgeRow.appendChild(tag("For rent", "outline"));

    const body = document.createElement("div");
    body.className = "card__body";

    const title = document.createElement("h3");
    title.textContent = dress.name;

    const desc = document.createElement("p");
    desc.className = "card__desc";
    desc.textContent = dress.description || "Minimal bridal silhouette.";

    const price = document.createElement("p");
    price.className = "card__price";
    price.textContent = formatPrice(dress.price, dress.currency);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(price);

    card.appendChild(cover);
    card.appendChild(badgeRow);
    card.appendChild(body);

    card.addEventListener("click", () => {
      state.selectedDress = dress;
      state.currentView = "detail";
      renderDetail();
    });

    catalogEl.appendChild(card);
  }
};

const setupFilters = () => {
  const buttons = document.querySelectorAll(".filter");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-filter");
      state.filters[key] = !state.filters[key];
      btn.setAttribute("aria-pressed", String(state.filters[key]));
      btn.classList.toggle("active", state.filters[key]);
      renderCatalog();
    });
  });
};

const renderDetail = () => {
  const dress = state.selectedDress;
  if (!dress) return;

  app.innerHTML = `
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>
      
      <div class="detail-container">
        <button class="back-btn" id="back-btn">← Back to catalog</button>
        
        <div class="detail-content">
          <div class="detail-gallery">
            <div class="detail-main-image">
              <img src="${dress.cover}" alt="${dress.name}" />
            </div>
            ${
              dress.images && dress.images.length > 1
                ? `<div class="detail-thumbnails">
                    ${dress.images
                      .map(
                        (img) =>
                          `<img src="${img}" alt="thumbnail" class="detail-thumb" data-image="${img}">`
                      )
                      .join("")}
                  </div>`
                : ""
            }
          </div>
          
          <div class="detail-info">
            <h1>${dress.name}</h1>
            <p class="detail-description">${dress.description || "Minimal bridal silhouette."}</p>
            
            <div class="detail-price">${formatPrice(dress.price, dress.currency)}</div>
            
            <div class="detail-badges">
              ${dress.readyToWear ? `<span class="pill soft">Ready to wear</span>` : ""}
              ${dress.madeToOrder ? `<span class="pill soft">Made to order</span>` : ""}
              ${dress.forSale ? `<span class="pill outline">For sale</span>` : ""}
              ${dress.forRent ? `<span class="pill outline">For rent</span>` : ""}
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    state.currentView = "catalog";
    state.selectedDress = null;
    renderLayout();
    setupFilters();
    renderCatalog();
  });

  // Gallery thumbnail clicks
  const thumbnails = document.querySelectorAll(".detail-thumb");
  const mainImage = document.querySelector(".detail-main-image img");
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.getAttribute("data-image");
      thumbnails.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
};

const loadCatalog = async () => {
  const url = `${import.meta.env.BASE_URL || ""}catalog-data.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.dresses = Array.isArray(data?.dresses) ? data.dresses : [];
  } catch (err) {
    console.warn("Using fallback sample catalog", err);
    state.dresses = [
      {
        slug: "sample-dress",
        name: "Celeste Sample",
        description: "Hand-finished satin column gown with removable overskirt.",
        price: 12800,
        currency: "PHP",
        readyToWear: true,
        madeToOrder: true,
        forSale: true,
        forRent: true,
        images: ["catalog/sample-dress/dress-placeholder.svg"],
        cover: "catalog/sample-dress/dress-placeholder.svg"
      }
    ];
  }
  renderCatalog();
};

const init = async () => {
  adminModule.checkSession();
  await adminModule.init();
  renderLayout();
  setupFilters();
  await loadCatalog();
  await adminModule.loadDresses(state.dresses);
  setupAdminToggle();
};

// Admin Panel Functions
const showLoginModal = () => {
  const modal = document.createElement("div");
  modal.className = "modal modal-open";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Admin Login</h2>
      <p>Enter the admin password to manage the catalog</p>
      <input type="password" id="admin-password" placeholder="Password" class="admin-input" />
      <div class="modal-buttons">
        <button class="btn btn-primary" id="login-btn">Login</button>
        <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
      </div>
    </div>
  `;
  app.appendChild(modal);

  document.getElementById("login-btn").addEventListener("click", () => {
    const password = document.getElementById("admin-password").value;
    if (adminModule.login(password)) {
      modal.remove();
      showAdminPanel();
    } else {
      alert("❌ Incorrect password");
    }
  });

  document.getElementById("close-modal-btn").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("admin-password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("login-btn").click();
    }
  });

  setTimeout(() => document.getElementById("admin-password").focus(), 100);
};

const showAdminPanel = () => {
  const modal = document.createElement("div");
  modal.className = "modal modal-open admin-panel-modal";
  modal.innerHTML = `
    <div class="admin-panel">
      <div class="admin-header">
        <h2>Catalog Manager</h2>
        <button class="close-btn" id="close-admin-btn">✕</button>
      </div>
      
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="list">Dresses (${adminModule.getDresses().length})</button>
        <button class="admin-tab" data-tab="add">Add New</button>
      </div>

      <div id="list-tab" class="admin-tab-content active">
        <div id="dresses-list" class="dresses-table"></div>
      </div>

      <div id="add-tab" class="admin-tab-content">
        <form id="add-dress-form" class="dress-form"></form>
      </div>

      <div class="admin-footer">
        <button class="btn btn-secondary" id="export-btn">📥 Export JSON</button>
        <button class="btn btn-danger" id="logout-btn">Logout</button>
      </div>
    </div>
  `;
  app.appendChild(modal);

  // Tab switching
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".admin-tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab + "-tab").classList.add("active");
    });
  });

  // Render dresses list
  renderDressesList();

  // Render add form
  renderAddForm();

  // Close admin
  document.getElementById("close-admin-btn").addEventListener("click", () => {
    modal.remove();
  });

  // Export
  document.getElementById("export-btn").addEventListener("click", () => {
    const json = adminModule.exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalog-data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    adminModule.logout();
    modal.remove();
  });
};

const renderDressesList = () => {
  const list = document.getElementById("dresses-list");
  const dresses = adminModule.getDresses();

  list.innerHTML = dresses
    .map(
      (dress) => `
    <div class="dress-item">
      <div class="dress-item-info">
        <h4>${dress.name}</h4>
        <p>${dress.description.substring(0, 60)}...</p>
        <p class="dress-price">${formatPrice(dress.price, dress.currency)}</p>
      </div>
      <div class="dress-item-actions">
        <button class="btn btn-sm btn-primary" onclick="window.editDress('${dress.slug}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteDress('${dress.slug}')">Delete</button>
      </div>
    </div>
  `
    )
    .join("");
};

const renderAddForm = () => {
  const form = document.getElementById("add-dress-form");
  form.innerHTML = `
    <div class="form-group">
      <label>Name *</label>
      <input type="text" name="name" required placeholder="e.g., Rose Gown" />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="description" placeholder="Describe the dress..."></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Price (PHP)</label>
        <input type="number" name="price" placeholder="e.g., 12800" />
      </div>
      <div class="form-group">
        <label>Currency</label>
        <input type="text" name="currency" value="PHP" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group checkbox">
        <input type="checkbox" name="readyToWear" id="rtw" />
        <label for="rtw">Ready to wear</label>
      </div>
      <div class="form-group checkbox">
        <input type="checkbox" name="madeToOrder" id="mto" />
        <label for="mto">Made to order</label>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group checkbox">
        <input type="checkbox" name="forSale" id="fs" />
        <label for="fs">For sale</label>
      </div>
      <div class="form-group checkbox">
        <input type="checkbox" name="forRent" id="fr" />
        <label for="fr">For rent</label>
      </div>
    </div>
    <div class="form-group">
      <label>Cover Image (Upload)</label>
      <input type="file" name="coverFile" accept="image/*" class="image-input" />
      <p class="form-hint">or</p>
      <label>Cover Image URL</label>
      <input type="text" name="cover" placeholder="https://..." />
    </div>
    <div class="form-group">
      <label>Additional Images (Optional)</label>
      <input type="file" name="additionalImages" accept="image/*" multiple class="image-input" />
    </div>
    <div class="form-group">
      <label>Tags (comma-separated)</label>
      <input type="text" name="tags" placeholder="e.g., satin, minimal, elegant" />
    </div>
    <button type="submit" class="btn btn-primary" style="width: 100%;">Add Dress</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    // Handle cover image
    let coverImage = formData.get("cover");
    const coverFile = formData.get("coverFile");
    if (coverFile && coverFile.size > 0) {
      coverImage = await adminModule.convertImageToBase64(coverFile);
    }

    // Handle additional images
    const additionalImages = [];
    const additionalFiles = formData.getAll("additionalImages");
    for (const file of additionalFiles) {
      if (file && file.size > 0) {
        const base64 = await adminModule.convertImageToBase64(file);
        additionalImages.push(base64);
      }
    }

    const dress = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price") ? parseFloat(formData.get("price")) : null,
      currency: formData.get("currency"),
      readyToWear: formData.get("readyToWear") === "on",
      madeToOrder: formData.get("madeToOrder") === "on",
      forSale: formData.get("forSale") === "on",
      forRent: formData.get("forRent") === "on",
      cover: coverImage,
      images: coverImage ? [coverImage, ...additionalImages] : additionalImages,
      tags: formData.get("tags") ? formData.get("tags").split(",").map((t) => t.trim()) : []
    };
    
    await adminModule.addDress(dress);
    state.dresses = adminModule.getDresses();
    form.reset();
    renderDressesList();
    renderCatalog();
    alert("✅ Dress added successfully!");
  });
};

const setupAdminToggle = () => {
  const btn = document.getElementById("admin-toggle-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      if (adminModule.isLoggedIn) {
        showAdminPanel();
      } else {
        showLoginModal();
      }
    });
  }
};

// Global functions for delete
window.deleteDress = (slug) => {
  if (confirm("Are you sure?")) {
    adminModule.deleteDress(slug);
    state.dresses = adminModule.getDresses();
    renderDressesList();
    renderCatalog();
  }
};

window.editDress = (slug) => {
  alert("Edit feature coming soon! For now, you can delete and re-add.");
};

init();
