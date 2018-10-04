(function ($) {
  var REQUEST_URL = {
    GETALLBILLDATA: 'shopLife/getAllBillData',//获取账单列表数据
    ADDBILLDATA: 'shopLife/addBillData',//添加账单数据
    GETBILLDETAIL: 'shopLife/getBillDetail',//账单详细
    GETPAYASSETTEYES: 'shopLife/getPayAssetTeyes',//缴费类型
    REVIEWBILL: 'shopLife/reviewBill',//审核账单
    CASHPAYBILL: 'shopLife/cashPayBill',//现金支付账单
    AFFIRMBILL: 'shopLife/affirmBill',//缴费成功详情
    GETDOORORCARCODES: 'shopLife/getDoorOrCarCodes',//根据缴费类型查询车牌or门牌号
    QUERYSHOPBYBACKUSERID: 'processSet/queryShopByBackUserId'//获取店铺id
  }

  var userId = getUrlParams('userId'),
    /*shopId = getUrlParams('shopId') || 511,*/
    shopId = getUrlParams('shopId'),
    pageNo = 1,
    pageSize = 9,
    lock = true,
    layer = layui.layer,
    laypage = layui.laypage;

  layer.config({
    extend: 'myskin/style.css'
  });

  //页面初始化
  $(function () {
    initList();
    initType('setidSearch');
  })

  //录入账单弹窗
  $('#billingLnquiries .title a').on('click', function () {
    layer.open({
      title: ['录入账单', 'font-size:14px;background-color:#353b53;color:#1be0d6;text-align:center;'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-1'),
      area: ['1128px', '600px'],
      btn: ['发送给业主', '关闭'],
      btnAlign: 'c',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-1').hide();
        $('#details-1 form')[0].reset();
        $('#details-1 .form-group:eq(1) label:last,#details-1 .form-group:eq(1) select:last').hide();
      },
      success: function (layero, index) {
        laydateInit('billingCycle', '至', -365, 0);
        initType('setId');
      },
      yes: function (index, layero) {
        var payer = $.trim($(layero).find('input[name=payer]').val());//缴费人
        var payerPhone = $.trim($(layero).find('input[name=payerPhone]').val());//缴费人手机号
        var amount = $.trim($(layero).find('input[name=amount]').val());//账单金额
        var setId = $('#setId').val();//缴费类型
        var doorOrCarCode = $.trim($(layero).find('select[name=doorOrCarCode]').val());//门牌号/车牌号
        var remark = $.trim($(layero).find('textarea').val());//商户备注

        if (!payer) {
          layer.msg('请填写缴费人姓名');
          return;
        }
        if (!payerPhone) {
          layer.msg('请填写缴费人手机号');
          return;
        }

        if (!amount) {
          layer.msg('请填写账单金额');
          return;
        }

        if (!setId) {
          layer.msg('请选择缴费类型');
          return;
        }

        if (!doorOrCarCode) {
          layer.msg('请填写门牌号/车牌号');
          return;
        }

        var param = {
          shopId: shopId,
          payer: payer,
          payerPhone: payerPhone,
          doorOrCarCode: doorOrCarCode,
          setId: setId,
          amount: amount,
          beginDate: $('#billingCycle').attr('data-beginTime'),
          endDate: $('#billingCycle').attr('data-endTime'),
          remark: remark
        }

        if (lock) {
          lock = false;
          reqAjaxAsync(REQUEST_URL.ADDBILLDATA, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
              layer.msg(res.msg);
              setTimeout(function () {
                window.location.reload(true);
              }, 500);
            } else {
              layer.msg(res.msg);
              lock = true;
            }
          })
        }
        return false;
      }
    });
  })

  //审核账单,现金支付,账单详情
  $('#billingLnquiries table').on('click', 'button', function () {
    var className = $(this).attr('class');
    var billId = $(this).parents('tr').attr('data-id');
    var param = {
      billId: billId
    }
    switch (className) {
      //审核账单
      case 'btn processing':
        layer.open({
          title: ['审核账单', 'font-size:14px;background-color:#353b53;color:#1be0d6;text-align:center;'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-2'),
          area: ['1173px', '600px'],
          btn: ['确认处理', '暂不处理'],
          btnAlign: 'c',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-2').hide();
            $('#details-2').find('.form-inline:eq(1) label:eq(2),.form-inline:eq(1) p:eq(2)').show();
          },
          success: function (layero, index) {
            laydateInit('billsDate', '至', -365, 0);
            reqAjaxAsync(REQUEST_URL.GETBILLDETAIL, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                var data = res.data;
                initDetails(data, layero, className)
              } else {
                layer.msg(res.msg);
              }
            })
          },
          yes: function (index, layero) {
            var remark = $.trim($(layero).find('textarea').val());
            var param = {
              billId: billId,
              billBeginDate: $('#billsDate').attr('data-beginTime'),
              billEndDate: $('#billsDate').attr('data-endTime'),
              remark: remark
            }

            if (!$('#billsDate').attr('data-beginTime') || !$('#billsDate').attr('data-endTime')) {
              layer.msg('请选择账单周期!');
              return;
            }

            if (lock) {
              lock = false;
              reqAjaxAsync(REQUEST_URL.REVIEWBILL, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  layer.msg(res.msg);
                  setTimeout(function () {
                    window.location.reload(true);
                  }, 500)
                } else {
                  layer.msg(res.msg);
                  lock = true;
                }
              })
            }
            return false;
          }
        });
        break;
      //现金支付
      case 'btn start':
        layer.open({
          title: ['账单详情', 'font-size:14px;background-color:#353b53;color:#1be0d6;text-align:center;'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-2'),
          area: ['1173px', '600px'],
          btn: ['现金支付', '关闭'],
          btnAlign: 'c',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-2').hide();
            $('#details-2').find('.form-inline:eq(1) label:eq(1),.form-inline:eq(1) p:eq(1)').show();//隐藏缴费时间
            $('#details-2').find('.form-inline:eq(2) label:eq(1),.form-inline:eq(2) p:eq(1)').show();//隐藏支付方式
            $('#details-2').find('.form-inline:eq(4)').show();
          },
          success: function (layero, index) {
            reqAjaxAsync(REQUEST_URL.GETBILLDETAIL, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                var data = res.data;
                initDetails(data, layero, className)
              } else {
                layer.msg(res.msg);
              }
            })
          },
          yes: function (index, layero) {
            var remark = $.trim($(layero).find('textarea').val());
            var param = {
              billId: billId,
              remark: remark
            }

            if (lock) {
              lock = false;
              reqAjaxAsync(REQUEST_URL.CASHPAYBILL, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  layer.msg(res.msg);
                  setTimeout(function () {
                    window.location.reload(true);
                  }, 500)
                } else {
                  layer.msg(res.msg);
                  lock = true;
                }
              })
            }
            return false;
          }
        });
        break;
      //账单详情
      case 'btn end':
        layer.open({
          title: ['账单详情', 'font-size:14px;background-color:#353b53;color:#1be0d6;text-align:center;'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-2'),
          area: ['1173px', '600px'],
          btn: ['确认', '关闭'],
          btnAlign: 'c',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-2').hide();
            $('#details-2').find('.form-inline:eq(4)').show();
          },
          success: function (layero, index) {
            reqAjaxAsync(REQUEST_URL.GETBILLDETAIL, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                var data = res.data;
                initDetails(data, layero, className)
              } else {
                layer.msg(res.msg);
              }
            })
          },
          yes: function (index, layero) {
            var remark = $.trim($(layero).find('textarea').val());
            var param = {
              billId: billId,
              remark: remark
            }

            if (lock) {
              lock = false;
              reqAjaxAsync(REQUEST_URL.AFFIRMBILL, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  layer.msg(res.msg);
                  setTimeout(function () {
                    window.location.reload(true);
                  }, 500)
                } else {
                  layer.msg(res.msg);
                  lock = true;
                }
              })
            }
            return false;
          }
        });
        break;
    }
  })

  //缴费时间,账单时间控件初始化
  $('#paymentTime,#bills').on('click', function () {
    var id = $(this).attr('id');
    if (id == 'paymentTime') {
      laydateInit('paymentTime', '至', -365, '');
    } else {
      laydateInit('bills', '至', -365, '');
    }
  })

  //缴费类型查询门牌or车牌号
  $('#setId').on('change', function () {
    var setId = $(this).val()
    var param = {
      shopId: shopId,
      setId: setId
    }

    reqAjaxAsync(REQUEST_URL.GETDOORORCARCODES, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        $('#details-1 .form-group:eq(1) label:last,#details-1 .form-group:eq(1) select:last').show();
        var sHtml = '';
        for (var i = 0, len = res.data.length; i < len; i++) {
          var data = res.data[i];
          sHtml +=
            '<option value="' + data + '">' + data + '</option>'
        }
        $('#details-1 .form-group:eq(1) select:last').html(sHtml);
      } else {
        $('#details-1 .form-group:eq(1) label:last,#details-1 .form-group:eq(1) select:last').hide();
      }
    })
  })

  //搜索
  $('.search').on('click', function () {
    initList();
  })

  //账单数据列表渲染方法
  function init(res) {
    if (res.code == 1) {
      var sHtml = '';
      for (var i = 0, len = res.data.length; i < len; i++) {
        var data = res.data[i];
        sHtml +=
          '<tr data-id="' + data.id + '">' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + data.doorOrCarCode + '</td>' +
          '<td data-setId="' + data.setId + '">' + data.setName + '</td>';
        switch (data.billType) {
          case 0:
            sHtml +=
              '<td>无</td>';
            break;
          case 1:
            sHtml +=
              '<td>缴费单</td>';
            break;
          case 2:
            sHtml +=
              '<td>欠费单</td>';
            break;
          case 3:
            sHtml +=
              '<td>划扣单</td>';
            break;
        }
        sHtml += '<td>' + isNull2(data.amount) + '</td>';
        switch (data.payType) {
          case 0:
            sHtml +=
              '<td>—</td>';
            break;
          case 1:
            sHtml +=
              '<td>现金</td>';
            break;
          case 2:
            sHtml +=
              '<td>智享账户</td>';
            break;
          case 3:
            sHtml +=
              '<td>支付宝</td>';
            break;
          default:
            sHtml +=
              '<td>会员卡账户</td>';
        }
        sHtml +=
          '<td>' + isNull1(data.payDate) + '</td>';
        if (data.status == 1) {
          sHtml += '<td>—</td>';
        } else {
          sHtml += '<td>' + data.beginDate + ' 至 ' + data.endDate + '</td>';
        }
        sHtml += '<td>' + data.payer + '</td>' +
          '<td>' + data.payerPhone + '</td>';
        switch (data.status) {
          case 0:
            sHtml +=
              '<td>待支付</td>+' +
              '<td><button class="btn start">详情</button></td>' +
              '</tr>';
            break;
          case 1:
            sHtml +=
              '<td>受理中</td>' +
              '<td><button class="btn processing">审核</button></td>' +
              '</tr>'
            break;
          case 2:
            sHtml +=
              '<td>缴费成功</td>' +
              '<td><button class="btn end">详情</button></td>' +
              '</tr>'
            break;
        }
      }
      $('#billingLnquiries tbody').html(sHtml);
    }
  }

  //账单数据列表初始化方法
  function initList() {
    var doorOrCarCode = $.trim($('.title .form-inline:eq(0) input:eq(0)').val()) || '';//门牌车牌号
    var setId = $('.title .form-inline:eq(0) select').val() || '';//缴费类型
    var payBeginDate = $('#paymentTime').attr('data-beginTime') || '';//缴费开始时间
    var payEndDate = $('#paymentTime').attr('data-endTime') || '';//缴费结束时间
    var billBeginDate = $('#bills').attr('data-beginTime') || '';//账单开始时间
    var billEndDate = $('#bills').attr('data-endTime') || '';//账单结束时间
    var payer = $.trim($('.title .form-inline:eq(1) input:eq(0)').val()) || '';//缴费人
    var payerPhone = $.trim($('.title .form-inline:eq(1) input:eq(1)').val()) || '';//缴费人手机号
    var param = {
      shopId: shopId,
      doorOrCarCode: doorOrCarCode,
      setId: setId,
      payBeginDate: payBeginDate,
      payEndDate: payEndDate,
      billBeginDate: billBeginDate,
      billEndDate: billEndDate,
      payer: payer,
      payerPhone: payerPhone,
      pageNo: pageNo,
      pageSize: pageSize
    }
    reqAjaxAsync(REQUEST_URL.GETALLBILLDATA, JSON.stringify(param)).done(function (res) {
      init(res);

      laypage.render({
        elem: 'paging-box-r',//容器
        count: res.total,//总数
        limit: pageSize,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param1 = {
            shopId: shopId,
            doorOrCarCode: doorOrCarCode,
            setId: setId,
            payBeginDate: payBeginDate,
            payEndDate: payEndDate,
            billBeginDate: billBeginDate,
            billEndDate: billEndDate,
            payer: payer,
            payerPhone: payerPhone,
            pageNo: obj.curr,
            pageSize: pageSize
          }
          if (!first) {
            reqAjaxAsync(REQUEST_URL.GETALLBILLDATA, JSON.stringify(param1)).done(function (res) {
              init(res);
            })
          }
        }
      });
    })
  }

  //缴费类型渲染方法
  function initType(dom) {
    var param = {
      shopId: shopId
    }
    reqAjaxAsync(REQUEST_URL.GETPAYASSETTEYES, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var sHtml = '<option value="">-请选择-</option>';
        for (var i = 0, len = res.data.length; i < len; i++) {
          var data = res.data[i];
          sHtml +=
            '<option value="' + data.id + '">' + data.typeName + '</option>';
        }
        $('#' + dom).html(sHtml);
      }
    })
  }

  //详情页面渲染方法
  function initDetails(data, layero, className) {
    var billType = data.billType == 1 ? '缴费单' : data.billType == 2 ? '欠费单' : data.billType == 3 ? '划扣单' : '无';
    var payType = data.payType == 1 ? '现金' : data.payType == 2 ? '会员卡账户' : data.payType == 3 ? '支付宝' : '无';
    var status = data.status == 0 ? '待支付' : data.status == 1 ? '受理中' : data.status == 2 ? '缴费成功' : '草稿';
    $(layero).find('.form-inline:eq(0) p:eq(0)').html(data.doorOrCarCode);//门牌号
    $(layero).find('.form-inline:eq(0) p:eq(1)').html(data.setName);//缴费类型
    $(layero).find('.form-inline:eq(0) p:eq(2)').html(billType);//账单类型

    $(layero).find('.form-inline:eq(1) p:eq(0)').html(isNull2(data.amount) + '元');//账单金额
    $(layero).find('.form-inline:eq(1) p:eq(1)').html(data.payDate);//缴费时间
    $(layero).find('.form-inline:eq(1) p:eq(2)').html(data.beginDate + ' 至 ' + data.endDate);//账单周期

    $(layero).find('.form-inline:eq(2) p:eq(0)').html(data.payer);//缴费人
    $(layero).find('.form-inline:eq(2) p:eq(1)').html(payType);//支付方式
    $(layero).find('.form-inline:eq(2) p:eq(2)').html(data.payerPhone);//手机号

    $(layero).find('.form-inline:eq(3) p:eq(0)').html(status);//账单状态
    $(layero).find('.form-inline:eq(3) p:eq(1)').html(data.userRemark);//用户备注
    $(layero).find('textarea').html(data.remark);//商户备注
    switch (className) {
      case 'btn processing':
        $(layero).find('.form-inline:eq(1) label:eq(2),.form-inline:eq(1) p:eq(2)').hide();//隐藏账单周期
        break;
      case 'btn start':
        $(layero).find('.form-inline:eq(1) label:eq(1),.form-inline:eq(1) p:eq(1)').hide();//隐藏缴费时间
        $(layero).find('.form-inline:eq(2) label:eq(1),.form-inline:eq(2) p:eq(1)').hide();//隐藏支付方式
        $(layero).find('.form-inline:eq(4)').hide();//隐藏账单周期控件
        break;
      case 'btn end':
        $(layero).find('.form-inline:eq(4)').hide();//隐藏账单周期控件
    }
  }

  //判断是否为空
  function isNull1(val) {
    if (!val || val == "null") {
      return '—';
    }
    return val;
  }

  function isNull2(val) {
    if (!val || val == "null") {
      return '0';
    }
    return val;
  }

})(jQuery)