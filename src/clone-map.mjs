import { mapFromJson } from './map-from-json-parse.mjs'

function cloneMap (/** @type {DFMap} */ map) {
  const json = JSON.stringify(map)
  const clone = mapFromJson(json)
  return clone
}

export { cloneMap }
