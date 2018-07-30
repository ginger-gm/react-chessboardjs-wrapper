import React, { Component } from 'react'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'

import ChessboardError from '../Error'
import PromotionDialog from '../PromotionDialog'

const noop = () => {}
const speedPropType = PropTypes.oneOfType([
  PropTypes.oneOf(['slow', 'fast']),
  PropTypes.number,
])

const DEFAULT_CONFIG = {
  appearSpeed: 200,
  draggable: false,
  dropOffBoard: 'snapback',
  moveSpeed: 200,
  onChange: noop,
  onDragMove: noop,
  onDragStart: noop,
  onDrop: noop,
  onMouseoutSquare: noop,
  onMouseoverSquare: noop,
  onMoveEnd: noop,
  onSnapbackEnd: noop,
  onSnapEnd: noop,
  orientation: 'white',
  position: 'start',
  showErrors: false,
  showNotation: true,
  snapSpeed: 25,
  snapbackSpeed: 50,
  sparePieces: false,
  trashSpeed: 100,
}
// Extend provided config with defaults
const getExtendedConfig = provided => Object.assign({}, DEFAULT_CONFIG, provided)

class ChessboardJs extends Component {
  constructor(props) {
    super(props)

    this.chessboard = {
      board: null,
      id: uuidv4(), // unique id for namespacing multiple boards on page
    }
    this.cachedImages = {}
  }

  state = {
    boardInitialised: false,
  }

  componentDidMount() {
    if (!window.ChessBoard) return
    if (!window.$) return

    const {
      config,
      resize,
      width,
    } = this.props

    this.initChessboard(
      {
        ...this.props,
        config: getExtendedConfig(config),
      },
      config.position,
    )
    if (resize && typeof width === 'string') {
      window.$(window).resize(this.resizeBoardWithWindow)
    }
  }

