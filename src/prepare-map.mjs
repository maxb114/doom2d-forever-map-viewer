import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMap } from './df-map.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { DFTrigger } from './df-trigger.mjs'
import { DFRenderOptions } from './render.mjs'

function mapForRender (/** @type {DFMap} */ map, /** @type {DFRenderOptions} */ options) {
  // create new panel as sky
  const elements = map.allElements
  const /** @type {(DFArea | DFItem | DFMonster | DFPanel | DFTexture | DFTrigger)[]} */ renderElements = []
  for (const element of elements) {
    if (element instanceof DFArea) {
      if (!options?.getFlag('renderdmplayers') && (element.type === 'AREA_DMPOINT')) continue
      else if (!options?.getFlag('rendertdmplayers') && (element.type === 'AREA_REDTEAMPOINT' || element.type === 'AREA_BLUETEAMPOINT')) continue
      else if (!options?.getFlag('rendercoopplayers') && (element.type === 'AREA_PLAYERPOINT1' || element.type === 'AREA_PLAYERPOINT2')) continue
      else if (!options?.getFlag('renderflags') && (element.type === 'AREA_BLUEFLAG' || element.type === 'AREA_REDFLAG' || element.type === 'AREA_DOMFLAG')) continue
    } else if (element instanceof DFItem) {
      if (!options?.getFlag('renderdmitems') && element.options.includes('ITEM_OPTION_ONLYDM')) continue
      else if (!options?.getFlag('renderitems') && !element.options.includes('ITEM_OPTION_ONLYDM')) continue
    } else if (element instanceof DFMonster) {
      if (options?.getFlag('rendermonsters')) continue
    } else if (element instanceof DFPanel) {
      const skip = ['PANEL_NONE', 'PANEL_LIFTUP', 'PANEL_LIFTDOWN', 'PANEL_BLOCKMON', 'PANEL_LIFTLEFT', 'PANEL_LIFTRIGHT']
      let stop = false
      for (const i of skip) {
        if (element.type.includes(i)) {
          stop = true
        }
      }
      if (stop) continue
      const water = ['_water_0', '_water_1', '_water_2']
      const isWater = water.includes(element.editorPath)
      if (!options?.getFlag('renderforeground') && element.type.includes('PANEL_FORE') && !isWater) continue
      else if (!options?.getFlag('renderwalls') && (!element.type.includes('PANEL_FORE') && !element.type.includes('PANEL_BACK')) && !isWater) continue
      else if (!options?.getFlag('renderbackground') && element.type.includes('PANEL_BACK') && !isWater) continue
      else if (!options?.getFlag('renderliquids') && isWater) continue
      else if (!options?.getFlag('renderopendoors') && element.type.includes('PANEL_OPENDOOR')) continue
      else if (options?.getFlag('renderopendoors') && element.type.includes('PANEL_CLOSEDOOR')) continue // traps and doors should be handled differently
    } else if (element instanceof DFTexture) {
      continue
    } else if (element instanceof DFTrigger) {
      continue
    } else {
      continue
    }
    renderElements.push(element)
  }
  return renderElements
}

export { mapForRender }
