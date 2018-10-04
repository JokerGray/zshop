$(function(){
	var shopId = theRequest['shopId']==undefined?null:theRequest['shopId'];
	var type = theRequest['type']==undefined?null:theRequest['type'];
	var shopList = theRequest['shopList']==undefined?null:theRequest['shopList'];
	var merchantId = theRequest['merchantId']==undefined?null:theRequest['merchantId'];
	var params1="{'shopId':"+shopId+",'timeType':2}";
	var params2="{'shopId':"+shopId+"}";
	var params3="{'merchantId':"+merchantId+",'shopList':"+shopList+",timeType:2}";
	var params4="{'shopList':"+shopList+"}";
	
	//判断多店单店
	if(type==1){
		//单店
		lineInit(params1);
		getData(params2);
	}else if(type==2){
		//多店
		if(shopList=''||JSON.parse(shopList).length==0){
			layer.msg("未传入店铺ID");
		}
		lineInit(params3);
		getData(params4);
	}
	
	//门店销售业绩/门店消耗业绩
	function lineInit(params){
		reqAjaxAsync('shopStatistics/queryShopAchInfoSummeryDetials',params).done(function(res){
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
	}
	
	function getData(params){
		//最好卖的产品
		reqAjaxAsync('shopStatistics/shopHomePageHotGoods',params).done(function(res){
			if(res.code==1){
				var good=res.data.goodsList;
				var sHtml='';
				for(var i=0;i<good.length;i++){
				 sHtml+="<span class='number'>"+(i+1)+"</span>"
					+"<span class='name'>"+good[i].name+"</span>"
					+"<span class='amount'>￥"+good[i].price+"</span>"
				}
				if(good.length==0){
					$('#bestProduct').append("<div class='noData'>暂无</div>");
				}else{
					$('#bestProduct').append("<div>"+sHtml+"<span class='number consumeNum'><img src='images/xiaohao.png'/></span>"
					+"<span class='name todayConsume'>今日消耗额</span>"
					+"<span class='amount todayConsumeNum'>￥"+res.data.consumePrice+"</span>"
					+"</div>");
				}
			}else{
				console.log(res.msg);
				$('#bestProduct').append("<div class='noData'>暂无</div>");
			}
		})
		
		//贡献最大的客户
		reqAjaxAsync('shopStatistics/shopHomePageMaxAccountContribute',params).done(function(res){
			if(res.code==1){
				var cums=res.data.accountList;
				var sHtml='';
				for(var i=0;i<cums.length;i++){
					sHtml+="<div><span class='number'>"+(i+1)+"</span>"
					+"<span class='name'>"+cums[i].accountName+"</span>"
					+"<span class='amount'>￥"+cums[i].price+"</span></div>"
				}
				if(cums.length==0){
					$('#bestCumstomer').append("<div class='noData'>暂无</div>");
				}else{
					$('#bestCumstomer').append(sHtml);
				}
			}else{
				console.log(res.msg);
				$('#bestCumstomer').append("<div class='noData'>暂无</div>");
			}
		})
		
		//贡献最大的员工
		reqAjaxAsync('shopStatistics/shopHomePageMaxEmployeeContribute',params).done(function(res){
			if(res.code==1){
				var emp=res.data.employeeList;
				var sHtml='';
				for(var i=0;i<emp.length;i++){
					sHtml+="<div><span class='number'>"+(i+1)+"</span>"
					+"<span class='name'>"+emp[i].salesman+"</span>"
					+"<span class='amount'>￥"+emp[i].price+"</span></div>"
				}
				if(emp.length==0){
					$('#bestEmployer').append("<div class='noData'>暂无</div>");
				}else{
					$('#bestEmployer').append(sHtml);
				}
			}else{
				console.log(res.msg);
				$('#bestEmployer').append("<div class='noData'>暂无</div>");
			}
		})
		
		//门店赠送
		reqAjaxAsync('shopStatistics/shopLargessTopThree',params).done(function(res){
			if(res.code==1){
				var gifts=res.data;
				var sHtml='';
				for(var i=0;i<gifts.length;i++){
					sHtml+="<div><span class='number'>"+(i+1)+"</span>"
					+"<span class='name'>"+gifts[i].goodsName+"</span>"
					+"<span class='amount'>"+gifts[i].num+"次</span></div>"
				}
				if(gifts.length==0){
					$('#storeGift').append("<div class='noData'>暂无</div>");
				}else{
					$('#storeGift').append(sHtml);
				}
			}else{
				console.log(res.msg);
				$('#storeGift').append("<div class='noData'>暂无</div>");
			}
		})
	}
})
