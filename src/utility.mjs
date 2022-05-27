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
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 244) return 'jpg'
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 238) return 'jpg'
  else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255 && buffer[3] === 225) return 'jpg'
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

function binaryIsBitSet (/** @type {number} */ n, /** @type {number} */ k) {
  if ((n & (1 << (k - 1))) > 0) return true
  else return false
}

const parse2Ints = (/** @type {string | undefined} */ e) => {
  if (e === undefined) return null
  const split = e.split(',', 2)
  if (split[0] === undefined || split[1] === undefined) return null
  const a = parseInt(split[0], 10)
  const b = parseInt(split[1], 10)
  return [a, b]
}

export { getExtensionFromBuffer, wadToJSON, numberToChar, binaryIsBitSet, parse2Ints }
