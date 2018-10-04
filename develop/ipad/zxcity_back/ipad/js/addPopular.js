(function($){
    $(".addPopular-content .addPopular-tab").hide();
    $(".addPopular-content .addPopular-tab").eq(0).show();
    //tab切换
    $(".addPopular-nav li").click(function(){
        var index = $(this).index();
        var lists = $(".addPopular-content .addPopular-tab");
        $(".addPopular-nav li").removeClass("active");
        $(this).addClass("active");
        lists.hide();
        lists.eq(index).show();
    });

    //区分导入
    function typeBtn(eve){
        var type = eve.attr("data-type");
        if(type == "商品"){
            alert("商品")
        }else if(type == "服务卡"){
            alert("服务卡")
        }else if(type == "服务套餐"){
            alert("套餐")
        }
    }

    $(".addPopular-content").on("click",".pplImport",function(){
        var _this = $(this);
        typeBtn(_this)
    });
 })(jQuery);