  shouldComponentUpdate(nextProps) {
    const extendedCurrentPropsConfig = getExtendedConfig(this.props.config)
    const extendedNextPropsConfig = getExtendedConfig(nextProps.config)

    const {
      orientation: newOrientation,
      position: newPosition,
      showNotation: newShowNotation,
      draggable: newDraggable,
      dropOffBoard: newDropOffBoard,
      pieceTheme: newPieceTheme,
      showErrors: newShowErrors,
      snapbackSpeed: newSnapbackSpeed,
      snapSpeed: newSnapSpeed,
      sparePieces: newSparePieces,
      trashSpeed: newTrashSpeed,
      onChange: newOnChange,
      onDragMove: newOnDragMove,
      onDragStart: newOnDragStart,
      onDrop: newOnDrop,
      onMouseoutSquare: newOnMouseoutSquare,
      onMouseoverSquare: newOnMouseoverSquare,
      onMoveEnd: newOnMoveEnd,
      onSnapEnd: newOnSnapEnd,
      onSnapbackEnd: newOnSnapbackEnd,
    } = extendedNextPropsConfig

    const {
      orientation: currentOrientation,
      position: currentPosition,
      showNotation: currentShowNotation,
      draggable: currentDraggable,
      dropOffBoard: currentDropOffBoard,
      pieceTheme: currentPieceTheme,
      showErrors: currentShowErrors,
      snapbackSpeed: currentSnapbackSpeed,
      snapSpeed: currentSnapSpeed,
      sparePieces: currentSparePieces,
      trashSpeed: currentTrashSpeed,
      onChange: currentOnChange,
      onDragMove: currentOnDragMove,
      onDragStart: currentOnDragStart,
      onDrop: currentOnDrop,
      onMouseoutSquare: currentOnMouseoutSquare,
      onMouseoverSquare: currentOnMouseoverSquare,
      onMoveEnd: currentOnMoveEnd,
      onSnapEnd: currentOnSnapEnd,
      onSnapbackEnd: currentOnSnapbackEnd,
    } = extendedCurrentPropsConfig

    const {
      animate,
      blackSquareColour: newBlackSquareColour,
      border: newBorder,
      resize: newResize,
      showPromotionDialog: newShowPromotionDialog,
      whiteSquareColour: newWhiteSquareColour,
      width: newWidth,
    } = nextProps

    const {
      blackSquareColour: currentBlackSquareColour,
      border: currentBorder,
      resize: currentResize,
      showPromotionDialog: currentShowPromotionDialog,
      whiteSquareColour: currentWhiteSquareColour,
      width: currentWidth,
    } = this.props

    /* Prop changes that don't require a full redraw of the board, and
    are handled by the chessboard.js API. */
    if (newPosition !== currentPosition) {
      this.setPosition(newPosition, animate)
    }
    if (newOrientation !== currentOrientation) {
      this.setOrientation(newOrientation, newWhiteSquareColour, newBlackSquareColour)
    }
    if (newWhiteSquareColour !== currentWhiteSquareColour) {
      this.setWhiteSquareColour(newWhiteSquareColour, newBlackSquareColour)
    }
    if (newBlackSquareColour !== currentBlackSquareColour) {
      this.setBlackSquareColour(newWhiteSquareColour, newBlackSquareColour)
    }
    if (newBorder !== currentBorder) {
      this.setBorder(newBorder)
    }
    if (newResize !== currentResize) {
      if (newResize) {
        window.$(window).resize(this.resizeBoardWithWindow)
      } else {
        window.$(window).off('resize')
      }
    }

    /* The following prop changes require a new board object, as they are not settable via
    the chessboard.js API. */
    if (newWidth !== currentWidth) {
      window.$(this.root).css('width', newWidth)
    }

    if (newShowNotation !== currentShowNotation
     || newDraggable !== currentDraggable
     || newDropOffBoard !== currentDropOffBoard
     || newPieceTheme !== currentPieceTheme
     || newShowErrors !== currentShowErrors
     || newSnapbackSpeed !== currentSnapbackSpeed
     || newSnapSpeed !== currentSnapSpeed
     || newSparePieces !== currentSparePieces
     || newTrashSpeed !== currentTrashSpeed
     || newOnChange.toString() !== currentOnChange.toString()
     || newOnDragMove.toString() !== currentOnDragMove.toString()
     || newOnDragStart.toString() !== currentOnDragStart.toString()
     || newOnDrop.toString() !== currentOnDrop.toString()
     || newOnMouseoutSquare.toString() !== currentOnMouseoutSquare.toString()
     || newOnMouseoverSquare.toString() !== currentOnMouseoverSquare.toString()
     || newOnMoveEnd.toString() !== currentOnMoveEnd.toString()
     || newOnSnapEnd.toString() !== currentOnSnapEnd.toString()
     || newOnSnapbackEnd.toString() !== currentOnSnapbackEnd.toString()
     || newWidth !== currentWidth
    ) {
      const position = this.chessboard.board.position()
      this.chessboard.board.destroy()
      this.initChessboard(nextProps, position)
    }

    // We need to update to render the PromotionDialog.
    if (newShowPromotionDialog !== currentShowPromotionDialog) {
      return true
    }
    if (newShowPromotionDialog) {
      // The following require an update to rerender the PromotionDialog:
      if (newOrientation !== currentOrientation
          || newWidth !== currentWidth
          || newBorder !== currentBorder
          || newPieceTheme !== currentPieceTheme) {
        return true
      }
    }

    return false
  }

  setPosition = (position, animate) => {
    this.chessboard.board.position(position, animate)
  }

  setOrientation = (orientation, whiteSquareColour, blackSquareColour) => {
    this.chessboard.board.orientation(orientation)
    // The board is redrawn after flip, so the following need resetting:
    this.setWhiteSquareColour(whiteSquareColour, blackSquareColour)
    this.setBlackSquareColour(whiteSquareColour, blackSquareColour)
  }

  setWhiteSquareColour = (whiteSquareColour, blackSquareColour) => {
    const { $ } = window
    const { id } = this.chessboard
    // Magic class name from chessboard.js
    $(`#board-${id} .white-1e1d7`)
      .css({
        background: whiteSquareColour,
        color: blackSquareColour,
      })
  }

  setBlackSquareColour = (whiteSquareColour, blackSquareColour) => {
    const { $ } = window
    const { id } = this.chessboard
    // Magic class name from chessboard.js
    $(`#board-${id} .black-3c85d`)
      .css({
        background: blackSquareColour,
        color: whiteSquareColour,
      })
  }

  setBorder = (border) => {
    // Magic class name from chessboard.js
    window.$(`#board-${this.chessboard.id} .board-b72b1`)
      .css('border', border)
  }

  resizeBoardWithWindow = () => {
    const {
      blackSquareColour,
      border,
      showPromotionDialog,
      whiteSquareColour,
    } = this.props
    this.chessboard.board.resize()
    // The board is redrawn after resize, so the following need resetting:
    this.setWhiteSquareColour(whiteSquareColour, blackSquareColour)
    this.setBlackSquareColour(whiteSquareColour, blackSquareColour)
    this.setBorder(border)
    // So the promotion dialog is rerendered and also resized:
    if (showPromotionDialog) this.forceUpdate()
  }

