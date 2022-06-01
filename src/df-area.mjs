import { getAreaSize, areaToTexture } from './df-constants.mjs'

class DFArea {
  constructor (
    x = 0, y = 0,
    type = '',
    direction = ''
  ) {
    this.pos = { x: 0, y: 0 }
    this.pos.x = x
    this.pos.y = y
    this.type = type
    this.direction = direction
    this.areaSize = getAreaSize(this.type)
    this.id = 'default'
    this.editorPath = ''
  }

  getResourcePath () {
    const elementTextureName = areaToTexture(this.type)
    if (elementTextureName === null) return null
    return elementTextureName
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
    if (this.direction === '' || this.direction === 'DIR_LEFT') {
      options.flop = true
    }
    return options
  }

  asText () {
    let msg = ''
    msg = msg + '\n'
    msg = msg + ' '.repeat(2) + 'area' + ' ' + this.id + ' ' + '{' + '\n'
    msg = msg + ' '.repeat(4) + 'position' + ' ' + '(' + (this.pos.x).toString(10) + ' ' + (this.pos.y).toString(10) + ')' + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'type' + ' ' + this.type + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'direction' + ' ' + (this.direction === '' ? 'DIR_LEFT' : this.direction) + ';' + '\n'
    msg = msg + ' '.repeat(2) + '}' + '\n'
    return msg
  }

  get renderX () {
    if (this.direction === '' || this.direction === 'DIR_LEFT') {
      const offsetX = this.mapX - this.areaSize.x
      return offsetX
    } else {
      const offsetX = this.mapX - this.areaSize.x
      return offsetX
    }
  }

  get renderY () {
    const offsetY = this.mapY - this.areaSize.y
    return offsetY
  }

  get mapX () {
    return this.pos.x
  }

  get mapY () {
    return this.pos.y
  }
}

export { DFArea }
