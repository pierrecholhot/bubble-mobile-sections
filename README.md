# Bubble Mobile Sections

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

Bottom navigation for Home Assistant Lovelace sections dashboards on mobile. It builds the buttons automatically from your Bubble Card separators.

| ![Desktop](screenshots/desktop.png) | ![Mobile](screenshots/mobile.png) |
| :---------------------------------: | :-------------------------------: |
|               Desktop               |              Mobile               |

## Requirements

- Home Assistant with Lovelace sections view
- [Bubble Card](https://github.com/Clooos/Bubble-Card) separators in your dashboard

## Installation

### HACS

1. Open HACS
2. Go to **Frontend**
3. Click the three dots menu → **Custom repositories**
4. Add `https://github.com/pierrecholhot/bubble-mobile-sections` as a **Dashboard** resource
5. Search for **Bubble Mobile Sections** and install it
6. Restart Home Assistant

### Manual

1. Download `bubble-mobile-sections.js` from the [latest release](https://github.com/pierrecholhot/bubble-mobile-sections/releases/latest)
2. Place it in `config/www/`
3. Add the resource in **Settings → Dashboards → Resources**:
   - URL: `/local/bubble-mobile-sections.js`
   - Type: javascript module
4. Restart Home Assistant

## Setup

Add Bubble Card separator cards to your dashboard. Each separator becomes a navigation button. The separator's icon and color are used for the button, the name for routing.

The navigation bar appears automatically on mobile devices on enabled dashboard paths.

## Customization

### via a YAML theme

| Variable                      | Default                    | Description                      |
| ----------------------------- | -------------------------- | -------------------------------- |
| `bms-nav-background`          | `rgba(28, 28, 28, 0.1)`    | Background color                 |
| `bms-nav-border-color`        | `rgba(255, 255, 255, 0.1)` | Top border color                 |
| `bms-nav-gap`                 | `8px`                      | Gap between buttons              |
| `bms-nav-z-index`             | `9`                        | Stack order                      |
| `bms-nav-blur`                | `10px`                     | Backdrop blur amount             |
| `bms-btn-height`              | `42px`                     | Button height                    |
| `bms-btn-min-width`           | `42px`                     | Button minimum width             |
| `bms-btn-padding`             | `0 8px`                    | Button padding                   |
| `bms-btn-color`               | `transparent`              | Button background color fallback |
| `bms-btn-text-color`          | `white`                    | Button text/icon color           |
| `bms-btn-border-radius`       | `8px`                      | Button border radius             |
| `bms-btn-transition-duration` | `0.15s`                    | Animation duration               |
| `bms-btn-active-scale`        | `0.95`                     | Scale when pressed               |
| `bms-btn-active-opacity`      | `0.8`                      | Opacity when pressed             |
| `bms-btn-icon-size`           | `24px`                     | Icon size                        |

### via CSS

Use `#bms-nav` to completely override the nav styles

```css
/** Override CSS variables here */
html {
  --bms-btn-text-color: pink;
}
/** Or just re-style it */
#bms-nav {
  box-shadow: 0 0 10px #000;
}
#bms-nav .bms-btn {
  border: 1px solid #fff;
}
```

## Configuration

Optional. Add before the resource loads:

```javascript
window.bmsConfig = {
  // Max screen width in pixels for mobile mode
  mobileBreakpoint: 767,
  // Enable to add a bottom padding to the navigation that is equal to the device safe area
  safeAreaPadding: false,
  // URL glob patterns where navigation is active (use `*` for segment and `**` for any path)
  enabledPatterns: ['/lovelace/*'],
  // Shadow DOM element paths to find the sections view
  sectionViewPaths: [
    // main view
    ['home-assistant', 'home-assistant-main', 'ha-panel-lovelace', 'hui-root', 'hui-sections-view'],
    // tabs inside main view
    ['home-assistant', 'home-assistant-main', 'partial-panel-resolver', 'ha-panel-lovelace', 'hui-root', 'hui-sections-view'],
  ],
  // Fallback icon when separator has no icon
  defaultIcon: 'mdi:view-dashboard',
  // ID for the injected style element
  styleId: 'bms',
  // Interval in ms between DOM detection attempts
  pollInterval: 200,
  // Max detection attempts before giving up
  pollMaxAttempts: 50,
  // Delay in ms before rechecking after device wake
  wakeDebounceDelay: 300,
  // Delay in ms for secondary wake recheck
  wakeRecheckDelay: 500,
  // Delay in ms after URL navigation changes
  navigationDelay: 100,
  // Throttle delay in ms for resize events
  resizeThrottleDelay: 150,
}
```

## Shadow DOM & View Detection

This plugin runs inside Home Assistant's Shadow DOM. To locate the active Sections view reliably, it follows a configured list of element paths (`sectionViewPaths`). Trying to discover the right view dynamically (querying/inspecting across nested shadow roots, re-checking after navigation, and handling multiple HA layouts) is expensive and can add noticeable overhead on mobile devices.

## Timing & Polling Tuning

All detection/refresh intervals are exposed because the best values depend on your dashboard complexity and device performance. If you notice a brief flash of content, or the navigation appears a bit late/early after navigation or wake, tweak `pollInterval`, `pollMaxAttempts`, and the wake/navigation delays to match your setup.

## Button Labels & Styling

Button labels are already rendered (as `.bms-btn-label`) but hidden by default to keep the bar compact. If you want icon + text buttons, you can unhide them with CSS:

```css
#bms-nav .bms-btn {
  gap: 6px;
}
#bms-nav .bms-btn-label {
  display: inline;
  font-size: 12px;
  white-space: nowrap;
}
```

## Troubleshooting

When testing several configurations on mobile devices, clear the fontend cache (settings > companion app > debugging > reset frontend cache).

## License

MIT
