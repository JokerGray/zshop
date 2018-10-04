(function($){

    $(function(){
        $(".edit-pic-info").append($("#formTemplate").html());
    })

    //点击数字切换
    $("#addPicBox .num-box").delegate(".pic-num", "click", function(){
        var _index = $(this).index();
        $(".edit-pic-info").find(".sub-form:eq("+_index+")").show().siblings().hide();
    });

    //添加
    $("#addPicBox .add-btn").click(function(){
        var len = $("#addPicBox .num-box").find('.pic-num').length;
        if(len >= 5){
            layer.msg("亲，最多加5张图，不能再多咯~~~");
            return ;
        }
        var tempObj = $(".edit-pic-info").find(".sub-form:eq("+(len-1)+")");
        var picName = $(tempObj).find("input[name=picName]").val(),
            picDesc = $(tempObj).find("input[name=picDesc]").val(),
            picUrl = $(tempObj).find("input[name=picUrl]").val();
        if(picUrl == ""){
            layer.msg("请先上传图片，再增加新的图片内容！");
            return;
        }

        var str = '<span class="pic-num">'+(len+1)+'</span>';
        $("#addPicBox .num-box").append(str);
        $(".edit-pic-info").find(".sub-form:lt("+(len)+")").hide();
        $(".edit-pic-info").append($("#formTemplate").html());
    });
    //移除
    $("#addPicBox .remove-btn").click(function(){
        var len = $("#addPicBox .num-box").find('.pic-num').length;
        if(len == 1){
            layer.msg("亲，都被删完啦，必须保留一张图~~~");
            return;
        }
        var tempObj = $(".edit-pic-info").find(".sub-form:eq("+(len-1)+")");
        var picUrl = $(tempObj).find("input[name=picUrl]").val();
        if(picUrl != ""){
            layer.confirm('确定要删除当前图片信息么？', {btn: ['确定','取消']}, function(index){
                $("#addPicBox .num-box").find(".pic-num:eq("+(len-1)+")").remove();
                $(".edit-pic-info").find(".sub-form:eq("+(len-1)+")").remove();
                $(".edit-pic-info").find(".sub-form:eq("+(len-2)+")").show();
                layer.close(index);
            }, function(index){
                layer.close(index);
            });
        }
    });


    //图片轮播预览
    function showCarouselPic(){
        /*var str_1 = '', str_2 = '';
        for(var )
        str_1 += '<li data-target="#storeCarouselShow" data-slide-to="0"></li>'
        str_2 += '<div class="item"><img src="image/placeholder_img_01.png" alt="...">'
            + '<div class="carousel-caption"></div>'
            + '</div>'*/
        $("#storeCarouselShow .carousel-indicators").html(str_1);
        $("#storeCarouselShow .carousel-indicators").find("li:eq(0)").addClass("active");
        $("#storeCarouselShow .carousel-inner").html(str_1);
        $("#storeCarouselShow .carousel-inner").find(".item:eq(0)").addClass("active");
    }

})(jQuery);
