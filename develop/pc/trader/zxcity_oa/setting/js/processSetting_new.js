(function ($) {
  var REQUEST_URL = {
    INITORGBYUSERID: 'processSet/initOrgByUserId',//流程设置-->根据后台用户初始化相应的组织结构
    QUERYUSERLISTBYORGID: 'processSet/queryUserListByOrgId',//流程设置-->根据节点id分页条件查询用户
    SAVEORUPDATEPROCESSARCHIVE: 'processSet/saveOrUpdateProcessArchiveNew',//流程设置-->保存或修改业务归档人
    QUERYPROCESSARCHIVE: 'processSet/queryProcessArchive'//流程设置-->根据用户查询各个业务归档人
  };

  var page = 1,
    rows = 8,
    lock = true,
    userId = getUrlParams('userId') || 10073,
    layer = layui.layer,
    laypage = layui.laypage,
    archivePeopleArr = [];

  layer.config({
    extend: 'myskin/style.css'
  });

  var setting = {
    view: {
      showLine: true,//设置zTree是否显示节点之间的连线。
      showIcon: true,//设置zTree是否显示节点的图标。
      dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
      selectedMulti: false,//设置是否允许同时选中多个节点。
      showTitle: false//设置 zTree 是否显示节点的 title 提示信息
    },
    data: {
      key: {
        name: 'name'
      },
      simpleData: {
        enable: true,//数据是否采用简单数据模式 (Array)
        idKey: 'id',
        pIdKey: "pid",
        rootPId: 0
      }
    },
    callback: {
      /* beforeExpand: beforeExpand,//用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
       onAsyncSuccess: onAsyncSuccess,//用于捕获异步加载正常结束的事件回调函数
       onAsyncError: onAsyncError,//用于捕获异步加载出现异常错误的事件回调函数*/
      onClick: onClick//用于捕获节点被点击的事件回调函数
    }
  };

  $(function () {
    initList()
  })

  //页面初始化方法
  function initList() {
    var param = {
      userId: userId
    }

    reqAjaxAsync(REQUEST_URL.QUERYPROCESSARCHIVE, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var arr = res.data.filter(function (item) {
          return item.archivePeople != null;
        })

        for (var i = 0; i < arr.length; i++) {
          var data = arr[i];
          var dom = $("<span data-archivePeople=" + isNull(data.archivePeople) + " data-id=" + isNull(data.id) + ">" + isNull(data.archivePeopleName) + "</span>");
          $('#processSetting .item-list li:eq(0) .name').append(dom);
          if (data.id) {
            $('#processSetting .item-list li:eq(0) button').html('取消归档人').css('backgroundColor', '#F1A83F');
          }
        }

        //定义全局归档人id,人员id数组对象
        var choose = $('#processSetting .item-list li:eq(0) .name span');
        choose.each(function (k, v) {
          archivePeopleArr.push($(v).attr('data-archivePeople'));
        })

      } else {
        layer.msg(res.msg);
      }
    })
  }

  //Ztree点击事件
  function onClick(event, treeId, treeNode, archivePeople) {
    $('#details-1 .search-area input').val('');
    $('#details-1 .left-nav').attr('data-id', treeNode.id);
    if (archivePeople == 1) {
      archivePeople = archivePeopleArr;
    }
    getList(archivePeople);
  };

  //员工列表渲染方法
  function init(res) {
    $('#details-1 table tbody').html('');
    if (res.code == 1) {
      if (res.data) {
        var sHtml = '';
        for (var i = 0; i < res.data.length; i++) {
          var data = res.data[i];
          sHtml +=
            '<tr data-archivePeople="' + data.id + '">' +
            '  <td>' + data.usercode + '</td>' +
            '  <td>' + data.username + '</td>';
          if (data.sex == 1) {
            sHtml += '<td>女</td>';
          } else {
            sHtml += '<td>男</td>';
          }
          sHtml +=
            '  <td>' + isPhone(data.phone) + '</td>' +
            '  <td>' +
            '  <button class="btn btn-info">选择归档人</button>' +
            '  </td>' +
            '</tr>';
        }
        $('#details-1 table tbody').html(sHtml);
      } else {
        console.log(res.msg);
      }
    } else {
      /*layer.msg(res.msg);*/
    }
  }

  //员工列表查询方法
  function getList(archivePeople) {
    var id = $('#details-1 .left-nav').attr('data-id');
    var userName = $.trim($('#details-1 .search-area input').val());
    var param = {
      id: id,
      page: page,
      rows: rows,
      userName: userName,
      archivePeople: archivePeople
    }

    reqAjaxAsync(REQUEST_URL.QUERYUSERLISTBYORGID, JSON.stringify(param)).done(function (res) {
      init(res);
      if (archivePeople) {
        for (var i = 0; i < archivePeople.length; i++) {
          $('#details-1 table tbody tr[data-archivePeople=' + archivePeople[i] + '] button').html('取消归档人').css('backgroundColor', '#F1A83F');
        }
      }

      //分页
      laypage.render({
        elem: 'paging-box-r',//容器
        count: res.total,//总数
        limit: rows,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            id: id,
            page: obj.curr,
            rows: rows,
            userName: userName,
            archivePeople: archivePeopleArr
          }
          if (!first) {
            reqAjaxAsync(REQUEST_URL.QUERYUSERLISTBYORGID, JSON.stringify(param)).done(function (res) {
              init(res);
              if (archivePeopleArr) {
                for (var i = 0; i < archivePeopleArr.length; i++) {
                  $('#details-1 table tbody tr[data-archivePeople=' + archivePeopleArr[i] + '] button').html('取消归档人').css('backgroundColor', '#F1A83F');
                }
              }
            })
          }
        }
      });
    })
  }

  //点击查询按钮
  $('#details-1 .search-area a').on('click', function () {
    getList(archivePeopleArr);
  })

  //选择取消归档人
  $('#details-1 table').on('click', 'button', function () {
    var text = $(this).text();
    var archivePeople = $(this).parents('tr').attr('data-archivePeople');

    if (text == '选择归档人') {
      var param = {
        userId: userId,
        businessTypeId: 1,
        archivePeople: archivePeople,
        actionType: 0
      }

      if (archivePeopleArr.length >= 30) {
        layer.msg('归档人数达到上限!');
        return;
      }
      $(this).css('backgroundColor', '#f1a83f').html('取消归档人');
      archivePeopleArr.push(archivePeople);

    } else if (text == '取消归档人') {
      var param = {
        userId: userId,
        businessTypeId: 1,
        archivePeople: archivePeople,
        actionType: 1
      }
      $(this).css('backgroundColor', '#26C2B2').html('选择归档人');
      archivePeopleArr = archivePeopleArr.filter(function (item) {
        return item != archivePeople;
      })

      console.log(archivePeopleArr);
    }

    if (lock) {
      lock = false;
      reqAjaxAsync(REQUEST_URL.SAVEORUPDATEPROCESSARCHIVE, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
          layer.msg('设置成功');
          lock = true;
        } else {
          layer.msg(res.msg);
          lock = true;
        }
      })
    }
  })

  //请假归档人弹窗
  $('#processSetting button:eq(0)').on('click', function () {
    var archivePeople = archivePeopleArr;
    layer.open({
      title: ['选择归档人', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-1'),
      area: ['700px', '750px'],
      btn: ['关闭'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-1').hide();
        window.location.reload(true);
      },
      success: function (layero, index) {
        var param = {
          userId: userId
        }
        reqAjaxAsync(REQUEST_URL.INITORGBYUSERID, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            //默认选择根节点并点击
            var treeObj = $.fn.zTree.init($("#treeDemo"), setting, res.data);
            var node = treeObj.getNodeByParam("pid", 0);
            treeObj.expandNode(node, true, false, true);
            treeObj.selectNode(node);
            treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node, archivePeople);//调用事件
          } else {
            layer.msg(res.msg);
          }
        })
      },
      yes: function (index, layero) {
        window.location.reload(true);
      }
    })
  })

  function isPhone(val) {
    if (!val || val == "null") {
      return '暂无号码';
    }
    return val;
  }

  function isNull(val) {
    if (!val || val == 'null') {
      return ""
    }
    return val;
  }

})(jQuery)