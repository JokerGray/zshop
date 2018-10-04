import './index.scss';
import './iconfonts/iconfont.css';
import util from '../util/util.js';
import 'spin.js/spin.css';
import { Spinner } from 'spin.js';

// 模板引入
import tplFace from './tpl-face.html';
import tplPlay from './tpl-play.html';
import tplCircle from './tpl-circle.html';
import tplFans from './tpl-fans.html';

// 时间格式化引入
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 各种接口需要的常量
var CONSTANT = {
    markName: process.env.NODE_ENV == 'development' ? '时尚生活' : '时尚生活',
    // 获取头条文章时需要的id，正式环境54346，测试环境26
    releaseId: process.env.NODE_ENV == 'development' ? 26 : 54346,
    shopId: 49
}
createSection1();
createSection2();
createSection3();
createSection4();
createSection5();
createSection6();
createSection7();
createSection8();

// 第一部分，轮播图
function createSection1() {
    new Swiper('.section1', {
        autoplay: true,
        loop: true,
        navigation: {
            nextEl: '.section1 .swiper-button-next',
            prevEl: '.section1 .swiper-button-prev'
        },
        pagination: {
            el: '.section1 .swiper-pagination',
            clickable: true,
            renderBullet: function (i, className) {
                return '<span class="' + className + '"><i></i></span>'
            }
        },
        on: {
            resize: function () {
                this.updateSize()
            }
        }
    })
}

// 第二部分，智享生活
function createSection2() {
    // 显示图片
    $('.section2 .img-content').on('click', function(){
        var $img = $(this).find('img').clone();
        layer.open({
            type: 1,
            shade: 0.8,
            shadeClose: true,
            title: false,
            area: ['90%', '90%'],
            content: $('<div class="img-layer"></div>').append($img).prop('outerHTML'),
            success: function(layero){
                util.blockVetically($(layero).find('.img-layer img'));
            }
        });
    })
    // 显示视频
    $('.section2 .video-content').on('click', function(){
        var path = $(this).find('img').data('path');
        layer.open({
            type: 2,
            shade: 0.8,
            shadeClose: true,
            title: false,
            area: ['90%', '90%'],
            content: path
        });
    })
    // 直播
    // 全景
    $('.section2 .panorama-content').on('click', function(){
        var path = $(this).find('img').data('path');
        layer.open({
            type: 2,
            shade: 0.8,
            shadeClose: true,
            title: false,
            area: ['90%', '90%'],
            content: path
        });
    })
    getSection2Content1();
    getSection2Content2();
    getSection2Content3();
    getSection2Content4();
}
// 获取第二部分第一区内容-云店图片
function getSection2Content1() {
    var $cover = $('.section2 .img-content .cover');
    $cover.addClass('active');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($cover[0]);
    var def = util.reqAjax('shop/getCoolShopList', {
        pageNo: 1,
        pageSize: 10
    });
    def.then(function (res) {
        spin.stop();
        $cover.removeClass('active');
        if (res.code == 1) {
            $('.section2 .img-content img').attr('src', res.data[0].bgImage);
            var date = new Date(res.data[0].shopEditUpload.createTime);
            if (!date) date = new Date();
            $('.section2 .img-content .time').text(date.Format('yyyy-MM-dd'));
            $('.section2 .img-content .text').text(res.data[0].shopName);
        }
    });
    def.fail(function (err) {
        spin.stop();
        $cover.removeClass('active');
    });
}
// 获取第二部分第二区内容-云店视频
function getSection2Content2() {
    var $cover = $('.section2 .video-content .cover');
    $cover.addClass('active');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($cover[0]);
    var def = util.reqAjax('shop/getCoolShopList', {
        pageNo: 1,
        pageSize: 10
    });
    def.then(function (res) {
        spin.stop();
        $cover.removeClass('active');
        if (res.code == 1) {
            $('.section2 .video-content img').attr('src', res.data[0].shopEditUpload.coverImagePath).data('path', res.data[0].shopEditUpload.filePath);
            var date = new Date(res.data[0].shopEditUpload.createTime);
            if (!date) date = new Date();
            $('.section2 .video-content .time').text(date.Format('yyyy-MM-dd'));
            $('.section2 .video-content .text').text(res.data[0].shopName);
        }
    });
    def.fail(function (err) {
        spin.stop();
        $cover.removeClass('active');
    });
}
// 获取第二部分第三区内容-云店直播
function getSection2Content3() {
    // var $cover = $('.section2 .live-content .cover');
    // $cover.addClass('active');
    // var spin = new Spinner({color:'#fff', lines: 12}).spin($cover[0]);
    // var def = util.reqAjax('shop/getCoolShopList', {
    //     pageNo: 1,
    //     pageSize: 10
    // });
    // def.then(function(res){
    //     spin.stop();
    //     $cover.removeClass('active');
    //     if(res.code == 1) {
    //         $('.section2 .video-content img').attr('src', res.data[0].shopEditUpload.coverImagePath);
    //         var date = new Date(res.data[0].shopEditUpload.createTime);
    //         if(!date) date = new Date();
    //         $('.section2 .video-content .time').text(date.Format('yyyy-MM-dd'));
    //         $('.section2 .video-content .text').text(res.data[0].shopName);
    //     }
    // });
    // def.fail(function(err){
    //     spin.stop();
    //     $cover.removeClass('active');
    // });
}
// 获取第二部分第四区内容-云店全景
function getSection2Content4() {
    var $cover = $('.section2 .panorama-content .cover');
    $cover.addClass('active');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($cover[0]);
    var def = util.reqAjax('shop/getServenShopList', {
        pageNo: 1,
        pageSize: 10
    });
    def.then(function (res) {
        spin.stop();
        $cover.removeClass('active');
        if (res.code == 1) {
            $('.section2 .panorama-content img').attr('src', res.data[0].logoUrl).data('path', res.data[0].shopEditUpload.filePath);
            var date = new Date(res.data[0].shopEditUpload.createTime);
            if (!date) date = new Date();
            $('.section2 .panorama-content .time').text(date.Format('yyyy-MM-dd'));
            $('.section2 .panorama-content .text').text(res.data[0].shopName);
        }
    });
    def.fail(function (err) {
        spin.stop();
        $cover.removeClass('active');
    });
}

