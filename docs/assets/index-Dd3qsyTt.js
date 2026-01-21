(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();const y=document.querySelector("#app"),c={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},b=(e,a="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:a}).format(e)}catch{return`${e} ${a}`}},g=(e,a="")=>{const r=document.createElement("span");return r.className=`pill ${a}`.trim(),r.textContent=e,r},w=()=>{y.innerHTML=`
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
  `},L=()=>{const{dresses:e,filters:a}=c;return Object.values(a).some(t=>t===!0)?e.filter(t=>{const s=a.readyToWear?t.readyToWear:!1,n=a.madeToOrder?t.madeToOrder:!1,l=a.forSale?t.forSale:!1,u=a.forRent?t.forRent:!1;return s||n||l||u}):e},h=()=>{const e=L(),a=document.querySelector("#catalog"),r=document.querySelector("#result-meta");if(!(!a||!r)){if(r.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){a.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}a.innerHTML="";for(const t of e){const s=document.createElement("article");s.className="card",s.style.cursor="pointer";const n=document.createElement("div");n.className="card__cover",t.cover&&(n.style.backgroundImage=`url(${t.cover})`);const l=document.createElement("div");l.className="card__badges",t.readyToWear&&l.appendChild(g("Ready to wear","soft")),t.madeToOrder&&l.appendChild(g("Made to order","soft")),t.forSale&&l.appendChild(g("For sale","outline")),t.forRent&&l.appendChild(g("For rent","outline"));const u=document.createElement("div");u.className="card__body";const i=document.createElement("h3");i.textContent=t.name;const p=document.createElement("p");p.className="card__desc",p.textContent=t.description||"Minimal bridal silhouette.";const d=document.createElement("p");d.className="card__price",d.textContent=b(t.price,t.currency),u.appendChild(i),u.appendChild(p),u.appendChild(d),s.appendChild(n),s.appendChild(l),s.appendChild(u),s.addEventListener("click",()=>{c.selectedDress=t,c.currentView="detail",C()}),a.appendChild(s)}}},T=()=>{document.querySelectorAll(".filter").forEach(a=>{a.addEventListener("click",()=>{const r=a.getAttribute("data-filter");c.filters[r]=!c.filters[r],a.setAttribute("aria-pressed",String(c.filters[r])),a.classList.toggle("active",c.filters[r]),h()})})},C=()=>{const e=c.selectedDress;if(!e)return;y.innerHTML=`
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
              <img src="${e.cover}" alt="${e.name}" />
              <button class="nav-btn next" aria-label="Next image">›</button>
            </div>
            ${e.images&&e.images.length>1?`<div class="detail-thumbnails">
                    ${e.images.map(o=>`<img src="${o}" alt="thumbnail" class="detail-thumb" data-image="${o}">`).join("")}
                  </div>`:""}
          </div>
          
          <div class="detail-info">
            <h1>${e.name}</h1>
            <p class="detail-description">${e.description||"Minimal bridal silhouette."}</p>
            
            <div class="detail-price">${b(e.price,e.currency)}</div>
            
            <div class="detail-badges">
              ${e.readyToWear?'<span class="pill soft">Ready to wear</span>':""}
              ${e.madeToOrder?'<span class="pill soft">Made to order</span>':""}
              ${e.forSale?'<span class="pill outline">For sale</span>':""}
              ${e.forRent?'<span class="pill outline">For rent</span>':""}
            </div>
          </div>
        </div>
      </div>
    </main>
  `,document.getElementById("back-btn").addEventListener("click",()=>{c.currentView="catalog",c.selectedDress=null,w(),T(),h()});const a=Array.isArray(e.images)?e.images.slice():[],t=a.includes(e.cover)?a:[e.cover,...a],s=document.querySelector(".detail-main-image img"),n=document.querySelectorAll(".detail-thumb"),l=document.querySelector(".nav-btn.prev"),u=document.querySelector(".nav-btn.next");let i=t.findIndex(o=>o===s.src||o===e.cover);i<0&&(i=0);const p=o=>{n.forEach(m=>m.classList.toggle("active",m.getAttribute("data-image")===o))},d=o=>{if(!t.length)return;i=(o+t.length)%t.length;const m=t[i];s.src=m,p(m)};p(t[i]),n.forEach(o=>{o.addEventListener("click",()=>{const m=o.getAttribute("data-image"),v=t.indexOf(m);d(v>=0?v:i)})}),l&&l.addEventListener("click",()=>d(i-1)),u&&u.addEventListener("click",()=>d(i+1));const E=o=>{o.key==="ArrowLeft"&&d(i-1),o.key==="ArrowRight"&&d(i+1)};document.addEventListener("keydown",E,{once:!1});let f=null;s.addEventListener("touchstart",o=>{f=o.changedTouches[0].clientX},{passive:!0}),s.addEventListener("touchend",o=>{if(f==null)return;const m=o.changedTouches[0].clientX-f;Math.abs(m)>30&&(m>0?d(i-1):d(i+1)),f=null})},_=async()=>{console.log("Loading catalog from local file...");const a=`/MujeresBridal/catalog-data.json?t=${new Date().getTime()}`;try{const r=await fetch(a);if(!r.ok)throw new Error(`HTTP ${r.status}`);const t=await r.json();c.dresses=Array.isArray(t==null?void 0:t.dresses)?t.dresses:[],console.log("✅ Loaded:",c.dresses.length,"dresses")}catch(r){console.warn("Using fallback sample catalog",r),c.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}h()},$=async()=>{w(),T(),await _()};$();
