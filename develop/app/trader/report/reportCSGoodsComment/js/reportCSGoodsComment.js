$(function () {
    var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');
    var pageSize = 10;
    var backUserId = getUrlParams('backUserId');
    var REQUIRE_URL = {
        shopList: 'reportEmployeeSales/selectShopListByBackUserId',//店铺列表
        totalCateScore:'cs_goodsComment/getShopScoreAndGoodsCommentCount',//4大评分和评论总数
        goodsList:'cs_goodsComment/listScShopGoodsInfoByGoodsName',//查询商品
        commentList:'cs_goodsComment/getShopGoodsCommentList',//评论列表
        commentDetail:'cs_goodsComment/getShopGoodsCommentById',//评论详情
    };
    //初始化分页方法
    function initPageSelector(domId, total, jump) {
        if (total <= pageSize) {
            $('#' + domId).html('');
            return
        }
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: domId,
                count: total, //数据总数，从服务端得到
                theme: "#ccc",
                limit: pageSize,
                groups: 3,
                jump: function (obj, first) {
                    //首次不执行
                    if (!first) {
                        jump ? jump(obj, first) : null
                        //do something
                    }
                }
            })
        })
    }

    //获取店铺列表
    function getShopList() {
        var defer = $.Deferred();
        var params = {
            "backUserId": backUserId
        };
        reqAjaxAsync(REQUIRE_URL['shopList'], JSON.stringify(params)).done(function (res) {
            if (res.code !== 1) {
                layer.msg(res.msg, {icon: 5, time: 1500})
            } else {
                var html = '';
                res.data.shopList.forEach(function (item, index) {
                    html += '<option value="' + item.shopId + '">' + item.shopName + '</option>'
                });
                $('#shopSelector').html(html);
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    //获取评论列表
    function getCommentList(pageNo){
        var shopId = $('#shopSelector').val();
        var havePic = $('#isPicture').val() || '';
        var goodsId = $('#goodsId').val() || '';
        var type = $('#commentSelector').val() || '';
        var params = {
            "havePic": havePic,//是否有图片:1是0否
            "goodsId": goodsId,//商品主键
            "backUserId": backUserId,//登录人编号
            "shopId": shopId,//店铺主键
            "type": type,//1:好评、2中评、3差评
            "pagination": {//分页信息
                "page": pageNo || 1,//页号
                "rows": pageSize//每页数量
            }
        };
        reqAjaxAsync(REQUIRE_URL['commentList'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                var html = '';
                var No = '';
                var commentTypeStr = '';
                var commentTypeCls = '';
                if(res.data.total === 0){
                    html = '<tr><td colspan="10" style="text-align: center">暂无相关数据</td></tr>'
                }else{
                    res.data.rows.forEach(function (item, index) {
                        No = ((pageNo || 1) -1) * pageSize + (index + 1);
                        No = No < 10 ? '0' + No : No;
                        if(item.commentType === '1'){
                            commentTypeStr = '好评';
                            commentTypeCls = 'hao'
                        }else if(item.commentType === '2'){
                            commentTypeStr = '中评';
                            commentTypeCls = 'zhong'
                        }else if(item.commentType === '3'){
                            commentTypeStr = '差评';
                            commentTypeCls = 'cha'
                        }
                        if(!item.imgNameList){
                            item.imgNameList = []
                        }
                        html += '<tr>'
                        +'<td>'+No+'</td>'
                        +'<td>'+item.goodsName+'</td>'
                        +'<td>'+item.orderNo+'</td>'
                        +'<td>'+item.userCode+'</td>'
                        +'<td>'+item.scoreDesc+'</td>'
                        +'<td>'+item.scoreDelivery+'</td>'
                        +'<td>'+item.scoreService+'</td>'
                        +'<td>'+item.imgNameList.length+'</td>'
                        +'<td>'
                        +'<span class="starIcon '+commentTypeCls+'"></span>'
                        +'<span>'+commentTypeStr+'</span>'
                        +'</td>'
                        +'<td><a href="javascript:;" data-id="'+item.id+'">查看详情</a></td>'
                        +'</tr>'
                    })
                }
                $('.tableBox table tbody').html(html);
                if(pageNo === 1 || !pageNo){
                    initPageSelector('pageSelect',res.data.total,function (obj, first) {
                        getCommentList(obj.curr)
                    })
                }
            }
        })
    }

    //获取评论详情
    function getCommentDetail(id){
        var defer = $.Deferred();
        var params = {
            "id": id,
            "backUserId": backUserId
        };
        reqAjaxAsync(REQUIRE_URL['commentDetail'],JSON.stringify(params)).done(function (res) {
            if(res.code !== 1){
                layer.msg(res.msg,{icon:5,time:1500})
            }else{
                // res = ress;
                var commentUploadList = res.data.commentUploadList || [];
                var imagesArr = [];
                var videoUrlAtt = [];
                var fileType = '';
                commentUploadList.forEach(function (item, index) {
                    //获取文件格式 是图片还是视频
                    fileType = item.filePath.substring(item.filePath.lastIndexOf(".")+1,item.filePath.length);
                    fileType = fileType.toLowerCase();
                    if(fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp'){
                        imagesArr.push(item.filePath)
                    }else if(fileType === 'mp4'){
                        videoUrlAtt.push(item.filePath)
                    }
                });
                res.imagesList = imagesArr;
                res.videoUrlList = videoUrlAtt;
                defer.resolve(res)
            }
        });
        return defer.promise()
    }

    layui.use(['form','rate','layer'],function () {
        var rate = layui.rate;
        var form = layui.form;
        var layer = layui.layer;

        //获取4大评分和评论总数
        function getCateScore(){
            var defer = $.Deferred();
            var shopId = $('#shopSelector').val();
            var params = {
                "backUserId": backUserId,
                "shopId": shopId
            };
            reqAjaxAsync(REQUIRE_URL['totalCateScore'],JSON.stringify(params)).done(function (res) {
                if(res.code !== 1){
                    layer.msg(res.msg,{icon:5,time:1500})
                }else{
                    defer.resolve(res);
                    $('.commentsOverview>ul>li:eq(0)').find('h4').text(res.data.score);
                    $('.commentsOverview>ul>li:eq(1)').find('h4').text(res.data.scoreDesc);
                    $('.commentsOverview>ul>li:eq(2)').find('h4').text(res.data.scoreDelivery);
                    $('.commentsOverview>ul>li:eq(3)').find('h4').text(res.data.scoreService);
                    $('.commentsOverview>ul>li:eq(4)').find('h4').text(res.data.shopGoodsCommentCount);
                    rate.render({
                        elem: '#shopScore',
                        value: res.data.score,
                        half:true,
                        readonly: true
                    });
                    rate.render({
                        elem: '#dscScore',
                        value: res.data.scoreDesc,
                        half:true,
                        readonly: true
                    });
                    rate.render({
                        elem: '#ShipScore',
                        value: res.data.scoreDelivery,
                        half:true,
                        readonly: true
                    });
                    rate.render({
                        elem: '#attitudeScore',
                        value: res.data.scoreService,
                        half:true,
                        readonly: true
                    });
                }
            });
            return defer.promise()
        }

        //获取店铺列表
        getShopList().done(function () {
            form.render('select');
            $('.shopName').text($('#shopSelector :selected').text());
            //获取4大评分
            getCateScore();
            // 获取评论列表
            getCommentList();
        });

        //切换店铺
        form.on('select(shopSelector)',function () {
            $('.shopName').text($('#shopSelector :selected').text());
            //获取4大评分
            getCateScore();
            // 获取评论列表
            getCommentList();
        });

        //查看评论详情
        $('.tableBox').on('click','table tbody td a',function () {
            var id = $(this).attr('data-id');
            getCommentDetail(id).done(function (res) {
                var html = template('detailTpl',res);
                layer.open({
                    type:1,
                    area:['900px','535px'],
                    closeBtn:false,
                    title:'',
                    shade:0.5,
                    shadeClose:true,
                    scrollbar:false,
                    skin:'detailPage',
                    content:html,
                    success:function (layeror, index) {
                        $(layeror).on('click','.closeIcon',function () {
                            layer.close(index)
                        });
                        rate.render({
                            elem: '#dscSame',
                            value: res.data.scoreDesc,
                            readonly: true
                        });
                        rate.render({
                            elem: '#shipSpeed',
                            value: res.data.scoreDelivery,
                            readonly: true
                        });
                        rate.render({
                            elem: '#serviceAttitude',
                            value: res.data.scoreService,
                            readonly: true
                        });
                        //查看评论图片
                        layer.photos({
                            photos: '#layer-photos',
                            anim: 5,
                        });
                        //查看评论视频
                        $(layeror).on('click','#layer-photos video',function () {
                            // var videoSrc = $(this).attr('src');
                            // $(this)[0].pause();
                            videoPage(this)
                        })
                    }
                })
            })
        });

        //切换评论级别
        form.on('select(commentSelector)',function () {
            // 获取评论列表
            getCommentList();
        });

        //切换评论是否晒图
        form.on('select(isPicture)',function () {
            // 获取评论列表
            getCommentList();
        });

        //查询商品
        $('#keyword').on('keyup',function () {
            var keyWord = $(this).val().trim();
            if(keyWord === '' || !keyWord){
                $('#goodsId').val('');
                $('.keyBox ul').html('').hide();
                $('.mask').hide();
                getCommentList();
                return
            }
            var params = {
                "backUserId":backUserId,
                "goodsName": keyWord
            };
            $.ajax({
                type:'post',
                url:'/zxcity_restful/ws/rest',
                headers:{apikey:apikey},
                dataType:'json',
                data:{
                    cmd:REQUIRE_URL['goodsList'],
                    data:JSON.stringify(params)
                },
                error:function (data) {
                    layer.msg('系统繁忙，请稍后再试!')
                },
                success:function (res) {
                    if(res.code !== 1){
                        layer.msg(res.msg,{icon:5,time:1500})
                    }else{
                        var html = '';
                        if(res.data.length === 0){
                            html = '<li style="color: #999;" data-id="">无匹配项目</li>'
                        }else{
                            res.data.forEach(function (item, index) {
                                html += '<li data-id="'+item.id+'" class="option">'+item.goodsName+'</li>'
                            })
                        }
                        $('.mask').show();
                        $('.keyBox ul').html('').html(html).show();
                    }
                }
            })
        });

        //确认选中的商品
        $('.keyBox').on('click','ul .option',function () {
            var goodsId = $(this).attr('data-id');
            var goodsName = $(this).text();
            $('#goodsId').val(goodsId);
            $('#keyword').val(goodsName);
            $('.keyBox ul').html('').hide();
            $('.mask').hide();
            getCommentList()
        });

        // 点击遮罩隐藏搜索结果框
        $('.mask').height($(window).height()).click(function () {
            $(this).hide();
            $('.keyBox ul').html('').hide();
            $('#goodsId').val('');
            $('#keyword').val('');
            getCommentList()
        });

        //查看评论视频弹窗
        function videoPage(_this){
            var videoSrc = $(_this).attr('src');
            var html = template('videoTpl',{videoSrc:videoSrc});
            layer.open({
                type:1,
                shade:0.8,
                title:'',
                shadeClose:true,
                closeBtn:false,
                area:['352px','626px'],
                skin:'videoPage',
                content:html,
                end:function(){
                    $(_this)[0].play()
                },
                success:function () {
                    $(_this)[0].pause()
                }
            })
        }

        //导出
        $('.exportBtn').click(function () {
            var shopId = $('#shopSelector').val();
            var havePic = $('#isPicture').val() || '';
            var goodsId = $('#goodsId').val() || '';
            var type = $('#commentSelector').val() || '';
            var url = '/zxcity_restful/ws/cs_goodsComment/exportShopGoodsCommentList?backUserId='+ backUserId+'&shopId='+shopId+'&havePic='+havePic+'&goodsId='+goodsId+'&type='+type;
            $(this).attr('href',url)
        })
    })

});