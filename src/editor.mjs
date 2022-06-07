import { getImage } from './cache-images.mjs'
import { drawPattern2 } from './draw-functions.mjs'
import { mapForRender } from './prepare-map-for-render.mjs'
import { convertResourcePath, rectanglesOverlap } from './utility.mjs'

class Editor {
  constructor (/** @type {DFMap | null} */ currentMap, /** @type {CameraWrapper | null} */ camera, /** @type {RenderOptions | null} */ options) {
    this.map = currentMap
    this.camera = camera
    this.options = options
    this.highlighted = []
  }

  setCurrentMap (/** @type {DFMap} */ newMap) {
    this.map = newMap
  }

  setCurrentCameraWrapper (/** @type {CameraWrapper} */ newCamera) {
    this.camera = newCamera
  }

  click (/** @type {number} */ x, /** @type {number} */ y) {
    if (this.map === null || this.map === undefined) return false
    if (this.camera === null || this.camera === undefined) return false
    if (this.camera === null) return false
    if (this.options === null) return false
    this.camera.update()
    const coords = this.camera.camera.screenToWorld(x, y, undefined)
    const mouseRectangle = { top: coords.y, left: coords.x, right: coords.x + 1, bottom: coords.y + 1 }
    const all = mapForRender(this.map, this.options)
    const intersections = all.filter((element) => {
      if (element.pos === undefined || element.size === undefined) return false
      if (element.getRenderOptions === undefined) return false
      const options = element.getRenderOptions()
      if (options === undefined || options === null) return false
      let width = element.size.width
      let height = element.size.height
      if (width === -1 || height === -1) {
        const image = getImage(element.editorPath)
        if (image === null) return null
        width = image.width
        height = image.height
      }
      const elementRectangle = { top: options.y, left: options.x, right: options.x + width, bottom: options.y + height }
      return rectanglesOverlap(mouseRectangle, elementRectangle)
    })
    this.highlighted = []
    for (const intersection of intersections) this.highlighted.push(intersection)
    this.updateRender(this.highlighted)
    return true
  }

  updateRender (highlighted = []) {
    const mapWidth = this.map.size.x
    const mapHeight = this.map.size.y
    const canvas = document.createElement('canvas')
    canvas.width = mapWidth
    canvas.height = mapHeight
    const context = canvas.getContext('2d')
    const prefix = this.map.fileName
    const sky = convertResourcePath(this.map.sky, prefix)
    for (const element of highlighted) {
      if (element.pos === undefined || element.size === undefined) continue
      if (element.getRenderOptions === undefined) continue
      if (element.editorPath === '' || element.editorPath === sky) {
        continue
      }
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
        x: x,
        y: y,
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
