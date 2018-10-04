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
			dataList: 'merchantUpgrade/selectPageInfoList', //(查询列表)
			exportExcel: 'headlines/exportStatisticsList'//(下载地址)
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
		
		//接收url传参
	    var startTime = getRequestAddressUrlParameter('startTime');
	    var endTime = getRequestAddressUrlParameter('endTime');
	    //初始化日期控件
	    $('#startDate').val(startTime);
	    $('#endDate').val(endTime);
		
	    
		//搜索
		$('#searchBtn').on('click', function() {
			tableInit();
		})
		//重置
		$('#resetBtn').on('click', function() {
			location.reload()
		})
		
		
		// 拼接查询参数
		function getSearchParam(pageNo, pageSize){
		    var serialNo = $('#serialNo').val();
		    var onOffLine = getRequestAddressUrlParameter('onOffLine');
		    var merchantLevel = getRequestAddressUrlParameter('merchantLevel');

		    var jsonData = {
		        applyTimeStart: $('#startDate').val(),
		        applyTimeEnd: $('#endDate').val(),
		        serialNo: serialNo,
		        onOffLine: onOffLine,
		        referenceMerchantLevel: merchantLevel,
		        status: 3,
		        homeQueryType: 5,
		        employeeCommissionStatus: 1
		    }
		    if(pageNo && pageNo){
		    	jsonData.pageNo = pageNo;
		    	jsonData.pageSize = pageSize;
		    }else{

		    }
		    return JSON.stringify(jsonData);
	    }
		
		//导出excel
		$('#addButton').on('click', function(){
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
		
				var data = res.data;
				$.each(data, function(i, item) {
					$(item).attr('eq', (i + 1));
					//表格字段转义
					function val(name, value){
						$(item).attr(name, value);
					}
					//升级类型
					var upgradeTypeStr = "";
                    if(item.onOffLine==1){
                    	upgradeTypeStr = " (线上)";
                    }else if (item.onOffLine==2) {
                    	upgradeTypeStr = " (线下)";
                    }
                    if(item.upgradeType==1){
                    	upgradeTypeStr = "合作商户"+upgradeTypeStr;
                    }else if (item.upgradeType==2) {
                    	upgradeTypeStr = "代理商户"+upgradeTypeStr;
                    }else if (item.upgradeType==3) {
                    	upgradeTypeStr = "合作商户续费"+upgradeTypeStr;
	                }else if (item.upgradeType==4) {
	                	upgradeTypeStr = "代理商户续费"+upgradeTypeStr;
	                }else {
	                	upgradeTypeStr = "-";
	                }
                    val('upgradeType', upgradeTypeStr);
                    //员工名称
                    if(!item.referenceUserName){
                    	val('referenceUserName', '-');
                	}else {
                		if(item.merchantId){
                			var referenceUserNameStr = '<a href="javascript:" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo(\''+item.referenceUserId+'\',\''+2+'\')">'+item.referenceUserName+'</a>';
                			val('referenceUserName', referenceUserNameStr);
                		}
                	}
                	//员工收入
                    var referenceRealAmountStr = item.referenceRealAmount;
                    if(referenceRealAmountStr){
                    	val('referenceRealAmount', fmoney(referenceRealAmountStr, 2));
                    }
                    //佣金结算状态 
                    var employeeCommissionStatus = item.employeeCommissionStatus;
                    var employeeCommissionStatusStr = "";
                    // 员工佣金结算状态 0 待结算/1 已结算/2 离职不予结算',
                    if(employeeCommissionStatus == 0){
                    	employeeCommissionStatusStr = "待结算";
                    }else if (employeeCommissionStatus == 1) {
                    	employeeCommissionStatusStr = "已结算";
                    }else if (employeeCommissionStatus == 2) {
                    	employeeCommissionStatusStr = "离职不予结算";
                    }else {
                    	employeeCommissionStatusStr = "-";
                    }
                    val('employeeCommissionStatus', employeeCommissionStatusStr);
                    //员工结算
                    var employeeCommissionStr = "";
                    if(item.referenceMerchantLevel!=6){
                    	val('employeeCommission', "-");
                    }else{
                    	if(employeeCommissionStatus == 0){
                    		employeeCommissionStr = '<p style="color: red;">未结算</p>';
                    	}else if (employeeCommissionStatus == 1) {
                    		employeeCommissionStr = '<p style="color: #4CAF50;">已结算</p>';
                    	}else {
                    		employeeCommissionStr = "-";
                    	}
                    	val('employeeCommission', employeeCommissionStr);
                    }
					//佣金发放
            		var commissionStatus = item.commissionStatus;
            		var commissionStatusStr = "";
            		if(item.onOffLine==2){
            			val('commissionStatus', "-");
        			}else if(item.onOffLine==1 && item.referenceMerchantLevel==6){
        				if(commissionStatus==0){
        					commissionStatusStr = '<p style="color: red;">未审核</p>';
        			    }else if (commissionStatus==1) {
        				    commissionStatusStr = '<p style="color: #4CAF50;">已审核</p>';
        			    }else {
        			    	commissionStatusStr = "-";
        			    }
        				val('commissionStatus', commissionStatusStr);
        			}else {
        				if(commissionStatus==0){
        					commissionStatusStr = '<p style="color: red;">未结算</p>';
              			}else if (commissionStatus==1) {
              				commissionStatusStr = '<p style="color: #4CAF50;">已结算</p>';
              			}else {
              				commissionStatusStr = "-";
              			}
        				val('commissionStatus', commissionStatusStr);
        			}
        		
				});
				return callback(res);
			})
		}

		//当前表格渲染
		function tableInit() {  
			var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'left',
						field: 'eq'
					}, {
						title: '流水号',
						align: 'left',
						field: 'serialNo'
					},  {
						title: '升级类型',
						align: 'left',
						field: 'upgradeType'
					}, {
						title: '员工名称',
						align: 'left',
						field: 'referenceUserName'
					}, {
						title: '员工收入',
						align: 'left',
						field: 'referenceRealAmount'
					}, {
						title: '佣金结算状态',
						align: 'left',
						field: 'employeeCommissionStatus'
					}, {
						title: '佣金发放',
						align: 'left',
						field: 'commissionStatus'
					}, {
						title: '员工结算',
						align: 'left',
						field: 'employeeCommission'
					},{
						title: '申请时间',
						align: 'left',
						field: 'applyTime'
					}, {
						title: '升级完成时间',
						align: 'left',
						field: 'upgradeConfirmTime'
					}]
				],
				pageCallback, 'layTablePage'
			)
		}
		tableInit();

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
					data: res.data
				})
				//第一页，一页显示15条数据
				layui.use('laypage');
				var page_options = {
					elem: pageDomName,
					count: res ? res.total : 0,
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
								data: resTwo.data
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