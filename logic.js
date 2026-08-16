const archiveData = Array.isArray(window.plotArchiveData) ? window.plotArchiveData : [];

const state = {
  type: null,
  rating: null,
  tag: "all",
  search: ""
};

const ui = {
  gate: document.getElementById("entry-gate"),
  enter: document.getElementById("enter-button"),
  app: document.getElementById("archive-app"),
  typeStep: document.getElementById("type-step"),
  ratingStep: document.getElementById("rating-step"),
  catalogStep: document.getElementById("catalog-step"),
  stepHeading: document.getElementById("step-heading"),
  stepDescription: document.getElementById("step-description"),
  sfwCount: document.getElementById("sfw-count"),
  nsfwCount: document.getElementById("nsfw-count"),
  crumbType: document.getElementById("crumb-type"),
  crumbRating: document.getElementById("crumb-rating"),
  search: document.getElementById("plot-search"),
  tagFilters: document.getElementById("tag-filters"),
  plotGrid: document.getElementById("plot-grid"),
  emptyState: document.getElementById("empty-state"),
  modal: document.getElementById("plot-modal"),
  modalCover: document.getElementById("modal-cover"),
  modalOrigin: document.getElementById("modal-origin"),
  modalKind: document.getElementById("modal-kind"),
  modalTitle: document.getElementById("modal-title"),
  modalHook: document.getElementById("modal-hook"),
  modalRating: document.getElementById("modal-rating"),
  modalAccess: document.getElementById("modal-access"),
  modalStatus: document.getElementById("modal-status"),
  modalTags: document.getElementById("modal-tags"),
  modalSummary: document.getElementById("modal-summary"),
  modalSections: document.getElementById("modal-sections"),
  modalLinks: document.getElementById("modal-links")
};

