(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function a(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(t){if(t.ep)return;t.ep=!0;const n=a(t);fetch(t.href,n)}})();const $=document.querySelector("#app"),i={dresses:[],ideas:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"list",currentSection:"catalog",selectedItem:null},k=(e,s="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:s}).format(e)}catch{return`${e} ${s}`}},A=e=>e.type==="idea"?{type:"none",value:""}:typeof e.price=="number"?{type:"price",value:k(e.price,e.currency)}:{type:"message",value:e.priceMessage||"Message us on Facebook for pricing"},x=e=>{var s;return typeof e.description=="string"?e.description:(s=e.description)!=null&&s.short?e.description.short:"Minimal bridal silhouette."},F=e=>{var s,a;return typeof e.description=="string"?e.description:(s=e.description)!=null&&s.full?e.description.full:(a=e.description)!=null&&a.short?e.description.short:"Minimal bridal silhouette."},h=(e,s="")=>{const a=document.createElement("span");return a.className=`pill ${s}`.trim(),a.textContent=e,a},L=()=>`
    <footer class="footer">
      <a href="https://www.facebook.com/profile.php?id=100076109204201" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" class="social-link">
        <svg class="facebook-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </footer>
  `,H=()=>i.currentSection==="ideas"?`
      <section class="hero">
        <div class="hero__card">
          <div class="hero__badge">Ideas</div>
          <p class="hero__metric">Concepts in progress</p>
          <p class="hero__desc">A creative board of gowns we have designed but not yet produced.</p>
          <p class="hero__desc">Explore silhouettes, fabrics, and styling direction for upcoming Mujeres collections.</p>
        </div>
      </section>
    `:`
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
  `,P=()=>i.currentSection==="ideas"?`
      <section class="filters" aria-label="ideas summary">
        <div class="meta" id="result-meta"></div>
      </section>
    `:`
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
  `,w=()=>{const e=i.currentSection==="catalog",s=i.currentSection==="ideas";$.innerHTML=`
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>

      <section class="section-switcher" aria-label="sections">
        <button class="section-tab ${e?"active":""}" data-section="catalog" aria-pressed="${e}">Catalog</button>
        <button class="section-tab ${s?"active":""}" data-section="ideas" aria-pressed="${s}">Ideas</button>
      </section>

      ${H()}
      ${P()}

      <section id="items-grid" class="catalog" aria-live="polite"></section>
      ${L()}
    </main>
  `},R=e=>{if(i.currentSection!=="catalog")return e;const{filters:s}=i;return Object.values(s).some(r=>r===!0)?e.filter(r=>{const t=s.readyToWear?r.readyToWear:!1,n=s.madeToOrder?r.madeToOrder:!1,d=s.forSale?r.forSale:!1,c=s.forRent?r.forRent:!1;return t||n||d||c}):e},N=()=>i.currentSection==="ideas"?i.ideas:R(i.dresses),b=()=>{var r;const e=N(),s=document.querySelector("#items-grid"),a=document.querySelector("#result-meta");if(!(!s||!a)){if(a.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){const t=i.currentSection==="ideas"?"No ideas yet. Add a few concept pieces to start this board.":"No dresses match these filters yet. Try toggling another option.";s.innerHTML=`<p class="empty">${t}</p>`;return}s.innerHTML="";for(const t of e){const n=document.createElement("article");n.className="card";const d=document.createElement("div");d.className="card__cover",t.cover&&(d.style.backgroundImage=`url(${t.cover})`);const c=document.createElement("div");c.className="card__badges",t.type==="idea"?(c.appendChild(h("Concept","soft")),(r=t.tags)!=null&&r.length&&c.appendChild(h(t.tags[0],"outline"))):(t.readyToWear&&c.appendChild(h("Ready to wear","soft")),t.madeToOrder&&c.appendChild(h("Made to order","soft")),t.forSale&&c.appendChild(h("For sale","outline")),t.forRent&&c.appendChild(h("For rent","outline")));const u=document.createElement("div");u.className="card__body";const v=document.createElement("h3");v.textContent=t.name;const g=document.createElement("p");g.className="card__desc",g.textContent=x(t);const f=document.createElement("p");f.className="card__price",t.type==="idea"?f.textContent="Design idea in development":f.textContent=A(t).value,u.appendChild(v),u.appendChild(g),u.appendChild(f),n.appendChild(d),n.appendChild(c),n.appendChild(u),n.addEventListener("click",()=>{i.selectedItem=t,i.currentView="detail",O()}),s.appendChild(n)}}},M=()=>{i.filters={readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1}},S=()=>{document.querySelectorAll(".section-tab").forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-section");!a||a===i.currentSection||(i.currentSection=a,i.currentView="list",i.selectedItem=null,M(),w(),S(),T(),b())})})},T=()=>{if(i.currentSection!=="catalog")return;const e=document.querySelectorAll(".filter");e.forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-filter");if(a){if(a==="all")M(),e.forEach(r=>{r.getAttribute("data-filter")==="all"?(r.setAttribute("aria-pressed","true"),r.classList.add("active")):(r.setAttribute("aria-pressed","false"),r.classList.remove("active"))});else{const r=document.querySelector(".filter.all-gowns");r&&(r.setAttribute("aria-pressed","false"),r.classList.remove("active")),i.filters[a]=!i.filters[a],s.setAttribute("aria-pressed",String(i.filters[a])),s.classList.toggle("active",i.filters[a])}b()}})})},O=()=>{const e=i.selectedItem;if(!e)return;const s=e.type==="idea";$.innerHTML=`
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>

      <div class="detail-container">
        <button class="back-btn" id="back-btn">${i.currentSection==="ideas"?"← Back to ideas":"← Back to catalog"}</button>

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

            <div class="detail-price" id="detail-price-display"></div>

            <div class="detail-badges" id="detail-badges">
              ${s?'<span class="pill soft">Concept</span>':`${e.readyToWear?'<span class="pill soft">Ready to wear</span>':""}
                     ${e.madeToOrder?'<span class="pill soft">Made to order</span>':""}
                     ${e.forSale?'<span class="pill outline">For sale</span>':""}
                     ${e.forRent?'<span class="pill outline">For rent</span>':""}`}
            </div>

            <div class="detail-description" id="full-description"></div>
          </div>
        </div>
      </div>
      ${L()}
    </main>
  `;const a=document.getElementById("back-btn");a&&a.addEventListener("click",()=>{i.currentView="list",i.selectedItem=null,w(),S(),T(),b()});const r=document.getElementById("full-description");r&&(r.innerHTML=F(e));const t=document.getElementById("detail-price-display");if(t){const o=A(e);o.type==="none"?(t.textContent="Design idea in development",t.className="detail-price-message"):(t.textContent=o.value,t.className=o.type==="price"?"detail-price":"detail-price-message")}const n=Array.isArray(e.images)?e.images.slice():[],c=n.includes(e.cover)?n:[e.cover,...n],u=document.querySelector(".detail-main-image img"),v=document.querySelectorAll(".detail-thumb"),g=document.querySelector(".nav-btn.prev"),f=document.querySelector(".nav-btn.next");if(!u||!c.length)return;let l=c.findIndex(o=>o===e.cover);l<0&&(l=0);const E=o=>{v.forEach(p=>p.classList.toggle("active",p.getAttribute("data-image")===o))},m=o=>{l=(o+c.length)%c.length;const p=c[l];u.src=p,E(p)};E(c[l]),v.forEach(o=>{o.addEventListener("click",()=>{const p=o.getAttribute("data-image"),C=c.indexOf(p);m(C>=0?C:l)})}),g&&g.addEventListener("click",()=>m(l-1)),f&&f.addEventListener("click",()=>m(l+1));const I=o=>{o.key==="ArrowLeft"&&m(l-1),o.key==="ArrowRight"&&m(l+1)};document.addEventListener("keydown",I,{once:!1});let y=null;u.addEventListener("touchstart",o=>{y=o.changedTouches[0].clientX},{passive:!0}),u.addEventListener("touchend",o=>{if(y==null)return;const p=o.changedTouches[0].clientX-y;Math.abs(p)>30&&(p>0?m(l-1):m(l+1)),y=null});const _=document.querySelector(".detail-gallery");_&&setTimeout(()=>{_.scrollIntoView({behavior:"smooth",block:"start"})},0)},B=async()=>{const s=`/MujeresBridal/catalog-data.json?t=${new Date().getTime()}`;try{const a=await fetch(s);if(!a.ok)throw new Error(`HTTP ${a.status}`);const r=await a.json();i.dresses=Array.isArray(r==null?void 0:r.dresses)?r.dresses.map(t=>({...t,type:"catalog"})):[]}catch(a){console.warn("Using fallback sample catalog",a),i.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg",type:"catalog"}]}},q=async()=>{const s=`/MujeresBridal/ideas-data.json?t=${new Date().getTime()}`;try{const a=await fetch(s);if(!a.ok)throw new Error(`HTTP ${a.status}`);const r=await a.json();i.ideas=Array.isArray(r==null?void 0:r.ideas)?r.ideas.map(t=>({...t,type:"idea"})):[]}catch(a){console.warn("Using fallback ideas",a),i.ideas=[]}},j=async()=>{await Promise.all([B(),q()]),w(),S(),T(),b()};j();
