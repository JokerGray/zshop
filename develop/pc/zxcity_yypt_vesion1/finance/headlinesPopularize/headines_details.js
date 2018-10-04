var startTime = "";
var endTime = "";
var oTable;
$(function() {
  oTable = new TableInit();
  startTime = getRequestAddressUrlParameter('startTime');
  endTime = getRequestAddressUrlParameter('endTime');
  var queryStatus = getRequestAddressUrlParameter('queryStatus');
  $('#queryStatus').val(queryStatus);
  if (startTime) {
    $('#startTime').val(startTime);
    //$("#startTime").datetimepicker("setStartDate",startTime);
  }
  if (endTime) {
    $('#endTime').val(endTime);
  }
  getStartTime();
  getEndTime();
  oTable.Init();
});

var TableInit = function() {
  var oTableInit = new Object();
  oTableInit.Init = function() {
    $('#table').bootstrapTable('destroy').bootstrapTable({
      url: '/zxcity_restful/ws/rest', method: 'POST', //请求方式（*）
      striped: true, //是否显示行间隔色
      cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
      strictSearch: true,
      showColumns: true, //是否显示所有的列
      showRefresh: true, //是否显示刷新按钮
      minimumCountColumns: 2, //最少允许的列数
      searchOnEnterKey: false,
      //searchText: '',
      pagination: true, //是否显示分页（*）
      sortable: false, //是否启用排序
      sortName: "payTime", //排序的字段
      sortOrder: "desc", //排序方式
      contentType: "application/x-www-form-urlencoded", //解决POST，后台取不到参数
      queryParams: oTableInit.queryParams, //传递参数（*）
      sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
      pageNumber: 1, //初始化加载第一页，默认第一页
      pageSize: 10, //每页的记录行数（*）
      pageList: [10], //可供选择的每页的行数（*）
      // strictSearch: true,
      clickToSelect: true, //是否启用点击选中行
      // height: 460,            //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
      // uniqueId: "Number",     //每一行的唯一标识，一般为主键列
      cardView: false, //是否显示详细视图
      detailView: false, //是否显示父子表
      singleSelect: true, //是否只能选中一个
      sortOrder: "desc",
      showPaginationSwitch: true,
      ajaxOptions: {
        beforeSend: function(request) {
          request.setRequestHeader("apikey", yyCache.get("apikey") == null
            ? "test"
            : yyCache.get("apikey"));
        }
      },
      responseHandler: function(res) {
        if (res.code == 1 && res.total > 0) {
          res.total = res.total;
          res.rows = res.data;
          return res;
        } else {
          return false;
        }
      },
      columns: [
        {
          field: 'Number',
          title: '序号',
          align: "center",
          width: 80,
          formatter: function(value, row, index) {
            return index + 1;
          }
        }, {
          field: 'id',
          title: '订单编号',
          align: "center",
          width: 80
        }, {
          field: 'username',
          title: '广告主名称',
          align: "center",
          width: 150,
          formatter: function(res, row) {
            if (res) {
              return '<a href="#" style="color: cornflowerblue;display: block;height: 25px;line-height: 25px;" onclick="showUserInfo(' + row.advUserId + ')">' + res + '</a>';
            } else {
              return "-";
            }
          }
        }, {
          field: 'phone',
          title: '手机号',
          align: "center",
          width: 150
        }, {
          field: 'totalAmount',
          title: '订单金额',
          width: 150,
          align: "center",
          formatter: function(res) {
            if (res) {
              return fmoney(res, 2);
            } else {
              return "-";
            }
          }
        }, {
          field: 'amountConsumption',
          title: '消费金额',
          width: 150,
          align: "center",
          formatter: function(res, row) {
            if (res) {
              return '<button type="button" class="btn btn-info" style="padding: 2px;width: 110px;border-radius: 0px;" onclick="supplierIncomeDetails(\'' + row.id + '\',\'' + 2 + '\',)">' + fmoney(res, 2) + '</button>';
            } else {
              return "-";
            }
          }
        }, {
          field: 'refundAmount',
          title: '退款金额',
          width: 150,
          align: "center",
          formatter: function(res) {
            if (res) {
              return fmoney(res, 2);
            } else {
              return "-";
            }
          }
        }, {
          field: 'supplierIncome',
          title: '作者收入',
          width: 150,
          align: "center",
          formatter: function(res, row) {
            if (res) {
              return fmoney(res, 2);
            } else {
              return "-";
            }
          }
        }, {
          field: 'companyIncome',
          title: '公司收入',
          width: 150,
          align: "center",
          formatter: function(res) {
            if (res) {
              return fmoney(res, 2);
            } else {
              return "-";
            }
          }
        }, {
          field: 'advStatus',
          title: '状态',
          width: 100,
          align: "center",
          formatter: function(res) {
            if (res == 1) {
              return '<p style="color: #cc1e1e;font-size: 16px;">进行中</p>';
            } else if (res == 2) {
              return '<p style="color: #5fb878;font-size: 16px;">已完成</p>';
            }
          }
        }, {
          field: 'createTime',
          title: '开始时间',
          width: 180,
          align: "center"
        }, {
          field: 'updateTime',
          title: '完成时间',
          width: 180,
          align: "center"
        }, {
          field: 'xiangqiang',
          title: '详情',
          width: 100,
          align: "center",
          formatter: function(res, row) {
            return '<button type="button" class="btn btn-success" style="padding: 2px;width: 70px;border-radius: 0px;" onclick="orderDetails(\'' + row.id + '\',\'' + row.advType + '\',\'' + row.unitPrice + '\',\'' + row.putInNumber + '\',\'' + row.placeName + '\',\'' + row.incomeProportion + '\',)">详情</button>';
          }
        }
      ],
      onLoadSuccess: function(data) {
        //layer.msg('加载成功');
        // callBack();
      },
      onLoadError: function() {
        // layer.msg('未检索到**信息');
      }
    });
  };

  //得到查询的参数
  oTableInit.queryParams = function(params) {
    var cmd = "headlinesPopularize/selectHeadlinesOrderLIst";
    var jsonData = "";
    var pageNo = params.offset / params.limit + 1;
    // var pageNo = params.pageNumber;
    var pageSize = params.limit;
    var version = "1";
    jsonData = getSearchParam(pageNo, pageSize);
    return {cmd: cmd, data: jsonData, version: version}
  };
  return oTableInit;
};

