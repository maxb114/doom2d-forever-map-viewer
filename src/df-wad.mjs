import { getExtensionFromBuffer, wadToJSON } from './utility.mjs'
import { inflate } from './pako.esm.mjs'
import './jszip.js'
const Jszip = new JSZip()
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

class DFWad {
  constructor (/** @type {Uint8Array} */ buffer) {
    this.buffer = buffer
    /** @type {Resource[]} */ this.files = []
    /** @type {WadStruct[]} */ this.structs = []
  }
}

function DfwadFrom (/** @type {Uint8Array} */ buffer) {
  const Dfwad = new DFWad(buffer)
  const type = getExtensionFromBuffer(buffer)
  if (type === 'dfwad') {
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
      Dfwad.files.push(resource)
    }
    const /** @type {Promise<DFWad>} */ promise = new Promise((resolve) => {
      resolve(Dfwad)
    })
    return promise
  } else if (type === 'dfzip') {
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
              Dfwad.files.push(resource)
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
