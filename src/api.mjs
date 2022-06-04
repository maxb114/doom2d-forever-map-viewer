import { getCameraWrapper } from './main.mjs'

function moveCameraByDelta(/** @type {number} */ deltaX, /** @type {number} */ deltaY) {
  const cameraWrapper = getCameraWrapper()
  if (cameraWrapper === null) return
  cameraWrapper.setCameraCoords(deltaX, deltaY)
}

export { moveCameraByDelta }
