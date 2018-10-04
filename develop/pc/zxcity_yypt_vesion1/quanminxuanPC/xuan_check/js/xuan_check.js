$(function () {
	//设置默认值
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
	//请求URL
	var USER_URL = {
        SEARCHLIST: "dazzle/searchBestDazzleIdListByKeyWords",  //根据关键字模糊查询
        EDITLIST: "dazzle/updateAuditTypeById"    //修改审核类型
    };
	var pageno=1;
  	var rows=10;
  	var paramKey = "";
  	var layer=layui.layer;
	var table = layui.table;
	//调用方法
  	getTable(paramKey,pageno);
	
  	function getTable(paramKeys,pageno) {    	
    	//第一个实例
    	var tableINs=table.render({
      		id:'demo',
      		elem: '#demo',
      		cols: [[ //表头
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
		        {field: 'dazzleId', title: '编号', width: '40'},
		        {field: 'dazzleType', title: '类型', width: '100',templet: "#dazzleTypeTpl"},
		        {field: 'labelName', title: '标签', width: '80',templet:"#labelNameTpl"}, 
		        {field: 'coverUrl', title: '封面地址', width: '100', templet: "#imgTpl"},  
		        {field: 'videoUrl', title: '视频地址', width: '250'},                     
		        {field: 'name', title: '名称', width: '160'},  
		        {field: 'releaseTime', title: '发布时间', width: '160'},  
		        {field: 'modifyTime', title: '精选时间', width: '160'},  
		        {title: '操作', width: '160',fixed: 'right', templet: '#checkboxTpl'}
      		]]
    	});

    	var res=pageCallback(paramKeys,pageno);
		if(res){
  			if(res.code==1){
		        tableINs.reload({
		          data: res.data
		        })
		    }else {
		        layer.msg(res.msg)
		    }
		}

		//分页
		layui.use('laypage');
		var page_options = {
  			elem: 'laypageLeft',
  			count: res ? res.total : 0,
  			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
  			groups: '4',
  			limit: rows,//每页条数
  			limits: [5, 8, 10]
		}
		//分页渲染
		page_options.jump = function(obj, first) {
  			if(!first) {
    			var resTwo = pageCallback(paramKeys,obj.curr);
    			if(resTwo && resTwo.code == 1)
      				tableINs.reload({
        				data: resTwo.data
      				});
    			else
      				layer.msg(resTwo.msg);
  			}
		}
		layui.laypage.render(page_options);
  	}

  	//获取内容方法
  	function pageCallback(paramKeys,pagerows) {
    	var param={
      		paramKeys: paramKeys,
      		userId: USERID,
      		pagination:{
        		page: pagerows,
        		rows: rows
      		}
    	}
    	var res=reqAjax(USER_URL.SEARCHLIST,JSON.stringify(param));
    	if(res.code==1){
     		return res;
    	}
  	}
		
  	//获取参数
  	function getUrlParams(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
      		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
      		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
  	}
  	
  	//搜索
  	$("#search").on('click', function (){
  		var paramKeys = $("#paramKeys").val();
  		getTable(paramKeys,pageno);
  	});

  	//监听工具条
	table.on('tool(test)', function(obj){
	    var data = obj.data;   
		var dazzleId=data.dazzleId;
		var videoUrl=data.videoUrl;	
	    var layEvent = obj.event;   
	    //编辑
	    if(layEvent=="to_edit"){    	
	    	$("#editTop").modal("show");
	    	$("#video").attr("src",videoUrl);
	    	var auditType = $("input[name='audittype']:checked").val();
	    	var param={
				dazzleId: dazzleId,
				auditType: auditType,
	      		userId: USERID
	    	}
	    	$("#editTopic").on("click", function(index){
		    	//异步请求
		    	reqAjaxAsync(USER_URL.EDITLIST,JSON.stringify(param)).done(function(res) {
		    		if (res.code == 1) {
	                    obj.del();
			        	//layer.close(index);
			        	$("#editTop").modal("hide");
	                }else{
	                    layer.msg(res.msg);
	                }
		    	});
			});
	    }else if(layEvent=="to_del"){
	    	var param={
				dazzleId: dazzleId,
				dazzleState: "-1", //状态:0草稿，1发布,-1删除
	      		userId: USERID
	    	}
			layer.confirm('确认删除该条数据吗', function(index){
				//异步请求
		    	reqAjaxAsync(USER_URL.EDITLIST,JSON.stringify(param)).done(function(res) {
		    		if (res.code == 1) {
	                    obj.del();
			        	layer.close(index);
	                }else{
	                    layer.msg(res.msg);
	                }
		    	});
		    });
	    }
    
	});
	
})