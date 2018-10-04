var dataList = "";
var init = "";
layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
		var form = layui.form,
			layer = layui.layer,
			$ = layui.jquery,
			laydate = layui.laydate,
			table = layui.table,
			laypage = layui.laypage;

		var userNo = sessionStorage.getItem("userno") || "";

		//接口
		var server = {
			dataList: 'merchantUpgrade/selMerchantUpgradePageList', //(查询列表)
			exportExcel: 'payExcel/exportMerchantUpgrade'//(下载地址)
		}
		
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
		
		//接收url传参, 初始化日期控件
		var startTime = getRequestAddressUrlParameter("startTime");
		var endTime = getRequestAddressUrlParameter("endTime");
		$("#startDate").val(startTime);
		$("#endDate").val(endTime);
		
		
		//搜索
		$('#searchBtn').on('click', function() {
			tableInit();
		})
		//重置
		$('#resetBtn').on('click', function() {
			location.reload()
		})
		
		//封装请求参数
		function getSearchParam(index, limit){
		    var parms = {
	    		status : null,
	    		commissionStatus : "0",
				onOffLine : "1",
				merchantOrgName: $("#merchantOrgName").val(),
				serialNo: $("#serialNo").val(),
				applyTimeStart: $("#startDate").val(),
				applyTimeEnd: $("#endDate").val(),
				pageNo : index,
				pageSize : limit
		    }
		    
		    return JSON.stringify(parms);
		}
		
		//导出excel
		$('#exportBtn').on('click', function(){
				var parms = getSearchParam();
				downloadFile(server.exportExcel, parms);
		})
		
		//layer展开
		$('body').on('click', '.layui-layer .layui-layer-content .package-some', function() {
			if($(this).children('i.description').html() == '展开') {
				$(this).children('i.description').html('收起')
				$(this).children('i.icon').addClass('deg');
				$(this).parent().siblings('.app-layer-content').children('ul').hide();
				$(this).parent().siblings('.app-layer-content').children('.layer-place').show();
			} else {
				$(this).children('i.description').html('展开')
				$(this).children('i.icon').removeClass('deg');
				$(this).parent().siblings('.app-layer-content').children('ul').show();
				$(this).parent().siblings('.app-layer-content').children('.layer-place').hide();
			}
		})
		$('body').on('click', '.layui-layer .layui-layer-content .layer-place', function() {
			$(this).hide();
			$(this).siblings('ul').show();
			$(this).parent().siblings().children('.package-some').children('.description').html('展开');
			$(this).parent().siblings().children('.package-some').children('.icon').removeClass('deg');
		})
		
		
		//pageCallback
		function pageCallback(index, limit, callback) {
			var parms = getSearchParam(index, limit);
			reqAjaxAsync(server.dataList, parms).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				
				dataList = res.data.list;
				var data = res.data.list;
				$.each(data, function(i, item) {
					$(item).attr('eq', (i + 1));
					
				});
				return callback(res);
			})
		}

		//当前表格渲染
		function tableInit() {  
			var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'center',
						width: 70,
						field: 'eq'
					}, {
						title: '流水号',
						align: 'center',
						field: 'serialNo'
					}, {
						title: '账户名称',
						align: 'center',
						field: 'merchantName',
						templet: function(d){
							if (d.merchantName) {
								return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+d.merchantId+')">'+d.merchantName+'</button>';
							} else {
								return "-";
							}
						}
					}, {
						title: '商户名称',
						align: 'center',
						field: 'merchantOrgName',
						templet: function(d){
							if (d.merchantOrgName) {
								return '<button type="button" class="btn btn-xs btn-link" onclick="openInfoView(1,'+d.merchantId+')">'+d.merchantOrgName+'</button>';
							} else {
								return "-";
							}
						}
					}, {
						title: '升级详情',
						align: 'center',
						field: 'id',
						templet: function(d){
							return '<button onclick="upgradeDetail('+d.LAY_INDEX+')" type="button" class="layui-btn layui-btn-normal layui-btn-sm" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;">查看</button>';
						}
					}, {
						title: '合伙人',
						align: 'center',
						field: 'copartnerUserId',
						templet: function(d){
							if (d.copartnerUserId == -1) {
								return "无";
							} else {
								return d.copartnerUserName;
							}
						}
					}, {
						title: '推荐人商户等级',
						align: 'center',
						field: 'referenceMerchantLevel',
						templet: function(d){
							if (d.referenceMerchantLevel == "1") {
								return '个人';
							} else if(d.referenceMerchantLevel == "2"){
								return '普通商户';
							} else if(d.referenceMerchantLevel == "3"){
								return '合作商户';
							} else if(d.referenceMerchantLevel == "4"){
								return '代理商户';
							} else if(d.referenceMerchantLevel == "5"){
								return '合伙人';
							} else if(d.referenceMerchantLevel == "6"){
								return '内部员工';
							} else{
								return "-";
							}
						}
					}, {
						title: '税前劳务费',
						align: 'center',
						field: 'referenceRealAmount',
						templet: function(d){
							if (d.referenceRealAmount) {
								return fmoney(d.referenceRealAmount, 2);
							} else {
								return "-";
							}
						}
					}, {
						title: '扣税金额',
						align: 'center',
						field: 'referenceTaxation',
						templet: function(d){
							if (d.referenceTaxation) {
								return fmoney(d.referenceTaxation, 2);
							} else {
								return "-";
							}
						}
					}, {
						title: '佣金状态',
						align: 'center',
						field: 'commissionStatus',
						templet: function(d){
							if (d.commissionStatus == "0") {
								return '<span style="color: green">未发放</span>';
							} else if(d.commissionStatus == "1"){
								return '<span style="color: gray">已发放</span>';
							} else{
								return "-";
							}
						}
					}, {
						title: '操作',
						align: 'center',
						field: 'referenceAuditUserName',
						width: 120,
						templet: function(d){
							return '<button onclick="edit('+d.LAY_INDEX+')" type="button" class="layui-btn layui-btn-normal layui-btn-sm" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;"">审核</button>';
						}
					}]
				],
				pageCallback, 'layTablePage'
			)
		}
		tableInit();
		
		init = tableInit;

		//表格方法
		/* 表格初始化
		 * tableId: 表格容器ID
		 * cols:table配置
		 * pageCallback回调(异步)
		 * pageDomName:分页容器ID
		 */
		function _tableInit(tableId, cols, pageCallback, pageDomName) {
			var tableIns, tablePage;
			//1.表格配置
			tableIns = table.render({
				id: tableId,
				elem: '#' + tableId,
				height: 'full-250',
				cols: cols,
				page: false,
				even: true,
				limit: 15,
				cellMinWidth:80,
				done: function(res, curr, count) {
					$('body').on('click', '.layui-table-body table tr', function() {
						$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
					})
					
				}
			});

			//2.第一次加载
			pageCallback(1, 15, function(res) {
				tableIns.reload({
					data: res.data.list
				})
				//第一页，一页显示15条数据
				layui.use('laypage');
				var page_options = {
					elem: pageDomName,
					count: res ? res.data.total : 0,
					layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
					limits: [15],
					limit: 15
				}
				page_options.jump = function(obj, first) {
					tablePage = obj;
					//首次不执行
					if(!first) {
						pageCallback(obj.curr, obj.limit, function(resTwo) {
							tableIns.reload({
								data: resTwo.data.list
							});
						});
					}
				}
				layui.laypage.render(page_options);
				return {
					tablePage,
					tableIns
				};
			});
		}

})

