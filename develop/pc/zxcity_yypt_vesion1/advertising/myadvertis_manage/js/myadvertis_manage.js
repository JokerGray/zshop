$(function(){
        var CMD_ADLIST='operations/adList',//查询广告列表
            CMD_ADINFO='operations/adInfo',//查询广告详情
            CMD_SOURCE='operations/pageQueryResource',//查询资源库图片
            QUERYADVER= 'operations/queryAdSpace', //(查询广告位宽高)
            CMD_ADDSOURCE='operations/addAdResource',//添加图片视频到资源库
            CMD_ADADD='operations/addTAd';
            var USERNAME=yyCache.get('username')||'admin';
    var locked = true;
    //查询广告位宽高
    function getadverSet(){
        var param = {};
        reqAjaxAsync(QUERYADVER, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
                var row = res.data;
                $(".select-adver .leftimg").attr("data-width",row[0].width);
                $(".select-adver .leftimg").attr("data-height",row[0].height);
                $(".select-adver .rgtimg").attr("data-width",row[1].width);
                $(".select-adver .rgtimg").attr("data-height",row[1].height);
                $(".select-adver .leftimg").width((row[0].width/100)*70);
                $(".select-adver .leftimg").height((row[0].height/100)*70);
                $(".select-adver .leftimg").css("line-height",(row[0].height/100)*70 + "px");
                $(".select-adver .rgtimg").width((row[1].width/100)*70);
                $(".select-adver .rgtimg").height((row[1].height/100)*70);
                $(".select-adver .rgtimg").css("line-height",(row[1].height/100)*70 + "px");
            }else{
                layer.msg(res.msg);
            }
        })
    }
    getadverSet();
            //数组序号
            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            };
            //数组删除
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
        var imgArr=[],
            videoArr=[];
        //引入laypage
        var laypage=layui.laypage;
        // 初始化查询
        var queryData={
            sort: "createTime",
            order: "desc",
            page: "1",
            status: "1",
            name: "",
            rows: "10"
        }
        checkAdlist(queryData);
        function checkAdlist(queryData){
            console.log(queryData);
            reqAjaxAsync(CMD_ADLIST, JSON.stringify(queryData)).done(function (res) {
                console.log(res);
                laypage.render({
                    elem:'demo',
                    count:res.total,
                    limit:10,
                    jump:function(obj,first){
                        console.log(obj.curr)
                        console.log(obj.limit)
                        queryData.page=obj.curr;
                        queryAdlist(obj.curr,obj.limit,queryData)
                    }
                });
            });            
        }

    $('#search').on('click',function(){
        var searchVal=$('#searchName').val();
        var queryData={
            sort: "lastUpdateTime",
            order: "desc",
            page: "1",
            status: "1",
            name:searchVal,
            rows: "10"
        }
        checkAdlist(queryData);
    });
    // 查询现有广告
    function queryAdlist(page,rows,queryData){
        console.log('running');
        console.log(queryData)
        reqAjaxAsync(CMD_ADLIST, JSON.stringify(queryData)).done(function (res) {
            showlist(res);
        });
    }

    function showlist(res){
        console.log(res);
        var tmp=template('showadlist',res)
        $('#adList').html(tmp);
        $('.ad-source-item').on('click',function(){
            var id=$(this).attr('data-id');
            console.log(id);
            var queryInfo={
                id:id
            }
            reqAjaxAsync(CMD_ADINFO, JSON.stringify(queryInfo)).done(function (res) {
                console.log(res);
                if(!res.code==1 ||res.data.resData.length==0){
                    layer.msg('资源为空或已被删除！');
                    return false;
                }
                if(res.data.resType=='1'){
                    showSliders(res)
                }else if(res.data.resType=='2'){
                    showVd(res);
                }
            });            
        });
    }
    // 展示视频
    function showVd(res){
        console.log(res);
        var vdlistHtml='';
        for(var i=0;i<res.data.resData.length;i++){
            vdlistHtml+='<li class="video-item" data-src="'+res.data.resData[i].resUrl+'"><a>'+res.data.resData[i].resName+'</a></li>';
        }
        $('.video-items').html(vdlistHtml);
        $('.video-item').on('click',function(){
            var vdSrc=$(this).attr('data-src');
            $('.video-box').html('<video src="'+vdSrc+'" controls  autoplay="autoplay"></video>');
        });
        layer.open({
            type:1,
            title:"广告详情",
            area:['1030px','650px'],
            resize:false,
            content:$('#showAdVd'),
            success:function(){
                setTimeout(function() {
                    $('.layui-layer').removeClass('layer-anim');
                }, 0);
                $('.video-item').eq(0).trigger('click');
            },
            end:function(){
                $('.video-items').html("");
                $('.video-box').html('');
                $('#showAdVd').hide();
            }
        })         
    }
    // 添加轮播图
    function showSliders(res){
        var newtmp=template('tempSlider',res)
        $('#sliderImgs').html(newtmp);        
        // 弹出层
        layer.open({
            type:1,
            title:"广告详情",
            area:['1030px','650px'],
            resize:false,
            content:$('#Sliders'),
            end:function(){
                $('#Sliders').hide();
            }
        }) 
        // 轮播图
        var totalNum=res.data.resData.length;
        if(totalNum==1){
            new Swiper('#sliderBox .swiper-container', {
                noSwiping : true
            });  
            $('.swiper-button-prev').hide();
            $('.swiper-button-next').hide();
        }else{
            $('.swiper-button-prev').show();
            $('.swiper-button-next').show();
            new Swiper('#sliderBox .swiper-container', {
                effect:'fade',
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }, 
                autoplay: {
                delay: 3000,
                stopOnLastSlide: false,
                disableOnInteraction: true,
                },
                pagination:{
                    el:'.swiper-pagination',
                    clickable:true
                }
            });             
        }
    }

    // 新增按钮
    $('#add1').on('click',function(){
        $('#adSource').hide();
        $('#adPage').show();
        $(".select-adver").show();
        $("#addAds").hide();
        $(".add-content").hide();
        $(".work-steps").show();
        $("#nextbtn").show();
    })

    //广告位选择
    $(".select-adver").on("click","div",function(){
        $(".select-adver div").removeClass("actv");
        $(this).addClass("actv");
    });

    //下一步
    $("#nextbtn").on('click',function(){
        var index = $(".select-adver div.actv").index();
        if(index==-1){
            layer.msg("请选择广告位");
        }else{
            $(".work-steps").hide();
            $('#adSource').hide();
            $('#adPage').show();
            $(".select-adver").hide();
            $("#nextbtn").hide();
            $(".add-content").show();
            $("#addAds").show();
            $('.add-content-item').eq(0).trigger('click');
        }
    })
    // 返回按钮
    $('#backBtn').on('click',function(){
        $('#adSource').show();
        $(".select-adver").hide();
        $('#adPage').hide();        
    })

    $('.add-content-item').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var type=$(this).attr('data-type');
        if(type=='1'){
            $('.add-show-chose span').eq(0).trigger('click');
        }
    });
    // 点击展示图片视频资源
    $('.add-show-chose span').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var sourceType=$(this).attr('data-type');
        var reswidth = parseInt($(".select-adver .actv").attr("data-width"));
        var reshight =parseInt($(".select-adver .actv").attr("data-height"));
        imgArr=[];
        videoArr=[];
        sessionStorage.setItem('sourceType',sourceType);
        console.log(sourceType);
        var querySour={
            page:1,
            rows:12,
            restype:sourceType,
            reswidth:reswidth,
            reshight:reshight
        }
        reqAjaxAsync(CMD_SOURCE, JSON.stringify(querySour)).done(function (res) {
            console.log(res);
            laypage.render({
                elem:'sourcePage',
                count:res.total,
                limit:12,
                jump:function(obj,first){
                    console.log(obj.curr)
                    console.log(obj.limit)
                    queryAdSource(obj.curr,obj.limit,sourceType,reswidth,reshight)
                    if(first){
                        return '';
                    }
                }
            });            
            var tempHtml=template('tempSource',res);
            $('#sourceImgs').html(tempHtml);
        });   
    })

    function queryAdSource(page,rows,sourceType,reswidth,reshight){
        var querySour={
            page:page,
            rows:rows,
            restype:sourceType,
            reswidth:reswidth,
            reshight:reshight
        }
        reqAjaxAsync(CMD_SOURCE, JSON.stringify(querySour)).done(function (res) {
            res.sourceType=sourceType;
            console.log(res);
            var tempHtml=template('tempSource',res);
            $('#sourceImgs').html(tempHtml);
            console.log('资源类型'+sourceType);
            if(sourceType=='1'){
                var imgs=$(".imgli");
                for(var i=0;i<imgs.length;i++){
                    imgs[i].setAttribute('source-type','1');
                    var id=imgs[i].getAttribute('data-id');
                    console.log(id);
                    for(var j=0;j<imgArr.length;j++){
                        if(imgArr[j]==id){
                            $(imgs[i]).addClass('active');
                        }
                    }
                }
            }else if(sourceType=='2'){
                var videos=$(".videoli");
                for(var i=0;i<videos.length;i++){
                    videos[i].setAttribute('source-type','2');
                    var id=videos[i].getAttribute('data-id');
                    console.log(id);
                    for(var j=0;j<videoArr.length;j++){
                        if(videoArr[j]==id){
                            $(videoArr[i]).addClass('active');
                        }
                    }
                }
            }

            $("#sourceImgs").on("click","li",function(){
                $(this).find('.chosed_btn').click();
            });

            //选资源方法
           /* function getSource(){*/
                // 点击选取资源
                $('.chosed_btn').on('click',function(event){
                    var id=$(this).attr('data-id');
                    var type=$(this).attr('source-type');
                    event.stopPropagation();
                    // $(this).toggleClass('active');
                    if($(this).hasClass('active')){
                        $(this).removeClass('active');
                        if(type=='1'){
                            imgArr.remove(id);
                        }else if(type=='2'){
                            videoArr.remove(id);
                        }
                    }else{
                        $(this).addClass('active');
                        if(type=='1'){
                            imgArr.push(id);
                        }else if(type=='2'){
                            videoArr.push(id);
                        }
                    }
                    console.log(imgArr);
                    console.log(videoArr)
                });
            /*}*/

            // 点击查看资源内的视频
            $('.videos').on('click',function(){
                var videoSrc=$(this).attr('data-url');
                var name=$(this).attr('data-name');
                $('#sourceVd').html('<video src="'+videoSrc+'" autoplay="autoplay" controls></video>');
                // 弹出层
                layer.open({
                    type:1,
                    title:name,
                    area:['840px','620px'],
                    resize:false,
                    content:$('#sourceVd'),
                    success:function(){
                        setTimeout(function() {
                            $('.layui-layer').removeClass('layer-anim');
                        }, 0);
                    },
                    end:function(){
                        $('#sourceVd').html('');
                        $('#sourceVd').hide();
                    }
                }) 
            });       
        })
    }
    // 点击添加
    $('#addAds').on('click',function(){
        $('#sourceName').val('');
        var sourceArr=[];
        var sourceType=sessionStorage.getItem('sourceType');
        console.log(sourceType);
        if(sourceType=='1'){
            var len=imgArr.length,
                sourceArr=imgArr;
        }else if(sourceType=='2'){
            var len=videoArr.length; 
                sourceArr=videoArr;           
        }
        if(!len){
            layer.msg('请选择资源文件！');
            return false;
        }
        var sourceStr=sourceArr.join(';');
        console.log(sourceStr);  
        layer.open({
            title:'确认选择',
            type:1,
            area:['400px','250px'],
            btn:["确认","取消"],
            content:$('#choseType'),
            yes:function(){
                var regionType=$('#regionType').val(),
                    sourceName=$('#sourceName').val();
                var height = $(".select-adver div.actv").attr("data-height");
                var width = $(".select-adver div.actv").attr("data-width");
                if(sourceName==''){
                    layer.msg('请输入广告名称')
                    return false;
                }
                var resType=sessionStorage.getItem('sourceType');
                var addData={
                    "username": USERNAME,
                    "height":height,
                    "width": width,// 传1
                    name:sourceName,// 广告名称
                    res_id:sourceStr,// 资源的id, 用分号分隔
                    resType:resType// 资源类型, 1图片, 2视频
                }
                console.log(addData);
                if(locked){
                    locked = false;
                    reqAjaxAsync(CMD_ADADD, JSON.stringify(addData)).done(function (res) {
                        if(res.code==1){
                            reloadPage(res);
                    }else{
                        layer.msg(res.msg);
                        locked = true;
                    }

                    })
                }
            },
            end:function(){
                $('#choseType').hide();
            }
        })      
    });
    // 访问成功后刷新页面
    function reloadPage(res){
        unbindClick();
        layer.msg(res.msg,{time:2000});
        setTimeout(function(){
            layer.load(0,{shade:false});
        },2000);
        setTimeout(function(){
            locked = true;
          window.location.reload();  
        }, 2500);
    }
    //解除点击事件
    function unbindClick(){
        $('.layui-layer-close,layui-layer-btn0,layui-layer-btn1').unbind('click');
    }
    
});