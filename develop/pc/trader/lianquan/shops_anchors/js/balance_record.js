$(function(){
	//地址栏参数获取
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
				console.log(data);
				console.log(cmd);
				var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
				var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
			    var inputdata = data;
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
			        callback(res, inputdata);
			      },
			      error: function (err) {
			        layer.msg("请求出错！");
			        console.log(err);
			      }
			    });
	  		 }
			

			var params=getParams();
			console.log(params);
			var cmd="game/findAccounts";			
			var datas={
				"shopId":Number(params.shopId),
				"status":-1,
				"page":0,
				"row":5
			};
			var data=JSON.stringify(datas);
			reqAjaxAsync(cmd,data,showRes);

			function showRes(re,inputdata){
		  		var datas=JSON.parse(inputdata);
		  		$("#msgNum").text(re.total);
				  //	更改分页select
				  var optionsHtml = "";
				  for (var i =5; i <45;i+=10) {

				    if (i ==datas.row) {
				      optionsHtml += '<option selected="selected" value="' + i + '">' + i + '</option>';
				    } else {
				      optionsHtml += '<option value="' + i + '">' + i + '</option>';
				    }
				  }
				$("#pageChange").html(optionsHtml);
				$("#pageEnd").text(datas.row);
				showPage(re,datas);				
			}

			function showPage(re,datas){
				console.log(datas);
				layui.use(['laypage', 'layer'], function(){
				  var laypage = layui.laypage,
				 		layer = layui.layer;
				  
				  laypage({
				    cont: 'pageBtns',
				    pages:Math.ceil(re.total/datas.row),//总页数
				    groups:5, //连续显示分页数
				    jump: function (obj) {
			          var curr = obj.curr;
			          var currNum=curr-1;
			          console.log(re.data.list.length);
			          console.log(datas);
					  var newdatas={
						"shopId":Number(params.shopId),
						"status":-1,
						"page":currNum,
						"row":datas.row
					 };
					 var data=JSON.stringify(newdatas);
					 console.log(data);
					  reqAjaxAsync(cmd,data,showTables);
					}
				})
				})
			}	

	function  showTables(re,data){
		console.log(re);
		console.log(data);
		$("#tablelist").html("");
		var table="";
	      var tableHeader='<table class="table table-bordered table-striped"><tbody>'+
	    	'<tr><th>序号</th><th>昵称</th><th>结算（猪仔）</th><th>结算状态</th><th>提交时间</th><th>流水号</th><th>备注</th></tr>';
	      var tablefooter="</tbody></table>";
			if(re.data.list.length){
				var tableCont="",
				    statusText="",
				    remarkText="";
				for(var i=0;i<re.data.list.length;i++){
					if(re.data.list[i].status===0){
						statusText="待审核";
					}else if(re.data.list[i].status===1){
						statusText="通过";
					}else if(re.data.list[i].status===2){
						statusText="未通过";
					}

					if(re.data.list[i].comment){
						remarkText=re.data.list[i].comment;
					}else{
						remarkText="暂无备注";
					}


					tableCont+='<tr><td>'+(i+1)+'</td><td>'+re.data.list[i].userName+'</td><td>'+re.data.list[i].money+'只</td>'+
					'<td>'+statusText+'</td><td>'+re.data.list[i].create_time.substr(0,10)+'</td><td>'+re.data.list[i].serialNo+'</td><td>'+remarkText+'</td></tr>';	
				}
				table=tableHeader+tableCont+tablefooter;
				$("#tablelist").html(table);
			}else{
				table='<table class="table table-bordered table-striped"><tbody>'+
		        '<tr><th>序号</th><th>昵称</th><th>结算（猪仔）</th><th>结算状态</th><th>结算时间</th><th>流水号</th><th>备注</th></tr>'+
		        '</tbody></table><div class="no-data">暂无数据~</div>';
		        $("#tablelist").html(table);
			}

		}

	$("#pageChange").on("change",function(){
		var row=Number($(this).val());
		var datas={
			"shopId":Number(params.shopId),
			"status":-1,
			"page":0,
			"row":row			
		};
		var data=JSON.stringify(datas);
		reqAjaxAsync(cmd,data,showRes);	
	});	
});