(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const L="Mujeresbridalpass2026!",D="MujeresBridalDB",m="dresses",I=()=>new Promise((e,s)=>{const t=indexedDB.open(D,1);t.onerror=()=>s(t.error),t.onsuccess=()=>e(t.result),t.onupgradeneeded=a=>{const r=a.target.result;r.objectStoreNames.contains(m)||r.createObjectStore(m,{keyPath:"slug"})}}),o={isLoggedIn:!1,dresses:[],db:null,async init(){try{this.db=await I(),await this.loadDresses()}catch(e){console.error("Failed to init DB:",e)}},login(e){return e===L?(this.isLoggedIn=!0,sessionStorage.setItem("adminLoggedIn","true"),!0):!1},logout(){this.isLoggedIn=!1,sessionStorage.removeItem("adminLoggedIn")},checkSession(){return this.isLoggedIn=sessionStorage.getItem("adminLoggedIn")==="true",this.isLoggedIn},async loadDresses(e=[]){return new Promise(s=>{if(!this.db){this.dresses=e,s();return}const r=this.db.transaction([m],"readonly").objectStore(m).getAll();r.onsuccess=()=>{this.dresses=r.result.length>0?r.result:e,s()},r.onerror=()=>{this.dresses=e,s()}})},async saveDresses(){if(this.db)return new Promise((e,s)=>{const t=this.db.transaction([m],"readwrite"),a=t.objectStore(m);a.clear(),this.dresses.forEach(r=>a.add(r)),t.onsuccess=()=>e(),t.onerror=()=>s(t.error)})},async addDress(e){const s={slug:this.generateSlug(e.name),name:e.name,description:e.description,price:e.price?parseFloat(e.price):null,currency:e.currency||"PHP",readyToWear:e.readyToWear||!1,madeToOrder:e.madeToOrder||!1,forSale:e.forSale||!1,forRent:e.forRent||!1,images:e.images||[],cover:e.cover||null,tags:e.tags||[]};return this.dresses.push(s),await this.saveDresses(),s},async updateDress(e,s){const t=this.dresses.findIndex(a=>a.slug===e);return t!==-1?(this.dresses[t]={...this.dresses[t],...s},await this.saveDresses(),this.dresses[t]):null},async deleteDress(e){const s=this.dresses.findIndex(t=>t.slug===e);if(s!==-1){const t=this.dresses.splice(s,1);return await this.saveDresses(),t[0]}return null},getDress(e){return this.dresses.find(s=>s.slug===e)},getDresses(){return this.dresses},async convertImageToBase64(e){return new Promise((s,t)=>{const a=new FileReader;a.onload=()=>s(a.result),a.onerror=t,a.readAsDataURL(e)})},generateSlug(e){return e.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")},exportJSON(){const e={updatedAt:new Date().toISOString(),dresses:this.dresses};return JSON.stringify(e,null,2)},async importJSON(e){try{const s=JSON.parse(e);return Array.isArray(s.dresses)?(this.dresses=s.dresses,await this.saveDresses(),!0):!1}catch(s){return console.error("Import failed:",s),!1}}},f=document.querySelector("#app"),i={dresses:[],filters:{readyToWear:!1,madeToOrder:!1,forSale:!1,forRent:!1},currentView:"catalog",selectedDress:null},v=(e,s="PHP")=>{if(typeof e!="number")return"Request pricing";try{return new Intl.NumberFormat("en-PH",{style:"currency",currency:s}).format(e)}catch{return`${e} ${s}`}},g=(e,s="")=>{const t=document.createElement("span");return t.className=`pill ${s}`.trim(),t.textContent=e,t},y=()=>{f.innerHTML=`
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
  `},S=()=>{const{dresses:e,filters:s}=i;return Object.values(s).some(a=>a===!0)?e.filter(a=>{const r=s.readyToWear?a.readyToWear:!1,n=s.madeToOrder?a.madeToOrder:!1,l=s.forSale?a.forSale:!1,d=s.forRent?a.forRent:!1;return r||n||l||d}):e},p=()=>{const e=S(),s=document.querySelector("#catalog"),t=document.querySelector("#result-meta");if(!(!s||!t)){if(t.textContent=`${e.length} style${e.length===1?"":"s"} shown`,e.length===0){s.innerHTML='<p class="empty">No dresses match these filters yet. Try toggling another option.</p>';return}s.innerHTML="";for(const a of e){const r=document.createElement("article");r.className="card",r.style.cursor="pointer";const n=document.createElement("div");n.className="card__cover",a.cover&&(n.style.backgroundImage=`url(${a.cover})`);const l=document.createElement("div");l.className="card__badges",a.readyToWear&&l.appendChild(g("Ready to wear","soft")),a.madeToOrder&&l.appendChild(g("Made to order","soft")),a.forSale&&l.appendChild(g("For sale","outline")),a.forRent&&l.appendChild(g("For rent","outline"));const d=document.createElement("div");d.className="card__body";const c=document.createElement("h3");c.textContent=a.name;const u=document.createElement("p");u.className="card__desc",u.textContent=a.description||"Minimal bridal silhouette.";const b=document.createElement("p");b.className="card__price",b.textContent=v(a.price,a.currency),d.appendChild(c),d.appendChild(u),d.appendChild(b),r.appendChild(n),r.appendChild(l),r.appendChild(d),r.addEventListener("click",()=>{i.selectedDress=a,i.currentView="detail",T()}),s.appendChild(r)}}},w=()=>{document.querySelectorAll(".filter").forEach(s=>{s.addEventListener("click",()=>{const t=s.getAttribute("data-filter");i.filters[t]=!i.filters[t],s.setAttribute("aria-pressed",String(i.filters[t])),s.classList.toggle("active",i.filters[t]),p()})})},T=()=>{const e=i.selectedDress;if(!e)return;f.innerHTML=`
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{i.currentView="catalog",i.selectedDress=null,y(),w(),p()});const s=document.querySelectorAll(".detail-thumb"),t=document.querySelector(".detail-main-image img");s.forEach(a=>{a.addEventListener("click",()=>{t.src=a.getAttribute("data-image"),s.forEach(r=>r.classList.remove("active")),a.classList.add("active")})})},A=async()=>{const e="/catalog-data.json";try{const s=await fetch(e);if(!s.ok)throw new Error(`HTTP ${s.status}`);const t=await s.json();i.dresses=Array.isArray(t==null?void 0:t.dresses)?t.dresses:[]}catch(s){console.warn("Using fallback sample catalog",s),i.dresses=[{slug:"sample-dress",name:"Celeste Sample",description:"Hand-finished satin column gown with removable overskirt.",price:12800,currency:"PHP",readyToWear:!0,madeToOrder:!0,forSale:!0,forRent:!0,images:["catalog/sample-dress/dress-placeholder.svg"],cover:"catalog/sample-dress/dress-placeholder.svg"}]}p()},O=async()=>{o.checkSession(),await o.init(),y(),w(),await A(),await o.loadDresses(i.dresses),x()},k=()=>{const e=document.createElement("div");e.className="modal modal-open",e.innerHTML=`
    <div class="modal-content">
      <h2>Admin Login</h2>
      <p>Enter the admin password to manage the catalog</p>
      <input type="password" id="admin-password" placeholder="Password" class="admin-input" />
      <div class="modal-buttons">
        <button class="btn btn-primary" id="login-btn">Login</button>
        <button class="btn btn-secondary" id="close-modal-btn">Cancel</button>
      </div>
    </div>
  `,f.appendChild(e),document.getElementById("login-btn").addEventListener("click",()=>{const s=document.getElementById("admin-password").value;o.login(s)?(e.remove(),E()):alert("❌ Incorrect password")}),document.getElementById("close-modal-btn").addEventListener("click",()=>{e.remove()}),document.getElementById("admin-password").addEventListener("keypress",s=>{s.key==="Enter"&&document.getElementById("login-btn").click()}),setTimeout(()=>document.getElementById("admin-password").focus(),100)},E=()=>{const e=document.createElement("div");e.className="modal modal-open admin-panel-modal",e.innerHTML=`
    <div class="admin-panel">
      <div class="admin-header">
        <h2>Catalog Manager</h2>
        <button class="close-btn" id="close-admin-btn">✕</button>
      </div>
      
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="list">Dresses (${o.getDresses().length})</button>
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
  `,f.appendChild(e),document.querySelectorAll(".admin-tab").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".admin-tab-content").forEach(t=>t.classList.remove("active")),s.classList.add("active"),document.getElementById(s.dataset.tab+"-tab").classList.add("active")})}),h(),R(),document.getElementById("close-admin-btn").addEventListener("click",()=>{e.remove()}),document.getElementById("export-btn").addEventListener("click",()=>{const s=o.exportJSON(),t=new Blob([s],{type:"application/json"}),a=URL.createObjectURL(t),r=document.createElement("a");r.href=a,r.download="catalog-data.json",r.click(),URL.revokeObjectURL(a)}),document.getElementById("logout-btn").addEventListener("click",()=>{o.logout(),e.remove()})},h=()=>{const e=document.getElementById("dresses-list"),s=o.getDresses();e.innerHTML=s.map(t=>`
    <div class="dress-item">
      <div class="dress-item-info">
        <h4>${t.name}</h4>
        <p>${t.description.substring(0,60)}...</p>
        <p class="dress-price">${v(t.price,t.currency)}</p>
      </div>
      <div class="dress-item-actions">
        <button class="btn btn-sm btn-primary" onclick="window.editDress('${t.slug}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="window.deleteDress('${t.slug}')">Delete</button>
      </div>
    </div>
  `).join("")},R=()=>{const e=document.getElementById("add-dress-form");e.innerHTML=`
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
  `,e.addEventListener("submit",async s=>{s.preventDefault();const t=new FormData(e);let a=t.get("cover");const r=t.get("coverFile");r&&r.size>0&&(a=await o.convertImageToBase64(r));const n=[],l=t.getAll("additionalImages");for(const c of l)if(c&&c.size>0){const u=await o.convertImageToBase64(c);n.push(u)}const d={name:t.get("name"),description:t.get("description"),price:t.get("price")?parseFloat(t.get("price")):null,currency:t.get("currency"),readyToWear:t.get("readyToWear")==="on",madeToOrder:t.get("madeToOrder")==="on",forSale:t.get("forSale")==="on",forRent:t.get("forRent")==="on",cover:a,images:a?[a,...n]:n,tags:t.get("tags")?t.get("tags").split(",").map(c=>c.trim()):[]};await o.addDress(d),i.dresses=o.getDresses(),e.reset(),h(),p(),alert("✅ Dress added successfully!")})},x=()=>{const e=document.getElementById("admin-toggle-btn");e&&e.addEventListener("click",()=>{o.isLoggedIn?E():k()})};window.deleteDress=e=>{confirm("Are you sure?")&&(o.deleteDress(e),i.dresses=o.getDresses(),h(),p())};window.editDress=e=>{alert("Edit feature coming soon! For now, you can delete and re-add.")};O();
