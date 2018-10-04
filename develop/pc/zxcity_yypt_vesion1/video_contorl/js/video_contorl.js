(function($) {
		const   QUERYVEDIOCATALOGPAGE = 'operations/queryVedioCatalogPage',//分页查询视频目录
				ADDVEDIOCATALOG = 'operations/addVedioCatalog',//新增视频目录
				MODIFYVEDIOCATALOG = 'operations/modifyVedioCatalog',//修改视频目录
				DELVEDIOCATALOG = 'operations/delVedioCatalog'//删除视频目录
		
		sessionStorage.removeItem('parentId');//初始化清空parentId	
			
		  
			//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<tr class=`+item.id+` data-id=`+item.parentId+` data-parentId=`+item.id+` >
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2"><i class="glyphicon glyphicon-play"></i>`+item.catalogName+`</td>
                                	<td class="td3">`+item.seqNumber+`</td>
                                	<td class="td4">`+item.labelName+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="parentId" style="display: none;">`+item.parentId+`</td>
                                	<td class="backgroundUrl" style="display: none;">`+item.backgroundUrl+`</td>
                                	<td class="catalogList" style="display: none;">`+item.catalogList+`</td>
                                	<td class='remove-modifier td5'>
                                		<div class='change-parameter'>
                                			<i class='edicticon'></i>修改
                                		</div>
                                		<div class='delete-parameter'>
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
		   		var layer = layui.laypage;
		   		var parms ="{'page':1,'rows':10000}";
		   		var res =reqAjax(QUERYVEDIOCATALOGPAGE,parms);
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
				        	var parms ="{'page':"+obj.curr+",'rows':10000}"
				            var res= reqAjax(QUERYVEDIOCATALOGPAGE,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
				        }
				        });
			}
			list();
			
			
			//新加的列表
			function addDetail(tr,res,pid) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<tr class=`+pid+` data-id=`+item.parentId+` data-parentId=`+item.id+`>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2"><div style="width:100px;display:inline-block"></div>`+item.catalogName+`</td>
                                	<td class="td3">`+item.seqNumber+`</td>
                                	<td class="td4">`+item.labelName+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="parentId" style="display: none;">`+item.parentId+`</td>
                                	<td class="backgroundUrl" style="display: none;">`+item.backgroundUrl+`</td>
                                	<td class="catalogList" style="display: none;">`+item.catalogList+`</td>
                                	<td class='remove-modifier td5'>
                                		<div class='change-parameter'>
                                			<i class='edicticon'></i>修改
                                		</div>
                                		<div class='delete-parameter'>
                                			<i class='glyphicon glyphicon-minus-sign m5 red delete'></i> 删除
                                		</div>
                                	</td>
                                </tr>`
		        			})
			            $(tr).after(sHtml) 			
			        } else {
			            layer.msg(res.msg);
			        }
			}

			
			//选中每行
		    $("#tbodyParameter").on('click','tr',function(){
		        $("#tbodyParameter tr").removeClass("acve");
		        $(this).addClass("acve");
		        var parentId = $(this).attr('data-id');
		        sessionStorage.setItem('parentId',parentId)
		    });
		    
		    
			//查询二级
			function searchSecond(id,tr,pid){
				var parms ="{'parentId':'"+id+"'}"
	            var res = reqAjax(QUERYVEDIOCATALOGPAGE, parms);
	            addDetail(tr,res,pid)
			}
			
			//重置序号
			function countNumber(){
				var allTr = $('#tbodyParameter>tr')
				var tLen = $('#tbodyParameter>tr').length;
				$.each(allTr,function(i,item){
					$(item).children('.td1').html(i+1)
				})
			}


			//箭头函数
			function downArror(){
				var parentId = $(this).parent().siblings('.id').html();
				var ppId = '.'+parentId
				var oTr = $(this).parent().parent()
				var otrAll = $(oTr).siblings(ppId)
				if($(this).hasClass('glyphicon-play')){
					$(this).removeClass('glyphicon-play').addClass('glyphicon-triangle-bottom')
					searchSecond(parentId,oTr,parentId);
					countNumber();
				}else{
					$(this).removeClass('glyphicon-triangle-bottom').addClass('glyphicon-play')
					otrAll.remove();
					countNumber();
				}
				
				
			}
			
			$('#tbodyParameter').on('click','tr i.glyphicon',downArror)
			
			
			
			
			

			
            //新增
				$('#add-users').on('click',function(){
					var parentId = sessionStorage.getItem('parentId');
					if(parentId==0 || !parentId){
						$('#add-newuser').modal('show')
					}else{
						layer.msg('二级菜单不能添加哦~')
					}
    			})
				$('#add-newuser').on('click','#add-parameters',function(){
						var otr = $('#tbodyParameter>tr.acve');
						var parentId = $(otr).attr('data-parentid');
						if(!parentId){
							parentId = 0;
						}
						var catalogName = $('#addName').val();
						var labelName = $('#addCode').val();
						var seqNumber = $('#addNum').val();
						var backgroundUrl = $('#uploadImg').attr('src');
						if(catalogName==''){
							layer.msg('请输入目录名称~')
						}else if(labelName==''){
							layer.msg('请输入标签名称~')
						}else if(seqNumber==''){
							layer.msg('请输入目录编号~')
						}else if(backgroundUrl=='common/image/user.png'){
							layer.msg('请上传背景图~')
						}else{
							 var paramAdd = "{'parentId':'" + parentId + "','catalogName':'" + catalogName + "','labelName':'" + labelName + "','seqNumber':'" + seqNumber + "','backgroundUrl':'" + backgroundUrl + "'}";
							 console.log(paramAdd)
	               		 	 var res = reqAjax(ADDVEDIOCATALOG, paramAdd);
	               		 	 if (res.code == 1) {
	               		 	 	layer.msg(res.msg);
	               		 	 }else{
	               		 	 	layer.msg(res.msg);
	               		 	 }
	               		 	 $('#add-newuser').modal('hide')
						}
					})				
			
			
			//修改。。。
			$('#tbodyParameter').on('click','.change-parameter',function(){
				$('#change-newuser').modal('show')
				var id = $(this).parent().parent().attr('data-parentid');
				var catalogName = $(this).parent().siblings('.td2').text();
				var labelName = $(this).parent().siblings('.td4').html();
				var seqNumber = $(this).parent().siblings('.td3').html();
				var backgroundUrl = $(this).parent().siblings('.backgroundUrl').html();
				$('#chaName').val(catalogName)
				$('#chaCode').val(labelName)
				$('#chaNum').val(seqNumber)
				$('#CuploadImg').attr('src',backgroundUrl)
				
				
				$('#saveParemeterconfig').on('click',function(){
					var catalogName = $('#chaName').val()
					var labelName = $('#chaCode').val()
					var seqNumber = $('#chaNum').val()
					var backgroundUrl = $('#CuploadImg').attr('src')
					if(catalogName==''){
						layer.msg('请输入目录名称~')
					}else if(labelName==''){
						layer.msg('请输入标签名称~')
					}else if(seqNumber==''){
						layer.msg('请输入目录编号~')
					}else if(backgroundUrl=='common/image/user.png'){
						layer.msg('请上传背景图~')
					}else{
						 var paramCha = "{'id':'"+id+"','catalogName':'" + catalogName + "','labelName':'" + labelName + "','seqNumber':'" + seqNumber + "','backgroundUrl':'" + backgroundUrl + "'}";
	           		 	 var res = reqAjax(MODIFYVEDIOCATALOG, paramCha);
	           		 	 if (res.code == 1) {
	           		 	 	layer.msg(res.msg);
	           		 	 	location.reload();
	           		 	 }else{
	           		 	 	layer.msg(res.msg);
	           		 	 }
	           		 	 $('#change-newuser').modal('hide')
					}
				})
				
			});	
			
			//查询
			$('#inquire').on('click',function(){      
	            var layer = layui.laypage;
				var rows = 10;
				var catalogName = $('#inquireInput').val();
				var parms ="{'page':'1','rows':'10000','catalogName':'"+catalogName+"'}"
				var res= reqAjax(QUERYVEDIOCATALOGPAGE,parms);
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
			        	var parms ="{'page':'"+obj.curr+"','rows':'10000','catalogName':'"+catalogName+"'}"
						var res= reqAjax(QUERYVEDIOCATALOGPAGE,parms);
			            commercialDetail(res);
			            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
			            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
			        }
			        });
			})
			
			
			//删除
		  $("#tbodyParameter").on("click", ".delete-parameter", function () {
		  	var id = $(this).parent().parent().attr('data-parentid');//id
		  	var oTr = $(this).parent().parent();
	        layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
	                var paramDel = "{'id':'" + id + "'}";
	                var res = reqAjax(DELVEDIOCATALOG, paramDel);
	                if (res.code == 1) {
	                	layer.msg(res.msg);
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						$(oTr).remove();
	                } else {
	                    layer.msg(res.msg);
	                }
	            })
		  });
		   
		  
	  //上传图片
	  
	  uploadOss({
	    btn: "uploadImg",
	    flag: "img",
	    size: "5mb"
	  },'uploadImg');
	  
	  
	  uploadOss({
	    btn: "CuploadImg",
	    flag: "img",
	    size: "5mb"
	  },'CuploadImg');
	  
	  
	  $('#add-newuser').on('hidden.bs.modal',function(){
	  	 $('#uploadImg').attr('src','common/image/user.png')
	  })
	   
	
})(jQuery)