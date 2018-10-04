(function($) {
		const   ADDOPERATIONTRATEGY = 'operations/addOperationTrategy',//新增运营策略
				DELETEOPERATION = 'operations/deleteOperationTrategy',//删除运营策略
				GETOPERATIONTRATEGYBYID = 'operations/getOperationTrategyById',//根据ID获取运营策略
				MODIFYOPERATIONTRATEGY = 'operations/modifyOperationTrategy',//修改运营策略
				QUERYOPERATIONTRATEGYPAGE = 'operations/queryOperationTrategyPage',//分页查询策略列表(带条件)
				GETOPERATIONTRATEGYLIST = 'operations/getOperationTrategyList'
		//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		if(item.userType == 0){
		        			item.userType = '个人用户'
		        		}else{
		        			item.userType = '商户'
		        		}
		        		
		        		if(item.userLevel == 0){
		        			item.userLevel = '普通用户'
		        		}else if(item.userLevel == 1){
		        			item.userLevel = '普通商户'
		        		}else if(item.userLevel == 2){
		        			item.userLevel = '合作商户'
		        		}else if(item.userLevel == 3){
		        			item.userLevel = '代理商户'
		        		}
		        		var itembuss = item.businessDescription
		        		sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.strategyName+`</td>
                                	<td class="td3">`+item.userType+`</td>
                                	<td class="td4">`+item.userLevel+`</td>
                                	<td class="td5">`+item.funcCode+`</td>
                                	<td class="td6">`+item.valueType+`</td>
                                	<td class="td7">`+item.text+`</td>
                                	<td class="td8">`+(itembuss!=null?itembuss=itembuss.substring(0,10)+'...':itembuss='')+`</td>
                                	<td class="businessDescription" style="display: none;">`+item.businessDescription+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="area" style="display: none;">`+item.area+`</td>
                                	<td class="applicableTo" style="display: none;">`+item.applicableTo+`</td>
                                	<td class='row remove-modifier td9'>
                                		<div class='details' data-toggle='modal'  data-target='#showNotice'>
                                			策略详情
                                		</div>
                                		<div class='change-parameter' data-toggle='modal'  data-target='#change-newuser'>
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
		   		var parms ="{'page':1,'rows':10}"
		   		var res =reqAjax(QUERYOPERATIONTRATEGYPAGE,parms);
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
				            var res= reqAjax(QUERYOPERATIONTRATEGYPAGE,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
				        }
				        });
			}
			list();
			
			//新增用户类型判断用户等级
			$('#add-newuser').on('show.bs.modal', function () {
				if($('#addType').val() == '商户'){
					$('#addLevel option.one').hide();
					$('#addLevel option:not(".one")').show();
					
				}else{
					$('#addLevel option:not(".one")').hide();
					$('#addLevel option.one').show();
				}
    		})
			//修改用户类型判断用户等级
			$('#change-newuser').on('show.bs.modal', function () {
					if($('#chaType').val() == '商户'){
						$('#chaLevel option:not(".one")').show();
						$('#chaLevel option.one').hide();
					}else{
						$('#chaLevel option.one').show();
						$('#chaLevel option:not(".one")').hide();
					}
        		})
			//新增select切换
			$('#add-newuser').on('change','#addType',function(){
				if($(this).val() == '个人用户'){
					$('#addLevel option.one').show();
					$('#addLevel').val('普通用户')
					$('#addLevel option:not(".one")').hide();
				}else{
					$('#addLevel option:not(".one")').show();
					var sHtml = $('#addLevel option:not(".one"):first').html()
					$('#addLevel').val(sHtml)
					$('#addLevel option.one').hide();
				}
			})
			//修改select切换
			$('#change-newuser').on('change','#chaType',function(){
				console.log($(this).val() == '个人用户')
				if($(this).val() == '个人用户'){
					$('#chaLevel option.one').show();
					$('#chaLevel').val('普通用户')
					$('#chaLevel option:not(".one")').hide();
				}else{
					$('#chaLevel option:not(".one")').show();
					var sHtml = $('#chaLevel option:not(".one"):first').html()
					$('#chaLevel').val(sHtml)
					$('#chaLevel option.one').hide();
				}
			})

			
            //新增
				$('#add-newuser').on('click','#add-parameters',function(){
					var strategyName = $('#addName').val();
					var userType = ($('#addType').val() == '个人用户')?0:1;
					var userLevel = $('#addLevel').val()
					var funcCode = $('#addCode').val();
					var valueType = $('#addValueType').val() 
					var text = $('#addValue').val() 
					var businessDescription = $('#addRemarks').val()
					var applicableTo = $('#addGround').val()
					//应用范围
					if(applicableTo == '--全部--'){
						applicableTo = ''
					}else if(applicableTo == '店铺'){
						applicableTo = 0
					}else{
						applicableTo = 1
					}
					//用户等级
					if(userLevel == '普通用户'){
						userLevel = 0
					}else if(userLevel == '普通商户'){
						userLevel = 1
					}else if(userLevel == '合作商户'){
						userLevel = 2
					}else if(userLevel == '代理商户'){
						userLevel = 3
					}
					var parms ="{'strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
					var res= reqAjax(ADDOPERATIONTRATEGY,parms);
					if(res.code == 1){
						layer.msg(res.msg)
						location.reload();
					}else{
						layer.msg(res.msg)
					}
				})
			
			
			//修改
			$('#tbodyParameter').on('click','.change-parameter',function(){
					var name = $(this).parent().siblings('.td2').html(); //策略名称
					var type = $(this).parent().siblings('.td3').html(); //用户类型
					var level = $(this).parent().siblings('.td4').html();//用户等级
					var code = $(this).parent().siblings('.td5').html();//功能编码
					var codeType = $(this).parent().siblings('.td6').html();//取值类型
					var value = $(this).parent().siblings('.td7').html();//取值
					var remarks = $(this).parent().siblings('.td8').html();//业务说明
					var id = $(this).parent().siblings('.id').html();//id
					var businessDescription = $(this).parent().siblings('.businessDescription').html();//id
					var applicableTo = $(this).parent().siblings('.applicableTo').html();
					//应用范围
						if(applicableTo === 0){
							applicableTo = '店铺'
						}else if(applicableTo == 1){
							applicableTo = '商户'
						}else{
							applicableTo = '--全部--'
						}
				$('#chaName').val(name);
				$('#chaType').val(type);
				$('#chaLevel').val(level);
				$('#chaCode').val(code)
				$('#chaValueType').val(codeType)
				$('#chaValue').val(value)
				$('#chaRemarks').val(businessDescription)
				$('#chaGround').val(applicableTo)
					$('#change-newuser').on('click','#saveParemeterconfig',function(){
						var strategyName = $('#chaName').val();
						var userType = ($('#chaType').val() == '个人用户')?0:1;
						var userLevel = $('#chaLevel').val();
						var strategyName = $('#chaName').val();
						var funcCode = $('#chaCode').val();
						var valueType = $('#chaValueType').val();
						var applicableTo = $('#chaGround').val();
						var text = $('#chaValue').val();
						var businessDescription = $('#chaRemarks').val();
						//应用范围
						if(applicableTo == '--全部--'){
							applicableTo = ''
						}else if(applicableTo == '店铺'){
							applicableTo = 0
						}else{
							applicableTo = 1
						}
						//用户等级
						if(userLevel == '普通用户'){
							userLevel = 0
						}else if(userLevel == '普通商户'){
							userLevel = 1
						}else if(userLevel == '合作商户'){
							userLevel = 2
						}else if(userLevel == '代理商户'){
							userLevel = 3
						}
						var parms ="{'id':'"+id+"','strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','strategyName':'"+strategyName+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
						var res= reqAjax(MODIFYOPERATIONTRATEGY,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					});
				
			});	
			
			
			//删除
		  $("#tbodyParameter").on("click", ".delete-parameter", function () {
		  	var id = $(this).parent().siblings('.id').html();//id
	        layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
	                var paramDel = "{'id':'" + id + "'}";
	                var res = reqAjax(DELETEOPERATION, paramDel);
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
			var layer = layui.laypage;
			var rows = 10;
			var val = $('#inquireInput').val();
			var parms ="{'page':'1','rows':'10','strategyName':'"+val+"'}"
			var res= reqAjax(QUERYOPERATIONTRATEGYPAGE,parms);
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
		        	var parms ="{'page':'"+obj.curr+"','rows':'10','strategyName':'"+val+"'}"
					var res= reqAjax(QUERYOPERATIONTRATEGYPAGE,parms);
		            commercialDetail(res);
		            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
		        });
		})
				

					
				
				
				
				
				
		//显示详情
		$('#common-table').on('click','.details',function(){
			var id = $(this).parent().siblings('.id').html();//id
			var name = $(this).parent().siblings('.td2').html(); //策略名称
			var type = $(this).parent().siblings('.td3').html(); //用户类型
			var level = $(this).parent().siblings('.td4').html();//用户等级
			var code = $(this).parent().siblings('.td5').html();//功能编码
			var codeType = $(this).parent().siblings('.td6').html();//取值类型
			var value = $(this).parent().siblings('.td7').html();//取值
			var remarks = $(this).parent().siblings('.td8').html();//业务说明
			var applicableTo = $(this).parent().siblings('.applicableTo').html();//应用范围
			var businessDescription = $(this).parent().siblings('.businessDescription').html();//id
			var parms ="{'id':'"+id+"'}"
            var res= reqAjax(GETOPERATIONTRATEGYBYID,parms);
            
			var sHtml = `<tr>
                        	<td class="">策略名称:</td>
                        	<td class="">`+name+`</td>
                        </tr>
                        <tr>
                        	<td class="">用户类型:</td>
                        	<td class="">`+type+`</td>
                        </tr>
                        <tr>
                        	<td class="">用户等级:</td>
                        	<td class="">`+level+`</td>
                        </tr>
                        <tr>
                        	<td class="">功能编码:</td>
                        	<td class="">`+code+`</td>
                        </tr>
                        <tr>
                        	<td class="">取值类型:</td>
                        	<td class="">`+codeType+`</td>
                        </tr>
                        <tr>
                        	<td class="">取值:</td>
                        	<td class="">`+value+`</td>
                        </tr>
                        <tr>
                        	<td class="">应用范围:</td>
                        	<td class="">`+applicableTo+`</td>
                        </tr>
                        <tr>
                        	<td class="">业务描述:</td>
                        	<td class="">`+businessDescription+`</td>
                        </tr>`
				$('#showNotice').on('show.bs.modal', function () {
							$('#showNotice #modal-tbody').html(sHtml)
	        	})

	                    

		})
		
})(jQuery)