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
			dataList: 'merchantUpgrade/selMUSPageList', //(查询列表)
			exportExcel: 'payExcel/exportMerchantUpgradeStrategy'//(下载地址)
		}
		
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
						title: '推荐人商户等级',   //推荐人当时的商户等级 1 个人/2 普通商户/3 合作商户/4 代理商户/5 合伙人/6 内部员工
						align: 'center',
						field: 'referenceMerchantLevel',
						templet: function(d){
							if (d.referenceMerchantLevel == "1") {
								return "个人";
							} else if(d.referenceMerchantLevel == "2") {
								return "普通商户";
							} else if(d.referenceMerchantLevel == "3") {
								return "合作商户";
							} else if(d.referenceMerchantLevel == "4") {
								return "代理商户";
							} else if(d.referenceMerchantLevel == "5") {
								return "合伙人";
							} else if(d.referenceMerchantLevel == "6") {
								return "内部员工";
							} else {
								return "错误";
							}
						}
					}, {//升级类型 1 合作商户/2 代理商户/3 合作商户续费/4 代理商户续费
						title: '升级类型',
						align: 'center',
						field: 'upgradeType',
						templet: function(d){
							if (d.upgradeType == "1") {
								return "合作商户";
							} else if(d.upgradeType == "2") {
								return "代理商户";
							} else if(d.upgradeType == "3") {
								return "合作商户续费";
							} else if(d.upgradeType == "4") {
								return "代理商户续费";
							} else {
								return "错误";
							}
						}
					}, {
						title: '策略名称',
						align: 'center',
						field: 'strategyName'
					}, {
						title: '策略值',
						align: 'center',
						field: 'strategyValue',
						templet: function(d){
							if (d.strategyValue || d.strategyValue == 0) {
								return d.strategyValue * 100 + '%';
							} else {
								return "-";
							}
						}
					}, {
						title: '合伙人策略名称',
						align: 'center',
						field: 'copartnerStrategyName'
					}, {
						title: '合伙人策略值',
						align: 'center',
						field: 'copartnerStrategyValue',
						templet: function(d){
							if (d.copartnerStrategyValue || d.copartnerStrategyValue == 0) {
								return d.copartnerStrategyValue * 100 + '%';
							} else {
								return "-";
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
