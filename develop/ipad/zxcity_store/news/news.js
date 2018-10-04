(function($){
    var pageNo = 1;
    var pageSize = 5;
    var num;
   /* var createUser = sessionStorage.getItem('createUser'); //用户id*/
    var shopId =  getUrlParams("shopId") || sessionStorage.getItem('shopId');
    //var merchantId = sessionStorage.getItem("merchantId") || getUrlParams("merchantId"); //商户id
    var REQUEST_URL = {
        NEWS :"shop/dynamicList"
    };

    //tab切换
//    var tabLi = $(".news-nav a");
//    var contentLi = $(".news-container .news-info");
//    tabLi.click(function(){
//        var $this = $(this);
//        var $t = $this.index();
//        tabLi.removeClass("active");
//        $this.addClass("active");
//        contentLi.css('display','none');
//        contentLi.eq($t).css('display','block');
//    });


    //列表
    function menuList(res){ //id表示可传入id值,text表示文本内容，url表示图片地址,date 表示日期
        var sHtml = "";//列表
        if (res.code == 1) {
            if(res.data.length>0){
                $(".no-news").css("display","none");
                for(var i = 0;i<res.data.length;i++){
                    var row = res.data[i];
                    sHtml += '<div class="news-content" data-serviceId="'+ row.shopId +'">'
                    if(row.dynamicType == "text"){
                        sHtml += '<div class="news-bigArticle">' + row.dynamicText + '</div>';
                    }else if(row.dynamicType == "image"){
                        for(var j = 0;j<1;j++){
                            sHtml += '<div class="news-article">' + row.dynamicText + '</div>' +
                                     '<div class="news-image"><img src="' + row.dynamicUploadList[0].filePath + '">' + '</div>';
                        }
                    }else if(row.dynamicType == "video"){
                        for(var h = 0;h<1;h++){
                            sHtml += '<div class="news-article">' + row.dynamicText + '</div>' +
                                     '<div class="news-video" data-serviceId="'+row.dynamicUploadList[0].id+'" data-videoUrl="' + row.dynamicUploadList[0].filePath + '" data-width="' + row.dynamicUploadList[0].fileWidth + '" data-height="' + row.dynamicUploadList[0].fileHeight + '">' +
                                        '<img  src="' + row.dynamicUploadList[0].videoCoverImage + '">' +
                                     '</div>';
                        }
                    }
                    sHtml += '<div class="news-date">' + row.createTime + '</div>' +
                    '</div>';
                }
                $(".news-dynamic-list").html(sHtml);
            }else{
                $(".news-dynamic-list").html("");
                $(".no-news").css("display","block");
            }
    }else {
            layer.alert(res.msg);
        }
    }

    $(".news-info").on("click",".news-video",function(){
        var id = $(this).attr("data-serviceId");
        var videoUrl = $(this).attr("data-videoUrl");
        var layer = window.parent.layer.open({
            type: 1,
            title: false,
            shadeClose: false,
            area: ["350px", "700px"],
            offset: '75px',
            anim: 5,
            content:'<video controls="controls" width="100%" height="auto" autoplay="autoplay" src="' + videoUrl + '"></video>'
        });
    });


    //用ajax初始化列表
    function getAjax(){
        //var shopId = $("#test option:selected").val() == "" ? "" : $("#test option:selected").val();
        var paramStore = "{'pageNo':"+ pageNo + ",'pageSize':" + pageSize + ",'shopId':" + shopId + "}";//云店动态id
        var res = reqAjax(REQUEST_URL.NEWS,paramStore);
        menuList(res);
        if(res.total > 0){
            $("#page6").bootpag({
                total: Math.ceil(res.total / pageSize),
                page: 1,
                maxVisible: 5
            }).on('page',function(event, num){
                var paramStore = "{'pageNo':"+ num + ",'pageSize':" + pageSize + ",'shopId':" + shopId + "}";//云店动态id
                var res = reqAjax(REQUEST_URL.NEWS,paramStore);
                menuList(res);
            }).removeClass("invisible");
        }else{
            $('#page6').addClass("invisible");
            $(".news-dynamic-more").text("暂无更多动态");
        }
    }
    getAjax();

    $("#test").change(function(){
        getAjax();
    });
})(jQuery);
