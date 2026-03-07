import "./style.css";

const app = document.querySelector("#app");

const state = {
  dresses: [],
  ideas: [],
  filters: {
    readyToWear: false,
    madeToOrder: false,
    forSale: false,
    forRent: false
  },
  currentView: "list",
  currentSection: "catalog",
  selectedItem: null
};

const formatPrice = (price, currency = "PHP") => {
  if (typeof price !== "number") return "Request pricing";
  try {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
};

const getPriceDisplay = (item) => {
  if (item.type === "idea") {
    return {
      type: "none",
      value: ""
    };
  }

  if (typeof item.price === "number") {
    return {
      type: "price",
      value: formatPrice(item.price, item.currency)
    };
  }

  const defaultMessage = "Message us on Facebook for pricing";
  return {
    type: "message",
    value: item.priceMessage || defaultMessage
  };
};

const getShortDescription = (item) => {
  if (typeof item.description === "string") return item.description;
  if (item.description?.short) return item.description.short;
  return "Minimal bridal silhouette.";
};

const getFullDescription = (item) => {
  if (typeof item.description === "string") return item.description;
  if (item.description?.full) return item.description.full;
  if (item.description?.short) return item.description.short;
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

const getHeroHTML = () => {
  if (state.currentSection === "ideas") {
    return `
      <section class="hero">
        <div class="hero__card">
          <div class="hero__badge">Ideas</div>
          <p class="hero__metric">Concepts in progress</p>
          <p class="hero__desc">A creative board of gowns we have designed but not yet produced.</p>
          <p class="hero__desc">Explore silhouettes, fabrics, and styling direction for upcoming Mujeres collections.</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="hero">
      <div class="hero__card">
        <div class="hero__badge">Catalog</div>
        <p class="hero__metric">Tailored with care</p>
        <p class="hero__sub"><strong>Tailored in Vietnam. Flown to the Philippines.</strong></p>
        <p class="hero__desc">Every Mujeres gown is made by independent seamstresses in Vietnam.</p>
        <p class="hero__desc">To ensure an effortless experience, we offer FREE International Air Cargo on all orders from Vietnam to the Philippines.</p>
        <p class="hero__desc">We have removed the distance and the shipping costs to bring honest, timeless bridal wear directly to you.</p>
      </div>
    </section>
  `;
};

const getSectionControlsHTML = () => {
  if (state.currentSection === "ideas") {
    return `
      <section class="filters" aria-label="ideas summary">
        <div class="meta" id="result-meta"></div>
      </section>
    `;
  }

  return `
    <section class="filters" aria-label="catalog filters">
      <div class="filter-group">
        <button class="filter all-gowns active" data-filter="all" aria-pressed="true">All gowns</button>
        <button class="filter" data-filter="readyToWear" aria-pressed="false">Ready to wear</button>
        <button class="filter" data-filter="madeToOrder" aria-pressed="false">Made to order</button>
        <button class="filter" data-filter="forSale" aria-pressed="false">For sale</button>
        <button class="filter" data-filter="forRent" aria-pressed="false">For rent</button>
      </div>
      <div class="meta" id="result-meta"></div>
    </section>
  `;
};

const renderLayout = () => {
  const catalogIsActive = state.currentSection === "catalog";
  const ideasIsActive = state.currentSection === "ideas";

  app.innerHTML = `
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>

      <section class="section-switcher" aria-label="sections">
        <button class="section-tab ${catalogIsActive ? "active" : ""}" data-section="catalog" aria-pressed="${catalogIsActive}">Catalog</button>
        <button class="section-tab ${ideasIsActive ? "active" : ""}" data-section="ideas" aria-pressed="${ideasIsActive}">Ideas</button>
      </section>

      ${getHeroHTML()}
      ${getSectionControlsHTML()}

      <section id="items-grid" class="catalog" aria-live="polite"></section>
      ${getFooterHTML()}
    </main>
  `;
};

const applyFilters = (items) => {
  if (state.currentSection !== "catalog") return items;

  const { filters } = state;
  const hasActiveFilters = Object.values(filters).some((v) => v === true);
  if (!hasActiveFilters) return items;

  return items.filter((item) => {
    const matchesReady = filters.readyToWear ? item.readyToWear : false;
    const matchesMade = filters.madeToOrder ? item.madeToOrder : false;
    const matchesSale = filters.forSale ? item.forSale : false;
    const matchesRent = filters.forRent ? item.forRent : false;
    return matchesReady || matchesMade || matchesSale || matchesRent;
  });
};

const getActiveItems = () => {
  if (state.currentSection === "ideas") return state.ideas;
  return applyFilters(state.dresses);
};

const renderGrid = () => {
  const list = getActiveItems();
  const gridEl = document.querySelector("#items-grid");
  const metaEl = document.querySelector("#result-meta");

  if (!gridEl || !metaEl) return;

  metaEl.textContent = `${list.length} style${list.length === 1 ? "" : "s"} shown`;

  if (list.length === 0) {
    const emptyMessage =
      state.currentSection === "ideas"
        ? "No ideas yet. Add a few concept pieces to start this board."
        : "No dresses match these filters yet. Try toggling another option.";
    gridEl.innerHTML = `<p class="empty">${emptyMessage}</p>`;
    return;
  }

  gridEl.innerHTML = "";

  for (const item of list) {
    const card = document.createElement("article");
    card.className = "card";

    const cover = document.createElement("div");
    cover.className = "card__cover";
    if (item.cover) {
      cover.style.backgroundImage = `url(${item.cover})`;
    }

    const badgeRow = document.createElement("div");
    badgeRow.className = "card__badges";

    if (item.type === "idea") {
      badgeRow.appendChild(tag("Concept", "soft"));
      if (item.tags?.length) {
        badgeRow.appendChild(tag(item.tags[0], "outline"));
      }
    } else {
      if (item.readyToWear) badgeRow.appendChild(tag("Ready to wear", "soft"));
      if (item.madeToOrder) badgeRow.appendChild(tag("Made to order", "soft"));
      if (item.forSale) badgeRow.appendChild(tag("For sale", "outline"));
      if (item.forRent) badgeRow.appendChild(tag("For rent", "outline"));
    }

    const body = document.createElement("div");
    body.className = "card__body";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.className = "card__desc";
    desc.textContent = getShortDescription(item);

    const line = document.createElement("p");
    line.className = "card__price";
    if (item.type === "idea") {
      line.textContent = "Design idea in development";
    } else {
      line.textContent = getPriceDisplay(item).value;
    }

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(line);

    card.appendChild(cover);
    card.appendChild(badgeRow);
    card.appendChild(body);

    card.addEventListener("click", () => {
      state.selectedItem = item;
      state.currentView = "detail";
      renderDetail();
    });

    gridEl.appendChild(card);
  }
};

const resetFilters = () => {
  state.filters = {
    readyToWear: false,
    madeToOrder: false,
    forSale: false,
    forRent: false
  };
};

const setupSectionTabs = () => {
  const tabs = document.querySelectorAll(".section-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const section = tab.getAttribute("data-section");
      if (!section || section === state.currentSection) return;

      state.currentSection = section;
      state.currentView = "list";
      state.selectedItem = null;
      resetFilters();

      renderLayout();
      setupSectionTabs();
      setupFilters();
      renderGrid();
    });
  });
};

