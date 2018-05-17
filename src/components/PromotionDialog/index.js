import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import PromotionDialogPiece from '../PromotionDialogPiece'

const noop = () => {}

class PromotionDialog extends Component {
  constructor(props) {
    super(props)
    const { square } = props
    this.el = document.createElement('div')
    this.containerEl = document.getElementById(`boardContainer-${this.props.boardId}`)
    this.color = square.charAt(1) === '1' ? 'b' : 'w'
  }

  componentDidMount() {
    this.setPosition()
    this.containerEl.appendChild(this.el)
  }

  componentDidUpdate() {
    this.setPosition()
  }

  componentWillUnmount() {
    this.containerEl.removeChild(this.el)
  }

  setPosition = () => {
    const { $ } = window // might as well use jQuery, it is on the page
    const { orientation, size, square } = this.props

    let multiplier
    let leftOffset
    let topOffset

    const leftBorderOffset = parseInt(window.$(`#board-${this.props.boardId} .board-b72b1`).css('border-left-width'), 10)
    const topBorderOffset = parseInt(window.$(`#board-${this.props.boardId} .board-b72b1`).css('border-top-width'), 10)

    if (orientation === 'white') {
      multiplier = square.charCodeAt(0) - 97
      leftOffset = (multiplier * size)
      topOffset = this.color === 'w' ? 0 : 4 * size
    } else {
      multiplier = Math.abs((square.charCodeAt(0) - 97) - 7)
      leftOffset = (multiplier * size)
      topOffset = this.color === 'b' ? 0 : 4 * size
    }

    $(this.el).css({
      background: '#fff',
      border: '1px solid #d3d3d3',
      boxSizing: 'border-box',
      position: 'absolute',
      left: leftBorderOffset + leftOffset,
      top: topBorderOffset + topOffset,
    })
  }

  render() {
    const { onSelect, size } = this.props
    const flexDirection = ((this.color === 'w' && this.props.orientation === 'white')
                          || (this.color === 'b' && this.props.orientation === 'black'))
      ? 'column'
      : 'column-reverse'

    return ReactDOM.createPortal(
      <div
        style={{
          display: 'flex',
          flexDirection,
        }}
      >
        <PromotionDialogPiece
          imgSrc={this.props.pieceTheme.replace('{piece}', `${this.color}Q`)}
          piece="Q"
          onClick={onSelect}
          size={size}
        />
        <PromotionDialogPiece
          imgSrc={this.props.pieceTheme.replace('{piece}', `${this.color}N`)}
          piece="N"
          onClick={onSelect}
          size={size}
        />
        <PromotionDialogPiece
          imgSrc={this.props.pieceTheme.replace('{piece}', `${this.color}R`)}
          piece="R"
          onClick={onSelect}
          size={size}
        />
        <PromotionDialogPiece
          imgSrc={this.props.pieceTheme.replace('{piece}', `${this.color}B`)}
          piece="B"
          onClick={onSelect}
          size={size}
        />
      </div>,
      this.el,
    )
  }
}

PromotionDialog.propTypes = {
  boardId: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  orientation: PropTypes.oneOf(['white', 'black']).isRequired,
  pieceTheme: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  square: PropTypes.oneOf([
    'a1', 'a8',
    'b1', 'b8',
    'c1', 'c8',
    'd1', 'd8',
    'e1', 'e8',
    'f1', 'f8',
    'g1', 'g8',
    'h1', 'h8',
  ]).isRequired,
}

PromotionDialog.defaultProps = {
  onSelect: noop,
}

export default PromotionDialog
