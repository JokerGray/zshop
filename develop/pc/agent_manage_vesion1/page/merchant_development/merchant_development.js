layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage;

	//接口
	var serve = {
		query: 'operations/getAgentCustomerBackUserByUserId', //查询
		getSysConfigList: 'operations/getSysConfigList' //获取系统信息接口(计费类型,行业类型,公众号类型)
	}




	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload()
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

	

	
	
	//新增弹窗初始化
	function addInit() {
		$('#merchantPhone1').val('');
		$('#merchantName1').val('');
		$("#nextMerchantPhone").val('');
		$("#merchantNickname").val('');
		$("#merchantTradee").val('');
		$("#sysUserSex").val('');
		$("#sysUserNickname").val('');
		$('#provinceSelector2').val('');
		$('#citySelector2').val('');
		$("#uploadImg1").attr('src','img/upload.png'); //非必
		$("#uploadImg2").attr('src','img/upload.png'); //非必
		$("#uploadImg3").attr('src','img/upload.png');
		$("#uploadImg4").attr('src','img/upload.png');
		$("#uploadImg5").attr('src','img/upload.png'); //非必
		$('#addLayer').hide();
	}


	//pageCallback
	function pageCallback(index, limit, callback) {
		var userno = sessionStorage.getItem('t_userid');
		var parms = {
			rows: limit,
			page: index,
			t_userid:userno,
			username: $.trim($('#username').val()) || "",
			phone: $.trim($('#phone').val()) || "",
			orgName: $.trim($('#orgName').val()) || ""
		};
		reqAjaxAsync(serve.query, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			var ress = reqAjax(serve.getSysConfigList);
			var merchantTrade = ress.data.merchantTrade;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
				if(item.regular == 0) {
					$(item).prop('regular','正式')
				} else if(item.regular == 1) {
					$(item).prop('regular','测试')
				}
				if(item.merchantStatus == 1) { //是否锁定  1 是 0 否
					$(item).attr('merchantStatus', '锁定');
				} else if(item.merchantStatus == 0) {
					$(item).attr('merchantStatus', '正常');
				};
				if(item.orgLevel == 1) { //是否锁定  1 是 0 否
					$(item).attr('orgLevel', '普通商户');
				} else if(item.orgLevel == 2) {
					$(item).attr('orgLevel', '合作商户');
				} else if(item.orgLevel == 3) {
					$(item).attr('orgLevel', '代理商户');
				};
				$.each(merchantTrade,function(u,utem){
					if(item.trade == utem.value){
						$(item).attr('tradename', utem.name);
					}
				})
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
						field: 'eq',
						event: 'changetable'
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						event: 'changetable'
					}, {
						title: '商户名',
						align: 'left',
						field: 'orgName'
					}, {
						title: '商户等级',
						align: 'left',
						field: 'orgLevel'
					},{
						title: '商户类型',
						align: 'left',
						field: 'regular'
					},{
						title: '商户行业',
						align: 'left',
						field: 'tradename'
					},{
						title: 'APP用户名',
						align: 'left',
						field: 'username'
					},{
						title: '是否锁定',
						align: 'left',
						field: 'merchantStatus'
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
			even: false,
			skin: 'row',
			limit: 15,
			cellMinWidth:80,
			done: function(res, curr, count) {
				$('body').on('click','.layui-table-body table tr',function(){
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
				limits: [15, 30],
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