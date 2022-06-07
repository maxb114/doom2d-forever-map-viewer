import { CameraWrapper } from './camera-wrapper.mjs'
import { DatabaseFrom } from './db.mjs'
import { Editor } from './editor.mjs'
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
    this.editor = new Editor(null, this.camera, this.options)
  }

  setCurrentMap (/** @type {DFMap} */ map) {
    core.currentMap = map
    this.editor.setCurrentMap(map)
  }

  handleClick (/** @type {number} */ x, /** @type {number} */ y) {
    this.editor.click(x, y)
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

function popHistory () {
  if (core.editor === null) return false
  core.editor.popHistory()
  return true
}

function handleMovementEnd () {
  if (core.editor === null) return false
  core.editor.movementEnd()
  return true
}

function setCurrentMap (/** @type {DFMap} */ map, freshStart = true) {
  core.currentMap = map
  core.editor.setCurrentMap(map, freshStart)
  return core.currentMap
}

function getCurrentMap () {
  const map = core.currentMap
  return map
}

function handleClick (/** @type {number} */ x, /** @type {number} */ y) {
  core.editor.click(x, y)
  return true
}

function handleMovement (/** @type {number} */ x, /** @type {number} */ y) {
  if (core.editor === null) return false
  core.editor.onMovement(x, y)
  return true
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

export { coreFrom, getCameraWrapper, getCurrentMap, setCurrentMap, getRenderingOptions, getCurrentWad, getCurrentWadFileName, getCurrentRenderInstance, setCurrentWad, setCurrentWadFileName, getCurrentDatabaseInstance, handleClick, handleMovement, popHistory, handleMovementEnd }
