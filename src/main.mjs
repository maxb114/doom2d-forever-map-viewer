import { DfwadFrom } from './df-wad.mjs' 
const input = document.createElement('input')
input.type = 'file'

input.onchange = function () {
  if (input === null || input.files === null) return false
  const file = input.files[0]
  if (file === undefined) return false
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async function (event) {
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    const view = new Uint8Array(content)
    const wad = await DfwadFrom(view)
    const maps = wad.maps
    if (maps.length === 0) return true
    // create menu
    return true
  }
  return true
}

document.body.appendChild(input)