// 第三部分
function createSection3() {
    // 显示图片
    $('.section3').on('click', '.swiper-slide', function(){
        var $img = $(this).find('img').eq(0).clone().removeClass('cover');
        layer.open({
            type: 1,
            shade: 0.8,
            shadeClose: true,
            title: false,
            area: ['90%', '90%'],
            content: $('<div class="img-layer"></div>').append($img).prop('outerHTML'),
            success: function(layero){
                util.blockVetically($(layero).find('.img-layer img'));
            }
        });
    })
    // 脸圈轮播
    new Swiper('.section3 .circle-content .swiper-content', {
        navigation: {
            nextEl: '.section3 .circle-content .swiper-button-next',
            prevEl: '.section3 .circle-content .swiper-button-prev'
        },
        on: {
            init: function () {
                getSection3Content1(this)
            },
            reachEnd: function () {
                var total = this.total || 0;
                if (this.slides.length < total) getSection3Content1(this)
            }
        }
    })
    // 全民炫轮播
    new Swiper('.section3 .play-content .swiper-content', {
        direction: 'vertical',
        navigation: {
            nextEl: '.section3 .play-content .swiper-button-next',
            // prevEl: '.section3 .play-content .swiper-button-prev'
        },
        on: {
            init: function () {
                getSection3Content2(this)
            },
            reachEnd: function () {
                var total = this.total || 0;
                if (this.slides.length < total) getSection3Content2(this)
            }
        }
    })
}

