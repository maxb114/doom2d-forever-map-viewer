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
  return 'unknown'
}

export { getExtensionFromBuffer }
