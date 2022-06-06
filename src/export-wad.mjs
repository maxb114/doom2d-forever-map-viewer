import { DFAnimTextureParser } from './df-animtexture-parser.mjs'
import { DfwadFrom } from './df-wad.mjs'
import { convertImage } from './image.mjs'
import { convertedResourcePathToGame, convertResourcePath, getExtensionFromBuffer, getFileNameWithoutExtension, isExternalResource, splitPath } from './utility.mjs'
import './jszip.js'
import { DfMapFromBuffer } from './map-from-buffer.mjs'

async function saveToZip (/** @type {any} */ zip, /** @type {string} */ fullPath, /** @type {any} */ value) {
  const paths = splitPath(fullPath)
  let folder = zip
  for (let i = 0; i < paths.length - 1; i++) {
    folder = await zip.folder(paths[i])
  }
  await folder.file(paths[paths.length - 1], value)
  return true
}

function saveImageToZip (/** @type {Uint8Array} */ buffer, /** @type {String} */ type, /** @type {string} */ targetExtension, /** @type {string} */ path, /** @type {any} */ zip) {
  const promise = new Promise((resolve, reject) => {
    convertImage(buffer, type, targetExtension).then((arrayBuffer) => {
      const view = new Uint8Array(arrayBuffer)
      const extensionless = getFileNameWithoutExtension(path)
      const newPath = extensionless + '.' + targetExtension
      saveToZip(zip, newPath, view).then(() => {
        resolve(true)
      }).catch((/** @type {Error} */ error) => reject(error))
    }).catch((error) => reject(error))
  })
  return promise
}

function saveAnimatedTextureToZip (/** @type {Uint8Array} */ buffer, /** @type {string} */ targetExtension, /** @type {string} */ resourcePath, /** @type {any} */ zip) {
  const promise = new Promise((resolve, reject) => {
    DfwadFrom(buffer).then((dfwad) => {
      const animPath = 'TEXT/ANIM'
      const animDescription = dfwad.findResourceByPath(animPath, true)
      if (animDescription === null) {
        reject(Error('File is a WAD, but not an animated texture!'))
        return false
      }
      const decoder = new TextDecoder('utf-8')
      const animView = decoder.decode(animDescription?.buffer)
      const parser = new DFAnimTextureParser(animView)
      const path = 'TEXTURES' + '/' + parser.parsed.resource
      const textureResource = dfwad.findResourceByPath(path, true)
      if (textureResource === null) {
        reject(Error('File is a WAD, but not an animated texture!'))
        return false
      }
      const buffer = textureResource.buffer
      const filetype = getExtensionFromBuffer(buffer)
      if (filetype === 'unknown') {
        reject(Error('Unknown image format!'))
        return false
      }
      const newPath = getFileNameWithoutExtension(parser.parsed.resource) + '.' + targetExtension
      const newFullPath = getFileNameWithoutExtension(path) + '.' + targetExtension
      if (newFullPath === undefined || newPath === undefined) {
        reject(Error('Error converting animated texture!'))
        return false
      }
      parser.parsed.resource = newPath
      const animZip = new JSZip()
      const imagePromise = saveImageToZip(buffer, filetype, targetExtension, newFullPath, animZip)
      const descriptionPromise = saveToZip(animZip, animPath, parser.asText())
      Promise.all([imagePromise, descriptionPromise]).then(() => {
        animZip.generateAsync({
          type: 'arrayBuffer'
        }).then((/** @type {ArrayBuffer} */ buffer) => {
          const extensionless = getFileNameWithoutExtension(resourcePath)
          const newPath = extensionless + '.zip'
          const view = new Uint8Array(buffer)
          saveToZip(zip, newPath, view).then(() => resolve(true)).catch((error) => reject(error))
        })
      })
    }).catch((error) => {
      reject(error)
    })
  })
  return promise
}

