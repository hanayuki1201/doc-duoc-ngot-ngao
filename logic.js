let archiveData = Array.isArray(window.plotArchiveData) ? [...window.plotArchiveData] : [];

const state = {
  type: null,
  access: null,
  tag: "all",
  search: "",
  activePlotId: null,
  activeImageSource: ""
};

const ui = {
  gate: document.getElementById("entry-gate"),
  enter: document.getElementById("enter-button"),
  app: document.getElementById("archive-app"),
  typeStep: document.getElementById("type-step"),
  accessStep: document.getElementById("access-step"),
  catalogStep: document.getElementById("catalog-step"),
  stepHeading: document.getElementById("step-heading"),
  stepDescription: document.getElementById("step-description"),
  firstTasteCount: document.getElementById("first-taste-count"),
  sealedVialCount: document.getElementById("sealed-vial-count"),
  crumbType: document.getElementById("crumb-type"),
  crumbAccess: document.getElementById("crumb-access"),
  search: document.getElementById("plot-search"),
  tagFilters: document.getElementById("tag-filters"),
  plotGrid: document.getElementById("plot-grid"),
  emptyState: document.getElementById("empty-state"),
  modal: document.getElementById("plot-modal"),
  modalDossier: document.querySelector(".plot-dossier"),
  modalOrigin: document.getElementById("modal-origin"),
  modalKind: document.getElementById("modal-kind"),
  modalTitle: document.getElementById("modal-title"),
  modalPoisonHook: document.getElementById("modal-poison-hook"),
  modalAccess: document.getElementById("modal-access"),
  modalFormat: document.getElementById("modal-format"),
  modalStatus: document.getElementById("modal-status"),
  modalTags: document.getElementById("modal-tags"),
  modalSummary: document.getElementById("modal-summary"),
  modalGalleryWrap: document.getElementById("modal-gallery-wrap"),
  modalGallery: document.getElementById("modal-gallery"),
  modalGalleryCount: document.getElementById("modal-gallery-count"),
  modalImageExpansion: document.getElementById("modal-image-expansion"),
  modalExpandedImage: document.getElementById("modal-expanded-image"),
  modalExpandedClose: document.getElementById("modal-expanded-close"),
  modalSections: document.getElementById("modal-sections"),
  modalLinks: document.getElementById("modal-links")
};

const labels = {
  character: {
    name: "Plot Nhân Vật",
    heading: "Chọn khu vực cho plot nhân vật",
    description: "Từ solo, nhiều tuyến nhân vật đến NP — mỗi hồ sơ đều được dẫn dắt bởi mối quan hệ.",
    kind: "Character-led Story"
  },
  world: {
    name: "Open World",
    heading: "Chọn khu vực cho thế giới mở",
    description: "Mỗi thế giới đều có một cách bước vào. Hãy chọn bộ sưu tập nàng muốn khám phá.",
    kind: "World Archive"
  },
  "first-taste": { name: "First Taste", collection: "First Taste" },
  "sealed-vial": { name: "Sealed Vial", collection: "Sealed Vial" }
};

function createFallingLight() {
  document.querySelectorAll(".light-fall").forEach((layer, layerIndex) => {
    const particleCount = window.innerWidth < 700 ? 24 : 34;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < particleCount; index += 1) {
      const particle = document.createElement("span");
      const isStreak = index % 7 === 0;
      const isIvory = !isStreak && index % 3 === 0;
      particle.className = isStreak ? "light-streak" : `light-mote${isIvory ? " light-mote-ivory" : ""}`;
      particle.style.setProperty("--x", `${(index * 37 + layerIndex * 13) % 101}%`);
      particle.style.setProperty("--size", `${3 + ((index * 5) % 5)}px`);
      particle.style.setProperty("--duration", `${8 + ((index * 7) % 10)}s`);
      particle.style.setProperty("--delay", `${-((index * 1.17 + layerIndex * 2.3) % 16)}s`);
      particle.style.setProperty("--drift", `${-52 + ((index * 23) % 105)}px`);
      fragment.appendChild(particle);
    }

    layer.replaceChildren(fragment);
  });
}

createFallingLight();

