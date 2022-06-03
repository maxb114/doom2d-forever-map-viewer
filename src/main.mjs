import { DfwadFrom } from './df-wad.mjs'
import { DFParser } from './df-parser.mjs'
import { DFMap } from './df-map.mjs'
import { DatabaseFrom } from './db.mjs'
import { DFRender, DFRenderOptions } from './render.mjs'
import { mapForRender } from './prepare-map-for-render.mjs'
import { preloadWad } from './save-to-db.mjs'
import { handleParsedMap } from './handle-parsed-map.mjs'
const div = document.createElement('div')
const canvas = document.createElement('canvas')
const input = document.createElement('input')
input.type = 'file'
let /** @type {Database | null} */ db = null
try {
  db = await DatabaseFrom()
} catch (error) {
  window.alert(error)
}
input.onchange = function () {
  if (input === null || input.files === null) return false
  const file = input.files[0]
  if (file === undefined) return false
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async function (event) {
    const mapName = file.name.toLowerCase() // lower case for now
    const selectId = 'map-select'
    const buttonId = 'load-button'
    const cacheButtonId = 'cache-button'
    const flagsDivId = 'flags'
    const zipButtonId = 'zip-button'
    const deleteArray = [selectId, buttonId, cacheButtonId, flagsDivId, zipButtonId]
    for (const elementid of deleteArray) {
      const deleteElement = document.getElementById(elementid)
      if (deleteElement !== null) {
        deleteElement.innerHTML = ''
        div.removeChild(deleteElement)
      }
    }
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    const view = new Uint8Array(content)
    const wad = await DfwadFrom(view)
    const cacheButton = document.createElement('button')
    cacheButton.innerHTML = 'Save resources'
    cacheButton.id = 'cache-button'
    cacheButton.onclick = async function () {
      const promises = preloadWad(wad, mapName, db)
      await Promise.allSettled(promises)
      return true
    }
    div.appendChild(cacheButton)
    const zipButton = document.createElement('button')
    zipButton.innerHTML = 'Convert to .dfz and .txt'
    zipButton.id = zipButtonId
    zipButton.onclick = async function () {
      const zip = await wad.saveAsZip()
      const blob = await zip.generateAsync({ type: 'blob' })
      download(blob, 'convert-' + file.name.toLowerCase())
    }
    div.appendChild(zipButton)
    const maps = wad.maps.sort((a, b) => a.path.localeCompare(b.path))
    if (maps.length === 0) return true
    const select = document.createElement('select')
    select.id = selectId
    div.appendChild(select)
    for (const map of maps) {
      const option = document.createElement('option')
      option.value = map.path
      option.text = map.path
      select.appendChild(option)
    }
    const button = document.createElement('button')
    button.innerHTML = 'Load map'
    button.id = 'load-button'
    button.onclick = () => {
      const deleteFlagsDiv = document.getElementById(flagsDivId)
      if (deleteFlagsDiv !== null) {
        deleteFlagsDiv.innerHTML = ''
        div.removeChild(deleteFlagsDiv)
      }
      const context = canvas.getContext('2d')
      if (context === null) return false
      const value = select.value
      const resource = wad.findResourceByPath(value)
      if (resource === null) return false
      const parsed = new DFParser(resource.buffer)
      const intermediateMap = parsed.parsed
      const handledMap = handleParsedMap(intermediateMap, mapName)
      const map = new DFMap(handledMap)
      console.log(map)
      console.log(map.asText())
      const options = new DFRenderOptions()
      const render = new DFRender()
      const flagsDiv = document.createElement('div')
      flagsDiv.id = flagsDivId
      const allOptions = options.all
      for (const renderOption of allOptions) {
        const object = renderOption[0]
        const set = renderOption[1]
        const input = document.createElement('input')
        input.type = 'checkbox'
        input.name = object.id
        input.id = object.id
        input.value = ''
        input.checked = set
        const label = document.createElement('label')
        label.htmlFor = input.id
        label.appendChild(document.createTextNode(object.full))
        input.onchange = () => {
          options.setFlag(input.id, input.checked)
          draw1(canvas, context, map, render, options)
        }
        flagsDiv.appendChild(input)
        flagsDiv.appendChild(label)
      }
      div.appendChild(flagsDiv)
      draw1(canvas, context, map, render, options)
      return true
    }
    div.appendChild(button)
    return true
  }
  return true
}

function download (/** @type {Blob} */ blob, /** @type {string} */ name) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
}

async function draw1 (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context, /** @type {DFMap} */ map, /** @type {DFRender} */ render, /** @type {DFRenderOptions} */ options) {
  const mapView = mapForRender(map, options)
  const allElements = map.allElements
  const sky = map.sky
  const prefix = map.fileName
  await render.preload(allElements, db, sky, prefix)
  const width = map.size.x
  const height = map.size.y
  const mapCanvas = await render.render1(mapView, width, height)
  canvas.width = map.size.x
  canvas.height = map.size.y
  context.drawImage(mapCanvas, 0, 0)
  return true
}

const resources = ['game.wad', 'standart.wad', 'shrshade.wad', 'editor.wad']

async function checkEssentialResources () {
  try {
    const all = await db.getAll()
    for (const resource of resources) {
      if (!all.some((/** @type {string} */ element) => element.includes(resource))) return false
    }
    return true
  } catch (e) {
    return false
  }
}

async function init () {
  if (window.indexedDB === null || db === null || canvas === null || input === null || div === null) {
    window.alert('Your browser lacks the required features.')
    return false
  }
  const check = await checkEssentialResources()
  if (check) {
    div.appendChild(input)
    document.body.appendChild(div)
    document.body.appendChild(canvas)
  } else {
    const text = document.createTextNode('Doom 2D: Forever resources have not been found!')
    const br = document.createElement('br')
    const button = document.createElement('button')
    button.innerHTML = 'Download game resources from doom2d.org'
    button.id = 'download-button'
    button.onclick = async () => {
      const baseLink = 'https://doom2d.org/doom2d_forever/mapview/'
      // const baseLink = './assets/'
      for (const resource of resources) {
        const link = baseLink + resource
        try {
          const response = await fetch(link)
          const buffer = await response.arrayBuffer()
          const view = new Uint8Array(buffer)
          const wad = await DfwadFrom(view)
          await Promise.all(preloadWad(wad, resource, db))
        } catch (error) {
          window.alert(error)
          return false
        }
      }
      document.body.removeChild(text)
      document.body.removeChild(br)
      document.body.removeChild(button)
      div.appendChild(input)
      document.body.appendChild(div)
      document.body.appendChild(canvas)
      return true
    }
    document.body.appendChild(text)
    document.body.appendChild(br)
    document.body.appendChild(button)
  }
  return true
}

init()
