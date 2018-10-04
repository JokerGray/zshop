import './news.scss'
import util from '../util/util';

var _CONFIG = {
    releaseId: 26,
    page: location.hash.replace('#!page=', '') ||1,
    rows: 10
}
function setSwiper(){
    var mySwiper = new Swiper('.swiper-container', {
        // autoplay: true,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        lazy: true,
        lazyLoadingInPrevNext : true,
        lazyLoadingInPrevNextAmount : 0,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (i, className) {
                return '<span class="' + className + '"><i></i></span>'
            }
        }
    })

}

$(document).ready(function () {
    return
    layui.use(['laypage', 'layer'], function () {
        var laypage, layer
        laypage = layui.laypage
        layer = layui.layer
        console.log('dsf')
        var USER_URL = {
            GETLIST: 'cms_back/selectArticleByStatus',//获取列表
        }

        function template (data) {
            var str = ''
            var obj
            // console.log(data)
            for (var i = 0; i < data.length; i++) {
                obj = data[i];
                str += `
                    <a target="_blank" href="http://news.zxtest.izxcs.com/articleDetail.html?articleId=${obj.articleId}">
                       <dl class="clearfix">
                            <dd class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><img src="${obj.scCmsSubscription.subscriptionImgUrl}" alt=""></dd>
                            <dt class="col-lg-8 col-md-7 col-sm-6 col-xs-12">
                                <div class="news_top"><i class="mr15"><img src="${obj.scSysUser.userpic}" alt=""></i><span class="mr15">${obj.scSysUser.username}</span> <span class="span">${obj.releaseTime}</span></div>
                                <h3 class="news_title">${obj.articleTitle}</h3>
                                <p class="news_text">${getText(obj.articleContent)}</p>
                                <div class="news_data"><span><i></i>${obj.articleBrowser}</span><span><i></i>${obj.enshrinedNum}</span><span><i></i>${obj.answerNumber}</span></div>
                            </dt>
                        </dl>
                    </a>
                 `;
            }
            return str
        }

        function getText (str) {
            if (!str) {return ''}
            return str.replace(/<[^>]+>/g, '')//去掉所有的html标记
        }
        let temp = (data)=>{
            let str = ``;
            var obj;
            for (var i = 0; i < data.length; i++) {
                obj = data[i]
                str+= `
                    <div class="swiper-slide">
                        <div class="container">
                        <a href="#"> <img data-src="${obj.scCmsSubscription.subscriptionImgUrl}"  class="swiper-lazy"></a>
                        <div class="swiper-lazy-preloader"></div>
                        </div>
                    </div>
                `;

            }
            return str
        }
        let getStick = (cmd,param)=>{
            var deferred = $.Deferred()
            util.reqAjax(cmd, param).then(function (res) {
                console.log(res.data)
                $('.swiper-wrapper').html(temp(res.data))
                setSwiper();
                deferred.resolve(res)
            })
            return deferred
        }
        let getStickCallBack = (index=1,limit=5)=>{
            var params = {
                pagination: {
                    page: index,
                    rows: limit
                },
                releaseId: _CONFIG.releaseId,
                isExamine: 1,
                IsDraft: 0
            }
            return getStick(USER_URL.GETLIST,params)
        }
        getStickCallBack();
        function getData (cmd, param) {
            var deferred = $.Deferred()
            util.reqAjax(cmd, param).then(function (res) {
                console.log(res.data)
                $('.news_box').html(template(res.data))
                deferred.resolve(res)
                layer.closeAll()
            },function (res) {
                layer.msg(res.msg)
                deferred.resolve(res)
                layer.closeAll()
            })

            return deferred

        }

        function pageCallback (index, limit) {
            layer.msg('正在请求...',  {icon: 16, time: 0, shade: [0.3, '#fff']});
            var params = {
                pagination: {
                    page: index,
                    rows: limit
                },
                releaseId: _CONFIG.releaseId,
                isExamine: 1,
                IsDraft: 0
            }
            return getData(USER_URL.GETLIST, params)
        }

        function pagetion (index, limit, pages) {
            pageCallback(index, limit).done(function (res) {
                if (res.code === 1) {
                    var data = res.data
                    var page_options = {
                        elem: pages,
                        count: res ? res.total : 0,
                        layout: ['count', 'prev', 'page', 'next', 'skip'],
                        limit: _CONFIG.rows,
                        curr: location.hash.replace('#!page=', ''), //获取hash值为fenye的当前页
                        hash: 'page' //自定义hash值
                    }

                    page_options.jump = function (obj, first) {
                        //首次不执行
                        if (!first) {
                            pageCallback(obj.curr, obj.limit).then(function (res) {
                                $(window).scrollTop(0)
                            }, function (resTwo) {
                                layer.msg(resTwo.msg)
                            })
                        }
                    }
                    laypage.render(page_options)
                }
            })

        }

        pagetion(_CONFIG.page, _CONFIG.rows, 'laypageLeft')
    })

})