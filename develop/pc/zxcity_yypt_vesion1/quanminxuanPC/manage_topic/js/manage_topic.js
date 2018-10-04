$(function () {
  var USERID=121;
if(window.location.host=='managernew.izxcs.com'){
    USERID=1706
}
  var cmd = "dazzle/labelMessage";
  var data = {
    condition: 4,
    row: 5,
    page: 0,
    labelName:'',
    userId:USERID
  };
  var datas = JSON.stringify(data);
  // ajaxold
  reqAjaxAsync(cmd, datas, gets);
  var $regNum=/(^[1-9][0-9]*$)|(^0$)/;
  var $regname=/^[0-9a-zA-Z_\u4E00-\u9FA5]{1,}$/;//字母数字下划线汉字组合
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
  var version = yyCache.get('version') || "1"; //获取缓存 版本号
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
      beforeSend: function(request) {
          layer.load(0, { shade: [0.1, '#fff'] });
          request.setRequestHeader("apikey", apikey);
      },
      success: function(data) {
          layer.closeAll('loading');
          defer.resolve(data);
      },
      error: function(err) {
          layer.closeAll('loading');
          layer.msg("系统繁忙，请稍后再试!");
          console.log(err.status + ":" + err.statusText);
      }
  });
  return defer.promise();
}
  // 分页
  function gets(res, inputdata) {
    var inputObj=JSON.parse(inputdata);
    $('#totals').text(res.total);
    var laypage = layui.laypage;
    laypage.render({
      elem: 'pages',
      count: res.total,
      limit: 5, //连续显示分页数
      jump: function (obj) {
        var curr = obj.curr;
        var currNum = curr - 1;
        var newdatas = {
          condition: 4,
          row: 5,
          page: currNum,
          labelName:inputObj.labelName,
          userId:USERID
        };
        var data = JSON.stringify(newdatas);
        reqAjaxAsync(cmd, data, showTables);
      }
    })
  }
  // 表格展示
  function showTables(res) {
    // console.log(res);
    var tableHead = '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>话题名</th><th>话题内容</th><th>创建时间</th><th>优先显示</th><th>是否推送</th><th>操作</th></tr>';
    var tableFoot = '</tbody></table>';
    if (res.data.LabelList.length) {
      tablebody = "";
      var list = res.data.LabelList;
      for (var i = 0; i < list.length; i++) {
        tablebody += '<tr><td>' + (i + 1) + '</td><td class="topicName">' + list[i].labelName + '</td><td class="topicHtml">' + (list[i].description ? list[i].description : '无内容') + '</td><td>' +
          list[i].createTime + '</td><td class="rank">' + list[i].rank + '</td><td class="ispush">'+(list[i].ispush?'是':'否')+'</td>' +
          '<td labelid="' + list[i].labelId + '"><span class="btn btn-danger delBtn">删除</span><span class="btn btn-primary editBtn" style="margin-left:10px;" data-ispush="'+list[i].ispush+'" data-rank="'+list[i].rank+'" data-desc="'+list[i].description+'" data-name="'+ 
          list[i].labelName+'" data-id="'+ list[i].labelId+'">编辑</span></td></tr>';
      }
      var tableHtml = tableHead + tablebody + tableFoot;
      $("#tablelist").html(tableHtml);
    } else {
      var tableHtml = '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>话题名</th><th>话题内容</th><th>创建时间</th><th>优先显示</th><th>是否推送</th><th>操作</th></tr>' +
        '</tbody></table><div class="no-data">暂无数据~</div>';
      $("#tablelist").html(tableHtml);
    }
    // 删除
    $('.delBtn').on('click', function () {
      var topicId = $(this).parent().attr('labelid');
      console.log(topicId);
      $('#delTop').modal('show');
      $('#delTopic').unbind('click');
      $('#delTopic').on('click', function () {
        var data = {
          condition: 2,
          labelId: Number(topicId),
          userId:USERID
        }
        var datas = JSON.stringify(data);
        reqAjaxAsync(cmd, datas, checkPass);
      });
    });
    // 编辑
    $('.editBtn').on('click', function () {
      $('#editTopName').val('');
      $('#editTopCont').val('');
      $('#editLev').val('');
      $('#isPush').html('');

          // 数值带入
          var topicId = $(this).attr('data-id');
          var intitle =$(this).attr('data-name');
          var topicHtml =$(this).attr('data-desc');
          var ispush=$(this).attr('data-ispush');
          var topRank=$(this).attr('data-rank');
          var ispush=Number($(this).attr('data-ispush'));
          var spanhtml="";
          if(ispush){
                var spanhtml='<span>是：</span><input type="radio" name="editTs" class="form-control" value="1" checked="checked">'+
                        '<span>否：</span><input type="radio" name="editTs" class="form-control" value="0">';
          }else{
            var spanhtml='<span>是：</span><input type="radio" name="editTs" class="form-control" value="1">'+
            '<span>否：</span><input type="radio" name="editTs" class="form-control" value="0" checked="checked">';
          }
          $('#isPush').html(spanhtml)
          var inCont = topicHtml.replace(/<p>/ig, '').replace(/<\/p>/ig, '');
          $('#editTopName').val(intitle);
          $('#editTopCont').val(inCont);
          $('#editLev').val(topRank);

          $('#editTop').modal('show');
          $('#editLev').unbind('keyup');
          $('#editLev').on('keyup', function () {
            if (!$regNum.test($(this).val())) {
              layer.msg('请输入0~99之间的整数')
              $(this).val('');
            }
          });
          $('#editTopic').unbind('click');
          $('#editTopic').on('click', function () {
            var title = $('#editTopName').val();
            var content = $('#editTopCont').val();
            content = content.replace(/^/gm, '<p>').replace(/$/gm, '</p>').replace(/<p><\/p>/ig, '');
            var rank = $('#editLev').val();
            var push = $('input[name="editTs"]:checked').val();
            if (title == '') {
              layer.msg('话题名不能为空');
              return false;
            }
            if(!$regname.test(title)){
              layer.msg('请正确输入话题名');
              return false;          
            }        
            if (content == '') {
              layer.msg('话题描述不能为空');
              return false;
            }
            if(rank==''){
              layer.msg('话题优先级不能为空');
              return false;          
            }
            var data = {
              condition: 3,
              labelId: Number(topicId),
              rank: Number(rank),
              description: content,
              ispush: Number(push),
              labelName: title,
              userId:USERID
            }
            var datas = JSON.stringify(data);
            console.log(data);
            reqAjaxAsync(cmd, datas, checkPass);
          })

    })
  }
  // 新增模态框弹出时清空内容
  $('#addTop').on('show.bs.modal',function(){
    $('#addTopName').val('');
    $('#addTopCont').val(''); 
    $('#addLev').val('0'); 
    $('#addLev').unbind('keyup');
    $('#addLev').on('keyup',function(){
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
    if(addrank==''){
      layer.msg('话题优先级不能为空');
      return false;      
    }
    var data = {
      condition: 1,
      rank: Number(addrank),
      description: addcontent,
      ispush: Number(addpush),
      labelName: addtitle,
      userId:USERID
    }
    var datas = JSON.stringify(data);
    reqAjaxAsync(cmd, datas, checkPass);
  });

  // 搜索框键盘事件
  $('#search_box').bind('keypress', function (event) {
    if (event.keyCode == '13') {
        var labelName=$(this).val();
        var data = {
          condition: 4,
          row: 5,
          page: 0,
          labelName:labelName,
          userId:USERID
        };
        var datas = JSON.stringify(data);
        reqAjaxAsync(cmd, datas, gets);
    }
  });
  $('#search').on('click', function () {
      var labelName=$('#search_box').val();
      var data = {
        condition: 4,
        row: 5,
        page: 0,
        labelName:labelName,
        userId:USERID
      };
      var datas = JSON.stringify(data);
      reqAjaxAsync(cmd, datas, gets);
  });

  function checkPass(re) {
    layer.msg(re.msg);
    $('.btn,button').removeAttr('data-dismiss');
    $('#addTopic,#delTopic,#editTopic').unbind('click');
    setTimeout(function () {
      layer.load(3);
    }, 2000);
    setTimeout(function(){
      window.location.reload();
    },3000)
  }
})
