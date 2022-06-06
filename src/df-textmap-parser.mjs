import * as tokenizr from './tokenizr.js'
const Tokenizr = tokenizr.wrapExport()
class DFTextParser {
  constructor (/** @type {string} */ content, checkValid = false) {
    const lexer = new Tokenizr()
    lexer.rule(/\((-?[0-9]+?)\s(-?[0-9]+?)\)/, (/** @type {any} */ ctx, /** @type {any} */ match) => {
      ctx.accept('double_assignment', [parseInt(match[1], 10), parseInt(match[2], 10)])
    })
    lexer.rule(/[a-zA-Z][a-zA-Z0-9_]*/, (/** @type {any} */ ctx) => {
      ctx.accept('id')
    })
    lexer.rule(/[+-]?[0-9]+/, (/** @type {any} */ ctx, /** @type {any} */ match) => {
      ctx.accept('number', parseInt(match[0]))
    })
    lexer.rule(/"(?<=")(.+?)(?=")"/, (/** @type {any} */ ctx, /** @type {any} */ match) => {
      ctx.accept('string', match[1].replace(/\\"/g, ''))
    })
    lexer.rule(/'(?<=')(.+?)(?=')'/, (/** @type {any} */ ctx, /** @type {any} */ match) => {
      ctx.accept('stringcurly', match[1].replace(/"'"/g, ''))
    })
    lexer.rule(/\/\/[^\r\n]*\r?\n/, (/** @type {any} */ ctx) => {
      ctx.ignore()
    })
    lexer.rule(/[ \t\r\n]+/, (/** @type {any} */ ctx) => {
      ctx.ignore()
    })
    lexer.rule(/{/, (/** @type {any} */ ctx) => {
      ctx.accept('open_curly_brace')
    })
    lexer.rule(/}/, (/** @type {any} */ ctx) => {
      ctx.accept('close_curly_brace')
    })
    lexer.rule(/\/\*(\*(?!\/)|[^*])*\*\//, (/** @type {any} */ ctx) => {
      ctx.ignore()
    })
    lexer.rule(/;/, (/** @type {any} */ ctx) => {
      ctx.accept('semicolon')
    })
    lexer.rule(/[|+'"]/, (/** @type {any} */ ctx) => {
      ctx.accept('char')
    })
    lexer.rule(/./, (/** @type {any} */ ctx) => {
      ctx.accept('other')
    })
    lexer.input(content)
    const tokenArray = lexer.tokens()
    let state = 'look for keyword'
    let /** @type {any} */ activeElement
    let /** @type {any} */ evaluatedElement
    const /** @type {any} */ copy = []
    const /** @type {any} */ mapObj = {}
    this.valid = false
    if (tokenArray !== undefined && tokenArray[0] !== undefined && tokenArray[0].value === 'map' && tokenArray[1] !== undefined && tokenArray[1].type === 'open_curly_brace' && tokenArray[tokenArray.length - 2] !== undefined && tokenArray[tokenArray.length - 2].type === 'close_curly_brace') this.valid = true
    if (!this.valid || checkValid) {
      return
    }
    tokenArray.forEach((token) => {
      if (token.type === 'other') {
        this.valid = false
        return
      }
      const tokenIndex = tokenArray.indexOf(token)
      const prevTokenIndex = tokenIndex - 1
      const prevToken = (prevTokenIndex >= 0 ? tokenArray[prevTokenIndex] : undefined)
      if (token.type === 'id' || token.type === 'string' || token.type === 'stringcurly' || token.type === 'double_assignment' || token.type === 'char' || token.type === 'number') {
        if (state === 'search') {
          state = 'evaluate'
          evaluatedElement = token
        } else if (state === 'evaluate') {
          activeElement[evaluatedElement.value] = (activeElement[evaluatedElement.value] !== undefined ? activeElement[evaluatedElement.value] : '') + token.value
        }
      } else if (token.type === 'open_curly_brace') {
        if (prevToken.type === 'id') {
          const parentPrevTokenIndex = tokenIndex - 2
          const parentPrevToken = (parentPrevTokenIndex >= 0 ? tokenArray[parentPrevTokenIndex] : undefined)
          const newElement = { _token: prevToken, _hint: (parentPrevToken !== undefined && parentPrevToken.value !== undefined && parentPrevToken.value !== ';' ? parentPrevToken.value : undefined) }
          copy.push(newElement)
          activeElement = newElement
          const parentIndex = tokenIndex - 1
          if (parentPrevTokenIndex < 0 || parentIndex < 0) {
            state = 'search' // we should start looking for properties
            return null
          }
          const objectParentIndex = copy.length - 2
          if (objectParentIndex < 0 || objectParentIndex >= copy.length) {
            return null
          }
          const currentScopeObject = copy[copy.length - 2]
          if (currentScopeObject === undefined) {
            return null
          }
          const parentOfPrev = tokenArray[parentPrevTokenIndex]
          if (currentScopeObject[parentOfPrev.value] !== undefined) {
            delete currentScopeObject[parentPrevToken.value] // delete wrongly-assumed properties
          }
          state = 'search'
        }
      } else if (token.type === 'close_curly_brace') {
        const lastElement = copy.pop()
        const parentIndex = copy.length - 1
        if (parentIndex < 0 || parentIndex >= copy.length) {
          mapObj[lastElement._token.value] = lastElement
        } else {
          const parentElement = copy[parentIndex]
          if (parentElement._token.type === 'id') {
            parentElement[lastElement._token.value] = lastElement
          } else {
            mapObj[lastElement._token.value] = lastElement
          }
        }
        state = ''
      } else if (token.type === 'semicolon') {
        state = 'search'
      }
      return true
    })
    this.mapObject = mapObj
  }
}

export { DFTextParser }
