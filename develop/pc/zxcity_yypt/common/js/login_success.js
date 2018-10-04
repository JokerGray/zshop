
$(document).ready(function(){
    var userImg = sessionStorage.getItem('userImg') || "";
    var username = sessionStorage.getItem('username') || "";
    var apikey = sessionStorage.getItem('apikey') || "test";
    var version = sessionStorage.getItem('version') || "1";
    var userId = sessionStorage.getItem("userId") || "";
    var password = sessionStorage.getItem("password") || "";
    var nickname = sessionStorage.getItem('username') || "";
    var roleId = sessionStorage.getItem("roleIds") || "";
    var userNo = sessionStorage.getItem("userno") || "";
    creatMenu()
    function creatMenu(){
        var d1 = {
           roleId:roleId
        }
        d1 = JSON.stringify(d1);
        
        var data = null;
        if(sessionStorage.getItem('resourceTree')){
           data = JSON.parse(sessionStorage.getItem('resourceTree'));
        }else{
           var res = reqAjax("operations/resourceTreeOwned",d1);
           data = res.data;
           //console.log(data);
           sessionStorage.setItem('resourceTree', JSON.stringify(data));
        }
        //生成树形导航
        for(var i = 0;i<data.length;i++){
           var li = $("<li/>");
           $(li).addClass('layui-nav-item');
           $(li).attr("data-num",data[i].id);
           var ae = $("<a/>");
           var as = $("<span/>")
           $(ae).attr('class','layui-nav-a');
           $(as).attr('class','layui-nav-more')
           var ii = $("<i/>");
            if(data[i].icon == "" || data[i].icon == 'null'){
                $(ii).addClass("config");
            }else{
                $(ii).addClass(data[i].icon);
            }
           $(ae).append(ii);
           $(ae).append("&nbsp;&nbsp;");
           $(ae).append(data[i].name);
           $(ae).append(as)

           var dl0 = $("<dl/>");
           $(dl0).addClass('layui-nav-child menu-left ptmenu');


           var children = data[i].children;
           for(var j = 0;j<children.length; j++){
             var dd = $("<dd/>");
             var dvs = $("<div/>");
             var aee = $("<a/>");
             var ass = $("<span/>");
             $(dvs).attr('class','nav-children-title');
             $(ass).attr('class','fa fa-angle-double-right');
             $(aee).addClass('layui-children-childs');
             $(aee).attr("data-href",children[j].url);
             $(aee).append(children[j].name);

               var dl1 = $("<dl/>");
               $(dl1).addClass('layui-nav-children menu-left');
               var childrens = children[j].children;
               for(var k = 0;k<childrens.length; k++){
                   var dds = $("<dd/>");
                   var aees = $("<a/>");
                   $(aees).addClass('layui-children-child');
                   $(aees).attr("data-href",childrens[k].url);
                   $(aees).append("•&nbsp;&nbsp;");
                   $(aees).append(childrens[k].name);
                   $(dds).append(aees);
                   $(dl1).append(dds);
               }
             $(dvs).append(ass);
             $(dvs).append(aee);
             $(dd).append(dvs);
             $(dd).append(dl1);
             $(dl0).append(dd);
           }
           $(li).append(ae);
           $(li).append(dl0);
           $('#menu-tree').append(li);
         }               
    }
     var local= location.href;
     var allA=$("dl>dd>div>a")
     // console.log(allA)
     $.each(allA,function(i,item){
      item=$(item);
      item.parent().removeClass("actact")
      var href=item.attr('data-href');
      if(local.indexOf(href)!=-1){
            item.parent().addClass("actact");
            item.parent().parent().parent().addClass('act')
            item.parent().parent().css('display','block');
        }
     });

    $("#menu-tree").on("click","li>a",function(){
        var clas = $(this).parent().attr("class");
        var chalClas = $(this).attr("class");
        if(chalClas == "layui-nav-a"){
            $("#menu-tree li").removeClass("act");
            $("#menu-tree li>a").removeClass("accv");
            $(this).addClass("accv");
            $(this).parent().addClass('act').siblings().removeClass("act").children('dl').hide();
            $(this).parent().children('dl').show();
        };
        if(chalClas == "layui-nav-a accv"){
            $(this).removeClass("accv");
            $(this).parent().children('dl').hide();
        }
    });


    //点击二级菜单的箭头显示和隐藏
    $("#menu-tree").on("click",".nav-children-title span",function(){
        var clas = $(this).attr("class");
        if(clas == "fa fa-angle-double-right"){
            $(".nav-children-title span").attr("class","fa fa-angle-double-right");
            $(".nav-children-title").next(".layui-nav-children").hide();
            $(this).attr("class","fa fa-angle-double-down");
            $(this).parents("dd").children('.layui-nav-children').show();
            $(".layui-nav-child>dd").removeClass("actact");
            $(this).parents("dd").addClass("actact");
        };
        if(clas == "fa fa-angle-double-down"){
            $(this).attr("class","fa fa-angle-double-right");
            $(this).parents("dd").children('.layui-nav-children').hide();
            $(this).parents("dd").removeClass("actact");
        };
    })


     //点击导航右侧iframe变换url(二级菜单)
    $("#menu-tree").on("click","dl dd .nav-children-title>a",function(){
        $("#menu-tree dl dd").removeClass("actact");
        $("#menu-tree li").removeClass("act");
        $(".layui-nav-children a").removeClass("avection");
        $(this).parents("dd").addClass("actact");
        $(this).parents("li").addClass('act');
    //    $(this).parent().parent().css('display','block');
        var url = $(this).attr("data-href");
        if(url.indexOf("html")>-1){
            sessionStorage.setItem("localUrl",url);
            $("#pageFrame").attr("src", url);
        }else{
            layer.msg("请添加URL地址");
        }
    });
    


    //三级菜单点击跳转
    $("#menu-tree").on("click",".layui-nav-children a",function(){
        $("#menu-tree dl dd").removeClass("actact");
        $(".layui-nav-children a").removeClass("avection");
        $(this).parents("li").addClass('act');
        $(this).addClass("avection");
        var url = $(this).attr("data-href");
        if(url.indexOf("html")>-1){
            sessionStorage.setItem("localUrl",url);
            $("#pageFrame").attr("src", url);
        }else{
            layer.msg("请添加URL地址");
        }
    });
    
        //控制台变化ifream
    $('#contorl-concrol').on('click',function(){
    	$("#pageFrame").attr("src", 'success.html');
    });

    //点击之后刷新依然会选中

    var localUrl=sessionStorage.getItem("localUrl");
    var $dd=$("#menu-tree .layui-children-childs");
    var $dds=$("#menu-tree .layui-children-child");
    $dd.each(function(i,item){
        item=$(item);
        var href=item.attr("data-href");
        if(href != ""&&localUrl != null){
            if(localUrl.indexOf(href)>-1){
                item.parents("dl").show();
                item.parents("dd").addClass("actact");
                item.parents("li").find(".layui-nav-a").addClass("accv");
                item.parents("li").addClass("act");
                $("#pageFrame").attr("src", localUrl);
            }
        }

    })
    $dds.each(function(i,item){
        item=$(item);
        var href=item.attr("data-href");
        if(href != "" &&localUrl != null){
            if(localUrl.indexOf(href)>-1){
                item.addClass("avection");
                item.parents(".layui-nav-children").show();
                item.parents(".layui-nav-child").show();
                item.parents(".layui-nav-children").parent().removeClass("actact");
                item.parents(".layui-nav-child").addClass("act");
                item.parents("li").find(".layui-nav-a").addClass("accv");
                item.parents("li").addClass("act");
                $("#pageFrame").attr("src", localUrl);
            }
        }

    })
});

