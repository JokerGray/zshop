/**
 * Created by Administrator on 2017/6/21.
 */
(function ($) {
  var url = 'operationCloudShop/getShopList';//分页获取所有上线的店铺
  var pageNo = 1;
  var pageSize = 7;
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
        sHtml +=
          '<tr data-id="' + row.id + '">' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + row.shopName + '</td>' +
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
  function initList() {
    var shopName = $.trim($('#shop_list .search-area input').val());
    if (!shopName) {
      var param = "{'pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
    } else {
      var param = "{'shopName':'" + shopName + "','pageNo':" + pageNo + ",'pageSize':" + pageSize + "}";
    }
    var res = reqAjax(url, param);
    getList(res);
    $('#shop_list .row p').html("总数：" + res.total + "条");


    //分页查询
    var layer = layui.laypage;

    //固定写法-分页条渲染
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
      , jump: function (obj, first) {//obj是所有配置信息对象
        if (!shopName) {
          var param = "{'pageNo':" + obj.curr + ",'pageSize':" + pageSize + "}";
        } else {
          var param = "{'shopName':'" + shopName + "','pageNo':" + obj.curr + ",'pageSize':" + pageSize + "}";
        }
        var res = reqAjax(url, param);
        getList(res);
        /*if(!first){ //一定要加此判断，否则初始时会无限刷新
         location.href = '?page='+obj.curr;
         }*/
        $('#page-list').html(render(res, obj.curr));
        $('#shop_list .row p').html('共 ' + obj.pages + ' 页，每页 ' + pageSize + ' 条，共 ' + res.total + ' 条');
      }
    });
  }

  initList();

  //查询店铺
  $('#shop_list .search-area a').click(function () {
    $('#shop_list tbody').html('');
    initList();
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