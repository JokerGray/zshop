(function($){
    var REQUEST_URL = {
        'room_list':'shopDisplayTerminal/queryShopRoomList',//查询房间管理接口
        'order_list':'shopDisplayTerminal/queryInShopRoomOrderList',//查询某房间下正在进行工单接口
        'bespoke_info':'shopDisplayTerminal/getBespokeDetailById',//获取单个预约详情接口
        'updateStatus': 'shopDisplayTerminal/completedService'//更新状态
    };
    var pageNo = 1, pageSize = 100;
    var shopId = sessionStorage.getItem("shopId");
    var backUserId = sessionStorage.getItem('backUserId');
    var orderId;
    var score;

    window.loadRoomList = function(){
        var param = {
            'shopId':shopId,
            'pageNo':pageNo,
            'pageSize':pageSize
        };
        reqAjaxAsync(REQUEST_URL['room_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var sHtml = '', obj = res.data;
                if(obj.length > 0){
                    for(var i=0; i<obj.length; i++){
                        sHtml += '<li>'
                            + '<div class="room-item"><div class="pic"><img src="image/default_pic.png"></div>'
                            + '<div class="info"><p class="name">'+obj[i].roomName+'</p>';

                        if(obj[i].bespokeId && obj[i].bespokeId != ""){
                            sHtml += '<p class="bespoke"><a data-bespokeId="'+obj[i].bespokeId+'" href="javascript:;">当前有预约</a></p>';
                        }else{
                            sHtml += '<p class="bespoke"></p>';
                        }
                        if(obj[i].num == 0){
                            sHtml += '<p class="state">空闲</p>';
                        }else{
                            sHtml += '<p class="state"><a data-roomId="'+obj[i].id+'" href="javascript:;">'+obj[i].num+'张工单(进行中)</a></p>';
                        }
                        sHtml += '</div></div></li>';
                    }
                }else{
                    sHtml = '<div class="nodata">暂无数据</div>';
                }
                $("#roomList").html(sHtml);
            }
        });

    }

    loadRoomList();

    function workOrderList(roomId){
        var param = {
            'shopId':shopId,
            'roomId':roomId,
            'pageNo':pageNo,
            'pageSize':pageSize
        };
        reqAjaxAsync(REQUEST_URL['order_list'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                if(res.data.length==0){
                    layer.msg('工单服务已完成，设备空闲中！');
                    loadRoomList();
                    return;
                };
                workOrderDetailShow(res.data);
            }else{
                layer.msg(res.msg);
            }
        });
    }

    function workOrderDetailShow(data){
        var sHtml = template('workOrderDetailTpl', {'list':data});
        layer.open({
            type: 1,
            title: ['查看工单详情'],
            area: ['90%', '500px'],
            shadeClose: true,
            scrollbar: false,
            content: sHtml,
            anim:0,
            success:function(layro, index){
                //服务完成
                $(".order-item .detail .complete-btn").click(function(){
                    orderId = $(this).attr('data-id');
                    completeService();
                    // var orderId = $(this).attr("data-id");
                    // // status = $(this).attr("data-status");
                    // var changeStatus = status == 1 ? 3 : 5;
                    // var jsonData = "{'id':" + orderId + ",'backUserId':"+backUserId+"}";
                    // reqAjaxAsync(REQUEST_URL['updateStatus'], jsonData).done(function(res){
                    //     if(res.code == 1){
                    //         layer.msg("状态更新成功！");
                    //         loadRoomList();
                    //     }else{
                    //         layer.msg(res.msg);
                    //     }
                    //     layer.close(index);
                    // });
                });
            }
        });
    }

    //查看预约详情
    function getBespokeDetailById(bespokeId){
        var param = {
            'bespokeId':bespokeId
        };

        reqAjaxAsync(REQUEST_URL['bespoke_info'], JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var sHtml = template('bespokeDetailTpl', {'obj':res.data});
                layer.open({
                    type: 1,
                    title: ['查看预约详情'],
                    area: ['400px', '60%'],
                    shadeClose: true,
                    scrollbar: false,
                    content: sHtml
                });
            }else{
                layer.msg(res.msg);
            }
        });
    }


    //点击链接查看工单详情
    $("#roomList").delegate(".room-item .info .bespoke a", "click", function(){
        var bespokeId = $(this).attr("data-bespokeId");
        getBespokeDetailById(bespokeId);
    }).delegate(".room-item .info .state a", "click", function(){
        var roomId = $(this).attr("data-roomId");
        workOrderList(roomId);
    });

    //完成服务操作，包含电子签名
    function completeService(){
        //获取系统时间
        getSysTime().done(function (sysTime) {
            //隐藏服务状态和完成服务按钮，避免截屏时显示这两个信息
            $('.detail .row:nth-of-type(2)').css('visibility','hidden');
            //截取工单信息，并作为签名的背景
            html2canvas(document.querySelector(".order-item"),{
                allowTaint:false,
                useCORS:true
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
                        $('.detail .row:nth-of-type(2)').css('visibility','visible');
                    }
                });
                //设置打分区域的高度
                $('.evaluation_box').height($(window).height()-$('#canvas').height()-$('#clearCanvas').height());
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
        this.canvas.width = this.el.clientWidth*ratio;
        this.canvas.height = this.el.clientHeight*ratio;
        // 设置canvans画布的实际高度
        this.canvas.style.width = this.el.clientWidth+'px';
        this.canvas.style.height = this.el.clientHeight+'px';
        // this.canvas.style.borderBottom = '1px solid #555';
        // 初始化画布
        this.cxt.fillStyle = this.background;
        this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
        this.cxt.strokeStyle = this.color;
        this.cxt.lineWidth = this.linewidth*ratio;
        this.cxt.lineCap = "round";
        //初始化签名时间显示
        this.cxt.font = 16*ratio+"px MicrosoftBlack";
        this.cxt.fillStyle = this.color;
        this.cxt.fillText(signTime, 30*ratio, this.canvas.height / 2);
        //初始化签名背景工单图片
        img.onload = function () {
            _this.cxt.drawImage(img, 0, 0, img.width, img.height)
        };
        //开始绘制
        this.canvas.addEventListener("touchstart", function (e) {
            this.cxt.beginPath();
            this.cxt.moveTo(e.changedTouches[0].pageX*ratio, e.changedTouches[0].pageY*ratio);
            e.preventDefault()
        }.bind(this), false);
        //绘制中
        this.canvas.addEventListener("touchmove", function (e) {
            isMove = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
            this.cxt.lineTo(e.changedTouches[0].pageX*ratio, e.changedTouches[0].pageY*ratio);
            this.cxt.stroke();
            e.preventDefault()
        }.bind(this), false);
        //结束绘制
        this.canvas.addEventListener("touchend", function () {
            this.cxt.closePath();
        }.bind(this), false);
        //清除画布
        this.clearEl.addEventListener("click", function () {
            // 初始化画布
            this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.cxt.fillStyle = this.background;
            this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.width);
            this.cxt.strokeStyle = this.color;
            this.cxt.lineWidth = this.linewidth*ratio;
            this.cxt.lineCap = "round";
            //初始化签名背景工单图片
            this.cxt.drawImage(img, 0, 0, img.width, img.height);
            //初始化签名时间显示
            this.cxt.font = 16*ratio+"px MicrosoftBlack";
            this.cxt.fillStyle = this.color;
            this.cxt.fillText(signTime, 30*ratio, this.canvas.height / 2);
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
            //上传至阿里云
            var params = {
                'id': orderId,
                'backUserId': backUserId,
                "score": score
            };
            initUpload(this.saveEl, this.canvas, params)
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
        var index;
        $('.evaluation_box').on('click', '.fiveStar span', function () {
            index = $(this).index();
            score = index + 1;
            $(this).addClass('active').html('★');
            $('.evaluation_box').find('.fiveStar span:gt(' + index + ')').removeClass('active').html('☆').end().find('.fiveStar span:lt(' + index + ')').addClass('active').html('★');
        })
    }
})(jQuery);
