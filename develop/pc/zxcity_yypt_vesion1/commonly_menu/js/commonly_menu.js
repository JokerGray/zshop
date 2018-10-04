(function($) {
		const QUERYMYLIST = 'operations/queryMyMenuList',
			  DELETEMYMENU  =  'operations/deleteMyMenu'
		var layer = layui.layer;
		
		function showList(){
			var userId = yyCache.get('userId');
			var parms ="{'userId':'"+userId+"'}";
	   		var res =reqAjax(QUERYMYLIST,parms);
	   		if(res.code == 1){
	   			var data = res.data.list;
	   			var version = res.data.version.version
	   			var sHtml = '';
                sHtml += '<li id="add-menu" class="app-li" active=false>' +
                            '<a href="../commonly_menu-detail/commonly_menu-detail.html">' +
                                '<i class="fa" id="fa"></i>'+
                                '<i class="tit">添加常用菜单</i>' +
                            '</a>'+
                        '</li>';
	   			$.each(data,function(i,item){
		   				if(item.customName!=null){
                            sHtml+='<li class="app-li select-li" data-name="' + item.customName + '" data-id="' + item.id + '" data-version="' + version + '" data-url="' + item.resource.url +'">' +
                                        '<a href="javascript:;">'
                                            if(item.resource.icon=="" || item.resource.icon==null){
                                                sHtml += '<i class="fa default"></i>';
                                            }else{
                                                sHtml += '<i class="'+ item.resource.icon +'"></i>';
                                            }
                            sHtml+='<span>' + item.customName + '</span>' +
                                    '</a>' +
                                '<i class="me-close"></i></li>';
		   					/*sHtml+=`<li class="app-li select-li" data-name=`+item.resource.name+` data-id=`+item.id+` data-version=`+version+` data-url=`+item.resource.url+`>
									<a href="javascript:;"><img src="icon/menu-bg.png"/><span>`+item.customName+`</span></a><i class="me-close"></i></li>`*/
		   				}else{
                            sHtml += '<li class="app-li select-li" data-name="'+ item.resource.name +'" data-id="'+ item.id +'" data-version="' + version + '" data-url="'+item.resource.url+'">' +
                                        '<a href="javascript:;">'
                                            if(item.resource.icon=="" || item.resource.icon==null){
                                                sHtml += '<i class="fa default"></i>';
                                            }else{
                                                sHtml += '<i class="'+ item.resource.icon +'"></i>';
                                            }
                            sHtml+='<span>' + item.resource.name + '</span>' +
                            '</a>' +
                            '<i class="me-close"></i></li>';
		   					/*sHtml+=`<li class="app-li select-li" data-name=`+item.resource.name+` data-id=`+item.id+` data-version=`+version+` data-url=`+item.resource.url+`>
									<a href="javascript:;"><img src="icon/menu-bg.png"/><span>`+item.resource.name+`</span></a><i class="me-close"></i></li>`*/
		   				}
	   				})
	   				$('#app-ul').html(sHtml)
   			}else{
   				layer.msg(res.msg)
   			}
		}
		
        showList();  
		
		//删除
    	$('#app-ul').on('click','i.me-close',function(event){
    		event.stopPropagation();
    		var version = $(this).parent().attr('data-version');
    		var id = $(this).parent().attr('data-id')//id
        	layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var paramDel = "{'id':'" + id + "','version':'" + version + "'}";
                var res = reqAjax(DELETEMYMENU, paramDel);
                if (res.code == 1) {
                	layer.msg(res.msg);
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					location.reload();
                } else {
                    layer.msg(res.msg);
                }
            })
    	})

        
        //跳转
        $('#app-ul').on('click','.select-li',function(){
        	var url = $(this).attr('data-url');
        	var name = $(this).attr('data-name');
	        if(url != ""){
                if(url.indexOf("/") == -1){
                    var newurl = url.replace(".html","/")+url;
                    sessionStorage.setItem("localUrl",newurl);
                    //$("#pageFrame",window.parent.document).attr("src", newurl);
                    window.top.admin.current(newurl);
                    addTab(newurl,name);
                }else{
                    sessionStorage.setItem("localUrl",url);
                    //$("#pageFrame",window.parent.document).attr("src", url);
                    window.top.admin.current(url);
                    addTab(url,name);
                }

	        }

        })
        
        
        
        //查询
        $("#search").click(function(){
            var namesch = $.trim($("#name").val());
            if(namesch != ""){
                var list = $("#app-ul").find(".select-li");
                for(var i=0;i<list.length;i++){
                    var nam = list.eq(i).attr("data-name");
                    if(nam.indexOf(namesch)== -1){
                        list.eq(i).hide();
                    }
                }
            }else{
                showList();
            }
        });
        
        //关联鼠标右键事件
    document.oncontextmenu = function(){return false};   //禁止鼠标右键菜单显示

    $("#app-ul").on("mousedown",".select-li",function(e){
        if (3 == e.which) {
            var version = $(this).attr('data-version');
            var id = $(this).attr('data-id')//id
            layer.confirm(
                "确认删除?",
                {icon: 3, title:'提示'},
                function(index){
                    var paramDel = "{'id':'" + id + "','version':'" + version + "'}";
                    var res = reqAjax(DELETEMYMENU, paramDel);
                    if (res.code == 1) {
                        layer.msg(res.msg);
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                        location.reload();
                    } else {
                        layer.msg(res.msg);
                    }
                })
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
        //     var str="";
        //     str += '<li class="head-add ave">' +
        //     '<a data-href="' + url + '">' +
        //     '<span class="head-menus"></span><span class="head-txt">' + newname + '</span>' +
        //     '</a>' +
        //     '<i class="nav-close"></i>' +
        //     '</li>';
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
    
    
    //顶部tab超过8个就关闭倒数第二个
    function moretab(){
        var lengs = $(".menu-head li",window.parent.document).length;
        if(lengs>8){
            $(".menu-head li",window.parent.document).eq(7).remove();
        }
    }
    
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
		
})(jQuery)