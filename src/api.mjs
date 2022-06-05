import { DFWad } from './df-wad.mjs'
import { getCameraWrapper, getCurrentMapAsJSON, setCurrentMapFromJSON, getRenderingOptions, setCurrentMap, getCurrentWad, getCurrentWadFileName, getCurrentMap, getCurrentRenderInstance } from './main.mjs'
import { DfMapFromBuffer } from './map-from-buffer.mjs'
import { mapForRender } from './prepare-map-for-render.mjs'
import { download, downloadDataURL, getFileNameWithoutExtension } from './utility.mjs'

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

function getRenderFlagsAsObject () {
  const options = getRenderingOptions()
  return options
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
  maps = maps.sort((/** @type {DFMap} */ a, /** @type {DFMap} */ b) => a.path.localeCompare(b.path)) // sort lexicographically
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

function saveCurrentWad () {
  const /** @type {DFWad} */ currentWad = getCurrentWad()
  if (currentWad === undefined || currentWad === null) return false
  currentWad.saveAsZip().then((zip) => {
    zip.generateAsync({ type: 'blob' }).then((/** @type {Blob} */ blob) => {
      const fileName = getCurrentWadName()
      if (fileName === null) return false
      download(blob, getFileNameWithoutExtension(fileName) + '.dfz')
      return true
    }).catch(() => {
      return false
    })
  }).catch(() => {
    return false
  })
  return true
}

function getCurrentMapOverviewCanvas () {
  const /** @type {DFMap} */ currentMap = getCurrentMap()
  const /** @type {DFRenderOptions | null} */ currentOptions = getRenderFlagsAsObject()
  if (currentOptions === null) return null
  const mapView = mapForRender(currentMap, currentOptions)
  const width = currentMap.size.x
  const height = currentMap.size.y
  const render = getCurrentRenderInstance()
  if (render === null) return null
  const savedMap = render.render1(mapView, width, height)
  return savedMap
}

function saveCurrentMapOverview (/** @type {string | undefined} */ savePath) {
  const overview = getCurrentMapOverviewCanvas()
  if (overview === null) return false
  const dataURL = overview.toDataURL()
  if (savePath === undefined) {
    const mapName = getCurrentMapName()
    const wadName = getCurrentWadName()
    if (mapName === null || wadName === null) return false
    savePath = wadName + '-' + mapName + '.png'
  }
  downloadDataURL(dataURL, savePath)
  return true
}

export { moveCameraByDelta, moveCamera, currentMap, currentMapAsJSON, setMap, setMapFromJSON, setZoom, changeZoom, getRenderFlags, setRenderFlag, getMapsList, loadMap, loadMapAndSetAsCurrent, getCurrentWadName, getCurrentMapName, saveCurrentWad, getRenderFlagsAsObject, saveCurrentMapOverview }
