import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

async function getTracks (role) {
  const roleLocations = await axios(`/static/roles/${role}.json`)

  if (!roleLocations.data) {
    throw new Error('No data')
  }

  const tracksLocations = roleLocations.data
  const tracksData = await Promise.all(Object.keys(tracksLocations).map((trackId) => {
    return axios(tracksLocations[trackId].location)
  }))

  const tracks = Object.keys(tracksLocations).reduce((accumulator, trackId, index) => {
    accumulator[trackId] = tracksData[index].data[trackId]
    return accumulator
  }, {})

  const titlesResponse = await axios(`/static/roles/${role}-titles.json`)

  if (!titlesResponse.data) {
    throw new Error('No titles data')
  }

  return {
    tracks,
    titles: titlesResponse.data.titles,
    maxLevel: titlesResponse.data.maxLevel,
    pointsToLevels: titlesResponse.data.pointsToLevels
  }
}

export const useTracks = (role) => {
  const [tracks, setTracks] = useState(null)
  const [titles, setTitles] = useState(null)
  const [maxLevel, setMaxLevel] = useState(null)
  const [pointsToLevels, setPointsToLevels] = useState(null)
  const [error, setError] = useState(null)

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setTracks(null)
    setTitles(null)
    setError(null)
    return getTracks(role)
      .then((response) => {
        setTracks(response.tracks)
        setTitles(response.titles)
        setMaxLevel(response.maxLevel)
        setPointsToLevels(response.pointsToLevels)
      })
      .catch((error) => {
        setError(error)
      })
  }, [getTracks])
  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    execute()
  }, [execute, true])

  return { execute, tracks, titles, error, pointsToLevels, maxLevel }
}
