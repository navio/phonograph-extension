const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    background: './src/background',
    content: './src/content.ts',
    popup: `./src/popup`,
    options: `./src/options`
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  // devtool: 'none',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      background: path.resolve(__dirname, 'src/background/'),
      options: path.resolve(__dirname, 'src/options/'),
      popup: path.resolve(__dirname, 'src/popup/'),
      player: path.resolve(__dirname, 'src/player/'),
      ui: path.resolve(__dirname, 'src/ui/')
    },
    fallback: {
      "timers": require.resolve("timers-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "string_decoder": require.resolve("string_decoder/"),
      "events": require.resolve("events/")
    }
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