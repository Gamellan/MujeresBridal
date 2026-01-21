import "./style.css";

const app = document.querySelector("#app");

const state = {
  dresses: [],
  filters: {
    readyToWear: false,
    madeToOrder: false,
    forSale: false,
    forRent: false
  }
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
  renderLayout();
  setupFilters();
  await loadCatalog();
};

init();
