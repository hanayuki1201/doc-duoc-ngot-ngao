/* --- FILE XỬ LÝ LOGIC (Script) --- */

// 1. Chuyển trang
function goToPage(pageId) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  // Reset đúng flow khi vào Characters
  if (pageId === 'page-characters') {
    const content = document.getElementById('char-content');
    const modeScreen = document.getElementById('mode-selection');
    content.style.display = 'none';
    content.style.opacity = '0';
    modeScreen.style.display = 'flex';
    modeScreen.style.opacity = '1';
  }

  if (pageId === 'page-gallery') {
    initGalleryTabs();
    renderGallery('ALL');
  }
}

let currentList = [];

// 2. Quay lại chọn chế độ
function backToSelection() {
  const content = document.getElementById('char-content');
  const modeScreen = document.getElementById('mode-selection');
  content.style.opacity = '0';
  setTimeout(() => {
    content.style.display = 'none';
    modeScreen.style.display = 'flex';
    setTimeout(() => modeScreen.style.opacity = '1', 50);
  }, 500);
}

// 3. Chọn chế độ NSFW/SFW (tô màu cho cả list + popup)
function selectMode(mode) {
  const modeScreen = document.getElementById('mode-selection');
  const content = document.getElementById('char-content');
  const popup = document.getElementById('char-popup');
  const filterArea = document.getElementById('filter-tags-area');
  const title = document.getElementById('char-title');

  // Theme
  content.classList.remove('theme-nsfw', 'theme-sfw');
  popup.classList.remove('theme-nsfw', 'theme-sfw');

  if (mode === 'NSFW') {
    content.classList.add('theme-nsfw');
    popup.classList.add('theme-nsfw');
  } else {
    content.classList.add('theme-sfw');
    popup.classList.add('theme-sfw');
  }

  // Reset bộ lọc
  filterArea.classList.remove('show');
  const filterBtn = document.querySelector('.filter-btn');
  if (filterBtn) filterBtn.classList.remove('active');

  // Chuyển cảnh
  modeScreen.style.opacity = '0';
  setTimeout(() => {
    modeScreen.style.display = 'none';
    content.style.display = 'block';
    setTimeout(() => content.style.opacity = '1', 50);
  }, 500);

  // Lọc data
  if (mode === 'NSFW') {
    currentList = (charData || []).filter(c => (c.tags || []).includes('18+'));
    title.innerText = "DANH SÁCH (NSFW)";
    title.style.color = "#ff0000";
  } else {
    currentList = (charData || []).filter(c => !(c.tags || []).includes('18+'));
    title.innerText = "DANH SÁCH (SFW)";
    title.style.color = "#00ccff";
  }

  // Render tags filter (FIX: truyền this vào filterTag)
  const tagsToShow = configTags[mode] || [];
  let tagsHTML = `<div class="f-tag active-tag" onclick="filterTag('all', this)">Tất cả</div>`;
  tagsToShow.forEach(tag => {
    tagsHTML += `<div class="f-tag" onclick="filterTag('${tag}', this)">${tag}</div>`;
  });
  filterArea.innerHTML = tagsHTML;

  renderList(currentList);
}

// 4. Bật tắt bộ lọc Tag
function toggleTags(btn) {
  const area = document.getElementById('filter-tags-area');
  area.classList.toggle('show');
  btn.classList.toggle('active');
}

// 5. Render List
function renderList(list) {
  const grid = document.getElementById('char-grid');
  grid.innerHTML = '';

  (list || []).forEach((c) => {
    const tagsHTML = (c.tags || []).map(t => `<span class="tag-small">${t}</span>`).join('');
    const div = document.createElement('div');
    div.className = 'char-card';
    div.style.animation = `fadeInPage 0.5s ease forwards`;
    div.onclick = function () { openPopup(c); };

    div.innerHTML = `
      <div class="c-img-wrap">
        <img src="${c.img}" class="c-img" alt="${c.name}">
        <div class="img-label" style="position:absolute; bottom:5px; left:10px; font-family:'Great Vibes'; color:#fcc;">
          ${c.label || ''}
        </div>
      </div>
      <div class="c-info">
        <div class="tags-row">${tagsHTML}</div>
        <div>
          <div style="font-size:1.5rem; font-weight:700;">${c.name || ''}</div>
          <div style="color:#f33; font-family:'Great Vibes';">${c.sub || ''}</div>
        </div>
        <div style="text-align:right; font-size:0.8rem; color:#844; border-top:1px solid #300; padding-top:5px;">
          ${(c.stats || '0')} souls
        </div>
      </div>
    `;
    grid.appendChild(div);
  });
}

