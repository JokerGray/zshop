var apikey = sessionStorage.getItem('apikey') || "test"; 
layui.use('laydate', function(){             
	var laydate = layui.laydate;
	
	//日期控件
	laydate.render({
		elem: '#startDate',
		done: function(value) {
			$('.startDate').eq(0).attr('data-date', value)
		}
	});
	laydate.render({
		elem: '#endDate',
		done: function(value) {
			$('.endDate').eq(0).attr('data-date', value)
		}
	});
	
	//获取当前月起止日期
	var date=new Date();
	var monthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	//格式化日期
	var startTime = formatDate(monthFirstDay.getTime()/1000);
	var endTime = formatDate(date.getTime()/1000);
	//初始化日期控件
	$('#startDate').val(startTime);
	$('#endDate').val(endTime);
	
	selectUpgradeComplete(startTime, endTime);
	selectUpgradeApplication(startTime, endTime);
	selectUpgradeApplication2(startTime, endTime);

})

// 公司盈利对象
function companyProfitsObj(copartnerMoney,copartnerNumber,cooperationMerchantMoney,cooperationMerchantNumber,agencyMerchantMoney,agencyMerchantNumber){
	var companyProfits = {
			copartnerMoney:copartnerMoney,											// 合伙人金额
			copartnerNumber:copartnerNumber,										// 合伙人数量
			cooperationMerchantMoney:cooperationMerchantMoney,	// 合作商户金额
			cooperationMerchantNumber:cooperationMerchantNumber,// 合作商户数量
			agencyMerchantMoney:agencyMerchantMoney,				   // 代理商户金额
			agencyMerchantNumber:agencyMerchantNumber					 // 代理商户数量
	}
	return companyProfits;
}

// 劳务费对象
function laborCostsObj(copartner,copartnerNumber,cooperationMerchant,cooperationMerchantNumber,agencyMerchan,
	agencyMerchanNumber,platformUser,platformUserNumber,ordinaryMerchan,ordinaryMerchanNumber) {
		var laborCosts = {
				copartner:copartner,																		// 合伙人
				copartnerNumber:copartnerNumber,												// 合伙人数量
				cooperationMerchant:cooperationMerchant,								// 合作商户
				cooperationMerchantNumber:cooperationMerchantNumber,		// 合作商户数量
				agencyMerchan:agencyMerchan,														// 代理商户：
				agencyMerchanNumber:agencyMerchanNumber,								// 代理商户数量
				platformUser:platformUser,															// 平台用户：
				platformUserNumber:platformUserNumber,									// 平台用户数量
				ordinaryMerchan:ordinaryMerchan,												// 普通商户
				ordinaryMerchanNumber:ordinaryMerchanNumber							// 普通商户数量
		}
		return laborCosts;
}


