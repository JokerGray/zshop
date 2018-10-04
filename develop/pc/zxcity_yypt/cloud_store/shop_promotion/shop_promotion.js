/**
 * Created by Administrator on 2017/6/20.
 */
(function ($) {
  var pageNo = 1;
  var pageSize = 8;
  var userno = sessionStorage.getItem("userno") || "";
  const REQUEST_URL = {
    GETPROVINCEORAREA: 'operationCloudShop/getProvinceOrArea',//获取省或市的下拉框数据
    GETSHOPLABELDETAIL: 'operationCloudShop/getShopLabelDetail',//获取为你推荐店铺明细
    GETSHOPLIST: 'operationCloudShop/getShopList',//分页获取所有上线的店铺
    GETSPREADSHOPLIST: 'operationCloudShop/getSpreadShopList',//获取为你推荐店铺列表
    REMOVESHOPLABEL: 'operationCloudShop/removeShopLabel',//单个删除为你推荐店铺数据
    SUBSHOPLABEL: 'operationCloudShop/subShopLabel'//添加或编辑保存为你推荐店铺数据
  }

  var layer = layui.layer;
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });


  //获取所有省信息
  function getProvin() {
    var sHtml = '';
    var res = reqAjax(REQUEST_URL.GETPROVINCEORAREA, "{}");
    if (res.code == 1) {
      sHtml += '<option>-请选择-</option>';
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml += '<option value="' + row.code + '">' + row.areaname + '</option>';
      }
      $('#province').html(sHtml);
    }
  }

  getProvin();

  //点击省份获取市级信息
  $('#province').on('change', function () {
    var sHtml = '';
    var provinceId = $(this).val();
    var param = "{provinceId:" + provinceId + "}";
    var res = reqAjax(REQUEST_URL.GETPROVINCEORAREA, param);
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
    var shopName = $('#shop_promotion .search-area input').val();
    var cityId = $('#city').val();
    if (cityId == '-请选择-') {
      cityId = '';
    }
    if (shopName == '' && cityId == '') {
      var param = "{'pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
    } else if (shopName == '' && cityId != '') {
      var param = "{'pageNo':" + pageNo + ",'pageSize':" + pageSize + ",'cityId':" + cityId + "}";
    } else if (shopName != '' && cityId == '') {
      var param = "{'pageNo':" + pageNo + ",'pageSize':" + pageSize + ",'shopName':'" + shopName + "'}";
    } else if (shopName != '' && cityId != '') {
      var param = "{'pageNo':" + pageNo + ",'pageSize':" + pageSize + ",'shopName':'" + shopName + "','cityId':" + cityId + "}";
    }

    var res = reqAjax(REQUEST_URL.GETSPREADSHOPLIST, param);
    getList(res);
    $('#shop_promotion .content p').html("总数：" + res.total + "条");


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
        if (shopName == '' && cityId == '') {
          var param = "{'pageNo':" + obj.curr + ",'pageSize':" + pageSize + "}";
        } else if (shopName == '' && cityId != '') {
          var param = "{'pageNo':" + obj.curr + ",'pageSize':" + pageSize + ",'cityId':" + cityId + "}";
        } else if (shopName != '' && cityId == '') {
          var param = "{'pageNo':" + obj.curr + ",'pageSize':" + pageSize + ",'shopName':'" + shopName + "'}";
        } else if (shopName != '' && cityId != '') {
          var param = "{'pageNo':" + obj.curr + ",'pageSize':" + pageSize + ",'shopName':'" + shopName + "','cityId':" + cityId + "}";
        }
        var res = reqAjax(REQUEST_URL.GETSPREADSHOPLIST, param);
        getList(res);

        $('#page-list').html(render(res, obj.curr));
        $('#shop_promotion .content p').html('共 ' + obj.pages + ' 页，每页 ' + pageSize + ' 条，共 ' + res.total + ' 条');
      }
    });
  }

  initList();

  //查询方法
  $('#shop_promotion .search-area a:eq(0)').click(function () {
    $('#shop_promotion tbody').html('');
    initList();
  })

  //删除方法
  $('#shop_promotion .content').on('click', '.delete', function () {
    var mid = $(this).parents('tr').attr('data-id');
    var param = "{id:" + mid + "}";
    var index = layer.confirm("确定删除吗?", {icon: 3, title: '提示'}, function () {
      var res = reqAjax(REQUEST_URL.REMOVESHOPLABEL, param);
      if (res.code == 1) {
        parent.layer.msg('删除成功!');
        $(this).parents('tr').remove();
        initList();
        location.reload(true);
        layer.close(index);
      } else {
        layer.msg(res.msg);
      }
    })
  })

  //新增方法
  function sub() {
    var body = layer.getChildFrame('body');
    var shopId = body.find('#chooseShop').attr('data-shopId');
    var labelType = 3;
    var labelId = 8;
    var labelName = '商城滚动';
    var imageUrl = body.find('img').attr('src');
    var description = $.trim(body.find('textarea').val());
    var createUser = userno;
    var param = "{'shopId':'" + shopId + "','labelId':'" + labelId + "','labelType':'" + labelType + "','labelName':'" + labelName + "','imageUrl':'" + imageUrl + "','description':'" + description + "','createUser':'" + createUser + "'}";
    var res = reqAjax(REQUEST_URL.SUBSHOPLABEL, param);
    if (res.code == 1) {
      parent.layer.msg('新增成功');
      location.reload();
      var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
      parent.layer.close(index);
    } else {
      layer.msg(res.msg);
    }
  }

  //修改方法
  function sub2() {
    var body = layer.getChildFrame('body');
    var id = body.find('#chooseShop').attr('data-id');
    var shopId = body.find('#chooseShop').attr('data-shopId');
    var labelType = 3;
    var labelId = 8;
    var labelName = '商城滚动';
    var imageUrl = body.find('img').attr('src');
    var description = $.trim(body.find('textarea').val());
    var modifyUser = userno;
    var param = "{'id':'" + id + "','shopId':'" + shopId + "','labelId':'" + labelId + "','labelType':'" + labelType + "','labelName':'" + labelName + "','imageUrl':'" + imageUrl + "','description':'" + description + "','modifyUser':'" + modifyUser + "'}";
    var res = reqAjax(REQUEST_URL.SUBSHOPLABEL, param);
    if (res.code == 1) {
      parent.layer.msg('保存成功');
      location.reload();
      var index = parent.layer.getFrameIndex(window.name);
      parent.layer.close(index);
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
        body.contents().find('img').attr('src', imageUrl);
        body.contents().find('textarea').val(description);
      },
      yes: function () {
        sub2();
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

})(jQuery)