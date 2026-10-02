import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, CalendarDays, ListChecks, ClipboardList, LayoutDashboard, Type, CheckSquare, Minus, Square, Download, Plus, Trash2, Settings2, Sparkles, ChevronLeft, ChevronRight, X, Grid2X2 } from "lucide-react";
import { jsPDF } from "jspdf";
import "./styles.css";

const I = { BookOpen, CalendarDays, ListChecks, ClipboardList, LayoutDashboard, Type, CheckSquare, Minus, Square, Sparkles };
const L = {
  en: { studio: "Template Studio", templates: "Templates", elements: "Elements", notebook: "Linked Notebook", annual: "Annual Planner", tasks: "Task List", weekly: "Weekly Planner", layout: "Layout", text: "Text", check: "Checklist", line: "Divider", box: "Box", icon: "Lucide Icon", preview: "Live Preview", config: "Configuration", size: "Paper size", orientation: "Orientation", paper: "Paper", accent: "Accent", style: "Page style", tabs: "Side tabs", minimal: "Minimal", sections: "Sections", add: "Add section", cover: "Cover page", numbers: "Page numbers", year: "Year", week: "Week starts", monday: "Monday", sunday: "Sunday", density: "Calendar density", comfortable: "Comfortable", spacious: "Spacious", compact: "Compact", weeknumbers: "Week numbers", notes: "Notes area", rows: "Task rows", priority: "Priority", due: "Due date", export: "Export PDF", ready: "Ready", selected: "Selected element", content: "Content", width: "Width", height: "Height", remove: "Delete", choose: "Choose a template", build: "Build a Goodnotes-ready digital template.", descN: "Hyperlinked sections, tabs and note pages.", descA: "Automatic year and monthly calendars.", descT: "Clean task list with priorities and due dates.", descW: "Weekly overview with planning and notes.", noElements: "Add elements from the sidebar.", lang: "Language" },
  de: { studio: "Template Studio", templates: "Vorlagen", elements: "Elemente", notebook: "Verknüpftes Notizbuch", annual: "Jahresplaner", tasks: "Aufgabenliste", weekly: "Wochenplaner", layout: "Layout", text: "Text", check: "Checkliste", line: "Trenner", box: "Box", icon: "Lucide-Symbol", preview: "Live-Vorschau", config: "Konfiguration", size: "Papierformat", orientation: "Ausrichtung", paper: "Papier", accent: "Akzent", style: "Seitenstil", tabs: "Seitentabs", minimal: "Minimal", sections: "Bereiche", add: "Bereich hinzufügen", cover: "Titelseite", numbers: "Seitenzahlen", year: "Jahr", week: "Wochenstart", monday: "Montag", sunday: "Sonntag", density: "Kalenderdichte", comfortable: "Komfortabel", spacious: "Großzügig", compact: "Kompakt", weeknumbers: "Kalenderwochen", notes: "Notizbereich", rows: "Aufgabenzeilen", priority: "Priorität", due: "Fälligkeitsdatum", export: "PDF exportieren", ready: "Bereit", selected: "Ausgewähltes Element", content: "Inhalt", width: "Breite", height: "Höhe", remove: "Löschen", choose: "Vorlage wählen", build: "Digitale Goodnotes-Vorlage erstellen.", descN: "Verknüpfte Bereiche, Tabs und Notizseiten.", descA: "Automatisches Jahr und Monatskalender.", descT: "Klare Aufgabenliste mit Prioritäten und Fälligkeit.", descW: "Wochenübersicht mit Planung und Notizen.", noElements: "Elemente über die Seitenleiste hinzufügen.", lang: "Sprache" },
  es: { studio: "Template Studio", templates: "Plantillas", elements: "Elementos", notebook: "Notebook enlazado", annual: "Planificador anual", tasks: "Lista de tareas", weekly: "Planificador semanal", layout: "Diseño", text: "Texto", check: "Checklist", line: "Separador", box: "Caja", icon: "Icono Lucide", preview: "Vista previa", config: "Configuración", size: "Tamaño de papel", orientation: "Orientación", paper: "Papel", accent: "Acento", style: "Estilo de página", tabs: "Pestañas laterales", minimal: "Minimal", sections: "Secciones", add: "Añadir sección", cover: "Portada", numbers: "Números de página", year: "Año", week: "Inicio de semana", monday: "Lunes", sunday: "Domingo", density: "Densidad del calendario", comfortable: "Cómoda", spacious: "Amplia", compact: "Compacta", weeknumbers: "Números de semana", notes: "Zona de notas", rows: "Filas de tareas", priority: "Prioridad", due: "Fecha límite", export: "Exportar PDF", ready: "Listo", selected: "Elemento seleccionado", content: "Contenido", width: "Ancho", height: "Alto", remove: "Eliminar", choose: "Elegir plantilla", build: "Crea una plantilla digital lista para Goodnotes.", descN: "Secciones, pestañas y páginas enlazadas.", descA: "Año y calendarios mensuales automáticos.", descT: "Lista de tareas con prioridades y fechas.", descW: "Vista semanal con planificación y notas.", noElements: "Añade elementos desde la barra lateral.", lang: "Idioma" }
};
const tr = (l, k) => L[l][k] || L.en[k] || k;
const presets = { Forest: ["#40916c", "#d0f4de"], Ocean: ["#3d5a80", "#cddafd"], Earth: ["#7f4f24", "#fff8f0"], Coral: ["#ff4d6d", "#fff1f4"], Mint: ["#d0f4de", "#f7fffa"], Lavender: ["#cddafd", "#fafbff"] };
const base = { notebook: { name: "My Notebook", size: "A4", orientation: "portrait", style: "ruled", accent: "#40916c", paper: "#d0f4de", tabs: true, cover: true, numbers: true, sections: [["Personal", 10], ["Work", 10], ["Projects", 10], ["Notes", 10]], elements: [] }, annual: { name: "Annual Planner", year: new Date().getFullYear(), size: "A4", orientation: "landscape", week: "monday", density: "comfortable", accent: "#40916c", paper: "#d0f4de", weeknumbers: true, notes: true, elements: [] }, tasks: { name: "Task List", size: "A4", orientation: "portrait", rows: 16, priority: true, due: true, accent: "#40916c", paper: "#d0f4de", elements: [] }, weekly: { name: "Weekly Planner", size: "A4", orientation: "landscape", week: "monday", notes: true, accent: "#40916c", paper: "#d0f4de", elements: [] } };
const meta = { notebook: [BookOpen, "notebook", "descN"], annual: [CalendarDays, "annual", "descA"], tasks: [ListChecks, "tasks", "descT"], weekly: [ClipboardList, "weekly", "descW"] };
const sizes = { A4: [210, 297], A5: [148, 210], Letter: [216, 279] };
const mn = (y, m) => new Date(y, m, 1).toLocaleString("en-US", { month: "long" });
const md = (y, m) => new Date(y, m + 1, 0).getDate();
const off = (y, m, w) => { let d = new Date(y, m, 1).getDay(); return w === "sunday" ? d : (d + 6) % 7 };
const rgb = h => { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] };

