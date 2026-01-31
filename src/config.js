export const CONFIG = {
  mobileBreakpoint: 767,
  safeAreaPadding: false,
  enabledPatterns: ['/lovelace/*'],
  sectionViewPaths: [
    ['home-assistant', 'home-assistant-main', 'ha-panel-lovelace', 'hui-root', 'hui-sections-view'],
    ['home-assistant', 'home-assistant-main', 'partial-panel-resolver', 'ha-panel-lovelace', 'hui-root', 'hui-sections-view'],
  ],
  defaultIcon: 'mdi:view-dashboard',
  styleId: 'bms',
  pollInterval: 200,
  pollMaxAttempts: 50,
  wakeDebounceDelay: 300,
  wakeRecheckDelay: 500,
  navigationDelay: 100,
  resizeThrottleDelay: 150,
  ...(window.bmsConfig || {}),
}
