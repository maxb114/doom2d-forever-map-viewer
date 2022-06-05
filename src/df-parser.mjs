import { DFBinaryParser } from './df-binarymap-parser.mjs'
import { DFTextParser } from './df-textmap-parser.mjs'
import { numberToChar } from './utility.mjs'

class DFParser {
  constructor (/** @type {Uint8Array} */ buffer, checkValid = false) {
    this.type = 'unknown'
    this.valid = false
    this.buffer = buffer
    if (buffer[0] === undefined || buffer[1] === undefined || buffer[2] === undefined || buffer[3] === undefined) {
      return
    }
    const isBinary = (numberToChar(buffer[0]) === 'M' && numberToChar(buffer[1]) === 'A' && numberToChar(buffer[2]) === 'P' && buffer[3] === 1)
    if (isBinary) {
      const parsed = new DFBinaryParser(buffer)
      this.parsed = parsed
      this.valid = true
      this.type = 'binary'
    } else { // text map
      const decoder = new TextDecoder('utf-8')
      const view = decoder.decode(buffer)
      const onlyPrintable = /^[ -~\t\n\r\u0400-\u04FF]+$/.test(view)
      if (!onlyPrintable) {
        return
      }
      if (checkValid) return
      const parsed = new DFTextParser(view)
      if (parsed.valid !== true) {
        return
      } else this.valid = true
      this.type = 'text'
      if (parsed.mapObject.map === undefined) parsed.mapObject.map = {} // we don't know what may happen
      this.parsed = parsed.mapObject.map
    }
  }
}

export { DFParser }
