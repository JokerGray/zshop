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
        // // 话题选中，填入
        // $('#chTop').unbind('click');
        // $('#chTop').on('click',function(){
        //   var tags=$('input:checkbox[name="tags"]:checked').val(),
        //       param=$('input:checkbox[name="tags"]:checked').attr('param');
        //   console.log(tags);
        //   $('#choseTop').modal('hide');
        //   $('#addtopic').val(tags);
        //   $('#addtopic').attr('paramter',param);
        //   $('#addtopic').show();
        // });        
      }
  var data = {
    pagination:{
      page:1,
      rows:5
    }
  };
  var rows = 5;
  var page = 1;
  var layer = layui.layer;
  var table = layui.table;
  var form = layui.form;
  var index = 0;
  layui.use(['form', 'layer', 'jquery', 'laydate', 'table', 'laypage'], function () {
    form = layui.form;
    layer = layui.layer;
    table = layui.table;
    form.render();
    // getTable(paramKeys, pageno);
    getTable(page, rows);
    form.on('select',function(obj){
      if(obj.value == 2) {
        $('#urlBox').show();
        $('#tpNames').hide();
      }else {
        $('#urlBox').hide();
        $('#tpNames').show();
      }
      updataDlg();
    });
    table.on('tool(table-list)',function(obj){
      var event = obj.event;
      var data = obj.data;
      if (event == 'delete'){
        var topicId = data.id;
        // console.log(topicId);
        var data = {
          id: Number(topicId)
        }
        var datas = JSON.stringify(data);
        reqAjaxAsync(CMD_DEL, datas, checkPass);
      }
    });
  });
   
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
   
 
 
 

  function checkPass(re) {
    // 解除点击事件
    $('button,.btn').removeAttr('data-dismiss');
    // $('#addTopic,#delTopic').unbind('click');
    layer.close(index);
    layer.msg(re.msg);
     
    // 刷新页面
    setTimeout(function () {
      layer.load(3);
    }, 2000);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
  function updataDlg() {
    // console.log('updataDlg');
    $('.layui-layer-content').css('height', 'auto');
    $('.layui-layer').css({
      position: 'absolute',
      top: ($(window).height() - $('.layui-layer').outerHeight()) / 2,
    });
  };
  runupload($('#upload'), updataDlg);
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
  function addTopic() {
    // 获取值
    var type = $('#addType').val(),
      pic = $('#addImg').find('img').attr('src'),
      url = $('#addUrl').val(),
      parameter = $('#addtopic').attr('paramter'),
      rank = $('#rankNum').val();
    // console.log(rank)
    if (rank == "") {
      layer.msg('优先级不能为空')
      return false;
    }
    var regNum = /^[1-9]*[1-9][0-9]*$/;
    if (!regNum.test(rank)) {
      $('#rankNum').val("");
      layer.msg('优先级请填写正整数')
      return false;
    }
    if (!pic) {
      layer.msg('请上传图片')
      return false;
    }
    if (type == '1') {
      if (parameter == '' || parameter == undefined) {
        layer.msg('跳转话题不能为空')
        return false;
      }
      var data = {
        parameter: parameter,
        type: type,
        pic: pic,
        rank: rank
      }
    } else if (type == '2') {
      if (url == '') {
        layer.msg('网址不能为空')
        return false;
      }
      if (!$website.test(url)) {
        layer.msg('请输入正确的网址格式')
        return false;
      }
      var data = {
        type: type,
        pic: pic,
        url: url,
        rank: rank
      }
    }
    // console.log(data);
    var datas = JSON.stringify(data);
    reqAjaxAsync(CMD_ADD, datas, checkPass);
  }

  $('#adGs').on('click',function(){
    layer.open({
      type: 1,
      area: ['600px', 'auto'],
      title: ['新增轮播内容', 'font-size:12px;background-color:#424651;color:#fff'],
      anim: 2,
      btn: ['确定', '取消'],
      shadeClose: true, //开启遮罩关闭
      content: $('#addTop'),
      success: function () {
        $('#choseTopTag').on('click', function () {
          var topicdata = {
            condition: 4,
            labelName: ''
          };
          var topicdatas = JSON.stringify(topicdata);
          reqAjaxAsync(CMD_TOPIC, topicdatas, showTags);
          layer.open({
            type: 1,
            area: ['620px', '300px'],
            title: ['选择话题', 'font-size:12px;background-color:#424651;color:#fff'],
            anim: 2,
            btn: ['确定', '取消'],
            shadeClose: true, //开启遮罩关闭
            content: $('#choseTop'),
            yes: function (index) {
              var tags = $('input:checkbox[name="tags"]:checked').val(),
                param = $('input:checkbox[name="tags"]:checked').attr('param');
              $('#addtopic').val(tags);
              $('#addtopic').attr('paramter', param);
              $('#addtopic').show();
              form.render();
              updataDlg();
              layer.close(index);
            }
          });
        });
        form.render();
      },
      yes: function (index) {
        addTopic();
        index = index;
      }
    });
  });
  function getTable(page, pageno) {
    //第一个实例
    var tableINs = table.render({
      id: 'table-list',
      elem: '#table-list',
      even: true,
      cellMinWidth: 80,
      cols: [
        [ //表头
          {
            type: 'numbers', title: '序号', align: 'center', width: 60, templet: "#indexTpl"
          }, {
            field: 'type',
            title: '轮播类型',
            width: 150,
            align: 'left',
            templet: function(obj){
              var typeStr = '';
              if (obj.type) {
                switch (obj.type) {
                  case 1: typeStr = '跳转话题'; break;
                  case 2: typeStr = '跳转网页'; break;
                  default: break;
                }
              } else {
                typeStr = '错误类型'
              }
              return typeStr;
            }
          }, {
            field: 'labelName',
            title: '话题名',
            width: 120,
            align: 'left',
            // style: 'height:auto;',
            templet: function(obj) {
              return obj.labelName || '无';
            }
          }, {
            field: 'createTime',
            title: '创建时间',
            align: 'left',
            width: 220
          }, {
            field: 'pic',
            title: '轮播图',
            width: 300,
            style: 'height:170px;',
            align: 'left',
            templet: '#imgTpl',
            
          }, {
            field: 'url',
            title: '跳转地址',
            align: 'left',
            width: 300,
          }, {
            field: 'rank',
            title: '优先级',
            align: 'left',
            width: 100,
          }, {
            fixed: 'right',
            title: '操作',
            align: 'left',
            style: 'height:180px;',
            width: 250,

            toolbar: '#barCtrl'
          }
        ]
      ]
    });

    var res = pageCallback(page, pageno);
    if (res) {
      // console.log(res)
      if (res.code == 1) {
        tableINs.reload({
          data: res.data.discoverList
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
        var resTwo = pageCallback(obj.curr, obj.limit);
        if (resTwo && resTwo.code == 1)
          tableINs.reload({
            data: resTwo.data.discoverList
          });
        else
          layer.msg(resTwo.msg);
      }
    }
    //处理 工具栏 固定右边后 高度不一致问题
    var tr = $('.layui-table-box .layui-table-main tbody tr');
    tr.each(function (index, item) {
      var height = $(item).css('height');
      $('.layui-table-box .layui-table-fixed .layui-table-body tr').eq(index).css('height', height);
    });
    layui.laypage.render(page_options);
  }
  //获取内容方法
  function pageCallback(page, pageno) {
    // var labelName = $('#search_box').val();
    var data = {
      "pagination": { "page": page, "rows": pageno || rows}
    };
    var res = reqAjax(CMD_FIND, JSON.stringify(data));
    if (res.code == 1) {
      return res;
    }
  }
})