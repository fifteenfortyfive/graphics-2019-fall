// Setting `rotateAt` will cause the stream to rotate once the
// `currentTime` has passed it. If it is unset, or if `rotationEnabled`
// is currently false, the stream will not rotate without a manual update.
export function setFeaturedRun(runId, rotateAt) {
  return {
    type: 'SET_FEATURED_RUN',
    data: {
      runId,
      rotateAt: rotateAt || null
    }
  };
}

export function setRotationInterval(rotationInterval) {
  return {
    type: 'SET_FEATURED_RUN_ROTATION_INTERVAL',
    data: {
      rotationInterval
    }
  };
}

export function setRotationEnabled(rotationEnabled) {
  return {
    type: 'SET_FEATURED_RUN_ROTATION_ENABLED',
    data: {
      rotationEnabled
    }
  };
}
