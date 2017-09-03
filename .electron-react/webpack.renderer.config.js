/**
 * @file renderer webpack 配置文件
 * @author zhanfang(fzhanxd@gmail.com)
 */
'use strict';

process.env.BABEL_ENV = 'renderer';

const path = require('path');
const webpack = require('webpack');

const BabiliWebpackPlugin = require('babili-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */

let rendererConfig = {
    devtool: '#cheap-module-eval-source-map',
    entry: {
        renderer: path.join(__dirname, '../src/renderer/main.js')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/electron')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'imgs/[name]--[folder].[ext]'
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name]--[folder].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name]--[folder].[ext]'
                    }
                }
            }
        ]
    },
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: process.env.NODE_ENV !== 'production'
                ? path.resolve(__dirname, '../node_modules')
                : false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/renderer')
        },
        extensions: ['.js', '.jsx', '.json', '.css']
    },
    target: 'electron-renderer'
};

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
    rendererConfig.plugins.push(
        new webpack.DefinePlugin({
            __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
        })
    );
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    rendererConfig.devtool = '';

    rendererConfig.plugins.push(
        new BabiliWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../static'),
                to: path.join(__dirname, '../dist/electron/static'),
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    );
}

module.exports = rendererConfig;
