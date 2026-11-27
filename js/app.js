const STORAGE_KEY = "printech_fixcare_incidents_v1";

const CATEGORIES = [
  "Todas",
  "Hardware / Fuser",
  "Atascos / Papel",
  "Calidad / Tóner",
  "Red / Drivers",
  "Firmware / Sistema"
];

let incidents = [];
let selectedCategory = "Todas";
let searchQuery = "";

const els = {
  searchInput: document.getElementById("searchInput"),
  categoryFilters: document.getElementById("categoryFilters"),
  incidentsGrid: document.getElementById("incidentsGrid"),
  resultsCount: document.getElementById("resultsCount"),
  openCreateBtn: document.getElementById("openCreateBtn"),
  formModal: document.getElementById("formModal"),
  formModalTitle: document.getElementById("formModalTitle"),
  incidentForm: document.getElementById("incidentForm"),
  closeFormModalBtn: document.getElementById("closeFormModalBtn"),
  cancelFormBtn: document.getElementById("cancelFormBtn"),
  incidentId: document.getElementById("incidentId"),
  modelInput: document.getElementById("modelInput"),
  codeInput: document.getElementById("codeInput"),
  categoryInput: document.getElementById("categoryInput"),
  priorityInput: document.getElementById("priorityInput"),
  causeInput: document.getElementById("causeInput"),
  stepsInput: document.getElementById("stepsInput"),
  notesInput: document.getElementById("notesInput"),
  detailModal: document.getElementById("detailModal"),
  detailContent: document.getElementById("detailContent"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  importJsonInput: document.getElementById("importJsonInput"),
  resetSeedBtn: document.getElementById("resetSeedBtn")
};

function loadIncidents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    incidents = structuredClone(SEED_INCIDENTS);
    saveIncidents();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    incidents = Array.isArray(parsed) ? parsed : structuredClone(SEED_INCIDENTS);
  } catch {
    incidents = structuredClone(SEED_INCIDENTS);
  }
}

function saveIncidents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
}

function getFilteredIncidents() {
  const q = searchQuery.trim().toLowerCase();
  return incidents.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todas" || item.category === selectedCategory;

    const haystack = [
      item.model,
      item.code,
      item.category,
      item.cause,
      item.notes || "",
      ...(item.steps || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !q || haystack.includes(q);
    return matchesCategory && matchesSearch;
  });
}

function renderCategories() {
  els.categoryFilters.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${selectedCategory === cat ? "is-active" : ""}`;
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      selectedCategory = cat;
      renderCategories();
      renderIncidents();
    });
    els.categoryFilters.appendChild(btn);
  });
}

function renderIncidents() {
  const filtered = getFilteredIncidents();
  els.resultsCount.textContent = `${filtered.length} ${
    filtered.length === 1 ? "incidencia" : "incidencias"
  }`;

  if (filtered.length === 0) {
    els.incidentsGrid.innerHTML =
      `<p class="panel__hint">No se encontraron incidencias con ese filtro o búsqueda.</p>`;
    return;
  }

  els.incidentsGrid.innerHTML = "";
  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__top">
        <div>
          <h3 class="card__code">${escapeHtml(item.code)}</h3>
          <p class="card__model">${escapeHtml(item.model)}</p>
        </div>
        <span class="badge">${escapeHtml(item.priority)}</span>
      </div>
      <span class="badge">${escapeHtml(item.category)}</span>
      <p class="card__cause">${escapeHtml(item.cause)}</p>
      <div class="card__footer">
        <button type="button" class="btn btn--primary btn--sm" data-action="view" data-id="${item.id}">
          Ver pasos
        </button>
        <button type="button" class="btn btn--secondary btn--sm" data-action="edit" data-id="${item.id}">
          Editar
        </button>
        <button type="button" class="btn btn--danger btn--sm" data-action="delete" data-id="${item.id}">
          Eliminar
        </button>
      </div>
    `;
    els.incidentsGrid.appendChild(card);
  });
}

function openCreateModal() {
  els.formModalTitle.textContent = "Nueva incidencia";
  els.incidentForm.reset();
  els.incidentId.value = "";
  els.formModal.showModal();
}

function openEditModal(id) {
  const item = incidents.find((inc) => inc.id === id);
  if (!item) return;

  els.formModalTitle.textContent = "Editar incidencia";
  els.incidentId.value = item.id;
  els.modelInput.value = item.model;
  els.codeInput.value = item.code;
  els.categoryInput.value = item.category;
  els.priorityInput.value = item.priority;
  els.causeInput.value = item.cause;
  els.stepsInput.value = (item.steps || []).join("\n");
  els.notesInput.value = item.notes || "";
  els.formModal.showModal();
}

