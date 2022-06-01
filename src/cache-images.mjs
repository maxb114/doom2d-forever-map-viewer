/** @type {any} */ const images = {}

function saveImage (/** @type {HTMLImageElement} */ img, /** @type {String} */ path) {
  images[path] = img
  return true
}

function getImage (/** @type {String} */ path) {
  const /** @type {HTMLImageElement} */ img = images[path]
  if (img === undefined) {
    return null
  }
  return img
}

export { saveImage, getImage }
