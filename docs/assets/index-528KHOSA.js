(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function r(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=r(t);fetch(t.href,o)}})();const m=document.querySelector("#app"),c={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1}},h=(a,e="PHP")=>{if(typeof a!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:e}).format(a)}catch{return`${a} ${e}`}},i=(a,e="")=>{const r=document.createElement("span");return r.className=`pill ${e}`.trim(),r.textContent=a,r},g=()=>{m.innerHTML=`
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
  `},y=()=>{const{dresses:a,filters:e}=c;return Object.values(e).some(s=>s===!0)?a.filter(s=>{const t=e.readyToWear?s.readyToWear:!1,o=e.madeToOrder?s.madeToOrder:!1,n=e.forSale?s.forSale:!1,l=e.forRent?s.forRent:!1;return t||o||n||l}):a},u=()=>{const a=y(),e=document.querySelector("#catalog"),r=document.querySelector("#result-meta");if(!(!e||!r)){if(r.textContent=`${a.length} style${a.length===1?"":"s"} shown`,a.length===0){e.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}e.innerHTML="";for(const s of a){const t=document.createElement("article");t.className="card";const o=document.createElement("div");o.className="card__cover",s.cover&&(o.style.backgroundImage=`url(${s.cover})`);const n=document.createElement("div");n.className="card__badges",s.readyToWear&&n.appendChild(i("Ready to wear","soft")),s.madeToOrder&&n.appendChild(i("Made to order","soft")),s.forSale&&n.appendChild(i("For sale","outline")),s.forRent&&n.appendChild(i("For rent","outline"));const l=document.createElement("div");l.className="card__body";const f=document.createElement("h3");f.textContent=s.name;const d=document.createElement("p");d.className="card__desc",d.textContent=s.description||"Minimal bridal silhouette.";const p=document.createElement("p");p.className="card__price",p.textContent=h(s.price,s.currency),l.appendChild(f),l.appendChild(d),l.appendChild(p),t.appendChild(o),t.appendChild(n),t.appendChild(l),e.appendChild(t)}}},v=()=>{document.querySelectorAll(".filter").forEach(e=>{e.addEventListener("click",()=>{const r=e.getAttribute("data-filter");c.filters[r]=!c.filters[r],e.setAttribute("aria-pressed",String(c.filters[r])),e.classList.toggle("active",c.filters[r]),u()})})},b=async()=>{const a="./catalog-data.json";try{const e=await fetch(a);if(!e.ok)throw new Error(`HTTP ${e.status}`);const r=await e.json();c.dresses=Array.isArray(r==null?void 0:r.dresses)?r.dresses:[]}catch(e){console.warn("Using fallback sample catalog",e),c.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}u()},_=async()=>{g(),v(),await b()};_();
