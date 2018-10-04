var oTable;
var amountUntilNow = "";

$(function () {
/*	//获取跳转前页面传参
	var startTime = getRequestAddressUrlParameter("profitType");
	var endTime = getRequestAddressUrlParameter("endTime");

    // 设置本月起止日期
    $('#qBeginTime').val(startTime);
    $('#qEndTime').val(endTime);*/
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
              sortName: "Number",     //排序的字段
              sortOrder: "asc",          //排序方式
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
                	profitSum = res.data.profitSum;
                	extractSum = res.data.extractSum;
                	restExtractSum = parseFloat(profitSum) - parseFloat(extractSum);
                	//保留两位小数
                	profitSum = profitSum.toFixed(2);
                	extractSum = extractSum.toFixed(2);
                	restExtractSum = restExtractSum.toFixed(2);
                	//截止当前未提取金额
                	amountUntilNow = res.data.amountUntilNow;
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
				{ field: 'profitTypeStr', title:'收入类型', width: 150, align : "center",
                    formatter: function(res){
                        if(res==null){
                            return res="-";
                        }else{
                            return res;
                        }
                    }
                },//收入类型 1 转盘/2 智币销售/3 直播预存/4 专业制作/5 商户升级
				{ field: 'totalSum', title:'收入总计', width: 150, align : "center",
                    formatter: function(res){
                    	if(res==null){
                            return res="-";
                        }else{
                            return fmoney(res, 2);
                        }
                    }
                },//月收入
                { field: 'totalExtract', title:'已提取金额', width: 150, align : "center",
                    formatter: function(res){
                    	if(res==null){
                            return res="-";
                        }else{
                        	return fmoney(res, 2);
                        }
                    }
                }, //月提取金额
                { field: 'restableExtract', title:'可提取金额', width: 150, align : "center",
                    formatter: function(res){
                    	if(res==null){
                            return res="-";
                        }else{
                        	return fmoney(res, 2);
                        }
                    }
                },//未提取金额
                {
					field:'_z', title: '操作', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getExtractDetail(\''+row.profitType+'\', \''+row.profitTypeStr+'\', \''+(index+1)+'\')">操作记录</button>';
						return btn;
					}
				}//操作
			],
            onLoadSuccess: function () {
                //layer.msg('加载成功');
            	$('#amount').text(amountUntilNow);
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
        var cmd = "profitExtractLog/selExtractInfoByMonth";
        var version = "1";
        var profitType = getRequestAddressUrlParameter("profitType");
        var year = $("#startTime").val();
        
        var jsonData = {profitType: profitType, year: year};
   /*     var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var startTimes=$('#qBeginTime').val();
        var endTimes=$('#qEndTime').val();*/

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
        accountDynamicColumn.initCookie();
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
    
    function getExtractDetail(profitType, profitTypeStr, month){
    	var year = $('#startTime').val();
		var name = profitTypeStr + "收入提取明细";
		var url = "finance/profitExtract/profitExtractLog.html?profitType="+profitType+"&year="+year+"&month="+month;
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
	    + "<td align='center'>"+profitSum+"</td>"
	    + "<td align='center'>"+extractSum+"</td>"
	    + "<td align='center'>"+restExtractSum+"</td>"
	    + "<td align='center'>——</td>"
	    + "</tr>";

    	$('#table').append(htmlTxt);
	}
    
