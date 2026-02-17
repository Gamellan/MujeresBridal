import "./style.css";

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

const getPriceDisplay = (dress) => {
  // If price is a number, show formatted price
  if (typeof dress.price === "number") {
    return {
      type: "price",
      value: formatPrice(dress.price, dress.currency)
    };
  }
  
  // If price is null/undefined, show custom message or default
  const defaultMessage = "Message us on Facebook for pricing";
  return {
    type: "message",
    value: dress.priceMessage || defaultMessage
  };
};

const getShortDescription = (dress) => {
  if (typeof dress.description === "string") return dress.description;
  if (dress.description?.short) return dress.description.short;
  return "Minimal bridal silhouette.";
};

const getFullDescription = (dress) => {
  if (typeof dress.description === "string") return dress.description;
  if (dress.description?.full) return dress.description.full;
  if (dress.description?.short) return dress.description.short;
  return "Minimal bridal silhouette.";
};

const tag = (label, variant = "") => {
  const span = document.createElement("span");
  span.className = `pill ${variant}`.trim();
  span.textContent = label;
  return span;
};

const getFooterHTML = () => {
  return `
    <footer class="footer">
      <a href="https://www.facebook.com/profile.php?id=100076109204201" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" class="social-link">
        <svg class="facebook-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </footer>
  `;
};

const renderLayout = () => {
  app.innerHTML = `
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
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
      ${getFooterHTML()}
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
    desc.textContent = getShortDescription(dress);

    const price = document.createElement("p");
    price.className = "card__price";
    const priceDisplay = getPriceDisplay(dress);
    price.textContent = priceDisplay.value;

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
              <button class="nav-btn prev" aria-label="Previous image">‹</button>
              <img src="${dress.cover}" alt="${dress.name}" />
              <button class="nav-btn next" aria-label="Next image">›</button>
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
            <div class="detail-description" id="full-description"></div>
            
            <div class="detail-price" id="detail-price-display"></div>
            
            <div class="detail-badges">
              ${dress.readyToWear ? `<span class="pill soft">Ready to wear</span>` : ""}
              ${dress.madeToOrder ? `<span class="pill soft">Made to order</span>` : ""}
              ${dress.forSale ? `<span class="pill outline">For sale</span>` : ""}
              ${dress.forRent ? `<span class="pill outline">For rent</span>` : ""}
            </div>
          </div>
        </div>
      </div>
      ${getFooterHTML()}
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    state.currentView = "catalog";
    state.selectedDress = null;
    renderLayout();
    setupFilters();
    renderCatalog();
  });

  // Render full description with HTML support
  const fullDescEl = document.getElementById("full-description");
  if (fullDescEl) {
    fullDescEl.innerHTML = getFullDescription(dress);
  }

  // Render price or price message
  const priceDisplayEl = document.getElementById("detail-price-display");
  if (priceDisplayEl) {
    const priceDisplay = getPriceDisplay(dress);
    priceDisplayEl.textContent = priceDisplay.value;
    priceDisplayEl.className = priceDisplay.type === "price" ? "detail-price" : "detail-price-message";
  }

  // Build image list ensuring cover is included and ordered
  const images = Array.isArray(dress.images) ? dress.images.slice() : [];
  const hasCoverInImages = images.includes(dress.cover);
  const imagesList = hasCoverInImages ? images : [dress.cover, ...images];

  // DOM refs
  const mainImage = document.querySelector(".detail-main-image img");
  const thumbnails = document.querySelectorAll(".detail-thumb");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");

  // State
  let currentIndex = imagesList.findIndex((src) => src === mainImage.src || src === dress.cover);
  if (currentIndex < 0) currentIndex = 0;

  const setActiveThumb = (src) => {
    thumbnails.forEach((t) => t.classList.toggle("active", t.getAttribute("data-image") === src));
  };

  const updateMainImage = (idx) => {
    if (!imagesList.length) return;
    currentIndex = (idx + imagesList.length) % imagesList.length;
    const src = imagesList[currentIndex];
    mainImage.src = src;
    setActiveThumb(src);
  };

  // Init active thumb
  setActiveThumb(imagesList[currentIndex]);

  // Thumbnail click handlers
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const imgSrc = thumb.getAttribute("data-image");
      const idx = imagesList.indexOf(imgSrc);
      updateMainImage(idx >= 0 ? idx : currentIndex);
    });
  });

  // Prev/Next buttons
  if (prevBtn) prevBtn.addEventListener("click", () => updateMainImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateMainImage(currentIndex + 1));

  // Keyboard navigation
  const onKey = (e) => {
    if (e.key === "ArrowLeft") updateMainImage(currentIndex - 1);
    if (e.key === "ArrowRight") updateMainImage(currentIndex + 1);
  };
  document.addEventListener("keydown", onKey, { once: false });

  // Touch swipe for mobile
  let touchStartX = null;
  mainImage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  mainImage.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 30) {
      if (dx > 0) updateMainImage(currentIndex - 1);
      else updateMainImage(currentIndex + 1);
    }
    touchStartX = null;
  });
};

const loadCatalog = async () => {
  // Load from local catalog-data.json (generated at build time)
  console.log("Loading catalog from local file...");
  // Add timestamp to prevent browser caching
  const timestamp = new Date().getTime();
  const url = `${import.meta.env.BASE_URL || ""}catalog-data.json?t=${timestamp}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.dresses = Array.isArray(data?.dresses) ? data.dresses : [];
    console.log("✅ Loaded:", state.dresses.length, "dresses");
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
  renderLayout();
  setupFilters();
  await loadCatalog();
};

init();
