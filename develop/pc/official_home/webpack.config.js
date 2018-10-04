const path = require('path');
const glob = require('glob');

const webapck = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

const jsNameArr = glob.sync('./pages/*');
const entryArr = {};
const htmlPluginArr = [];
jsNameArr.forEach(function(name) {
    let pageName = name.split('/')[2];
    let jsName = name.split('/')[3];
    entryArr[pageName + '_' + jsName.split('.')[0]] = name;
    console.log(name)
}, this);

console.log(entryArr)

const config = {
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 8080
    },
    entry: entryArr,
    output:{
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module:{
        noParse: /jquery|lodash/,
        rules:[
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss|.sass$/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader'
                    }],
                    fallback: 'style-loader'
                })
            },
            // 图片
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            // 字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        extractSass,
        new HtmlWebpackPlugin({
            // template: './pages/home/index.html',
            title: 'test',
            chunks: ['index','test']
        }),
        new HtmlWebpackPlugin({
            filename: 'test.html',
            template: './pages/home/index.html',
            title: 'tsdsdasdsa',
            chunks: ['home4','home2','home3'],
            // chunksSortMode: function(chunk1, chunk2){
            //     var orders = chunk1.modules[0].chunks;
            //     var order1 = orders.indexOf(chunk1.names[0]);
            //     var order2 = orders.indexOf(chunk2.names[0]);
            //     return order1 > order2 ? 1 : -1;
            // }
        })
    ],
    devtool: 'source-map',
    stats: 'normal'
}

module.exports = config;