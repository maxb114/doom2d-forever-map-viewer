import { DFWad, DfwadFrom } from './df-wad.mjs'
import { getCameraWrapper, getCurrentMapAsJSON, setCurrentMapFromJSON, getRenderingOptions, setCurrentMap, getCurrentWad, getCurrentWadFileName, getCurrentMap, getCurrentRenderInstance, setCurrentWad, setCurrentWadFileName, getCurrentDatabaseInstance } from './main.mjs'
import { DfMapFromBuffer } from './map-from-buffer.mjs'
import { mapForRender } from './prepare-map-for-render.mjs'
import { preloadWad } from './save-to-db.mjs'
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

function getRenderFlagsList () {
  const options = getRenderingOptions()
  if (options === null) return null
  const all = options.all
  return all
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

async function loadMapAndSetAsCurrent (/** @type {string} */ index) {
  const fileName = getCurrentWadName()
  if (fileName === null) return
  const [buffer, path] = loadMap(index)
  if (buffer === undefined || typeof buffer === 'string' || buffer === null || path === null || path === undefined || typeof path === 'object') return false
  const loaded = DfMapFromBuffer(buffer, fileName)
  setMap(loaded)
  const options = getRenderFlagsAsObject()
  if (options === null) return false
  const render = getCurrentRenderInstance()
  if (render === null) return false
  const allElements = loaded.allElements
  const db = getDatabaseObject()
  if (db === null) return false
  const sky = loaded.sky
  const prefix = getCurrentWadName()
  if (prefix === null) return false
  await render.preload(allElements, db, sky, prefix)
  return updateMapRender()
}

function setCurrentWadName (/** @type {string} */ newWadName) {
  setCurrentWadFileName(newWadName)
}

function getDatabaseObject () {
  const db = getCurrentDatabaseInstance()
  return db
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

function loadBufferAsWad (/** @type {ArrayBuffer} */ buffer) {
  const promise = new Promise((resolve, reject) => {
    const view = new Uint8Array(buffer)
    const wadName = getCurrentWadName() ?? ''
    DfwadFrom(view, wadName).then((wad) => {
      resolve(wad)
      return true
    }).catch((error) => {
      reject(error)
      return false
    })
  })
  return promise
}

function setWad (/** @type {DFWad} */ wad) {
  setCurrentWad(wad)
  return true
}

async function saveWadResources (/** @type {DFWad} */ wad, /** @type {string} */ name) {
  const db = getCurrentDatabaseInstance()
  if (db === null) return false
  const promises = preloadWad(wad, name, db)
  await Promise.allSettled(promises)
  return true
}

async function saveCurrentWadResources () {
  const wadName = getCurrentWadName()
  if (wadName === null) return false
  const wad = getCurrentWad()
  if (wad === null) return false
  const db = getCurrentDatabaseInstance()
  if (db === null) return false
  const promises = preloadWad(wad, wadName, db)
  await Promise.allSettled(promises)
  return true
}

function saveCurrentWad () {
  const /** @type {DFWad} */ currentWad = getCurrentWad()
  if (currentWad === undefined || currentWad === null) return false
  const promise = new Promise((resolve, reject) => {
    currentWad.saveAsZip().then((zip) => {
      zip.generateAsync({ type: 'blob' }).then((/** @type {Blob} */ blob) => {
        const fileName = getCurrentWadName()
        if (fileName === null) return false
        download(blob, getFileNameWithoutExtension(fileName) + '.dfz')
        resolve(true)
        return true
      }).catch((/** @type {Error} */ error) => {
        reject(error)
        return false
      })
    }).catch((/** @type {Error} */ error) => {
      reject(error)
      return false
    })
  })
  return promise
}

function updateMapRender () {
  const mapCanvas = getCurrentMapOverviewCanvas()
  const cameraWrapper = getCameraWrapper()
  if (mapCanvas === null || cameraWrapper === null) return null
  const width = mapCanvas.width
  const height = mapCanvas.height
  cameraWrapper.setCanvasToDraw(mapCanvas)
  cameraWrapper.boundX = width
  cameraWrapper.boundY = height
  return mapCanvas
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

export { moveCameraByDelta, moveCamera, currentMap, currentMapAsJSON, setMap, setMapFromJSON, setZoom, changeZoom, getRenderFlags, setRenderFlag, getMapsList, loadMap, loadMapAndSetAsCurrent, getCurrentWadName, getCurrentMapName, saveCurrentWad, getRenderFlagsAsObject, saveCurrentMapOverview, getRenderFlagsList, setWad, loadBufferAsWad, setCurrentWadName, updateMapRender, saveCurrentWadResources, saveWadResources }
