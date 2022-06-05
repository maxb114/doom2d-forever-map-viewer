import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { DFTrigger } from './df-trigger.mjs'
import { parse2Ints, convertResourcePath } from './utility.mjs'

function handleParsedMap (/** @type {any} */ map, /** @type {string} */ mapFile) {
  const /** @type {DFTexture[]} */ textures = []
  const /** @type {DFPanel[]} */ panels = []
  const /** @type {DFArea[]} */ areas = []
  const /** @type {DFItem[]} */ items = []
  const /** @type {DFMonster[]} */ monsters = []
  const /** @type {DFTrigger[]} */ triggers = []
  let width = 0
  let height = 0
  let name = ''
  let author = ''
  let description = ''
  let music = ''
  let sky = ''
  const prefix = mapFile
  for (const i in map) {
    const element = map[i]
    if (element === undefined) continue
    if (i === 'name') name = element
    else if (i === 'author') author = element
    else if (i === 'description') description = element
    else if (i === 'music') music = element
    else if (i === 'sky') sky = element
    else if (i === 'size') {
      const numbers = parse2Ints(element)
      if (numbers === null || numbers[0] === undefined || numbers[1] === undefined) {
        throw Error('Invalid map size!')
      }
      width = numbers[0]
      height = numbers[1]
    } else {
      if (element._hint === undefined) continue
      if (element._hint === 'texture') {
        let animatedValue = element.animated
        if (animatedValue === undefined || animatedValue === null) animatedValue = 'false'
        const animated = /true/i.test(animatedValue)
        let pathValue = element.path
        if (pathValue === undefined || pathValue === null) pathValue = ''
        const path = pathValue
        const texture = new DFTexture(path, animated)
        texture.id = element._token.value
        texture.editorPath = convertResourcePath(path, prefix)
        textures.push(texture)
      } else if (element._hint === 'panel') {
        let positionValue = element.position
        if (positionValue === undefined || positionValue === null) positionValue = '0,0'
        const position = parse2Ints(positionValue)
        if (position == null || position[0] === undefined || position[1] === undefined) {
          throw Error('Invalid panel position!')
        }
        const x = position[0]
        const y = position[1]
        let sizeValue = element.size
        if (sizeValue === undefined || sizeValue === null) sizeValue = '0,0'
        const size = parse2Ints(sizeValue)
        if (size === null || size[0] === undefined || size[1] === undefined) continue
        const width = size[0]
        const height = size[1]
        let textureValue = element.texture
        if (textureValue === undefined || textureValue === null) textureValue = ''
        const textureId = textureValue
        let typeValue = element.type
        if (typeValue === undefined || typeValue === '') typeValue = 'PANEL_NONE'
        const type = typeValue.replace(/\s+/g, '').split('|')
        let alphaValue = element.alpha
        if (alphaValue === undefined || alphaValue === null || alphaValue > 255 || alphaValue < -1) alphaValue = -1
        const alpha = alphaValue
        let flagsValue = element.flags
        if (flagsValue === null || flagsValue === undefined || flagsValue === '') flagsValue = 'PANEL_FLAG_NONE'
        const flags = flagsValue.replace(/\s+/g, '').split('|')
        const blending = flags.includes('PANEL_FLAG_BLENDING')
        let moveSpeedValue = element.move_speed
        if (moveSpeedValue === undefined || moveSpeedValue === '') moveSpeedValue = '0,0'
        const moveSpeed = parse2Ints(moveSpeedValue)
        if (moveSpeed === null || moveSpeed[0] === undefined || moveSpeed[1] === undefined) continue
        let sizeSpeedValue = element.size_speed
        if (sizeSpeedValue === undefined || sizeSpeedValue === '') sizeSpeedValue = '0,0'
        const sizeSpeed = parse2Ints(sizeSpeedValue)
        if (sizeSpeed === null || sizeSpeed[0] === undefined || sizeSpeed[1] === undefined) continue
        let moveStartValue = element.move_start
        if (moveStartValue === undefined || moveStartValue === '') moveStartValue = '0,0'
        const moveStart = parse2Ints(moveStartValue)
        if (moveStart === null || moveStart[0] === undefined || moveStart[1] === undefined) continue
        let moveEndValue = element.move_end
        if (moveEndValue === undefined || moveEndValue === '') moveEndValue = '0,0'
        const moveEnd = parse2Ints(moveEndValue)
        if (moveEnd === null || moveEnd[0] === undefined || moveEnd[1] === undefined) continue
        let sizeEndValue = element.size_end
        if (sizeEndValue === undefined || sizeEndValue === '') sizeEndValue = '0,0'
        const sizeEnd = parse2Ints(sizeEndValue)
        if (sizeEnd === null || sizeEnd[0] === undefined || sizeEnd[1] === undefined) continue
        let moveActiveValue = element.move_active
        if (moveActiveValue === undefined || moveActiveValue === null) moveActiveValue = 'false'
        const moveActive = /true/i.test(moveActiveValue)
        let moveOnceValue = element.move_once
        if (moveOnceValue === undefined || moveOnceValue === null) moveOnceValue = 'false'
        const moveOnce = /true/i.test(moveOnceValue)
        let endPosTriggerValue = element.end_pos_trigger
        if (endPosTriggerValue === undefined || endPosTriggerValue === null) endPosTriggerValue = null
        const endPosTrigger = endPosTriggerValue
        let endSizeTriggerValue = element.end_size_trigger
        if (endSizeTriggerValue === undefined || endSizeTriggerValue === null) endSizeTriggerValue = null
        const endSizeTrigger = endSizeTriggerValue
        const platformOptions = {
          moveSpeed,
          sizeSpeed,
          moveStart,
          moveEnd,
          sizeEnd,
          moveActive,
          moveOnce,
          endPosTrigger,
          endSizeTrigger
        }
        const panel = new DFPanel(x, y, width, height, textureId, type, alpha, flags, platformOptions, undefined, blending, undefined)
        // we map textures to panels later
        panel.id = element._token.value
        panels.push(panel)
      } else if (element._hint === 'monster') {
        let positionValue = element.position
        if (positionValue === undefined || positionValue === null) positionValue = '0,0'
        const position = parse2Ints(positionValue)
        if (position == null || position[0] === undefined || position[1] === undefined) {
          throw Error('Invalid monster position!')
        }
        const x = position[0]
        const y = position[1]
        let typeValue = element.type
        if (typeValue === null || typeValue === undefined || typeValue === '') typeValue = 'MONSTER_NONE'
        const type = typeValue
        let directionValue = element.direction
        if (directionValue === undefined || directionValue === null || directionValue === '') directionValue = 'DIR_LEFT'
        const direction = directionValue
        const monster = new DFMonster(x, y, type, direction)
        monster.id = element._token.value
        monster.editorPath = convertResourcePath((monster.getResourcePath() ?? ''))
        monsters.push(monster)
      } else if (element._hint === 'area') {
        let positionValue = element.position
        if (positionValue === undefined || positionValue === null) positionValue = '0,0'
        const position = parse2Ints(positionValue)
        if (position == null || position[0] === undefined || position[1] === undefined) {
          throw Error('Invalid area position!')
        }
        const x = position[0]
        const y = position[1]
        let typeValue = element.type
        if (typeValue === null || typeValue === undefined || typeValue === '') typeValue = 'AREA_NONE'
        const type = typeValue
        let directionValue = element.direction
        if (directionValue === undefined || directionValue === null || directionValue === '') directionValue = 'DIR_LEFT'
        const direction = directionValue
        const area = new DFArea(x, y, type, direction)
        area.id = element._token.value
        area.editorPath = convertResourcePath((area.getResourcePath() ?? ''))
        areas.push(area)
      } else if (element._hint === 'item') {
        let positionValue = element.position
        if (positionValue === undefined || positionValue === null) positionValue = '0,0'
        const position = parse2Ints(positionValue)
        if (position == null || position[0] === undefined || position[1] === undefined) {
          throw Error('Invalid item position!')
        }
        const x = position[0]
        const y = position[1]
        let typeValue = element.type
        if (typeValue === null || typeValue === undefined || typeValue === '') typeValue = 'AREA_NONE'
        const type = typeValue
        let optionsValue = element.options
        if (optionsValue === undefined || optionsValue === null || optionsValue === '') optionsValue = 'ITEM_OPTION_NONE'
        const options = (optionsValue).replace(/\s+/g, '').split('|')
        const item = new DFItem(x, y, type, options)
        item.id = element._token.value
        item.editorPath = convertResourcePath((item.getResourcePath() ?? ''))
        items.push(item)
      } else if (element._hint === 'trigger') {
        let positionValue = element.position
        if (positionValue === undefined || positionValue === null) positionValue = '0,0'
        const position = parse2Ints(positionValue)
        if (position == null || position[0] === undefined || position[1] === undefined) {
          throw Error('Invalid trigger position!')
        }
        const x = position[0]
        const y = position[1]
        let sizeValue = element.size
        if (sizeValue === undefined || sizeValue === null) sizeValue = '0,0'
        const size = parse2Ints(sizeValue)
        if (size === null || size[0] === undefined || size[1] === undefined) continue
        const width = size[0]
        const height = size[1]
        let enabledValue = element.enabled
        if (enabledValue === undefined || enabledValue === null) enabledValue = 'true'
        const enabled = (enabledValue === 'true')
        let texturePanelValue = element.texture_panel
        if (texturePanelValue === undefined || texturePanelValue === null) texturePanelValue = null
        const texturePanel = texturePanelValue
        let typeValue = element.type
        if (typeValue === undefined || typeValue === null) typeValue = 'TRIGGER_NONE'
        const type = typeValue
        let activateTypeValue = element.activate_type
        if (activateTypeValue === undefined || activateTypeValue === null) activateTypeValue = 'ACTIVATE_NONE'
        const activateType = activateTypeValue.replace(/\s+/g, '').split('|')
        let keysValue = element.keys
        if (keysValue === undefined || keysValue === null) keysValue = 'KEY_NONE'
        const keys = keysValue.replace(/\s+/g, '').split('|')
        const triggerData = element.triggerdata
        const trigger = new DFTrigger(x, y, width, height, enabled, texturePanel, type, activateType, keys, triggerData)
        trigger.id = element._token.value
        trigger.editorPath = '' // triggers don't have any textures as far as i'm aware
        triggers.push(trigger)
      }
    }
  }
  return {
    width, height, name, author, description, music, sky, prefix, textures, panels, areas, items, monsters, triggers
  }
}

export { handleParsedMap }