// 获取第三部分脸圈数据
function getSection3Content1(swiper) {
    var row = 10;
    var page = Math.floor(swiper.slides.length / row);
    var $cover = $('.section3 .circle-content .cover');
    $cover.addClass('active');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($cover[0]);
    var def = util.reqAjax('game/newestPage', {
        page: page,
        row: row
    });
    def.then(function (res) {
        spin.stop();
        $cover.removeClass('active');
        if (res.code != 1) return layer.msg(res.msg, { icon: 2 });
        // 重设脸圈数据
        for (let i = 0; i < res.data.UserMainList.length; i++) {
            var picObj = res.data.UserMainList[i]['scGamePicture'];
            var usrObj = res.data.UserMainList[i]['scGameUser'];

            var $slide = $(tplFace);
            $slide.find('img').attr('src', picObj.fileUrl);
            $slide.find('.description').text(picObj.fileDescribe);
            $slide.find('.site').text(picObj.site);
            $slide.find('.like').text(usrObj.isLike);
            swiper.appendSlide($slide.html());
        }
        swiper.total = res.total || 0;
    });
    def.fail(function (err) {
        spin.stop();
        $cover.removeClass('active');
    });
}

// 获取第三部分全民炫数据
function getSection3Content2(swiper) {
    var row = 10;
    var page = Math.floor(swiper.slides.length / row);
    var $cover = $('.section3 .play-content .cover');
    $cover.addClass('active');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($cover[0]);
    var def = util.reqAjax('dazzle/findFreshDazzle', {
        pagination: {
            page: page + 1,
            rows: row
        }
    });
    def.then(function (res) {
        spin.stop();
        $cover.removeClass('active');
        if (res.code != 1) return layer.msg(res.msg, { icon: 2 });
        // 重设全民炫数据
        for (let i = 0; i < res.data.scDazzleDazzleInfoList.length; i++) {
            var obj = res.data.scDazzleDazzleInfoList[i];
            var usrObj = res.data.scDazzleDazzleInfoList[i].scSysUser;
            var $slide = $(tplPlay);
            $slide.find('.cover').attr('src', obj.coverUrl);
            $slide.find('.introduce').text(obj.introduce);
            if (usrObj) {
                $slide.find('.name').text(usrObj.username);
                $slide.find('.thumbnail').attr('src', usrObj.userpic);
            }
            $slide.find('.like').text(obj.weekPraiseNum);
            $slide.find('.comment').text(obj.weekCommentNum);
            swiper.appendSlide($slide.html());
        }
        swiper.total = res.data.total || 0;
    });
    def.fail(function (err) {
        spin.stop();
        $cover.removeClass('active');
    });
}

// 第四部分，
function createSection4() {
    $('.section4 .box-content').on('click', '>span', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var data = $(this).data();
        $('.section4 .a-content').find('.a-title').text(data.title);
        $('.section4 .a-content').find('.a-time').text('发布时间：' + data.createTime);
        $('.section4 .a-content').find('.a-description').text(data.content);
    })
    $('.section4 .page-next').on('click', getSection4Questions)
    getSection4Questions();
    getSection4Teachers();
    getSection4Notices();
    setInterval(getSection4Notices, 10000);
}

