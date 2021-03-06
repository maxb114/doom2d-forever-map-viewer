import * as Magick from './magickApi.js'
function convertImage (/** @type {Uint8Array} */ buffer, /** @type {string} */ sourceExtension, /** @type {string} */ targetExtension) {
  const /** @type {Promise<ArrayBuffer>} */ promise = new Promise((resolve, reject) => {
    if (sourceExtension === targetExtension) resolve(buffer.buffer)
    const source = 'src' + '.' + sourceExtension
    const target = 'out' + '.' + targetExtension
    const image = { name: source, content: buffer }
    const convertCommand = ['convert', source, target]
    Magick.call([image], convertCommand).then((result) => {
      if (result.outputFiles.length <= 0 || result.outputFiles[0] === undefined) reject(Error('Error converting image!'))
      const output = result.outputFiles[0]
      const /** @type {Blob} */ blob = output.blob
      blob.arrayBuffer().then((arrayBuffer) => {
        resolve(arrayBuffer)
      }).catch((error) => {
        reject(error)
      })
    }).catch((error) => {
      reject(error)
    })
  })
  return promise
}

function cropImage (/** @type {Uint8Array} */ buffer, /** @type {string} */ sourceExtension, width = 0, height = 0, offsetx = 0, offsety = 0) {
  const /** @type {Promise<ArrayBuffer>} */ promise = new Promise((resolve, reject) => {
    const source = 'src' + '.' + sourceExtension
    const target = 'crop' + '.' + sourceExtension
    const image = { name: source, content: buffer }
    const convertCommand = ['convert', source, '-crop', width.toString(10) + 'x' + height.toString(10) + '+' +
    offsetx.toString(10) + '+' + offsety.toString(10), target]
    Magick.call([image], convertCommand).then((result) => {
      if (result.outputFiles.length <= 0 || result.outputFiles[0] === undefined) reject(Error('Error converting image!'))
      const output = result.outputFiles[0]
      const /** @type {Blob} */ blob = output.blob
      blob.arrayBuffer().then((arrayBuffer) => {
        resolve(arrayBuffer)
      }).catch((error) => {
        reject(error)
      })
    }).catch((error) => {
      reject(error)
    })
  })
  return promise
}

export { convertImage, cropImage }
