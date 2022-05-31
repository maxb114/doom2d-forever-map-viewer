import { specialItemToJSON, getMonsterSize, getMonsterDelta, convertSpecialItem } from './df-constants.mjs'
class DFMonster {
  constructor (
    x = 0, y = 0,
    type = '',
    direction = ''
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
    this.monsterDelta = getMonsterDelta(this.type)
    this.id = 'default'
  }

  getResourcePath () {
    const monsterFrame = convertSpecialItem(this.type)
    if (monsterFrame === null) return null
    const monsterFrameObject = specialItemToJSON(monsterFrame)
    if (monsterFrameObject === undefined || monsterFrameObject.name === '') return null
    return monsterFrameObject.resource
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
    if (this.direction === '' || this.direction === 'DIR_LEFT') {
      options.flop = true
    }
    options.x = this.renderX
    options.y = this.renderY
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
