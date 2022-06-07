import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { DFTrigger } from './df-trigger.mjs'

function cloneElement (/** @type {(DFArea|DFItem|DFMonster|DFPanel|DFTrigger)} */ element) {
  if (element instanceof DFArea) {
    const area = new DFArea(element.pos.x, element.pos.y, element.type, element.direction, undefined)
    area.id = element.id
    area.editorPath = element.editorPath
    return area
  } else if (element instanceof DFItem) {
    const item = new DFItem(element.pos.x, element.pos.y, element.type, element.options, undefined)
    item.id = element.id
    item.editorPath = element.editorPath
    item.specialOptions = element.specialOptions
    return item
  } else if (element instanceof DFMonster) {
    const monster = new DFMonster(element.pos.x, element.pos.y, element.type, element.direction, undefined)
    monster.id = element.id
    monster.editorPath = element.editorPath
    monster.specialOptions = element.specialOptions
    return monster
  } else if (element instanceof DFPanel) {
    const platformOptions = {
      moveSpeed: element.moveSpeed,
      sizeSpeed: element.sizeSpeed,
      moveStart: element.moveStart,
      moveEnd: element.moveEnd,
      sizeEnd: element.sizeEnd,
      moveActive: element.moveActive,
      moveOnce: element.moveOnce,
      endPosTrigger: element.endPosTrigger,
      endSizeTrigger: element.endSizeTrigger
    }
    const panel = new DFPanel(element.pos.x, element.pos.y, element.size.width, element.size.height, element.texture, element.type, element.alpha, element.flags, platformOptions, element.texturePath, element.blending, undefined)
    panel.id = element.id
    panel.editorPath = element.editorPath
    panel.specialOptions = element.specialOptions
    return panel
  } else if (element instanceof DFTexture) {
    const texture = new DFTexture(element.path, element.animated)
    texture.id = element.id
    texture.editorPath = element.editorPath
    return texture
  } else if (element instanceof DFTrigger) {
    // const triggerData = JSON.stringify(element.options)
    const trigger = new DFTrigger(element.pos.x, element.pos.y, element.size.width, element.size.height, element.enabled, element.texturePanel, element.type, element.activateType, element.key, undefined)
    trigger.options = element.options
    trigger.id = element.id
    trigger.editorPath = element.editorPath
    return trigger
  }
  return null
}

export { cloneElement }
