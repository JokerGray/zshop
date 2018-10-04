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
		dataList: 'z/selExchangeableZDetail', //(查询列表)
		exportExcel: 'payExcel/exportExchangeableZDetail'//(下载地址)
	}


	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload()
	})

	
	//导出excel
	$('#exportBtn').on('click', function(){
		var parms = {
			liveStatus: $("#selectview2").val()	
		}
		downloadFile(server.exportExcel, JSON.stringify(parms));
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

	//小计
	function count(arr){
		var subtotalCount = 0,
			subtotalAmount = 0.00;
		for(var i = 0; i < arr.length; i++){
			subtotalCount += arr[i].giftTotalValue;
			subtotalAmount += arr[i].exchangeableTotalMoney;
		}
		return {
			count: subtotalCount,
			amount: subtotalAmount
		}
	}

		//pageCallback
		function pageCallback(index, limit, callback) {
			var parms = {
				pageNo: index,
				pageSize: limit,
				liveStatus: $("#selectview2").val() 
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
						field: 'eq'
					}, {
						title: '店铺名称',
						align: 'center',
						field: 'shopName'
					}, {
						title: '商户名称',
						align: 'center',
						field: 'orgName',
						templet: function(d){        
							if (d.orgName) {
								return '<button type="button" class="btn btn-xs btn-link" onclick="openShopInfoView(\''+d.merchantId+'\')">'+d.orgName+'</button>';
							} else {
								return "-";
							}
						}
					}, {
						title: '礼物总价值(单位：Z币)',
						align: 'center',
						field: 'giftTotalValue'
					}, {
						title: '可兑换金额(单位：元)',
						align: 'center',
						field: 'exchangeableTotalMoney',
						templet: function(d){
							return fmoney(d.exchangeableTotalMoney, 2);
						}
					}, {
						title: '可兑换猪仔(单位：个)',
						align: 'center',
						field: 'exchangeableTotalPiglet'
					}, {
						title: '商户详情',
						align: 'center',
						field: '',
						templet: function(d){
							return '<button onclick="getDetail('+d.merchantId+')" type="button" class="layui-btn layui-btn-normal layui-btn-sm" aria-hidden="true" >详情</button>';
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

//点击商户名称弹窗
function openShopInfoView(merchantId){
	
	if(merchantId == '' || merchantId == null || merchantId == undefined){
		layer.msg("商户ID错误！");
		return false;
	}else{
		layer.open({
		  type: 2,
		  area: ['1000px', '600px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "店铺可兑换智币明细",
		  content: "../common/shopExchangeableZDetail.html?merchantId=" + merchantId
		});
	}
}

function getDetail(merchantId){
	//var indexs = layer.load(0,{shade: [0.7, '#393D49']}, {shadeClose: true}); 
	if(merchantId && merchantId){
		var html, res;

		//读取前端模板 并且 ajax读取用户信息
		res = reqAjax('z/getMerchantInfo', JSON.stringify({
			merchantId: merchantId
    	}));
		
		if(res.code == 1){
			//加载模板  
			html = template('merchantInfoTpl', res.data); 
			//打开弹窗
	        layer.open({
	            type:1,
	            title: '商户详情',
	            area:['800px', '500px'],
	            
	            content:html,
	            //弹窗加载成功的时候
	            success: function(){
	            	
	            },
	            yes: function(index, layero){

	            	layer.close(index);
	            }
	        });
		}else{
			layer.msg(res.msg);
		}

	}else{
		layer.msg('商户ID异常, 请联系客服');
	}
	
}

//点击图片弹窗显示大图
function openPic(url){
	if(url && url){
		var imgHtml = '<img src="'+url+'" />';
		var index = layer.open({  
	        type: 1,  
	        shade: false,  
	        title: false, //不显示标题  
	        area:['1700px','700px'],  
	        //area: [img.width + 'px', img.height+'px'],  
	        content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响  
	        cancel: function () {  
	            //layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });  
	        }
	    });  
		//layer.full(index);
	}
}
