import { DFWad, DfwadFrom } from './df-wad.mjs'
import { getCameraWrapper, getRenderingOptions, setCurrentMap, getCurrentWad, getCurrentWadFileName, getCurrentMap, getCurrentRenderInstance, setCurrentWad, setCurrentWadFileName, getCurrentDatabaseInstance } from './core.mjs'
import { DfMapFromBuffer } from './map-from-buffer.mjs'
import { mapForRender } from './prepare-map-for-render.mjs'
import { preloadWad } from './save-to-db.mjs'
import { download, downloadDataURL, getFileNameWithoutExtension } from './utility.mjs'
import { mapFromJson } from './map-from-json-parse.mjs'
import { saveAsZip } from './export-wad.mjs'

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

function currentMap () {
  const /** @type {DFMap} */ map = getCurrentMap()
  return map
}

function currentMapAsJSON () {
  const /** @type {any} */ mapObject = currentMap()
  if (mapObject === null) return null
  const toJSON = JSON.stringify(mapObject)
  return toJSON
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

function loadMapFromThisWadAsBuffer (/** @type {string} */ index) {
  const wad = getCurrentWad()
  if (wad === null) return [null, null]
  const resource = wad.findResourceByPath(index)
  if (resource === null) return [null, null]
  const buffer = resource.buffer
  const path = resource.path
  return [buffer, path]
}

async function loadMap (/** @type {DFMap} */ map) {
  setMap(map)
  const options = getRenderFlagsAsObject()
  if (options === null) return false
  const render = getCurrentRenderInstance()
  if (render === null) return false
  const allElements = map.allElements
  const db = getDatabaseObject()
  if (db === null) return false
  const sky = map.sky
  const prefix = getCurrentWadName()
  if (prefix === null) return false
  await render.preload(allElements, db, sky, prefix)
  updateMapRender()
  fireChange('onmapload')
  return true
}

async function loadMapAndSetAsCurrent (/** @type {DFMap} */ map) {
  await loadMap(map)
  return true
}

async function loadMapFromThisWadAndSetAsCurrent (/** @type {string} */ index) {
  const fileName = getCurrentWadName()
  if (fileName === null) return
  const [buffer, path] = loadMapFromThisWadAsBuffer(index)
  if (buffer === undefined || typeof buffer === 'string' || buffer === null || path === null || path === undefined || typeof path === 'object') return false
  const loaded = DfMapFromBuffer(buffer, fileName)
  await loadMap(loaded)
  return true
}

function loadMapFromJSONAndSetAsCurrent (/** @type {any} */ mapObject) {
  const map = mapFromJson(mapObject)
  loadMap(map)
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
  fireChange('onwadload')
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
  const db = getDatabaseObject()
  if (db === null || db === undefined) return false
  const promise = new Promise((resolve, reject) => {
    saveAsZip(currentWad, db).then((zip) => {
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

function exportCurrentMap () {
  const map = currentMap()
  const view = map.asText()
  const blob = new Blob([view], { type: 'text/plain' })
  download(blob, map.name + '.txt')
  return true
}

function saveCurrentMap () {
  const map = currentMap()
  const view = new TextEncoder().encode(map.asText())
  const /** @type {DFWad} */ currentWad = getCurrentWad()
  if (currentWad === undefined || currentWad === null) return false
  const path = map.name
  currentWad.addOverwriteFile(view, path)
  return true
}

function saveCurrentMapAsNew () {
  const map = currentMap()
  const view = new TextEncoder().encode(map.asText())
  const /** @type {DFWad} */ currentWad = getCurrentWad()
  if (currentWad === undefined || currentWad === null) return false
  const total = currentWad.maps.length
  const path = map.name + '-' + total.toString()
  currentWad.addOverwriteFile(view, path)
  return true
}

function updateMapRender () {
  const mapCanvas = getCurrentMapOverviewCanvas()
  const cameraWrapper = getCameraWrapper()
  if (mapCanvas === null || cameraWrapper === null) return null
  cameraWrapper.setCanvasToDraw(mapCanvas)
  return mapCanvas
}

function setActiveCanvas (/** @type {HTMLCanvasElement} */ canvas) {
  const cameraWrapper = getCameraWrapper()
  if (cameraWrapper === null) return null
  cameraWrapper.setActiveCanvas(canvas)
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

async function checkEssentialResources () {
  const resources = ['game.wad', 'standart.wad', 'shrshade.wad', 'editor.wad']
  const db = getDatabaseObject()
  try {
    const all = await db.getAll()
    for (const resource of resources) {
      if (!all.some((/** @type {string} */ element) => element.includes(resource))) return false
    }
    return true
  } catch (error) {
    return false
  }
}

async function saveEssentialResources () {
  const /** @type {Promise<any>[]} */ promises = []
  const baseLink = 'https://doom2d.org/doom2d_forever/mapview/'
  const resources = ['game.wad', 'standart.wad', 'shrshade.wad', 'editor.wad']
  for (const resource of resources) {
    const promise = new Promise((resolve, reject) => {
      const link = baseLink + resource
      fetch(link).then((response) => {
        response.arrayBuffer().then((buffer) => {
          loadBufferAsWad(buffer).then((wad) => {
            saveWadResources(wad, resource).then(() => {
              resolve(true)
            }).catch((error) => reject(error))
          }).catch((error) => reject(error))
        }).catch((error) => reject(error))
      }).catch((error) => reject(error))
    })
    promises.push(promise)
  }
  return Promise.allSettled(promises)
}

const events = { } // 'event': handlers[]

async function addEvent (/** @type {string} */ index) {
  if (index === undefined || index === null || typeof index !== 'string') return false
  events[index] = {
    callbacks: []
  }
  return true
}

async function addCallback (/** @type {string} */ index, /** @type {function} */ callback) {
  if (index === undefined || index === null || typeof index !== 'string') return false
  if (callback === undefined || callback === null || typeof callback !== 'function') return false
  const event = events[index]
  if (event === undefined || event === null) return false
  if (!Array.isArray(event.callbacks)) return false
  event.callbacks.push(callback)
  return true
}

async function removeCallback (/** @type {string} */ index, /** @type {function} */ callback) {
  if (index === undefined || index === null || typeof index !== 'string') return false
  if (callback === undefined || callback === null || typeof callback !== 'function') return false
  const event = events[index]
  if (event === undefined || event === null) return false
  let callbacks = event.callbacks
  if (callbacks === undefined || callbacks === null || !Array.isArray(callbacks)) return false
  callbacks = callbacks.filter(item => item !== callback)
  return true
}

async function fireChange (/** @type {string} */ index) {
  const /** @type {any} */ event = events[index]
  if (event === undefined) return false
  const callbacks = event.callbacks
  if (callbacks === undefined || callbacks === null || !Array.isArray(callbacks)) return false
  for (const callback of callbacks) {
    if (typeof callback !== 'function') continue
    callback()
  }
  return true
}

addEvent('onmapload')
addEvent('onwadload')

export { moveCameraByDelta, moveCamera, currentMap, currentMapAsJSON, setMap, loadMapFromJSONAndSetAsCurrent, setZoom, changeZoom, getRenderFlags, setRenderFlag, getMapsList, loadMap, loadMapAndSetAsCurrent, getCurrentWadName, getCurrentMapName, saveCurrentWad, getRenderFlagsAsObject, saveCurrentMapOverview, getRenderFlagsList, setWad, loadBufferAsWad, setCurrentWadName, updateMapRender, saveCurrentWadResources, saveWadResources, setActiveCanvas, getDatabaseObject, checkEssentialResources, saveEssentialResources, addCallback, removeCallback, loadMapFromThisWadAndSetAsCurrent, exportCurrentMap, saveCurrentMap, saveCurrentMapAsNew }