const importedOrigins = {
  "Yoon Tae Oh (윤대오)": "🇰🇷",
  "Sổ tay trốn việc của Tứ đại Thiếu gia Hoắc thị": "🇨🇳",
  "Vầng sáng Aurelis": "✦",
  "Phần 1 : Bí mật ánh trăng hạ": "🌙",
  "E.D.E.N 2": "🧬",
  "Đỗ Vĩnh Khang": "🇻🇳",
  "Tanaka Hayato": "🇯🇵",
  "Tần Dực": "🇨🇳",
  "Lục Thần Dạ": "🇨🇳"
};

function cleanArchiveText(value = "") {
  return String(value).replaceAll("\u200b", "").replaceAll("\r\n", "\n").trim();
}

function firstMeaningfulLine(value = "") {
  const line = cleanArchiveText(value)
    .split("\n")
    .map((item) => item.trim())
    .find((item) => item && !/^[｡･:*★☆─—\s]+$/.test(item));
  if (!line) return "Một hồ sơ đang chờ nàng mở ra.";
  return line.length > 190 ? `${line.slice(0, 187).trim()}…` : line;
}

function archiveAssetPath(value = "") {
  const sourcePath = String(value).replace(/^\/+/, "");
  const embeddedImage = window.plotArchiveImport?.images?.[sourcePath];
  if (embeddedImage) return embeddedImage;
  return `plot-assets/${sourcePath.replace(/\.png$/i, ".webp")}`;
}

function inferPlotFormat(tags = []) {
  const normalized = tags.map((tag) => String(tag).toLocaleLowerCase("vi"));
  if (normalized.includes("np")) return "NP / Multi-character";
  if (normalized.some((tag) => tag.includes("reverseharem") || tag.includes("otome"))) return "Multi-route";
  return "Solo Route";
}

function inferArchiveType(raw, tags = []) {
  const normalized = tags.map((tag) => String(tag).toLocaleLowerCase("vi").replaceAll(" ", ""));
  const hasCharacterDossier = Boolean(cleanArchiveText(raw.character_dossier));
  const hasWorldDossier = Boolean(cleanArchiveText(raw.world_dossier));
  const markedAsWorld = normalized.some((tag) => ["ow", "openworld", "worldbuilding"].includes(tag));
  return markedAsWorld || (!hasCharacterDossier && hasWorldDossier) ? "world" : "character";
}

function makeImportedPlot(raw) {
  const accessTier = raw.khu_vuc === "Sealed Vial" ? "sealed-vial" : "first-taste";
  const access = labels[accessTier].name;
  const sourceTags = Array.isArray(raw.tags) ? raw.tags.map(cleanArchiveText).filter(Boolean) : [];
  const tags = [...new Set([...sourceTags, access])];
  const hasNsfwTag = sourceTags.some((tag) => tag.toLocaleLowerCase("vi") === "nsfw");
  const type = inferArchiveType(raw, sourceTags);
  const sourceImages = Array.isArray(raw.anh) ? raw.anh.filter(Boolean) : [];
  const images = sourceImages.map(archiveAssetPath);
  const sections = [];

  const addSection = (label, content) => {
    const cleaned = cleanArchiveText(content);
    if (cleaned) sections.push({ label, content: cleaned });
  };

  addSection("Poison Hook", raw.poison_hook);
  addSection("First Sip", raw.first_sip);
  addSection("Nơi câu chuyện bắt đầu", raw.where_it_begins);
  addSection("Hồ sơ nhân vật", raw.character_dossier);
  addSection("Hồ sơ thế giới", raw.world_dossier);
  addSection("Behind the Curtain", raw.behind_the_curtain);
  (Array.isArray(raw.extra_stories) ? raw.extra_stories : []).forEach((story, index) => {
    if (story && typeof story === "object") addSection(cleanArchiveText(story.title) || `Ngoại truyện ${index + 1}`, story.body);
  });

  const slug = cleanArchiveText(raw.thu_muc_anh).split("/").filter(Boolean).pop() || cleanArchiveText(raw.id) || `plot-${archiveData.length}`;
  const firstSip = cleanArchiveText(raw.first_sip);

  return {
    id: `import-${slug}`,
    origin: importedOrigins[raw.name] || "🥀",
    title: cleanArchiveText(raw.name),
    type,
    accessTier,
    access,
    format: type === "world" ? "World-led" : inferPlotFormat(sourceTags),
    contentRating: hasNsfwTag ? "NSFW" : "Unrated",
    tone: type === "world" ? "world" : accessTier === "sealed-vial" ? "blood" : hasNsfwTag ? "crimson" : sourceTags.includes("Fantasy") ? "dream" : "velvet",
    cover: images[0] || "",
    gallery: images.slice(1),
    status: raw.badge === "HOT" ? "Nổi bật" : raw.badge === "NEW" ? "Mới cập nhật" : cleanArchiveText(raw.badge) || "Đã lưu trữ",
    hook: firstMeaningfulLine(raw.poison_hook),
    summary: firstSip || firstMeaningfulLine(raw.poison_hook),
    tags,
    sections,
    links: []
  };
}