function selectUpgradeComplete(startTimeVal, endTimeVal) {
		// 升级完成总个数
		var upgradeCompleteSumNumber = 0;
		// 商户缴纳金额合计
		// var sumUpgradeAmount = 0;
		// 到账金额合计
		var sumUpgradeRealAmount = 0;
		// 线上升级
		var onlineUpgradeNumber = 0;
		var onlineUpgradeAmount = 0;
		// 合伙人  合作商户  代理商户
		// var onlinePartner = 0;

		// 线下升级
		var offlineUpgradeNumber = 0;
		var offlineUpgradeAmount = 0;

		// 线上公司盈利对象
		var onlinecompanyProfitsObj = companyProfitsObj(0,0,0,0,0,0);
		// 线下公司盈利对象
		var offlinecompanyProfitsObj = companyProfitsObj(0,0,0,0,0,0);

		// 线上劳务费
		var onlineLaborCostsObj = laborCostsObj(0,0,0,0,0,0,0,0,0,0);

		// 线上员工提成
		var onlineStaffCommission = 0;
		var onlineStaffCommissionNumber = 0;
		// 线下员工提成
		var offlineStaffCommission = 0;
		var offlineStaffCommissionNumber = 0;

    var queryInfo ={
        startTime:startTimeVal,
        endTime:endTimeVal
    }
    var cmd = 'merchantUpgrade/selectUpgradeComplete';
    var data = JSON.stringify(queryInfo);
    $.ajax({
      type : "POST",
      url : "/zxcity_restful/ws/rest",
      dataType : "json",
      //async : false,
      data : {"cmd" : cmd,"data" : data,"version" : "1"},
      beforeSend : function(request) {
    	  request.setRequestHeader("apikey", apikey);
      },
      success : function(res) {
        if(res.code==1&&res.data.length>0){
            $.each(res.data,function(i,item){
              //判断 升级方式 onOffLine  1 线上升级/2 线下升级
              if(item.onOffLine==1){
					var referenceMerchantLevelVal = item.referenceMerchantLevel;
					if(referenceMerchantLevelVal!=6&&item.commissionStatus==1){
						upgradeCompleteSumNumber += item.countId;
						//sumUpgradeAmount += item.sumUpgradeAmount;
						sumUpgradeRealAmount += item.sumUpgradeRealAmount;
						// 线上升级
						onlineUpgradeNumber += item.countId;
						onlineUpgradeAmount += item.sumUpgradeRealAmount;
						// 公司盈利
						if(item.upgradeType==1||item.upgradeType==3){
							onlinecompanyProfitsObj.cooperationMerchantMoney += item.sumProfitAmount;
							onlinecompanyProfitsObj.cooperationMerchantNumber += item.countId;
						}else if (item.upgradeType==2||item.upgradeType==4) {
							onlinecompanyProfitsObj.agencyMerchantMoney += item.sumProfitAmount;
							onlinecompanyProfitsObj.agencyMerchantNumber += item.countId;
						}
						// reference_merchant_level  推荐人当时的商户等级 1 个人/2 普通商户/3 合作商户/4 代理商户/5 合伙人/6 内部员工'
						// var laborCosts = {
						// 		copartner:copartner,																		// 合伙人
						// 		copartnerNumber:copartnerNumber,												// 合伙人数量
						// 		cooperationMerchant:cooperationMerchant,								// 合作商户
						// 		cooperationMerchantNumber:cooperationMerchantNumber,		// 合作商户数量
						// 		agencyMerchan:agencyMerchan,														// 代理商户：
						// 		agencyMerchanNumber:agencyMerchanNumber,								// 代理商户数量
						// 		platformUser:platformUser,															// 平台用户：
						// 		platformUserNumber:platformUserNumber,									// 平台用户数量
						// 		ordinaryMerchan:ordinaryMerchan,												// 普通商户
						// 		ordinaryMerchanNumber:ordinaryMerchanNumber							// 普通商户数量
						// }
						if (referenceMerchantLevelVal==5) {
							// 合伙人
							onlineLaborCostsObj.copartner += item.sumReferenceAmount;
							onlineLaborCostsObj.copartnerNumber += item.countId;
						}else if (referenceMerchantLevelVal==3) {
							// 合作商户
							onlineLaborCostsObj.cooperationMerchant += item.sumReferenceAmount;
							onlineLaborCostsObj.cooperationMerchantNumber += item.countId;
						}else if (referenceMerchantLevelVal==4) {
							// 代理商户
							onlineLaborCostsObj.agencyMerchan += item.sumReferenceAmount;
							onlineLaborCostsObj.agencyMerchanNumber += item.countId;
						}else if(referenceMerchantLevelVal==1||referenceMerchantLevelVal==6){
							// 平台用户
							onlineLaborCostsObj.platformUser += item.sumReferenceAmount;
							onlineLaborCostsObj.platformUserNumber += item.countId;
						}else if (referenceMerchantLevelVal==2) {
							onlineLaborCostsObj.ordinaryMerchan += item.sumReferenceAmount;
							onlineLaborCostsObj.ordinaryMerchanNumber += item.countId;
						}
					}
					// 线上员工提成	reference_merchant_level  6 内部员工  取值 sumReferenceAmount 就是员工提成
					if(referenceMerchantLevelVal==6&&item.employeeCommissionStatus==1){
						upgradeCompleteSumNumber += item.countId;
						//sumUpgradeAmount += item.sumUpgradeAmount;
						sumUpgradeRealAmount += item.sumUpgradeRealAmount;
						// 线上升级
						onlineUpgradeNumber += item.countId;
						onlineUpgradeAmount += item.sumUpgradeRealAmount;
						// 公司盈利
						if(item.upgradeType==1||item.upgradeType==3){
							onlinecompanyProfitsObj.cooperationMerchantMoney += item.sumProfitAmount;
							onlinecompanyProfitsObj.cooperationMerchantNumber += item.countId;
						}else if (item.upgradeType==2||item.upgradeType==4) {
							onlinecompanyProfitsObj.agencyMerchantMoney += item.sumProfitAmount;
							onlinecompanyProfitsObj.agencyMerchantNumber += item.countId;
						}
						// 平台用户
						onlineLaborCostsObj.platformUser += item.sumReferenceAmount;
						onlineLaborCostsObj.platformUserNumber += item.countId;
		
						onlineStaffCommission += item.sumReferenceRealAmount;
						onlineStaffCommissionNumber += item.countId;
					}
              }else if (item.onOffLine==2){
					// 线下员工提成  取值 sumReferenceAmount 就是员工提成
					if(item.referenceMerchantLevel==6&&item.employeeCommissionStatus==1){
						upgradeCompleteSumNumber += item.countId;
						// sumUpgradeAmount += item.sumUpgradeAmount;
						sumUpgradeRealAmount += item.sumUpgradeRealAmount;

						// 线下升级	offline
						offlineUpgradeNumber += item.countId;
						offlineUpgradeAmount += item.sumUpgradeRealAmount;
						// 公司盈利
						if(item.upgradeType==1||item.upgradeType==3){
							offlinecompanyProfitsObj.cooperationMerchantMoney += item.sumProfitAmount;
							offlinecompanyProfitsObj.cooperationMerchantNumber += item.countId;
						}else if (item.upgradeType==2||item.upgradeType==4) {
							offlinecompanyProfitsObj.agencyMerchantMoney += item.sumProfitAmount;
							offlinecompanyProfitsObj.agencyMerchantNumber += item.countId;
						}
						offlineStaffCommission += item.sumReferenceRealAmount;
						offlineStaffCommissionNumber += item.countId;
					}
              }
          });
        }
      },
      error : function(res) {

      },
			complete(res){
				// 升级完成
				$("#upgradeCompleteSumNumber").text(upgradeCompleteSumNumber);
				// $("#sumUpgradeAmount").text(fmoney(sumUpgradeAmount, 2));
				$("#sumUpgradeRealAmount").text(fmoney(sumUpgradeRealAmount, 2));
				// 线上升级
				$("#onlineUpgradeNumber").text(onlineUpgradeNumber);
				$("#onlineUpgradeAmount").text(fmoney(onlineUpgradeAmount));
				// 线下升级
				$("#offlineUpgradeNumber").text(offlineUpgradeNumber);
				$("#offlineUpgradeAmount").text(fmoney(offlineUpgradeAmount));

				// 线上公司盈利对象
				$("#onlineCooperationMerchantMoney").text(fmoney(onlinecompanyProfitsObj.cooperationMerchantMoney));
				$("#onlineCooperationMerchantNumber").text(onlinecompanyProfitsObj.cooperationMerchantNumber);
				$("#onlineAgencyMerchantMoney").text(fmoney(onlinecompanyProfitsObj.agencyMerchantMoney));
				$("#onlineAgencyMerchantNumber").text(onlinecompanyProfitsObj.agencyMerchantNumber);
				// 线下公司盈利对象
				$("#offlineCooperationMerchantMoney").text(fmoney(offlinecompanyProfitsObj.cooperationMerchantMoney));
				$("#offlineCooperationMerchantNumber").text(offlinecompanyProfitsObj.cooperationMerchantNumber);
				$("#offlineAgencyMerchantMoney").text(fmoney(offlinecompanyProfitsObj.agencyMerchantMoney));
				$("#offlineAgencyMerchantNumber").text(offlinecompanyProfitsObj.agencyMerchantNumber);

				// 线上劳务费
				// var laborCosts = {
				// 		copartner:copartner,																		// 合伙人
				// 		copartnerNumber:copartnerNumber,												// 合伙人数量
				// 		cooperationMerchant:cooperationMerchant,								// 合作商户
				// 		cooperationMerchantNumber:cooperationMerchantNumber,		// 合作商户数量
				// 		agencyMerchan:agencyMerchan,														// 代理商户：
				// 		agencyMerchanNumber:agencyMerchanNumber,								// 代理商户数量
				// 		platformUser:platformUser,															// 平台用户：
				// 		platformUserNumber:platformUserNumber,									// 平台用户数量
				// 		ordinaryMerchan:ordinaryMerchan,												// 普通商户
				// 		ordinaryMerchanNumber:ordinaryMerchanNumber							// 普通商户数量
				// }

				$("#onlineCopartner").text(fmoney(onlineLaborCostsObj.copartner));
				$("#laborOnlineCopartnerNumber").text(onlineLaborCostsObj.copartnerNumber);
				$("#onlineCooperationMerchant").text(fmoney(onlineLaborCostsObj.cooperationMerchant));
				$("#laborOnlineCooperationMerchantNumber").text(onlineLaborCostsObj.cooperationMerchantNumber);
				$("#onlineAgencyMerchan").text(fmoney(onlineLaborCostsObj.agencyMerchan));
				$("#onlineAgencyMerchanNumber").text(onlineLaborCostsObj.agencyMerchanNumber);
				$("#onlinePlatformUser").text(fmoney(onlineLaborCostsObj.platformUser));
				$("#onlinePlatformUserNumber").text(onlineLaborCostsObj.platformUserNumber);
				$("#onlineOrdinaryMerchan").text(fmoney(onlineLaborCostsObj.ordinaryMerchan));
				$("#onlineOrdinaryMerchanNumber").text(onlineLaborCostsObj.ordinaryMerchanNumber);

				// 线上员工提成
				$("#onlineStaffCommission").text(fmoney(onlineStaffCommission));
				$("#onlineStaffCommissionNumber").text(onlineStaffCommissionNumber);
				// 线下员工提成
				$("#offlineStaffCommission").text(fmoney(offlineStaffCommission));
				$("#offlineStaffCommissionNumber").text(offlineStaffCommissionNumber);
			}
  });
}

