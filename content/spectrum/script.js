"use strict";

/* ======================== Config ======================== */
const COLORS = {
  ITU: "#2563eb",
  Telescope: "#6d28d9",
  Natural: "#16a34a",
  Human: "#f59e0b",
  "Extreme Physics": "#dc2626",
};

const ROWS = [
  { key: "ITU", label: "Radio Bands" },
  { key: "Telescope", label: "Telescopes" },
  { key: "Natural", label: "Natural" },
  { key: "Human", label: "Human-made" },
  { key: "Extreme Physics", label: "Theoretical Physics" },
];

// lane behavior per row
const LANE_CFG = {
  Telescope: { maxLanes: 4, laneGapPx: 3, packEps: 1e-9 },
  Natural: { maxLanes: 2, laneGapPx: 2, packEps: 1e-9 },
  Human: { maxLanes: 2, laneGapPx: 2, packEps: 1e-9 },
  "Extreme Physics": { maxLanes: 1, laneGapPx: 2, packEps: 1e-9 },
};

const VISIBLE_LIGHT = { fmin: 4.0e14, fmax: 7.5e14 };
const DEFAULT_DOMAIN = { fmin: 3, fmax: 3e22 };
const LAYOUT = { topPad: 100, bottomPad: 130 };
const ROW_LABEL_X = 20;

/* ======================== Physical constants & helpers ======================== */
const C = 299_792_458;
const H = 6.626_070_15e-34;
const QE = 1.602_176_634e-19;
const WIEN_B = 2.897_771_955e-3;
const wavelengthFromF = (f) => C / f;
const energyEVFromF = (f) => (H * f) / QE;
const tempFromF_Wien = (f) => WIEN_B / (C / f);

function fmtWavelength(m) {
  if (m === 0) return "0 m";
  const exp = Math.floor(Math.log10(Math.abs(m)));
  const mant = m / Math.pow(10, exp);
  return `${mant.toFixed(2)}×10${exp >= 0 ? "⁺" + exp : "⁻" + Math.abs(exp)} m`;
}
function fmtEnergyEV(e) {
  const fmt = (v, d) => parseFloat(v.toFixed(d)).toString();
  if (e >= 1) return `${fmt(e, 1)} eV`;
  if (e >= 1e-3) return `${fmt(e * 1e3, 1)} meV`;
  if (e >= 1e-6) return `${fmt(e * 1e6, 1)} µeV`;
  if (e >= 1e-9) return `${fmt(e * 1e9, 1)} neV`;
  return `${e.toExponential(1)} eV`;
}
function fmtTempK(T) {
  const fmt = (v, d) => parseFloat(v.toFixed(d)).toString();
  if (T < 1e3) return `${fmt(T, 0)} K`;
  if (T < 1e6) return `${fmt(T / 1e3, 1)} kK`;
  if (T < 1e9) return `${fmt(T / 1e6, 1)} MK`;
  return `${fmt(T / 1e9, 1)} GK`;
}
function fmtSciHz(v) {
  if (v === 0) return "0 Hz";
  const exp = Math.floor(Math.log10(Math.abs(v)));
  const mant = v / Math.pow(10, exp);
  return `${mant.toFixed(3)}×10${exp >= 0 ? "⁺" + exp : "⁻" + Math.abs(exp)} Hz`;
}

/* ======================== State ======================== */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tooltipEl = document.getElementById("tooltip");
const dpr = Math.max(1, window.devicePixelRatio || 1);

let bands = [];
let domain = { ...DEFAULT_DOMAIN };
let enabled = new Set(ROWS.map((r) => r.key));

let scale = 100;
let offset = 60;
let dragging = false;
let dragStartX = 0;
let offsetAtDragStart = 0;

// image cache: url -> {img, status:'loading'|'ok'|'error'}
const imageCache = new Map();

/* ======================== Utils ======================== */
const log10 = (x) => Math.log(x) / Math.LN10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const viewWidth = () => canvas.width / dpr;
const viewHeight = () => canvas.height / dpr;

