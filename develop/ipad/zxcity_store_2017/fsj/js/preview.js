(function($){
    var REQUEST_URL = {
        'detail': 'shop/getOneInfo', //详情
    };
    var srcArr = [];
    var id = getUrlParams("id");

    // 初始化清空页面
    function reset() {
        $(".show-info").empty();
        $("#txtCaption").empty();
        $(".show-author-name").empty();
        $(".show-author-date").empty();
    };
    //加载方案内容
    function loadProjectInfo() {
        var param = {
            'id': id
        };
        var res = reqAjax(REQUEST_URL['detail'], JSON.stringify(param));
        if (res.code == 1) {
            $("#txtCaption").text(res.data.title);
            var userHead = res.data.userHead ? res.data.userHead :
                "../image/touxiang.png";
            $(".show-artice-img").attr("src", userHead);
            $(".show-author-name").text(res.data.author);
            $(".show-author-date").text(res.data.createTime);
            $(".show-info").html(res.data.content);

            var imgArr = $(".show-info").find("img");
            $
                .each(
                    imgArr,
                    function(i, item) {
                        $(item)
                            .wrap(
                                '<a data-index="' +
                                i +
                                '" class="img-show" href="javascript:;"></a>');
                        srcArr[i] = $(item).attr("src");
                    });
        } else {
            layer.msg(res.msg);
        }
    }

    $(".show-info").delegate(
        ".img-show",
        "click",
        function() {
            //console.log("hyb-image-preview:"+$(this).attr("data-index")+','+srcArr);
            window.location.href = "hyb-image-preview:" +
                $(this).attr("data-index") + ',' + srcArr;
        });

    $(function() {
        reset();
        loadProjectInfo();
    });
})(jQuery);
