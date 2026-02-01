/**
 * Bubble Mobile Sections
 */
import { getConfig } from './config.js'
import { Navigation } from './navigation.js'

let CONFIG = null
import { throttle, globToRegex, findAncestor, getDeepElement, isValidColor } from './utils.js'

if (!window.__bmsLogged) {
  window.__bmsLogged = true
  const label = ` Bubble Mobile Sections v${__BMS_VERSION__} `
  // eslint-disable-next-line no-console
  console.info(`%c${label}`, 'background:#111827;color:#fff;padding:2px 8px;border-radius:6px;font-weight:600;')
}

const BMS = {
  initialized: false,
  activeSection: null,
  lastPath: null,
  sections: [],
  sectionMap: new Map(),
  allSectionDivs: [],
  allCardDivs: [],
  sectionsView: null,
  pollId: null,
  pendingRaf: null,
  wakeDebounce: null,
  eventHandlers: null,
  isMobile() {
    return window.matchMedia(`(max-width: ${CONFIG.mobileBreakpoint}px)`).matches
  },
  isEnabledPage() {
    return CONFIG.enabledPatterns.some((pattern) => globToRegex(pattern).test(location.pathname))
  },
  areReferencesValid() {
    // Check if our stored DOM references are still connected to the document
    if (this.sections.length === 0) {
      return false
    }
    // Check if the first section element is still in the DOM
    const firstSection = this.sections[0]
    if (!firstSection.element?.isConnected) {
      return false
    }
    // Also verify sectionsView is still connected
    if (this.sectionsView && !this.sectionsView.isConnected) {
      return false
    }
    return true
  },
  showSection(sectionName, updateHash = true) {
    if (this.activeSection === sectionName) {
      return
    }
    this.activeSection = sectionName
    Navigation.setActiveButton(sectionName)
    if (updateHash) {
      history.replaceState(null, '', `#${encodeURIComponent(sectionName)}`)
    }
    if (this.pendingRaf) {
      cancelAnimationFrame(this.pendingRaf)
    }
    this.pendingRaf = requestAnimationFrame(() => {
      this.pendingRaf = null
      for (const element of this.allSectionDivs) {
        element.style.display = 'none'
      }
      for (const element of this.allCardDivs) {
        element.style.display = 'none'
      }
      for (const section of this.sections) {
        section.element.style.display = 'none'
      }
      const active = this.sectionMap.get(sectionName)
      if (active) {
        active.element.style.display = ''
        if (active.sectionDiv) {
          active.sectionDiv.style.display = ''
        }
        if (active.cardDiv) {
          active.cardDiv.style.display = ''
        }
      }
    })
  },
  showAllSections() {
    for (const element of this.allSectionDivs) {
      element.style.display = ''
    }
    for (const element of this.allCardDivs) {
      element.style.display = ''
    }
    for (const section of this.sections) {
      section.element.style.display = ''
    }
  },
  addViewPadding() {
    if (this.sectionsView && Navigation.element) {
      if (CONFIG.safeAreaPadding) {
        Navigation.element.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
      }
      requestAnimationFrame(() => {
        if (this.sectionsView && Navigation.element) {
          const navHeight = Navigation.element.getBoundingClientRect().height
          this.sectionsView.style.paddingBottom = `${navHeight}px`
        }
      })
    }
  },
  removeViewPadding() {
    if (this.sectionsView) {
      this.sectionsView.style.paddingBottom = ''
    }
  },
  getSectionsView() {
    for (const path of CONFIG.sectionViewPaths) {
      const view = getDeepElement(path)
      if (view) {
        return view
      }
    }
    return null
  },
  extractSeparatorInfo(separatorRoot) {
    const root = separatorRoot.shadowRoot ?? separatorRoot
    const nameElement = root.querySelector('.bubble-name')
    const lineElement = root.querySelector('.bubble-line')
    const iconElement = root.querySelector('ha-icon')
    const name = nameElement?.textContent?.trim()
    if (!name) {
      return null
    }
    const icon = iconElement?.getAttribute('icon') ?? iconElement?.icon ?? CONFIG.defaultIcon
    let color = null
    if (lineElement) {
      try {
        const bgColor = window.getComputedStyle(lineElement).backgroundColor
        if (isValidColor(bgColor)) {
          color = bgColor
        }
      } catch {
        // element not found
      }
    }
    return { name, icon, color }
  },
  detectSections() {
    const sectionsView = this.getSectionsView()
    if (!sectionsView) {
      return null
    }
    const allSectionDivs = []
    const allCardDivs = []
    const verticalStacks = []
    const separatorMap = new Map()
    const queue = [sectionsView]
    const visited = new WeakSet()
    while (queue.length > 0) {
      const node = queue.pop()
      if (!node || visited.has(node)) {
        continue
      }
      visited.add(node)
      const classList = node.classList
      const tagName = node.tagName?.toLowerCase()
      const bubbleNameElement = node.querySelector?.('.bubble-name') ?? node.shadowRoot?.querySelector?.('.bubble-name')
      const bubbleLineElement = node.querySelector?.('.bubble-line') ?? node.shadowRoot?.querySelector?.('.bubble-line')
      if (classList?.contains('section')) {
        allSectionDivs.push(node)
      }
      if (classList?.contains('card')) {
        allCardDivs.push(node)
      }
      if (tagName === 'hui-vertical-stack-card') {
        verticalStacks.push(node)
      }
      if (bubbleNameElement && bubbleLineElement) {
        const stack = findAncestor(node, (element) => element.tagName?.toLowerCase() === 'hui-vertical-stack-card')
        if (stack && !separatorMap.has(stack)) {
          separatorMap.set(stack, node)
        }
      }
      if (node.shadowRoot && !visited.has(node.shadowRoot)) {
        visited.add(node.shadowRoot)
        const shadowChildren = node.shadowRoot.children
        const len = shadowChildren.length
        for (let index = len - 1; index >= 0; index--) {
          queue.push(shadowChildren[index])
        }
      }
      const children = node.children
      if (children) {
        const len = children.length
        for (let index = len - 1; index >= 0; index--) {
          queue.push(children[index])
        }
      }
    }
    const sections = []
    const seenNames = new Set()
    const isSectionDiv = (element) => element.classList?.contains('section')
    const isCardDiv = (element) => element.classList?.contains('card')
    for (const stack of verticalStacks) {
      const separatorRoot = separatorMap.get(stack)
      if (!separatorRoot) {
        continue
      }
      const info = this.extractSeparatorInfo(separatorRoot)
      if (!info || seenNames.has(info.name)) {
        continue
      }
      sections.push({
        name: info.name,
        icon: info.icon,
        color: info.color,
        element: stack,
        sectionDiv: findAncestor(stack, isSectionDiv),
        cardDiv: findAncestor(stack, isCardDiv),
      })
      seenNames.add(info.name)
    }
    return { sections, allSectionDivs, allCardDivs, sectionsView }
  },
  init() {
    if (this.initialized || !this.isMobile() || !this.isEnabledPage()) {
      return false
    }
    const detected = this.detectSections()
    if (!detected || detected.sections.length === 0) {
      return false
    }
    // Check if all sections have valid colors (styles computed)
    const hasInvalidColors = detected.sections.some((section) => section.color === null)
    // Continue polling until styles are computed
    if (hasInvalidColors) {
      return false
    }
    this.sections = detected.sections
    this.allSectionDivs = detected.allSectionDivs
    this.allCardDivs = detected.allCardDivs
    this.sectionsView = detected.sectionsView
    this.sectionMap.clear()
    for (const section of this.sections) {
      this.sectionMap.set(section.name, section)
    }
    const hashSection = decodeURIComponent(location.hash.slice(1))
    const hashExists = this.sectionMap.has(hashSection)
    const initialSection = hashExists ? hashSection : this.sections[0].name
    Navigation.create(this.sections, (name) => this.showSection(name))
    Navigation.setActiveButton(initialSection)
    this.addViewPadding()
    this.showSection(initialSection, false)
    this.lastPath = location.pathname
    this.initialized = true
    return true
  },
  cleanup() {
    this.stopPolling()
    if (this.pendingRaf) {
      cancelAnimationFrame(this.pendingRaf)
      this.pendingRaf = null
    }
    if (this.wakeDebounce) {
      clearTimeout(this.wakeDebounce)
      this.wakeDebounce = null
    }
    Navigation.destroy()
    this.showAllSections()
    this.removeViewPadding()
    this.initialized = false
    this.activeSection = null
    this.sections = []
    this.sectionMap.clear()
    this.allSectionDivs = []
    this.allCardDivs = []
    this.sectionsView = null
  },
  startPolling() {
    if (this.pollId || this.init()) {
      return
    }
    let attempts = 0
    const pollForSections = () => {
      attempts++
      if (attempts > CONFIG.pollMaxAttempts) {
        this.stopPolling()
        return
      }
      if (!this.initialized && this.isMobile() && this.isEnabledPage()) {
        if (this.init()) {
          this.stopPolling()
          return
        }
      }
      this.pollId = setTimeout(() => {
        requestAnimationFrame(pollForSections)
      }, CONFIG.pollInterval)
    }
    requestAnimationFrame(pollForSections)
  },
  stopPolling() {
    if (this.pollId) {
      clearTimeout(this.pollId)
      this.pollId = null
    }
  },
  handleWake() {
    // Debounce multiple wake events
    if (this.wakeDebounce) {
      clearTimeout(this.wakeDebounce)
    }
    // Delay to let Home Assistant finish rebuilding the DOM
    this.wakeDebounce = setTimeout(() => {
      this.wakeDebounce = null
      // Full rebuild on wake - DOM references may be stale
      if (this.initialized) {
        this.cleanup()
      }
      if (this.isMobile() && this.isEnabledPage()) {
        this.startPolling()
      }
      // Secondary check after HA may have rebuilt again
      setTimeout(() => {
        if (this.initialized && !this.areReferencesValid()) {
          this.cleanup()
          this.startPolling()
        }
      }, CONFIG.wakeRecheckDelay)
    }, CONFIG.wakeDebounceDelay)
  },
  handleResize() {
    const shouldBeActive = this.isMobile() && this.isEnabledPage()
    if (shouldBeActive && !this.initialized) {
      this.startPolling()
    } else if (!shouldBeActive && this.initialized) {
      this.cleanup()
    }
  },
  handleNavigation() {
    const path = location.pathname
    if (this.lastPath === path) {
      return
    }
    this.lastPath = path
    this.cleanup()
    this.stopPolling()
    if (this.isMobile() && this.isEnabledPage()) {
      setTimeout(() => this.startPolling(), CONFIG.navigationDelay)
    }
  },
  handleHashChange() {
    if (!this.initialized) {
      return
    }
    const hashSection = decodeURIComponent(location.hash.slice(1))
    if (this.sectionMap.has(hashSection) && hashSection !== this.activeSection) {
      this.showSection(hashSection, false)
    }
  },
  bootstrap() {
    if (!CONFIG) {
      CONFIG = getConfig()
    }
    this.eventHandlers = {
      resize: throttle(() => this.handleResize(), CONFIG.resizeThrottleDelay),
      navigation: () => this.handleNavigation(),
      hashchange: () => this.handleHashChange(),
      visibilitychange: () => {
        // handle when mobile device goes to sleep / app minimized
        if (document.visibilityState === 'visible') {
          this.handleWake()
        }
      },
      pageshow: (event) => {
        // Handle back-forward cache restoration (Safari)
        if (event.persisted) {
          this.handleWake()
        }
      },
    }
    window.addEventListener('resize', this.eventHandlers.resize, { passive: true })
    window.addEventListener('location-changed', this.eventHandlers.navigation, { passive: true })
    window.addEventListener('popstate', this.eventHandlers.navigation, { passive: true })
    window.addEventListener('hashchange', this.eventHandlers.hashchange, { passive: true })
    document.addEventListener('visibilitychange', this.eventHandlers.visibilitychange)
    window.addEventListener('pageshow', this.eventHandlers.pageshow)
    const startInitialization = () => {
      if (this.isMobile() && this.isEnabledPage()) {
        this.startPolling()
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startInitialization, { once: true })
    } else {
      const scheduleCallback = window.requestIdleCallback ?? requestAnimationFrame
      scheduleCallback(startInitialization)
    }
  },
  shutdown() {
    this.cleanup()
    if (this.eventHandlers) {
      this.eventHandlers.resize?.cancel?.()
      window.removeEventListener('resize', this.eventHandlers.resize)
      window.removeEventListener('location-changed', this.eventHandlers.navigation)
      window.removeEventListener('popstate', this.eventHandlers.navigation)
      window.removeEventListener('hashchange', this.eventHandlers.hashchange)
      document.removeEventListener('visibilitychange', this.eventHandlers.visibilitychange)
      window.removeEventListener('pageshow', this.eventHandlers.pageshow)
      this.eventHandlers = null
    }
  },
}

window.bubbleMobileSectionsShutdown = () => BMS.shutdown()

BMS.bootstrap()
