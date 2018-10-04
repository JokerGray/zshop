(function ($) {

  var RESULT_URL = {
    SUBMITPROVAL: "leave/submitLeave",//发起审批
    TOPROVAL: 'leave/selectTodoTaskPage',//分页查询待审批
    PROVALDONE: 'leave/selectDealWithPage',//分页查询已办理请假任务
    NEXTPROVAL: "leave/forward",//下一个审批人
    ORGNATION: "processSet/initOrgByUserId",//查询组织机构
    QUERYUSERLISTBYORGID: 'processSet/queryUserListByOrgId',//根据节点id分页条件查询用户
    HASPROVALED: "leave/selectScLeavePage",//我提交的请假单
    REJECT: "leave/approve",//(/同意/拒绝/撤销) 请假单申请
    FILING: "leave/transferArchive",//提交归档
    DETAILS: "leave/detailScLeave",//请假单详情
    RECORDING: "leave/queryScLeaveProcessList",//查看请假单审批记录
    ROLE: "leave/selectUserTypeById",//查看角色
  }
  var page = 1;
  var rows = 4;
  var userId = getUrlParams('userId') || 10483;
  var layer = layui.layer;
  var laypage = layui.laypage;
  var laydate = layui.laydate;
  layer.config({
    extend: 'myskin/style.css'
  });

  layui.use('form', function () {
    form = layui.form;
  })

  // 页面初始化
  function initial() {
    $(".head li:eq(0)").click();
    initUpload({
      //附件上传
      btn: 'File',
      flag: 'word',
      type: '2',
    });
    initUpload({
      //图片上传
      btn: 'fakeBtn',
      flag: 'image',
      type: '3',
    })
  }

  //页面初始化&&绑定附件上传
  $(function () {
    initial()
    $("#Pic").click(function () {
      //判断图片数量大于3不能点击
      var len = $("#iptPic").find("div.parentPic").length;
      if (len == 3) {
        $("#Pic").css("cursor", "not-allowed")
        return layer.msg("只能上传3张图片");
      } else {
        $("#Pic").css("cursor", "pointer")
      }
      $("#fakeBtn").click()
    })
  })

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

  //我提交的
  $(".head li:eq(0)").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    $(".title").css("visibility", "hidden")
    getUl(RESULT_URL.HASPROVALED)
  })

  //我审批的
  $(".head li:eq(1)").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    $(".title").css("visibility", "visible")
    $(".hasTo").click()
  })
  //待审批
  $(".hasTo").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    getUl(RESULT_URL.TOPROVAL)
  })
  //已审批
  $(".hasProvaled").click(function () {

    $(this).addClass("active").siblings().removeClass("active");

    getUl(RESULT_URL.PROVALDONE)
  })

  //发起审批
  $(".toProval").click(function () {
    layer.open({
      title: ['发起审批', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details-2'),
      area: '600px',
      btn: ['发布'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $('#details-2').hide();
        $('#details-2 form')[0].reset();//表单初始化

        $(".levelType span").each(function () {
          $(this).removeClass("active")
          $(this).css("border", "1px solid gainsboro")
        })
        $(".levelType span:eq(0)").addClass("active")

        $(".havePerson").hide();
        $(".addPerson").show();

        $(".parentPic").each(function () {
          $(this).remove();
        })

        $("#iptPic").css("height", "38px").html("");
        $('#details-2 .fileShow').remove();
        $("#iptFile").html("").attr("data-fileurl", "");

      },
      success: function (layero, index) {
        //选择时间
        $(layero).find("#chooseTime").click(function () {
          laydate.render({
            elem: '#chooseTime',
            show: true,
            min: 0,
            calendar: true,
            type: 'datetime',
            format: 'yyyy-MM-dd',
            btns: ['confirm'],
            range: '至',
            done: function (value, date, endDate) {
              var arr = value.split(' 至 ');
              console.log(endDate);
              //计算时间差
              var start = arr[0];
              var end = arr[1];
              var endTime = end.split(' ');
              var endtimes = endTime[1];
              var endDate = endTime[0];
              var value2;
              var value4 = '';

              $("#chooseTime").attr("data-start", start);
              $("#chooseTime").attr("data-end", end);

              //结束时间日期
              value2 = endDate + " 23:59:59";
              value4 += start + " 至 " + value2;
              //时间差
              var days = new Date(start).getTime() - new Date(end).getTime();
              //结束时间默认为23:59:59
              if (endtimes == "00:00:00") {
                setTimeout(function () {
                  $('#chooseTime').val(value4);
                  $("#chooseTime").attr("data-start", start);
                  $("#chooseTime").attr("data-end", value2);
                }, 100)
                console.log(value2);

              }
              //判断天数是否相当或者超出范围
              if (days == 0) {
                setTimeout(function () {
                  $('#chooseTime').val('');
                  $("#chooseTime").attr("data-start", "");
                  $("#chooseTime").attr("data-end","")
                }, 100)
                return layer.msg("起始时间与结束时间相等，请重新选择");
              } else if (days > 0) {
                setTimeout(function () {
                  $('#chooseTime').val('');
                  $("#chooseTime").attr("data-start", "");
                  $("#chooseTime").attr("data-end","")
                }, 100)
                return layer.msg("起始时间超过结束时间，请重新选择");
              }
            }
          });
        })

        //选择优先级
        $(".levelType").on("click", ".level-item", function () {
          $(this).addClass("active").css("border", "1px solid transparent")
            .siblings().removeClass("active").css("border", "1px solid gainsboro")
        })

        //是否发邮件
        form.on('checkbox(email)', function (data) {
          var datas = data.elem.checked;
          if (datas == true) {
            $("#details-2 .email").attr("data-value", '1')
          } else {
            $("#details-2 .email").attr("data-value", '0')
          }
        });

      },
      yes: function (index, layero) {
        var arrPic = [];
        // 图片地址
        $(layero).find('.parentPic img').each(function () {
          arrPic.push($(this).attr('src'))
        })
        var param = {
          startTime: $("#chooseTime").attr("data-start"),
          reason: $(layero).find('.reason').val(),
          // leaveTime: $("#chooseTime").attr("data-days"),
          leaveTime: 0,
          endTime: $("#chooseTime").attr("data-end"),
          priorityLevel: $(layero).find('.levelType .active').attr("data-priorityLevel"),
          leaveType: $(layero).find('.layui-form-item:eq(1) select').val(),
          userId: userId,
          nextApprover: $(layero).find('.havePerson span').attr("data-id"),
          picUrl: arrPic,
          attachment: $(layero).find('#iptFile').attr("data-fileurl"),
          attachmentName: $(layero).find('.fileShow .name').text(),
          isEmailNotify: $("#details-2 .email").attr("data-value")
        }
        //发起审批
        reqAjaxAsync(RESULT_URL.SUBMITPROVAL, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            layer.msg(res.msg);
            layer.close(index);
            initial()
          } else {
            layer.msg(res.msg);
          }
        })
      }
    })

  });

  //删除图片
  $('#iptPic').on("click", ".toDelPic", function () {
    var dom = $(this);
    dom.parent(".parentPic").remove();
    var len = $(".parentPic").length;
    len--;
    if (len < 0) {
      $('#iptPic').css("height", "38px");
    } else if (len < 3) {
      $("#Pic").css("cursor", "pointer")
    }
  });

  //删除附件

  $("#iptFile").on("click", ".delFile", function () {
    $(this).parents(".fileShow").hide();

  })

  //选择审批人
  $(".addPerson").click(function () {
    layer.open({
      type: 1,
      title: '选择审批人',
      skin: 'layer-ext-myskin',
      content: $('#details-3'),
      area: ['850px', '630px'],
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      shade: 0,
      zIndex: layer.zIndex, //重点1
      end: function () {
        $('#details-3').hide();
        $('#details-3 input').val('');
        $('#details-3 tbody').html('');
        $('#details-3 table').attr('data-archivePeople', '').attr("data-name", "");

      },

      success: function (layero) {

        var param = {

          userId: userId
        }
        reqAjaxAsync(RESULT_URL.ORGNATION, JSON.stringify(param)).done(function (res) {

          if (res.code == 1) {
            // var treeObj = $.fn.zTree.init($("#treeDemo1"), setting, res.data);

            //默认选择根节点并点击
            var treeObj = $.fn.zTree.init($("#treeDemo1"), setting, res.data);
            var node = treeObj.getNodeByParam("pid", 0);
            treeObj.expandNode(node, true, false, true);
            treeObj.selectNode(node);
            treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件

          } else {
            layer.msg(res.msg);
          }
        })

        //选择审批人
        $('#details-3 table').on('click', '.btn-info', function () {
          $(this).css('backgroundColor', '#f1a83f').html('审批人')
            .parents('tr').siblings().find('span').html('选择')
            .css('backgroundColor', '#2FC4B5');
          var archivePeople = $(this).parents('tr').attr('data-id');
          var acheiveName = $(this).parents('tr').attr('data-name');
          $(this).parents('table').attr('data-archivePeople', archivePeople);
          $(this).parents('table').attr('data-name', acheiveName);

        })

        layer.setTop(layero); //重点2
      },
      yes: function (index, layero) {
        var id = $(layero).find(".table1").attr("data-archivePeople");
        // console.log(id)
        var name = $(layero).find(".table1").attr('data-name');
        if (!isNull(id)) {

          $(".havePerson").show();
          $(".addPerson").hide();
          $(".theHavePerson").html(name)
            .attr("data-id", id);
          layer.close(index);
        }

      }
    });
  });

  //删除审批人
  $('.delHavePerson').click(function () {
    layer.open({
      type: 1,
      title: "提示",
      content: "<div style='padding: 10px'>确定删除已选择的审批人吗?</div>",
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      yes: function (index, layero) {
        $('.havePerson span').html("").attr("data-id", '');
        $('.havePerson').hide();

        $(".addPerson").show();
        layer.close(index);
      }

    })

  })

  //点击查询按钮
  $('#details-3 .searchBtn').on('click', function () {
    getList();
  })

  //详情弹出框
  $(".centre").on("click", ".btnDetails", function () {

    var id = $(this).attr("data-id");
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
      resize: false,
      move: false,
      end: function () {
        $('#details-1').hide();

      },

      success: function (layero, index) {

        //审批详情
        var param = {
          leaveId: id
        }
        reqAjaxAsync(RESULT_URL.DETAILS, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            getToptable(res)
          }else{
            layer.msg(res.msg);
          }
        })

        //审批记录
        reqAjaxAsync(RESULT_URL.RECORDING, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            getButtontable(res)
          }else{
            layer.msg(res.msg);
          }
        })

        //查看身份
        var pa = {
          userId: userId,
          "leaveId": id
        }
        reqAjaxAsync(RESULT_URL.ROLE, JSON.stringify(pa)).done(function (res) {
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
              $(layero).find(".layui-layer-btn5").hide();
              //发起人和创建人
            } else if (data == 6) {
              $(layero).find(".layui-layer-btn3").hide();
              $(layero).find(".layui-layer-btn4").hide();

              //发起人和归档人
            } else if (data == 5) {
              $(layero).find(".layui-layer-btn3").hide();
              $(layero).find(".layui-layer-btn1").hide();

            }
          }else{
            layer.msg(res.msg)
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

            $(".head li:eq(1)").click();

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
            reqAjaxAsync(RESULT_URL.FILING, JSON.stringify(parem)).done(function (res) {
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
          area: ['780px', '600px'],
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
            $('#details-3 .remark').val("");
            $('#details-3 tbody').html('');
            $('#details-3 table').attr('data-archivePeople', '').attr("data-name", "");
          },

          success: function (layero) {
            $('.remark').show();
            $(".toEmail").show();
            var param = {
              userId: userId
            }
            reqAjaxAsync(RESULT_URL.ORGNATION, JSON.stringify(param)).done(function (res) {

              if (res.code == 1) {
                //默认选择根节点并点击
                var treeObj = $.fn.zTree.init($("#treeDemo1"), setting, res.data);
                var node = treeObj.getNodeByParam("pid", 0);
                treeObj.expandNode(node, true, false, true);
                treeObj.selectNode(node);
                treeObj.setting.callback.onClick(null, treeObj.setting.treeId, node);//调用事件


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
            reqAjaxAsync(RESULT_URL.NEXTPROVAL, JSON.stringify(param)).done(function (res) {
              if (res.code == 1) {
                layer.msg(res.msg);
                layer.close(index);
                setTimeout('layer.close(' + indexs + ')', 2000)
                $(".head li:eq(1)").click();
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
          '<textarea placeholder="请输入拒绝理由/必填/限30字" maxlength="30" style="padding:5px;width: 300px;height: 150px;border: 1px solid gainsboro;"></textarea></div>',
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

            $(".head li:eq(1)").click();

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
          '<textarea placeholder="请输入同意理由/限30字" maxlength="30" style="padding:5px;width: 300px;height: 150px;border: 1px solid gainsboro;"></textarea></div>',
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

            $(".head li:eq(1)").click();

          }

        });
        return false
      },

    });

  });

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

  //获取时间
  function getTime(value) {
    var arr = value.split(' ');
    //计算时间差
    var start = arr[0];
    return start;
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

    $(".topPrat").html(html);

  }

  //渲染页面
  function getContent(res) {
    if (res.code == 1) {
      var data = res.data;
      var html = '';
      $.each(data, function (i, v) {
        html += '<ul class="detailBox" >\n' +
          '       <li class="leftIMG">\n' +
          '        <img class="firstImg" src="../images/icon-13.png" alt="">\n' +
          '      <span></span>' +
          '        <img class="secondImg" src="../images/icon-' + v.approvalStatus + '.png" alt="">\n' +
          '      </li>\n' +
          '      <li class="nameProval">\n' +
          '        <a >' + v.createByName + '</a>\n' +
          '        <b>' + v.createDate + ' 提交了</b>\n' +
          '      </li>\n' +
          '      <li>\n' +
          '        <a>请假申请：' + getTime(v.startTime) + ' 至 ' + getTime(v.endTime) + '</a>\n' +
          '      </li>\n' +
          '      <li class="lilevelType">' + levelType(v.priorityLevel) + '</li>' +
          '      <li class="litoProval">' + typeProval(v.approvalStatus) + '</li>\n' +
          '      <li class="lilastChild">\n' +
          '        <a class="btnDetails" data-id="' + v.id + '">查看详情</a>\n' +
          '      </li>\n' +
          '    </ul>'
      })
      $(".centre").html(html);
    }

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
            '  <td>' + isPhone(data.phone) + '</td>' +
            '  <td>' +
            '  <span class="btn btn-info">选择</span>' +
            '  </td>' +
            '</tr>';
        }
        $('#details-3 table tbody').html(sHtml);
      } else {
        layer.msg(res.msg);
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
      rows: rows,
      userName: userName
    }
    reqAjaxAsync(RESULT_URL.QUERYUSERLISTBYORGID, JSON.stringify(param)).done(function (res) {
      init2(res);
      //分页
      laypage.render({
        elem: 'paging-box-r',//容器
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
            id: id,
            page: obj.curr,
            rows: rows,
            userName: userName
          }
          if (!first) {
            reqAjaxAsync(RESULT_URL.QUERYUSERLISTBYORGID, JSON.stringify(param)).done(function (res) {
              init2(res);
            })

          }
        }
      });
    })
  }

  //计算时间差值
  function DateMinus(beginTime, endTime) {
    var beginTime = new Date(beginTime.replace(/-/g, "/"));
    var endTime = new Date(endTime.replace(/-/g, "/"));
    var days = endTime.getTime() - beginTime.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    return day
  }

  //提交状态

  function typeProval(d) {
    var html = ""
    if (d == 1) {
      html = "已提交"
    } else if (d == 2) {
      html = "审批中"
    } else if (d == 3) {
      html = "审批通过"
    } else if (d == 4) {
      html = "已撤销"
    } else if (d == 5) {
      html = "审批拒绝"
    }
    return html
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
        // '         <td>' + recordTyep(v.operateType) + '</td>\n' +
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
        html += '<img class="real" src=' + v + '> '
        html += ' '
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
      html = '<div data-url="' + u + '" class="tofileShow"><img src="../images/z.png" ><a class="name">' + name + '</a><a href="' + u + '" class=" delFile layui-icon" download="'+name+'">&#xe601;</a></div>'
    }

    return html

  }

  //分页方法

  function getPage(res, url) {
    laypage.render({
      elem: 'pageNo',//容器
      groups: "2",
      count: res.total,//总数
      limit: 6,//每页条数
      curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
        var page = location.search.match(/page=(\d+)/);
        return page ? page[1] : 1;
      }(),
      layout: ['prev', 'page', 'next', 'skip'],//功能
      jump: function (obj, first) {
        var param = {
          page: obj.curr,
          rows: 6,
          userId: userId
        }
        if (!first) {
          reqAjaxAsync(url, JSON.stringify(param)).done(function (res) {
            getContent(res)
          })

        }
      }
    });
  }

  //获取每个申请列表

  function getUl(url) {
    var param = {
      page: page,
      rows: 6,
      userId: userId
    }
    reqAjaxAsync(url, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        getContent(res)

        getPage(res, url)
      }
    })
  }

  //撤销，拒绝，同意请假单

  function reject(indexs, index, o, l, opinion) {
    var parem = {
      operateType: o,//类型
      leaveId: l,//请假单id
      userId: userId,
      opinion: opinion//意见

    }
    reqAjaxAsync(RESULT_URL.REJECT, JSON.stringify(parem)).done(function (res) {

      if (res.code == 1) {
        layer.msg(res.msg);
        layer.close(index);
        setTimeout('layer.close(' + indexs + ')', 2000)
        $(".head li:eq(0)").click();

      }else{
        layer.msg(res.msg);
      }
    })
  }

  function isPhone(val) {
    if (val == null || val == "null" || val == undefined || val == "") {
      return '暂无号码';
    }
    return val;
  }

})
(jQuery)