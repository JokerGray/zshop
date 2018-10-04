	
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
	                res.total = res.total;
	                res.rows = res.data;
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
					field : 'workNo',
					title : '工单号',
					align : "center"
				},
				{
					field : 'merchantName',
					title : '账户名称',
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
					field : 'orgName',
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
				},
				{
					field : 'workItems',
					title : '工单制作项目',
					align : "center",
					formatter : function(res,data) {
						if (res == "0") {
							return "视频拍摄";
						} else if(res == "1") {
							return "720全景";
						} else if (res =="0,1"){
							return "视频拍摄,720全景"
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'workStatus',
					title : '制作状态',
					align : "center",
					formatter : function(res,data) {
						if (res == "0") {
							return "制作中";
						} else if(res == "1") {
							return "制作完成";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'zyzzInfoId',
					title : '工单类型',
					align : "center",
					formatter : function(res,data) {
						if (res == null) {
							return "<font color='blue'>线下工单</font>";
						} else if(res != null) {
							return "<font color='green'>线上工单</font>";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'sourceName',
					title : '工单来源',
					align : "center",
				},
				{
					field : 'reviewReceivable',
					title : '应收账款',
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
					field : 'reviewActualReceivable',
					title : '实际收款',
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
					field : 'refUserName',
					title : '推荐人员',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.refUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'workUserName',
					title : '制作人员',
					align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="showUserInfo('+data.workUserId+')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},
				{
					field : 'submitTime',
					title : '提交审核时间',
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
			reviewStatus : "0",
			orgName: $("#merchantOrgName").val(),
			workNo: $("#workNo").val(),
			online: $("#online").val(),
		    submitTimeStart: $('#qBeginTime').val(),
		    submitTimeEnd: $('#qEndTime').val(),
			pageNo : params.offset / params.limit + 1,
			pageSize : params.limit
		};
		var res = {
			cmd : "payZyzzWorkOrder/selectZyzzWorkOrder",
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



	//详细内容层
	edit = function(id) {
		var html;
		
		var data = $('#table').bootstrapTable('getRowByUniqueId', id);
		var workNo = data.workNo;
		var orgName = data.orgName;
		var merchantName = data.merchantName;
		var workItems = data.workItems;
		if (workItems == "0") {
			workItems = "视频拍摄";
		} else if(workItems == "1") {
			workItems = "全景视频";
		} else if (workItems =="0,1"){
			workItems = "视频拍摄,全景视频"
		}
		var workStatus = data.workStatus;
		if (workStatus == "0") {
			workStatus = "制作中";
		} else if(workStatus == "1") {
			workStatus = "制作完成";
		}
		var sourceName = data.sourceName;
		
		var reviewVideoReceivable = fmoney(data.reviewVideoReceivable, 2);
		var reviewPanoramicReceivable = fmoney(data.reviewPanoramicReceivable, 2);
		var reviewReceivable = fmoney(data.reviewReceivable, 2);
		var reviewActualReceivable = data.reviewActualReceivable;
		var refUserName = data.refUserName;
		var workUserName = data.workUserName;
		var finishTime = data.finishTime;
		if(refUserName != undefined){
			var reviewRefAmount = fmoney(data.reviewActualReceivable * 0.2, 2);
		}else{
			var reviewRefAmount = 0;
		}
		if(workUserName != undefined){
			var reviewWorkAmount = fmoney(data.reviewActualReceivable * 0.3, 2);
		}else{
			var reviewWorkAmount = 0;
		}
		var reviewStatus = data.reviewStatus;
		var reviewRemark = data.reviewRemark;
		var data = {
			id : id,
			orderWorkId : workNo,
			merchantName : merchantName,
			orgName : orgName,
			workItems : workItems,
			workStatus : workStatus,
			sourceName : sourceName,
			reviewVideoReceivable : reviewVideoReceivable,
			reviewPanoramicReceivable : reviewPanoramicReceivable,
			reviewReceivable : reviewReceivable,
			reviewActualReceivable : reviewActualReceivable,
			refUserName : refUserName,
			workUserName : workUserName,
			finishTime : finishTime,
			reviewRefAmount : reviewRefAmount,
			reviewWorkAmount : reviewWorkAmount,
			reviewStatus : reviewStatus,
			reviewRemark : reviewRemark
		};
		// 加载模板
		html = template('offLineAuditTpl',data);
		// 打开弹窗	
		layer.open({
			type : 1,
			title : '专业制作结算审核',
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
				var reviewActualReceivable = $("#reviewActualReceivable").val();
				var reviewRefAmount = $("#reviewRefAmount").val();
				var reviewWorkAmount = $("#reviewWorkAmount").val();
				var status = $("input[name='audit']:checked").val();
				var remark = $("#reviewRemark").val();
				var size = remark.length;
				var max = 100;
				
				if(status == "" || status == undefined){
					layer.msg("请选择审核意见！");
				} else if(status == 1 && reviewActualReceivable == ""){
					layer.msg("请输入实际收款！");
				} else if(status == 1 && reviewRefAmount == ""){
					layer.msg("请输入推荐提成！");
				} else if(status == 1 && reviewWorkAmount == ""){
					layer.msg("请输入制作提成！");
				} else if(status == 2 && remark == ""){
					layer.msg("不通过时，请输入原因！");
				} else if(size > max){
					layer.msg("备注字数超出最大限制");
				} else {
					audit(id, reviewActualReceivable, reviewRefAmount, reviewWorkAmount, status, remark);
					layer.close(index);
				}
			},
			btn2 : function(index) {
				layer.close(index);
			}
		});
	}
	

	function audit(id,reviewActualReceivable, reviewRefAmount, reviewWorkAmount, status, remark){
		// 运营平台审核人员信息
		var upgradeAuditUserId = yyCache.get("userId");
		var upgradeAuditUserName = yyCache.get("pcNickname");
		
		var data = {
			id : id,
			reviewActualReceivable : reviewActualReceivable,
			reviewRefAmount : reviewRefAmount,
			reviewWorkAmount : reviewWorkAmount,
			reviewStatus : status,
			reviewRemark : remark,
			reviewYyUserId : upgradeAuditUserId,
			reviewYyName : upgradeAuditUserName
		};
		
		var result = reqAjax('payZyzzWorkOrder/uptZyzzWorkOrderReviewStatus', JSON.stringify(data));
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
		
		if(e.id == 'reviewActualReceivable'){
			var refUserName = $("#refUserName").val()
			if(refUserName != undefined && refUserName != ''){
				var reviewRefAmount = fmoney(e.value * 0.2, 2);
				$("#reviewRefAmount").val(reviewRefAmount);
			}else{
				$("#reviewRefAmount").val(0);
			}
			var workUserName = $("#workUserName").val()
			if(workUserName != undefined && workUserName != ''){
				var reviewWorkAmount = fmoney(e.value * 0.3, 2);
				$("#reviewWorkAmount").val(reviewWorkAmount);
			}else{
				$("#reviewWorkAmount").val(0);
			}
			
		}
	}
	
	
	
	