const setupFilters = () => {
  if (state.currentSection !== "catalog") return;

  const buttons = document.querySelectorAll(".filter");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-filter");
      if (!key) return;

      if (key === "all") {
        resetFilters();
        buttons.forEach((b) => {
          const bKey = b.getAttribute("data-filter");
          if (bKey === "all") {
            b.setAttribute("aria-pressed", "true");
            b.classList.add("active");
          } else {
            b.setAttribute("aria-pressed", "false");
            b.classList.remove("active");
          }
        });
      } else {
        const allBtn = document.querySelector(".filter.all-gowns");
        if (allBtn) {
          allBtn.setAttribute("aria-pressed", "false");
          allBtn.classList.remove("active");
        }

        state.filters[key] = !state.filters[key];
        btn.setAttribute("aria-pressed", String(state.filters[key]));
        btn.classList.toggle("active", state.filters[key]);
      }

      renderGrid();
    });
  });
};

const renderDetail = () => {
  const item = state.selectedItem;
  if (!item) return;

  const isIdea = item.type === "idea";

  app.innerHTML = `
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>

      <div class="detail-container">
        <button class="back-btn" id="back-btn">${state.currentSection === "ideas" ? "\u2190 Back to ideas" : "\u2190 Back to catalog"}</button>

        <div class="detail-content">
          <div class="detail-gallery">
            <div class="detail-main-image">
              <button class="nav-btn prev" aria-label="Previous image">\u2039</button>
              <img src="${item.cover}" alt="${item.name}" />
              <button class="nav-btn next" aria-label="Next image">\u203a</button>
            </div>
            ${
              item.images && item.images.length > 1
                ? `<div class="detail-thumbnails">
                    ${item.images
                      .map((img) => `<img src="${img}" alt="thumbnail" class="detail-thumb" data-image="${img}">`)
                      .join("")}
                  </div>`
                : ""
            }
          </div>

          <div class="detail-info">
            <h1>${item.name}</h1>

            <div class="detail-price" id="detail-price-display"></div>

            <div class="detail-badges" id="detail-badges">
              ${
                isIdea
                  ? `<span class="pill soft">Concept</span>`
                  : `${item.readyToWear ? `<span class="pill soft">Ready to wear</span>` : ""}
                     ${item.madeToOrder ? `<span class="pill soft">Made to order</span>` : ""}
                     ${item.forSale ? `<span class="pill outline">For sale</span>` : ""}
                     ${item.forRent ? `<span class="pill outline">For rent</span>` : ""}`
              }
            </div>

            <div class="detail-description" id="full-description"></div>
          </div>
        </div>
      </div>
      ${getFooterHTML()}
    </main>
  `;

  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      state.currentView = "list";
      state.selectedItem = null;
      renderLayout();
      setupSectionTabs();
      setupFilters();
      renderGrid();
    });
  }

  const fullDescEl = document.getElementById("full-description");
  if (fullDescEl) {
    fullDescEl.innerHTML = getFullDescription(item);
  }

  const priceDisplayEl = document.getElementById("detail-price-display");
  if (priceDisplayEl) {
    const priceDisplay = getPriceDisplay(item);
    if (priceDisplay.type === "none") {
      priceDisplayEl.textContent = "Design idea in development";
      priceDisplayEl.className = "detail-price-message";
    } else {
      priceDisplayEl.textContent = priceDisplay.value;
      priceDisplayEl.className = priceDisplay.type === "price" ? "detail-price" : "detail-price-message";
    }
  }

  const images = Array.isArray(item.images) ? item.images.slice() : [];
  const hasCoverInImages = images.includes(item.cover);
  const imagesList = hasCoverInImages ? images : [item.cover, ...images];

  const mainImage = document.querySelector(".detail-main-image img");
  const thumbnails = document.querySelectorAll(".detail-thumb");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");

  if (!mainImage || !imagesList.length) return;

  let currentIndex = imagesList.findIndex((src) => src === item.cover);
  if (currentIndex < 0) currentIndex = 0;

  const setActiveThumb = (src) => {
    thumbnails.forEach((t) => t.classList.toggle("active", t.getAttribute("data-image") === src));
  };

  const updateMainImage = (idx) => {
    currentIndex = (idx + imagesList.length) % imagesList.length;
    const src = imagesList[currentIndex];
    mainImage.src = src;
    setActiveThumb(src);
  };

  setActiveThumb(imagesList[currentIndex]);

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const imgSrc = thumb.getAttribute("data-image");
      const idx = imagesList.indexOf(imgSrc);
      updateMainImage(idx >= 0 ? idx : currentIndex);
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", () => updateMainImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateMainImage(currentIndex + 1));

  const onKey = (e) => {
    if (e.key === "ArrowLeft") updateMainImage(currentIndex - 1);
    if (e.key === "ArrowRight") updateMainImage(currentIndex + 1);
  };
  document.addEventListener("keydown", onKey, { once: false });

  let touchStartX = null;
  mainImage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  mainImage.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 30) {
      if (dx > 0) updateMainImage(currentIndex - 1);
      else updateMainImage(currentIndex + 1);
    }
    touchStartX = null;
  });

  const gallery = document.querySelector(".detail-gallery");
  if (gallery) {
    setTimeout(() => {
      gallery.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }
};

const loadCatalog = async () => {
  const timestamp = new Date().getTime();
  const url = `${import.meta.env.BASE_URL || ""}catalog-data.json?t=${timestamp}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.dresses = Array.isArray(data?.dresses)
      ? data.dresses.map((dress) => ({ ...dress, type: "catalog" }))
      : [];
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
        cover: "catalog/sample-dress/dress-placeholder.svg",
        type: "catalog"
      }
    ];
  }
};

const loadIdeas = async () => {
  const timestamp = new Date().getTime();
  const url = `${import.meta.env.BASE_URL || ""}ideas-data.json?t=${timestamp}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.ideas = Array.isArray(data?.ideas)
      ? data.ideas.map((idea) => ({ ...idea, type: "idea" }))
      : [];
  } catch (err) {
    console.warn("Using fallback ideas", err);
    state.ideas = [];
  }
};

const init = async () => {
  await Promise.all([loadCatalog(), loadIdeas()]);
  renderLayout();
  setupSectionTabs();
  setupFilters();
  renderGrid();
};

init();
