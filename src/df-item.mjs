import { specialItemToJSON, convertSpecialItem, convertGameItems } from './df-constants.mjs'
import { convertResourcePath } from './utility.mjs'
class DFItem {
  constructor (/** @type {number} **/ x, /** @type {number} **/ y, /** @type {string} **/ type, options = ['ITEM_OPTION_NONE'], /** @type {any} */ specialOptions = {}) {
    this.pos = { x: 0, y: 0 }
    this.type = ''
    this.options = ''
    this.pos.x = x
    this.pos.y = y
    this.type = type
    this.options = options
    this.id = 'default'
    const frame = convertSpecialItem(this.type)
    const special = (frame !== null)
    this.special = special
    if (this.special === true && frame !== null) {
      const itemFrameObject = specialItemToJSON(frame)
      this.frameObject = itemFrameObject
    } else {
      this.frameObject = null
    }
    this.editorPath = ''
    this.alpha = 1
    this.specialOptions = specialOptions
    this.editorPath = this.getResourcePath()
  }

  getResourcePath () {
    if (this.special === true && this.frameObject !== null) {
      const path = convertResourcePath(this.frameObject.resource)
      return path
    } else {
      const itemResourceName = convertGameItems(this.type)
      if (itemResourceName === null) return null
      const path = convertResourcePath(itemResourceName)
      return path
    }
  }

  getRenderOptions () {
    const options = {
      x: this.renderX,
      y: this.renderY,
      width: 0,
      height: 0,
      alpha: this.alpha,
      stroke: 'rgba(0, 0, 0, 0)',
      operation: 'source-over',
      specialOptions: this.specialOptions
    }
    options.specialOptions.tile = false
    return options
  }

  asText () {
    let msg = ''
    msg = msg + '\n'
    msg = msg + ' '.repeat(2) + 'item' + ' ' + this.id + ' ' + '{' + '\n'
    msg = msg + ' '.repeat(4) + 'position' + ' ' + '(' + (this.pos.x).toString(10) + ' ' + (this.pos.y).toString(10) + ')' + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'type' + ' ' + this.type + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'options' + ' ' + this.options.join(' | ') + ';' + '\n'
    msg = msg + ' '.repeat(2) + '}' + '\n'
    return msg
  }

  get renderX () {
    return this.pos.x
  }

  get renderY () {
    return this.pos.y
  }

  get mapX () {
    return this.pos.x
  }

  get mapY () {
    return this.pos.y
  }
}

export { DFItem }
