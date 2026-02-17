(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const E=document.querySelector("#app"),c={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},M=(e,t="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:t}).format(e)}catch{return`${e} ${t}`}},w=e=>typeof e.price=="number"?{type:"price",value:M(e.price,e.currency)}:{type:"message",value:e.priceMessage||"Message us on Facebook for pricing"},S=e=>{var t;return typeof e.description=="string"?e.description:(t=e.description)!=null&&t.short?e.description.short:"Minimal bridal silhouette."},_=e=>{var t,s;return typeof e.description=="string"?e.description:(t=e.description)!=null&&t.full?e.description.full:(s=e.description)!=null&&s.short?e.description.short:"Minimal bridal silhouette."},v=(e,t="")=>{const s=document.createElement("span");return s.className=`pill ${t}`.trim(),s.textContent=e,s},T=()=>{E.innerHTML=`
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
  `},$=()=>{const{dresses:e,filters:t}=c;return Object.values(t).some(a=>a===!0)?e.filter(a=>{const r=t.readyToWear?a.readyToWear:!1,n=t.madeToOrder?a.madeToOrder:!1,o=t.forSale?a.forSale:!1,d=t.forRent?a.forRent:!1;return r||n||o||d}):e},y=()=>{const e=$(),t=document.querySelector("#catalog"),s=document.querySelector("#result-meta");if(!(!t||!s)){if(s.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){t.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}t.innerHTML="";for(const a of e){const r=document.createElement("article");r.className="card",r.style.cursor="pointer";const n=document.createElement("div");n.className="card__cover",a.cover&&(n.style.backgroundImage=`url(${a.cover})`);const o=document.createElement("div");o.className="card__badges",a.readyToWear&&o.appendChild(v("Ready to wear","soft")),a.madeToOrder&&o.appendChild(v("Made to order","soft")),a.forSale&&o.appendChild(v("For sale","outline")),a.forRent&&o.appendChild(v("For rent","outline"));const d=document.createElement("div");d.className="card__body";const f=document.createElement("h3");f.textContent=a.name;const m=document.createElement("p");m.className="card__desc",m.textContent=S(a);const l=document.createElement("p");l.className="card__price";const g=w(a);l.textContent=g.value,d.appendChild(f),d.appendChild(m),d.appendChild(l),r.appendChild(n),r.appendChild(o),r.appendChild(d),r.addEventListener("click",()=>{c.selectedDress=a,c.currentView="detail",A()}),t.appendChild(r)}}},L=()=>{document.querySelectorAll(".filter").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-filter");c.filters[s]=!c.filters[s],t.setAttribute("aria-pressed",String(c.filters[s])),t.classList.toggle("active",c.filters[s]),y()})})},A=()=>{const e=c.selectedDress;if(!e)return;E.innerHTML=`
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
                    ${e.images.map(i=>`<img src="${i}" alt="thumbnail" class="detail-thumb" data-image="${i}">`).join("")}
                  </div>`:""}
          </div>
          
          <div class="detail-info">
            <h1>${e.name}</h1>
            <div class="detail-description" id="full-description"></div>
            
            <div class="detail-price" id="detail-price-display"></div>
            
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{c.currentView="catalog",c.selectedDress=null,T(),L(),y()});const t=document.getElementById("full-description");t&&(t.innerHTML=_(e));const s=document.getElementById("detail-price-display");if(s){const i=w(e);s.textContent=i.value,s.className=i.type==="price"?"detail-price":"detail-price-message"}const a=Array.isArray(e.images)?e.images.slice():[],n=a.includes(e.cover)?a:[e.cover,...a],o=document.querySelector(".detail-main-image img"),d=document.querySelectorAll(".detail-thumb"),f=document.querySelector(".nav-btn.prev"),m=document.querySelector(".nav-btn.next");let l=n.findIndex(i=>i===o.src||i===e.cover);l<0&&(l=0);const g=i=>{d.forEach(u=>u.classList.toggle("active",u.getAttribute("data-image")===i))},p=i=>{if(!n.length)return;l=(i+n.length)%n.length;const u=n[l];o.src=u,g(u)};g(n[l]),d.forEach(i=>{i.addEventListener("click",()=>{const u=i.getAttribute("data-image"),b=n.indexOf(u);p(b>=0?b:l)})}),f&&f.addEventListener("click",()=>p(l-1)),m&&m.addEventListener("click",()=>p(l+1));const C=i=>{i.key==="ArrowLeft"&&p(l-1),i.key==="ArrowRight"&&p(l+1)};document.addEventListener("keydown",C,{once:!1});let h=null;o.addEventListener("touchstart",i=>{h=i.changedTouches[0].clientX},{passive:!0}),o.addEventListener("touchend",i=>{if(h==null)return;const u=i.changedTouches[0].clientX-h;Math.abs(u)>30&&(u>0?p(l-1):p(l+1)),h=null})},F=async()=>{console.log("Loading catalog from local file...");const t=`/MujeresBridal/catalog-data.json?t=${new Date().getTime()}`;try{const s=await fetch(t);if(!s.ok)throw new Error(`HTTP ${s.status}`);const a=await s.json();c.dresses=Array.isArray(a==null?void 0:a.dresses)?a.dresses:[],console.log("✅ Loaded:",c.dresses.length,"dresses")}catch(s){console.warn("Using fallback sample catalog",s),c.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}y()},R=async()=>{T(),L(),await F()};R();
