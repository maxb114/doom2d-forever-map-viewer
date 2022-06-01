class DFTexture {
  constructor (path = '', animated = false) {
    this.path = path
    this.animated = animated
    this.id = 'default'
    this.editorPath = ''
  }

  asText () {
    let msg = ''
    msg = msg + '\n'
    msg = msg + ' '.repeat(2) + 'texture' + ' ' + this.id + ' ' + '{' + '\n'
    msg = msg + ' '.repeat(4) + 'path' + ' ' + "'" + this.path + "'" + ';' + '\n'
    msg = msg + ' '.repeat(4) + 'animated' + ' ' + (this.animated ? 'true' : 'false') + ';' + '\n'
    msg = msg + ' '.repeat(2) + '}' + '\n'
    return msg
  }
}

export { DFTexture }
