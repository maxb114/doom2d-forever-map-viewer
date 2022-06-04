function numberToChar (/** @type {number} */ number) {
  return String.fromCharCode(number)
}

function getExtensionFromBuffer (/** @type {Uint8Array} */ buffer) {
  if (buffer[0] === undefined || buffer[1] === undefined || buffer[2] === undefined || buffer[3] === undefined || buffer[4] === undefined || buffer[5] === undefined) return 'unknown'
  if (numberToChar(buffer[0]) === 'P' && numberToChar(buffer[1]) === 'K' && buffer[2] === 3 && buffer[3] === 4) return 'dfzip'
  else if (numberToChar(buffer[0]) === 'P' && numberToChar(buffer[1]) === 'K' && buffer[2] === 5 && buffer[3] === 6) return 'dfzip'
  else if (numberToChar(buffer[0]) === 'P' && numberToChar(buffer[1]) === 'A' && numberToChar(buffer[2]) === 'C' && numberToChar(buffer[3]) === 'K') return 'dfpack'
  else if (numberToChar(buffer[0]) === 'S' && numberToChar(buffer[1]) === 'P' && numberToChar(buffer[2]) === 'A' && numberToChar(buffer[3]) === 'K') return 'dfpack'
  else if (numberToChar(buffer[0]) === 'D' && numberToChar(buffer[1]) === 'F' && numberToChar(buffer[2]) === 'W' && numberToChar(buffer[3]) === 'A' &&
    numberToChar(buffer[4]) === 'D' && buffer[5] === 1) return 'dfwad'
  else if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 &&
    buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 &&
    buffer[6] === 26 && buffer[7] === 10) return 'png'
  else if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56 &&
    buffer[4] === 55 && buffer[5] === 97) return 'gif'
  else if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56 &&
    buffer[4] === 57 && buffer[5] === 97) return 'gif'
  else if (buffer[0] === 56 && buffer[1] === 66 && buffer[2] === 80 && buffer[3] === 83) return 'psd'
  else if (buffer[0] === 66 && buffer[1] === 77) return 'bmp'
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 219) return 'jpg'
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 244) return 'jpg' // perhaps erroneous?
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 224) return 'jpg'
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 238) return 'jpg'
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 225) return 'jpg'
  else if (readSliceByte(buffer, buffer.length - 1) === 0 && readSliceByte(buffer, buffer.length - 2) === 46 && readSliceChar(buffer, buffer.length - 18, 16) === 'TRUEVISION-XFILE') return 'tga'
  else if (buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 2 && buffer[3] === 0) return 'tga' // a very approximate guess
  return 'unknown'
}

function wadToJSON (/** @type {Uint8Array} */ mapArray) {
  const win1251 = new TextDecoder('windows-1251')
  if (mapArray === undefined || mapArray[6] === undefined || mapArray[7] === undefined || mapArray.length < 8) return {}
  const longwordArray = new ArrayBuffer(4)
  const view1 = new Uint32Array(longwordArray)
  const view2 = new Uint8Array(longwordArray)
  const /** @type {any} **/ wadObject = {}
  const recordCount1 = mapArray[6].toString(2).padStart(8, '0')
  const recordCount2 = mapArray[7].toString(2).padStart(8, '0')
  if (recordCount1 === undefined || recordCount2 === undefined) return {}
  const recordCountString = recordCount2 + recordCount1
  const recordCount = parseInt(recordCountString, 2)
  let offset = 8
  let parentSection = ''
  for (let i = 0; i < recordCount; ++i) {
    if (view2 === undefined || view1 === undefined) return {}
    const memName = mapArray.slice(offset, offset + 16)
    let structName = ''
    memName.forEach((/** @type {number} */ e) => {
      if (e === 0) return
      structName = structName + win1251.decode(Uint8Array.from([e]))
    })
    for (let x = 16; x <= 19; ++x) {
      const val = mapArray[offset + x]
      if (val === undefined) return {}
      view2[(x - 16)] = val
    }
    const memAddress = view1[0]
    for (let x = 20; x <= 23; ++x) {
      const val = mapArray[offset + x]
      if (val === undefined) return {}
      view2[(x - 20)] = val
    }
    const memLength = view1[0]
    let type = 'resource'
    if ((memLength === 0) && (memAddress === 0)) parentSection = structName
    if (parentSection === structName || parentSection === '') type = 'parent'
    wadObject[type + i.toString()] = {
      memAddress,
      memLength,
      type,
      parentSection: (parentSection !== structName ? parentSection : ''),
      name: structName
    }
    offset = offset + 24
  }
  return wadObject
}

