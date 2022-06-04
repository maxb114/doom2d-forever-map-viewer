import { getCameraWrapper, getCurrentMapAsJSON, setCurrentMapFromJSON, getRenderingOptions, setCurrentMap, getCurrentWad, getCurrentWadFileName, getCurrentMap } from './main.mjs'
import { DfMapFromBuffer } from './map-from-buffer.mjs'

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

function currentMap () {
  const /** @type {DFMap} */ map = getCurrentMap()
  return map
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

function loadMap (/** @type {string} */ index) {
  const wad = getCurrentWad()
  if (wad === null) return [null, null]
  const resource = wad.findResourceByPath(index)
  if (resource === null) return [null, null]
  const buffer = resource.buffer
  const path = resource.path
  return [buffer, path]
}

function loadMapAndSetAsCurrent (/** @type {string} */ index, /** @type {string} */ fileName) {
  const [buffer, path] = loadMap(index)
  if (buffer === undefined || typeof buffer === 'string' || buffer === null || path === null || path === undefined || typeof path === 'object') return false
  const loaded = DfMapFromBuffer(buffer, fileName)
  setMap(loaded)
  return true
}

function getCurrentWadName () {
  const currentWadName = getCurrentWadFileName()
  return currentWadName
}

function getCurrentMapName () {
  const /** @type {DFMap} */ currentMap = getCurrentMap()
  const name = currentMap.name
  return name
}

export { moveCameraByDelta, moveCamera, currentMap, currentMapAsJSON, setMap, setMapFromJSON, setZoom, changeZoom, getRenderFlags, setRenderFlag, getMapsList, loadMap, loadMapAndSetAsCurrent, getCurrentWadName, getCurrentMapName }
