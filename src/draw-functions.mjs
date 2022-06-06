function drawPattern2 (/** @type {HTMLImageElement} */ image, /** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context, /** @type {any} */ options) {
  if (options.x === undefined || options.y === undefined || options.width === undefined || options.height === undefined) return false
  if (options.specialOptions === undefined) options.specialOptions = {}
  context.save()
  context.beginPath()
  if (options.alpha !== -1) {
    context.globalAlpha = options.alpha
  } else {
    context.globalAlpha = 1
  }
  context.globalCompositeOperation = options.operation
  context.imageSmoothingEnabled = false
  const mode = 'repeat'
  if (options.specialOptions.flop === true) {
    context.translate(options.x + options.width, options.y)
    context.scale(-1, 1)
    options.x = 0
    options.y = 0
  }

  if ((options.drawImage || options.specialOptions.tile === false) && (options.specialOptions.fillColor === undefined)) {
    if (options.specialOptions.scale === true && options.specialOptions.naturalWidth !== undefined && options.specialOptions.naturalHeight !== undefined) {
      const ratioWidth = options.width / options.specialOptions.naturalWidth
      const ratioHeight = options.height / options.specialOptions.naturalHeight
      const ratio = Math.max(ratioWidth, ratioHeight)
      context.drawImage(image, options.x, options.y, options.specialOptions.naturalWidth * ratio, options.specialOptions.naturalHeight * ratio)
    } else {
      context.drawImage(image, options.x, options.y, options.width, options.height)
    }
  } else if ((options.specialOptions.tile === true || options.specialOptions.tile === undefined) && (options.specialOptions.fillColor === undefined)) {
    const pattern = context.createPattern(image, mode)
    if (pattern === null || pattern === undefined) return false
    pattern.setTransform(new window.DOMMatrix([1, 0, 0, 1, options.x, options.y]))
    context.fillStyle = pattern
    context.rect(options.x, options.y, options.width, options.height)
  } else if (options.specialOptions.fillColor !== undefined) {
    if (options.specialOptions.fillColor !== undefined) context.fillStyle = options.specialOptions.fillColor
    context.rect(options.x, options.y, options.width, options.height)
  }
  if (options.stroke) context.strokeStyle = options.stroke
  context.fill()
  context.stroke()
  context.restore()
  return true
}

export { drawPattern2 }
