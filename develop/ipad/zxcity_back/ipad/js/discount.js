(function($){


    $(".discount-add-menu li").removeClass("active");
    $(".discount-add-menu li").eq(0).addClass("active");
    $(".discount-imgs .discount-wrapper").css("display","none");
    $(".discount-imgs .discount-wrapper").eq(0).css("display","block");
    $(".discount-add-menu li").find(".discount-delete").css("display","none");
    $(".discount-add-menu li").eq(0).find(".discount-delete").css("display","block");

    $(".discount-add-menu").on('click','li',function(){
        //tab切换
        var $wrapperLi = $(".discount-imgs .discount-wrapper");
        var $index = $(this).index();
        $(".discount-add-menu li").removeClass("active");
        $(this).addClass("active");
        $wrapperLi.css("display","none");
        $wrapperLi.eq($index).css("display","block");
        $(".discount-add-menu li").find(".discount-delete").css("display","none");
        $(".discount-add-menu li").eq($index).find(".discount-delete").css("display","block");
    });

    //点击图片弹出框
    $(".discount-imgs").on('click','.discount-wrapper',function(){
        var $this = $(this);
        var id = $this.attr("data-serviceId"); //获取id
        top.layer.open({
            type: 2,
            area: ['1000px', '900px'],
            fix: false, //不固定
            maxmin: true,
            title : "图片设置-优惠",
            content: ctx+'/member/shopSameShow/addLayer.do?type=3&idStr='+id,
            btn: ['确定', '关闭'],
            yes: function(index, layero){
                var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //提交
                iframeWin.contentWindow.sub();
            },
            cancel: function(index){
            }
        });
    });


    //删除
    $(".discount-add-menu").on('click','.discount-delete',function(){
        var $this = $(this);
        var id = $this.parent().attr("data-serviceId"); //获取id
        initLoad();
        addMenu();
        /*top.layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
            $.get('delEssList.do',{
                id:id
            },function(data){
                if(data.code == 1){
                    initLoad();
                    addMenu();
                    top.layer.alert(data.text, {icon: 1});
                }else{
                    top.layer.alert(data.text, {icon: 2});
                }
            });
        });*/
    });

    //点击添加菜单弹出框
    /*$(".discount-menu-add").on('click','li',function(){
        var length = $(".discount-add-menu li").length;
        if(length<5){
            top.layer.open({
                type: 2,
                area: ['1000px', '900px'],
                fix: false, //不固定
                maxmin: true,
                title : "图片设置-优惠",
                content: ctx+'/member/shopSameShow/addLayer.do?type=3',
                btn: ['确定', '关闭'],
                yes: function(index, layero){
                    var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    //提交
                    iframeWin.contentWindow.sub();
                },
                cancel: function(index){
                }
            });
        }else{
            $(".discount-menu-add li").css("display","none");
            *//*top.layer.alert("只能添加五条哟", {icon: 1});*//*
        }

    });*/




    //初始化页面方法
    initLoad();







    function initLoad(){
        $("#pplTab").html("");
        $(".discount-imgs").html("");
        var tabLength = 0;
        $.get('getEssList.do',{
            merchantId:$("#merchantId").val(),
            type:3
        },function(data){
            if(data.length > 0){
                $.each(data, function(k, val){
                    addInfo(val.id,val.img,val.summary,tabLength);
                    tabLength ++;
                });
            }else{
                $(".discount-imgs").html("<div class='discont-default'></div>");
            }

            //文字滚动
            $(document).ready(function (){
                $(".pplTxt-marquee").marquee();
            });
        });
    }

    //点击添加
    $(".discount-menu-add").on("click","li",function(){
        var delLength = $(".discount-menu-add li").length;//默认菜单
        var addLength = $(".discount-add-menu li").length;//新菜单
        addInfo();
    });
    function addInfo(){
        var sHtml = ""; //菜单小图
        var bShtml = ""; //背景大图
        sHtml += '<li data-serviceId=""><img src="../image/1.png"><span class="discount-delete">删除</span></li>';
        bShtml += '<div class="discount-wrapper" data-serviceId="">' +
        '<div class="discount-img"><img src="../image/1.png"/></div>' +
        '<div class="pplarText">' +
        '<ul class="pplTxt-marquee">' +
        '<li>' +11111+ '</li>' +
        '</ul>' +
        '</div>' +
        '</div>';

        $(".discont-default").css("display","none");
        $(".discount-add-menu").append(sHtml);
        $(".discount-imgs").append(bShtml);
        $(".discount-imgs .discount-wrapper").css("display","none");
        $(".discount-imgs .discount-wrapper").eq(0).css("display","block");
        $(".discount-add-menu li").removeClass("active");
        $(".discount-add-menu li").eq(0).addClass("active");
        removeMenu();
    }

//添加相关信息
    /*function addInfo(id,picUrl,text,tabLength){ //picUrl表示图片地址，text表示滚动字幕,id可传id值
        var sHtml = ""; //菜单小图
        var bShtml = ""; //背景大图

        sHtml += '<li data-serviceId="'+ id +'"><img src="'+ picUrl +'"><span class="discount-delete">删除</span></li>';
        bShtml += '<div class="discount-wrapper" data-serviceId="'+ id +'">' +
        '<div class="discount-img"><img src="' + picUrl + '"/></div>' +
        '<div class="pplarText">' +
        '<ul class="pplTxt-marquee">' +
        '<li>' +text+ '</li>' +
        '</ul>' +
        '</div>' +
        '</div>';

        $(".discont-default").css("display","none");
        $(".discount-add-menu").append(sHtml);
        $(".discount-imgs").append(bShtml);
        $(".discount-imgs .discount-wrapper").css("display","none");
        $(".discount-imgs .discount-wrapper").eq(0).css("display","block");
        $(".discount-add-menu li").removeClass("active");
        $(".discount-add-menu li").eq(0).addClass("active");
        removeMenu();
    }*///先注释晚点取消注释

//判断是否添加了菜单，相应的减少默认菜单
    function removeMenu(){
        var addLength = $(".discount-add-menu li").length; //添加后有几个菜单
        var defLength = $(".discount-menu-add li").length; //默认的菜单
        $(".discount-menu-add li").eq(defLength-1).remove();
    }

//判断是否删除，相应的增加默认菜单
    function addMenu(){
        var addLength = $(".discount-add-menu li").length; //添加后有几个菜单
        var defLength = $(".discount-menu-add li").length; //默认的菜单
        $(".discount-menu-add").append('<li><img src="image/discount_add.png"></li>');
    }


})(jQuery);