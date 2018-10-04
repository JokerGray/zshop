$(function(){
		var REQUSTCMD={
			cmd1:"game/findzhibo",
			cmd2:"shopLive/onLive"
		}
		var params=getParams();
		var shopId=Number(params.shopId);
		var datas={
			"shopId":shopId
		}
		console.log(datas);
		var data=JSON.stringify(datas);
		reqAjaxAsync(REQUSTCMD.cmd1, data, showTable);

		function getParams() {
			var url = location.search;
			var params = new Object();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				var strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			return params;
		}
	  function reqAjaxAsync(cmd, data, callback) {
		var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
		var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
	    $.ajax({
	      type: "POST",
	      url: "/zxcity_restful/ws/rest",
	      dataType: "json",
	      async: true, //默认为异步
	      data: {
	        "cmd": cmd,
	        "data": data || "",
	        "version": version
	      },
	      beforeSend: function (request) {
	        request.setRequestHeader("apikey", apikey);
	      },
	      success: function (res) {
	        callback(res);
	      },
	      error: function (err) {
	        layer.msg("请求出错！");
	        console.log(err);
	      }
	    });
	  }	


	  function showTable(re){
	  	console.log(re);
	  	if(re.data.length){
	  	var tdHtml="";
	  	for(var i=0;i<re.data.length;i++){
	  		if(re.data[i].status==0){
	  			re.data[i].statusName="休息中";
	  		tdHtml+='<tr id="'+re.data[i].userId+'"><td>'+(i+1)+'</td><td>'+re.data[i].name+'</td><td><div class="showAnchor"><img src="'+re.data[i].userPic+'"/></div></td><td>'+re.data[i].sex+'</td><td>'+re.data[i].userName+'</td><td>休息中</td><td><span class="btn btn-gray">关闭直播</span></td></tr>'
	  		}else if(re.data[i].status==1){
	  			re.data[i].statusName="直播中";
	  		tdHtml+='<tr id="'+re.data[i].userId+'"><td>'+(i+1)+'</td><td>'+re.data[i].name+'</td><td><div class="showAnchor"><img src="'+re.data[i].userPic+'"/></div></td><td>'+re.data[i].sex+'</td><td>'+
	  		re.data[i].userName+'</td><td>直播中</td><td><span class="btn btn-primary closeLive" recordid="'+re.data[i].shopLiveRecord.id+'" usertype="'+re.data[i].shopLiveRecord.type+'">'+
	  		'关闭直播</span></td></tr>'
	  		}
	  	}
	    var tableHtml='<table class="table table-bordered table-striped"><tbody>'+
	    '<tr><th>序号</th><th>姓名</th><th>图像</th><th>性别</th><th>昵称</th><th>直播状态</th><th>操作</th></tr>'+tdHtml
	    '</tbody></table>'
	        $("#tablelist").html(tableHtml); 	  		
	  	}else{
		    var tableHtml='<table class="table table-bordered table-striped"><tbody>'+
		    '<tr><th>序号</th><th>姓名</th><th>图像</th><th>性别</th><th>昵称</th><th>直播状态</th><th>操作</th></tr></tbody></table>'+
		    '</table><div class="no-data">暂无数据~</div>';
		     $("#tablelist").html(tableHtml); 	  		
	  	}

	  	$(".closeLive").on("click",function(){
	  		var datas={
	  			shopId:shopId,
	  			type:0,
	  			userId:Number($(this).parent().parent().attr("id")),
	  			userType:Number($(this).attr("usertype")),
	  			recordId:Number($(this).attr("recordid"))
	  		}
	  		var data=JSON.stringify(datas);
			 layer.confirm('确认关闭直播？', {
			 	  btn: ['确认','取消'] //按钮
			 	}, function(){
			 	   reqAjaxAsync(REQUSTCMD.cmd2, data, closeLive);
			 	}, function(){
			 });
	  	});
	  }

	  function closeLive(re){
	  	layer.msg(re.msg);
	  	setTimeout(function(){
	  		window.location.reload();
	  	},2000);
	  }





});