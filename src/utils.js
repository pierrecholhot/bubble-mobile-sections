// Navigate shadow DOM path to reach deep element
export const getDeepElement = (path) => {
  let el = document
  for (const selector of path) {
    if (!el) {
      return null
    }
    el = el.shadowRoot?.querySelector(selector) ?? el.querySelector?.(selector)
  }
  return el
}

// Find ancestor matching predicate, traversing shadow DOM
export const findAncestor = (element, matcher) => {
  let current = element
  while (current) {
    if (matcher(current)) {
      return current
    }
    current = current.parentElement ?? current.getRootNode()?.host
  }
  return null
}

// Simple glob to regex: * matches any chars except /, ** matches anything including /
export const globToRegex = (glob) => {
  return new RegExp(
    '^' +
      glob
        .replace(/\*\*/g, '{{GLOBSTAR}}')
        .replace(/\*/g, '[^/]*')
        .replace(/{{GLOBSTAR}}/g, '.*') +
      '$'
  )
}

// Throttle function calls to max one per wait ms
export const throttle = (fn, wait) => {
  let lastTime = 0
  let timeoutId = null

  const throttled = function (...args) {
    const now = Date.now()
    const remaining = wait - (now - lastTime)

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastTime = now
      fn.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now()
        timeoutId = null
        fn.apply(this, args)
      }, remaining)
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return throttled
}

export const isValidColor = (color) => {
  if (!color || typeof color != 'string') {
    return false
  }
  const trimmed = color.trim().toLowerCase()
  return trimmed !== 'transparent' && trimmed !== 'rgba(0, 0, 0, 0)' && !trimmed.includes('var(')
}