function worldToX(f) {
  return (log10(f) - log10(domain.fmin)) * scale + offset;
}
function xToWorld(x) {
  return Math.pow(10, (x - offset) / scale + log10(domain.fmin));
}
function rowY(idx) {
  const usable = viewHeight() - LAYOUT.topPad - LAYOUT.bottomPad;
  const h = usable / ROWS.length;
  return Math.round(LAYOUT.topPad + idx * h + h / 2);
}
function rowHeight() {
  const usable = viewHeight() - LAYOUT.topPad - LAYOUT.bottomPad;
  return (usable / ROWS.length) * 0.72;
}
function resizeCanvasToDisplaySize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ===== image loading ===== */
function requestImage(url) {
  if (!url) return null;
  const cached = imageCache.get(url);
  if (cached) return cached;
  const entry = { img: new Image(), status: "loading" };
  entry.img.crossOrigin = "anonymous";
  entry.img.onload = () => {
    entry.status = "ok";
    render();
  };
  entry.img.onerror = () => {
    entry.status = "error";
    render();
  };
  entry.img.src = url;
  imageCache.set(url, entry);
  return entry;
}

/* ======================== Drawing ======================== */
function drawBackground() {
  const W = viewWidth(),
    H = viewHeight();

  // clear + subtle white underlay
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // grid bounds
  const yGridTop = LAYOUT.topPad - 30;
  const yGridBottom = H - (LAYOUT.bottomPad - 30);

  // row lines + labels
  ctx.save();
  ctx.font = "12px system-ui";
  ctx.fillStyle = "#6b7280";
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ROWS.forEach((r, i) => {
    const y = rowY(i);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    ctx.fillText(r.label, ROW_LABEL_X, y - 8);
  });
  ctx.restore();

  // decade grid lines
  ctx.save();
  ctx.strokeStyle = "#e5e7eb";
  const pMin = Math.floor(log10(domain.fmin));
  const pMax = Math.ceil(log10(domain.fmax));
  for (let p = pMin; p <= pMax; p++) {
    const x = worldToX(Math.pow(10, p));
    if (x < -50 || x > W + 50) continue;
    ctx.beginPath();
    ctx.moveTo(x, yGridTop);
    ctx.lineTo(x, yGridBottom);
    ctx.stroke();
  }
  ctx.restore();

  // decide label density (skip every other decade if cramped)
  const decadePx = worldToX(10) - worldToX(1);
  const step = Math.abs(decadePx) < 65 ? 2 : 1;

  // (A) Photon energy (top)
  ctx.save();
  ctx.fillStyle = "#111827";
  ctx.font = "11px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Photon energy", W / 2, 18);
  ctx.fillStyle = "#374151";
  let odd = 0;
  for (let p = pMin; p <= pMax; p++) {
    if (odd++ % step) continue;
    const f = Math.pow(10, p);
    const x = worldToX(f);
    if (x < -50 || x > W + 50) continue;
    ctx.fillText(fmtEnergyEV(energyEVFromF(f)), x, 32);
  }
  ctx.restore();

  // (B) frequency labels (under grid)
  ctx.save();
  ctx.fillStyle = "#9ca3af";
  ctx.font = "11px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  odd = 0;
  for (let p = pMin; p <= pMax; p++) {
    if (odd++ % step) continue;
    const f = Math.pow(10, p);
    const x = worldToX(f);
    if (x < -50 || x > W + 50) continue;
    ctx.fillText(`1e${p} Hz`, x, yGridBottom + 2);
  }
  ctx.restore();

  // (C) wavelength
  ctx.save();
  ctx.fillStyle = "#111827";
  ctx.font = "11px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Wavelength (λ)", W / 2, yGridBottom + 18);
  ctx.fillStyle = "#374151";
  odd = 0;
  for (let p = pMin; p <= pMax; p++) {
    if (odd++ % step) continue;
    const f = Math.pow(10, p);
    const x = worldToX(f);
    if (x < -50 || x > W + 50) continue;
    ctx.fillText(fmtWavelength(wavelengthFromF(f)), x, yGridBottom + 32);
  }
  ctx.restore();

  // (D) temperature (Wien)
  ctx.save();
  ctx.fillStyle = "#111827";
  ctx.font = "11px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Peak emission temperature (Wien)", W / 2, H - 38);
  ctx.fillStyle = "#374151";
  odd = 0;
  for (let p = pMin; p <= pMax; p++) {
    if (odd++ % step) continue;
    const f = Math.pow(10, p);
    const x = worldToX(f);
    if (x < -50 || x > W + 50) continue;
    ctx.fillText(fmtTempK(tempFromF_Wien(f)), x, H - 22);
  }
  ctx.restore();
}

