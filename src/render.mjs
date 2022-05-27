import { Database } from './db.mjs'
import { DFMap } from './df-map.mjs'
import { DFPanel } from './df-panel.mjs'
import { cropImage } from './image.mjs'

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

  preloadItems () {
    const promise = new Promise((resolve, reject) => {
      const items = this.map?.items ?? []
      if (items === undefined) resolve(false)
      const /** @type {Promise<any>[]} */ promises = []
      const /** @type {String[]} */ loaded = []
      const self = this
      for (const item of items) {
        const path = item.getResourcePath()
        if (path === null) continue
        const found = loaded.includes(path)
        if (found) continue
        loaded.push(path)
        const loadPromise = new Promise((resolve, reject) => {
          let loadPath = path.replaceAll('\\', '/')
          if (loadPath.charAt(0) === ':') loadPath = this.map.fileName + loadPath // add map name for internal resources
          loadPath = loadPath.toLowerCase() // lower case for now
          this.db?.loadByPath(loadPath).then((buffer) => {
            const view = new Uint8Array(buffer)
            if (item.frameObject !== undefined) { // crop if animated... that's our fate.
              const width = item.frameObject?.width
              const height = item.frameObject?.height
              cropImage(view, 'png', width, height).then((buffer) => {
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
              })
            } else {
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
            }
          }).catch((error) => reject(error))
        })
        promises.push(loadPromise)
      }
      Promise.allSettled(promises).then(() => {
        console.log(this)
        resolve(true)
      }).catch((error) => reject(error))
    })
    return promise
  }

  preloadMonsters () {
    const promise = new Promise((resolve, reject) => {
      const monsters = this.map?.monsters ?? []
      if (monsters === undefined) resolve(false)
      const /** @type {Promise<any>[]} */ promises = []
      const /** @type {String[]} */ loaded = []
      const self = this
      for (const monster of monsters) {
        const path = monster.getResourcePath()
        if (path === null) continue
        const found = loaded.includes(path)
        if (found) continue
        loaded.push(path)
        const loadPromise = new Promise((resolve, reject) => {
          let loadPath = path.replaceAll('\\', '/')
          if (loadPath.charAt(0) === ':') loadPath = this.map.fileName + loadPath // add map name for internal resources
          loadPath = loadPath.toLowerCase() // lower case for now
          this.db?.loadByPath(loadPath).then((buffer) => {
            const view = new Uint8Array(buffer)
            cropImage(view, 'png', monster.monsterFrameObject.width, monster.monsterFrameObject.height).then((buffer) => { // we have to do it...
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
            })
          }).catch((error) => reject(error))
        })
        promises.push(loadPromise)
      }
      Promise.allSettled(promises).then(() => {
        console.log(this)
        resolve(true)
      }).catch((error) => reject(error))
    })
    return promise
  }

  preloadAreas () {
    const promise = new Promise((resolve, reject) => {
      const areas = this.map?.areas ?? []
      if (areas === undefined) resolve(false)
      const /** @type {Promise<any>[]} */ promises = []
      const /** @type {String[]} */ loaded = []
      const self = this
      for (const area of areas) {
        const path = area.getResourcePath()
        if (path === null) continue
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
        console.log(this)
        resolve(true)
      }).catch((error) => reject(error))
    })
    return promise
  }

  preload () {
    const panels = this.preloadPanels()
    const items = this.preloadItems()
    const monsters = this.preloadMonsters()
    const areas = this.preloadAreas()
    return Promise.allSettled([panels, items, monsters, areas])
  }

  async renderPanels (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context, background = false) {
    const water = ['_water_0', '_water_1', '_water_2']
    const color = ['blue', 'green', 'red']
    const order = [
      ['PANEL_BACK'],
      ['PANEL_WALL', 'PANEL_STEP', 'PANEL_OPENDOOR', 'PANEL_CLOSEDOOR'],
      ['PANEL_WATER', 'PANEL_ACID1', 'PANEL_ACID2', 'PANEL_FORE']
    ]
    const /** @type {DFPanel[][]} */ ordered = [
      [],
      [],
      []
    ]
    for (const panel of (this.map?.panels ?? [])) {
      if (background && order[0]?.includes(panel.type)) ordered[0]?.push(panel)
      else if (!background && order[1]?.includes(panel.type)) ordered[1]?.push(panel)
      else if (!background && order[2]?.includes(panel.type)) ordered[2]?.push(panel)
    }
    for (let i = 0; i <= 2; ++i) {
      const panels = ordered[i]
      if (panels === undefined) continue
      for (const panel of panels) {
        const options = panel.getRenderOptions()
        if (options.invisible === true) continue
        const path = this.map?.getTexturePath(panel.texture)
        if (!path) continue
        if (water.includes(path)) {
          options.water = true
          options.fillColor = color[water.indexOf(path)] ?? '#0000FF'
          options.operation = 'darken'
        }
        let loadPath = path.replaceAll('\\', '/')
        if (loadPath.charAt(0) === ':') loadPath = this.map?.fileName + loadPath // add map name for internal resources
        loadPath = loadPath.toLowerCase() // lower case for now
        const image = this.getImage(loadPath)
        this.drawPattern(image, canvas, context, options)
      }
    }
  }

  async renderItems (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context) {
    const items = this.map?.items ?? []
    for (const item of items) {
      const path = item.getResourcePath()
      if (path === null) continue
      let loadPath = path.replaceAll('\\', '/')
      if (loadPath.charAt(0) === ':') loadPath = this.map.fileName + loadPath // add map name for internal resources
      loadPath = loadPath.toLowerCase() // lower case for now
      const image = this.getImage(loadPath)
      const options = item.getRenderOptions()
      options.width = image.width
      options.height = image.height
      options.drawImage = true
      this.drawPattern(image, canvas, context, options)
    }
  }

  async renderMonsters (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context) {
    const monsters = this.map?.monsters ?? []
    for (const item of monsters) {
      const path = item.getResourcePath()
      if (path === null) continue
      let loadPath = path.replaceAll('\\', '/')
      if (loadPath.charAt(0) === ':') loadPath = this.map.fileName + loadPath // add map name for internal resources
      loadPath = loadPath.toLowerCase() // lower case for now
      const image = this.getImage(loadPath)
      const options = item.getRenderOptions()
      options.width = image.width
      options.height = image.height
      options.drawImage = true
      this.drawPattern(image, canvas, context, options)
    }
  }

  async renderAreas (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context) {
    const areas = this.map?.areas ?? []
    for (const area of areas) {
      const path = area.getResourcePath()
      if (path === null) continue
      let loadPath = path.replaceAll('\\', '/')
      if (loadPath.charAt(0) === ':') loadPath = this.map.fileName + loadPath // add map name for internal resources
      loadPath = loadPath.toLowerCase() // lower case for now
      const image = this.getImage(loadPath)
      const options = area.getRenderOptions()
      options.width = image.width
      options.height = image.height
      options.drawImage = true
      this.drawPattern(image, canvas, context, options)
    }
  }

  async render () {
    const width = this.map?.size.x
    const height = this.map?.size.y
    const canvas = document.createElement('canvas')
    if (canvas === null) return canvas
    const context = canvas.getContext('2d')
    if (context === null) return canvas
    canvas.width = width ?? 0
    canvas.height = height ?? 0
    await this.renderPanels(canvas, context, true)
    await this.renderItems(canvas, context)
    await this.renderMonsters(canvas, context)
    await this.renderAreas(canvas, context)
    await this.renderPanels(canvas, context, false)
    return canvas
  }

  drawPattern (/** @type {null | HTMLImageElement} */ image, /** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context, /** @type {any} */ options) {
    if (options === undefined || typeof options !== 'object') return false
    else if (options.x === undefined || options.y === undefined || options.width === undefined || options.height === undefined) return false
    context.save()
    context.beginPath()
    if (options.alpha !== -1) {
      context.globalAlpha = options.alpha
    } else {
      context.globalAlpha = 1
    }
    if (options.blending === true) {
      context.globalCompositeOperation = 'lighter'
    }
    if (options.operation !== '' && typeof options.operation === 'string') {
      context.globalCompositeOperation = options.operation
    }
    context.imageSmoothingEnabled = false
    if (options.water === true) {
      if (options.fillColor === '') return false
      context.fillStyle = options.fillColor
    } else {
      const mode = 'repeat'
      const pattern = context.createPattern(image ?? new window.Image(), mode)
      if (pattern === null || pattern === undefined) return false
      pattern.setTransform(new window.DOMMatrix([1, 0, 0, 1, options.x, options.y]))
      context.fillStyle = pattern
    }
    if (options.flop !== undefined && options.flop === true) {
      context.translate(options.x + options.width, options.y)
      context.scale(-1, 1)
      options.x = 0
      options.y = 0
    }
    if (options.stroke !== undefined) context.strokeStyle = options.stroke
    if (options.drawImage !== undefined && options.drawImage === true) {
      context.drawImage(image ?? new window.Image(), options.x, options.y, options.width, options.height)
    } else {
      context.rect(options.x, options.y, options.width, options.height)
    }
    context.fill()
    context.stroke()
    context.restore()
    return true
  }
}

export { DFRender, DFRenderOptions }
