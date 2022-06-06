import Camera from './camera.mjs'
import { clamp } from './utility.mjs'

const minZoom = 1
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
    this.context = context
    this.canvas = canvas
    this.canvasToDraw = canvasToDraw
    this.fillColor = '#182430'
    this.initCamera()
  }

  initCamera () {
    this.camera.zoomTo(this.zoom)
    this.update()
  }

  changeZoom (/** @type {number} */ number) {
    this.zoom += number
    this.zoom = clamp(this.zoom, minZoom, maxZoom)
    this.update()
  }

  setZoom (/** @type {number} */ zoom) {
    this.zoom = zoom
    this.zoom = clamp(this.zoom, minZoom, maxZoom)
    this.update()
  }

  drawImage (/** @type {CanvasImageSource} */ image, /** @type {number} */ x, /** @type {number} */ y, /** @type {number | undefined} */ width, /** @type {number | undefined} */ height) {
    this.camera.distance = this.zoom
    this.camera.moveTo(this.cameraX, this.cameraY)
    this.camera.updateViewport()
    this.context.save()
    this.context.fillStyle = this.fillColor
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.restore()
    this.camera.begin()
    this.context.imageSmoothingEnabled = false
    if (image !== this.canvasToDraw && this.canvasToDraw !== null) this.context.drawImage(this.canvasToDraw, 0, 0)
    if (width !== undefined && height !== undefined) this.context.drawImage(image, x, y, width, height)
    else if (width === undefined && height === undefined) this.context.drawImage(image, x, y)
    this.camera.end()
  }

  moveCameraByDelta (/** @type {number} */ x, /** @type {number} */ y) {
    const sensitivity = (this.zoom * 0.001)
    this.cameraX += x * sensitivity
    this.cameraY += y * sensitivity
    this.update()
  }

  moveCameraToCoords (/** @type {number} */ x, /** @type {number} */ y) {
    this.cameraX += x
    this.cameraY += y
    this.update()
  }

  setActiveCanvas (/** @type {HTMLCanvasElement} */ canvas) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (context === null) return
    this.setContext(context)
  }

  setCanvasToDraw (/** @type {HTMLCanvasElement} */ canvas) {
    this.canvasToDraw = canvas
    this.boundX = this.canvasToDraw.width
    this.boundY = this.canvasToDraw.height
    this.update()
  }

  setContext (/** @type {CanvasRenderingContext2D} */ context) {
    this.context = context
    this.camera = new Camera(context)
    this.update()
  }

  update () {
    this.camera.zoomTo(this.zoom)
    this.camera.moveTo(this.cameraX, this.cameraY)
    this.camera.updateViewport()
    this.context.imageSmoothingEnabled = false
    if (this.canvasToDraw === null || this.canvasToDraw === undefined) return
    this.drawImage(this.canvasToDraw, 0, 0)
  }
}

export { CameraWrapper }
