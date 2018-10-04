layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage;

	//接口
	var serve = {
		query: 'operations/getAgentMerchantRegMapPageList', //查询
		provice: 'operations/getProvinceList', //省市接口
		provincebyid: 'operations/getBaseAreaInfoByCode', //省'
		addangetmer: 'operations/addAgentMerchantReg', //新增
		tradeList:'operations/getAllMerchantTradeList'//行业
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

	//状态切换方法
	function stateChange() {
		var status = $(this).attr('data-status');
		if(status == 0){
			$('#stTime').html('申请时间起');
			$('#endTim').html('申请时间止');
		}else{
			$('#stTime').html('审核时间起');
			$('#endTim').html('审核时间止');
		}
		sessionStorage.setItem('status', status);
		$(this).addClass('act').siblings().removeClass('act');
		tableInit();
	}

	$('.select-search-div').on('click', stateChange);
	
	
	
	form.on('select(provinceSelector2)', function(data) {
		var selectOption = ''
		var value = data.value;
		var param = "{'parentcode':" + value + "}";
		reqAjaxAsync(serve.provice, param).then(function(res) {
				var data = res.data;
				$.each(data, function(i, item) {
					selectOption += "<option value=" + item.code + ">" + item.areaname + "</option>"
				})
				$('#citySelector2').html(selectOption);
			form.render('select');
   		})
	});

	//新增方法
	$('#addBtn').on('click', function() {
		layer.open({
			title: ['新增', 'font-size:12px;background-color:#424651;color:#fff'],
			btn: ['保存', '取消'],
			type: 1,
			anim: 5,
			content: $('#addLayer'),
			area: ['1400px', '800px'],
			end: function() {
				addInit();
			},
			success: function(index,layero) {
				//默认第一个缩起
				loadProvinceCity();
				
				//加载行业
				loadMerchantTrade('merchantTradee');
				//监听省市选择
				//新增弹窗账号
				watchAdd();
				$("div.layui-layer-page").addClass("layui-form");
				$("a.layui-layer-btn0").attr("lay-submit", "");
				$("a.layui-layer-btn0").attr("lay-filter", "formdemo2");
				form.render(null, 'adder');
			},
			yes: function(index,layero) {
				form.on('submit(formdemo2)', function(data) {
					if(data) {
						var userno = sessionStorage.getItem('t_userid');
						var merchantPhone = $("#merchantPhone1").val();
						var merchantNickname = $("#merchantNickname").val();
						var merchantName = $("#merchantName1").val();
						var merchantTrade = $("#merchantTradee").val();
						var sysUserSex = $("#sysUserSex").val();
						var sysUserNickname = $("#sysUserNickname").val();
						var province = $('#provinceSelector2').val();
						var city = $('#citySelector2').val();
						var licenseFront = $("#uploadImg1").attr('src'); //非必
						var licenseHold = $("#uploadImg2").attr('src'); //非必
						var sysUserIdcardFront = $("#uploadImg3").attr('src');
						var sysUserIdcardBack = $("#uploadImg4").attr('src');
						var sysUserIdcardHold = $("#uploadImg5").attr('src'); //非必
						if(sysUserIdcardFront == 'img/upload.png' || sysUserIdcardBack == 'img/upload.png') {
							layer.msg('请上传相关证件')
							return;
						}
						var pram2 = {
							t_userid:userno,
							merchantPhone: merchantPhone,
							merchantName:merchantName,
							merchantNickname: merchantNickname,
							merchantTrade: merchantTrade,
							sysUserSex: sysUserSex,
							sysUserNickname: sysUserNickname,
							province: province,
							city: city,
							licenseFront: licenseFront,
							licenseHold: licenseHold,
							sysUserIdcardFront: sysUserIdcardFront,
							sysUserIdcardBack: sysUserIdcardBack,
							sysUserIdcardHold: sysUserIdcardHold
						}
						reqAjaxAsync(serve.addangetmer, JSON.stringify(pram2)).then(function(res) {
							layer.msg(res.msg);
							layer.close(index)
							tableInit();
						})
					}
				})

			}
		})
	})

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


	//行业初始化
	function loadMerchantTrade(domId){
		reqAjaxAsync(serve.tradeList).then(function(res) {
			var data = res.data;
			var option = '<option value="">请输入</option>';
			$.each(data, function(i, item) {
				option += "<option value=" + item.value + ">" + item.name + "</option>"
			})
			$('#' + domId).html(option);
			form.render('select');
		})
	}
	
	loadMerchantTrade('merchantTrade');
	
	//省市初始化
	function loadProvinceCity() {
		//省 =》0 
		var param = "{'parentcode':" + 0 + "}";
		var option = '';
		var nextOption = '';
		reqAjaxAsync(serve.provice, param).then(function(res) {
			var data = res.data;
			$.each(data, function(i, item) {
				option += "<option value=" + item.code + ">" + item.areaname + "</option>"
			})
			$('#provinceSelector2').html(option);
			var pro = $('#provinceSelector2');
		   	var cityId = pro.children('option').eq(0).val();
		   	if(cityId){
		   		var param = "{'parentcode':" + cityId + "}";
	   			reqAjaxAsync(serve.provice, param).then(function(res) {
					var data = res.data;
					$.each(data, function(i, item) {
						nextOption += "<option value=" + item.code + ">" + item.areaname + "</option>"
					})
					$('#citySelector2').html(nextOption);
					form.render('select');
		   		})
		   	}
		})
	}
	
	
	
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
	//新增弹窗账号
	function watchAdd() {
		$('#merchantPhone1').keyup(function(){
			var v = $(this).val();
			$('#nextMerchantPhone').val(v);
		})
	}

	//上传图片
	uploadOss({
		btn: "uploadImg1",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg2",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg3",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg4",
		flag: "img",
		size: "5mb"
	});
	uploadOss({
		btn: "uploadImg5",
		flag: "img",
		size: "5mb"
	});

	//pageCallback
	function pageCallback(index, limit, callback) {
		var userno = sessionStorage.getItem('id');
		var parms = {
			rows: limit,
			page: index,
			t_userid:userno,
			merchantPhone: $.trim($('#merchantPhone').val()) || "",
			merchantNickname: $.trim($('#merchantName').val()) || "",
			merchantTrade: $.trim($('#merchantTrade').val()) || "",
			startDate: $('.startDate').eq(0).attr('data-date') || "",
			endDate: $('.endDate').eq(0).attr('data-date') || "",
			status: $('.select-search-div.act').attr('data-status')
		};
		reqAjaxAsync(serve.query, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1))
			});
			return callback(res);
		})
	}

	//当前表格渲染
	function tableInit() {
		var status = sessionStorage.getItem('status') ? sessionStorage.getItem('status') : $('.select-search-div.act').attr('data-status');
		$('.select-search-div').eq(status).addClass('act').siblings().removeClass('act');
		if(status == 0) {
			$('#stTime').html('申请时间起');
			$('#endTim').html('申请时间止');

			var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'left',
						field: 'eq',
						event: 'changetable'
					}, {
						title: '手机号',
						align: 'left',
						field: 'merchantPhone',
						event: 'changetable'
					}, {
						title: '商户名',
						align: 'left',
						field: 'merchantName',
						event: 'changetable'
					}, {
						title: '商户行业',
						align: 'left',
						field: 'tradeName',
						event: 'changetable'
					}, {
						title: '申请时间',
						align: 'left',
						field: 'createtime',
						event: 'changetable'
					}]
				],
				pageCallback, 'layTablePage'
			)
		} else {
			$('#stTime').html('审核时间起');
			$('#endTim').html('审核时间止');
			var _obj = _tableInit('merchantTable', [
					[{
						title: '序号',
						align: 'left',
						field: 'eq',
						event: 'changetable'
					}, {
						title: '手机号',
						align: 'left',
						field: 'merchantPhone',
						event: 'changetable'
					}, {
						title: '商户名',
						align: 'left',
						field: 'merchantName',
						event: 'changetable'
					}, {
						title: '商户行业',
						align: 'left',
						field: 'tradeName',
						event: 'changetable'
					}, {
						title: '审核时间',
						align: 'left',
						field: 'updatetime',
						event: 'changetable'
					}]
				],
				pageCallback, 'layTablePage'
			)
		}
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
			done: function(res, curr, count) {
				//				var data = res.data;
				//				var _id = data[0].id;
				//				var _isAdminRole = data[0].isAdminRole;
				//				sessionStorage.setItem('_id', _id);
				//				sessionStorage.setItem('_isAdminRole', _isAdminRole);
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