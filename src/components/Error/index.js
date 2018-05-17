import React from 'react'
import PropTypes from 'prop-types'

const ChessboardJsError = ({ message }) => (
  <div style={{ border: '1px solid #d3d3d3', padding: '0.2em' }}>
    {message}
  </div>
)

ChessboardJsError.propTypes = {
  message: PropTypes.string.isRequired,
}

export default ChessboardJsError
