/**
 * Created by Administrator on 2018/9/4.
 */
/**
 * Created by Administrator on 2018/8/31.
 */
(function($){
    var page = 0;
    var rows = 10;
    var circleId = getQueryString("circleId");
    var circleRecordId = getQueryString("circleRecordId") ;
    var loginUserId =getQueryString("loginUserId") ||getQueryString("userId") ;
    var videoId = getQueryString("videoId");
    var USER_URL = {
        RESOURLIST : 'circle/findCircleRecordById' //(查询圈子详细信息含成员)

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
            circleRecordId:circleRecordId,
            userId:loginUserId
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res) {
            layer.closeAll();
            if (res.code == 1) {
                var data= res.data;
                if(data.contentType==2){//有视频
                    $('.video-list').show();
                    $(".img-hid").hide();
                    $(".video-hid").show();
                    $(".img-list").hide();
                    $(".video-list").show();
                    $('.video-list video').attr("poster",data.videoList[0].videoCover)
                    $('.video-list video').attr("src",data.videoList[0].videoUrl);


                }else{ //0表示文字  1表示图片和文字  2表示视频和文字
                    $('.video-list').hide();
                    $(".video-hid").hide();
                    $(".img-hid").show();
                    $(".img-list").show();
                    $(".video-list").hide();

                }
                $('.circle-tx').attr("src",data.scCircleInfo.circlePortrait);
                $('.circle-nams').text(data.scCircleInfo.circleName);
                $('.add-num').text( data.scCircleInfo.joinTotal+'人加入')
                $(".dynamic-name").text(data.userName);
                $(".dynamic-tl img").attr("src",data.userPic);
                $(".dynamic-time").text(data.createTime);
                $(".dynamic-text").text(data.recordTitle);
                $(".dynamic-img").html('<!DOCTYPE html>'+data.recordContent);
                $(".discuss-num").text(data.commentNum);
                $(".cares-num").text(data.praiseNum);
            } else {
                layer.msg(res.msg);
            }
        })
    }



})(jQuery);