function saveResourceFromExternalWad (/** @type {string} */ resourcePath, /** @type {Database} */ db, /** @type {any} */ zip, /** @type {string} */ targetExtension) {
  const promise = new Promise((resolve, reject) => {
    const path = convertResourcePath(resourcePath)
    db.loadByPath(path).then((/** @type {ArrayBuffer} */ arrayBuffer) => {
      const view = new Uint8Array(arrayBuffer)
      const type = getExtensionFromBuffer(view)
      const split = path.split(':')
      const withoutSource = split.pop()
      if (withoutSource === undefined) {
        reject(Error('Error converting resource from external WAD!'))
        return false
      }
      const newPath = getFileNameWithoutExtension(withoutSource) + '.' + targetExtension
      const imageTypes = ['png', 'gif', 'psd', 'bmp', 'jpg', 'tga']
      if (imageTypes.includes(type)) {
        saveImageToZip(view, type, targetExtension, newPath, zip).then(() => {
          resolve(true)
        }).catch((/** @type {Error} */ error) => reject(error))
      } else {
        saveToZip(zip, withoutSource, view).then(() => {
          resolve(true)
        }).catch((/** @type {Error} */ error) => reject(error))
      }
    }).catch((/** @type {Error} */ error) => reject(error))
  })
  return promise
}

