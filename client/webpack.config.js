var BeepPlugin = require('webpack-beep-plugin');
const path = require('path');

module.exports = {
    entry: './src/entry.js',
    output: {
        path: path.resolve('../dist'),
        filename: 'index.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(ttf|woff|eot|svg)/,
                loader: 'url-loader'
            }
        ]
    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            autopilot: path.resolve('../autopilot/src')
        }
    },
    node: {
        fs: "empty"
    },
    plugins: [new BeepPlugin()]
};
