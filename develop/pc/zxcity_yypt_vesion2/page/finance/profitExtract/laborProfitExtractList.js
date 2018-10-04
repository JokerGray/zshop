var laborCostsSum = "",
	laborTaxSum = "",
	totalSaveSum = "",
	shouldSaveSum = "",
	openReview = "";
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
			dataList: 'profitExtractLog/laborList', //(查询列表)
			store: 'profitExtractLog/addLaborProfitExtractLog'//(存入)
		}
		
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
		
		
		// 拼接查询参数
		function getSearchParam(pageNo, pageSize){
		    var jsonData = {
				entity: {
					taxType: '劳务报税',
					status: 0
				}
		    }
		    if(pageNo && pageNo){
		    	jsonData.entity.pageNo = pageNo;
		    	jsonData.entity.pageSize = pageSize;
		    }else{
		    }
		    return JSON.stringify(jsonData);
		}

		//pageCallback
		function pageCallback(index, limit, callback) {
			var parms = getSearchParam(index, limit);
			reqAjaxAsync(server.dataList, parms).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData=res.data;
				
				var data = res.data.list;
				$.each(data, function(i, item) {
					$(item).attr('eq', (i + 1));
					
				});
				//获取后台统计数据
				laborCostsSum = fmoney(res.data.laborCostsSum, 2);
    			laborTaxSum = fmoney(res.data.laborTaxSum, 2);
    			totalSaveSum = fmoney(res.data.totalSaveSum, 2);
    			shouldSaveSum = fmoney(res.data.shouldSaveSum, 2);
    			
				return callback(res);
			})
		}

		//当前表格渲染
		function tableInit() {  
			var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'center',
						field: 'eq'
					}, {
						title: '业务类型',
						align: 'center',
						field: 'businessTypeStr',
						templet: function(d){
							if(!(d.eq > 0)){
								return "——";
							}
							var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getMonthInfo(\''+d.businessType+'\', \''+d.businessTypeStr+'\')">'+d.businessTypeStr+'</button>';
							return btn;
						}
					}, {
						title: '劳务费总计',
						align: 'center',
						field: 'laborCostsTotal',
						templet: function(d){
							if(d.laborCostsTotal == null){
								return "0.00";
							}
							return fmoney(d.laborCostsTotal, 2);
						}
					}, {
						title: '劳务税总计',
						align: 'center',
						field: 'laborTaxTotal',
						templet: function(d){
							if(d.laborTaxTotal == null){
								return "0.00";
							}
							return fmoney(d.laborTaxTotal, 2);
						}
					}, {
						title: '已存劳务费',
						align: 'center',
						field: 'totalSave',
						templet: function(d){
							if(d.totalSave == null){
								return "0.00";
							}
							return fmoney(d.totalSave, 2);
						}
					}, {
						title: '应存劳务费',
						align: 'center',
						field: 'shouldSave',
						templet: function(d){
							if(d.shouldSave == null){
								return "0.00";
							}
							return fmoney(d.shouldSave, 2);
						}
					}, {
						title: '操作',
						align: 'center',
						field: '_z',
						//toolbar: "#op",
						templet: function(d){
							if(!(d.eq > 0)){
								return "——";
							}else{
								var btn1 = '<button type="button" class="btn btn-xs btn-link" onclick="openReview(\''+d.businessType+'\', \''+ d.shouldSave+'\')">存入劳务费</button>';
								var btn2 = '<button type="button" class="btn btn-xs btn-link" onclick="getStoreDetail(\''+d.businessType+'\', \''+d.businessTypeStr+'\')">历史记录</button>';
								return btn1 + '     ' + btn2;
							}
						}
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
				var data = res.data.list;
				//添加统计行
				var sumLine = {eq: '<label class="notice">合计</label>',
						businessTypeStr: '——',
						laborCostsTotal: laborCostsSum, 
						laborTaxTotal: laborTaxSum, 
						totalSave: totalSaveSum, 
						shouldSave: shouldSaveSum,
						_z: '——'
				}
				data.push(sumLine);
				tableIns.reload({
					data: data
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
							//添加合计行
							var data = resTwo.data.list;
							//添加统计行
							var sumLine = {eq: '<label class="notice">合计</label>',
									businessTypeStr: '——',
									laborCostsTotal: laborCostsSum, 
									laborTaxTotal: laborTaxSum, 
									totalSave: totalSaveSum, 
									shouldSave: shouldSaveSum,
									_z: '——'
							}
							data.push(sumLine);
							
							tableIns.reload({
								data: data
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
		
		//存入按钮
		openReview = function(extractType, upperLimit){
			layer.open({
			  type: 1,
			  area: ['800px', '500px'],
			  fix: false, //不固定
			  maxmin: false,
			  title : "劳务费存入",
			  content: template('reviewTpl',{
				 
			  }),
			  success: function(layero, index){
				  $('#sendBtn').on('click', function(){
					  	var name = sessionStorage.getItem('username');
					  	var yyUserName = $('#yyUserName').val();
						var amount = $('#money').val();
						var yyUserId = sessionStorage.getItem('userId');
						
						if(!(amount && amount)){
							layer.msg('请填写存入金额');
							return;
						}else if(!amountCheck(amount)){
							layer.msg('请正确输入金额');
							return;
						}else if(amount > upperLimit){
							layer.msg('存入金额超过剩余可存入的金额,请重新输入');
							return;
						}else if(!(yyUserName && yyUserName)){
							layer.msg('存入人不能为空');
							return;
						}
						
						var data = {
							t:{
								yyUserId: yyUserId,
								yyUserName: yyUserName,
								yyName: name,
								extractMoney: amount,
								extractType: extractType
							}
						};
						
						var res = reqAjax(server.store, JSON.stringify(data));
						if(res.code == 1){
							layer.msg("成功！");
							layer.close(index);
							tableInit();
						}else{
							layer.msg(res.msg);
						}
				});
			  }
			});
		}


		function amountCheck(obj){
			if( /^(0{1}|[1-9]\d*)(\.\d{0,2})?$/.test(obj)){
		 
				if(obj < 0) {
					return false;
				}
				return true;
			}
			return false;

		}

})

function getMonthInfo(businessType, businessTypeStr){
	
	var name = businessTypeStr + "劳务费存入月统计";
	var url = "page/finance/profitExtract/laborCostStoreMonthlyInfo.html?businessType="+businessType;
	parent.addTabs(url, name);	
}

function getStoreDetail(businessType, businessTypeStr){
	var name = businessTypeStr + "劳务费存入明细";
	var scale = 'all';
	var url = "page/finance/profitExtract/laborCostStoreLog.html?businessType="+businessType+"&scale="+scale;
	parent.addTabs(url, name);	
}
