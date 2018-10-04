(function($) {
    const QUERYROLEPREMISSIONPAGE = 'operations/queryMerchantBasicRolePermissionPage', //分页查询商户角色模板
		  ADDMERCHANT='operations/addMerchantBasicRolePermission', //添加商户角色模板
		  MODIFYMERCHANT='operations/modifyMerchantBasicRolePermission',//修改商户角色模板
		  DELETEMERCHANT='operations/deleteMerchantBasicRolePermission',//删除商户角色模板
		  GETMERCHANTBASICROLE='operations/getMerchantBasicRolePermissonTree',//获取商户角色模板已授权的权限树
		  GETALLPERMENUTREE = 'operations/getAllPerMenuTree'//获取所有权限树
		 
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})
  		
  	layui.use('form', function() {
		form = layui.form;
	})


	var _obj = tableInit('demo', [[
		    		 {title:'序号',sort:false,align:'left',field:'eq',width:80}
				    ,{title:'角色名称',sort:false,align:'left',field:'roleName',width:950}
				    ,{title:'操作',align:'left', toolbar: '#barDemo',width:800}
			  ]],
		pageCallback
	)	
	
	
	
	
	
	
  		

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:'full-220',
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
	
	
	

	//左侧表格数据处理
	function getData(url, parms) {

		var res = reqAjax(url, parms);

		var data = res.data;

		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1))
		});

		return res;
	}
	
	//pageCallback回调
	function pageCallback(index, limit , roleName) {
		if(roleName == undefined){roleName = ''}
		return getData(QUERYROLEPREMISSIONPAGE , "{'page':" + index + ",'rows':" + limit + ",'roleName':'" + roleName + "'}");
	}		
	
		 //新增参数
		 $('#commonAdd').on('click',function(){
			layer.open({
			  title: ['添加角色', 'font-size:12px;background-color:#0678CE;color:#fff'],
			  btn: ['保存', '取消'],
			  type: 1,
			  content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			  area: ['800px', '530px'],
			  end:function(){
			  	$('#demo111').hide();
			  	$('#addName').val('');
			  },
			  success: function(layero, index){
				  		var setting = {
	                    check: {
	                        enable: true
	                    },
	                    data: {
	                        simpleData: {
	                           	enable: true,
								idKey: "id",
								pIdKey: "pid",
								rootPId: 0
	                        },
	                        key: {
								checked: "Checked"
							}
	                    },
	                    view: {
							showIcon: true
						}
	                };
	                var data={};
	                var tree=reqAjax(GETALLPERMENUTREE)
	                var treeData = tree.data
	                for(var i=0;i<treeData.length;i++){
	                	treeData[i].id=Number(treeData[i].id)
	                	treeData[i].pid=Number(treeData[i].pid)
	                	treeData[i].icon=null
	            	}
	                treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
			  		$('div.layui-layer-page').addClass('layui-form')
			    	$('a.layui-layer-btn0').attr('lay-submit','');
				    $('a.layui-layer-btn0').attr('lay-filter','formDemo');
				    form.render()
			  },
			  yes:function(index, layero){
			  	//监听提交
				form.on('submit(formDemo)', function(data){
					if(data){
					  	var nodes = treeObj.getCheckedNodes(true);//已选中权限
						var arr = [];
						$.each(nodes,function(i,item){
							var name = item.name;
							var id = item.id
							arr.push(id+'-'+name)
							console.log(item)
						})
						var arrString = arr.join('=');//已选中权限树ID
					  	var roleName = $('#addName').val();//商户名字
					  	if(arrString==''){
					  		layer.msg('请勾选权限')
					  	}else{
					  		var parms = "{'roleName':'"+roleName+"','permissions':'"+arrString+"'}";
							var res = reqAjaxAsync(ADDMERCHANT,parms).done(function(res){
								if(res.code == 1){
				            		layer.msg(res.msg);
				        			layer.close(index)
				        			tableIns.reload({
									  data:getData(QUERYROLEPREMISSIONPAGE,"{'page':1,'rows':10000}")
									});
				            	}else{
				            		layer.msg(res.msg);
				            	}
							});
					    }
					}
				});
			  }
			});
		 })
		 
		 
		 //监听工具条,左侧表格
		  table.on('tool(demo)', function(obj){
		    var data = obj.data;
		    //修改
		    if(obj.event === 'change'){
	    	   layer.open({
				  title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				  type: 1,
				  btn: ['保存', '取消'],
				  content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area: ['800px', '530px'],
				  end:function(){
				  	$('#demo111').hide();
				  	$('#addName').val('');
				  	$('#addName').attr('disabled',false)
				  },
				  success: function(layero, index){
				        $('div.layui-layer-page').addClass('layui-form')
				    	$('a.layui-layer-btn0').attr('lay-submit','');
					    $('a.layui-layer-btn0').attr('lay-filter','formDemo');
						var data = obj.data;
					  	var roleName = data.roleName;
					  	$('#addName').val(roleName);
					  	$('#addName').attr('disabled',true)
					  	form.render();
					  	 var setting = {
			                    check: {
			                        enable: true
			                    },
			                    data: {
			                        simpleData: {
			                           	enable: true,
										idKey: "id",
										pIdKey: "pid",
										rootPId: 0,
										url:"url"
			                        },
			                        key: {
										checked: "checked"
									}
			                    },
			                    view: {
									showIcon: true
								}
			                };

			                var parms = "{'roleName':'"+roleName +"'}"
			                var tree=reqAjax(GETMERCHANTBASICROLE,parms)
			                var treeData = tree.data
			                if(treeData){
			                	for(var i=0;i<treeData.length;i++){
			                	treeData[i].id=Number(treeData[i].id)
			                	treeData[i].pid=Number(treeData[i].pid)
			                	treeData[i].icon=null
			                	}
			                  treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
			                }else{
			                	layer.msg(tree.msg)
			                }
				  },
				  yes:function(index, layero){
				  		//监听提交
					form.on('submit(formDemo)', function(done){
							var roleName = $('#addName').val();
							var roleCode = data.roleCode;
							if(done){
								var nodes = treeObj.getCheckedNodes(true);//已选中权限
								var arr = [];
								$.each(nodes,function(i,item){
									var name = item.name;
									var id = item.id
									arr.push(id+'-'+name)
								})
								var arrString = arr.join('=');//已选中权限树ID
								if(roleCode=='null'||roleCode==null){
									roleCode=''
								}
								var parms = "{'roleName':'"+roleName+"','permissions':'"+arrString+"',roleCode:'"+roleCode+"'}";
				            	reqAjaxAsync(MODIFYMERCHANT,parms).done(function(res){
						            	if(res.code == 1){
						            		layer.msg(res.msg);
						        			layer.close(index)
						        			tableIns.reload({
											   data:getData(QUERYROLEPREMISSIONPAGE,"{'page':1,'rows':10000}")
											});
						            	}else{
						            		layer.msg(res.msg);
						            	}
				            	});
							}
						});
				    }
	  			});
		      }
		  });

		  //数据处理
		  function addEq(data){
		  	 $.each(data,function(i,item){
	   		  	 $(item).attr('eq',(i+1))
	   		 });
		  	 return data;
		  }
		  
		  //展开按钮
		var flag = true;
		$('#spread').on('click',spread)
		
		
		function spread(){
			var oUl = $('.navList');
			var aLi = oUl.children('li');
			if(flag == true){
				$(this).html('<i class="layui-icon">&#xe630;</i>收起')
				flag = false;
				treeObj.expandAll(true);

			}else{
				$(this).html('<i class="layui-icon">&#xe630;</i>展开')
				flag = true;
				treeObj.expandAll(false);
			}
		}
		  
		  
		  
			
		  $('#search').on('click',function(){
		  		$('#search-tool').slideToggle(200)
		  })
		  
		  
		
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		//搜索功能
		$('#toolSearch').on('click', function() {
			var roleName = $("#inquireInputType").val();
			var initPage = _obj.tablePage;
			var initTable = _obj.tableIns;
			var res = pageCallback(initPage.curr, initPage.limit,roleName);				
			initTable.reload({ data : res.data });
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
						_obj.tableIns.reload({
							data: resTwo.data
						});
					else
						layer.msg(resTwo.msg);
				}
			}
			layui.laypage.render(page_options);
	
		})  

		//重置功能
		$('#toolRelize').on('click', function() {
		var initPage = _obj.tablePage;
		var initTable = _obj.tableIns;
		var res = pageCallback(initPage.curr, initPage.limit);				
		initTable.reload({ data : res.data });
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
					_obj.tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}
		layui.laypage.render(page_options);
		$("#inquireInputType").val('');
		$("#inquireInputNote").val('');
	})
		 
		  //点击变色
		  $('#tableBox').on('click','tbody tr',function(){
			  	$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
		  })

		  
		  //刷新
	    function refresh(){
	    	location.reload();
	    }
	    $('#refresh').click(function(){
	    	refresh()
	    });
		  
})(jQuery)