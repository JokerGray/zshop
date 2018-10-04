(function ($) {
  var REQUEST_URL = {
    EXPORTMODEL: 'shopLife/exportModel',//导出模板
    IMPORTEXCELDATA: 'shopLife/importExcelData',//导入Excel,
    GETBILLDRAFTDATA: 'shopLife/getBillDraftData',//获取导入草稿数据
    REMOVEBILLDRAFTDATA: 'shopLife/removeBillDraftData',//删除导入的草稿数据
    EDITBILLDRAFTDATA: 'shopLife/editBillDraftData',//编辑导入的草稿数据
    SAVEBILLDRAFTTOREALDATA: 'shopLife/savebillDraftToRealData',//发送给业主
    QUERYSHOPBYBACKUSERID: 'processSet/queryShopByBackUserId'//获取店铺id
  }

  /*var creator = getUrlParams('userId') || 10585,
    shopId = getUrlParams('shopId') || 458,*/
  var creator = getUrlParams('userId'),
    shopId = getUrlParams('shopId'),
    lock = true,
    pageNo = 1,
    pageSize = 9,
    layer = layui.layer,
    laypage = layui.laypage;

  layer.config({
    extend: 'myskin/style.css'
  });

  //页面初始化
  $(function () {
    initUpload({
      btn: 'upload',
      flag: 'word',
      type: '1',
    });
  })

  //顶部tab切换
  $('#import .title li').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('.download-area').hide().fadeIn(300);
  })

  //导出模板
  $('.download a').on('click', function () {
    var type = $('#import .title li[class=active]').index();
    var param = {
      shopId: shopId,
      type: type
    }
    reqAjaxAsync(REQUEST_URL.EXPORTMODEL, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        window.location.href = res.data;
      } else {
        layer.msg(res.msg);
      }
    })
  })

  //上传账单
  $('#upload').on('click', function () {
    var excelPath = $(this).attr('data-excelPath');
    var type = $('#import .title li[class=active]').index();
    if (excelPath) {
      var param = {
        shopId: shopId,
        type: type,
        creator: creator,
        excelPath: excelPath
      }
      reqAjaxAsync(REQUEST_URL.IMPORTEXCELDATA, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
          layer.open({
            title: ['上传账单', 'font-size:14px;background-color:#353b53;color:#1be0d6;text-align:center;'],
            type: 1,
            skin: 'layer-ext-myskin',
            content: $('#details-1'),
            area: ['1128px', '778px'],
            btn: ['发送给业主'],
            btnAlign: 'c',
            closeBtn: 1,
            scrollbar: false,
            resize: false,
            move: false,
            end: function () {
              $('#details-1').hide();
              $('#upload').attr('data-excelPath', '');
              $('#timeArea').val('').attr('data-beginTime', '').attr('data-endTime', '');
              $('#details-1 table').html('');
              var param = {
                shopId: shopId,
                type: type,
                creator: creator
              }
              reqAjaxAsync(REQUEST_URL.REMOVEBILLDRAFTDATA, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  layer.msg('已取消');
                } else {
                  layer.msg(res.msg);
                }
              })
            },
            success: function (layero, index) {
              var param0 = {
                shopId: shopId,
                type: type,
                creator: creator,
                pageNo: pageNo,
                pageSize: pageSize
              }
              reqAjaxAsync(REQUEST_URL.GETBILLDRAFTDATA, JSON.stringify(param0)).done(function (res) {
                init(res, type);
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
                      type: type,
                      creator: creator,
                      pageNo: obj.curr,
                      pageSize: pageSize
                    }

                    if (!first) {
                      reqAjaxAsync(REQUEST_URL.GETBILLDRAFTDATA, JSON.stringify(param1)).done(function (res) {
                        init(res, type);
                      })
                    }
                  }
                })
              })
            },
            yes: function (index, layero) {
              var billBeginDate = $(layero).find('#timeArea').attr('data-beginTime');
              var billEndDate = $(layero).find('#timeArea').attr('data-endTime');
              var param = {
                type: type,
                billBeginDate: billBeginDate,
                billEndDate: billEndDate,
                shopId: shopId,
                creator: creator
              }
              if (!billBeginDate || !billEndDate) {
                layer.msg('请选择账单开始和结束时间!')
                return;
              }

              if ($(layero).find('i').hasClass('active')) {
                layer.msg('请先点击操作按钮保存修改后的数据!');
                return;
              }
              if (lock) {
                lock = false;
                reqAjaxAsync(REQUEST_URL.SAVEBILLDRAFTTOREALDATA, JSON.stringify(param)).done(function (res) {
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
        } else {
          layer.msg(res.msg);
          $('#upload').attr('data-excelPath', '');
        }
      })
    }
  })

  //表格数据编辑
  $('#details-1 table').on('click', 'i', function () {
    $(this).toggleClass('active');
    var className = $(this).attr('class');
    if (className == 'active') {
      $(this).parents('tr').children('td:not(:last):not(:lt(4))').prop('contentEditable', true).find('span').css('outline', '1px solid #ccc');
    } else {
      $(this).parents('tr').children('td:not(:last):not(:lt(4))').prop('contentEditable', false).find('span').css('outline', 'none');
      var draftId = $(this).parents('tr').attr('data-id');
      var param = {
        draftId: draftId,
        payContent: amount($(this))
      }
      if (lock) {
        lock = false;
        reqAjaxAsync(REQUEST_URL.EDITBILLDRAFTDATA, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            layer.msg(res.msg);
            lock = true;
          } else {
            layer.msg(res.msg);
            lock = true;
          }
        })
      }
    }
  })

  //弹窗表格数据渲染方法
  function init(res, type) {
    if (res.code == 1) {
      var sHtml =
        '<thead>' +
        '<tr>' +
        '<th>序号</th>';
      if (type == 0) {
        sHtml +=
          '<th>门牌号</th>';
      } else {
        sHtml +=
          '<th>车牌号</th>';
      }
      sHtml +=
        '<th>缴费人</th>' +
        '<th>缴费人手机号</th>';
      var payContent = JSON.parse(res.data[0].payContent);
      for (var a = 0; a < payContent.length; a++) {
        sHtml +=
          '<th data-setId="' + payContent[a].setId + '">' + payContent[a].setName + '</th>';
      }
      sHtml +=
        '<th>操作</th>' +
        '</tr>' +
        '</thead><tbody>';
      for (var i = 0; i < res.data.length; i++) {
        var data = res.data[i];
        sHtml +=
          '<tr data-id="' + data.id + '">' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + data.doorOrCarCode + '</td>' +
          '<td>' + data.payer + '</td>' +
          '<td>' + data.payerPhone + '</td>';
        for (var z = 0; z < JSON.parse(data.payContent).length; z++) {
          var data1 = JSON.parse(data.payContent)[z];
          if (data1.amount) {
            sHtml +=
              '<td data-setId="' + data1.setId + '" data-setName="' + data1.setName + '"><span>' + data1.amount + '</span></td>';
          } else {
            sHtml +=
              '<td data-setId="' + data1.setId + '" data-setName="' + data1.setName + '"><span>0</span></td>';
          }
        }
        sHtml +=
          '<td><i></i></td>';
      }
      sHtml += '</tbody>';
      $('.table-area table').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //获取缴费金额
  function amount(that) {
    var payContent = [];
    var td = that.parents('tr').find('span');
    $(td).each(function () {
      var obj = {};
      obj.setId = $(this).parent().attr('data-setId');
      obj.amount = Number($.trim($(this).text()));
      obj.setName = $(this).parent().attr('data-setName');
      payContent.push(obj);
    })
    return payContent;
  }

  //金额正则匹配
  function isAmount(val) {
    var reg = /^(([1-9]\d{0,4})|(([0]\.\d{0,2}|[1-9]\d{0,4}\.\d{0,2}|[0])))$/;//保留2位小数
    var RegEx = new RegExp(reg);
    return RegEx.test(val);
  }

  //表格数据校验
  $('#details-1 table').on('keyup', 'td', function () {
    var val = $(this).text();
    if (!isAmount(val)) {
      $(this).html('<span></span>').find('span').css('outline', '1px solid #ccc');
    }
    if (val.length > 8) {
      layer.msg('请输入符合标准数字,最大金额可输入99999.99!');
      $(this).find('span').text('').css('outline', '1px solid #ccc');
    }
  })

  //时间控件初始化
  $('#timeArea').on('click', function () {
    laydateInit('timeArea', '至', -365, 0);
  })

})(jQuery)