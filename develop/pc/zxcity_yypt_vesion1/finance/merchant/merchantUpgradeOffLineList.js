var LevelTypeList;
var upgradeType;
var sourceList;
var source;
var moneyModet
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
	                sourceList = res.data.sourceList;
	                payMentList = res.data.payMentList;
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
					field : 'rolesStr',
					title : '平台角色',
					width : 160,
					align : "center"
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
					field : 'merchantPhone',
					title : '手机号',
					align : "center",
				},
				{
					field : 'sourceName',
					title : '工单来源',
					align : "center",
				},
				
				{
					field : 'upgradeAmount',
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
					field : 'upgradeRealAmount',
					title : '实缴金额',
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
					field : 'moneyModeName',
					title : '打款方式',
					align : "center"
				},
				{
					field : 'moneyRemark',
					title : '打款备注',
					width : 160,
					align : "center"
				},
				{
					field : 'shareUserName',
					title : '分享人',
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
					field : 'referenceUserName',
					title : '推荐员工',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.referenceUserId+')">'+res+'</button>';
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
				{
					field : 'status',
					title : '审核状态',
					align : "center",
					formatter : function(res) {
						if (res == "0") {
							return '<span style="color: green">申请</span>';
						} else if(res == "1"){
							return '<span style="color: blue">商户升级审核通过</span>';
						} else if(res == "2"){
							return '<span style="color: red">商户升级审核不通过</span>';
						} else if(res == "3"){
							return '<span style="color: gray">商户升级完成</span>';
						} else{
							return "-";
						}
					}
				},
				{field: 'id',title:'操作',width: 10,align : "center",
	                formatter: function(res,data){
	                	return '<button onclick="edit('+res+')" type="button" class="btn btn-info btn-sm edit" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;"">查看</button>';
	                }
	            }
			],
			onLoadSuccess: function (data) {
				levelTypeList = data.data.LevelTypeList;
				var shtml ="";
				shtml += '<option value="" selected> -- 全部 -- </option>';
				$.each(levelTypeList,function(i,item){
					var levelName;
					var levelId;
					if(item.id == 1 ){
						levelName = "合作商户"
						levelId = item.id;
					}else if(item.id >2){
						levelName = item.levelName
						levelId = item.id;
					}else{
						levelName = "合作商户续费"
						levelId = 2;
					}
					shtml += '<option value="'+ levelId +'" >'+ levelName+'</option>';
				})
				$("#upgradeType").html(shtml);
				$("#upgradeType").val(upgradeType).prop("checked","true");
				
				var sourceHtml = "";
				sourceHtml += '<option value="" selected> -- 全部 -- </option>';
				$.each(sourceList,function(i,item){
					sourceHtml += '<option value="'+ item.id +'" >'+ item.name+'</option>';
				})
				
				$("#sourceList").html(sourceHtml);
				$("#sourceList").val(source).prop("checked","true");
				
				var payMentHtml ="";
				payMentHtml += '<option value="" selected> -- 全部 -- </option>';
				$.each(payMentList,function(i,item){
					payMentHtml += '<option value="'+ item.id +'" >'+ item.paymentName+'</option>';
				})
				$("#moneyModet").html(payMentHtml);
				$("#moneyModet").val(moneyModet).prop("checked","true");
	        }
		});
	};

	// 获取参数
	table.param = function(params) {
		// JSON.stringify(jsonobj)
		if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
		}
		
		var startTime=$('#qBeginTime').val();
        var endTime=$('#qEndTime').val();
        
		var data = {
			status : $("#status option:selected").val() ? $("#status option:selected").val() : null,
			commissionStatus : $("#commissionStatus option:selected").val() ? $("#commissionStatus option:selected").val() : null,
			onOffLine : "2",
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val(),
			likeName: $("#likeName").val(),
			shareUserName: $("#shareName").val(),
			referenceUserName: $("#refUserName").val(),
			upgradeType: $("#upgradeType").val(),
			source: $("#sourceList").val(),
			moneyMode: $("#moneyModet").val(),
			upgradeAutitTimeStart: startTime,
			upgradeAutitTimeEnd: endTime,
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
		upgradeType = $("#upgradeType").val();
		source = $("#sourceList").val();
		moneyModet = $("#moneyModet").val();
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
			commissionStatus : $("#commissionStatus option:selected").val() ? $("#commissionStatus option:selected").val() : null,
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



	//填写审核内容
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
		var referenceUserId = data.referenceUserId;
		var referenceUserName = data.referenceUserName;
		var referenceMerchantLevel = "";
		if(data.referenceMerchantLevel == "1"){
			referenceMerchantLevel = "个人";
		} else if (data.referenceMerchantLevel == "2"){
			referenceMerchantLevel = "普通商户";
		} else if (data.referenceMerchantLevel == "3"){
			referenceMerchantLevel = "合作商户";
		} else if (data.referenceMerchantLevel == "4"){
			referenceMerchantLevel = "代理商户";
		} else if (data.referenceMerchantLevel == "5"){
			referenceMerchantLevel = "合伙人";
		} else if (data.referenceMerchantLevel == "6"){
			referenceMerchantLevel = "内部员工";
		}
		var referenceStrategyName = data.referenceStrategyName;
		var referenceStrategy = data.referenceStrategy * 100 + '%';
		var referenceAmount = data.referenceAmount;
		var referenceRealAmount = data.referenceRealAmount;
		var referenceTaxation = data.referenceTaxation;
		var copartnerUserId = data.copartnerUserId;
		var copartnerUserName = data.copartnerUserName;
		var copartnerStrategyName = data.copartnerStrategyName;
		var copartnerStrategy = data.copartnerStrategy * 100 + '%';
		var copartnerAmount = data.copartnerAmount;
		var copartnerTaxation = data.copartnerTaxation;
		var remark = data.remark;
		var merchantOrgName = data.merchantOrgName;
		var shareUserName = data.shareUserName;
		var shareUserLevel = data.shareUserLevel;
		var moneyRemark = data.moneyRemark;
		var shareUserId = data.shareUserId;
		var shareUserLevelName;
		var shareLevel = data.shareLevel;
		if(data.shareUserLevel != -2 && data.shareUserName != null){
			 shareUserLevelName = data.shareUserLevelName;
		}else{
			shareUserLevelName = "无分享人"
		}
		var shareAmount = data.shareAmount;
		
		if(data.shareUserLevel != -2 && data.shareUserName != null && shareUserName !=""){
			var datas = {
					id : data.shareUserId
				}
			var count = reqAjax('merchantUpgrade/selectShareUserCurrentLevelGivingCount', JSON.stringify(datas));
		
			if(shareLevel == "3"){
				count = "<"+count.data+"/40>"
			} else if (shareLevel == "4"){
				count = "<"+count.data+"/100>"
			} else if (shareLevel== "5"){
				count = "<"+count.data+"/200>"
			} else if (shareLevel == "6"){
				count = "<"+count.data+"/200>"
			} else if (shareLevel == "7"){
				count = "<"+count.data+"/200>"
			} else if (shareLevel == "2"){
				count = "无赠送"
			} else if (shareLevel == "1"){
				count = "无赠送"
			}else{
				count = "未知等级,无法赠送"
			}
		}else{
			shareUserLevelName = "无分享人"
			count = "无赠送"
		}
		var shareAmount = data.shareAmount;
		var moneyMode = data.moneyMode;
		var moneyModeName = data.moneyModeName;
		var payeeType = data.payeeType;
		if(payeeType == "0" ){
			payeeType = "未收款";
		} else if(payeeType == "1"){
			payeeType = "公司收款";
		} else if(payeeType == "2"){
			payeeType = "荆州收款";
		} else {
			payeeType = "-";
		}
		
		
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
			referenceUserId : referenceUserId,
			referenceUserName : referenceUserName,
			referenceMerchantLevel : referenceMerchantLevel,
			referenceStrategyName : referenceStrategyName,
			referenceStrategy : referenceStrategy,
			referenceAmount : referenceAmount,
			referenceRealAmount : referenceRealAmount,
			referenceTaxation : referenceTaxation,
			copartnerUserId : copartnerUserId,
			copartnerUserName : copartnerUserName,
			copartnerStrategyName : copartnerStrategyName,
			copartnerStrategy : copartnerStrategy,
			copartnerAmount : copartnerAmount,
			copartnerTaxation : copartnerTaxation,
			remark : remark,
			state : status,
			orgName : merchantOrgName,
			shareUserName : shareUserName,
			shareUserLevel : shareUserLevel,
			shareAmount : shareAmount,
			shareUserId : shareUserId,
			shareLevel : shareLevel,
			count : count,
			moneyRemark : moneyRemark,
			shareUserLevelName: shareUserLevelName,
			moneyMode : moneyMode,
			moneyModeName : moneyModeName,
			payeeType : payeeType
		};
		// 加载模板
		html = template('offLineListTpl',data);
		// 打开弹窗	
		layer.open({
			type : 1,
			title : '线下审核详情',
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
	
	// 查看分享人赠送情况
	function selectShareGivingDetail(id,level){
		if(id == 0){
			id = "-1";
		}
		layer.open({
	  	      type: 2,
	  	      title: ['分享赠送详情', 'background:#303030;color:#fff;'],
	  	      skin: 'layer-ext-myskin',
	  	      area: ['1650px', '800px'],
	  	      shade: 0.5,
	  	      closeBtn: 1,
	  	      shadeClose: false,
	  	      scrollbar: false,
	  	      content: 'shareGivingDetail.html?id='+id+"&level="+level,
	  	      success: function (layero, index) {
	  	      }
	  	    })
	}
	
