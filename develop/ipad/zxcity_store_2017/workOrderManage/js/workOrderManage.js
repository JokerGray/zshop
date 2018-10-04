(function ($) {
    //1:待服务，11：服务中，2：完成服务，10：我的工单，20：待领工单
    var pageNo = 1, pageSize = 3;
    var shopId = sessionStorage.getItem("shopId");
    var merchantId = sessionStorage.getItem('merchantId');
    var backUserId = sessionStorage.getItem('backUserId');
    var searchType = '';
    var orderId = '';
    var nowStatus = '';
    var score = null;//服务评分
    //var controlSys;//设备是ios还是安卓

    var REQUEST_URL = {
        'todo_list': 'shopDisplayTerminal/getToReceivedList',//待领取工单
        'my_list': 'shopDisplayTerminal/getMyServiceList',//我的工单
        'pick_order': 'shopDisplayTerminal/receivedServiceV2',//领取工单
        'return_order': 'shopDisplayTerminal/returnServiceV2',//退回工单
        'begin': 'shopDisplayTerminal/beginServiceV2',//开始服务
        'complete': 'shopDisplayTerminal/completedService',//服务完成
        'facility_list': 'shopDisplayTerminal/getServiceFacilitiesByShop',//获取设备列表
        'scanCompleted': 'shopDisplayTerminal/scanCompletedService' ,//扫码完成服务
        'waiters':'shopDisplayTerminal/getShopWaiterList'//店内服务人员
    };

    //获取服务列表
    function init() {
        var url = '';
        var orderType = $('.orderTab .active').attr('data-order');
        var keyword = $.trim($("#keyword").val());
        var param = {
            'shopId': shopId,
            'merchantId': merchantId,
            'keyWord': keyword,
            'pageNo': pageNo,
            'pageSize': pageSize
        };

        if (orderType == 10) {
            searchType = $('.status .selected').attr('data-status');
            param['searchType'] = searchType;
            param['backUserId'] = backUserId;
            url = REQUEST_URL['my_list'];
        } else if (orderType == 20) {
            url = REQUEST_URL['todo_list'];
            searchType = 12;
        } else if (orderType == 30) {
            searchType = $('.status .selected').attr('data-status');
            param['searchType'] = searchType;
            url = REQUEST_URL['my_list'];
            param['backUserId'] = '';
        }

        reqAjaxAsync(url, JSON.stringify(param)).done(function (resData) {
            if (resData.code === 1) {
                resData['searchType'] = searchType;
                resData['orderType'] = orderType;
                var html = template('orderListTp', resData);
                $('.orderList').html(html);
                //初始化分页器
                pagingInit('.page-selection',resData.total,pageSize,function (page) {
                    param['pageNo'] = page;
                    reqAjaxAsync(url, JSON.stringify(param)).done(function (resData) {
                        resData['searchType'] = searchType;
                        resData['orderType'] = orderType;
                        var html = template('orderListTp', resData);
                        $('.orderList').html(html);
                    })
                })
                // $('.page-selection').html('');
                // if (resData.total > 3) {//小于一页时不显示分页
                //     var p = new Paging();
                //     p.init({
                //         target: '.page-selection',
                //         pagesize: 3,
                //         count: resData.total,
                //         prevTpl: '',
                //         nextTpl: '',
                //         callback: function (page, size, count) {
                //
                //         }
                //     });
                // } else {
                //
                // }
            } else {
                layer.msg(resData.msg)
            }
        });
    }

    $(function () {
        init();
    });

    //点击状态按钮，获取相应的数据
    $('.status .status-item').on('click', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        pageNo = 1;
        init();
    });
    //切换我的工单和待领工单
    $('.orderTab').on('click', 'a', function () {
        $(this).addClass('active').siblings('a').removeClass('active');
        if ($(this).attr('data-order') == 10) {
            $('.status').show();
            $('.status span:eq(0)').addClass('selected').siblings().removeClass('selected');
            init();
        }
        if ($(this).attr('data-order') == 20) {
            $('.status').hide();
            init();
        }
        if ($(this).attr('data-order') == 30) {
            $('.status').show();
            $('.status span:eq(0)').addClass('selected').siblings().removeClass('selected');
            init();
        }
    });
    //点击搜索按钮，搜索相应的数据
    $('.searchBtn').on('click', function () {
        init();
    });

    //更新服务状态
    window.updateStatus = function (url, data, btnIndex) {
        reqAjaxAsync(url, JSON.stringify(data)).done(function (res) {
            if (res.code === 1) {
                layer.msg('操作成功！');
                $('.orderStatus .status .status-item').eq(btnIndex).addClass('selected').siblings().removeClass('selected');
                init();
            } else {
                layer.msg(res.msg);
                init();
            }
        });
    };

    //开始服务操作
    function startService(orderId, serviceName) {
        var param = {
            'shopId': shopId
        };
        //获取设备列表
        reqAjaxAsync(REQUEST_URL['facility_list'], JSON.stringify(param)).done(function (resData) {
            if (resData.code == 1) {
                resData['serviceName'] = serviceName;
                var html = template('beforeStartService', resData);
                layer.open({
                    type: 1,
                    skin: 'service-class',
                    title: '',
                    area: ['40%', '45%'],
                    shadeClose: true,
                    scrollbar: false,
                    content: html,
                    btn: ['开始服务'],
                    yes: function (index, layero) {
                        //获取选择服务人员的id
                        // var servicePeopleId = $(layero).find('.selServicePeople select option:selected').val(),
                        //获取选择服务设备的id
                        ServiceEquipmentId = $(layero).find('.selServiceEquipment select option:selected').val();
                        ServiceEquipmentName = $(layero).find('.selServiceEquipment select option:selected').html();
                        if (ServiceEquipmentId == '-1' || ServiceEquipmentName.indexOf('请选择') > -1) {
                            layer.msg("请选择服务设备！");
                            return;
                        }
                        var data = {
                            "id": orderId,                               //-- 工单号**必传**
                            "roomId": ServiceEquipmentId,                //-- 设备编号**必传**
                            "roomName": ServiceEquipmentName,             //-- 设备名**非必传**
                            "merchantId": merchantId,
                            "shopId": shopId,
                            "shortUrl": '',
                            "backUserId": backUserId
                        };
                        //开始服务
                        updateStatus(REQUEST_URL['begin'], data, 1);
                        layer.close(index)
                    }
                });
                //初始化开始服务弹框中的select选择框
                $('#equipmentSelector').select2({
                    minimumResultsForSearch: -1
                })
            } else {
                layer.msg(resData.msg);
            }
        });
    }

    //退回工单
    function returnOrder(orderId) {
        var param = {
            'id': orderId,
            "backUserId":backUserId
        };
        reqAjaxAsync(REQUEST_URL['return_order'], JSON.stringify(param)).done(function (resData) {
            if (resData.code == 1) {
                layer.msg(resData.msg);
                init();
            } else {
                layer.msg(resData.msg);
                init();
            }
        });
    }

    //领取工单
    function pickOrder(orderId) {
        getWaiters().done(function (res) {
            res.backUserId = sessionStorage.getItem('backUserId');
            var html = template('waiterSelectorTpl',res)
            layer.open({
                type:1,
                title:'请选择服务人员',
                area:['50%','50%'],
                btn:['确定','取消'],
                closeBtn:0,
                skin:'waitersSelector',
                shade:0.5,
                shadeClose:true,
                content:html,
                success:function (layeror, index) {
                    $(layeror).on('click','.waitersBox .option',function () {
                        $(this).toggleClass('active')
                    })
                },
                yes:function (index, layeror) {
                    var waiterList = [];
                    var selectedList = $(layeror).find('.waitersBox .active');
                    selectedList.each(function (i, v) {
                        var id = $(v).find('span').attr('data-id');
                        var backUserName = $(v).find('span').text();
                        waiterList.push({
                            "id": id,
                            "backUserName": backUserName,
                        })
                    })
                    if(waiterList.length<1){
                        layer.msg('请选择服务人员！');
                        return
                    }
                    if(waiterList.length>5){
                        layer.msg('服务人员不能超过5人！');
                        return
                    }
                    var param = {
                        "id": orderId,
                        "waiterList":waiterList
                    };
                    reqAjaxAsync(REQUEST_URL['pick_order'], JSON.stringify(param)).done(function (resData) {
                        if (resData.code == 1) {
                            layer.msg(resData.msg);
                            layer.close(index);
                            $('.orderTab a:eq(0)').addClass('active').siblings().removeClass('active');
                            $('.status status-item:eq(0)').addClass('selected').siblings().removeClass('selected');
                            $('.status').show();
                            init();
                        } else {
                            layer.msg(resData.msg);
                            layer.close(index);
                            init();
                        }
                    })
                }
            })
        })
    }

    //获取店内服务人员
    function getWaiters(){
        var defer = $.Deferred()
        var params = {
            "shopId":shopId,
            "merchantId":merchantId,
            "backUserName":""
        };
        reqAjaxAsync(REQUEST_URL['waiters'],JSON.stringify(params)).done(function (res) {
            if(res.code === 1){
                defer.resolve(res)
            }else{
                layer.msg(res.msg);
                return
            }
        })
        return defer.promise()
    }

    //操作服务列表状态
    $('.orderList').on('click', '.startService', function () {
        orderId = $(this).parent().attr("data-orderId");
        nowStatus = $(this).attr('data-status');
        var serviceName = $(this).attr('data-servicename');

        if (nowStatus == '1') {
            startService(orderId, serviceName);
        }
        else if (nowStatus == '2') {//服务完成
            completeService()
            // var param = {'id': orderId,'backUserId':backUserId};
            // updateStatus(REQUEST_URL['complete'], param, 2);
        }
        else if (nowStatus == '3') {//退回工单
            returnOrder(orderId);
        }
        else if (nowStatus == '4') {//领取工单
            pickOrder(orderId);
        } else if (nowStatus == '5') {//扫码开始
            window.location.href = "scanBar://scanBarCode";
        }
        // else if (nowStatus == '6') {//扫码完成
        //     window.location.href = "scanBar://scanBarCode";
        // }
    });

    //完成服务操作，包含电子签名
    function completeService() {
        //获取系统时间
        getSysTime().done(function (sysTime) {
            //隐藏服务状态和完成服务按钮，避免截屏时显示这两个信息
            $('.startService').hide().parent().siblings('.operateStatus').hide();
            //截取工单信息，并作为签名的背景
            html2canvas(document.querySelector(".orderList"), {
                allowTaint: false,
                useCORS: true
            }).then(function (canvas) {
                var dataUrl = canvas.toDataURL();
                var html = template('signTpl', []);
                layer.open({
                    type: 1,
                    skin: 'sign-class',
                    title: '',
                    area: ['100%', '100%'],
                    shadeClose: true,
                    scrollbar: false,
                    content: html,
                    cancel: function () {
                        $('.startService').show().parent().siblings('.operateStatus').show();
                    }
                });
                //将签名图片区域设置为4/3
                // $('#canvas').height($('#canvas').width() * 3 / 4);
                //设置打分区域的高度
                // $('.evaluation_box').height($(window).height()-$('#canvas').height()-$('#clearCanvas').height());
                // $('#canvas').height(($(window).height()-$('.evaluation_box').height()-$('#clearCanvas').height())*0.9);
                // $('#canvas').width($('#canvas').height()*16/9);

                //获取签名，转换成图片信息，上传至阿里云
                new lineCanvas({
                    el: document.getElementById("canvas"), //绘制canvas的父级div
                    clearEl: document.getElementById("clearCanvas"), //清除按钮
                    saveEl: document.getElementById("saveCanvas") //保存按钮
                }, dataUrl, sysTime);
                //获取评分信息
                getScore()
            });
        })
    }

    //获取二维码扫描结果
    parent.window.getBarCode = function (res) {
        // var codeResultObj = {};
        // var str = res.substring(res.indexOf('?')+1);
        // var arr = str.split('&');
        // arr.forEach(function(v,i){
        //     codeResultObj[v.split('=')[0]] = v.split('=')[1];
        // });
        // console.log(shopId,merchantId);
        // if(codeResultObj.shopid !== shopId || codeResultObj.merchantId !== merchantId){
        //     layer.msg('您无权限操作此工单');
        //     return;
        // };
        if (nowStatus == '5') {
            var url = REQUEST_URL['begin'];
            var data = {
                "id": orderId,
                "roomId": '',
                "roomName": '',
                "merchantId": merchantId,
                "shopId": shopId,
                "shortUrl": res,
                "backUserId": backUserId
            };
            updateStatus(url, data, 1);
        } else if (nowStatus == '6') {
            var url = REQUEST_URL['scanCompleted'];
            var data = {
                "id": orderId,                              // -- 工单号**必传**
                "roomId": '',                                //-- 设备编号**必传**
                "roomName": '',
                "merchantId": merchantId,
                "shopId": shopId,
                "shortUrl": res,
                "backUserId": backUserId
            };
            updateStatus(url, data, 2);
        }
    };

    //点击时间统计按钮 跳转到时间统计页面
    $('.timeCountBtn').click(function () {
        parent.window.location.href = '../workOrderManage/html/averageTimeCount.html'
    });

    //获取系统时间
    function getSysTime() {
        var defer = $.Deferred();
        var url = 'shopDisplayTerminal/getNowTime';
        var data = '{}';
        reqAjaxAsync(url, data).done(function (res) {
            if (res.code === 1) {
                defer.resolve(res.data.time)
            } else {
                defer.resolve(formatAllDate(new Date()))
            }
        });
        return defer.promise()
    }

    // 获取签名图片base64数据
    function lineCanvas(obj, dataUrl, sysTime) {
        var isMove = null;//判断是否有签名
        var signTime = '签名时间：' + sysTime;
        var _this = this;
        var img = new Image();
        img.src = dataUrl;
        // img.crossOrigin = "Anonymous";
        this.linewidth = 3;
        this.color = "#000";
        this.background = "#fff";
        for (var i in obj) {
            this[i] = obj[i];
        }
        this.canvas = document.createElement("canvas");
        this.el.appendChild(this.canvas);
        this.cxt = this.canvas.getContext("2d");
        //解决高倍屏绘图模糊的问题
        var ratio = getCanvansRatio(this.cxt);
        this.cxt.scale(ratio, ratio);
        this.cxt.translate(0.5, 0.5);
        //根据倍率设置canvans尺寸
        this.canvas.width = this.el.clientWidth * ratio;
        this.canvas.height = this.el.clientHeight * ratio;
        // var x0 = ((document.documentElement.clientWidth || document.body.clientWidth)-this.el.clientWidth)/2;
        // console.log(x0);
        // 设置canvans画布的实际高度
        this.canvas.style.width = this.el.clientWidth + 'px';
        this.canvas.style.height = this.el.clientHeight + 'px';
        // this.canvas.style.borderBottom = '1px solid #555';
        // 初始化画布
        this.cxt.fillStyle = this.background;
        this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
        this.cxt.strokeStyle = this.color;
        this.cxt.lineWidth = this.linewidth * ratio;
        this.cxt.lineCap = "round";
        //初始化签名时间显示
        this.cxt.font = 16 * ratio + "px MicrosoftBlack";
        this.cxt.fillStyle = this.color;
        this.cxt.fillText(signTime, 30 * ratio, this.canvas.height / 2.4);
        //初始化签名背景工单图片
        img.onload = function () {
            _this.cxt.drawImage(img, 0, 0, img.width, img.height)
        };
        //开始绘制
        this.canvas.addEventListener("touchstart", function (e) {
            this.cxt.beginPath();
            this.cxt.moveTo((e.changedTouches[0].pageX) * ratio, e.changedTouches[0].pageY * ratio);
            // if(controlSys === 'IOS'){
            //     window.location.href = "sign://signStart";
            // }
            // e.stopPropagation();
            e.preventDefault()
        }.bind(this), false);
        //绘制中
        this.canvas.addEventListener("touchmove", function (e) {
            isMove = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
            this.cxt.lineTo((e.changedTouches[0].pageX) * ratio, e.changedTouches[0].pageY * ratio);
            this.cxt.stroke();
            // e.stopPropagation();
            e.preventDefault()
        }.bind(this), false);
        //结束绘制
        this.canvas.addEventListener("touchend", function () {
            this.cxt.closePath();
            // if(controlSys === 'IOS'){
            //     window.location.href = "sign://signEnd";
            // }
        }.bind(this), false);
        //清除画布
        this.clearEl.addEventListener("click", function () {
            // 初始化画布
            this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.cxt.fillStyle = this.background;
            this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
            this.cxt.strokeStyle = this.color;
            this.cxt.lineWidth = this.linewidth * ratio;
            this.cxt.lineCap = "round";
            //初始化签名背景工单图片
            this.cxt.drawImage(img, 0, 0, img.width, img.height);
            //初始化签名时间显示
            this.cxt.font = 16 * ratio + "px MicrosoftBlack";
            this.cxt.fillStyle = this.color;
            this.cxt.fillText(signTime, 30 * ratio, this.canvas.height / 2.4);
            isMove = null
        }.bind(this), false);
        //保存图片，直接转base64
        this.saveEl.addEventListener("click", function () {
            // var imgBase64 = this.canvas.toDataURL("png");
            //上传签名图片到阿里云，获得图片链接
            if (isMove === null || isMove.length < 2) {
                layer.msg('请在白色区域内签名，谢谢！');
                return
            }
            //上传至阿里云,正式
            var params = {
                'id': orderId,
                'backUserId': backUserId,
                "score": score || ''
            }
            initUpload(this.saveEl, this.canvas, params)

            //美博会
            // var fileName = new Date().getTime().toString()+(Math.floor(Math.random()*10000)).toString()+'.jpg'
            // var fileUrlBase64 = this.canvas.toDataURL('image/jpg');
            // var params = {
            //     "id": orderId,
            //     "backUserId":backUserId,
            //     "fileName":fileName,
            //     "fileUrlBase64":fileUrlBase64,
            //     "score":score || ''
            // }
            // updateStatus('shopDisplayTerminal/completedServiceBase64', params, 2);
            // $('.startService').show().parent().siblings('.operateStatus').show();
            // layer.closeAll();
        }.bind(this), false);

        //获取canvas的实际渲染倍率
        function getCanvansRatio(context) {
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return devicePixelRatio / backingStoreRatio;
        }
    }

    //评分
    function getScore() {
        score = null;
        console.log(score);
        var index;
        $('.evaluation_box').on('click', '.fiveStar span', function () {
            index = $(this).index();
            score = index + 1;
            $(this).addClass('active').html('★');
            $('.evaluation_box').find('.fiveStar span:gt(' + index + ')').removeClass('active').html('☆').end().find('.fiveStar span:lt(' + index + ')').addClass('active').html('★');
        })
    }

    //查看电子签名和服务评分
    $('.orderList').on('click', '.lookSignBtn', function () {
        // $('#lookSignTpl').html('');
        var src = $(this).attr('data-sign');
        var score = $(this).attr('data-score')*1;
        // var html = template('lookSignTpl',{'src':src,'score':score});
        $('.signPic').attr('src', src);
        if(score>0){
            var str = '';
            for (var i = 1; i <= score; i++) {
                str += '<span class="active">★</span>'
            }
            for (var j = 1; j <= 5 - score; j++) {
                str += '<span>☆</span>'
            }
            $('.fiveStarBox').html(str);
        }else{
            $('.fiveStarBox').html('<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>')
        }
        var w = $(window).width() * 0.95;
        var h = w * 9 / 16 + $('.score').outerHeight(true);
        layer.open({
            type: 1,
            skin: 'signPic-class',
            title: '',
            area: [w + 'px', h + 'px'],
            shadeClose: true,
            scrollbar: false,
            content: $('#lookSignTpl'),
        })
    })
    //判断设备是ios还是安卓
    // function controlSysType(){
    //     var u = navigator.userAgent;
    //     var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //     var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //     if(isAndroid&&!isiOS){
    //         $('.sign-tip').hide();
    //         return 'Android'
    //     }else if(!isAndroid&&isiOS){
    //         return 'IOS'
    //     }
    // }
})(jQuery);

