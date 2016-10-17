/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
var cdnArr = [1, 4],
    cdn = 'http://web' + cdnArr[Math.floor(Math.random() * cdnArr.length)] + '.waimai.bdimg.com';
var md5 = new Date() * 1;

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'main.js',
        library: 'shared-components',
        libraryTarget: 'umd'
    },
    plugins: [
        /*new webpack.DllReferencePlugin({
            context: path.join(__dirname),
            manifest: require('./build/vendor-manifest.json')
        }),*/
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        /*new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'src/index.html'),
            inject: true
        }),
        new AddAssetHtmlPlugin({
            filepath: require.resolve('./build/vendor.dll.js'),
            includeSourcemap: false
        })*/
    ],
    module: {
        preLoaders: [{
            test: /\.jsx?$/,
            loader: 'eslint',
            include: path.join(__dirname, 'src')
        }],
        loaders: [
            {
                test: /\.jsx?$/,// .js .jsx
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader!'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader!'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader?limit=2048&name=images/[name].[hash:8].[ext]'    // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            }
        ]
    },
    postcss: [require('postcss-flexboxfixer'), autoprefixer({browsers: ["iOS >= 7", "Android >= 4.0", "last 2 Chrome versions", "last 2 Safari versions"]})]
};