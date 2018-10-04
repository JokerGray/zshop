(function($) {
	const   GETMERCHANTPERMISS = 'operations/getPermissionsPagination',//根据父节点ID查询商户权限树
			ADDMERCHANTPERMISSION = 'operations/addMerchantPermission',//新增
			MODIFYMERCHANTPERMISSION = 'operations/modifyMerchantPermission',//修改
			GETALLPERMENUTREE = 'operations/getAllPerMenuTree'//获取所有权限树
			//ztree	
			sessionStorage.removeItem('strArr');
			sessionStorage.removeItem('pid');

			function zTreeOnClick(event, treeId, treeNode,obj) {
					//获取上次选中的权限，进行勾选清空
					var changeNodes = treeObj.getChangeCheckedNodes();
					for(var i=0;i<changeNodes.length;i++){
						changeNodes[i].Checked=false;
					}
					treeObj.refresh();
					//获取当前id并渲染
					var pid = treeNode.id;
					console.log(treeNode)
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
					
					var zero = 0;
					var arr = [];
					var nodes = treeObj.getCheckedNodes(true);//已选中权限
					$.each(nodes,function(i,item){
						arr.push(item.id+'/')
					})
					arr.unshift(zero+'/')
					var strArr = arr.join(',')
					strArr = strArr.replace(/,/g,'');
					sessionStorage.setItem('strArr',strArr);
					sessionStorage.setItem('pid',pid);
					list()
			};
			
			
			function setZtree(){
			    // 树形============================================
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
									checked: "Checked"
								}
		                    },
		                    view: {
								showIcon: false
							}, 
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


		
			//列表
			function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		        	$.each(data,function(i,item){
		        		if(item.available==1){
		        			item.available = '可用'
		        		}else{
		        			item.available = '不可用'
		        		}
		        		sHtml += `<tr>
                                	<td class="td1">`+(i+1)+`</td>
                                	<td class="td2">`+item.name+`</td>
                                	<td class="td3">`+item.type+`</td>
                                	<td class="td4">`+item.url+`</td>
                                	<td class="td5">`+item.available+`</td>
                                	<td class="id" style="display:none">`+item.id+`</td>
                                	<td class="percode" style="display:none">`+item.percode+`</td>
                                	<td class="parentids" style="display:none">`+item.parentids+`</td>
                                	<td class="parentid" style="display:none">`+item.parentid+`</td>
                                	<td class='row remove-modifier td7'>
                                		<a href="#" class="changeBtn" data-toggle="modal" data-target="#commerChange">
											<i class="changeBtn glyphicon glyphicon-pencil m5 green"></i>
											<i class="ft">修改</i>
										</a>
                                	</td>
                                </tr>`
		        			})
		                
			            $("#tbodyParameter").html(sHtml)
			        } else {
			            layer.msg(res.msg);
			        }
			}	
			
			function list(){
				var pid = sessionStorage.getItem('pid');
				var name = $('#inquireInput').val();
				var rows = 10;
		   		var layer = layui.laypage;
		   		var parms ="{'page':1,'rows':10,'pid':'"+pid+"','name':'"+name+"'}";
		   		var res =reqAjax(GETMERCHANTPERMISS,parms);
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
		   					var parms ="{'page':'"+obj.curr+"','rows':10,'pid':'"+pid+"','name':'"+name+"'}";
				            var res= reqAjax(GETMERCHANTPERMISS,parms);
				            commercialDetail(res);
				            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
				            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条，总数'+total+'条');
				        }
				        });
			}
			list();

			
            //新增
            $('#add-users').on('click',function(){
            	var strArr = sessionStorage.getItem('strArr');
            	var pid = sessionStorage.getItem('pid');
            	if(!strArr){
            		pid = 0;
            	}
            		$('#add-newuser').modal('show')
            		$('#add-newuser').on('click','#add-parameters',function(){
					var name = $('#addName').val();
					var type = $('#zytype').val()
					var url = $('#addIp').val();
					var percode = $('#addaoc').val();
					var available = $('#addAdminable').val()=='可用'?1:0
					if(name==''){
						layer.msg('请输入资源名')
					}else if(percode==''){
						layer.msg('请输入资源代码')
					}else if(url==''){
						layer.msg('请输入资源链接')
					}
					else{
						var parms ="{'name':'"+name+"','type':'"+type+"','url':'"+url+"','percode':'"+percode+"','parentid':'"+pid+"','parentids':'"+strArr+"','sortstring':'10','available':'"+available+"','icon':'dsa.ipg'}"
						var res= reqAjax(ADDMERCHANTPERMISSION,parms);
						if(res.code == 1){
							layer.msg(res.msg)
							location.reload();
						}else{
							layer.msg(res.msg)
						}
					}
				})
            	
            })
            
				
			
			
			//修改
			$('#tbodyParameter').on('click','.changeBtn',function(){
					var id = $(this).parent().siblings('.id').html();
					var pid = $(this).parent().siblings('.parentid').html();
					var name = $(this).parent().siblings('.td2').html();
					var type = $(this).parent().siblings('.td3').html();
					var url = $(this).parent().siblings('.td4').html();
					var percode = $(this).parent().siblings('.percode').html();
					var available = $(this).parent().siblings('.td5').html();
					var parentids = $(this).parent().siblings('.parentids').html();
					$('#chaName').val(name);
					$('#chaaoc').val(percode);
					$('#chazytype').val(type);
					$('#chaIp').val(url);
					$('#addAdminable').val(available);
					$('#commerChange').on('click','#saveParemeterconfig',function(){
					var name = $('#chaName').val();
					var type = $('#chazytype').val()
					var url = $('#chaIp').val();
					var percode = $('#chaaoc').val();
					var available = $('#chaAdminable').val()=='可用'?1:0
						if(name==''){
							layer.msg('请输入资源名')
						}else if(percode==''){
							layer.msg('请输入资源代码')
						}else if(url==''){
							layer.msg('请输入资源链接')
						}else{
							var parms ="{'id':'"+id+"','name':'"+name+"','type':'"+type+"','url':'"+url+"','percode':'"+percode+"','parentid':'"+pid+"','parentids':'"+parentids+"','sortstring':'10','available':'"+available+"','icon':'dsa.ipg'}"
							var res= reqAjax(MODIFYMERCHANTPERMISSION,parms);
							if(res.code == 1){
								layer.msg(res.msg)
								location.reload();
							}else{
								layer.msg(res.msg)
							}
						}
					})
			});	
			

			
						
		//查询
		$('#inquire').on('click',function(){
			list();
		})	
})(jQuery)