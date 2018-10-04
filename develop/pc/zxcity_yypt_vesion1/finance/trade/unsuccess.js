$(function () {
    oTable = new TableInit();
    oTable.Init();
});

var TableInit = function () {

    var oTableInit = new Object();
    oTableInit.Init = function () {
        $('#table').bootstrapTable('destroy').bootstrapTable({
            url: '/zxcity_restful/ws/rest',
            method: 'POST',           //请求方式（*）
            striped: true,           //是否显示行间隔色
            cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            search: true,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端  
            strictSearch: true,  
            showColumns: true,     //是否显示所有的列  
            showRefresh: true,     //是否显示刷新按钮  
            minimumCountColumns: 2,    //最少允许的列数  
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: true,           //是否启用排序
            sortName : "billTime",     //排序的字段
            sortOrder: "desc",          //排序方式
            sortStable: true,
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 10,            //每页的记录行数（*）
            pageList: [10], //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            // uniqueId: "Number",           //每一行的唯一标识，一般为主键列
            // sortStable：
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            showPaginationSwitch: true,
            showFooter: false,
            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	res.rows = res.data;
                	return res;
                }
            },
            columns:[
				{ field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
                { field: 'typeStr', title:'类型',  width: 150, align : "center",
					formatter: function(res){
	            		if(res){
	            			return res;
	            		}else{
	            			return res='-';
	            		}
					} 
				},
                { field: 'accountName', title:'付款方账户', width: 100, align : "center",
                	formatter: function(res){
                		if(res){
                			return res;
                		}else{
                			return res='-';
                		}
                	}
                },
                { field: 'userName', title:'账户名称', width: 100, align : "center",
                    formatter: function(res){
                        if(res){
                        	return res;
                        }else{
                        	return res='-';
                        }
                    }
                },
                { field: 'orderNum', title:'订单号', width: 150, align : "center",
                    formatter: function(res,result){
                        if(res){
                        	return '<button type="button" class="btn btn-xs btn-link" onclick="openOrder('+ result.id + ');">'+ res+ '</button>';
                        }else{
                            return res='';
                        }
                    }
                },
                { field: 'phoneNum', title:'电话', width: 150, align : "center",
                    formatter: function(res){
                        if(res){
                        	return res;
                        }else{
                        	return res='-';
                        }
                    }
                },
                { field: 'amount', title:'交易金额', width: 150, align : "center",
                    formatter: function(money){
                        if(money){
                        	return fmoney(money, 2)
                        }else{
                        	return '-';
                        }
                    }
                },
                { field: 'createTime', title:'交易时间',  width: 160, align : "center",
                    formatter: function(res){
                        if(res){
                        	return res;
                        }else{
                        	return '-';
                        }
                    } },
                { field: 'faultTime', title:'失败时间',   width: 160, align : "center",
                    formatter: function(res){
                        if(res){
                        	return res;
                        }else{
                            return '-';
                        }
                    }
                },
                { field: 'remark', title:'备注',  width: 300, align : "center",
                    formatter: function(remark){
                        if(remark){
                            return remark;
                        }else{
                            return '-';
                        }
                    }
                }
            ],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        return {
            cmd: "payStatistics/selUnsuccessfulBusiness",
            data: JSON.stringify({
            	coupon : {
            		type : $("#regMode option:selected").val(),
            		userName : $('#accountname').val(),
            		phoneNum : $('#phone').val(),
            		startTime : $('#qBeginTime').val(),
            		endTime : $('#qEndTime').val()
            	},
            	pagination : {
            		page : params.offset / params.limit + 1,
            		rows : params.limit
            	}
            }),
            version: "1"
        }
    };
    return oTableInit;

};
//查询搜索事件
$("#searchbtn").bind("click", function(){
    oTable.Init();
    accountDynamicColumn.initCookie();
});

 // 导出
$("#excelbtn").click(
	function() {
		var btn = $("#excelbtn");
		// 改变按钮状态
		btn.attr("disabled", "disabled");
		var data = {
			coupon : {
        		type : $("#regMode option:selected").val(),
        		accountName : $('#accountname').val(),
        		phone : $('#phone').val(),
        		startTime : $('#qBeginTime').val(),
        		endTime : $('#qEndTime').val()
        	}
		};
		try {
			var excelUrl = reqAjax('payExcel/exportUnsuccessfulBusiness', JSON
					.stringify(data));
			if (excelUrl.code != 1) {
				layer.msg(excelUrl.msg);
			} else {
				// 跳转到下载链接
				window.location.href = excelUrl.data;
			}
		} catch (e) {
			alert("异常：" + e);
		} finally {
			// 恢复按钮状态
			btn.removeAttr("disabled");
		}
	});
//查询详细信息
 function openOrder(id) {
	if (id) {
		var html, res;
		// 读取前端模板 并且 ajax读取用户信息
		res = reqAjax('payStatistics/selUnsuccessfulBusinessInfo', JSON.stringify({
				id : id
		}));
		if (res.code == 1) {
			// 数据格式化
			res.data.amount = fmoney(res.data.amount, 2);
			// 加载模板
			html = template('unsuccessBusinessInfo', res.data);
			// 打开弹窗
			layer.open({
				type : 1,
				title : '失败交易详细信息',
				area : [ '910px', '500px' ],
				btn : [ '关闭'],
				bthAlign : 'c',
				content : html,
				// 弹窗加载成功的时候
				success : function() {
					$('.layui-layer-btn1').attr('id','btn2');
					// 修改按钮样式
					$('.layui-layer-btn1').attr('class','layui-layer-btn0');
				},
				btn1 : function(index, layero) {
					layer.close(index);
				}
			});
		} else {
			layer.msg(res.msg);
		}

	} else {
		layer.msg('优惠券ID异常, 请联系客服');
	}
}

