	// 优惠券汇总
	$(function() {
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
					request.setRequestHeader("apikey", sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey'));
				}
	        },
			responseHandler : function(res) {
				if(res.code == 1){
	                res.total = res.data.total;
	                res.rows = res.data.list;
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
					field : 'merchantName',
					title : '账户名称',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+data.merchantId+')">'+res+'</button>';
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
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+data.merchantId+')">'+res+'</button>';
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
						if (res == "1") {
							return "合作商户";
						} else if(res == "2") {
							return "代理商户";
						} else if(res == "3") {
							return "合作商户续费";
						} else if(res == "4") {
							return "代理商户续费";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'payerName',
					title : '缴费人',
					align : "center"
				},
				{
					field : 'payerNo',
					title : '缴费账户',
					align : "center"
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
					field : 'referenceUserName',
					title : '办理人员',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(0,'+data.referenceUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'applyTime',
					title : '申请时间',
					align : "center"
				},
				{field: 'id',title:'操作',width: 10,align : "center",
	                formatter: function(res,data){
	                	return '<button onclick="edit('+res+')" type="button" class="btn btn-info btn-sm edit" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;"">审核</button>';
	                }
	            }
			]
		});
	};

	// 获取参数
	table.param = function(params) {
		// JSON.stringify(jsonobj)
		if($("#name").val() == '%'){
	        layer.msg("请不要输入特殊字符!");
	        return;
		}
		var data = {
			status : "0",
			commissionStatus : null,
			onOffLine : "2",
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val(),
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
			status : "0",
			commissionStatus : null,
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
		var upgradeType = "";
		if(data.upgradeType == "1"){
			upgradeType = "合作商户";
		} else if (data.upgradeType == "2"){
			upgradeType = "代理商户";
		} else if (data.upgradeType == "3"){
			upgradeType = "合作商户续费";
		} else if (data.upgradeType == "4"){
			upgradeType = "代理商户续费";
		}
		var upgradeAmount = data.upgradeAmount;
		var payerNo = data.payerNo;
		var payerName = data.payerName;
		var upgradeRealAmount = data.upgradeRealAmount;
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
		var referenceTaxation = data.referenceTaxation;
		var copartnerUserId = data.copartnerUserId;
		var copartnerUserName = data.copartnerUserName;
		var copartnerStrategyName = data.copartnerStrategyName;
		var copartnerStrategy = data.copartnerStrategy * 100 + '%';
		var copartnerAmount = data.copartnerAmount;
		var copartnerTaxation = data.copartnerTaxation;
		var remark = data.remark;
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
			referenceUserId : referenceUserId,
			referenceUserName : referenceUserName,
			referenceMerchantLevel : referenceMerchantLevel,
			referenceStrategyName : referenceStrategyName,
			referenceStrategy : referenceStrategy,
			referenceAmount : referenceAmount,
			referenceTaxation : referenceTaxation,
			copartnerUserId : copartnerUserId,
			copartnerUserName : copartnerUserName,
			copartnerStrategyName : copartnerStrategyName,
			copartnerStrategy : copartnerStrategy,
			copartnerAmount : copartnerAmount,
			copartnerTaxation : copartnerTaxation,
			remark :remark,
			orgName : merchantOrgName
		};
		// 加载模板
		html = template('offLineAuditTpl',data);
		// 打开弹窗	
		layer.open({
			type : 1,
			title : '线下升级审核',
			area : [ '800px', '650px' ],
			btn : [ '提交','取消'],
			bthAlign : 'c',
			content : html,
			// 弹窗加载成功的时候
			success : function() {
				$('.layui-layer-btn1').attr('id','btn2');
				// 修改按钮样式
				$('.layui-layer-btn1').attr('class','layui-layer-btn0');
			},
			btn1 : function(index) {
				var upgradeRealAmount = $("#upgradeRealAmount").val();
				var auditName = $("#auditName").val();
				
				var status = $("input[name='audit']:checked").val();
				var remark = $("#remark").val();
				var size = remark.length;
				var max = 100;
				
				if(status == "" || status == undefined){
					layer.msg("请选择审核意见！");
				} else if(upgradeRealAmount == ""){
					layer.msg("请输入到账金额！");
				} else if(auditName == ""){
					layer.msg("请输入查账人！");
				} else if(status == 2 && remark == ""){
					layer.msg("不通过时，请输入原因！");
				} else if(size > max){
					layer.msg("备注字数超出最大限制");
				} else {
					audit(id, upgradeRealAmount, auditName, status, remark);
					layer.close(index);
				}
			},
			btn2 : function(index) {
				layer.close(index);
			}
		});
	}
	

	function audit(id,upgradeRealAmount,auditName,status,remark){
		// 运营平台审核人员信息
		var upgradeAuditUserId = sessionStorage.getItem("userId");
		var upgradeAuditUserName = sessionStorage.getItem("username");
		
		var data = {
			id : id,
			upgradeRealAmount : upgradeRealAmount,
			auditName:auditName,
			status : status,
			remark : remark,
			upgradeAuditUserId : upgradeAuditUserId,
			upgradeAuditUserName : upgradeAuditUserName
		};
		
		var result = reqAjax('merchantUpgrade/auditMerchantUpgrade', JSON.stringify(data));
		if(result.code != 1){
			layer.msg(result.msg);
		} else {
			layer.msg(result.msg);
			
			$('#table').bootstrapTable('destroy');
			table.init();
			accountDynamicColumn.initCookie();
		}
		
		
	}
	
	
	
	function changeReferenceMoney(e){
		var referenceAmount = $("#referenceAmount").val();
		var realMoney = parseFloat($(e).val());
		var referenceAmount = realMoney * 0.3;
		referenceAmount = Math.round(parseFloat(referenceAmount) * 100)/100;
		$("#referenceAmount").val(referenceAmount);
	}
	
	
	function upgradeRealAmountKeyup(e){
		e.value = e.value.replace(/[^\d.]/g,"");//清除"数字"和"."以外的字符
		e.value = e.value.replace(/^\./g,"");//验证第一个字符是数字而不是
		e.value = e.value.replace(/\.{2,}/g,".");//只保留第一个. 清除多余的
		e.value = e.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
		e.value = e.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入三个小数.(\d\d\d) 修改个数  加\d
	}
	
	
	
	
