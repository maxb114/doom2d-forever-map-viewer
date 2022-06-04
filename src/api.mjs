import { getCameraWrapper, getCurrentMapAsJSON, setCurrentMapFromJSON, getRenderingOptions, setCurrentMap, getCurrentWad } from './main.mjs'

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

function setMap (/** @type {DFMap} */ map) {
  setCurrentMap(map)
}

function setMapFromJSON (/** @type {any} */ mapObject) {
  setCurrentMapFromJSON(mapObject)
}

function currentMapAsJSON () {
  const /** @type {any} */ mapObject = getCurrentMapAsJSON()
  return mapObject
}

function getRenderFlags () {
  const options = getRenderingOptions()
  if (options === null) return {}
  const optionsObject = JSON.stringify(options)
  return optionsObject
}

function setRenderFlag (/** @type {string} */ index, /** @type {boolean} */ value) {
  const options = getRenderingOptions()
  if (options === null) return false
  options.setFlag(index, value)
  return true
}

function getMapsList () {
  const wad = getCurrentWad()
  if (wad === null) return null
  let maps = wad.maps
  maps = maps.sort((a, b) => a.path.localeCompare(b.path)) // sort lexicographically
  return maps
}

export { moveCameraByDelta, moveCamera, currentMapAsJSON, setMap, setMapFromJSON, setZoom, changeZoom, getRenderFlags, setRenderFlag, getMapsList }
