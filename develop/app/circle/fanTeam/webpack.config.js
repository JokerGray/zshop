const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 路径解析
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
// 静态路径
function assetsPath (_path) {
    return path.posix.join('static', _path)
}

// 判断环境，一般也用node_env判断
const isDev = process.env.npm_lifecycle_event === 'dev'
console.log('-----------------------{}--------------------------'+process.env.npm_lifecycle_event)

// 开发环境插件配置
const plugins_dev = [
    // 提取共同js，命名为common
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    // 热替换
    new webpack.HotModuleReplacementPlugin(),
    // 提取css到/css目录
    new ExtractTextPlugin('css/[name].[hash:7].css'),
    // 复制自定义静态资源
    new CopyWebpackPlugin([{
        from: 'static',
        to: 'static',
        ignore: ['.*']
    }]),
    // 使用index.html为模板
    new HtmlWebpackPlugin({ template: './index.html' })
]
// 生产环境插件配置
const plugins_prod = plugins_dev.concat([
    // 清除/dist目录
    new CleanWebpackPlugin(['dist']),
    // 压缩丑化js，加速构建
    new webpack.optimize.UglifyJsPlugin()
]);

module.exports = {
    entry: {
        'app': './src/index.js'
    },
    plugins: isDev ? plugins_dev : plugins_prod,
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
        contentBase: 'dev',
        compress: true,
        open: true,
        hot: true,
        port: 8090,
        proxy: {
            '/zxcity_restful': {
                target: 'http://139.129.216.37:8081'
                
            }
        }
    },
    output: {
        filename: 'js/[name].[hash:7].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    publicPath: '../',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: isDev,
                                minimize: !isDev
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [require('autoprefixer')()],
                                sourceMap: isDev
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDev
                            }
                        }
                    ]
                })
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: !isDev
                    }
                }]
            },
            {
                test: /\.(js)$/,
                exclude: /(node_modules|lib)/,
                use: ['babel-loader'],
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'media/[name].[hash:7].[ext]'
                    }
                }]
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                }]
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    }
}
