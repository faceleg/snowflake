import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../components/Modal'
import { milestones } from '../constants'

const Track = (props) => {
  const [showModal, setShowModal] = useState(false)
  const { categoryColorScale } = props

  const track = props.tracks[props.trackId]
  const currentMilestoneId = props.milestoneByTrack[props.trackId]
  const currentMilestone = track.milestones[currentMilestoneId - 1]
  const nextMilestone = track.milestones[currentMilestoneId]
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
            background: #E8E8ED;
            font-weight: bold;
            font-size: 24px;
            border-radius: 3px;
            cursor: pointer;
          }
          ul {
            line-height: 1.5em;
          }
        `}</style>
        <div style={{ display: 'flex' }}>
          <h2 style={{ display: 'flex' }}>
            {track.displayName}
          </h2>
          {nextMilestone && (
            <>
              <button
                    style={{
                      marginLeft: '25px',
                      lineHeight: '20px',
                      height: '25px',
                      display: nextMilestone ? 'flex' : 'none'
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    Show next
                  </button>
                  <Modal
                    onClose={() => setShowModal(false)}
                    show={showModal}
                  >
                    <div style={{ flex: 1 }}>
                      <h2>Next milestone for { track.displayName } (level { currentMilestoneId + 1 }):</h2>
                      <h3>{track.milestones[currentMilestoneId].summary}</h3>
                      <h4>Example behaviors:</h4>
                      <ul>
                        {track.milestones[currentMilestoneId].signals.map((signal, i) => (
                          <li key={i}>{signal}</li>
                        ))}
                      </ul>
                      {track.milestones[currentMilestoneId].examples.length
                        ? (<><h4>Example tasks:</h4>
                      <ul>
                        {track.milestones[currentMilestoneId].examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul></>)
                        : null}
                    </div>
                  </Modal>
              </>
          )}

        </div>
        <p className="track-description">{track.description}</p>
        <div style={{ display: 'flex' }}>
          <table style={{ flex: 0, marginRight: 50 }}>
            <tbody>
              {milestones.slice().reverse().map((milestone) => {
                const isMet = milestone <= currentMilestoneId
                const milestoneHasContent = track.milestones[milestone - 1]
                return (
                  <tr key={`tr-${track.category}_${milestone}`}
                      title={ milestoneHasContent ? 'Click to select this milestone' : 'This path does not progress further' }
                  >
                      <td key={`td-${track.category}_${milestone}`} onClick={() => milestoneHasContent && props.handleTrackMilestoneChangeFn(props.trackId, milestone)}
                        style={{
                          border: `4px solid ${milestone === currentMilestoneId ? '#000' : isMet ? categoryColorScale(track.category) : '#E8E8ED'}`,
                          background: isMet ? categoryColorScale(track.category) : undefined
                        }}
                      >
                        {milestoneHasContent || milestone === 0 ? milestone : '-'}
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