function openDetailModal(id) {
  const item = incidents.find((inc) => inc.id === id);
  if (!item) return;

  const stepsHtml = (item.steps || [])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  els.detailContent.innerHTML = `
    <div class="modal__header">
      <div>
        <h2>${escapeHtml(item.code)}</h2>
        <p class="card__model">${escapeHtml(item.model)} · ${escapeHtml(item.category)}</p>
      </div>
      <button type="button" class="icon-btn" id="closeDetailBtn" aria-label="Cerrar">✕</button>
    </div>

    <div>
      <strong>Causa probable:</strong>
      <p class="card__cause">${escapeHtml(item.cause)}</p>
    </div>

    <div>
      <strong>Pasos de solución:</strong>
      <ol class="steps-list">${stepsHtml}</ol>
    </div>

    ${
      item.notes
        ? `<p class="panel__hint"><strong>Notas:</strong> ${escapeHtml(item.notes)}</p>`
        : ""
    }

    <div class="modal__footer">
      <button type="button" class="btn btn--secondary" id="copySolutionBtn">
        Copiar solución
      </button>
      <button type="button" class="btn btn--primary" id="closeDetailFooterBtn">
        Listo
      </button>
    </div>
  `;

  els.detailModal.showModal();

  document.getElementById("closeDetailBtn").addEventListener("click", () => els.detailModal.close());
  document.getElementById("closeDetailFooterBtn").addEventListener("click", () => els.detailModal.close());
  document.getElementById("copySolutionBtn").addEventListener("click", async () => {
    const textToCopy = [
      `${item.model} - ${item.code}`,
      `Causa probable: ${item.cause}`,
      "Pasos:",
      ...(item.steps || []).map((s, idx) => `${idx + 1}. ${s}`)
    ].join("\n");

    await navigator.clipboard.writeText(textToCopy);
    alert("Solución copiada al portapapeles.");
  });
}

function deleteIncident(id) {
  const item = incidents.find((inc) => inc.id === id);
  if (!item) return;
  const confirmed = confirm(`¿Eliminar "${item.code}" (${item.model})?`);
  if (!confirmed) return;

  incidents = incidents.filter((inc) => inc.id !== id);
  saveIncidents();
  renderIncidents();
}

function handleFormSubmit(event) {
  event.preventDefault();

  const steps = els.stepsInput.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    id: els.incidentId.value || `inc-${Date.now()}`,
    model: els.modelInput.value.trim(),
    code: els.codeInput.value.trim(),
    category: els.categoryInput.value,
    priority: els.priorityInput.value,
    cause: els.causeInput.value.trim(),
    steps,
    notes: els.notesInput.value.trim(),
    updatedAt: new Date().toISOString().slice(0, 10)
  };

  const existingIndex = incidents.findIndex((inc) => inc.id === payload.id);
  if (existingIndex >= 0) {
    incidents[existingIndex] = payload;
  } else {
    incidents.unshift(payload);
  }

  saveIncidents();
  renderIncidents();
  els.formModal.close();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(incidents, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "printech-fixcare-respaldo.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed)) throw new Error("Formato inválido");
      incidents = parsed;
      saveIncidents();
      renderIncidents();
      alert("Base de conocimiento importada correctamente.");
    } catch {
      alert("El archivo JSON no tiene un formato válido.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function resetSeedData() {
  const confirmed = confirm("¿Restaurar las incidencias de ejemplo y sobrescribir las actuales?");
  if (!confirmed) return;
  incidents = structuredClone(SEED_INCIDENTS);
  saveIncidents();
  renderIncidents();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Eventos
els.searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderIncidents();
});

els.openCreateBtn.addEventListener("click", openCreateModal);
els.closeFormModalBtn.addEventListener("click", () => els.formModal.close());
els.cancelFormBtn.addEventListener("click", () => els.formModal.close());
els.incidentForm.addEventListener("submit", handleFormSubmit);

els.incidentsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "view") openDetailModal(id);
  if (action === "edit") openEditModal(id);
  if (action === "delete") deleteIncident(id);
});

els.exportJsonBtn.addEventListener("click", exportJson);
els.importJsonInput.addEventListener("change", importJson);
els.resetSeedBtn.addEventListener("click", resetSeedData);

// Inicialización
loadIncidents();
renderCategories();
renderIncidents();
