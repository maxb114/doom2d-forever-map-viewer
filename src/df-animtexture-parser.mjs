import * as tokenizr from './tokenizr.js'
const Tokenizr = tokenizr.wrapExport()
class DFAnimTextureParser {
  constructor (/** @type {string} */ content) {
    this.content = content
    const lexer = new Tokenizr()
    lexer.rule(/[+-]?[0-9]+/, (/** @type {any} */ ctx, /** @type {any} */ match) => {
      ctx.accept('number', parseInt(match[0]))
    })
    lexer.rule(/[a-zA-Z][a-zA-Z0-9_.]*/, (/** @type {any} */ ctx) => {
      ctx.accept('id')
    })
    lexer.rule(/=/, (/** @type {any} */ ctx) => {
      ctx.accept('assignment')
    })
    lexer.rule(/\/\/[^\r\n]*\r?\n/, (/** @type {any} */ ctx) => { // comments
      ctx.ignore()
    })
    lexer.rule(/\n/, (/** @type {any} */ ctx) => {
      ctx.accept('break')
    })
    lexer.rule(/[ \t\r]+/, (/** @type {any} */ ctx) => { // whitespace
      ctx.ignore()
    })
    lexer.rule(/./, (/** @type {any} */ ctx) => {
      ctx.accept('char')
    })
    lexer.input(content)
    const /** @type {any} */ parsedObject = {}
    const tokens = lexer.tokens()
    let /** @type {String} */ state = 'search'
    let activeElement
    for (const token of tokens) {
      if (token.type === 'id' || token.type === 'number' || token.type === 'char') {
        if (state === 'search') {
          activeElement = token
          state = 'assign' // look for assignment symbol
        } else if (state === 'evaluation') {
          let prepend = ''
          if (activeElement !== undefined && activeElement.value !== undefined && parsedObject[activeElement.value] !== undefined) prepend = parsedObject[activeElement.value]
          parsedObject[activeElement.value] = prepend + token.value
        }
      } else if (token.type === 'assignment') {
        state = 'evaluation'
      } else if (token.type === 'break') {
        state = 'search'
      }
    }
    this.parsed = {
      /** @type {string} */ resource: parsedObject.resource ?? '',
      /** @type {number} */ frameWidth: parsedObject.framewidth ?? 0,
      /** @type {number} */ frameHeight: parsedObject.frameheight ?? 0
    }
  }
}

export { DFAnimTextureParser }