// 获取知识库数据
function getSection4Questions() {
    if ($('.section4 .page-next').hasClass('disabled')) return;
    var $cover = $('.section4 .q-content .cover, .section4 .a-content .cover');
    $cover.addClass('active');
    var spin1 = new Spinner({ color: '#fff', lines: 12 }).spin($cover.eq(0)[0]);
    var spin2 = new Spinner({ color: '#fff', lines: 12 }).spin($cover.eq(1)[0]);
    var page = $('.section4 .q-content').data('page') || 0;
    page = parseInt(page) + 1;
    var rows = 12;
    var def = util.reqAjax('operations/findTKnowledge', {
        page: page,
        rows: rows,
        categoryId: 1
    });
    $('.section4 .q-content').data('page', page);
    def.then(function (res) {
        spin1.stop();
        spin2.stop();
        $cover.removeClass('active');
        if (res.code != 1) return layer.msg(res.msg, { icon: 2 });
        var $box = $('.section4 .q-content .box-content').empty();
        for (let i = 0; i < res.data.length; i++) {
            var $span = $('<span></span>').text(res.data[i].title).attr('title', res.data[i].title);
            $span.data(res.data[i]);
            $box.append($span);
        }
        $box.find('>span').eq(0).click();
        if (res.total <= page * rows) $('.section4 .page-next').addClass('disabled')
    });
}
// 获取智享导师数据
function getSection4Teachers() {
    var def = util.reqAjax('operations/findScZxTutor', {
        src: 'gw',
        page: 1,
        rows: 10
    });
    def.then(function (res) {
        if (res.code == 1) {
            for (let i = 0; i < res.data.length; i++) {
                var $box = $('<div class="teacher-box"><img></div>')
                $box.find('img').attr('src', res.data[i].avatar);
                $box.find('.desctiption').text(res.data[i].phone);
                $('.section4 .teacher-content').append($box);
            }
        }
    });
}
// 获取约吧最新数据
function getSection4Notices() {
    var $span = $('.section4 .notice-content span');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($span[0]);
    var def = util.reqAjax('newservice/getTopLine', {});
    def.then(function (res) {
        spin.stop();
        $span.text(res.code == 1 ? res.data.orderInfo : res.msg)
    });
    def.fail(function () {
        spin.stop();
        $span.text('加载失败，请检查网络……');
    })
}

// 获取第五部分数据，智享圈子
function createSection5() {
    new Swiper('.section5 .swiper-content', {
        slidesPerView: 'auto',
        spaceBetween: 120,
        centeredSlides: true,
        on: {
            init: function () {
                getSection5Circles(this)
            },
            reachEnd: function () {
                var total = this.total || 0;
                if (this.slides.length < total) getSection5Circles(this)
            },
            slideChangeTransitionEnd: function () {
                var slide = this.slides[this.activeIndex];
                $(slide).addClass('active').siblings().removeClass('active');
            }
        }
    })

}
// 创建圈子
function getSection5Circles(swiper) {
    var rows = 10;
    var page = Math.floor(swiper.slides.length / rows) + 1;

    var def = util.reqAjax('circleSpread/getCircleListByEnForSpread', {
        sStartpage: page,
        sPagerows: rows,
    });
    def.then(function (res) {
        if (res.code != 1) return layer.msg(res.msg, { icon: 2 });
        // 添加圈子数据
        for (let i = 0; i < res.data.length; i++) {
            var $slide = $(tplCircle);
            $slide.find('.img-content').css('background-image', 'url(' + res.data[i].url + ')');
            $slide.find('.box>h2').text(res.data[i].name);
            $slide.find('.box>p').text(res.data[i].title);
            swiper.appendSlide($slide.html());
        }
        if (page == 1) swiper.slides[0].classList.add('active');
        swiper.total = res.total || 0;
    });
}

// 第六部分，智享小白
function createSection6(){
    $('.section6').on('click', '.pic, .i-play', function(){
        layer.open({
            type: 2,
            shade: 0.8,
            shadeClose: true,
            title: false,
            area: ['90%', '90%'],
            content: '/static/video/section6-1.mp4'
        });
    })
}

// 第七部分，粉旗帜
function createSection7(){
    $('.next-text>span').data('page', 1);
    getSection7Fans();
    $('.next-text').on('click', getSection7Fans)
}
// 获取粉旗帜
function getSection7Fans(){
    var $span = $('.next-text>span')
    if($span.hasClass('loading')) return;

    $span.addClass('loading');
    var spin = new Spinner({ color: '#fff', lines: 12 }).spin($span[0]);

    var page = parseInt($('.next-text>span').data('page'));
    var def = util.reqAjax('circle/getVideoListForFansTeam', {
        videoAlbumType: "1,2,3",
        sStartpage: page,
        sPagerows: 3
    });
    def.then(function(res){
        $span.removeClass('loading');
        spin.stop()
        if(res.code == 1) {
            $('.next-text>span').data('page', page + 1);
            $('.section7 .img-content').empty();
            for (var i = 0; i < res.data.length; i++) {
                var obj = res.data[i].videoAlbum;
                var $tplFans = $(tplFans);
                $tplFans.attr('title', obj.videoAlbumDescription)
                $tplFans.toggleClass('col-xs-offset-4', i%2 == 0);
                $tplFans.toggleClass('col-xs-offset-2', i%2 != 0);
                if(!obj.urls[0]) {
                    $tplFans.find('img').attr('src', obj.logo);
                } else {
                    $tplFans.find('img').attr('src', obj.urls[0]);
                }
                $tplFans.find('.box-title').text(obj.circleName);
                $tplFans.find('.box-time').text(obj.videoAlbumTime.substring(0, 10));
                $tplFans.find('.box-content').text(obj.videoAlbumDescription);
                $('.section7 .img-content').append($tplFans);
                util.blockVetically($tplFans.find('img'));
            }
        }
    });
    def.fail(function(err){
        $span.removeClass('loading');
        spin.stop()
    })
}

