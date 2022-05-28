import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { parse2Ints } from './utility.mjs'

class DFMap {
  constructor (/** @type {any} */ parsed, /** @type {string} */ fileName) {
    /** @type {DFTexture[]} */ this.textures = []
    /** @type {DFPanel[]} */ this.panels = []
    /** @type {DFMonster[]} */ this.monsters = []
    /** @type {DFArea[]} */ this.areas = []
    /** @type {DFItem[]} */ this.items = []
    this.name = ''
    this.author = ''
    this.description = ''
    this.music = ''
    this.sky = ''
    this.size = { x: 0, y: 0 }
    this.fileName = fileName
    for (const i in parsed) {
      const element = parsed[i]
      if (element === undefined) continue
      if (i === 'name') this.name = element
      else if (i === 'author') this.author = element
      else if (i === 'description') this.description = element
      else if (i === 'music') this.music = element
      else if (i === 'sky') this.sky = element
      else if (i === 'size') {
        const numbers = parse2Ints(element)
        if (numbers === null || numbers[0] === undefined || numbers[1] === undefined) continue
        this.size.x = numbers[0]
        this.size.y = numbers[1]
      } else {
        if (element._hint === undefined) continue
        if (element._hint === 'texture') {
          const animated = /true/i.test(element.animated)
          const path = element.path
          const texture = new DFTexture(path, animated)
          texture.id = element._token.value
          this.textures.push(texture)
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
          const panel = new DFPanel(x, y, width, height, texture, type, alpha, flags)
          panel.id = element._token.value
          this.panels.push(panel)
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
          this.monsters.push(monster)
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
          this.areas.push(area)
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
          this.items.push(item)
        }
      }
    }
  }

  getTexturePath = (/** @type {String} */ arg) => {
    for (const texture of this.textures) {
      if (texture.id === arg) return texture.path
    }
    return null
  }
}

export { DFMap }
