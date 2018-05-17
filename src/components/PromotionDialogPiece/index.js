/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions  */
import React from 'react'
import PropTypes from 'prop-types'

const noop = () => {}

const PromotionDialogPiece = ({
  imgSrc, onClick, piece, size,
}) => (
  <img
    alt="Q"
    onClick={() => onClick(piece.toUpperCase())}
    src={imgSrc}
    style={{ height: size, width: size, cursor: 'pointer' }}
  />
)

PromotionDialogPiece.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  piece: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
}

PromotionDialogPiece.defaultProps = {
  onClick: noop,
}

export default PromotionDialogPiece
