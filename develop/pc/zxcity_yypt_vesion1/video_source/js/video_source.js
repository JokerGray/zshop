(function($) {
	const   QUERYVEDIOCATALOGPAGE = 'operations/queryVedioCatalogPage',//分页查询视频目录
			QUERYVEDIORESOURCEPAGE = 'operations/queryVedioResourcePage',//分页查询视频资源
			ADDVEDIORESOURCE = 'operations/addVedioResource',//新增视频资源
			MODIFYVEDIORESOURCE = 'operations/modifyVedioResource',//修改视频目录
			DELETEVEDIORESOURCE = ' operations/deleteVedioResource'//删除视频目录
			
	var operatorName = yyCache.get('username');
	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})
	
	
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
			
	
	
	
	
	
	
	
	
	
	

	//搜索
	$('#toolSearch').on('click', function() {
		init_obj();
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#videoName").val('');
		$("#listFather").val('');
		$("#listSon").val('');
		init_obj();
	})

	function init_obj() {
		var _obj = tableInit('demo', [
				[{
					title: '序号',
					/*sort: true,*/
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '视频名称',
					/*sort: true,*/
					align: 'left',
					field: 'titleName',
					width: 200,
					event:'clickt'
				}, {
					title: '视频地址',
					/*sort: true,*/
					align: 'left',
					field: 'vedioUrl',
					width: 400,
					event:'clickt'
				}, {
					title: '上传时间',
					/*sort: true,*/
					align: 'left',
					field: 'createTime',
					width: 200,
					event:'clickt'
				}, {
					title: '操作员',
					/*sort: true,*/
					align: 'left',
					field: 'operatorName',
					width: 200,
					event:'clickt'
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 300
				}]
			],
			pageCallback
		)
	}

	initForAct();

	function initForAct(replystatus) {
		init_obj();
	}


	//pageCallback回调
	function pageCallback(index, limit, titleName, catalogId) {
		var titleName = $('#videoName').val();
		var levelOne = ($('#listFather>option:checked').attr('data-parentid'))?$('#listFather>option:checked').attr('data-parentid'):'';
		var levelTwo = ($('#listSon>option:checked').attr('data-parentid'))?($('#listSon>option:checked').attr('data-parentid')):'';
		if(levelTwo==''){
			var catalogId = levelOne
		}else{
			var catalogId = levelTwo
		}
		if(titleName == undefined) {
			titleName = ''
		}
		if(catalogId == undefined) {
			catalogId = ''
		}
		var res = getData(QUERYVEDIORESOURCEPAGE, "{'page':" + index + ",'rows':" + limit + ",'titleName':'" + titleName + "','catalogId':'" + catalogId + "'}");
		return res;
	}
table.on('tool(demo)', function(obj) {
		var data = obj.data;
		if(obj.event === 'del') {
			var id = data.id;
			layer.confirm('真的删除视频么', function(index) {
				var d3 = {
					"id": id
				};
				d3 = JSON.stringify(d3);
				var res = reqAjax(DELETEVEDIORESOURCE, d3);
				if(res.code == 1) {
					obj.del();
				}
				layer.close(index);
				initForAct();
				layer.msg(res.msg);
			});
		}else if(obj.event === 'change') {
			layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo111').hide();
				},
				success: function(layero, index) {
					console.log(data)
					father('#cha-group-father','#cha-group-father>option:checked');
					son("#cha-group-son");
					$('#cha-group-father').on('change',function(){
						changeOption("#cha-group-son","#cha-group-father>option:checked")
					});
					var chaName = data.titleName;
					var parentId = data.parentId;
					var catalogId = data.catalogId;
					var url = data.vedioUrl;
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
					$('#chaName').val(chaName)
					$('#uploadVideo1').attr('src',url)
				},
				yes: function(index, layero) {
					var id = data.id;
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
	           		 	 	initForAct();
	           		 	 	layer.close(index);
	           		 	 }else{
	           		 	 	layer.msg(res.msg);
	           		 	 }
					}

				}
			});
		}
	});
	
	
	//新增
	$('#commonAdd').on('click',function(){
		layer.open({
				title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				btn: ['保存', '取消'],
				content: $('#demo222'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['800px', '560px'],
				end: function() {
					$('#demo222').hide();
				},
				success: function(layero, index) {
					father('#add-group-father','#add-group-father>option:checked');
					son("#add-group-son");
					$('#add-group-father').on('change',function(){
						changeOption("#add-group-son","#add-group-father>option:checked")
					});
				},
				yes: function(index, layero) {
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

				}
			});
	})

	//数据处理
	function addEq(data) {
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});
		return data;
	}

	//展开按钮
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



	//点击变色
	$('#tableBox').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	})

	//刷新
	function refresh() {
		location.reload();
	}
	$('#refresh').click(function() {
		refresh()
	});

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-220',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(1, 15);
		//第一页，一页显示15条数据
		if(res) {
			if(res.code == 1) {
				tableIns.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			}
		}

		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}

	//数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;
		var _feedbackType, _moreField1;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.feedbackType == 0) {
				_feedbackType = '系统问题'
			} else if(item.isCheck == 1) {
				_feedbackType = '页面问题'
			} else {
				_feedbackType = '其它问题'
			}
			if(item.moreField1 == 1) {
				_moreField1 = 'PC端'
			} else {
				_moreField1 = 'APP'
			}
			$(item).attr('_feedbackType', _feedbackType)
			$(item).attr('_moreField1', _moreField1)
		});

		return res;
	}
	
	
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

})(jQuery)