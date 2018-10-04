/**
 * Created by Administrator on 2018/9/2.
 */
/**
 * Created by Administrator on 2018/8/31.
 */
(function($){
    var page = 0;
    var rows = 10;
    var activityId = getQueryString("activityId");
    var loginUserId =getQueryString("loginUserId") || getQueryString("userId");
    var USER_URL = {
        RESOURLIST : 'circle/selectCircleActivity' //(查询圈子活动详情)
    };
    $("#shade").on("click",function(){
        $('#model').hide();
        $(this).hide();
    });
    $("#model").on("click",function(){
        $('#shade').hide();
        $(this).hide();
    });


    $(function() {// 初始化内容
        getCirlce();
    });

    //查询圈子详细信息含成员
    function getCirlce(){
        layer.load(0, {
            shade: [0.1,'#000'] //0.1透明度的白色背景
        });
        var param = {
            activityId:activityId,
            userId:loginUserId
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            layer.closeAll();
            if (res.code == 1) {
                var data= res.data;
                $(".imgcover").attr("src",data.activityCover);
                $(".active-title").text(data.activityName);
                $(".read-num").text(data.scanNum);
                $(".save-num").text(data.collectionNum);
                $(".time span").text(data.activityBegin + '-' + data.activityEnd);
                $(".adress span").text(data.activityAddress);
                $(".price span").text('￥'+data.activityAveprice);
                if(data.state==1){ //未开始
                    $(".sgow-btn").text("立即报名");
                }else if(data.state==2){//进行中
                    $(".ctrol-btn div").addClass("sgary");
                    $(".sgow-btn").text("活动进行中");
                    $(".sgow-btn").addClass("gray");
                }else{ //已结束
                    if(data.isApply==1){ //已报名 才会晒单
                        $(".sgow-btn").text("我要晒单");
                    }else{
                        $(".sgow-btn").text("已结束");
                        $(".sgow-btn").addClass("gray");
                    }

                    $(".ctrol-btn").hide();

                }
                $('.namin-box span').text(data.scCircleActivityName.naming);
                if(data.scCircleActivitySponsorList){ //冠名商
                    if(data.scCircleActivitySponsorList.length>0){
                        $('.sponsor-lft .sponsor-name').text(data.scCircleActivitySponsorList[0].name);
                        var stice = '';
                        if(data.scCircleActivitySponsorList.length>5){
                            for(var i=0;i<5;i++){
                                var rew = data.scCircleActivitySponsorList[i];
                                stice += '<img src="'+ rew.pic +'">'
                            }
                        }else{
                            for(var i=0;i<data.scCircleActivitySponsorList.length;i++){
                                var rew = data.scCircleActivitySponsorList[i];
                                stice += '<img src="'+ rew.pic +'">'
                            }
                        }
                        $(".sponsor-box .sponsor-img").html(stice);
                    }
                }

                    console.log(data.scCircleActivityPersonList)
                if(data.scCircleActivityPersonList){ //报名
                    if(data.scCircleActivityPersonList.length>0){
                        var sd = '';
                        if(data.scCircleActivityPersonList.length>5){
                            for(var k=0;k<5;k++){
                                var row = data.scCircleActivityPersonList[k];
                                sd += '<img src="'+ row.pic +'">'
                            }
                        }else{
                            for(var k=0;k<data.scCircleActivityPersonList.length;k++){
                                var row = data.scCircleActivityPersonList[k];
                                sd += '<img src="'+ row.pic +'">'
                            }
                        }
                        $(".apply-box .sponsor-img").html(sd);
                    }
                }

                if(loginUserId==data.scCircleInfo.id){ //发起人不显示进入圈子
                    $(".hid-shop").hide();
                }else{
                    $(".hid-shop").show();
                    $(".hid-shop .shop-left img").attr("src",data.scCircleInfo.pic);
                    $(".hid-shop .shop-center h4").text(data.scCircleInfo.name);
                    $(".hid-shop .shop-source").text("来自于"+data.scCircleInfo.circleName+'圈子');
                }

                if(data.scCircleActivityCommentList){ //晒单
                    if(data.scCircleActivityCommentList.length>0){ //晒单
                        $(".show-list").hide();
                        $(".no-list").show();
                        $(".show-list span").text(data.scCircleActivityCommentList.length);
                        if(data.scCircleActivityCommentList.length>2){
                            var num = 2
                        }else{
                            var num =data.scCircleActivityCommentList.length;
                        }
                        var scirl = '';
                        for(var e=0;e<num;e++){
                            var rs = data.scCircleActivityCommentList[e];
                            var pic = rs.pic || "";
                            var name = rs.name || "";
                            var createTime = rs.createTime || "";
                            var commentContent = rs.commentContent || "";
                            scirl += '<div class="list-item">' +
                                        '<div class="list-top">' +
                                            '<img src="'+ pic  +'">' +
                                            '<div class="list-pic">' +
                                                '<div class="list-name">'+ name + '</div>' +
                                                '<div class="list-time">' + createTime + '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="list-center">' +
                                            '<div class="list-text">' + commentContent + '</div>' +
                                        '</div>' +
                                    '</div>'
                        }
                        $(".show-list .list-box").html(scirl);
                    }else{
                       $(".show-list").hide();
                        $(".no-list").show();
                    }
                }else{
                    $(".show-list").hide();
                    $(".no-list").show();
                }
                //活动说明
                $(".explain-content").html('<!DOCTYPE html>'+data.activityIntroduce);
                $(".contact-name span").text(data.scCircleInfo.name);
                $(".contact-phone span").text(data.activityPhone);
            } else {
                layer.msg(res.msg);
            }
        })
    }













})(jQuery);