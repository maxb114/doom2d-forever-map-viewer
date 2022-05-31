import { getExtensionFromBuffer, splitPath, wadToJSON } from './utility.mjs'
import { inflate } from './pako.esm.mjs'
import './jszip.js'
import { DFParser } from './df-parser.mjs'
import { DFMap } from './df-map.mjs'
import { convertImage } from './image.mjs'
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
  constructor (/** @type {Uint8Array} */ buffer) {
    this.buffer = buffer
    /** @type {Resource[]} */ this.files = []
    /** @type {WadStruct[]} */ this.structs = []
    /** @type {Resource[]} */ this._maps = []
    /** @type {Resource[]} */ this._resources = []
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
    for (const map of this.maps) {
      const parser = new DFParser(map.buffer)
      const parsed = new DFMap(parser.parsed, map.path)
      const text = parsed.asText()
      const view = text
      promises.push(this.saveToZip(zip, map.path, view))
    }
    for (const resource of this.resources) {
      const buffer = resource.buffer
      const type = getExtensionFromBuffer(buffer)
      const images = ['png', 'gif', 'psd', 'bmp', 'jpg', 'tga']
      if (images.includes(type)) {
        const promise = new Promise((resolve, reject) => {
          convertImage(buffer, type, 'png').then((arrayBuffer) => {
            const view = new Uint8Array(arrayBuffer)
            this.saveToZip(zip, resource.path, view).then(() => resolve(true)).catch((error) => reject(error))
          }).catch((error) => reject(error))
        })
        promises.push(promise)
      } else {
        const view = buffer
        promises.push(this.saveToZip(zip, resource.path, view))
      }
    }
    await Promise.all(promises)
    return zip
  }

  get maps () {
    return this._maps
  }

  get resources () {
    return this._resources
  }

  findResourceByPath (/** @type {String} */ path) {
    path = path.toLowerCase() // ignore case for now
    for (const file of this.files) {
      if (file.path === path) return file
    }
    return null
  }
}

function DfwadFrom (/** @type {Uint8Array} */ buffer) {
  const Dfwad = new DFWad(buffer)
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