// 第八部分，智享资讯
function createSection8(){
    var def = util.reqAjax('cms_back/selectArticleByStatus', {
        pagination: {
            page: 1,
            rows: 4
        },
        releaseId: CONSTANT.releaseId,
        isExamine: 1,
        IsDraft: 0
    });
    def.then(function (res) {
        if (res.code != 1) return;
        $('.section8 .ellipsis').on('click', function(){
            var href = $('.section8 .readmore').attr('href');
            window.open(href);
        })
        for (var i = 0; i < res.data.length; i++) {
            var obj = res.data[i];
            var imgSrc = obj.scCmsSubscription.subscriptionImgUrl;
            var time = new Date(obj.releaseTime);
            if(time == 'Invalid Date') time = new Date();
            var title = obj.articleTitle;
            var context = obj.articleContent.replace(/<[^>]+>/g, '');
            if(i == 0) {
                var $box = $('.section8 .article');
                $box.find('img').attr('src', imgSrc);
                $box.find('.article-title').text(title)
                $box.find('.article-content').text(context.substr(0, 50) + '...');
                $box.find('.article-time').html('<span>'+ time.Format('dd') +'</span>'+time.Format('yyyy-MM'));
                util.blockVetically($box.find('img'));
            } else {
                var $box = $('.section8 .box').eq(i-1);
                $box.find('.box-time').html('<span>'+ time.Format('dd') +'</span>'+time.Format('yyyy-MM'));
                $box.find('.box-title').text(title);
                $box.find('.box-content').text(context.substr(0, 50) + '...');
            }
        }
    })
}
// 头条最新资讯接口
function getNews() {
    var def = util.reqAjax('cms_back/selectArticleByStatus', {
        pagination: {
            page: 1,
            rows: 4
        },
        releaseId: CONSTANT.releaseId,
        isExamine: 1,
        IsDraft: 0
    });
    def.then(function (res) {
        if (res.code != 1) return;
        if (res.data.length != 0) {
            $('.consulting-time span:eq(0)').text(res.data[0].releaseTime.substring(8, 10));
            $('.consulting-time span:eq(1)').text(res.data[0].releaseTime.substring(0, 7));
            $('.consulting-show').css(
                {
                    'background': "url(" + res.data[0].scCmsSubscription.subscriptionImgUrl + ") no-repeat",
                    'background-size': 'cover'
                }
            );
            $('.consulting-content h3').text(res.data[0].articleTitle);
            $('.consulting-content p').html(res.data[0].articleContent.replace(/<[^>]+>/g, ""));
            for (let i = 0; i < 3; i++) {
                let j = i + 1;
                $('.consulting-item-content:eq(' + i + ') div div span:eq(0)').text(res.data[j].releaseTime.substring(8, 10));
                $('.consulting-item-content:eq(' + i + ') div div span:eq(1)').text(res.data[j].releaseTime.substring(0, 7));

                $('.consulting-item-info:eq(' + i + ') h3').text(res.data[j].articleTitle);
                $('.consulting-item-info:eq(' + i + ') p').html(res.data[j].articleContent.replace(/<[^>]+>/g, ""));
            }
        }
    });
    def.fail(function (err) {
        console.log(err)
    });
}