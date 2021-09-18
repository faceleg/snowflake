import React from 'react'
import PropTypes from 'prop-types'

class KeyboardListener extends React.Component {
  componentDidMount () {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e)) // TK unlisten
  }

  handleKeyDown (e) {
    switch (e.code) {
      case 'ArrowUp':
        this.props.increaseFocusedMilestoneFn()
        e.preventDefault()
        break
      case 'ArrowRight':
        this.props.selectNextTrackFn()
        e.preventDefault()
        break
      case 'ArrowDown':
        this.props.decreaseFocusedMilestoneFn()
        e.preventDefault()
        break
      case 'ArrowLeft':
        this.props.selectPrevTrackFn()
        e.preventDefault()
        break
    }
  }

  render () {
    return null
  }
}

KeyboardListener.propTypes = {
  increaseFocusedMilestoneFn: PropTypes.func,
  selectNextTrackFn: PropTypes.func,
  decreaseFocusedMilestoneFn: PropTypes.func,
  selectPrevTrackFn: PropTypes.func

}

export default KeyboardListener
