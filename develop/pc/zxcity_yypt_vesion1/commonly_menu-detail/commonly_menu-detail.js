(function($) {
		var USER_URL = {
	        RESOURLIST : 'operations/resourceList', //(查询权限)
	        ADDRESOURCE : 'operations/addResource',//(新增权限)
	        UPDATERESOURCE :'operations/updateResource',//(修改权限)
	        DELRESOURCE :'operations/removeResource',//(删除权限)
	        RESOURCETREE : 'operations/resourceTree', //(权限树)
	        RESOURCESIZE : 'operations/dictItemsGroupByType', //(权限类型)
	        QUERYMYLIST : 'operations/queryMyMenuList',//(权限列表)
	        CUSTOMIZEMYMENU : 'operations/customizeMyMenu',//(重命名)
	        DELETEMYMENU : 'operations/deleteMyMenu',//(删除)
	        ADDMYMENU : 'operations/addMyMenu',//(新增)
	        TREEOWNED : 'operations/resourceTreeOwned'
    	};
    	
    	
		//权限拖拽api
		function zTreeOnDrag(event, treeId, treeNodes) {
		    console.log(treeNodes)
					if(treeNodes[0].isParent){
						layer.msg('父级节点不允许拖动~')
					}else{
						var id = treeNodes[0].id;
						var name = treeNodes[0].name;
						var oTd = $('td.td2');
						var arr = [];
						$.each(oTd,function(i,item){
							var tdName = $(item).html();
							arr.push(tdName)
						})
						if($.inArray(name,arr)!=-1){
							layer.msg('权限已经存在啦~')
							$('#drag-notice').removeClass('act')
							$("#tbodyParameter").show();
						}else{
							layer.msg('拖动成功~')
							var sHtml = `<tr class='drappable-tr'>
	                                	<td class="td1 eq-num">1</td>
	                                	<td class="td2 td">`+name+`</td>
	                                	<td class="td3 td"></td>
	                                	<td class="resourceId td-none">`+id+`</td>
	                                	<td class="remove-modifier operation">
	                                		<div class="operation-div clearfix">
		                                		<div class="operation-btn blue delete-parameter">
		                                			 删除
		                                		</div>
		                                		<div class="details lightGreen operation-btn rename-parameter">
		                                			重命名
		                                		</div>
	                                		</div>
	                                	</td>
	                                </tr>`
	                    	$('#tbodyParameter').append(sHtml);
	                    	countNumber();
	                    	rightDrag();
							$('#drag-notice').removeClass('act')
							$("#tbodyParameter").show();
						}
					}
		};
		
		function setZtree(){
			    // 树形============================================
		             var setting = {
		             		edit: {
								enable: true,
								showRemoveBtn: false,
								showRenameBtn: false,
								drag: {
									isCopy: false,
									isMove: true
								}
							},
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
									checked: "Checked"
								}
		                    },
		                    view: {
								showIcon: true
							}, 
							callback: {  
							    onDrop: zTreeOnDrag,
							    onClick:zTreeOnClick
							}  
		                };
		                var roleIds = yyCache.get('roleIds')
		                var paramLft = "{'roleId':'"+roleIds+"'}"
        				var tree = reqAjax(USER_URL.TREEOWNED,paramLft);
		                var treeData = tree.data
		                for(var i=0;i<treeData.length;i++){
		                	treeData[i].id=Number(treeData[i].id)
		                	treeData[i].pid=Number(treeData[i].pid)
		            	}
		                treeObj = $.fn.zTree.init($("#treeDemo"), setting, treeData);
				}
				setZtree();
          //点击展开子集菜单
          function zTreeOnClick(event,treeId,treeNode){
          	var nodes=treeObj.getSelectedNodes();
          	if(nodes.length>0){
          		treeObj.expandNode(nodes[0],!nodes[0].open,false,true)
          	}
          };
		//点击变色
		selectColor();
		function selectColor(){
			$("#tbodyParameter").on('click','tr',function(){
				$(this).addClass('acve').siblings().removeClass('acve')
			})
		}
		
		//保存
		$('#save').on('click',save)
		
		//右侧菜单渲染
		showList();
		function showList(){
			var userId = yyCache.get('userId');
			var parms ="{'userId':'"+userId+"'}";
	   		var res =reqAjax(USER_URL.QUERYMYLIST,parms);
	   		if(res.code == 1){
	   			var list = res.data.list;
	   			var version = res.data.version.version;
	   			var sHtml = ''
	   			$.each(list,function(i,item){
		   				if(item.customName == null||item.customName == ''||typeof item.customName === 'undefind'){
	   					item.customName = ''
	   				}
	   				sHtml += `<tr class='drappable-tr'>
                                	<td class="td1 eq-num">`+(i+1)+`</td>
                                	<td class="td2 td">`+item.resource.name+`</td>
                                	<td class="td3 td">`+item.customName+`</td>
                                	<td class="version td-none">`+version+`</td>
                                	<td class="resourceId td-none">`+item.resourceId+`</td>
                                	<td class="id td-none">`+item.id+`</td>
                                	<td class="remove-modifier operation">
                                		<div class="operation-div clearfix">
	                                		<div class="operation-btn blue delete-parameter">
	                                			 删除
	                                		</div>
	                                		<div class="details lightGreen operation-btn rename-parameter">
	                                			重命名
	                                		</div>
                                		</div>
                                	</td>
                                </tr>`
	   				})
	   				$('#tbodyParameter').html(sHtml)
	   				$('#tbodyParameter').attr('data-version',version)
   			}else{
   				layer.msg("删除失败,请先保存")
   			}
		}
		
         
        
        //重命名
        var flag;
        $('#common-table').on('click','.rename-parameter',creatInput)
        function creatInput(){
        	var sHtml = '<input type="text" class="form-control newname" maxlength="10" id="reNameInput" title="请点击下方空白处确认" placeholder="最多输入10个字符">';
        	if(flag){
        		var val = $(this).parent().parent().siblings('.td3').html();
	    		$(this).parent().parent().siblings('.td3').html(sHtml);
	    		$('#reNameInput').focus();
	    		$(this).html('保存');
        	}else{
        		var id = $(this).parent().parent().siblings('.id').html();
        		if(id == ''||id == undefined){
        			$('#reNameInput').remove();
        			$(this).parent().parent().siblings('.td3').html('');
        			layer.msg('请先保存,页面即将刷新');
        			setInterval(function(){
            		 		location.reload();
        		 	},2000)
        		}else{
        			var version = $('#tbodyParameter').attr('data-version');
	        		var customName = $('#reNameInput').val();
	        		$(this).parent().parent().siblings('.td3').html(customName);
        			var parm = "{'id':'"+id+"','version':'"+version+"','customName':'"+customName+"'}"
	        		var res = reqAjax(USER_URL.CUSTOMIZEMYMENU,parm);
	        		if(res.code == 1){
	        			$('#tbodyParameter').attr('data-version',res.data);
	        			$(this).parent().parent().siblings('.version').html(res.data);
	        			$(this).html('重命名');
	        		}else{
	        			layer.msg(res.msg)
	        		}
        		}
        	}
        	flag = !flag;
        }
        
        
        //删除
        deleName();
        function deleName(){
        	$('#common-table').on('click','.delete-parameter',function(){
        		var _this = $(this);
        		var version = $('#tbodyParameter').attr('data-version');
        		var id = $(this).parent().parent().siblings('.id').html();//id
	        	layer.confirm(
	            "确认删除?",
	            {icon: 3, title:'提示'},
	            function(index){
            		 $(_this).parent().parent().parent().remove();
            		 layer.close(index); //如果设定了yes回调，需进行手工关闭
            		 if(id == ''||id == undefined){
            		 	layer.msg('请先保存,页面即将刷新');
            		 	setInterval(function(){
            		 		location.reload();
            		 	},2000)
            		 }else{
            		 	var paramDel = "{'id':'" + id + "','version':'" + version + "'}";
		                var res = reqAjax(USER_URL.DELETEMYMENU, paramDel);
		                if (res.code == 1) {
		                	layer.msg(res.msg);
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							location.reload()
		                } else {
		                    layer.msg(res.msg);
		                }
            		 }
	            })
        	})
        }
		
		//展开按钮
		var flag = true;
		$('#spread').on('click',spread)
		
		
		function spread(){
			var oUl = $('.navList');
			var aLi = oUl.children('li');
			if(flag == true){
				$(this).html('收起')
				flag = false;
				treeObj.expandAll(true);

			}else{
				$(this).html('展开')
				flag = true;
				treeObj.expandAll(false);
			}
		}
        
        
        	
			
			//右侧权限拖拽
			rightDrag();
			function rightDrag(){
				var indicator = $('<div class="indicator" style="display:none">>></div>').appendTo($('#tbodyParameter'));
				$('tr.drappable-tr').draggable({
					revert:true,
					deltaX:0,
					deltaY:0,
					onStopDrag:function(){
						countNumber();
					}
				}).droppable({
					onDrop:function(e,source){
						$(source).insertAfter(this);
					}
				});
			}
			
			
			//重置序号
			function countNumber(){
				var allTr = $('#tbodyParameter>tr')
				var tLen = $('#tbodyParameter>tr').length;
				$.each(allTr,function(i,item){
					$(item).children('.td1').html(i+1)
				})
			}
        
        
        	//保存
        	function save(){
        		var arr = [];
        		var oTr = $('tr.drappable-tr')
        		$.each(oTr, function(i,item) {
        			var id = $(item).children('.resourceId').html();
        			var name = $(item).children('.td3').html();
        			var no = $(item).children('.td1').html();
        			arr.push(id+'^')
        			arr.push(name+'^')
        			arr.push(no+'|')
        		});
        		var menuContent = arr.join('');
        		var userId = yyCache.get('userId');
        		var version = $('#tbodyParameter').attr('data-version');
        		var parms ="{'userId':'"+userId+"','version':'"+version+"','menuContent':'"+menuContent+"'}";
	   			var res =reqAjax(USER_URL.ADDMYMENU,parms);
	   			layer.msg('操作成功') 
	   			if(res.code == 1){
					$('#tbodyParameter').attr('data-version',res.data);
					location.reload();
	   			}else{
	   				layer.msg(res.msg) 
	   			}
        	}
        	
        	
        	//返回功能
        	$('#return').on('click',reJump)
        	function reJump(){
        		window.history.back();
        	}
    	
})(jQuery)