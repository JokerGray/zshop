$(function () {
	//设置默认值
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
	//请求URL
	var USER_URL = {
        SEARCHLIST: "game/showAttestationUser",  //查询已签约主脸主播列表信息
        SHOPLIVEEND: "shopLive/liveStatusSet" //停止直播
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
	//var SHOPID = 49;
	var pageno=1;
  	var rows=10;
  	var paramType = 0;
  	var layer=layui.layer;
	var table = layui.table;
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
  		var a = new Array(new Array('00','01',"02"));
  		console.log(a)
  		//定义一维数组
  		var arr = new Array(new Array());
  		if(paramType == 0){ //主脸
  			var zhulian = new Array(new Array( 
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
		        {field: 'userpic', title: '用户LOGO', width: '60', templet: "#imgTpl"},
		        {field: 'username', title: '用户名称', width: '100'},
		        {field: 'realname', title: '真实名称', width: '80'}, 
		        {field: 'usersex', title: '性别', width: '40'},  
		        {field: 'fansNumber', title: '粉丝数', width: '40'},                     
		        {field: 'age', title: '年龄', width: '100'},  
		        {field: 'phone', title: '手机号码', width: '100'},  
		        {field: 'email', title: '邮箱', width: '100'},  
		        {field: 'createTime', title: '签约时间', width: '100'}
      		));
      		arr = zhulian;
  		}else if(paramType == 1){ //主播
  			var zhubo = new Array(new Array(
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
		        {field: 'userpic', title: '用户LOGO', width: '80', templet: "#imgTpl"},
		        {field: 'username', title: '用户名称', width: '100'},
		        {field: 'realname', title: '真实名称', width: '80'}, 
		        {field: 'usersex', title: '性别', width: '40'},  
		        {field: 'fansNumber', title: '粉丝数', width: '40'},                     
		        {field: 'age', title: '年龄', width: '40'},  
		        {field: 'phone', title: '手机号码', width: '100'},  
		        {field: 'email', title: '邮箱', width: '100'},  
		        {field: 'liveUser', title: '直播状态', width: '100',templet:"#shopLiveTpl"},
		        {title: '操作', width: '160', templet:"#operationTpl"}
      		));
      		arr = zhubo;
  		}
		console.log(arr)
  		
    	//第一个实例
    	var tableINs=table.render({
      		id:'demo',
      		elem: '#demo',
      		cols: arr
    	});

    	var res=pageCallback(paramType,pageno);
		if(res){
  			if(res.code==1){
		        tableINs.reload({
		          data: res.data.attestationUsers
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
        				data: resTwo.data.attestationUsers
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
      		page:pagerows -1,
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
		var streamId = data.streamId;
		var status =2; // 0 表示禁用，1 表示允许推流，2 表示断流;
	    var layEvent = obj.event;   
	    //编辑
	    if(layEvent=="to_agree"){    	
	    	var param={
				streamId: streamId,
				status: status,
	      		userId: USERID
	    	}
	    	//异步请求
	    	reqAjaxAsync(USER_URL.SHOPLIVEEND,JSON.stringify(param)).done(function(res) {
	    		if (res.code == 1) {
                    layer.msg(res.msg);
                }else{
                    layer.msg(res.msg);
                }
	    	});
	    }
    })
	
})