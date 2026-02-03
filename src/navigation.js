import { getConfig } from './config'

export const Navigation = {
  element: null,
  clickHandler: null,
  injectStyles() {
    const styleId = getConfig().styleId
    if (document.getElementById(styleId)) {
      return
    }
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
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
      `
    document.head.appendChild(style)
  },
  removeStyles() {
    document.getElementById(getConfig().styleId)?.remove()
  },
  create(sections, onSectionClick) {
    this.destroy()
    this.injectStyles()

    const nav = document.createElement('nav')
    nav.id = 'bms-nav'
    nav.className = 'bms-nav'

    const inner = document.createElement('div')
    inner.className = 'bms-nav-inner'

    for (const section of sections) {
      const btn = document.createElement('button')
      const name = document.createElement('span')
      const icon = document.createElement('ha-icon')
      icon.setAttribute('icon', section.icon)
      name.textContent = section.name
      name.className = 'bms-btn-label'
      btn.className = 'bms-btn'
      btn.dataset.section = section.name
      btn.style.setProperty('--bms-btn-color', section.color)
      btn.appendChild(icon)
      btn.appendChild(name)
      inner.appendChild(btn)
    }

    this.clickHandler = (event) => {
      const btn = event.target.closest('.bms-btn')
      if (btn?.dataset.section) {
        onSectionClick(btn.dataset.section)
      }
    }

    nav.addEventListener('click', this.clickHandler, { passive: true })

    nav.appendChild(inner)
    document.body.appendChild(nav)
    this.element = nav
  },
  destroy() {
    this.removeStyles()
    if (this.element) {
      if (this.clickHandler) {
        this.element.removeEventListener('click', this.clickHandler)
        this.clickHandler = null
      }
      this.element.remove()
      this.element = null
    }
  },
  setActiveButton(sectionName) {
    if (!this.element) return
    const buttons = this.element.querySelectorAll('.bms-btn')
    for (const btn of buttons) {
      btn.classList.toggle('bms-btn--current', btn.dataset.section === sectionName)
    }
  },
}
