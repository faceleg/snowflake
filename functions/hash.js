import { getTrackIds } from './track'

const coerceMilestone = (value) => {
  // HACK I know this is goofy but i'm dealing with flow typing
  switch (value) {
    case 0: return 0
    case 1: return 1
    case 2: return 2
    case 3: return 3
    case 4: return 4
    case 5: return 5
    default: return 0
  }
}

export const hashToState = (defaultState, hash, tracks) => {
  if (!hash) return null
  const result = defaultState
  const hashValues = hash.split('#')[1].split(',')
  if (!hashValues) return null
  getTrackIds(tracks).forEach((trackId, i) => {
    result.milestoneByTrack[trackId] = coerceMilestone(Number(hashValues[i]))
  })
  if (hashValues[16]) result.name = decodeURI(hashValues[16])
  if (hashValues[17]) result.title = decodeURI(hashValues[17])
  return result
}

export const stateToHash = (state, tracks) => {
  if (!state || !state.milestoneByTrack) return null
  const values = getTrackIds(tracks).map(trackId => state.milestoneByTrack[trackId]).concat(encodeURI(state.name), encodeURI(state.title))
  return values.join(',')
}
