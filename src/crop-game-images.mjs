import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { cropImage } from './image.mjs'
import { getExtensionFromBuffer } from './utility.mjs'

async function cropIfNeeded (/** @type {any} */ element, /** @type {Uint8Array} */ buffer) {
  const sourceExtension = getExtensionFromBuffer(buffer)
  if (element instanceof DFMonster) {
    const width = element.monsterFrameObject.width
    const height = element.monsterFrameObject.height
    const cropped = await cropImage(buffer, sourceExtension, width, height)
    const view = new Uint8Array(cropped)
    return view
  } else if (element instanceof DFItem) {
    if (!element.special || element.frameObject === null) return buffer
    const width = element.frameObject.width
    const height = element.frameObject.height
    const cropped = await cropImage(buffer, sourceExtension, width, height)
    const view = new Uint8Array(cropped)
    return view
  } else if (element instanceof DFArea) {
    const flagNames = ['AREA_BLUEFLAG', 'AREA_REDFLAG', 'AREA_DOMFLAG']
    if (!flagNames.includes(element.type)) return buffer
    const width = 64
    const height = 64
    const cropped = await cropImage(buffer, sourceExtension, width, height)
    const view = new Uint8Array(cropped)
    return view
  } else {
    return buffer
  }
}

export { cropIfNeeded }
