$(function(){
    var userId = GetQueryString('userId');
    var articleId = GetQueryString('articleId');
    console.log(articleId);
    reqNewAjaxAsync('queryArticleDetailBy', {'userId': userId, 'articleId': articleId}).done(function(res){
        if(res.code != 1) return layer.msg(res.msg);
        var data = res.data;
        if(!isNull(data)){
            $('#artTitle').html(data.articleTitle || '');
            if(data.scCmsSubscription && data.scCmsSubscription.subscriptionName) $('#artAuthor').html(data.scCmsSubscription.subscriptionName);
            $('#artTime').html(data.releaseTime);
            if(!isNull(data.articleContent)) {
                $('#artCon').html(formatImg(data.articleContent));
            } else {
                $('#artCon').html('');
            }
            var list = data.scCmsResourcesList;
            if(list) {
                var resourceHtml = '';
                for(var i = 0; i < list.length; i++){
                    if(list[i].resourcesType == 'video'){
                        resourceHtml = "<video src='"+ list[i].videoUrl +"' poster='"+ list[0].resourcesUrl +"' controls='controls' preload='auto'></video>"
                        $('.artResourceBox').append(resourceHtml);
                    } 
                    if(list[i].resourcesType == 'image') {
                        resourceHtml = "<img src='"+ list[i].resourcesUrl +"' alt=''>";
                        $('.artResourceBox').append(resourceHtml);
                    }
                }
            }
            //监控视频是否播放完成
            if(!isNull($('video')[0])) {
                var videoPlayer = $('video')[0];
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
        }
    })

})