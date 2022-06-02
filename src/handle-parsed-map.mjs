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
        if (flagsValue === null || flagsValue === null || flagsValue === '') flagsValue = 'PANEL_FLAG_NONE'
        const flags = flagsValue.replace(/\s+/g, '').split('|')
        const blending = flags.includes('PANEL_FLAG_BLENDING')
        const panel = new DFPanel(x, y, width, height, textureId, type, alpha, flags, undefined, undefined, blending, undefined)
        // we map textures to panels later
        panel.id = element._token.value
        panels.push(panel)
      } else if (element._hint === 'monster') {
        let positionValue = element.position
        if (positionValue === undefined || positionValue === null) positionValue = '0,0'
        const position = parse2Ints(positionValue)
        if (position == null || position[0] === undefined || position[1] === undefined) {
          throw Error('Invalid panel position!')
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
          throw Error('Invalid panel position!')
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
          throw Error('Invalid panel position!')
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
        const position = parse2Ints(element.position)
        if (position === null || position[0] === undefined || position[1] === undefined) continue
        const x = position[0]
        const y = position[1]
        const size = parse2Ints(element.size)
        if (size === null || size[0] === undefined || size[1] === undefined) continue
        const width = size[0]
        const height = size[1]
        const enabled = (element.enabled === 'true')
        const texturePanel = element.texture_panel
        const type = element.type
        const activateType = (element.activate_type && element.activate_type !== '' ? element.activate_type : 'ACTIVATE_NONE').replace(/\s+/g, '').split('|')
        const keys = (element.keys && element.keys !== '' ? element.keys : 'KEY_NONE').replace(/\s+/g, '').split('|')
        const triggerData = element.triggerdata
        const trigger = new DFTrigger(x, y, width, height, enabled, texturePanel, type, activateType, keys, triggerData)
        trigger.id = element._token.value
        trigger.editorPath = '' // triggers don't have any textures as far as i'm aware
        triggers.push(trigger)
      }
    }
  }
  for (const panel of panels) { // map textures to panels
    const texture = panel.texture
    const textureObject = textures.find((element) => {
      if (element.id === texture) return true
      return false
    })
    const fullPath = textureObject?.path ?? ''
    panel.texturePath = fullPath
    panel.editorPath = textureObject?.editorPath ?? ''
  }
  return {
    width, height, name, author, description, music, sky, prefix, textures, panels, areas, items, monsters, triggers
  }
}

export { handleParsedMap }