// 商户升级 申请统计中
function selectUpgradeApplication(startTimeVal,endTimeVal) {
	var onlineUpgradeApplicationNumber = 0;
	var onlineUpgradeApplicationMoney = 0;
	var offlineUpgradeApplicationNumber = 0;
	var offlineUpgradeApplicationMoney = 0;
	var queryInfo ={
			startTime:startTimeVal,
			endTime:endTimeVal
	}
	var cmd = 'merchantUpgrade/selectUpgradeApplication';
	var data = JSON.stringify(queryInfo);
	$.ajax({
		type: "POST", url: "/zxcity_restful/ws/rest", dataType: "json",
		//async : false,
		data: {
			"cmd": cmd,
			"data": data,
			"version": "1"
		},
		beforeSend: function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success: function(res) {
			if(res.data.length>0&&res.code==1){
				$.each(res.data, function(i, item) {
          if (item.onOffLine == 1) {
						// 线上申请中
						 onlineUpgradeApplicationNumber += item.countId;
						 onlineUpgradeApplicationMoney += item.sumUpgradeRealAmount;
          } else if (item.onOffLine == 2) {
						// 线下申请中
						offlineUpgradeApplicationNumber += item.countId;
						offlineUpgradeApplicationMoney += item.sumUpgradeRealAmount;
          }
        })
			}
		},
		error: function(res) {

		},
		complete: function (res) {
			$("#onlineUpgradeApplicationNumber").text(onlineUpgradeApplicationNumber);
			$("#onlineUpgradeApplicationMoney").text(fmoney(onlineUpgradeApplicationMoney));
			// 线下申请中
			$("#offlineUpgradeApplicationNumber").text(offlineUpgradeApplicationNumber);
			$("#offlineUpgradeApplicationMoney").text(fmoney(offlineUpgradeApplicationMoney));
		}
	});
}

