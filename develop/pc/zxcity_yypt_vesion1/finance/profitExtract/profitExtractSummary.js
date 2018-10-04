var oTable;
var	profitSum = '';
var	extractSum = '';
var	restExtractSum = '';

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
            search: true,
            searchOnEnterKey: true,
            searchText: '',
            pagination: true,          //是否显示分页（*）
            sortable: false,           //是否启用排序
            sortName : "Number",     //排序的字段
            sortOrder: "asc",          //排序方式
            contentType: "application/x-www-form-urlencoded",//解决POST，后台取不到参数
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,            //初始化加载第一页，默认第一页
            pageSize: 10,            //每页的记录行数（*）
            pageList: [10], //可供选择的每页的行数（*）
            // strictSearch: true,
            // clickToSelect: true,        //是否启用点击选中行
            // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "profitType",           //每一行的唯一标识，一般为主键列
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "asc",

            showPaginationSwitch: true,

            ajaxOptions:{
          	  beforeSend: function(request){
      				request.setRequestHeader("apikey", yyCache.get("apikey") == null ? "test" : yyCache.get("apikey"));
      			}
            },
            responseHandler:function(res){
                if(res.code == 1){
                	// 获取服务端返回的list
                	// 获取服务端返回的合计金额(sum)
                	res.total = res.data.total;
                	//求各字段数据之和
                	profitSum = res.data.profitSum;
                	profitSum = parseFloat(profitSum).toFixed(2);
                	extractSum = res.data.extractSum;
                	extractSum = parseFloat(extractSum).toFixed(2);
                	restExtractSum = parseFloat(profitSum) - parseFloat(extractSum);
                	restExtractSum = restExtractSum.toFixed(2);
                	//添加'合计'行数据
                	/*var line = {profitTypeStr: '——' , totalSum: profitSum, totalExtract: extractSum, restableExtract: restExtractSum, _z: '——'};
                	var arr = res.data.list;
                	arr.push(line);
                	res.rows = arr;*/
                	
                	res.rows = res.data.list;
                    return res;
                }
            },

            columns: [
				{
					field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'profitTypeStr', title:'收入类型', width: 150, align : "center",
					formatter: function(value,row,index){
						var btn = '<button type="button" class="btn btn-xs btn-link" onclick="getTypeInfo(\''+row.profitType+'\', \''+row.restableExtract+'\',\''+row.profitTypeStr+'\')">'+row.profitTypeStr+'</button>';
						return btn;
					}
				},//收入类型
				{ field: 'totalSum', title:'收入总计',  width: 150, align : "center",
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},//收入总计
				/*	{ field: 'lastMonthTotalSum', title:'上月收入',  width: 150, align : "center",
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},*///上月收入
				{ field: 'totalExtract', title:'已提取金额',  width: 150, align : "center",
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},//全部已提金额
				{ field: 'restableExtract', title:'可提取金额',  width: 150, align : "center",
					formatter: function(res){
						if(res==null){
							return fmoney(0, 2);
						}
						return fmoney(res, 2);
					}
				},//剩余可提取
				{
					field:'_z', title: '操作', align: 'center', width: 160,
					formatter: function(value,row,index){
						var btn1 = '<button type="button" class="btn btn-xs btn-link" onclick="openExtract('+row.profitType+')">提取</button>';
						var btn2 = '<button type="button" class="btn btn-xs btn-link" onclick="getExtractDetail(\''+row.profitType+'\', \''+row.profitTypeStr+'\')">历史记录</button>';
						return btn1 + '     ' + btn2;
					}
				}
			],
            onLoadSuccess: function (data) {
				//合计
            	addLine();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "profitExtractLog/selProfitExtractSummary";
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
		
		var data = {
				pageNo : pageNo,
				pageSize : pageSize
	    };
		
        return {
            cmd: cmd,
            data: JSON.stringify(data),
            version: version
        }
    };
    return oTableInit;

};
	

	//收入提取按钮
	function openExtract(profitType){
		var tempRow = $('#table').bootstrapTable('getRowByUniqueId', profitType);
		layer.open({
		  type: 1,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : tempRow.profitTypeStr + " 收入提取",
		  content: template('extractTpl',{
			  row: tempRow
		  }),
		  success: function(layero, index){
			  $('#extractBtn').on('click', function(){
					
				  	var userId = yyCache.get("userId");
				  	var username = yyCache.get("pcNickname");
					var amount = $('#extractMoney').val();
					var operator = $('#yyUserName').val();
					var platformType = $("input[name='audit']:checked").val();
					if(!(amount && amount)){
						layer.msg('请填写提取金额');
						return;
					}else if(!amountCheck(amount)){
							layer.msg('请正确输入金额');
							return;
					}else if(amount > tempRow.restableExtract){
						layer.msg('提取金额超过剩余可提取的金额,请重新输入');
						return;
					}else if(amount <= 0 ){
						layer.msg('提取金额必须大于0');
						return;
					}else if(!(operator && operator)){
						layer.msg('提取人不能为空');
						return;
					}else if(!(platformType && platformType)){
						layer.msg('取提资金池不能为空');
						return;
					}
					
					var data = {
						t:{
							extractType: tempRow.profitType,
							extractMoney:amount,
							yyUserName:operator,
							platformType:platformType,
							yyName:username,
							yyUserId:userId
						}
					};
					
					var res = reqAjax('profitExtractLog/addProfitExtractLog', JSON.stringify(data));
					if(res.code == 1){
						layer.msg("成功！");
						layer.close(index);
						oTable.Init();
					}else{
						layer.msg(res.msg);
					}
			});
		  }
		});
	}
	
	function amountCheck(obj){
		if( /^(0{1}|[1-9]\d*)(\.\d{0,2})?$/.test(obj)){
     
			if(obj < 0) {
				return false;
			}
			return true;
		}
		return false;

	}
	
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
    	
	    /*var tab = document.getElementById('table');
	    var trs = tab.getElementsByTagName('tr');
	    var lastLine = trs[(trs.length-1)];
	    
	    var tds = lastLine.getElementsByTagName('td');
	    //tds[0].innerText = '合计';
	    tds[0].innerHTML = '<label class="notice">合计</label>';
	    tds[1].innerText = '——';
	    tds[5].innerText = '——';*/
	}
	
	function getTypeInfo(profitType, restableExtract, profitTypeStr){
		var name = profitTypeStr + "收入提取月统计";
		var url = "finance/profitExtract/profitExtractMonthlyInfo.html?profitType="+profitType+"&amount="+restableExtract;
		addTabs(url, name);	
	}
	
	function getExtractDetail(profitType, profitTypeStr){
		var name = profitTypeStr + "收入提取明细";
		var scale = 'all';
		var url = "finance/profitExtract/profitExtractLog.html?profitType="+profitType+"&scale="+scale;
		addTabs(url, name);	
	}
	