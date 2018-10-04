var profitSum = "",
	extractSum = "",
	restExtractSum = "",
	openExtract = "";
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
			dataList: 'profitExtractLog/selProfitExtractSummary', //(查询列表)
			extract: 'profitExtractLog/addProfitExtractLog'//(提取)
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
		    		pageNo : pageNo,
					pageSize : pageSize
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
				profitSum = fmoney(res.data.profitSum, 2);
				extractSum = fmoney(res.data.extractSum, 2);
				restExtractSum = fmoney((res.data.profitSum - res.data.extractSum), 2);
    			
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
						title: '收入类型',
						align: 'center',
						field: 'profitTypeStr',
						templet: function(d){
							if(!(d.eq > 0)){
								return "——";
							}
							var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getTypeInfo(\''+d.profitType+'\', \''+d.restableExtract+'\',\''+d.profitTypeStr+'\')">'+d.profitTypeStr+'</button>';
							return btn;
						}
					}, {
						title: '收入总计',
						align: 'center',
						field: 'totalSum',
						templet: function(d){
							if(d.totalSum == null){
								return "0.00";
							}
							return fmoney(d.totalSum, 2);
						}
					}, {
						title: '已提取金额',
						align: 'center',
						field: 'totalExtract',
						templet: function(d){
							if(d.totalExtract == null){
								return "0.00";
							}
							return fmoney(d.totalExtract, 2);
						}
					}, {
						title: '可提取金额',
						align: 'center',
						field: 'restableExtract',
						templet: function(d){
							if(d.restableExtract == null){
								return "0.00";
							}
							return fmoney(d.restableExtract, 2);
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
								var btn1 = '<button type="button" class="btn btn-xs btn-link" onclick="openExtract(\''+d.profitType+'\', \''+d.profitTypeStr+'\', \''+d.restableExtract+'\')">提取</button>';
								var btn2 = '<button type="button" class="btn btn-xs btn-link" onclick="getExtractDetail(\''+d.profitType+'\', \''+d.profitTypeStr+'\')">历史记录</button>';
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
						profitTypeStr: '——',
						totalSum: profitSum, 
						totalExtract: extractSum, 
						restableExtract: restExtractSum, 
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
									profitTypeStr: '——',
									totalSum: profitSum, 
									totalExtract: extractSum, 
									restableExtract: restExtractSum, 
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
		openExtract = function(profitType, profitTypeStr, upperLimit){
			layer.open({
			  type: 1,
			  area: ['800px', '500px'],
			  fix: false, //不固定
			  maxmin: false,
			  title : profitTypeStr + " 收入提取",
			  content: template('extractTpl',{
				 row: {profitTypeStr: profitTypeStr}
			  }),
			  success: function(layero, index){
				  $('#extractBtn').on('click', function(){
					  	var userId = sessionStorage.getItem('userId');
					  	var username = sessionStorage.getItem('username');
						var amount = $('#extractMoney').val();
						var operator = $('#yyUserName').val();
					  
						if(!(amount && amount)){
							layer.msg('请填写提取金额');
							return;
						}else if(!amountCheck(amount)){
								layer.msg('请正确输入金额');
								return;
						}else if(amount > upperLimit){
							layer.msg('提取金额超过剩余可提取的金额,请重新输入');
							return;
						}else if(amount <= 0 ){
							layer.msg('提取金额必须大于0');
							return;
						}else if(!(operator && operator)){
							layer.msg('提取人不能为空');
							return;
						}
						
						var data = {
							t:{
								extractType: profitType,
								extractMoney:amount,
								yyUserName:operator,
								yyName:username,
								yyUserId:userId
							}
						};
						
						var res = reqAjax(server.extract, JSON.stringify(data));
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

function getTypeInfo(profitType, restableExtract, profitTypeStr){
	var name = profitTypeStr + "收入提取月统计";
	var url = "page/finance/profitExtract/profitExtractMonthlyInfo.html?profitType="+profitType+"&amount="+restableExtract;
	parent.addTabs(url, name);	
}

function getExtractDetail(profitType, profitTypeStr){
	var name = profitTypeStr + "收入提取明细";
	var scale = 'all';
	var url = "page/finance/profitExtract/profitExtractLog.html?profitType="+profitType+"&scale="+scale;
	parent.addTabs(url, name);	
}