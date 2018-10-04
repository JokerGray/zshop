(function ($) {
  var REQUEST_URL = {
    SELECTSCLEAVEPAGE: 'leave/selectScLeavePage',//分页查询我提交的请假单列表
    SELECTCLAIMTASKPAGE: 'leave/selectClaimTaskPage',//分页查询未签收请假单任务
    SELECTTODOTASKPAGE: 'leave/selectTodoTaskPage',//分页查询已签收请假审批任务
    SELECTDEALWITHPAGE: 'leave/selectDealWithPage',//分页查询已办结请假任务
    SELECTFINISHPAGELEAVE: 'leave/selectfinishPage',//分页查询已完成请假任务
    DETAILSCLEAVE: 'leave/detailScLeave',//查看审批详情
    QUERYSCLEAVEPROCESSLIST: 'leave/queryScLeaveProcessList',//查看请假单审批记录
    STARTLEAVEPROCESS: 'leave/startLeaveProcess',//发起审批
    SAVEORUPDATESCLEAVE: 'leave/saveOrUpdateScLeave',//保存审批（草稿）
    QUERYPROCESSTEMPLATE: 'processSet/queryProcessTemplate',//根据条件查询流程模板
    DELETESCLEAVE: 'leave/deleteScLeave',//删除草稿
    VIEWPROCESSCHAT: 'leave/viewProcessChat',//查看流程图
    CLAIM: 'leave/claim',//签收任务
    GETCURRENTTASK: 'leave/getCurrentTask',//获取运行时任务
    COMPLETE: 'leave/complete'//办理请假审批任务
  };

  var page = 1;
  var rows = 4;
  var userId = getUrlParams('userId') || 10092;
  var merchantId = getUrlParams('merchantId');
  var lock = true;
  var layer = layui.layer;
  var laypage = layui.laypage;
  var laydate = layui.laydate;

  layer.config({
    extend: 'myskin/style.css'
  });

  layui.use('form', function () {
    form = layui.form;
  })

  //页面初始化
  $(function () {
    $('#approval .title li:eq(0)').click();
  })

  //tabs页切换
  $('#approval .title li').on('click', function () {
    var index = $(this).index();
    var param = {
      page: page,
      rows: rows,
      userId: userId
    }
    $(this).addClass('active').siblings().removeClass('active');
    //我提交的
    if (index == 0) {
      $('.sign-up').css('visibility', 'hidden');
      var res0 = reqAjax(REQUEST_URL.SELECTSCLEAVEPAGE, JSON.stringify(param));
      init1(res0);

      laypage.render({
        elem: 'paging-box-r',//容器
        count: res0.total,//总数
        limit: rows,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            page: obj.curr,
            rows: rows,
            userId: userId
          }
          if (!first) {
            var res0 = reqAjax(REQUEST_URL.SELECTSCLEAVEPAGE, JSON.stringify(param));
            init1(res0);
          }
        }
      });
      //待处理
    } else if (index == 1) {
      $('.sign-up').css('visibility', 'visible');
      $('.sign-up li:eq(0)').addClass('active').siblings().removeClass('active');
      var res1 = reqAjax(REQUEST_URL.SELECTCLAIMTASKPAGE, JSON.stringify(param));
      init4(res1);

      laypage.render({
        elem: 'paging-box-r',//容器
        count: res1.total,//总数
        limit: rows,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            page: obj.curr,
            rows: rows,
            userId: userId
          }
          if (!first) {
            var res1 = reqAjax(REQUEST_URL.SELECTCLAIMTASKPAGE, JSON.stringify(param));
            init4(res1);
          }
        }
      });
      //已办结
    } else if (index == 2) {
      $('.sign-up').css('visibility', 'hidden');
      var res2 = reqAjax(REQUEST_URL.SELECTDEALWITHPAGE, JSON.stringify(param));
      init4(res2);

      laypage.render({
        elem: 'paging-box-r',//容器
        count: res2.total,//总数
        limit: rows,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            page: obj.curr,
            rows: rows,
            userId: userId
          }
          if (!first) {
            var res2 = reqAjax(REQUEST_URL.SELECTDEALWITHPAGE, JSON.stringify(param));
            init4(res2);
          }
        }
      });
      //已完成
    } else if (index == 3) {
      $('.sign-up').css('visibility', 'hidden');
      var res3 = reqAjax(REQUEST_URL.SELECTFINISHPAGELEAVE, JSON.stringify(param));
      init1(res3);

      laypage.render({
        elem: 'paging-box-r',//容器
        count: res3.total,//总数
        limit: rows,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            page: obj.curr,
            rows: rows,
            userId: userId
          }
          if (!first) {
            var res3 = reqAjax(REQUEST_URL.SELECTFINISHPAGELEAVE, JSON.stringify(param));
            init1(res3);
          }
        }
      });
    }
  });

  //待处理中未签收已签收切换
  $('#approval .sign-up li').on('click', function () {
    var index = $(this).index();
    var param = {
      page: page,
      rows: rows,
      userId: userId
    }
    $(this).addClass('active').siblings().removeClass('active');
    if (index == 0) {
      $('#approval .title li:eq(1)').click();
    } else if (index == 1) {
      var res = reqAjax(REQUEST_URL.SELECTTODOTASKPAGE, JSON.stringify(param));
      init4(res);

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
            page: obj.curr,
            rows: rows,
            userId: userId
          }
          if (!first) {
            var res = reqAjax(REQUEST_URL.SELECTTODOTASKPAGE, JSON.stringify(param));
            init4(res);
          }
        }
      });
    }
  })

  //优先级切换
  $('#details-2 .level-item').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
  })

  //我提交的,已完成的列表渲染方法
  function init1(res) {
    if (res.code == 1) {
      $('#approval .item-list .item-container').html('');
      var sHtml = '';
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml +=
          '<div class="item" data-id="' + row.id + '" data-approvalStatus="' + row.approvalStatus + '">' +
          '<div class="item-info">' +
          '<div class="icon-area">' +
          '<i class="icon-1"></i>';
        if (row.approvalStatus == 1) {
          sHtml += '<i class="icon-4"></i></div>';
        } else if (row.approvalStatus == 2) {
          sHtml += '<i class="icon-2"></i></div>';
        } else if (row.approvalStatus == 3) {
          sHtml += '<i class="icon-5"></i></div>';
        } else if (row.approvalStatus == 4) {
          sHtml += '<i class="icon-6"></i></div>';
        } else if (row.approvalStatus == 5) {
          sHtml += '<i class="icon-3"></i></div>';
        } else if (row.createBy == 'u' + userId) {
          sHtml += '<i class="icon-3"></i></div>';
        }
        sHtml +=
          '<div class="info">' +
          '<span class="name">' + row.createByName + ' </span>' +
          '<span class="time"> ' + row.applyTime + ' 提交了</span>' +
          '<p class="type">请假申请：' + row.leaveTime + '天</p>';
        if (row.priorityLevel == '1') {
          sHtml += '<p class="level-2">普通</p>';
        } else if (row.priorityLevel == '2') {
          sHtml += '<p class="level-1">紧急</p>';
        } else if (row.priorityLevel == '3') {
          sHtml += '<p class="level-0">非常紧急</p>';
        }
        if (row.approvalStatus == 1) {
          sHtml += '<p class="txt">未提交</p>';
        } else if (row.approvalStatus == 2) {
          sHtml += '<p class="txt">审批中</p>';
        } else if (row.approvalStatus == 3) {
          sHtml += '<p class="txt">审批通过</p>';
        } else if (row.approvalStatus == 4) {
          sHtml += '<p class="txt">已撤销</p>';
        } else if (row.approvalStatus == 5) {
          sHtml += '<p class="txt">审批未通过</p>';
        }
        sHtml += '</div></div><div class="edit-area">';
        if (row.approvalStatus == 1) {
          sHtml +=
            '<button class="btn btn-sm delete">删除</button>' +
            '<button class="btn btn-sm detail">查看详情</button></div></div>';
        } else if (row.approvalStatus == 2 || row.approvalStatus == 3 || row.approvalStatus == 4 || row.approvalStatus == 5) {
          sHtml += '<button class="btn btn-sm detail">查看详情</button></div></div>';
        } else if (row.createBy == 'u' + userId) {
          sHtml += '<button class="btn btn-sm dealwith">立即处理</button></div></div>';
        }
      }
      $('#approval .item-list .item-container').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //审批详情渲染方法
  function init2(res, layero) {
    if (res.code == 1) {
      var data = res.data;
      if (data.priorityLevel == 1) {
        $(layero).find('.title').html('请假审批<p class="level-2">普通</p>');
      } else if (data.priorityLevel == 2) {
        $(layero).find('.title').html('请假审批<p class="level-1">紧急</p>');
      } else if (data.priorityLevel == 3) {
        $(layero).find('.title').html('请假审批<p class="level-0">非常紧急</p>');
      }
      $(layero).find('.base-info p').html(data.createByName + "&nbsp;&nbsp;" + data.applyTime);
      if (data.leaveType == 1) {
        $(layero).find('.base-info tr:eq(1) td:eq(1)').html('事假');
      } else if (data.leaveType == 2) {
        $(layero).find('.base-info tr:eq(1) td:eq(1)').html('病假');
      } else if (data.leaveType == 3) {
        $(layero).find('.base-info tr:eq(1) td:eq(1)').html('调休');
      } else if (data.leaveType == 4) {
        $(layero).find('.base-info tr:eq(1) td:eq(1)').html('婚假');
      } else if (data.leaveType == 5) {
        $(layero).find('.base-info tr:eq(1) td:eq(1)').html('丧假');
      } else if (data.leaveType == 6) {
        $(layero).find('.base-info tr:eq(1) td:eq(1)').html('工伤假');
      }
      $(layero).find('.base-info tr:eq(2) td:eq(1)').html(data.startTime);
      $(layero).find('.base-info tr:eq(2) td:eq(2)').html(data.leaveTime + '天');
      $(layero).find('.base-info tr:eq(3) td:eq(1)').html(data.endTime);
      $(layero).find('.base-info tr:eq(4) td:eq(1)').html(data.processTemplateName);
      $(layero).find('.base-info tr:eq(5) td:eq(1)').html(data.reason);
    } else {
      layer.msg(res.msg);
    }
  }

  //审批记录详情渲染方法
  function init3(res, layero) {
    if (res.code == 1) {
      var sHtml = '';
      for (var i = 0; i < res.data.length; i++) {
        var data = res.data[i];
        sHtml +=
          '<tr>' +
          '<td>' + data.sysBackUserName + '</td>' +
          '<td>' +
          '<p>' + data.operateTypeName + '</p>';
        if (data.opinion) {
          sHtml += '<p>' + data.opinion + '</p>'
        }
        sHtml += '</td>' +
          '<td>' + data.approvalTime + '</td>' +
          '</tr>'
      }

      $(layero).find('.recording table tbody').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //待处理,已办结列表渲染方法
  function init4(res) {
    if (res.code == 1) {
      $('#approval .item-list .item-container').html('');
      var sHtml = '';
      for (var i = 0; i < res.data.length; i++) {
        var row = res.data[i];
        sHtml +=
          '<div class="item" data-id="' + row.id + '" data-dealWithType="' + row.dealWithType + '">' +
          '<div class="item-info">' +
          '<div class="icon-area">' +
          '<i class="icon-1"></i>';
        if (row.operateType == 1) {
          sHtml += '<i class="icon-2"></i></div>'
        } else if (row.operateType == 2) {
          sHtml += '<i class="icon-5"></i></div>';
        } else if (row.operateType == 3) {
          sHtml += '<i class="icon-3"></i></div>';
        } else if (row.operateType == 4) {
          sHtml += '<i class="icon-6"></i></div>';
        }
        sHtml +=
          '<div class="info">' +
          '<span class="name">' + row.createByName + ' </span>' +
          '<span class="time"> ' + row.applyTime + ' 提交了</span>' +
          '<p class="type">请假申请：' + row.leaveTime + '天</p>';
        if (row.priorityLevel == 1) {
          sHtml += '<p class="level-2">普通</p>';
        } else if (row.priorityLevel == 2) {
          sHtml += '<p class="level-1">紧急</p>';
        } else if (row.priorityLevel == 3) {
          sHtml += '<p class="level-0">非常紧急</p>';
        }
        sHtml +=
          '<p class="txt">由' + row.sysBackUserName + row.operateTypeName + '</p></div></div>';
        if (row.dealWithType == 'claim') {
          sHtml +=
            '<div class="edit-area">' +
            '<button class="btn btn-sm">签收</button>' +
            '</div></div>';
        } else if (row.dealWithType == 'todo') {
          sHtml +=
            '<div class="edit-area">' +
            '<button class="btn btn-sm">立即处理</button>' +
            '</div></div>';
        } else if (row.dealWithType == 'havedo') {
          sHtml +=
            '<div class="edit-area">' +
            '<button class="btn btn-sm detail">查看详情</button>' +
            '</div></div>';
        }
      }
      $('#approval .item-list .item-container').html(sHtml);
    } else {
      layer.msg(res.msg);
    }
  }

  //发起审批弹框
  $('#approval .title button').on('click', function () {
    layer.open({
      title: ['发起审批', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-2'),
      area: ['700px', '800px'],
      btn: ['保存', '发布'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-2').hide();
        $('#details-2 form')[0].reset();//表单初始化
        $('#details-2 .level-item:eq(0)').click();
      },
      success: function (layero, index) {
        //时间控件初始化
        $('#beginTime').click(function () {
          laydate.render({
            elem: '#time',
            closeStop: '#beginTime',
            show: true,
            min: 0,
            range: '至',
            format: 'yyyy-MM-dd',
            btns: ['clear', 'confirm'],
            done: function (value, date, endDate) {
              $('#timer').val('');
              var arr = value.split(' 至 ');
              $('#beginTime').attr('data-beginTime', arr[0] + ' 00:00:00').val(arr[0]);
              $('#endTime').attr('data-endTime', arr[1] + ' 00:00:00').val(arr[1]);
              $('#timer').val((DateMinus(arr[0], arr[1])) + '天').attr('data-leaveTime', (DateMinus(arr[0], arr[1])));
              if (new Date(arr[0]) > new Date(arr[1])) {
                $('#beginTime').val('');
                $('#endTime').val('');
                layer.msg('开始日期超出了结束日期建议重新选择');
              }
            }
          });
        })
        //流程模板选择初始化
        var param = {
          businessType: "leave",
          merchantId: ''
        }
        var res = reqAjax(REQUEST_URL.QUERYPROCESSTEMPLATE, JSON.stringify(param));
        if (res.code == 1) {
          var sHtml = '';
          for (var i = 0; i < res.data.length; i++) {
            var data = res.data[i];
            sHtml += '<option value="' + data.id + '" data-procDefId="' + data.procDefId + '">' + data.templateName + '</option>'
          }
          $('#details-2 .layui-form-item:eq(5) select').html(sHtml);
        } else {
          layer.msg(res.msg);
        }
        form.render('select');

      },
      //保存草稿回调
      yes: function (index, layero) {
        var leaveType = $(layero).find('.layui-form-item:eq(1) select').val();
        var startTime = $('#beginTime').attr('data-beginTime');
        var endTime = $('#endTime').attr('data-endTime');
        var leaveTime = $('#timer').attr('data-leaveTime');
        var processTemplateId = $(layero).find('.layui-form-item:eq(5) select').val();
        var priorityLevel = $(layero).find('.layui-form-item:eq(6) .level-item[class="level-item active"]').attr('data-priorityLevel');
        var reason = $(layero).find('#textarea').val();
        var param = {
          userId: userId,
          /*shopId: shopId,*/
          leaveType: leaveType,
          startTime: startTime,
          endTime: endTime,
          leaveTime: leaveTime,
          processTemplateId: processTemplateId,
          priorityLevel: priorityLevel,
          reason: reason
        }
        if (!reason) {
          layer.msg('请填写请假原因!')
          return;
        }
        if (lock) {
          lock = false;
          reqAjaxAsync(REQUEST_URL.SAVEORUPDATESCLEAVE, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
              layer.msg(res.msg);
              setTimeout(function () {
                location.reload(true);
              }, 500);
            } else {
              layer.msg(res.msg);
              lock = true
            }
          })
        }
      },
      //发布回调
      btn2: function (index, layero) {
        var leaveType = $(layero).find('.layui-form-item:eq(1) select').val();
        var startTime = $('#beginTime').attr('data-beginTime');
        var endTime = $('#endTime').attr('data-endTime');
        var leaveTime = $('#timer').attr('data-leaveTime');
        var processTemplateId = $(layero).find('.layui-form-item:eq(5) select').val();
        var priorityLevel = $(layero).find('.layui-form-item:eq(6) .level-item[class="level-item active"]').attr('data-priorityLevel');
        var reason = $(layero).find('#textarea').val();
        var param = {
          userId: userId,
          leaveType: leaveType,
          startTime: startTime,
          endTime: endTime,
          leaveTime: leaveTime,
          processTemplateId: processTemplateId,
          priorityLevel: priorityLevel,
          reason: reason
        }
        if (!reason) {
          layer.msg('请填写请假原因!')
          return false;
        }
        if (lock) {
          lock = false
          reqAjaxAsync(REQUEST_URL.STARTLEAVEPROCESS, JSON.stringify(param)).done(function (res) {
            if (res.code == 1) {
              layer.msg('发布成功');
              setTimeout(function () {
                location.reload(true);
              }, 500);
            } else {
              layer.msg(res.msg);
              lock = true
            }
          })
        }
        return false;
      }
    })
  })

  //草稿查看详情弹窗
  $('#approval .item-list').on('click',
    '.item[data-approvalStatus=1] .item-info,' +
    '.item[data-approvalStatus=1] .detail',
    function () {
      var $this = $(this).parents('.item');
      layer.open({
        title: ['审批详情', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
        type: 1,
        skin: 'layer-ext-myskin',
        content: $('#details-3'),
        area: ['700px', '520px'],
        btn: ['编辑', '删除'],
        btnAlign: 'r',
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#details-3').hide();
        },
        success: function (layero, index) {
          var param = {
            leaveId: $this.attr('data-id')
          }
          var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
          var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
          init2(res1, layero);//审批详情
          init3(res2, layero);//审批记录
        },
        //编辑草稿
        yes: function (index, layero) {
          layer.close(index);
          layer.open({
            title: ['发起审批', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
            type: 1,
            skin: 'layer-ext-myskin',
            content: $('#details-2'),
            area: ['700px', '800px'],
            btn: ['保存', '发布'],
            btnAlign: 'r',
            closeBtn: 1,
            scrollbar: false,
            resize: false,
            move: false,
            end: function () {
              $('#details-2').hide();
            },
            success: function (layero, index) {
              var param = {
                businessType: "leave",
                merchantId: ''
              }
              var param1 = {
                leaveId: $this.attr('data-id')
              }
              //流程模板选择初始化
              var res = reqAjax(REQUEST_URL.QUERYPROCESSTEMPLATE, JSON.stringify(param));
              if (res.code == 1) {
                var sHtml = '';
                for (var i = 0; i < res.data.length; i++) {
                  var data = res.data[i];
                  sHtml += '<option value="' + data.id + '" data-procDefId="' + data.procDefId + '">' + data.templateName + '</option>'
                }
                $('#details-2 .layui-form-item:eq(5) select').html(sHtml);
              } else {
                layer.msg(res.msg);
              }

              //详情内容初始化
              var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param1));
              if (res1.code == 1) {
                var data1 = res1.data;
                $(layero).find('.layui-form-item:eq(1) select').val(data1.leaveType);
                $(layero).find('#beginTime').val(data1.startTime.slice(0, 10)).attr('data-beginTime', data1.startTime);
                $(layero).find('#endTime').val(data1.endTime.slice(0, 10)).attr('data-endTime', data1.endTime)
                $(layero).find('#timer').val(data1.leaveTime + '天').attr('data-leaveTime', data1.leaveTime);
                $(layero).find('.layui-form-item:eq(5) select').val(data1.processTemplateId);
                $(layero).find('.layui-form-item:eq(6) .level-item:eq(' + (data1.priorityLevel - 1) + ')').addClass('active').siblings().removeClass('active');
                $(layero).find('#textarea').val(data1.reason);
              } else {
                layer.msg(res1.msg);
              }

              //时间控件初始化
              $('#beginTime').click(function () {
                laydate.render({
                  elem: '#time',
                  closeStop: '#beginTime',
                  show: true,
                  min: 0,
                  range: '至',
                  format: 'yyyy-MM-dd',
                  btns: ['clear', 'confirm'],
                  done: function (value, date, endDate) {
                    $('#timer').val('');
                    var arr = value.split(' 至 ');
                    $('#beginTime').attr('data-beginTime', arr[0] + ' 00:00:00').val(arr[0]);
                    $('#endTime').attr('data-endTime', arr[1] + ' 00:00:00').val(arr[1]);
                    $('#timer').val((DateMinus(arr[0], arr[1])) + '天').attr('data-leaveTime', (DateMinus(arr[0], arr[1])));
                    if (new Date(arr[0]) > new Date(arr[1])) {
                      $('#beginTime').val('');
                      $('#endTime').val('');
                      layer.msg('开始日期超出了结束日期建议重新选择')
                    }
                  }
                });
              })

              form.render('select');
            },
            //保存草稿回调
            yes: function (index, layero) {
              var leaveType = $(layero).find('.layui-form-item:eq(1) select').val();
              var startTime = $('#beginTime').attr('data-beginTime');
              var endTime = $('#endTime').attr('data-endTime');
              var leaveTime = $('#timer').attr('data-leaveTime');
              var processTemplateId = $(layero).find('.layui-form-item:eq(5) select').val();
              var priorityLevel = $(layero).find('.layui-form-item:eq(6) .level-item[class="level-item active"]').attr('data-priorityLevel');
              var reason = $(layero).find('#textarea').val();
              var param = {
                leaveId: $this.attr('data-id'),
                userId: userId,
                leaveType: leaveType,
                startTime: startTime,
                endTime: endTime,
                leaveTime: leaveTime,
                processTemplateId: processTemplateId,
                priorityLevel: priorityLevel,
                reason: reason
              }
              if (!reason) {
                layer.msg('请填写请假原因!')
                return false;
              }
              if (lock) {
                lock = false
                reqAjaxAsync(REQUEST_URL.SAVEORUPDATESCLEAVE, JSON.stringify(param)).done(function (res) {
                  if (res.code == 1) {
                    layer.msg(res.msg);
                    setTimeout(function () {
                      location.reload(true);
                    }, 500);
                  } else {
                    layer.msg(res.msg);
                    lock = true
                  }
                })
              }
            },
            //发布回调
            btn2: function (index, layero) {
              var leaveType = $(layero).find('.layui-form-item:eq(1) select').val();
              var startTime = $('#beginTime').attr('data-beginTime');
              var endTime = $('#endTime').attr('data-endTime');
              var leaveTime = $('#timer').attr('data-leaveTime');
              var processTemplateId = $(layero).find('.layui-form-item:eq(5) select').val();
              var priorityLevel = $(layero).find('.layui-form-item:eq(6) .level-item[class="level-item active"]').attr('data-priorityLevel');
              var reason = $(layero).find('#textarea').val();
              var param = {
                leaveId: $this.attr('data-id'),
                userId: userId,
                leaveType: leaveType,
                startTime: startTime,
                endTime: endTime,
                leaveTime: leaveTime,
                processTemplateId: processTemplateId,
                priorityLevel: priorityLevel,
                reason: reason
              }
              if (!reason) {
                layer.msg('请填写请假原因!')
                return false;
              }
              if (lock) {
                lock = false
                reqAjaxAsync(REQUEST_URL.STARTLEAVEPROCESS, JSON.stringify(param)).done(function (res) {
                  if (res.code == 1) {
                    layer.msg('发布成功');
                    setTimeout(function () {
                      location.reload(true);
                    }, 500);
                  } else {
                    layer.msg(res.msg);
                    lock = true
                  }
                })
              }
              return false;
            }
          })
        },
        //删除草稿
        btn2: function (index, layero) {
          var id = $this.attr('data-id');
          var param = {
            id: id
          }
          layer.confirm('确定要删除此审批吗?', {title: '提示'}, function (index) {
            if (lock) {
              lock = false
              reqAjaxAsync(REQUEST_URL.DELETESCLEAVE, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  layer.msg(res.msg);
                  setTimeout(function () {
                    layer.close(index);
                    location.reload(true);
                  }, 500)
                } else {
                  layer.msg(res.msg);
                  lock = true
                }
              })
            }
          })
          return false;
        }
      })
    })

  //审批中,已完成,已撤销,审批未通过查看详情弹窗,详情按钮弹窗
  $('#approval .item-list').on('click',
    '.item[data-approvalStatus=2] .item-info,' +
    '.item[data-approvalStatus=2] .detail,' +
    '.item[data-approvalStatus=3] .item-info,' +
    '.item[data-approvalStatus=3] .detail,' +
    '.item[data-approvalStatus=4] .item-info,' +
    '.item[data-approvalStatus=4] .detail,' +
    '.item[data-approvalStatus=5] .item-info,' +
    '.item[data-approvalStatus=5] .detail',
    function () {
      var $this = $(this).parents('.item');
      layer.open({
        title: ['审批详情', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
        type: 1,
        skin: 'layer-ext-myskin',
        content: $('#details-1'),
        area: ['700px', '730px'],
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#details-1').hide();
        },
        success: function (layero, index) {
          var param = {
            leaveId: $this.attr('data-id')
          }
          var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
          var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
          init2(res1, layero);//审批详情
          init3(res2, layero);//审批记录
        }
      })
    })

  //待处理未签收详情弹窗
  $('#approval .item-list').on('click',
    '.item[data-dealWithType=claim] .item-info,' +
    '.item[data-dealWithType=claim] button',
    function () {
      var $this = $(this).parents('.item');
      layer.open({
        title: ['审批详情', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
        type: 1,
        skin: 'layer-ext-myskin',
        content: $('#details-1'),
        area: ['700px', '730px'],
        btn: ['签收'],
        btnAlign: 'r',
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#details-1').hide();
        },
        success: function (layero, index) {
          var param = {
            leaveId: $this.attr('data-id')
          }
          var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
          var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
          init2(res1, layero);//审批详情
          init3(res2, layero);//审批记录
        },
        yes: function (index, layero) {
          var param = {
            userId: userId,
            leaveId: $this.attr('data-id')
          }
          if (lock) {
            lock = false
            reqAjaxAsync(REQUEST_URL.CLAIM, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                layer.msg(res.msg);
                setTimeout(function () {
                  layer.close(index);
                  $('#approval .title li:eq(1)').click();
                  lock = true;
                }, 500)
              } else {
                layer.msg(res.msg);
                lock = true;
              }
            })
          }
        }
      })
    })

  //待处理已签收详情弹窗
  $('#approval .item-list').on('click', '.item[data-dealwithtype=todo] .item-info,.item[data-dealWithType=todo] button', function () {
    var $this = $(this).parents('.item');
    var param = {
      leaveId: $this.attr('data-id')
    }
    var res = reqAjax(REQUEST_URL.GETCURRENTTASK, JSON.stringify(param));
    if (res.code == 1) {
      //部门领导审批或人事审批
      if (res.data.taskDefinitionKey == "deptLeaderAudit" || res.data.taskDefinitionKey == "hrAudit") {
        layer.open({
          title: [res.data.taskName, 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-1'),
          area: ['700px', '730px'],
          btn: ['批准', '驳回'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-1').hide();
          },
          success: function (layero, index) {
            var param = {
              leaveId: $this.attr('data-id')
            }
            var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
            var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
            init2(res1, layero);//审批详情
            init3(res2, layero);//审批记录
          },
          //批准回调
          yes: function (index, layero) {
            layer.open({
              title: ['提示'],
              type: 1,
              skin: 'layer-ext-myskin',
              content: $('#details-5'),
              area: ['420px', '330px'],
              btn: ['确定', '取消'],
              btnAlign: 'r',
              closeBtn: 1,
              scrollbar: false,
              resize: false,
              move: false,
              end: function () {
                $('#details-5').hide();
              },
              yes: function (index, layero) {
                var param = {
                  userId: userId,
                  operate: "yes",
                  comment: $.trim($(layero).find('textarea').val()),
                  leaveId: $this.attr('data-id')
                }
                if (lock) {
                  lock = false
                  reqAjaxAsync(REQUEST_URL.COMPLETE, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                      layer.msg(res.msg);
                      setTimeout(function () {
                        location.reload(true);
                      }, 500)
                    } else {
                      layer.msg(res.msg)
                      lock = true
                    }
                  })
                }
              }
            })
          },
          //驳回回调
          btn2: function (index, layero) {
            layer.open({
              title: ['提示'],
              type: 1,
              skin: 'layer-ext-myskin',
              content: $('#details-5'),
              area: ['420px', '330px'],
              btn: ['确定', '取消'],
              btnAlign: 'r',
              closeBtn: 1,
              scrollbar: false,
              resize: false,
              move: false,
              end: function () {
                $('#details-5').hide();
              },
              success: function (layero, index) {
                $(layero).find('p').html('确定要驳回此审批吗?')
              },
              yes: function (index, layero) {
                var param = {
                  userId: userId,
                  operate: "no",
                  comment: $.trim($(layero).find('textarea').val()),
                  leaveId: $this.attr('data-id')
                }
                if (lock) {
                  lock = false
                  reqAjaxAsync(REQUEST_URL.COMPLETE, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                      layer.msg(res.msg);
                      setTimeout(function () {
                        location.reload(true);
                      }, 500)
                    } else {
                      layer.msg(res.msg);
                      lock = true
                    }
                  })
                }
              }
            })
            return false;
          }
        })
        //调整申请
      } else if (res.data.taskDefinitionKey == "modifyApply") {
        layer.open({
          title: [res.data.taskName, 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-1'),
          area: ['700px', '730px'],
          btn: ['重申', '撤销'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-1').hide();
          },
          success: function (layero, index) {
            var param = {
              leaveId: $this.attr('data-id')
            }
            var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
            var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
            init2(res1, layero);//审批详情
            init3(res2, layero);//审批记录
          },
          //重申回调
          yes: function (index, layero) {
            layer.close(index);
            layer.open({
              title: ['调整申请', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
              type: 1,
              skin: 'layer-ext-myskin',
              content: $('#details-2'),
              area: ['700px', '800px'],
              btn: ['重新提交'],
              btnAlign: 'r',
              closeBtn: 1,
              scrollbar: false,
              resize: false,
              move: false,
              end: function () {
                $('#details-2').hide();
              },
              success: function (layero, index) {
                var param = {
                  businessType: "leave",
                  merchantId: ''
                }
                var param1 = {
                  leaveId: $this.attr('data-id')
                }
                //流程模板选择初始化
                var res = reqAjax(REQUEST_URL.QUERYPROCESSTEMPLATE, JSON.stringify(param));
                if (res.code == 1) {
                  var sHtml = '';
                  for (var i = 0; i < res.data.length; i++) {
                    var data = res.data[i];
                    sHtml += '<option value="' + data.id + '" data-procDefId="' + data.procDefId + '">' + data.templateName + '</option>'
                  }
                  $('#details-2 .layui-form-item:eq(5) select').html(sHtml);
                } else {
                  layer.msg(res.msg);
                }

                //详情内容初始化
                var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param1));
                if (res1.code == 1) {
                  var data1 = res1.data;
                  $(layero).find('.layui-form-item:eq(1) select').val(data1.leaveType);
                  $(layero).find('#beginTime').val(data1.startTime.slice(0, 10)).attr('data-beginTime', data1.startTime);
                  $(layero).find('#endTime').val(data1.endTime.slice(0, 10)).attr('data-endTime', data1.endTime)
                  $(layero).find('#timer').val(data1.leaveTime + '天').attr('data-leaveTime', data1.leaveTime);
                  $(layero).find('.layui-form-item:eq(5) select').val(data1.processTemplateId);
                  $(layero).find('.layui-form-item:eq(6) .level-item:eq(' + (data1.priorityLevel - 1) + ')').addClass('active').siblings().removeClass('active');
                  $(layero).find('#textarea').val(data1.reason);
                } else {
                  layer.msg(res1.msg);
                }

                //时间控件初始化
                $('#beginTime').click(function () {
                  laydate.render({
                    elem: '#time',
                    closeStop: '#beginTime',
                    show: true,
                    min: 0,
                    range: '至',
                    format: 'yyyy-MM-dd',
                    btns: ['clear', 'confirm'],
                    done: function (value, date, endDate) {
                      $('#timer').val('');
                      var arr = value.split(' 至 ');
                      $('#beginTime').attr('data-beginTime', arr[0] + ' 00:00:00').val(arr[0]);
                      $('#endTime').attr('data-endTime', arr[1] + ' 00:00:00').val(arr[1]);
                      $('#timer').val((DateMinus(arr[0], arr[1])) + '天').attr('data-leaveTime', (DateMinus(arr[0], arr[1])));
                      if (new Date(arr[0]) > new Date(arr[1])) {
                        $('#beginTime').val('');
                        $('#endTime').val('');
                        layer.msg('开始日期超出了结束日期建议重新选择')
                      }
                    }
                  });
                })

                form.render('select');
              },
              //重新提交回调
              yes: function (index, layero) {
                var leaveType = $(layero).find('.layui-form-item:eq(1) select').val();
                var startTime = $('#beginTime').attr('data-beginTime');
                var endTime = $('#endTime').attr('data-endTime');
                var leaveTime = $('#timer').attr('data-leaveTime');
                /*var processTemplateId = $(layero).find('.layui-form-item:eq(5) select').val();*/
                var priorityLevel = $(layero).find('.layui-form-item:eq(6) .level-item[class="level-item active"]').attr('data-priorityLevel');
                var reason = $(layero).find('#textarea').val();
                var param = {
                  userId: userId,
                  leaveId: $this.attr('data-id'),
                  operate: "yes",
                  leaveType: leaveType,
                  startTime: startTime,
                  endTime: endTime,
                  leaveTime: leaveTime,
                  priorityLevel: priorityLevel,
                  reason: reason
                }
                if (!reason) {
                  layer.msg('请填写请假原因!')
                  return false;
                }
                if (lock) {
                  lock = false
                  reqAjaxAsync(REQUEST_URL.COMPLETE, JSON.stringify(param)).done(function (res) {
                    if (res.code == 1) {
                      layer.msg(res.msg);
                      setTimeout(function () {
                        location.reload(true);
                      }, 500);
                    } else {
                      layer.msg(res.msg);
                      lock = true
                    }
                  })
                }
                return false;
              }
            })
          },
          //撤销回调
          btn2: function (index, layero) {
            layer.confirm('确定要撤销此申请吗?', {title: '提示'}, function (index) {
              var param = {
                userId: userId,
                operate: "no",
                leaveId: $this.attr('data-id')
              }
              if (lock) {
                lock = false
                reqAjaxAsync(REQUEST_URL.COMPLETE, JSON.stringify(param)).done(function (res) {
                  if (res.code == 1) {
                    layer.msg(res.msg);
                    setTimeout(function () {
                      location.reload(true);
                    }, 500)
                  } else {
                    layer.msg(res.msg);
                    lock = true
                  }
                })
              }
            })
            return false;
          }
        })
        //销假
      } else if (res.data.taskDefinitionKey == "reportBack") {
        layer.open({
          title: [res.data.taskName, 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#details-1'),
          area: ['700px', '780px'],
          btn: ['提交'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          end: function () {
            $('#details-1').hide();
            $('#details-1 .realityTime').hide();
          },
          success: function (layero, index) {
            var param = {
              leaveId: $this.attr('data-id')
            }
            var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
            var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
            init2(res1, layero);//审批详情
            init3(res2, layero);//审批记录
            $(layero).find('.realityTime').show();
            $(layero).on('click', '#realityStartTime', function () {
              laydate.render({
                elem: '#reality',
                closeStop: '#realityStartTime',
                show: true,
                /*min: 0,*/
                range: '至',
                format: 'yyyy-MM-dd',
                btns: ['clear', 'confirm'],
                done: function (value, date, endDate) {
                  $('#timer').val('');
                  var arr = value.split(' 至 ');
                  $('#realityStartTime').attr('data-beginTime', arr[0] + ' 00:00:00').val(arr[0]);
                  $('#realityEndTime').attr('data-endTime', arr[1] + ' 00:00:00').val(arr[1]);
                  if (new Date(arr[0]) > new Date(arr[1])) {
                    $('#realityStartTime').val('');
                    $('#realityEndTime').val('');
                    layer.msg('开始日期超出了结束日期建议重新选择');
                  }
                }
              });
            })
          },
          //提交回调
          yes: function (index, layero) {
            var param = {
              userId: userId,
              operate: "yes",
              leaveId: $this.attr('data-id'),
              realityStartTime: $(layero).find('#realityStartTime').attr('data-beginTime'),
              realityEndTime: $(layero).find('#realityEndTime').attr('data-endTime')
            }
            if (lock) {
              lock = false
              reqAjaxAsync(REQUEST_URL.COMPLETE, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  layer.msg(res.msg);
                  setTimeout(function () {
                    location.reload(true);
                  }, 500)
                } else {
                  layer.msg(res.msg);
                  lock = true
                }
              })
            }
          }
        })
      }
    } else {
      layer.msg(res.msg);
    }
  })

  //已办结详情,详情按钮弹窗
  $('#approval .item-list').on('click',
    '.item[data-dealwithtype=havedo] .item-info,' +
    '.item[data-dealWithType=havedo] button',
    function () {
      var $this = $(this).parents('.item');
      layer.open({
        title: ['审批详情', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
        type: 1,
        skin: 'layer-ext-myskin',
        content: $('#details-1'),
        area: ['700px', '730px'],
        closeBtn: 1,
        scrollbar: false,
        resize: false,
        move: false,
        end: function () {
          $('#details-1').hide();
        },
        success: function (layero, index) {
          var param = {
            leaveId: $this.attr('data-id')
          }
          var res1 = reqAjax(REQUEST_URL.DETAILSCLEAVE, JSON.stringify(param));
          var res2 = reqAjax(REQUEST_URL.QUERYSCLEAVEPROCESSLIST, JSON.stringify(param));
          init2(res1, layero);//审批详情
          init3(res2, layero);//审批记录
        }
      })
    })

  //删除草稿按钮
  $('#approval .item-list').on('click', '.item .delete', function () {
    var id = $(this).parents('.item').attr('data-id');
    var param = {
      id: id
    }
    layer.confirm('确定要删除此审批吗?', {title: '提示'}, function (index) {
      if (lock) {
        lock = false
        reqAjaxAsync(REQUEST_URL.DELETESCLEAVE, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            layer.msg(res.msg);
            setTimeout(function () {
              $('#approval .title li:eq(0)').click();
              lock = true;
            }, 500)
          } else {
            layer.msg(res.msg);
            lock = true
          }
        })
      }
    })
  })

  //查看流程图
  $('#process-img').on('click', function () {
    layer.open({
      title: ['流程图', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-4'),
      area: ['800px', '400px'],
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-4').hide();
      },
      success: function (layero, index) {
        var procDefId = $('#details-2 .layui-form-item:eq(5) select').find('option:selected').attr('data-procDefId');
        var param = {
          procDefId: procDefId
        }
        var res = reqAjax(REQUEST_URL.VIEWPROCESSCHAT, JSON.stringify(param));
        if (res.code == 1) {
          $(layero).find('img').attr('src', 'data:image/png;base64,' + res.data);
        } else {
          layer.msg(res.msg);
        }
      }
    })
  })

  //计算时间差值
  function DateMinus(beginTime, endTime) {
    var beginTime = new Date(beginTime.replace(/-/g, "/"));
    var endTime = new Date(endTime.replace(/-/g, "/"));
    var days = endTime.getTime() - beginTime.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day + 1
  }
})
(jQuery)