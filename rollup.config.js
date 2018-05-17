import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

// Order of plugins is important to suppress crypto warning!
// See https://github.com/rollup/rollup-plugin-commonjs/issues/145
const plugins = [
  babel({
    exclude: ['**/node_modules/**'],
  }),
  resolve({
    browser: true,
  }),
  commonjs({
    include: 'node_modules/**',
  }),
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(uglify())
}

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins,
  external: [
    'react',
    'react-dom',
  ],
}
