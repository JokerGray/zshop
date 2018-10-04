var shouldStoreSum = "",
	totalStoreSum = "",
	notStoreSum = "",
	openStore = "";
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
			dataList: 'scAlipayPoundage/alipayPoundageStatistics', //(查询列表)
			store: 'scAlipayPoundage/storeAlipayPoundage'//(存入)
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
		
		/**
		 * 去掉null空字符，且返回N个字符
		 */
		function newStrByNum(str,num) { 
			if (str == '' || str == null || str == undefined) {
				str = '';
			} 
			str = $.trim(str);
			if(str.length>=num){
				return str.substring(0,num);
			}
		    return str;
		}
		
		//pageCallback
		function pageCallback(index, limit, callback) {
			var parms = {};
			reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData=res.data;
				
				//$('#amount').text('合计 : '+resData.sum+'')
				var data = res.data.list;
				$(data).attr('eq', 1);
				//保留2位小数
				shouldStoreSum = data.shouldStore.toFixed(2);
				totalStoreSum = data.totalStore.toFixed(2);                    
				notStoreSum = (data.shouldStore - data.totalStore).toFixed(2);     
				
				//表格字段转义
				//类型
				var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getTypeInfo()">支付宝手续费</button>';
				$(data).attr('type', btn);
				//未存手续费
				$(data).attr('notStore', fmoney((data.shouldStore-data.totalStore), 2));
				//应存手续费
				if(!data.shouldStore){
					$(data).attr('shouldStore', '0.00');
				}else{
					$(data).attr('shouldStore', fmoney(data.shouldStore, 2));
				}
				//已存手续费
				if(!data.totalStore){
					$(data).attr('totalStore', '0.00');
				}else{
					$(data).attr('totalStore', fmoney(data.totalStore, 2));
				}
				
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
						title: '类型',
						align: 'center',
						field: 'type'
					}, {
						title: '应存手续费',
						align: 'center',
						field: 'shouldStore'
					}, {
						title: '已存手续费',
						align: 'center',
						field: 'totalStore'
					}, {
						title: '未存手续费',
						align: 'center',
						field: 'notStore'
					}, {
						title: '操作',
						align: 'center',
						field: '_z',
						//toolbar: "#op",
						templet: function(d){
							if(!(d.eq > 0)){
								return "——";
							}else{
								var btn1 = '<button type="button" class="btn btn-xs btn-link" onclick="openStore('+d.notStore+')">存入手续费</button>';
								var btn2 = '<button type="button" class="btn btn-xs btn-link" onclick="getStoreDetail()">历史记录</button>';
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
			
			//监听工具条
			/*table.on('tool(merchantTable)', function(obj){
				var data = obj.data;
				if(obj.event === 'store'){
					openStore(data);
				}else if(obj.event == 'detail'){
					getStoreDetail();
				}
			});*/

			//2.第一次加载
			pageCallback(1, 15, function(res) {
				var data = res.data.list;
				var arr = [];
				var sumLine = {eq: '<label class="notice">合计</label>',
						type: '——',
						notStore: notStoreSum, 
						shouldStore: shouldStoreSum, 
						totalStore: totalStoreSum, 
						_z: '——'
				}
				arr.push(data);
				arr.push(sumLine);
				tableIns.reload({
					data: arr
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
							var arr = [];
							var sumLine = {eq: '<label class="notice">合计</label>',
									type: '——',
									notStore: notStoreSum, 
									shouldStore: shouldStoreSum, 
									totalStore: totalStoreSum, 
									_z: '——'
							}
							arr.push(data);
							arr.push(sumLine);
							
							tableIns.reload({
								data: arr
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
		openStore = function(upperLimit){
			layer.open({
			  type: 1,
			  area: ['800px', '500px'],
			  fix: false, //不固定
			  maxmin: false,
			  title : "支付宝手续费存入",
			  content: template('storeTpl',{
				  row: ''
			  }),
			  success: function(layero, index){
				  $('#storeBtn').on('click', function(){
						
					  	var userId = sessionStorage.getItem('userId');
					  	var username = sessionStorage.getItem('username');
						var amount = $('#storeMoney').val();
						var operator = $('#yyUserName').val();
						if(!(amount && amount)){
							layer.msg('请填写存入金额');
							return;
						}else if(!amountCheck(amount)){
							layer.msg('请正确输入金额');
							return;
						}else if(amount <= 0 ){
							layer.msg('存入金额必须大于0');
							return;
						}else if(amount > parseFloat(upperLimit)){
							layer.msg('存入金额不得超过未存手续费');
							return;
						}else if(!(operator && operator)){
							layer.msg('存入人不能为空');
							return;
						}
						
						var data = {
							t:{
								taxation: amount,
								yyUsername: operator,
								yyName: username,
								yyUserId: userId
							}
						};
						
						var res = reqAjax(server.store, JSON.stringify(data));
						if(res.code == 1){
							layer.msg("存入成功！");
							layer.close(index);
							tableInit();
						}else{
							layer.msg(res.msg);
						}
				});
			  }
			});
		}

})

function getTypeInfo(){
	var name = "支付宝手续费存入月统计";
	var url = "page/finance/profitExtract/alipayPoundageStoreMonthInfo.html";
	parent.addTabs(url, name);	
}

function getStoreDetail(){
	var name = "支付宝手续费存入明细";
	var scale = 'all';
	var url = "page/finance/profitExtract/alipayPoundageStoreLog.html?scale="+scale;
	parent.addTabs(url, name);	
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