(function ($) {
  var pageNo = 1;
  var pageSize = 8;
  var userno = yyCache.get("userno") || "6";

  var REQUEST_URL = {
    GETPROVINCEORAREA: 'operationCloudShop/getProvinceOrArea',//获取省或市的下拉框数据
    GETSHOPLABELDETAIL: 'operationCloudShop/getShopLabelDetail',//获取为你推荐店铺明细
    GETSHOPLIST: 'operationCloudShop/getShopList',//分页获取所有上线的店铺
    GETSPREADSHOPLIST: 'operationCloudShop/getSpreadShopList',//获取为你推荐店铺列表
    REMOVESHOPLABEL: 'operationCloudShop/removeShopLabel',//单个删除为你推荐店铺数据
    SUBSHOPLABEL: 'operationCloudShop/subShopLabel',//添加或编辑保存为你推荐店铺数据
    GETTRADELIST: 'operationCloudShop/getTradeList'//行业列表数据
  }

  var layer = layui.layer;
  var laypage = layui.laypage;
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  $(function () {
    getProvin();
    initList();
    getTradeList();
  })

  //获取所有省信息
  function getProvin() {
    var sHtml = '';
    var param = {};
    var res = reqAjax(REQUEST_URL.GETPROVINCEORAREA, JSON.stringify(param));
    if (res.code == 1) {
      sHtml += '<option>-请选择-</option>';
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml += '<option value="' + row.code + '">' + row.areaname + '</option>';
      }
      $('#province').html(sHtml);
    }
  }

  //获取所有行业数据
  function getTradeList() {
    var sHtml = '';
    var res = reqAjax(REQUEST_URL.GETTRADELIST);
    if (res.code == 1) {
      sHtml += '<option>-请选择-</option>';
      for (var i = 0, len = res.data.length; i < len; i++) {
        var data = res.data[i];
        sHtml += '<option value="' + data.id + '">' + data.name + '</option>'
      }
      $('#trade').html(sHtml);
    }
  }

  //点击省份获取市级信息
  $('#province').on('change', function () {
    var sHtml = '';
    var provinceId = $(this).val();
    var param = {
      provinceId: provinceId
    }
    var res = reqAjax(REQUEST_URL.GETPROVINCEORAREA, JSON.stringify(param));
    if (res.code == 1) {
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml += '<option value="' + row.code + '">' + row.areaname + '</option>';
      }
      $('#city').html(sHtml);
    } else {
      $('#city').html('<option>-请选择-</option>');
    }
  })

  //列表渲染
  function getList(res) {
    var sHtml = '';
    if (res.code == 1) {
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml +=
          '<tr data-id="' + row.id + '" data-shopId="' + row.shopId + '">' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + row.shopName + '</td>' +
          '<td><img src="' + row.imageUrl + '"></td>' +
          '<td>' + row.cityName + '</td>' +
          '<td>' + isNull(row.tradeName) + '</td>' +
          '<td class="labelName">' + row.labelName + '</td>' +
          '<td class="type" data-labelId="' + row.labelId + '" data-labelType="' + row.labelType + '"></td>' +
          '<td class="status" data-shopStatus="' + row.shopStatus + '"></td>' +
          '<td><div class="edit"><i class="edicticon"></i>修改</div><div class="delete"><i class="glyphicon glyphicon-minus-sign"></i>删除</div></td>' +
          '<td class="creatName">' + isNull(row.createUserName) + '</td>' +
          '<td>' + row.createTime + '</td>' +
          '<td class="desc">' + isNull(row.description) + '</td>'
        '</tr>';
      }

      $('#shop_promotion .content tbody').html(sHtml);


      $('.status').each(function () {
        if ($(this).attr('data-shopStatus') == 0) {
          $(this).text('上线')
        } else {
          $(this).text('下线')
        }
      })

      $('.type').each(function () {
        if ($(this).attr('data-labelType') == 3) {
          $(this).text('店铺标签');
        }
      })
    } else {
      layer.msg(res.msg);
    }
  }

  //列表初始化方法
  function initList() {
    var shopName = $.trim($('#shop_promotion .search-area input').val()) || '';
    var trade = $('#trade').val();
    var cityId = $('#city').val();
    if (cityId == '-请选择-') {
      cityId = '';
    }
    if (trade == '-请选择-') {
      trade = '';
    }
    var param = {
      pageNo: pageNo,
      pageSize: pageSize,
      cityId: cityId,
      shopName: shopName,
      trade: trade
    }

    var res = reqAjax(REQUEST_URL.GETSPREADSHOPLIST, JSON.stringify(param));
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
        var param = {
          pageNo: obj.curr,
          pageSize: pageSize,
          cityId: cityId,
          shopName: shopName
        }
        if (!first) {
          var res = reqAjax(REQUEST_URL.GETSPREADSHOPLIST, JSON.stringify(param));
          getList(res);
        }
      }
    });
  }

  //查询方法
  $('#shop_promotion .search-area a:eq(0)').on('click', function () {
    $('#shop_promotion tbody').html('');
    initList();
  })

  //删除
  $('#shop_promotion .content').on('click', '.delete', function () {
    var mid = $(this).parents('tr').attr('data-id');
    var param = {
      id: mid
    }
    layer.confirm("确定删除吗?", {icon: 3, title: '提示'}, function () {
      var res = reqAjax(REQUEST_URL.REMOVESHOPLABEL, JSON.stringify(param));
      if (res.code == 1) {
        parent.layer.msg('删除成功!');
        setTimeout(function () {
          location.reload(true);
        }, 500)
      } else {
        layer.msg(res.msg);
      }
    })
  })

  //新增修改方法
  function sub() {
    var body = layer.getChildFrame('body');
    var id = body.find('#chooseShop').attr('data-id') || '';
    var shopId = body.find('#chooseShop').attr('data-shopId');
    var labelType = 3;
    var labelId = 8;
    var labelName = '商城滚动';
    var imageUrl = body.find('img').attr('src');
    var description = $.trim(body.find('textarea').val());
    var createUser = userno;
    var param = {
      id: id,
      shopId: shopId,
      labelId: labelId,
      labelType: labelType,
      labelName: labelName,
      imageUrl: imageUrl,
      description: description,
      createUser: createUser
    }
    var res = reqAjax(REQUEST_URL.SUBSHOPLABEL, JSON.stringify(param));
    if (res.code == 1) {
      if (id) {
        parent.layer.msg('修改成功');
      } else {
        parent.layer.msg('新增成功');
      }
      setTimeout(function () {
        location.reload(true);
      }, 500)
    } else {
      layer.msg(res.msg);
    }
  }

  //新增推广店铺弹窗
  $('#shop_promotion .search-area a:eq(1)').click(function () {
    layer.open({
      type: 2,
      title: ['新增推广店铺', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['800px', '700px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: '../add_shop/add_shop.html',
      btn: ['保存'],
      btnAlign: 'c',
      yes: function () {
        sub();
      },
      success: function (layero, index) {
        var body = layer.getChildFrame('body', index);
        body.find('#add_shop').attr('data-flag', '0');
      }
    });
  })

  //修改推广店铺弹窗
  $('#shop_promotion .content').on('click', '.edit', function () {
    var id = $(this).parents('tr').attr('data-id');//主键id
    var shopId = $(this).parents('tr').attr('data-shopId');
    var shopName = $(this).parents('tr').find('td').eq(1).text();
    var imageUrl = $(this).parents('tr').find('img').attr('src');
    var description = $(this).parents('tr').find('.desc').text();
    layer.open({
      type: 2,
      title: ['修改店铺信息', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['800px', '668px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: '../add_shop/add_shop.html',
      btn: ['保存'],
      btnAlign: 'c',
      success: function (layero, index) {
        var body = layer.getChildFrame('body', index);
        body.find('#add_shop').attr('data-flag', '1');
        body.contents().find('#chooseShop').val(shopName).attr('data-id', id).attr('data-shopId', shopId);//店铺名 主键id 店铺id
        body.contents().find('#uploadImg').html('<img src="' + imageUrl + '">');
        body.contents().find('textarea').val(description);
      },
      yes: function () {
        sub();
      }
    })
  })

  //判断字段是否为空
  function isNull(val) {
    if (!val || val == "null") {
      return '无';
    }
    return val;
  }

})(jQuery)