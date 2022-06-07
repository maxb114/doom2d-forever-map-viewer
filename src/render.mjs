import { getImage, saveImage } from './cache-images.mjs'
import { cropIfNeeded } from './crop-game-images.mjs'
import { drawPattern2 } from './draw-functions.mjs'
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
  new DFRenderOption('renderhide', 'Hide hidden panels'),
  new DFRenderOption('renderforeground', 'Show foreground'),
  new DFRenderOption('renderwalls', 'Show walls'),
  new DFRenderOption('rendersteps', 'Show steps'),
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
    this.context = this.canvas.getContext('2d')
    if (this.context === null) return
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
      const promise = new Promise((resolve, reject) => {
        this.saveByPath(path, db, element).then(() => {
          /*
          const cached = getImage(path)
          if (cached === null) {
            resolve(true)
          } else {
            if (element.width === -1) element.width = cached.width
            if (element.height === -1) element.height = cached.height
            resolve(true)
            //
          }
          */
          resolve(true)
        }).catch((error) => reject(error))
      })
      promises.push(promise)
    }
    const skyPath = convertResourcePath(sky, prefix)
    const promise = this.saveByPath(skyPath, db)
    promises.push(promise)
    return Promise.allSettled(promises)
  }

  render1 (/** @type {(DFPanel | DFArea | DFItem | DFMonster)[]} */ elements, /** @type {number} */ width, /** @type {number} */ height) {
    const canvas = this.canvas
    const context = this.context
    if (canvas === null || canvas === undefined || context === null || context === undefined) return false
    canvas.width = width ?? 0
    canvas.height = height ?? 0
    for (const element of elements) {
      this.renderElement(element, canvas, context)
    }
    return canvas
  }

  renderElement (/** @type {(DFPanel | DFArea | DFItem | DFMonster | DFTrigger)} */ element, /** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context, ignorePosition = false) {
    if (element.getRenderOptions === undefined || typeof element.getRenderOptions !== 'function') return false
    const options = element.getRenderOptions()
    if (options === undefined || options === null) return false
    const path = element.editorPath
    if (path === undefined || path === null) return false
    const image = getImage(path) ?? new window.Image()
    if (options.width === 0) options.width = image.width
    if (options.height === 0) options.height = image.height
    options.specialOptions.naturalWidth = image.naturalWidth
    options.specialOptions.naturalHeight = image.naturalHeight
    if (ignorePosition) {
      options.x = 0
      options.y = 0
    }
    drawPattern2(image, canvas, context, options)
    return true
  }
}

export { DFRender, DFRenderOptions }
