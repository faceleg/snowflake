import React from 'react'
import PropTypes from 'prop-types'

import { milestones } from '../constants'

class Track extends React.Component {
  render () {
    const { tracks, categoryColorScale } = this.props

    if (!tracks) {
      console.error('attempting to render without tracks')
      return null
    }

    const track = this.props.tracks[this.props.trackId]
    const currentMilestoneId = this.props.milestoneByTrack[this.props.trackId]
    const currentMilestone = track.milestones[currentMilestoneId - 1]
    return (
      <div className="track">
        <style jsx>{`
          div.track {
            margin: 0 0 20px 0;
            padding-bottom: 20px;
            border-bottom: 2px solid #ccc;
          }
          h2 {
            margin: 0 0 10px 0;
          }
          p.track-description {
            margin-top: 0;
            padding-bottom: 20px;
            border-bottom: 2px solid #ccc;
          }
          table {
            border-spacing: 3px;
          }
          td {
            line-height: 50px;
            width: 50px;
            text-align: center;
            background: #eee;
            font-weight: bold;
            font-size: 24px;
            border-radius: 3px;
            cursor: pointer;
          }
          ul {
            line-height: 1.5em;
          }
        `}</style>
        <div>
          <h2>{track.displayName}
          <button style={{ marginLeft: 20 }}>Show level details</button>
        </h2>
          <p className="track-description">{track.description}</p>
        </div>
        <div style={{ display: 'flex' }}>
          <table style={{ flex: 0, marginRight: 50 }}>
            <tbody>
              {milestones.slice().reverse().map((milestone) => {
                const isMet = milestone <= currentMilestoneId
                return (
                  <tr key={milestone}>
                    <td onClick={() => this.props.handleTrackMilestoneChangeFn(this.props.trackId, milestone)}
                        style={{ border: `4px solid ${milestone === currentMilestoneId ? '#000' : isMet ? categoryColorScale(track.category) : '#eee'}`, background: isMet ? categoryColorScale(track.category) : undefined }}>
                      {milestone}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {currentMilestone
            ? (
            <div style={{ flex: 1 }}>
              <h3>{currentMilestone.summary}</h3>
              <h4>Example behaviors:</h4>
              <ul>
                {currentMilestone.signals.map((signal, i) => (
                  <li key={i}>{signal}</li>
                ))}
              </ul>
              {currentMilestone.examples.length
                ? (<><h4>Example tasks:</h4>
              <ul>
                {currentMilestone.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul></>)
                : null}
            </div>
              )
            : null}
        </div>
      </div>
    )
  }
}

Track.propTypes = {
  titles: PropTypes.object,
  tracks: PropTypes.object,
  maxLevel: PropTypes.number,
  pointsToLevels: PropTypes.object,
  trackId: PropTypes.string,
  categoryColorScale: PropTypes.func,
  milestoneByTrack: PropTypes.object,
  focusedTrackId: PropTypes.string,
  setFocusedTrackIdFn: PropTypes.func,
  handleTrackMilestoneChangeFn: PropTypes.func
}

export default Track
