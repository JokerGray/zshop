$(function () {
	//设置默认值
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
	//请求URL
	var USER_URL = {
        SEARCHLIST: "game/findFaceApply",  //查询主脸主播申请列表信息
        AGREE:"game/checkPass", //同意申请
        REFUSE:"game/checkFailed" //拒绝申请
    };
    //根据参数名获取地址栏URL里的参数
	function getUrlParams(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
		return decodeURI(decodeURIComponent(r[2]));
		}
		return "";
	}
	var SHOPID=getUrlParams('shopId');
	//var SHOPID=49;
	var pageno=1;
  	var rows=10;
  	var layer=layui.layer;
	var table = layui.table;	
	var paramType = 0;
	//调用方法type等于0表示主脸，1表示主播
  	getTable(paramType,pageno);
  	
  	// 选择主播主脸
	$('.clint-type').on('click',function(){
		$(this).addClass('active').siblings().removeClass('active');
		var anchorType = $(this).attr('data-type');
		console.log(anchorType);
		$('.navbtn1').trigger('click');		

		getTable(anchorType,pageno);
	});
	$('.clint-type').eq(0).trigger('click');	
  	
  	function getTable(paramType,pageno) {    	
    	//第一个实例
    	var tableINs=table.render({
      		id:'demo',
      		elem: '#demo',
      		cols: [[ //表头
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
		        {field: 'userpic', title: '用户LOGO', width: '60', templet: "#imgTpl"},
		        {field: 'username', title: '用户名称', width: '80'},
		        {field: 'realname', title: '真实名称', width: '80'}, 
		        {field: 'usersex', title: '性别', width: '40'},  
		        {field: 'fansNumber', title: '粉丝数', width: '40'},                     
		        {field: 'age', title: '年龄', width: '40'},  
		        {field: 'phone', title: '手机号码', width: '100'},  
		        {field: 'email', title: '邮箱', width: '100'},  
		        {title: '操作', width: '160', templet:"#operationTpl"}
      		]]
    	});   	

    	var res=pageCallback(paramType,pageno);
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
    			var resTwo = pageCallback(paramType,obj.curr);
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
  	function pageCallback(paramType,pagerows) {
    	var param={
      		userId: USERID,
      		shopId:SHOPID,
      		type:paramType,
      		page:pagerows - 1,
      		row:rows
      		/*
      		pagination:{
        		page: pagerows,
        		rows: rows
      		}*/
    	}
    	var res=reqAjax(USER_URL.SEARCHLIST,JSON.stringify(param));
    	if(res.code==1){
     		return res;
    	}
  	}

  	//监听工具条
	table.on('tool(test)', function(obj){
	    var data = obj.data;   
		var id=data.id;
	    var layEvent = obj.event;   
	    //同意
	    if(layEvent=="to_agree"){    	
	    	var param={
				id: id,
	      		userId: USERID
	    	}
	    	//异步请求
	    	reqAjaxAsync(USER_URL.AGREE,JSON.stringify(param)).done(function(res) {
	    		if (res.code == 1) {
                    obj.del();
                }else{
                    layer.msg(res.msg);
                }
	    	});
	    }else if(layEvent=="to_refuse"){
	    	$("#refuseTop").modal("show");    	
	    	var param={
				id: id,
				cause:$("#cause").val(),
	      		userId: USERID
	    	}
			$("#refuseTopic").on("click", function(index){				
				if($("#cause").val().length == 0){
	    		 	layer.msg('请填写拒绝原因');
	    		}
				//异步请求
		    	reqAjaxAsync(USER_URL.REFUSE,JSON.stringify(param)).done(function(res) {
		    		if (res.code == 1) {
		    			obj.del();
			        	//layer.close(index);
			        	$("#refuseTop").modal("hide");
	                }else{
	                    layer.msg(res.msg);
	                }
		    	});
		    });
	    }
    
	});
	
})