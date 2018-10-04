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
		dataList: 'z/selShopExchangeableZDetail'//(查询列表)
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

	//小计
	function count(arr){
		var subTotalAmount = 0.00,
			subTotalCount = 0; 
		for(var i=0; i < arr.length; i++){
			subTotalAmount += arr[i].exchangeableMoney;
			subTotalCount += arr[i].giftProfitBalance;
		}
		
		return {
			count: subTotalCount,
			amount: subTotalAmount
		}
	}

		//pageCallback
		function pageCallback(index, limit, callback) {
			var merchantId = getRequestAddressUrlParameter("merchantId");
			var parms = {
				pageNo: index,
				pageSize: limit,
				merchantId : merchantId
			}
			reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData = res.data;
				var data = res.data.list;
				//小计
				var result = count(data);
				var htmlStr = "合计： " + resData.sum + " Z币/" + fmoney(resData.amount, 2) + " 元,&nbsp;&nbsp;&nbsp;&nbsp; 小计： " 
							  + result.count + " Z币/" + fmoney(result.amount, 2) + " 元";
				$('#amount').html(htmlStr);
				
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
						title: '店铺名称',
						align: 'center',
						field: 'shopName'
					}, {
						title: '商户名称',
						align: 'center',
						field: 'orgName'
					}, {
						title: '主脸姓名',
						align: 'center',
						field: 'username'
					}, {
						title: '礼物总价值(单位：Z币)',
						align: 'center',
						field: 'giftProfitBalance',
						templet: function(d){
							if(!d.giftProfitBalance){
								return 0;
							}
							return d.giftProfitBalance;
						}
					}, {
						title: '可兑换金额(单位：元)',
						align: 'center',
						field: 'exchangeableMoney',
						templet: function(d){
							if(!d.exchangeableMoney){
								return "0.00";
							}
							return fmoney(d.exchangeableMoney, 2);
						}
					}, {
						title: '可兑换猪仔(单位：个)',
						align: 'center',
						field: 'exchangeablePiglet',
						templet: function(d){
							if(!d.exchangeablePiglet){
								return 0;
							}
							return d.exchangeablePiglet;
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