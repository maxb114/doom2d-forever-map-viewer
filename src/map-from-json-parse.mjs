import { DFMap } from './df-map.mjs'
import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { DFTrigger } from './df-trigger.mjs'

function mapFromJson (/** @type {any} */ json) {
  const parse = JSON.parse(json)
  const author = parse.author
  const description = parse.description
  const music = parse.music
  const name = parse.name
  const width = parse.size?.x
  const height = parse.size?.y
  const sky = parse.sky
  const prefix = parse.fileName
  const areas = []
  const items = []
  const monsters = []
  const panels = []
  const textures = []
  const triggers = []
  for (const area of parse.areas) {
    const direction = area.direction
    const x = area.pos?.x
    const y = area.pos?.y
    const type = area.type
    const id = area.id
    const editorPath = area.editorPath
    const parsedArea = new DFArea(x, y, type, direction)
    parsedArea.id = id
    parsedArea.editorPath = editorPath
    areas.push(parsedArea)
  }
  for (const item of parse.items) {
    const options = item.options
    const x = item.pos?.x
    const y = item.pos?.y
    const type = item.type
    const id = item.id
    const editorPath = item.editorPath
    const parsedItem = new DFItem(x, y, type, options)
    item.id = id
    item.editorPath = editorPath
    items.push(parsedItem)
  }
  for (const monster of parse.monsters) {
    const direction = monster.direction
    const x = monster.pos?.x
    const y = monster.pos?.y
    const type = monster.type
    const id = monster.id
    const editorPath = monster.editorPath
    const parsedMonster = new DFMonster(x, y, type, direction)
    parsedMonster.id = id
    parsedMonster.editorPath = editorPath
    monsters.push(parsedMonster)
  }
  for (const panel of parse.panels) {
    const alpha = panel.alpha
    const blending = panel.blending
    const flags = panel.flags
    const x = panel.pos?.x
    const y = panel.pos?.y
    const width = panel.size?.width
    const height = panel.size?.height
    const texture = panel.texture
    const type = panel.type
    const texturePath = panel.texturePath
    const editorPath = panel.editorPath
    const id = panel.id
    const parsedPanel = new DFPanel(x, y, width, height, texture, type, alpha, flags, undefined, texture, blending, undefined)
    parsedPanel.id = id
    parsedPanel.editorPath = editorPath
    parsedPanel.texturePath = texturePath
    panels.push(parsedPanel)
  }
  for (const texture of parse.textures) {
    const animated = texture.animated
    const editorPath = texture.editorPath
    const id = texture.id
    const path = texture.path
    const parsedTexture = new DFTexture(path, animated)
    parsedTexture.id = id
    parsedTexture.editorPath = editorPath
    textures.push(parsedTexture)
  }
  for (const trigger of parse.triggers) {
    const activateType = trigger.activateType
    const editorPath = trigger.editorPath
    const enabled = trigger.enabled
    const id = trigger.id
    const key = trigger.key
    const options = trigger.options
    const width = trigger.size?.width
    const height = trigger.size?.height
    const x = trigger.position?.x
    const y = trigger.position?.y
    const texturePanel = trigger.texturePanel
    const type = trigger.type
    const parsedTrigger = new DFTrigger(x, y, width, height, enabled, texturePanel, type, activateType, key, options)
    parsedTrigger.id = id
    parsedTrigger.editorPath = editorPath
    triggers.push(parsedTrigger)
  }
  const map = new DFMap({ name, author, description, music, sky, width, height, prefix, textures, panels, monsters, areas, items, triggers })
  return map
}

export { mapFromJson }
