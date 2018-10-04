const path = require('path');
const webpack = require('webpack');
const pageConfig = require('./pages.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// process.env.NODE_ENV
// 直接根据命令判断环境
const isDev = process.env.npm_lifecycle_event === 'dev'

// 所有页面通用模板配置
const getHtmlTplConfig = function(page){
    return {
        filename: `${page}.html`,
        template: `src/${page}/${page}.html`,
        chunks: ['common', page]
    }
}
// 所有页面通用meta配置
const tplMetaArr = [
    { charset: 'UTF-8'},
    { name: 'renderer', content: 'webkit|ie-comp|ie-stand'},
    { name: 'viewport', content: 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'},
    { name: 'apple-mobile-web-app-capable', content: 'yes'},
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black'},
    { name: 'format-detection', content: 'telephone=no, email=no'}
]

// 开发环境插件配置
const plugins_dev = [
    // 热替换
    new webpack.HotModuleReplacementPlugin(),
    // 提取css到/css目录
    new MiniCssExtractPlugin({
        filename: 'css/[name].[hash:7].css',
        chunkFilename: '[id].[hash:7].css',
    }),
    // 复制static目录和favicon文件
    new CopyWebpackPlugin([
        { from: 'static', to: 'static', toType: 'dir' },
        { from: 'favicon.ico', to: 'favicon.ico', toType: 'file'}
    ])
].concat(pageConfig.pages)
// 生产环境插件配置
// 清除/dist目录
const plugins_prod = plugins_dev.concat([new CleanWebpackPlugin(['dist'])]);

module.exports = {
    mode: isDev ? 'development': 'production',
    devServer: {
        contentBase: 'dist',
        compress: true,
        open: true,
        hot: true,
        inline:true,
        port: 8090,
        proxy: {
            '/zxcity_restful/ws/rest': {
                // target: 'http://192.168.3.185'
                target: 'http://139.129.216.37:8081'
                // target: 'http://app.izxcs.com:81'
            }
        }
    },
    entry: pageConfig.entry,
    output: {
        filename: 'js/[name].[hash:7].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    plugins: isDev ? plugins_dev : plugins_prod,
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    { loader: 'style-loader', options: { sourceMap: isDev } },
                    { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } },
                    { loader: 'css-loader', options: { minimize: !isDev, sourceMap: isDev } },
                    { loader: 'postcss-loader', options: { ident: 'postcss', sourceMap: isDev, plugins: (loader) => [require('autoprefixer')()] } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } }
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: !isDev,
                        attrs: ['img:src'],
                        interpolate: 'require'
                    },
                }]
            },
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env', 'es2015'],
                        sourceMap: isDev
                    }
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: 'media/[name].[hash:7].[ext]'
                    }
                }]
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }]
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    }
  };