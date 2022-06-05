import { changeZoom, checkEssentialResources, getDatabaseObject, getMapsList, getRenderFlagsList, loadBufferAsWad, loadMapAndSetAsCurrent, moveCamera, moveCameraByDelta, saveCurrentMapOverview, saveCurrentWad, saveCurrentWadResources, saveEssentialResources, saveWadResources, setActiveCanvas, setCurrentWadName, setRenderFlag, setWad, updateMapRender } from './api.mjs'
const div = document.createElement('div')
const canvas = document.createElement('canvas')
const canvasDiv = document.createElement('div')
let screenHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)
let screenWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
canvasDiv.style.display = 'none'
div.style.margin = '0'
canvasDiv.style.margin = '0'
canvasDiv.appendChild(canvas)
document.body.style.margin = '0'
const input = document.createElement('input')
input.type = 'file'
init()

input.onchange = function () {
  if (input === null || input.files === null) return false
  const file = input.files[0]
  if (file === undefined) return false
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async function (event) {
    canvas.onmousedown = function () {}
    setCurrentWadName(file.name.toLowerCase())
    const selectId = 'map-select'
    const buttonId = 'load-button'
    const cacheButtonId = 'cache-button'
    const flagsDivId = 'flags'
    const zipButtonId = 'zip-button'
    const mapImageId = 'mapimage-button'
    const deleteArray = [selectId, buttonId, cacheButtonId, flagsDivId, zipButtonId, mapImageId]
    for (const elementid of deleteArray) {
      deleteElementById(elementid)
    }
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    setWad(await loadBufferAsWad(content))
    const cacheButton = document.createElement('button')
    cacheButton.innerHTML = 'Save resources'
    cacheButton.id = 'cache-button'
    cacheButton.onclick = async function () {
      await saveCurrentWadResources()
    }
    div.appendChild(cacheButton)
    const zipButton = document.createElement('button')
    zipButton.innerHTML = 'Convert to .dfz and .txt'
    zipButton.id = zipButtonId
    zipButton.onclick = async function () {
      await saveCurrentWad()
    }
    div.appendChild(zipButton)
    const maps = getMapsList()
    if (maps === null) return true
    const select = document.createElement('select')
    select.id = selectId
    div.appendChild(select)
    for (const map of maps) {
      const option = document.createElement('option')
      option.value = map.path
      option.text = map.path
      select.appendChild(option)
    }
    const button = document.createElement('button')
    button.innerHTML = 'Load map'
    button.id = 'load-button'
    button.onclick = async () => {
      deleteElementById(flagsDivId)
      deleteElementById(mapImageId)
      const value = select.value
      const result = await loadMapAndSetAsCurrent(value)
      if (result === null) return
      canvasDiv.style.display = ''
      const flagsDiv = document.createElement('div')
      flagsDiv.id = flagsDivId
      const allOptions = getRenderFlagsList()
      if (allOptions === null) return
      for (const renderOption of allOptions) {
        const object = renderOption[0]
        const set = renderOption[1]
        const input = document.createElement('input')
        input.type = 'checkbox'
        input.name = object.id
        input.id = object.id
        input.value = ''
        input.checked = set
        const label = document.createElement('label')
        label.htmlFor = input.id
        label.appendChild(document.createTextNode(object.full))
        input.onchange = async () => {
          setRenderFlag(input.id, input.checked)
          updateMapRender()
        }
        flagsDiv.appendChild(input)
        flagsDiv.appendChild(label)
      }
      div.appendChild(flagsDiv)
      canvas.height = screenHeight
      canvas.width = screenWidth
      setActiveCanvas(canvas)
      updateMapRender()
      moveCamera(0, 0)
      canvas.onmousedown = function () {
        canvas.onmousemove = (event) => {
          moveCameraByDelta(-event.movementX, -event.movementY)
        }
      }
      canvas.onmouseup = function () {
        canvas.onmousemove = null
      }
      document.onkeydown = function (event) {
        /*
        if (event.code === 'KeyT') {
          const wasmtest = async () => {
            try {
              const response = await fetch('./test_1.wasm')
              const wasm = await window.WebAssembly.instantiateStreaming(response, {
                nice: {
                  dick: moveCameraByDelta
                }
              })
              for (let i = 0; i <= 10; ++i) {
                wasm.instance.exports.main()
              }
            } catch (error) {
              return false
            }
          }
          wasmtest()
        }
        */
        if (event.code === 'KeyR') {
          changeZoom(100)
        } else if (event.code === 'KeyX') {
          changeZoom(-100)
        }
      }
      canvas.onmouseup = function () {
        canvas.onmousemove = null
      }
      const button = document.createElement('button')
      button.innerHTML = 'Save map as an image'
      button.id = mapImageId
      button.onclick = () => {
        saveCurrentMapOverview()
      }
      div.appendChild(button)
      return true
    }
    div.appendChild(button)
    return true
  }
  return true
}

function deleteElementById (/** @type {string} */ elementid) {
  const deleteElement = document.getElementById(elementid)
  if (deleteElement !== null) {
    deleteElement.innerHTML = ''
    div.removeChild(deleteElement)
  }
  return true
}

async function init () {
  if (window.indexedDB === null || getDatabaseObject() === null || canvas === null || div === null) {
    window.alert('Your browser lacks the required features.')
    return false
  }
  const check = await checkEssentialResources()
  if (check) {
    document.body.appendChild(canvasDiv)
    div.appendChild(input)
    document.body.appendChild(div)
  } else {
    const text = document.createTextNode('Doom 2D: Forever resources have not been found!')
    const br = document.createElement('br')
    const button = document.createElement('button')
    button.innerHTML = 'Download game resources from doom2d.org'
    button.id = 'download-button'
    button.onclick = async () => {
      await saveEssentialResources()
      document.body.removeChild(text)
      document.body.removeChild(br)
      document.body.removeChild(button)
      document.body.appendChild(canvasDiv)
      div.appendChild(input)
      document.body.appendChild(div)
      return true
    }
    document.body.appendChild(text)
    document.body.appendChild(br)
    document.body.appendChild(button)
  }
  return true
}
