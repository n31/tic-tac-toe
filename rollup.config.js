import babel from '@rollup/plugin-babel';
import babelrc from 'babelrc-rollup';

export default {
  input: './server/server.js',
  output: {
    file: 'server_production.js',
    format: 'js'
  },
  plugins: [
    babel(babelrc())
  ]
};