(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const E="Mujeresbridalpass2026!",S="MujeresBridalDB",m="dresses",D=()=>new Promise((e,t)=>{const s=indexedDB.open(S,1);s.onerror=()=>t(s.error),s.onsuccess=()=>e(s.result),s.onupgradeneeded=a=>{const r=a.target.result;r.objectStoreNames.contains(m)||r.createObjectStore(m,{keyPath:"slug"})}}),i={isLoggedIn:!1,dresses:[],db:null,async init(){try{this.db=await D(),await this.loadDresses()}catch(e){console.error("Failed to init DB:",e)}},login(e){return e===E?(this.isLoggedIn=!0,sessionStorage.setItem("adminLoggedIn","true"),!0):!1},logout(){this.isLoggedIn=!1,sessionStorage.removeItem("adminLoggedIn")},checkSession(){return this.isLoggedIn=sessionStorage.getItem("adminLoggedIn")==="true",this.isLoggedIn},async loadDresses(e=[]){return new Promise(t=>{if(!this.db){this.dresses=e,t();return}const r=this.db.transaction([m],"readonly").objectStore(m).getAll();r.onsuccess=()=>{this.dresses=r.result.length>0?r.result:e,t()},r.onerror=()=>{this.dresses=e,t()}})},async saveDresses(){if(this.db)return new Promise((e,t)=>{const s=this.db.transaction([m],"readwrite"),a=s.objectStore(m);a.clear(),this.dresses.forEach(r=>a.add(r)),s.onsuccess=()=>{console.log("✅ Changes saved locally. Use Export JSON to update catalog on GitHub."),e()},s.onerror=()=>t(s.error)})},async addDress(e){const t={slug:this.generateSlug(e.name),name:e.name,description:e.description,price:e.price?parseFloat(e.price):null,currency:e.currency||"PHP",readyToWear:e.readyToWear||!1,madeToOrder:e.madeToOrder||!1,forSale:e.forSale||!1,forRent:e.forRent||!1,images:e.images||[],cover:e.cover||null,tags:e.tags||[]};return this.dresses.push(t),await this.saveDresses(),t},async updateDress(e,t){const s=this.dresses.findIndex(a=>a.slug===e);return s!==-1?(this.dresses[s]={...this.dresses[s],...t},await this.saveDresses(),this.dresses[s]):null},async deleteDress(e){const t=this.dresses.findIndex(s=>s.slug===e);if(t!==-1){const s=this.dresses.splice(t,1);return await this.saveDresses(),s[0]}return null},getDress(e){return this.dresses.find(t=>t.slug===e)},getDresses(){return this.dresses},async convertImageToBase64(e){return new Promise((t,s)=>{const a=new FileReader;a.onload=()=>t(a.result),a.onerror=s,a.readAsDataURL(e)})},generateSlug(e){return e.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")},exportJSON(){const e={updatedAt:new Date().toISOString(),dresses:this.dresses};return JSON.stringify(e,null,2)},async importJSON(e){try{const t=JSON.parse(e);return Array.isArray(t.dresses)?(this.dresses=t.dresses,await this.saveDresses(),!0):!1}catch(t){return console.error("Import failed:",t),!1}}},f=document.querySelector("#app"),o={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},v=(e,t="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:t}).format(e)}catch{return`${e} ${t}`}},g=(e,t="")=>{const s=document.createElement("span");return s.className=`pill ${t}`.trim(),s.textContent=e,s},y=()=>{f.innerHTML=`
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
  `},I=()=>{const{dresses:e,filters:t}=o;return Object.values(t).some(a=>a===!0)?e.filter(a=>{const r=t.readyToWear?a.readyToWear:!1,n=t.madeToOrder?a.madeToOrder:!1,l=t.forSale?a.forSale:!1,d=t.forRent?a.forRent:!1;return r||n||l||d}):e},u=()=>{const e=I(),t=document.querySelector("#catalog"),s=document.querySelector("#result-meta");if(!(!t||!s)){if(s.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){t.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}t.innerHTML="";for(const a of e){const r=document.createElement("article");r.className="card",r.style.cursor="pointer";const n=document.createElement("div");n.className="card__cover",a.cover&&(n.style.backgroundImage=`url(${a.cover})`);const l=document.createElement("div");l.className="card__badges",a.readyToWear&&l.appendChild(g("Ready to wear","soft")),a.madeToOrder&&l.appendChild(g("Made to order","soft")),a.forSale&&l.appendChild(g("For sale","outline")),a.forRent&&l.appendChild(g("For rent","outline"));const d=document.createElement("div");d.className="card__body";const c=document.createElement("h3");c.textContent=a.name;const p=document.createElement("p");p.className="card__desc",p.textContent=a.description||"Minimal bridal silhouette.";const b=document.createElement("p");b.className="card__price",b.textContent=v(a.price,a.currency),d.appendChild(c),d.appendChild(p),d.appendChild(b),r.appendChild(n),r.appendChild(l),r.appendChild(d),r.addEventListener("click",()=>{o.selectedDress=a,o.currentView="detail",T()}),t.appendChild(r)}}},w=()=>{document.querySelectorAll(".filter").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-filter");o.filters[s]=!o.filters[s],t.setAttribute("aria-pressed",String(o.filters[s])),t.classList.toggle("active",o.filters[s]),u()})})},T=()=>{const e=o.selectedDress;if(!e)return;f.innerHTML=`
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
            
            <div class="detail-price">${v(e.price,e.currency)}</div>
            
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{o.currentView="catalog",o.selectedDress=null,y(),w(),u()});const t=document.querySelectorAll(".detail-thumb"),s=document.querySelector(".detail-main-image img");t.forEach(a=>{a.addEventListener("click",()=>{s.src=a.getAttribute("data-image"),t.forEach(r=>r.classList.remove("active")),a.classList.add("active")})})},A=async()=>{try{console.log("Loading catalog from GitHub...");const t=await githubModule.loadCatalogFromGitHub();if(t&&Array.isArray(t.dresses)){console.log("✅ Loaded from GitHub:",t.dresses.length,"dresses"),o.dresses=t.dresses,u();return}}catch(t){console.warn("Failed to load from GitHub, trying local fallback",t)}console.log("Loading from local catalog-data.json...");const e="/MujeresBridal/catalog-data.json";try{const t=await fetch(e);if(!t.ok)throw new Error(`HTTP ${t.status}`);const s=await t.json();o.dresses=Array.isArray(s==null?void 0:s.dresses)?s.dresses:[],console.log("✅ Loaded from local:",o.dresses.length,"dresses")}catch(t){console.warn("Using fallback sample catalog",t),o.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}u()},O=async()=>{i.checkSession(),await i.init(),y(),w(),await A(),await i.loadDresses(o.dresses),R()},k=()=>{const e=document.createElement("div");e.className="modal modal-open",e.innerHTML=`
    <div class="modal-content">
      <h2>Admin Login</h2>
      <p>Enter the admin password to manage the catalog</p>
      <input type="password" id="admin-password" placeholder="Password" class="admin-input" />
      <div class="modal-buttons">
        <button class="btn btn-primary" id="login-btn">Login</button>
        <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
      </div>
    </div>
  `,f.appendChild(e),document.getElementById("login-btn").addEventListener("click",()=>{const t=document.getElementById("admin-password").value;i.login(t)?(e.remove(),L()):alert("❌ Incorrect password")}),document.getElementById("close-modal-btn").addEventListener("click",()=>{e.remove()}),document.getElementById("admin-password").addEventListener("keypress",t=>{t.key==="Enter"&&document.getElementById("login-btn").click()}),setTimeout(()=>document.getElementById("admin-password").focus(),100)},L=()=>{const e=document.createElement("div");e.className="modal modal-open admin-panel-modal",e.innerHTML=`
    <div class="admin-panel">
      <div class="admin-header">
        <h2>Catalog Manager</h2>
        <button class="close-btn" id="close-admin-btn">✕</button>
      </div>
      
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="list">Dresses (${i.getDresses().length})</button>
        <button class="admin-tab" data-tab="add">Add New</button>
      </div>
      
      <div class="sync-status" id="sync-status">
        <span class="sync-indicator">🔄 Synced with GitHub</span>
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
  `,f.appendChild(e),document.querySelectorAll(".admin-tab").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(s=>s.classList.remove("active")),document.querySelectorAll(".admin-tab-content").forEach(s=>s.classList.remove("active")),t.classList.add("active"),document.getElementById(t.dataset.tab+"-tab").classList.add("active")})}),h(),C(),document.getElementById("close-admin-btn").addEventListener("click",()=>{e.remove()}),document.getElementById("export-btn").addEventListener("click",()=>{const t={updatedAt:new Date().toISOString(),dresses:i.getDresses()},s=JSON.stringify(t,null,2),a=new Blob([s],{type:"application/json"}),r=URL.createObjectURL(a),n=document.createElement("a");n.href=r,n.download="catalog-data.json",n.click(),URL.revokeObjectURL(r),alert(`✅ JSON exported. Now:
1. Upload this file to public/catalog-data.json
2. Commit and push to GitHub`)}),document.getElementById("logout-btn").addEventListener("click",()=>{i.logout(),e.remove()})},h=()=>{const e=document.getElementById("dresses-list"),t=i.getDresses();e.innerHTML=t.map(s=>`
    <div class="dress-item">
      <div class="dress-item-info">
        <h4>${s.name}</h4>
        <p>${s.description.substring(0,60)}...</p>
        <p class="dress-price">${v(s.price,s.currency)}</p>
      </div>
      <div class="dress-item-actions">
        <button class="btn btn-sm btn-primary" onclick="window.editDress('${s.slug}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteDress('${s.slug}')">Delete</button>
      </div>
    </div>
  `).join("")},C=()=>{const e=document.getElementById("add-dress-form");e.innerHTML=`
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
      <label>Cover Image (Upload)</label>
      <input type="file" name="coverFile" accept="image/*" class="image-input" />
      <p class="form-hint">or</p>
      <label>Cover Image URL</label>
      <input type="text" name="cover" placeholder="https://..." />
    </div>
    <div class="form-group">
      <label>Additional Images (Optional)</label>
      <input type="file" name="additionalImages" accept="image/*" multiple class="image-input" />
    </div>
    <div class="form-group">
      <label>Tags (comma-separated)</label>
      <input type="text" name="tags" placeholder="e.g., satin, minimal, elegant" />
    </div>
    <button type="submit" class="btn btn-primary" style="width: 100%;">Add Dress</button>
  `,e.addEventListener("submit",async t=>{t.preventDefault();const s=new FormData(e);let a=s.get("cover");const r=s.get("coverFile");r&&r.size>0&&(a=await i.convertImageToBase64(r));const n=[],l=s.getAll("additionalImages");for(const c of l)if(c&&c.size>0){const p=await i.convertImageToBase64(c);n.push(p)}const d={name:s.get("name"),description:s.get("description"),price:s.get("price")?parseFloat(s.get("price")):null,currency:s.get("currency"),readyToWear:s.get("readyToWear")==="on",madeToOrder:s.get("madeToOrder")==="on",forSale:s.get("forSale")==="on",forRent:s.get("forRent")==="on",cover:a,images:a?[a,...n]:n,tags:s.get("tags")?s.get("tags").split(",").map(c=>c.trim()):[]};await i.addDress(d),o.dresses=i.getDresses(),e.reset(),h(),u(),alert("✅ Dress added successfully!")})},R=()=>{const e=document.getElementById("admin-toggle-btn");e&&e.addEventListener("click",()=>{i.isLoggedIn?L():k()})};window.deleteDress=e=>{confirm("Are you sure?")&&(i.deleteDress(e),o.dresses=i.getDresses(),h(),u())};window.editDress=e=>{alert("Edit feature coming soon! For now, you can delete and re-add.")};O();
