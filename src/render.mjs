import { getImage, saveImage } from './cache-images.mjs'
import { cropIfNeeded } from './crop-game-images.mjs'
import { convertResourcePath } from './utility.mjs'

class DFRenderOption {
  constructor (/** @type {String} */ id, /** @type {String} */ full) {
    this.id = id
    this.full = full
  }
}

const options = [
  new DFRenderOption('renderdmplayers', 'Show DM spawn areas'),
  new DFRenderOption('rendertdmplayers', 'Show TDM spawn areas'),
  new DFRenderOption('rendercoopplayers', 'Show COOP spawn areas'),
  new DFRenderOption('renderflags', 'Show flags'),
  new DFRenderOption('renderdmitems', 'Show DM items'),
  new DFRenderOption('renderitems', 'Show non-DM items'),
  new DFRenderOption('rendermonsters', 'Show monsters'),
  new DFRenderOption('renderforeground', 'Show foreground'),
  new DFRenderOption('renderwalls', 'Show walls'),
  new DFRenderOption('renderbackground', 'Show background'),
  new DFRenderOption('rendersky', 'Show sky'),
  new DFRenderOption('renderliquids', 'Show liquids'),
  new DFRenderOption('renderopendoors', 'Close doors'),
  new DFRenderOption('rendertraps', 'Activate traps')
]

class DFRenderOptions {
  constructor () {
    const optionsCopy = [...options]
    /** @type {[DFRenderOption, Boolean][]} */ this.options = []
    for (const option of optionsCopy) {
      this.options.push([option, true])
    }
  }

  get all () {
    return this.options
  }

  getFlag (/** @type {string} */ id) {
    for (const i of this.options) {
      const option = i[0]
      if (option.id !== id) continue
      const set = i[1]
      return set
    }
    return false
  }

  setFlag (/** @type {string} */ id, /** @type {boolean} */ value) {
    for (const i of this.options) {
      const option = i[0]
      if (option.id !== id) continue
      i[1] = value
      return true
    }
    return false
  }
}

class DFRender {
  constructor () {
    this.canvas = document.createElement('canvas')
    if (this.canvas === null) return
    /** @type {any} */ this.images = {}
  }

  saveByPath (/** @type {String} */ path, /** @type {Database} */ db, /** @type {any} */ element) {
    return new Promise((resolve, reject) => {
      const test = getImage(path)
      if (test !== null) {
        resolve(true)
        return true
      }
      db.loadByPath(path).then((/** @type {ArrayBuffer} */ arrayBuffer) => {
        const view = new Uint8Array(arrayBuffer)
        cropIfNeeded(element, view).then((buffer) => {
          const blob = new window.Blob([buffer], { type: 'image/png' })
          const url = window.URL.createObjectURL(blob)
          const image = new window.Image()
          image.src = url
          image.onload = function () {
            saveImage(image, path)
            resolve(true)
          }
          image.onerror = function () {
            saveImage(new window.Image(), path) // leave an empty image
            reject(Error('Error creating image!'))
          }
        })
      }).catch((/** @type {Error} */ error) => reject(error))
      return true
    })
  }

  preload (/** @type {(DFPanel | DFArea | DFItem | DFMonster | DFTexture | DFTrigger)[]} */ elements, /** @type {Database} */ db, /** @type {String} */ sky, /** @type {String} */ prefix) {
    const promises = []
    const key = 'editorPath'
    const array = elements
    const unique = [...new Map(array.map(item =>
      [item[key], item])).values()].filter((element) => {
      return element.editorPath !== null && element.editorPath !== '_water_0' && element.editorPath !== '_water_1' && element.editorPath !== '_water_2'
    }) // filter elements by editorPath value and path validness
    for (const element of unique) {
      const path = element.editorPath
      if (path === null) continue
      const promise = this.saveByPath(path, db, element)
      promises.push(promise)
    }
    const skyPath = convertResourcePath(sky, prefix)
    const promise = this.saveByPath(skyPath, db)
    promises.push(promise)
    return Promise.allSettled(promises)
  }

  render1 (/** @type {(DFPanel | DFArea | DFItem | DFMonster)[]} */ elements, /** @type {number} */ width, /** @type {number} */ height) {
    const canvas = document.createElement('canvas')
    if (canvas === null) return canvas
    const context = canvas.getContext('2d')
    if (context === null) return canvas
    canvas.width = width ?? 0
    canvas.height = height ?? 0
    for (const element of elements) {
      if (element.getRenderOptions === undefined || typeof element.getRenderOptions !== 'function') continue
      const options = element.getRenderOptions()
      if (options === undefined || options === null) continue
      const path = element.editorPath
      if (path === undefined || path === null) continue
      const image = getImage(path) ?? new window.Image()
      if (options.width === 0) options.width = image.width
      if (options.height === 0) options.height = image.height
      this.drawPattern2(image, canvas, context, options)
    }
    return canvas
  }

  drawPattern2 (/** @type {HTMLImageElement} */ image, /** @type {HTMLCanvasElement} */ _canvas, /** @type {CanvasRenderingContext2D} */ context, /** @type {any} */ options) {
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
      context.drawImage(image, options.x, options.y, options.width, options.height)
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
}

export { DFRender, DFRenderOptions }
