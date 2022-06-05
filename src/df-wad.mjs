import { getExtensionFromBuffer, getFileNameWithoutExtension, splitPath, wadToJSON } from './utility.mjs'
import { inflate } from './pako.esm.mjs'
import './jszip.js'
import { DFParser } from './df-parser.mjs'
import { convertImage } from './image.mjs'
import { DFAnimTextureParser } from './df-animtexture-parser.mjs'
import { DfMapFromBuffer } from './map-from-buffer.mjs'
class WadStruct {
  constructor (/** @type {any} */ structObject) {
    if (structObject !== undefined) {
      this.memAddress = structObject.memAddress ?? 0
      this.memLength = structObject.memLength ?? 0
      this.name = structObject.name ?? ''
      this.parentSection = structObject.parentSection ?? ''
      this.type = structObject.type ?? ''
    }
  }
}

class Resource {
  constructor (/** @type {Uint8Array} */ buffer, /** @type {String} */ path) {
    this.buffer = buffer
    this.path = path
    this.path = this.path.toLowerCase() // paths are case insensitive?
  }
}

function isMap (/** @type {Uint8Array} */ buffer) {
  const parser = new DFParser(buffer)
  return parser.valid
}

class DFWad {
  constructor (/** @type {Uint8Array} */ buffer, /** @type {string} */ fileName = '') {
    this.buffer = buffer
    /** @type {Resource[]} */ this.files = []
    /** @type {WadStruct[]} */ this.structs = []
    /** @type {Resource[]} */ this._maps = []
    /** @type {Resource[]} */ this._resources = []
    this.fileName = fileName
  }

  addResource (/** @type Resource */ resource) {
    this.files.push(resource)
    if (isMap(resource.buffer)) this._maps.push(resource)
    else this._resources.push(resource)
  }

  async saveToZip (/** @type {any} */ zip, /** @type {string} */ fullPath, /** @type {any} */ value) {
    const paths = splitPath(fullPath)
    let folder = zip
    for (let i = 0; i < paths.length - 1; i++) {
      folder = await zip.folder(paths[i])
    }
    await folder.file(paths[paths.length - 1], value)
    return true
  }

  async saveAsZip () {
    const zip = new JSZip()
    const promises = []
    const /** @type {string[]} */ convertedImages = []
    const /** @type {string[]} */ convertedAnims = []
    for (const resource of this.resources) {
      const buffer = resource.buffer
      const type = getExtensionFromBuffer(buffer)
      const images = ['png', 'gif', 'psd', 'bmp', 'jpg', 'tga']
      if (images.includes(type)) {
        const promise = new Promise((resolve, reject) => {
          convertImage(buffer, type, 'png').then((arrayBuffer) => {
            const view = new Uint8Array(arrayBuffer)
            const extensionless = getFileNameWithoutExtension(resource.path)
            const newPath = extensionless + '.png'
            this.saveToZip(zip, newPath, view).then(() => {
              convertedImages.push(resource.path)
              resolve(true)
            }).catch((error) => reject(error))
          }).catch((error) => reject(error))
        })
        promises.push(promise)
      } else if (type === 'dfwad' || type === 'dfzip') { // animtexture?
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
            const newPath = getFileNameWithoutExtension(parser.parsed.resource) + '.png'
            const newFullPath = getFileNameWithoutExtension(path) + '.png'
            if (newFullPath === undefined || newPath === undefined) {
              reject(Error('Error converting animated texture!'))
              return false
            }
            parser.parsed.resource = newPath
            convertImage(buffer, filetype, 'png').then((arrayBuffer) => {
              const view = new Uint8Array(arrayBuffer)
              const animZip = new JSZip()
              const anim = this.saveToZip(animZip, animPath, parser.asText())
              const texture = this.saveToZip(animZip, newFullPath, view)
              Promise.all([anim, texture]).then(() => {
                animZip.generateAsync({
                  type: 'arrayBuffer'
                }).then((/** @type {ArrayBuffer} */ buffer) => {
                  const extensionless = getFileNameWithoutExtension(resource.path)
                  const newPath = extensionless + '.zip'
                  convertedAnims.push(resource.path)
                  const view = new Uint8Array(buffer)
                  this.saveToZip(zip, newPath, view).then(() => resolve(true)).catch((error) => reject(error))
                })
              }).catch((error) => {
                reject(error)
              })
            }).catch((error) => {
              reject(error)
            })
            return true
          }).catch((error) => {
            reject(error)
          })
        })
        promises.push(promise)
      } else {
        const view = buffer
        promises.push(this.saveToZip(zip, resource.path, view))
      }
    }
    await Promise.all(promises)
    const mapPromises = []
    for (const map of this.maps) {
      const dfmap = DfMapFromBuffer(map.buffer, this.fileName)
      for (const path of convertedImages) {
        const extensionless = getFileNameWithoutExtension(path)
        const newPath = this.fileName + ':' + extensionless + '.png'
        dfmap.changeTexturePath(this.fileName + ':' + path, newPath)
      }
      for (const path of convertedAnims) {
        const extensionless = getFileNameWithoutExtension(path)
        const newPath = this.fileName + ':' + extensionless + '.zip'
        dfmap.changeTexturePath(this.fileName + ':' + path, newPath)
      }
      const text = dfmap.asText()
      const view = text
      const newMapPath = getFileNameWithoutExtension(map.path) + '.txt'
      mapPromises.push(this.saveToZip(zip, newMapPath, view))
    }
    await Promise.all(mapPromises)
    return zip
  }

  get maps () {
    return this._maps
  }

  get resources () {
    return this._resources
  }

  findResourceByPath (/** @type {String} */ path, ignoreExtension = false) {
    path = path.toLowerCase() // ignore case for now
    for (const file of this.files) {
      if (ignoreExtension) {
        const extensionlessSource = getFileNameWithoutExtension(path)
        const extensionlessTarget = getFileNameWithoutExtension(file.path)
        if (extensionlessSource === extensionlessTarget) return file
      } else {
        if (path === file.path) return file
      }
    }
    return null
  }
}

