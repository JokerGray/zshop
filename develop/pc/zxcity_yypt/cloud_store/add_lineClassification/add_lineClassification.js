/**
 * Created by Administrator on 2017/7/1.
 */
(function ($) {
  var REQUEST_URL = {
    GETONLINECATEGORYLEVEL: 'operationCloudShop/getOnlineCategoryLevel'//添加编辑页码-获取线上分类树形下拉框数据
  }

  var setting = {
    view: {
      showLine: true,//设置zTree是否显示节点之间的连线。
      showIcon: false,//设置zTree是否显示节点的图标。
      dblClickExpand: false,//双击节点时，是否自动展开父节点的标识
      selectedMulti: false//设置是否允许同时选中多个节点。
    },
    data: {
      key: {
        name: 'text'
      },
      simpleData: {
        enable: true,//数据是否采用简单数据模式 (Array)
        idKey: 'pid'
      }
    },
    async: {
      enable: true,//设置 zTree 是否开启异步加载模式
      type: 'post',//Ajax的http请求模式
      url: '/zxcity_restful/ws/rest',
      dataType: 'json',//Ajax 获取的数据类型。[setting.async.enable = true 时生效]
    },
    callback: {
      /* beforeExpand: beforeExpand,//用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
       onAsyncSuccess: onAsyncSuccess,//用于捕获异步加载正常结束的事件回调函数
       onAsyncError: onAsyncError,//用于捕获异步加载出现异常错误的事件回调函数*/
      onClick: onClick//用于捕获节点被点击的事件回调函数
    }
  };

  function onClick(event, treeId, treeNode) {
    $('#add_lineClassification').find('.layui-form-item:eq(5)').attr('data-pid', treeNode.id);
    $('#ztreeValue').val(treeNode.text);
  };

  //线上分类数据选择类型加载方法
  function getLevel(categoryType) {
    var param = "{'categoryType':'" + categoryType + "'}";
    var pid = $('.layui-form-item:eq(5)').attr('data-pid');
    var res = reqAjax(REQUEST_URL.GETONLINECATEGORYLEVEL, param);
    if (res.code == 1) {
      var treeObj = $.fn.zTree.init($("#treeDemo"), setting, res.data);
      if (pid) {
        var node = treeObj.getNodeByParam("id", pid);
        treeObj.expandNode(node, true, false, true);
        treeObj.selectNode(node);
        $('#ztreeValue').val(node.text);
      }
    }
  }

  //选择栏目类型加载不同数据
  $('#add_lineClassification').find('.layui-form-item:eq(3) select').on('change', function () {
    var categoryType = $(this).val();
    getLevel(categoryType);
  })

  $('#ztreeValue').on('focus', function () {
    showMenu();
  })

  function showMenu() {
    var ztreeObj = $("#ztreeValue");
    var ztreeOffset = $("#ztreeValue").offset();
    $("#menuContent").css({
      left: ztreeOffset.left + "px",
      top: ztreeOffset.top + ztreeObj.outerHeight() + "px"
    }).slideDown("fast");
    $("body").on("mousedown", onBodyDown);
  }

  function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").off("mousedown", onBodyDown);
  }

  function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
      hideMenu();
    }
  }

  uploadOss({
    btn: "uploadImg",
    flag: "img",
    size: "5mb"
  });

  setTimeout(function () {
    var categoryType = $('.layui-form-item:eq(3) select').val();
    getLevel(categoryType);
  }, 100);

})(jQuery);
