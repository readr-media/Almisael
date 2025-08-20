const RECALL_REGEX =
  /^(recall)-(january|february|march|april|may|june|july|august|september|october|november|december)$/i

const DEFAULT_VALUE = {
  isRecall: false,
  month: '',
  subtypeName: '',
}

/**
 * Validates if the given subtype string represents a recall event and extracts its details.
 *
 * @param {string} subtype - The subtype string in the format "subtypeName-month".
 * @returns {{ isRecall: boolean, month: string, subtypeName: string }} An object containing:
 *   - isRecall: Whether the subtype is a recall.
 *   - month: The extracted month from the subtype.
 *   - subtypeName: The extracted subtype name.
 */
export default function recallValidator(subtype = '') {
  const match = subtype.match(RECALL_REGEX)

  if (!match) {
    return DEFAULT_VALUE
  }

  const [, subtypeName, month] = match
  return {
    isRecall: true,
    subtypeName,
    month,
  }
}

/**
 * Checks if a given subtype is a recall subtype.
 *
 * @param {string} subtype - The subtype string to check.
 * @returns {boolean} True if the subtype is a recall type.
 */
export function isRecallSubtype(subtype) {
  return recallValidator(subtype).isRecall
}

/**
 * Extracts the month from a recall subtype.
 *
 * @param {string} subtype - The recall subtype string.
 * @returns {string} The month if valid recall subtype, empty string otherwise.
 */
export function getRecallMonth(subtype) {
  return recallValidator(subtype).month
}

/**
 * Creates a recall subtype string from a month.
 *
 * @param {string} month - The month name (e.g., 'july', 'august').
 * @returns {string} The recall subtype string (e.g., 'recall-july').
 */
export function createRecallSubtype(month) {
  if (!month || typeof month !== 'string') {
    return ''
  }

  const normalizedMonth = month.toLowerCase()
  const validMonths = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]

  if (!validMonths.includes(normalizedMonth)) {
    return ''
  }

  return `recall-${normalizedMonth}`
}
