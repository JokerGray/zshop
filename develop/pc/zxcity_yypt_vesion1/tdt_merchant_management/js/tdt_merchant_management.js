(function($) {
	var page = 1;
	var rows = 15;
	var userNo = yyCache.get("userno");
	var userId = yyCache.get("userId");
	var pid = '';
	var locked = true;
	var USER_URL = {
		RESOURLIST: 'operations/getMultipleShopMerchantManageList', //(查询列表)
		LOCK: 'operations/lockedMerchant', //(锁定商户/启用商户)
		PROVINCE: 'operations/getProvinceList', //省市接口
		PROVINCEBYID: 'operations/getBaseAreaInfoByCode', //省'
		DEL:'operations/deleteScMultipleShopConfigureMerchant',//删除
		ORGLIST:'operations/getUnBindMultipleShopMerchantOrgList',//组织机构列表
		SETUP:'operations/addScMultipleShopConfigureMerchant',//设置头道汤商户
        CHARGELEVE: 'operations/chargeLevelTypeList', //（商户类型）
	};

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
	})

    // CHARGELEVE 加载商户等级
    reqAjaxAsync(USER_URL.CHARGELEVE, JSON.stringify({page:1,rows:10})).done(function(res) {
        if(res.code ==1){
            var bHtml = "<option value=''>--请选择--</option>";
            var datas = res.data;
            $.map(datas, function(n, index) {
                bHtml += '<option value="' + n.id + '">' + n.levelName + '</option>'
            })
            $("#orgLevele").html(bHtml);
        }else{
            layer.msg('加载计费类型失败')
        }

        // form.render();
    });


	//初始化加载省市
	loadProvinceAndCity({
		'parentcode': 0
	}, 1);

	//加载省市数据
	function loadProvinceAndCity(param, _sort) {
		var res = reqAjax(USER_URL.PROVINCE, JSON.stringify(param));
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
	function _tableInit(){
			//渲染表单
		var objs = tableInit('tableNo', [
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
						field: 'orgName',
						width: 150
					}, {
						title: '商户等级',
						align: 'left',
						field: 'levelName',
						width: 150
					}, {
						title: '商户行业',
						align: 'left',
						field: 'tradeName',
						width: 150
					}, {
						title: '是否锁定',
						align: 'left',
						field: 'status',
						width: 150				
					},  {
						title: '是否绑定',
						align: 'left',
						field: 'bind',
						width: 150				
					},{
						title: '操作',
						fixed: 'right',
						align: 'left',
						toolbar: '#barDemo',
						width: 250					
					}
				]
			],
	
			pageCallback, 'laypageLeft', 0
		);	
	};
	_tableInit();



    //左侧表格数据处理
    function getData(url, parms) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
            	// if(item.orgLevel==1){
            	// 	$(item).attr('level','普通商户');
            	// }else if(item.orgLevel==2){
            	// 	$(item).attr('level','合作商户');
            	// }else if(item.orgLevel==3){
            	// 	$(item).attr('level','代理商户')
            	// };
            	if(item.merchantStatus==0){
            		$(item).attr('status','暂停');
            	}else if(item.merchantStatus==1){
            		$(item).attr('status','启用')
            	};
            	if(item.isBind==0){
            		$(item).attr('bind','未绑定');
            	}else if(item.isBind==1){
            		$(item).attr('bind','已绑定')
            	}
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };

    //pageCallback回调
    function pageCallback(index, limit) {
		var phone = $.trim($("#phone").val())||"";
		var orgName = $("#orgNamee").val()||"";
		var orgLevel = $("#orgLevele").val()||"";
		var merchantStatus = $("#statusSelector").val()||"";
		var isBind = $.trim($("#bind").val())||"";
		var provinceId = $.trim($('#provinceSelector1').val())||"";
		var cityId = $.trim($('#citySelector1').val())||"";
		var param = {
			page: index,
			rows: limit,
			phone: phone, //手机号
			orgName:orgName,//商户名称
			orgLevel:orgLevel,//商户等级
			merchantStatus:merchantStatus,//是否锁定
			isBind:isBind,//是否绑定
			provinceId:provinceId,//省
			cityId:cityId //市
		}
		return getData(USER_URL.RESOURLIST, JSON.stringify(param));
    };




	//表格相关操作
	table.on('tool(tableNo)', function(obj) {
		var data = obj.data;
		var oldId = data.id;
		//查看
		 if(obj.event === 'nodetail') {
			layer.open({
				title: ['查看详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				type: 1,
				content: $('#lookDemo'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['600px', '500px'],
				closeBtn: 1,
				shade: [0.1, '#fff'],
				end: function() {
					$('#lookDemo').hide();
				},
				success: function(layero, index) {
					$('#userName').val(data.orgName);
					$('#userPhone').val(data.phone);
					$('#userTrade').val(data.tradeName);
					$('#userLevel').val(data.levelName);
				}
			})
		}else if(obj.event === 'del'){
            //删除
            layer.confirm("确认删除？",{icon:0,title:"提示"}, function (index) {
                var parms = {
                    id:oldId
                };
                reqAjaxAsync(USER_URL.DEL,JSON.stringify(parms)).done(function(res) {
                    if (res.code == 1) {
                        layer.close(index);
                        layer.msg("已删除");
                        _tableInit();
                    }else {
                        layer.msg(res.msg);
                    };
                });
            })
        }
	});
	
	
	function _tableInitLayer(){
		//渲染表单
		var objs = tableInit('tableLayer', [
				[{
						title: '序号',
						align: 'left',
						field: 'eq',
						width: 80,
						event:'changetable'
					}, {
						title: '手机号',
						align: 'left',
						field: 'phone',
						width: 150,
						event:'changetable'
					}, {
						title: '商户名称',
						align: 'left',
						field: 'orgName',
						width: 150,
						event:'changetable'
					}, {
						title: '商户等级',
						align: 'left',
						field: 'levelName',
						width: 150,
						event:'changetable'
					}, {
						title: '商户行业',
						align: 'left',
						field: 'tradeName',
						width: 150,
						event:'changetable'
					}, {
						title: '是否锁定',
						align: 'left',
						field: 'status',
						width: 150,
						event:'changetable'
					}
				]
			],
	
			pageCallbackLayer, 'laypageLeftLayer', 0
		);	
	};
	
	    //pageCallback回调
    function pageCallbackLayer(index, limit) {
		var phone = $.trim($("#phoneLayer").val())||"";
		var orgName = $("#orgNameLayer").val()||"";
		var param = {
			page: index,
			rows: limit,
			phone: phone, //手机号
			orgName:orgName//商户名称
		}
		return getDataLayer(USER_URL.ORGLIST, JSON.stringify(param));
    };
    //数据处理
    function getDataLayer(url, parms) {
        var res = reqAjax(url, parms);
        if(res.code==1){
            var data = res.data;
            $.each(data, function(i, item) {
                $(item).attr('eq', (i + 1));
                // if(item.orgLevel==1){
                // 	$(item).attr('level','普通商户');
                // }else if(item.orgLevel==2){
                // 	$(item).attr('level','合作商户');
                // }else if(item.orgLevel==3){
                // 	$(item).attr('level','代理商户')
                // };
                if(item.merchantStatus==0){
                	$(item).attr('status','暂停');
                }else if(item.merchantStatus==1){
                	$(item).attr('status','启用');
                };
            });

            return res;
        }else{
            layer.msg(res.msg);
        };

    };
	//添加头道汤商户
	$('#addMervhant').click(function(){
		var layerId="";
		layer.open({
			title:['新增','font-size:12px;background-color:#0678CE;color:#fff'],
			type:1,
			content:$('#agentAdd'),
			area:['1200px','500px'],
			btn:['确定','取消'],
			shade:[0.1,'#fff'],
			end:function(){
				$('#phoneLayer').val('');
				$('#orgNameLayer').val('');
//				_tableInitLayer();
				$('#agentAdd').hide();
			},
			success:function(Layero,index){
				_tableInitLayer();
				table.on('tool(tableLayer)',function(objs){
					if(objs.event=='changetable'){
						layerId=objs.data.merchantId	
					}
				});
			},
			yes:function(index,Layero){
				if(layerId==""){
					layer.msg('请选择商户');
					return;
				}else{
					var parm={
						merchantId:layerId
					};
					reqAjaxAsync(USER_URL.SETUP,JSON.stringify(parm)).then(function(res){
						if(res.code==1){
							layer.msg(res.msg);
							layer.close(index);
							_tableInit();
						}else{
							layer.msg(res.msg)
						}
					})
				};
			}
		})
	});
	//点击搜索Layer
	$('#toolSearchLayer').click(function(){
		_tableInitLayer();
	});
	//点击重置Layer
	$('#toolRelizeLayer').click(function(){
		$('#phoneLayer').val('');
		$('#orgNameLayer').val('');
		_tableInitLayer();
	})
	//点击表格变色
	$('body').on('click', '.layui-form .layui-table-body tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
	});
	
	//textarea点击再次激活layer
	$('#yyname').on('click', function() {
		setTimeout(reClick("#yyname"), 500);
	})
	
	$('#payyyname').on('click', function() {
		setTimeout(reClick("#payyyname"), 500);
	})

	//商户新增


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
		$('#orgNamee').val("");
		$('#orgLevele').val("");
		$("#statusSelector").val("");
		$("#bind").val("");
		$("#provinceSelector1").val("");
		$("#citySelector1").val("").prop('disabled', true);		
		_tableInit();
	});
	

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
            height:'full-349',
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
        };

        //3.left table page
        layui.use('laypage');

        var page_options = {
            elem: test,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [15, 30],
            limit: 15
        };
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
        };


        layui.laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    };

})(jQuery);