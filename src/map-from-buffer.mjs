import { DFMap } from './df-map.mjs'
import { DFParser } from './df-parser.mjs'
import { handleParsedMap } from './handle-parsed-map.mjs'

function DfMapFromBuffer (/** @type {Uint8Array} */ buffer, /** @type {string} */ mapName) {
  const parsed = new DFParser(buffer)
  const intermediateMap = parsed.parsed
  const handledMap = handleParsedMap(intermediateMap, mapName)
  const map = new DFMap(handledMap)
  return map
}

export { DfMapFromBuffer }
