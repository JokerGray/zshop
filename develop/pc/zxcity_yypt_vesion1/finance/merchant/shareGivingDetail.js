var id;
var level;
var shareLevel
var levelTypeList
	$(function() {
		
		//获取跳转前页面传参
		 id = getRequestAddressUrlParameter("id");
		 level = getRequestAddressUrlParameter("level");
		
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
					field : 'merchantId',
					title : '协议号',
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
						if (res == "1") {
							return "合作商户";
						} else if(res == "2") {
							return "合作商户续费";
						} else if(res == "3") {
							return "市级合伙人";
						} else if(res == "4") {
							return "省级合伙人";
						}else if(res == "5") {
							return "女人花基地智享事业部";
						}else if(res == "6") {
							return "运营中心";
						}else if(res == "7") {
							return "分公司";
						} else {
							return "错误";
						}
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
					field : 'moneyMode',
					title : '打款方式',
					align : "center",
					formatter : function(res,data) {
						if (res == "1") {
							return "微信";
						} else if(res == "2") {
							return "支付宝";
						} else {
							return "错误";
						}
					}
				},
				{
					field : 'moneyRemark',
					title : '打款备注',
					width : 160,
					align : "center"
				},
				{
					field : 'shareUserLevelName',
					title : '分享人当时等级',
					width : 160,
					align : "center"
				},
				{
					field : 'upgradeAutitTime',
					title : '审核时间',
					align : "center"
				}
			],
			onLoadSuccess: function (data) {
				levelTypeList = data.data.LevelTypeList;
				var shtml ="";
				shtml += '<option value="" selected> -- 全部 -- </option>';
				$.each(levelTypeList,function(i,item){
					shtml += '<option value="'+ item.id +'" >'+ item.levelName+'</option>';
				})
				$("#shareLevel").html(shtml);
				$("#shareLevel").val(shareLevel).prop("checked","true");
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
			status : "3",
			onOffLine : "2",
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val(),
			shareUserId: id,
			shareLevel: level,
			shareLevel: $("#shareLevel").val(),
			upgradeRealAmount: 0.0,
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
		shareLevel = $("#shareLevel").val();
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
			status : "3",
			commissionStatus : null,
			onOffLine : "2",
			merchantOrgName: $("#merchantOrgName").val(),
			serialNo: $("#serialNo").val(),
			shareUserId: id,
			shareLevel: level,
			upgradeRealAmount: 0
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

	
	
	
	
