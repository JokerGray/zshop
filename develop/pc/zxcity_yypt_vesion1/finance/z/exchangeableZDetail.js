	var totalSum = "";
	$(function() {
		table.init();
		// layer配置
		layer.config({
			extend : 'myskin/style.css', // 加载您的扩展样式
			skin : 'layer-ext-myskin'
		});
		
	});
	
	
	function callBacks(){
		var visibleColumns = $('#table').bootstrapTable('getVisibleColumns');
		var hiddenColumns = $('#table').bootstrapTable('getHiddenColumns');
		
		var subTotalAmount = 0;
		var subTotalSum = 0;
		
		//获取当前页数据;
		var currentPageData = $('#table').bootstrapTable('getData');
		//小计
		for(var i=0;i<currentPageData.length;i++){
			subTotalAmount += currentPageData[i].exchangeableTotalMoney;
			subTotalSum += currentPageData[i].giftTotalValue;
		}
	    
		subTotalAmount = subTotalAmount.toFixed(2);
		totalAmount = parseFloat(totalAmount).toFixed(2);
	    var columns = visibleColumns.length + hiddenColumns.length;
	    
	    var htmlTxt = "<tr> "
	    + "<td colspan='"+ columns +"' align='center'>"
	    + "<lable>合计：</lable>"
	    + " " + totalSum + " Z币/" + totalAmount + " 元,"
	    + "&nbsp;&nbsp;&nbsp;&nbsp;小计：" 
	    + " " + subTotalSum + " Z币/" + subTotalAmount + " 元"
	    + "</td>"
	    + "</tr>";
	    
	    $('#table').append(htmlTxt);
	}
	


	var table = new Object();
	table.init = function() {
		$('#table').bootstrapTable({
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
			sortName : "orgName", // 排序的字段
			sortOrder : "asc", // 排序方式
			contentType : "application/x-www-form-urlencoded",// 解决POST，后台取不到参数
			queryParams : table.param,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			pageList: [10],    //可供选择的每页的行数（*）
			uniqueId : "merchantId", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			showPaginationSwitch : true,
			ajaxOptions:{
	    		beforeSend: function(request){
					request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
				}
	        },
			responseHandler : function(res) {
				if(res.code == 1){
	                res.total = res.data.total;
	                res.rows = res.data.list;
	                totalAmount = res.data.amount;
	                totalSum = res.data.sum;
	                return res;
	            } else {
	            	layer.msg(res.msg);
	            }
			},
			columns : [
				{field : 'Number',title : '序号',align : "center",
					formatter : function(value, row, index) {
						return index + 1;
					}
				},
				{field : 'shopName',title : '店铺名称',align : "center"},//店铺名称
				{field : 'orgName',title : '商户名称',align : "center",
					formatter : function(res,data) {
						if (res) {
							return '<button type="button" class="btn btn-xs btn-link" onclick="openShopInfoView(\''+data.merchantId+'\')">'+res+'</button>';
						} else {
							return "-";
						}
					}
				},//商户名称
				{field : 'giftTotalValue',title : '礼物总价值(单位：Z币)',align : "center"
					/*formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return fmoney(0,2);
						}
					}*/
				}, //礼物总价值
				{field : 'exchangeableTotalMoney',title : '可兑换金额(单位：元)',align : "center",
					formatter : function(res,data) {
						if (res) {
							return fmoney(res, 2);
						} else {
							return fmoney(0,2);
						}
					}
				}, //可兑换金额
				{field : 'exchangeableTotalPiglet',title : '可兑换猪仔(单位：个)',align : "center"}, //可兑换猪仔
				{field: '',title:'商户详情',width: 100,align : "center",
	                formatter: function(res,data){
	                	return '<button onclick="getDetail('+data.merchantId+')" type="button" class="btn btn-info btn-sm edit" aria-hidden="true" style="padding-top: 0; padding-bottom: 0;"">详情</button>';
	                }
	            } //商户详情
			],
			onLoadSuccess: function (data) {
                //layer.msg('加载成功');
            	callBacks();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
		});
	};

	// 获取参数
	table.param = function(params) {
		var data = {
			liveStatus : $("#selectview2").val(),
			pageNo : params.offset / params.limit + 1,
			pageSize : params.limit
		};
		
		var res = {
			cmd : "z/selExchangeableZDetail",
			version : "1",
			data : JSON.stringify(data)
		};
		return res;
	};
	
	
	// 搜索
	$("#searchbtn").click(function() {
		$('#table').bootstrapTable('destroy');
		table.init();
		accountDynamicColumn.initCookie();
	});
	

	//导出
	$("#excelbtn").click(function() {
	    
		var btn = $("#excelbtn");
		// 改变按钮状态
		btn.attr("disabled", "disabled");
		var data = {
			liveStatus : $("#selectview2").val()
		};
		try {
			var excelUrl = reqAjax('payExcel/exportExchangeableZDetail', JSON.stringify(data));
			if (excelUrl.code != 1) {
				layer.msg(excelUrl.msg);
			} else if(excelUrl.data) {
				// 跳转到下载链接
				window.location.href = excelUrl.data;
			}
		} catch (e) {
			layer.msg("异常：" + e);
		} finally {
			// 恢复按钮状态
			btn.removeAttr("disabled");
		}
	});

	
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
		            btn:['关闭'],
		            bthAlign:'c',
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


	

	