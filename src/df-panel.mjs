class DFPlatformOptions {
  /**
   * @param {number} [moveSpeedX]
   * @param {number} [moveSpeedY]
   * @param {number} [sizeSpeedWidth]
   * @param {number} [sizeSpeedHeight]
   * @param {number} [moveStartX]
   * @param {number} [moveStartY]
   * @param {number} [moveEndX]
   * @param {number} [moveEndY]
   * @param {boolean} [moveActive]
   * @param {boolean} [moveOnce]
   * @param {number} [endPosTrigger]
   * @param {number} [endSizeTrigger]
   */
  constructor (moveSpeedX = -1, moveSpeedY = -1, sizeSpeedWidth = -1, sizeSpeedHeight = -1,
    moveStartX = -1, moveStartY = -1, moveEndX = -1, moveEndY = -1, moveActive = false, moveOnce = false, endPosTrigger = -1, endSizeTrigger = -1) {
    this.moveSpeed = { x: 0, y: 0 }
    this.sizeSpeed = { width: 0, height: 0 }
    this.moveStart = { x: 0, y: 0 }
    this.moveEnd = { x: 0, y: 0 }
    this.sizeEnd = { width: 0, height: 0 }
    this.moveSpeed.x = moveSpeedX
    this.moveSpeed.y = moveSpeedY
    this.sizeSpeed.width = sizeSpeedWidth
    this.sizeSpeed.height = sizeSpeedHeight
    this.moveStart.x = moveStartX
    this.moveStart.y = moveStartY
    this.moveEnd.x = moveEndX
    this.moveEnd.y = moveEndY
    this.moveActive = moveActive
    this.moveOnce = moveOnce
    this.endPosTrigger = endPosTrigger
    this.endSizeTrigger = endSizeTrigger
  }
}

class DFPanel {
  constructor (x = 0, y = 0, width = 0, height = 0, texture = '', type = ['PANEL_NONE'],
    alpha = -1, flags = ['PANEL_FLAG_NONE'], platformOptions = new DFPlatformOptions()) {
    this.pos = { x: 0, y: 0 }
    this.size = { width: 0, height: 0 }
    this.pos.x = x
    this.pos.y = y
    this.size.width = width
    this.size.height = height
    this.texture = texture
    this.type = type
    this.alpha = alpha
    this.flags = flags
    this.platform = platformOptions
    this.id = 'default'
  }

  getResourcePath () {
    return this.texture
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
      drawImage: false,
      flop: false,
      invisible: false, // skip through these
      water: false // don't skip through these
    }
    options.x = this.renderX
    options.y = this.renderY
    options.width = this.size.width
    options.height = this.size.height
    if (this.alpha === -1) options.alpha = -1
    else options.alpha = (255 - this.alpha) / 255
    if (this.flags.includes('PANEL_FLAG_BLENDING')) {
      options.blending = true
    }
    if (this.flags.includes('PANEL_FLAG_HIDE')) {
      options.invisible = true
    }
    if (this.flags.includes('PANEL_FLAG_WATERTEXTURES')) {
      // options.invisible = true
    }
    const skip = ['PANEL_NONE', 'PANEL_LIFTUP', 'PANEL_LIFTDOWN', 'PANEL_BLOCKMON', 'PANEL_LIFTLEFT', 'PANEL_LIFTRIGHT']
    for (const i of skip) {
      if (this.type.includes(i)) {
        options.invisible = true
      }
    }
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

export { DFPanel, DFPlatformOptions }