function binaryIsBitSet (/** @type {number} */ num, /** @type {number} */ bit) {
  return ((num >> bit) % 2 !== 0)
}

const parse2Ints = (/** @type {string | undefined} */ e) => {
  if (e === undefined) return null
  const split = e.split(',', 2)
  if (split[0] === undefined || split[1] === undefined) return null
  const a = parseInt(split[0], 10)
  const b = parseInt(split[1], 10)
  return [a, b]
}

const decoder = new TextDecoder('windows-1251')
const encoder = new TextEncoder()
const utf8decoder = new TextDecoder('utf-8')

function readSliceChar (/** @type {Uint8Array} */ buffer, /** @type {number} */ pos, /** @type {number} */ offset, utf8 = false) {
  const nameSlice = buffer.slice(pos, pos + offset)
  let val = ''
  nameSlice.forEach(/** @type {number} */ e => {
    if (e === 0) return false
    if (utf8 === true) val = val + String.fromCharCode(e)
    else val = val + decoder.decode(Uint8Array.from([e]))
    return true
  })
  return val
}

function readSliceLongWord (/** @type {Uint8Array} */ buffer, /** @type {number} */ pos, signed = false) {
  if (signed) {
    const converted = new Int8Array(buffer)
    const slice = converted.slice(pos, pos + 4)
    const longwordArray = new ArrayBuffer(4)
    const view1 = new Int8Array(longwordArray)
    slice.forEach((e, index) => {
      view1[index] = e
      return true
    })
    const createRequiredArray = (/** @type {ArrayBuffer} */ buffer) => {
      return new Int32Array(buffer)
    }
    const view2 = createRequiredArray(longwordArray)
    const number = view2[0]
    return number
  } else {
    const nameSlice = buffer.slice(pos, pos + 4)
    const longwordArray = new ArrayBuffer(4)
    const view1 = new Uint32Array(longwordArray)
    const view2 = new Uint8Array(longwordArray)
    nameSlice.forEach((e, index) => {
      view2[index] = e
    })
    const number = view1[0]
    return number
  }
}

function readSliceWord (/** @type {Uint8Array} */ buffer, /** @type {number} */ pos) {
  const nameSlice = buffer.slice(pos, pos + 2)
  const longwordArray = new ArrayBuffer(4)
  const view1 = new Uint32Array(longwordArray)
  const view2 = new Uint8Array(longwordArray)
  nameSlice.forEach(/** @type {number} */ e => {
    view2[nameSlice.indexOf(e)] = e
  })
  return view1[0]
}

function readSliceByte (/** @type {Uint8Array} */ buffer, /** @type {number} */ pos) {
  const nameSlice = buffer.slice(pos, pos + 1)
  const longwordArray = new ArrayBuffer(4)
  const view1 = new Uint32Array(longwordArray)
  const view2 = new Uint8Array(longwordArray)
  nameSlice.forEach(/** @type {number} */ e => {
    view2[nameSlice.indexOf(e)] = e
  })
  return view1[0]
}

function splitPath (/** @type {string} */ path) {
  let split = path.split('/')
  split = split.filter((item) => item !== '/')
  return split
}

function convertResourcePath (/** @type {string} */ path, /** @type {string} */ prefix = '') {
  let loadPath = path.replaceAll('\\', '/')
  if (loadPath.charAt(0) === ':') {
    if (loadPath.charAt(1) === '/') loadPath = loadPath.replace('/', '') // remove first slash
    loadPath = prefix + loadPath // add map name for internal resources
  }
  loadPath = loadPath.toLowerCase() // lower case for now
  return loadPath
}

function trimStringBySize (/** @type {string} */ value, /** @type {number} */ size) {
  const bytes = encoder.encode(value)
  const slice = bytes.slice(0, size)
  const trimmed = utf8decoder.decode(slice)
  return trimmed
}

function getFileNameWithoutExtension (/** @type {string} */ path) {
  const match = /^(.*)\.([0-9a-z]+)?$/
  const matches = path.match(match)
  if (matches === null) return path
  else return matches[1]
}

function clamp (/** @type {number} */ value, /** @type {number} */ min, /** @type {number} */ max) {
  if (value < min) return min
  else if (value > max) return max
  return value
}

export { getExtensionFromBuffer, wadToJSON, numberToChar, binaryIsBitSet, parse2Ints, readSliceByte, readSliceChar, readSliceLongWord, readSliceWord, splitPath, convertResourcePath, trimStringBySize, getFileNameWithoutExtension, clamp, convertedResourcePathToGame }
