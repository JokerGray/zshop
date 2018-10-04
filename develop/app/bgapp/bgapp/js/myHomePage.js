$(function(){
	var employeeId = theRequest['employeeId']==undefined?null:theRequest['employeeId'];
	var shopId = theRequest['shopId']==undefined?null:theRequest['shopId'];
	var params={employeeId:employeeId};
	var params1={shopId:shopId};
	var params2={backUserId:employeeId,type:2};
	
	//我的销售业绩/我的消耗业绩 
	reqAjaxAsync('shopStatistics/myHomePageAch',JSON.stringify(params)).done(function(res){
		if(res.code==1){
			var arr1=new Array();
			var arr2=new Array();
			var arr3=new Array();
			for(var i=0;i<res.data.length;i++){
				arr1[i]=res.data[i].salePrice;
				arr2[i]=res.data[i].consumePrice;
				arr3[i]=res.data[i].time;
			}
			line1(arr3,arr1);
			line2(arr3,arr2);
		}else{
			console.log(res.msg);
		}
	})
	
	//新客分析/赠送统计
	reqAjaxAsync('masterStatistics/getTeamNewAccount',JSON.stringify(params2)).done(function(res){
		if(res.code==1){
			var todayRegister=res.data.todayRegister;
			var monthRegister=res.data.monthRegister;
			var todayLargess=res.data.todayLargess;
			var monthLargess=res.data.monthLargess;
			if(monthRegister==0){
				var percent1=0;
			}else{
				var percent1=Math.floor(todayRegister/monthRegister*100);
			}
			if(monthLargess==0){
				var percent2=0;
			}else{
				var percent2=Math.floor(todayLargess/monthLargess*100);
			}
			$('#todayAmount .amounts').text(todayRegister);
			$('#monthAmount .amounts').text(monthRegister);
			$('#todayGifts .amounts').text(todayLargess);
			$('#monthGifts .amounts').text(monthLargess);
			//新客分析圆环图
			$('#circle1').attr('data-text',percent1+"%");
			$('#circle1').attr('data-percent',percent1);
			$('#circle1').circliful();
			//赠送统计圆环图
			$('#circle2').attr('data-text',percent2+"%");
			$('#circle2').attr('data-percent',percent2);
			$('#circle2').circliful();
		}else{
			console.log(res.msg);
		}
	})
	
	//客户回访
//	reqAjaxAsync('shopStatistics/myHomePageAccountVisit',JSON.stringify(params1)).done(function(res){
//		if(res.code==1){
//			$('#oneMonthCome').text(res.data.oneMonthCome);
//			$('#oneMonthRegister').text(res.data.oneMonthRegister);
//			$('#twoMonthNotCome').text(res.data.twoMonthNotCome);
//			$('#twoMonthNotCommunicate').text(res.data.twoMonthNotCommunicatee);
//		}else{
//			console.log(res.msg);
//		}
//	})
	
	//客户卡项预警
//	reqAjaxAsync('shopStatistics/myHomePageWarning',JSON.stringify(params1)).done(function(res){
//		if(res.code==1){
//			var sHtml='';
//			for(var i=0;i<res.data.length;i++){
//				sHtml+="<div><span class='accountName'>"+res.data[i].account_name+"</span>"
//				+"<span class='total'>"+res.data[i].totelSos+"</span>"
//				+"</div>"
//			}
//			if(res.data.length==0){
//				$('#cumsWarn').append("<div class='noData'>暂无</div>");
//			}else{
//				$('#cumsWarn').append(sHtml);
//			}
//		}else{
//			console.log(res.msg);
//		}
//	})
})