// 商户升级 统计 升级已完成  佣金未发放的
function selectUpgradeApplication2(startTimeVal,endTimeVal) {
	var onlineIsCommissionStatusNumber = 0;
	var onlineIsCommissionStatusMoney = 0;
	var offlineIsCommissionStatusNumber = 0;
	var offlineIsCommissionStatusMoney = 0;
	var queryInfo ={
			startTime:startTimeVal,
			endTime:endTimeVal,
			status:3
			// commissionStatus:0
	}
	var cmd = 'merchantUpgrade/selectUpgradeApplication';
	var data = JSON.stringify(queryInfo);
	$.ajax({
		type: "POST", url: "/zxcity_restful/ws/rest", dataType: "json",
		//async : false,
		data: {
			"cmd": cmd,
			"data": data,
			"version": "1"
		},
		beforeSend: function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success: function(res) {
			if(res.data.length>0&&res.code==1){
				$.each(res.data, function(i, item) {
					if(item.onOffLine==1){
						if(item.referenceMerchantLevel==6&&item.employeeCommissionStatus==0){
							onlineIsCommissionStatusNumber += item.countId;
							onlineIsCommissionStatusMoney += item.sumUpgradeRealAmount;
						}
						if(item.referenceMerchantLevel&&item.referenceMerchantLevel!=6&&item.commissionStatus==0){
							onlineIsCommissionStatusNumber += item.countId;
							onlineIsCommissionStatusMoney += item.sumUpgradeRealAmount;
						}
					}else if (item.onOffLine==2&&item.employeeCommissionStatus==0) {
						offlineIsCommissionStatusNumber += item.countId;
						offlineIsCommissionStatusMoney += item.sumUpgradeRealAmount;
					}
        })
			}
		},
		error: function(res) {

		},
		complete: function (res) {
			$("#onlineIsCommissionStatusNumber").text(onlineIsCommissionStatusNumber);
			$("#onlineIsCommissionStatusMoney").text(fmoney(onlineIsCommissionStatusMoney));
			$("#offlineIsCommissionStatusNumber").text(offlineIsCommissionStatusNumber);
			$("#offlineIsCommissionStatusMoney").text(fmoney(offlineIsCommissionStatusMoney));
		}
	});
}

