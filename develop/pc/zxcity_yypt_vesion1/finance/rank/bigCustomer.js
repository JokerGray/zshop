(function($){
    var REQUEST_URL = {
        'province': 'operations/getProvinceList',//省市接口
        'query' : 'ranking/selRankingConsumer', //查询
        'export' : 'ranking/selRankingConsumer' //导出
    };

    var pageNo = 1, pageSize = 10;

    //加载省市数据
    function loadProvinceAndCity(param, _sort){
      var res = reqAjax(REQUEST_URL['province'], JSON.stringify(param));
      if(res.code == 1){
          var sHtml = '<option value="">---请选择---</option>';
          for(var i=0, len=res.data.length; i<len; i++){
              sHtml += '<option value="'+res.data[i].code+'">'+res.data[i].areaname+'</option>'
          }
          _sort = _sort ? _sort : 1;
          if(param['parentcode'] == 0){
              proviceArr = res.data;
              $("#provinceSelector"+_sort).html(sHtml);

          }else{
              $("#citySelector"+_sort).html(sHtml);
              $("#citySelector"+_sort).prop("disabled", false);
          }
      }
    }

    //根据省的选择切换对应的市内容
    $("#provinceSelector1").change(function(){
      var _value = $(this).val();
      if(_value == ""){
          $("#citySelector1").prop("disabled", true).find("option:eq(0)").prop("selected", true);
      }else{
          loadProvinceAndCity({'parentcode': _value}, 1);
      }
    });

    //校验输入
	function chenkInput() {
		var totalMoney = $("#expense").val() ? $("#expense").val() : null;
		var accountBalance = $("#balance").val() ? $("#balance").val() : null;
		if(totalMoney && !is_amount(totalMoney) ){
			$("#expense").val('');
			layer.msg("请输入正确金额!");
			return true;
		}
		if(accountBalance && !is_amount(accountBalance) ){
			$("#balance").val('')
			layer.msg("请输入正确金额!");
			return true;
		}
		return false;
	}
    
    
    //列表数据加载
    function loadListData(){
    	if(chenkInput()){
    		return;
    	}
    	$('#table').bootstrapTable('destroy').bootstrapTable({
			url : '/zxcity_restful/ws/rest',
			method : 'POST', // 请求方式（*）
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			search : true, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端
			strictSearch : true,
			showColumns : true, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			searchOnEnterKey : true,
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			sortName : "createTime", // 排序的字段
			sortOrder : "desc", // 排序方式
			contentType : "application/x-www-form-urlencoded",// 解决POST，后台取不到参数
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			pageList: [10],    //可供选择的每页的行数（*）
			uniqueId : "createTime", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			showPaginationSwitch : true,
            ajaxOptions:{
            	  beforeSend: function(request){
        				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
        			}
              },
			responseHandler : function(res) {
				if (res.code == 1) {
					res.rows = res.data;
					return res;
				}
			},
			columns : [
					{
						field : 'Number',
						title : '序号',
						align : "center",
						width : 50,
						formatter : function(value, row, index) {
							return index + 1;
						}
					},
					{
						field : 'userName',
						title : '客户名称',
						align : "center",
						width : 100,
						formatter : function(res) {
							if (res) {
								return res;
							} else {
								return "-";
							}
						}
					},
					{
						field : 'phone',
						title : '电话号码',
						align : "center",
						width : 100,
						formatter : function(res) {
							if (res) {
								return res;
							} else {
								return "-";
							}
						}
					}, {
						field : 'createTime',
						title : '注册时间',
						align : "center",
						width : 100,
						formatter : function(res) {
							if (res) {
								return res.split('.')[0];
							} else {
								return "-";
							}
						}
					}, {
						field : 'rechargeTime',
						title : '充值次数',
						align : "center",
						width : 50,
						formatter : function(num) {
							if (num || num == 0) {
								return num;
							} else {
								return "-";
							}
						}
					}, {
						field : 'totalMoney',
						title : '消费金额',
						align : "center",
						width : 80,
						formatter : function(money) {
							if (money || money == 0) {
								return fmoney(money, 2);
							} else {
								return "-";
							}
						}
					}, {
						field : 'accountBalance',
						title : '余额',
						align : "center",
						width : 80,
						formatter : function(money) {
							if (money || money == 0) {
								return fmoney(money, 2);
							} else {
								return "-";
							}
						}
					}, {
						field : 'months',
						title : '月份',
						align : "center",
						width : 80,
						formatter : function(res) {
							if (res) {
								return res;
							} else {
								return "-";
							}
						}
					}, {
						field : 'residence',
						title : '区域',
						align : "center",
						width : 80,
						formatter : function(res) {
							if (res) {
								return res;
							} else {
								return "-";
							}
						}
					}
			]
		});
    }
    //获取查询参数
    queryParams = function(params) {
    	
    	
		return {
			cmd : REQUEST_URL['query'],
			version : 1,
			data : JSON.stringify({
				dataTable : {
					province : $("#provinceSelector1").val(),
					cityId : $("#citySelector1").val(), 
					totalMoney : $("#expense").val() ? $("#expense").val() : null,
					accountBalance : $("#balance").val() ? $("#balance").val() : null
				},
				pagination : {
					page : params.offset / params.limit + 1,
					rows : params.limit
				},
				type : 'bigCustomer'
			})
		};
	}

    //查询
    $("#searchbtn").click(function(){
    	var province = $("#provinceSelector1").val();
		var cityId = $("#citySelector1").val();
    	if(province && (!cityId)){
    		layer.msg("请选择对应的市!");
    		return;
    	}
        loadListData();
        accountDynamicColumn.initCookie();
    });
    
    //导出
    $("#excelbtn").click(
		function() {
			var btn = $("#excelbtn");
			// 改变按钮状态
			btn.attr("disabled", "disabled");
			try {
				var excelUrl = reqAjax(REQUEST_URL['export'], JSON
						.stringify({
							dataTable : {
								province : $("#provinceSelector1").val(),
								cityId : $("#citySelector1").val(), 
								totalMoney : $("#expense").val(),
								accountBalance : $("#balance").val()
							},
							exportType : 'bigCustomer'
						}));
				if (excelUrl.code != 1) {
					layer.msg(excelUrl.msg);
				} else if(excelUrl.data) {
					// 跳转到下载链接
					window.location.href = excelUrl.data;
				}
			} catch (e) {
				alert("异常：" + e);
			} finally {
				// 恢复按钮状态
				btn.removeAttr("disabled");
			}
		}
	);

    //初始化
    $(function(){
        loadProvinceAndCity({'parentcode':0}, 1);
        loadListData();
    });

})(jQuery);
