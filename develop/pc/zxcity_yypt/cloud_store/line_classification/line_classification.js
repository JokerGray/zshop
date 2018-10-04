/**
 * Created by Administrator on 2017/6/26.
 */
(function ($) {
  var pageNo = 1;
  var pageSize = 8;
  var userno = sessionStorage.getItem("userno") || "";
  const REQUEST_URL = {
    GETONLINECATEGORYLIST: 'operationCloudShop/getOnlineCategoryList',//获取线上分类树形分页表格数据
    SETCATEGORYINHOME: 'operationCloudShop/setCategoryInHome',//设置线上分类是否首页显示
    REMOVEONLINECATEGORY: 'operationCloudShop/removeOnlineCategory',//根据id删除线上分类数据
    GETLEXICONBYCATEGORYID: 'operationCloudShop/getLexiconByCategoryId',//获取线上分类绑定的搜索词库数据
    ADDORREMOVELEXICON: 'operationCloudShop/addOrRemoveLexicon',//添加或者删除分类词库关联的数据
    SUBONLINECATEGORY: 'operationCloudShop/subOnlineCategory'//添加或者更新线上分类数据
  }

  var layer = layui.layer;
  layer.config({
    extend: 'myskin/style.css' //同样需要加载新皮肤
  });

  $('#line_classification').on('click', '.content tbody tr', function () {
    $(this).addClass('active').siblings().removeClass('active');
  })

//列表渲染
  function getList(res) {
    var sHtml = '';
    if (res.code == 1) {
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml +=
          '<tr data-id="' + row.id + '" data-pid="' + row.pid + '">' +
          /*'<td>' + (i + 1) + '</td>' +*/
          '<td><span class="glyphicon glyphicon-triangle-right">' + row.categoryName + '</td>' +
          '<td><img src="' + isNull(row.categoryLogo) + '" alt="栏目图片"></td>' +
          '<td class="categoryStatus" data-categoryStatus="' + row.categoryStatus + '"></td>' +
          '<td class="isHomeShow" data-isHomeShow="' + row.isHomeShow + '"></td>' +
          '<td class="categoryType" data-categoryType="' + row.categoryType + '"></td>' +
          '<td>' +
          '<div class="edit"><i class="edicticon"></i>修改</div>' +
          '<div class="delete"><i class="glyphicon glyphicon-minus-sign"></i>删除</div>' +
          '</td>' +
          '<td class="isShow">' +
          '<div class="isshow"><i class="ho-icon"></i></div>' +
          '</td>' +
          '<td>' + isNull(row.scSysBackUser.username) + '</td>' +
          '<td>' + isNull(row.modifyTime) + '</td>' +
          '</tr>';
      }
      $('#line_classification .content tbody').html(sHtml);

      //栏目状态
      $('.categoryStatus').each(function () {
        if ($(this).attr('data-categoryStatus') == '0') {
          $(this).text('显示');
        } else {
          $(this).text('不显示');
        }
      })

      //首页显示
      $('.isHomeShow').each(function () {
        if ($(this).attr('data-isHomeShow') == '1') {
          $(this).text('显示').addClass('green');
        } else {
          $(this).text('不显示');
        }
      })

      //栏目类型
      $('.categoryType').each(function () {
        if ($(this).attr('data-categoryType') == '0') {
          $(this).text('线上手机版');
        } else {
          $(this).text('线上PC版');
        }
      })

      //是否首页显示
      $('.isShow').each(function () {
        if ($(this).siblings('.isHomeShow').attr('data-isHomeShow') == 1) {
          $(this).html('<div class="isshow"><i class="qx-icon"></i>取消首页显示</div>');
        } else {
          $(this).html('<div class="isshow"><i class="ho-icon"></i>设置首页显示</div>');
        }
      })
    } else {
      layer.msg(res.msg);
    }
  }

//列表初始化方法
  function initList() {
    var categoryType = $('#line_classification .search-area select').val();
    var param = "{'categoryType':'" + categoryType + "','pid':'','pageNo':'" + pageNo + "','pageSize':'" + pageSize + "'}";
    var res = reqAjax(REQUEST_URL.GETONLINECATEGORYLIST, param);
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
        var param = "{'categoryType':'" + categoryType + "','pid':'','pageNo':'" + obj.curr + "','pageSize':'" + pageSize + "'}";
        var res = reqAjax(REQUEST_URL.GETONLINECATEGORYLIST, param);
        getList(res);

        $('#page-list').html(render(res, obj.curr));
        $('#line_classification .content p').html('共 ' + obj.pages + ' 页，每页 ' + pageSize + ' 条，共 ' + res.total + ' 条');
      }
    });
  }

  initList();

