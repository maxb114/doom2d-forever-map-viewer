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
        const animated = /true/i.test(element.animated)
        const path = element.path
        const texture = new DFTexture(path, animated)
        texture.id = element._token.value
        texture.editorPath = convertResourcePath(path, prefix)
        textures.push(texture)
      } else if (element._hint === 'panel') {
        const position = element.position
        const numbers = parse2Ints(position)
        if (numbers == null || numbers[0] === undefined || numbers[1] === undefined) continue
        const x = numbers[0]
        const y = numbers[1]
        const size = element.size
        const dimensions = parse2Ints(size)
        if (dimensions === null || dimensions[0] === undefined || dimensions[1] === undefined) continue
        const width = dimensions[0]
        const height = dimensions[1]
        const texture = element.texture
        let type = (element.type === undefined || element.type === '' ? 'PANEL_NONE' : element.type)
        type = type.replace(/\s+/g, '').split('|')
        const alpha = (element.alpha === undefined ? -1 : element.alpha) // if unset, then -1
        let flags = (element.flags === undefined || element.flags === '' ? 'PANEL_FLAG_NONE' : element.flags)
        flags = flags.replace(/\s+/g, '').split('|')
        const blending = flags.includes('PANEL_FLAG_BLENDING')
        const panel = new DFPanel(x, y, width, height, texture, type, alpha, flags, undefined, undefined, blending, undefined)
        // we map textures to panels later
        panel.id = element._token.value
        panels.push(panel)
      } else if (element._hint === 'monster') {
        const position = element.position
        const numbers = parse2Ints(position)
        if (numbers === null || numbers[0] === undefined || numbers[1] === undefined) continue
        const x = numbers[0]
        const y = numbers[1]
        const type = element.type
        const direction = element.direction
        const monster = new DFMonster(x, y, type, direction)
        monster.id = element._token.value
        monster.editorPath = convertResourcePath((monster.getResourcePath() ?? ''))
        monsters.push(monster)
      } else if (element._hint === 'area') {
        const position = element.position
        const numbers = parse2Ints(position)
        if (numbers === null || numbers[0] === undefined || numbers[1] === undefined) continue
        const x = numbers[0]
        const y = numbers[1]
        const type = element.type
        const direction = element.direction
        const area = new DFArea(x, y, type, direction)
        area.id = element._token.value
        area.editorPath = convertResourcePath((area.getResourcePath() ?? ''))
        areas.push(area)
      } else if (element._hint === 'item') {
        const position = element.position
        const numbers = parse2Ints(position)
        if (numbers === null || numbers[0] === undefined || numbers[1] === undefined) continue
        const x = numbers[0]
        const y = numbers[1]
        const type = element.type
        let options = element.options ?? 'ITEM_OPTION_NONE'
        options = options.replace(/\s+/g, '').split('|')
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
