import { DfwadFrom } from './df-wad.mjs'
import { DFAnimTextureParser, DFParser } from './df-parser.mjs'
import { DFMap } from './df-map.mjs'
import { DatabaseFrom } from './db.mjs'
import { DFRender, DFRenderOptions } from './render.mjs'
import { getExtensionFromBuffer } from './utility.mjs'
import { convertImage, cropImage } from './image.mjs'
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
    const selectId = 'map-select'
    const buttonId = 'load-button'
    const cacheButtonId = 'cache-button'
    const flagsDivId = 'flags'
    const deleteSelect = document.getElementById(selectId)
    if (deleteSelect !== null) div.removeChild(deleteSelect)
    const deleteButton = document.getElementById(buttonId)
    if (deleteButton !== null) div.removeChild(deleteButton)
    const deleteCacheButton = document.getElementById(cacheButtonId)
    if (deleteCacheButton !== null) div.removeChild(deleteCacheButton)
    const deleteFlagsDiv = document.getElementById(flagsDivId)
    if (deleteFlagsDiv !== null) {
      deleteFlagsDiv.innerHTML = ''
      div.removeChild(deleteFlagsDiv)
    }
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    const view = new Uint8Array(content)
    const wad = await DfwadFrom(view)
    const maps = wad.maps
    const cacheButton = document.createElement('button')
    cacheButton.innerHTML = 'Save resources'
    cacheButton.id = 'cache-button'
    cacheButton.onclick = async function () {
      const mapName = file.name.toLowerCase() // lower case for now
      const promises = preloadWad(wad, mapName)
      await Promise.allSettled(promises)
      return true
    }
    div.appendChild(cacheButton)
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
      const map = new DFMap(parsed.parsed, file.name)
      const options = new DFRenderOptions()
      const render = new DFRender(map, options, db)
      const flagsDiv = document.createElement('div')
      flagsDiv.id = flagsDivId
      const allOptions = render.options?.all || []
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
          render.options?.setFlag(input.id, input.checked)
          draw(canvas, context, map, render)
        }
        flagsDiv.appendChild(input)
        flagsDiv.appendChild(label)
      }
      div.appendChild(flagsDiv)
      draw(canvas, context, map, render)
      return true
    }
    div.appendChild(button)
    return true
  }
  return true
}

async function draw (/** @type {HTMLCanvasElement} */ canvas, /** @type {CanvasRenderingContext2D} */ context, /** @type {DFMap} */ map, /** @type {DFRender} */ render) {
  await render.preload()
  const mapCanvas = await render.render()
  canvas.width = map.size.x
  canvas.height = map.size.y
  context.drawImage(mapCanvas, 0, 0)
  return true
}

function preloadWad (/** @type {DFWad} */ wad, /** @type {String} */ mapName) {
  const promises = []
  for (const file of wad.resources) {
    const type = getExtensionFromBuffer(file.buffer)
    if (type === 'unknown') continue // probably music
    if (type === 'dfwad' || type === 'dfzip') { // animated
      const promise = preloadAnimated(file, mapName)
      promises.push(promise)
    } else if (type === 'bmp' || type === 'gif' || type === 'jpg' || type === 'png' || type === 'psd' || type === 'tga') { // just an image
      const promise = new Promise((resolve, reject) => {
        convertImage(file.buffer, type, 'png').then((buffer) => {
          db.saveByPath(buffer, mapName + ':' + file.path).then(() => resolve(true)).catch((error) => reject(error))
        }).catch((error) => reject(error))
      })
      promises.push(promise)
    }
  }
  return promises
}

function preloadAnimated (/** @type {Resource} */ file, /** @type {String} */ mapName) {
  const promise = new Promise((resolve, reject) => {
    const view = file.buffer
    DfwadFrom(view).then((dfwad) => {
      const animPath = 'TEXT/ANIM'
      const animDescription = dfwad.findResourceByPath(animPath)
      if (animDescription === null) reject(Error('File is a WAD, but not an animated texture!'))
      const decoder = new TextDecoder('utf-8')
      const view = decoder.decode(animDescription?.buffer)
      const parser = new DFAnimTextureParser(view)
      const path = 'TEXTURES' + '/' + parser.parsed.resource
      const width = parser.parsed.frameWidth
      const height = parser.parsed.frameHeight
      const textureResource = dfwad.findResourceByPath(path)
      if (textureResource === null) reject(Error('File is a WAD, but not an animated texture!'))
      const buffer = textureResource.buffer
      const type = getExtensionFromBuffer(buffer)
      if (type === 'unknown' || type === 'dfpack' || type === 'dfwad' || type === 'dfzip') reject(Error('File is a WAD, but not an animated texture!'))
      convertImage(buffer, type, 'png').then((arrayBuffer) => {
        const view = new Uint8Array(arrayBuffer)
        cropImage(view, 'png', width, height).then((finalBuffer) => {
          db.saveByPath(finalBuffer, mapName + ':' + file.path).then(() => resolve(true)).catch((error) => reject(error))
        }).catch((error) => reject(error))
      }).catch((error) => reject(error))
    }).catch((error) => reject(error))
  })
  return promise
}

const resources = ['game.wad', 'standart.wad', 'shrshade.wad', 'editor.wad']

async function checkEssentialResources() {
  try {
    const all = await db.getAll()
    for (const resource of resources) {
      if (!all.some(element => element.includes(resource))) return false
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
    // show preload resources
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
          await Promise.all(preloadWad(wad, resource))
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
