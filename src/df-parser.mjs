import { numberToChar, readSliceByte, readSliceChar, readSliceLongWord, readSliceWord } from './utility.mjs'
import * as tokenizr from './tokenizr.js'
import { binaryActivateTypeToString, binaryAreaToString, binaryEffectActionToString, binaryHitTypeToString, binaryItemOptionsToString, binaryItemTypeToString, binaryKeysToString, binaryMonsterBehaviourToString, binaryMonsterToString, binaryPanelFlagToString, binaryPanelTypeToString, binaryTriggerEffectPosToString, binaryTriggerEffectToString, binaryTriggerEffectTypeToString, binaryTriggerMessageDestToString, binaryTriggerMessageKindToString, binaryTriggerMusicActionToString, binaryTriggerScoreActionToString, binaryTriggerScoreTeamToString, binaryTriggerShotAimToString, binaryTriggerShotTargetToString, binaryTriggerShotToString, binaryTriggerTypeToString } from './df-constants.mjs'
import { getTriggerUsedData } from './df-trigger.mjs'
const Tokenizr = tokenizr.wrapExport()

class DFBinaryParser {
  handleTextureBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 65
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    const /** @type {any} */ textures = {}
    if (isWhole === false) return null
    for (let i = 0; i < blocks; ++i) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      const texture = readSliceChar(binblock, offset, offset + 64)
      offset += 64
      const animated = readSliceByte(binblock, offset)
      const obj = {
        path: texture,
        animated: animated === 1,
        _hint: 'texture',
        _token: { value: '' }
      }
      obj._token.value = 'texture' + i.toString(10)
      textures['texture' + i.toString(10)] = obj
    }
    return textures
  }

  handlePanelBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 18
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    if (!isWhole) return null
    const /** @type {any} */ panels = {}
    for (let i = 0; i < blocks; ++i) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      const x = readSliceLongWord(binblock, offset, true)
      offset += 4
      const y = readSliceLongWord(binblock, offset, true)
      offset += 4
      const width = readSliceWord(binblock, offset)
      offset += 2
      const height = readSliceWord(binblock, offset)
      offset += 2
      const texture = readSliceWord(binblock, offset)
      offset += 2
      const type = readSliceWord(binblock, offset)
      offset += 2
      const alpha = readSliceByte(binblock, offset)
      offset += 1
      const flags = readSliceByte(binblock, offset)
      offset += 1
      const obj = {
        position: x?.toString(10) + ',' + y?.toString(10),
        size: width?.toString(10) + ',' + height?.toString(10),
        texture: 'texture' + texture?.toString(10),
        alpha: (alpha === 0 ? undefined : alpha),
        type: binaryPanelTypeToString(type),
        flags: binaryPanelFlagToString(flags),
        _hint: 'panel',
        _token: { value: '' }
      }
      obj._token.value = 'panel' + i.toString(10)
      panels['panel' + i.toString(10)] = obj
    }
    return panels
  }

  handleItemBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 10
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    if (!isWhole) return null
    const /** @type {any} */ items = {}
    for (let i = 0; i < blocks; ++i) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      const x = readSliceLongWord(binblock, offset)
      offset += 4
      const y = readSliceLongWord(binblock, offset)
      offset += 4
      const type = readSliceByte(binblock, offset)
      offset += 1
      const options = readSliceByte(binblock, offset)
      offset += 1
      const convertoptions = binaryItemOptionsToString(options)
      const obj = {
        position: x?.toString(10) + ',' + y?.toString(10),
        type: binaryItemTypeToString(type),
        options: convertoptions,
        _hint: 'item',
        _token: { value: '' }
      }
      obj._token.value = 'item' + i.toString(10)
      items['item' + i.toString(10)] = obj
    }
    return items
  }

  handleAreaBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 10
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    if (!isWhole) return null
    const /** @type {any} */ areas = {}
    for (let i = 0; i < blocks; ++i) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      const x = readSliceLongWord(binblock, offset)
      offset += 4
      const y = readSliceLongWord(binblock, offset)
      offset += 4
      const type = readSliceByte(binblock, offset)
      offset += 1
      const direction = readSliceByte(binblock, offset)
      offset += 1
      const obj = {
        position: x?.toString(10) + ',' + y?.toString(10),
        type: binaryAreaToString(type),
        direction: (direction === 1 ? 'DIR_RIGHT' : 'DIR_LEFT'),
        _hint: 'area',
        _token: { value: '' }
      }
      obj._token.value = 'area' + i.toString(10)
      areas['area' + i.toString(10)] = obj
    }
    return areas
  }

  handleMonsterBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 10
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    if (!isWhole) return null
    const /** @type {any} */ monsters = {}
    for (let i = 0; i < blocks; ++i) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      const x = readSliceLongWord(binblock, offset)
      offset += 4
      const y = readSliceLongWord(binblock, offset)
      offset += 4
      const type = readSliceByte(binblock, offset)
      offset += 1
      const direction = readSliceByte(binblock, offset)
      offset += 1
      const obj = {
        position: x?.toString(10) + ',' + y?.toString(10),
        type: binaryMonsterToString(type),
        direction: (direction === 1 ? 'DIR_RIGHT' : 'DIR_LEFT'),
        _hint: 'monster',
        _token: { value: '' }
      }
      obj._token.value = 'monster' + i.toString(10)
      monsters['monster' + i.toString(10)] = obj
    }
    return monsters
  }

  handleTriggerData (/** @type {Uint8Array} */ buffer, /** @type {string} */ type) {
    const /** @type {any} */ triggerDataObject = {}
    const options = getTriggerUsedData(type)
    let offset = 0
    for (const option of options) {
      if (option.size === -1) continue // skip text-only properties
      let value = null
      if (option.handler === 'byte') {
        const number = readSliceByte(buffer, offset) ?? 0
        if (type === 'TRIGGER_EFFECT' && option.path === 'pos') value = binaryTriggerEffectPosToString(number)
        else if (type === 'TRIGGER_EFFECT' && option.path === 'subtype') value = binaryTriggerEffectTypeToString(number)
        else if (type === 'TRIGGER_EFFECT' && option.path === 'type') value = binaryTriggerEffectToString(number)

        else if (type === 'TRIGGER_SHOT' && option.path === 'aim') value = binaryTriggerShotAimToString(number)
        else if (type === 'TRIGGER_SHOT' && option.path === 'target') value = binaryTriggerShotTargetToString(number)
        else if (type === 'TRIGGER_SHOT' && option.path === 'type') value = binaryTriggerShotToString(number)

        else if (type === 'TRIGGER_DAMAGE' && option.path === 'kind') value = binaryHitTypeToString(number)

        else if (type === 'TRIGGER_MESSAGE' && option.path === 'dest') value = binaryTriggerMessageDestToString(number)
        else if (type === 'TRIGGER_MESSAGE' && option.path === 'kind') value = binaryTriggerMessageKindToString(number)

        else if (type === 'TRIGGER_SCORE' && option.path === 'team') value = binaryTriggerScoreTeamToString(number)
        else if (type === 'TRIGGER_SCORE' && option.path === 'action') value = binaryTriggerScoreActionToString(number)

        else if (type === 'TRIGGER_MUSIC' && option.path === 'action') value = binaryTriggerMusicActionToString(number)

        else if (type === 'TRIGGER_SPAWNITEM' && option.path === 'type') value = binaryItemTypeToString(number)

        else if (type === 'TRIGGER_SPAWNMONSTER' && option.path === 'behaviour') value = binaryMonsterBehaviourToString(number)
        else if (type === 'TRIGGER_SPAWNMONSTER' && option.path === 'type') value = binaryMonsterToString(number)

        else if (option.path === 'direction') value = (number === 1 ? 'DIR_RIGHT' : 'DIR_LEFT')
        else value = number.toString(10)
      } else if (option.handler === 'word') {
        const number = readSliceWord(buffer, offset) ?? 0
        if (type === 'TRIGGER_SPAWNITEM' && option.path === 'effect') value = binaryEffectActionToString(number) 
        else if (type === 'TRIGGER_SPAWNMONSTER' && option.path === 'effect') value = binaryEffectActionToString(number)
        else value = number.toString(10)
      } else if (option.handler === 'longword') {
        const number = readSliceLongWord(buffer, offset, true) // don't lose the sign
        if (option.path === 'monsterid') {
          if (number === undefined) value = null
          else if (number !== 0) value = 'monster' + (number - 1).toString(10)
          else value = null
        } else if (option.path === 'panelid') {
          if (number !== -1) value = 'panel' + number?.toString(10)
          else value = null
        }
      } else if (option.handler === 'bool') {
        const number = readSliceByte(buffer, offset)
        if (number === 0) value = 'false'
        else value = 'true'
      } else if (option.handler === 'double_longword') {
        let signed = false
        if (option.path === 'position' || option.path === 'target') signed = true
        const first = readSliceLongWord(buffer, offset, signed) ?? 0
        const second = readSliceLongWord(buffer, offset + (option.size / 2), signed) ?? 0
        value = first.toString(10) + ',' + second.toString(10)
      } else if (option.handler === 'double_word') {
        let signed = false
        if (option.path === 'position' || option.path === 'target') signed = true
        const first = readSliceWord(buffer, offset, signed) ?? 0
        const second = readSliceWord(buffer, offset + (option.size / 2), signed) ?? 0
        value = first.toString(10) + ',' + second.toString(10)
      } else if (option.handler === 'char') {
        value = readSliceChar(buffer, offset, option.size)
      } else if (option.handler === 'direction') {
        const number = readSliceByte(buffer, offset)
        if (number === 0) value = 'DIR_LEFT'
        else value = 'DIR_RIGHT'
      } else if (option.handler === 'sbyte') {
        const number = (readSliceByte(buffer, offset) ?? 0) << 24 >> 24
        value = number
      }
      value = value ?? option.defaultValue // initialise properties if not they are not set
      triggerDataObject[option.path] = value
      offset += option.size
    }
    return triggerDataObject
  }

  handleTriggerBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 148
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    if (!isWhole) return null
    const /** @type {any} */ triggers = {}
    for (let i = 0; i < blocks; ++i) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      const x = readSliceLongWord(binblock, offset) ?? 0
      offset += 4
      const y = readSliceLongWord(binblock, offset) ?? 0
      offset += 4
      const width = readSliceWord(binblock, offset) ?? 0
      offset += 2
      const height = readSliceWord(binblock, offset) ?? 0
      offset += 2
      const enabled = readSliceByte(binblock, offset) ?? 0
      offset += 1
      const texturepanel = readSliceLongWord(binblock, offset)
      offset += 4
      const type = binaryTriggerTypeToString(readSliceByte(binblock, offset) ?? 0)
      offset += 1
      const activateType = binaryActivateTypeToString(readSliceByte(binblock, offset) ?? 0)
      offset += 1
      const keys = binaryKeysToString(readSliceByte(binblock, offset) ?? 0)
      offset += 1
      const triggerData = binblock.slice(offset, 128) // TODO: handle triggerdata
      offset += 128
      const triggerDataObject = this.handleTriggerData(triggerData, type)
      const obj = {
        position: x?.toString(10) + ',' + y?.toString(10),
        size: width?.toString(10) + ',' + height?.toString(10),
        enabled: (enabled === 1 ? 'true' : 'false'),
        texture_panel: (texturepanel !== 255 ? 'panel' + texturepanel?.toString(10) : null),
        type,
        activate_type: activateType,
        keys,
        triggerdata: triggerDataObject,
        _hint: 'trigger',
        _token: { value: '' }
      }
      obj._token.value = 'trigger' + i.toString(10)
      triggers['trigger' + i.toString(10)] = obj
    }
    return triggers
  }

  constructor (/** @type {Uint8Array} */ buffer) {
    let offset = 0
    // const signature = readSliceChar(buffer, offset, 3)
    offset += 3
    // const version = readSliceByte(buffer, offset)
    offset += 1
    // const type = readSliceByte(buffer, offset)
    offset += 1
    // const reserved = readSliceLongWord(buffer, offset)
    offset += 4
    // const blocksize = readSliceLongWord(buffer, offset)
    offset += 4
    const name = readSliceChar(buffer, offset, 32)
    offset += 32
    const author = readSliceChar(buffer, offset, 32)
    offset += 32
    const description = readSliceChar(buffer, offset, 256)
    offset += 256
    const music = readSliceChar(buffer, offset, 64)
    offset += 64
    const sky = readSliceChar(buffer, offset, 64)
    offset += 64
    const width = readSliceWord(buffer, offset)
    offset += 2
    const height = readSliceWord(buffer, offset)
    offset += 2
    let state = 'looking for texture'
    // offset = 0
    const /** @type {any} */ mapObj = {}
    for (; offset < buffer.length; offset++) {
      const index = offset
      const value = buffer[index]
      if (value === undefined) continue
      if (state === 'looking for texture') {
        if (value === 1) { // texture, size 65
          offset += 1
          // const reserved = readSliceLongWord(buffer, offset)
          offset += 4
          const blocksize = readSliceLongWord(buffer, offset)
          offset += 4
          if (blocksize === undefined) return
          const textureBlock = buffer.slice(offset, offset + blocksize)
          const textures = this.handleTextureBlock(textureBlock)
          for (const i in textures) {
            const element = textures[i]
            if (element === undefined) continue
            mapObj[i] = element
          }
          offset += blocksize - 1
          state = 'looking for panel'
        }
      } else if (state === 'looking for panel') {
        if (value === 2) { // panel, size 18
          offset += 1
          // const reserved = readSliceLongWord(buffer, offset)
          offset += 4
          const blocksize = readSliceLongWord(buffer, offset)
          offset += 4
          if (blocksize === undefined) return
          const panelBlock = buffer.slice(offset, offset + blocksize)
          const panels = this.handlePanelBlock(panelBlock)
          for (const i in panels) {
            const element = panels[i]
            if (element === undefined) continue
            mapObj[i] = element
          }
          offset += blocksize - 1
          state = 'looking for item'
        }
      } else if (state === 'looking for item') {
        if (value === 3) {
          offset += 1
          // const reserved = readSliceLongWord(buffer, offset)
          offset += 4
          const blocksize = readSliceLongWord(buffer, offset)
          offset += 4
          if (blocksize === undefined) return
          const itemBlock = buffer.slice(offset, offset + blocksize)
          const items = this.handleItemBlock(itemBlock)
          for (const i in items) {
            const element = items[i]
            if (element === undefined) continue
            mapObj[i] = element
          }
          offset += blocksize - 1
          state = 'looking for monster'
        }
      } else if (state === 'looking for monster') {
        if (value === 5) { // why not 4?
          offset += 1
          // const reserved = readSliceLongWord(buffer, offset)
          offset += 4
          const blocksize = readSliceLongWord(buffer, offset)
          offset += 4
          if (blocksize === undefined) return
          const monsterBlock = buffer.slice(offset, offset + blocksize)
          const monsters = this.handleMonsterBlock(monsterBlock)
          for (const i in monsters) {
            const element = monsters[i]
            if (element === undefined) continue
            mapObj[i] = element
          }
          offset += blocksize - 1
          state = 'looking for area'
        }
      } else if (state === 'looking for area') {
        if (value === 4) {
          offset += 1
          // const reserved = readSliceLongWord(buffer, offset)
          offset += 4
          const blocksize = readSliceLongWord(buffer, offset)
          offset += 4
          if (blocksize === undefined) return
          const areaBlock = buffer.slice(offset, offset + blocksize)
          const areas = this.handleAreaBlock(areaBlock)
          for (const i in areas) {
            const element = areas[i]
            if (element === undefined) continue
            mapObj[i] = element
          }
          offset += blocksize - 1
          state = 'looking for trigger'
        }
      } else if (state === 'looking for trigger') {
        if (value === 6) {
          offset += 1
          // const reserved = readSliceLongWord(buffer, offset)
          offset += 4
          const blocksize = readSliceLongWord(buffer, offset)
          offset += 4
          if (blocksize === undefined) return
          const triggerBlock = buffer.slice(offset, offset + blocksize)
          const triggers = this.handleTriggerBlock(triggerBlock)
          for (const i in triggers) {
            const element = triggers[i]
            if (element === undefined) continue
            mapObj[i] = element
          }
          offset += blocksize - 1
          state = 'looking for trigger'
          break
        }
      }
    }
    mapObj.name = name
    mapObj.author = author
    mapObj.description = description
    mapObj.music = music
    mapObj.sky = sky
    mapObj.size = width?.toString(10) + ',' + height?.toString(10)
    return mapObj
  }
}

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
    lexer.rule(/[|+]/, (/** @type {any} */ ctx) => {
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
    if ((!this.valid && !checkValid) || checkValid) {
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

class DFParser {
  constructor (/** @type {Uint8Array} */ buffer) {
    this.type = 'unknown'
    this.valid = false
    this.buffer = buffer
    if (buffer[0] === undefined || buffer[1] === undefined || buffer[2] === undefined || buffer[3] === undefined) {
      return
    }
    const isBinary = (numberToChar(buffer[0]) === 'M' && numberToChar(buffer[1]) === 'A' && numberToChar(buffer[2]) === 'P' && buffer[3] === 1)
    if (isBinary) {
      const parsed = new DFBinaryParser(buffer)
      this.parsed = parsed
      this.valid = true
      this.type = 'binary'
    } else { // text map
      const decoder = new TextDecoder('utf-8')
      const view = decoder.decode(buffer)
      const onlyPrintable = /^[ -~\t\n\r]+$/.test(view)
      if (!onlyPrintable) {
        return
      }
      const parsed = new DFTextParser(view)
      if (parsed.valid !== true) {
        return
      } else this.valid = true
      this.type = 'text'
      if (parsed.mapObject.map === undefined) parsed.mapObject.map = {} // we don't know what may happen
      this.parsed = parsed.mapObject.map
    }
  }
}

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
    lexer.rule(/[ \t\r\n]+/, (/** @type {any} */ ctx) => { // whitespace
      ctx.ignore()
    })
    lexer.rule(/./, (/** @type {any} */ ctx) => {
      ctx.accept('char')
    })
    content = content.trim()
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
          parsedObject[activeElement.value] = token.value
          state = 'search'
        }
      } else if (token.type === 'assignment') {
        state = 'evaluation'
      }
    }
    this.parsed = {
      /** @type {string} */ resource: parsedObject.resource ?? '',
      /** @type {number} */ frameWidth: parsedObject.framewidth ?? 0,
      /** @type {number} */ frameHeight: parsedObject.frameheight ?? 0
    }
  }
}

export { DFParser, DFAnimTextureParser }
