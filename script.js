(function(){
  "use strict";

  /* ============================================================
     DATA — 24 frames across 4 categories.
     Using curated Unsplash source images (free to use).
     'size' controls the asymmetric grid span: normal | wide | tall | big
     ============================================================ */
  const PHOTOS = [
    { cat:"landscape",    title:"Low Tide, Long Light",       img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", size:"big" },
    { cat:"architecture", title:"Concrete & Sky",              img:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80", size:"tall" },
    { cat:"portrait",     title:"Study in Profile",            img:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80", size:"normal" },
    { cat:"street",       title:"Crosswalk, 6PM",              img:"https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&q=80", size:"wide" },
    { cat:"landscape",    title:"Ridge Line",                  img:"https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80", size:"normal" },
    { cat:"architecture", title:"Stairwell No. 4",              img:"https://images.unsplash.com/photo-1481026469463-66327c86e544?w=1200&q=80", size:"normal" },
    { cat:"portrait",     title:"Window Light",                 img:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80", size:"tall" },
    { cat:"street",       title:"Rain on Glass",                 img:"https://images.unsplash.com/photo-1473625247510-8ceb1760488b?w=1200&q=80", size:"normal" },
    { cat:"landscape",    title:"Fog Over Pines",                img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80", size:"wide" },
    { cat:"architecture", title:"Glass Curtain Wall",            img:"https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1200&q=80", size:"normal" },
    { cat:"portrait",     title:"Quiet Interior",                img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80", size:"normal" },
    { cat:"street",       title:"Market Morning",                img:"https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=1200&q=80", size:"normal" },
    { cat:"landscape",    title:"Salt Flats",                    img:"https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=80", size:"normal" },
    { cat:"architecture", title:"Brutalist Form",                img:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80&sat=-20", size:"normal" },
    { cat:"portrait",     title:"Backlit",                       img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80", size:"wide" },
    { cat:"street",       title:"Subway Platform",               img:"https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1200&q=80", size:"tall" },
    { cat:"landscape",    title:"Dune Shadow",                   img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80", size:"normal" },
    { cat:"architecture", title:"Spiral",                        img:"https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80", size:"normal" },
    { cat:"portrait",     title:"Soft Focus",                    img:"https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=1200&q=80", size:"normal" },
    { cat:"street",       title:"Neon & Wet Asphalt",             img:"https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=1200&q=80", size:"normal" },
    { cat:"landscape",    title:"Open Field",                    img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80", size:"normal" },
    { cat:"architecture", title:"Symmetry Study",                img:"https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80", size:"normal" },
    { cat:"portrait",     title:"Held Gaze",                     img:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=80", size:"normal" },
    { cat:"street",       title:"Last Train",                    img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80", size:"normal" }
  ];

  const gallery = document.getElementById('gallery');
  const visibleCountEl = document.getElementById('visible-count');

  /* Build grid */
  const frag = document.createDocumentFragment();
  PHOTOS.forEach((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const el = document.createElement('div');
    el.className = 'frame';
    el.dataset.cat = p.cat;
    el.dataset.size = p.size;
    el.dataset.index = i;
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Open ${p.title}, frame ${num}`);
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <div class="scrim"></div>
      <span class="tag mono">${p.cat}</span>
      <span class="expand"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H3v6M21 3l-7 7M15 21h6v-6M3 21l7-7"/></svg></span>
      <div class="info">
        <span class="frame-no mono">Frame ${num}</span>
        <h3>${p.title}</h3>
      </div>
    `;
    frag.appendChild(el);
  });
  gallery.appendChild(frag);

  const frames = Array.from(gallery.querySelectorAll('.frame'));

  /* Staggered reveal on load */
  requestAnimationFrame(() => {
    frames.forEach((f, i) => {
      setTimeout(() => f.classList.add('show'), 35 * i);
    });
  });

  /* ============================================================
     FILTERING
     ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyFilter();
    });
  });

  function applyFilter(){
    let visible = 0;
    frames.forEach(f => {
      const match = currentFilter === 'all' || f.dataset.cat === currentFilter;
      if (match) {
        f.classList.remove('hide-filter');
        visible++;
      } else {
        f.classList.add('hide-filter');
      }
    });
    visibleCountEl.textContent = visible;
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lightbox   = document.getElementById('lightbox');
  const lbFrame     = document.getElementById('lbFrame');
  const lbImg       = document.getElementById('lbImg');
  const lbTag       = document.getElementById('lbTag');
  const lbTitle     = document.getElementById('lbTitle');
  const lbDesc      = document.getElementById('lbDesc');
  const lbCount      = document.getElementById('lbCount');
  const lbBar        = document.getElementById('lbBar');
  const lbClose       = document.getElementById('lbClose');
  const lbPrev         = document.getElementById('lbPrev');
  const lbNext           = document.getElementById('lbNext');

  let activeIndex = 0;
  let lastFocused = null;

  function visibleIndices(){
    return frames
      .map((f, i) => ({ f, i }))
      .filter(o => !o.f.classList.contains('hide-filter'))
      .map(o => o.i);
  }

  function openLightbox(index){
    lastFocused = document.activeElement;
    activeIndex = index;
    renderLightbox(true);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function renderLightbox(isOpen){
    const p = PHOTOS[activeIndex];
    const num = String(activeIndex + 1).padStart(2, '0');
    const vis = visibleIndices();
    const posInSet = vis.indexOf(activeIndex);
    const total = vis.length;

    lbFrame.classList.remove('show');

    const swap = () => {
      lbImg.src = p.img.replace('w=1200', 'w=1800');
      lbImg.alt = p.title;
      lbTag.textContent = `Frame ${num} — ${p.cat}`;
      lbTitle.textContent = p.title;
      lbDesc.textContent = `35mm · Selected print · ${p.cat[0].toUpperCase() + p.cat.slice(1)} series`;
      lbCount.textContent = `${String(Math.max(posInSet,0)+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
      lbBar.style.width = total ? `${((Math.max(posInSet,0)+1)/total)*100}%` : '0%';
      requestAnimationFrame(() => lbFrame.classList.add('show'));
    };

    if (isOpen) { swap(); } else { setTimeout(swap, 180); }
  }

  function step(dir){
    const vis = visibleIndices();
    if (!vis.length) return;
    let pos = vis.indexOf(activeIndex);
    if (pos === -1) pos = 0;
    pos = (pos + dir + vis.length) % vis.length;
    activeIndex = vis[pos];
    renderLightbox(false);
  }

  frames.forEach(f => {
    f.addEventListener('click', () => openLightbox(Number(f.dataset.index)));
    f.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(Number(f.dataset.index));
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* Touch swipe support */
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive:true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
  }, { passive:true });

  applyFilter();
})();