function drawVisibleLightGradient() {
  const x1 = worldToX(VISIBLE_LIGHT.fmin);
  const x2 = worldToX(VISIBLE_LIGHT.fmax);
  if (x2 < 0 || x1 > viewWidth()) return;

  const g = ctx.createLinearGradient(x1, 0, x2, 0);
  g.addColorStop(0.0, "#6b00ff");
  g.addColorStop(0.15, "#0000ff");
  g.addColorStop(0.33, "#00ffff");
  g.addColorStop(0.5, "#00ff00");
  g.addColorStop(0.67, "#ffff00");
  g.addColorStop(0.85, "#ff7f00");
  g.addColorStop(1.0, "#ff0000");

  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = g;
  ctx.fillRect(
    Math.max(0, x1),
    0,
    Math.min(viewWidth(), x2) - Math.max(0, x1),
    viewHeight(),
  );
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#111827";
  ctx.font = "12px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Visible light (≈400–700 nm)", (x1 + x2) / 2, 26);
  ctx.restore();
}

/* ===== draw rounded-rect image with 'cover' crop ===== */
function drawRoundedImage(img, x, y, w, h, r, alpha = 0.9) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  ctx.globalAlpha = alpha;
  const iw = img.naturalWidth,
    ih = img.naturalHeight;
  const s = Math.max(w / iw, h / ih);
  const sw = w / s,
    sh = h / s;
  const sx = (iw - sw) / 2,
    sy = (ih - sh) / 2;
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

/* ======================== Lane packing ======================== */
function packLanes(rowKey, rowBands) {
  const cfg = LANE_CFG[rowKey];
  if (!cfg) {
    rowBands.forEach((b) => (b.__lane = 0));
    return 1;
  }
  const eps = cfg.packEps || 0;
  const sorted = [...rowBands].sort((a, b) => a.fmin - b.fmin);
  const lanes = [];
  sorted.forEach((b) => {
    let placed = false;
    for (let li = 0; li < lanes.length; li++) {
      if (b.fmin >= lanes[li] - eps) {
        b.__lane = li;
        lanes[li] = b.fmax;
        placed = true;
        break;
      }
    }
    if (!placed) {
      b.__lane = lanes.length;
      lanes.push(b.fmax);
    }
  });
  const used = Math.min(lanes.length, cfg.maxLanes);
  if (lanes.length > cfg.maxLanes)
    for (const b of sorted)
      if (b.__lane >= cfg.maxLanes) b.__lane = cfg.maxLanes - 1;
  return used;
}

