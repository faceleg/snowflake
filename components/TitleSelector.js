import React from 'react'
import PropTypes from 'prop-types'

class TitleSelector extends React.Component {
  render () {
    return <select value={this.props.currentTitle} onChange={e => this.props.setTitleFn(e.target.value)}>
      <style jsx>{`
        select {
          font-size: 20px;
          line-height: 20px;
          margin-bottom: 20px;
          min-width: 300px;
        }
      `}</style>
      {this.props.eligibleTitles.map(title => (
        <option key={title}>
          {title}
        </option>
      ))}
    </select>
  }
}

TitleSelector.propTypes = {
  eligibleTitles: PropTypes.array,
  milestoneByTrack: PropTypes.object,
  currentTitle: PropTypes.string,
  setTitleFn: PropTypes.func
}

export default TitleSelector
