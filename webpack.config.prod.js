const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body',
    minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
    }
});

// const webpackoptimizeUglifyJsPluginConfig = new webpack.optimize
//     .UglifyJsPlugin({
//         compressor: {
//             warnings: false,
//             screw_ie8: true,
//             conditionals: true,
//             unused: true,
//             comparisons: true,
//             sequences: true,
//             dead_code: true,
//             evaluate: true,
//             if_return: true,
//             join_vars: true
//         },
//         output: {
//             comments: false
//         }
//     });
const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');

    module.exports = {
        devtool: 'source-map',
        entry: [
          './src/app/index.js'
        ],
        output: {
          path: path.join(__dirname, 'dist'),
          filename: 'bundle.js',
        //   publicPath: '/'
        },
        plugins: [
        //   new ExtractTextPlugin('./public/style.css'),
          new webpack.DefinePlugin({
            'process.env':
              {
                NODE_ENV: JSON.stringify('production'),
              }
          }),
        //   webpackoptimizeUglifyJsPluginConfig,
          HtmlWebpackPluginConfig
        ],
        module: {
          rules: [
            // {
            //   test: /\.jsx?$/,
            //   loader: 'babel-loader',
            //   exclude: /node_modules/,
            // },
            // // {
            // //   test: /\.s?css$/,
            // //   use: ExtractTextPlugin.extract({
            // //     fallback: 'style-loader',
            // //     use: [
            // //       {
            // //         loader: 'css-loader'
            // //       },
            // //       {
            // //         loader: 'sass-loader'
            // //       }
            // //     ]
            // //   })
            // // },
            // {
            //     test: /\.(css|scss)$/,
            //     loaders: ['style-loader', 'css-loader', 'sass-loader'], include: [
            //       path.join(__dirname, 'src')
            //     ]
            //   },
            // {
            //   test: /\.(jpe?g|gif|png)$/,
            //   loader: 'file-loader?name=images/[name].[ext]'
            // }

            {
                test: /\.js?/,
                include: SRC_DIR,
                loader: "babel-loader",
                query: {
                  presets: ['react', 'es2015', 'stage-2']
                },
                exclude: /node_modules/
              },
              { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
        
              {
                test: /\.(css|scss)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'], include: [
                  path.join(__dirname, 'src')
                ]
              },
              {
                test: /\.(jpe?g|gif|png)$/,
                loader: 'file-loader?name=images/[name].[ext]'
              },
          ]
        },
        resolve: {
          extensions: ['.js', '.jsx']
        },
        node: {
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
          dns: 'empty'
      },
      };