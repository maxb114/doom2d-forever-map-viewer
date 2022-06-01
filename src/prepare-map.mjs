import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { DFTrigger } from './df-trigger.mjs'
import { convertResourcePath } from './utility.mjs'

function mapForRender (/** @type {DFMap} */ map, /** @type {DFRenderOptions} */ options) {
  // create new panel as sky
  const elements = map.allElements
  const /** @type {(DFArea | DFItem | DFMonster | DFPanel | DFTexture | DFTrigger)[]} */ renderElements = []
  const orderedElements = {
    /** @type {DFPanel[]} */ sky: [],
    /** @type {DFPanel[]} */ background: [],
    /** @type {DFItem[]} */ items: [],
    /** @type {DFMonster[]} */ monsters: [],
    /** @type {DFPanel[]} */ walls: [],
    /** @type {DFArea[]} */ areas: [],
    /** @type {DFPanel[]} */ foreground: [],
    /** @type {DFTrigger[]} */ triggers: []
  }
  const order = {
    background: ['PANEL_BACK', 'PANEL_STEP'],
    walls: ['PANEL_WALL', 'PANEL_OPENDOOR', 'PANEL_CLOSEDOOR'],
    forgeround: ['PANEL_WATER', 'PANEL_ACID1', 'PANEL_ACID2', 'PANEL_FORE']
  }
  const water = ['_water_0', '_water_1', '_water_2']
  if (options?.getFlag('rendersky')) { // mimic sky as a DFPanel
    const width = map.size.x
    const height = map.size.y
    const blackPanel = new DFPanel(0, 0, width, height, undefined, undefined, undefined, undefined, undefined, undefined, undefined, { fillColor: '#000000', tile: true }) // create map-size black panel first
    orderedElements.sky.push(blackPanel)
    const defaultSky = 'Standart.wad:D2DSKY\\RSKY1'
    const prefix = map.fileName
    const path = convertResourcePath(map.sky ?? defaultSky, prefix)
    const panel = new DFPanel(0, 0, width, height, undefined, undefined, undefined, undefined, undefined, path, undefined, { tile: false })
    panel.editorPath = convertResourcePath(path)
    orderedElements.sky.push(panel)
  }
  for (const element of elements) {
    if (element instanceof DFArea) {
      if (!options?.getFlag('renderdmplayers') && (element.type === 'AREA_DMPOINT')) continue
      else if (!options?.getFlag('rendertdmplayers') && (element.type === 'AREA_REDTEAMPOINT' || element.type === 'AREA_BLUETEAMPOINT')) continue
      else if (!options?.getFlag('rendercoopplayers') && (element.type === 'AREA_PLAYERPOINT1' || element.type === 'AREA_PLAYERPOINT2')) continue
      else if (!options?.getFlag('renderflags') && (element.type === 'AREA_BLUEFLAG' || element.type === 'AREA_REDFLAG' || element.type === 'AREA_DOMFLAG')) continue
      orderedElements.areas.push(element)
    } else if (element instanceof DFItem) {
      if (!options?.getFlag('renderdmitems') && element.options.includes('ITEM_OPTION_ONLYDM')) continue
      else if (!options?.getFlag('renderitems') && !element.options.includes('ITEM_OPTION_ONLYDM')) continue
      orderedElements.items.push(element)
    } else if (element instanceof DFMonster) {
      if (!options?.getFlag('rendermonsters')) continue
      orderedElements.monsters.push(element)
    } else if (element instanceof DFPanel) {
      if (element.flags.includes('PANEL_FLAG_HIDE')) {
        continue
      } else if (element.flags.includes('PANEL_FLAG_WATERTEXTURES')) {
        // continue
      }
      const skip = ['PANEL_NONE', 'PANEL_LIFTUP', 'PANEL_LIFTDOWN', 'PANEL_BLOCKMON', 'PANEL_LIFTLEFT', 'PANEL_LIFTRIGHT']
      let stop = false
      for (const i of skip) {
        if (element.type.includes(i)) {
          stop = true
        }
      }
      if (stop) continue
      const isWater = water.includes(element.editorPath)
      if (!options?.getFlag('renderforeground') && element.type.includes('PANEL_FORE') && !isWater) continue
      else if (!options?.getFlag('renderwalls') && (!element.type.includes('PANEL_FORE') && !element.type.includes('PANEL_BACK')) && !isWater) continue
      else if (!options?.getFlag('renderbackground') && element.type.includes('PANEL_BACK') && !isWater) continue
      else if (!options?.getFlag('renderliquids') && isWater) continue
      else if (!options?.getFlag('renderopendoors') && element.type.includes('PANEL_OPENDOOR')) continue
      else if (options?.getFlag('renderopendoors') && element.type.includes('PANEL_CLOSEDOOR')) continue // traps and doors should be handled differently

      if (order.background.includes(element.type.join(''))) orderedElements.background.push(element) // why is type string[]?
      else if (order.walls.includes(element.type.join(''))) orderedElements.walls.push(element)
      else if (order.forgeround.includes(element.type.join(''))) orderedElements.foreground.push(element)
    } else if (element instanceof DFTexture) {
      continue
    } else if (element instanceof DFTrigger) {
      continue
    } else {
      continue
    }
  }
  for (const i in orderedElements) {
    // @ts-ignore
    const /** @type {(DFArea | DFItem | DFMonster | DFPanel | DFTexture | DFTrigger)[]} */ array = orderedElements[i]
    renderElements.push(...array)
  }
  return renderElements
}

export { mapForRender }
