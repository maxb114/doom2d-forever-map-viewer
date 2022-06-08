import { specialItemToJSON, getMonsterSize, getMonsterDelta, convertSpecialItem } from './df-constants.mjs'
import { convertResourcePath } from './utility.mjs'
class DFMonster {
  constructor (
    x = 0, y = 0,
    type = '',
    direction = '',
    specialOptions = {}
  ) {
    this.pos = { x: 0, y: 0 }
    this.type = ''
    this.direction = ''
    this.pos.x = x
    this.pos.y = y
    this.type = type
    this.direction = direction
    this.monsterFrame = convertSpecialItem(this.type)
    if (this.monsterFrame === null) this.monsterFrame = ''
    this.monsterFrameObject = specialItemToJSON(this.monsterFrame)
    this.monsterSizeObj = getMonsterSize(this.type)
    this.size = { width: this.monsterSizeObj.width, height: this.monsterSizeObj.height }
    this.renderSize = { width: 0, height: 0 }
    this.monsterDelta = getMonsterDelta(this.type)
    this.id = 'default'
    this.editorPath = ''
    this.alpha = 1
    /** @type {any} */ this.specialOptions = specialOptions
    this.editorPath = this.getResourcePath()
  }

  getResourcePath () {
    const monsterFrame = convertSpecialItem(this.type)
    if (monsterFrame === null) return null
    const monsterFrameObject = specialItemToJSON(monsterFrame)
    if (monsterFrameObject === undefined || monsterFrameObject.name === '') return null
    const path = convertResourcePath(monsterFrameObject.resource)
    return path
  }

  getRenderOptions () {
    const options = {
      x: this.renderX,
      y: this.renderY,
      width: this.renderSize.width,
      height: this.renderSize.height,
      alpha: this.alpha,
      stroke: 'rgba(0, 0, 0, 0)',
      operation: 'source-over',
      specialOptions: this.specialOptions
    }
    if (this.direction === 'DIR_RIGHT') {
      options.specialOptions.flop = false
    } else {
      options.specialOptions.flop = true
    }
    options.specialOptions.tile = false
    return options
  }

  asText () {
    let msg = ''
    msg = msg + '\n'
    msg = msg + ' '.repeat(2) + 'monster' + ' ' + this.id + ' ' + '{' + '\n'
    msg = msg + ' '.repeat(4) + 'position' + ' ' + '(' + (this.pos.x).toString(10) + ' ' + (this.pos.y).toString(10) + ')' + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'type' + ' ' + this.type + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'direction' + ' ' + (this.direction === '' ? 'DIR_LEFT' : this.direction) + ';' + '\n'
    msg = msg + ' '.repeat(2) + '}' + '\n'
    return msg
  }

  get renderX () {
    if (this.direction === '' || this.direction === 'DIR_LEFT') {
      let tempX = (this.monsterSizeObj.x - this.monsterDelta.x) + this.monsterSizeObj.width
      tempX = this.monsterDelta.width - tempX - this.monsterSizeObj.x
      tempX = (this.pos.x - this.monsterSizeObj.x) - tempX
      return tempX
    } else {
      const tempX = (this.pos.x - this.monsterSizeObj.x) + this.monsterDelta.x
      return tempX
    }
  }

  get renderY () {
    const tempY = (this.pos.y - this.monsterSizeObj.y) + this.monsterDelta.y
    return tempY
  }

  get mapX () {
    return this.pos.x
  }

  get mapY () {
    return this.pos.y
  }
}

export { DFMonster }
