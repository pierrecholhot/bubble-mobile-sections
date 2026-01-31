/*! bubble-mobile-sections v1.0.0 */
const l = {
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
  resizeThrottleDelay: 150,
  ...window.bmsConfig || {}
}, u = {
  element: null,
  clickHandler: null,
  injectStyles() {
    if (document.getElementById(l.styleId))
      return;
    const e = document.createElement("style");
    e.id = l.styleId, e.textContent = `
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
      `, document.head.appendChild(e);
  },
  removeStyles() {
    document.getElementById(l.styleId)?.remove();
  },
  create(e, i) {
    this.destroy(), this.injectStyles();
    const t = document.createElement("nav");
    t.id = "bms-nav", t.className = "bms-nav";
    const a = document.createElement("div");
    a.className = "bms-nav-inner";
    for (const o of e) {
      const s = document.createElement("button"), c = document.createElement("span"), r = document.createElement("ha-icon");
      r.setAttribute("icon", o.icon), c.textContent = o.name, c.className = "bms-btn-label", s.className = "bms-btn", s.dataset.section = o.name, s.style.setProperty("--bms-btn-color", o.color), s.appendChild(r), s.appendChild(c), a.appendChild(s);
    }
    this.clickHandler = (o) => {
      const s = o.target.closest(".bms-btn");
      s?.dataset.section && i(s.dataset.section);
    }, t.addEventListener("click", this.clickHandler, { passive: !0 }), t.appendChild(a), document.body.appendChild(t), this.element = t;
  },
  destroy() {
    this.removeStyles(), this.element && (this.clickHandler && (this.element.removeEventListener("click", this.clickHandler), this.clickHandler = null), this.element.remove(), this.element = null);
  }
}, C = (e) => {
  let i = document;
  for (const t of e) {
    if (!i)
      return null;
    i = i.shadowRoot?.querySelector(t) ?? i.querySelector?.(t);
  }
  return i;
}, g = (e, i) => {
  let t = e;
  for (; t; ) {
    if (i(t))
      return t;
    t = t.parentElement ?? t.getRootNode()?.host;
  }
  return null;
}, E = (e) => new RegExp(
  "^" + e.replace(/\*\*/g, "{{GLOBSTAR}}").replace(/\*/g, "[^/]*").replace(/{{GLOBSTAR}}/g, ".*") + "$"
), x = (e, i) => {
  let t = 0, a = null;
  const o = function(...s) {
    const c = Date.now(), r = i - (c - t);
    r <= 0 ? (a && (clearTimeout(a), a = null), t = c, e.apply(this, s)) : a || (a = setTimeout(() => {
      t = Date.now(), a = null, e.apply(this, s);
    }, r));
  };
  return o.cancel = () => {
    a && (clearTimeout(a), a = null);
  }, o;
}, P = (e) => {
  if (!e || typeof e != "string")
    return !1;
  const i = e.trim().toLowerCase();
  return i !== "transparent" && i !== "rgba(0, 0, 0, 0)" && !i.includes("var(");
}, w = {
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
    return window.matchMedia(`(max-width: ${l.mobileBreakpoint}px)`).matches;
  },
  isEnabledPage() {
    return l.enabledPatterns.some((e) => E(e).test(location.pathname));
  },
  areReferencesValid() {
    return !(this.sections.length === 0 || !this.sections[0].element?.isConnected || this.sectionsView && !this.sectionsView.isConnected);
  },
  showSection(e, i = !0) {
    this.activeSection !== e && (this.activeSection = e, i && history.replaceState(null, "", `#${encodeURIComponent(e)}`), this.pendingRaf && cancelAnimationFrame(this.pendingRaf), this.pendingRaf = requestAnimationFrame(() => {
      this.pendingRaf = null;
      for (const a of this.allSectionDivs)
        a.style.display = "none";
      for (const a of this.allCardDivs)
        a.style.display = "none";
      for (const a of this.sections)
        a.element.style.display = "none";
      const t = this.sectionMap.get(e);
      t && (t.element.style.display = "", t.sectionDiv && (t.sectionDiv.style.display = ""), t.cardDiv && (t.cardDiv.style.display = ""));
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
    this.sectionsView && u.element && (l.safeAreaPadding && (u.element.style.paddingBottom = "env(safe-area-inset-bottom, 0px)"), requestAnimationFrame(() => {
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
    for (const e of l.sectionViewPaths) {
      const i = C(e);
      if (i)
        return i;
    }
    return null;
  },
  extractSeparatorInfo(e) {
    const i = e.shadowRoot ?? e, t = i.querySelector(".bubble-name"), a = i.querySelector(".bubble-line"), o = i.querySelector("ha-icon"), s = t?.textContent?.trim();
    if (!s)
      return null;
    const c = o?.getAttribute("icon") ?? o?.icon ?? l.defaultIcon;
    let r = null;
    if (a)
      try {
        const b = window.getComputedStyle(a).backgroundColor;
        P(b) && (r = b);
      } catch {
      }
    return { name: s, icon: c, color: r };
  },
  detectSections() {
    const e = this.getSectionsView();
    if (!e)
      return null;
    const i = [], t = [], a = [], o = /* @__PURE__ */ new Map(), s = [e], c = /* @__PURE__ */ new WeakSet();
    for (; s.length > 0; ) {
      const n = s.pop();
      if (!n || c.has(n))
        continue;
      c.add(n);
      const v = n.classList, h = n.tagName?.toLowerCase(), k = n.querySelector?.(".bubble-name") ?? n.shadowRoot?.querySelector?.(".bubble-name"), D = n.querySelector?.(".bubble-line") ?? n.shadowRoot?.querySelector?.(".bubble-line");
      if (v?.contains("section") && i.push(n), v?.contains("card") && t.push(n), h === "hui-vertical-stack-card" && a.push(n), k && D) {
        const d = g(n, (m) => m.tagName?.toLowerCase() === "hui-vertical-stack-card");
        d && !o.has(d) && o.set(d, n);
      }
      if (n.shadowRoot && !c.has(n.shadowRoot)) {
        c.add(n.shadowRoot);
        const d = n.shadowRoot.children, m = d.length;
        for (let f = m - 1; f >= 0; f--)
          s.push(d[f]);
      }
      const p = n.children;
      if (p) {
        const d = p.length;
        for (let m = d - 1; m >= 0; m--)
          s.push(p[m]);
      }
    }
    const r = [], b = /* @__PURE__ */ new Set(), y = (n) => n.classList?.contains("section"), S = (n) => n.classList?.contains("card");
    for (const n of a) {
      const v = o.get(n);
      if (!v)
        continue;
      const h = this.extractSeparatorInfo(v);
      !h || b.has(h.name) || (r.push({
        name: h.name,
        icon: h.icon,
        color: h.color,
        element: n,
        sectionDiv: g(n, y),
        cardDiv: g(n, S)
      }), b.add(h.name));
    }
    return { sections: r, allSectionDivs: i, allCardDivs: t, sectionsView: e };
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
    const t = decodeURIComponent(location.hash.slice(1)), o = this.sectionMap.has(t) ? t : this.sections[0].name;
    return u.create(this.sections, (s) => this.showSection(s)), this.addViewPadding(), this.showSection(o, !1), this.lastPath = location.pathname, this.initialized = !0, !0;
  },
  cleanup() {
    this.stopPolling(), this.pendingRaf && (cancelAnimationFrame(this.pendingRaf), this.pendingRaf = null), this.wakeDebounce && (clearTimeout(this.wakeDebounce), this.wakeDebounce = null), u.destroy(), this.showAllSections(), this.removeViewPadding(), this.initialized = !1, this.activeSection = null, this.sections = [], this.sectionMap.clear(), this.allSectionDivs = [], this.allCardDivs = [], this.sectionsView = null;
  },
  startPolling() {
    if (this.pollId || this.init())
      return;
    let e = 0;
    const i = () => {
      if (e++, e > l.pollMaxAttempts) {
        this.stopPolling();
        return;
      }
      if (!this.initialized && this.isMobile() && this.isEnabledPage() && this.init()) {
        this.stopPolling();
        return;
      }
      this.pollId = setTimeout(() => {
        requestAnimationFrame(i);
      }, l.pollInterval);
    };
    requestAnimationFrame(i);
  },
  stopPolling() {
    this.pollId && (clearTimeout(this.pollId), this.pollId = null);
  },
  handleWake() {
    this.wakeDebounce && clearTimeout(this.wakeDebounce), this.wakeDebounce = setTimeout(() => {
      this.wakeDebounce = null, this.initialized && this.cleanup(), this.isMobile() && this.isEnabledPage() && this.startPolling(), setTimeout(() => {
        this.initialized && !this.areReferencesValid() && (this.cleanup(), this.startPolling());
      }, l.wakeRecheckDelay);
    }, l.wakeDebounceDelay);
  },
  handleResize() {
    const e = this.isMobile() && this.isEnabledPage();
    e && !this.initialized ? this.startPolling() : !e && this.initialized && this.cleanup();
  },
  handleNavigation() {
    const e = location.pathname;
    this.lastPath !== e && (this.lastPath = e, this.cleanup(), this.stopPolling(), this.isMobile() && this.isEnabledPage() && setTimeout(() => this.startPolling(), l.navigationDelay));
  },
  handleHashChange() {
    if (!this.initialized)
      return;
    const e = decodeURIComponent(location.hash.slice(1));
    this.sectionMap.has(e) && e !== this.activeSection && this.showSection(e, !1);
  },
  bootstrap() {
    this.eventHandlers = {
      resize: x(() => this.handleResize(), l.resizeThrottleDelay),
      navigation: () => this.handleNavigation(),
      hashchange: () => this.handleHashChange(),
      visibilitychange: () => {
        document.visibilityState === "visible" && this.handleWake();
      },
      pageshow: (i) => {
        i.persisted && this.handleWake();
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
window.bubbleMobileSectionsShutdown = () => w.shutdown();
w.bootstrap();
