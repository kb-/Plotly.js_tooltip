// webpack.config.js
const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',  // Change to 'production' when ready to deploy
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,  // This regex identifies files ending in .css
        use: ['style-loader', 'css-loader']  // These loaders are used for these files
      },
      // You can add more rules for other file types here
    ]
  },
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
};
