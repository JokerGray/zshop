(function($) {
		const   GETSITEPAGE = 'operations/getSitePage',//分页查询站点配置
				ADDSITE = 'operations/addSite',//新增站点配置
				UPDATESITE = 'operations/updateSite',//修改站点配置
				DELETESITE = 'operations/deleteSite'//删除站点配置
				
				
			//匹配IP
			function checkIp(str){
				return !!str.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/);
			}
				
			//匹配URL
			function checkUrl(domain) {
				  var name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
				  if( !(name.test(domain)))
				  {
				    return false;
				  }
				  else
				  {
				    return true;
				  }
				}
		
			//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.siteName+`</td>
                                	<td class="td3">`+item.siteIp+`</td>
                                	<td class="td4">`+item.siteUrl+`</td>
                                	<td class="td5">`+item.createUser+`</td>
                                	<td class="td6">`+(item.createTime).substring(0,16)+`</td>
                                	<td class="id" style="display:none">`+item.id+`</td>
                                	<td class='row remove-modifier td7'>
                                		<div class='change-parameter w50' data-toggle='modal'  data-target='#change-newuser'>
                                			<i class='edicticon'></i>修改
                                		</div>
                                		<div class='delete-parameter w50'>
                                			<i class='glyphicon glyphicon-minus-sign m5 red delete'></i> 删除
                                		</div>
                                	</td>
                                </tr>`
		        			})
		                
			            $("#tbodyParameter").html(sHtml) 			
			        } else {
			            layer.msg(res.msg);
			        }
			}	
			
			function list(){
				var rows = 10;
		   		var layer = layui.laypage;
		   		var siteName = $("#inquireInput").val();
		   		var parms ="{'page':1,'rows':10,'siteName':'"+siteName+"','siteIp':'','siteUrl':''}";
		   		var res =reqAjax(GETSITEPAGE,parms);
	   			var total = res.total;
				//模拟渲染
				    var render = function(data, curr){
				        var arr = []
				            ,thisData = res;
				        layui.each(thisData, function(index, item){
				            arr.push('<li>'+ item +'</li>');
				        });
				        return arr.join('');
				    };
		   		  //调用分页
		        	layer({
				        cont: 'paging-box'
				        ,first: false
				        ,last: false
				        ,prev: '<' //若不显示，设置false即可
				        ,next: '>'
				        ,pages: Math.ceil(res.total/rows) //得到总页数
				        ,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
				            var page = location.search.match(/page=(\d+)/);
				            return page ? page[1] : 1;
				        }()
				        ,jump: function(obj,first){
				        	var parms ="{'page':1,'rows':10,'siteName':'"+siteName+"','siteIp':'','siteUrl':''}";
				            var res= reqAjax(GETSITEPAGE,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
				        }
				        });
			}
			list();

			
            //新增
				$('#add-newuser').on('click','#add-parameters',function(){
					var siteName = $('#addName').val();
					var siteIp = $('#addIp').val()
					var siteUrl = $('#addSrc').val();
					if(siteName==''){
						layer.msg('请输入站点名')
					}else if(siteIp==''){
						layer.msg('请输入站点IP')
					}else if(!checkIp(siteIp)){
						layer.msg('站点IP格式不正确')
					}else if(siteUrl==''){
						layer.msg('请输入站点路径')
					}else if(!checkUrl(siteUrl)){
						layer.msg('站点链接格式不正确')
					}else{
						var parms ="{'siteName':'"+siteName+"','siteIp':'"+siteIp+"','siteUrl':'"+siteUrl+"'}"
						var res= reqAjax(ADDSITE,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					}
				})
			
			
			//修改。。。
			$('#tbodyParameter').on('click','.change-parameter',function(){
					var id = $(this).parent().siblings('.id').html();
					var siteName = $(this).parent().siblings('.td2').html();
					var siteIp = $(this).parent().siblings('.td3').html();
					var siteUrl = $(this).parent().siblings('.td4').html();
					$('#chaName').val(siteName);
					$('#chaIp').val(siteIp);
					$('#chaSrc').val(siteUrl);
					$('#change-newuser').on('click','#saveParemeterconfig',function(){
						var siteName = $('#chaName').val();
						var siteIp = $('#chaIp').val()
						var siteUrl = $('#chaSrc').val();
						if(siteName==''){
							layer.msg('请输入站点名')
						}else if(siteIp==''){
							layer.msg('请输入站点IP')
						}else if(!checkIp(siteIp)){
							layer.msg('站点IP格式不正确')
						}else if(siteUrl==''){
							layer.msg('请输入站点路径')
						}else if(!checkUrl(siteUrl)){
							layer.msg('站点链接格式不正确')
						}else{
							var parms ="{'id':'"+id+"','siteName':'"+siteName+"','siteIp':'"+siteIp+"','siteUrl':'"+siteUrl+"'}"
							var res= reqAjax(UPDATESITE,parms);
							if(res.code == 1){
								layer.msg(res.msg)
								location.reload();
							}else{
								layer.msg(res.msg)
							}
						}
					})
					
			});	
			
			
			//删除
		  $("#tbodyParameter").on("click", ".delete-parameter", function () {
		  	var id = $(this).parent().siblings('.id').html();//id
	        layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
	                var paramDel = "{'id':'" + id + "'}";
	                var res = reqAjax(DELETESITE, paramDel);
	                if (res.code == 1) {
	                	layer.msg(res.msg);
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						location.reload();
	                } else {
	                    layer.msg(res.msg);
	                }
	            })
		  });

			
						
		//查询
		$('#inquire').on('click',function(){
			list();
		})	
})(jQuery)