(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const L="admin123",l={isLoggedIn:!1,dresses:[],login(e){return e===L?(this.isLoggedIn=!0,sessionStorage.setItem("adminLoggedIn","true"),!0):!1},logout(){this.isLoggedIn=!1,sessionStorage.removeItem("adminLoggedIn")},checkSession(){return this.isLoggedIn=sessionStorage.getItem("adminLoggedIn")==="true",this.isLoggedIn},loadDresses(e){const t=localStorage.getItem("mujersBridalDresses");if(t)try{this.dresses=JSON.parse(t)}catch{this.dresses=e||[]}else this.dresses=e||[],this.saveDresses()},saveDresses(){localStorage.setItem("mujersBridalDresses",JSON.stringify(this.dresses))},addDress(e){const t={slug:this.generateSlug(e.name),name:e.name,description:e.description,price:e.price?parseFloat(e.price):null,currency:e.currency||"PHP",readyToWear:e.readyToWear||!1,madeToOrder:e.madeToOrder||!1,forSale:e.forSale||!1,forRent:e.forRent||!1,images:e.images||[],cover:e.cover||null,tags:e.tags||[]};return this.dresses.push(t),this.saveDresses(),t},updateDress(e,t){const s=this.dresses.findIndex(a=>a.slug===e);return s!==-1?(this.dresses[s]={...this.dresses[s],...t},this.saveDresses(),this.dresses[s]):null},deleteDress(e){const t=this.dresses.findIndex(s=>s.slug===e);if(t!==-1){const s=this.dresses.splice(t,1);return this.saveDresses(),s[0]}return null},getDress(e){return this.dresses.find(t=>t.slug===e)},getDresses(){return this.dresses},generateSlug(e){return e.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")},exportJSON(){const e={updatedAt:new Date().toISOString(),dresses:this.dresses};return JSON.stringify(e,null,2)}},u=document.querySelector("#app"),o={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},f=(e,t="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:t}).format(e)}catch{return`${e} ${t}`}},m=(e,t="")=>{const s=document.createElement("span");return s.className=`pill ${t}`.trim(),s.textContent=e,s},h=()=>{u.innerHTML=`
    <main class="page">
      <header class="logo-header">
        <div class="logo-container">
          <img src="logo.png" alt="Mujeres Bridal" class="logo" />
          <button id="admin-toggle-btn" class="admin-toggle" title="Admin panel">⚙️</button>
        </div>
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
  `},E=()=>{const{dresses:e,filters:t}=o;return Object.values(t).some(a=>a===!0)?e.filter(a=>{const r=t.readyToWear?a.readyToWear:!1,n=t.madeToOrder?a.madeToOrder:!1,i=t.forSale?a.forSale:!1,d=t.forRent?a.forRent:!1;return r||n||i||d}):e},c=()=>{const e=E(),t=document.querySelector("#catalog"),s=document.querySelector("#result-meta");if(!(!t||!s)){if(s.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){t.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}t.innerHTML="";for(const a of e){const r=document.createElement("article");r.className="card",r.style.cursor="pointer";const n=document.createElement("div");n.className="card__cover",a.cover&&(n.style.backgroundImage=`url(${a.cover})`);const i=document.createElement("div");i.className="card__badges",a.readyToWear&&i.appendChild(m("Ready to wear","soft")),a.madeToOrder&&i.appendChild(m("Made to order","soft")),a.forSale&&i.appendChild(m("For sale","outline")),a.forRent&&i.appendChild(m("For rent","outline"));const d=document.createElement("div");d.className="card__body";const b=document.createElement("h3");b.textContent=a.name;const p=document.createElement("p");p.className="card__desc",p.textContent=a.description||"Minimal bridal silhouette.";const g=document.createElement("p");g.className="card__price",g.textContent=f(a.price,a.currency),d.appendChild(b),d.appendChild(p),d.appendChild(g),r.appendChild(n),r.appendChild(i),r.appendChild(d),r.addEventListener("click",()=>{o.selectedDress=a,o.currentView="detail",S()}),t.appendChild(r)}}},y=()=>{document.querySelectorAll(".filter").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-filter");o.filters[s]=!o.filters[s],t.setAttribute("aria-pressed",String(o.filters[s])),t.classList.toggle("active",o.filters[s]),c()})})},S=()=>{const e=o.selectedDress;if(!e)return;u.innerHTML=`
    <main class="page">
      <header class="logo-header">
        <img src="logo.png" alt="Mujeres Bridal" class="logo" />
      </header>
      
      <div class="detail-container">
        <button class="back-btn" id="back-btn">← Back to catalog</button>
        
        <div class="detail-content">
          <div class="detail-gallery">
            <div class="detail-main-image">
              <img src="${e.cover}" alt="${e.name}" />
            </div>
            ${e.images&&e.images.length>1?`<div class="detail-thumbnails">
                    ${e.images.map(a=>`<img src="${a}" alt="thumbnail" class="detail-thumb" data-image="${a}">`).join("")}
                  </div>`:""}
          </div>
          
          <div class="detail-info">
            <h1>${e.name}</h1>
            <p class="detail-description">${e.description||"Minimal bridal silhouette."}</p>
            
            <div class="detail-price">${f(e.price,e.currency)}</div>
            
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{o.currentView="catalog",o.selectedDress=null,h(),y(),c()});const t=document.querySelectorAll(".detail-thumb"),s=document.querySelector(".detail-main-image img");t.forEach(a=>{a.addEventListener("click",()=>{s.src=a.getAttribute("data-image"),t.forEach(r=>r.classList.remove("active")),a.classList.add("active")})})},D=async()=>{const e="/catalog-data.json";try{const t=await fetch(e);if(!t.ok)throw new Error(`HTTP ${t.status}`);const s=await t.json();o.dresses=Array.isArray(s==null?void 0:s.dresses)?s.dresses:[]}catch(t){console.warn("Using fallback sample catalog",t),o.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}c()},I=async()=>{l.checkSession(),h(),y(),await D(),l.loadDresses(o.dresses),O()},T=()=>{const e=document.createElement("div");e.className="modal modal-open",e.innerHTML=`
    <div class="modal-content">
      <h2>Admin Login</h2>
      <p>Enter the admin password to manage the catalog</p>
      <input type="password" id="admin-password" placeholder="Password" class="admin-input" />
      <div class="modal-buttons">
        <button class="btn btn-primary" id="login-btn">Login</button>
        <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
      </div>
    </div>
  `,u.appendChild(e),document.getElementById("login-btn").addEventListener("click",()=>{const t=document.getElementById("admin-password").value;l.login(t)?(e.remove(),w()):alert("❌ Incorrect password")}),document.getElementById("close-modal-btn").addEventListener("click",()=>{e.remove()}),document.getElementById("admin-password").addEventListener("keypress",t=>{t.key==="Enter"&&document.getElementById("login-btn").click()}),setTimeout(()=>document.getElementById("admin-password").focus(),100)},w=()=>{const e=document.createElement("div");e.className="modal modal-open admin-panel-modal",e.innerHTML=`
    <div class="admin-panel">
      <div class="admin-header">
        <h2>Catalog Manager</h2>
        <button class="close-btn" id="close-admin-btn">✕</button>
      </div>
      
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="list">Dresses (${l.getDresses().length})</button>
        <button class="admin-tab" data-tab="add">Add New</button>
      </div>

      <div id="list-tab" class="admin-tab-content active">
        <div id="dresses-list" class="dresses-table"></div>
      </div>

      <div id="add-tab" class="admin-tab-content">
        <form id="add-dress-form" class="dress-form"></form>
      </div>

      <div class="admin-footer">
        <button class="btn btn-secondary" id="export-btn">📥 Export JSON</button>
        <button class="btn btn-danger" id="logout-btn">Logout</button>
      </div>
    </div>
  `,u.appendChild(e),document.querySelectorAll(".admin-tab").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(s=>s.classList.remove("active")),document.querySelectorAll(".admin-tab-content").forEach(s=>s.classList.remove("active")),t.classList.add("active"),document.getElementById(t.dataset.tab+"-tab").classList.add("active")})}),v(),k(),document.getElementById("close-admin-btn").addEventListener("click",()=>{e.remove()}),document.getElementById("export-btn").addEventListener("click",()=>{const t=l.exportJSON(),s=new Blob([t],{type:"application/json"}),a=URL.createObjectURL(s),r=document.createElement("a");r.href=a,r.download="catalog-data.json",r.click(),URL.revokeObjectURL(a)}),document.getElementById("logout-btn").addEventListener("click",()=>{l.logout(),e.remove()})},v=()=>{const e=document.getElementById("dresses-list"),t=l.getDresses();e.innerHTML=t.map(s=>`
    <div class="dress-item">
      <div class="dress-item-info">
        <h4>${s.name}</h4>
        <p>${s.description.substring(0,60)}...</p>
        <p class="dress-price">${f(s.price,s.currency)}</p>
      </div>
      <div class="dress-item-actions">
        <button class="btn btn-sm btn-primary" onclick="window.editDress('${s.slug}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteDress('${s.slug}')">Delete</button>
      </div>
    </div>
  `).join("")},k=()=>{const e=document.getElementById("add-dress-form");e.innerHTML=`
    <div class="form-group">
      <label>Name *</label>
      <input type="text" name="name" required placeholder="e.g., Rose Gown" />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea name="description" placeholder="Describe the dress..."></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Price (PHP)</label>
        <input type="number" name="price" placeholder="e.g., 12800" />
      </div>
      <div class="form-group">
        <label>Currency</label>
        <input type="text" name="currency" value="PHP" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group checkbox">
        <input type="checkbox" name="readyToWear" id="rtw" />
        <label for="rtw">Ready to wear</label>
      </div>
      <div class="form-group checkbox">
        <input type="checkbox" name="madeToOrder" id="mto" />
        <label for="mto">Made to order</label>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group checkbox">
        <input type="checkbox" name="forSale" id="fs" />
        <label for="fs">For sale</label>
      </div>
      <div class="form-group checkbox">
        <input type="checkbox" name="forRent" id="fr" />
        <label for="fr">For rent</label>
      </div>
    </div>
    <div class="form-group">
      <label>Cover Image URL</label>
      <input type="text" name="cover" placeholder="https://..." />
    </div>
    <div class="form-group">
      <label>Tags (comma-separated)</label>
      <input type="text" name="tags" placeholder="e.g., satin, minimal, elegant" />
    </div>
    <button type="submit" class="btn btn-primary" style="width: 100%;">Add Dress</button>
  `,e.addEventListener("submit",t=>{t.preventDefault();const s=new FormData(e),a={name:s.get("name"),description:s.get("description"),price:s.get("price")?parseFloat(s.get("price")):null,currency:s.get("currency"),readyToWear:s.get("readyToWear")==="on",madeToOrder:s.get("madeToOrder")==="on",forSale:s.get("forSale")==="on",forRent:s.get("forRent")==="on",cover:s.get("cover"),images:s.get("cover")?[s.get("cover")]:[],tags:s.get("tags")?s.get("tags").split(",").map(r=>r.trim()):[]};l.addDress(a),o.dresses=l.getDresses(),e.reset(),v(),c(),alert("✅ Dress added successfully!")})},O=()=>{const e=document.getElementById("admin-toggle-btn");e&&e.addEventListener("click",()=>{l.isLoggedIn?w():T()})};window.deleteDress=e=>{confirm("Are you sure?")&&(l.deleteDress(e),o.dresses=l.getDresses(),v(),c())};window.editDress=e=>{alert("Edit feature coming soon! For now, you can delete and re-add.")};I();
