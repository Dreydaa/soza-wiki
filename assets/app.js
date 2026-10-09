(() => {
  "use strict";

  const FILES = ["content/home.md", "content/partie-1a.md", "content/partie-1b.md", "content/partie-1c.md", "content/partie-2.md"];
  const PARTS = {
    I: { title: "Partie I", name: "Le projet (V1)", blurb: "Comment Soza est construite : architecture, IA, application, tests, décisions, bugs." },
    II: { title: "Partie II", name: "Référence et vision V2", blurb: "Chronologie, V2, commandes, glossaire, sources." },
  };
  const STORE = "soza-wiki-tabs";
  const KINDS = { ok: "Fait", prop: "Non vérifié", repl: "Retiré / échec", vision: "V2" };
  const clip = (s, n) => (s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, "")}…` : s);

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
  let filter = "all";

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
    p.statuses = collectStatuses(root);
    p.html = tpl.innerHTML;
    p.text = root.textContent.replace(/\s+/g, " ").trim();
    p.words = p.text.split(" ").length;
    p.minutes = Math.max(1, Math.round(p.words / 220));
  }

  // Chaque pastille de statut devient un élément interrogeable : { kind, text, section }.
  function collectStatuses(root) {
    const plain = (n) => {
      const c = n.cloneNode(true);
      c.querySelectorAll(".st").forEach((s) => s.remove());
      return c.textContent.replace(/\s+/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
    };
    const out = [];
    let section = "";
    root.querySelectorAll("h2, .st").forEach((el) => {
      if (el.tagName === "H2") { section = el.textContent; return; }
      if (section.startsWith("Légende")) return; // la légende définit les statuts, ce ne sont pas des éléments suivis
      const kind = Object.keys(KINDS).find((k) => el.classList.contains(`st-${k}`));
      const row = el.closest("tr, li, p, .rule");
      if (!kind || !row) return;
      const text = row.tagName === "TR"
        ? [...row.cells].map(plain).filter((t) => t && !/^\d+$/.test(t)).join(" · ")
        : plain(row);
      out.push({ kind, label: el.textContent.trim(), text, section });
    });
    return out;
  }

  const statuses = () => pages.flatMap((p) => p.statuses.map((s) => ({ ...s, page: p.id })));

  // Contenu complet, parsé : ce que le portfolio consomme (bouton « JSON » ou window.SozaWiki.data()).
  function data() {
    return {
      generated: new Date().toISOString(),
      parts: PARTS,
      pages: pages.map(({ id, part, num, title, summary, sections, statuses: st, words, minutes, md }) => ({
        id, part, num, title, summary, words, minutes, statuses: st,
        sections: sections.map((s) => s.text),
        markdown: md,
      })),
    };
  }

  function exportJSON() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data(), null, 2)], { type: "application/json" }));
    a.download = "soza-wiki.json";
    a.click();
    URL.revokeObjectURL(a.href);
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
    return liveHTML() + html + "</div>";
  }

  function statusList() {
    return statuses()
      .filter((s) => filter === "all" || s.kind === filter)
      .map((s) => {
        const p = byId.get(s.page);
        const where = p.id === "accueil" ? "Accueil" : `${esc(p.num)}. ${esc(p.title)}`;
        return `<li><span class="st st-${s.kind}">${esc(s.label)}</span><span>${esc(clip(s.text, 170))}</span><small><a href="#${p.id}" data-id="${p.id}">${where}</a>${s.section ? ` · ${esc(s.section)}` : ""}</small></li>`;
      })
      .join("");
  }

  // Bloc calculé à partir du contenu parsé : il change dès qu'une page Markdown change.
  function liveHTML() {
    const list = chapters();
    const all = statuses();
    const n = (k) => all.filter((s) => s.kind === k).length;
    const kinds = Object.keys(KINDS).filter(n);
    const sum = (f) => list.reduce((t, p) => t + f(p), 0);
    const stat = (b, l) => `<div><b>${b}</b><span>${l}</span></div>`;
    const chip = (k, l, c) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${filter === k}">${l} · ${c}</button>`;
    return `<section class="live" aria-label="Le wiki en direct"><h2>Le wiki en direct</h2><p>Calculé à l'ouverture à partir des pages Markdown.</p>
<div class="stats">${stat(list.length, "pages")}${stat(sum((p) => p.sections.length), "sections")}${stat(sum((p) => p.words).toLocaleString("fr-FR"), "mots")}${stat(`${sum((p) => p.minutes)} min`, "de lecture")}${stat(all.length, "statuts suivis")}</div>
<div class="bar" role="img" aria-label="Répartition des statuts">${kinds.map((k) => `<i class="st-${k}" style="flex:${n(k)}" title="${KINDS[k]}">${n(k)}</i>`).join("")}</div>
<div class="filters">${chip("all", "Tous", all.length)}${kinds.map((k) => chip(k, KINDS[k], n(k))).join("")}</div>
<ul class="sx" id="sx">${statusList()}</ul>
<div class="tools"><button class="btn" type="button" data-export>↓ Exporter en JSON</button><a class="btn" href="?embed=1#accueil" target="_blank" rel="noopener">Mode intégré (iframe)</a></div></section>`;
  }

  function setFilter(f) {
    filter = f;
    document.querySelectorAll("[data-f]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
    $("#sx").innerHTML = statusList();
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
      const chip = target.closest("[data-f]");
      if (chip) {
        setFilter(chip.dataset.f);
        return;
      }
      if (target.closest("[data-export]")) {
        exportJSON();
        return;
      }
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
    if (new URLSearchParams(location.search).has("embed")) document.body.classList.add("embed");
    try {
      await load();
    } catch (err) {
      view.innerHTML = `<div class="page no-rail"><article><h1>Erreur de chargement</h1><p>Le contenu du wiki n'a pas pu être chargé (${esc(String(err.message || err))}). Ouvrez le site depuis un serveur web plutôt qu'en double-cliquant sur <code>index.html</code>.</p></article></div>`;
      return;
    }
    window.SozaWiki = { data, statuses, go: (id) => go(id) }; // API pour le portfolio
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
