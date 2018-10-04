(function ($) {
  var REQUEST_URL = {
    TODOLIST: 'oa/getScUpcomingList',//查询待办事项
    HASREAD: 'oa/readScUpcomingById', //标记为已读
    TODOCOUNT: 'oa/getNoReadCount',//未读数量总数

    GETSCNOTIFYBYID: 'oa/getScNotifyById',//查询公告详情
    DELETESCNOTIFYBYID: 'oa/deleteScNotifyById',//删除公告

    COMPLETE: 'scNotes/complateScNotes',//点击完成任务
    DETAIL: 'scNotes/selectScNotesById',//查看任务详情

    NEXTPROVAL: "leave/forward",//下一个审批人
    ORGNATION: "processSet/initOrgByUserId",//查询组织机构
    QUERYUSERLISTBYORGID: 'processSet/queryUserListByOrgId',//根据节点id分页条件查询用户
    REJECT: "leave/approve",//(/同意/拒绝/撤销) 请假单申请
    FILING: "leave/transferArchive",//提交归档
    DETAILS: "leave/detailScLeave",//请假单详情
    RECORDING: "leave/queryScLeaveProcessList",//查看请假单审批记录
    ROLE: "leave/selectUserTypeById",//查看角色
  };
  var page = 1;
  var rows = 6;
  var userId = getUrlParams("userId") || 10483;
  var layer = layui.layer;
  var laypage = layui.laypage;


  layer.config({
    extend: 'myskin/style.css'
  });

  layui.use('form', function () {
    form = layui.form;
  })

  //页面初始化
  $(function () {
    $('.title li:eq(0)').click();
  });
  //tabs页切换
  $('.title li').on('click', function () {
    var index = $(this).index();

    if (index == 0) {

      getlist(index, 1);
//被点击的选项添加active以便下面判读
      $('.title li:first-child').addClass("active").siblings().removeClass("active");

      //审批
    } else if (index == 1) {
      getlist(index, 1)

      $('.title li:nth-child(2)').addClass("active").siblings().removeClass("active");

      //公告
    } else if (index == 2) {
      getlist(index, 1)
      $('.title li:nth-child(3)').addClass("active").siblings().removeClass("active");


      //任务
    } else if (index == 3) {
      getlist(index, 1)

      $('.title li:nth-child(4)').addClass("active").siblings().removeClass("active");

    }
  });

  //列表查询及分页
  function getlist(index, status) {
    var param = {
      "status": status,
      "pageNo": page,
      "pageSize": rows,
      "workeUserId": userId,
      "fromModule": index
    }

    reqAjaxAsync(REQUEST_URL.TODOLIST, JSON.stringify(param)).done(function (res) {

      initial(res);
      laypage.render({
        elem: 'paging-box-show',//容器
        count: res.total,//总数
        groups: '2',
        limit: rows,//每页条数
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            "status": "",
            "pageNo": obj.curr,
            "pageSize": rows,
            "workeUserId": userId,
            "fromModule": index
          }
          if (!first) {
            reqAjaxAsync(REQUEST_URL.TODOLIST, JSON.stringify(param)).done(function (res) {
              initial(res);

            })

          }
        }
      });
    })
  }

