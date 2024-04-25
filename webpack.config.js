// webpack.config.js
const path = require('path');
const webpack = require('webpack');


module.exports = [{
    entry: './src/lib/index.js',
    output: {
      filename: 'plotly_tooltip.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'PlotlyTooltip',
      libraryTarget: 'umd',
      globalObject: 'this', // Ensures UMD works in both Node and browser environments
    },
    externals: {
        'plotly.js-basic-dist': 'Plotly'
    },
    mode: 'development',  // Change to 'production' when ready to deploy / production
    devtool: 'source-map',
    resolve: {
      fallback: {
        "buffer": require.resolve('buffer/'), // Add this for buffer
        "stream": require.resolve('stream-browserify'), // Add this for stream
        "assert": require.resolve('assert/') // Add this for assert
      }
    },
    plugins: [
      // This plugin is necessary to provide Buffer globally
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
];