//子列表渲染
  function childList(res) {
    var sHtml = '';
    if (res.code == 1) {
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml +=
          '<tr data-id="' + row.id + '" data-pid="' + row.pid + '">' +
          /*'<td></td>' +*/
          '<td>' + row.categoryName + '</td>' +
          '<td><img src="' + isNull(row.categoryLogo) + '" alt="展示图片"></td>' +
          '<td class="categoryStatus" data-categoryStatus="' + row.categoryStatus + '"></td>' +
          '<td class="isHomeShow" data-isHomeShow="' + row.isHomeShow + '"></td>' +
          '<td class="categoryType" data-categoryType="' + row.categoryType + '"></td>' +
          '<td>' +
          '<div class="edit"><i class="edicticon"></i>修改</div>' +
          '<div class="delete"><i class="glyphicon glyphicon-minus-sign"></i>删除</div>' +
          '</td>' +
          '<td class="isShow">' +
          '<div class="isshow"><i class="ho-icon"></i></div>' +
          '</td>' +
          '<td>' + isNull(row.scSysBackUser.username) + '</td>' +
          '<td>' + isNull(row.modifyTime) + '</td>' +
          '</tr>';
      }
      return sHtml;
    } else {
      layer.msg(res.msg);
    }
  }

//点击父栏目加载子栏目
  $("#line_classification").on('click', '.glyphicon', function (event) {
    event.stopPropagation();
    var classNa = $(this).attr('class');
    var pid = $(this).parents('tr').attr('data-id');
    if (classNa == 'glyphicon glyphicon-triangle-right') {
      $(this).attr('class', 'glyphicon glyphicon-triangle-bottom');
      var categoryType = $(this).parents('tr').find('.categoryType').attr('data-categoryType');
      var param = "{'categoryType':'" + categoryType + "','pid':'" + pid + "'}";
      var res = reqAjax(REQUEST_URL.GETONLINECATEGORYLIST, param);
      $(this).parents('tr').after(childList(res));

      //栏目状态
      $('.categoryStatus').each(function () {
        if ($(this).attr('data-categoryStatus') == '0') {
          $(this).text('显示');
        } else {
          $(this).text('不显示');
        }
      })

      //首页显示
      $('.isHomeShow').each(function () {
        if ($(this).attr('data-isHomeShow') == '1') {
          $(this).text('显示').addClass('green');
        } else {
          $(this).text('不显示');
        }
      })

      //栏目类型
      $('.categoryType').each(function () {
        if ($(this).attr('data-categoryType') == '0') {
          $(this).text('线上手机版');
        } else {
          $(this).text('线上PC版');
        }
      })

      //是否首页显示
      $('.isShow').each(function () {
        if ($(this).siblings('.isHomeShow').attr('data-isHomeShow') == 1) {
          $(this).html('<div class="isshow"><i class="qx-icon"></i>取消首页显示</div>');
        } else {
          $(this).html('<div class="isshow"><i class="ho-icon"></i>设置首页显示</div>');
        }
      })
    } else if (classNa == 'glyphicon glyphicon-triangle-bottom') {
      $(this).attr('class', 'glyphicon glyphicon-triangle-right');
      $(this).parents('tr').siblings('tr[data-pid=' + pid + ']').remove();
    }
  })

//查询方法
  $('#line_classification .search-area .btn-success').click(function () {
    $('#line_classification .content tbody').html('');
    initList();
  })

//设置线上分类是否首页显示
  $('#line_classification').on('click', '.isShow', function () {
    if ($(this).siblings('.isHomeShow').attr('data-isHomeShow') == 1) {
      var id = $(this).parent().attr('data-id');
      var param = "{'id':'" + id + "','isHomeShow':'2'}";
      var res = reqAjax(REQUEST_URL.SETCATEGORYINHOME, param);
      if (res.code == 1) {
        layer.msg(res.msg);
        setTimeout(function () {
          location.reload();
        }, 500)
      } else {
        layer.msg(res.msg);
      }
    } else {
      var id = $(this).parent().attr('data-id');
      var param = "{'id':'" + id + "','isHomeShow':'1'}";
      var res = reqAjax(REQUEST_URL.SETCATEGORYINHOME, param);
      if (res.code == 1) {
        layer.msg(res.msg);
        setTimeout(function () {
          location.reload();
        }, 500)
      } else {
        layer.msg(res.msg);
      }
    }
  })

