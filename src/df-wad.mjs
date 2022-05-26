import { getExtensionFromBuffer, wadToJSON } from './utility.mjs'
import { inflate } from './pako.esm.mjs'
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
  constructor (/** @type {Uint8Array} */ buffer, /** @type {string} */ name) {
    this.buffer = buffer
    const type = getExtensionFromBuffer(buffer)
    if (type === 'dfwad') {
      const wadObject = wadToJSON(buffer)
      /** @type {WadStruct[]} */ this.structs = []
      for (const i in wadObject) {
        const obj = wadObject[i]
        if (obj === undefined) continue
        const structObject = new WadStruct(obj)
        this.structs.push(structObject)
      }
      /** @type {Resource[]} */ this.files = []
      for (const i in this.structs) {
        const struct = this.structs[i]
        if (struct === undefined) continue
        if (struct.type === '' || struct.type === 'parent') continue
        const structBuffer = buffer.slice(struct.memAddress, struct.memAddress + struct.memLength)
        const decompressed = inflate(structBuffer)
        if (decompressed === undefined || typeof decompressed === 'string') continue
        const resource = new Resource(decompressed, struct.parentSection + '/' + struct.name)
        this.files.push(resource)
      }
    } else if (type === 'dfzip') {
      // todo
    } else {
      // skip
    }
  }
}

export { DFWad }
