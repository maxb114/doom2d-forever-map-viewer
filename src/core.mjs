import { CameraWrapper } from './camera-wrapper.mjs'
import { DatabaseFrom } from './db.mjs'
import { mapFromJson } from './map-from-json-parse.mjs'
import { DFRender, DFRenderOptions } from './render.mjs'

class Core {
  constructor (/** @type {HTMLCanvasElement} */ renderCanvas, /** @type {CanvasRenderingContext2D} */ renderContext) {
    /** @type {CameraWrapper | null} */ this.camera = null
    /** @type {DFRenderOptions | null} */ this.options = null
    /** @type {DFWad | null} */ this.wad = null
    /** @type {string | null} */ this.mapName = null
    /** @type {DFRender | null} */ this.render = null
    /** @type {Database | null} */ this.db = null
    /** @type {DFMap | null } */ this.currentMap = null
    this.camera = new CameraWrapper(renderContext, 0, 0, renderCanvas)
    this.options = new DFRenderOptions()
    this.render = new DFRender()
  }

  setCurrentMap (/** @type {DFMap} */ map) {
    core.currentMap = map
  }
}

async function coreFrom (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context) {
  const core = new Core(canvas, context)
  try {
    core.db = await DatabaseFrom()
  } catch (error) {
    window.alert(error)
  }
  return core
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
if (context === null) throw Error('Error creating context!')
const core = await coreFrom(canvas, context)
function getCameraWrapper () {
  return core.camera
}

function setCurrentMap (/** @type {DFMap} */ map) {
  core.currentMap = map
  return core.currentMap
}

function setCurrentMapFromJSON (/** @type {any} */ mapObject) {
  const map = mapFromJson(mapObject)
  core.setCurrentMap(map)
}

function getCurrentMap () {
  const map = core.currentMap
  return map
}

function getCurrentMapAsJSON () {
  const map = core.currentMap
  const toJSON = JSON.stringify(map)
  return toJSON
}

function getRenderingOptions () {
  const renderingOptions = core.options
  return renderingOptions
}

function getCurrentWad () {
  const currentWad = core.wad
  return currentWad
}

function setCurrentWad (/** @type {DFWad} */ newWad) {
  core.wad = newWad
  return true
}

function setCurrentWadFileName (/** @type {string} */ newWadName) {
  core.mapName = newWadName
  return true
}

function getCurrentWadFileName () {
  const currentWadName = core.mapName
  return currentWadName
}

function getCurrentRenderInstance () {
  const currentRender = core.render
  return currentRender
}

function getCurrentDatabaseInstance () {
  const currentDb = core.db
  return currentDb
}

export { coreFrom, getCameraWrapper, getCurrentMapAsJSON, getCurrentMap, setCurrentMap, setCurrentMapFromJSON, getRenderingOptions, getCurrentWad, getCurrentWadFileName, getCurrentRenderInstance, setCurrentWad, setCurrentWadFileName, getCurrentDatabaseInstance }
