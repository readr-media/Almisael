import { useEffect } from 'react'

/**
 *
 * @param {React.MutableRefObject<null | HTMLElement>} ref
 * @param {Function} callback
 */
export default function useClickOutside(ref, callback) {
  useEffect(() => {
    /** @type {EventListener}*/
    const handleClickOutside = (event) => {
      const targetNode = /** @type {Node} */ (event.target)
      if (ref.current && !ref.current.contains(targetNode)) {
        callback()
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [ref, callback])
}
