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
		dataList: 'payTransactionLog/zbConsumeList', //(查询列表)
		exportExcel: 'payExcel/exportZbConsumeList'//(下载地址)
	}

	//日期控件
	var startDate = laydate.render({
		elem: '#startDate',
		min:"1970-1-1",//设置min默认最小值  
		done: function(value,dates) {
			$('.startDate').eq(0).attr('data-date', value)
			if(JSON.stringify(dates) == "{}"){
				endDate.config.min ={ 
	                 year:1970,   
	                 month:1, //关键  
	                 date: 1,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}else{
				endDate.config.min ={ 
	                 year:dates.year,   
	                 month:dates.month-1, //关键  
	                 date: dates.date,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}
		}
	});

	var endDate = laydate.render({
		elem: '#endDate',
		max:"2099-12-31",//设置一个默认最大值 
		done: function(value,dates) {
			$('.endDate').eq(0).attr('data-date', value)
			if(JSON.stringify(dates) == "{}"){
				startDate.config.max ={ 
	                 year:2099,   
	                 month:12, //关键  
	                 date: 31,   
	                 hours: 0,   
	                 minutes: 0,   
	                 seconds : 0  
		        }; 
			}else{
				startDate.config.max={  
		        year:dates.year,   
	                month:dates.month-1,//关键   
	                date: dates.date,   
	                hours: 0,   
	                minutes: 0,   
	                seconds : 0  
		       }   
			}
		}
	});
	
	//接受url传参
	var state = getRequestAddressUrlParameter("state"),
	    startTime = getRequestAddressUrlParameter("startTime"),
	    endTime = getRequestAddressUrlParameter("endTime"),
	    showhide = getRequestAddressUrlParameter("showhide");
	
	$('#selectview2').val(state);
	// 设置本月起止日期
    $('#startDate').val(startTime);
    $('#endDate').val(endTime);
    if(showhide && showhide){
    	$('#cType').hide();
    }
	
	//搜索
	$('#searchBtn').on('click', function() {
		tableInit();
	})
	//重置
	$('#resetBtn').on('click', function() {
		location.reload()
	})



	//版块渲染
	function plate(){
		var param = '{"module":{"status":"1"}}';
		reqAjaxAsync('commonConfig/selBasePublicModule',param).done(function(res) {
			var row = res.data;
			//版块
			var bHtml ='<option value="">--全部--</option>';
			$.map(row, function(n, index) {
				bHtml += '<option value="' + n.moduleNo + '">' + n.moduleName + '</option>'
			})
			$("#selectview").html(bHtml);
			form.render();
		});				
	};
	plate()
	
	//封装请求参数
	function getSearchParam(index, limit){
		var accountName = $('#accountnamer').val();
	    var startTimes = $('#startDate').val();
	    var endTimes = $('#endDate').val();
	    var moduleNo = $('#selectview').val();
	    var goodsName = $('#goodsName').val();
	    var state = $('#selectview2').val();
	    var showhide = getRequestAddressUrlParameter("showhide");
		
	    var params = {
	    	pageNo: index,
	    	pageSize: limit,
	    	goodsName: goodsName,
    		startTime: startTimes,
    		endTime: endTimes,
    		rechargeModular: moduleNo,
    		accountName: accountName,
    		state: state,
    		showhide: showhide
	    }
	    return JSON.stringify(params);
	}
	
	//导出excel
	$('#exportBtn').on('click', function(){
		var parms = getSearchParam();
		downloadFile(server.exportExcel, parms);
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

	
	

		//pageCallback
		function pageCallback(index, limit, callback,count) {
			var parms = getSearchParam(index, limit);
			//小计
			function count(arr){
				var subtotal = 0;
				for(var i = 0; i < arr.length; i++){
					subtotal += arr[i].subTotal;
				}
				return subtotal;
			}
			
			reqAjaxAsync(server.dataList, parms).then(function(res) {
				if(res.code != 1) {
					return layer.msg(res.msg);
				}
				var resData = res.data
				var data = res.data.list;
				var subtotal = count(data);
				$('#amount').html('合计 : '+resData.sum+' Z币,&nbsp;&nbsp;&nbsp;&nbsp; 小计: '+subtotal+' Z币');
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
						title: '订单号',
						align: 'center',
						field: 'orderNo'
					}, {
						title: '所属版块',
						align: 'center',
						field: 'moduleName'
					}, {
						title: '账户名称',
						align: 'center',
						field: 'accountName'
					}, {
						title: '电话号码',
						align: 'center',
						field: 'phone'
					}, {
						title: '注册时间',
						align: 'center',
						field: 'createTime'
					}, {
						title: '账户类别',
						align: 'center',
						field: 'regMode'
					}, {
						title: '商品名称',
						align: 'center',
						field: 'goodsName'
					}, {
						title: '商品价格(单位：Z币)',
						align: 'center',
						field: 'goodsPrice'
					},{
						title: '数量',
						align: 'center',
						field: 'number'
					},{
						title: '小计(单位：Z币)',
						align: 'center',
						field: 'subTotal'
					},{
						title: '使用时间',
						align: 'center',
						field: 'transTime'
					}]
				],
				pageCallback, 'layTablePage'
			)
			//return _obj.cols;
		}
		tableInit();

		/*tableArr = tableInit();
	
		var Dynamic = function() {};
		Dynamic.prototype.creatBtn = function() {
			$('<button class="layui-btn my-btn add" lay-event="set" id="dtHead" style="margin-right:10px">设置</button>').appendTo($('.tool-add-box'));
			$('#dtHead').on('click', function() {
				dynamic.setLayer()
			})
		}
	
		Dynamic.prototype.checkbox = "";
	
		Dynamic.prototype.getCols = function(t) {
			var that = this;
			t = t[0];
			that.checkbox += '<div class="layui-form" id="layuiCheck" style="padding: 40px;"  lay-filter="mytest">'
			t.forEach(function(c, i, a) {
				that.checkbox += '<div class="my-layui-checkbox" style="float: left;padding: 20px;"><input type="checkbox" name=' + c.field + "|" + c.title + ' title=' + c.title + '><div class="layui-unselect layui-form-checkbox" lay-skin=""><span>' + c.title + '</span><i class="layui-icon"></i></div></div>'
			})
			that.checkbox += '</div>'
			return this.checkbox
		}
	
		Dynamic.prototype.initLayer = function() {
			$("div.layui-layer-page").addClass("layui-form");
			$("a.layui-layer-btn0").attr("lay-submit", "");
			$("a.layui-layer-btn0").attr("lay-filter", "formtest");
			form.render(null, 'mytest');
		}
	
		Dynamic.prototype.endLayer = function() {
			this.checkbox = ""
		}
	
		Dynamic.prototype.yesLayer = function() {
			form.on('submit(formtest)', function(data) {
				if(JSON.stringify(data.field) != "{}") {
					var obj = [];
					var j = data.field;
					for(var i in j) {
						var arr = i.split('|');
						Array.prototype.push.call(obj, {
							title: arr[1],
							align: "left",
							field: arr[0]
						});
					}
					_tableInit('merchantTable', [obj], pageCallback, 'layTablePage')
					layer.closeAll();
				} else {
					layer.msg('请至少选择一项')
				}
			})
		}
	
		Dynamic.prototype.setLayer = function() {
			var that = this;
			layer.open({
				title: ['设置', 'font-size:12px;background-color:#424651;color:#fff'],
				btn: ['确定', '取消'],
				type: 1,
				anim: 5,
				content: dynamic.getCols(tableArr),
				area: ['1000px'],
				end: function() {
					that.endLayer();
				},
				success: function(index, layero) {
					that.initLayer();
				},
				yes: function(index, layero) {
					that.yesLayer();
				},
				btn2: function(index, layero) {
					that.endLayer();
				}
			})
		}
	
		var dynamic = new Dynamic();
		dynamic.creatBtn();*/


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
			/*return {
				cols:cols
			}*/
		}
		
});