/* ======================== Bands (images + labels) ======================== */
function drawBands() {
  const h = rowHeight();
  const radius = Math.min(10, h / 2);

  ROWS.forEach((row, rowIdx) => {
    if (!enabled.has(row.key)) return;

    const yCenter = rowY(rowIdx);
    const rowBands = bands.filter((b) => b.layer === row.key);
    if (!rowBands.length) return;

    const cfg = LANE_CFG[row.key];
    const lanesUsed = packLanes(row.key, rowBands);
    const laneGap = cfg ? cfg.laneGapPx || 0 : 0;
    const laneH = cfg ? (h - laneGap * (lanesUsed - 1)) / lanesUsed : h;

    for (const b of rowBands) {
      const x1 = worldToX(b.fmin);
      const x2 = worldToX(b.fmax);
      if (x2 < -50 || x1 > viewWidth() + 50) continue;

      const left = Math.max(-1000, x1);
      const right = Math.min(viewWidth() + 1000, x2);
      const w = Math.max(1, right - left);
      const topBase = yCenter - h / 2;
      const top = topBase + b.__lane * (laneH + laneGap);
      const r = radius * (laneH / h);

      let drewImg = false;
      if (b.img) {
        const entry = requestImage(b.img);
        if (entry && entry.status === "ok") {
          drawRoundedImage(entry.img, left, top, w, laneH, r, 0.95);
          drewImg = true;
        }
      }
      if (!drewImg) {
        ctx.save();
        ctx.fillStyle = COLORS[row.key] || "#334155";
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.moveTo(left + r, top);
        ctx.arcTo(left + w, top, left + w, top + laneH, r);
        ctx.arcTo(left + w, top + laneH, left, top + laneH, r);
        ctx.arcTo(left, top + laneH, left, top, r);
        ctx.arcTo(left, top, left + w, top, r);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // labels per lane
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let li = 0; li < lanesUsed; li++) {
      const laneBands = rowBands.filter((b) => b.__lane === li);
      const labels = laneBands
        .map((b) => {
          const cx = (worldToX(b.fmin) + worldToX(b.fmax)) / 2;
          const width = ctx.measureText(b.label).width;
          return { band: b, cx, width };
        })
        .filter(
          (l) => l.cx + l.width / 2 > 0 && l.cx - l.width / 2 < viewWidth(),
        )
        .sort((a, b) => a.cx - b.cx);

      const placed = [];
      for (const label of labels) {
        const overlaps = placed.some(
          (p) => Math.abs(label.cx - p.cx) < label.width / 2 + p.width / 2 + 6,
        );
        if (!overlaps) placed.push(label);
      }

      const topBase = yCenter - h / 2;
      const ly = topBase + li * (laneH + laneGap) + laneH / 2;
      for (const p of placed) {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.strokeText(p.band.label, p.cx, ly);
        ctx.fillStyle = "#111827";
        ctx.fillText(p.band.label, p.cx, ly);
        ctx.restore();
      }
    }
  });
}

/* ======================== Render ======================== */
function render() {
  resizeCanvasToDisplaySize();

  // hard clear in device pixels to avoid ghosting
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  drawBackground();
  drawVisibleLightGradient();
  drawBands();
}

/* ======================== Tooltip ======================== */
function findHoverBand(mouseX, mouseY) {
  let bestRowIdx = -1,
    bestDy = Infinity;
  ROWS.forEach((_, i) => {
    const dy = Math.abs(mouseY - rowY(i));
    if (dy < bestDy) {
      bestDy = dy;
      bestRowIdx = i;
    }
  });
  const row = ROWS[bestRowIdx];
  if (!row || !enabled.has(row.key)) return null;

  const h = rowHeight();
  const cfg = LANE_CFG[row.key];
  const lanesUsed = cfg
    ? Math.max(
        1,
        packLanes(
          row.key,
          bands.filter((b) => b.layer === row.key),
        ),
      )
    : 1;
  const laneGap = cfg ? cfg.laneGapPx || 0 : 0;
  const laneH = cfg ? (h - laneGap * (lanesUsed - 1)) / lanesUsed : h;

  if (bestDy > h) return null;

  const topBase = rowY(bestRowIdx) - h / 2;
  const relY = mouseY - topBase;
  let approxLane = 0;
  if (cfg) {
    approxLane = Math.floor(relY / (laneH + laneGap));
    approxLane = Math.max(0, Math.min(approxLane, lanesUsed - 1));
  }

  const candidates = bands.filter((b) => {
    if (b.layer !== row.key) return false;
    const xOK = mouseX >= worldToX(b.fmin) && mouseX <= worldToX(b.fmax);
    if (!xOK) return false;
    if (!cfg) return true;
    return (b.__lane ?? 0) === approxLane;
  });
  if (!candidates.length) return null;

  candidates.sort((a, b) => a.fmax - a.fmin - (b.fmax - b.fmin));
  return candidates[0];
}

// keep a small set to avoid spammy logs
const _missingInfoLogged = new Set();

function showTooltip(band) {
  tooltipEl.classList.remove("hidden");

  let html = `
    <div style="max-width:340px; white-space:normal; line-height:1.35;">
      <b>${band.label}</b><br>
      ${fmtSciHz(band.fmin)} – ${fmtSciHz(band.fmax)}<br>
      <span style="opacity:.7">${band.layer}</span>
  `;

  if (band.img) {
    html += `<br><img src="${band.img}" style="max-width:320px;max-height:180px;margin-top:6px;border-radius:6px;display:block;">`;
  }

  if (band.info && String(band.info).trim()) {
    html += `<br><div style="margin-top:6px; font-size:0.9em;">${band.info}</div>`;
  } else {
    if (band && band.label && !_missingInfoLogged.has(band.label)) {
      _missingInfoLogged.add(band.label);
      console.warn(`[tooltip] Missing "info" for`, band.label, band);
    }
  }

  html += `</div>`;
  tooltipEl.innerHTML = html;
}
function hideTooltip() {
  tooltipEl.classList.add("hidden");
}

/* ======================== Interaction ======================== */
// wheel zoom (anchored center)
canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const zoomFactor = 1.15;
    const centerX = viewWidth() / 2;
    const w0 = xToWorld(centerX);
    const factor = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    scale = clamp(scale * factor, 20, 1200);
    const t0 = log10(w0) - log10(domain.fmin);
    offset = centerX - t0 * scale;
    render();
  },
  { passive: false },
);

