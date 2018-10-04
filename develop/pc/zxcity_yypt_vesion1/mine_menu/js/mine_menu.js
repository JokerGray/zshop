(function($){
    var roleId = yyCache.get("roleIds")[0] || "";
    var parenttatu = sessionStorage.getItem("parentstatu"); //权限中只有一个时展示二级菜单 0-二级菜单 1-一级菜单
    var USER_URL =  {
        RESOURLIST : 'operations/getResourceByPid' //(查询权限)
    };

    //初始化
    if(parenttatu==1){
        crateMenu();
    }else{
        crateMenu("",2);
    }


    //模块初始化
    function menuDetail(res){

        var str = "";
        if(res.data.length>0){
            var h = res.data.length-1;
            for(var i=h;i>=0;i--){
                    var row = res.data[i];
                    var rowurl = row.url;
                    if(rowurl.indexOf("#")!=-1){
                        var urls = "";
                    }else{
                        var urls = row.url;
                    }
                    str += '<div data-url="'+ urls +'" data-id="'+ row.id +'" class="menu-box">';
                    if(row.icon=="" || row.icon=="null"){
                        str += '<i class="fa fa-thumb-tack"></i>';
                    }else{
                        str += '<i class="'+ row.icon +'"></i>';
                    }
                    str +=  '<span>' + row.name + '</span>'+
                    '</div>';
            }
            $(".content-body").html(str);
        }
    }

    //加载权限
    function crateMenu(pid,parenttatu){
        if(pid == ""&&parenttatu==1){
            var d1 = {
                roleId:roleId
            }
            reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(d1)).done(function(res){
                if(res.code == 1){
                    menuDetail(res);
                }else{
                    layer.msg(res.msg);
                }

            });
        }else {
            if(pid == ""&&parenttatu==2){
                var d1 = {
                    roleId:roleId
                }
                reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(d1)).done(function(res){
                    if(res.code == 1){
                        var pid = res.data[0].id;
                        var ddl = {
                            roleId:roleId,
                            pid:pid
                        }
                        reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(ddl)).done(function(res){
                            if(res.code == 1){
                                menuDetail(res);
                            }else{
                                layer.msg(res.msg);
                            }

                        });
                    }else{
                        layer.msg(res.msg);
                    }

                });
            }else{
                var d1 = {
                    roleId:roleId,
                    pid:pid
                }
                reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(d1)).done(function(res){
                    if(res.code == 1){
                        menuDetail(res);
                    }else{
                        layer.msg(res.msg);
                    }

                });
            }
        }

    }

    //点击跳转到下一步
    $(".content-body").on("click",".menu-box",function(){
        var id = $(this).attr("data-id");
        var url = $(this).attr("data-url");
        var name = $(this).find("span").text();

            if (url == "") {
                crateMenu(id);
            } else {
                var newurl = url.replace(".html", "/") + url;
                //$("#pageFrame", window.parent.document).attr("src", newurl);
                window.top.admin.current(newurl + "?v=" + new Date().getMilliseconds());
                addTab(url, name);
            }
    });

    //点击左侧菜单，顶部会相应增加tab
    function addTab(url,name){

        window.parent.misc.openTab(name, url);

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