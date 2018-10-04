(function ($) {
  var REQUEST_URL = {
    DISPLAY: 'scNotes/selectScNotesPage',//分页展示我的任务
    COMPLETE: 'scNotes/complateScNotes',//点击完成任务
    DETAIL: 'scNotes/selectScNotesById',//查看任务详情
    PUBLISH: 'scNotes/saveScNotes',//发布任务
  };
  var pageNo = 1;
  var pageSize = 6;
  var userId = getUrlParams('userId') || 10005;
  var layer = layui.layer;
  var laydate = layui.laydate;
  var laypage = layui.laypage;

  layer.config({
    extend: 'myskin/style.css'
  });

  function intial() {
    //初始化加载
    var param = {
      "page": pageNo,
      "userId": userId,
      "rows": pageSize
    }
    reqAjaxAsync(REQUEST_URL.DISPLAY, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        getContent(data)
        //分页
        laypage.render({
          elem: 'paging-box-r',//容器
          count: res.total,//总数
          limit: pageSize,//每页条数
          curr: function () { //通过url获取当前页，也可以同上（pages）方式获取
            var page = location.search.match(/page=(\d+)/);
            return page ? page[1] : 1;
          }(),
          layout: ['prev', 'page', 'next', 'skip'],//功能
          jump: function (obj, first) {
            var param = {
              "page": obj.curr,
              "userId": userId,
              "rows": pageSize
            }
            if (!first) {
              reqAjaxAsync(REQUEST_URL.DISPLAY, JSON.stringify(param)).done(function (res) {
                if (res.code == 1) {
                  var data = res.data;
                  getContent(data);
                }
              })
            }
          }
        });
      }
    });
  }

  intial();
  //发布任务
  $(".title .btn").click(function () {
    layer.open({
      title: ['添加任务', 'font-size:14px;background-color:#353b53;color:#1ae0d5'],
      type: 1,
      skin: 'layer-ext-myskin',
      content: $('#details'),
      area: ['700px', '700px'],
      btn: ['确定', '取消'],
      btnAlign: 'r',
      closeBtn: 1,
      scrollbar: false,
      resize: false,
      move: false,
      end: function () {
        $("#details").hide();
        $(".layui-form").hide();
        $(".w-e-text").html("");
        $('.priority').find(".level-item").removeClass("active");
        $('.priority').find(".level-item:eq(0)").addClass("active")
        $('#details form')[0].reset();//表单初始化
        $('#editor').html('');
      },
      success: function (layero, index) {
        $(layero).find(".layui-form").show();
        //选择优先级

        $(".priority").on("click", ".level-item", function () {
          $(this).addClass("active").siblings().removeClass("active");
        })
        // $(layero).find(".level-item").click(function () {
        //   $(this).addClass("active").siblings().removeClass("active");
        //   // var priority = $(this).attr("data-priorityLevel");
        //   // $(this).parent(".priority").attr("data-priorityLevel", priority)
        // })
        //选择截止日期
        $(layero).find("#beginTime").click(function () {
          laydate.render({
            elem: "#beginTime",
            show: true,
            min: 0,
            // type: 'datetime',
            format: 'yyyy-MM-dd',
            btns: ['clear', 'confirm'],
          })
        })

        editor = initEditor('editor');
      },
      yes: function (index, layero) {
        var title = $.trim($(layero).find(".layui-form-item:eq(0) input").val());
        var noticeDate = $(layero).find('.layui-form-item:eq(1) input').val() + " 23:59:59";
        var datalevel = $(layero).find('.priority .active').attr("data-prioritylevel");
        var content = editor.txt.html();

        if (!title) {
          return layer.msg("请输入标题")
        }

        if (noticeDate == " 23:59:59") {
          return layer.msg("请选择截止时间")
        }

        if (content == '<p><br></p>') {
          return layer.msg("请输入任务内容")
        }

        var param = {
          userId: userId,
          title: title,
          endtime: noticeDate,
          leave: datalevel,
          content: content
        }

        reqAjaxAsync(REQUEST_URL.PUBLISH, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            layer.msg(res.msg);
            layer.close(index);
            intial();
          } else {
            layer.msg(res.msg);
          }
        })
      }
    })
  })

  //任务详情弹框
  $(".item-list").on("click", ".item", function () {
    var id = $(this).data("id");
    var iscomplete = $(this).children(".time").attr("data-iscomplete");
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
        reqAjaxAsync(REQUEST_URL.DETAIL, JSON.stringify(param)).done(function (res) {
          if (res.code == 1) {
            var v = res.data;
            var html = '';
            html += '<img class="taskdone" src="../images/taskdone.png" alt="">' +
              '<div class="toConfirm">' +
              '    <span>点击确认任务已完成</span>' +
              '  </div>' +
              '  <div class="title">' + theTitle(v) + ' </div>' +
              '  <p>' +
              '    <span class="level-' + v.leave + '">' + getpriority(v.leave) + '</span>' +
              '  </p>' +
              '  <div class="content">' + v.content + '' +
              '    <div class="footer">' +
              '      <span>创建于 ' + v.createtime + '</span>' +
              '    </div>' +
              '  </div>'

            $("#detail-2").html(html);
            if (isNull(iscomplete)) {
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
                      intial();
                    }
                  })
              })
            } else if (iscomplete == 1) {
              $(layero).find(".toConfirm").css("background", "url(../images/hasdone.png) no-repeat");
              $(layero).find(".toConfirm span").html("任务已确认完成")
              $(layero).find(".taskdone").show();
            }
          }
        })
      },
    })
  })

//拼接内容
  function getContent(d) {
    var html = '';
    $.each(d, function (i, v) {
      html += '<div class="item" data-id="' + v.id + '">' +
        '     <div class="subtitle">' +
        '      ' + v.title + '' +
        '       <span class="level-' + v.leave + '">' + getpriority(v.leave) + '</span>' +
        '     </div>' +
        '     <div class="content">' +
        '' + getSimpleText(v.content) + '' +
        '     </div>' +
        '     <div   data-isComplete="' + v.iscomplete + '" class="time">' +
        '      <i data-timePrompt="' + timePrompt(v.endtime) + '" class="icon-9"></i>' +
        '    <a>' + v.endtime + '</a>' +
        '    </div>' +
        '  </div>'
    })
    $(".item-list").html(html);
    $(".time").each(function (i, v) {
      //任务到期显示红色
      var timePrompt = $(this).children("i").attr("data-timePrompt");

      var isComplete = $(this).attr("data-isComplete");
      // console.log(isComplete);

      if (timePrompt < 1 && timePrompt > 0) {
        $(this).addClass("active");
        $(this).children("i").removeClass("icon-9").addClass("icon-8");
        $(this).children("a").css("color", "#F7672E")
      }
      if (isComplete == 1) {
        $(this).removeClass("active");
        $(this).children("i").addClass("icon-9").removeClass("icon-8")
        $(this).children("a").css("color", "#A0A0A0")
      }
    })
  }

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

  //判断标题长度
  function theTitle(v) {
    var len = v.title.length;
    var html;
    if (len > 20) {
      html = '<b >' + v.title + '</b>' +
        '<div class="theme">' +
        '    <i class="icon-9"></i>' +
        '    <span>截止日期 ' + v.endtime + '</span>' +
        '</div>'
    } else {
      html = '    <b class="theme">' + v.title + '</b>' +
        '    <i class="icon-9"></i>' +
        '    <span>截止日期 ' + v.endtime + '</span>'
    }

    return html

  }
})
(jQuery)