import { specialItemToJSON, convertSpecialItem, convertGameItems } from './df-constants.mjs'
class DFItem {
  constructor (/** @type {number} **/ x, /** @type {number} **/ y, /** @type {string} **/ type, options = ['ITEM_OPTION_NONE']) {
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
  }

  getResourcePath () {
    if (this.special === true && this.frameObject !== null) {
      return this.frameObject.resource
    } else {
      const itemResourceName = convertGameItems(this.type)
      return itemResourceName
    }
  }

  getRenderOptions () {
    const options = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      alpha: -1,
      stroke: 'rgba(0, 0, 0, 0)',
      blending: false,
      operation: '',
      fillColor: '',
      drawImage: true,
      flop: false
    }
    options.x = this.renderX
    options.y = this.renderY
    return options
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
