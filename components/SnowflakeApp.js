import React from 'react'

import TrackSelector from '../components/TrackSelector'
import NightingaleChart from '../components/NightingaleChart'
import KeyboardListener from '../components/KeyboardListener'
import Track from '../components/Track'
import Wordmark from '../components/Wordmark'
import LevelThermometer from '../components/LevelThermometer'
import PointSummaries from '../components/PointSummaries'
import TitleSelector from '../components/TitleSelector'

import { hashToState, stateToHash } from '../functions/hash'
import { getTrackIds, getEligibleTitles, milestoneByTrack, getTotalPointsFromMilestoneMap, getCategoryPointsFromMilestoneMap, getCategoryColorScale } from '../functions/track'
import { milestones, milestoneToPoints } from '../constants'

export const emptyState = (tracks) => {
  return {
    tracks: false,
    name: '<Your Name>',
    title: '',
    milestoneByTrack: getTrackIds(tracks).reduce((accumulator, trackId) => {
      accumulator[trackId] = 0
      return accumulator
    }, {}),
    focusedTrackId: getTrackIds(tracks)[0]
  }
}

type Props = {
  titles: [],
  tracks: {},
  maxLevel: 135,
  pointsToLevels: {}
}

class SnowflakeApp extends React.Component<Props, SnowflakeAppState> {
  constructor(props: Props) {
    super(props)
    this.state = emptyState(props.tracks)
  }

  componentDidUpdate() {
    const hash = stateToHash(this.state, this.props.tracks)
    if (hash) {
      window.location.replace(`#${hash}`)
    }
  }

  componentDidMount() {
    this.setState(hashToState(emptyState(this.props.tracks), window.location.hash, this.props.tracks) || emptyState(this.props.tracks))
  }

  render() {
    const { titles, tracks, pointsToLevels } = this.props

    if (!tracks) {
      throw new Error('props.tracks is not defined');
    }

    if (!titles) {
      throw new Error('props.titles is not defined');
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
                  eligibleTitles={getEligibleTitles(this.state.milestoneByTrack, tracks, this.props.titles)}
                  milestoneByTrack={this.state.milestoneByTrack}
                  currentTitle={this.state.title}
                  setTitleFn={(title) => this.setTitle(title)} />
            </form>
            <PointSummaries 
              pointsToLevels={pointsToLevels}
              totalPointsFromMilestoneMap={getTotalPointsFromMilestoneMap(this.state.milestoneByTrack, tracks)}
              trackids={getTrackIds(tracks)}
              milestoneByTrack={this.state.milestoneByTrack} 
            />
            <LevelThermometer 
              pointsToLevels={pointsToLevels}
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

    const titles = getEligibleTitles(milestoneByTrack, this.props.tracks, this.props.titles)
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
