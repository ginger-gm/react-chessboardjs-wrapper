A React wrapper for [chessboard.js](http://chessboardjs.com). Requires chessboard.js and jQuery to be available on the window object.

### Usage

`yarn add react-chessboardjs-wrapper`

```jsx
import ChessboardJs from 'react-chessboardjs-wrapper'

<ChessboardJs
  animate // boolean, chessboard.js piece animations
  blackSquareColour="steelblue" // or hex
  border="10px solid #d3d3d3" // css border property
  config={config} // The chessboard.js config object
  onInitBoard={(board, boardId) => this._board = board} // callback fn, gets passed the chessboard.js board object, and the unique id
  resize // effective if width prop is a string
  showPromotionDialog={ // falsey, or object as shown
    onSelect: piece => { // callback function, runs when a piece is selected
      console.log(piece)
      this.setState({
        showPromotionDialog: false,
      })
    },
    square: 'e8', // the square the select piece dialog appears on
  }
  whiteSquareColour="aliceblue" // or hex
  width="80%" // string (%) || number (px)
/>
```

### Notes:

- Changing all props **WITH THE EXCEPTION OF THE FOLLOWING** means a full recreation of the board (as only these are settable via the chessboard.js API):
  - `animate`
  - `blackSquareColour`
  - `border`
  - `config.position`
  - `config.orientation`
  - `resize`
  - `showPromotionDialog`
  - `whiteSquareColour`

- This wrapper is optimised for a modified chessboard.js, based on [chessboard.js PR 97](https://github.com/oakmac/chessboardjs/pull/97) which supports image caching. If using the non-modified published chessboard.js, it works anyway (falls back). fixes flickering in Safari (somewhat, it is still not perfect).
- chessboard.js `config.showErrors` doesn't seem to work as advertised?
- Is chessboard.js is no longer maintained?

### Examples

TODO

### Dev

We use [rollup.js](https://rollupjs.org/guide/en). `yarn dev` to watch files and rebuild on changes, `yarn build` to build.

### Tests

TODO, but I need to learn myself some React testing libs.