function DfwadFrom (/** @type {Uint8Array} */ buffer, /** @type {string} */ name) {
  const Dfwad = new DFWad(buffer, name)
  const type = getExtensionFromBuffer(buffer)
  if (type === 'dfwad') {
    const /** @type {Promise<DFWad>} */ promise = new Promise((resolve) => {
      const wadObject = wadToJSON(buffer)
      for (const i in wadObject) {
        const obj = wadObject[i]
        if (obj === undefined) continue
        const structObject = new WadStruct(obj)
        Dfwad.structs.push(structObject)
      }
      for (const i in Dfwad.structs) {
        const struct = Dfwad.structs[i]
        if (struct === undefined) continue
        if (struct.type === '') continue
        const structBuffer = buffer.slice(struct.memAddress, struct.memAddress + struct.memLength)
        const decompressed = inflate(structBuffer)
        if (decompressed === undefined || typeof decompressed === 'string') continue
        const parent = struct.parentSection
        const resname = struct.name
        const resource = new Resource(decompressed, (parent === '' ? '' : parent + '/') + resname) // if empty, don't add slash
        Dfwad.addResource(resource)
      }
      resolve(Dfwad)
    })
    return promise
  } else if (type === 'dfzip') {
    const Jszip = new JSZip()
    const /** @type {Promise<DFWad>} */ promise = new Promise((resolve, reject) => {
      const /** @type {Promise<Resource>[]} */ promises = []
      Jszip.loadAsync(buffer).then((zip) => {
        for (const i in zip.files) {
          const file = zip.files[i]
          if (file === undefined || file.dir === true) continue
          const loadPromise = new Promise((resolve, reject) => {
            file.async('ArrayBuffer').then((/** @type {ArrayBuffer} */ content) => {
              const view = new Uint8Array(content)
              const resource = new Resource(view, file.name)
              Dfwad.addResource(resource)
              resolve(true)
            }).catch(() => {
              reject(Error('Failed to load file in ZIP!'))
            })
          })
          promises.push(loadPromise)
        }
        Promise.all(promises).then(() => {
          resolve(Dfwad)
        }).catch(() => {
          reject(Error('Failed to load file in ZIP!'))
        })
      }).catch(() => {
        reject(Error('Failed to load ZIP!'))
      })
    })
    return promise
  } else {
    // skip
  }
  const /** @type {Promise<DFWad>} */ promise = new Promise((resolve) => {
    resolve(Dfwad)
  })
  return promise
}

export { DFWad, DfwadFrom }
