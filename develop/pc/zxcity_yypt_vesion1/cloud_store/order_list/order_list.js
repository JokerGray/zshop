/**
 * Created by Administrator on 2017/6/29.
 */
(function ($) {
  var pageNo = 1;
  var pageSize = 10;
  var userno = yyCache.get("userno") || "66";
  var shopId = '';

  var REQUEST_URL = {
    GETPROFESSPRODUCTORDERLIST: 'operationCloudShop/getProfessProductOrderList',//获取专业制作订单列表
    GETPROFESSPRODUCTORDERDETAIL: 'operationCloudShop/getProfessProductOrderDetail',//获取专业制作订单详细
    SETPROFESSPRODUCTORDER: 'operationCloudShop/setProfessProductOrder',//修改订单状态
    GETSPREADBYSHOPID: 'operationCloudShop/getSpreadByShopId',//下载发现页面广告(有值则已制作)
    SUBMITZYZZ: 'operationCloudShop/saveZyzzWorkOrder'	 //生成专业制作工单
  }

  var layer = layui.layer;
  var laypage = layui.laypage;
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  $(function () {
    initList();
  })

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
          sHtml += '<td class="extend2" data-extend2="1">专业制作视频</td>'
        } else if (row.extend2 == '2') {
          sHtml += '<td class="extend2" data-extend2="2">专业制作720全景</td>'
        } else if (row.extend2 == '3') {
          sHtml += '<td class="extend2" data-extend2="3">专业制作直播</td>'
        } else if (row.extend2 == '4') {
          sHtml += '<td class="extend2" data-extend2="4">专业制作虚拟物品</td>'
        } else if (row.extend2 == '5') {
          sHtml += '<td class="extend2" data-extend2="5">专业制作图片</td>'
        } else if (row.extend2 == '6') {
          sHtml += '<td class="extend2" data-extend2="6">专业发现页面广告</td>'
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
          '<td>' + row.createTime + '</td>' +
          /*if(row.extend2 == '1' || row.extend2 == '2'){
        	  sHtml +=  '<td class="operation"><a class="order" href="##">接单</a></td>' 
          } else {
        	  sHtml +=  '<td class="operation"></td>' 
          }*/
          '<td class="operation"></td>'
        sHtml += '</tr>';
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
        if ($(this).attr('data-payStatus') == "0") {
          $(this).text('未支付');
        } else if ($(this).attr('data-payStatus') == 1) {
          $(this).text('已支付');
        } else if ($(this).attr('data-payStatus') == 2) {
          $(this).text('失败');
        }
      })
      
      $('.contactMobile').each(function () {
        if (!$(this).text()) {
          $(this).text('无');
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
      
      $('.operation').each(function () {
    	  var orderSataus = $(this).siblings(".orderStatus").attr('data-orderStatus')
    	  var extend2 = $(this).siblings(".extend2").attr('data-extend2')
          if (orderSataus == 0 && (extend2 == 1 || extend2 == 2)) {
            $(this).html('<a class="order" href="##">接单</a>');
          } else if (orderSataus > 0 && (extend2 == 1 || extend2 == 2)) {
            $(this).text('已接单');
          } 
        })

    } else {
      layer.msg(res.msg);
    }
  }

  //列表初始化方法
  function initList() {
    var shopName = $.trim($('#order_list .search-area input:eq(0)').val()) || '';
    var contactName = $.trim($('#order_list .search-area input:eq(1)').val()) || '';
    var contactMobile = $.trim($('#order_list .search-area input:eq(2)').val()) || '';
    var payStatus = $('#payStatus').val();
    var orderStatus = $('#orderStatus').val();
    /*var extend2 = $('#extend2').val();*/
    var param = {
      pageNo: pageNo,
      pageSize: pageSize,
      shopName: shopName,
      payStatus: payStatus,
      orderStatus: orderStatus,
      contactName: contactName,
      contactMobile: contactMobile
    }

    var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERLIST, JSON.stringify(param));
    getList(res);

    //分页查询
    laypage.render({
      elem: 'paging-box-r',
      count: res.total,//总数
      limit: pageSize,//每页条数
      prev: '<',
      next: '>',
      curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
        var page = location.search.match(/page=(\d+)/);
        return page ? page[1] : 1;
      }(),
      layout: ['prev', 'page', 'next', 'skip'],//功能
      jump: function (obj, first) {
        if (!first) {
          var param = {
            pageNo: obj.curr,
            pageSize: pageSize,
            shopName: shopName,
            payStatus: payStatus,
            orderStatus: orderStatus,
            contactName: contactName,
            contactMobile: contactMobile
          }
          var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERLIST, JSON.stringify(param));
          getList(res);
        }
      }
    });
  }

  //查询方法
  $('#order_list .search-area .btn-success').on('click', function () {
    $('#order_list tbody').html('');
    initList();
  })

  //查看订单详情
  $('#order_list').on('click', '.edit', function () {
    var id = $(this).parents('tr').attr('data-id');
    var orderNo = $(this).parents('tr').attr('data-orderNo');
    var extend2 = $(this).parents('td').siblings(".extend2").attr('data-extend2');
    if(extend2 == 1 || extend2 == 2){
    	layer.open({
  	      type: 2,
  	      title: ['专业制作订单详情', 'background:#303030;color:#fff;'],
  	      skin: 'layer-ext-myskin',
  	      area: ['867px', '600px'],
  	      shade: 0.5,
  	      closeBtn: 1,
  	      shadeClose: false,
  	      scrollbar: false,
  	      content: '../order_details/order_details.html',
  	      btnAlign: 'c',
  	      success: function (layero, index) {
  	        var body = layer.getChildFrame('body');
  	        var param = {
  	          orderNo: orderNo
  	        }
  	        var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERDETAIL, JSON.stringify(param));
  	        details(res);
  	        var res = reqAjax(REQUEST_URL.GETSPREADBYSHOPID, JSON.stringify({shopId: shopId}));
  	        if (res.code == 1) {
  	          if (res.data) {
  	            body.find('.download').attr('href', res.data.imageUrl);
  	          } else {
  	            body.find('.download').text('暂无数据');
  	          }
  	        }
  	      }
  	    })
    }else{
    	layer.open({
  	      type: 2,
  	      title: ['专业制作订单详情', 'background:#303030;color:#fff;'],
  	      skin: 'layer-ext-myskin',
  	      area: ['867px', '740px'],
  	      shade: 0.5,
  	      closeBtn: 1,
  	      shadeClose: false,
  	      scrollbar: false,
  	      content: '../order_details/order_details.html',
  	      btn: ['保存'],
  	      btnAlign: 'c',
  	      success: function (layero, index) {
  	        var body = layer.getChildFrame('body');
  	        var param = {
  	          orderNo: orderNo
  	        }
  	        var res = reqAjax(REQUEST_URL.GETPROFESSPRODUCTORDERDETAIL, JSON.stringify(param));
  	        details2(res);
  	        var res = reqAjax(REQUEST_URL.GETSPREADBYSHOPID, JSON.stringify({shopId: shopId}));
  	        if (res.code == 1) {
  	          if (res.data) {
  	            body.find('.download').attr('href', res.data.imageUrl);
  	          } else {
  	            body.find('.download').text('暂无数据');
  	          }
  	        }
  	      },
  	      yes: function () {
  	          var body = layer.getChildFrame('body');
  	          var orderStatus = body.find('.remarks select').val();
  	          var dealRemark = $.trim(body.find('.dealRemark').val());
  	          var param = {
  	            id: id,
  	            orderNo: orderNo,
  	            orderStatus: orderStatus,
  	            dealRemark: dealRemark
  	          }
  	          var res = reqAjax(REQUEST_URL.SETPROFESSPRODUCTORDER, JSON.stringify(param));
  	          if (res.code == 1) {
  	            parent.layer.msg('修改状态成功');
  	            setTimeout(function () {
  	              location.reload(true);
  	            }, 500)
  	            var index = parent.layer.getFrameIndex(window.name);
  	            layer.close(index);
  	          } else {
  	            layer.msg(res.msg);
  	          }
  	        }
  	    })
	  }
  })
  
  
  //平台用户接单
  $('#order_list').on('click', '.order', function () {
    var orderNo = $(this).parents('tr').attr('data-orderNo');
    var yyCacheId = yyCache.get("userId");
    var data = {
    		orderNo : orderNo,
    		yyCacheId : yyCacheId
		};
    layer.confirm("是否接下订单号【"+orderNo+"】的订单？",{icon:0,title:"提示"},function (index) {
	    var res = reqAjax(REQUEST_URL.SUBMITZYZZ, JSON.stringify(data));
	    if(res.code == 1){
	    	layer.close(index);
	    	parent.layer.msg('接单成功');
	        setTimeout(function () {
	          location.reload(true);
	        }, 500)
	    } else {
	    	layer.msg(res.msg);
	    }
    })
  })

  //详情初始化方法
  function details(res) {
    var body = layer.getChildFrame('body');
    var sHtml = '';
    if (res.code == 1) {
      var row = res.data.orderInfo;
      shopId = row.bussinessId;
      sHtml +=
        '<div class="order-num">' +
        '<p>订单号：' + isNull(row.unionPayOrderNo) + '</p>' +
        '<p>总金额： <span>' + isNull(row.amount) + ' </span>元</p>' +
        '<p class="orderStatus" data-orderStatus="' + isNull(row.orderStatus) + '"></p>' +
        '</div>' +
        '<table class="layui-table" lay-skin="row">' +
        '<thead>' +
        '<tr><th>序号</th><th>商品名称</th><th>商品图片</th>';
      if (row.extend2 == '6') {
        sHtml += '<th>下载发现页面广告</th>';
      }
      sHtml +=
        '<th>商品规格</th><th>商品单价</th><th>商品数量</th></tr></thead>' +
        '<tbody>';
      for (var i = 0; i < row.orderItemList.length; i++) {
        var rowA = row.orderItemList[i];
        sHtml +=
          '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + isNull(rowA.goodsName) + '</td>' +
          '<td><img src="..' + rowA.pictureUrl + '" style="width: 94px;height: 54px;"></td>';
        if (row.extend2 == '6') {
          sHtml += '<td><a class="download" href="javascript:void(0)" download>点击下载</a></td>';
        }
        sHtml +=
          '<td>' + isNull(rowA.StockName) + '</td>' +
          '<td>' + isNull(rowA.price) + '</td>' +
          '<td>1</td>' +
          '</tr>';
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
  
  
  
//详情初始化方法
  function details2(res) {
    var body = layer.getChildFrame('body');
    var sHtml = '';
    if (res.code == 1) {
      var row = res.data.orderInfo;
      shopId = row.bussinessId;
      sHtml +=
        '<div class="order-num">' +
        '<p>订单号：' + isNull(row.unionPayOrderNo) + '</p>' +
        '<p>总金额： <span>' + isNull(row.amount) + ' </span>元</p>' +
        '<p class="orderStatus" data-orderStatus="' + isNull(row.orderStatus) + '"></p>' +
        '</div>' +
        '<table class="layui-table" lay-skin="row">' +
        '<thead>' +
        '<tr><th>序号</th><th>商品名称</th><th>商品图片</th>';
      if (row.extend2 == '6') {
        sHtml += '<th>下载发现页面广告</th>';
      }
      sHtml +=
        '<th>商品规格</th><th>商品单价</th><th>商品数量</th></tr></thead>' +
        '<tbody>';
      for (var i = 0; i < row.orderItemList.length; i++) {
        var rowA = row.orderItemList[i];
        sHtml +=
          '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + isNull(rowA.goodsName) + '</td>' +
          '<td><img src="..' + rowA.pictureUrl + '" style="width: 94px;height: 54px;"></td>';
        if (row.extend2 == '6') {
          sHtml += '<td><a class="download" href="javascript:void(0)" download>点击下载</a></td>';
        }
        sHtml +=
          '<td>' + isNull(rowA.StockName) + '</td>' +
          '<td>' + isNull(rowA.price) + '</td>' +
          '<td>1</td>' +
          '</tr>';
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