// 商户升级完成 公司盈利合伙人统计
function selectPartnerStatistics(startTimeVal,endTimeVal) {
	var queryInfo ={
			startTime:startTimeVal,
			endTime:endTimeVal,
			status:3,
			code:'T1',
			commissionStatus:1
	}
	var cmd = 'merchantUpgrade/selectPartnerStatistics';
	var data = JSON.stringify(queryInfo);
	$.ajax({
		type: "POST", url: "/zxcity_restful/ws/rest", dataType: "json",
		//async : false,
		data: {
			"cmd": cmd,
			"data": data,
			"version": "1"
		},
		beforeSend: function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success: function(res) {
			if(res.data.length>0&&res.code==1){
				$.each(res.data, function(i, item) {
					if(item.onOffLine==1){
						$("#onlineCopartnerNumber").text(item.countId);
						$("#onlineCopartnerMoney").text(fmoney(item.sumUpgradeRealAmount));
					}else if (item.onOffLine==2) {
						$("#offlineCopartnerNumber").text(item.countId);
						$("#offlineCopartnerMoney").text(fmoney(item.sumUpgradeRealAmount));
					}
        })
			}else {
				$("#onlineCopartnerNumber").text(0);
				$("#onlineCopartnerMoney").text(fmoney(0));
				$("#offlineCopartnerNumber").text(0);
				$("#offlineCopartnerMoney").text(fmoney(0));
			}
		},
		error: function(res) {}
	});
}

//点击查询
$("#searchBtn").click(function(){
		var startTimes=$('#startDate').val();
		var endTimes=$('#endDate').val();
		selectUpgradeComplete(startTimes,endTimes);
		selectUpgradeApplication(startTimes,endTimes);
		selectUpgradeApplication2(startTimes,endTimes);
		// selectPartnerStatistics(startTimes,endTimes);
});

//升级完成 查看详情
function lookMerchantHomeDetails(type) {
	var name = "";
	var url = "";
	var onOffLine = "";
	if(type==1){
		 name = "商户升级完成详情";
	}else if (type==2) {
		 name = "商户升级完成线上详情";
		  onOffLine = "1";
	}else if (type==3) {
		 name = "商户升级完成线下详情";
		 onOffLine = "2";
	}
	if(name){
		url = "page/finance/mainMenu/merchant/merchantHomeDetails.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine;
		parent.addTabs(url, name);
 }
}

