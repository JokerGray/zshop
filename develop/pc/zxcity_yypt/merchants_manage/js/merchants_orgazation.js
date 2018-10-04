(function($){
    var REQUEST_URL = {
        'root':'operations/merchantOrgIndex',//顶级商户组织机构树
        'sub': 'operations/merchantOrgTree',//子商户组织结构树
        'list': 'operations/merchantOrgFirstList',//顶级组织机构的列表
        'sublist': 'operations/merchantOrgList',//子节点组织机构的列表
        'updateOrgName': 'operations/modify_org',//修改组织名称
        'addSetService': 'operations/addOrUpdateShopResources',//商户专业设置
        'initOpenService':'operations/init_openService'//商户专业设置初始化
    };
    var ORG_TYPE = {0:'公司', 1:'店铺', 2:'部门', 3:'集团', 4:'总部', 5:'团队'};
    var pageNo = 1, pageSize = 10;
    var _nodeId = "";



    //树-基础设置
    var setting = {
    	view: {
            showLine: false,
    		showIcon: false,
    		selectedMulti: false,
    		dblClickExpand: false,
    		selectedMulti: false
    	},
        data: {
            simpleData: {
                enable: true
            }
        },
        async: {
			enable: true,
            type:'post',
            url: '/zxcity_restful/ws/rest',
            dataType: 'json',
            //otherParam: {"cmd":REQUEST_URL['sub'], "data":"{'id':"+_nodeId+"}", "version":1},
            dataFilter: asyncDataFilter
		},
    	callback: {
            beforeExpand: beforeExpand,
			onAsyncSuccess: onAsyncSuccess,
			onAsyncError: onAsyncError,
            onClick: onClick
    	}
    };
    var perTime = 100;

    function asyncDataFilter(treeId, parentNode, resData){
        return resData.data;
    }

    function beforeExpand(treeId, treeNode){
        var zTree = $.fn.zTree.getZTreeObj("orgazationTree");

        zTree.setting.async.otherParam = {"cmd":REQUEST_URL['sub'], "data":"{'id':"+treeNode.id+"}", "version":1};

        if (!treeNode.isAjaxing) {
			treeNode.times = 1;
			ajaxGetNodes(treeNode, "refresh");
			return true;
		} else {
			alert("zTree 正在下载数据中，请稍后展开节点。。。");
			return false;
		}
    }

    function onAsyncSuccess(event, treeId, treeNode, msg) {
		if (!msg || msg.length == 0) {
            layer.alert(msg);
			return;
		}
		var zTree = $.fn.zTree.getZTreeObj("orgazationTree"),
		totalCount = treeNode.count;
		if (treeNode.children.length < totalCount) {
			setTimeout(function() {ajaxGetNodes(treeNode);}, perTime);
		} else {
			treeNode.icon = "";
			zTree.updateNode(treeNode);
		}
	}
	function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
		var zTree = $.fn.zTree.getZTreeObj("orgazationTree");
		layer.alert("异步获取数据出现异常。");
		treeNode.icon = "";
		zTree.updateNode(treeNode);
	}
    function ajaxGetNodes(treeNode, reloadType) {
		var zTree = $.fn.zTree.getZTreeObj("orgazationTree");

		if (reloadType == "refresh") {
			treeNode.icon = "../../common/assets/zTree_v3/css/zTreeStyle/img/loading.gif";
			zTree.updateNode(treeNode);
		}
		zTree.reAsyncChildNodes(treeNode, reloadType, true);
	}

    //点击节点选择
    function onClick(event, treeId, treeNode){
        $("#searchInput").val("");
        $(treeNode).parents("li").addClass("selected").siblings().removeClass("selected");

        var id = treeNode.id;
        _nodeId = treeNode.id;
        //加载列表
        getOrgList(treeNode.id);
    }

    //顶级商户组织机构树
    function getRootTreeData(){
        var res = reqAjax(REQUEST_URL['root'], "{}");
        if(res.code == 1){
            $.fn.zTree.init($("#orgazationTree"), setting, res.data);
        }
    }


    function showList(res){
        var sHtml = '';
        var obj = res.data;
        if(obj.length > 0){
            for(var i=0, len = obj.length; i<len; i++){
                var temp = JSON.stringify(obj[i]);
                var _sort = (pageNo - 1) * 10 + (i + 1);
                sHtml += '<tr id="'+obj[i].id+'" data-temp=\''+temp+'\'>'
                    + '<td>'+_sort+'</td>'
                    + '<td class="org-name">'+obj[i].orgName+'</td>'
                    + '<td>'+ORG_TYPE[obj[i].orgType]+'</td>'
                    + '<td>'+obj[i].priority+'</td>'
                    + '<td><a class="handle-btn edit-btn" href="javascript:;"><i class="icon"></i>修改</a>'
                if(obj[i].orgType == 1){
                    sHtml += '<a class="handle-btn btn set-btn" href="javascript:;">专业设置</a>'
                }else{
                    sHtml += '<a class="handle-btn btn set-btn hide" href="javascript:;">专业设置</a>'
                }

                sHtml += '</td></tr>'
            }
        }else{
            sHtml += '<tr><td colspan="5">暂无数据</td></tr>'
        }

        $("#listTable tbody").html(sHtml);
    }

    //顶级组织机构的列表
    function getAllData(){
        var param = {
            page: pageNo,  //页码
            rows: pageSize //显示行数
        };

        var searchTxt = $("#searchInput").val();
        if($.trim(searchTxt) != ""){
            param['orgName'] = $.trim(searchTxt);
        }

        var res = reqAjax(REQUEST_URL['list'], JSON.stringify(param));
        if(res.code == 1){
            //显示列表
            showList(res);

            //以下代码为分页功能
            var layer = layui.laypage;
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
                //,groups: 10
            	,first: false
            	,last: false
            	,prev: '<' //若不显示，设置false即可
            	,next: '>'
            	,pages: Math.ceil(res.total/pageSize) //得到总页数
                ,total:res.total
            	,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
            		var page = location.search.match(/page=(\d+)/);
            		return page ? page[1] : 1;
            	}()
            	,jump: function(obj,first){
                    pageNo = obj.curr;
                    param['page'] = pageNo;
                    var res = reqAjax(REQUEST_URL['list'], JSON.stringify(param));
                    if(res.code == 1){
                        showList(res);
                        document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
                    }

                    $('#paging-box-count').html('共'+ obj.pages +'页，每页'+pageSize+'条，总数'+obj.total+'条');
            	}
            });

        }
    }

    //子组织机构的列表
    function getOrgList(id){
        var param = {
            id: id,
            page: pageNo,  //页码
            rows: pageSize //显示行数
        };

        var searchTxt = $("#searchInput").val();
        if($.trim(searchTxt) != ""){
            param['orgName'] = $.trim(searchTxt);
        }

        var res = reqAjax(REQUEST_URL['sublist'], JSON.stringify(param));
        if(res.code == 1){
            //显示列表
            showList(res);

            //以下代码为分页功能
            var layer = layui.laypage;
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
                //,groups: 10
            	,first: false
            	,last: false
            	,prev: '<' //若不显示，设置false即可
            	,next: '>'
            	,pages: Math.ceil(res.total/pageSize) //得到总页数
                ,total:res.total
            	,curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
            		var page = location.search.match(/page=(\d+)/);
            		return page ? page[1] : 1;
            	}()
            	,jump: function(obj,first){

                    pageNo = obj.curr;
                    param['page'] = pageNo;
                    var res = reqAjax(REQUEST_URL['sublist'], JSON.stringify(param));
                    if(res.code == 1){
                        showList(res);
                        document.getElementById('paging-box-count').innerHTML = render(res.data, obj.curr);
                    }

                    $('#paging-box-count').html('共'+ obj.pages +'页，每页'+pageSize+'条，总数'+obj.total+'条');
            	}
            });

        }
    }

    $(function(){
        getRootTreeData();
        getAllData();
    });

    //所有组织
    $(".orgazation-tree .tree-title").click(function(){
        _nodeId = "";
        $("#searchInput").val("");
        getAllData();
    });
    //查询
    $(".search-box .search-btn").click(function(){
        if(_nodeId == ""){
            getAllData();
        }else{
            getOrgList(_nodeId);
        }

    });

    //打开修改组织弹框
    function openEditOrgazationDialog(data){
        layer.config({
          extend: 'myskin/style.css', //加载您的扩展样式
          skin: 'layer-ext-myskin'
        });
        var html = template('addOrgazationTpl', data);

        layer.open({
            type:1,
            title:'修改组织名称',
            area:['550px', '350px'],
            btn:['保存'],
            bthAlign:'c',
            content:html,
            success: function(){
                $("#orgType").find("option[value="+data.orgType+"]").prop("selected", true);
                //限制优先级只能输入正数
                $("#priority").keyup(function(){
                    var reg = /^[1-9]\d*$/;
                    if(!reg.test($(this).val())){
                        $(this).val("");
                        return;
                    }
                });
            },
            yes: function(index, layro){
                var orgName = $(".add-orgazation-box input[name=orgName]").val();
                if($.trim(orgName) == ""){
                    layer.msg("组织名称不能为空！");
                    return;
                }

                var priority = $("#priority").val();
                if($.trim(priority) == ""){
                    layer.msg("排序号不能为空！");
                    return;
                }

                var param = {
                    id:data.orgId,
                    parentId:data.tempObj.parentId,    // 父节点id
                    orgName:orgName, // 权限资源名
                    orgType: $("#orgType").val(), // 类型
                    priority:priority,    // sortstring 排序序号
                    orgIcon:data.tempObj.orgIcon, // 图标
                    merchantId:data.tempObj.merchantId,  //商户主键
                    shopId:data.tempObj.shopId,  //店铺主键
                    userId:sessionStorage.getItem("userno"),  //Storage里的userno
                    }
                var res = reqAjax(REQUEST_URL['updateOrgName'], JSON.stringify(param));
                if(res.code == 1){
                    layer.msg("修改成功！");
                    if(_nodeId == ""){
                        getAllData();
                    }else{
                        getOrgList(_nodeId);
                    }
                }else{
                    layer.msg(res.msg);
                }
                layer.close(index);

            }
        })
    }

    //打开专业设置弹框
    function openSetServiceDialog(data){
        layer.config({
          extend: 'myskin/style.css', //加载您的扩展样式
          skin: 'layer-ext-myskin'
        });
        var html = template('setServiceTpl', data);

        layer.open({
            type:1,
            title:'专业服务设置',
            area:['700px', '350px'],
            btn:['保存'],
            bthAlign:'c',
            content:html,

            yes: function(index, layro){
                var formData = decodeURIComponent($("#setServiceForm").serialize()).split("&");
                var param = {};
                for(var i=0; i<formData.length; i++){
                    var tempArr = formData[i].split("=");
                    /*if(tempArr[1] == ""){
                    var _txt = $("#"+tempArr[0]).parents(".form-group").find("label").text();
                        _txt = _txt.replace("＊", "");
                        layer.alert(_txt+"不能为空！");
                        return;
                    }else{
                        param[tempArr[0]] = tempArr[1];
                    }*/
                    param[tempArr[0]] = tempArr[1];
                }
                param['shopId'] = data.tempObj.shopId;
                if(formData[0].split("=")[1] == "" && formData[1].split("=")[1] == "" && formData[2].split("=")[1] == ""){
                    layer.alert("请输入相关信息！");
                }else{
                    var res = reqAjax(REQUEST_URL['addSetService'], JSON.stringify(param));
                    if(res.code == 1){
                        layer.msg("设置成功！");

                    }else{
                        layer.msg(res.msg);
                    }
                    layer.close(index);
                }

            }
        })
    }
    //修改
    $("#listTable tbody").delegate("tr>td .edit-btn", "click", function(){
        var orgId = $(this).parents("tr").attr("id");
        var tempObj = JSON.parse($(this).parents("tr").attr("data-temp"))

        var data = {
            orgId: orgId,
            orgName: tempObj.orgName,
            orgTypeList: ORG_TYPE,
            orgType: tempObj.orgType,
            priority: tempObj.priority,
            tempObj: tempObj
        };
        openEditOrgazationDialog(data);
    }).delegate("tr>td .set-btn", "click", function(){
        var tempObj = JSON.parse($(this).parents("tr").attr("data-temp"));
        var shopId = tempObj.shopId;
        var data = {
            tempObj: tempObj
        }
        var res = reqAjax(REQUEST_URL['initOpenService'], "{'shopId':"+shopId+"}");
        if(res.code == 1){
            data['fullViewAddr'] = res.data.fullViewAddr;
            data['livePullAddr'] = res.data.livePullAddr;
            data['livePushAddr'] = res.data.livePushAddr;
        }
        openSetServiceDialog(data);
    });



})(jQuery);
