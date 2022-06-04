import Camera from './camera.mjs'
import { clamp } from './utility.mjs'

const minZoom = 100
const maxZoom = 10000

class CameraWrapper {
  constructor (/** @type {CanvasRenderingContext2D} */ context, /** @type {number} */ boundX, /** @type {number} */ boundY, /** @type {HTMLCanvasElement} */ canvas, /** @type {HTMLCanvasElement | null} */ canvasToDraw) {
    this.context = context
    this.camera = new Camera(context)
    this.zoom = 1000
    this.cameraX = 0
    this.cameraY = 0
    this.boundX = boundX
    this.boundY = boundY
    this.camera.fieldOfView = Math.PI / 4
    this.camera.zoomTo(this.zoom)
    this.canvas = canvas
    this.canvasToDraw = canvasToDraw
    this.fillColor = '#182430'
  }

  setZoom (/** @type {number} */ number) {
    const oldZoom = this.zoom
    this.zoom += number
    this.zoom = clamp(this.zoom, minZoom, maxZoom)
    if (oldZoom === this.zoom) return
    this.camera.updateViewport()
    this.camera.zoomTo(this.zoom)
    this.update()
  }

  drawImage (/** @type {CanvasImageSource} */ image, /** @type {number} */ x, /** @type {number} */ y) {
    this.camera.distance = this.zoom
    this.camera.moveTo(this.cameraX, this.cameraY)
    this.camera.updateViewport()
    this.context.save()
    this.context.fillStyle = this.fillColor
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.restore()
    this.camera.begin()
    this.context.imageSmoothingEnabled = false
    this.context.drawImage(image, x, y)
    this.camera.end()
  }

  setCameraCoords (/** @type {number} */ x, /** @type {number} */ y) {
    const sensitivity = (this.zoom * 0.001)
    this.cameraX += x * sensitivity
    this.cameraY += y * sensitivity
    this.update()
  }

  setCanvasToDraw (/** @type {HTMLCanvasElement} */ canvas) {
    this.canvasToDraw = canvas
    this.update()
  }

  update () {
    if (this.canvasToDraw === null) return
    this.drawImage(this.canvasToDraw, 0, 0)
  }
}

export { CameraWrapper }
