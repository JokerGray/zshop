/**
 * Created by Administrator on 2017/6/30.
 */
(function ($) {
  var REQUEST_URL = {
    GETLEXICONBYCATEGORYID: 'operationCloudShop/getLexiconByCategoryId',//获取线上分类绑定的搜索词库数据
    ADDORREMOVELEXICON: 'operationCloudShop/addOrRemoveLexicon'//添加或者删除分类词库关联的数据
  }
  var pageNo = 1;
  var pageSize = 10;
  var userNo = sessionStorage.getItem("userno") || "";
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
          '<td>' + row.name + '</td>' +
          '<td>' +
          '<div class="delete"><i class="glyphicon glyphicon-minus-sign"></i>删除</div>' +
          '</td>' +
          '<td>' + row.create_time + '</td>' +
          '</tr>';
      }
      $('#get_lexicon tbody').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //初始化列表
  function initList() {
    var id = $('#get_lexicon').attr('data-id');
    var param = "{'id':'" + id + "','pageNo':'" + pageNo + "','pageSize':'" + pageSize + "'}";
    var res = reqAjax(REQUEST_URL.GETLEXICONBYCATEGORYID, param);
    getList(res);
    /*$('#shop_list .row p').html("总数：" + res.total + "条");*/


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
        var param = "{'id':'" + id + "','pageNo':'" + obj.curr + "','pageSize':'" + pageSize + "'}";
        var res = reqAjax(REQUEST_URL.GETLEXICONBYCATEGORYID, param);
        getList(res);
        /*if(!first){ //一定要加此判断，否则初始时会无限刷新
         location.href = '?page='+obj.curr;
         }*/
        $('#page-list').html(render(res, obj.curr));
        $('#get_lexicon .row p').html('共 ' + obj.pages + ' 页，每页 ' + pageSize + ' 条，共 ' + res.total + ' 条');
      }
    });
  }

  setTimeout(function () {
    initList();
  }, 100)


  //新增
  $('#get_lexicon .search-area .btn-info').click(function () {
    var id = $('#get_lexicon').attr('data-id');
    layer.open({
      type: 2,
      title: ['新增搜索词', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['500px', '250px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: 'add_thesaurus.html',
      btn: ['保存'],
      btnAlign: 'c',
      success: function (layero, index) {
        var body = layer.getChildFrame('body');
        body.find('#add_thesaurus').attr('data-id', id);
      },
      yes: function () {
        sub();
      }
    });
  })

  //新增保存
  function sub() {
    var body = layer.getChildFrame('body');
    var name = $.trim(body.find('#add_thesaurus input').val());
    var categoryId = body.find('#add_thesaurus').attr('data-id');
    var param = "{'addLexicon': [{'name': '" + name + "', 'categoryId': '" + categoryId + "'}]}";
    var res = reqAjax(REQUEST_URL.ADDORREMOVELEXICON, param);
    if (res.code == 1) {
      parent.layer.msg(res.msg);
      setTimeout(function () {
        location.reload();
      }, 500)
    } else {
      layer.msg(res.msg);
    }
  }

  //删除
  $('#get_lexicon').on('click', '.delete', function () {
    var removeIds = $(this).parents('tr').attr('data-id');
    var param = "{'removeIds':'" + removeIds + "','userNo':'" + userNo + "'}";
    layer.confirm("确定删除吗?", {icon: 3, title: '提示'}, function () {
      var res = reqAjax(REQUEST_URL.ADDORREMOVELEXICON, param);
      if (res.code == 1) {
        layer.msg(res.msg);
        setTimeout(function () {
          location.reload();
        }, 500)
      } else {
        layer.msg(res.msg);
      }
    })
  })

})(jQuery)