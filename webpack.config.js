var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(['static/build']),
        new HtmlWebpackPlugin({ inject: 'head',
            template: __dirname + '/static/index.tmpl.html'}),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            skel: 'skel-framework-npm'
        })
    ],
    entry: [
        './static/javascripts/angularApp'
    ],
    target: 'web',
    output: {
        path: path.join(__dirname, 'static/build'),
        publicPath: '/static/build/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'},
            { test: /\.css$/, loaders: ['style-loader','css-loader']},
            {test: /\.(svg|png|jpe?g|gif)(\?\S*)?$/, loader: 'file-loader'},
            {test: /\.(eot|woff|woff2|ttf)(\?\S*)?$/, loader: 'file-loader'}
        ]
    },
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
