import { mapFromJson } from './map-from-json-parse.mjs'
import { arraysEqual } from './utility.mjs'

function mapsContentEqual (/** @type {any} */ firstMapObject, /** @type {any} */ secondMapObject) {
  const test = firstMapObject === secondMapObject
  const firstMap = mapFromJson(firstMapObject)
  const secondMap = mapFromJson(secondMapObject)
  const areas = arraysEqual(firstMap.areas, secondMap.areas)
  const items = arraysEqual(firstMap.items, secondMap.items)
  const monsters = arraysEqual(firstMap.monsters, secondMap.monsters)
  const panels = arraysEqual(firstMap.panels, secondMap.panels)
  const textures = arraysEqual(firstMap.textures, secondMap.textures)
  const triggers = arraysEqual(firstMap.triggers, secondMap.triggers)
  return test
}

export { mapsContentEqual }
