import { drawPattern2 } from './draw-functions.mjs'

class Editor {
  constructor (/** @type {DFMap | null} */ currentMap, /** @type {CameraWrapper | null} */ camera) {
    this.map = currentMap
    this.camera = camera
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
    this.camera.update()
    const coords = this.camera.camera.screenToWorld(x, y, undefined)
    const canvas = document.createElement('canvas')
    canvas.width = 30
    canvas.height = 30
    const context = canvas.getContext('2d')
    if (context === null) return false
    drawPattern2(null, null, context, {
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      specialOptions: {
        fillColor: '#FF0000'
      },
      stroke: 'rgba(0,0,0,0)'
    })
    this.camera.drawImage(canvas, coords.x, coords.y)
    return true
  }
}

export { Editor }
