const input = document.createElement('input')
input.type = 'file'

input.onchange = function () {
  if (input === null || input.files === null) return false
  const file = input.files[0]
  if (file === undefined) return false
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = function (event) {
    if (event.target === null) return false
    const content = event.target.result
    if (content === null || typeof content === 'string') return false
    return true
  }
  return true
}

document.body.appendChild(input)
