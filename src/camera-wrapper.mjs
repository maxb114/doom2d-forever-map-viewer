import Camera from './camera.mjs'
import { clamp } from './utility.mjs'

const minZoom = 100
const maxZoom = 1000

class CameraWrapper {
  constructor (/** @type {CanvasRenderingContext2D} */ context, /** @type {number} */ boundX, /** @type {number} */ boundY, /** @type {HTMLCanvasElement} */ canvas) {
    this.context = context
    this.camera = new Camera(context)
    this.zoom = 1000
    this.cameraX = 0
    this.cameraY = 0
    this.boundX = boundX
    this.boundY = boundY
    this.camera.fieldOfView = 1
    this.camera.zoomTo(this.zoom)
    this.canvas = canvas
  }

  setZoom (/** @type {number} */ number) {
    const oldZoom = this.zoom
    this.zoom += number
    this.zoom = clamp(this.zoom, minZoom, maxZoom)
    if (oldZoom === this.zoom) return
    const minX = this.camera.viewport.width / 2
    const minY = this.camera.viewport.height / 2
    const maxX = this.boundX - (this.camera.viewport.width / 2)
    const maxY = this.boundY - (this.camera.viewport.height / 2)
    // const clone1 = this.camera.viewport.left
    // debugger
    this.camera.updateViewport()
    console.log(this.camera)
    this.camera.zoomTo(this.zoom)
    /*
    if (this.camera.lookAt[0] < minX) {
      const deltaX = -(minX - this.camera.lookAt[0])
      this.setCameraCoords(deltaX, 0)
      debugger
    } else if (this.camera.lookAt[1] < minY) {
      const deltaY = -(minY - this.camera.lookAt[1])
      this.setCameraCoords(deltaY, 0)
    } */
    if (this.camera.viewport.left > 0 || this.camera.viewport.right > maxX) {
      this.camera.zoomTo(oldZoom)
      this.camera.distance = oldZoom
      this.drawImage(this.canvas, 0, 0)
    }
    console.log(this.camera)
    // debugger
  }

  drawImage (/** @type {CanvasImageSource} */ image, /** @type {number} */ x, /** @type {number} */ y) {
    console.log(this.camera.distance, this.zoom)
    this.camera.distance = this.zoom
    this.camera.moveTo(this.cameraX, this.cameraY)
    // this.camera.distance = this.zoom
    // debugger
    this.camera.begin()
    this.context.fillStyle = '#FF0000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.drawImage(image, x, y)
    this.camera.end()
  }

  setCameraCoords (/** @type {number} */ x, /** @type {number} */ y) {
    this.cameraX += x
    this.cameraY += y
    const minX = this.camera.viewport.width / 2
    const minY = this.camera.viewport.height / 2
    const maxX = this.boundX - (this.camera.viewport.width / 2)
    const maxY = this.boundY - (this.camera.viewport.height / 2)
    this.cameraX = clamp(this.cameraX, minX, maxX)
    this.cameraY = clamp(this.cameraY, minY, maxY)
    // this.camera.moveTo(this.cameraX, this.cameraY)
    // this.camera.begin()
    // this.camera.end()
  }
}

export { CameraWrapper }
