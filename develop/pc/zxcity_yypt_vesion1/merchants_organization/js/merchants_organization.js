(function($) {
	var page=1;
	var rows=15;
	var userno = yyCache.get("userno");
	var userId = yyCache.get("userId");
	var names = yyCache.get('name');
	var pid='';
	var locked=true;
    //接口参数

	var user = {
		root:'operations/getAllTrees',//顶级商户组织机构树
	    list: 'operations/merchantOrgFirstList',//顶级组织机构的列表
	    sublist: 'operations/merchantOrgList',//子节点组织机构的列表
	    updateOrgName: 'operations/modify_org'//修改组织名称
	};
		
		
		
	var layer = layui.layer;
    var table = layui.table;
    layui.use('form', function(){
       form = layui.form;
    });	
			
			
	//左侧树
	function getTree(){
		var setting = {
		        check: {
		            enable: false,
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
						checked: "checked"
			        }
		    	},
	       		view: {
					showIcon: true,
					expandSpeed: "normal"
				},
				callback:{
					onClick:zTreeOnClick
				}
				
        };
		
        var tree=reqAjax(user.root);
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
        };
	};
	getTree();

 	//Ztree回调
		function zTreeOnClick(event, treeId, treeNode){
			var pid=treeNode.id;
			sessionStorage.setItem('pid',pid);
			var nodes=treeObj.getSelectedNodes();
			if(nodes.length>0){
				treeObj.expandNode(nodes[0],!nodes[0].open,false,true);
			};
			$("#laypageLeft").hide();
			ztreeReInitTable();
	};


    //刷新
	  $("#rig-tool").click(function(){
	    location.reload();
	  });
	
	//搜索按钮出现搜索框
	  $('.searchbutton').on('click',function(){
	    $('.searchform').slideToggle(200)
	  });
	

	  
	  //搜索功能
	  $('#searchbtn').on('click',function(){
	  	 reInitTable();
	  });
	  //重置功能
	  $('#resetbtn').on('click',function(){
	  	$('#username').val('');
	  	 reInitTable();
	  });
	  
    //初始化右侧表格
	function reInitTable(){
		var _obj = tableInit('table', [
				[{
					title: '序号',
					align: 'left',
					field: 'eq',
					width: 80,
					event: 'changetable'
				}, {
					title: '组织名称',
					align: 'left',
					field: 'orgName',
					width: 232,
					event: 'changetable'
				}, {
					title: '组织类型',
					align: 'left',
					field: '_orgType',
					width: 232,
					event: 'changetable'
				}, {
					title: '优先级',
					align: 'left',
					field: 'priority',
					width: 100,
					event: 'changetable'
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 240
				}]
			],
			pageCallback, 'laypageLeft'
		)
	}
	reInitTable();
	
	//点击树节点渲染右侧表格
	function ztreeReInitTable(){
		var _obj = tableInit('table', [
				[{
					title: '序号',
					align: 'left',
					field: 'eq',
					width: 80,
					event: 'changetable'
				}, {
					title: '组织名称',
					align: 'left',
					field: 'orgName',
					width: 232,
					event: 'changetable'
				}, {
					title: '组织类型',
					align: 'left',
					field: '_orgType',
					width: 232,
					event: 'changetable'
				}, {
					title: '优先级',
					align: 'left',
					field: 'orgLevel',
					width: 100,
					event: 'changetable'
				}, {
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 240
				}]
			],
			pageCallbackZtree, 'laypageLeft1'
		)
	};


/* 表格初始化
	 * tableId: 
	 * cols: []
	 * pageCallback: 同步调用接口方法
*/
	function tableInit(tableId, cols, pageCallback, pageDomName) {
		var tableIns, tablePage;

		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-250',
			cols: cols,
			page: false,
			even: true,
			skin: 'row',
			done:function(res, curr, count){
				
			}
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
			};
		};
		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: pageDomName,
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		};
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1) {
					tableIns.reload({
						data: resTwo.data
					});
				} else {
					layer.msg(resTwo.msg);
				};

			};
		};

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	};

    //表格数据处理
	 function getDataApp(url, parms) {
	
	    var res = reqAjax(url, parms);
	
	    var data = res.data;
	
	    $.each(data, function(i, item) {
	      $(item).attr('eq', (i + 1));
	          if(item.orgType == '0'){
	          	$(item).attr('_orgType', '公司');
	          }else if(item.orgType == '1'){
	          	$(item).attr('_orgType', '店铺');
	          }else if(item.orgType == '2'){
	          	$(item).attr('_orgType', '部门');
	          }else if(item.orgType == '3'){
	          	$(item).attr('_orgType', '集团');
	          }else if(item.orgType == '4'){
	          	$(item).attr('_orgType', '总部');
	          }else if(item.orgType == '5'){
	          	$(item).attr('_orgType', '团队');
	          }
	    });
	
	    return res;
	  };

	 //pageCallback回调
	function pageCallback(index, limit , orgName) {
	  	var orgName = $('#username').val();
	  	orgName = $.trim(orgName)
	    if(orgName == undefined){orgName = ''}
	    return getDataApp(user.list , "{'page':" + index + ",'rows':" + limit + ",'orgName':'" + orgName + "'}");
	  };
	//pageCallback回调
	function pageCallbackZtree(index, limit , pid) {
	  	var pid = sessionStorage.getItem('pid');
	  	if(pid==undefined){
	  			pid='';
	  	};
	    return getDataApp(user.sublist , "{'page':" + index + ",'rows':" + limit + ",'id':'" + pid + "'}");
	};


    //修改
    table.on('tool(table)',function(obj){
    	var data=obj.data;
    	if(obj.event==='change'){
    		layer.open({
	        title: ['修改', 'font-size:12px;background-color:#0678CE;color:#fff'],
	        type: 1,
	        content: $('#fourDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
	        area: ['500px', '300px'],
	        closeBtn: 1,
	        btn:['保存','取消'],
	        shade: [0.1, '#fff'],
	        end: function () {
	            $('#fourDemo').hide();
	        },
	        success: function (layero, index) {
	            var name = data.orgName;
	            var type = data.orgType;
	            var priority = data.priority;  //点击'修改'弹出对应信息
	            if(type==0){
	            	$('#fixdepartment').val("公司")
	            }else if(type==1){
	            	$('#fixdepartment').val("店铺")
	            }
	            $('#contentDesign').val(name);	            
	            $('#contentEq').val(priority);
	            form.render();
	        },
	        yes:function(index){
	        		var id = data.id;
	        		var parentId = data.parentId;
	        		var orgName = $('#contentDesign').val();
	        		var priority = $('#contentEq').val();      
	        		var orgIcon = data.orgIcon;
	        		var merchantId = data.merchantId;
	        		var shopId = data.shopId;
	        		var userId = yyCache.get('userno');
	        		var parm = {
	        			'id':id,
	        			'parentId':parentId,
	        			'orgName':orgName,
	        			'priority':priority,
	        			'orgIcon':orgIcon,
	        			'merchantId':merchantId,
	        			'shopId':shopId,
	        			'userId':userId,
	        		}
	        		parm = JSON.stringify(parm);
	        		if(orgName == ''){
	        			layer.msg('请输入组织名称')
	        			return 
	        		}
	        		if(priority == ''){
	        			layer.msg('请输入序号')
	        		}
	        		var res = reqAjax(user.updateOrgName,parm);
	        		if(res.code == 1){
	        			layer.msg('修改成功');
	        			layer.close(index)
	        			reInitTable();
	        		}
	        }
    	});
    		
    	};
    });

    //选中表单事件
    $('#app').on('click','tr',function(){
        $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
    });


})(jQuery)