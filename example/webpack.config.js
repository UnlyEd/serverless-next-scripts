const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  // We use webpack-node-externals to excludes all node deps. (like aws-sdk)
  // You can manually set the externals too.
  externals: [nodeExternals()],
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname + '/example',
        exclude: /node_modules/,
      }
    ],
  },
};
