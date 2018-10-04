var LevelTypeList
	$(function() {
		

		//获取跳转前页面传参
		var startTime = getRequestAddressUrlParameter("startTime");
		var endTime = getRequestAddressUrlParameter("endTime");
		
		  // 设置本月起止日期
	    $('#qBeginTime').val(startTime);
	    $('#qEndTime').val(endTime);
		table.init();
		// layer配置
		layer.config({
			extend : 'myskin/style.css', // 加载您的扩展样式
			skin : 'layer-ext-myskin'
		});
	});
	
	
	
	var table = new Object();
	table.init = function() {
		$('#table').bootstrapTable({
			url : '/zxcity_restful/ws/rest',
			method : 'POST', // 请求方式（*）
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			search : true, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端
			strictSearch : true,
			showColumns : true, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			searchOnEnterKey : true,
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			sortName : "createTime", // 排序的字段
			sortOrder : "desc", // 排序方式
			contentType : "application/x-www-form-urlencoded",// 解决POST，后台取不到参数
			queryParams : table.param,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			pageList: [10],    //可供选择的每页的行数（*）
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			showPaginationSwitch : true,
			ajaxOptions:{
	    		beforeSend: function(request){
					request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
				}
	        },
			responseHandler : function(res) {
				if(res.code == 1){
	                res.total = res.data.total;
	                res.rows = res.data.list;
	                LevelTypeList = res.data.LevelTypeList;
	                return res;
	            } else {
	            	layer.msg(res.msg);
	            }
			},
			columns : [
				{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter : function(value, row, index) {
						return index + 1;
					}
				},
				{
					field : 'serialNo',
					title : '流水号',
					align : "center"
				},
				{
					field : 'legalPersonName',
					title : '法人姓名',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.merchantId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'merchantOrgName',
					title : '商户名称',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.merchantId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'rolesStr',
					title : '平台角色',
					align : "center",
					width : 200
				},
				{field: 'id',title:'商户升级详情',width: 10,align : "center",
	                formatter: function(res,data){
	                	return '<button onclick="edit('+res+')" type="button" class="btn btn-info btn-sm edit" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;"">查看</button>';
	                }
	            },
	            {
					field : 'upgradeType',
					title : '升级类型',
					align : "center",
					formatter : function(res,data) {
						var n = parseInt(res);
						var levelName;
						$.each(LevelTypeList,function(i,item){
							if(item.id == 2 && res == "1"){
								levelName = item.levelName
							}else if(item.id == n){
								levelName = item.levelName
							}else if(res == "2"){
								levelName = "合作商户续费"
							}
						});
						return levelName;
					}
				},
				{
					field : 'upgradeRealAmount',
					title : '缴费金额',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";
						}
					}
				},
				{
					field : 'shareUserName',
					title : '分享人名称',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.shareUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'shareUserLevelName',
					title : '分享人商户等级',
					align : "center",
					formatter : function(res,data) {
						if (data.shareUserId>0) {
							return ''+data.shareUserLevelName;
						} else {
							return "-";
						}
					}
				},
				{
					field : 'shareRealAmount',
					title : '分享人佣金',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return "-";
						}
					}
				},
				{
					field : 'upgradeAutitTime',
					title : '审核时间',
					align : "center"
				},
				{field: 'id',title:'结算',width: 10,align : "center",
	                formatter: function(res,data){
	                	if (data.shareCommissionStatus == 0) {
							return '<button onclick="commission('+res+')" type="button" class="btn btn-info btn-sm edit" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;"">结算</button>';
						} else if(data.shareCommissionStatus == 1){
							return '<span style="color: gray">已结算</span>';
						} 
	                }
	           }
			]
		});
	};

	// 获取参数
	table.param = function(params) {
		if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
		}
		var data = {
			onOffLine : "2",
			shareCommissionStatusAll: "yes",
			commissionStatus : "1",
			shareUserIs : "no", 
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val(),
			shareUserName: $("#shareUserName").val(),
			upgradeAutitTimeStart: $('#qBeginTime').val(),
			upgradeAutitTimeEnd: $('#qEndTime').val(),
			pageNo : params.offset / params.limit + 1,
			pageSize : params.limit
		};
		var res = {
			cmd : "merchantUpgrade/selMerchantUpgradePageList",
			version : "1",
			data : JSON.stringify(data)
		};
		return res;
	};
	
	
	// 搜索
	$("#searchbtn").click(function() {
		$('#table').bootstrapTable('destroy');
		table.init();
		accountDynamicColumn.initCookie();
	});
	

	//导出
	$("#excelbtn").click(function() {
	    if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
	    }
		var btn = $("#excelbtn");
		// 改变按钮状态
		btn.attr("disabled", "disabled");
		var data = {
			status : $("#status option:selected").val() ? $("#status option:selected").val() : null,
			commissionStatus : "-1",
			onOffLine : "2",
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val()
		};
		try {
			var excelUrl = reqAjax('payExcel/exportMerchantUpgrade', JSON.stringify(data));
			if (excelUrl.code != 1) {
				layer.msg(excelUrl.msg);
			} else if(excelUrl.data) {
				// 跳转到下载链接
				window.location.href = excelUrl.data;
			}
		} catch (e) {
			layer.msg("异常：" + e);
		} finally {
			// 恢复按钮状态
			btn.removeAttr("disabled");
		}
	});



	//商户升级详情
	edit = function(id) {
		var html;
		
		var data = $('#table').bootstrapTable('getRowByUniqueId', id);
		
		var serialNo = data.serialNo;
		var merchantName = data.merchantName;
		var upgradeTypeNum = data.upgradeType;
		var n = parseInt(upgradeTypeNum);
		var upgradeType = "";
		$.each(LevelTypeList,function(i,item){
			if(item.id == 2 && n == 1){
				upgradeType = item.levelName
			}else if(item.id == n){
				upgradeType = item.levelName
			}else if(res == "2"){
				upgradeType = "合作商户续费"
			}
		});
		var upgradeAmount = data.upgradeAmount;
		var payerName = data.payerName;
		var upgradeRealAmount = data.upgradeRealAmount;
		var payerNo = data.payerNo;
		var auditName = data.auditName;
		var status = "";
		if(data.status == "0"){
			status = "申请";
		} else if (data.status == "1"){
			status = "商户升级审核通过";
		} else if (data.status == "2"){
			status = "商户升级审核不通过";
		} else if (data.status == "3"){
			status = "商户升级完成";
		}
		var moneyRemark = data.moneyRemark;
		var remark = data.remark;
		var upgradeAutitTime = data.upgradeAutitTime;
		var merchantOrgName = data.merchantOrgName;
		
		var data = {
			id : id,
			serialNo : serialNo,
			merchantName : merchantName,
			upgradeType : upgradeType,
			upgradeAmount : upgradeAmount,
			payerName : payerName,
			upgradeRealAmount : upgradeRealAmount,
			payerNo : payerNo,
			auditName : auditName,
			moneyRemark : moneyRemark,
			remark : remark,
			state : status,
			upgradeAutitTime : upgradeAutitTime,
			orgName : merchantOrgName
		};
		// 加载模板
		html = template('offLineStaffListTpl',data);
		// 打开弹窗	
		layer.open({
			type : 1,
			title : '商户升级详情',
			area : [ '800px', '650px' ],
			btn : ['取消'],
			bthAlign : 'c',
			content : html,
			// 弹窗加载成功的时候
			success : function() {
				$('.layui-layer-btn1').attr('id','btn1');
				// 修改按钮样式
				$('.layui-layer-btn1').attr('class','layui-layer-btn0');
			},
			btn1 : function(index) {
				layer.close(index);
			}
		});
	}

	//结算内容
	commission = function(id) {
		var html;
		
		var data = $('#table').bootstrapTable('getRowByUniqueId', id);
		
		var shareUserName= data.shareUserName;
		
		// 加载模板
		html = template('offLineStaffSettlement',data);
		layer.open({
			type : 1,
			title : '分享人佣金结算',
			area : [ '300px', '150px' ],
			btn : ['结算','取消'],
			bthAlign : 'c',
			content : html,
			// 弹窗加载成功的时候
			success : function() {
				$('.layui-layer-btn1').attr('id','btn1');
				// 修改按钮样式
				$('.layui-layer-btn1').attr('class','layui-layer-btn0');
				
				$("#msg").text("是否结算"+shareUserName+"的佣金？");
			},
			btn1 : function(index) {
				audit(id);
				layer.close(index);
			},
			btn2 : function(index) {
				layer.close(index);
			}
		});
	}
	
	// 结算提交
	function audit(id){
		// 运营平台审核人员信息
		var shareCommissionUserId = yyCache.get("userId");
		var shareCommissionUserName = yyCache.get("pcNickname");
		
		var data = {
			id : id,
			shareCommissionUserId : shareCommissionUserId,
			shareCommissionUserName : shareCommissionUserName
		};
		// ajax请求结算
		var result = reqAjax('merchantUpgrade/auditShare', JSON.stringify(data));
		// 返回结果
		if(result.code != 1){
			layer.msg(result.msg);
		} else {
			layer.msg(result.msg);
			$('#table').bootstrapTable('destroy');
			table.init();
			accountDynamicColumn.initCookie();
		}
		
		
	}


