import * as d3 from 'd3'

import { milestoneToPoints } from '../constants'

export const getTrackIds = (tracks) => {
  if (!tracks) throw new Error('Tracks is empty')
  return Object.keys(tracks)
}

export const getCategoryIds = (tracks) => {
  return getTrackIds(tracks).reduce((set, trackId) => {
    set.add(tracks[trackId].category)
    return set
  }, new Set())
}

export const getTotalPointsFromMilestoneMap = (milestoneMap: MilestoneMap, tracks): number =>
  getTrackIds(tracks).map(trackId => milestoneToPoints(milestoneMap[trackId]))
    .reduce((sum, addend) => (sum + addend), 0)

export const getCategoryColorScale = (tracks) => d3.scaleOrdinal()
      .domain(getCategoryIds(tracks))
      .range([
        '#00abc2', 
        '#428af6', 
        '#e1439f', 
        '#e54552'
      ])

export const getEligibleTitles = (milestoneMap: MilestoneMap, tracks, titles): string[] => {
  if (!tracks) throw new Error('Tracks is empty')
  if (!titles) throw new Error('Titles is empty')
  const totalPoints = getTotalPointsFromMilestoneMap(milestoneMap, tracks)
  return titles.filter(title => (title.minPoints === undefined || totalPoints >= title.minPoints)
                              && (title.maxPoints === undefined || totalPoints <= title.maxPoints))
    .map(title => title.label)
}

export const getCategoryPointsFromMilestoneMap = (milestoneMap: MilestoneMap, tracks) => {
  let pointsByCategory = new Map()
  getTrackIds(tracks).forEach((trackId) => {
    const milestone = milestoneMap[trackId]
    const categoryId = tracks[trackId].category
    let currentPoints = pointsByCategory.get(categoryId) || 0
    pointsByCategory.set(categoryId, currentPoints + milestoneToPoints(milestone))
  })
  return Array.from(getCategoryIds(tracks).values()).map(categoryId => {
    const points = pointsByCategory.get(categoryId)
    return { categoryId, points: pointsByCategory.get(categoryId) || 0 }
  })
}
