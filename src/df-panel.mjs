class DFPanel {
  constructor (x = 0, y = 0, width = 0, height = 0, texture = '', type = ['PANEL_NONE'],
    alpha = -1, flags = ['PANEL_FLAG_NONE'], /** @type {any} */ platformOptions = undefined, texturePath = '', blending = false, specialOptions = {}) {
    this.pos = { x: 0, y: 0 }
    this.size = { width: 0, height: 0 }
    this.pos.x = x
    this.pos.y = y
    this.size.width = width
    this.size.height = height
    this.renderSize = { width: this.size.width, height: this.size.height }
    this.texture = texture
    this.type = type
    this.alpha = alpha
    this.flags = flags
    // this.platform = platformOptions
    if (platformOptions !== undefined) {
      this.moveSpeed = { x: platformOptions.moveSpeed[0], y: platformOptions.moveSpeed[1] }
      this.sizeSpeed = { x: platformOptions.sizeSpeed[0], y: platformOptions.sizeSpeed[1] }
      this.moveStart = { x: platformOptions.moveStart[0], y: platformOptions.moveStart[1] }
      this.moveEnd = { x: platformOptions.moveEnd[0], y: platformOptions.moveEnd[1] }
      this.sizeEnd = { x: platformOptions.sizeEnd[0], y: platformOptions.sizeEnd[1] }
      this.moveActive = platformOptions.moveActive
      this.moveOnce = platformOptions.moveOnce
      this.endPosTrigger = platformOptions.endPosTrigger
      this.endSizeTrigger = platformOptions.endSizeTrigger
    }
    this.texturePath = texturePath
    this.id = 'default'
    this.editorPath = ''
    this.blending = blending
    /** @type {any} */ this.specialOptions = specialOptions
  }

  getRenderOptions () {
    let convertAlpha = 1
    if (this.alpha === -1) convertAlpha = 1
    else convertAlpha = (255 - this.alpha) / 255
    const options = {
      x: this.renderX,
      y: this.renderY,
      width: this.renderSize.width,
      height: this.renderSize.height,
      alpha: convertAlpha,
      stroke: 'rgba(0, 0, 0, 0)',
      blending: this.blending,
      operation: 'source-over',
      specialOptions: this.specialOptions
    }
    const water = ['_water_0', '_water_1', '_water_2']
    const color = ['blue', 'green', 'red']
    if (water.includes(this.editorPath)) {
      options.specialOptions.fillColor = color[water.indexOf(this.editorPath)]
      options.operation = 'darken'
    }
    if (this.blending) {
      options.operation = 'lighter'
    }
    return options
  }

  getResourcePath () {
    const path = this.editorPath
    return path
  }

  asText () {
    let msg = ''
    msg = msg + '\n'
    msg = msg + ' '.repeat(2) + 'panel' + ' ' + this.id + ' ' + '{' + '\n'
    msg = msg + ' '.repeat(4) + 'position' + ' ' + '(' + (this.pos.x).toString(10) + ' ' + (this.pos.y).toString(10) + ')' + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'size' + ' ' + '(' + (this.size.width).toString(10) + ' ' + (this.size.height).toString(10) + ')' + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'texture' + ' ' + this.texture + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'type' + ' ' + this.type[0] + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'alpha' + ' ' + (this.alpha === -1 ? 0 : this.alpha) + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'flags' + ' ' + this.flags.join(' | ') + ';' + '\n'
    if (this.moveSpeed !== undefined && this.moveSpeed.x !== undefined && this.moveSpeed.y !== undefined) msg = msg + ' '.repeat(4) + 'move_speed' + ' ' + '(' + (this.moveSpeed.x).toString(10) + ' ' + (this.moveSpeed.y).toString(10) + ')' + ';' + '\n'
    if (this.sizeSpeed !== undefined && this.sizeSpeed.x !== undefined && this.sizeSpeed.y !== undefined) msg = msg + ' '.repeat(4) + 'size_speed' + ' ' + '(' + (this.sizeSpeed.x).toString(10) + ' ' + (this.sizeSpeed.y).toString(10) + ')' + ';' + '\n'
    if (this.moveStart !== undefined && this.moveStart.x !== undefined && this.moveStart.y !== undefined) msg = msg + ' '.repeat(4) + 'move_start' + ' ' + '(' + (this.moveStart.x).toString(10) + ' ' + (this.moveStart.y).toString(10) + ')' + ';' + '\n'
    if (this.moveEnd !== undefined && this.moveEnd.x !== undefined && this.moveEnd.y !== undefined) msg = msg + ' '.repeat(4) + 'move_end' + ' ' + '(' + (this.moveEnd.x).toString(10) + ' ' + (this.moveEnd.y).toString(10) + ')' + ';' + '\n'
    if (this.sizeEnd !== undefined && this.sizeEnd.x !== undefined && this.sizeEnd.y !== undefined) msg = msg + ' '.repeat(4) + 'size_end' + ' ' + '(' + (this.sizeEnd.x).toString(10) + ' ' + (this.sizeEnd.y).toString(10) + ')' + ';' + '\n'
    if (this.moveActive !== undefined) msg = msg + ' '.repeat(4) + 'move_active' + ' ' + this.moveActive.toString() + ';' + '\n'
    if (this.moveOnce !== undefined) msg = msg + ' '.repeat(4) + 'move_once' + ' ' + this.moveOnce.toString() + ';' + '\n'
    if (this.endPosTrigger !== undefined) msg = msg + ' '.repeat(4) + 'end_pos_trigger' + ' ' + (this.endPosTrigger ?? 'null') + ';' + '\n'
    if (this.endSizeTrigger !== undefined) msg = msg + ' '.repeat(4) + 'end_size_trigger' + ' ' + (this.endSizeTrigger ?? 'null') + ';' + '\n'
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

export { DFPanel }
