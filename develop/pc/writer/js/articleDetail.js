$(function() {
    start.getAjax();
});
var start = {
    apikey: localStorage.getItem('apikey') || "",
    version: localStorage.getItem('version') || "1",
    userId: localStorage.getItem('userId') || '',
    articleId: GetQueryString("articleId"),
    getAjax: function() {
        $.ajax({
            type: "POST",
            url: '/zxcity_restful/ws/rest',
            data: {
                // "cmd": "cms_new/queryArticleDetail",
                "cmd": "cms_back/queryArticleById",
                "data": '{"userId": ' + start.userId + ', "articleId": ' + start.articleId + ', "praiseUser" : ""}',
                "version": start.version
            },
            beforeSend: function(request) {
                request.setRequestHeader("apikey", start.apikey);
            },
            success: function(data) {
                isApikey(data);
                if (data.code == 1 && !isNull(data.data)) {
                    var data = data.data;
                    $('#article_title').text(data.articleTitle || '');
                    $('#releaseTime').text(data.releaseTime || '');
                    if(data.scCmsSubscription && data.scCmsSubscription.subscriptionName) {
                        $('#article_author').text(data.scCmsSubscription.subscriptionName || '');
                    }
                    if(!isNull(data.articleContent)) {
                        $('#articleContent').html(formatImg(data.articleContent).replace(/(style=".*")/,""));
                    } else {
                        $('#articleContent').html('');
                    }

                    //判断类型为文章还是图集还是视频：
                    var boxStr = '';
                    var datas = data.scCmsResourcesList;
                    var dataArr = [];
                    if (data.typeCode == '1001') { //普通文章
                        // console.log('普通文章');
                    } else if (data.typeCode == '1002') { //图集
                        console.log('图集');
                        for (var i = 0; i < datas.length; i++) {
                            console.log(123)
                            if (datas[i].resourcesType == 'image') {
                                var str = '<img class="article_image" src="' + datas[i].resourcesUrl + '"><p>'+ datas[i].resourcesRemarks +'</p>';
                                dataArr.push(str);
                            }
                        }
                        boxStr = dataArr.join('');
                    } else if (data.typeCode == '1003') { //视频
                        console.log('视频');
                        for (var i = 0; i < datas.length; i++) {
                            console.log(123);
                            if (datas[i].resourcesType == 'video' && (!isNull(datas[i].videoUrl))) {
                                var str = '<video class="article_video" src="' + datas[i].videoUrl + '" poster="' + datas[i].resourcesUrl + '" controls="controls"></video>';
                                dataArr.push(str);
                            }
                        }
                        boxStr = dataArr.join('');
                    }
                    $('#detail_box').html(boxStr);
                    
                    //监控视频是否播放完成
                    var videoPlayer = $('video')[0];
                    if(!isNull(videoPlayer)) {
                        videoPlayer.addEventListener('ended', function(e){
                            var data = {
                                userId: start.userId,
                                articleId : start.articleId
                            }
                            reqAjaxAsync('cms_new/videoPlayBackTimes', JSON.stringify(data)).done(function(res){
                                console.log(res);
                            })
                        });
                    }
                } else {
                    layer.msg(data.msg);
                }
            },
            error: function() {
                console.log('ajax-error');
            }
        });
    }
};
