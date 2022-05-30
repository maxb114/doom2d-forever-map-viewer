import { parse2Ints } from './utility.mjs'

class TriggerOption {
  constructor (/** @type {string} */ path, /** @type {any} */ defaultValue, /** @type {string} */ handler, /** @type {number} */ size, /** @type {any} */ value) {
    this.path = path
    this.defaultValue = defaultValue
    this.handler = handler
    this.size = size
    this.value = value
  }
}

function getTriggerUsedData (/** @type {String} */ trigger) {
  const /** @type {TriggerOption[]} */ properties = []
  if (trigger === 'TRIGGER_EXIT') {
    properties.push(new TriggerOption('map', '', 'char', 16))
  } else if (trigger === 'TRIGGER_TELEPORT') {
    properties.push(new TriggerOption('target', '0,0', 'double_longword', 8))
    properties.push(new TriggerOption('d2d', 'false', 'bool', 1))
    properties.push(new TriggerOption('silent', 'false', 'bool', 1))
    properties.push(new TriggerOption('direction', 'DIR_LEFT', 'direction', 1))
  } else if (trigger === 'TRIGGER_OPENDOOR' || trigger === 'TRIGGER_CLOSEDOOR' || trigger === 'TRIGGER_DOOR' || trigger === 'TRIGGER_DOOR5' || trigger === 'TRIGGER_CLOSETRAP' || trigger === 'TRIGGER_TRAP' || trigger === 'TRIGGER_LIFTUP' || trigger === 'TRIGGER_LIFTDOWN' || trigger === 'TRIGGER_LIFT') {
    properties.push(new TriggerOption('panelid', null, 'longword', 4))
    properties.push(new TriggerOption('silent', 'false', 'bool', 1))
    properties.push(new TriggerOption('d2d', 'false', 'bool', 1))
  } else if (trigger === 'TRIGGER_PRESS' || trigger === 'TRIGGER_ON' || trigger === 'TRIGGER_OFF' || trigger === 'TRIGGER_ONOFF') {
    properties.push(new TriggerOption('position', '0,0', 'double_longword', 8))
    properties.push(new TriggerOption('size', '0,0', 'double_word', 4))
    properties.push(new TriggerOption('wait', 0, 'word', 2))
    properties.push(new TriggerOption('count', 0, 'word', 2))
    properties.push(new TriggerOption('monsterid', null, 'longword', 4))
    properties.push(new TriggerOption('ext_random', 'false', 'bool', 1))
    properties.push(new TriggerOption('panelid', null, 'longword', -1))
    properties.push(new TriggerOption('silent', 'true', 'bool', -1))
    properties.push(new TriggerOption('sound', '', 'char', -1))
  } else if (trigger === 'TRIGGER_SECRET') {
    // nothing to see here
  } else if (trigger === 'TRIGGER_TEXTURE') {
    properties.push(new TriggerOption('activate_once', 'true', 'bool', 1))
    properties.push(new TriggerOption('animate_once', 'true', 'bool', 1))
  } else if (trigger === 'TRIGGER_SOUND') {
    properties.push(new TriggerOption('sound_name', '', 'char', 64))
    properties.push(new TriggerOption('volume', 0, 'byte', 1))
    properties.push(new TriggerOption('pan', 0, 'byte', 1))
    properties.push(new TriggerOption('local', 'true', 'bool', 1))
    properties.push(new TriggerOption('play_count', 1, 'byte', 1))
    properties.push(new TriggerOption('sound_switch', 'true', 'bool', 1))
  } else if (trigger === 'TRIGGER_SPAWNMONSTER') {
    properties.push(new TriggerOption('position', '0,0', 'double_longword', 8))
    properties.push(new TriggerOption('type', 'MONSTER_NONE', 'longword', 4))
    properties.push(new TriggerOption('health', 4, 'longword', 4))
    properties.push(new TriggerOption('direction', 'DIR_LEFT', 'direction', 1))
    properties.push(new TriggerOption('active', 'true', 'bool', 3)) // why does this have to be 3?
    properties.push(new TriggerOption('count', 1, 'longword', 4))
    properties.push(new TriggerOption('effect', 'EFFECT_NONE', 'word', 2))
    properties.push(new TriggerOption('max', 1, 'word', 2))
    properties.push(new TriggerOption('delay', 1000, 'word', 2))
    properties.push(new TriggerOption('behaviour', 0, 'byte', 1))
  } else if (trigger === 'TRIGGER_SPAWNITEM') {
    properties.push(new TriggerOption('position', '0,0', 'double_longword', 8))
    properties.push(new TriggerOption('type', 0, 'byte', 1))
    properties.push(new TriggerOption('gravity', 'true', 'bool', 1))
    properties.push(new TriggerOption('dmonly', 'false', 'bool', 2))
    properties.push(new TriggerOption('count', 1, 'longword', 4))
    properties.push(new TriggerOption('effect', 'EFFECT_NONE', 'word', 2))
    properties.push(new TriggerOption('max', 1, 'word', 2))
    properties.push(new TriggerOption('delay', 1000, 'word', 2))
  } else if (trigger === 'TRIGGER_MUSIC') {
    properties.push(new TriggerOption('name', '', 'char', 64))
    properties.push(new TriggerOption('action', 0, 'byte', 1))
  } else if (trigger === 'TRIGGER_PUSH') {
    properties.push(new TriggerOption('angle', 0, 'word', 2))
    properties.push(new TriggerOption('force', 0, 'byte', 1))
    properties.push(new TriggerOption('reset_velocity', 'false', 'bool', 1))
  } else if (trigger === 'TRIGGER_SCORE') {
    properties.push(new TriggerOption('action', 0, 'byte', 1))
    properties.push(new TriggerOption('count', 0, 'byte', 1))
    properties.push(new TriggerOption('team', 0, 'byte', 1))
    properties.push(new TriggerOption('console', 'false', 'bool', 1))
    properties.push(new TriggerOption('message', 'true', 'bool', 1))
  } else if (trigger === 'TRIGGER_MESSAGE') {
    properties.push(new TriggerOption('kind', 0, 'byte', 1))
    properties.push(new TriggerOption('dest', 0, 'byte', 1))
    properties.push(new TriggerOption('text', '', 'char', 100))
    properties.push(new TriggerOption('time', 0, 'word', 2))
  } else if (trigger === 'TRIGGER_DAMAGE') {
    properties.push(new TriggerOption('amount', 0, 'word', 2))
    properties.push(new TriggerOption('interval', 0, 'word', 2))
    // properties.push(new TriggerOption('kind', 0, 'byte', 1)) // why...
  } else if (trigger === 'TRIGGER_HEALTH') {
    properties.push(new TriggerOption('amount', 0, 'word', 2))
    properties.push(new TriggerOption('interval', 0, 'word', 2))
    properties.push(new TriggerOption('max', 'false', 'bool', 1))
    properties.push(new TriggerOption('silent', 'false', 'bool', 2))
  } else if (trigger === 'TRIGGER_SHOT' && false) {
    properties.push(new TriggerOption('position', '0,0', 'double_longword', 8))
    properties.push(new TriggerOption('type', 0, 'byte', 1))
    properties.push(new TriggerOption('target', 0, 'byte', 1))
    properties.push(new TriggerOption('sound', 'false', 'bool', 1)) // idgaf about no negbool!
    properties.push(new TriggerOption('aim', 0, 'byte', 1))
    properties.push(new TriggerOption('panelid', 0, 'panelid', 4))
    properties.push(new TriggerOption('sight', 0, 'word', 2))
    properties.push(new TriggerOption('angle', 0, 'word', 2))
    properties.push(new TriggerOption('wait', 0, 'word', 2))
    properties.push(new TriggerOption('accuracy', 0, 'word', 2))
    properties.push(new TriggerOption('ammo', 0, 'word', 2))
    properties.push(new TriggerOption('reload', 0, 'word', 2))
  } else if (trigger === 'TRIGGER_EFFECT') {
    properties.push(new TriggerOption('count', 0, 'byte', 1))
    properties.push(new TriggerOption('type', 0, 'byte', 1))
    properties.push(new TriggerOption('subtype', 4, 'byte', 1))
    properties.push(new TriggerOption('red', 0, 'byte', 1))
    properties.push(new TriggerOption('green', 0, 'byte', 1))
    properties.push(new TriggerOption('blue', 0, 'byte', 1))
    properties.push(new TriggerOption('pos', 0, 'byte', 2))
    properties.push(new TriggerOption('wait', 0, 'word', 2))
    properties.push(new TriggerOption('vel_x', 0, 'sbyte', 1)) // should it be signed?
    properties.push(new TriggerOption('vel_y', 0, 'sbyte', 1))
    properties.push(new TriggerOption('spread_l', 0, 'byte', 1))
    properties.push(new TriggerOption('spread_r', 0, 'byte', 1))
    properties.push(new TriggerOption('spread_u', 0, 'byte', 1))
    properties.push(new TriggerOption('spread_d', 0, 'byte', 1))
  }
  return properties
}

