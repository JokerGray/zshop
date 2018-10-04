$(function () {
  var USERID = 121;
  if (window.location.host == 'managernew.izxcs.com') {
    USERID = 1706
  }
  var table = layui.table;
  var form = '';
  var cmd = "dazzle/labelMessage";
  var rows = 5;
  var paramKeys = ""; // 
  var pageno = 1;
  var datas = JSON.stringify(data);
  var data = {
    condition: 4,
    row: rows,
    page: 0,
    labelName: '',
    userId: USERID
  };
  layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function () {
    form = layui.form;
    layer = layui.layer;
    form.render();
    getTable(paramKeys, pageno);
  });
 
 
  //reqAjaxAsync(cmd, datas, gets);
   

  var $regNum = /(^[1-9][0-9]*$)|(^0$)/;
  var $regname = /^[0-9a-zA-Z_\u4E00-\u9FA5]{1,}$/;//字母数字下划线汉字组合
  $('#adGs').on('click', function() {
    showAdd();
  });

  form.render();
  // ajax获取参数
  function reqAjaxAsync(cmd, data, callback) {
    var apikey = yyCache.get("apikey") || "test"; //获取缓存 通行证码
    var version = yyCache.get('version') || "1"; //获取缓存 版本号
    var inputdata = data;
    $.ajax({
      type: "POST",
      url: "/zxcity_restful/ws/rest",
      dataType: "json",
      async: true, //默认为异步
      data: {
        "cmd": cmd,
        "data": data || "",
        "version": version
      },
      beforeSend: function (request) {
        request.setRequestHeader("apikey", apikey);
      },
      success: function (res) {
        // console.log(res);
        callback(res, inputdata);
      },
      error: function (err) {
        layer.msg("请求出错！");
        console.log(err);
      }
    });
  }
  //异步请求Ajax
  function reqNewAjaxAsync(url, cmd, data, async) {
    var apikey = yyCache.get("apikey") || "test"; //获取缓存 通行证码
    var version = yyCache.get('version') || "2"; //获取缓存 版本号
    var defer = $.Deferred();
    $.ajax({
      type: "POST",
      url: url,
      dataType: "json",
      async: async || true, //默认为异步
      data: {
        "cmd": cmd,
        "data": JSON.stringify(data) || "",
        "version": version
      },
      beforeSend: function (request) {
        layer.load(0, { shade: [0.1, '#fff'] });
        request.setRequestHeader("apikey", apikey);
      },
      success: function (data) {
        layer.closeAll('loading');
        defer.resolve(data);
      },
      error: function (err) {
        layer.closeAll('loading');
        layer.msg("系统繁忙，请稍后再试!");
        console.log(err.status + ":" + err.statusText);
      }
    });
    return defer.promise();
  }

  table.on('tool(manage)', function (obj) {
    console.log(obj);
    var event = obj.event;
    if(event == 'change'){
      showEdit(obj);
    }else if(event == 'delete') {
      layer.confirm('真的删除该角色吗？', function (index) {
        //异步请求
        var data = {
          condition: 2,
          labelId: Number(obj.data.labelId),
          userId: USERID
        }
        var datas = JSON.stringify(data);
        reqAjaxAsync(cmd, datas, checkPass);
      });
    }
  });
  //显示 添加窗口
  function showAdd() {
    layer.open({
      type: 1,
      anim: 5,
      area: ['600px'],
      shadeClose: true, //点击遮罩关闭
      content: $('#add'),
      btn: ['添加', '取消'],
      title: ['新增话题', 'font-size:12px;background-color:#424651;color:#fff'],
      cancel: function (index, layero) {
        layer.close(index);
        return false;
      },
      yes: function (index, layero) {
        var addtitle = $('#addTopName').val();
        var addcontent = $('#addTopCont').val();
        addcontent = addcontent.replace(/^/gm, '<p>').replace(/$/gm, '</p>').replace(/<p><\/p>/ig, '');
        var addrank = $('#addLev').val();
        var addpush = $('#add input:checked').val();
        if (addtitle == '') {
          layer.msg('话题名不能为空');
          return false;
        }
        if (!$regname.test(addtitle)) {
          layer.msg('请正确填写话题名');
          return false;
        }
        if (addcontent == '') {
          layer.msg('话题描述不能为空');
          return false;
        }
        if (addrank == '') {
          layer.msg('话题优先级不能为空');
          return false;
        }
        var data = {
          condition: 1,
          rank: Number(addrank),
          description: addcontent,
          ispush: Number(addpush),
          labelName: addtitle,
          userId: USERID
        }
        var datas = JSON.stringify(data);
        reqAjaxAsync(cmd, datas, checkPass);
        layer.close(index);
      },
      success: function() {
        $('#add input').val('');
        $('#add textarea').val('');
      },
      btn2: function (index, layero) {
        layer.close(index);
      },
      end: function (index) {
        $('#add').hide();
      }
    });
  }
  $('#addLev').on('keyup', function () {
    if (!$regNum.test($(this).val())) {
      layer.msg('请输入0~99之间的整数')
      $(this).val('');
      return ;
    }
  });
  function showEdit(obj) {
    layer.open({
      type: 1,
      anim: 5,
      area: ['600px'],
      shadeClose: true, //点击遮罩关闭
      content: $('#add'),
      btn: ['确定', '取消'],
      title: ['修改话题', 'font-size:12px;background-color:#424651;color:#fff'],
      cancel: function (index, layero) {
        layer.close(index);
        return false;
      },
      yes: function (index, layero) {
        if (!$regNum.test($('#addLev').val())) {
          layer.msg('请输入0~99之间的整数')
          $('#addLev').val('');
          return;
        }
        var title = $('#addTopName').val();
        var content = $('#addTopCont').val();
        content = content.replace(/^/gm, '<p>').replace(/$/gm, '</p>').replace(/<p><\/p>/ig, '');
        var rank = $('#addLev').val();
        var push = $('#add input:checked').val();
        if (title == '') {
          layer.msg('话题名不能为空');
          return false;
        }
        if (!$regname.test(title)) {
          layer.msg('请正确输入话题名');
          return false;
        }
        if (content == '') {
          layer.msg('话题描述不能为空');
          return false;
        }
        if (rank == '') {
          layer.msg('话题优先级不能为空');
          return false;
        }
        var data = {
          condition: 3,
          labelId: Number(obj.data.labelId),
          rank: Number(rank),
          description: content,
          ispush: Number(push),
          labelName: title,
          userId: USERID
        }
        var datas = JSON.stringify(data);
        console.log(data);
        reqAjaxAsync(cmd, datas, checkPass);
      },
      success: function () {
        var data = obj.data;
        $('#add #addTopName').val(data.labelName);
        var inCont = data.description.replace(/<p>/ig, '').replace(/<\/p>/ig, '');
        $('#add #addTopCont').val(inCont);
        var ispush = data.ispush;
        var query = $('#add input[name="addTs"]');
        console.log(query);
        query.each(function(index,item){
          if($(item).val() == ispush) {
            $(item).prop('checked', true);
          }
        });
         
        $('#addLev').val(data.rank);
        form.render();
      },
      btn2: function (index, layero) {
        layer.close(index);
      },
      end: function (index) {
        $('#add').hide();
      }
    });
  }
  // 分页
  function gets(res, inputdata) {
    var inputObj = JSON.parse(inputdata);
    $('#totals').text(res.total);
    var laypage = layui.laypage;
    laypage.render({
      elem: '#laypageLeft',
      count: res.total,
      limit: 5, //连续显示分页数
      jump: function (obj) {
        var curr = obj.curr;
        var currNum = curr - 1;
        var newdatas = {
          condition: 4,
          row: rows,
          page: currNum,
          labelName: inputObj.labelName,
          userId: USERID
        };
        var data = JSON.stringify(newdatas);
        reqAjaxAsync(cmd, data, showTable);
        // reqAjaxAsync(cmd, data, showTables)
      }
    })
  }
  function getTable(paramKeys, pageno) {
    //第一个实例
    var tableINs = table.render({
      id: 'manage',
      elem: '#manage',
      even: true,
      cellMinWidth: 80,
      cols: [
        [ //表头
          {
            type: 'numbers', title: '序号', align: 'center', width: 60, templet: "#indexTpl"
          }, {
            field: 'labelName',
            title: '话题名',
            align: 'left',
            width: 150,
          }, {
            field: 'description',
            title: '话题内容',
            width: 700,
            style: 'height:auto;',
            align: 'left',
            templet: '#descriptionTpl',
          }, {
            field: 'createTime',
            title: '创建时间',
            align: 'left',
            width: 160
          }, {
            field: 'rank',
            title: '优先显示',
            align: 'left',
            width: 170
          }, {
            field: 'ispush',
            title: '是否推送',
            align: 'left',
            width: 120,
            templet: function (d) {
              if (d.ispush == 1) {
                return '是';
              }
              return '否';
            }
          }, {
            fixed: 'right',
            title: '操作',
            
            width: 200,
            align: 'left',
            // style: 'min-height: 80px;',
            toolbar: '#barCtrl'
          }
        ]
      ]
    });

    var res = pageCallback(paramKeys, pageno);
    if (res) {
      // console.log(res)
      if (res.code == 1) {
        tableINs.reload({
          data: res.data.LabelList
        })
      } else {
        layer.msg(res.msg)
      }
    }

    //分页
    layui.use('laypage');
    var page_options = {
      elem: 'laypageLeft',
      count: res ? res.total : 0,
      layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
      groups: '4',
      limit: rows,//每页条数
      limits: [5, 8, 10]
    }
    //分页渲染
    page_options.jump = function (obj, first) {

      if (!first) {
        rows = obj.limit;
        var resTwo = pageCallback(paramKeys, obj.curr);
        if (resTwo && resTwo.code == 1)
          tableINs.reload({
            data: resTwo.data.LabelList
          });
        else
          layer.msg(resTwo.msg);
      }
    }

    //处理 工具栏 固定右边后 高度不一致问题
    var tr = $('.layui-table-box .layui-table-main tbody tr');
    tr.each(function(index,item){
      var height = $(item).css('height');
      $('.layui-table-box .layui-table-fixed .layui-table-body tr').eq(index).css('height', height);
    });
 
    layui.laypage.render(page_options);

  }	
  //获取内容方法
  function pageCallback(paramKeys, pagerows) {
    // var labelName = $('#search_box').val();
    var data = {
      condition: 4,
      row: rows,
      page: pagerows - 1,
      labelName: paramKeys || $('#search_box').val(),
      userId: USERID
    };

    var res = reqAjax(cmd, JSON.stringify(data));
    if (res.code == 1) {
      return res;
    }
  }
  function showTable(res) {
   // _tableInit();
    var option = {};
    option.count = res.count;
    option.id = 'manage';
    option.data = res.data.LabelList;
    option.pageId = 'laypageLeft';
    option.height = 800,
    option.cols = [
      [ //表头
        {
          type: 'numbers', title: '序号', align: 'center', width: '60', templet: "#indexTpl"
        }, {
          field: 'labelName',
          title: '话题名',
          width: 150,
          edit: false,
        }, {
          field: 'description',
          title: '话题内容',
          width: 800,
          style: 'height:auto;',
          templet: '#descriptionTpl',
          edit: false,
        }, {
          field: 'createTime',
          title: '创建时间',
          width: 160
        }, {
          field: 'rank',
          title: '优先显示',
          width: 170
        }, {
          field: 'ispush',
          title: '是否推送',
          width: 120,
          sort: true,
          edit: false,
          templet: function(d){
            if(d == 1) {
              return '是';
            }
            return '否';
          }
        }, {
          fixed: 'right',
          title: '操作',
          width: 300,
          align: 'center',
          style: 'min-height: 80px;',
          toolbar: '#barCtrl'
        }
      ]
    ];
    tableRender(option);
  }
  function tableRender(option) {
    var tableIns = table.render({
      id: option.id,
      elem: '#' + option.id,
      height: option.height || 'full-250',
      cols: option.cols, //表头
      // page: false, //是否开启分页
 
      limit: option.limit || rows, //每页显示的条数
      limits: option.limits || [rows],
      even: true,
      cellMinWidth: 80,
      done: function (res, curr, count) {
        option.done && option.done();
        console.log('done');
      }
    });
    tableIns.reload({
      data: option.data,
      page: {
        curr: 1
      }
    });
    //分页
    laypage.render({
      elem: option.pageId, //分页容器的id
      count: option.count || option.total || 1, //总页数
      layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
      limit: option.limit || rows, //每页显示的条数
      limits: option.limits | [rows],
      align: 'right',
      skin: '#1E9FFF', //自定义选中色值
      //,skip: true //开启跳页
      jump: function (obj, first) {
        if (!first) {
          layer.msg('第' + obj.curr + '页');
        }
      }
    });
  }
 
  // 新增模态框弹出时清空内容
  $('#addTop').on('show.bs.modal', function () {
    $('#addTopName').val('');
    $('#addTopCont').val('');
    $('#addLev').val('0');
    $('#addLev').unbind('keyup');
    $('#addLev').on('keyup', function () {
      console.log($(this).val())
      console.log($regNum.test($(this).val()))
      if (!$regNum.test($(this).val())) {
        layer.msg('请输入0~99之间的整数！')
        $(this).val('');
      }
    })
  })
  // 添加事件
  $('#addTopic').on('click', function () {
    var addtitle = $('#addTopName').val();
    var addcontent = $('#addTopCont').val();
    addcontent = addcontent.replace(/^/gm, '<p>').replace(/$/gm, '</p>').replace(/<p><\/p>/ig, '');
    var addrank = $('#addLev').val();
    var addpush = $('input[name="addTs"]:checked').val();
    if (addtitle == '') {
      layer.msg('话题名不能为空');
      return false;
    }
    if (!$regname.test(addtitle)) {
      layer.msg('请正确填写话题名');
      return false;
    }
    if (addcontent == '') {
      layer.msg('话题描述不能为空');
      return false;
    }
    if (addrank == '') {
      layer.msg('话题优先级不能为空');
      return false;
    }
    var data = {
      condition: 1,
      rank: Number(addrank),
      description: addcontent,
      ispush: Number(addpush),
      labelName: addtitle,
      userId: USERID
    }
    var datas = JSON.stringify(data);
    reqAjaxAsync(cmd, datas, checkPass);
  });
 
 
  // 搜索框键盘事件
  $('#search_box').bind('keypress', function (event) {
    if (event.keyCode == '13') {
      getTable('', pageno);
    }
  });
  $('#search').on('click', function () {
    getTable('', pageno);
  });

  function checkPass(re) {
    layer.msg(re.msg);
    $('.btn,button').removeAttr('data-dismiss');
    $('#addTopic,#delTopic,#editTopic').unbind('click');
    setTimeout(function () {
      layer.load(3);
    }, 2000);
    setTimeout(function () {
      window.location.reload();
    }, 3000)
  }
})
