(function($) {
		const   QUERYVEDIOCATALOGPAGE = 'operations/queryVedioCatalogPage',//分页查询视频目录
				QUERYVEDIORESOURCEPAGE = 'operations/queryVedioResourcePage',//分页查询视频资源
				ADDVEDIORESOURCE = 'operations/addVedioResource',//新增视频资源
				MODIFYVEDIORESOURCE = 'operations/modifyVedioResource',//修改视频目录
				DELETEVEDIORESOURCE = ' operations/deleteVedioResource'//删除视频目录
		
			
		  	sessionStorage.removeItem('operatorName');//初始化清空operatorName
			//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<tr class=`+item.id+` data-parentId=`+item.id+` data-operatorName=`+item.operatorName+` data-catalogId=`+item.catalogId+`>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.titleName+`</td>
                                	<td class="td3">`+item.vedioUrl+`</td>
                                	<td class="td4">`+(item.createTime).substring(0,16)+`</td>
                                	<td class="td5">`+item.operatorName+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="parentId" style="display: none;">`+item.parentId+`</td>
                                	<td class="operatorId" style="display: none;">`+item.operatorId+`</td>
                                	<td class="catalogId" style="display: none;">`+item.catalogId+`</td>
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
				var rows = 10;
		   		var layer = layui.laypage;
		   		var parms ="{'page':1,'rows':10}";
		   		var res =reqAjax(QUERYVEDIORESOURCEPAGE,parms);
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
				        	var parms ="{'page':"+obj.curr+",'rows':10}"
				            var res= reqAjax(QUERYVEDIORESOURCEPAGE,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
				        }
				        });
			}
			list();
			
			//视频目录初始化
			function fatherList(father,res){
				var data = res.data;
				var sHtml = '';
				$(father).html("<option data-parentid=''>--请选择--</option>")
				if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<option data-parentId=`+item.id+`>`+item.catalogName+`</option>`
	        			})
		                
			            $(father).append(sHtml) 			
			        } else {
			            layer.msg(res.msg);
			        }
			}
			
			function father(father,obj){
		   		var parms ="{'page':1,'rows':10}";
		   		var res =reqAjax(QUERYVEDIOCATALOGPAGE,parms);
		   		fatherList(father,res);
		   		var parentId = $(obj).attr('data-parentId');
		   		sessionStorage.setItem('parentId',parentId)
			}
			father('#listFather','#listFather>option:checked');
			
			
			
			//子目录初始化
			function listSon(res,children){
				var data = res.data;
				var sHtml = '';
				$(children).html('<option>--请选择(可选)--</option>')
				if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		sHtml += `<option data-parentId=`+item.id+`>`+item.catalogName+`</option>`
	        		})
			            $(children).append(sHtml)
			        } else {
			            layer.msg(res.msg);
			        }	
			}
			function son(children){
				var parentId = sessionStorage.getItem('parentId')
				if(parentId==''){
					$(children).attr('disabled',true)
				}
				var parms ="{'parentId':'"+parentId+"'}";
		   		var res =reqAjax(QUERYVEDIOCATALOGPAGE,parms);
		   		listSon(res,children)
			}
			son("#listSon");
			
			
			//监控父目录选择
			function changeOption(children,father){
				var parentId = $(father).attr('data-parentId');
				if(parentId==''){
					$(children).attr('disabled',true)
				}else{
					$(children).attr('disabled',false)
				}
				sessionStorage.setItem('parentId',parentId)
				var parentId = sessionStorage.getItem('parentId')
				var parms ="{'parentId':'"+parentId+"'}";
		   		var res =reqAjax(QUERYVEDIOCATALOGPAGE,parms);
		   		listSon(res,children)
			}
			$('#listFather').on('change',function(){
				changeOption("#listSon",'#listFather>option:checked')
			});
			
			//选中每行
		    $("#tbodyParameter").on('click','tr',function(){
		        $("#tbodyParameter tr").removeClass("acve");
		        $(this).addClass("acve");
		        var operatorName = $(this).attr('data-operatorName');
		        sessionStorage.setItem('operatorName',operatorName)
		    });
		    
			
            //新增
				$('#add-users').on('click',function(){
					var operatorName = sessionStorage.getItem('operatorName');
					var catalogId = sessionStorage.getItem('catalogId');
					if(!operatorName){
						layer.msg('请选择表格的一条数据~')
					}else{
						$('#add-newuser').modal('show');
						father('#add-group-father','#add-group-father>option:checked');
						son("#add-group-son");
						$('#add-group-father').on('change',function(){
							changeOption("#add-group-son","#add-group-father>option:checked")
						});
					}
    			})
				$('#add-newuser').on('click','#add-parameters',function(){
						var otr = $('#tbodyParameter>tr.acve');
						var operatorName = $(otr).attr('data-operatorName');
						var titleName = $('#addName').val();
						var vedioUrl = $('#uploadVideo').attr('src');
						var levelOne = $('#add-group-father>option:checked').attr('data-parentid');
						var levelTwo = $('#add-group-son>option:checked').attr('data-parentid');
						if(!levelTwo){
							var catalogId = levelOne
						}else{
							var catalogId = levelTwo
						}
						if(titleName==''){
							layer.msg('请输入视频标题~')
						}else if(vedioUrl==''){
							layer.msg('请上传视频~')
						}else if(catalogId==''||undefined){
							layer.msg('请选择视频目录~')
						}else{
							 var paramAdd = "{'operatorName':'" + operatorName + "','catalogId':'" + catalogId + "','titleName':'" + titleName + "','vedioUrl':'" + vedioUrl + "'}";
	               		 	 var res = reqAjax(ADDVEDIORESOURCE, paramAdd);
	               		 	 if (res.code == 1) {
	               		 	 	layer.msg(res.msg);
	               		 	 }else{
	               		 	 	layer.msg(res.msg);
	               		 	 }
	               		 	 location.reload();
	               		 	 $('#add-newuser').modal('hide')
						}
					})				
			
			
			//修改
			$('#tbodyParameter').on('click','.change-parameter',function(){
				$('#change-newuser').modal('show')
				father('#cha-group-father','#cha-group-father>option:checked');
				son("#cha-group-son");
				$('#cha-group-father').on('change',function(){
					changeOption("#cha-group-son","#cha-group-father>option:checked")
				});
				var catalogId = $(this).parent().siblings('.catalogId').html();
				var parentId = $(this).parent().siblings('.parentId').html();
				var id = $(this).parent().siblings('.id').html();
				var titleName = $(this).parent().siblings('.td2').html();
				var operatorName = $(this).parent().siblings('.td5').html();
				var vedioUrl = $(this).parent().siblings('.td3').html();
				var arrFoption = $('#cha-group-father>option');
				var arrSoption = $('#cha-group-son>option');
				if(parentId==0){
					$.each(arrFoption,function(i,item){
						var fid = $(item).attr('data-parentId')
						if(catalogId == fid){
							$('#cha-group-father').val($(item).html())
							changeOption("#cha-group-son","#cha-group-father>option:checked")
						}
					})
				}else{
					$.each(arrFoption,function(i,item){
						var fid = $(item).attr('data-parentId')
						if(parentId == fid){
							$('#cha-group-father').val($(item).html())
							changeOption("#cha-group-son","#cha-group-father>option:checked")
						}
					})
					var arrSoption = $('#cha-group-son>option');
					$.each(arrSoption,function(i,item){
						var fid = $(item).attr('data-parentId')
						if(catalogId == fid){
							$('#cha-group-son').val($(item).html())
						}
					})
				}
				
				
				$('#chaName').val(titleName)
				$('#uploadVideo1').attr('src',vedioUrl)
				
				
				$('#saveParemeterconfig').on('click',function(){
					var titleName = $('#chaName').val()
					var vedioUrl = $('#uploadVideo1').attr('src')
					var levelOne = $('#cha-group-father>option:checked').attr('data-parentid');
					var levelTwo = $('#cha-group-son>option:checked').attr('data-parentid');
					if(!levelTwo){
						var catalogId = levelOne
					}else{
						var catalogId = levelTwo
					}
					if(titleName==''){
						layer.msg('请输入视频标题~')
					}else if(vedioUrl==''){
						layer.msg('请上传视频~')
					}else if(catalogId==''||undefined){
							layer.msg('请选择视频目录~')
					}else{
						 var paramCha = "{'id':'"+id+"','titleName':'" + titleName + "','vedioUrl':'" + vedioUrl + "','operatorName':'" + operatorName + "','catalogId':'" + catalogId + "'}";
	           		 	 var res = reqAjax(MODIFYVEDIORESOURCE, paramCha);
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
				sessionStorage.removeItem('operatorName');//初始化清空operatorName
	            var layer = layui.laypage;
				var rows = 10;
				var titleName = $('#inquireInput').val();
				var levelOne = ($('#listFather>option:checked').attr('data-parentid'))?$('#listFather>option:checked').attr('data-parentid'):'';
				var levelTwo = ($('#listSon>option:checked').attr('data-parentid'))?($('#listSon>option:checked').attr('data-parentid')):'';
				if(levelTwo==''){
					var catalogId = levelOne
				}else{
					var catalogId = levelTwo
				}
				var parms ="{'page':'1','rows':'10','titleName':'"+titleName+"','catalogId':'"+catalogId+"'}"
				var res= reqAjax(QUERYVEDIORESOURCEPAGE,parms);
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
			        	var parms ="{'page':"+obj.curr+",'rows':'10','titleName':'"+titleName+"','catalogId':'"+catalogId+"'}"
						var res= reqAjax(QUERYVEDIORESOURCEPAGE,parms);
			            commercialDetail(res);
			            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
			            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
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
	                var res = reqAjax(DELETEVEDIORESOURCE, paramDel);
	                if (res.code == 1) {
	                	layer.msg(res.msg);
						layer.close(index); //如果设定了yes回调，需进行手工关闭
						$(oTr).remove();
	                } else {
	                    layer.msg(res.msg);
	                }
	            })
		  });
		   
		  
	  //增加视频
	  uploadOss({
	    btn: "uploadVideo",
	    flag: "video",
	    size: "2048mb"
	  });
	  //上传封面
	  uploadOss({
	    btn: "uploadCover",
	    flag: "cover",
	    size: "5mb"
	  });
	  
  	  //修改视频
	  uploadOss({
	    btn: "uploadVideo1",
	    flag: "video",
	    size: "2048mb"
	  });
	  //上传封面
	  uploadOss({
	    btn: "uploadCover1",
	    flag: "cover",
	    size: "5mb"
	  });
	  
	  //判断字段是否为空
	  function isNull(val) {
	    if (val == null || val == "null" || val == undefined) {
	      return '';
	    }
	    return val;
	  }
	  
//	  
//	  $('#add-newuser').on('hidden.bs.modal',function(){
//	  	 $('#uploadImg').attr('src','common/image/user.png')
//	  })
	   
	
})(jQuery)