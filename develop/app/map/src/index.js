// 高德地图发现开发流程
// 1.搜索高德地图api进入js开发
// 2.申请高德地图开发者KEY
// 3.引入高德地图指定唯一js,注意版本的兼容性，需要一个个版本调试找到最适合的版本
// 4.初始化加载map事件,打开浏览器看效果
// 5.查看高德地图api找到js调用服务的方法，如：定位、标记、缩放、方向盘、3D等
// 6.对接后台交互获取数据JSON，替换静态的标记等信息
// 7.调试并稳定程序在移动端设备的运行,做完后测试
// 8.提交已完成的功能，提供链接与APP对接交互，相互调用自定义方法以及参数传递
// 9.APP打包测试（支持本地Hbuilder打包测试）
// 10.回顾坑点，安卓APP开发问题极多
var swiper;
$(function() {
    FastClick.attach(document.body);
    // 判断是否为手机访问
    var u = navigator.userAgent;
    var isPhone = /Android|webOS|iPhone|iPod|iPad|pad|BlackBerry/i.test(u);
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (!isPhone) {
        alert("请使用手机端打开")
        return false;
    }
    // 初始化map
    var map = new AMap.Map('container', {
        // 地图在移动终端上是否可通过多点触控缩放浏览地图，默认为true。关闭手势缩放地图，请设置为false
        touchZoom: true,
        resizeEnable: true,
        rotateEnable: true,
        viewMode: '3D', //开启3D视图,默认为关闭
        buildingAnimation: true, //楼块出现是否带动画
        expandZoomRange: true,
        // 3D视角俯仰角度，默认0，[0,83]，2D地图下无效
        pitch: 45,
        //是否允许设置俯仰角度，3D视图下为true，2D视图下无效
        pitchEnable: true,
        // 默认视距大小
        zoom: 15,
        zooms: [3, 18],
        // 设置地图上显示的元素种类,支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
        // features: ['bg'],
        // 默认定位中心点
        center: [getUrlParams('longitude'), getUrlParams('latitude')]
    });

    // 滑动插件
    swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
        slideToClickedSlide: true,
        onSlideChangeEnd: function(swiper) {
            var position = $("#bannerBox").find(".swiper-slide").eq(swiper.activeIndex).data('position');
            var bannerName = $("#bannerBox").find(".swiper-slide").eq(swiper.activeIndex).attr('id');
            map.setCenter(position);
            if (start.markers.length != 0) {
                $.each(start.markers, function(i, v) {
                    var name = v.getExtData().type + "_" + v.getExtData().id;
                    if (name == bannerName) {
                        v.setTop(true);
                    }
                });
            }
            // 加载地址
            setAddress(swiper.activeIndex);
        }
    });

    // 开始
    var start, S = function() {
        this.markers = [];
        this.URL = {
            find: "discoveryPlat/find"
        };
    };
    S.prototype = {
        component: function() {
            var _this = this;
            // 添加组件
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.ControlBar',
                    'AMap.Geolocation'
                ],
                function() {
                    // 右上角的控制按钮
                    map.addControl(new AMap.ControlBar({
                        // 是否出现按钮
                        showControlButton: true,
                        // 按钮出现的默认位置
                        position: {
                            right: '10px',
                            top: '60px'
                        }
                    }));
                    // 工具
                    map.addControl(new AMap.ToolBar());
                    // 缩放
                    // map.addControl(new AMap.Scale());
                    // 定位
                    var geolocation = new AMap.Geolocation({
                        // 安卓辅助定位
                        useNative: true,
                        GeoLocationFirst: true, //默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
                        enableHighAccuracy: true, //是否使用高精度定位，默认:true
                        timeout: 10000, //超过10秒后停止定位，默认：无穷大
                        maximumAge: 0, //定位结果缓存0毫秒，默认：0
                        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true, //显示定位按钮，默认：true
                        buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    })
                    map.addControl(geolocation);
                    // geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', _this.onComplete); //返回定位信息
                    AMap.event.addListener(geolocation, 'error', _this.onError); //返回定位出错信息
                });

        },
        getDataAjax: function(d) {
            var _this = this;
            // $("#loading").show();
            map.remove(_this.markers);

            request(_this.URL.find, d).then(function(res) {
                    // 清除markers
                    map.remove(_this.markers);
                    // 清除tab
                    swiper.removeAllSlides();
                    swiper.update();
                    $("#loading").hide();
                    if (res.code == 1) {
                        var arr = [];
                        $.each(res.data, function(i, v) {
                            // 说明中有换行符会报错
                            var mapJson = JSON.parse(v.mapJson);
                            var title = "";
                            if (v.type == "Y1") {
                                title = mapJson.categoryName || "";
                            } else {
                                title = mapJson.title;
                            }
                            if (!v.lng || !v.lat) return;
                            _this.addFlag({
                                extData: {
                                    id: v.id,
                                    type: v.type
                                },
                                content: title,
                                position: [v.lng, v.lat],
                                image: getTypeIcon(v.type),
                            });
                            // 根据类型获取dom
                            $swiperDom = _this[v.type](mapJson);
                            // 加上唯一标识
                            $swiperDom.attr('id', v.type + '_' + v.id);
                            // 加入其他原始数据
                            $swiperDom.data({
                                id: v.id,
                                lat: v.lat,
                                lng: v.lng,
                                type: v.type,
                                position: [v.lng, v.lat]
                            });
                            swiper.appendSlide($swiperDom);
                        });
                    } else {
                        alert(res.msg)
                    }
                },
                function(err) {
                    $("#loading").hide();
                    console.log(err);
                });
        },
        // 约吧
        Y1: function(data, position) {
            var $dom = $($('#tpl').html());
            $dom.addClass('yb');
            $dom.find('.header-title').text('约吧');
            $dom.find('.thumbnail').attr('src', data.img);
            $dom.find('.user-name').text(data.userName);
            $dom.find('.user-text span').text(data.shopName);
            // 可能没有shopName，即个人发布约吧技能
            var isShop = data.hasOwnProperty('shopName') && !!data.shopName;
            $dom.find('.user-text').toggle(isShop);

            // categoryName + serviceComment 数量大于50字最好处理成省略号
            $dom.find('.detail-content .detail-tag').text(data.categoryName);
            $dom.find('.detail-content .content').text(data.serviceComment);
            $dom.find('.price').text(data.servicePrice + '元/' + data.serviceUnit);
            var level = parseInt(data.startLevel);
            $dom.find('.footer .stars .icon-star:lt(' + level + ')').removeClass('off');
            // 加上半颗星
            if (parseFloat(data.startLevel) > level) {
                $dom.find('.footer .stars .icon-star').eq(level).addClass('half');
            }
            $dom.find('.num').text(parseInt(data.orderNumber));

            // 隐藏地址和电话
            $dom.find('.address, .phone').hide();
            // 加入自定义数据
            $dom.data({
                phone: '',
                resourceImg: data.img,
                title: data.userName,
                describe: data.serviceComment
            });
            return $dom;
        },
        // 玩家挣钱--抢标赚
        W1: function(data, position) {
            var $dom = $($('#tpl').html());
            $dom.addClass('wjzq');
            $dom.find('.header-title').text('玩家挣钱');
            $dom.find('.thumbnail').attr('src', data.img);
            $dom.find('.user-name').text(data.name);
            $dom.find('.user-text').remove();
            $dom.find('.detail-content .detail-tag').remove();
            $dom.find('.detail-content .content').text(data.title);
            $dom.find('.phone .text').text(data.phone);
            // 加入自定义数据
            $dom.data({
                phone: data.phone || '',
                resourceImg: data.img,
                title: data.name,
                describe: data.title
            });
            return $dom;
        },
        // 玩家挣钱--分享赚
        W3: function(data) {
            var $dom = this.W1(data);
            // 额外处理一下样式
            $dom.find('.phone').remove();
            $dom.find('.address').css('margin-top', 7);
            return $dom;
        },
        // 云店
        yun1: function(data) {
            var $dom = $($('#tpl').html());
            $dom.addClass('yd');
            $dom.find('.header-title').text('云店');
            $dom.find('.user-name').text(data.title);
            $dom.find('.thumbnail').attr('src', data.img);
            $dom.find('.user-text').remove();
            var level = parseInt(data.score);
            $dom.find('.stars .icon-star:lt(' + level + ')').removeClass('off');
            // 加上半颗星
            if (parseFloat(data.score) > level) {
                $dom.find('.footer .stars .icon-star').eq(level).addClass('half');
            }
            $dom.find('.detail-content .detail-tag').remove();
            $dom.find('.detail-content .content').text(data.describe);
            $dom.find('.phone .text').text(data.phone);
            // 加入自定义数据
            $dom.data({
                phone: data.phone,
                resourceImg: data.img,
                title: data.title,
                describe: data.describe
            });
            return $dom;
        },
        // 玩家活动
        S1: function(data) {
            return this.S3(data);
        },
        // 乞丐要钱
        S2: function(data) {
            return this.S3(data);
        },
        // 白送白玩
        S3: function(data) {
            var $dom = $($('#tpl').html());
            $dom.addClass('hd');
            $dom.find('.header-title').text('活动');
            // 活动样式太坑，需要自定义
            $dom.find('.detail-content').css('background-image', 'url(' + data.img + ')');
            $dom.find('.detail-content>p').remove();
            $dom.find('.hd-title').text(data.title);
            $dom.find('.hd-time').text(data.createTime);
            $dom.find('.phone').remove();
            // 额外处理一下样式
            $dom.find('.address').css('margin-top', 7);
            // 加入自定义数据
            $dom.data({
                phone: '',
                resourceImg: data.img,
                title: data.title,
                describe: data.title
            });
            return $dom;
        },
        // 玩家圈
        Q1: function(data) {
            var $dom = $($('#tpl').html());
            $dom.addClass('qz');
            $dom.find('.header-title').text('圈子');
            $dom.find('.thumbnail').attr('src', data.img);
            $dom.find('.user-name').text(data.title);
            // 添加商家标识
            if (data.type == 2) $dom.find('.user-name').append('<i class="icon-business"></i>');
            $dom.find('.user-text').remove();
            $dom.find('.detail-content .detail-tag').remove();
            $dom.find('.detail-content .content').text(data.describe);
            $dom.find('.phone').remove();
            // 额外处理一下样式
            $dom.find('.address').css('margin-top', 7);
            // 加入自定义数据
            $dom.data({
                phone: '',
                resourceImg: data.img,
                title: data.title,
                describe: data.title
            });
            return $dom;
        },
        // 添加自定义标记方法
        addFlag: function(d) {
            var _this = this;
            //添加点标记，并使用自己的icon
            var marke = new AMap.Marker({
                extData: d.extData,
                map: map,
                topWhenClick: true,
                position: d.position,
                icon: new AMap.Icon({
                    size: new AMap.Size(30, 35), //new AMap.Size(40, 50), //图标大小
                    image: d.image,
                })
            });
            marke.setLabel({
                offset: d.offset || new AMap.Pixel(0, 35), //修改label相对于maker的位置
                content: d.content || ""
            });
            _this.markers.push(marke);
            // label点击
            AMap.event.addListener(marke, 'click', function() {
                //TODO
                var markerSwiperBox = $("#swiperBox").find(".swiper-slide#" + d.extData.type + '_' + d.extData.id);
                $("#bannerBox").prepend(markerSwiperBox);
                swiper.slideTo(0);
                swiper.update(true);
                // 把marker定位到地图中间   
                map.setCenter(d.position);
                // this.setTop(true);
                $("#swiperBox").animate({
                    "bottom": 10
                }, 300);
                setAddress(0);
            });
        },
        //解析定位错误信息
        onError: function(data) {
            if (data.message == "Geolocation permission denied.") {
                try {
                    window.webkit.messageHandlers.removeCacheFromWKWebView.postMessage({});
                } catch (e) {
                    console.log(e);
                }
            }
        },
        //解析定位结果
        onComplete: function(data) {
            var str = ['定位成功'];
            str.push('经度：' + data.position.getLng());
            str.push('纬度：' + data.position.getLat());
            if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米');
            }
            //如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            start.getDataAjax({
                "lng": data.position.getLng(),
                "lat": data.position.getLat(),
                "type": $(".tab li.active").data("type") || 0
            });
        }
    };

    // 初始化方法
    start = new S();
    start.component();
    init();

    function init() {
        swiper.update()
        start.getDataAjax({
            "lng": getUrlParams('longitude'),
            "lat": getUrlParams('latitude'),
            "type": $(".tab li.active").data("type") || 0
        });
    }
    // 地图点击
    map.on('click', function(e) {
        $("#swiperBox").animate({
            "bottom": -250
        }, 300)
    });

    // 导航点击
    $(".tab li").on('click', function() {
        if ($(this).data("type") == "刷新") {
            location.reload();
        }
        $("#swiperBox").animate({
            "bottom": -250
        }, 300)
        $(this).addClass("active").siblings().removeClass("active");
        // 获取全部数据
        start.getDataAjax({
            "lng": map.getCenter().lng,
            "lat": map.getCenter().lat,
            "type": $(this).data("type") || 0
        });
    });

    // 分享
    $("#swiperBox").on('click', '.share', function() {
        var json = $(this).attr('json');
        var jsonParse = JSON.parse(json);
        jsonParse.address = $("#addressHid").val();
        if (!isAndroid && !isiOS) {
            $(this).hide();
        }
        try {
            // 调出分享
            if (isAndroid) {
                window.android.mAndroidSharingMaps(JSON.stringify(jsonParse));
            } else if (isiOS) {
                window.webkit.messageHandlers.shareNaviFromWKWebView.postMessage(jsonParse);
            }
        } catch (e) {
            console.log(e);
        }
    });

    // 进入店铺
    $("#swiperBox").on('click', '.shop', function() {
        var $dom = $(this).parents('.swiper-slide');
        var data = $dom.data()
        data.address = $dom.find('.addressSpan.loaded').text();
        delete data.position;
        try {
            // 进入店铺
            if (isAndroid) {
                window.android.sendToAndroid(JSON.stringify(data));
            } else if (isiOS) {
                window.webkit.messageHandlers.gotoClassFromWKWebView.postMessage(data);
            }
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    });

    // 进入导航
    $("#swiperBox").on('click', '.nav', function() {
        var $dom = $(this).parents('.swiper-slide');
        var data = $dom.data()
        data.address = $dom.find('.addressSpan.loaded').text();
        delete data.position;
        try {
            // 进入导航
            if (isAndroid) {
                window.android.sedToAndroidRoute(JSON.stringify(data));
            } else if (isiOS) {
                window.webkit.messageHandlers.gotoNaviFromWKWebView.postMessage(data);
            }
        } catch (e) {
            console.log(e.name + ": " + e.message);
        }
    });

    // 设置地址
    function setAddress(index) {
        var $dom = $("#bannerBox").find(".swiper-slide").eq(index);
        var bannerName = $("#bannerBox").find(".swiper-slide").eq(index).data('name');
        var $address = $dom.find(".addressSpan");
        // 没有则不设置地址
        if ($address.length == 0) return;
        if ($address.hasClass('loaded')) return;
        var lnglatXY = $dom.data("position");
        AMap.plugin('AMap.Geocoder', function() {
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(lnglatXY, function(status, result) {
                var address = '';
                if (status == 'complete') {
                    address = result.regeocode.formattedAddress;
                    $address.text(address).addClass('loaded');
                    $("#addressHid").val(address);
                }
            })
        })
    }

    // 异步ajax
    function request(cmd, data) {
        //loading带文字
        layer.open({
            type: 2,
            content: '加载中',
            time: 3
        });
        var defer = $.Deferred();
        // 遍历数组，去掉双引号
        var arr1 = [];
        $.each(getUrlParams('canSeeShopIdList').split(","), function(i, v) {
            arr1.push(v - 0);
        });
        var obj = {
            appTrade: getUrlParams('appTrade'),
            userId: getUrlParams('userId'),
            canSeeShopIdList: arr1, //1,2 [1,2]
            merchantTrade: getUrlParams('merchantTrade')
        }
        obj.appTrade = isNull(getUrlParams('appTrade')) ? null : JSON.stringify(obj.appTrade);
        obj.userId = isNull(getUrlParams('userId')) ? null : JSON.stringify(obj.userId);
        obj.canSeeShopIdList = isNull(getUrlParams('canSeeShopIdList')) ? null : JSON.stringify(obj.canSeeShopIdList);
        obj.merchantTrade = isNull(getUrlParams('merchantTrade')) ? null : JSON.stringify(obj.merchantTrade);
        $.ajax({
            type: 'post',
            url: '/zxcity_restful/ws/rest',
            timeout: 5000,
            data: {
                cmd: cmd,
                data: JSON.stringify(data),
                version: '1'
            },
            headers: {
                apikey: 'test',
                appTrade: obj.appTrade,
                userId: obj.userId,
                canSeeShopIdList: obj.canSeeShopIdList,
                merchantTrade: obj.merchantTrade
            },
            success: function(res) {
                layer.closeAll('loading');
                defer.resolve(res);
            },
            error: function(err) {
                layer.closeAll('loading');
                defer.reject(err);
            }
        });
        return defer.promise();
    }

    //判断是否为空
    function isNull(val) {
        if (val == null || val == "null" || val == undefined || val == "") {
            return true;
        }
        return false;
    }

    //获取url
    function getUrlParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
            return decodeURI(decodeURIComponent(r[2]));
        }
        return "";
    }

    // 去掉\r\n
    function formatStr(str) {
        str = str.replace(/\s/g, "")
        str = str.replace(/\r\n/ig, "<br/>");
        return str;
    }

    // 根据类型获取对应的icon
    function getTypeIcon(d) {
        var str = '';
        switch (d) {
            case "Y1":
                // 约吧 技能
                str = 'src/img/niuren.png';
                break;
            case "W1":
                // 玩家赚钱
                str = 'src/img/renwuzhuan.png';
                break;
            case "W3":
                //分享赚
                str = 'src/img/fenxiangzhuan.png';
                break;
            case "yun1":
                //云店
                str = 'src/img/yundian.png';
                break;
            case "S1":
                //玩家活动
                str = 'src/img/huodongwjq.png';
                break;
            case "S2":
                //乞丐要钱
                str = 'src/img/huodongqgyq.png';
                break;
            case "S3":
                //白送白玩
                str = 'src/img/huodongbsbw.png';
                break;
            case "Q3":
                //粉团队
                str = 'src/img/quanziftd.png';
                break;
            case "Q1":
                //玩家圈
                str = 'src/img/quanziwjq.png';
                break;
            case "Q2":
                //社群
                str = 'src/img/quanzisq.png';
                break;
            default:
                str = 'src/img/touxiang.png';
                break;
        }
        return str;
    }
});

function imgErr(img) {
    img.src = "//share.izxcs.com/map/static/zxcs.png";
    img.onerror = null;
}