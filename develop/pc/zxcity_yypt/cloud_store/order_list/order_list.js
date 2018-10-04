/**
 * Created by Administrator on 2017/6/29.
 */
(function ($) {
  var pageNo = 1;
  var pageSize = 10;
  var userno = sessionStorage.getItem("userno") || "";
  const REQUEST_URL = {
    GETPROFESSPRODUCTORDERLIST: 'operationCloudShop/getProfessProductOrderList',//获取专业制作订单列表
    GETPROFESSPRODUCTORDERDETAIL: 'operationCloudShop/getProfessProductOrderDetail',//获取专业制作订单详细
    SETPROFESSPRODUCTORDER: 'operationCloudShop/setProfessProductOrder'//修改订单状态
  }

  var layer = layui.layer;
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  //列表渲染
  function getList(res) {
    var sHtml = '';
    if (res.code == 1) {
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        var _t1 = isNull(row.unionPayOrderNo);
        var _t2 = _t1 == '' ? isNull(row.orderNo) : _t1;
        sHtml +=
          '<tr data-id="' + row.id + '" data-orderNo="' + row.orderNo + '">' +
          '<td>' + _t2 + '</td>' +//合并单号
          '<td>' + isNull(row.shopName) + '</td>';
        if (row.extend2 == '1') {
          sHtml += '<td>专业制作视频</td>'
        } else if (row.extend2 == '2') {
          sHtml += '<td>专业制作720全景</td>'
        } else if (row.extend2 == '3') {
          sHtml += '<td>专业制作直播</td>'
        } else if (row.extend2 == '4') {
          sHtml += '<td>专业制作虚拟物品</td>'
        } else if (row.extend2 == '5') {
          sHtml += '<td>专业制作图片</td>'
        } else if (row.extend2 == '6') {
          sHtml += '<td>专业发现页面广告</td>'
        } else {
          sHtml += '<td></td>'
        }
        sHtml += '<td>' + row.amount + '</td>' +
          '<td class="payType" data-payType="' + row.payType + '"></td>' +
          '<td class="payStatus" data-payStatus="' + row.payStatus + '"></td>' +
          '<td class="orderStatus" data-orderStatus="' + row.orderStatus + '"></td>' +
          '<td><div class="edit"><i class="edicticon"></i></div></td>' +
          '<td>' + row.contactName + '</td>' +
          '<td class="contactMobile">' + isNull(row.contactMobile) + '</td>' +
          '<td>' + row.createTime + '</td>'
        '</tr>';
      }

      $('#order_list .content tbody').html(sHtml);

      $('.payType').each(function () {
        if ($(this).attr('data-payType') == 1) {
          $(this).text('智享支付');
        } else if ($(this).attr('data-payType') == 2) {
          $(this).text('支付宝支付');
        }
      })

      $('.payStatus').each(function () {
        if ($(this).attr('data-payStatus') == 0) {
          $(this).text('未支付');
        } else if ($(this).attr('data-payStatus') == 1) {
          $(this).text('已支付');
        } else if ($(this).attr('data-payStatus') == 2) {
          $(this).text('失败');
        }
      })

      $('.orderStatus').each(function () {
        if ($(this).attr('data-orderStatus') == 0) {
          $(this).text('待处理');
        } else if ($(this).attr('data-orderStatus') == 1) {
          $(this).text('处理中');
        } else if ($(this).attr('data-orderStatus') == 2) {
          $(this).text('已完成');
        }
      })

      $('.contactMobile').each(function () {
        if (!$(this).text()) {
          $(this).text('无');
        }
      })

    } else {
      layer.msg(res.msg);
    }
  }

  //列表初始化方法
  function initList() {
    var shopName = $.trim($('#order_list .search-area input:eq(0)').val()) || '';
    var payStatus = $.trim($('#order_list .search-area input:eq(1)').val());
    payStatus == '未支付' ? payStatus = '0' : payStatus == '已支付' ? payStatus = '1' : payStatus = '';
    var orderStatus = $.trim($('#order_list .search-area input:eq(2)').val());
    orderStatus == '待处理' ? orderStatus = '0' : orderStatus == '处理中' ? orderStatus = '1' : orderStatus == '已完成' ? orderStatus = '2' : '';
    var contactName = $.trim($('#order_list .search-area input:eq(3)').val()) || '';
    var contactMobile = $.trim($('#order_list .search-area input:eq(4)').val()) || '';

    var param = "{'pageNo':'" + pageNo + "','pageSize':'" + pageSize + "','shopName':'" + shopName + "','payStatus':'" + payStatus + "','orderStatus':'" + orderStatus + "','contactName':'" + contactName + "','contactMobile':'" + contactMobile + "'}";

    var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERLIST, param);
    getList(res);


    //分页查询
    var layer = layui.laypage;

    var render = function (data, curr) {
      var arr = []
        , thisData = res.data;
      layui.each(thisData, function (index, item) {
        arr.push('<li>' + item + '</li>');
      });
      return arr.join('');
    };

    //调用分页
    layer({
      cont: 'paging-box-r'
      , first: false
      , last: false
      , prev: '<'
      , next: '>'
      , pages: Math.ceil(res.total / pageSize) //总页数
      , total: res.total//总数
      , curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
        var page = location.search.match(/page=(\d+)/);
        return page ? page[1] : 1;
      }()
      , jump: function (obj, first) {
        var param = "{'pageNo':'" + obj.curr + "','pageSize':'" + pageSize + "','shopName':'" + shopName + "','payStatus':'" + payStatus + "','orderStatus':'" + orderStatus + "','contactName':'" + contactName + "','contactMobile':'" + contactMobile + "'}";
        var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERLIST, param);
        getList(res);

        $('#page-list').html(render(res, obj.curr));
        $('#order_list .content p').html('共 ' + obj.pages + ' 页，每页 ' + pageSize + ' 条，共 ' + res.total + ' 条');
      }
    });
  }

  initList();

  //查询方法
  $('#order_list .search-area a').click(function () {
    $('#order_list tbody').html('');
    initList();
  })

  //查看订单详情
  $('#order_list').on('click', '.edit', function () {
    var id = $(this).parents('tr').attr('data-id');
    var orderNo = $(this).parents('tr').attr('data-orderNo');
    layer.open({
      type: 2,
      title: ['专业制作订单详情', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['867px', '825px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: '../order_details/order_details.html',
      btn: ['保存'],
      btnAlign: 'c',
      success: function () {
        var param = "{'orderNo':'" + orderNo + "'}";
        var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERDETAIL, param);
        details(res);
      },
      yes: function () {
        var body = layer.getChildFrame('body');
        var orderStatus = body.find('.remarks select').val();
        var dealRemark = $.trim(body.find('.dealRemark').val());
        var param = "{'id':'" + id + "','orderNo':'" + orderNo + "','orderStatus':'" + orderStatus + "','dealRemark':'" + dealRemark + "'}"
        var res = reqAjax(REQUEST_URL.SETPROFESSPRODUCTORDER, param);
        if (res.code == 1) {
          parent.layer.msg('修改状态成功');
          setTimeout(function () {
            location.reload();
          }, 500)
          var index = parent.layer.getFrameIndex(window.name);
          layer.close(index);
        } else {
          layer.msg(res.msg);
        }
      }
    })
  })

  //详情初始化方法
  function details(res) {
    var body = layer.getChildFrame('body');
    var sHtml = '';
    if (res.code == 1) {
      var row = res.data.orderInfo;
      sHtml +=
        '<div class="order-num">' +
        '<p>订单号：' + isNull(row.unionPayOrderNo) + '</p>' +
        '<p>总金额： <span>' + isNull(row.amount) + ' </span>元</p>' +
        '<p class="orderStatus" data-orderStatus="' + isNull(row.orderStatus) + '"></p>' +
        '</div>' +
        '<table class="layui-table" lay-skin="row">' +
        '<thead>' +
        '<tr><th>序号</th><th>商品名称</th><th>商品图片</th><th>商品规格</th><th>商品单价</th><th>商品数量</th></tr></thead>' +
        '<tbody>';
      for (var i = 0; i < row.orderItemList.length; i++) {
        var rowA = row.orderItemList[i];
        sHtml += '<tr><td>' + (i + 1) + '</td><td>' + isNull(rowA.goodsName) + '</td><td><img src="..' + rowA.pictureUrl + '" style="width: 94px;height: 54px;"></td><td>' + isNull(rowA.StockName) + '</td><td>' + isNull(rowA.price) + '</td><td>1</td></tr>';
      }
      sHtml += '</tbody>' +
        '</table>' +
        '<div class="offer-info">' +
        '<div class="pay-info">' +
        '<div class="subtitle"><i></i>支付信息</div>' +
        '<p class="paytype" data-paytype="' + row.payType + '"></p>' +
        '<p class="paystatus" data-paystatus="' + row.payStatus + '">123</p></div>' +
        '<div class="logistics-info">' +
        '<div class="subtitle"><i></i>店铺信息</div>' +
        '<div class="info-area">' +
        '<div class="info-line">' +
        '<span>店铺名称：' + isNull(row.shopName) + '</span>' +
        '<span>联系人：' + isNull(row.contactName) + '</span>' +
        '<span>联系电话：' + isNull(row.contactMobile) + '</span>' +
        '</div>' +
        '<div class="info-line"><span>联系地址：' + isNull(row.address) + '</span></div></div></div>' +
        '<div class="remarks"><div class="subtitle"><i></i>处理意见</div>' +
        '<div>' +
        '<p>状态：</p>' +
        '<select class="form-control">' +
        '<option value="0">待处理</option>' +
        '<option value="1">处理中</option>' +
        '<option value="2">已完成</option>' +
        '</select><br>' +
        '<p>备注：</p>' +
        '<input class="dealRemark" type="text" class="form-control" value="' + isNull(row.dealRemark) + '">' +
        '</div>' +
        '</div>';
      body.find('#order_details').html(sHtml);

      //订单状态
      if (body.find('.orderStatus').attr('data-orderStatus') == '0') {
        body.find('.orderStatus').text('订单状态：待处理');
        body.find('.remarks select').val('0');
      } else if (body.find('.orderStatus').attr('data-orderStatus') == '1') {
        body.find('.orderStatus').text('订单状态：处理中');
        body.find('.remarks select').val('1');
      } else if (body.find('.orderStatus').attr('data-orderStatus') == '2') {
        body.find('.orderStatus').text('订单状态：已完成');
        body.find('.remarks select').val('2');
      }

      //支付类型
      if (body.find('.paytype').attr('data-paytype') == '1') {
        body.find('.paytype').text('支付方式：智享支付');
      } else {
        body.find('.paytype').text('支付方式：支付宝支付');
      }

      //支付状态
      if (body.find('.paystatus').attr('data-paystatus') == '0') {
        body.find('.paystatus').text('支付状态：未支付');
      } else if (body.find('.paystatus').attr('data-paystatus') == '1') {
        body.find('.paystatus').text('支付状态：已支付');
      } else if (body.find('.paystatus').attr('data-paystatus') == '2') {
        body.find('.paystatus').text('支付状态：失败');
      }

    } else {
      layer.msg(res.msg);
    }
  }

  //判断字段是否为空
  function isNull(val) {
    if (val == null || val == "null" || val == undefined) {
      return '';
    }
    return val;
  }
})(jQuery)