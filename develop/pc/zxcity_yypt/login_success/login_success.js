/* 
* @Author: Marte
* @Date:   2017-05-20 15:00:51
* @Last Modified by:   Marte
* @Last Modified time: 2017-05-22 14:29:03
*/

$(document).ready(function(){
    var userImg = sessionStorage.getItem('userImg') || "";
    var username = sessionStorage.getItem('username') || "";
    var apikey = sessionStorage.getItem('apikey') || "test";
    var version = sessionStorage.getItem('version') || "1";
    var userId = sessionStorage.getItem("userId") || "";
    var password = sessionStorage.getItem("password") || "";
    // creatMenu()

    // creatMenu()
    function creatMenu(){
        var d1 = {
           roleId:userId
        }
        d1 = JSON.stringify(d1);
        var res = reqAjax("operations/resourceTree",d1);
        var data = res.data;
        console.log(data)
         for(var i = 0;i<data.length;i++){
           var li = $("<li/>");
           $(li).addClass('layui-nav-item');
           $(li).attr("data-num",data[i].id);
           var ae = $("<a/>");
           var as = $("<span/>")
           $(as).attr('class','layui-nav-more')
           var ii = $("<i/>");
           $(ii).addClass('config');
           $(ae).append(ii);
           $(ae).append("&bull;&nbsp;&nbsp;");
           $(ae).append(data[i].name);
           $(ae).append(as)

           var dl0 = $("<dl/>");
           $(dl0).addClass('layui-nav-child menu-left');

           
           var children = data[i].children;
           for(var j = 0;j<children.length; j++){
             var dd = $("<dd/>");
             var aee = $("<a/>");
             $(aee).attr("href",children[j].url);
             $(aee).append("•&nbsp;&nbsp;");
             $(aee).append(children[j].name);
             $(dd).append(aee);
             $(dl0).append(dd);
           }
           $(li).append(ae);
           $(li).append(dl0);
           $('#menu-tree').append(li);
         }               
    }
     console.log($("#menu-tree a").eq(0))
     $("#menu-tree").on("click","a",function(){
    
      $(this).parent().siblings().find("dl").hide()
      $(this).siblings("dl").toggle()
     })
     // 初始化 添加样式 和展开
     $("#menu-tree li").eq(0).addClass("act")
     $("#menu-tree a").eq(0).siblings("dl").show()
     
     
     
});





