(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno") || "";
	var userId = yyCache.get("userId") || "";
	var pid = '';
	var locked = true;
	var USER_URL = {
		LIST:'operations/queryMerchantSettleinPage',//列表查询
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省
		INFORMATION:'operations/getMerchantSettleinById',//详情查询
		EDIT:'operations/updateMerchantSettleinInfo'//编辑入驻信息
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
		form.render();
	})
	//日期选择
	$('#datetimepicker1 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker2 .datepicker").hide();
	});

	$('#datetimepicker2 input').datepicker({
		format: 'yyyy-mm-dd',
		autoclose: true,
		language: "zh-CN"
	}).on('changeDate', function(ev) {
		var startTime = ev.date.valueOf();
		var endTime = $('#datetimepicker2').attr('data-time');
		$(this).parent().attr('data-time', startTime);
		$("#datetimepicker1 .datepicker").hide();
	});
	
	//初始化加载省市
	loadProvinceAndCity({
		'parentcode': 0
	}, 1);

	//加载省市数据
	function loadProvinceAndCity(param, _sort) {
		reqAjaxAsync(USER_URL.PROVINCE,JSON.stringify(param)).then(function(res){
			if(res.code == 1) {
				if(_sort != 2) {
					var sHtml = '<option value="">---请选择---</option>';
				}
				for(var i = 0, len = res.data.length; i < len; i++) {
					sHtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
				}
				_sort = _sort ? _sort : 1;
				if(param['parentcode'] == 0) {
					proviceArr = res.data;
					$("#provinceSelector" + _sort).html(sHtml);
					$("#addMervhant").attr("data-cid", res.data[0].code);
				} else {
					$("#citySelector" + _sort).html(sHtml);
					$("#citySelector" + _sort).prop("disabled", false);
				}
			}
		})
	}

	//加载市
	function getCity(cityid) {
		var param = {
			parentcode: cityid
		}
		reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).done(function(res) {
			if(res.code == 1) {
				var mhtml = "";
				for(var i = 0, len = res.data.length; i < len; i++) {
					mhtml += '<option value="' + res.data[i].code + '">' + res.data[i].areaname + '</option>'
				}
				if(cityid == 0) {
					$("#provinceSelector2").html(mhtml);
				} else {
					$("#citySelector2").html(mhtml);
				}
				form.render();
			} else {
				layer.msg(res.msg);
			}

		});

	}
	
	
	//根据省的选择切换对应的市内容
	$("#provinceSelector1").change(function() {
		var _value = $(this).val();
		if(_value == "") {
			$("#citySelector1").prop("disabled", true).find("option:eq(0)").prop("selected", true);
		} else {
			loadProvinceAndCity({
				'parentcode': _value
			}, 1);
		}
	});

	//渲染表单
	function _tableInit(){
		var objs = tableInit('demo', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						width: 150
					}, {
						title: '商户名称',
						align: 'left',
						field: 'merchantName',
						width: 150
					}, {
						title: '真实姓名',
						align: 'left',
						field: 'realName',
						width: 150
					}, {
						title: '创建时间',
						align: 'left',
						field: 'createTime',
						width: 250
					}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 400
					}
				]
			],
	
			pageCallback, 'laypageLeft'
		);		
	};
	_tableInit();

	//TAB切换
	$('.search-li').on('click', function() {
		$(this).addClass('act').siblings().removeClass('act');
		_tableInit();
	})
	/* 表格初始化
	 * tableId:
	 * cols: []
	 * pageCallback: 同步调用接口方法
	 */
	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-249',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(page, rows);
		//第一页，一页显示15条数据
		if(res) {
			if(res.code == 1) {
				tableIns.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			}
		}

		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: test,
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					tableIns.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}

	//左侧表格数据处理
	function getData(url, parms) {
		var res=reqAjax(url,parms);
		if(res.code==1){
			var data=res.data;
			
			$.each(data, function(i,item) {
				$(item).attr('eq',(i+1));
			});
			return res;
		}else{
			layer.msg(res.msg);
		}
	}

	//pageCallback回调
	function pageCallback(index, limit) {
		var type=$('.search-li.act').attr('data-type');
		if(type==0){
			var param = {
				page: index,
				rows: limit,
				status:0,
				merchantName:$('#merchantName').val(),
	  			phone:$('#phone').val(),
	  			provinceId:$('#provinceSelector1').val(),
	  			cityId:$('#citySelector1').val(),
	  			realName:$('#realName').val(),
	  			createTimeStart:$('#jurisdiction-begin').val(),
	  			createTimeEnd:$('#jurisdiction-end').val()
		}
			return getData(USER_URL.LIST, JSON.stringify(param));		
		}else{
			var param = {
				page: index,
				rows: limit,
				status:1,
				contactsUserId:userId,
				merchantName:$('#merchantName').val(),
	  			phone:$('#phone').val(),
	  			provinceId:$('#provinceSelector1').val(),
	  			cityId:$('#citySelector1').val(),
	  			realName:$('#realName').val(),
	  			createTimeStart:$('#jurisdiction-begin').val(),
	  			createTimeEnd:$('#jurisdiction-end').val()
			}
			return getData(USER_URL.LIST, JSON.stringify(param));
		}

	}



	//点击表格变色
	$('body').on('click', '.layui-form .layui-table-body tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	});

	//加了入参的公用方法
	function getTable() {
		var initPage = objs.tablePage;
		var initTable = objs.tableIns;
		var res = pageCallback(1, 15);
		initTable.reload({
			data: res.data
		});
		layui.use('laypage');
		var page_options = {
			elem: 'laypageLeft',
			count: res ? res.total : 0,
			layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
			limits: [15, 30],
			limit: 15
		}
		page_options.jump = function(obj, first) {
			tablePage = obj;

			//首次不执行
			if(!first) {
				var resTwo = pageCallback(obj.curr, obj.limit);
				if(resTwo && resTwo.code == 1)
					initTable.reload({
						data: resTwo.data
					});
				else
					layer.msg(resTwo.msg);
			}
		}
		layui.laypage.render(page_options);
	}

	//表格相关操作
	table.on('tool(demo)', function(obj) {
			var data = obj.data;
			var id=data.id;
			//查看
			if(obj.event === 'detail') {
				layer.open({
					title: ['联系详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['950px', '700px'],
					end: function() {
						$('#phone').val('');
						$('#merchantName').val('');
						$('#card_front_photo').attr('src','');
						$('#card_back_photo').attr('src','');
						$('#realNamel').val('');
						$('#idCardl').val('');
						$('#userprovi').val('');
						$('#usercity').val('');
						$('#creatTimel').val('');
						$('#card_hold_photo').attr('src','');
						$('#remarks').val('');
						$('#demo111').hide();

					},
					success: function(layero, index) {
						$('#remarks').attr('disabled',true);
						var parm={
							id:id
						};
						reqAjaxAsync(USER_URL.INFORMATION,JSON.stringify(parm)).then(function(res){
							//图片加载错误处理
							$('img').error(function(){
							    $(this).attr('src', '../common/image/placeholder.png');
							});
							var data=res.data;
							if(data.cardFrontPhoto==null || data.cardFrontPhoto==''){
								$('#card_front_photo').attr('src','../common/image/placeholder.png');	
							}else{
								$('#card_front_photo').attr('src',data.cardFrontPhoto);
							}							
							if(data.cardBackPhoto==null || data.cardBackPhoto==''){
								$('#card_back_photo').attr('src','../common/image/placeholder.png');	
							}else{
								$('#card_back_photo').attr('src',data.cardBackPhoto);
							}
							$('#phonel').val(data.phone);
							$('#merchantNamel').val(data.merchantName);							
							$('#realNamel').val(data.realName);
							$('#idCardl').val(data.idCardNo);
							$('#creatTimel').val(data.createTime);
							$('#card_hold_photo').attr('src',data.licenseFront);
							$('#remarks').val(data.remarks);
							form.render();
							
							//省
							var param = {
								code: data.provinceId
							};
					
							reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(param)).then(function(req){
								if(req.code == 1) {
									$("#userprovi").val(req.data.areaname);
								} else {
									layer.msg(req.msg);
								};
							})
					
							//市
							var params = {
								code: data.cityId
							};
					
							reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(params)).then(function(reqs){
								if(reqs.code == 1) {
									$("#usercity").val(reqs.data.areaname);
								} else {
									layer.msg(reqs.msg);
								};
							})							
						})
						
						form.render()
					}
				});
				
			}  else if(obj.event === 'change') {
				layer.open({
					title: ['入驻处理', 'font-size:12px;background-color:#0678CE;color:#fff'],
					type: 1,
					btn: ['确认'],
					content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					area: ['950px', '700px'],
					end: function() {
						$('#phone').val('');
						$('#merchantName').val('');
						$('#card_front_photo').attr('src','');
						$('#card_back_photo').attr('src','');
						$('#realNamel').val('');
						$('#idCardl').val('');
						$('#userprovi').val('');
						$('#usercity').val('');
						$('#creatTimel').val('');
						$('#card_hold_photo').attr('src','');
						$('#remarks').val('');
						$('#demo111').hide();
	
					},
					success: function(layero, index) {
						$('#remarks').attr('disabled',false)
						$('div.layui-layer-page').addClass('layui-form')
						$('a.layui-layer-btn0').attr('lay-submit', '');
						$('a.layui-layer-btn0').attr('lay-filter', 'formDemo');
						var parm={
							id:id
						};
						reqAjaxAsync(USER_URL.INFORMATION,JSON.stringify(parm)).then(function(res){
							//图片加载错误处理
							$('img').error(function(){
							    $(this).attr('src', '../common/image/placeholder.png');
							});
							var data=res.data;
							if(data.cardBackPhoto==null || data.cardBackPhoto==''){
								$('#card_back_photo').attr('src','../common/image/placeholder.png');	
							}else{
								$('#card_back_photo').attr('src',data.cardBackPhoto);
							}
							$('#phonel').val(data.phone);
							$('#merchantNamel').val(data.merchantName);
							$('#card_front_photo').attr('src',data.cardFrontPhoto);
							
							$('#realNamel').val(data.realName);
							$('#idCardl').val(data.idCardNo);
							$('#creatTimel').val(data.createTime);
							$('#card_hold_photo').attr('src',data.licenseFront);
							$('#remarks').val(data.remarks);
							form.render();
							
							//省
							var param = {
								code: data.provinceId
							};
					
							reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(param)).then(function(req){
								if(req.code == 1) {
									$("#userprovi").val(req.data.areaname);
								} else {
									layer.msg(req.msg);
								};
							})
					
							//市
							var params = {
								code: data.cityId
							};
					
							reqAjaxAsync(USER_URL.PROVINCEBYID, JSON.stringify(params)).then(function(reqs){
								if(reqs.code == 1) {
									$("#usercity").val(reqs.data.areaname);
								} else {
									layer.msg(reqs.msg);
								};
							})							
						})	
						
						
					},
					yes:function(index,layero){
						form.on('submit(formDemo)',function(data){
							if(data){
								var parm={
									id:id,
									remarks:$('#remarks').val(),
									contactsUserId:userId									
								};
								reqAjaxAsync(USER_URL.EDIT,JSON.stringify(parm)).then(function(res){
									if(res.code==1){
										layer.msg(res.msg);
										layer.close(index);
										_tableInit();
									}else{
										layer.msg(res.msg);
									}
								})
							};
						});
					}
				});
			}
		});
	//点击顶部搜索出现各搜索条件
	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200);
	});

	//搜索条件进行搜索
	$('#toolSearch').on('click', function() {
		_tableInit();
	})

	//重置
	$("#toolRelize").click(function() {
		$("#phone").val("");
		$("#merchantName").val("");
		$("#realName").val("");		
		$("#provinceSelector1").val("");
		$("#citySelector1").val("").prop('disabled', true);
		$("#jurisdiction-begin").val("");
		$("#jurisdiction-end").val("");
		$("#datetimepicker1").attr("data-time","");
        $("#datetimepicker2").attr("data-time","");		
		_tableInit()
	});
	
})(jQuery);