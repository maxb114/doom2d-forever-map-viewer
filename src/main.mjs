import { DfwadFrom } from './df-wad.mjs'
import { DFParser } from './df-parser.mjs'
import { DFMap } from './df-map.mjs'
import { DatabaseFrom } from './db.mjs'
const input = document.createElement('input')
input.type = 'file'
let /** @type {Database | null} */ db = null
try {
  db = await DatabaseFrom()
} catch (error) {
  console.log(error)
}
input.onchange = function () {
  if (input === null || input.files === null) return false
  const file = input.files[0]
  if (file === undefined) return false
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async function (event) {
    const selectId = 'map-select'
    const buttonId = 'load-button'
    const deleteSelect = document.getElementById(selectId)
    if (deleteSelect !== null) document.body.removeChild(deleteSelect)
    const deleteButton = document.getElementById(buttonId)
    if (deleteButton !== null) document.body.removeChild(deleteButton)
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    const view = new Uint8Array(content)
    const wad = await DfwadFrom(view)
    const maps = wad.maps
    if (maps.length === 0) return true
    const select = document.createElement('select')
    select.id = selectId
    document.body.appendChild(select)
    for (const map of maps) {
      const option = document.createElement('option')
      option.value = map.path
      option.text = map.path
      select.appendChild(option)
    }
    const button = document.createElement('button')
    button.innerHTML = 'Load map'
    button.id = 'load-button'
    button.onclick = function () {
      const value = select.value
      const resource = wad.findResourceByPath(value)
      if (resource === null) return false
      const parsed = new DFParser(resource.buffer)
      const map = new DFMap(parsed.parsed)
      return true
    }
    document.body.appendChild(button)
    return true
  }
  return true
}

async function init () {
  if (window.indexedDB === null || db === null) {
    console.log('Your browser lacks the required features.')
    return false
  }
  document.body.appendChild(input)
  return true
}

init()
