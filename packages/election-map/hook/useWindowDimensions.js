import { useState, useEffect } from 'react'

/**
 * @typedef {Object} WindowDimension
 * @property {number} width
 * @property {number} height
 */

/**
 * initial window dimension for server side, default set to 0
 * @type {WindowDimension}
 * */
const initialWindowDimension = {
  width: 0,
  height: 0,
}

/**
 * get window width and height, only run on client side
 * @returns {WindowDimension}
 */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

/**
 * @returns {WindowDimension}
 */
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    initialWindowDimension
  )

  useEffect(() => {
    /** @type {EventListener} */
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    setWindowDimensions(getWindowDimensions)
    window.addEventListener('resize', handleResize)
    return () => window?.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}
