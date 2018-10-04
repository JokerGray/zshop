(function($) {
		const QUERYMYLIST = 'operations/queryMyMenuList',
			  DELETEMYMENU  =  'operations/deleteMyMenu'
		var layer = layui.layer;
		
		function showList(){
			var userId = sessionStorage.getItem('userId');
			var parms ="{'userId':'"+userId+"'}";
	   		var res =reqAjax(QUERYMYLIST,parms);
	   		if(res.code == 1){
	   			var data = res.data.list;
	   			var version = res.data.version.version
	   			var sHtml = '';
	   			$.each(data,function(i,item){
	   				sHtml += `<li class="app-li select-li" data-id=`+item.id+` data-version=`+version+`>
								<a href=`+item.resource.url+`>
									`+item.resource.name+`
								</a>
								<i class="fa fa-close"></i>
							</li>`
	   				})
	   				$('#app-ul').append(sHtml)
   			}else{
   				layer.msg(res.msg)
   			}
		}
		
        showList();  
		
		//删除
        deleName();
        function deleName(){
        	$('.app-li').on('click','i.fa-close',function(){
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
        }
		
})(jQuery)