async function saveAsZip (/** @type {DFWad} */ wad, /** @type {Database | undefined} */ db) {
  const zip = new JSZip()
  const promises = []
  const /** @type {string[]} */ convertedImages = []
  const /** @type {string[]} */ convertedAnims = []
  for (const resource of wad.resources) {
    const buffer = resource.buffer
    const type = getExtensionFromBuffer(buffer)
    const images = ['png', 'gif', 'psd', 'bmp', 'jpg', 'tga']
    if (images.includes(type)) {
      const promise = saveImageToZip(buffer, type, 'png', resource.path, zip)
      convertedImages.push(resource.path)
      promises.push(promise)
    } else if (type === 'dfwad' || type === 'dfzip') { // animtexture?
      const promise = saveAnimatedTextureToZip(buffer, 'png', resource.path, zip)
      convertedAnims.push(resource.path)
      promises.push(promise)
    } else {
      const view = buffer
      promises.push(saveToZip(zip, resource.path, view))
    }
  }
  await Promise.all(promises)
  const mapPromises = []
  for (const map of wad.maps) {
    const dfmap = DfMapFromBuffer(map.buffer, map.path)
    for (const path of convertedImages) {
      const extensionless = getFileNameWithoutExtension(path)
      const newPath = wad.fileName + ':' + extensionless + '.png'
      dfmap.changeTexturePath(wad.fileName + ':' + path, newPath)
    }
    for (const path of convertedAnims) {
      const extensionless = getFileNameWithoutExtension(path)
      const newPath = wad.fileName + ':' + extensionless + '.zip'
      dfmap.changeTexturePath(wad.fileName + ':' + path, newPath)
    }
    if (db !== undefined) {
      const /** @type {Promise<any>[]} */ externalPromises = []
      const externalWadTextures = dfmap.textures.map(texture => texture.editorPath).filter((/** @type {string} */ value) => {
        return isExternalResource(value)
      })
      for (const i in externalWadTextures) {
        const texturePath = externalWadTextures[i]
        const promise = new Promise((resolve, reject) => {
          const path = convertResourcePath(texturePath)
          const split = path.split(':')
          const withoutSource = split.pop()
          if (withoutSource === undefined) {
            reject(Error('Error converting resource from external WAD!'))
            return false
          }
          db.loadByPath(path).then((arrayBuffer) => {
            const view = new Uint8Array(arrayBuffer)
            const type = getExtensionFromBuffer(view)
            const images = ['png', 'gif', 'psd', 'bmp', 'jpg', 'tga']
            if (images.includes(type)) {
              db.loadByPath(':' + 'info' + ':' + path).then((/** @type {string | null | undefined} */ anim) => {
                if (anim === null || anim === undefined) { // just an image
                  saveToZip(zip, getFileNameWithoutExtension(withoutSource) + '.' + 'png', view).then(() => {
                    const converted = convertedResourcePathToGame(':' + getFileNameWithoutExtension(withoutSource) + '.' + 'png')
                    if (converted === null) {
                      reject(Error('Error loading image from external WAD!'))
                      return false
                    }
                    dfmap.changeTexturePath(texturePath, converted)
                    resolve(true)
                  }).catch((/** @type {Error} */ error) => reject(error))
                } else {
                  db.loadByPath(':' + 'full' + ':' + path).then((arrayBuffer) => {
                    const view = new Uint8Array(arrayBuffer)
                    const targetExtension = 'zip'
                    const animZip = new JSZip()
                    const parser = new DFAnimTextureParser(anim)
                    const newPath = getFileNameWithoutExtension(parser.parsed.resource) + '.' + 'png'
                    const newFullPath = getFileNameWithoutExtension(withoutSource) + '.' + 'zip'
                    const imagePromise = saveImageToZip(view, type, 'png', 'TEXTURES' + '/' + newPath, animZip)
                    const animPromise = saveToZip(animZip, 'TEXT/ANIM', anim)
                    const converted = convertedResourcePathToGame(':' + newFullPath)
                    if (converted === null) {
                      reject(Error('Error converting animated texture from external WAD!'))
                      return false
                    }
                    Promise.all([imagePromise, animPromise]).then(() => {
                      animZip.generateAsync({ type: 'arrayBuffer' }).then((arrayBuffer) => {
                        const view = new Uint8Array(arrayBuffer)
                        saveToZip(zip, newFullPath, view).then(() => {
                          dfmap.changeTexturePath(path, ':' + newFullPath)
                          resolve(true)
                        }).catch((/** @type {Error} */ error) => reject(error))
                      }).catch((/** @type {Error} */ error) => reject(error))
                    }).catch((/** @type {Error} */ error) => reject(error))
                  }).catch((/** @type {Error} */ error) => reject(error))
                }
              }).catch((/** @type {Error} */ error) => reject(error))
            }
          }).catch((/** @type {Error} */ error) => reject(error))
        })
        externalPromises.push(promise)
      }
      const sky = dfmap.sky
      const isExternalSky = isExternalResource(sky)
      if (isExternalSky === true) {
        const skyPromise = new Promise((resolve, reject) => {
          saveResourceFromExternalWad(sky, db, zip, 'png').then(() => {
            const path = convertResourcePath(sky)
            const split = path.split(':')
            const withoutSource = split.pop()
            if (withoutSource === undefined) {
              reject(Error('Error converting sky from external WAD!'))
              return false
            }
            const newPath = getFileNameWithoutExtension(withoutSource) + '.' + 'png'
            dfmap.sky = ':' + newPath
            resolve(true)
          }).catch((/** @type {Error} */ error) => reject(error))
        })
        externalPromises.push(skyPromise)
      }
      const music = dfmap.music
      const isExternalMusic = isExternalResource(music)
      if (isExternalMusic === true) {
        const musicPromise = new Promise((resolve, reject) => {
          saveResourceFromExternalWad(music, db, zip, '').then(() => {
            const path = convertResourcePath(music)
            const split = path.split(':')
            const withoutSource = split.pop()
            if (withoutSource === undefined) {
              reject(Error('Error converting sky from external WAD!'))
              return false
            }
            const newPath = withoutSource
            dfmap.music = ':' + newPath
            resolve(true)
          }).catch((/** @type {Error} */ error) => reject(error))
        })
        externalPromises.push(musicPromise)
      }
      await Promise.all(externalPromises)
    }
    const text = dfmap.asText()
    const view = text
    const newMapPath = getFileNameWithoutExtension(map.path) + '.txt'
    mapPromises.push(saveToZip(zip, newMapPath, view))
  }
  await Promise.all(mapPromises)
  return zip
}

export { saveAsZip }
