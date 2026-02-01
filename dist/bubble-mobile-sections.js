/*! bubble-mobile-sections v1.0.0 */
const E = {
  mobileBreakpoint: 767,
  safeAreaPadding: !1,
  enabledPatterns: ["/lovelace/*"],
  sectionViewPaths: [
    ["home-assistant", "home-assistant-main", "ha-panel-lovelace", "hui-root", "hui-sections-view"],
    ["home-assistant", "home-assistant-main", "partial-panel-resolver", "ha-panel-lovelace", "hui-root", "hui-sections-view"]
  ],
  defaultIcon: "mdi:view-dashboard",
  styleId: "bms",
  pollInterval: 200,
  pollMaxAttempts: 50,
  wakeDebounceDelay: 300,
  wakeRecheckDelay: 500,
  navigationDelay: 100,
  resizeThrottleDelay: 150
};
let g = null;
const y = () => {
  if (!g) {
    const e = window.BubbleMobileSections?.config ?? {};
    g = { ...E, ...e };
  }
  return g;
}, u = {
  element: null,
  clickHandler: null,
  injectStyles() {
    const e = y().styleId;
    if (document.getElementById(e))
      return;
    const t = document.createElement("style");
    t.id = e, t.textContent = `
        html {
          --bms-nav-background: rgba(28, 28, 28, 0.1);
          --bms-nav-border-color: rgba(255, 255, 255, 0.1);
          --bms-nav-gap: 8px;
          --bms-nav-z-index: 9;
          --bms-nav-blur: 10px;
          --bms-btn-height: 42px;
          --bms-btn-min-width: 42px;
          --bms-btn-padding: 0 8px;
          --bms-btn-color: transparent;
          --bms-btn-text-color: white;
          --bms-btn-border-radius: 8px;
          --bms-btn-transition-duration: 0.15s;
          --bms-btn-active-scale: 0.95;
          --bms-btn-active-opacity: 0.8;
          --bms-btn-icon-size: 24px;
        }
        .bms-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bms-nav-background);
          border-top: 1px solid var(--bms-nav-border-color);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          z-index: var(--bms-nav-z-index);
          box-sizing: content-box;
          overflow-x: scroll;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          -webkit-backdrop-filter: blur(var(--bms-nav-blur));
          backdrop-filter: blur(var(--bms-nav-blur));
        }
        .bms-nav::-webkit-scrollbar {
          display: none;
        }
        .bms-nav-inner {
          display: flex;
          align-items: center;
          gap: var(--bms-nav-gap);
          margin: 0 auto;
          padding: calc(var(--bms-nav-gap) * 2);
        }
        .bms-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: var(--bms-btn-height);
          min-width: var(--bms-btn-min-width);
          padding: var(--bms-btn-padding);
          border: none;
          background: var(--bms-btn-color);
          color: var(--bms-btn-text-color);
          cursor: pointer;
          border-radius: var(--bms-btn-border-radius);
          transition:
            opacity var(--bms-btn-transition-duration) ease,
            transform var(--bms-btn-transition-duration) ease;
          will-change: transform;
          -webkit-tap-highlight-color: transparent;
        }
        .bms-btn:active {
          transform: scale(var(--bms-btn-active-scale));
          opacity: var(--bms-btn-active-opacity);
        }
        .bms-btn-label {
          display: none;
        }
        ha-icon {
          --mdc-icon-size: var(--bms-btn-icon-size);
        }
      `, document.head.appendChild(t);
  },
  removeStyles() {
    document.getElementById(y().styleId)?.remove();
  },
  create(e, t) {
    this.destroy(), this.injectStyles();
    const i = document.createElement("nav");
    i.id = "bms-nav", i.className = "bms-nav";
    const o = document.createElement("div");
    o.className = "bms-nav-inner";
    for (const a of e) {
      const s = document.createElement("button"), l = document.createElement("span"), r = document.createElement("ha-icon");
      r.setAttribute("icon", a.icon), l.textContent = a.name, l.className = "bms-btn-label", s.className = "bms-btn", s.dataset.section = a.name, s.style.setProperty("--bms-btn-color", a.color), s.appendChild(r), s.appendChild(l), o.appendChild(s);
    }
    this.clickHandler = (a) => {
      const s = a.target.closest(".bms-btn");
      s?.dataset.section && t(s.dataset.section);
    }, i.addEventListener("click", this.clickHandler, { passive: !0 }), i.appendChild(o), document.body.appendChild(i), this.element = i;
  },
  destroy() {
    this.removeStyles(), this.element && (this.clickHandler && (this.element.removeEventListener("click", this.clickHandler), this.clickHandler = null), this.element.remove(), this.element = null);
  }
}, P = (e) => {
  let t = document;
  for (const i of e) {
    if (!t)
      return null;
    t = t.shadowRoot?.querySelector(i) ?? t.querySelector?.(i);
  }
  return t;
}, w = (e, t) => {
  let i = e;
  for (; i; ) {
    if (t(i))
      return i;
    i = i.parentElement ?? i.getRootNode()?.host;
  }
  return null;
}, R = (e) => new RegExp(
  "^" + e.replace(/\*\*/g, "{{GLOBSTAR}}").replace(/\*/g, "[^/]*").replace(/{{GLOBSTAR}}/g, ".*") + "$"
), L = (e, t) => {
  let i = 0, o = null;
  const a = function(...s) {
    const l = Date.now(), r = t - (l - i);
    r <= 0 ? (o && (clearTimeout(o), o = null), i = l, e.apply(this, s)) : o || (o = setTimeout(() => {
      i = Date.now(), o = null, e.apply(this, s);
    }, r));
  };
  return a.cancel = () => {
    o && (clearTimeout(o), o = null);
  }, a;
}, z = (e) => {
  if (!e || typeof e != "string")
    return !1;
  const t = e.trim().toLowerCase();
  return t !== "transparent" && t !== "rgba(0, 0, 0, 0)" && !t.includes("var(");
};
let c = null;
window.__bmsLogged || (window.__bmsLogged = !0, console.info("%c Bubble Mobile Sections v1.0.0 ", "background:#111827;color:#fff;padding:2px 8px;border-radius:6px;font-weight:600;"));
const S = {
  initialized: !1,
  activeSection: null,
  lastPath: null,
  sections: [],
  sectionMap: /* @__PURE__ */ new Map(),
  allSectionDivs: [],
  allCardDivs: [],
  sectionsView: null,
  pollId: null,
  pendingRaf: null,
  wakeDebounce: null,
  eventHandlers: null,
  isMobile() {
    return window.matchMedia(`(max-width: ${c.mobileBreakpoint}px)`).matches;
  },
  isEnabledPage() {
    return c.enabledPatterns.some((e) => R(e).test(location.pathname));
  },
  areReferencesValid() {
    return !(this.sections.length === 0 || !this.sections[0].element?.isConnected || this.sectionsView && !this.sectionsView.isConnected);
  },
  showSection(e, t = !0) {
    this.activeSection !== e && (this.activeSection = e, t && history.replaceState(null, "", `#${encodeURIComponent(e)}`), this.pendingRaf && cancelAnimationFrame(this.pendingRaf), this.pendingRaf = requestAnimationFrame(() => {
      this.pendingRaf = null;
      for (const o of this.allSectionDivs)
        o.style.display = "none";
      for (const o of this.allCardDivs)
        o.style.display = "none";
      for (const o of this.sections)
        o.element.style.display = "none";
      const i = this.sectionMap.get(e);
      i && (i.element.style.display = "", i.sectionDiv && (i.sectionDiv.style.display = ""), i.cardDiv && (i.cardDiv.style.display = ""));
    }));
  },
  showAllSections() {
    for (const e of this.allSectionDivs)
      e.style.display = "";
    for (const e of this.allCardDivs)
      e.style.display = "";
    for (const e of this.sections)
      e.element.style.display = "";
  },
  addViewPadding() {
    this.sectionsView && u.element && (c.safeAreaPadding && (u.element.style.paddingBottom = "env(safe-area-inset-bottom, 0px)"), requestAnimationFrame(() => {
      if (this.sectionsView && u.element) {
        const e = u.element.getBoundingClientRect().height;
        this.sectionsView.style.paddingBottom = `${e}px`;
      }
    }));
  },
  removeViewPadding() {
    this.sectionsView && (this.sectionsView.style.paddingBottom = "");
  },
  getSectionsView() {
    for (const e of c.sectionViewPaths) {
      const t = P(e);
      if (t)
        return t;
    }
    return null;
  },
  extractSeparatorInfo(e) {
    const t = e.shadowRoot ?? e, i = t.querySelector(".bubble-name"), o = t.querySelector(".bubble-line"), a = t.querySelector("ha-icon"), s = i?.textContent?.trim();
    if (!s)
      return null;
    const l = a?.getAttribute("icon") ?? a?.icon ?? c.defaultIcon;
    let r = null;
    if (o)
      try {
        const b = window.getComputedStyle(o).backgroundColor;
        z(b) && (r = b);
      } catch {
      }
    return { name: s, icon: l, color: r };
  },
  detectSections() {
    const e = this.getSectionsView();
    if (!e)
      return null;
    const t = [], i = [], o = [], a = /* @__PURE__ */ new Map(), s = [e], l = /* @__PURE__ */ new WeakSet();
    for (; s.length > 0; ) {
      const n = s.pop();
      if (!n || l.has(n))
        continue;
      l.add(n);
      const v = n.classList, d = n.tagName?.toLowerCase(), x = n.querySelector?.(".bubble-name") ?? n.shadowRoot?.querySelector?.(".bubble-name"), C = n.querySelector?.(".bubble-line") ?? n.shadowRoot?.querySelector?.(".bubble-line");
      if (v?.contains("section") && t.push(n), v?.contains("card") && i.push(n), d === "hui-vertical-stack-card" && o.push(n), x && C) {
        const h = w(n, (m) => m.tagName?.toLowerCase() === "hui-vertical-stack-card");
        h && !a.has(h) && a.set(h, n);
      }
      if (n.shadowRoot && !l.has(n.shadowRoot)) {
        l.add(n.shadowRoot);
        const h = n.shadowRoot.children, m = h.length;
        for (let f = m - 1; f >= 0; f--)
          s.push(h[f]);
      }
      const p = n.children;
      if (p) {
        const h = p.length;
        for (let m = h - 1; m >= 0; m--)
          s.push(p[m]);
      }
    }
    const r = [], b = /* @__PURE__ */ new Set(), k = (n) => n.classList?.contains("section"), D = (n) => n.classList?.contains("card");
    for (const n of o) {
      const v = a.get(n);
      if (!v)
        continue;
      const d = this.extractSeparatorInfo(v);
      !d || b.has(d.name) || (r.push({
        name: d.name,
        icon: d.icon,
        color: d.color,
        element: n,
        sectionDiv: w(n, k),
        cardDiv: w(n, D)
      }), b.add(d.name));
    }
    return { sections: r, allSectionDivs: t, allCardDivs: i, sectionsView: e };
  },
  init() {
    if (this.initialized || !this.isMobile() || !this.isEnabledPage())
      return !1;
    const e = this.detectSections();
    if (!e || e.sections.length === 0 || e.sections.some((s) => s.color === null))
      return !1;
    this.sections = e.sections, this.allSectionDivs = e.allSectionDivs, this.allCardDivs = e.allCardDivs, this.sectionsView = e.sectionsView, this.sectionMap.clear();
    for (const s of this.sections)
      this.sectionMap.set(s.name, s);
    const i = decodeURIComponent(location.hash.slice(1)), a = this.sectionMap.has(i) ? i : this.sections[0].name;
    return u.create(this.sections, (s) => this.showSection(s)), this.addViewPadding(), this.showSection(a, !1), this.lastPath = location.pathname, this.initialized = !0, !0;
  },
  cleanup() {
    this.stopPolling(), this.pendingRaf && (cancelAnimationFrame(this.pendingRaf), this.pendingRaf = null), this.wakeDebounce && (clearTimeout(this.wakeDebounce), this.wakeDebounce = null), u.destroy(), this.showAllSections(), this.removeViewPadding(), this.initialized = !1, this.activeSection = null, this.sections = [], this.sectionMap.clear(), this.allSectionDivs = [], this.allCardDivs = [], this.sectionsView = null;
  },
  startPolling() {
    if (this.pollId || this.init())
      return;
    let e = 0;
    const t = () => {
      if (e++, e > c.pollMaxAttempts) {
        this.stopPolling();
        return;
      }
      if (!this.initialized && this.isMobile() && this.isEnabledPage() && this.init()) {
        this.stopPolling();
        return;
      }
      this.pollId = setTimeout(() => {
        requestAnimationFrame(t);
      }, c.pollInterval);
    };
    requestAnimationFrame(t);
  },
  stopPolling() {
    this.pollId && (clearTimeout(this.pollId), this.pollId = null);
  },
  handleWake() {
    this.wakeDebounce && clearTimeout(this.wakeDebounce), this.wakeDebounce = setTimeout(() => {
      this.wakeDebounce = null, this.initialized && this.cleanup(), this.isMobile() && this.isEnabledPage() && this.startPolling(), setTimeout(() => {
        this.initialized && !this.areReferencesValid() && (this.cleanup(), this.startPolling());
      }, c.wakeRecheckDelay);
    }, c.wakeDebounceDelay);
  },
  handleResize() {
    const e = this.isMobile() && this.isEnabledPage();
    e && !this.initialized ? this.startPolling() : !e && this.initialized && this.cleanup();
  },
  handleNavigation() {
    const e = location.pathname;
    this.lastPath !== e && (this.lastPath = e, this.cleanup(), this.stopPolling(), this.isMobile() && this.isEnabledPage() && setTimeout(() => this.startPolling(), c.navigationDelay));
  },
  handleHashChange() {
    if (!this.initialized)
      return;
    const e = decodeURIComponent(location.hash.slice(1));
    this.sectionMap.has(e) && e !== this.activeSection && this.showSection(e, !1);
  },
  bootstrap() {
    c || (c = y()), this.eventHandlers = {
      resize: L(() => this.handleResize(), c.resizeThrottleDelay),
      navigation: () => this.handleNavigation(),
      hashchange: () => this.handleHashChange(),
      visibilitychange: () => {
        document.visibilityState === "visible" && this.handleWake();
      },
      pageshow: (t) => {
        t.persisted && this.handleWake();
      }
    }, window.addEventListener("resize", this.eventHandlers.resize, { passive: !0 }), window.addEventListener("location-changed", this.eventHandlers.navigation, { passive: !0 }), window.addEventListener("popstate", this.eventHandlers.navigation, { passive: !0 }), window.addEventListener("hashchange", this.eventHandlers.hashchange, { passive: !0 }), document.addEventListener("visibilitychange", this.eventHandlers.visibilitychange), window.addEventListener("pageshow", this.eventHandlers.pageshow);
    const e = () => {
      this.isMobile() && this.isEnabledPage() && this.startPolling();
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e, { once: !0 }) : (window.requestIdleCallback ?? requestAnimationFrame)(e);
  },
  shutdown() {
    this.cleanup(), this.eventHandlers && (this.eventHandlers.resize?.cancel?.(), window.removeEventListener("resize", this.eventHandlers.resize), window.removeEventListener("location-changed", this.eventHandlers.navigation), window.removeEventListener("popstate", this.eventHandlers.navigation), window.removeEventListener("hashchange", this.eventHandlers.hashchange), document.removeEventListener("visibilitychange", this.eventHandlers.visibilitychange), window.removeEventListener("pageshow", this.eventHandlers.pageshow), this.eventHandlers = null);
  }
};
window.bubbleMobileSectionsShutdown = () => S.shutdown();
S.bootstrap();