// 拼接查询参数
function getSearchParam(pageNo, pageSize) {
  var advStatus = "";
  var serialNumber = $('#serialNumber').val();
  var username = $('#username').val();
  var queryStatus = $('#queryStatus').val();
  //  queryStatus=3;
  if (queryStatus) {
    if (queryStatus == 3) {
      $("#selectview2").val("3");
      $('#selectview2').selectpicker('refresh');
      $("#selectview1").val("2");
      $('#selectview1').selectpicker('refresh');
    } else if (queryStatus == 1) {
      $("#selectview1").val("1");
      $('#selectview1').selectpicker('refresh');
    } else {
      $("#selectview1").val("2");
      $('#selectview1').selectpicker('refresh');
    }
  } else {
    advStatus = $("#selectview1").val();
    queryStatus = $("#selectview2").val();
  }

  var jsonData = {
    serialNumber: serialNumber,
    startTime: startTime,
    endTime: endTime,
    queryStatus: queryStatus,
    advStatus: advStatus,
    username: username
  }
  if (pageNo && pageNo) {
    jsonData.pageNo = pageNo;
    jsonData.pageSize = pageSize;
  } else {}
  return JSON.stringify(jsonData);
}

//查询搜索事件
$("#searchbtn").bind("click", function() {
  // $('#queryStatus').val("");
  var startTimes = $('#startTime').val();
  var endTimes = $('#endTime').val();
  // if (!startTimes || startTimes == "") {
  //   layer.msg('开始时间不能为空');
  //   return false;
  // }
  // if (!endTimes || endTimes == "") {
  //   layer.msg('结束时间不能为空');
  //   return false;
  // }
  startTime = startTimes;
  endTime = endTimes;
  oTable.Init();
  accountDynamicColumn.initCookie();
});


//订单详情
function orderDetails(id, advType, unitPrice, putInNumber, placeName, incomeProportion) {
  var index = layer.open({
    type: 1,
    area: [
      '800px', '500px'
    ],
    fix: false, //不固定
    maxmin: false,
    //btn : [ '取消','确认提交'],
    title: "订单详情",
    content: orderInfo(id, advType, unitPrice, putInNumber, placeName, incomeProportion),
    // 弹窗加载成功的时候
    success: function() {}
  });
}

//作者收入详情
function supplierIncomeDetails(orderId, type) {
  var name = "头条收入详情";
  var url = "finance/headlinesPopularize/headines_settlement.html?serialNumber=" + orderId;
  addTabs(url, name);
}

// 导出excel
$("#excelbtn").bind("click", function downloadFile() {
  //定义要下载的excel文件路径名
  var excelFilePathName = "";
  try {
    var jsonData = "";
    var usernames = $('#usernames').val();
    var phones = $('#phones').val();
    var data = {
      username: usernames,
      phone: phones
    }
    jsonData = JSON.stringify(data);
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
    var excelUrl = reqAjax('headlines/exportStatisticsList', jsonData);
    if (excelUrl.code != 1) {
      layer.msg(excelUrl.msg);
    } else {
      //2. 获取下载URL
      excelFilePathName = excelUrl.data;
      //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
      if ("" != excelFilePathName) {
        var aIframe = document.createElement("iframe");
        aIframe.src = excelFilePathName;
        aIframe.style.display = "none";
        document.body.appendChild(aIframe);
      }
    }
  } catch (e) {
    alert("异常：" + e);
  }
});

//拼接信息
function orderInfo(id, advType, unitPrice, putInNumber, placeName, incomeProportion) {
  var advTypeStr = "";
  if (advType == 1) {
    advTypeStr = "浏览";
  } else if (advType == 2) {
    advTypeStr = "点击";
  }
  var html = "";
  html += '<div class="container-fluid" style="margin-top: 30px;">';
  html += '<form class="form-horizontal">';
  html += '<div class="row-fluid" style="padding-bottom: 15px;">';
  html += '<h1 class="text-center dialog-title">订单编号：' + id + '</h1>';
  html += '</div>';
  html += '<div class="row">';
  html += '<div class="pull-left w-half">';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>投放类型：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<input readonly class="form-control" id="phone" type="text" value="' + advTypeStr + '">';
  html += '</div>';
  html += '</div>';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>投放位置：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<input readonly class="form-control" id="name" type="text" value="' + placeName + '">';
  html += '</div>';
  html += '</div>';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>收入比例：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<input readonly class="form-control" id="name" type="text" value="' + incomeProportion + '">';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="pull-right w-half">';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>单价：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<div class="input-group">';
  html += '<input readonly  class="form-control" id="uname" type="text" value="' + fmoney(unitPrice, 2) + '">';
  html += '<div class="input-group-addon">元</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>投放次数：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<div class="input-group">';
  html += '<input readonly  class="form-control" id="status" type="text" value="' + putInNumber + '">';
  html += '<span class="input-group-addon">次</span>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</form>';
  html += '</div>';
  return html;
}
