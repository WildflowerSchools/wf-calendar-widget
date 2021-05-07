const path = require('path');
const package = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

const webpack = require('webpack');

require('dotenv').config();

module.exports = (env, options) => {

  const build = options.mode === 'production';
  const version = package.version

  let https = true
  if (process.env.HTTPS_KEY) {
    https = {
      key: fs.readFileSync(process.env.HTTPS_KEY),
      cert: fs.readFileSync(process.env.HTTPS_CERT)
    }
  }
  return {
    entry: {
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: () => build ? `wf-calendar-widget.${version}.[contenthash].js` : '[name].bundle.js',
      library: 'wfCal',
      libraryTarget: 'var'
    },
    devServer: {
      host: 'localhost',
      port: 3001,
      public: 'localhost:3001',
      open: true,
      https: https,
      historyApiFallback: {
        index: `/index.${version}.html`
      },
      static: path.resolve(__dirname, 'public', `index.html`)
    },
    devtool: build ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader', // compiles SCSS to CSS
            }
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          },
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.DefinePlugin({
        'process.env.CALENDAR_ID': JSON.stringify(process.env.CALENDAR_ID),
        'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY)
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        inject: false,
        favicon: path.join(__dirname, 'public', 'favicon.ico'),
        filename: path.join(__dirname, 'build', `index.${version}.html`),
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
            output: {comments: false}
          }
        })
      ]
    },
    resolve: {
      fallback: {
        util: require.resolve("util/")
      }
    }
  };
};
