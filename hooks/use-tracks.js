import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

  async function getTracks(role) {
    const response = await axios(`/static/roles/${role}.json`)

    if (!response.data) {
        throw new Error('No data')
    }

    const tracksLocations = response.data
    const tracksData = await Promise.all(Object.keys(tracksLocations).map((trackId) => {
        return axios(tracksLocations[trackId].location)
    }))

    const tracks = Object.keys(tracksLocations).reduce((accumulator, trackId, index) => {
        accumulator[trackId] = tracksData[index].data[trackId]
        return accumulator
    }, {})

    return tracks;
  }

export const useTracks = (role) => {
    const [tracks, setTracks] = useState(null);
    const [error, setError] = useState(null);

    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(() => {
      setTracks(null);
      setError(null);
      return getTracks(role)
        .then((response) => {
          setTracks(response);
        })
        .catch((error) => {
          setError(error);
        });
    }, [getTracks]);
    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
        execute();
    }, [execute, true]);

    return { execute, tracks, error };
  };