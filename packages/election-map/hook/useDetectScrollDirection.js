import { useState, useEffect } from 'react'

/**
 *
 * @typedef {'stale' | 'up' | 'down'} ScrollDirection
 */

/**
 * @template T
 * @typedef {[T, import('react').Dispatch<import('react').SetStateAction<T>>]} UseState
 */

/**
 * Copy from https://stackoverflow.com/a/62497293
 * @param {number} [threshold]
 * @param {boolean} [shouldActivate]
 * @returns {{scrollDirection: ScrollDirection}}
 */
export default function useDetectScrollDirection(
  threshold = 0,
  shouldActivate = true
) {
  /** @type {UseState<ScrollDirection>} */
  const [scrollDirection, setScrollDirection] = useState('stale')

  useEffect(() => {
    if (!shouldActivate) {
      return
    }
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDir = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up')
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, shouldActivate])
  return { scrollDirection }
}
