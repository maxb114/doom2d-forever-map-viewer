import { Database } from './db.mjs'
import { DFMap } from './df-map.mjs'
import { DFPanel } from './df-panel.mjs'

class DFRenderOption {
  constructor (/** @type {String} */ id, /** @type {String} */ full) {
    this.id = id
    this.full = full
  }
}

const options = [
  new DFRenderOption('renderflags', 'Render flags')
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
  constructor (/** @type {DFMap} */ map, /** @type {DFRenderOptions} */ options, /** @type {Database} */ db) {
    this.canvas = document.createElement('canvas')
    if (this.canvas === null) return
    this.map = map
    this.options = options
    this.db = db
    /** @type {any} */ this.images = {}
  }

  saveImage (/** @type {HTMLImageElement} */ img, /** @type {String} */ path) {
    this.images[path] = img
  }

  getImage (/** @type {String} */ path) {
    const /** @type {HTMLImageElement} */ img = this.images[path]
    if (img === undefined) return new window.Image() // or just null, should be looked into further
    return img
  }

  preloadPanels () {
    const promise = new Promise((resolve, reject) => {
      const panels = this.map?.panels
      if (panels === undefined) resolve(false)
      const /** @type {Promise<any>[]} */ promises = []
      const /** @type {String[]} */ loaded = []
      const self = this
      for (const panel of panels) {
        const textureId = panel.texture
        const path = this.map?.getTexturePath(textureId)
        if (!path) continue
        const found = loaded.includes(path)
        if (found) continue
        loaded.push(path)
        const loadPromise = new Promise((resolve, reject) => {
          let loadPath = path.replaceAll('\\', '/')
          if (loadPath.charAt(0) === ':') loadPath = this.map.fileName + loadPath // add map name for internal resources
          loadPath = loadPath.toLowerCase() // lower case for now
          this.db?.loadByPath(loadPath).then((buffer) => {
            const view = new Uint8Array(buffer)
            const blob = new window.Blob([view], { type: 'image/png' })
            const url = window.URL.createObjectURL(blob)
            const image = new window.Image()
            image.src = url
            image.onload = function () {
              self.saveImage(image, loadPath)
              resolve(true)
            }
            image.onerror = function () {
              reject(Error('Error creating image!'))
            }
          }).catch((error) => reject(error))
        })
        promises.push(loadPromise)
      }
      Promise.allSettled(promises).then(() => {
        resolve(true)
      }).catch((error) => reject(error))
    })
    return promise
  }

  preload () {
    const panels = this.preloadPanels()
    return Promise.allSettled([panels])
  }
}

export { DFRender, DFRenderOptions }