// 子页面修改了url，主页面对应的菜单样式也会改变
function changeUrl(url){
    var dom = null;
    $('.layui-nav a').each(function(){
        if(!$(this).data('href')) return;
        if(url.indexOf($(this).data('href')) > -1) dom = this;
    });
    if(!dom) return;
    // 若找到，则处理对应关系，一二三层分开处理
    $('.layui-nav-item dd.actact').removeClass('actact');
    $('.layui-children-child.avection').removeClass('avection');
    
    var $dom = $(dom);
    // 若当前节点为第三层
    if($dom.hasClass('layui-children-child')){
        // 两层，可以直接使用点击方法
        var parent_2 = $dom.parent().parents('dd');
        var parent_1 = $dom.parents('li.layui-nav-item');
        // 顶级可点击
        if(parent_2.is(':hidden')){
            parent_1.find('>a').click();
        }
        // 第二级可点击
        var sp = parent_2.find('.nav-children-title span.fa');
        if($dom.is(':hidden')){
            sp.click()
        }
        $dom.addClass('avection');
    }
    // 若当前节点为第二层
    if($dom.hasClass('layui-children-childs')){
        var parent_2 = $dom.parents('dd');
        var parent_1 = $dom.parents('li.layui-nav-item');
        if(parent_2.is(':hidden')){
            parent_1.find('>a').click();
        }
        $dom.parents('dd').addClass('actact');
    }
}