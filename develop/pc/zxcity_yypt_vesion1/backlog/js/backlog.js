(function($){
    var categoryId = sessionStorage.getItem("categoryId") || "";
    var userId = yyCache.get("userId");
    var USER_URL =  {
        RESOURLIST : 'operations/itemCountByLink' //(查询权限)
    };

    crateMenu();

    //模块初始化
    function menuDetail(res){
        var str = "";
        for(var i=0;i<res.data.length;i++){
            var row = res.data[i];
            str += '<div data-url="' + row.linkPage + '" data-id="'+ row.categoryId +'" class="backlog-list">'+
                        '<div class="backlog-box">'+
                            '<i class="fa fa-thumb-tack"></i>'+
                            '<span class="mesage">' + row.count + '</span>'+
                        '</div>'+
                        '<div class="backlog-name">' + row.title + '</div>'+
                    '</div>';
        }
        $(".content-body").html(str);
    }

    //加载权限
    function crateMenu(){
        var d1 = {
            categoryId:categoryId,
            userId : userId
        }
        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(d1)).done(function(res){
            if(res.code == 1){
                menuDetail(res);
            }else{
                layer.msg(res.msg);
            }
        });

    }

    //点击链接跳转
    //点击跳转到下一步
    $(".content-body").on("click",".backlog-list",function(){
        var url = $(this).attr("data-url");
        var name = $(this).find(".backlog-name").text();

        if(url==""){
            layer.msg("url为空哟");
        }else{
            if(url.indexOf("/") == -1){
                var newurl = url.replace(".html","/")+url;
                window.top.admin.current(newurl);
                addTab(url,name);
            }else{
                window.top.admin.current(url);
                addTab(url,name);
            }
        }
    });


    //点击左侧菜单，顶部会相应增加tab
    function addTab(url,name){
        
        window.top.misc.openTab(name, url);

        // if(name.length>5){
        //     var newname = name.substr(0,4)+'...';
        // }else{
        //     var newname = name;
        // }
        // var str="";
        // str += '<li class="head-add ave">' +
        // '<a title="'+ name +'" data-href="' + url + '">' +
        // '<span class="head-menus"></span><span class="head-txt">' + newname + '</span>' +
        // '</a>' +
        // '<i class="nav-close"></i>' +
        // '</li>';
        // //遍历是否重复存在
        // var names = $(".menu-head li",window.parent.document);
        // var arr = [];
        // for(var i=0;i<names.length;i++){
        //     arr.push(names.eq(i).find("a").attr("title"));
        //     if(name == names.eq(i).find("a").attr("title")){
        //         names.removeClass("ave");
        //         names.eq(i).addClass("ave");
        //     }
        // }
        // if($.inArray(name,arr) == -1){
        //     var num = sessionStorage.getItem("indx");
        //     $(".menu-nav li",window.parent.document).eq(num).addClass("ave");
        //     $(".menu-head li",window.parent.document).removeClass("ave");
        //     $(".menu-head",window.parent.document).append(str);
        //     moretab();
        //     topmenu();
        // }


    }
    //顶部菜单效果
    function topmenu(){
        var menulist = $(".menu-head li",window.parent.document);
        for(var i=1;i<menulist.length;i++){
            if(i==1){
                menulist.eq(i).css("z-index",98-i);
                menulist.eq(i).css("left",200);
            }else{
                var offsetwith = menulist.eq(i-1).offset().left;
                menulist.eq(i).css("z-index",98-i);
                menulist.eq(i).css("left",offsetwith+148);
            }

        }
    }

    //顶部tab超过8个就关闭倒数第二个
    function moretab(){
        var lengs = $(".menu-head li",window.parent.document).length;
        if(lengs>8){
            $(".menu-head li",window.parent.document).eq(7).remove();
        }
    }
})(jQuery);