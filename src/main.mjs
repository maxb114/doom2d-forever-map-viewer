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
    const selectId = 'map-select'
    const toDelete = document.getElementById(selectId)
    if (toDelete !== null) document.body.removeChild(toDelete)
    const select = document.createElement('select')
    select.id = selectId
    document.body.appendChild(select)
    for (const map of maps) {
      const option = document.createElement('option')
      option.value = map.path
      option.text = map.path
      select.appendChild(option)
    }
    return true
  }
  return true
}

document.body.appendChild(input)
