import { setMap, updateMapRender } from './api.mjs'
import { getImage } from './cache-images.mjs'
import { cloneMap } from './clone-map.mjs'
import { drawPattern2 } from './draw-functions.mjs'
import { orderDfElements } from './order-df-elements.mjs'
import { mapForRender } from './prepare-map-for-render.mjs'
import { convertResourcePath, rectanglesOverlap } from './utility.mjs'

class Editor {
  constructor (/** @type {DFMap | null} */ currentMap, /** @type {CameraWrapper | null} */ camera, /** @type {RenderOptions | null} */ options) {
    this.map = currentMap
    /** @type {DFMap | null} */ this.mapCopy = null
    /** @type {Diff[]} */ this.diffs = []
    this.camera = camera
    this.options = options
    this.highlighted = []
  }

  addDiff (/** @type {any} */ value) {
    const last = this.diffs[this.diffs.length - 1]
    if (last === undefined) this.diffs.push(value)
    else {
      if (JSON.stringify(this.map) !== JSON.stringify(value)) this.diffs.push(value)
    }
    this.diffs = [...new Set(this.diffs)].filter((x, i, a) => a.indexOf(x) === i).filter((x, i, a) => a.indexOf(x) === i)
  }

  setCurrentMap (/** @type {DFMap} */ newMap, /** @type {boolean|undefined} */ keepCopy) {
    this.map = newMap
    if (keepCopy === undefined || keepCopy === true) this.mapCopy = cloneMap(newMap)
  }

  updateElementHistory (/** @type {(DFArea|DFItem|DFMonster|DFPanel|DFTrigger)} */ element) {
    const map = cloneMap(this.map)
    this.addDiff(map)
    return true
  }

  popHistory () {
    const length = this.diffs.length
    if (length <= 1) {
      const copyClone = cloneMap(this.mapCopy)
      setMap(copyClone, false)
    } else {
      const old = this.diffs[length - 2]
      const oldClone = cloneMap(old)
      setMap(oldClone, false)
    }
    updateMapRender()
    console.log(this.diffs)
    this.diffs.pop()
    console.log(this.diffs)
    return true
  }

  setCurrentCameraWrapper (/** @type {CameraWrapper} */ newCamera) {
    this.camera = newCamera
  }

  click (/** @type {number} */ x, /** @type {number} */ y, overwrite = true) {
    if (this.map === null || this.map === undefined) return false
    if (this.camera === null || this.camera === undefined) return false
    if (this.camera === null) return false
    if (this.options === null) return false
    this.camera.update()
    const coords = this.camera.camera.screenToWorld(x, y, undefined)
    const mouseRectangle = { top: coords.y, left: coords.x, right: coords.x + 1, bottom: coords.y + 1 }
    const all = mapForRender(this.map, this.options)
    const prefix = this.map.fileName
    const sky = convertResourcePath(this.map.sky, prefix)
    const intersections = all.filter((element) => {
      if (element.pos === undefined || element.size === undefined) return false
      if (element.getRenderOptions === undefined) return false
      if (element.editorPath === '' || element.editorPath === sky) {
        return false
      }
      const options = element.getRenderOptions()
      if (options === undefined || options === null) return false
      let width = element.size.width
      let height = element.size.height
      if (width === -1 || height === -1) {
        const image = getImage(element.editorPath ?? '')
        if (image === null) return false
        width = image.width
        height = image.height
      }
      const elementRectangle = { top: options.y, left: options.x, right: options.x + width, bottom: options.y + height }
      return rectanglesOverlap(mouseRectangle, elementRectangle)
    })
    if (overwrite) this.highlighted = []
    const ordered = orderDfElements(intersections)
    const last = ordered.pop()
    if (last === undefined) return false
    this.highlighted.push(last)
    this.updateRender(this.highlighted)
    return true
  }

  moveElement (/** @type {(DFArea|DFItem|DFMonster|DFPanel|DFTrigger)[]} */ element, /** @type {number} */ x, /** @type {number} */ y) {
    element.pos.x = x
    element.pos.y = y
  }

  async onMovement (/** @type {number} */ movementX, /** @type {number} */ movementY) {
    const cameraWrapper = this.camera
    if (cameraWrapper === null) return
    movementX = Math.ceil(movementX)
    movementY = Math.ceil(movementY)
    const coords = cameraWrapper.camera.screenToWorld(movementX, movementY, undefined)
    const x = Math.ceil(coords.x)
    const y = Math.ceil(coords.y)
    const highlighted = this.highlighted
    for (const element of highlighted) {
      if (element.pos === undefined || element.size === undefined) continue
      let width = element.size.width
      let height = element.size.height
      if (width === -1 || height === -1) {
        const image = getImage(element.editorPath)
        if (image === null) continue
        width = image.width
        height = image.height
      }
      this.moveElement(element, x - (width / 2), y - (height / 2))
    }
    updateMapRender()
    return true
  }

  movementEnd () {
    const highlighted = this.highlighted
    for (const element of highlighted) {
      this.updateElementHistory(element)
    }
  }

  moveHighlightedToPosition (/** @type {number} */ x, /** @type {number} */ y) {
    //
  }

  updateRender (highlighted = []) {
    const mapWidth = this.map.size.x
    const mapHeight = this.map.size.y
    const canvas = document.createElement('canvas')
    canvas.width = mapWidth
    canvas.height = mapHeight
    const context = canvas.getContext('2d')
    for (const element of highlighted) {
      if (element.pos === undefined || element.size === undefined) continue
      if (element.getRenderOptions === undefined) continue
      const options = element.getRenderOptions()
      if (options === undefined || options === null) continue
      const x = element.pos.x
      const y = element.pos.y
      let width = element.size.width
      let height = element.size.height
      if (width === -1 || height === -1) {
        const image = getImage(element.editorPath)
        if (image === null) return false
        width = image.width
        height = image.height
      }
      if (context === null) return false
      drawPattern2(null, null, context, {
        x,
        y,
        width,
        height,
        specialOptions: {
          fillColor: '#FF0000'
        },
        stroke: 'rgba(0,0,0,0)',
        alpha: 0.5
      })
    }
    this.camera.drawImage(canvas, 0, 0, mapWidth, mapHeight)
    return true
  }
}

export { Editor }
