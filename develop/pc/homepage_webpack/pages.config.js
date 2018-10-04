const HtmlWebpackPlugin = require('html-webpack-plugin');

// 所有页面通用模板配置
const getHtmlTplConfig = function(page, isSingle){
    let chunks = [page]
    if(!isSingle) chunks.push('common')
    return {
        filename: `${page}.html`,
        template: `src/${page}/${page}.html`,
        chunks: chunks
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


module.exports = {
    entry: {
        common: './src/common/common.js',
        utils:'./src/util/util.js',
        index: './src/index/index.js',
        zcity: './src/zcity/zcity.js',
        zshop: './src/zshop/zshop.js',
        signup: './src/signup/signup.js',
        zmaster:'./src/zmaster/zmaster.js',
        zplatform: './src/zplatform/zplatform.js',
        signin: './src/signin/signin.js',
        resetPassword: './src/resetPassword/resetPassword.js',
        zxrecruit:'./src/zxrecruit/zxrecruit.js',
        enterApply: './src/enterApply/enterApply.js'
    },
    pages: [
        // 首页
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('index'), {
            title: '智创工场 - 智享城市,智能经营,智慧生活',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '智创工场,智享城市,智推,智管,智扮,智享,店务管理'},
                { name: 'description', content: '智享城市，智能经营，智慧生活'}
            ])
        })),
        // 产品中心-智享城市
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('zcity'), {
            title: '产品中心 - 智享城市',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        // 产品中心-智大师
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('zmaster'), {
            title: '产品中心 - 智大师',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        // 产品中心-智享店务
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('zshop'), {
            title: '产品中心 - 智大师',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        // 产品中心-智享后台
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('zplatform'), {
            title: '产品中心 - 智享后台',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        // 用户协议页
        new HtmlWebpackPlugin({
            filename: 'user-protocol.html',
            template: 'src/protocol/user-protocol.html',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '智创工场,智享城市,智推,智管,智扮,智享,店务管理,用户协议'},
                { name: 'description', content: '智享城市，智能经营，智慧生活'}
            ]),
            chunks: []
        }),
        // 注册页
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('signup', true), {
            title: '智享城市 - 注册页',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        // 登陆页
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('signin', true), {
            title: '智享城市 - 登陆页',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        // 忘记密码
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('resetPassword', true), {
            title: '智享城市 - 忘记密码',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        //招聘页
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('zxrecruit'), {
            title: '智享招聘',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        })),
        //入驻申请页
        new HtmlWebpackPlugin(Object.assign(getHtmlTplConfig('enterApply'), {
            title: '入驻申请',
            meta: tplMetaArr.concat([
                { name: 'keyword', content: '关键字'},
                { name: 'description', content: '说明'}
            ])
        }))
    ]
}