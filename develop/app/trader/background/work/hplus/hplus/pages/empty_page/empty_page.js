(function($){

    var USER_URL = {
        RESOURCETREE : 'operations/getAllScMultipleShopConfigureListByRole', //(权限树)
        SINGLERESOURCE : 'operations/getScMultipleShopConfigureInfoByMainId', //(组织结构详情),
        DETIAL:'operations/getBindRegionalAgencyBackUserByUserId',//绑定用户详情
        INFOBYID : 'operations/getBindScMultipleShopMerchantInfoById'//绑定商户详情
    };
    
    //取url参
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
    
    var layer = layui.layer;
    var table = layui.table;
    var form = layui.form;
    
    //加载左侧导航树
    function getTree(nos){
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
                    pIdKey: "parentId",
                    rootPId: null
                }
            },
            view: {
                showIcon: true
            },
            
            callback: {
                onClick: zTreeOnClick
            }
        };
        
        var parm={
        	backUserId:GetQueryString("backUserId")||""
        }
        reqAjaxAsync(USER_URL.RESOURCETREE,JSON.stringify(parm)).done(function(res){
            if(res.code == 1){
                var treeData = res.data;
                treeObj = $.fn.zTree.init($("#tree"), setting, treeData);
                if (nos != null &&nos.length>0) {
                    treeObj.selectNode(nos[0]);
                }
            }else{
                layer.msg(res.msg);
            }
        });
    }

    getTree();

    //刷新
    $("#refreshbtn").on("click",function(){
        location.reload();
    });
    

    //点击事件
     function zTreeOnClick(event, treeId, treeNode){
//   	var level = treeNode.level;
//   	console.log(treeNode)
        $("#tree").find("a").attr("href","javaScript:")
        
        var name = treeNode.name || "";
        var id = treeNode.id || "";
        var nodes = treeObj.getSelectedNodes();
        
        if(nodes.length>0){
        	treeObj.expandNode(nodes[0], !nodes[0].open, false, true);
        };
        getDetail(id);
    };
    //查询某一条
    function getDetail(resourceId){
        var param = {
            id :resourceId
        };
        reqAjaxAsync(USER_URL.SINGLERESOURCE,JSON.stringify(param)).done(function(res){
            if(res.code == 1){
                var row = res.data;   
                
                var id = row.id || "";
                var pid = row.parentid || "";            	
                var name = row.name || "";//组织机构名称             
                var level=row.level||"";//级别               
                if(level == 1 || level == 2){
                		$('#user').show();
	                	$('#merchant').hide()
	                	var backUserId = row.backUserId;
	                	if(backUserId){
	                		var param = {
					            userId :backUserId
					        }
		                	reqAjaxAsync(USER_URL.DETIAL,JSON.stringify(param)).done(function(res){
		                		if(res.code == 1){
		                			if(res.data != null){
		                				if(res.data.username){
			                				var username = res.data.username;
			                				$('#uesrBind').val(username);
			                				
			                			}
		                			}
		                		}
		                	})
	                	}
				
                }else{
                	$('#merchant').show();
                	$('#user').hide();
                	$('#merchantBind').val("")
                		var merchantId = row.merchantId;
                		if(merchantId){
	                		var param = {
					            merchantId :merchantId
					        }
		                	reqAjaxAsync(USER_URL.INFOBYID,JSON.stringify(param)).done(function(res){
		                		if(res.code == 1){
		                			if(res.data != null){
		                				if(res.data.org_name){
			                				var username = res.data.org_name;
			                				
			                				$('#merchantBind').val(username);
			                				
			                			}
		                			}
		                		}
		                	})
	                	}
            		
                }

                var parth=row.imagePath//图片地址
                $("#moduleName").val(name);
                $('#level').val(level);
                $("#uploadImgsee").attr('src',parth);
                form.render();
            }else{
                layer.msg(res.msg);
            }
        });
    };
    

    //点击顶部标题取消选中树
    $(".trees-box h4").click(function(){
        location.reload()
    });
	
})(jQuery);
