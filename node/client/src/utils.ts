const idCounter = {}

export function uniqueId(prefix = '') {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0
  }

  const id = ++idCounter[prefix]
  if (prefix === '') {
    return `${id}`
  }

  return `${prefix}${id}`
}
