/* 
* @Author: Marte
* @Date:   2017-05-20 15:00:51
* @Last Modified by:   Marte
* @Last Modified time: 2017-05-22 18:00:35
*/

$(document).ready(function(){
    var userImg = sessionStorage.getItem('userImg') || "";
    var username = sessionStorage.getItem('username') || "";
    var apikey = sessionStorage.getItem('apikey') || "test";
    var version = sessionStorage.getItem('version') || "1";
    var userId = sessionStorage.getItem("userId") || "";
    var password = sessionStorage.getItem("password") || "";
    var roleId = sessionStorage.getItem("roleIds") || "";
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
           // console.log(data);
           sessionStorage.setItem('resourceTree', JSON.stringify(data));
        }   
        //生成树形导航
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
     var local= location.href;
     console.log(local)
     var allA=$("dl>dd>a")
     // console.log(allA)
     $.each(allA,function(i,item){
      item=$(item);
      item.parent().removeClass("actact")
      var href=item.attr('href');
      if(local.indexOf(href)!=-1){
            item.parent().addClass("actact")
            item.parent().parent().parent().addClass('act')
            item.parent().parent().css('display','block')   
        }
     })
     
     $("#menu-tree").on("click","li",function(){
          $(this).addClass('act').siblings().removeClass("act").children('dl').hide()
          $(this).children('dl').show();
     })
     
     

});