const labels = {
  character: {
    name: "Char lẻ",
    heading: "Chọn liều cho câu chuyện riêng",
    description: "Một nhân vật, một mối quan hệ — nàng muốn nếm vị ngọt hay mở lọ độc tối màu?",
    kind: "One-on-One Story"
  },
  world: {
    name: "Open World",
    heading: "Chọn liều cho thế giới mở",
    description: "Mỗi thế giới đều có hai tầng dư vị. Hãy chọn cánh kho nàng muốn bước vào.",
    kind: "World Archive"
  },
  sfw: { name: "SFW", dose: "Sweet Dose" },
  nsfw: { name: "NSFW 18+", dose: "Dark Dose" }
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

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStep(activeStep) {
  [ui.typeStep, ui.ratingStep, ui.catalogStep].forEach((panel) => {
    const isActive = panel === activeStep;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  window.scrollTo({ top: document.querySelector(".archive-section").offsetTop - 70, behavior: "smooth" });
}

function openGate() {
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
  state.rating = null;
  state.tag = "all";
  state.search = "";
  ui.search.value = "";

  const typeData = archiveData.filter((plot) => plot.type === type);
  const sfw = typeData.filter((plot) => plot.rating === "sfw").length;
  const nsfw = typeData.filter((plot) => plot.rating === "nsfw").length;
  ui.sfwCount.textContent = `${sfw} hồ sơ`;
  ui.nsfwCount.textContent = `${nsfw} hồ sơ`;
  ui.stepHeading.textContent = labels[type].heading;
  ui.stepDescription.textContent = labels[type].description;
  setStep(ui.ratingStep);
}

function selectRating(rating) {
  state.rating = rating;
  state.tag = "all";
  document.body.classList.remove("theme-sfw", "theme-nsfw");
  document.body.classList.add(`theme-${rating}`);

  ui.crumbType.textContent = labels[state.type].name;
  ui.crumbRating.textContent = labels[rating].name;
  ui.stepHeading.textContent = `${labels[state.type].name} · ${labels[rating].name}`;
  ui.stepDescription.textContent = rating === "sfw"
    ? "Những câu chuyện có dư vị dịu hơn — nhưng ngọt ngào chưa bao giờ đồng nghĩa với vô hại."
    : "Khu lưu trữ trưởng thành. Nội dung có thể chứa chủ đề đen tối và chỉ dành cho người từ 18 tuổi.";

  renderTagFilters();
  renderPlots();
  setStep(ui.catalogStep);
}

function goBack(destination) {
  if (destination === "type") {
    state.type = null;
    state.rating = null;
    document.body.classList.remove("theme-sfw", "theme-nsfw");
    ui.stepHeading.textContent = "Chọn cánh cửa";
    ui.stepDescription.textContent = "Mỗi cánh cửa dẫn tới một kiểu trải nghiệm khác nhau trong khu vườn.";
    setStep(ui.typeStep);
    return;
  }

  state.rating = null;
  document.body.classList.remove("theme-sfw", "theme-nsfw");
  ui.stepHeading.textContent = labels[state.type].heading;
  ui.stepDescription.textContent = labels[state.type].description;
  setStep(ui.ratingStep);
}

function currentArchive() {
  return archiveData.filter((plot) => plot.type === state.type && plot.rating === state.rating);
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

function renderPlots() {
  const term = state.search.trim().toLocaleLowerCase("vi");
  const results = currentArchive().filter((plot) => {
    const matchesTag = state.tag === "all" || (plot.tags || []).includes(state.tag);
    const haystack = [plot.title, plot.hook, plot.summary, ...(plot.tags || [])].join(" ").toLocaleLowerCase("vi");
    return matchesTag && (!term || haystack.includes(term));
  });

  ui.plotGrid.innerHTML = results.map((plot, index) => `
    <article class="plot-card tone-${escapeHtml(plot.tone || "velvet")}" data-plot-id="${escapeHtml(plot.id)}" style="--delay:${index * 70}ms">
      <button class="plot-card-button" type="button" aria-label="Mở hồ sơ ${escapeHtml(plot.title)}">
        <div class="plot-cover" ${plotCoverStyle(plot)}>
          <span class="plot-origin">${escapeHtml(plot.origin || "🥀")}</span>
          <span class="plot-access">${escapeHtml(plot.access || "Archive")}</span>
          <span class="plot-number">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <div class="plot-card-body">
          <div class="plot-card-meta">
            <span>${escapeHtml(labels[plot.type].kind)}</span>
            <span>${escapeHtml(labels[plot.rating].dose)}</span>
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

  ui.modalCover.className = `dossier-cover tone-${plot.tone || "velvet"}`;
  ui.modalCover.style.setProperty("--plot-image", plot.cover ? `url('${plot.cover}')` : "none");
  ui.modalOrigin.textContent = plot.origin || "🥀";
  ui.modalKind.textContent = `${labels[plot.type].kind} · ${labels[plot.rating].dose}`;
  ui.modalTitle.textContent = plot.title;
  ui.modalHook.textContent = `“${plot.hook}”`;
  ui.modalRating.textContent = labels[plot.rating].name;
  ui.modalAccess.textContent = plot.access || "Archive";
  ui.modalStatus.textContent = plot.status || "Đang cập nhật";
  ui.modalSummary.textContent = plot.summary || "Hồ sơ đang được cập nhật.";

  ui.modalTags.innerHTML = (plot.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  ui.modalSections.innerHTML = (plot.sections || []).map((section, index) => `
    <section class="dossier-section">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${escapeHtml(section.label)}</h3>
        <p>${escapeHtml(section.content)}</p>
      </div>
    </section>
  `).join("");

  const activeLinks = (plot.links || []).filter((link) => link.url);
  ui.modalLinks.innerHTML = activeLinks.length
    ? activeLinks.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} ↗</a>`).join("")
    : `<span>Đường dẫn trải nghiệm đang được niêm phong.</span>`;

  ui.modal.hidden = false;
  requestAnimationFrame(() => ui.modal.classList.add("is-open"));
  document.body.classList.add("modal-open");
  ui.modal.querySelector(".modal-close")?.focus();
}

function closePlot() {
  if (ui.modal.hidden) return;
  ui.modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => { ui.modal.hidden = true; }, document.body.classList.contains("reduce-motion") ? 10 : 300);
}

ui.enter.addEventListener("click", openGate);
document.querySelectorAll("[id^='reduce-motion']").forEach((button) => button.addEventListener("click", toggleMotion));
document.querySelectorAll(".archive-door").forEach((button) => button.addEventListener("click", () => selectType(button.dataset.type)));
document.querySelectorAll(".dose-card").forEach((button) => button.addEventListener("click", () => selectRating(button.dataset.rating)));
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePlot();
});
