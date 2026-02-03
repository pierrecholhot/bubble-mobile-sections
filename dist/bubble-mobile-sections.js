/*! bubble-mobile-sections v2.0.3 */
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
}, b = {
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
          --bms-nav-z-index: 2;
          --bms-nav-blur: 10px;
          --bms-btn-height: 48px;
          --bms-btn-min-width: 48px;
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
          box-sizing: border-box;
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
          box-sizing: border-box;
        }
        .bms-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: var(--bms-btn-height);
          min-width: var(--bms-btn-min-width);
          padding: var(--bms-btn-padding);
          border: none;
          background: transparent;
          color: var(--bms-btn-text-color);
          cursor: pointer;
          border-radius: var(--bms-btn-border-radius);
          transition:
            opacity var(--bms-btn-transition-duration) ease,
            transform var(--bms-btn-transition-duration) ease;
          will-change: transform;
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }
        .bms-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--bms-btn-color);
          border-radius: inherit;
          transform: scale(0);
          transition: transform var(--bms-btn-transition-duration) ease;
        }
        .bms-btn:active {
          transform: scale(var(--bms-btn-active-scale));
          opacity: var(--bms-btn-active-opacity);
        }
        .bms-btn ha-icon {
          --mdc-icon-size: var(--bms-btn-icon-size);
          position: relative;
          color: var(--bms-btn-color);
          transition: color var(--bms-btn-transition-duration) ease;
        }
        .bms-btn--current::before {
          transform: scale(1);
        }
        .bms-btn--current ha-icon {
          color: var(--bms-btn-text-color);
        }
        .bms-btn-label {
          display: none;
        }
      `, document.head.appendChild(t);
  },
  removeStyles() {
    document.getElementById(y().styleId)?.remove();
  },
  create(e, t) {
    this.destroy(), this.injectStyles();
    const n = document.createElement("nav");
    n.id = "bms-nav", n.className = "bms-nav";
    const o = document.createElement("div");
    o.className = "bms-nav-inner";
    for (const a of e) {
      const s = document.createElement("button"), l = document.createElement("span"), c = document.createElement("ha-icon");
      c.setAttribute("icon", a.icon), l.textContent = a.name, l.className = "bms-btn-label", s.className = "bms-btn", s.dataset.section = a.name, s.style.setProperty("--bms-btn-color", a.color), s.appendChild(c), s.appendChild(l), o.appendChild(s);
    }
    this.clickHandler = (a) => {
      const s = a.target.closest(".bms-btn");
      s?.dataset.section && t(s.dataset.section);
    }, n.addEventListener("click", this.clickHandler, { passive: !0 }), n.appendChild(o), document.body.appendChild(n), this.element = n;
  },
  destroy() {
    this.removeStyles(), this.element && (this.clickHandler && (this.element.removeEventListener("click", this.clickHandler), this.clickHandler = null), this.element.remove(), this.element = null);
  },
  setActiveButton(e) {
    if (!this.element) return;
    const t = this.element.querySelectorAll(".bms-btn");
    for (const n of t)
      n.classList.toggle("bms-btn--current", n.dataset.section === e);
  }
}, P = (e) => {
  let t = document;
  for (const n of e) {
    if (!t)
      return null;
    t = t.shadowRoot?.querySelector(n) ?? t.querySelector?.(n);
  }
  return t;
}, w = (e, t) => {
  let n = e;
  for (; n; ) {
    if (t(n))
      return n;
    n = n.parentElement ?? n.getRootNode()?.host;
  }
  return null;
}, z = (e) => new RegExp(
  "^" + e.replace(/\*\*/g, "{{GLOBSTAR}}").replace(/\*/g, "[^/]*").replace(/{{GLOBSTAR}}/g, ".*") + "$"
), R = (e, t) => {
  let n = 0, o = null;
  const a = function(...s) {
    const l = Date.now(), c = t - (l - n);
    c <= 0 ? (o && (clearTimeout(o), o = null), n = l, e.apply(this, s)) : o || (o = setTimeout(() => {
      n = Date.now(), o = null, e.apply(this, s);
    }, c));
  };
  return a.cancel = () => {
    o && (clearTimeout(o), o = null);
  }, a;
}, L = (e) => {
  if (!e || typeof e != "string")
    return !1;
  const t = e.trim().toLowerCase();
  return t !== "transparent" && t !== "rgba(0, 0, 0, 0)" && !t.includes("var(");
};
let r = null;
window.__bmsLogged || (window.__bmsLogged = !0, console.info("%c Bubble Mobile Sections v2.0.3 ", "background:#111827;color:#fff;padding:2px 8px;border-radius:6px;font-weight:600;"));
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
    return window.matchMedia(`(max-width: ${r.mobileBreakpoint}px)`).matches;
  },
  isEnabledPage() {
    return r.enabledPatterns.some((e) => z(e).test(location.pathname));
  },
  areReferencesValid() {
    return !(this.sections.length === 0 || !this.sections[0].element?.isConnected || this.sectionsView && !this.sectionsView.isConnected);
  },
  showSection(e, t = !0) {
    this.activeSection !== e && (this.activeSection = e, b.setActiveButton(e), t && history.replaceState(null, "", `#${encodeURIComponent(e)}`), this.pendingRaf && cancelAnimationFrame(this.pendingRaf), this.pendingRaf = requestAnimationFrame(() => {
      this.pendingRaf = null;
      for (const o of this.allSectionDivs)
        o.style.display = "none";
      for (const o of this.allCardDivs)
        o.style.display = "none";
      for (const o of this.sections)
        o.element.style.display = "none";
      const n = this.sectionMap.get(e);
      n && (n.element.style.display = "", n.sectionDiv && (n.sectionDiv.style.display = ""), n.cardDiv && (n.cardDiv.style.display = ""));
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
    this.sectionsView && b.element && (r.safeAreaPadding && (b.element.style.paddingBottom = "env(safe-area-inset-bottom, 0px)"), requestAnimationFrame(() => {
      if (this.sectionsView && b.element) {
        const e = b.element.getBoundingClientRect().height;
        this.sectionsView.style.paddingBottom = `${e}px`;
      }
    }));
  },
  removeViewPadding() {
    this.sectionsView && (this.sectionsView.style.paddingBottom = "");
  },
  getSectionsView() {
    for (const e of r.sectionViewPaths) {
      const t = P(e);
      if (t)
        return t;
    }
    return null;
  },
  extractSeparatorInfo(e) {
    const t = e.shadowRoot ?? e, n = t.querySelector(".bubble-name"), o = t.querySelector(".bubble-line"), a = t.querySelector("ha-icon"), s = n?.textContent?.trim();
    if (!s)
      return null;
    const l = a?.getAttribute("icon") ?? a?.icon ?? r.defaultIcon;
    let c = null;
    if (o)
      try {
        const u = window.getComputedStyle(o).backgroundColor;
        L(u) && (c = u);
      } catch {
      }
    return { name: s, icon: l, color: c };
  },
  detectSections() {
    const e = this.getSectionsView();
    if (!e)
      return null;
    const t = [], n = [], o = [], a = /* @__PURE__ */ new Map(), s = [e], l = /* @__PURE__ */ new WeakSet();
    for (; s.length > 0; ) {
      const i = s.pop();
      if (!i || l.has(i))
        continue;
      l.add(i);
      const v = i.classList, d = i.tagName?.toLowerCase(), D = i.querySelector?.(".bubble-name") ?? i.shadowRoot?.querySelector?.(".bubble-name"), C = i.querySelector?.(".bubble-line") ?? i.shadowRoot?.querySelector?.(".bubble-line");
      if (v?.contains("section") && t.push(i), v?.contains("card") && n.push(i), d === "hui-vertical-stack-card" && o.push(i), D && C) {
        const h = w(i, (m) => m.tagName?.toLowerCase() === "hui-vertical-stack-card");
        h && !a.has(h) && a.set(h, i);
      }
      if (i.shadowRoot && !l.has(i.shadowRoot)) {
        l.add(i.shadowRoot);
        const h = i.shadowRoot.children, m = h.length;
        for (let f = m - 1; f >= 0; f--)
          s.push(h[f]);
      }
      const p = i.children;
      if (p) {
        const h = p.length;
        for (let m = h - 1; m >= 0; m--)
          s.push(p[m]);
      }
    }
    const c = [], u = /* @__PURE__ */ new Set(), k = (i) => i.classList?.contains("section"), x = (i) => i.classList?.contains("card");
    for (const i of o) {
      const v = a.get(i);
      if (!v)
        continue;
      const d = this.extractSeparatorInfo(v);
      !d || u.has(d.name) || (c.push({
        name: d.name,
        icon: d.icon,
        color: d.color,
        element: i,
        sectionDiv: w(i, k),
        cardDiv: w(i, x)
      }), u.add(d.name));
    }
    return { sections: c, allSectionDivs: t, allCardDivs: n, sectionsView: e };
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
    const n = decodeURIComponent(location.hash.slice(1)), a = this.sectionMap.has(n) ? n : this.sections[0].name;
    return b.create(this.sections, (s) => this.showSection(s)), b.setActiveButton(a), this.addViewPadding(), this.showSection(a, !1), this.lastPath = location.pathname, this.initialized = !0, !0;
  },
  cleanup() {
    this.stopPolling(), this.pendingRaf && (cancelAnimationFrame(this.pendingRaf), this.pendingRaf = null), this.wakeDebounce && (clearTimeout(this.wakeDebounce), this.wakeDebounce = null), b.destroy(), this.showAllSections(), this.removeViewPadding(), this.initialized = !1, this.activeSection = null, this.sections = [], this.sectionMap.clear(), this.allSectionDivs = [], this.allCardDivs = [], this.sectionsView = null;
  },
  startPolling() {
    if (this.pollId || this.init())
      return;
    let e = 0;
    const t = () => {
      if (e++, e > r.pollMaxAttempts) {
        this.stopPolling();
        return;
      }
      if (!this.initialized && this.isMobile() && this.isEnabledPage() && this.init()) {
        this.stopPolling();
        return;
      }
      this.pollId = setTimeout(() => {
        requestAnimationFrame(t);
      }, r.pollInterval);
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
      }, r.wakeRecheckDelay);
    }, r.wakeDebounceDelay);
  },
  handleResize() {
    const e = this.isMobile() && this.isEnabledPage();
    e && !this.initialized ? this.startPolling() : !e && this.initialized && this.cleanup();
  },
  handleNavigation() {
    const e = location.pathname;
    this.lastPath !== e && (this.lastPath = e, this.cleanup(), this.stopPolling(), this.isMobile() && this.isEnabledPage() && setTimeout(() => this.startPolling(), r.navigationDelay));
  },
  handleHashChange() {
    if (!this.initialized)
      return;
    const e = decodeURIComponent(location.hash.slice(1));
    this.sectionMap.has(e) && e !== this.activeSection && this.showSection(e, !1);
  },
  bootstrap() {
    r || (r = y()), this.eventHandlers = {
      resize: R(() => this.handleResize(), r.resizeThrottleDelay),
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
