var layer = layui.layer,
    laytpl = layui.laytpl;
$(function() {
    var typeCode = GetQueryString('code');
    //右侧数据
    //搜索框
    reqAjaxAsync('cms_new/querSearchRecordHotName').done(function(res) {
        var li = '';
        if(res&&res.data){
            for (var i = 0; i < res.data.length; i++) {
                li += '<li><a href="search.html?search=' + res.data[i] + '">' + res.data[i] + '</a></li>';
            }
            $('#searchListBox ul').html(li);
            $('.tt-autocomplete input').attr('placeholder', '大家都在搜：' + res.data[0]);
        }
        
    })
    $('.searchInp').click(function(e) {
        stopPropagation(e);
        $('#searchListBox').addClass('show').removeClass('hide');
    })
    $(document).click(function() {
        $('#searchListBox').addClass('hide').removeClass('show');
    });
    var rData = 'cms_new/queryReArticleHotList';
    //右侧第一栏
    if (typeCode == 1005) {       //问答右侧相关问答
        rPublish(rData, {
            "channelId": "",
            "typeCode": "1005",
            "rows": 4
        }, '#rArticleTpl', '#rArtList');
    } else if (typeCode == 1007) {       //投票右侧相关投票
        rPublish(rData, {
            "channelId": "",
            "typeCode": "1007",
            "rows": 4
        }, '#rArticleTpl', '#rArtList');
    } else {
        rPublish(rData, {
            "channelId": "",
            "typeCode": "1001",
            "rows": 4
        }, '#rArticleTpl', '#rArtList');
    }
    //右侧第二栏
    if(typeCode == 1005) {     //问答右侧热门问答
        rPublish('cms_new/hostquestionList', {}, '#rQuesTpl', '#rVideoList');   
        $('.hot .title').html('相关问答');
        $('.hotRSecond').html('热门问答');
        $('.hotPicture').hide();
    } else if(typeCode == 1007) {     //投票右侧热门投票
        rPublish('cms_new/hostVoteList', {}, '#rvoteTpl', '#rVideoList');
        $('.hot .title').html('相关投票');
        $('.hotRSecond').html('热门投票');
        $('.hotPicture').hide();
    } else {
        rPublish(rData, {
            "channelId": "",
            "typeCode": "1003",
            "rows": 4
        }, '#rVideoTpl', '#rVideoList');
    }

    //右侧第三栏
    rPublish(rData, {
        "channelId": "",
        "typeCode": "1002",
        "rows": 6
    }, '#rImgTpl', '#wonderful');
})

function TopCategories() {
    reqAjaxAsync('cms_new/querSearchRecordHotName').done(function(res) {
        var li = '';
        for (var i = 0; i < res.data.length; i++) {
            li += '<li>' + res.data[i] + '</li>';
        }
        $('#searchListBox ul').html(li);
        $('.tt-autocomplete input').attr('placeholder', '大家都在搜：' + res.data[0]);
    })

}