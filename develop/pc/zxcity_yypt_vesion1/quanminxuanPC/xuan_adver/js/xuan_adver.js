$(function () {
  var CMD_ADD='dazzle/addDazzleDiscover',
      CMD_DEL='dazzle/delDazzleDiscover',
      CMD_UPDATE='dazzle/updateDazzleDiscover',
      CMD_FIND='dazzle/findDazzleDiscover',
      CMD_TOPIC='dazzle/labelMessage';
      var $website = /^((http:\/\/)|(https:\/\/))/; //网址
      var $regname=/^[0-9a-zA-Z_\u4E00-\u9FA5]{1,}$/;//字母数字下划线汉字组合
      function showTags(re){
        console.log(re);
        var liList=re.data.LabelList;
        var lis='';
        for(var i=0;i<liList.length;i++){
            lis+='<li><label>'+liList[i].labelName+'<input type="checkbox" name="tags" value="'+liList[i].labelName+'" param="'+liList[i].labelId+'"></label></li>'
        }
        $('.tag-wrap').html(lis);
        // 话题标签样式
        $('.tag-wrap>li').unbind('click');
        $('.tag-wrap>li').on('click',function(){
          $(this).addClass('active').siblings('li').removeClass('active').find('input').attr("checked",false);
        });
        // 话题选中，填入
        $('#chTop').unbind('click');
        $('#chTop').on('click',function(){
          var tags=$('input:checkbox[name="tags"]:checked').val(),
              param=$('input:checkbox[name="tags"]:checked').attr('param');
          console.log(tags);
          $('#choseTop').modal('hide');
          $('#addtopic').val(tags);
          $('#addtopic').attr('paramter',param);
          $('#addtopic').show();
        });        
      }
  var data = {
    pagination:{
      page:1,
      rows:5
    }
  };
  console.log(data);
  var datas = JSON.stringify(data);
  reqAjaxAsync(CMD_FIND, datas, gets);

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
        console.log(res);
        callback(res, inputdata);
      },
      error: function (err) {
        layer.msg("请求出错！");
        console.log(err);
      }
    });
  }
  // 分页
  function gets(res, inputdata) {
    var inputObj=JSON.parse(inputdata);
    $('#totals').text(res.total);
    var laypage = layui.laypage;
    laypage.render({
      elem: 'pages',
      count: res.total,
      limit:5, //连续显示分页数
      jump: function (obj) {
        var curr = obj.curr;
        // var currNum = curr - 1;
        var newdatas = {
          pagination:{
            page:curr,
            rows:5
          }
        };
        console.log(newdatas);
        var data = JSON.stringify(newdatas);
        reqAjaxAsync(CMD_FIND, data, showTables);
      }
    })
  }
  // 表格展示
  function showTables(res) {
    console.log(res);
    var tableHead = '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>轮播类型</th><th>话题名</th><th>创建时间</th><th>轮播图</th><th>跳转地址</th><th>优先级</th><th>操作</th></tr>';
    var tableFoot = '</tbody></table>';
    if (res.data.discoverList.length) {
      tablebody = "";
      var list = res.data.discoverList;
      for (var i = 0; i < list.length; i++) {
        var typeStr='';
        if(list[i].type){
           switch (list[i].type){
             case 1:typeStr='跳转话题';break;
             case 2:typeStr='跳转网页';break;
             default:break;
           }
        }else{
          typeStr='错误类型'
        }
        tablebody += '<tr><td>' + (i + 1) + '</td><td class="topicName">' + typeStr + '</td><td class="topicHtml" labelid="'+list[i].parameter +'">' +(list[i].labelName?list[i].labelName:"无") + '</td><td>' +
          list[i].createTime + '</td><td class="rank"><img alt="暂无图片" src="'+list[i].pic+'?x-oss-process=image/resize,m_fill,w_250,h_150,limit_0"></td><td class="urls">'+(list[i].url?list[i].url:"无")+'</td><td>' + list[i].rank + '</td>' +
          '<td><input class="hide" type="hidden" types="'+list[i].type+'" value="'+list[i].id+'" parameter="'+list[i].parameter+'"><span class="btn btn-danger delBtn">删除</span><span class="btn btn-primary editBtn" style="display:none;">编辑</span></td></tr>';
      }
      var tableHtml = tableHead + tablebody + tableFoot;
      $("#tablelist").html(tableHtml);
    } else {
      var tableHtml = '<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>轮播类型</th><th>话题名</th><th>创建时间</th><th>轮播图</th><th>跳转地址</th><th>优先级</th><th>操作</th></tr>' +
        '</tbody></table><div class="no-data">暂无数据~</div>';
      $("#tablelist").html(tableHtml);
    }
    // 删除
    $('.delBtn').on('click', function () {
      var topicId = $(this).siblings('.hide').val();
      console.log(topicId);
      $('#delTop').modal('show');
      $('#delTopic').unbind('click');
      $('#delTopic').on('click', function () {
        var data = {
          id:Number(topicId)
        }
        var datas = JSON.stringify(data);
        reqAjaxAsync(CMD_DEL, datas, checkPass);
      });
    });
  }

  // 搜索框键盘事件
  $('#search_box').bind('keypress', function (event) {
    if (event.keyCode == '13') {
        var labelName=$(this).val();
        console.log(labelName);
        };
  });
  $('#search').on('click', function () {
      var labelName=$('#search_box').val();
      console.log(labelName);
  });

  $('#choseTopTag').on('click',function(){
    var topicdata = {
      condition: 4,
      labelName:''
    };
    var topicdatas = JSON.stringify(topicdata);
    reqAjaxAsync(CMD_TOPIC, topicdatas, showTags);
    $('#choseTop').modal('show');
  });

  function checkPass(re) {
    // 解除点击事件
    $('button,.btn').removeAttr('data-dismiss');
    $('#addTopic,#delTopic').unbind('click');
    layer.msg(re.msg);
    // 刷新页面
    setTimeout(function () {
      layer.load(3);
    }, 2000);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  runupload($('#upload'));
  // 新增轮播图
  $('#addTop').on('show.bs.modal',function(){
     // 清空
    $('#addImg').html('').hide();
    $('#addUrl').val('');
    $('#addtopic').val('').removeAttr('paramter');   
  });
  $('#addType').on('change',function(){
    console.log($(this).val());
    var type=$(this).val();
    if(type=='1'){
      $('#addUrl').val('');
      $('#addtopic').val('');
      $('#tpNames').show();
      $('#urlBox').hide();
      $('#addtopic').hide();
    }else if(type=='2'){
      $('#addUrl').val('');
      $('#addtopic').val('');      
      $('#tpNames').hide();
      $('#urlBox').show();
    }
  })
  $('#addTopic').on('click',function(){

    // 获取值
    var type=$('#addType').val(),
        pic=$('#addImg').find('img').attr('src'),
        url=$('#addUrl').val(),
        parameter=$('#addtopic').attr('paramter'),
        rank=$('#rankNum').val();
        console.log(rank)
        if(rank==""){
          layer.msg('优先级不能为空')
          return false;
        }
        var regNum =/^[1-9]*[1-9][0-9]*$/;
        if(!regNum.test(rank)){
          $('#rankNum').val("");
          layer.msg('优先级请填写正整数')
          return false;
        }
    if(!pic){
      layer.msg('请上传图片')
      return false;
    }
    if(type=='1'){
      if(parameter==''||parameter==undefined){
        layer.msg('跳转话题不能为空')
        return false;
      }
      var data={
        parameter:parameter,
        type:type,
        pic:pic,
        rank:rank
      }
    }else if(type=='2'){
      if(url==''){
        layer.msg('网址不能为空')
        return false;
      }
      if(!$website.test(url)){
        layer.msg('请输入正确的网址格式')
        return false;
      }
      var data={
        type:type,
        pic:pic,
        url:url,
        rank:rank
      }
    } 
    console.log(data);
    var datas=JSON.stringify(data);
    reqAjaxAsync(CMD_ADD,datas,checkPass);
  })

})