function PDFText(p, s, x, y, z = 10, c = [40, 40, 40], b = false, a = "left") {
  p.setFont("helvetica", b ? "bold" : "normal");
  p.setFontSize(z);
  p.setTextColor(...c);
  p.text(String(s), x, y, { align: a });
}

function pdfColor(hex, fallback = [40, 40, 40]) {
  if (!hex || typeof hex !== "string") return fallback;
  const h = hex.replace("#", "");
  if (h.length !== 6) return fallback;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function brand(p, w, h) {
  PDFText(p, "dienix", w - 10, h - 7, 7, [120, 128, 145], false, "right");
}

function roundedFill(p, x, y, w, h, r, color) {
  p.setFillColor(...color);
  p.roundedRect(x, y, w, h, r, r, "F");
}

function roundedStroke(p, x, y, w, h, r, color, line = 0.25) {
  p.setDrawColor(...color);
  p.setLineWidth(line);
  p.roundedRect(x, y, w, h, r, r, "S");
}

function pdfPaper(p, w, h, style, paperColor, designW, designH) {
  const paper = pdfColor(paperColor, [255, 255, 255]);
  p.setFillColor(...paper);
  p.rect(0, 0, w, h, "F");

  const sx = w / designW;
  const sy = h / designH;
  const line = [217, 222, 234];

  if (style === "ruled") {
    p.setDrawColor(...line);
    p.setLineWidth(0.15);
    for (let y = 86; y < designH - 48; y += 23) {
      p.line(29 * sx, y * sy, (designW - 29) * sx, y * sy);
    }
  }

  if (style === "grid") {
    p.setDrawColor(...line);
    p.setLineWidth(0.15);
    for (let y = 86; y < designH - 48; y += 23) {
      p.line(29 * sx, y * sy, (designW - 29) * sx, y * sy);
    }
    for (let x = 29; x < designW - 29; x += 23) {
      p.line(x * sx, 86 * sy, x * sx, (designH - 48) * sy);
    }
  }

  if (style === "dotted") {
    p.setFillColor(200, 206, 224);
    for (let y = 86; y < designH - 48; y += 16) {
      for (let x = 29; x < designW - 29; x += 16) {
        p.circle(x * sx, y * sy, 0.3, "F");
      }
    }
  }
}

function pdfTop(p, w, designW, accent) {
  p.setFillColor(...pdfColor(accent));
  p.rect(0, 0, w, 4 * (w / designW), "F");
}

function pdfElements(p, es, designW, designH) {
  if (!Array.isArray(es)) return;
  const sx = p.internal.pageSize.getWidth() / designW;
  const sy = p.internal.pageSize.getHeight() / designH;

  es.forEach(e => {
    const x = (e.x / 100) * designW * sx;
    const y = (e.y / 100) * designH * sy;
    const w = (e.w / 100) * designW * sx;
    const h = (e.h / 100) * designH * sy;
    const c = pdfColor(e.color, [70, 78, 105]);

    p.setDrawColor(...c);
    p.setTextColor(...c);

    if (e.type === "text") {
      PDFText(p, e.content || "", x, y + Math.max(4, e.size * 0.75) * sy, Math.max(6, e.size * 0.75), c, e.bold);
    }

    if (e.type === "check") {
      p.setLineWidth(0.3);
      p.rect(x, y, 5 * sx, 5 * sy);
      PDFText(p, e.content || "Task", x + 8 * sx, y + 4 * sy, 8 * 0.75, c);
    }

    if (e.type === "line") {
      p.setLineWidth(Math.max(0.2, 0.7 * sy));
      p.line(x, y, x + w, y);
    }

    if (e.type === "box") {
      p.setLineWidth(0.3);
      p.roundedRect(x, y, w, h, 2 * sx, 2 * sy, "S");
    }

    if (e.type === "icon") {
      p.circle(x + 4 * sx, y + 4 * sy, 3 * sx);
      PDFText(p, "★", x + 4 * sx, y + 6 * sy, 6 * 0.75, c, true, "center");
    }
  });
}

function pdfNotebookPage(p, c, sectionName, sectionIndex, pageNumber) {
  const w = p.internal.pageSize.getWidth();
  const h = p.internal.pageSize.getHeight();
  const designW = 355;
  const designH = 505;
  const sx = w / designW;
  const sy = h / designH;
  const accent = pdfColor(c.accent);
  const ink = [51, 58, 97];
  const muted = [174, 182, 205];

  pdfPaper(p, w, h, c.style, c.paper, designW, designH);
  pdfTop(p, w, designW, c.accent);

  PDFText(p, "dienix", 29 * sx, 23 * sy, 6 * 0.75, muted, false);
  PDFText(p, sectionName || "Notebook", 29 * sx, 61 * sy, 19 * 0.75, ink, true);
  PDFText(p, "LINKED DIGITAL NOTEBOOK", 29 * sx, 76 * sy, 5 * 0.75, muted, true);

  PDFText(p, "01", (designW - 34) * sx, 57 * sy, 5 * 0.75, muted, false);
  PDFText(p, "NOTES", (designW - 13) * sx, 57 * sy, 5 * 0.75, muted, false, "right");

  if (c.tabs) {
    const tabH = 38;
    const tabW = 20;
    const top = 70 + sectionIndex * 40;
    p.setFillColor(...accent);
    p.roundedRect((designW - tabW) * sx, top * sy, tabW * sx, tabH * sy, 2 * sx, 2 * sy, "F");
    PDFText(p, String(sectionIndex + 1).padStart(2, "0"), (designW - 10) * sx, (top + 25) * sy, 7 * 0.75, [255, 255, 255], true, "center");
  }

  p.setTextColor(...muted);
  PDFText(p, "INDEX", 22 * sx, (designH - 10) * sy, 6 * 0.75, muted);
  PDFText(p, "‹", (designW * 0.52) * sx, (designH - 10) * sy, 8 * 0.75, muted, false, "center");
  PDFText(p, "›", (designW - 22) * sx, (designH - 10) * sy, 8 * 0.75, muted, false, "center");
  PDFText(p, "dienix", (designW - 22) * sx, (designH - 10) * sy, 6 * 0.75, muted, false, "right");

  if (c.numbers) PDFText(p, String(pageNumber), designW / 2 * sx, (designH - 10) * sy, 6 * 0.75, [120, 128, 145], false, "center");

  pdfElements(p, c.elements, designW, designH);
  brand(p, w, h);
}

function exportNotebook(c) {
  const [bw, bh] = sizes[c.size];
  const land = c.orientation === "landscape";
  const w = land ? bh : bw;
  const h = land ? bw : bh;
  const designW = 355;
  const designH = 505;
  const sx = w / designW;
  const sy = h / designH;
  const p = new jsPDF({ unit: "mm", format: [w, h], orientation: land ? "landscape" : "portrait" });
  const totalContent = c.sections.reduce((n, s) => n + Math.max(0, Number(s[1]) || 0), 0);
  const indexPage = c.cover ? 2 : 1;

  if (c.cover) {
    p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
    p.rect(0, 0, w, h, "F");
    pdfTop(p, w, designW, c.accent);
    PDFText(p, "dienix", 29 * sx, 82 * sy, 8, [120, 128, 145]);
    PDFText(p, c.name.toUpperCase(), 29 * sx, 250 * sy, 25 * 0.75, [51, 58, 97], true);
    PDFText(p, "A LINKED DIGITAL NOTEBOOK FOR GOODNOTES", 29 * sx, 275 * sy, 7 * 0.75, [174, 182, 205], true);
    brand(p, w, h);
    p.addPage([w, h]);
  }

  // Index occupies the first page when the cover is disabled,
  // otherwise it is page 2.
  p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
  p.rect(0, 0, w, h, "F");
  pdfTop(p, w, designW, c.accent);
  PDFText(p, "INDEX", 29 * sx, 58 * sy, 21 * 0.75, [51, 58, 97], true);

  let y = 100;
  let target = c.cover ? 3 : 2;

  c.sections.forEach((section, i) => {
    const rowH = 11;
    roundedFill(p, 14 * sx, y * sy, (designW - 28) * sx, rowH * sy, 2, pdfColor(c.accent));
    PDFText(p, `${i + 1}. ${section[0]}`, 20 * sx, (y + 7) * sy, 9 * 0.75, [255, 255, 255], true);
    p.link(14 * sx, y * sy, (designW - 28) * sx, rowH * sy, { pageNumber: target });
    y += 17;
    target += Math.max(0, Number(section[1]) || 0);
  });

  brand(p, w, h);

  let pg = c.cover ? 3 : 2;
  const lastPage = (c.cover ? 2 : 1) + totalContent;

  c.sections.forEach((section, i) => {
    const count = Math.max(0, Number(section[1]) || 0);

    for (let n = 0; n < count; n++) {
      p.addPage([w, h]);
      pdfNotebookPage(p, c, section[0], i, pg);

      // Bottom navigation mirrors the Live Preview.
      p.link(10 * sx, (designH - 14) * sy, 25 * sx, 8 * sy, { pageNumber: indexPage });

      if (pg > (c.cover ? 3 : 2)) {
        p.link((designW / 2 - 18) * sx, (designH - 14) * sy, 14 * sx, 8 * sy, { pageNumber: pg - 1 });
      }

      if (pg < lastPage) {
        p.link((designW / 2 + 4) * sx, (designH - 14) * sy, 14 * sx, 8 * sy, { pageNumber: pg + 1 });
      }

      pg++;
    }
  });

  p.save(c.name.replaceAll(" ", "-") + ".pdf");
}

function pdfAnnualPage(p, c, month) {
  const w = p.internal.pageSize.getWidth();
  const h = p.internal.pageSize.getHeight();
  const designW = 625;
  const designH = 420;
  const sx = w / designW;
  const sy = h / designH;
  const accent = pdfColor(c.accent);
  const muted = [174, 182, 205];

  p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
  p.rect(0, 0, w, h, "F");
  pdfTop(p, w, designW, c.accent);

  PDFText(p, mn(c.year, month), 25 * sx, 53 * sy, 27 * 0.75, [51, 58, 97], true);
  PDFText(p, String(c.year), 95 * sx, 53 * sy, 8 * 0.75, muted);
  PDFText(p, "ANNUAL PLANNER · DEMO", (designW - 26) * sx, 30 * sy, 6 * 0.75, muted, true, "right");
  PDFText(p, "PLAN · ORGANIZE · WRITE · REVIEW", 25 * sx, 62 * sy, 5 * 0.75, muted, true);

  const days = c.week === "sunday"
    ? ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const gx = 25, gy = 78, gw = designW - 50, gh = designH - 126;
  const cw = gw / 7, ch = gh / 6;

  p.setDrawColor(217, 222, 234);
  p.setLineWidth(0.2);

  days.forEach((d, i) => {
    p.setFillColor(...accent);
    p.rect((gx + i * cw) * sx, gy * sy, cw * sx, 25 * sy, "F");
    PDFText(p, d, (gx + i * cw + cw / 2) * sx, (gy + 16) * sy, 6 * 0.75, [255, 255, 255], true, "center");
  });

  const o = off(c.year, month, c.week);
  const totalDays = md(c.year, month);

  for (let r = 0; r < 6; r++) {
    for (let col = 0; col < 7; col++) {
      const x = gx + col * cw;
      const y = gy + 25 + r * ch;
      p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
      p.rect(x * sx, y * sy, cw * sx, ch * sy, "F");
      p.setDrawColor(217, 222, 234);
      p.rect(x * sx, y * sy, cw * sx, ch * sy, "S");

      const index = r * 7 + col;
      const d = index - o + 1;
      if (d > 0 && d <= totalDays) {
        PDFText(p, String(d), (x + 7) * sx, (y + 17) * sy, 7 * 0.75, [51, 58, 97], true);
        if (c.density !== "compact") {
          p.setDrawColor(236, 239, 246);
          p.line((x + 7) * sx, (y + ch - 9) * sy, (x + cw - 7) * sx, (y + ch - 9) * sy);
        }
      }
    }
  }

  if (c.notes) {
    roundedStroke(p, 25 * sx, (designH - 37) * sy, (designW - 50) * sx, 20 * sy, 4, [208, 213, 228], 0.25);
    PDFText(p, "NOTES", 32 * sx, (designH - 27) * sy, 5 * 0.75, [162, 170, 194], true);
  }

  if (c.weeknumbers) {
    PDFText(p, "WEEK", (designW - 25) * sx, (designH - 27) * sy, 5 * 0.75, muted, true, "right");
  }

  PDFText(p, "dienix", (designW - 22) * sx, (designH - 10) * sy, 5 * 0.75, muted, false, "right");
  pdfElements(p, c.elements, designW, designH);
  brand(p, w, h);
}

function exportAnnual(c) {
  const [bw, bh] = sizes[c.size];
  const land = c.orientation === "landscape";
  const w = land ? bh : bw;
  const h = land ? bw : bh;
  const p = new jsPDF({ unit: "mm", format: [w, h], orientation: land ? "landscape" : "portrait" });

  p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
  p.rect(0, 0, w, h, "F");
  pdfTop(p, w, 625, c.accent);
  PDFText(p, String(c.year), 25 * (w / 625), 210 * (h / 420), 34 * 0.75, [51, 58, 97], true);
  PDFText(p, "ANNUAL PLANNER", 25 * (w / 625), 236 * (h / 420), 12 * 0.75, [120, 128, 145], true);
  brand(p, w, h);

  p.addPage([w, h]);
  pdfAnnualPage(p, c, 0);

  for (let m = 1; m < 12; m++) {
    p.addPage([w, h]);
    pdfAnnualPage(p, c, m);
  }

  // Rebuild page 2 as the overview after all month pages exist.
  // jsPDF keeps the overview links valid because page numbers are fixed.
  p.setPage(2);
  p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
  p.rect(0, 0, w, h, "F");
  pdfTop(p, w, 625, c.accent);
  PDFText(p, `${c.year} OVERVIEW`, 25 * (w / 625), 45 * (h / 420), 20 * 0.75, [51, 58, 97], true);

  const sx = w / 625, sy = h / 420;
  const cw = (625 - 70) / 3, ch = (420 - 100) / 4;
  for (let m = 0; m < 12; m++) {
    const x = 25 + (m % 3) * cw;
    const y = 65 + Math.floor(m / 3) * ch;
    roundedFill(p, x * sx, y * sy, (cw - 7) * sx, (ch - 7) * sy, 4, pdfColor(c.paper, [255, 255, 255]));
    roundedStroke(p, x * sx, y * sy, (cw - 7) * sx, (ch - 7) * sy, 4, [217, 222, 234], 0.25);
    p.setFillColor(...pdfColor(c.accent));
    p.rect(x * sx, y * sy, (cw - 7) * sx, 5 * sy, "F");
    PDFText(p, mn(c.year, m).toUpperCase(), (x + 7) * sx, (y + 18) * sy, 8 * 0.75, [51, 58, 97], true);
    p.link(x * sx, y * sy, (cw - 7) * sx, (ch - 7) * sy, { pageNumber: m + 3 });
  }
  brand(p, w, h);

  p.save(c.name.replaceAll(" ", "-") + "-" + c.year + ".pdf");
}

function exportTasks(c) {
  const [bw, bh] = sizes[c.size];
  const land = c.orientation === "landscape";
  const w = land ? bh : bw;
  const h = land ? bw : bh;
  const p = new jsPDF({ unit: "mm", format: [w, h], orientation: land ? "landscape" : "portrait" });
  const designW = 355, designH = 505, sx = w / designW, sy = h / designH;
  const muted = [174, 182, 205];

  p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
  p.rect(0, 0, w, h, "F");
  pdfTop(p, w, designW, c.accent);

  PDFText(p, "PRODUCTIVITY · DEMO", 28 * sx, 23 * sy, 6 * 0.75, muted, true);
  PDFText(p, c.name, 28 * sx, 50 * sy, 20 * 0.75, [51, 58, 97], true);
  PDFText(p, "PLAN · PRIORITIZE · COMPLETE", 28 * sx, 65 * sy, 5 * 0.75, muted, true);

  roundedStroke(p, (designW - 63) * sx, 31 * sy, 35 * sx, 40 * sy, 5, [217, 222, 234], 0.25);
  PDFText(p, "01", (designW - 45.5) * sx, 54 * sy, 13 * 0.75, [51, 58, 97], true, "center");
  PDFText(p, "MON", (designW - 45.5) * sx, 64 * sy, 5 * 0.75, muted, false, "center");

  PDFText(p, "TOP PRIORITIES", 28 * sx, 96 * sy, 5 * 0.75, [162, 170, 194], true);
  for (let i = 0; i < 3; i++) {
    roundedStroke(p, (28 + i * 100) * sx, 101 * sy, 94 * sx, 25 * sy, 4, [217, 222, 234], 0.25);
  }

  PDFText(p, "TASK", 43 * sx, 153 * sy, 5 * 0.75, muted, true);
  if (c.priority) PDFText(p, "PRIORITY", (designW - 50) * sx, 153 * sy, 5 * 0.75, muted, true, "center");
  if (c.due) PDFText(p, "DUE", (designW - 17) * sx, 153 * sy, 5 * 0.75, muted, true, "center");

  p.setDrawColor(217, 222, 234);
  p.line(28 * sx, 158 * sy, (designW - 28) * sx, 158 * sy);

  const rows = Math.min(Math.max(Number(c.rows) || 1, 1), 12);
  for (let i = 0; i < rows; i++) {
    const y = 158 + i * 23;
    p.setDrawColor(217, 222, 234);
    p.line(28 * sx, (y + 23) * sy, (designW - 28) * sx, (y + 23) * sy);
    p.setDrawColor(174, 182, 205);
    p.rect(28 * sx, (y + 7) * sy, 8 * sx, 8 * sy);
    p.setDrawColor(217, 222, 234);
    p.line(43 * sx, (y + 18) * sy, (designW - 60) * sx, (y + 18) * sy);
    if (c.priority) PDFText(p, "•", (designW - 50) * sx, (y + 16) * sy, 10 * 0.75, muted, true, "center");
    if (c.due) PDFText(p, "—", (designW - 17) * sx, (y + 16) * sy, 7 * 0.75, muted, false, "center");
  }

  const bottomY = designH - 70;
  for (let i = 0; i < 2; i++) {
    const x = 28 + i * 149;
    p.setDrawColor(217, 222, 234);
    p.line(x * sx, bottomY * sy, (x + 137) * sx, bottomY * sy);
    PDFText(p, i === 0 ? "FOCUS" : "NOTES", x * sx, (bottomY + 10) * sy, 5 * 0.75, muted, true);
    p.setDrawColor(238, 238, 238);
    p.line(x * sx, (bottomY + 28) * sy, (x + 137) * sx, (bottomY + 28) * sy);
  }

  PDFText(p, "dienix", (designW - 22) * sx, (designH - 10) * sy, 5 * 0.75, muted, false, "right");
  pdfElements(p, c.elements, designW, designH);
  brand(p, w, h);
  p.save(c.name.replaceAll(" ", "-") + ".pdf");
}

function exportWeekly(c) {
  const [bw, bh] = sizes[c.size];
  const land = c.orientation === "landscape";
  const w = land ? bh : bw;
  const h = land ? bw : bh;
  const p = new jsPDF({ unit: "mm", format: [w, h], orientation: land ? "landscape" : "portrait" });
  const designW = 650, designH = 420, sx = w / designW, sy = h / designH;
  const muted = [174, 182, 205];

  p.setFillColor(...pdfColor(c.paper, [255, 255, 255]));
  p.rect(0, 0, w, h, "F");
  pdfTop(p, w, designW, c.accent);

  PDFText(p, "WEEKLY PLANNER · DEMO", 25 * sx, 25 * sy, 6 * 0.75, muted, true);
  PDFText(p, c.name, 25 * sx, 52 * sy, 22 * 0.75, [51, 58, 97], true);
  PDFText(p, "WEEKLY OVERVIEW", 25 * sx, 67 * sy, 5 * 0.75, muted, true);

  PDFText(p, "WEEK", (designW - 65) * sx, 31 * sy, 5 * 0.75, muted, true);
  PDFText(p, "01", (designW - 26) * sx, 39 * sy, 13 * 0.75, [95, 104, 128], true, "right");

  const days = c.week === "sunday"
    ? ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const gx = 25, gy = 75, gw = designW - 50, colW = gw / 7, gridH = 224;
  days.forEach((d, i) => {
    const x = gx + i * colW;
    p.setFillColor(...pdfColor(c.accent));
    p.rect(x * sx, gy * sy, colW * sx, 25 * sy, "F");
    PDFText(p, d, (x + colW / 2) * sx, (gy + 16) * sy, 6 * 0.75, [255, 255, 255], true, "center");
    p.setDrawColor(213, 218, 231);
    p.rect(x * sx, (gy + 25) * sy, colW * sx, gridH * sy, "S");
    p.setDrawColor(200, 206, 224);
    p.circle((x + 9) * sx, (gy + 64) * sy, 2 * sx, "S");
    p.setDrawColor(236, 239, 246);
    p.line((x + 9) * sx, (gy + 83) * sy, (x + colW - 9) * sx, (gy + 83) * sy);
    p.line((x + 9) * sx, (gy + 103) * sy, (x + colW - 9) * sx, (gy + 103) * sy);
  });

  if (c.notes) {
    for (let i = 0; i < 2; i++) {
      const x = 25 + i * 305;
      roundedStroke(p, x * sx, (designH - 75) * sy, 290 * sx, 53 * sy, 4, [217, 222, 234], 0.25);
      PDFText(p, i === 0 ? "FOCUS" : "NOTES", (x + 7) * sx, (designH - 58) * sy, 5 * 0.75, muted, true);
      p.setDrawColor(238, 238, 238);
      p.line((x + 7) * sx, (designH - 39) * sy, (x + 283) * sx, (designH - 39) * sy);
    }
  }

  PDFText(p, "dienix", (designW - 22) * sx, (designH - 10) * sy, 5 * 0.75, muted, false, "right");
  pdfElements(p, c.elements, designW, designH);
  brand(p, w, h);
  p.save(c.name.replaceAll(" ", "-") + ".pdf");
}

function Element({ e }) { let s = { left: e.x + "%", top: e.y + "%", width: e.w + "%", height: e.h + "%", color: e.color, fontSize: e.size + "px" }; if (e.type === "text") return <div className={"el text " + (e.bold ? "bold" : "")} style={s}>{e.content}</div>; if (e.type === "check") return <div className="el check" style={s}><span /> {e.content}</div>; if (e.type === "line") return <div className="el line" style={{ ...s, background: e.color }} />; if (e.type === "box") return <div className="el box" style={{ ...s, borderColor: e.color }} />; return <div className="el icon" style={s}>★</div> }
function Preview({ type, cfg, month }) {
  const style = { background: cfg.paper };
  const accent = cfg.accent;
  const days = cfg.week === "sunday" ? ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  if (type === "notebook") return <div className="page notebook premium-paper" style={style}>
    <div className="premium-top" style={{ background: accent }} />
    <div className="nb-brand">dienix</div>
    <div className="nb-title"><h3>{cfg.sections[0]?.[0] || "Notebook"}</h3><small>LINKED DIGITAL NOTEBOOK</small></div>
    <div className={"lines " + cfg.style} />
    <div className="nb-meta"><span>01</span><span>NOTES</span></div>
    {cfg.tabs && <div className="tabs">{cfg.sections.map((s, i) => <span key={i} style={{ background: accent }}>{String(i + 1).padStart(2, "0")}</span>)}</div>}
    <div className="nb-footer"><span>INDEX</span><span>‹</span><span>›</span><span>dienix</span></div>
    {cfg.elements.map(e => <Element key={e.id} e={e} />)}
  </div>;

  if (type === "annual") {
    const o = off(cfg.year, month, cfg.week);
    const cells = Array.from({ length: 42 }, (_, i) => { let d = i - o + 1; return d > 0 && d <= md(cfg.year, month) ? d : "" });
    return <div className="page annual premium-paper" style={style}>
      <div className="premium-top" style={{ background: accent }} />
      <div className="planner-kicker">ANNUAL PLANNER · DEMO</div>
      <div className="annual-title"><h3>{mn(cfg.year, month)}</h3><span>{cfg.year}</span></div>
      <div className="annual-subtitle">PLAN · ORGANIZE · WRITE · REVIEW</div>
      <div className="dow">{days.map(x => <b key={x}>{x}</b>)}</div>
      <div className={"cal " + cfg.density}>{cells.map((d, i) => <span key={i}>{d && <><b>{d}</b><i /></>}</span>)}</div>
      {cfg.notes && <div className="notes premium-notes"><b>NOTES</b><span /></div>}
      <div className="planner-signature">dienix</div>
      {cfg.elements.map(e => <Element key={e.id} e={e} />)}
    </div>;
  }

  if (type === "tasks") return <div className="page tasks premium-paper" style={style}>
    <div className="premium-top" style={{ background: accent }} />
    <div className="planner-kicker">PRODUCTIVITY · DEMO</div>
    <div className="tasks-title"><h3>{cfg.name}</h3><small>PLAN · PRIORITIZE · COMPLETE</small></div>
    <div className="task-date-card"><b>01</b><span>MON</span></div>
    <div className="priority-title">TOP PRIORITIES</div>
    <div className="priority-strip"><div /><div /><div /></div>
    <div className="task-head"><span>TASK</span>{cfg.priority && <span>PRIORITY</span>}{cfg.due && <span>DUE</span>}</div>
    <div className="task-list">{Array.from({ length: Math.min(cfg.rows, 12) }, (_, i) => <div className="task" key={i}><i /><span /><>{cfg.priority && <em>•</em>}{cfg.due && <small>/</small>}</></div>)}</div>
    <div className="task-bottom-premium"><div><b>FOCUS</b><span /></div><div><b>NOTES</b><span /></div></div>
    <div className="planner-signature">dienix</div>
    {cfg.elements.map(e => <Element key={e.id} e={e} />)}
  </div>;

  return <div className="page weekly premium-paper" style={style}>
    <div className="premium-top" style={{ background: accent }} />
    <div className="planner-kicker">WEEKLY PLANNER · DEMO</div>
    <div className="weekly-title"><h3>{cfg.name}</h3><small>WEEKLY OVERVIEW</small></div>
    <div className="week-badge"><b>WEEK</b><span>01</span></div>
    <div className="week premium-week">{days.map(d => <div key={d}><b style={{ background: accent }}>{d}</b><span /><i /><em /></div>)}</div>
    <div className="weekly-bottom-premium"><div><b>FOCUS</b><span /></div><div><b>NOTES</b><span /></div></div>
    <div className="planner-signature">dienix</div>
    {cfg.elements.map(e => <Element key={e.id} e={e} />)}
  </div>
}

function App() {
  const [lang, setLang] = useState("en"), [type, setType] = useState("notebook"), [cfgs, setCfgs] = useState(base), [month, setMonth] = useState(0), [selected, setSelected] = useState(null), [gallery, setGallery] = useState(false);
  const cfg = cfgs[type], setCfg = p => setCfgs(v => ({ ...v, [type]: { ...v[type], ...p } }));
  const add = (kind) => { let e = { id: Date.now(), type: kind, x: 12, y: 18, w: 30, h: 8, size: 11, color: cfg.accent, content: kind === "text" ? "New text" : kind === "check" ? "Task" : "", bold: false }; setCfg({ elements: [...cfg.elements, e] }); setSelected(e.id) };
  const update = (id, p) => setCfg({ elements: cfg.elements.map(e => e.id === id ? { ...e, ...p } : e) }), remove = id => { setCfg({ elements: cfg.elements.filter(e => e.id !== id) }); setSelected(null) };
  const metaData = meta[type], Icon = metaData[0], elements = [["text", Type, "text"], ["check", CheckSquare, "check"], ["line", Minus, "line"], ["box", Square, "box"], ["icon", Sparkles, "icon"]];
  const exp = () => type === "notebook" ? exportNotebook(cfg) : type === "annual" ? exportAnnual(cfg) : type === "tasks" ? exportTasks(cfg) : exportWeekly(cfg);
  return <div className="app"><aside><div className="brand"><strong>dienix</strong><span>{tr(lang, "studio")}</span></div><button className="gallery" onClick={() => setGallery(true)}><Grid2X2 /> {tr(lang, "choose")}</button><label className="side">{tr(lang, "templates")}</label>{Object.entries(meta).map(([id, m]) => { let A = m[0]; return <button className={"nav " + (type === id ? "active" : "")} onClick={() => { setType(id); setSelected(null) }} key={id}><A />{tr(lang, m[1])}</button> })}<label className="side eltitle">{tr(lang, "elements")}</label><button className="nav" onClick={() => setSelected(null)}><LayoutDashboard />{tr(lang, "layout")}</button>{elements.map(([id, A, k]) => <button className="nav" onClick={() => add(id)} key={id}><A />{tr(lang, k)}</button>)}<div className="foot">dienix · DNX Lab</div></aside>
    <main><header><div><small className="eyebrow">GOODNOTES TEMPLATE GENERATOR <b>DEMO</b></small><h1>{tr(lang, metaData[1])}</h1><p>{tr(lang, metaData[2])}</p></div><div className="head-right"><div className="langs">{["en", "de", "es"].map(x => <button className={lang === x ? "on" : ""} onClick={() => setLang(x)} key={x}>{x.toUpperCase()}</button>)}</div><span className="ready">● {tr(lang, "ready")}</span></div></header>
      <div className="demo-notice"><strong>DEMO VERSION</strong><span>This is a preview of the personal Goodnotes Template Studio. Templates are generated for demonstration purposes.</span></div>
      <section className="workspace"><div className="preview"><div className="bar"><span><Sparkles /> {tr(lang, "preview")}</span><span>{type === "notebook" ? "42 pages" : type === "annual" ? `${cfg.year} · 13 pages` : type === "tasks" ? `${cfg.rows} tasks` : "7 days"}</span></div><div className="stage compact-stage"><Preview type={type} cfg={cfg} month={month}/></div>{type === "annual" && <div className="month-nav"><button onClick={() => setMonth(Math.max(0, month - 1))}><ChevronLeft /></button><span>{mn(cfg.year, month)}</span><button onClick={() => setMonth(Math.min(11, month + 1))}><ChevronRight /></button></div>}</div>
        <div className="config"><div className="bar"><span>{tr(lang, "config")}</span><Settings2 /></div><div className="scroll"><div className="presets">{Object.entries(presets).map(([n, p]) => <button onClick={() => setCfg({ accent: p[0], paper: p[1] })} key={n}><i style={{ background: p[0] }} />{n}</button>)}</div><label>Name<input value={cfg.name} onChange={e => setCfg({ name: e.target.value })} /></label><div className="two"><label>{tr(lang, "size")}<select value={cfg.size} onChange={e => setCfg({ size: e.target.value })}><option>A4</option><option>A5</option><option>Letter</option></select></label><label>{tr(lang, "orientation")}<select value={cfg.orientation} onChange={e => setCfg({ orientation: e.target.value })}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label></div><div className="two"><label>{tr(lang, "paper")}<input type="color" value={cfg.paper} onChange={e => setCfg({ paper: e.target.value })} /></label><label>{tr(lang, "accent")}<input type="color" value={cfg.accent} onChange={e => setCfg({ accent: e.target.value })} /></label></div>
          {type === "notebook" && <><label>{tr(lang, "style")}<select value={cfg.style} onChange={e => setCfg({ style: e.target.value })}><option value="ruled">Ruled</option><option value="grid">Grid</option><option value="dotted">Dotted</option><option value="blank">Blank</option></select></label><label>{tr(lang, "tabs")}<select value={cfg.tabs ? "yes" : "no"} onChange={e => setCfg({ tabs: e.target.value === "yes" })}><option value="yes">{tr(lang, "tabs")}</option><option value="no">{tr(lang, "minimal")}</option></select></label><div className="section-head">{tr(lang, "sections")}<button onClick={() => setCfg({ sections: [...cfg.sections, [`Section ${cfg.sections.length + 1}`, 10]] })}><Plus /></button></div>{cfg.sections.map((s, i) => <div className="secrow" key={i}><b>{i + 1}</b><input value={s[0]} onChange={e => setCfg({ sections: cfg.sections.map((x, j) => j === i ? [e.target.value, x[1]] : x) })} /><input type="number" value={s[1]} onChange={e => setCfg({ sections: cfg.sections.map((x, j) => j === i ? [x[0], Number(e.target.value)] : x) })} /><button onClick={() => setCfg({ sections: cfg.sections.filter((_, j) => j !== i) })}><Trash2 /></button></div>)}<div className="checks"><label><input type="checkbox" checked={cfg.cover} onChange={e => setCfg({ cover: e.target.checked })} />{tr(lang, "cover")}</label><label><input type="checkbox" checked={cfg.numbers} onChange={e => setCfg({ numbers: e.target.checked })} />{tr(lang, "numbers")}</label></div></>}
          {type === "annual" && <><div className="two"><label>{tr(lang, "year")}<input type="number" value={cfg.year} onChange={e => setCfg({ year: Number(e.target.value) })} /></label><label>{tr(lang, "week")}<select value={cfg.week} onChange={e => setCfg({ week: e.target.value })}><option value="monday">{tr(lang, "monday")}</option><option value="sunday">{tr(lang, "sunday")}</option></select></label></div><label>{tr(lang, "density")}<select value={cfg.density} onChange={e => setCfg({ density: e.target.value })}><option value="comfortable">{tr(lang, "comfortable")}</option><option value="spacious">{tr(lang, "spacious")}</option><option value="compact">{tr(lang, "compact")}</option></select></label><div className="checks"><label><input type="checkbox" checked={cfg.weeknumbers} onChange={e => setCfg({ weeknumbers: e.target.checked })} />{tr(lang, "weeknumbers")}</label><label><input type="checkbox" checked={cfg.notes} onChange={e => setCfg({ notes: e.target.checked })} />{tr(lang, "notes")}</label></div></>}
          {type === "tasks" && <><label>{tr(lang, "rows")}<input type="number" min="5" max="30" value={cfg.rows} onChange={e => setCfg({ rows: Number(e.target.value) })} /></label><div className="checks"><label><input type="checkbox" checked={cfg.priority} onChange={e => setCfg({ priority: e.target.checked })} />{tr(lang, "priority")}</label><label><input type="checkbox" checked={cfg.due} onChange={e => setCfg({ due: e.target.checked })} />{tr(lang, "due")}</label></div></>}
          {type === "weekly" && <><label>{tr(lang, "week")}<select value={cfg.week} onChange={e => setCfg({ week: e.target.value })}><option value="monday">{tr(lang, "monday")}</option><option value="sunday">{tr(lang, "sunday")}</option></select></label><div className="checks"><label><input type="checkbox" checked={cfg.notes} onChange={e => setCfg({ notes: e.target.checked })} />{tr(lang, "notes")}</label></div></>}
          <div className="elements"><div className="section-head">{tr(lang, "elements")} <span>{cfg.elements.length}</span></div>{cfg.elements.length === 0 ? <p>{tr(lang, "noElements")}</p> : cfg.elements.map(e => <button className={selected === e.id ? "sel" : ""} onClick={() => setSelected(e.id)} key={e.id}><b>{e.type}</b><span>{e.content || "Element"}</span></button>)}</div>
          {selected && cfg.elements.find(e => e.id === selected) && (() => { let e = cfg.elements.find(x => x.id === selected); return <div className="properties"><div className="section-head">{tr(lang, "selected")}<button onClick={() => remove(e.id)}><Trash2 /></button></div><label>{tr(lang, "content")}<input value={e.content} onChange={x => update(e.id, { content: x.target.value })} /></label><div className="two"><label>{tr(lang, "width")}<input type="number" value={e.w} onChange={x => update(e.id, { w: Number(x.target.value) })} /></label><label>{tr(lang, "height")}<input type="number" value={e.h} onChange={x => update(e.id, { h: Number(x.target.value) })} /></label></div></div> })()}
          <button className="export" onClick={exp}><Download /> {tr(lang, "export")}</button><small className="hint">Goodnotes-ready · internal hyperlinks included</small></div></div></section></main>
    {gallery && <div className="modal" onClick={() => setGallery(false)}><div className="modal-box" onClick={e => e.stopPropagation()}><div className="modal-head"><div><small>{tr(lang, "choose")}</small><h2>{tr(lang, "build")}</h2></div><button onClick={() => setGallery(false)}><X /></button></div><div className="cards">{Object.entries(meta).map(([id, m]) => { let A = m[0]; return <button onClick={() => { setType(id); setGallery(false) }} key={id}><A /><strong>{tr(lang, m[1])}</strong><p>{tr(lang, m[2])}</p><ChevronRight /></button> })}</div></div></div>}</div>
}
createRoot(document.getElementById("root")).render(<App />);