//删除方法
  $('#line_classification').on('click', '.delete', function () {
    var id = $(this).parents('tr').attr('data-id');
    var param = "{'id':'" + id + "'}";
    layer.confirm("确定删除吗?", {icon: 3, title: '提示'}, function () {
      var res = reqAjax(REQUEST_URL.REMOVEONLINECATEGORY, param);
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

//添加或者删除分类词库关联数据
  $('#line_classification .search-area .btn-info:eq(1)').click(function () {
    if ($('#line_classification .content tbody tr[class=active]').index() == -1) {
      layer.msg('请选择要操作的栏目!');
      return;
    }
    var id = $('#line_classification .content tbody tr[class=active]').attr('data-id');
    layer.open({
      type: 2,
      title: ['搜索词关联设置', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['700px', '650px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: '../get_lexicon/get_lexicon.html',
      yes: function () {
      },
      success: function (layero, index) {
        var body = layer.getChildFrame('body');
        body.find('#get_lexicon').attr('data-id', id);
      }
    });
  })


//添加分类数据弹窗
  $('#line_classification .search-area .btn-info:eq(0)').click(function () {
    layer.open({
      type: 2,
      title: ['新增分类数据', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['800px', '750px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: '../add_lineClassification/add_lineClassification.html',
      btn: ['保存'],
      btnAlign: 'c',
      yes: function () {
        sub();
      }
    });
  })


//修改分类数据弹窗
  $('#line_classification').on('click', '.edit', function () {
    var id = $(this).parents('tr').attr('data-id');//主键id
    var pid = $(this).parents('tr').attr('data-pid');//pid
    /*var sequence = $(this).parents('tr').find('td:eq(0)').text();//栏目序号*/
    var categoryName = $(this).parents('tr').find('td:eq(0)').text();//栏目名称
    var categoryLogo = $(this).parents('tr').find('td:eq(1) img').attr('src');//栏目logo
    var categoryStatus = $(this).parents('tr').find('.categoryStatus').attr('data-categoryStatus');//栏目状态
    var categoryType = $(this).parents('tr').find('.categoryType').attr('data-categoryType');//栏目类型
    layer.open({
      type: 2,
      title: ['修改线上分类信息', 'background:#303030;color:#fff;'],
      skin: 'layer-ext-myskin',
      area: ['800px', '750px'],
      shade: 0.5,
      closeBtn: 1,
      shadeClose: false,
      scrollbar: false,
      content: '../add_lineClassification/add_lineClassification.html',
      btn: ['保存'],
      btnAlign: 'c',
      success: function (layero, index) {
        var body = layer.getChildFrame('body');
        body.find('.layui-form-item:eq(0)').attr('data-id', id);
        body.find('.layui-form-item:eq(0) input').val(categoryName);
        body.find('#uploadImg').attr('src', categoryLogo);
        body.find('.layui-form-item:eq(2) select').val(categoryStatus);
        body.find('.layui-form-item:eq(3) select').val(categoryType).attr('disabled', 'disabled');//修改禁止切换栏目类型
        body.find('.layui-form-item:eq(4) input').val(sequence);
        body.find('.layui-form-item:eq(5)').attr('data-pid', pid);
      },
      yes: function () {
        sub(id);
      }
    })
  })

//保存方法
  function sub(id) {
    var body = layer.getChildFrame('body');
    var categoryName = $.trim(body.contents().find('.layui-form-item:eq(0) input').val());//栏目名称
    var categoryLogo = body.contents().find('img').attr('src');//栏目图片
    var categoryStatus = body.contents().find('.layui-form-item:eq(2) select').val();//栏目状态
    var categoryType = body.contents().find('.layui-form-item:eq(3) select').val();//栏目类型
    var sequence = $.trim(body.contents().find('.layui-form-item:eq(4) input').val());//栏目序号
    var pid = body.find('.layui-form-item:eq(5)').attr('data-pid');//线上分类挂靠id
    var createUser = userno;
    var modifyUser = userno;

    if (id == undefined || id == '' || id == null) {
      var param = "{'categoryName':'" + categoryName + "','categoryLogo':'" + categoryLogo + "','categoryStatus':'" + categoryStatus + "','createUser':'" + createUser + "','categoryType':'" + categoryType + "','sequence':'" + sequence + "','pid':'" + pid + "'}";
    } else {
      var param = "{'categoryName':'" + categoryName + "','categoryLogo':'" + categoryLogo + "','categoryStatus':'" + categoryStatus + "','modifyUser':'" + modifyUser + "','categoryType':'" + categoryType + "','sequence':'" + sequence + "','pid':'" + pid + "','id':'" + id + "'}";
    }

    if (pid == undefined || pid == '' || pid == null) {
      layer.msg('请选择父级栏目节点')
      return;
    }

    var res = reqAjax(REQUEST_URL.SUBONLINECATEGORY, param);
    if (res.code == 1) {
      layer.msg('保存成功');
      setTimeout(function () {
        location.reload();
      }, 500)
      var index = parent.layer.getFrameIndex(window.name);
      parent.layer.close(index);
    } else {
      layer.msg(res.msg);
    }
  }

//判断字段是否为空
  function isNull(val) {
    if (val == null || val == '' || val == undefined || val == 'null') {
      return '';
    }
    return val;
  }
})(jQuery);
