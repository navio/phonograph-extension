const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    background:'./src/background',
    content: './src/content.ts',
    popup: `./src/popup`,
    options: `./src/options`
  },
// devtool: 'inline-source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'assets' },
      ],
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};