function normalizeExistingPlots() {
  archiveData = archiveData.map((plot) => {
    const accessTier = plot.accessTier || (plot.access === "Sealed Vial" ? "sealed-vial" : "first-taste");
    const access = labels[accessTier].name;
    return {
      ...plot,
      accessTier,
      access,
      format: plot.format || (plot.type === "world" ? "World-led" : "Solo Route"),
      tags: [...new Set([...(plot.tags || []), access])]
    };
  });
}

async function loadImportedCharacters() {
  normalizeExistingPlots();
  try {
    let payload = window.plotArchiveImport?.payload;
    if (!payload) {
      const response = await fetch("plot-assets/characters.json?v=10");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      payload = await response.json();
    }
    const imported = Array.isArray(payload.characters) ? payload.characters.map(makeImportedPlot) : [];
    const knownIds = new Set(archiveData.map((plot) => plot.id));
    archiveData.push(...imported.filter((plot) => !knownIds.has(plot.id)));
  } catch (error) {
    console.warn("Không thể nạp dữ liệu nhân vật đã xuất:", error);
  }
}

const dataReady = loadImportedCharacters();

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStep(activeStep) {
  [ui.typeStep, ui.accessStep, ui.catalogStep].forEach((panel) => {
    const isActive = panel === activeStep;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  window.scrollTo({ top: document.querySelector(".archive-section").offsetTop - 70, behavior: "smooth" });
}

async function openGate() {
  ui.enter.disabled = true;
  await dataReady;
  ui.gate.classList.add("is-leaving");
  ui.app.setAttribute("aria-hidden", "false");
  document.body.classList.add("archive-open");
  window.setTimeout(() => {
    ui.gate.hidden = true;
    ui.app.classList.add("is-visible");
    document.querySelector(".archive-door")?.focus({ preventScroll: true });
  }, document.body.classList.contains("reduce-motion") ? 20 : 850);
}

function toggleMotion() {
  document.body.classList.toggle("reduce-motion");
  const reduced = document.body.classList.contains("reduce-motion");
  document.querySelectorAll("[id^='reduce-motion']").forEach((button) => {
    button.setAttribute("aria-pressed", String(reduced));
    button.title = reduced ? "Bật lại hiệu ứng" : "Giảm hiệu ứng";
  });
}

function selectType(type) {
  state.type = type;
  state.access = null;
  state.tag = "all";
  state.search = "";
  ui.search.value = "";
  document.body.classList.remove("theme-character", "theme-world");
  document.body.classList.add(`theme-${type}`);

  const typeData = archiveData.filter((plot) => plot.type === type);
  const firstTaste = typeData.filter((plot) => plot.accessTier === "first-taste").length;
  const sealedVial = typeData.filter((plot) => plot.accessTier === "sealed-vial").length;
  ui.firstTasteCount.textContent = `${firstTaste} hồ sơ`;
  ui.sealedVialCount.textContent = `${sealedVial} hồ sơ`;
  ui.stepHeading.textContent = labels[type].heading;
  ui.stepDescription.textContent = labels[type].description;
  setStep(ui.accessStep);
}

function selectAccess(access) {
  state.access = access;
  state.tag = "all";

  ui.crumbType.textContent = labels[state.type].name;
  ui.crumbAccess.textContent = labels[access].name;
  ui.stepHeading.textContent = `${labels[state.type].name} · ${labels[access].name}`;
  ui.stepDescription.textContent = access === "first-taste"
    ? "Bộ sưu tập First Taste — những hồ sơ đang mở trong khu vườn của Delicious Poison."
    : "Bộ sưu tập Sealed Vial — những plot đặc biệt mang dấu niêm phong riêng của Nàng chủ.";

  renderTagFilters();
  renderPlots();
  setStep(ui.catalogStep);
}

function goBack(destination) {
  if (destination === "type") {
    state.type = null;
    state.access = null;
    ui.stepHeading.textContent = "Chọn cánh cửa";
    ui.stepDescription.textContent = "Mỗi cánh cửa dẫn tới một kiểu trải nghiệm khác nhau trong khu vườn.";
    document.body.classList.remove("theme-character", "theme-world");
    setStep(ui.typeStep);
    return;
  }

  state.access = null;
  ui.stepHeading.textContent = labels[state.type].heading;
  ui.stepDescription.textContent = labels[state.type].description;
  setStep(ui.accessStep);
}

function currentArchive() {
  return archiveData.filter((plot) => plot.type === state.type && plot.accessTier === state.access);
}

function renderTagFilters() {
  const tags = [...new Set(currentArchive().flatMap((plot) => plot.tags || []))].sort((a, b) => a.localeCompare(b));
  ui.tagFilters.innerHTML = ["all", ...tags].map((tag) => {
    const text = tag === "all" ? "Tất cả" : tag;
    const pressed = state.tag === tag;
    return `<button type="button" class="tag-filter ${pressed ? "is-active" : ""}" data-tag="${escapeHtml(tag)}" aria-pressed="${pressed}">${escapeHtml(text)}</button>`;
  }).join("");
}

function plotCoverStyle(plot) {
  return plot.cover ? `style="--plot-image:url('${escapeHtml(plot.cover)}')"` : "";
}

function setExpandedImageSource(source = "") {
  state.activeImageSource = source;
  ui.modalExpandedImage.src = source || "";
  ui.modalExpandedImage.alt = source && state.activePlotId ? `Ảnh đầy đủ của ${ui.modalTitle.textContent}` : "";
}

function hideExpandedImage() {
  ui.modalImageExpansion.hidden = true;
}

function showExpandedImage(source = state.activeImageSource) {
  if (!source) return;
  setExpandedImageSource(source);
  ui.modalImageExpansion.hidden = false;
  requestAnimationFrame(() => ui.modalImageExpansion.scrollIntoView({ behavior: "smooth", block: "nearest" }));
}

function renderGallery(plot) {
  const images = [plot.cover, ...(plot.gallery || [])].filter(Boolean);
  ui.modalGalleryWrap.hidden = images.length === 0;
  ui.modalGalleryCount.textContent = `${images.length} ảnh`;
  ui.modalGallery.innerHTML = images.map((source, index) => `
    <button class="gallery-thumb ${index === 0 ? "is-active" : ""}" type="button" data-gallery-src="${escapeHtml(source)}" aria-label="Xem ảnh ${index + 1} của ${escapeHtml(plot.title)}">
      <img src="${escapeHtml(source)}" alt="" loading="lazy" decoding="async">
    </button>
  `).join("");
}

function renderPlots() {
  const term = state.search.trim().toLocaleLowerCase("vi");
  const results = currentArchive().filter((plot) => {
    const matchesTag = state.tag === "all" || (plot.tags || []).includes(state.tag);
    const haystack = [plot.title, plot.hook, plot.summary, ...(plot.tags || [])].join(" ").toLocaleLowerCase("vi");
    return matchesTag && (!term || haystack.includes(term));
  });

  ui.plotGrid.innerHTML = results.map((plot, index) => `
    <article class="plot-card type-${escapeHtml(plot.type)} access-${escapeHtml(plot.accessTier || "first-taste")} tone-${escapeHtml(plot.tone || "velvet")}" data-plot-id="${escapeHtml(plot.id)}" style="--delay:${index * 70}ms">
      <button class="plot-card-button" type="button" aria-label="Mở hồ sơ ${escapeHtml(plot.title)}">
        <div class="plot-cover" ${plotCoverStyle(plot)}>
          <span class="plot-origin">${escapeHtml(plot.origin || "🥀")}</span>
          <span class="plot-access">${escapeHtml(plot.access || "Archive")}</span>
          <span class="plot-number">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <div class="plot-card-body">
          <div class="plot-card-meta">
            <span>${escapeHtml(labels[plot.type].kind)}</span>
            <span>${escapeHtml(plot.format || plot.access)}</span>
          </div>
          <h3>${escapeHtml(plot.title)}</h3>
          <p class="plot-hook">“${escapeHtml(plot.hook)}”</p>
          <div class="plot-tags">${(plot.tags || []).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <span class="open-dossier">MỞ HỒ SƠ PLOT <b>↗</b></span>
        </div>
      </button>
    </article>
  `).join("");

  ui.emptyState.hidden = results.length > 0;
}

function openPlot(id) {
  const plot = archiveData.find((item) => item.id === id);
  if (!plot) return;

  state.activePlotId = id;
  hideExpandedImage();

  ui.modalDossier.classList.remove("type-character", "type-world", "access-first-taste", "access-sealed-vial");
  ui.modalDossier.classList.add(`type-${plot.type}`, `access-${plot.accessTier || "first-taste"}`);
  ui.modalOrigin.textContent = plot.origin || "🥀";
  ui.modalKind.textContent = `${labels[plot.type].kind} · ${plot.access}`;
  ui.modalTitle.textContent = plot.title;
  const poisonHookSection = (plot.sections || []).find((section) => String(section.label).trim().toLocaleLowerCase("vi") === "poison hook");
  const firstSipSection = (plot.sections || []).find((section) => String(section.label).trim().toLocaleLowerCase("vi") === "first sip");
  ui.modalPoisonHook.textContent = poisonHookSection?.content || plot.hook || "Hồ sơ chưa có Poison Hook.";
  setExpandedImageSource(plot.cover);
  ui.modalAccess.textContent = plot.access || "First Taste";
  ui.modalFormat.textContent = plot.format || labels[plot.type].kind;
  ui.modalStatus.textContent = plot.status || "Đang cập nhật";
  ui.modalSummary.textContent = firstSipSection?.content || plot.summary || "Hồ sơ đang được cập nhật.";

  ui.modalTags.innerHTML = (plot.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  renderGallery(plot);
  const remainingSections = (plot.sections || []).filter((section) => section !== poisonHookSection && section !== firstSipSection);
  ui.modalSections.innerHTML = remainingSections.map((section, index) => `
    <section class="dossier-section">
      <span>${String(index + 3).padStart(2, "0")}</span>
      <div>
        <h3>${escapeHtml(section.label)}</h3>
        <p>${escapeHtml(section.content)}</p>
      </div>
    </section>
  `).join("");

  const activeLinks = (plot.links || []).filter((link) => link.url);
  ui.modalLinks.innerHTML = activeLinks.length
    ? activeLinks.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} ↗</a>`).join("")
    : `<span>Link chatbot và mã lọ không nằm trong bản xuất Archive.</span>`;

  ui.modal.hidden = false;
  requestAnimationFrame(() => ui.modal.classList.add("is-open"));
  document.body.classList.add("modal-open");
  ui.modal.querySelector(".modal-close")?.focus();
}

function closePlot() {
  if (ui.modal.hidden) return;
  state.activePlotId = null;
  state.activeImageSource = "";
  hideExpandedImage();
  ui.modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => { ui.modal.hidden = true; }, document.body.classList.contains("reduce-motion") ? 10 : 300);
}

ui.enter.addEventListener("click", openGate);
document.querySelectorAll("[id^='reduce-motion']").forEach((button) => button.addEventListener("click", toggleMotion));
document.querySelectorAll(".archive-door").forEach((button) => button.addEventListener("click", () => selectType(button.dataset.type)));
document.querySelectorAll(".access-card").forEach((button) => button.addEventListener("click", () => selectAccess(button.dataset.access)));
document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => goBack(button.dataset.back)));

ui.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderPlots();
});

ui.tagFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tag]");
  if (!button) return;
  state.tag = button.dataset.tag;
  renderTagFilters();
  renderPlots();
});

ui.plotGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-plot-id]");
  if (card) openPlot(card.dataset.plotId);
});

ui.modal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) closePlot();
});

ui.modalGallery.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gallery-src]");
  if (!button) return;
  showExpandedImage(button.dataset.gallerySrc);
  ui.modalGallery.querySelectorAll(".gallery-thumb").forEach((thumb) => thumb.classList.toggle("is-active", thumb === button));
});

ui.modalExpandedClose.addEventListener("click", hideExpandedImage);
ui.modalExpandedImage.addEventListener("click", hideExpandedImage);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!ui.modalImageExpansion.hidden) {
    hideExpandedImage();
    return;
  }
  closePlot();
});
