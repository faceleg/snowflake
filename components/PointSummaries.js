import React from 'react'
import PropTypes from 'prop-types'

class PointSummaries extends React.Component {
  render () {
    const totalPoints = this.props.totalPointsFromMilestoneMap
    const pointsToLevels = this.props.pointsToLevels

    let currentLevel, nextLevel

    let pointsForCurrentLevel = totalPoints
    while (!(currentLevel = pointsToLevels[pointsForCurrentLevel])) {
      pointsForCurrentLevel--
    }

    let pointsToNextLevel = 1
    // eslint-disable-next-line no-unused-vars
    while (!(nextLevel = pointsToLevels[totalPoints + pointsToNextLevel])) {
      pointsToNextLevel++
      if (pointsToNextLevel > 135) {
        pointsToNextLevel = 'N/A'
        break
      }
    }

    const blocks = [
      {
        label: 'Current level',
        value: currentLevel
      },
      {
        label: 'Total points',
        value: totalPoints
      },
      {
        label: 'Points to next level',
        value: pointsToNextLevel
      }
    ]

    return (
      <table>
        <style jsx>{`
          table {
            border-spacing: 3px;
            margin-bottom: 20px;
            margin-left: -3px;
          }
          .point-summary-label {
            font-size: 12px;
            text-align: center;
            font-weight: normal;
            width: 120px;
          }
          .point-summary-value {
            width: 120px;
            background: #E8E8ED;
            font-size: 24px;
            font-weight: bold;
            line-height: 50px;
            border-radius: 2px;
            text-align: center;
          }
        `}</style>
        <tbody>
          <tr>
          {blocks.map(({ label }, i) => (
            <th key={i} className="point-summary-label">
              {label}
            </th>
          ))}
          </tr>
          <tr>
          {blocks.map(({ value }, i) => (
            <td key={i} className="point-summary-value">
              {value}
            </td>
          ))}
          </tr>
        </tbody>
      </table>
    )
  }
}

PointSummaries.propTypes = {

  totalPointsFromMilestoneMap: PropTypes.number,
  milestoneByTrack: PropTypes.object,
  pointsToLevels: PropTypes.object
}

export default PointSummaries