// 6. Xử lý Popup
function openPopup(char) {
  const popup = document.getElementById('char-popup');

  // Reset expand
  const expandBtn = document.getElementById('btn-expand');
  const expandContent = document.getElementById('p-expand-content');
  if (expandBtn) expandBtn.classList.remove('active');
  if (expandContent) expandContent.classList.remove('show');

  // Fill data
  document.getElementById('p-img').src = char.img || '';
  document.getElementById('p-label').innerText = char.label || '';
  document.getElementById('p-name').innerText = char.name || '';
  document.getElementById('p-sub').innerText = char.sub || '';

  const tagsContainer = document.getElementById('p-tags-container');
  tagsContainer.innerHTML = (char.tags || []).map(t => `<span class="p-tag-pill">${t}</span>`).join('');
  document.getElementById('p-quote').innerText = `"${char.quote || ''}"`;

  // Expand Content
  const bs = char.backstory || "Chưa cập nhật.";
  const pi = char.public_info || "Chưa có thông tin.";

  if (expandContent) {
    expandContent.innerHTML = `
      <div class="info-block">
        <div class="info-title">✦ Backstory</div>
        <div class="info-text">${bs}</div>
      </div>
      <div class="info-block">
        <div class="info-title">✦ Thông tin công khai</div>
        <div class="info-text">${pi}</div>
      </div>
    `;
  }

  // Links
  const links = char.links || {};
  document.getElementById('link-mirai').href = links.mirai || "#";
  document.getElementById('link-doki').href = links.doki || "#";
  document.getElementById('link-lovey').href = links.lovey || "#";

  popup.classList.add('active');
}

function closePopup() {
  document.getElementById('char-popup').classList.remove('active');
}

function toggleExpandInfo() {
  const btn = document.getElementById('btn-expand');
  const content = document.getElementById('p-expand-content');
  if (btn) btn.classList.toggle('active');
  if (content) content.classList.toggle('show');
}

// 7. Tìm kiếm & Lọc (FIX: chống crash khi thiếu tags)
function searchChar() {
  const term = (document.getElementById('search-inp').value || '').toLowerCase();
  const filtered = (currentList || []).filter(c =>
    (c.name || '').toLowerCase().includes(term) ||
    (c.tags || []).some(t => (t || '').toLowerCase().includes(term))
  );
  renderList(filtered);
}

// FIX: không dùng event global; truyền element vào
function filterTag(tag, el) {
  document.querySelectorAll('.f-tag').forEach(t => t.classList.remove('active-tag'));
  if (el) el.classList.add('active-tag');

  if (tag === 'all') renderList(currentList);
  else renderList((currentList || []).filter(c => (c.tags || []).includes(tag)));
}

// 8. Gallery Logic
function initGalleryTabs() {
  const container = document.getElementById('gallery-tabs-container');
  const allTags = [...new Set((galleryData || []).map(item => item.tag))];

  let html = `<div class="g-tab active" onclick="filterGallery('ALL', this)">Tất Cả</div>`;
  allTags.forEach(tag => { if (tag) html += `<div class="g-tab" onclick="filterGallery('${tag}', this)">${tag}</div>`; });
  container.innerHTML = html;
}

function renderGallery(filterMode) {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  let displayData = (galleryData || []);
  if (filterMode !== 'ALL') displayData = displayData.filter(img => img.tag === filterMode);

  if (displayData.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">Chưa có ảnh.</p>`;
    return;
  }

  displayData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'g-item';
    div.style.animation = `fadeInPage 0.5s ease forwards ${i * 0.1}s`;
    div.onclick = function () { openLightbox(item.src); };
    div.innerHTML = `<img src="${item.src}" alt="Gallery Image">`;
    grid.appendChild(div);
  });
}

function filterGallery(mode, btn) {
  document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(mode);
}

// 9. Lightbox
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  img.src = src;
  lb.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

// 10. Start Screen
document.getElementById('start-screen').addEventListener('click', function () {
  this.style.opacity = '0';
  setTimeout(() => { this.style.display = 'none'; }, 1000);

  const audio = document.getElementById('bg-music');
  audio.volume = 0.5;
  audio.play().catch(e => console.log(e));
});

const sc = document.getElementById('stars-container');
for (let i = 0; i < 150; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 3 + 2;
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.left = Math.random() * 150 + '%';
  s.style.top = Math.random() * -100 + '%';
  s.style.animationDuration = Math.random() * 2 + 2 + 's';
  s.style.animationDelay = Math.random() * 5 + 's';
  sc.appendChild(s);
}
