const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/future/scripts/game.ts'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{ test: /\.tsx?$|\.jsx?$/, include: path.join(__dirname, '../src'), loader: 'ts-loader' }]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: '[name].bundle.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      filename: 'future.html', // Output file name
      template: 'src/future/index.html', // Input template file
      gameName: 'Future Games', // Additional parameters to pass
    }),
    new HtmlWebpackPlugin({ 
      filename: 'past.html',
      template: 'src/past/index.html',
      gameName: 'Past Games',
    }),
    new HtmlWebpackPlugin({ 
      filename: 'present.html',
      template: 'src/present/index.html',
      gameName: 'Present Games',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      gameName: 'Portal',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/future/assets', to: 'assets' },
        { from: 'pwa', to: '' },
        { from: 'src/favicon.ico', to: '' }
      ]
    })
  ]
};
