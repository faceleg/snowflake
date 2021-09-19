export const hashToState = (defaultState, hash, tracks) => {
  if (!hash) {
    return null
  }

  let decodedState = null

  try {
    decodedState = JSON.parse(decodeURI(hash.replace(/^#/, '')))
  } catch (e) {
    return defaultState
  }

  return {
    ...defaultState,
    ...decodedState
  }
}

export const stateToHash = (state) => {
  if (!state || !state.milestoneByTrack) {
    return null
  }

  const hashValues = {
    name: state.name,
    title: state.title,
    milestoneByTrack: state.milestoneByTrack
  }
  return encodeURI(JSON.stringify(hashValues))
}
