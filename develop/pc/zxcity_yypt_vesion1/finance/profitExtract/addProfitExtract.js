$(function () {
	//layer配置
	layer.config({
		extend: 'myskin/style.css', //加载您的扩展样式
		skin: 'layer-ext-myskin'
	});
	
	
	
	var jsonData = "";
	
	var res = reqAjax('payProfitExtract/addProfitExtractInit', jsonData);
	if(res.code == 1){
		$("#balanceStr").val(fmoney(res.data.profit.accountBalance, 2));
		$("#balance").val(res.data.profit.accountBalance);
	} else {
		layer.alert(res.msg);
	}
	
	
	
});


function changeMoney(e){
	var balance = $("#balance").val();
	
	var moneyStr = $(e).val();
	
	moneyStr = moneyStr.replace("e","");
	
	var money = moneyStr.replace(",","");
	
	if(money == ""){
		money = "0.00";
	}
	
	if(parseFloat(money) > parseFloat(balance)){
		$("#moneyStr").val("0.00");
		$("#money").val("0.00");
		layer.alert("提取金额不能大于盈利账户余额！");
	} else {
		if(parseFloat(money) >= 0.01){
			$("#money").val(money);
			$(e).val(moneyStr);
		} else {
			$("#moneyStr").val("0.00");
			$("#money").val("0.00");
			layer.alert("提取金额必须大于或等于0.01！");
		}
	}
}


//查询搜索事件
$("#reset").bind("click", function () {
	$("#moneyStr").val("0.00");
	$("#money").val("0.00");
});



//查询搜索事件
$("#addProfitExtract").bind("click", function () {
	
	var money = $("#money").val();
	var remark = $("#remark").val();
	var userId = yyCache.get("userId");
	
	var yyUserId = yyCache.get("userId");
	var yyUserName = yyCache.get("username");
	
	if(parseFloat(money) <= 0.00){
		layer.alert("请输入提取金额！");
	}
	
	var jsonData = "{'money': '"+money+"','remark': '" + remark + "','userId': '" + userId + "','yyUserId': '" + yyUserId + "','yyUserName': '" + yyUserName + "'}";
	
	var res = reqAjax('payProfitExtract/addProfitExtract', jsonData);
	if(res.code == 1){
		layer.msg("提取成功！");
		
		parent.window.location.href="profitExtractList.html";//刷新父窗口
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);//关闭窗口
	} else {
		layer.alert(res.msg);
	}
	
	
});




