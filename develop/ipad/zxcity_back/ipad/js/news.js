(function($){
    var pageNo = 1, pageSize = 5;
    var num;
    var createUser = sessionStorage.getItem('createUser'); //用户id
    var shopId = sessionStorage.getItem('shopId'); //店铺id
    var paramStore = "{'pageNo':"+ pageNo + ";'pageSize':" + pageSize + ";'createUser':" + createUser + ";'shopId':" + shopId +"}";//云店动态id
    var REQUEST_URL = {

    };

    //tab切换
    var tabLi = $(".news-nav a");
    var contentLi = $(".news-container .news-info");
    tabLi.click(function(){
        var $this = $(this);
        var $t = $this.index();
        tabLi.removeClass("active");
        $this.addClass("active");
        contentLi.css('display','none');
        contentLi.eq($t).css('display','block');
    });


    //文字超出部分用省略号代替
    function moreWord(event,num){
        $(event).each(function(){
            var val = $(this).text();
            var valLength = val.length;
            var subVal = val.substring(0,num)+"...";
            if(valLength>num){
                $(this).text(subVal);
            }else{
                $(this).text();
            }
        });
    }

    moreWord(".news-article",150);
    moreWord(".news-bigArticle",150);

    //列表
    function menuList(res){ //id表示可传入id值,text表示文本内容，url表示图片地址,date 表示日期
        var sHtml = "";
        if (res.code == 1) {
            for (var i = 0; i < res.data.length; i++) {
                var row = res.data[i];
                sHtml += '<div class="news-content" data-serviceId="id">'
                //判断是否是图片，视频，或者只是文字
               if (row.dynamicType != 'text') {
            sHtml += '<div class="news-article">' + row.dynamicText + '</div>' +
            '<div class="news-image">'
            if (row.dynamicType == "image") {
                sHtml += '<img src="' + url + '">'
            } else if(row.dynamicType == "video") {
                sHtml += '<video width="201" height="151" controls="controls">' +
                '<source src="' + +'">' +
                '您的浏览器不支持 video 标签。' +
                '</video>'
            }
            sHtml += '</div>';
        } else {
            //只有文字的时候
            sHtml += ' <div class="news-bigArticle">' + row.dynamicText + '</div>';
        }
            sHtml += '<div class="news-date">' + row.createTime + '</div>' +
            '</div>';
        }
    }else {
            layer.alert(res.msg);
        }
    }
})(jQuery);