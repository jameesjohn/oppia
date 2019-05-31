// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Production environment config file for Webpack.
 */

var commonWebpackConfig = require('./webpack.config.ts');
var path = require('path');

module.exports = {
  mode: 'production',
  resolve: {
    modules: [
      path.resolve(__dirname, 'core/templates/dev/head'),
    ],
  },
  entry: commonWebpackConfig.entries,
  plugins: commonWebpackConfig.plugins,
  module: {
    rules: [{
      test: /\.ts$/,
      include: [
        path.resolve(__dirname, 'core/templates/dev/head'),
        path.resolve(__dirname, 'typings')
      ],
      use: [
        'cache-loader',
        'thread-loader',
        {
          loader: 'ts-loader',
          options: {
            // this is needed for thread-loader to work correctly
            happyPackMode: true
          }
        },
        {
          test: /\.html$/,
          loader: 'underscore-template-loader'
        }
      ]
    }]
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'core/templates/dev/head/dist')
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 1024 * 10,
      maxInitialRequests: 9,
    }
  }
};
