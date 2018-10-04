(function($) {
			const   ADDOPERATIONTRATEGY = 'operations/addOperationTrategy',//新增运营策略
					DELETEOPERATION = 'operations/deleteOperationTrategy',//删除运营策略
					GETOPERATIONTRATEGYBYID = 'operations/getOperationTrategyById',//根据ID获取运营策略
					MODIFYOPERATIONTRATEGY = 'operations/modifyOperationTrategy',//修改运营策略
					QUERYOPERATIONTRATEGYPAGE = 'operations/queryOperationTrategyPage',//分页查询策略列表(带条件)
					GETOPERATIONTRATEGYLIST = 'operations/getOperationTrategyList'

			var strategy = {
					
			}
		
		
			
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
		        		
		        		if(item.applicableTo == null){
		        			item.applicableTo = ''
		        		}
		        		var itembuss =checkLength(item.businessDescription)
		        		var strategyName = checkLength(item.strategyName)
		        		var funcCode = checkLength(item.funcCode)
		        		sHtml += `<tr>
                                	<td class="td1 eq-num">`+(i+1)+`</td>
                                	<td class="td2 td" title=`+item.strategyName+`>`+strategyName+`</td>
                                	<td class="td3 td">`+item.userType+`</td>
                                	<td class="td4 td">`+item.userLevel+`</td>
                                	<td class="td5 td" title=`+item.funcCode+`>`+funcCode+`</td>
                                	<td class="td6 td">`+item.valueType+`</td>
                                	<td class="td7 td">`+item.text+`</td>
                                	<td class="td8 td show-notice" title=`+item.businessDescription+`>`+itembuss+`</td>
                                	<td class="businessDescription" style="display: none;">`+item.businessDescription+`</td>
                                	<td class="id" style="display: none;">`+item.id+`</td>
                                	<td class="area" style="display: none;">`+item.area+`</td>
                                	<td class="applicableTo" style="display: none;">`+item.applicableTo+`</td>
                                	<td class='row remove-modifier operation'>
                                		<div class="operation-div clearfix">
	                                		<div class='operation-btn lightGreen change-parameter' data-toggle='modal'  data-target='#change-newuser'>
	                                			修改
	                                		</div>
	                                		<div class='operation-btn yellow delete-parameter'>
	                                			 删除
	                                		</div>
	                                		<div class='details operation-btn' data-toggle='modal'  data-target='#showNotice'>
	                                		详情
	                                		</div>
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
				var rows = 15;
		   		var layer = layui.laypage;
		   		var userType = $('#feedbacktType').val();
		   		var userLevel = $('#feedbacktUser').val();
		   		var parms ="{'page':1,'rows':15,'userType':'"+userType+"','userLevel':'"+userLevel+"'}";
		   		var res =reqAjax(QUERYOPERATIONTRATEGYPAGE,parms);
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
				        	var parms ="{'page':"+obj.curr+",'rows':15,'userType':'"+userType+"','userLevel':'"+userLevel+"'}";
				            var res= reqAjax(QUERYOPERATIONTRATEGYPAGE,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
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
					



					
					if(strategyName==''){
						layer.msg('请输入策略名称')
					}else if(funcCode==''){
						layer.msg('请输入功能编码')
					}else if(text==''){
						layer.msg('请输入取值')
					}else if(businessDescription==''){
						layer.msg('请输入业务描述')
					}else{
						if(text!=''){
							if(valueType=='整数'){
								if(text % 1 != 0){
												layer.msg('请输入整数')
								}else{
								var parms ="{'strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
								var res= reqAjax(ADDOPERATIONTRATEGY,parms);
								if(res.code == 1){
									layer.msg(res.msg)
									location.reload();
								}else{
									layer.msg(res.msg)
								}
							}
							}else if(valueType == '布尔'&&text!=''){
									if(text!='true'&&text!='false'){
										layer.msg('请输入布尔值') ;
									}else{
								var parms ="{'strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
								var res= reqAjax(ADDOPERATIONTRATEGY,parms);
								if(res.code == 1){
									layer.msg(res.msg)
									location.reload();
								}else{
									layer.msg(res.msg)
								}
							}
							}else if(valueType == '小数'){
										var str1 = text.split('.')[0];
										var str2 = text.split('.')[1];
									if((text.split('.')).length==2 && str1%1== 0 && str2%1==0){
										var parms ="{'strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
										var res= reqAjax(ADDOPERATIONTRATEGY,parms);
										if(res.code == 1){
											layer.msg(res.msg)
											location.reload();
										}else{
											layer.msg(res.msg)
										}					
									}else{
										layer.msg('请输入小数') ;	
									
							}
							}else if(valueType == '天数'){
									if(text % 1 != 0){
											layer.msg('请输入整数')
									}else{
										var parms ="{'strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
										var res= reqAjax(ADDOPERATIONTRATEGY,parms);
										if(res.code == 1){
											layer.msg(res.msg)
											location.reload();
										}else{
											layer.msg(res.msg)
										}
									}
								}else if(valueType == '文本'){
										var parms ="{'strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo+"'}"
										var res= reqAjax(ADDOPERATIONTRATEGY,parms);
										if(res.code == 1){
											layer.msg(res.msg)
											location.reload();
										}else{
											layer.msg(res.msg)
									}
								}
							}
						
						}
					})
			
			
			//修改。。。
			$('#tbodyParameter').on('click','.change-parameter',function(){
					var that = $(this);
					var name = $(this).parent().siblings('.td2').html(); //策略名称
					var type = $(this).parent().siblings('.td3').html(); //用户类型
					var level = $(this).parent().siblings('.td4').html();//用户等级
					var code = $(this).parent().siblings('.td5').html();//功能编码
					var codeType = $(this).parent().siblings('.td6').html();//取值类型
					var value = $(this).parent().siblings('.td7').html();//取值
					var remarks = $(this).parent().siblings('.td8').html();//业务说明
					var id = $(this).parent().siblings('.id').html();//id
					var businessDescription = $(this).parent().siblings('.businessDescription').html();
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
							applicableTo1 = ''
						}else if(applicableTo == '店铺'){
							applicableTo1 = 0
						}else{
							applicableTo1 = 1
						}
						//用户等级
						if(userLevel == '普通用户'){
							userLevel1 = 0
						}else if(userLevel == '普通商户'){
							userLevel1 = 1
						}else if(userLevel == '合作商户'){
							userLevel1 = 2
						}else if(userLevel == '代理商户'){
							userLevel1 = 3
						}
						
						if(strategyName==''){
						layer.msg('请输入策略名称')
						}else if(funcCode==''){
							layer.msg('请输入功能编码')
						}else if(text==''){
							layer.msg('请输入取值')
						}else if(businessDescription==''){
							layer.msg('请输入业务描述')
						}else{
							if(text!=''){
								if(valueType=='整数'){
									if(text % 1 != 0){
												layer.msg('请输入整数')
									}else{
										var parms ="{'id':'"+id+"','strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel1+"','strategyName':'"+strategyName+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo1+"'}"
										var res= reqAjax(MODIFYOPERATIONTRATEGY,parms);
										if(res.code == 1){
											layer.msg(res.msg)
											$('#change-newuser').modal('hide');
											var $that = that;
											var $parentTr = $that.parent().parent();
											$parentTr.children('.td2').html(strategyName)
											$parentTr.children('.td3').html(userType==0?userType='个人用户':'商户')
											$parentTr.children('.td4').html(userLevel)
											$parentTr.children('.td5').html(funcCode)
											$parentTr.children('.td6').html(valueType)
											$parentTr.children('.td7').html(text)
											$parentTr.children('.td8').html(businessDescription.substring(0,5)+'...')
											$parentTr.children('.businessDescription').html(businessDescription)
											$parentTr.children('.applicableTo').html(applicableTo)
										}else{
											layer.msg(res.msg)
										}
									}
								}
								else if(valueType == '布尔'&&text!=''){
										if(text!='true'&&text!='false'){
											layer.msg('请输入布尔值') ;
										}else{
											var parms ="{'id':'"+id+"','strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel1+"','strategyName':'"+strategyName+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo1+"'}"
											var res= reqAjax(MODIFYOPERATIONTRATEGY,parms);
										if(res.code == 1){
											layer.msg(res.msg)
											$('#change-newuser').modal('hide');
											var $that = that;
											var $parentTr = $that.parent().parent();
											$parentTr.children('.td2').html(strategyName)
											$parentTr.children('.td3').html(userType==0?userType='个人用户':'商户')
											$parentTr.children('.td4').html(userLevel)
											$parentTr.children('.td5').html(funcCode)
											$parentTr.children('.td6').html(valueType)
											$parentTr.children('.td7').html(text)
											$parentTr.children('.td8').html(businessDescription.substring(0,5)+'...')
											$parentTr.children('.businessDescription').html(businessDescription)
											$parentTr.children('.applicableTo').html(applicableTo)
										}else{
											layer.msg(res.msg)
										}
									}
								}else if(valueType == '小数'){
										var str1 = text.split('.')[0];
										var str2 = text.split('.')[1];
									if((text.split('.')).length==2 && str1%1== 0 && str2%1==0){
										console.log((text.split('.')).length)
										console.log(str1%1!=0)
										console.log(str2%1!=0)
										var parms ="{'id':'"+id+"','strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel1+"','strategyName':'"+strategyName+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo1+"'}"
										var res= reqAjax(MODIFYOPERATIONTRATEGY,parms);
										if(res.code == 1){
											layer.msg(res.msg)
											$('#change-newuser').modal('hide');
											var $that = that;
											var $parentTr = $that.parent().parent();
											$parentTr.children('.td2').html(strategyName)
											$parentTr.children('.td3').html(userType==0?userType='个人用户':'商户')
											$parentTr.children('.td4').html(userLevel)
											$parentTr.children('.td5').html(funcCode)
											$parentTr.children('.td6').html(valueType)
											$parentTr.children('.td7').html(text)
											$parentTr.children('.td8').html(businessDescription.substring(0,5)+'...')
											$parentTr.children('.businessDescription').html(businessDescription)
											$parentTr.children('.applicableTo').html(applicableTo)
										}else{
											layer.msg(res.msg)
										}
									}else{
										layer.msg('请输入小数') ;
								}
								}else if(valueType == '天数'){
										if(text % 1 != 0){
												layer.msg('请输入整数')
										}else{
											var parms ="{'id':'"+id+"','strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel1+"','strategyName':'"+strategyName+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo1+"'}"
											var res= reqAjax(MODIFYOPERATIONTRATEGY,parms);
											if(res.code == 1){
												layer.msg(res.msg)
												$('#change-newuser').modal('hide');
												var $that = that;
												var $parentTr = $that.parent().parent();
												$parentTr.children('.td2').html(strategyName)
												$parentTr.children('.td3').html(userType==0?userType='个人用户':'商户')
												$parentTr.children('.td4').html(userLevel)
												$parentTr.children('.td5').html(funcCode)
												$parentTr.children('.td6').html(valueType)
												$parentTr.children('.td7').html(text)
												$parentTr.children('.td8').html(businessDescription.substring(0,5)+'...')
												$parentTr.children('.businessDescription').html(businessDescription)
												$parentTr.children('.applicableTo').html(applicableTo)
											}else{
												layer.msg(res.msg)
											}
										}
									}else if(valueType == '文本'){
											var parms ="{'id':'"+id+"','strategyName':'"+strategyName+"','userType':'"+userType+"','userLevel':'"+userLevel1+"','strategyName':'"+strategyName+"','funcCode':'"+funcCode+"','valueType':'"+valueType+"','text':'"+text+"','businessDescription':'"+businessDescription+"','applicableTo':'"+applicableTo1+"'}"
											var res= reqAjax(MODIFYOPERATIONTRATEGY,parms);
											if(res.code == 1){
												layer.msg(res.msg)
												$('#change-newuser').modal('hide');
												var $that = that;
												var $parentTr = $that.parent().parent();
												$parentTr.children('.td2').html(strategyName)
												$parentTr.children('.td3').html(userType==0?userType='个人用户':'商户')
												$parentTr.children('.td4').html(userLevel)
												$parentTr.children('.td5').html(funcCode)
												$parentTr.children('.td6').html(valueType)
												$parentTr.children('.td7').html(text)
												$parentTr.children('.td8').html(businessDescription.substring(0,5)+'...')
												$parentTr.children('.businessDescription').html(businessDescription)
												$parentTr.children('.applicableTo').html(applicableTo)
											}else{
												layer.msg(res.msg)
											}
									}
								}
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
			list();
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
		
		
	//限制最长为5
	function checkLength(obj){
		if(typeof obj == 'string' && obj.length>=5){
			return obj.substring(0,5)+'...'
		}else{
			return obj
		}
	}
})(jQuery)