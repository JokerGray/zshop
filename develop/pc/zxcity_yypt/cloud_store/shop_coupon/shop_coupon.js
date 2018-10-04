$(function () {
  var layer = layui.layer;
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  var userno = sessionStorage.getItem("userno") || "";
  var addCmd = "operations/addScCoupon",
    deleteCmd = "operations/deleteScCoupon",
    getDetailCmd = "operations/getScCouponDetail",
    selectAllCmd = "operations/selectAllScCoupon",
    selectPageCmd = "operations/selectAllScCouponPage",
    updataCmd = "operations/updateScCoupon";
  var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
  var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

  function reqAjaxAsync(cmd, data, callback) {
    var inputdata = data;
    $.ajax({
      type: "POST",
      url: "/zxcity_restful/ws/rest",
      dataType: "json",
      async: true, //默认为异步
      data: {
        "cmd": cmd,
        "data": data || "",
        "version": version
      },
      beforeSend: function (request) {
        layer.load(0, {
          shade: [0.3, '#fff']
        });
        request.setRequestHeader("apikey", apikey);
      },
      success: function (res) {
        layer.closeAll('loading');
        callback(res, inputdata);
      },
      error: function (err) {
        layer.closeAll('loading');
        layer.msg("系统繁忙，请稍后再试!");
        console.log(err.status + ":" + err.statusText);
      }
    });
  }

  // 首次调用刷新页面
  var pageObj = {
      page: '1',
      rows: '10',
      name: ''
    },
    pageData = JSON.stringify(pageObj);

  reqAjaxAsync(selectPageCmd, pageData, updatePage);
  //	更改分页select
  var optionsHtml = "";
  for (var i = 10; i < 11; i++) {

    if (i == 10) {
      optionsHtml += '<option selected="selected" value="' + i + '">' + i + '</option>';
    } else {
      optionsHtml += '<option value="' + i + '">' + i + '</option>';
    }
  }
  $("#pageChange").html(optionsHtml);
  $("#pageChange").change(function () {
    var rows = $(this).val();
    $("#pageEnd").text(rows);
    var name = $("#inputName").val() || "";
    var pageData = getPageData(1, rows, name);
//		console.log("页码改变：" + pageData);
    reqAjaxAsync(selectPageCmd, pageData, updatePage);
  });
  //	获得页面入参参数函数
  function getPageData(page, rows, name) {
    var pageObj = {};
    pageObj.page = page;
    pageObj.rows = rows;
    pageObj.name = name;
    var pageData = JSON.stringify(pageObj);
    return pageData;
  }

  function updatePage(data, inputdata) {
    var inputdataObj = JSON.parse(inputdata);
    var row = Number($("#pageChange").val());
    var listobj = data.data;
    var msgLength = Number(data.total);
    if (msgLength == 0) {
      var tableTrHtml =
        '<tr>' +
        '<th>序号</th>' +
        '<th>名称</th>' +
        '<th>优惠类型</th>' +
        '<th>单人可领总数</th>' +
        '<th>优惠券总可用数量</th>' +
        '<th>最低可用金额</th>' +
        '<th>优惠金额</th>' +
        '<th>优惠券等级</th>' +
        '<th>可用状态</th>' +
        '<th>操作</th>' +
        '<th>创建者</th>' +
        '<th>创建时间</th>' +
        '<th>开始时间</th>' +
        '<th>结束时间</th>' +
        '</tr>';
      $("#tablelist").html(tableTrHtml);
    }
    $("#msgNum").text(msgLength);
    layui.use(["laypage", "layer"], function () {
      var laypage = layui.laypage,
        layer = layui.layer;
      var rows = $("#pageChange").val();
      laypage({
        cont: "pageBtns",
        pages: Math.ceil(msgLength / rows),
        groups: 5,
        jump: function (obj) {
          var curr = obj.curr;
          var pageObj = {
            page: curr,
            rows: rows,
            name: inputdataObj.name || ""
          }
          pageData = JSON.stringify(pageObj);
          reqAjaxAsync(selectPageCmd, pageData, getTables);
        }
      });
    });
  }

  function getTables(obj) {
    var listobj = obj.data;
    var tableTrHtml =
      '<tr>' +
      '<th>序号</th>' +
      '<th>名称</th>' +
      '<th>优惠类型</th>' +
      '<th>单人可领总数</th>' +
      '<th>优惠券总可用数量</th>' +
      '<th>最低可用金额</th>' +
      '<th>优惠金额</th>' +
      '<th>优惠券等级</th>' +
      '<th>可用状态</th>' +
      '<th>操作</th>' +
      '<th>创建者</th>' +
      '<th>创建时间</th>' +
      '<th>开始时间</th>' +
      '<th>结束时间</th>' +
      '</tr>';
    for (var i = 0; i < listobj.length; i++) {
      switch (listobj[i].couponType) {
        case "00":
          listobj[i].couponType = "通用券";
          break;
        case "01":
          listobj[i].couponType = "优惠券";
          break;
        case "02":
          listobj[i].couponType = "减免券";
          break;
        case "03":
          listobj[i].couponType = "包邮券";
          break;
        default:
          break;
      }
      switch (listobj[i].status) {
        case "0":
          listobj[i].status = "删除";
          break;
        case "1":
          listobj[i].status = "可用";
          break;
        case "2":
          listobj[i].status = "不可用";
          break;
        default:
          break;
      }

      tableTrHtml +=
        '<tr id="' + listobj[i].id + '">' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + isNull(listobj[i].name) + '</td>' +
        '<td>' + isNull(listobj[i].couponType) + '</td>' +
        '<td>' + isNull(listobj[i].numberOne) + '</td>' +
        '<td>' + isNull(listobj[i].numberTotal) + '</td>' +
        '<td>' + isNull(listobj[i].amountMin) + '</td>' +
        '<td>' + isNull(listobj[i].amount) + '</td>' +
        '<td>' + isNull(listobj[i].couponLevel) + '</td>' +
        '<td>' + isNull(listobj[i].status) + '</td>' +
        '<td style="text-align:center;"><button class="btn btn-danger deleteBtn">删除</button></td>' +
        '<td>' + isNull(listobj[i].creatorName) + '</td>' +
        '<td>' + isNull(listobj[i].createTime) + '</td>' +
        '<td>' + isNull(formatDate(listobj[i].beginTime)) + '</td>' +
        '<td>' + isNull(formatDate(listobj[i].endTime)) + '</td>' +
        '</tr>'
    }
    $("#tablelist").html(tableTrHtml);

    $(".deleteBtn").on("click", function () {
      var thisId = $(this).parent().parent().attr("id"),
        thisIdObj = {
          id: thisId
        },
        idData = JSON.stringify(thisIdObj);
      layer.confirm("确认删除该券吗？", {
        title: "删除",
        btn: ["确认", "取消"]
      }, function (index) {
        reqAjaxAsync(deleteCmd, idData, deleteOne);
      }, function (index) {
        layer.close(index);
      });
    });
  }

  function deleteOne() {
    layer.msg("删除成功！");
    setTimeout(function () {
      window.location.reload();
    }, 1e3);
  }

  function addOne() {
    layer.msg("成功添加！");
    setTimeout(function () {
      window.location.reload();
    }, 1e3);
  }

  $("#searchBtn").on("click", function () {
    var name = $("#inputName").val();
    var pageObj = {
        page: '1',
        rows: '10',
        name: name
      },

      searchData = JSON.stringify(pageObj);
    console.log(pageObj);
    reqAjaxAsync(selectPageCmd, searchData, updatePage);
  });

  $("#addBtn").on("click", function () {
    layer.open({
      type: 2,
      title: ['新增优惠券类型', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['800px', '668px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: "./addCoupon/addCoupon.html",
      btn: ['保存'],
      yes: function () {
        var body = layer.getChildFrame("body");
        var adddata = {};
        adddata.name = body.contents().find("#name").val();
        adddata.numberOne = body.contents().find("#numberOne").val();
        adddata.numberTotal = body.contents().find("#numberTotal").val();
        adddata.amountMin = body.contents().find("#amountMin").val();
        adddata.couponType = body.contents().find("#couponType").val();
        adddata.amount = body.contents().find("#amount").val();
        adddata.instruction = body.contents().find("#instruction").val() || "";
        adddata.status = "1";
        adddata.beginTime = body.contents().find("#beginTime").val();
        adddata.endTime = body.contents().find("#endTime").val();
        adddata.modelType = "06";
        adddata.merchantId = '0';
        adddata.couponLevel = body.contents().find('#couponLevel').val();
        var flag = 1;
        var amoutMins = Number(adddata.amountMin),
          amouts = Number(adddata.amount);
        if (amoutMins < amouts) {
          flag = 0;
          layer.msg("优惠金额不得高于最低消费金额！");
        }

        for (var a in adddata) {
          if (a != "instruction" && a != 'couponLevel') {
            if (adddata[a] == "") {
              flag = 0;
              layer.msg("请填写必填项！");
            }
          }
        }

        if (!num(adddata.couponLevel)) {
          flag = 0;
          layer.msg("优惠券等级请填写正确数字！")
        }

        var numArr = [];
        numArr.push(adddata.numberOne);
        numArr.push(adddata.numberTotal);
        numArr.push(adddata.amountMin);
        numArr.push(adddata.amount);
        for (var i = 0; i < numArr.length; i++) {
          if (!/^[0-9]*$/.test(numArr[i])) {
            flag = 0;
            layer.msg("请正确填写数字！");
          }
        }
        if (flag) {
          adddata.creator = userno;
          var adddataJson = JSON.stringify(adddata);
          reqAjaxAsync(addCmd, adddataJson, addOne);
        }
      }
    })
  })

  //判断字段是否为空
  function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == '') {
      return '无';
    }
    return val;
  }

  function num(obj) {
    var res = new RegExp("^([0-9]*)$")
    return res.test(obj)
  }

  function formatDate(date) {
    var newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)
    if (date) {
      return newDate;
    } else {
      return date;
    }
  }
});