// drag pan
canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  dragStartX = e.clientX;
  offsetAtDragStart = offset;
});
window.addEventListener("mouseup", () => {
  dragging = false;
});
window.addEventListener("mousemove", (e) => {
  if (dragging) {
    offset = offsetAtDragStart + (e.clientX - dragStartX);
    render();
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const band = findHoverBand(x, y);
  if (band) {
    // debug: see whether info is present
    console.log("hover band", band.label, band.info);
    showTooltip(band);
  } else {
    hideTooltip();
  }
});

// keyboard pan/zoom (h/l pan, k/j zoom)
window.addEventListener("keydown", (e) => {
  const panStepPx = Math.round(viewWidth() * 0.1);
  const zoomFactor = 1.15;
  const k = e.key.toLowerCase();

  if (k === "h") {
    offset += panStepPx;
    render();
  } else if (k === "l") {
    offset -= panStepPx;
    render();
  } else if (k === "k" || k === "j") {
    const centerX = viewWidth() / 2;
    const w0 = xToWorld(centerX);
    scale = clamp(scale * (k === "k" ? zoomFactor : 1 / zoomFactor), 20, 1200);
    const t0 = log10(w0) - log10(domain.fmin);
    offset = centerX - t0 * scale;
    render();
  }
});

/* ======================== Layer toggles ======================== */
function initToggles() {
  const container = document.getElementById("layer-toggles");
  if (!container) return; // optional UI
  container.innerHTML = "";
  ROWS.forEach((row) => {
    const wrap = document.createElement("label");
    wrap.className = "inline-flex items-center gap-2 text-sm";
    wrap.innerHTML = `
      <input type="checkbox" class="h-4 w-4 accent-black" ${enabled.has(row.key) ? "checked" : ""}>
      <span class="font-medium" style="color:${COLORS[row.key] || "#111"}">${row.label}</span>
    `;
    container.appendChild(wrap);
    wrap.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) enabled.add(row.key);
      else enabled.delete(row.key);
      render();
    });
  });
}

/* ======================== Data load ======================== */
async function loadData() {
  const validLayer = new Set(ROWS.map((r) => r.key));
  let json = null;
  try {
    // cache-bust to avoid stale JSON during dev
    const res = await fetch(`./spectrum.json?v=${Date.now()}`, {
      cache: "no-cache",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    json = await res.json();
  } catch (err) {
    console.error("[EM] Failed to load spectrum.json:", err);
    alert("Failed to load spectrum.json (using small fallback).");
    json = {
      bands: [
        {
          layer: "ITU",
          label: "VLF",
          fmin: 3e3,
          fmax: 3e4,
          img: "",
          info: "Very Low Frequency demo.",
        },
        {
          layer: "Telescope",
          label: "Hubble",
          fmin: 1e14,
          fmax: 3e15,
          img: "",
          info: "HST demo band.",
        },
        {
          layer: "Natural",
          label: "FM Radio (demo)",
          fmin: 88e6,
          fmax: 108e6,
          img: "",
          info: "Demo natural (actually human-made).",
        },
      ],
    };
  }

  const raw = Array.isArray(json) ? json : json.bands || [];

  // IMPORTANT: keep arbitrary extra fields like `info` by spreading `b`
  bands = raw
    .map((b) => {
      const layer = String(b.layer);
      const label = String(b.label || "");
      const fmin = Number(b.fmin);
      const fmax = Number(b.fmax);
      const img = b.img ? String(b.img) : "";
      const info = b.info != null ? String(b.info) : ""; // preserve info if provided
      return { ...b, layer, label, fmin, fmax, img, info };
    })
    .filter(
      (b) =>
        validLayer.has(b.layer) &&
        isFinite(b.fmin) &&
        isFinite(b.fmax) &&
        // allow zero-width ranges (lines); renderer ensures min 1px width
        b.fmax >= b.fmin &&
        b.label.length > 0,
    );

  if (!bands.length) {
    alert("No valid bands found.");
    return;
  }

  const minF = Math.min(...bands.map((b) => b.fmin), DEFAULT_DOMAIN.fmin);
  const maxF = Math.max(...bands.map((b) => b.fmax), DEFAULT_DOMAIN.fmax);
  domain.fmin = Math.pow(10, Math.floor(log10(minF) - 0.5));
  domain.fmax = Math.pow(10, Math.ceil(log10(maxF) + 0.5));

  initToggles();
  render();
}

/* ======================== Start ======================== */
loadData();
window.addEventListener("resize", render);