  /* Note position has to be passed seperately as it doesn't always come from props,
  i.e. if it changes due to dragging pieces on the board */
  initChessboard = (props, position) => {
    this.setState({
      boardInitialised: false,
    })

    const { whiteSquareColour, blackSquareColour, onInitBoard } = props
    const { pieceTheme } = props.config

    // Use cached images if they exist
    let pieceThemeFunc = pieceTheme
    // Second argument applies if using non-modified chessboard.js version, that
    // doesn't have image caching. See README.
    if (pieceTheme in this.cachedImages && JSON.stringify(this.cachedImages[pieceTheme]) !== '{}') {
      pieceThemeFunc = piece => this.cachedImages[pieceTheme][piece]
    }

    // Let's go
    this.chessboard.board = window.ChessBoard(
      this.root,
      {
        ...props.config,
        animate: false, // never animate when creating a new board
        pieceTheme: pieceThemeFunc,
        position,
      },
    )

    // Set CSS properties
    this.setWhiteSquareColour(whiteSquareColour, blackSquareColour)
    this.setBlackSquareColour(whiteSquareColour, blackSquareColour)
    this.setBorder(props.border)

    // Cache the images if they're new
    if (!(pieceTheme in this.cachedImages)) {
      this.cachedImages[pieceTheme] = this.chessboard.board.cachedImages || {}
    }

    this.setState({
      boardInitialised: true,
    }, () => onInitBoard(this.chessboard.board))
  }

  render() {
    if (!window.ChessBoard) {
      return <ChessboardError message="Error: chessboard.js not found on page." />
    }
    if (!window.$) {
      return <ChessboardError message="Error: chessboard.js requires jQuery." />
    }

    const { showPromotionDialog, config } = this.props

    const squareEl = document.getElementsByClassName('square-55d63')[0]

    return (
      <React.Fragment>
        <div
          id={`boardContainer-${this.chessboard.id}`}
          style={{
            position: 'relative',
          }}
        >
          <div
            id={`board-${this.chessboard.id}`}
            ref={(b) => { this.root = b }}
            style={{
              width: this.props.width,
            }}
          />
          {showPromotionDialog && this.state.boardInitialised && (
            <PromotionDialog
              boardId={`${this.chessboard.id}`}
              onSelect={showPromotionDialog.onSelect}
              orientation={this.chessboard.board.orientation()}
              pieceTheme={config.pieceTheme}
              size={squareEl.offsetWidth}
              square={showPromotionDialog.square}
            />
          )}
        </div>
      </React.Fragment>
    )
  }
}

ChessboardJs.propTypes = {
  animate: PropTypes.bool,
  blackSquareColour: PropTypes.string,
  onInitBoard: PropTypes.func, // eslint-disable-line
  border: PropTypes.string,
  config: PropTypes.shape({
    appearSpeed: speedPropType,
    draggable: PropTypes.bool,
    dropOffBoard: PropTypes.oneOf(['snapback', 'trash']),
    moveSpeed: speedPropType,
    onChange: PropTypes.func,
    onDragMove: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    onMouseoutSquare: PropTypes.func,
    onMouseoverSquare: PropTypes.func,
    onMoveEnd: PropTypes.func,
    onSnapbackEnd: PropTypes.func,
    onSnapEnd: PropTypes.func,
    orientation: PropTypes.oneOf(['white', 'black']),
    pieceTheme: PropTypes.string.isRequired,
    position: PropTypes.string,
    showErrors: PropTypes.oneOfType([
      PropTypes.oneOf([false, 'console', 'alert']),
      PropTypes.func,
    ]),
    showNotation: PropTypes.bool,
    snapSpeed: speedPropType,
    snapbackSpeed: speedPropType,
    sparePieces: PropTypes.bool,
    trashSpeed: speedPropType,
  }),
  resize: PropTypes.bool,
  showPromotionDialog: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      onSelect: PropTypes.func.isRequired,
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
    }),
  ]),
  whiteSquareColour: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

ChessboardJs.defaultProps = {
  animate: true,
  blackSquareColour: '#b58863',
  onInitBoard: () => {},
  border: '2px solid #404040',
  config: DEFAULT_CONFIG,
  resize: false,
  showPromotionDialog: false,
  whiteSquareColour: '#f0d9b5',
}

export default ChessboardJs
