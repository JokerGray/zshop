(function($) {
	const   QUERYVEDIOCATALOGPAGE = 'operations/queryVedioCatalogPage',//分页查询视频目录
				ADDVEDIOCATALOG = 'operations/addVedioCatalog',//新增视频目录
				MODIFYVEDIOCATALOG = 'operations/modifyVedioCatalog',//修改视频目录
				DELVEDIOCATALOG = 'operations/delVedioCatalog'//删除视频目录

	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	
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
                            		<button class="layui-btn layui-btn-small  layui-btn-danger  delete" >
									  <i class="layui-icon">&#xe640;</i> 删除
									</button>
									<button class="layui-btn layui-btn-small layui-layui-btn-warm change-parameter">
									  <i class="layui-icon">&#xe6b2;</i> 修改
									</button>
                            	</td>
                            </tr>`
	        			})
	                
		            $("#tbodyParameter").html(sHtml) 			
		        } else {
		            layer.msg(res.msg);
		        }
		}
		
		
		
		function list(){
			var catalogName = $('#listName').val();
			if(catalogName == undefined){
				catalogName = ''
			}else{
				catalogName = $.trim(catalogName)
			}
	   		var parms ="{'page':1,'rows':10000,'catalogName':'"+catalogName+"'}";
	   		var res =reqAjax(QUERYVEDIOCATALOGPAGE,parms);
   			commercialDetail(res);
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
                                		<button class="layui-btn layui-btn-small  layui-btn-danger  delete" >
										  <i class="layui-icon">&#xe640;</i> 删除
										</button>
										<button class="layui-btn layui-btn-small layui-layui-btn-warm change-parameter">
										  <i class="layui-icon">&#xe6b2;</i> 修改
										</button>
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
		        $("#tbodyParameter tr").removeClass("layui-table-click");
		        $(this).addClass("layui-table-click");
		        var parentId = $(this).attr('data-id');
		        sessionStorage.setItem('parentId',parentId)
		    });
		    
		    //查询二级
			function searchSecond(id,tr,pid){
				var parms ="{'parentId':'"+id+"','rows':'10000','page':'1'}"
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
	
	
		//搜索
		$('#toolSearch').click(function(){
			list();
		})
		//重置
		$('#toolRelize').click(function(){
			$('#listName').val('');
			list();
		})
		//刷新
		$('#refresh').click(function(){
			location.reload()
		})
	
	
		$('#commonAdd').click(function(){
			var parentId = sessionStorage.getItem('parentId');
			$('#addName').val('');
			$('#addCode').val('');
			$('#addNum').val('');
			$('#uploadImg').attr('src','../commonold/image/user.png');
			if(parentId==0 || !parentId){
				layer.open({
					title: ['新增', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					btn:['确定','取消'],
					content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['800px', '700px'],
					end: function() {
						$('#demo111').hide();
					},
					success: function(layero, index) {
						
					},
					yes: function(index, layero) {
					var otr = $('#tbodyParameter>tr.layui-table-click');
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
	               		 	 	layer.close(index);
	               		 	 	list();
	               		 	 }else{
	               		 	 	layer.msg(res.msg);
	               		 	 }
						}
					}
				});
			}else{
				layer.msg('二级菜单不能添加哦~')
			}
			
		})
		
		$('#tbodyParameter').on('click','.change-parameter',function(){
			var id = $(this).parent().parent().attr('data-parentid');
			var catalogName = $(this).parent().siblings('.td2').text();
			var labelName = $(this).parent().siblings('.td4').html();
			var seqNumber = $(this).parent().siblings('.td3').html();
			var backgroundUrl = $(this).parent().siblings('.backgroundUrl').html();
			layer.open({
					title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					btn:['确定','取消'],
					content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['800px', '700px'],
					end: function() {
						$('#demo222').hide();
					},
					success: function(layero, index) {
						$('#chaName').val(catalogName)
						$('#chaCode').val(labelName)
						$('#chaNum').val(seqNumber)
						$('#CuploadImg').attr('src',backgroundUrl)
					},
					yes: function(index, layero) {
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
		           		 	 	layer.close(index)
		           		 	 	list();
		           		 	 }else{
		           		 	 	layer.msg(res.msg);
		           		 	 }
						}
					}
				});
		})
		
		//删除
		  $("#tbodyParameter").on("click", ".delete", function () {
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
						list();
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
	
	
	
	
	
	
	
	
	

//	//搜索
//	$('#toolSearch').on('click', function() {
//		init_obj();
//	})
//	//重置功能
//	$('#toolRelize').on('click', function() {
//		$("#feedbackType").val('');
//		$("#moreField1").val('');
//		init_obj();
//	})
//
//	
//	//TAB切换
//	$('.search-li').on('click', function() {
//		$(this).addClass('act').siblings().removeClass('act');
//		initForAct();
//	})
//
//	//pageCallback回调
//	function pageCallback(index, limit, userId, replyStatus, feedbackType, moreField1) {
//		var aLi = $('.search-li.act')
//		var replyStatus = $(aLi).attr('data-replystatus');
//		var feedbackType = $('#feedbackType').val();
//		var moreField1 = $('#moreField1').val();
//		var userId = sessionStorage.getItem('userId');
//		if(userId == undefined) {
//			userId = ''
//		}
//		if(replyStatus == undefined) {
//			replyStatus = ''
//		}
//		if(feedbackType == undefined) {
//			feedbackType = ''
//		}
//		if(moreField1 == undefined) {
//			moreField1 = ''
//		}
//		return getData(FEEDBACKLIST, "{'page':" + index + ",'rows':" + limit + ",'userId':'" + userId + "','replyStatus':'" + replyStatus + "','feedbackType':'" + feedbackType + "','moreField1':'" + moreField1 + "'}");
//	}
//table.on('tool(demo)', function(obj) {
//		var data = obj.data;
//		//查看
//		if(obj.event === 'detail') {
//			layer.open({
//				title: ['详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
//				type: 1,
//				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
//				area: ['800px', '560px'],
//				end: function() {
//					$('#demo111').hide();
//					$('#problemsSuggestion').val('').attr('disabled',false)
//					$('#replyStatus').val('').attr('disabled',false)
//					$('#reply').val('').attr('disabled',false)
//					$('#layImg').attr('url','');
//					$("div.holder").show();
//				},
//				success: function(layero, index) {
//					$("div.holder").hide();
//					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled','')
//					$('#reply').attr('disabled','')
//					if(data.replyStatus==null){
//						data.replyStatus=0;
//					}
//					$('#replyStatus').val(data.replyStatus).attr('disabled','')
//					$('#layImg').attr('url',data.problemsImgurl);
//					form.render()
//				},
//				yes: function(index, layero) {
//
//				}
//			});
//			//删除
//		} else if(obj.event === 'del') {
//			var id = data.id;
//			layer.confirm('真的删除行么', function(index) {
//				var d3 = {
//					"id": id
//				};
//				d3 = JSON.stringify(d3);
//				var res = reqAjax(DELETEREPLY, d3);
//				if(res.code == 1) {
//					obj.del();
//				}
//				layer.close(index);
//				init_obj();
//				layer.msg(res.msg);
//			});
//		} else if(obj.event === 'change') {
//			layer.open({
//				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
//				type: 1,
//				btn: ['保存', '取消'],
//				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
//				area: ['800px', '560px'],
//				end: function() {
//					$('#demo111').hide();
//					$('#reply').val('');
//					$('#replyStatus').val('');
//
//				},
//				success: function(layero, index) {
//					$('#problemsSuggestion').val(data.problemsSuggestion).attr('disabled','')
//					$('#replyStatus').val(data.replyStatus);
//					$('div.layui-layer-page').addClass('layui-form')
//					$('a.layui-layer-btn0').attr('lay-submit', '');
//					$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
//					form.render()
//				},
//				yes: function(index, layero) {
//					form.on('submit(formDemo)', function(done) {
//						if(done) {
//							console.log(data)
//							var questionId = data.id;
//							var userId = sessionStorage.getItem('userno');
//							var userName = yyCache.get('username');
//							var reply =  $('#reply').val();
//							var replyStatus = $('#replyStatus').val();
//							var e2 = {
//								questionId: Number(questionId),
//								reply: reply,
//								replyStatus: Number(replyStatus),
//								userId: Number(userId),
//								userName: userName
//							}
//							e2 = JSON.stringify(e2);
//							var res = reqAjax(ADDREPLY, e2);
//							if(res.code == 1) {
//								layer.msg(res.msg);
//								layer.close(index)
//								init_obj();
//							} else {
//								layer.msg(res.msg);
//							}
//						}
//					})
//
//				}
//			});
//		}
//	});
//
//	//数据处理
//	function addEq(data) {
//		$.each(data, function(i, item) {
//			$(item).attr('eq', (i + 1))
//		});
//		return data;
//	}
//
//	//展开按钮
	var flag = true;
	$('#spread').on('click', spread)

	function spread() {
		var oUl = $('.navList');
		var aLi = oUl.children('li');
		if(flag == true) {
			$(this).html('<i class="layui-icon">&#xe630;</i>收起')
			flag = false;
			treeObj.expandAll(true);

		} else {
			$(this).html('<i class="layui-icon">&#xe630;</i>展开')
			flag = true;
			treeObj.expandAll(false);
		}
	}

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200)
	})
//
//
//
//	//点击变色
//	$('#tableBox').on('click', 'tbody tr', function() {
//		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
//
//	})
//
//	//刷新
//	function refresh() {
//		location.reload();
//	}
//	$('#refresh').click(function() {
//		refresh()
//	});
//
//	function tableInit(tableId, cols, pageCallback, test) {
//		var tableIns, tablePage;
//		//1.表格配置
//		tableIns = table.render({
//			id: tableId,
//			elem: '#' + tableId,
//			height: 'full-220',
//			cols: cols,
//			page: false,
//			even: true,
//			skin: 'row'
//		});
//
//		//2.第一次加载
//		var res = pageCallback(1, 15);
//		//第一页，一页显示15条数据
//		if(res) {
//			if(res.code == 1) {
//				tableIns.reload({
//					data: res.data
//				})
//			} else {
//				layer.msg(res.msg)
//			}
//		}
//
//		//3.left table page
//		layui.use('laypage');
//
//		var page_options = {
//			elem: 'laypageLeft',
//			count: res ? res.total : 0,
//			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
//			limits: [15, 50, 100, 300, 800, 1000],
//			limit: 15
//		}
//		page_options.jump = function(obj, first) {
//			tablePage = obj;
//
//			//首次不执行
//			if(!first) {
//				var resTwo = pageCallback(obj.curr, obj.limit);
//				if(resTwo && resTwo.code == 1)
//					tableIns.reload({
//						data: resTwo.data
//					});
//				else
//					layer.msg(resTwo.msg);
//			}
//		}
//
//		layui.laypage.render(page_options);
//
//		return {
//			tablePage,
//			tableIns
//		};
//	}
//
//	//数据处理
//	function getData(url, parms) {
//
//		var res = reqAjax(url, parms);
//
//		var data = res.data;
//		var _feedbackType, _moreField1;
//		$.each(data, function(i, item) {
//			$(item).attr('eq', (i + 1));
//			if(item.feedbackType == 0) {
//				_feedbackType = '系统问题'
//			} else if(item.isCheck == 1) {
//				_feedbackType = '页面问题'
//			} else {
//				_feedbackType = '其它问题'
//			}
//			if(item.moreField1 == 1) {
//				_moreField1 = 'PC端'
//			} else {
//				_moreField1 = 'APP'
//			}
//			$(item).attr('_feedbackType', _feedbackType)
//			$(item).attr('_moreField1', _moreField1)
//		});
//
//		return res;
//	}

})(jQuery)