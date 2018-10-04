(function($) {
	var userno = yyCache.get("userno") || "";
    var USER_URL = {
        RESOURLIST : 'operations/findScBackUserPageList', //(查询状态)
        INFORMATION : 'operations/findScBackUserInfo', //(获取商户员工详细信息)
        LOCKSTATUS : 'operations/changeScBackUserLockStatus'//(锁定)
		//CONFIG : 'operations/getSysConfigList'//获取系统信息接口(计费类型,行业类型,公众号类型)
    };

	var layer = layui.layer;
	var table = layui.table;
	layui.use('form', function() {
		form = layui.form;
		form.verify({
		  username: function(value, item){ //value：表单的值、item：表单的DOM对象
		    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
		      return '用户名不能有特殊字符';
		    }
		    if(/(^\_)|(\__)|(\_+$)/.test(value)){
		      return '用户名首尾不能出现下划线\'_\'';
		    }
		    if(/^\d+\d+\d$/.test(value)){
		      return '用户名不能全为数字';
		    }
		  }
		  ,pass:function(value,item){
			  	if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
			      return '密码不能有特殊字符';
			    }
			    if(/(^\_)|(\__)|(\_+$)/.test(value)){
			      return '密码首尾不能出现下划线\'_\'';
			    }
		  }
		});
	})
	


	//搜索
	$('#toolSearch').on('click', function() {
		init_obj();
	})
	//重置功能
	$('#toolRelize').on('click', function() {
		$("#usercode").val('');
		$("#username").val('');

		init_obj();
	})

	function init_obj() {
		var _obj = tableInit('demo', [
				[{
					title: '序号',
					sort: true,
					align: 'left',
					field: 'eq',
					width: 80
				}, {
					title: '手机号',
					sort: true,
					align: 'left',
					field: 'phone',
					width: 200
				}, {
					title: '商户名称',
					sort: true,
					align: 'left',
					field: 'orgName',
					width: 200
				}, {
					title: 'App用户昵称',
					sort: true,
					align: 'left',
					field: 'username',
					width: 200
				}, {
					title: '锁定状态',
					sort: true,
					align: 'left',
					templet: '#status',
					width: 200
				},{
					title: '是否删除',
					sort: true,
					align: 'left',
					field:'del',
					width: 200
				},{
					title: '操作',
					align: 'left',
					toolbar: '#barDemo',
					width: 200
				}]
			],
			pageCallback,'laypageLeft'
		)
	}
    init_obj()


	
	
	//数据处理
	function getData(url, parms) {
		var res = reqAjax(url, parms);
		var data = res.data;
		$.each(data, function(i, item) {
			$(item).attr('eq', (i + 1));
			if(item.isdel==0){
				$(item).attr('del','未删除')
			}else if(item.isdel==1){
				$(item).attr('del','离职');
			}else if(item.isdel==2){
				$(item).attr('del','删除');
			}
		});
		return res;
	}

	//pageCallback回调
	function pageCallback(index, limit) {
		var phone = $('#usercode').val();
		phone = $.trim(phone);
		var orgName = $('#username').val();
		orgName = $.trim(orgName);
		if(phone == undefined) {
			phone = ''
		}
		if(orgName == undefined) {
			orgName = ''
		}
		return getData(USER_URL.RESOURLIST, "{'page':" + index + ",'rows':" + limit + ",'phone':'" + phone + "','orgName':'" + orgName + "'}");
	}
	


    table.on('tool(demo)', function(obj) {
	    var form = layui.form;
		var data = obj.data;
		//查看
		if(obj.event === 'islock') {
			//重置密码
			var sta = ""
			if(data.locked == 1){
				sta = "启用"
			}else{
				sta = "锁定"
			}
			layer.confirm("是否"+sta+"", {
				icon: 0,
				title: "提示"
			}, function(index) {
				var parms = {
					id: data.id
				}
				reqAjaxAsync(USER_URL.LOCKSTATUS, JSON.stringify(parms)).done(function(res) {
					if(res.code == 1) {
						layer.close(index);
						layer.alert("已"+sta+"");
						init_obj()
					} else {
						layer.msg(res.msg);
					}
				})
			})
		}else if(obj.event === 'reset'){
			 var userId = data.id;
	        var data = "{'id':'"+userId+"'}"
	        layer.confirm("确认重置密码？",{icon:0,title:"提示"}, function (index) {
	            var a =reqAjax("operations/resetMerchantPassword",data);
	            if(a.code == 1){
	                layer.alert("已重置，默认密码为123456")
	            }else{
	                layer.msg(a.msg);
	            }
	            layer.close(index);
	        });
		};
	});
	

	$('#search').on('click', function() {
		$('#search-tool').slideToggle(200);
	});



	//点击变色
	$('#tableBox').on('click', 'tbody tr', function() {
		$(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');

	});

	//刷新
	function refresh() {
		location.reload();
	};
	$('#refresh').click(function() {
		refresh()
	});

	function tableInit(tableId, cols, pageCallback, test) {
		var tableIns, tablePage;
		//1.表格配置
		tableIns = table.render({
			id: tableId,
			elem: '#' + tableId,
			height: 'full-338',
			cols: cols,
			page: false,
			even: true,
			skin: 'row'
		});

		//2.第一次加载
		var res = pageCallback(1, 15);
		//第一页，一页显示15条数据
		if(res) {
			if(res.code == 1) {
				tableIns.reload({
					data: res.data
				})
			} else {
				layer.msg(res.msg)
			};
		};

		//3.left table page
		layui.use('laypage');

		var page_options = {
			elem: 'laypageLeft',
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
			};
		};

		layui.laypage.render(page_options);

		return {
			tablePage,
			tableIns
		};
	}
	


})(jQuery)