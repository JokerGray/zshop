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

			function showgragh(re){
				console.log("饼状图");
				console.log(re);
				var myChart = echarts.init(document.getElementById('graphs'));
				option = {
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient: 'horizontal',
			        left:"center",
			        top:0,
			        data: ['已结算','未结算'],
			        textStyle:{
						fontSize: 16,
						fontWeight: 200
			        }
			    },
			   color:["#2ed9cc","#9986f9","#54c0ec"],
			   series : [
			        {
			            name: '店铺明细',
			            type: 'pie',
			            radius : '60%',
			            center: ['50%', '60%'],
			            hoverAnimation:false,
			            data:[
			                {value:re.data.endMoney, name:'已结算'},
			                {value:re.data.waitMoney, name:'未结算'}
			            ],
						labelLine: {
							show: false
						},			
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			           
			            
			        }
			    ]
			 };
			 myChart.setOption(option);	
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
				//统计图
				showgragh(re);
		  		$("#msgNum").text(re.total);
				  //	更改分页select
				  var optionsHtml = "";
				  var nowpages=datas.row || 5;
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
	    	'<tr><th>序号</th><th>昵称</th><th>结算(猪仔)</th><th>结算状态</th><th>结算时间</th><th>备注</th></tr>';
	      var tablefooter="</tbody></table>";
			if(re.data.list.length){
				var tableCont="",
				    statusText="",
				    modifyTime="",
				    remarkText="";
				for(var i=0;i<re.data.list.length;i++){
					if(re.data.list[i].status===0){
						statusText="未审核";
					}else if(re.data.list[i].status===1){
						statusText="审核通过";
					}else if(re.data.list[i].status===2){
						statusText="审核未通过";
					}
					if(re.data.list[i].modify_time){
						modifyTime=re.data.list[i].modify_time.substr(0,10);
					}else{
						modifyTime="未审核";
					}
					if(re.data.list[i].comment){
						remarkText=re.data.list[i].comment;
					}else{
						remarkText="暂无备注";
					}


					tableCont+='<tr><td>'+(i+1)+'</td><td>'+re.data.list[i].userName+'</td><td>'+re.data.list[i].money+' 只</td>'+
					'<td>'+statusText+'</td><td>'+modifyTime+'</td><td>'+remarkText+'</td></tr>';	
				}
				table=tableHeader+tableCont+tablefooter;
				$("#tablelist").html(table);
			}else{
				table='<table class="table table-bordered table-striped"><tbody>'+
		        '<tr><th>序号</th><th>昵称</th><th>结算（猪仔）</th><th>结算状态</th><th>结算时间</th><th>备注</th></tr>'+
		        '</tbody></table><div class="no-data">暂无数据~</div>';
		        $("#tablelist").html(table);
			}
			// 撑开父级元素
			var pageH=$('body').height();
			parent.$('#wrap')[0].style.height=pageH+'px';
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