// 公司盈利
function lookProfitsDetails(onOffLine,upgradeType) {
	// onOffLine  1线上  2、线下     upgradeType  1 合作商户  2 代理商户
	var name = "";
	var url = "";
	var homeQueryType = "";
	if(onOffLine==1){
		if(upgradeType==1){
			name = "线上公司盈利合作商户";
		}else if (upgradeType==2) {
			name = "线上公司盈利代理商户";
		}
	}else if (onOffLine==2) {
		if(upgradeType==1){
			name = "线下公司盈利合作商户";
		}else if (upgradeType==2) {
			name = "线下公司盈利代理商户";
		}
	}
	if(upgradeType==1){
		homeQueryType = "1";
	}else if (upgradeType==2) {
		homeQueryType = "2";
	}
	if(name){
		url = "page/finance/mainMenu/merchant/merchantHomeProfitsDetails.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine+"&homeQueryType="+homeQueryType;
		parent.addTabs(url, name);
	}
}

// 推荐人劳务详情
function lookLaborDetails(onOffLine,merchantLevel) {
		var name = "";
		var url = "";
		// merchantLevel 推荐人等级 1 个人/2 普通商户/3 合作商户/4 代理商户/5 合伙人/6 内部员工',
		if(onOffLine==1){
			if(merchantLevel==1){
				name="线上个人劳务详情";
			}else if (merchantLevel==2) {
				name="线上普通商户劳务详情";
			}else if (merchantLevel==3) {
				name="线上合作商户劳务详情";
			}else if (merchantLevel==4) {
				name="线上代理商户劳务详情";
			}else if (merchantLevel==5) {
				name="线上合伙人劳务详情";
			}else if (merchantLevel==6) {
				name="线上内部员工劳务详情";
			}
		}else if (onOffLine==2) {

		}
		if(name){
			url = "page/finance/mainMenu/merchant/merchantHomeLaborDetails.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine+"&merchantLevel="+merchantLevel;
			parent.addTabs(url, name);
		}
}

// 员工提成
function lookStaffCommission(onOffLine,merchantLevel) {
	var name = "";
	var url = "";
	if(onOffLine==1){
		name = "线上员工提成";
	}else if (onOffLine==2) {
		name = "线下员工提成";
	}
	if(name){
		url = "page/finance/mainMenu/merchant/homeStaffCommissionDetails.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine+"&merchantLevel="+merchantLevel;
		parent.addTabs(url, name);
	}
}

// 申请记录查询 根据创建时间
function lookApplyFor(onOffLine) {
	var name = "";
	var url = "";
	if(onOffLine==1){
		name = "线上申请中";
	}else if (onOffLine==2) {
		name = "线下申请中";
	}
	if(onOffLine){
		url = "page/finance/mainMenu/merchant/merchantHomeApplyForList.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine;
		parent.addTabs(url, name);
	}
}

// 升级完成  佣金未发放
function lookCommissionDetails(onOffLine) {
	var name = "";
	var url = "";
	var commissionStatus = "";
	var employeeCommissionStatus = "";
	if(onOffLine==1){
		name = "线上佣金未发放";
		commissionStatus = "0";
	}else if (onOffLine==2) {
		name = "线下佣金未发放";
		employeeCommissionStatus = "0";
	}
	var status = "";
	if(onOffLine){
		url = "page/finance/mainMenu/merchant/homeCommissionDetails.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine+"&status=3"+"&commissionStatus="+commissionStatus+"&employeeCommissionStatus="+employeeCommissionStatus;
		parent.addTabs(url, name);
	}
}

// 升级完成  公司盈利 合伙人详情
function lookPartnerPageInfoList(onOffLine) {
	var name = "";
	var url = "";
	if(onOffLine==1){
		name = "线上公司盈利合伙人";
	}else if (onOffLine==2) {
		name = "线下公司盈利合伙人";
	}
	var status = "";
	var commissionStatus = "";
	if(onOffLine){
		url = "page/finance/mainMenu/merchant/homePartnerPageInfoList.html?startTime=" + $('#startDate').val() + "&endTime=" + $('#endDate').val() + "&onOffLine="+onOffLine+"&status=3"+"&commissionStatus=1"+"&code=T1";
		parent.addTabs(url, name);
	}
}