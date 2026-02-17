(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const b=document.querySelector("#app"),c={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},w=(e,t="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:t}).format(e)}catch{return`${e} ${t}`}},C=e=>{var t;return typeof e.description=="string"?e.description:(t=e.description)!=null&&t.short?e.description.short:"Minimal bridal silhouette."},S=e=>{var t,a;return typeof e.description=="string"?e.description:(t=e.description)!=null&&t.full?e.description.full:(a=e.description)!=null&&a.short?e.description.short:"Minimal bridal silhouette."},h=(e,t="")=>{const a=document.createElement("span");return a.className=`pill ${t}`.trim(),a.textContent=e,a},E=()=>{b.innerHTML=`
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
  `},_=()=>{const{dresses:e,filters:t}=c;return Object.values(t).some(r=>r===!0)?e.filter(r=>{const s=t.readyToWear?r.readyToWear:!1,n=t.madeToOrder?r.madeToOrder:!1,l=t.forSale?r.forSale:!1,d=t.forRent?r.forRent:!1;return s||n||l||d}):e},v=()=>{const e=_(),t=document.querySelector("#catalog"),a=document.querySelector("#result-meta");if(!(!t||!a)){if(a.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){t.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}t.innerHTML="";for(const r of e){const s=document.createElement("article");s.className="card",s.style.cursor="pointer";const n=document.createElement("div");n.className="card__cover",r.cover&&(n.style.backgroundImage=`url(${r.cover})`);const l=document.createElement("div");l.className="card__badges",r.readyToWear&&l.appendChild(h("Ready to wear","soft")),r.madeToOrder&&l.appendChild(h("Made to order","soft")),r.forSale&&l.appendChild(h("For sale","outline")),r.forRent&&l.appendChild(h("For rent","outline"));const d=document.createElement("div");d.className="card__body";const f=document.createElement("h3");f.textContent=r.name;const i=document.createElement("p");i.className="card__desc",i.textContent=C(r);const m=document.createElement("p");m.className="card__price",m.textContent=w(r.price,r.currency),d.appendChild(f),d.appendChild(i),d.appendChild(m),s.appendChild(n),s.appendChild(l),s.appendChild(d),s.addEventListener("click",()=>{c.selectedDress=r,c.currentView="detail",$()}),t.appendChild(s)}}},T=()=>{document.querySelectorAll(".filter").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-filter");c.filters[a]=!c.filters[a],t.setAttribute("aria-pressed",String(c.filters[a])),t.classList.toggle("active",c.filters[a]),v()})})},$=()=>{const e=c.selectedDress;if(!e)return;b.innerHTML=`
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
            <div class="detail-description" id="full-description"></div>
            
            <div class="detail-price">${w(e.price,e.currency)}</div>
            
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{c.currentView="catalog",c.selectedDress=null,E(),T(),v()});const t=document.getElementById("full-description");t&&(t.innerHTML=S(e));const a=Array.isArray(e.images)?e.images.slice():[],s=a.includes(e.cover)?a:[e.cover,...a],n=document.querySelector(".detail-main-image img"),l=document.querySelectorAll(".detail-thumb"),d=document.querySelector(".nav-btn.prev"),f=document.querySelector(".nav-btn.next");let i=s.findIndex(o=>o===n.src||o===e.cover);i<0&&(i=0);const m=o=>{l.forEach(u=>u.classList.toggle("active",u.getAttribute("data-image")===o))},p=o=>{if(!s.length)return;i=(o+s.length)%s.length;const u=s[i];n.src=u,m(u)};m(s[i]),l.forEach(o=>{o.addEventListener("click",()=>{const u=o.getAttribute("data-image"),y=s.indexOf(u);p(y>=0?y:i)})}),d&&d.addEventListener("click",()=>p(i-1)),f&&f.addEventListener("click",()=>p(i+1));const L=o=>{o.key==="ArrowLeft"&&p(i-1),o.key==="ArrowRight"&&p(i+1)};document.addEventListener("keydown",L,{once:!1});let g=null;n.addEventListener("touchstart",o=>{g=o.changedTouches[0].clientX},{passive:!0}),n.addEventListener("touchend",o=>{if(g==null)return;const u=o.changedTouches[0].clientX-g;Math.abs(u)>30&&(u>0?p(i-1):p(i+1)),g=null})},M=async()=>{console.log("Loading catalog from local file...");const t=`/MujeresBridal/catalog-data.json?t=${new Date().getTime()}`;try{const a=await fetch(t);if(!a.ok)throw new Error(`HTTP ${a.status}`);const r=await a.json();c.dresses=Array.isArray(r==null?void 0:r.dresses)?r.dresses:[],console.log("✅ Loaded:",c.dresses.length,"dresses")}catch(a){console.warn("Using fallback sample catalog",a),c.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}v()},A=async()=>{E(),T(),await M()};A();
