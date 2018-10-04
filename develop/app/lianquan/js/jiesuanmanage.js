$(function () {
	//设置默认值
	var USERID=121;
	if(window.location.host=='managernew.izxcs.com'){
	    USERID=1706
	}
	//请求URL
	var USER_URL = {
        SEARCHLIST: "game/findAccounts"  //查询结算列表信息
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
  	
  	function getTable(paramType,pageno) {    	
    	//第一个实例
    	var tableINs=table.render({
      		id:'demo',
      		elem: '#demo',
      		cols: [[ //表头
        		{type:'numbers',title: '序号',width: '40', templet:"#indexTpl"},
        		{field: 'userName', title: '用户名称', width: '60'},
		        {field: 'money', title: '结算猪仔(Kg)', width: '60'},
		        {field: 'status', title: '结算状态', width: '80', templet:"#statusTpl"},
		        {field: 'create_time', title: '提交时间', width: '80'}, 
		        {field: 'serialNo', title: '流水号', width: '100'},  
		        {field: 'comment', title: '备注', width: '200'}
      		]]
    	});

    	var res=pageCallback(paramType,pageno);
		if(res){
  			if(res.code==1){
		        tableINs.reload({
		          data: res.data.list
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
        				data: resTwo.data.list
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
      		page:pagerows -1 ,
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
})