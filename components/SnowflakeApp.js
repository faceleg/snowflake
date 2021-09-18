// @flow
import * as d3 from 'd3'

import TrackSelector from '../components/TrackSelector'
import NightingaleChart from '../components/NightingaleChart'
import KeyboardListener from '../components/KeyboardListener'
import Track from '../components/Track'
import Wordmark from '../components/Wordmark'
import LevelThermometer from '../components/LevelThermometer'
import { titles, milestones, milestoneToPoints } from '../constants'
import PointSummaries from '../components/PointSummaries'
import type { Milestone, MilestoneMap, TrackId } from '../constants'
import React from 'react'
import TitleSelector from '../components/TitleSelector'

type SnowflakeAppState = {
  tracks: {},
  milestoneByTrack: MilestoneMap,
  name: string,
  title: string,
  focusedTrackId: TrackId,
}

const hashToState = (hash: String, tracks): ?SnowflakeAppState => {
  if (!hash) return null
  const result = defaultState()
  const hashValues = hash.split('#')[1].split(',')
  if (!hashValues) return null
  getTrackIds(tracks).forEach((trackId, i) => {
    result.milestoneByTrack[trackId] = coerceMilestone(Number(hashValues[i]))
  })
  if (hashValues[16]) result.name = decodeURI(hashValues[16])
  if (hashValues[17]) result.title = decodeURI(hashValues[17])
  return result
}

const coerceMilestone = (value: number): Milestone => {
  // HACK I know this is goofy but i'm dealing with flow typing
  switch(value) {
    case 0: return 0
    case 1: return 1
    case 2: return 2
    case 3: return 3
    case 4: return 4
    case 5: return 5
    default: return 0
  }
}

const emptyState = (): SnowflakeAppState => {
  return {
    tracks: false,
    name: '',
    title: '',
    milestoneByTrack: {
      'OWNERSHIP': 0,
      'CLOUD': 0,
      'EXTREME': 0,

      'PLATFORM_ENGINEERING': 0,
      
    },
    focusedTrackId: 'PLATFORM_ENGINEERING'
  }
}

const defaultState = (): SnowflakeAppState => {
  return {
    name: 'Cersei Lannister',
    title: 'Staff Engineer',
    tracks: false,
    milestoneByTrack: {
      'OWNERSHIP': 2,
      'CLOUD': 0,
      'EXTREME': 0,
      
      'PLATFORM_ENGINEERING': 1
    },
    focusedTrackId: 'PLATFORM_ENGINEERING'
  }
}

const stateToHash = (state: SnowflakeAppState, tracks) => {
  if (!state || !state.milestoneByTrack) return null
  const values = getTrackIds(tracks).map(trackId => state.milestoneByTrack[trackId]).concat(encodeURI(state.name), encodeURI(state.title))
  return values.join(',')
}

const getTrackIds = (tracks) => {
  if (!tracks) throw new Error('Tracks is empty')
  return Object.keys(tracks)
}

const getCategoryIds = (tracks) => {
  return getTrackIds(tracks).reduce((set, trackId) => {
    set.add(tracks[trackId].category)
    return set
  }, new Set())
}

const getTotalPointsFromMilestoneMap = (milestoneMap: MilestoneMap, tracks): number =>
  getTrackIds(tracks).map(trackId => milestoneToPoints(milestoneMap[trackId]))
    .reduce((sum, addend) => (sum + addend), 0)

const getCategoryColorScale = (tracks) => d3.scaleOrdinal()
      .domain(getCategoryIds(tracks))
      .range([
        '#00abc2', 
        '#428af6', 
        '#e1439f', 
        '#e54552'
      ])

