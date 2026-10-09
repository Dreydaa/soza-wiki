(() => {
  "use strict";

  const FILES = ["content/home.md", "content/partie-1a.md", "content/partie-1b.md", "content/partie-1c.md", "content/partie-2.md"];
  const PARTS = {
    I: { title: "Partie I", name: "Le projet (V1)", blurb: "Comment Soza est construite : architecture, IA, application, tests, décisions, bugs." },
    II: { title: "Partie II", name: "Référence et vision V2", blurb: "Chronologie, V2, commandes, glossaire, sources." },
  };
  const STORE = "soza-wiki-tabs";

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const view = $("#view");
  const nav = $("#nav");
  const tabsEl = $("#tabs");
  const q = $("#q");

  let pages = [];
  const byId = new Map();
  let tabs = ["accueil"];
  let active = "accueil";

  function parse(text) {
    const out = [];
    const chunks = text.split(/^@@ page (.+)$/m);
    for (let i = 1; i < chunks.length; i += 2) {
      const [id, part, num, title, summary] = chunks[i].split("|").map((s) => s.trim());
      out.push({ id, part, num, title, summary: summary || "", md: chunks[i + 1].trim() });
    }
    return out;
  }

  function render(p) {
    const tpl = document.createElement("template");
    tpl.innerHTML = marked.parse(p.md, { gfm: true });
    const root = tpl.content;
    p.sections = [];
    root.querySelectorAll("h2").forEach((h, i) => {
      h.id = `${p.id}-s${i + 1}`;
      p.sections.push({ id: h.id, text: h.textContent });
    });
    root.querySelectorAll("h3").forEach((h, i) => (h.id = `${p.id}-t${i + 1}`));
    root.querySelectorAll("table").forEach((t) => {
      const wrap = document.createElement("div");
      wrap.className = "table";
      t.replaceWith(wrap);
      wrap.append(t);
    });
    root.querySelectorAll("a[href]").forEach((a) => {
      const h = a.getAttribute("href");
      if (h.startsWith("#") && byId.has(h.slice(1))) a.dataset.id = h.slice(1);
      else if (/^https?:/.test(h)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    });
    p.html = tpl.innerHTML;
    p.text = root.textContent.replace(/\s+/g, " ").trim();
  }

  async function load() {
    const texts = await Promise.all(
      FILES.map((f) => fetch(f).then((r) => {
        if (!r.ok) throw new Error(`${f} : ${r.status}`);
        return r.text();
      })),
    );
    pages = texts.flatMap(parse);
    pages.forEach((p) => byId.set(p.id, p));
    pages.forEach(render);
  }

  const chapters = () => pages.filter((p) => p.id !== "accueil");
  const label = (p) => (/^\d+$/.test(p.num) ? "Chapitre" : "Annexe");
  const meta = (p) => (p.sections.length > 1 ? `${p.sections.length} sections` : "Page unique");

  function drawNav() {
    let html = "";
    for (const key of Object.keys(PARTS)) {
      const part = PARTS[key];
      html += `<h2>${part.title}</h2><p>${esc(part.name)}</p>`;
      for (const p of chapters().filter((c) => c.part === key)) {
        html += `<a href="#${p.id}" data-id="${p.id}"><span class="n">${esc(p.num)}</span><span>${esc(p.title)}</span></a>`;
      }
    }
    nav.innerHTML = html;
  }

  function markNav() {
    nav.querySelectorAll("a").forEach((a) => {
      if (a.dataset.id === active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function drawTabs() {
    tabsEl.innerHTML = tabs
      .map((id) => {
        const p = byId.get(id);
        const chip = id === "accueil" ? "" : `<span class="c">${esc(p.num)}</span>`;
        const close = id === "accueil" ? "" : `<span class="x" data-close="${id}" title="Fermer l'onglet" aria-label="Fermer l'onglet ${esc(p.title)}">×</span>`;
        return `<button class="tab" role="tab" type="button" data-tab="${id}" aria-selected="${id === active}">${chip}<span class="t">${esc(id === "accueil" ? "Accueil" : p.title)}</span>${close}</button>`;
      })
      .join("");
    const sel = tabsEl.querySelector('[aria-selected="true"]');
    if (sel) sel.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function pageHTML(p) {
    const list = chapters();
    const i = list.findIndex((c) => c.id === p.id);
    const prev = i > 0 ? list[i - 1] : null;
    const next = i >= 0 && i < list.length - 1 ? list[i + 1] : null;
    const isHome = p.id === "accueil";
    const eyebrow = isHome ? "" : `<p class="eyebrow">${PARTS[p.part].title} · ${label(p)} ${esc(p.num)}</p>`;
    const num = isHome ? "" : `<span class="n">${esc(p.num)}</span>`;
    const rail = p.sections.length >= 2
      ? `<nav class="rail" aria-label="Dans cette page"><p>Dans cette page</p>${p.sections.map((s) => `<a href="#${s.id}" data-s="${s.id}">${esc(s.text)}</a>`).join("")}</nav>`
      : "";
    const pn = isHome ? "" : `<div class="pn">${prev ? `<a class="prev" href="#${prev.id}" data-id="${prev.id}"><small>Précédent</small><b>${esc(prev.num)}. ${esc(prev.title)}</b></a>` : "<span></span>"}${next ? `<a class="next" href="#${next.id}" data-id="${next.id}"><small>Suivant</small><b>${esc(next.num)}. ${esc(next.title)}</b></a>` : ""}</div>`;
    const index = isHome ? homeIndex() : "";
    return `<div class="page${rail ? "" : " no-rail"}"><article>${eyebrow}<h1>${num}${esc(p.title)}</h1>${p.summary ? `<p class="lead">${esc(p.summary)}</p>` : ""}<div class="body">${p.html}</div>${index}${pn}</article>${rail}</div>`;
  }

  function homeIndex() {
    let html = '<div class="chapters">';
    for (const key of Object.keys(PARTS)) {
      html += `<h2>${PARTS[key].title} · ${esc(PARTS[key].name)}</h2><p>${esc(PARTS[key].blurb)}</p>`;
      for (const p of chapters().filter((c) => c.part === key)) {
        html += `<a href="#${p.id}" data-id="${p.id}"><span class="n">${esc(p.num)}</span><b>${esc(p.title)}<i>${meta(p)}</i></b><span>${esc(p.summary)}</span></a>`;
      }
    }
    return html + "</div>";
  }

  function draw() {
    const p = byId.get(active);
    view.innerHTML = pageHTML(p);
    view.scrollTo({ top: 0, behavior: "instant" });
    document.title = p.id === "accueil" ? "Wiki Soza" : `${p.title} · Wiki Soza`;
    drawTabs();
    markNav();
  }

  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify({ tabs, active })); } catch { /* stockage indisponible */ }
  }

  function go(id, { newTab = false, push = true } = {}) {
    if (!byId.has(id)) id = "accueil";
    if (!tabs.includes(id)) {
      if (newTab || active === "accueil") tabs.push(id);
      else tabs[tabs.indexOf(active)] = id;
    }
    active = id;
    save();
    draw();
    document.body.classList.remove("open");
    if (push && location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
  }

  function close(id) {
    if (id === "accueil" || !tabs.includes(id)) return;
    const i = tabs.indexOf(id);
    tabs.splice(i, 1);
    if (active === id) active = tabs[Math.max(0, i - 1)];
    save();
    draw();
    history.replaceState(null, "", `#${active}`);
  }

  function results(query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return chapters()
      .map((p) => {
        const hay = `${p.title} ${p.summary} ${p.text}`.toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return null;
        const at = Math.max(0, p.text.toLowerCase().indexOf(terms[0]));
        const start = Math.max(0, at - 50);
        let score = 0;
        for (const t of terms) {
          if (p.title.toLowerCase().includes(t)) score += 10;
          score += Math.min(hay.split(t).length - 1, 8);
        }
        return { p, snippet: p.text.slice(start, start + 150), score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }

  function drawSearch() {
    const query = q.value.trim();
    if (query.length < 2) {
      drawNav();
      markNav();
      return;
    }
    const hits = results(query);
    const re = new RegExp(`(${query.split(/\s+/).filter(Boolean).map(rx).join("|")})`, "gi");
    nav.innerHTML = `<div class="results"><p class="count">${hits.length} page${hits.length > 1 ? "s" : ""} pour « ${esc(query)} »</p>${hits
      .map((h) => `<a href="#${h.p.id}" data-id="${h.p.id}"><b>${esc(h.p.num)}. ${esc(h.p.title)}</b><span>…${esc(h.snippet).replace(re, "<mark>$1</mark>")}…</span></a>`)
      .join("")}</div>`;
  }

  function route() {
    const id = location.hash.slice(1);
    go(byId.has(id) ? id : "accueil", { push: false });
  }

  function typing(e) {
    const t = e.target;
    return t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      const closer = target.closest("[data-close]");
      if (closer) {
        e.preventDefault();
        e.stopPropagation();
        close(closer.dataset.close);
        return;
      }
      const tab = target.closest("[data-tab]");
      if (tab) {
        go(tab.dataset.tab);
        return;
      }
      const sec = target.closest("[data-s]");
      if (sec) {
        e.preventDefault();
        const el = document.getElementById(sec.dataset.s);
        if (el) el.scrollIntoView({ block: "start" });
        return;
      }
      const link = target.closest("a[data-id]");
      if (link) {
        e.preventDefault();
        go(link.dataset.id, { newTab: e.ctrlKey || e.metaKey });
        if (q.value) {
          q.value = "";
          drawSearch();
        }
      }
    });
    tabsEl.addEventListener("auxclick", (e) => {
      const tab = e.target instanceof Element ? e.target.closest("[data-tab]") : null;
      if (tab && e.button === 1) {
        e.preventDefault();
        close(tab.dataset.tab);
      }
    });
    q.addEventListener("input", drawSearch);
    q.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        q.value = "";
        drawSearch();
        q.blur();
      } else if (e.key === "Enter") {
        const first = nav.querySelector(".results a");
        if (first) go(first.dataset.id);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !typing(e) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        q.focus();
        q.select();
      } else if (e.key === "Delete" && !typing(e)) {
        close(active);
      } else if (e.key === "Escape" && document.body.classList.contains("open")) {
        document.body.classList.remove("open");
      }
    });
    $("#menu").addEventListener("click", () => document.body.classList.toggle("open"));
    $("#scrim").addEventListener("click", () => document.body.classList.remove("open"));
    window.addEventListener("popstate", route);
    window.addEventListener("hashchange", route);
  }

  async function main() {
    try {
      await load();
    } catch (err) {
      view.innerHTML = `<div class="page no-rail"><article><h1>Erreur de chargement</h1><p>Le contenu du wiki n'a pas pu être chargé (${esc(String(err.message || err))}). Ouvrez le site depuis un serveur web plutôt qu'en double-cliquant sur <code>index.html</code>.</p></article></div>`;
      return;
    }
    drawNav();
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || "{}");
      if (Array.isArray(saved.tabs)) tabs = saved.tabs.filter((id) => byId.has(id));
    } catch { /* ignoré */ }
    if (!tabs.includes("accueil")) tabs.unshift("accueil");
    const fromHash = location.hash.slice(1);
    active = byId.has(fromHash) ? fromHash : "accueil";
    if (!tabs.includes(active)) tabs.push(active);
    bind();
    draw();
  }

  main();
})();
