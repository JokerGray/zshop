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
				dataList: 'payTransactionLog/reprintDetail', //(查询列表)
				exportExcel: 'payExcel/exportReprintDetail'//(下载地址)
			}
			
			//日期控件
			laydate.render({
				elem: '#startDate',
				done: function(value) {
					$('.startDate').eq(0).attr('data-date', value)
				}
			});
			laydate.render({
				elem: '#endDate',
				done: function(value) {
					$('.endDate').eq(0).attr('data-date', value)
				}
			});
			
			//接收url传参, 初始化日期控件
			var startTime = getRequestAddressUrlParameter("startTime");
			var endTime = getRequestAddressUrlParameter("endTime");
			$("#startDate").val(startTime);
			$("#endDate").val(endTime);
			
			//搜索
			$('#searchBtn').on('click', function() {
				tableInit();
			})
			//重置
			$('#resetBtn').on('click', function() {
				location.reload()
			})
			
			
			//导出excel
			$('#addButton').on('click', function(){
					var parms = {
						userName: $('#accountnamer').val() || "",
						startTime: $("#startDate").val(),
						endTime: $("#endDate").val()
					};
					downloadFile(server.exportExcel,JSON.stringify(parms))
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
			function pageCallback(index, limit, callback) {
				var parms = {
					pageSize: limit,
					pageNo: index,
					userName: $('#accountnamer').val() || "",
					startTime: $("#startDate").val(),
					endTime: $("#endDate").val()
				};
				reqAjaxAsync(server.dataList, JSON.stringify(parms)).then(function(res) {
					if(res.code != 1) {
						return layer.msg(res.msg);
					}
					var resData=res.data;
					$('#amount').text('合计 : '+resData.sum+'')
					var data = res.data.list;
					$.each(data, function(i, item) {
						$(item).attr('eq', (i + 1));
						
						//格式化字符
						$(item).attr('taskPrice', fmoney(item.taskPrice, 2));
						$(item).attr('taskTotalMoney', fmoney(item.taskTotalMoney, 2));
						//转中文字符
						if(item.taskStatus == 1){
							$(item).attr('taskStatus', '进行中');
						}else if(item.taskStatus == 2){
							$(item).attr('taskStatus', '已结束');
						}else if(item.taskStatus == 3){
							$(item).attr('taskStatus', '待发布');
						}
						
					});
					return callback(res);
				})
			}

			//当前表格渲染
			function tableInit() {  
				var _obj = _tableInit('merchantTable', [
						[{
							title: '序号',
							align: 'left',
							field: 'eq'
						}, {
							title: '任务标题',
							align: 'left',
							field: 'taskTitle'
						}, {
							title: '单次点击报酬',
							align: 'left',
							field: 'taskPrice'
						}, {
							title: '任务总报酬',
							align: 'center',
							field: 'taskTotalMoney'
						}, {
							title: '阅读量',
							align: 'left',
							field: 'taskConfirmedReadnum'
						}, {
							title: '发布人名称',
							align: 'left',
							field: 'userName'
						}, {
							title: '发布人手机号',
							align: 'left',
							field: 'userPhone'
						}, {
							title: '发布时间',
							align: 'left',
							field: 'createTime'
						}, {
							title: '任务状态',
							align: 'left',
							field: 'taskStatus'
						}]
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
			}

	})
			
			


/*$(function () {
	//获取跳转前页面传参
	var startTime = getRequestAddressUrlParameter("startTime");
	var endTime = getRequestAddressUrlParameter("endTime");
	
    // 设置本月起止日期
    $('#qBeginTime').val(startTime);
    $('#qEndTime').val(endTime);
    
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
            //sortName : "transTime",     //排序的字段
            //sortOrder: "desc",          //排序方式
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
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            // singleSelect : true,        //是否只能选中一个
            sortOrder: "desc",

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
                	totalAmount = res.data.sum;
                	res.rows = res.data.list;
                    return res;
                }
            },
            
            columns: [
				{ field: 'Number', title:'序号', align : "center", width: 80,
					formatter: function(value,row,index){
						return index+1;
					}
				},
				{ field: 'taskTitle', title:'任务标题',  width: 150, align : "center" }, //任务标题
				//{ field: 'taskUrl', title:'文章网址', align : "center", width: 150 },//文章网址
				{ field: 'taskPrice', title:'单次点击报酬',  width: 100, align : "center",
					formatter: function(money){
						return fmoney(money,2);
					}
				}, //单次点击报酬
				{ field: 'taskTotalMoney', title:'任务总报酬',  width: 100, align : "center",
					formatter: function(money){
						return fmoney(money,2);
					}
				}, // 任务总报酬
				{ field: 'taskConfirmedReadnum', title:'阅读量',  width: 80, align : "center" },// 阅读量
				{ field: 'userName', title:'发布人名称', width: 100, align : "center" },// 发布人名称
				{ field: 'userPhone', title:'发布人手机号', width: 150, align : "center" },// 发布人手机号
				{ field: 'createTime', title:'发布时间', width: 160, align : "center" },//发布时间
				{ field: 'finishTime', title:'完成时间', width: 160, align : "center", 
					formatter: function(res){
						if(res){
							return "-";
						}
						return res;
					}
				},//完成时间
				{ field: 'taskStatus', title:'任务状态', width: 160, align : "center",
					formatter: function(res){
						if(res == 1){
							return "进行中";
						}else if(res == 2){
							return "已结束";
						}else if(res == 3){
							return "待发布";
						}
					}
				}//任务状态  1：进行中, 2：已结束, 3:待发布
			],
            onLoadSuccess: function (data) {
                //layer.msg('加载成功');
            	callBack();
            },
            onLoadError: function(){
                // layer.msg('未检索到**信息');
            }
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var cmd = "payTransactionLog/reprintDetail";
        
        var pageNo = params.offset / params.limit + 1;
        var pageSize = params.limit;
        var version = "1";
        var jsonData = getSearchParam(pageNo, pageSize);
        return {
            cmd: cmd,
            data: jsonData,
            version: version
        }
    };
    return oTableInit;

};

// 拼接查询参数
function getSearchParam(pageNo, pageSize){
    var startTimes=$('#qBeginTime').val();
    var endTimes=$('#qEndTime').val();
    var userName = $("#accountnamer").val();
    
    var jsonData = {
		userName: userName,
		startTime: startTimes,
		endTime: endTimes
    };
    if(pageNo && pageSize){
    	jsonData.pageNo = pageNo;
    	jsonData.pageSize = pageSize;
    }
    
    return JSON.stringify(jsonData);
}

    //查询搜索事件
    $("#searchbtn").bind("click", function(){
    	
    		oTable.Init();
    		accountDynamicColumn.initCookie();
    });

    // 导出excel
    $("#excelbtn").bind("click", function downloadFile() {
        //定义要下载的excel文件路径名
        var excelFilePathName = "";
        try{               
            //1. 发送下载请求 , 业务不同，向server请求的地址不同
            var excelUrl = reqAjax('payExcel/exportReprintDetail', getSearchParam());
            if(excelUrl.code != 1){
				layer.msg(excelUrl.msg);
			} else {
				//2.获取下载URL
	            excelFilePathName = excelUrl.data;
	            //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
	            if(""!=excelFilePathName){
	                var aIframe = document.createElement("iframe");
	                aIframe.src = excelFilePathName;
	                aIframe.style.display = "none";
	                document.body.appendChild(aIframe);
	            }
			}
        }catch(e){
            alert("异常："+e);
        }
    });
    */