const getEligibleTitles = (milestoneMap: MilestoneMap, tracks): string[] => {
  if (!tracks) throw new Error('Tracks is empty')
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

type Props = {}

class SnowflakeApp extends React.Component<Props, SnowflakeAppState> {
  constructor(props: Props) {
    super(props)
    this.state = emptyState()
  }

  componentDidUpdate() {
    const hash = stateToHash(this.state, this.props.tracks)
    if (hash) {
      window.location.replace(`#${hash}`)
    }
  }

  componentDidMount() {
    this.setState(hashToState(window.location.hash, this.props.tracks) || defaultState())
  }

  render() {
    const { tracks } = this.props

    if (!tracks) {
      throw new Error('props.tracks is not defined');
    }

    return (
      <main>
        <style jsx global>{`
          body {
            font-family: Helvetica;
          }
          main {
            width: 960px;
            margin: 0 auto;
          }
          .name-input {
            border: none;
            display: block;
            border-bottom: 2px solid #fff;
            font-size: 30px;
            line-height: 40px;
            font-weight: bold;
            width: 380px;
            margin-bottom: 10px;
          }
          .name-input:hover, .name-input:focus {
            border-bottom: 2px solid #ccc;
            outline: 0;
          }
          a {
            color: #888;
            text-decoration: none;
          }
        `}</style>
        <div style={{margin: '19px auto 0', width: 142}}>
          <a href="https://medium.com/" target="_blank">
            <Wordmark />
          </a>
        </div>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1}}>
            <form>
              <input
                  type="text"
                  className="name-input"
                  value={this.state.name}
                  onChange={e => this.setState({name: e.target.value})}
                  placeholder="Name"
                  />
              <TitleSelector
                  eligibleTitles={getEligibleTitles(this.state.milestoneByTrack, tracks)}
                  milestoneByTrack={this.state.milestoneByTrack}
                  currentTitle={this.state.title}
                  setTitleFn={(title) => this.setTitle(title)} />
            </form>
            <PointSummaries 
            totalPointsFromMilestoneMap={getTotalPointsFromMilestoneMap(this.state.milestoneByTrack, tracks)}
              trackids={getTrackIds(tracks)}
              milestoneByTrack={this.state.milestoneByTrack} 
            />
            <LevelThermometer 
              categoryPointsFromMilestoneMap={getCategoryPointsFromMilestoneMap(this.state.milestoneByTrack, tracks)}
              categoryColorScale={getCategoryColorScale(tracks)}
              milestoneByTrack={this.state.milestoneByTrack} 
            />
          </div>
          <div style={{flex: 0}}>
            <NightingaleChart
                categoryColorScale={getCategoryColorScale(tracks)}
                tracks={tracks}
                trackIds={getTrackIds(tracks)}
                milestoneByTrack={this.state.milestoneByTrack}
                focusedTrackId={this.state.focusedTrackId}
                handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)} />
          </div>
        </div>
        <TrackSelector
            categoryColorScale={getCategoryColorScale(tracks)}
            tracks={tracks}
            trackIds={getTrackIds(tracks)}
            milestoneByTrack={this.state.milestoneByTrack}
            focusedTrackId={this.state.focusedTrackId}
            setFocusedTrackIdFn={this.setFocusedTrackId.bind(this)} />
        <KeyboardListener
            selectNextTrackFn={this.shiftFocusedTrack.bind(this, 1)}
            selectPrevTrackFn={this.shiftFocusedTrack.bind(this, -1)}
            increaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, 1)}
            decreaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, -1)} />
        <Track
            categoryColorScale={getCategoryColorScale(tracks)}
            tracks={tracks}
            milestoneByTrack={this.state.milestoneByTrack}
            trackId={this.state.focusedTrackId}
            handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)} />
        <div style={{display: 'flex', paddingBottom: '20px'}}>
          <div style={{flex: 1}}>
            Made with ❤️ by <a href="https://medium.engineering" target="_blank">Medium Eng</a>.
            Learn about the <a href="https://medium.com/s/engineering-growth-framework" target="_blank">this version of our growth framework</a>
            {' '}and <a href="https://medium.engineering/engineering-growth-at-medium-4935b3234d25" target="_blank">what we do currently</a>.
            Get the <a href="https://github.com/Medium/snowflake" target="_blank">source code</a>.
            Read the <a href="https://medium.com/p/85e078bc15b7" target="_blank">terms of service</a>.
          </div>
        </div>
      </main>
    )
  }

  handleTrackMilestoneChange(trackId: TrackId, milestone: Milestone) {
    const milestoneByTrack = this.state.milestoneByTrack
    milestoneByTrack[trackId] = milestone

    const titles = getEligibleTitles(milestoneByTrack, this.props.tracks)
    const title = titles.indexOf(this.state.title) === -1 ? titles[0] : this.state.title

    this.setState({ milestoneByTrack, focusedTrackId: trackId, title })
  }

  shiftFocusedTrack(delta: number) {
    let index = getTrackIds(this.props.tracks).indexOf(this.state.focusedTrackId)
    index = (index + delta + getTrackIds(this.props.tracks).length) % getTrackIds(this.props.tracks).length
    const focusedTrackId = getTrackIds(this.props.tracks)[index]
    this.setState({ focusedTrackId })
  }

  setFocusedTrackId(trackId: TrackId) {
    let index = getTrackIds(this.props.tracks).indexOf(trackId)
    const focusedTrackId = getTrackIds(this.props.tracks)[index]
    this.setState({ focusedTrackId })
  }

  shiftFocusedTrackMilestoneByDelta(delta: number) {
    let prevMilestone = this.state.milestoneByTrack[this.state.focusedTrackId]
    let milestone = prevMilestone + delta
    if (milestone < 0) milestone = 0
    if (milestone > 5) milestone = 5
    this.handleTrackMilestoneChange(this.state.focusedTrackId, ((milestone: any): Milestone))
  }

  setTitle(title: string) {
    let titles = eligibleTitles(this.state.milestoneByTrack)
    title = titles.indexOf(title) == -1 ? titles[0] : title
    this.setState({ title })
  }
}

export default SnowflakeApp
