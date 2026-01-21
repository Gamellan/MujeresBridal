(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(s){if(s.ep)return;s.ep=!0;const l=r(s);fetch(s.href,l)}})();const f=document.querySelector("#app"),n={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},g=(t,e="PHP")=>{if(typeof t!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:e}).format(t)}catch{return`${t} ${e}`}},c=(t,e="")=>{const r=document.createElement("span");return r.className=`pill ${e}`.trim(),r.textContent=t,r},h=()=>{f.innerHTML=`
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
  `},y=()=>{const{dresses:t,filters:e}=n;return Object.values(e).some(a=>a===!0)?t.filter(a=>{const s=e.readyToWear?a.readyToWear:!1,l=e.madeToOrder?a.madeToOrder:!1,o=e.forSale?a.forSale:!1,i=e.forRent?a.forRent:!1;return s||l||o||i}):t},u=()=>{const t=y(),e=document.querySelector("#catalog"),r=document.querySelector("#result-meta");if(!(!e||!r)){if(r.textContent=`${t.length} style${t.length===1?"":"s"} shown`,t.length===0){e.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}e.innerHTML="";for(const a of t){const s=document.createElement("article");s.className="card",s.style.cursor="pointer";const l=document.createElement("div");l.className="card__cover",a.cover&&(l.style.backgroundImage=`url(${a.cover})`);const o=document.createElement("div");o.className="card__badges",a.readyToWear&&o.appendChild(c("Ready to wear","soft")),a.madeToOrder&&o.appendChild(c("Made to order","soft")),a.forSale&&o.appendChild(c("For sale","outline")),a.forRent&&o.appendChild(c("For rent","outline"));const i=document.createElement("div");i.className="card__body";const m=document.createElement("h3");m.textContent=a.name;const d=document.createElement("p");d.className="card__desc",d.textContent=a.description||"Minimal bridal silhouette.";const p=document.createElement("p");p.className="card__price",p.textContent=g(a.price,a.currency),i.appendChild(m),i.appendChild(d),i.appendChild(p),s.appendChild(l),s.appendChild(o),s.appendChild(i),s.addEventListener("click",()=>{n.selectedDress=a,n.currentView="detail",b()}),e.appendChild(s)}}},v=()=>{document.querySelectorAll(".filter").forEach(e=>{e.addEventListener("click",()=>{const r=e.getAttribute("data-filter");n.filters[r]=!n.filters[r],e.setAttribute("aria-pressed",String(n.filters[r])),e.classList.toggle("active",n.filters[r]),u()})})},b=()=>{const t=n.selectedDress;if(!t)return;f.innerHTML=`
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>
      
      <div class="detail-container">
        <button class="back-btn" id="back-btn">← Back to catalog</button>
        
        <div class="detail-content">
          <div class="detail-gallery">
            <div class="detail-main-image">
              <img src="${t.cover}" alt="${t.name}" />
            </div>
            ${t.images&&t.images.length>1?`<div class="detail-thumbnails">
                    ${t.images.map(a=>`<img src="${a}" alt="thumbnail" class="detail-thumb" data-image="${a}">`).join("")}
                  </div>`:""}
          </div>
          
          <div class="detail-info">
            <h1>${t.name}</h1>
            <p class="detail-description">${t.description||"Minimal bridal silhouette."}</p>
            
            <div class="detail-price">${g(t.price,t.currency)}</div>
            
            <div class="detail-badges">
              ${t.readyToWear?'<span class="pill soft">Ready to wear</span>':""}
              ${t.madeToOrder?'<span class="pill soft">Made to order</span>':""}
              ${t.forSale?'<span class="pill outline">For sale</span>':""}
              ${t.forRent?'<span class="pill outline">For rent</span>':""}
            </div>
          </div>
        </div>
      </div>
    </main>
  `,document.getElementById("back-btn").addEventListener("click",()=>{n.currentView="catalog",n.selectedDress=null,h(),v(),u()});const e=document.querySelectorAll(".detail-thumb"),r=document.querySelector(".detail-main-image img");e.forEach(a=>{a.addEventListener("click",()=>{r.src=a.getAttribute("data-image"),e.forEach(s=>s.classList.remove("active")),a.classList.add("active")})})},w=async()=>{const t="/catalog-data.json";try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP ${e.status}`);const r=await e.json();n.dresses=Array.isArray(r==null?void 0:r.dresses)?r.dresses:[]}catch(e){console.warn("Using fallback sample catalog",e),n.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}u()},T=async()=>{h(),v(),await w()};T();
