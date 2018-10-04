(function($) {	
		var layer = layui.layer;
		const QUERYROLEPREMISSIONPAGE = 'operations/queryMerchantBasicRolePermissionPage', //分页查询商户角色模板
			  ROLEPERMISSIONPAGE='operations/queryAllMerchantBasicRolePermissionPage', //分页查询所有商户角色权限模板
			  CHECKSTATUS=' operations/modifyRolePermissionCheckStatus'//修改角色权限是否可选状态


	    //商户角色列表
	    function commercialDetail(res) {
	        var sHtml = "";
	        var data = res.data;
	        if (res.code == 1) {
	           $.each(data,function(i,item){
	                var row = res.data[i];
	                if(item.available == 0){
	                	item.available ='可用'
	                }else{
	                	item.available ='不可用'
	                }
	                if(item.isCheck == 1){
	                	item.isCheck = '可选'
	                }else if(item.isCheck == 2){
	                	item.isCheck = '不可选'
	                }else{
	                	item.isCheck = '推荐'
	                }
	                sHtml += `<tr>
								<td class="td1">`+(i+1)+`</td>
								<td class="td2"><input type="checkbox" class="checkbox"></td>
								<td class="td3">`+item.roleName+`</td>
								<td class="td4">`+item.permissionName+`</td>
								<td class="td5">`+item.available+`</td>
								<td class="td6">`+item.isCheck+`</td>
								<td class="id" style="display:none">`+item.id+`</td>
								<td class="td7">
									<a href="javascript:void(0);"  class="btn btn-info add-users mt0 acp">是否可选</a>
								</td>
							</tr>`
	           	})
		            $("#tbodyParameter").html(sHtml)	
		        } else {
		            layer.msg(res.msg);
		        }
		}
    
        function roleList(){
        	var parms ="{'page':1,'rows':100}"
   			var res =reqAjax(QUERYROLEPREMISSIONPAGE,parms);
        	var sHtml = "";
	        var data = res.data;
	        if (res.code == 1) {
	           $.each(data,function(i,item){
	                var row = res.data[i];
	                sHtml += `<option>`+item.roleName+`</option>`
	           	})
		            $("#ascription").append(sHtml)	
		        } else {
		            layer.msg(res.msg);
		        }
        }
        roleList();
		
		function list(){
	   		var layer = layui.laypage;
	   		var rows = 10;
	   		var roleName = $('#ascription').val();
	   		var permissionName = $('#inquireInput').val();
	   		var parms ="{'page':1,'rows':10,'roleName':'"+roleName+"','permissionName':'"+permissionName+"'}"
	   		var res =reqAjax(ROLEPERMISSIONPAGE,parms);
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
			        	var parms ="{'page':'"+obj.curr+"','rows':10,'roleName':'"+roleName+"','permissionName':'"+permissionName+"'}"
			            var res= reqAjax(ROLEPERMISSIONPAGE,parms);
			            commercialDetail(res);
			            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
			            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
			        }
			        });
		}
	
		list()
   		
		//是否可选
		$('#common-table').on('click','.acp',function(){
			var _this = this;
			$('#commer').modal('show');
			var ids = $(this).parent().siblings('.id').html();
			var roleName = $(this).parent().siblings('.td3').html();
			var sysName = $(this).parent().siblings('.td4').html();
			var useable =  $(this).parent().siblings('.td5').html();
			$('#roleName').val(roleName);
			$('#sysName').val(sysName);
			$('#userable').val(useable);
			$('#saveAudit').on('click',function(){
				var isCheck = $('#adminable').val();
				if(isCheck =='可选'){
		          	isCheck = 1
		        }else if(isCheck == '不可选'){
		        	isCheck = 2
		        }else{
		        	isCheck = 3
		        }
		        var parms ="{'ids':"+ids+",'isCheck':'"+isCheck+"'}"
		        var res= reqAjax(CHECKSTATUS,parms);
		        if(res.code==1){
						layer.msg('修改成功')
						$('#commer').modal('hide')
						 if(isCheck == 1){
		                	isCheck = '可选'
		                }else if(isCheck == 2){
		                	isCheck = '不可选'
		                }else{
		                	isCheck = '推荐'
		                }
						$(_this).parent().siblings('.td6').html(isCheck)
						
				}else{
					layer.msg(res.msg)
				}
			})
		})
    
	//查询
	$('#inquire').on('click',function(){
		list()
	})
	
	
	//批量操作
	$('#bcp').on('click',function(){
		$('#commerChange').modal('show');
		$('#saveAudit2').on('click',function(){
			var ids = [];
			var aCheck = $('.checkbox:checked')
			$.each(aCheck,function(i,item){
				var id = $(item).parent().siblings('.id').html()
				ids.push(id)
			})
			ids = ids.join(',')
			var isCheck = $('#chaAdminable').val();
			if(isCheck =='可选'){
	          	isCheck = 1
	        }else if(isCheck == '不可选'){
	        	isCheck = 2
	        }else{
	        	isCheck = 3
	        }
	        var parms ="{'ids':'"+ids+"','isCheck':'"+isCheck+"'}"
	        var res= reqAjax(CHECKSTATUS,parms);
			 if(res.code==1){
						layer.msg('修改成功')
						$('#commerChange').modal('hide')
						 if(isCheck == 1){
		                	isCheck = '可选'
		                }else if(isCheck == 2){
		                	isCheck = '不可选'
		                }else{
		                	isCheck = '推荐'
		                }
						$.each(aCheck,function(i,item){
							var id = $(item).parent().siblings('.td6').html(isCheck)
						})
				}else{
					layer.msg(res.msg)
				}
		})
		
	})
	
	
	
	//角色模板切换tab
	$('#selectDiv').on('click','span',function(){
		if($(this).attr('class') == 'fa fa-caret-up'){
			$(this).attr('class','fa fa-caret-down')
			$(this).siblings('ol').show(300);
		}else{
			$(this).attr('class','fa fa-caret-up')
			$(this).siblings('ol').hide(300);
		}
		$('body').click(function(){
				$('#selectSpan').attr('class','fa fa-caret-up')
				$('#selectOl').hide(300);
		})
		return false
	})

	
})(jQuery)