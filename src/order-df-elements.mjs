import { DFArea } from './df-area.mjs'
import { DFItem } from './df-item.mjs'
import { DFMonster } from './df-monster.mjs'
import { DFPanel } from './df-panel.mjs'
import { DFTexture } from './df-texture.mjs'
import { DFTrigger } from './df-trigger.mjs'

function orderDfElements (/** @type {(DFArea|DFItem|DFMonster|DFPanel|DFTexture|DFTrigger)[]} */ all) {
  const orderedElements = {
    /** @type {DFPanel[]} */ sky: [],
    /** @type {DFPanel[]} */ background: [],
    /** @type {DFPanel[]} */ steps: [],
    /** @type {DFItem[]} */ items: [],
    /** @type {DFMonster[]} */ monsters: [],
    /** @type {DFPanel[]} */ walls: [],
    /** @type {DFArea[]} */ areas: [],
    /** @type {DFPanel[]} */ opendoors: [],
    /** @type {DFPanel[]} */ liquids: [],
    /** @type {DFPanel[]} */ foreground: [],
    /** @type {DFTrigger[]} */ triggers: []
  }
  const order = {
    background: ['PANEL_BACK'],
    walls: ['PANEL_WALL', 'PANEL_CLOSEDOOR', 'PANEL_NONE', 'PANEL_LIFTUP', 'PANEL_LIFTDOWN', 'PANEL_BLOCKMON', 'PANEL_LIFTLEFT', 'PANEL_LIFTRIGHT'],
    steps: ['PANEL_STEP'],
    foreground: ['PANEL_FORE'],
    opendoors: ['PANEL_OPENDOOR'],
    liquids: ['PANEL_WATER', 'PANEL_ACID1', 'PANEL_ACID2']
  }
  for (const element of all) {
    if (element instanceof DFArea) {
      orderedElements.areas.push(element)
    } else if (element instanceof DFItem) {
      orderedElements.items.push(element)
    } else if (element instanceof DFMonster) {
      orderedElements.monsters.push(element)
    } else if (element instanceof DFPanel) {
      const type = element.type.join('')
      if (order.background.includes(type)) orderedElements.background.push(element)
      else if (order.walls.includes(type)) orderedElements.walls.push(element)
      else if (order.foreground.includes(type)) orderedElements.foreground.push(element)
      else if (order.liquids.includes(type)) orderedElements.liquids.push(element)
      else if (order.steps.includes(type)) orderedElements.steps.push(element)
      else if (order.opendoors.includes(type)) orderedElements.opendoors.push(element)
    } else if (element instanceof DFTexture) {
      continue
    } else if (element instanceof DFTrigger) {
      continue
    } else {
      continue
    }
  }
  const returnValue = []
  for (const i in orderedElements) {
    // @ts-ignore
    const /** @type {(DFArea | DFItem | DFMonster | DFPanel | DFTexture | DFTrigger)[]} */ array = orderedElements[i]
    returnValue.push(...array)
  }
  return returnValue
}

export { orderDfElements }
