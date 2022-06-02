import { binaryPanelTypeToString, binaryPanelFlagToString, binaryItemOptionsToString, binaryItemTypeToString, binaryAreaToString, binaryMonsterToString, binaryTriggerEffectPosToString, binaryTriggerEffectTypeToString, binaryTriggerEffectToString, binaryTriggerShotAimToString, binaryTriggerShotTargetToString, binaryTriggerShotToString, binaryHitTypeToString, binaryTriggerMessageDestToString, binaryTriggerMessageKindToString, binaryTriggerScoreTeamToString, binaryTriggerScoreActionToString, binaryTriggerMusicActionToString, binaryMonsterBehaviourToString, binaryEffectActionToString, binaryTriggerTypeToString, binaryActivateTypeToString, binaryKeysToString } from './df-constants.mjs'
import { getTriggerUsedData } from './df-trigger.mjs'
import { readSliceChar, readSliceWord, readSliceByte, readSliceLongWord } from './utility.mjs'

class DFBinaryParser {
  handleMapBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 452
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    if (isWhole === false) {
      return null
    }
    const info = {
      name: '',
      author: '',
      description: '',
      music: '',
      sky: '',
      width: 0,
      height: 0
    }
    for (let i = 0; i < blocks; i += 1) {
      const pos = i * binsize
      const binblock = buffer.slice(pos, pos + binsize)
      let offset = 0
      info.name = readSliceChar(binblock, offset, 32)
      offset += 32
      info.author = readSliceChar(binblock, offset, 32)
      offset += 32
      info.description = readSliceChar(binblock, offset, 256)
      offset += 256
      info.music = readSliceChar(binblock, offset, 64)
      offset += 64
      info.sky = readSliceChar(binblock, offset, 64)
      offset += 64
      info.width = (readSliceWord(binblock, offset) ?? 1000)
      offset += 2
      info.height = (readSliceWord(binblock, offset) ?? 1000)
      offset += 2
    }
    return info
  }

  handleTextureBlock (/** @type {Uint8Array} */ buffer) {
    const size = buffer.length
    const binsize = 65
    const blocks = size / binsize
    const isWhole = Number.isInteger(blocks)
    const /** @type {any} */ textures = {}
    if (isWhole === false) {
      return null
    }
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
      const x = readSliceLongWord(binblock, offset, true)
      offset += 4
      const y = readSliceLongWord(binblock, offset, true)
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
      const x = readSliceLongWord(binblock, offset, true)
      offset += 4
      const y = readSliceLongWord(binblock, offset, true)
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
      const x = readSliceLongWord(binblock, offset, true)
      offset += 4
      const y = readSliceLongWord(binblock, offset, true)
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
        const first = readSliceWord(buffer, offset) ?? 0
        const second = readSliceWord(buffer, offset + (option.size / 2)) ?? 0
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
      const x = readSliceLongWord(binblock, offset, true) ?? 0
      offset += 4
      const y = readSliceLongWord(binblock, offset, true) ?? 0
      offset += 4
      const width = readSliceWord(binblock, offset) ?? 0
      offset += 2
      const height = readSliceWord(binblock, offset) ?? 0
      offset += 2
      const enabled = readSliceByte(binblock, offset) ?? 0
      offset += 1
      const texturepanel = readSliceLongWord(binblock, offset, true)
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
        enabled: (enabled === 0 ? 'false' : 'true'),
        texture_panel: (texturepanel !== -1 ? 'panel' + texturepanel?.toString(10) : null),
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

  checkSignature (/** @type {Uint8Array} */ buffer, offset = 0) {
    for (let i = 0; i <= 3; i++) {
      const number = buffer[offset + i]
      if (number !== undefined) {
        if (number !== 0) return false
      } else {
        return false
      }
    }
    return true
  }

  splitForSections (/** @type {Uint8Array} */ buffer) {
    const /** @type {any} */ data = {
      map: {
        size: 452, binblock: 7
      },
      texture: {
        size: 65, binblock: 1
      },
      panel: {
        size: 18, binblock: 2
      },
      item: {
        size: 10, binblock: 3
      },
      monster: {
        size: 10, binblock: 5
      },
      area: {
        size: 10, binblock: 4
      },
      trigger: {
        size: 148, binblock: 6
      }
    }
    const /** @type {any} */ sections = {}
    for (const i in data) {
      const section = data[i]
      if (section === undefined) continue
      const view = new Uint8Array(buffer)
      view.forEach((n, index) => {
        if (n !== section.binblock) return false
        let offset = index
        offset += 1
        const check = this.checkSignature(view, offset)
        offset += 4
        if (!check) return false
        const blockSize = readSliceLongWord(view, offset)
        if (blockSize === undefined || blockSize === 0) return false
        const magicValue = 2 ** 20
        if (blockSize >= magicValue) { // there's no way around this...
          return false
        }
        offset += 4
        const blocks = blockSize / section.size
        const isWhole = Number.isInteger(blocks)
        if (!isWhole) {
          return false
        }
        const copy = view.slice(index, index + 4 + 4 + blockSize + 1)
        if (sections[i] !== undefined) {
          if (sections[i].blocks > blocks) return false // if we have already found similiar stuff, prefer bigger section
        }
        sections[i] = {}
        sections[i].slice = copy
        sections[i].pos = index
        sections[i].blocks = blocks
        sections[i].size = section.size
        return true
      })
    }
    return sections
  }

  constructor (/** @type {Uint8Array} */ buffer) {
    const /** @type {any} */ mapObj = {}
    this.valid = true
    const sections = this.splitForSections(buffer)
    for (const i in sections) {
      const section = sections[i]
      if (section === undefined) {
        this.valid = false
        return
      }
      let offset = 0
      offset += 1 // skip binblock and reserved and size
      offset += 4
      offset += 4
      const start = offset
      const end = start + section.blocks * section.size
      const view = section.slice.slice(start, end)
      if (i === 'map') {
        const info = this.handleMapBlock(view)
        if (info === null) {
          this.valid = false
          return
        }
        mapObj.name = info.name
        mapObj.author = info.author
        mapObj.description = info.description
        mapObj.music = info.music
        mapObj.sky = info.sky
        mapObj.size = info.width.toString(10) + ',' + info.height.toString(10)
      } else if (i === 'texture') {
        const elements = this.handleTextureBlock(view)
        if (elements === null) {
          this.valid = false
          return
        }
        for (const i in elements) {
          const texture = elements[i]
          if (texture === undefined) {
            this.valid = false
            return
          }
          mapObj[i] = texture
        }
      } else if (i === 'panel') {
        const elements = this.handlePanelBlock(view)
        if (elements === null) {
          this.valid = false
          return
        }
        for (const i in elements) {
          const panel = elements[i]
          if (panel === undefined) {
            this.valid = false
            return
          }
          mapObj[i] = panel
        }
      } else if (i === 'item') {
        const elements = this.handleItemBlock(view)
        if (elements === null) {
          this.valid = false
          return
        }
        for (const i in elements) {
          const item = elements[i]
          if (item === undefined) {
            this.valid = false
            return
          }
          mapObj[i] = item
        }
      } else if (i === 'monster') {
        const elements = this.handleMonsterBlock(view)
        if (elements === null) {
          this.valid = false
          return
        }
        for (const i in elements) {
          const monster = elements[i]
          if (monster === undefined) {
            this.valid = false
            return
          }
          mapObj[i] = monster
        }
      } else if (i === 'area') {
        const elements = this.handleAreaBlock(view)
        if (elements === null) {
          this.valid = false
          return
        }
        for (const i in elements) {
          const area = elements[i]
          if (area === undefined) {
            this.valid = false
            return
          }
          mapObj[i] = area
        }
      } else if (i === 'trigger') {
        const elements = this.handleTriggerBlock(view)
        if (elements === null) {
          this.valid = false
          return
        }
        for (const i in elements) {
          const item = elements[i]
          if (item === undefined) {
            this.valid = false
            return
          }
          mapObj[i] = item
        }
      }
    }
    return mapObj
  }
}

export { DFBinaryParser }