//工作台列表渲染
  function initial(res) {

    if (res.code == 1) {

      $(".centercontent  ul").html("");
      var data = res.data.rows;

      var html = '';
      $.each(data, function (i, v) {
        html += '<li class="todolist" data-status="' + v.status + '" data-type="' + v.fromModule + '"  value="' + v.id + '" name="' + v.isread + '" data-workId="' + v.workId + '">' +
          '<span class="unRead"></span>' +
          '<a class="createname">' + v.applyUserName + '</a>' +
          '<i class="datatitle" data-title="' + v.operationType + '">' + v.workName + '</i>' +
          '<em class="em  level-' + v.workPriority + '">' + getpriority(v.workPriority) + '</em>' +
          ' <b data-timePrompt="' + timePrompt(v.endTime) + '" >' + v.createTime + '</b>' +
          ' <p class="workcontent" >' + getSimpleText(v.workContent) + '</p>' +
          ' <p class="endtime" ><i class="layui-icon" >&#xe60e;</i>  ' + v.endTime + '</p>' +
          '</li>'
      });
      $(".centercontent  ul").html(html);

      //拼接审批内容

      $(".boxlist .todolist").each(function () {
        // var daycount = $(".workcontent").html();
        var dom = $(this);
        //截取内容长度
        var text = dom.find(".workcontent").text();
        if (text.length > 70) {


          text = text.substring(0, 40);
          text = text + "...."
        }
        dom.find(".workcontent").html(text);

        //判断类型
        var dataType = dom.attr("data-type")
        if (dataType == 1) {
          var daycount = dom.find(".workcontent").html();
          var datatitle = dom.find(".datatitle").attr("data-title");

          var move = "";
          //审批显示
          if (datatitle == 1) {
            move = "提交"
          } else if (datatitle == 2) {
            move = "同意"
          } else if (datatitle == 3) {
            move = "驳回"
          } else if (datatitle == 4) {
            move = "撤销"
          } else {
            move = " "
          }
          dom.find(".workcontent").html("请假申请");
          // dom.find(".workcontent").html("请假申请：" + daycount + "天");
          dom.find(".datatitle").html(move + "审批申请")
          //公告显示
        }else if(dataType==2){
          dom.find("em").hide();
          dom.find(".datatitle").html("发布了公告")
        }//任务加时间提示
        else if (dataType == 3) {
          //显示截至时间隐藏创建时间
          dom.find(".endtime").show();
          dom.find("b").hide();
          //名字隐藏
          dom.find(".createname").hide();
          //截至时间小于1天加提示
          var timePrompt = dom.find("b").attr("data-timePrompt");
          var isDone = dom.attr("data-status");

          if (timePrompt < 1 && timePrompt > 0) {
            dom.find(".endtime").css("color", "#ff5715");
            dom.find(".endtime i").css("color", "#ff5715")
          }
          if (isDone == 2) {
            dom.find(".endtime").css("color", "#818181");
            dom.find(".endtime i").css("color", "#818181")
          }
        }
      })
    } else {
      layer.msg(res.msg);
    }


    //列表显示未读提示
    $('li.todolist').each(function () {
      var dom = $(this);
      if (dom.attr("name") == 1) {
        dom.children("span").addClass("layui-badge-dot").css("margin-right", "5px");
        dom.children(".workcontent").css("font-weight", "600");
      }
    });

    //tab栏未读提示
    tabUnread()
  }

  //tab栏未读提示

  function tabUnread() {

    var params = {
      "workeUserId": userId
    }
    reqAjaxAsync(REQUEST_URL.TODOCOUNT, JSON.stringify(params)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        // console.log(data);
        var noReadNotifycount = data.noReadNotifycount;//通告未读
        var noReadNotescount = data.noReadNotescount;//任务
        var todocount = data.allNoReadcount;//所有
        var noReadLeavecount = data.noReadLeavecount;//审批
        //全部
        if (todocount > 0) {
          $(".unread").html(todocount).addClass("layui-badge");
        } else {
          $(".unread").removeClass("layui-badge").html("")
        }
        //审批
        if (noReadLeavecount > 0) {
          $(".checkproval>span").addClass("layui-badge-dot")
        } else {
          $(".checkproval>span").removeClass("layui-badge-dot")
        }
        //任务
        if (noReadNotescount > 0) {
          $(".checktesk>span").addClass("layui-badge-dot")
        } else {
          $(".checktesk>span").removeClass("layui-badge-dot")
        }
        //通告
        if (noReadNotifycount > 0) {
          $(".checkannounce>span").addClass("layui-badge-dot")
        } else {
          $(".checkannounce>span").removeClass("layui-badge-dot")
        }
      }

    })
  }

  //未读事件绑定事件
  $(".boxlist").on('click', ' li[name=1]', function () {

    var dom = $(this);
    var id = dom.val();
    var type = dom.attr("data-type");
    var param = {
      id: id,
      fromModule: type,
      userId: userId
    }
    reqAjaxAsync(REQUEST_URL.HASREAD, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        dom.children("span").removeClass("layui-badge-dot").css("margin-right", "0");
        dom.children(".workcontent").css("font-weight", "normal");
      }
    })
    //tab栏未读提示
    tabUnread()
  });

  //等级处理
  function getpriority(e) {
    var name = ''
    if (e == 1) {
      name = "普通"
    } else if (e == 2) {
      name = "紧急"
    } else if (e == 3) {
      name = "非常紧急"
    }
    return name
  }

  //任务详情
  $('.boxlist').on('click', '.todolist[data-type=3]', function () {

    var id = $(this).attr("data-workid");
    var iscomplete = $(this).attr("data-status");

    layer.open({
      title: ["任务详情", 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#detail-2'),
      area: '700px',
      closeBtn: 1,
      offset: '50px',
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $("#detail-2").hide();

      },
      success: function (layero, index) {
        $("#detail-2").show();
        var param = {
          "scNotesId": id
        }
        // console.log(index);
        reqAjaxAsync(REQUEST_URL.DETAIL, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            var v = res.data;
            var html = '';
            html += '<img class="taskdone" src="../images/taskdone.png" alt="">' +
              '<div class="toConfirm">' +
              '    <span>点击确认任务已完成</span>' +
              '  </div>' +
              '  <div class="title">'+theTitle(v)+' </div>' +
              '  <p>' +
              '    <span class="level-' + v.leave + '">' + getpriority(v.leave) + '</span>' +
              '  </p>' +
              '  <div class="content">' + v.content + '' +
              '    <div class="footer">' +
              '      <span>创建于 ' + v.createtime + '</span>' +
              '    </div>' +
              '  </div>'


            $("#detail-2").html(html);

            if (iscomplete == 1) {
              //点击确认任务
              $(".toConfirm").one("click", function () {
                $(this).css("background", "url(../images/hasdone.png) no-repeat");
                $(this).siblings(".taskdone").show();
                var param = {
                  "scNotesId": id
                }
                reqAjaxAsync(REQUEST_URL.COMPLETE, JSON.stringify(param))
                  .done(function (res) {
                    if (res.code == 1) {
                      $(layero).find(".toConfirm span").html("任务已确认完成");
                      layer.msg(res.msg);
                      //任务初始化
                      $('.title li:eq(3)').click();
                    }

                  })
              })
            } else if (iscomplete == 2) {
              $(layero).find(".toConfirm").css("background", "url(../images/hasdone.png) no-repeat");
              $(layero).find(".toConfirm span").html("任务已确认完成")
              $(layero).find(".taskdone").show();
            }
          }
        })

      },
    })
  })

  //公告详情
  $('.boxlist').on('click', '.todolist[data-type=2]', function () {
    var id = $(this).attr('data-workid');
    var param = {
      id: id,
      userId: userId
    }
    reqAjaxAsync(REQUEST_URL.GETSCNOTIFYBYID, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        layer.open({
          title: ['公告详情', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
          type: 1,
          skin: 'layer-ext-myskin',
          content: $('#detail-3'),
          area: '700px',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          offset:"50px",
          end: function () {
            $('#detail-3').hide();
            $('#detail-3 .annex-content').hide();
          },
          success: function (layero, index) {
            $(layero).find('#detail-3').attr('data-id', data.scNotify.id);
            $(layero).find('.subtitle').html(data.scNotify.title);
            $(layero).find('.end-date').html('公示期至 ' + data.scNotify.noticeDate);
            $(layero).find('.name').html(data.scNotify.createUserName);
            $(layero).find('.content').html(data.scNotify.content);
            if (data.scNotify.fileUrl) {
              $(layero).find('.annex-content').show().html(
                '<i class="wps"></i>' +
                '<p class="txt">' + data.scNotify.fileName + '</p>' +
                '<em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</em>' +
                '<a class="download" href="' + data.scNotify.fileUrl + '" download="' + data.scNotify.fileName + '">下载</a>');
            }
            $(layero).find('.start-date').html(data.scNotify.createDate);
            $(layero).find('.range').html('可见范围：' + data.visibleRange);
            $('.title li:eq(0)').click();
          }
        })
      }

    })
  })

  //审批详情
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

  function onClick(event, treeId, treeNode) {
    $('#details-3').find('.toChoose').val("");
    $('#details-3').find('table').attr('data-archivePeople', '');
    $('#details-3 .left-nav').attr('data-id', treeNode.id);
    /*$('#ztreeValue').val(treeNode.text);*/
    getList();
  };

  //弹出审批详情框
  $('.boxlist').on('click', '.todolist[data-type=1]', function () {

    var id = $(this).attr("data-workId");
    layer.open({
      type: 1,
      title: "审批详情",
      skin: 'layer-ext-myskin',
      content: $('#details-1'),
      area: '600px',
      btn: ['撤销', '提交归档', '转交', '拒绝', '同意'],
      btnAlign: 'r',
      closeBtn: 1,
      offset: '5px',
      scrollbar: false,
      move: false,
      end: function () {
        $('#details-1').hide();

      },

      success: function (layero, index) {
        //审批详情
        var param = {
          leaveId: id
        }
        reqAjaxAsync(REQUEST_URL.DETAILS, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            getToptable(res)
          }else{
            layer.msg(res.msg)
          }
        })
        //审批记录
        reqAjaxAsync(REQUEST_URL.RECORDING, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            getButtontable(res)
          }else{
            layer.msg(res.msg)
          }
        })

        //查看身份
        var pa = {
          userId: userId,
          leaveId: id
        }
        reqAjaxAsync(REQUEST_URL.ROLE, JSON.stringify(pa)).done(function (res) {

          if (res.code == 1) {
            var data = res.data;

            //只能撤销
            if (data == 1) {
              $(layero).find(".layui-layer-btn1").hide();
              $(layero).find(".layui-layer-btn2").hide();
              $(layero).find(".layui-layer-btn3").hide();
              $(layero).find(".layui-layer-btn4").hide();

              //只能查看
            } else if (data == 2) {
              $(layero).find(".layui-layer-btn0").hide();
              $(layero).find(".layui-layer-btn1").hide();
              $(layero).find(".layui-layer-btn2").hide();
              $(layero).find(".layui-layer-btn3").hide();
              $(layero).find(".layui-layer-btn4").hide();

              //归档人
            } else if (data == 3) {
              $(layero).find(".layui-layer-btn0").hide();
              $(layero).find(".layui-layer-btn1").hide();

              //审批人
            } else if (data == 4) {
              $(layero).find(".layui-layer-btn0").hide();
              $(layero).find(".layui-layer-btn4").hide();

              //发起人和创建人
            }else if(data==6){
              $(layero).find(".layui-layer-btn3").hide();
              $(layero).find(".layui-layer-btn4").hide();

              //发起人和归档人
            }else if(data==5){
              $(layero).find(".layui-layer-btn3").hide();
              $(layero).find(".layui-layer-btn1").hide();

            }
          }
        })
      },
      //撤销
      yes: function (indexs, layero) {
        layer.open({
          type: 1,
          title: "提示",
          content: '<div style="padding:20px;">确定要撤销此审批吗？</div>',
          // area: ['200px', '200px'],
          btn: ['确定', '取消'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          zIndex: layer.zIndex, //重点1
          yes: function (index, layero) {
            reject(indexs, index, "revocation", id)
            $('.title li:eq(0)').click();

          }
        })
      },
      //提交归档人
      btn2: function (indexs, layero) {
        layer.open({
          type: 1,
          title: "提示",
          content: '<p style="padding: 20px;">是否提交给归档人？</p>',
          area: ['200px', '170px'],
          btn: ['确定', '取消'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          zIndex: layer.zIndex, //重点1
          yes: function (index, layero) {
            var parem = {
              userId: userId,
              leaveId: id
            }
            reqAjaxAsync(REQUEST_URL.FILING, JSON.stringify(parem)).done(function (res) {
              if (res.code == 1) {

                layer.close(index);
                layer.close(indexs);
                layer.msg(res.msg)
                $(".head li:eq(1)").click();
              }else{
                layer.close(index);
                // layer.close(indexs);
                layer.msg(res.msg)
              }
            })
          }

        })
        return false
      },
      //转交
      btn3: function (indexs, layero) {
        layer.open({
          type: 1,
          title: "转交",
          skin: 'layer-ext-myskin',
          content: $('#details-3'),
          area: ['850px', '630px'],
          btn: ['确定', '取消'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          shade: 0,//不显示遮
          zIndex: layer.zIndex, //重点1
          end: function () {
            $('#details-3').hide();
            $('#details-3 input').val('');
            $('#details-3 tbody').html('');
            $('#details-3 .remark').val("");
            $('#details-3 table').attr('data-archivePeople', '').attr("data-name", "");
          },
          success: function (layero) {
            var param = {
              userId: userId
            }
            reqAjaxAsync(REQUEST_URL.ORGNATION, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                //默认选择根节点并点击
                var treeObj = $.fn.zTree.init($("#treeDemo1"), setting, res.data);
                var node = treeObj.getNodeByParam("pid", 0);
                treeObj.expandNode(node, true, false, true);
                treeObj.selectNode(node);
                treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件
                $('.remark').show();
                $(".toEmail").show();
              } else {
                layer.msg(res.msg);
              }
            })
            //选择转交人
            $('#details-3 table').on('click', '.btn-info', function () {
              $(this).css('backgroundColor', '#f1a83f').html('转交人')
                .parents('tr').siblings().find('span')
                .css('backgroundColor', '#2FC4B5').html('选择');
              var archivePeople = $(this).parents('tr').attr('data-id');
              $(this).parents('table').attr('data-archivePeople', archivePeople);
            })
            //是否发邮件
            $(".emailBox").on("change", function () {
              var data = $('.emailBox:checked').length;
              if (data == 1) {
                $(".toEmail").attr("data-email", '1')
              } else if (data == 0) {
                $(".toEmail").attr("data-email", '0')
              }
            })

            layer.setTop(layero); //重点2
          },
          yes: function (index, layero) {
            var param = {
              userId: userId,
              leaveId: id,
              nextApprover: $(layero).find('table').attr('data-archivePeople'),
              opinion: $(layero).find('#details-3 .remark').val(),
              isEmailNotify: $(layero).find(".toEmail").attr("data-email")
            }
            reqAjaxAsync(REQUEST_URL.NEXTPROVAL, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                layer.msg(res.msg);
                layer.close(index);
                setTimeout('layer.close(' + indexs + ')', 2000)
                $('.title li:eq(0)').click();
              }
            })
          }
        });
        return false
      },
      //拒绝
      btn4: function (indexs, layero) {
        layer.open({
          type: 1,
          title: "提示",
          content: '<div style="padding:20px;"><p style="margin-bottom:10px;">确定要拒绝此审批吗？</p>' +
          '<textarea placeholder="请输入拒绝理由/必填" maxlength="70" style="padding:5px;width: 300px;height: 150px;border: 1px solid gainsboro;"></textarea></div>',
          area: ['352px', '340px'],
          btn: ['确定', '取消'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          zIndex: layer.zIndex, //重点1
          yes: function (index, layero) {
            var reason = $(layero).find("textarea").val();
            if (!reason) {
              return layer.msg("请输入拒绝理由（限30字）")
            }
            reject(indexs, index, "reject", id, reason)
            $('.title li:eq(0)').click();
          }
        });
        return false
      },
      //同意
      btn5: function (indexs, layero) {
        layer.open({
          type: 1,
          title: "提示",
          content: '<div style="padding:20px;"><p style="margin-bottom:10px;">确定要同意此审批吗？</p>' +
          '<textarea placeholder="请输入同意理由" maxlength="50" style="padding:5px;width: 300px;height: 150px;border: 1px solid gainsboro;"></textarea></div>',
          // area: ['352px', '340px'],
          btn: ['确定', '取消'],
          btnAlign: 'r',
          closeBtn: 1,
          scrollbar: false,
          resize: false,
          move: false,
          zIndex: layer.zIndex, //重点1
          yes: function (index, layero) {
            var reason = $(layero).find("textarea").val();
            reject(indexs, index, "agree", id, reason)
            $('.title li:eq(0)').click();
          }
        });
        return false
      },
    });
  })

  //查看大图

  $("#details-1").on("click",".real",function () {
    var src=$(this).attr("src");
    $(".motai").show();
    $(".motaiimg").attr("src",src);
  })

  //关闭按钮

  $("#details-1").on("click",".close",function () {
    $(this).parents(".motai").hide()

  })

  //点击查询按钮
  $('#details-3 .searchBtn').on('click', function () {
    getList();
  })

  //判断任务详情标题长度
  function theTitle(v) {
    var len = v.title.length;
    var html;
    if (len > 20) {
      html = '<b >' + v.title + '</b>' +
        '<div class="theme">' +
        '    <i class="icon-9"></i>' +
        '    <span>截止日期 ' + v.endtime + '</span>' +
        '</div>'
    }else {
      html=  '    <b class="theme">' + v.title + '</b>' +
        '    <i class="icon-9"></i>' +
        '    <span>截止日期 ' + v.endtime + '</span>'
    }

    return html

  }


  //获取详情表格
  function getToptable(res) {
    var v = res.data;
    var html = '';

    html += '<div class="divtitle">\n' +
      '    <b>请假审批</b>' + levelType(v.priorityLevel) + '' +
      '  </div>\n' +
      '  <div class="base-info">\n' +
      '    <p class="inform">\n' +
      '      <a>' + v.createByName + '</a>\n' +
      '      <span>' + v.createDate + '</span>\n' +
      '    </p>\n' +
      '    <table class="table table-border">\n' +
      '      <tr>\n' +
      '        <td>\n' +
      '          <span class="flag">*</span>审批类型\n' +
      '        </td>\n' +
      '        <td>请假审批</td>\n' +
      '      </tr>\n' +
      '      <tr>\n' +
      '        <td>\n' +
      '          <span class="flag">*</span>请假类型\n' +
      '        </td>\n' +
      '        <td>' + toleaveType(v.leaveType) + '</td>\n' +
      '      </tr>\n' +
      '      <tr>\n' +
      '        <td>\n' +
      '          <span class="flag">*</span>请假时间\n' +
      '        </td>\n' +
      '        <td>' + v.startTime + ' 至 ' + v.endTime + '</td>\n' +
      '      </tr>\n' +
      // '      <tr>\n' +
      // '        <td>\n' +
      // '          <span class="flag">*</span>请假天数\n' +
      // '        </td>\n' +
      // '        <td>' + v.leaveTime + '天</td>\n' +
      // '      </tr>\n' +
      '      <tr>\n' +
      '        <td>\n' +
      '          <span class="flag">*</span>审批模板\n' +
      '        </td>\n' +
      '        <td>经典模板</td>\n' +
      '      </tr>\n' +
      '      <tr>\n' +
      '        <td>\n' +
      '          <span class="flag">*</span>请假原因\n' +
      '        </td>\n' +
      '        <td> ' + v.reason + '</td>\n' +
      '      </tr>\n' +
      '      <tr >\n' +
      '        <td class="detailPic">\n' +
      '          图片\n' +
      '        </td>\n' +
      '        <td class=" picShow">' + getImg(v.picUrl) + '' +
      '<div class="motai" id="mo" >'+
      '  <span class="close" id="close">×</span>'+
      '  <img class="motaiimg" id="moimg" >'+
      '</div>'+

      '</td>\n' +
      '      </tr>\n' +
      '      <tr >\n' +
      '        <td class="detailFile">\n' +
      '          附件\n' +
      '        </td>\n' +
      '        <td class="fileShow">' + getFile(v.attachmentName, v.attachment) + '</td>\n' +
      '      </tr>\n' +
      '    </table>\n' +
      '  </div>'

    $("#details-1 .topPrat").html(html);

  }


  //员工列表渲染方法
  function init2(res) {
    $('#details-3 table tbody').html('');
    if (res.code == 1) {
      if (res.data) {
        var sHtml = '';
        for (var i = 0; i < res.data.length; i++) {
          var data = res.data[i];
          sHtml +=
            '<tr data-name="' + data.username + '" data-id="' + data.id + '">' +
            '  <td>' + data.usercode + '</td>' +
            '  <td>' + data.username + '</td>';
          if (data.sex == 1) {
            sHtml += '<td>女</td>';
          } else {
            sHtml += '<td>男</td>';
          }
          sHtml +=
            '  <td>' +isPhone(data.phone) + '</td>' +
            '  <td>' +
            '  <span class="btn btn-info">选择</span>' +
            '  </td>' +
            '</tr>';
        }
        $('#details-3 table tbody').html(sHtml);
      } else {
        console.log(res.msg);
      }
    } else {
      layer.msg(res.msg);
    }
  }

  //搜索员工查询方法
  function getList() {
    var id = $('#details-3 .left-nav').attr('data-id');
    var userName = $.trim($('#details-3 .toChoose').val());
    var param = {
      id: id,
      page: page,
      rows: 4,
      userName: userName
    }
    reqAjaxAsync(REQUEST_URL.QUERYUSERLISTBYORGID, JSON.stringify(param)).done(function (res) {
      init2(res);
      //分页
      laypage.render({
        elem: 'paging-box-r',//容器
        count: res.total,//总数
        limit: 4,//每页条数
        groups: '2',
        curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
        }(),
        layout: ['prev', 'page', 'next', 'skip'],//功能
        jump: function (obj, first) {
          var param = {
            id: id,
            page: obj.curr,
            rows:4,
            userName: userName
          }
          if (!first) {
            reqAjaxAsync(REQUEST_URL.QUERYUSERLISTBYORGID, JSON.stringify(param)).done(function (res) {
              init2(res);
            })

          }
        }
      });
    })


  }


  //等级匹配
  function levelType(d) {
    var a = "<span></span>"
    if (d == 1) {
      a = '<span class="level-' + d + '" >普通</span>'
    } else if (d == 2) {
      a = '<span class="level-' + d + '" >紧急</span>'
    } else if (d == 3) {
      a = '<span class="level-' + d + '" >非常紧急</span>'
    }
    return a
  }


  //审批记录操作类型
  function recordTyep(d) {
    var html = ''
    if (d == 1) {
      html = "发起申请"
    } else if (d == 2) {
      html = "审批中"
    } else if (d == 3) {
      html = "已同意"
    } else if (d == 4) {
      html = "已拒绝"
    } else if (d == 5) {
      html = "已转交"
    } else if (d == 6) {
      html = "已撤销"
    } else if (d == 7) {
      html = "已提交归档人"
    }
    return html;
  }


  //获取审批记录表格
  function getButtontable(res) {
    var data = res.data;
    var html = '';
    $.each(data, function (i, v) {
      html +=
        '       <tr>\n' +
        '         <td>' + v.sysBackUserName + '</td>\n' +
        '<td>' +
        '<p class="operateType">' + recordTyep(v.operateType) + '</p>' +
        '<p class="opinion">' + reason(v.opinion) + '</p>' +
        '</td>' +
        '         <td>' + v.approvalTime + '</td>\n' +
        '       </tr>\n'
    })
    $('.recording tbody').html(html);
  }


  //拒绝理由
  function reason(d) {
    var m = ''
    if (isNull(d)) {
      m = ""
    } else {
      m = d
    }
    return m
  }

  //请假类型

  function toleaveType(d) {

    var html = ''
    if (d == 1) {
      html = "事假"
    } else if (d == '2') {
      html = "病假"
    } else if (d == '3') {
      html = "调休"
    } else if (d == '4') {
      html = "婚假"
    } else if (d == '5') {
      html = "丧假"
    } else if (d == '6') {
      html = "工伤假"
    }
    return html
  }

  //详情获取图片
  function getImg(url) {

    var html = ''

    if (url == "[]") {
      html = "无"
    } else {

      url = JSON.parse(url);
      $.each(url, function (i, v) {

        html += '<img  class="real" src=' + v + '>'
      })
    }

    return html
  }

  //详情获取文件
  function getFile(name, u) {
    var html = ''
    if (isNull(u)) {
      html = "无"
    } else {

      html = '<div data-url="' + u + '" class="tofileShow"><img src="../images/z.png" ><a class="name">' + name + '</a><a href="' + u + '" class=" delFile layui-icon">&#xe601;</a></div>'
    }

    return html

  }

  //撤销，拒绝，同意请假单

  function reject(indexs, index, o, l, opinion) {
    var parem = {
      operateType: o,//类型
      leaveId: l,//请假单id
      userId: userId,
      opinion: opinion//意见

    }
    reqAjaxAsync(REQUEST_URL.REJECT, JSON.stringify(parem)).done(function (res) {
      layer.msg(res.msg);
      if (res.code == 1) {

        layer.close(index);


        setTimeout('layer.close(' + indexs + ')', 2000)
        $(".head li:eq(0)").click();

      }
    })
  }

  //优先级切换
  $('#details-2 .level-item').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
  })

  //计算时间差值
  function DateMinus(beginTime, endTime) {
    var beginTime = new Date(beginTime.replace(/-/g, "/"));
    var endTime = new Date(endTime.replace(/-/g, "/"));
    var days = endTime.getTime() - beginTime.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day + 1
  }

  function isPhone(val) {
    if (val == null || val == "null" || val == undefined || val == "") {
      return '暂无号码';
    }
    return val;
  }
})
(jQuery)