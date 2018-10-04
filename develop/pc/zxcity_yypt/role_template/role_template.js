(function($) {
	sessionStorage.removeItem('nowHref');
	var layer = layui.layer;
	const QUERYROLEPREMISSIONPAGE = 'operations/queryMerchantBasicRolePermissionPage', //分页查询商户角色模板
		  ADDMERCHANT='operations/addMerchantBasicRolePermission', //添加商户角色模板
		  MODIFYMERCHANT='operations/modifyMerchantBasicRolePermission',//修改商户角色模板
		  DELETEMERCHANT='operations/deleteMerchantBasicRolePermission',//删除商户角色模板
		  GETMERCHANTBASICROLE='operations/getMerchantBasicRolePermissonTree',//获取商户角色模板已授权的权限树
		  GETALLPERMENUTREE = 'operations/getAllPerMenuTree'//获取所有权限树

	    //商户角色列表
	    function commercialDetail(res) {
	        var sHtml = "";
	        var data = res.data;
	        if (res.code == 1) {
	           $.each(data,function(i,item){
	                var row = res.data[i];
	                sHtml += `<tr>
								<td class="td1">`+(i+1)+`</td>
								<td class="td2">`+item.roleName+`</td>
								<td class="roleCode" style="display:none">`+item.roleCode+`</td>
								<td class="td3">
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
   		var layer = layui.laypage;
   		var rows = 10;
   		var roleName = $('#inquireInput').val();
   		var merchantId = sessionStorage.getItem('merchantid');
   		var parms ="{'page':1,'rows':10,'roleName':'"+roleName+"'}"
   		var res =reqAjax(QUERYROLEPREMISSIONPAGE,parms);
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
		        	var parms ="{'page':"+obj.curr+",'rows':10,'roleName':'"+roleName+"'}"
		            var res= reqAjax(QUERYROLEPREMISSIONPAGE,parms);
		            commercialDetail(res);
		            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
		        });
	}
	
	list()
   		
	
    
	//查询
	$('#inquire').on('click',function(){
		list()
	})


	// 新增角色motal
	$('#commer').on('show.bs.modal', function () {
		
	      //==========================================新增角色========================================================
    	  //============================================树形========================================================
             var setting = {
                    check: {
                        enable: true,
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
        })
	
	
	
	
	//监听新增motal关闭
		$('#commer').on('click','#saveAudit', function () {
			var nodes = treeObj.getCheckedNodes(true);//已选中权限
			var arr = [];
			$.each(nodes,function(i,item){
				var name = item.name;
				var id = item.id
				arr.push(id+'-'+name)
				console.log(item)
			})
			var arrString = arr.join('=');//已选中权限树ID
			var roleName = $('#roleName').val();//商户名字
			if(roleName==''){
				layer.msg('请输入角色名称')
			}else if(roleName.length >=8){
				layer.msg('角色名称长度不能大于8个字符')
			}else if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(roleName)){
				layer.msg('角色名称不能有特殊字符') ;
			}else if(/(^\_)|(\__)|(\_+$)/.test(roleName)){
				layer.msg('角色名称首尾不能出现下划线\'_\'') ;
			}else if(/^\d+\d+\d$/.test(roleName)){
				layer.msg('角色名称不能全为数字')
			}else if(arrString==''){
				layer.msg('请勾选权限')
			}else{
				var parms = "{'roleName':'"+roleName+"','permissions':'"+arrString+"'}";
				var res = reqAjax(ADDMERCHANT,parms);
				if(res.code==1){
					layer.msg('新增成功')
					$('#commer').modal('hide')
					location.reload();
				}else{
					layer.msg(res.msg)
				}
				
			}			
		})
		
		
	// 修改角色motal
	$('#tbodyParameter').on('click','.changeBtn',function(){
		var roleName = $(this).parent().siblings('.td2').html();//角色名
		var roleCode = $(this).parent().siblings('.roleCode').html();//roleCode
		sessionStorage.setItem('roleCode',roleCode)
		
			$('#commerChange').on('show.bs.modal', function () {
	      //==========================================修改角色========================================================
	      $('#roleName1').val(roleName);
	    // 树形============================================
             var setting = {
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        radioType: "all",
                        nocheckInherit: true,
                        chkDisabledInherit: true
                    },
                    data: {
                        simpleData: {
                           	enable: false,
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
						showIcon: false
					}
                };
                var data={};
                var parms = "{'roleName':'"+roleName+"'}"
                var tree=reqAjax(GETMERCHANTBASICROLE,parms)
                var treeData = tree.data
                if(treeData){
                	for(var i=0;i<treeData.length;i++){
                	treeData[i].id=Number(treeData[i].id)
                	treeData[i].pid=Number(treeData[i].pid)
                	treeData[i].icon=null
                	}
                  treeObj1 = $.fn.zTree.init($("#treeDemo2"), setting, treeData);
                }else{
                	layer.msg(tree.msg)
                }
                
        })		
	})
	//修改角色保存
		$('#commerChange').on('click','#saveAudit2', function () {
			
			var nodes = treeObj1.getCheckedNodes(true);//已选中权限
			var arr = [];
			$.each(nodes,function(i,item){
				var name = item.name;
				var id = item.id
				arr.push(id+'-'+name)
			})
			var arrString = arr.join('=');//已选中权限树ID
			var roleName = $('#roleName1').val();//商户名字
			var roleCode = sessionStorage.getItem('roleCode');
			if(roleCode=='null'||roleCode==null){
				roleCode=''
			}
			
			var parms = "{'roleName':'"+roleName+"','permissions':'"+arrString+"',roleCode:'"+roleCode+"'}";
			var res = reqAjax(MODIFYMERCHANT,parms);
				if(res.code == 1){
					layer.msg('修改成功')
					$('#commerChange').modal('hide')
					location.reload();
				}else{
					layer.msg(res.msg)
				}			
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
		
		
		
	//删除角色
//	  $("#tbodyParameterL").on("click", ".deleteBtn", function () {
//	  	var roleId = $(this).parent().siblings('.td6').attr('data-roleid');//角色id
//	  	var a = $(this)
//      layer.confirm(
//          "确认删除?",
//          {icon: 3, title:'提示'},
//          function(index){
//              var paramDel = "{'ids':'" + roleId + "'}";
//              var res = reqAjax(DELCHANTROLE, paramDel);
//              if (res.code == 1) {
//                  a.parent().parent().remove();
//					layer.close(index); //如果设定了yes回调，需进行手工关闭
//					list()
//              } else {
//                  layer.msg(res.msg);
//              }
//          })
//	  });

	
})(jQuery)