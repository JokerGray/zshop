var oTable;
var amountUntilNow = "";
$(function () {

	var date = new Date();
	$('#startTime').val(date.getFullYear());
	
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
              sortable: false,           //是否启用排序
              sortName: "",     //排序的字段
              sortOrder: "desc",          //排序方式
              contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
              queryParams: oTableInit.queryParams,//传递参数（*）
              sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
              pageNumber: 1,            //初始化加载第一页，默认第一页
              pageSize: 12,            //每页的记录行数（*）
              pageList: [12], //可供选择的每页的行数（*）
              // strictSearch: true,
              // clickToSelect: true,        //是否启用点击选中行
              // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
              cardView: false,          //是否显示详细视图
              detailView: false,          //是否显示父子表
              showPaginationSwitch: true,

              ajaxOptions:{
            	  beforeSend: function(request){
        				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
        			}
              },
            responseHandler:function(res){
                if(res.code == 1){
                    res.total = res.data.total;
                	//求各字段数据之和
                    totalStoreSum = res.data.totalStoreSum;
                    shouldStoreSum = res.data.shouldStoreSum;
                    notStoreSum = res.data.notStoreSum;
                    //保留两位小数
                    totalStoreSum = fmoney(totalStoreSum, 2);
                    shouldStoreSum = fmoney(shouldStoreSum, 2);
                    notStoreSum = fmoney(notStoreSum, 2);
                    //截止当前未存手续费
                    amountUntilNow = res.data.amountUntilNow;
                    amountUntilNow = parseFloat(amountUntilNow).toFixed(2);
                    
                    res.rows = res.data.list;
                    return res;
                }
            },
            columns: [
				{
                field: 'Number', title:'月份', align : "center", width: 80, sortable: true,
					formatter: function(value,row,index){
						return index+1;
					}
				},//月份
				{ field: 'type', title:'类型', width: 150, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res="-";
                        }else{
                            return res;
                        }
                    }
                },//类型  支付宝手续费
				{ field: 'shouldStore', title:'应存手续费', width: 150, align : "center",
                	formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
                },//应存手续费
                { field: 'totalStore', title:'已存手续费', width: 150, align : "center",
                	formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
                }, //已存手续费
                { field: 'notStore', title:'未存手续费', width: 150, align : "center",
                	formatter: function(value,row,index){
						return fmoney((row.shouldStore-row.totalStore), 2);
					}
                },//未存手续费
                {
					field:'_z', title: '操作', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getStoreDetail(\''+(index+1)+'\')">操作记录</button>';
						return btn;
					}
				}//操作
			],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            	$("#amount").text(amountUntilNow);
            	addLine();
            	
            	//获取当前年、月
            	var date = new Date();
            	var thisYear = date.getFullYear();
            	var thisMonth = date.getMonth();
            	//当前月数据高亮显示
            	if($("#startTime").val() == thisYear){
            		var table = document.getElementById('table');
        			var trs = table.getElementsByTagName('tr');
        			var thisLine = trs[(thisMonth + 1)];
        			thisLine.className = "highLight";
            	}
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };
    
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "scAlipayPoundage/selPoundageInfoByMonth";
        var version = "1";
        var year = $("#startTime").val();
        
        var jsonData = {year: year};

        return {
            cmd: cmd,
            data: JSON.stringify(jsonData),
            version: version
        }
    };
    return oTableInit;

};
    //查询搜索事件
    $("#searchBtn").bind("click", function(){
        oTable.Init();
        //accountDynamicColumn.initCookie();
    });

    //根据参数名获取地址栏URL里的参数
    function getUrlParams(name){
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null){
    		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
    		return decodeURI(decodeURIComponent(r[2]));
    	}
    	return "";
    }
    
    function getStoreDetail(month){
    	var year = $('#startTime').val();
		var name = "支付宝手续费存入明细";
		var url = "finance/profitExtract/alipayPoundageStoreLog.html?year="+year+"&month="+month;
		addTabs(url, name);	
	}
    
    $('#startTime').datetimepicker({
    	language:'zh-CN',//中文
    	format: "yyyy",//格式 yyyy-mm-dd hh:mm:ss
    	endDate : new Date(),
    	clearBtn:false,// 自定义属性,true 显示 清空按钮 false 隐藏 默认:true
        //weekStart: 1,
        //todayBtn:false,
    	autoclose: 1,
    	todayHighlight: 1,
    	startView: 4,
    	minView: 4,
    	forceParse: 0,
    	showMeridian: 1
    }).on('changeDate', function (e) {
    	/*startTime=$('#startTime').val();
    	if(startTime>endTime){
    		layer.msg('开始时间不能大于结束时间');
    		$('#startTime').val("");
    		return false;
    	}*/
    });   
    
	function addLine(){
    	var htmlTxt = "<tr> "
	    + "<td align='center'><label class='notice'>合计</label></td>"
	    + "<td align='center'>——</td>"
	    + "<td align='center'>"+shouldStoreSum+"</td>"
	    + "<td align='center'>"+totalStoreSum+"</td>"
	    + "<td align='center'>"+notStoreSum+"</td>"
	    + "<td align='center'>——</td>"
	    + "</tr>";

    	$('#table').append(htmlTxt);
	}
    
