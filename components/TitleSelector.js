// @flow

import React from 'react'
import type { MilestoneMap } from '../constants'

type Props = {
  eligibleTitles: [],
  milestoneByTrack: MilestoneMap,
  currentTitle: string,
  setTitleFn: (string) => void
}

class TitleSelector extends React.Component<Props> {
  render() {
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

export default TitleSelector
