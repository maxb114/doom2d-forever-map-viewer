import { DfwadFrom } from './df-wad.mjs'
import { DFAnimTextureParser, DFParser } from './df-parser.mjs'
import { DFMap } from './df-map.mjs'
import { DatabaseFrom } from './db.mjs'
import { DFRenderOptions } from './render.mjs'
import { getExtensionFromBuffer } from './utility.mjs'
import { convertImage, cropImage } from './image.mjs'
const input = document.createElement('input')
input.type = 'file'
let /** @type {Database | null} */ db = null
try {
  db = await DatabaseFrom()
} catch (error) {
  console.log(error)
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
    const deleteSelect = document.getElementById(selectId)
    if (deleteSelect !== null) document.body.removeChild(deleteSelect)
    const deleteButton = document.getElementById(buttonId)
    if (deleteButton !== null) document.body.removeChild(deleteButton)
    const deleteCacheButton = document.getElementById(cacheButtonId)
    if (deleteCacheButton !== null) document.body.removeChild(deleteCacheButton)
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    const view = new Uint8Array(content)
    const wad = await DfwadFrom(view)
    const maps = wad.maps
    if (maps.length === 0) return true
    const select = document.createElement('select')
    select.id = selectId
    document.body.appendChild(select)
    for (const map of maps) {
      const option = document.createElement('option')
      option.value = map.path
      option.text = map.path
      select.appendChild(option)
    }
    const button = document.createElement('button')
    button.innerHTML = 'Load map'
    button.id = 'load-button'
    button.onclick = function () {
      const value = select.value
      const resource = wad.findResourceByPath(value)
      if (resource === null) return false
      const parsed = new DFParser(resource.buffer)
      const map = new DFMap(parsed.parsed)
      return true
    }
    document.body.appendChild(button)
    const cacheButton = document.createElement('button')
    cacheButton.innerHTML = 'Save resources'
    cacheButton.id = 'cache-button'
    cacheButton.onclick = async function () {
      const /** @type {Promise<any>[]} */ promises = []
      for (const file of wad.resources) {
        const type = getExtensionFromBuffer(file.buffer)
        if (type === 'unknown') continue // probably music

        if (type === 'dfwad' || type === 'dfzip') { // animated
          const promise = new Promise((resolve, reject) => {
            const view = new Uint8Array(file.buffer)
            DfwadFrom(view).then((wad) => {
              const animPath = 'TEXT/ANIM'
              const animDescription = wad.findResourceByPath(animPath)
              if (animDescription === null) reject(Error('File is a WAD, but not an animated texture!'))
              const decoder = new TextDecoder('utf-8')
              const view = decoder.decode(animDescription?.buffer)
              const parser = new DFAnimTextureParser(view)
              const path = 'TEXTURES' + '/' + parser.parsed.resource
              const width = parser.parsed.frameWidth
              const height = parser.parsed.frameHeight
              const textureResource = wad.findResourceByPath(path)
              if (textureResource === null) reject(Error('File is a WAD, but not an animated texture!'))
              const buffer = textureResource.buffer
              const type = getExtensionFromBuffer(buffer)
              if (type === 'unknown' || type === 'dfpack' || type === 'dfwad' || type === 'dfzip') reject(Error('File is a WAD, but not an animated texture!'))
              convertImage(buffer, type, 'png').then((arrayBuffer) => {
                const view = new Uint8Array(arrayBuffer)
                cropImage(view, 'png', width, height).then((finalBuffer) => {
                  db.saveByPath(finalBuffer, file.path).then(() => resolve(true)).catch((error) => reject(error))
                }).catch((error) => reject(error))
              }).catch((error) => reject(error))
            }).catch((error) => reject(error))
          })
          promises.push(promise)
        } else if (type === 'bmp' || type === 'gif' || type === 'jpg' || type === 'png' || type === 'psd' || type === 'tga') { // just an image
          const promise = new Promise((resolve, reject) => {
            convertImage(file.buffer, type, 'png').then((buffer) => {
              db.saveByPath(buffer, file.path).then(() => resolve(true)).catch((error) => reject(error))
            }).catch((error) => reject(error))
          })
          promises.push(promise)
        }
      }
      await Promise.allSettled(promises)
      return true
    }
    document.body.appendChild(cacheButton)
    return true
  }
  return true
}

async function init () {
  if (window.indexedDB === null || db === null) {
    console.log('Your browser lacks the required features.')
    return false
  }
  document.body.appendChild(input)
  return true
}

init()
