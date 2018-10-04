/**
 * Created by Administrator on 2017/6/21.
 */
(function ($) {
  var url = 'operationCloudShop/getShopList';//分页获取所有上线的店铺
  var pageNo = 1;
  var pageSize = 7;
  var layer = layui.layer;
  var laypage = layui.laypage;
  var labelId = 8;

  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  //列表渲染
  function getList(res) {
    var sHtml = '';
    if (res.code == 1) {
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml +=
          '<tr data-id="' + row.id + '">' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + row.shopName + '</td>' +
          '<td>' + row.trade + '</td>' +
          '<td class="status" data-shopStatus="' + row.shopStatus + '"></td>' +
          '<td>' + row.cityName + '</td>' +
          '<td>' + isNull(row.contact) + '</td>' +
          '</tr>';
      }
      $('#shop_list tbody').html(sHtml);

      $('.status').each(function () {
        if ($(this).attr('data-shopStatus') == 0) {
          $(this).text('上线')
        } else {
          $(this).text('下线')
        }
      })
    } else {
      layer.msg(res.msg);
    }
  }

  //初始化列表
  function initList(shopName) {
    $('#shop_list tbody').html('');
    var param = {
      shopName: shopName,
      pageNo: pageNo,
      pageSize: pageSize,
      labelId: labelId
    }
    var res = reqAjax(url, JSON.stringify(param));
    getList(res);

    //调用分页
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
      jump: function (obj, first) {//obj是所有配置信息对象
        var param = {
          shopName: shopName,
          pageNo: obj.curr,
          pageSize: pageSize
        }
        if (!first) {
          var res = reqAjax(url, JSON.stringify(param));
          getList(res);
        }
      }
    });
  }

  initList();

  //查询店铺
  $('#shop_list .search-area a').on('click', function () {
    $('#shop_list tbody').html('');
    var shopName = $.trim($('#shop_list .form-group input').val());
    initList(shopName);
  })

  //点击添加状态选中
  $('#shop_list tbody').on('click', 'tr', function () {
    $(this).addClass('active').siblings().removeClass('active');
  })

  //判断字段是否为空
  function isNull(val) {
    if (val == null || val == "null" || val == undefined || val == '') {
      return '无';
    }
    return val;
  }

})(jQuery)