//填写审核内容
edit = function(index) {
	if(!index){
		return false;
	}
	//获取当前行数据
	var row = dataList[index - 1];
	var html;
	
	var id = row.id;
	var serialNo = row.serialNo;
	var merchantName = row.merchantName;
	var upgradeType = "";
	if(row.upgradeType == "1"){
		upgradeType = "合作商户";
	} else if (row.upgradeType == "2"){
		upgradeType = "代理商户";
	} else if (row.upgradeType == "3"){
		upgradeType = "合作商户续费";
	} else if (row.upgradeType == "4"){
		upgradeType = "代理商户续费";
	}
	var upgradeAmount = row.upgradeAmount;
	var payerName = row.payerName;
	var upgradeRealAmount = row.upgradeRealAmount;
	var payerNo = row.payerNo;
	var auditName = row.auditName;
	var status = "";
	if(row.status == "0"){
		status = "申请";
	} else if (row.status == "1"){
		status = "商户升级审核通过";
	} else if (row.status == "2"){
		status = "商户升级审核不通过";
	} else if (row.status == "3"){
		status = "商户升级完成";
	}
	var referenceUserId = row.referenceUserId;
	var referenceUserName = row.referenceUserName;
	var referenceMerchantLevel = "";
	if(row.referenceMerchantLevel == "1"){
		referenceMerchantLevel = "个人";
	} else if (row.referenceMerchantLevel == "2"){
		referenceMerchantLevel = "普通商户";
	} else if (row.referenceMerchantLevel == "3"){
		referenceMerchantLevel = "合作商户";
	} else if (row.referenceMerchantLevel == "4"){
		referenceMerchantLevel = "代理商户";
	} else if (row.referenceMerchantLevel == "5"){
		referenceMerchantLevel = "合伙人";
	} else if (row.referenceMerchantLevel == "6"){
		referenceMerchantLevel = "内部员工";
	}
	var referenceStrategyName = row.referenceStrategyName;
	var referenceStrategy = row.referenceStrategy * 100 + '%';
	var referenceAmount = row.referenceAmount;
	var referenceTaxation = row.referenceTaxation;
	var copartnerUserId = row.copartnerUserId;
	var copartnerUserName = row.copartnerUserName;
	var copartnerStrategyName = row.copartnerStrategyName;
	var copartnerStrategy = row.copartnerStrategy * 100 + '%';
	var copartnerAmount = row.copartnerAmount;
	var copartnerTaxation = row.copartnerTaxation;
	var remark = row.remark;
	var merchantOrgName = row.merchantOrgName;
	
	
	var aliPayPoundage = (upgradeAmount * 100 * 0.0055)/100;
	aliPayPoundage = Math.round(parseFloat(aliPayPoundage) * 100) / 100;
	var aliPayMoney = (upgradeAmount * 100 - aliPayPoundage * 100)/100;
	aliPayMoney = Math.round(parseFloat(aliPayMoney) * 100) / 100;
	
	
	var referenceMoney = (referenceAmount * 100 - referenceTaxation * 100)/100;
	referenceMoney = Math.round(parseFloat(referenceMoney) * 100) / 100;
	var copartnerMoney = (copartnerAmount * 100 - copartnerTaxation * 100)/100;
	copartnerMoney = Math.round(parseFloat(copartnerMoney) * 100) / 100;
	
	var profitMoney = Math.round(parseFloat(upgradeAmount * 100 - referenceAmount * 100 - copartnerAmount * 100)) / 100;
	
	var data = {
		id : id,
		serialNumber : serialNo,
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
		remark : remark,
		aliPayPoundage : aliPayPoundage,
		aliPayMoney : aliPayMoney,
		state : status,
		orgName : merchantOrgName,
		referenceMoney : referenceMoney,
		profitMoney : profitMoney
	};
	// 加载模板
	html = template('referenceAuditTpl', data);
	// 打开弹窗	
	layer.open({
		type : 1,
		title : '推荐人佣金审核',
		area : [ '800px', '700px' ],
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
			
			var referenceRealAmount = $("input[id='referenceRealAmount']").val() == "" ? 0 : $("input[id='referenceRealAmount']").val();
			var referenceTaxation = $("input[id='referenceTaxation']").val() == "" ? 0 : $("input[id='referenceTaxation']").val();
			var copartnerRealAmount = $("input[id='copartnerRealAmount']").val() == "" ? 0 : $("input[id='copartnerRealAmount']").val();
			var copartnerTaxation = $("input[id='copartnerTaxation']").val() == "" ? 0 : $("input[id='copartnerTaxation']").val();
			
			
			audit(id, referenceRealAmount, referenceTaxation, copartnerRealAmount, copartnerTaxation);
			layer.close(index);
		},
		btn2 : function(index) {
			layer.close(index);
		}
	});
}


