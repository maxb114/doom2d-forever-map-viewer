import { DFAnimTextureParser } from './df-parser.mjs'
import { DfwadFrom } from './df-wad.mjs'
import { convertImage, cropImage } from './image.mjs'
import { convertResourcePath, getExtensionFromBuffer } from './utility.mjs'

function preloadWad (/** @type {DFWad} */ wad, /** @type {String} */ mapName, /** @type {Database} */ db) {
  const promises = []
  for (const file of wad.resources) {
    const type = getExtensionFromBuffer(file.buffer)
    if (type === 'unknown') continue // probably music
    if (type === 'dfwad' || type === 'dfzip') { // animated
      const promise = preloadAnimated(file, mapName, db)
      promises.push(promise)
    } else if (type === 'bmp' || type === 'gif' || type === 'jpg' || type === 'png' || type === 'psd' || type === 'tga') { // just an image
      const promise = new Promise((resolve, reject) => {
        const path = convertResourcePath(mapName + ':' + file.path)
        convertImage(file.buffer, type, 'png').then((buffer) => {
          db.saveByPath(buffer, path).then(() => resolve(true)).catch((/** @type {Error} */ error) => reject(error))
        }).catch((error) => reject(error))
      })
      promises.push(promise)
    }
  }
  return promises
}

function preloadAnimated (/** @type {Resource} */ file, /** @type {String} */ mapName, /** @type {Database} */ db) {
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
      if (textureResource === null) {
        reject(Error('File is a WAD, but not an animated texture!'))
        return false
      }
      const buffer = textureResource.buffer
      if (buffer === undefined) {
        reject(Error('File is a WAD, but not an animated texture!'))
        return false
      }
      const type = getExtensionFromBuffer(buffer)
      if (type === 'unknown' || type === 'dfpack' || type === 'dfwad' || type === 'dfzip') reject(Error('File is a WAD, but not an animated texture!'))
      convertImage(buffer, type, 'png').then((arrayBuffer) => {
        const view = new Uint8Array(arrayBuffer)
        cropImage(view, 'png', width, height).then((finalBuffer) => {
          db.saveByPath(finalBuffer, mapName + ':' + file.path).then(() => resolve(true)).catch((/** @type {Error} */ error) => reject(error))
        }).catch((error) => reject(error))
      }).catch((error) => reject(error))
    }).catch((error) => reject(error))
  })
  return promise
}

export { preloadWad }
