(function($) {
	var userno = sessionStorage.getItem('userno');
	var userName = sessionStorage.getItem('username')
	var userId = sessionStorage.getItem('userId');
	var merchantid = sessionStorage.getItem('merchantid');
	
	
	
	
	var layer = layui.layer;
	const MERCHANTLIST = 'operations/merchantList', //查询商户列表动态
		  ROLELIST='operations/merchantRoleList', //商户角色列表并分页
		  MENUTREE='operations/getAllPerMenuTree',//ZTREE角色树
		  QUERYRELAUSER='operations/queryRelauserList',//查询与选中角色关联的用户列表接口
		  ADDMERCHANTROLE='operations/addMerchantRole',//新增角色
		  MODIFYMERCHANTROLE='operations/modifyMerchantRole',//修改角色
		  GETROLEPERMISSTREE='operations/getRolePermissonTree',//获取该角色权限树
		  DELCHANTROLE='operations/delMerchantRole',//删除角色
		  NOTRELAUSERLIST='operations/queryNotrelauserList',//查询与选中角色未关联的用户列表接口
		  ADDMERCHANROLEUSER='operations/addMerchantRoleUser'//角色授权接口
		  
	var rows = 10;
	//商户select列表
    function commercialList() {
    	var res = reqAjax(MERCHANTLIST);
        var sHtml = "";
        var data = res.data;
        if (res.code == 1) {
           $.each(data,function(i,item){
                sHtml += `<option data-merchantid=`+item.merchantId+` data-id=`+item.id+` data-orgtype=`+item.orgType+` >`+item.orgName+`</option>`
            })
	            $("#commercialList").html(sHtml)
	        } else {
	            layer.msg(res.msg);
	        }
	        var merchantid =sessionStorage.getItem('merchantid')
	        if(merchantid){
	        	var merchantid =sessionStorage.getItem('merchantid')
	        $.each($('#commercialList>option'),function(i,item){
				if(merchantid===$(item).attr("data-merchantid")){
					$('#commercialList').val($(item).text())
				}
	        })
				
				
	        }else{
	        	var merchantid = $('#commercialList>option:selected').attr('data-merchantid')
	        	sessionStorage.setItem('merchantid',merchantid)
	        }
	    }
    commercialList()

    //商户角色列表
    function commercialDetail(res) {
        var sHtml = "";
        var data = res.data;
        if (res.code == 1) {
           $.each(data,function(i,item){
                var row = res.data[i];
                sHtml += `<tr>
							<td class="td1">`+(i+1)+`</td>
							<td class="td6" data-roleid=`+item.id+` style="display:none"></td>
							<td class="td7" data-isAdminRole=`+item.isAdminRole+` style="display:none"></td>
							<td class="td2">`+item.name+`</td>
							<td class="td3">`+item.scSysOrg.orgName+`</td>
							<td class="td4">`+(item.available==0?'不可用':'可用')+`</td>
							<td class="td5">
								<a href="#" class="w50 deleteBtn" >
									<i class="delBtn glyphicon glyphicon-minus-sign m5 red"></i>
									<i class="ft">删除</i>
								</a>
								<a href="#" class="w50 changeBtn" data-toggle="modal" data-target="#commerChange">
									<i class="changeBtn glyphicon glyphicon-pencil m5 green"></i>
									<i class="ft">修改</i>
								</a>
							</td>
						</tr>`
           })
	            $("#tbodyParameterL").html(sHtml)
	            $("#tbodyParameterL>tr:first").addClass('act')
	            var selectRoleId =$("#tbodyParameterL>tr:first").children('td').eq(1).attr('data-roleid');
	            var selectIsadminrole = $("#tbodyParameterL>tr:first").children('td').eq(2).attr('data-isadminrole');
    			sessionStorage.setItem('selectIsadminrole',selectIsadminrole)
	            if(selectRoleId){
	            	sessionStorage.setItem('selectRoleId',selectRoleId)
	            }else{
	            	sessionStorage.setItem('selectRoleId','')
	            } 			
	        } else {
	            layer.msg(res.msg);
	        }
	}
    
        	

	$('#commercialList').change(function(){
		var merchantid = $(this).children('option:selected').attr('data-merchantid');
		sessionStorage.setItem('merchantid',merchantid);
	})
	
	function list(){
   		var layer = layui.laypage;
   		var roleName = $('#inquireInput').val();
   		var merchantId = sessionStorage.getItem('merchantid');
   		console.log(merchantId)
   		var parms ="{'page':1,'rows':10,'roleName':'"+roleName+"','merchantId':'"+merchantId+"'}"
   		var res =reqAjax(ROLELIST,parms);
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
		        	var parms ="{'page':"+obj.curr+",'rows':10,'roleName':'"+roleName+"','merchantId':'"+merchantId+"'}"
		            var res= reqAjax(ROLELIST,parms);
		            commercialDetail(res);
		            getRelevanceList();
		            document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
		        });
	}
	
	list()
    //查询左侧商户列表
   	$('#inquire').on('click',list)
   		
    //商户列表点击选中
    $("#tbodyParameterL").on('click','tr',function(){
    	$(this).addClass('act').siblings().removeClass('act')
    	var selectRoleId = $(this).children('td').eq(1).attr('data-roleid');
    	sessionStorage.setItem('selectRoleId',selectRoleId)
    	var selectIsadminrole = $(this).children('td').eq(2).attr('data-isadminrole');
    	sessionStorage.setItem('selectIsadminrole',selectIsadminrole)
    	getRelevanceList();
    })
    
    
    //查询右侧已关联用户列表
    function relevanceList(res) {
        var sHtml = "";
        var data = res.data;
        if (res.code == 1) {
           $.each(data,function(i,item){
                var row = res.data[i];
                sHtml += `<tr>
							<td class="td1">`+(i+1)+`</td>
							<td>`+item.usercode+`</td>
							<td>`+item.username+`</td>
						  </tr>`
           	})
	            $("#tbodyParameterR").html(sHtml)
	        } else {
	        	$("#tbodyParameterR").html('')
	        }
	}
    
       //渲染右侧商户列表
    	function getRelevanceList(){
    		var layer = layui.laypage;
    		var roleId = sessionStorage.getItem('selectRoleId');
    		var parms = "{'page':1,'rows':10,'roleId':'"+roleId+"'}";
    		var res= reqAjax(QUERYRELAUSER,parms);
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
		        cont: 'paging-box-r'
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
		        	var roleId = sessionStorage.getItem('selectRoleId');
		        	var parms = "{'page':"+obj.curr+",'rows':10,'roleId':'"+roleId+"'}"
		            var res= reqAjax(QUERYRELAUSER,parms);
		            relevanceList(res);
		            document.getElementById('paging-box-count-r').innerHTML = render(res.data, obj.curr);
		            $('#paging-box-count-r').html('共'+ obj.pages +'页，每页'+rows+'条');
		        }
        	});
    	}
    	getRelevanceList();

    



	// 新增角色motal
	$('#commer').on('show.bs.modal', function () {
		//渲染商户列表
		var res = reqAjax(MERCHANTLIST);
        var sHtml = "";
        var data = res.data;
        if (res.code == 1) {
           $.each(data,function(i,item){
                sHtml += `<option data-merchantid=`+item.merchantId+` data-id=`+item.id+` data-orgtype=`+item.orgType+` >`+item.orgName+`</option>`
            })
	            $("#commercialList1").html(sHtml)
	        } else {
	            layer.msg(res.msg);
	        }
	        
			var merchantid =sessionStorage.getItem('merchantid')
		        if(merchantid){
		        	var merchantid =sessionStorage.getItem('merchantid')
		        $.each($('#commercialList1>option'),function(i,item){
					if(merchantid===$(item).attr("data-merchantid")){
						$('#commercialList1').val($(item).text())
					}
		        })			
		        }else{
		        	var merchantid = $('#commercialList1>option:selected').attr('data-merchantid')
		        	sessionStorage.setItem('merchantid',merchantid)
		        }   
	      //==========================================新增角色========================================================
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
                var tree=reqAjax(MENUTREE)
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
				arr.push(item.id)
			})
			var arrString = arr.join(',');//已选中权限树ID
			
			var merchantId = $('#commercialList1 option:selected').attr('data-merchantid');//已选中商户ID
			var available = $('#useable option:selected').val();//是否可用
			var isAdminRole = $('#adminable option:selected').val();//是否是管理员
			var name = $('#roleName').val();//商户名字
			if(name==''){
				layer.msg('请输入角色名称')
			}else if(name.length >=8){
				layer.msg('角色名称长度不能大于8个字符')
			}else if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(name)){
				layer.msg('角色名称不能有特殊字符') ;
			}else if(/(^\_)|(\__)|(\_+$)/.test(name)){
				layer.msg('角色名称首尾不能出现下划线\'_\'') ;
			}else if(/^\d+\d+\d$/.test(name)){
				layer.msg('角色名称不能全为数字')
			}else if(available==''){
				layer.msg('请勾选是否可用')
			}else if(merchantId==''){
				layer.msg('请勾选商户')
			}else if(isAdminRole==''){
				layer.msg('请勾选是否为管理员')
			}else if(arrString==''){
				layer.msg('请勾选权限')
			}else{
				var parms = "{'merchantId':'"+merchantId+"','available':'"+available+"','permissonid':'"+arrString+"','isAdminRole':'"+isAdminRole+"','name':'"+name +"'}";
				var res = reqAjax(ADDMERCHANTROLE,parms);
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
	$('#tbodyParameterL').on('click','.changeBtn',function(){
		var roleName = $(this).parent().siblings('.td2').html();//角色名
		var available = ($(this).parent().siblings('.td4').html())=='可用'?'1':'0';//是否可用
		var roleId = $(this).parent().siblings('.td6').attr('data-roleid')||'';//角色id
		sessionStorage.setItem('roleId',roleId)
			$('#commerChange').on('show.bs.modal', function () {
	      //==========================================修改角色========================================================
	      $('#roleName1').val(roleName);
	      $('#useable1').val(available)
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
						showIcon: false
					}
                };
                var data={};
                var parms = "{'roleId':'"+roleId+"'}"
                var tree=reqAjax(GETROLEPERMISSTREE,parms)
                var treeData = tree.data
                if(treeData){
                	for(var i=0;i<treeData.length;i++){
                	treeData[i].id=Number(treeData[i].id)
                	treeData[i].pid=Number(treeData[i].pid)
                	treeData[i].icon=null
                	}
                  treeObj1 = $.fn.zTree.init($("#treeDemo2"), setting, treeData);
                }else{
//              	layer.msg(tree.msg)
                }
                
        })
		
		
	})
	//修改角色保存
		$('#commerChange').on('click','#saveAudit2', function () {
			
			var nodes = treeObj1.getCheckedNodes(true);//已选中权限
			var arr = [];
			$.each(nodes,function(i,item){
				arr.push(item.id)
			})
			var arrString = arr.join(',');//已选中权限树ID
			
			var merchantId = sessionStorage.getItem('merchantid');
			var id = sessionStorage.getItem('roleId');
			var available = $('#useable1').val();
			var name = $('#roleName1').val();
			var permissonid = arrString;
				var parms = "{'merchantId':'"+merchantId+"','available':'"+available+"','permissonid':'"+arrString+"','name':'"+name +"','id':'"+id+"'}";
				var res = reqAjax(MODIFYMERCHANTROLE,parms);
				if(res.code == 1){
					layer.msg('修改成功')
					$('#commerChange').modal('hide')
					location.reload();
				}else{
					layer.msg(res.msg)
				}			
			})
		
		
	//删除角色
	  $("#tbodyParameterL").on("click", ".deleteBtn", function () {
	  	var roleId = $(this).parent().siblings('.td6').attr('data-roleid');//角色id
	  	var a = $(this)
        layer.confirm(
            "确认删除?",
            {icon: 3, title:'提示'},
            function(index){
                var paramDel = "{'ids':'" + roleId + "'}";
                var res = reqAjax(DELCHANTROLE, paramDel);
                if (res.code == 1) {
                    a.parent().parent().remove();
					layer.close(index); //如果设定了yes回调，需进行手工关闭
					list()
                } else {
                    layer.msg(res.msg);
                }
            })
	  });
	  
	//新增角色用户  
	$('#jurisdiction').on('show.bs.modal', function () {
		var roleId = sessionStorage.getItem('selectRoleId');
		var isAdminRole = sessionStorage.getItem('selectIsadminrole');
		var param = "{'roleId':'"+roleId+"','isAdminRole':'"+isAdminRole+"'}"
		if(roleId==''){
			layer.msg('当前没有角色')
		}else{
			var res = reqAjax(NOTRELAUSERLIST, param);
			if(res.code==1){
				if(res.data != ''){
					var data = res.data;
					var sHtml = '';
					$.each(data,function(i,item){
						sHtml += `<tr>
								<td class="td1">`+(i+1)+`</td>
								<td class="td6" data-ids=`+item.id+` style="display:none"></td>
								<td class="td2">`+item.usercode+`</td>
								<td class="td3">`+item.username+`</td>
								<td class="td5">
									<button class="accredit btn btn-info">授权</button>	
								</td>
							</tr>`
						})
					$('#tbodyParameterIn').html(sHtml);
				}else{
					layer.msg('暂无未授权用户')
				}
			}else{
				layer.msg(res.msg)
			}
		}
		
		
		//角色授权
		$('.accredit').click(function(){
			var ids = $(this).parent().siblings('.td6').attr('data-ids');
			var btn = $(this);
			var zh = $(this).parent().siblings('.td2').html();
			var xm = $(this).parent().siblings('.td3').html();
			var tLength = $('#tbodyParameterR tr').length;
			var sHtml =`<tr>
							<td class="td1">`+(tLength+1)+`</td>
							<td>`+zh+`</td>
							<td>`+xm+`</td>
						</tr>`
			
			layer.confirm(
            "确认授权吗?",
            {icon: 3, title:'提示'},
            function(index){
                var param = "{'ids':'" + ids + "','roleId':'"+roleId+"'}";
                var res = reqAjax(ADDMERCHANROLEUSER, param);
                if (res.code == 1) {
                	btn.html('已授权').attr('disabled',true)
                	$('#tbodyParameterR').append(sHtml)
                    layer.close(index);
                } else {
                    layer.msg(res.msg);
                }
            })
		})
		
		//保存
		$('#saveAudit3').click(function(){
			layer.msg('保存成功')
			$('#jurisdiction').modal('hide')
			location.reload();
		})
		
	})

	
})(jQuery)