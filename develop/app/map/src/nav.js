    $(function () {
        // 调用二次微信分享
        var title = isNull(getUrlParams("title")) ? "智享城市热点导航" : getUrlParams("title");
        var address = isNull(getUrlParams("address")) ? "点击查看详情" : getUrlParams("address");
        var base = new Base64();
        var imgUrl = isNull(getUrlParams("imgUrl")) ? "http://share.izxcs.com/map/static/zxcs.png" : base.decode(getUrlParams("imgUrl"));
        $("title").html(title);
        console.log(imgUrl)
        var meta = '<meta name="description" itemprop="description" content="' + address + '"><meta itemprop="image" content="' + imgUrl + '">';
        $("head").prepend(meta);
        share({
            imgUrl: imgUrl,
            title: title,
            desc: address,
            link: location.href
        });
        // 判断是否为手机访问
        var u = navigator.userAgent;
        var ua = navigator.userAgent.toLowerCase();
        var isPhone = /Android|webOS|iPhone|iPod|iPad|pad|BlackBerry/i.test(u);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (!isPhone) {
            alert("请使用手机端打开")
            return false;
        } else {
            if (isAndroid && ua.indexOf('qq/') > -1 && ua.indexOf('mqqbrowser') > -1) {
                $("#weixin_pageto").show();
                $(".mapBox").hide();
                return false;
            }
        }
        var flag = true;
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
            zoom: 17,
            zooms: [3, 17],
            // 设置地图上显示的元素种类,支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
            // features: ['road'],
            // 默认定位中心点
            center: [getUrlParams('longitude'), getUrlParams('latitude')]
            // center: [114.308645, 30.512454]
        });

        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.ControlBar',
                'AMap.Geolocation'
            ],
            function () {
                // 定位
                var geolocation = new AMap.Geolocation({
                    // 安卓辅助定位
                    useNative: true,
                    GeoLocationFirst: true, //默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
                    // useNative: true,//是否使用高德定位sdk用来辅助优化定位效果，默认：false
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: false, //显示定位按钮，默认：true
                    buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                })
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
                AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
            });

        //解析定位错误信息
        function onError(data) {
            alert("定位失败")
            console.log("定位失败")
        }
        //解析定位结果
        function onComplete(data) {
            var str = ['定位成功'];
            str.push('经度：' + data.position.getLng());
            str.push('纬度：' + data.position.getLat());
            if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米');
                console.log('精度：' + data.accuracy + ' 米')
            }
            //如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            // 查询地址
            AMap.plugin('AMap.Geocoder', function () {
                var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                geocoder.getAddress([getUrlParams('longitude'), getUrlParams('latitude')], function (
                    status, result) {
                    var address = '';
                    var city = result.regeocode.addressComponent.city || "";
                    // 创建页面文本
                    var text = new AMap.Text({
                        text: getUrlParams("title"),
                        textAlign: 'center', // 'left' 'right', 'center',
                        verticalAlign: 'middle', //middle 、bottom
                        draggable: true,
                        // cursor: 'pointer',
                        offset: new AMap.Pixel(0, 15),
                        style: {
                            'background-color': 'fff',
                            'border': 'solid 1px #ccc',
                            'padding': '10px 20px'
                        },
                        position: [getUrlParams('longitude'), getUrlParams('latitude')]
                    });
                    text.setMap(map);
                    AMap.event.addListener(text, 'click', function () {
                        // alert(1)
                    });
                    // 默认调用乘车服务
                    drivingService({
                        city: city, //城市
                        start: [data.position.getLng(), data.position.getLat()], //获取当前位置经纬度，设为起点
                        end: [getUrlParams('longitude'), getUrlParams('latitude')], //获取终点位置
                        panel: 'panel' //获取的攻略信息代入到当前div中
                    });
                    // 切换交通工具
                    $("#tab li").click(function () {
                        var type = $(this).data("type");
                        $(this).addClass("active").siblings().removeClass("active");
                        $("#panel").html("");
                        map.clearMap();
                        text = new AMap.Text({
                            text: getUrlParams("title"),
                            textAlign: 'center', // 'left' 'right', 'center',
                            verticalAlign: 'middle', //middle 、bottom
                            draggable: true,
                            // cursor: 'pointer',
                            offset: new AMap.Pixel(0, 15),
                            style: {
                                'background-color': 'fff',
                                'border': 'solid 1px #ccc',
                                'padding': '10px 20px'
                            },
                            position: [getUrlParams('longitude'), getUrlParams('latitude')]
                        });
                        text.setMap(map);
                        AMap.event.addListener(text, 'click', function () {
                            // alert(1)
                        });
                        if (type == 0) {
                            drivingService({
                                city: city, //城市
                                start: [data.position.getLng(), data.position.getLat()], //获取当前位置经纬度，设为起点
                                end: [getUrlParams('longitude'), getUrlParams('latitude')], //获取终点位置
                                // end: [114.308745, 30.512454], //获取终点位置
                                panel: 'panel' //获取的攻略信息代入到当前div中
                            });
                        } else if (type == 1) {
                            transferService({
                                city: city, //城市
                                start: [data.position.getLng(), data.position.getLat()], //获取当前位置经纬度，设为起点
                                end: [getUrlParams('longitude'), getUrlParams('latitude')], //获取终点位置
                                panel: 'panel' //获取的攻略信息代入到当前div中
                            });
                        } else if (type == 2) {
                            walkingService({
                                city: city, //城市
                                start: [data.position.getLng(), data.position.getLat()], //获取当前位置经纬度，设为起点
                                end: [getUrlParams('longitude'), getUrlParams('latitude')], //获取终点位置
                                panel: 'panel' //获取的攻略信息代入到当前div中
                            });
                        }
                    });
                });
            });
        }

        //TODO: 使用driving对象调用驾车路径规划相关的功能
        function drivingService(d) {
            AMap.service('AMap.Driving', function () { //回调函数
                //实例化Driving
                driving = new AMap.Driving({
                    city: d.city,
                    map: map,
                    panel: d.panel,
                });
                //传经纬度
                driving.search(d.start, d.end, function (status, result) {
                    if (status === "complete") {
                        isShowFn();
                    }
                });
            })
        }

        //TODO: 使用transfer对象调用公交换乘相关的功能
        function transferService(d) {
            AMap.service('AMap.Transfer', function () { //回调函数
                //实例化Transfer
                transfer = new AMap.Transfer({
                    city: d.city,
                    map: map,
                    panel: d.panel,
                });
                //传经纬度
                transfer.search(d.start, d.end, function (status, result) {
                    //TODO 解析返回结果，自己生成操作界面和地图展示界面
                    isShowFn();
                    if (status !== "complete") {
                        $("#panel").html("抱歉，没有合适的路线。");
                    }
                });
            })
        }

        //TODO: 使用walking对象调用步行路径规划相关的功能
        function walkingService(d) {
            AMap.service('AMap.Walking', function () { //回调函数
                //实例化Transfer
                walking = new AMap.Walking({
                    city: d.city,
                    map: map,
                    panel: d.panel,
                });
                //传经纬度
                walking.search(d.start, d.end, function (status, result) {
                    if (status === "complete") {
                        isShowFn();
                    }
                });
            });
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

        // 异步ajax
        function reqAjaxAsync(cmd, data) {
            var defer = $.Deferred();
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
                },
                success: function (res) {
                    defer.resolve(res);
                },
                error: function (err) {
                    defer.reject(err);
                }
            });
            return defer.promise();
        }

        // 微信二次分享
        function share(d) {
            var data = {
                url: location.href
            };
            reqAjaxAsync("game/getSign", data).done(function (res) {
                wx.config({  
                    debug: false,
                    appId: 'wxe50dd59beab1e644',
                    timestamp: res.data.timestamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo', 'onMenuShareQZone', 'onMenuShareQQ']
                });

                // 分享加载
                wx.ready(function () {
                    //  朋友圈
                    wx.onMenuShareTimeline({
                        title: d.title, // 分享标题
                        link: d.link, // 分享链接
                        imgUrl: d.imgUrl, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    });
                    // 分享给朋友
                    wx.onMenuShareAppMessage({
                        title: d.title, // 分享标题
                        desc: d.desc, // 分享描述
                        link: d.link, // 分享链接
                        imgUrl: d.imgUrl, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    });
                    //  分享到微博
                    wx.onMenuShareWeibo({
                        title: d.title, // 分享标题
                        desc: d.desc, // 分享描述
                        link: d.link, // 分享链接
                        imgUrl: d.imgUrl, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    });
                    //  分享qq空间
                    wx.onMenuShareQZone({
                        title: d.title, // 分享标题
                        desc: d.desc, // 分享描述
                        link: d.link, // 分享链接
                        imgUrl: d.imgUrl, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    });
                    //  分享qq
                    wx.onMenuShareQQ({
                        title: d.title, // 分享标题
                        desc: d.desc, // 分享描述
                        link: d.link, // 分享链接
                        imgUrl: d.imgUrl, // 分享图标
                        success: function () {},
                        cancel: function () {}
                    });
                });
            });
        }


        // 切换panel隐藏显示
        function isShowFn() {
            $("#leftDiv").animate({
                "right": 250
            }, 300)
            $("#panel").animate({
                "right": 0
            }, 300);
        }

        // 箭头点击效果
        $("#leftDiv").click(function () {
            if (flag) {
                $("#leftDiv").animate({
                    "right": 0
                }, 300)
                $("#panel").animate({
                    "right": -250
                }, 300)
                flag = false;
            } else {
                $("#leftDiv").animate({
                    "right": 250
                }, 300)
                $("#panel").animate({
                    "right": 0
                }, 300)
                flag = true;
            }
        });

        function Base64() {

            // private property
            // _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

            // public method for encoding
            this.encode = function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = _utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                }
                return output;
            }

            // public method for decoding
            this.decode = function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9-_]/g, "");
                while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = _utf8_decode(output);
                return output;
            }

            // private method for UTF-8 encoding
            _utf8_encode = function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }
                return utftext;
            }

            // private method for UTF-8 decoding
            _utf8_decode = function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;
                while (i < utftext.length) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return string;
            }
        }


    });