class DFTrigger {
  constructor (x = -1, y = -1, width = -1, height = -1, enabled = true, texturePanel = null, type = 'TRIGGER_NONE', activateType = ['ACTIVATE_NONE'], key = ['KEY_NONE'], /** @type {any} */ triggerData) {
    this.position = { x, y }
    this.size = { width, height }
    this.enabled = enabled
    this.texturePanel = texturePanel
    this.type = type
    this.activateType = activateType
    this.key = key
    /** @type {TriggerOption[]} */ this.options = getTriggerUsedData(this.type)
    this.#mapUsedDataToOptions(triggerData)
    this.id = 'default'
  }

  #mapUsedDataToOptions (/** @type {any} */ triggerData) {
    const options = this.options
    for (const option of options) {
      const index = option.path
      const value = triggerData[index] ?? option.defaultValue
      if (value === null || value === undefined) {
        option.value = null
        continue
      }
      if (option.handler === 'double_longword' || option.handler === 'double_word') {
        option.value = [-1, -1]
        const numbers = parse2Ints(value)
        if (numbers === null || numbers[0] === undefined || numbers[1] === undefined) {
          continue
        }
        option.value[0] = numbers[0]
        option.value[1] = numbers[1]
      } else if (option.handler === 'bool') {
        option.value = value.match(/true/i) !== null
      } else if (option.handler === 'byte' || option.handler === 'word' || option.handler === 'longword') {
        option.value = value.toString(10)
      } else {
        option.value = value
      }
    }
  }
}

export { DFTrigger, getTriggerUsedData }
