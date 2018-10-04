$(function(){
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
	var params=getParams();
	console.log(params);
	var cmd1="game/earningsQuery",//查询未结算
		cmd2="game/sendAccounts",//申请结算
		cmd3="scLaborTaxList/selectLaborTaxCalculation";//劳务税计算
	var datas={
		"shopId":Number(params.shopId),
		"page":0,
		"row":5
	}
	var data=JSON.stringify(datas);
	reqAjaxAsync(cmd1,data,showRes);

	  function reqAjaxAsync(cmd, data, callback) {
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
  	function showRes(re,inputdata){
  		console.log(re);
  		var datas=JSON.parse(inputdata);
  		console.log(datas);
  		$("#myShop").text("店铺名称："+re.data.shopName)
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
			  var newdatas={
				"shopId":datas.shopId,
				"page":currNum,
				"row":datas.row
			 };
			 console.log(newdatas);
			 var data=JSON.stringify(newdatas);
			  reqAjaxAsync(cmd1,data,showTables);
			}
		})
		})
	}  

	function  showTables(re){
		console.log(re);
		var table="";
	      var tableHeader='<table class="table table-bordered table-striped"><tbody>'+
	    	'<tr><th>序号</th><th>姓名</th><th>头像</th><th>昵称</th><th>签约时间</th><th>总收益（猪仔）</th><th>操作</th></tr>';
	      var tablefooter="</tbody></table>";
			if(re.data.list.length){
				var tableCont="";
				for(var i=0;i<re.data.list.length;i++){
					tableCont+=	'<tr userid="'+re.data.list[i].userId+'" auditstatus="'+re.data.list[i].auditStatus+'"><td>'+(i+1)+'</td><td>'+re.data.list[i].name+'</td><td><div class="showAnchor"><img src="'+re.data.list[i].userpic+'?x-oss-process=image/resize,m_fill,w_200,h_200,limit_0"/></div></td>'+
					'<td>'+re.data.list[i].username+'</td><td>'+re.data.list[i].createTime.substr(0,10)+'</td><td class="balance"><span class="bl_nb">'+re.data.list[i].balance+'只</span></td><td><div class="btn btn-primary sendApply">申请结算</div></td></tr>';
				}
				table=tableHeader+tableCont+tablefooter;
				$("#tablelist").html(table);
			}else{
				table='<table class="table table-bordered table-striped"><tbody>'+
				        '<tr><th>序号</th><th>姓名</th><th>头像</th><th>昵称</th><th>签约时间</th><th>总收益（猪仔）</th><th>操作</th></tr>'+
				       '</tbody></table><div class="no-data">暂无数据~</div>';
		        $("#tablelist").html(table);
			}

			// 撑开父级元素
			var pageH=$('.container-fluid').height();
			parent.$('#wrap')[0].style.height=pageH+'px';

			// 结算按钮
			$(".sendApply").on("click",function(){
				$("#balanceTotal").val("");
				$("#rmb").val("");
				$("#yName").val("");
				$("#yIdCard").val("");
				$("#yPhone").val("");
				$("#shouldPay").val("");
				$("#thisTax").val("");												
				$("#taxMoney2").val("");
				$("#tax").text("");
				$("#corporationName").val("");
				$("#creditCode").val("");
				$("#invoiceNumber").val("");
				
				 var userId=Number($(this).parents("tr").attr("userId")),
				 	shopId=Number(params.shopId),
				 	balance=$(this).parent().siblings(".balance").children(".bl_nb").text();
				 	balance=balance.substring(0,balance.length-1),
				 	auditstatus=$(this).parents("tr").attr("auditstatus");
				$("#adstatus").val(auditstatus);
				$("#balanceTotal").attr("balance",balance);
				$("#balanceTotal").attr("placeholder","≤"+balance+"只（10的倍数）");
				$(".model").show();
				$("#balanceTotal").on("input",function(){
					var values=$(this).val();
					if(!(/^[0-9]*[1-9][0-9]*$/i).test(values)){
						$(this).val("");
					}
					$("#rmb").val("");
					$("#taxMoney1").text("");
					$("#taxMoney2").val("");
					$("#tax").text("");					
				});
				$("#balanceTotal").on("change",function(){
					var values=$(this).val();
					if(Number(values)>Number(balance)){
						layer.msg("请不要多于"+balance+"！");
						$(this).val("");
						return false;						
					}					
					if(!(/^[1-9][0-9]*0$/i).test(values)){
						layer.msg("请输入10的整数倍！");
						$(this).val("");
						return false;
					}
					var rmb=values/10,
						tax=Math.ceil(rmb*0.8*0.2);
					$("#rmb").val(rmb);
					$("#taxMoney2").val(rmb);
					var datas={
						laborCosts:rmb,
						userId:userId
					}
					console.log(datas);
					var data=JSON.stringify(datas);
					reqAjaxAsync(cmd3,data,showTax);
				
				});				
				
				function showTax(re){
					console.log(re);
					if(re.code==1){
						$("#shouldPay").val(re.data.shouldPayATax);
						$("#thisTax").val(re.data.paymentAmountCalculationFormula);
					}else{
						layer.msg(re.msg);
					}
				}
				$(".taxli").eq(0).trigger("click");

				$("#submit").on("click",function(){
					if($(this).hasClass("nosubmit")){
						layer.msg("不可提交");
						return false;
					}
					var newBal=$("#balanceTotal").val();
					if(!newBal){
						layer.msg("请输入结算金额");
						return false;
					}
					var type=$(".taxli_active").index();
//					税务类型：0为个人，1为企业
					if(type){
						var corporationName=$("#corporationName").val(),
							invoiceNumber=$("#invoiceNumber").val(),
							creditCode=$("#creditCode").val();	
						if(!corporationName){layer.msg("请输入企业名称");return false;}
						if(!invoiceNumber){layer.msg("请输入发票编号");return false;}						
						if(!creditCode){layer.msg("请输入统一社会信用代码");return false;}
						
						 var datas={
						 	"shopId":shopId,
						 	"userId":userId,
						 	"balance":newBal,
						 	"taxType":"企业报税",
						 	"corporationName":corporationName,
						 	"invoiceNumber":invoiceNumber,
						 	"creditCode":creditCode
						 }
						 var data=JSON.stringify(datas);
						 layer.confirm('申请结算吗？', {
						 	  btn: ['确认','取消'] //按钮
						 	}, function(){
						 	  console.log(data);
						 	  reqAjaxAsync(cmd2,data,sendResult);
						 	}, function(){
						 });
//						 个人税务类型
					}else{
						var yName=$("#yName").val();
						if(!yName){layer.msg("请输入真实姓名");return false;}
						var yIdCard=$("#yIdCard").val();
						if(!yIdCard){layer.msg("请输入身份证号码");return false;}
						var isIDCard1=/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
						var isIDCard2=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						var regs=/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
						if(!regs.test(yIdCard)){layer.msg("请输入正确身份证号码");return false;}
						var yPhone=$("#yPhone").val();
						if(!yPhone){layer.msg("请输入手机号码");return false;}
						if(!(/^[1][3,4,5,7,8][0-9]{9}$/i).test(yPhone)){layer.msg("请输入正确手机号码");return false;}
						 var datas={
						 	"shopId":shopId,
						 	"userId":userId,
						 	"balance":newBal,
						 	"taxType":"劳务报税",
						 	"name":yName,
						 	"idNumber":yIdCard,
						 	"phone":yPhone
						 }
						 var data=JSON.stringify(datas);
						 layer.confirm('申请结算吗？', {
						 	  btn: ['确认','取消'] //按钮
						 	}, function(){
						 	  console.log(data);
						 	  reqAjaxAsync(cmd2,data,sendResult);
						 	}, function(){
						 });						

					}
				});




			});

	}	

	$("#pageChange").on("change",function(){
	var showName=$("#inputName").val();
	var row=Number($(this).val());
	var datas={
		"shopId":Number(params.shopId),
		"page":0,
		"row":row			
	};
	var data=JSON.stringify(datas);
	reqAjaxAsync(cmd1,data,showRes);	
	});		
		// 申请结算回调
	function sendResult(re){
		layer.msg(re.msg);
		setTimeout(function(){
			window.location.reload();
		},2000);
	}
	
	$("#colseModel").on("click",function(){
		$(".model").hide();
	});
	$(".taxli").on("click",function(){
		$(this).siblings().removeClass("taxli_active");
		$(this).addClass("taxli_active");
		var adstatus=Number($("#adstatus").val());
		console.log("点击状态："+adstatus);
		if($(this).index()==0){
			$("#submit").removeClass("nosubmit");
			if(adstatus){
				$(".stTip").show();
				$("#submit").addClass("nosubmit");
			}else{
				$(".stTip").hide();
			}
			$(".mdct1").hide();$(".mdct0").show();
		}else if($(this).index()==1){
			$("#submit").removeClass("nosubmit");
			$(".mdct0").hide();$(".mdct1").show();
		}
	});



	
});