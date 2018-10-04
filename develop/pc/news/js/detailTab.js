    var layer = layui.layer,
    laytpl = layui.laytpl;
    $(function(){
        var nowType;
        var nowUrl = window.location.href;
        var userId = localStorage.getItem("userId") || "1";
        var recommendList = $("#recommendList").html();
        var toutiao = function(){
            this.requestUrl={
                channel: "cms_back/selectAllChannel",
                aticleList: "cms_new/queryReArticleReqList"
            }
            this.d = {
                "channelId": "",
                "typeCode": 1001
            };
            this.dData = {
                "channelId": "",
                "typeCode": 1001,
                "userId":userId,
                "pagination": {
                    "page": 1,
                    "rows": 4
                }
            };
            
        }
        toutiao.prototype={
            getNav:function(d){
                var _this=this;
                var liList ='<li class="active" data-id="">相关推荐</li>';
                reqAjaxAsync(_this.requestUrl.channel, d).done(function(res) {
                    if(res.code != 1) {return layer.msg(res.msg)};
                    if(res.code == 1){
                        var data = res.data;
                        if (!isNull(data)) {
                            for(var i=0;i<data.length;i++){
                                if(i>7){
                                    break;
                                }
                                liList += '<li data-id="'+data[i].channelId+'">'+data[i].channelName+'</li>';       
                            }
                            $(".titleLeft").append(liList);
                        }
                    }
                });

            },
            getList:function(d){
                var _this=this;
                reqAjaxAsync(_this.requestUrl.aticleList, d).done(function(res) {
                    if(res.code != 1) {return layer.msg(res.msg)};
                    if(res.code == 1){
                        var data = res.data;
                        if(isNull(_this.dData.channelId)){
                            if (isNull(data) || isNull(data.list)) {
                                $(".tabControl .con").hide();
                                $(".imgbg").show();
                                return false;
                            }
                        }
                        if(data.list.length<6){
                            $("#updateList").hide();
                            $("#updateListNo").show();
                        }else{
                            $("#updateList").show();
                            $("#updateListNo").hide();
                        }
                        $("#lastHid").val(data.next);
                        $(".tabControl .con").show();
                        laytpl(recommendList).render(data, function(html) {
                            $("#container").html(html);
                        });
                        $(".imgbg").hide();
                    }
                });
            }
        }


        var common=new toutiao();
        // 首次进来获取底部tab的侧边栏
        common.getNav(common.d)
        // 首次进来获取底部列表
        if(nowUrl.indexOf("articleDetail") > 0){
        nowType=common.d.typeCode=1001;
        common.getList(common.d);
        }else if(nowUrl.indexOf("imgDetail") > 0){
        nowType=common.d.typeCode=1002;
        common.getList(common.d);
        }else if(nowUrl.indexOf("videoDetail") > 0){
        nowType=common.d.typeCode=1003;
        common.getList(common.d);
        }else if(nowUrl.indexOf("quesDetail") > 0){
        nowType=common.d.typeCode=1005;
        common.getList(common.d);
        }else if(nowUrl.indexOf("voteDetail") > 0){
        nowType=common.d.typeCode=1007;
        common.getList(common.d); 
        }

        // 点击li切换数据
        $("body").on("click",".titleLeft li",function(){
            var dataId = $(this).attr("data-id");
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            common.d.channelId=dataId;
            common.d.typeCode=nowType;
            common.getList(common.d);
        })
        $("#updateList").click(function() {
            var channelId=$(".titleLeft li[class=active]").attr("data-id"); 
            var d = {
                "channelId":channelId,
                "typeCode": nowType,
                "userId": userId,
                "minbehottime":$("#lastHid").val(),
                "tadrequire": false
            };
            reqAjaxAsync(common.requestUrl.aticleList, d).done(function(res) {
                var data = res.data;
                if (isNull(data) || isNull(data.list)) {
                    $("#updateList").hide();
                    $("#updateListNo").show();
                    return layer.msg("没有更多内容了!");
                }else{
                    if(data.list.length<6){
                        $("#updateList").hide();
                        $("#updateListNo").show();
                    }else{
                        $("#updateList").show();
                        $("#updateListNo").hide();
                    }
                    $("#lastHid").val(data.next);
                    laytpl(recommendList).render(data, function(html) {
                        $("#container").html(html);
                    });
                }
            });
            
        });
    })
//控制微信扫码生成地二维码
init();
function init(){
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 110,
        height : 110
    });
    var newUrl=window.location.href;
    // var commonUrl='http://192.168.14.104:8080/#/';
    var commonUrl="http://share.izxcs.com/toutiao/index.html#/";
    var url;
    if(newUrl.indexOf('articleDetail')!=-1){
        url=commonUrl+'newsInfo/'+GetQueryString("articleId");
    }else if(newUrl.indexOf('imgDetail')!=-1){
        url=commonUrl+'pictures/'+GetQueryString("articleId");
    }else if(newUrl.indexOf('quesDetail')!=-1){
        url=commonUrl+'answerInfo/'+GetQueryString("articleId");
    }else if(newUrl.indexOf('voteDetail')!=-1){
        url = "http://share.izxcs.com/toutiao/index.html";
    }else if(newUrl.indexOf('videoDetail')!=-1){
        url=commonUrl+'videoInfo/'+GetQueryString("articleId");
    }
    qrcode.makeCode(url);
}

$(".erweima").removeAttr("title");
function shareTo(stype){
    var ftit = '';
    var lk = '';
    //获取文章标题
    var newUrl=window.location.href;
    if(newUrl.indexOf('articleDetail')!=-1){
        ftit = $('#articleTitle').text();
        if($(".articleContent img").length>0){
            lk=$(".articleContent img").eq(0).attr("src");
        }else{
            lk='http://'+window.location.host+'/img/fenxiangbg.png';
        }
    }else if(newUrl.indexOf('imgDetail')!=-1){
        ftit = $('#scCmsArticleTitle').html();
        if($("#imgListUl li").length>0){
            lk=$("#imgListUl li").eq(0).find("img").attr("src");
        }else{
            lk='http://'+window.location.host+'/img/fenxiangbg.png';
        }
    }else if(newUrl.indexOf('quesDetail')!=-1){
        ftit = $('.articleContent').text();
        if($(".articleContent img").length>0){
            lk=$(".articleContent img").eq(0).attr("src");
        }else{
            lk='http://'+window.location.host+'/img/fenxiangbg.png';
        }
    }else if(newUrl.indexOf('voteDetail')!=-1){
        ftit = $('.articleContent').html();
        lk='http://'+window.location.host+'/img/fenxiangbg.png';
    }else if(newUrl.indexOf('videoDetail')!=-1){
        ftit = $('#videoExpTitle').text();
        lk='http://'+window.location.host+'/img/fenxiangbg.png';
    }
    var url=encodeURIComponent(document.location.href);
    //qq空间接口的传参
    if(stype=='qzone'){
        window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&sharesource=qzone&title='+ftit+'&pics='+lk+'&summary='+document.querySelector('meta[name="description"]').getAttribute('content'));
    }
    //新浪微博接口的传参
    if(stype=='sina'){
        window.open('http://service.weibo.com/share/share.php?url='+url+'&sharesource=weibo&title='+ftit+'&pic='+lk+'');
    }
}