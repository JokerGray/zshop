var startTime = "";
var endTime = "";
var oTable;
$(function() {
  startTime = getRequestAddressUrlParameter('startTime');
  endTime = getRequestAddressUrlParameter('endTime');
  var queryStatus = getRequestAddressUrlParameter('queryStatus');
  console.log(startTime);
  console.log(endTime);
  $('#queryStatus').val(queryStatus);
  if (startTime) {
    $('#startTime').val(startTime);
  }
  if (endTime) {
    $('#endTime').val(endTime);
  }
  getStartTime();
  getEndTime();
  oTable = new TableInit();
  oTable.Init();
});

var TableInit = function() {
  var oTableInit = new Object();
  oTableInit.Init = function() {
    $('#table').bootstrapTable('destroy').bootstrapTable({
      url: '/zxcity_restful/ws/rest', method: 'POST', //请求方式（*）
      striped: true, //是否显示行间隔色
      cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端
      strictSearch: true,
      showColumns: true, //是否显示所有的列
      showRefresh: true, //是否显示刷新按钮
      minimumCountColumns: 2, //最少允许的列数
      searchOnEnterKey: true,
      searchText: '',
      pagination: true, //是否显示分页（*）
      sortable: false, //是否启用排序
      sortName: "applyTime", //排序的字段
      sortOrder: "desc", //排序方式
      contentType: "application/x-www-form-urlencoded", //解决POST，后台取不到参数
      queryParams: oTableInit.queryParams, //传递参数（*）
      sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
      pageNumber: 1, //初始化加载第一页，默认第一页
      pageSize: 10, //每页的记录行数（*）
      pageList: [10], //可供选择的每页的行数（*）
      uniqueId: "tradeNo", //每一行的唯一标识，一般为主键列
      cardView: false, //是否显示详细视图
      detailView: false, //是否显示父子表
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
          field: '勾选',
          title: '选择框',
          checkbox: true,
          formatter: stateFormatter
        }, {
          field: 'Number',
          title: '序号',
          align: "center",
          width: 80,
          formatter: function(value, row, index) {
            return index + 1;
          }
        }, {
          field: 'tradeNo',
          title: '订单编号',
          align: "center",
          width: 150
        }, {
          field: 'username',
          title: '用户名称',
          align: "center",
          width: 150
        }, {
            field: 'rolesStr',
            title: '角色',
            align: "center",
            width: 150
        }, {
          field: 'businessType',
          title: '业务类型',
          width: 150,
          align: "center",
          formatter: function(res) {
            if (res == 1) {
              return "头条推广";
            } else if (res == 2) {
              return "主播佣金";
            }
          }
        }, {
          field: 'withdrawMoney',
          title: '结算金额',
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
          field: 'withdrawType',
          title: '结算类型',
          width: 150,
          align: "center",
          formatter: function(res) {
            if (res == 1) {
              return "个人";
            } else if (res == 2) {
              return "企业";
            }
          }
        }, {
          field: 'createTime',
          title: '创建时间',
          width: 180,
          align: "center"
        }, {
          field: 'updateTime',
          title: '审核时间',
          width: 180,
          align: "center"
        }, {
          field: 'auditStatus',
          title: '审核状态',
          width: 100,
          align: "center",
          formatter: function(res, row) {
            if (res == 1) {
              //  return '<button type="button" class="btn btn-info" style="padding: 2px;width: 110px;border-radius: 0px;" onclick="auditOperation(\''+row.id+'\',\''+row.tradeNo+'\',\''+row.withdrawType+'\',\''+row.withdrawMoney+'\',\''+row.businessType+'\')">审核</button>';
              return '申请中';
            } else if (res == 2) {
              return '<p style="color:#4cae4c;">成功</p>';
            } else if (res == 3) {
              return '<p style="color:#E91E63;">失败</p>';
            }
          }
        }, {
          field: 'auditDescription',
          title: '描述',
          width: 200,
          align: "center"
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

  // 根据数据状态判断是否客选中
  function stateFormatter(value, row, index) {
    if (row.auditStatus != 1) {
      return {
        disabled: true, //设置是否可用
        checked: false //设置选中
      };
    }
    return value;
  }

  //得到查询的参数
  oTableInit.queryParams = function(params) {
    var cmd = "scIncomeAudit/selectIncomeAuditList";
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
  var username = $('#username').val();
  var startTimes = $('#startTime').val();
  var endTimes = $('#endTime').val();
  var jsonData = {
    username: username,
    startTime: startTimes,
    endTime: endTimes
  } 
  if (pageNo && pageNo) {
    jsonData.pageNo = pageNo;
    jsonData.pageSize = pageSize;
  } else {}
  return JSON.stringify(jsonData);
}

//查询搜索事件
$("#searchbtn").bind("click", function() {
  oTable.Init();
  accountDynamicColumn.initCookie();
});

// 审核通过
$("#auditSuccess").bind("click", function downloadFile() {
  var auditData = $("#table").bootstrapTable('getSelections');
  if (auditData.length > 0) {
    var layers = layer.confirm('确认审核通过吗？', {
      btn: ['通过', '取消'] //按钮
    }, function(index) {
      $.each(auditData, function(index, obj) {
        if (obj.auditStatus == 1) {
          var params = {
            id: obj.id,
            auditStatus: 2,
            tradeNo: obj.tradeNo
          }
          var cmd = 'scIncomeAudit/auditOperation';
          var code = requestAjax(cmd, params);
          if (code == 9) {
            return false;
          }
        }
      });
      oTable.Init();
      layer.close(layers);
    });
  } else {
    layer.msg('审核数据不能为空');
  }
});

// 审核不通过
$("#auditFailure").bind("click", function downloadFile() {
  var auditData = $("#table").bootstrapTable('getSelections');
  if (auditData.length > 0) {
    var layers = layer.confirm('确认审核不通过吗？', {
      btn: ['不通过', '取消'] //按钮
    }, function(index) {
      $.each(auditData, function(index, obj) {
        if (obj.auditStatus == 1) {
          var params = {
            id: obj.id,
            auditStatus: 3,
            tradeNo: obj.tradeNo
          }
          var cmd = 'scIncomeAudit/auditOperation';
          var code = requestAjax(cmd, params);
          if (code == 9) {
            return false;
          }
        }
      });
      oTable.Init();
      layer.close(layers);
    });
  } else {
    layer.msg('审核数据不能为空');
  }
});

//ajax方法
function requestAjax(cmd, params) {
  var code = 1;
  $.ajax({
    type: "POST",
    url: "/zxcity_restful/ws/rest",
    dataType: "json",
    async: false,
    data: {
      "cmd": cmd,
      "data": JSON.stringify(params),
      "version": '1'
    },
    beforeSend: function(request) {
      request.setRequestHeader("apikey", 'test');
    },
    success: function(re) {
      if (re.code == 1) {} else {
        layer.msg("订单编号：" + params.tradeNo + "," + re.msg);
        code = re.code;
      }
    },
    error: function(re) {
      layer.msg('系统繁忙！');
    }
  });
  return code;
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
      //2.获取下载URL
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


//审核操作
function auditOperation(id, tradeNo, withdrawType, withdrawMoney, businessType) {
  var index = layer.open({
    type: 1,
    area: [
      '800px', '500px'
    ],
    fix: false, //不固定
    maxmin: false,
    btn: [
      '取消', '确认提交'
    ],
    title: "审核详情",
    content: orderInfo(tradeNo, withdrawType, withdrawMoney, businessType),
    // 弹窗加载成功的时候
    success: function() {},
    btn1: function(index) {
      layer.close(index);
    },
    btn2: function(index) {
      var auditStatus = $("input[name='auditStatus']:checked").val();
      if (!auditStatus) {
        layer.msg("请选择审核状态");
        return false;
      }
      var auditDescription = $("textarea[name='auditDescription']").val();
      if (!auditDescription) {
        layer.msg("审核描述不能为空");
        return false;
      }

      var indexs = layer.load(0, {
        shade: [0.7, '#393D49']
      }, {shadeClose: true}); //0代表加载的风格，支持0-2
      var queryInfo = {
        id: id,
        auditStatus: auditStatus,
        auditDescription: auditDescription
      }
      var cmd = 'scIncomeAudit/auditOperation';
      var data = JSON.stringify(queryInfo);
      $.ajax({
        type: "POST", url: "/zxcity_restful/ws/rest", dataType: "json",
        //async : false,
        data: {
          "cmd": cmd,
          "data": data,
          "version": version
        },
        beforeSend: function(request) {
          request.setRequestHeader("apikey", apikey);
        },
        success: function(re) {
          if (re.code == 1) {
            layer.close(indexs);
            oTable.Init();
            layer.msg(re.msg);
          } else {
            layer.close(indexs);
            layer.msg(re.msg);
            return false;
          }
        },
        error: function(re) {
          layer.close(indexs);
          layer.msg('系统繁忙！');
          return false;
        }
      });
    }
  });
}

//拼接信息
function orderInfo(tradeNo, withdrawType, withdrawMoney, businessType) {
  var withdrawTypeStr = "";
  var businessTypeStr = "";
  if (withdrawType == 1) {
    withdrawTypeStr = "个人";
  } else if (withdrawType == 2) {
    withdrawTypeStr = "企业";
  }
  if (businessType == 1) {
    businessTypeStr = "头条推广";
  } else if (businessType == 2) {
    businessTypeStr = "主播佣金";
  }
  var html = "";
  html += '<div class="container-fluid" style="margin-top: 15px;">';
  html += '<form class="form-horizontal" style="font-size: 15px;">';
  html += '<div class="row-fluid" style="padding-bottom: 15px;">';
  html += '<h1 class="text-center dialog-title">订单编号：' + tradeNo + '</h1>';
  html += '</div>';
  html += '<div class="row">';
  html += '<div class="pull-left w-half">';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>提现类型：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<input readonly class="form-control" id="phone" type="text" value="' + withdrawTypeStr + '">';
  html += '</div>';
  html += '</div>';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>业务类型：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<input readonly class="form-control" id="name" type="text" value="' + businessTypeStr + '">';
  html += '</div>';
  html += '</div>';

  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>审核状态：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<label class="radio-inline" style="margin-right: 60px;margin-left: 15px;">';
  html += '<input type="radio" name="auditStatus"  value="2" stype="margin-top: 7px;"> 成功';
  html += '</label>';
  html += '<label class="radio-inline">';
  html += '<input type="radio" name="auditStatus" value="3" stype="margin-top: 7px;"> 失败';
  html += '</label>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '<div class="pull-right w-half">';
  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b>提现金额：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<div class="input-group">';
  html += '<input readonly  class="form-control" id="uname" type="text" value="' + fmoney(withdrawMoney, 2) + '">';
  html += '<div class="input-group-addon">元</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '<div class="form-group">';
  html += '<label class="col-md-4 col-sm-4 control-label"><b class="required-icon"></b></label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<div class="input-group">';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '<div class="form-group">';
  html += '<label class="col-md-2 col-sm-2 control-label"><b class="required-icon"></b>审核描述：</label>';
  html += '<div class="col-md-7 col-sm-7">';
  html += '<div class="input-group" style="width: 100%;margin-top: 15px;">';
  html += '<textarea name="auditDescription" class="form-control" rows="3" maxlength="15" placeholder="最多可输入15个文字"></textarea>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '</form>';
  html += '</div>';
  return html;
}
