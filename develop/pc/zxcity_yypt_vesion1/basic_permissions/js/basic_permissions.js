(function($) {
	const   GETMERCHANTPERMISS = 'operations/getPermissionsPagination',//根据父节点ID查询商户权限树
			ADDMERCHANTPERMISSION = 'operations/addMerchantPermission',//新增
			MODIFYMERCHANTPERMISSION = 'operations/modifyMerchantPermission',//修改
			GETALLPERMENUTREE = 'operations/getAllPerMenuTree'//获取所有权限树
		 
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})
		var checkNode = false;

        //ztree
			sessionStorage.removeItem('strArr');
			sessionStorage.removeItem('pid');

			function zTreeOnClick(event, treeId, treeNode,obj) {
					if(treeObj.getSelectedNodes()){
                        checkNode = true;
					}
					//获取上次选中的权限，进行勾选清空
					var changeNodes = treeObj.getChangeCheckedNodes();
					for(var i=0;i<changeNodes.length;i++){
						changeNodes[i].Checked=false;
					}
					$('#treeDemo').attr('data-i','1')
//					treeObj.refresh();
					//获取当前id并渲染
					var pid = treeNode.id;
					var child = treeNode.children;
					var level = treeNode.level;
					var f = treeNode.getParentNode();
					if(child!=undefined){
						treeObj.checkNode(treeNode, true, false);
						if(f){
							f.Checked = true;
							var ff = f.getParentNode();
							if(ff){
								ff.Checked = true;
								var fff = ff.getParentNode();
								if(fff){
									fff.Checked = true;
									var ffff =fff.getParentNode();
									if(ffff){
										ffff.Checked = true;
										var fffff =ffff.getParentNode();
										if(fffff){
											fffff.Checked = true;
											var a =fffff.getParentNode();
											if(a){
												a.Checked = true;
												var aa =a.getParentNode();
													if(aa){
													aa.Checked = true;
													var aaa =aa.getParentNode();
														if(aaa){
														aaa.Checked = true;
														var aaaa =aaa.getParentNode();
															if(aaaa){
															aaaa.Checked = true;
															var aaaaa =aaaa.getParentNode();
														}
													}
												}
											}
										}
									}
								}
							}
						}			
					}else{
						treeObj.checkNode(treeNode, true, true);
					}
					// console.log(treeNode.tId,treeNode.name);
					console.log(obj)
				    var zero = 0;
					var arr = [];
					var arr1 = [];
					var nodes = treeObj.getSelectedNodes(true);//已选中权限

					$.each(nodes,function(i,item){
						if(item.pid == 0 || item.getParentNode()){
                           arr=getParents(item,arr);
                           arr.unshift(item);
                         $.each(arr,function(j,items){
                         	if(items){
                                arr1.unshift(items.id+'/');
							}
						 })

						}
					})
				    arr1.unshift('0/');
					console.log(arr1)
					var strArr = arr1.join(',')
					strArr = strArr.replace(/,/g,'');
					sessionStorage.setItem('strArr',strArr);
					sessionStorage.setItem('pid',pid);
					var name = $('#inquireInputNote').val()||'';
					init_obj();
			};
			function getParents(item,arr){
				var f = function(){
					if(item){
                        arr.push(item.getParentNode())
						return getParents(item.getParentNode(),arr)
					}else{
						return arr;
					}
				}
				return f();
			}

			function setZtree(){
			    // 树形============================================
		             var setting = {
		                    check: {
		                        enable: false,//是否可以多选
		                        chkStyle: "checkbox",
		                        radioType: "all",
		                        nocheckInherit: true,
		                        chkDisabledInherit: true
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
								showIcon: false
							}
		                    ,
							callback: {  
							    onClick: zTreeOnClick  
							}  
		                };
		                var data={};
		                var tree=reqAjax(GETALLPERMENUTREE)
		                var treeData = tree.data
		                for(var i=0;i<treeData.length;i++){
		                	treeData[i].id=Number(treeData[i].id)
		                	treeData[i].pid=Number(treeData[i].pid)
		                	treeData[i].icon=null
		                	treeData[i].nocheck = false;
		            	}
		                treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);

            }
				setZtree();
				
				
	
	
	
	
	
	



	init_obj();
	function init_obj(){
			var _obj = tableInit('demo',[[
			    		 {title:'序号',sort:false,align:'left',field:'eq',width:80}
					    ,{title:'权限名称',sort:false,align:'left',field:'name',width:150}
					    ,{title:'权限类型',sort:false,align:'left',field:'type',width:150}
					    ,{title:'权限地址',sort:false,align:'left',field:'url',width:240}
                    	,{title:'权限代码',sort:false,align:'left',field:'percode',width:240}
					    ,{title:'是否可用',sort:false,align:'left',field:'_available',width:150}
					    ,{title:'操作',fixed: 'right',align:'left', toolbar: '#barDemo',width:350}
				  ]],
			pageCallback,'laypageLeft'
		)
	}
	
	
	
		  
		  
		  /* 表格初始化
	 * tableId: 
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback , pageDomName) {
		var tableIns, tablePage;
		var hgt =  $(window).height()-200;

		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height:hgt,
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
			elem:pageDomName,
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
				if(resTwo && resTwo.code == 1){
					tableIns.reload({
						data: resTwo.data
					});
				}
					
				else{
					layer.msg(resTwo.msg);
				}
					
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
			if(item.available == 1){
				$(item).attr('_available','是')
			}else{
				$(item).attr('_available','否')
			}
		});
		
		
		return res;
	}
	
	//pageCallback回调
	function pageCallback(index, limit ,name ,pid) {
		var name = $("#inquireInputType").val();
		var pid = sessionStorage.getItem('pid');
		if(name == undefined) {
			name = ''
		}
		if(pid == undefined) {
			pid = ''
		}
		return getData(GETMERCHANTPERMISS, "{'page':" + index + ",'rows':" + limit + ",'name':'" + name + "','pid':'" + pid + "'}");
	}
//		 //新增参数
		 $('#commonAdd').on('click',function(){
		 	if(!checkNode){
                sessionStorage.removeItem('pid');
                sessionStorage.removeItem('strArr')
            }
			layer.open({
			  title: ['添加权限', 'font-size:12px;background-color:#0678CE;color:#fff'],
			  btn: ['保存', '取消'],
			  type: 1,
			  content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			  area: ['800px', '560px'],
			  end:function(){
			  	$('#demo111').hide();
			  	$('#addName').val('');
			  	$('#addUrl').val('');
			  	$('#addCode').val('');
			  	$('#typeSelectr').val('');
			  	$('#typeIsable').val('');
			  },
			  success: function(layero, index){
			  		$('div.layui-layer-page').addClass('layui-form')
			    	$('a.layui-layer-btn0').attr('lay-submit','');
				    $('a.layui-layer-btn0').attr('lay-filter','formDemo');
				    form.render()
			  },
			  yes:function(index, layero){
			  	//监听提交
				form.on('submit(formDemo)', function(data){
					if(data){
						var pid = sessionStorage.getItem('pid');
						if(!pid){pid=0}
					  	var strArr = sessionStorage.getItem('strArr') || '0/';
					  	var name = $('#addName').val();
					  	var url = $('#addUrl').val();
					  	var percode = $('#addCode').val();
					  	var type = $('#typeSelectr').val();
					  	var available = $('#typeIsable>option:selected').attr('value');
		            	var parms ="{'name':'"+name+"','type':'"+type+"','url':'"+url+"','percode':'"+percode+"','parentid':'"+pid+"','parentids':'"+strArr+"','sortstring':'10','available':'"+available+"','icon':'dsa.ipg'}"
		            	var res = reqAjaxAsync(ADDMERCHANTPERMISSION,parms).done(function(res){
				            	if(res.code == 1){
				            		layer.msg(res.msg);
				        			layer.close(index)
				        			init_obj();
                                    setZtree();
                                    checkNode = false;
				            	}else{
				            		layer.msg(res.msg);
				            	}
		            	});
					}
				});
			  	

			  }
			});
		 })
		 
		 
		 //监听工具条,左侧表格
		  table.on('tool(demo)', function(obj){
		    var data = obj.data;
		    //查看
			  console.log(data)
		    if(obj.event === 'change'){
	    	   layer.open({
				  title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
				  type: 1,
				  btn: ['保存', '取消'],
				  content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				  area: ['800px', '560px'],
				  end:function(){
				  	$('#demo111').hide();
				  	$('#addName').val('');
				  	$('#addUrl').val('');
				  	$('#addCode').val('');
				  	$('#typeSelectr').val('');
				  	$('#typeIsable').val('');

				  },
				  success: function(layero, index){
				        $('div.layui-layer-page').addClass('layui-form')
				    	$('a.layui-layer-btn0').attr('lay-submit','');
					    $('a.layui-layer-btn0').attr('lay-filter','formDemo');
					    $('#addName').val(data.name);
					  	$('#addUrl').val(data.url);
					  	$('#addCode').val(data.percode);
					  	$('#typeSelectr').val(data.type);
					  	$('#typeIsable').val(data.available);
					  	form.render()
				  },
				  yes:function(index, layero){
				  		//监听提交
					form.on('submit(formDemo)', function(done){
							if(done){
								var id = data.id;
								var pid = data.parentid;
								if(!pid){pid=0}
							  	var strArr = data.parentids;
							  	var name = $('#addName').val();
							  	var url = $('#addUrl').val();
							  	var percode = $('#addCode').val();
							  	var type = $('#typeSelectr').val();
							  	var available = $('#typeIsable>option:selected').attr('value');
							  	var parms ="{'id':'"+id+"','name':'"+name+"','type':'"+type+"','url':'"+url+"','percode':'"+percode+"','parentid':'"+pid+"','parentids':'"+strArr+"','sortstring':'10','available':'"+available+"','icon':'dsa.ipg'}"
				            	var res = reqAjaxAsync(MODIFYMERCHANTPERMISSION,parms).done(function(res){
						            	if(res.code == 1){
						            		layer.msg(res.msg);
						        			layer.close(index)
						        			init_obj();
                                            setZtree();
                                            checkNode = false;
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

		  
		  
		  //左侧隐藏
		  $('#app').on('click','#leftSpread',function(){
		  	 $(this).parent().parent().hide();
		  	 
		  })
		  
		  
		  
		 
		 //搜索功能
		 $('#toolSearch').on('click',function(){
		 	init_obj();
		 })
		 
		 //重置功能
		 $('#toolRelize').on('click',function(){
			$("#inquireInputType").val('');
			init_obj();
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