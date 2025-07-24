// https://github.com/codler/react-ga4#readme
import ga4 from 'react-ga4'
import { ga4Id } from '../config/index.mjs'

const init = () => {
  ga4.initialize([
    {
      trackingId: ga4Id,
    },
  ])
}

/**
 * @param {string} eventName
 * @param {Object} [params]
 */
const sendGAEvent = (eventName, params) => {
  const isParamsAnObject =
    typeof params === 'object' && params !== null && !Array.isArray(params)
  const isParamsNotEmptyObject =
    isParamsAnObject && Object.keys(params).length !== 0
  const hasParams = !!params && isParamsNotEmptyObject

  if (hasParams) {
    ga4.event(eventName, params)
  } else {
    ga4.event(eventName)
  }
}

const gtag = { init, sendGAEvent }

export default gtag
