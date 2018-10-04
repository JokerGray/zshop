layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function() {
	    form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		laydate = layui.laydate,
		table = layui.table,
		laypage = layui.laypage;
		var userno = sessionStorage.getItem('userno') || ""
	//接口
	var serve = {
		resourlist: 'operations/newMerchantListPage', //(查询列表)
		province: 'operations/getProvinceList', //省市接口
		provincebyid: 'operations/getBaseAreaInfoByCode', //省'
        CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
        CONFIG: 'operations/getSysConfigList ', //获取系统信息接口(计费类型,行业类型,公众号类型)

    }
    //加载行业
    reqAjaxAsync(serve.CONFIG, "").done(function(res) {
        var rows = res.data.regularTypeList;
        //行业
        var tHtml = "<option value=''>--请选择--</option>";
        $.map(rows, function(n, index) {
            tHtml += '<option value="' + n.id + '">' + n.regularName + '</option>'
        })
        $('#regular').html(tHtml)
        //行业
        var row = res.data.merchantTrade;
        var bHtml = "<option value=''>--请选择--</option>";
        $.map(row, function(n, index) {
            bHtml += '<option value="' + n.value + '">' + n.name + '</option>'
        })
        $("#allTrade").html(bHtml);


        form.render();
    });
	var cityData = {};
    proviceSelect(serve.province,$('#provinceSelector'),$('#citySelector'));
    // CHARGELEVE
    reqAjaxAsync(serve.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
        // console.log(res);
        if(res.code ==1){
            var bHtml = "<option value=''>--请选择--</option>";
            var datas = res.data;
            $.map(datas, function(n, index) {
                bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
            })
            $("#orgLevel").html(bHtml);
            form.render();
        }else{
            layer.msg('加载商户等级失败')
        }

        // form.render();
    });

	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
        $('.tool-box-ul').find('input,select').val('')
		$('#citySelector').attr('disabled',true)
        form.render();
        tableInit();

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
	
	
	//表格操作
	table.on('tool(merchantTable)', function(obj) {
		var data = obj.data;
		//查看
		if(obj.event === 'view') {
				layer.open({
				title: ['查看', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定'],
				type: 1,
				anim: 5,
				content: $('#addLayer'),
				area: ['90%', '90%'],
				end: function() {
					addInit();
				},
				success: function(index,layero) {
					var parms = {"code":data.provinceId};
					var cityParms = {"code":data.cityId};
					reqAjaxAsync(serve.provincebyid,JSON.stringify(parms)).then(function(res){
						$('#seven').val(res.data.areaname);
					})
					reqAjaxAsync(serve.provincebyid,JSON.stringify(cityParms)).then(function(res){
						$('#eight').val(res.data.areaname);
					})
					$('#one').val(data.usercode);
					$('#two').val(data.username);
					$('#three').val(data.phone);
					$('#four').val(data.orgName);
					$('#five').val(data._isBusinessPayment);
					$('#six').val(data._regular);
				},
				yes: function(index,layero) {
					layer.close(index)
				}
			})
		}else if(obj.event === 'canAgreement'){
            TITLE[0] = '提示'
            layer.confirm("商户【"+data.orgName+"】的协议号为:"+data.merchantId, {
                title: TITLE,
                btn:'确定'
            }, function(index) {
                layer.close(index);
            })
        }
	})
	
	//清空表单
	function addInit(){
		$('#one').val("");
		$('#two').val("");
		$('#three').val("");
		$('#four').val("");
		$('#five').val("");
		$('#six').val("");
		$('#seven').val("");
		$('#eight').val("");
	}
	

	//pageCallback
	function pageCallback(index, limit, callback) {
		var parms = {
			rows: limit,
			page: index,
			t_userid: userno,
			phone:$.trim($('#phone').val()) || "",
			orgName:$.trim($('#orgName').val()) || "",
			orgLevel:$.trim($('#orgLevel').val()) || "",
			regular:$.trim($('#regular').val()) || "",
            merchantStatus:$('#locked').val(),//是否锁定
            agreement:$('#isAgreementSelector').val()||'',//签协议
            trade:$('#allTrade').val()||'',
            provinceId:$('#provinceSelector').val(),
            cityId:$('#citySelector').val()

		};
		reqAjaxAsync(serve.resourlist, JSON.stringify(parms)).then(function(res) {
			if(res.code != 1) {
				return layer.msg(res.msg);
			}
			var data = res.data;
			$.each(data, function(i, item) {
				$(item).attr('eq', (i + 1));
                switch(item.merchantStatus) {
                    case(1):
                        $(item).prop('_locked', '否')
                        break;
                    case(0):
                        $(item).prop('_locked', '是')
                        break;
                }
                //_isAgreement
                switch(item.isAgreement) {
                    case(0):
                        $(item).prop('_isAgreement', '否')
                        break;
                    case(1):
                        $(item).prop('_isAgreement', '是')
                        break;
                }
				switch (item.isBusinessPayment){
					case ('0'):
					$(item).prop('_isBusinessPayment','否')
					break;
					case ('1'):
					$(item).prop('_isBusinessPayment','是')
					break;
				}
			});
			return callback(res);
		})
	}

	//当前表格渲染
	function tableInit() {
		var _obj = _tableInit('merchantTable',[
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						width: 200
					}, {
						title: '商户名称',
						align: 'left',
						field: 'orgName',
						width: 200
					},
					{
						title: '商户等级',
						align: 'left',
						field: 'levelName',
						width: 120
					}, {
						title: '商户类型',
						align: 'left',
						field: 'regularName',
						width: 120
					}, {
						title: '商户行业',
						align: 'left',
						field: 'tradeName',
						width: 100
					}, {
						title: 'APP用户昵称',
						align: 'left',
						field: 'username',
						width: 200
					}, {
						title: '是否锁定',
						align: 'left',
						field: '_locked',
						width: 100
					},{
						title: '是否签协议',
						align: 'left',
						field: '_isAgreement',
						width: 100,
						event: 'tClick'
					}, {
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 200
					}
				]
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
			height: 'full',
			cols: cols,
			page: false,
			even: true,
			limit: 15,
			done: function(res, curr, count) {
				// do something
				$('body').on('click', '.layui-table-body table tr', function() {
						$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click')
					})
			}
		});

		//2.第一次加载
		pageCallback(1, 15, function(res) {
            console.log(res.data)
            tableIns.reload({
				data: res.data
			})
			//第一页，一页显示15条数据
			// layui.use('laypage');
			var page_options = {
				elem: pageDomName,
				count: res ? res.total : 0,
				layout: ['count', 'prev', 'page','limit', 'next', 'skip'],
				limits: [15,30],
				limit: 15
			}
			page_options.jump = function(obj, first) {
				tablePage = obj;
				//首次不执行
				if(!first) {
					pageCallback(obj.curr, obj.limit, function(resTwo) {
						tableIns.reload({
							data: resTwo.data,
							limit:obj.limit
						});
					});
				}
			}
      laypage.render(page_options);
			return {
				tablePage,
				tableIns
			};
		});
	}
})