function audit(id, referenceRealAmount, referenceTaxation, copartnerRealAmount, copartnerTaxation){
	// 运营平台审核人员信息
	var referenceAuditUserId = sessionStorage.getItem("userId");
	var referenceAuditUserName = sessionStorage.getItem("username");
	
	var data = {
		id : id,
		referenceRealAmount : referenceRealAmount,
		referenceTaxation : referenceTaxation,
		copartnerRealAmount : copartnerRealAmount,
		copartnerTaxation : copartnerTaxation,
		referenceAuditUserId : referenceAuditUserId,
		referenceAuditUserName : referenceAuditUserName
	};
	
	var result = reqAjax('merchantUpgrade/auditReference', JSON.stringify(data));
	if(result.code != 1){
		layer.msg(result.msg);
	} else {
		layer.msg(result.msg);
		
		init();
	}
	
	
}


//填写审核内容
upgradeDetail = function(index) {
	if(!index){
		return false;
	}
	//获取当前行数据
	var row = dataList[index - 1];
	var html;

	var id = row.id;
	var serialNo = row.serialNo;
	var merchantName = row.merchantName;
	var upgradeType = "";
	if(row.upgradeType == "1"){
		upgradeType = "合作商户";
	} else if (row.upgradeType == "2"){
		upgradeType = "代理商户";
	} else if (row.upgradeType == "3"){
		upgradeType = "合作商户续费";
	} else if (row.upgradeType == "4"){
		upgradeType = "代理商户续费";
	}
	var upgradeAmount = row.upgradeAmount;
	var payerName = row.payerName;
	var upgradeRealAmount = row.upgradeRealAmount;
	var payerNo = row.payerNo;
	var auditName = row.auditName;
	var status = "";
	if(row.status == "0"){
		status = "申请";
	} else if (row.status == "1"){
		status = "商户升级审核通过";
	} else if (row.status == "2"){
		status = "商户升级审核不通过";
	} else if (row.status == "3"){
		status = "商户升级完成";
	}
	var referenceUserId = row.referenceUserId;
	var referenceUserName = row.referenceUserName;
	var referenceMerchantLevel = "";
	if(row.referenceMerchantLevel == "1"){
		referenceMerchantLevel = "个人";
	} else if (row.referenceMerchantLevel == "2"){
		referenceMerchantLevel = "普通商户";
	} else if (row.referenceMerchantLevel == "3"){
		referenceMerchantLevel = "合作商户";
	} else if (row.referenceMerchantLevel == "4"){
		referenceMerchantLevel = "代理商户";
	} else if (row.referenceMerchantLevel == "5"){
		referenceMerchantLevel = "合伙人";
	} else if (row.referenceMerchantLevel == "6"){
		referenceMerchantLevel = "内部员工";
	}
	var referenceStrategyName = row.referenceStrategyName;
	var referenceStrategy = row.referenceStrategy * 100 + '%';
	var referenceAmount = row.referenceAmount;
	var referenceTaxation = row.referenceTaxation;
	var copartnerUserId = row.copartnerUserId;
	var copartnerUserName = row.copartnerUserName;
	var copartnerStrategyName = row.copartnerStrategyName;
	var copartnerStrategy = row.copartnerStrategy * 100 + '%';
	var copartnerAmount = row.copartnerAmount;
	var copartnerTaxation = row.copartnerTaxation;
	var remark = row.remark;
	var merchantOrgName = row.merchantOrgName;
	
	
	var aliPayPoundage = (upgradeAmount * 100 * 0.0055)/100;
	aliPayPoundage = Math.round(parseFloat(aliPayPoundage) * 100) / 100;
	var aliPayMoney = (upgradeAmount * 100 - aliPayPoundage * 100)/100;
	aliPayMoney = Math.round(parseFloat(aliPayMoney) * 100) / 100;
	
	
	var data = {
		id : id,
		serialNumber : serialNo,
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
		remark : remark,
		aliPayPoundage : aliPayPoundage,
		aliPayMoney : aliPayMoney,
		state : status,
		orgName : merchantOrgName
	};
	// 加载模板
	html = template('onLineListTpl',data);
	// 打开弹窗	
	layer.open({
		type : 1,
		title : '商户升级详情',
		area : [ '800px', '700px' ],
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



function upgradeRealAmountKeyup(e){
	e.value = e.value.replace(/[^\d.]/g,"");//清除"数字"和"."以外的字符
	e.value = e.value.replace(/^\./g,"");//验证第一个字符是数字而不是
	e.value = e.value.replace(/\.{2,}/g,".");//只保留第一个. 清除多余的
	e.value = e.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	e.value = e.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入三个小数.(\d\d\d) 修改个数  加\d
}