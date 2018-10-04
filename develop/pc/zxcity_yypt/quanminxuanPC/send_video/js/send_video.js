var layer = layui.layer;
$(function() {
    // var userId = localStorage.getItem('userId') || '';
    $('#postfiles').removeAttr('disabled');
    //上传视频
    uploadOss({
        btn: "uploadVideo",
        flag: "video",
        size: "50mb"
    });

    //上传封面
    uploadOss({
        btn: 'hidDiv',
        imgDom: "preview",
        flag: "sendLocal"
    });

    $("#selectfiles").click(function() {
        if (!isNull($("#videoHide").html())) {
            //上传本地图片
            $("#hidDiv").click();
        } else {
            layer.msg("请优先上传视频！");
        }
    });

    $('#postfiles').click(function() {
        var videoUrl = $('#videoHide video').attr('src');
        var coverUrl = $('#preview img').attr('src');
        var introduce = $('#videoTxt').val();
        if(isNull(coverUrl) || isNull(videoUrl) || isNull(introduce)) {
            layer.msg('请把信息填写完整!');
        } else {
            var data = {
                userId: 52721,
                dazzleType: 0,
                coverUrl: coverUrl,
                videoUrl: videoUrl,
                introduce: introduce,
                releaseProvince: 42,
                releaseCity: 4201,
                labelIdList: [1],
                dazzleState: 1,
                width:1920,
                height:1080
            }
            reqNewAjaxAsync('/zxcity_restful/ws/rest', 'dazzle/addScDazzleDazzle', data).done(function(res){
                layer.msg(res.msg);
                if(res.code != 1) return false;
                $('#postfiles').attr('disabled', true);
                var timer = setTimeout(function(){
                    location.reload();
                }, 2000);
            })
        }
        
    })
});