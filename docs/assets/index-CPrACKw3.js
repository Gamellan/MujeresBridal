(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const E=document.querySelector("#app"),c={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},S=(e,s="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:s}).format(e)}catch{return`${e} ${s}`}},T=e=>typeof e.price=="number"?{type:"price",value:S(e.price,e.currency)}:{type:"message",value:e.priceMessage||"Message us on Facebook for pricing"},A=e=>{var s;return typeof e.description=="string"?e.description:(s=e.description)!=null&&s.short?e.description.short:"Minimal bridal silhouette."},$=e=>{var s,a;return typeof e.description=="string"?e.description:(s=e.description)!=null&&s.full?e.description.full:(a=e.description)!=null&&a.short?e.description.short:"Minimal bridal silhouette."},v=(e,s="")=>{const a=document.createElement("span");return a.className=`pill ${s}`.trim(),a.textContent=e,a},L=()=>`
    <footer class="footer">
      <a href="https://www.facebook.com/profile.php?id=100076109204201" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" class="social-link">
        <svg class="facebook-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </footer>
  `,_=()=>{E.innerHTML=`
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>
      
      <section class="hero">
        <div class="hero__content">
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
          <p class="hero__sub"><h3><b>Tailored in Vietnam. Flown to the Philippines.</b></h3></p>
          </p>
          <p class="hero__desc">Every Mujeres gown is made by independent seamstresses in Vietnam.</p>
          </p>
          <p class="hero__desc">To ensure an effortless experience, we offer FREE International Air Cargo on all orders from Vietnam to the Philippines.</p>
          </p>
          <p class="hero__desc">We’ve removed the distance—and the shipping costs—to bring honest, timeless bridal wear directly to you.</p>
        </div>
      </section>

      <section class="filters" aria-label="catalog filters">
        <div class="filter-group">
          <button class="filter all-gowns" data-filter="all" aria-pressed="true">All gowns</button>
          <button class="filter" data-filter="readyToWear" aria-pressed="false">Ready to wear</button>
          <button class="filter" data-filter="madeToOrder" aria-pressed="false">Made to order</button>
          <button class="filter" data-filter="forSale" aria-pressed="false">For sale</button>
          <button class="filter" data-filter="forRent" aria-pressed="false">For rent</button>
        </div>
        <div class="meta" id="result-meta"></div>
      </section>

      <section id="catalog" class="catalog" aria-live="polite"></section>
      ${L()}
    </main>
  `},F=()=>{const{dresses:e,filters:s}=c;return Object.values(s).some(t=>t===!0)?e.filter(t=>{const r=s.readyToWear?t.readyToWear:!1,o=s.madeToOrder?t.madeToOrder:!1,i=s.forSale?t.forSale:!1,d=s.forRent?t.forRent:!1;return r||o||i||d}):e},y=()=>{const e=F(),s=document.querySelector("#catalog"),a=document.querySelector("#result-meta");if(!(!s||!a)){if(a.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){s.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}s.innerHTML="";for(const t of e){const r=document.createElement("article");r.className="card",r.style.cursor="pointer";const o=document.createElement("div");o.className="card__cover",t.cover&&(o.style.backgroundImage=`url(${t.cover})`);const i=document.createElement("div");i.className="card__badges",t.readyToWear&&i.appendChild(v("Ready to wear","soft")),t.madeToOrder&&i.appendChild(v("Made to order","soft")),t.forSale&&i.appendChild(v("For sale","outline")),t.forRent&&i.appendChild(v("For rent","outline"));const d=document.createElement("div");d.className="card__body";const m=document.createElement("h3");m.textContent=t.name;const f=document.createElement("p");f.className="card__desc",f.textContent=A(t);const n=document.createElement("p");n.className="card__price";const g=T(t);n.textContent=g.value,d.appendChild(m),d.appendChild(f),d.appendChild(n),r.appendChild(o),r.appendChild(i),r.appendChild(d),r.addEventListener("click",()=>{c.selectedDress=t,c.currentView="detail",k()}),s.appendChild(r)}}},C=()=>{const e=document.querySelectorAll(".filter");e.forEach(s=>{s.addEventListener("click",()=>{const a=s.getAttribute("data-filter");if(a==="all")c.filters={readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},e.forEach(t=>{t.getAttribute("data-filter")==="all"?(t.setAttribute("aria-pressed","true"),t.classList.add("active")):(t.setAttribute("aria-pressed","false"),t.classList.remove("active"))});else{const t=document.querySelector(".filter.all-gowns");t.setAttribute("aria-pressed","false"),t.classList.remove("active"),c.filters[a]=!c.filters[a],s.setAttribute("aria-pressed",String(c.filters[a])),s.classList.toggle("active",c.filters[a])}y()})})},k=()=>{const e=c.selectedDress;if(!e)return;E.innerHTML=`
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
                    ${e.images.map(l=>`<img src="${l}" alt="thumbnail" class="detail-thumb" data-image="${l}">`).join("")}
                  </div>`:""}
          </div>
          
          <div class="detail-info">
            <h1>${e.name}</h1>
            
            <div class="detail-price" id="detail-price-display"></div>
            
            <div class="detail-badges">
              ${e.readyToWear?'<span class="pill soft">Ready to wear</span>':""}
              ${e.madeToOrder?'<span class="pill soft">Made to order</span>':""}
              ${e.forSale?'<span class="pill outline">For sale</span>':""}
              ${e.forRent?'<span class="pill outline">For rent</span>':""}
            </div>
            
            <div class="detail-description" id="full-description"></div>
          </div>
        </div>
      </div>
      ${L()}
    </main>
  `,document.getElementById("back-btn").addEventListener("click",()=>{c.currentView="catalog",c.selectedDress=null,_(),C(),y()});const s=document.getElementById("full-description");s&&(s.innerHTML=$(e));const a=document.getElementById("detail-price-display");if(a){const l=T(e);a.textContent=l.value,a.className=l.type==="price"?"detail-price":"detail-price-message"}const t=Array.isArray(e.images)?e.images.slice():[],o=t.includes(e.cover)?t:[e.cover,...t],i=document.querySelector(".detail-main-image img"),d=document.querySelectorAll(".detail-thumb"),m=document.querySelector(".nav-btn.prev"),f=document.querySelector(".nav-btn.next");let n=o.findIndex(l=>l===i.src||l===e.cover);n<0&&(n=0);const g=l=>{d.forEach(u=>u.classList.toggle("active",u.getAttribute("data-image")===l))},p=l=>{if(!o.length)return;n=(l+o.length)%o.length;const u=o[n];i.src=u,g(u)};g(o[n]),d.forEach(l=>{l.addEventListener("click",()=>{const u=l.getAttribute("data-image"),w=o.indexOf(u);p(w>=0?w:n)})}),m&&m.addEventListener("click",()=>p(n-1)),f&&f.addEventListener("click",()=>p(n+1));const M=l=>{l.key==="ArrowLeft"&&p(n-1),l.key==="ArrowRight"&&p(n+1)};document.addEventListener("keydown",M,{once:!1});let h=null;i.addEventListener("touchstart",l=>{h=l.changedTouches[0].clientX},{passive:!0}),i.addEventListener("touchend",l=>{if(h==null)return;const u=l.changedTouches[0].clientX-h;Math.abs(u)>30&&(u>0?p(n-1):p(n+1)),h=null});const b=document.querySelector(".detail-gallery");b&&setTimeout(()=>{b.scrollIntoView({behavior:"smooth",block:"start"})},0)},R=async()=>{console.log("Loading catalog from local file...");const s=`/MujeresBridal/catalog-data.json?t=${new Date().getTime()}`;try{const a=await fetch(s);if(!a.ok)throw new Error(`HTTP ${a.status}`);const t=await a.json();c.dresses=Array.isArray(t==null?void 0:t.dresses)?t.dresses:[],console.log("✅ Loaded:",c.dresses.length,"dresses")}catch(a){console.warn("Using fallback sample catalog",a),c.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}y()},x=async()=>{_(),C(),await R()};x();
