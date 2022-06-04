import { getCameraWrapper, getCurrentMapAsJSON, setCurrentMapFromJSON } from './main.mjs'

function moveCameraByDelta (/** @type {number} */ deltaX, /** @type {number} */ deltaY) {
  const cameraWrapper = getCameraWrapper()
  if (cameraWrapper === null) return
  cameraWrapper.moveCameraByDelta(deltaX, deltaY)
}

function moveCamera (/** @type {number} */ x, /** @type {number} */ y) {
  const cameraWrapper = getCameraWrapper()
  if (cameraWrapper === null) return
  cameraWrapper.moveCameraToCoords(x, y)
}


function setZoom (/** @type {number} */ zoom) {
  const cameraWrapper = getCameraWrapper()
  if (cameraWrapper === null) return
  cameraWrapper.setZoom(zoom)
}

function changeZoom (/** @type {number} */ zoomDelta) {
  const cameraWrapper = getCameraWrapper()
  if (cameraWrapper === null) return
  cameraWrapper.changeZoom(zoomDelta)
}

function setMapFromJSON (/** @type {any} */ mapObject) {
  setCurrentMapFromJSON(mapObject)
}

function currentMapAsJSON () {
  const /** @type {any} */ mapObject = getCurrentMapAsJSON()
  return mapObject
}

export { moveCameraByDelta, moveCamera, currentMapAsJSON, setMapFromJSON, setZoom, changeZoom }
