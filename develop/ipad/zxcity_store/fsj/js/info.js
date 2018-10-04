$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (typeof results === "undefined" || results == null)
        return null;
    else
        return results[1] || 0;
}


// 初始化清空页面
$(".show-info").empty();
$("#txtCaption").empty();
$(".show-author-name").empty();
$(".show-author-date").empty();


var jsonData = "{'id': " + $.urlParam('id') + "}";
var srcArr = [];
$(function() {

    // 获取详情数据
    var resData = reqAjax('shop/getOne', jsonData);
    if (resData && resData.data) {
        var entity = resData.data;

        $("#txtCaption").text(entity.title);
        $(".show-author-name").text(entity.author);
        $(".show-author-date").text(entity.createTime);
        $(".show-info").html(entity.content);
        
        var imgArr = $(".show-info").find("img");
        $.each(imgArr, function(i, item){
        	$(item).wrap('<a data-index="'+i+'" class="img-show" href="javascript:;"></a>');
        	srcArr[i] = $(item).attr("src");
        });

        if (resData.msg != null)
            $(".show-artice-img").attr("src", resData.msg);
        else
            $(".show-artice-img").attr("src", "../img/touxiang.png");
    }

    $(".show-info").delegate(".img-show","click", function(){
    	//console.log("hyb-image-preview:"+$(this).attr("data-index")+','+srcArr);
    	window.location.href="hyb-image-preview:"+$(this).attr("data-index")+','+srcArr;
    });
    
    // 增加浏览数
    reqAjax('shop/updateView', jsonData);


    // 绑定点赞和取消事件
    $(".show-article-body").on("click", ".btn", function() {
        var val = $(this).text();

        if (val == "点赞") {
            $(this).addClass("ave");
            reqAjax('shop/updateFav', jsonData);
            $(this).text("已赞");
        } else {
            //$(this).removeClass("ave");
            //$(this).text("点赞");-
        }
    });

});