(function ($) {
  var leaveId = getUrlParams("leaveId");
  var userId = getUrlParams("userId") || 10073;
  var itemType = getUrlParams("itemType");//1.我提交的2.待我审批3.我已审批
  var norejuctBtn;//不显示拒绝按钮

  var mo=function(e){e.preventDefault()};
  $(function () {
    getBox();
  })


  //返回主页面
  $(".back_imgBtn").click(function () {
    window.location.href = './leaveList.html?itemType=' + itemType + "&userId=" + userId ;
  });

  //撤销
  $(".operateBtn .release").click(function () {

    layer.open({
      content: '您确定撤销吗？'
      , btn: ['确认', '取消']
      , yes: function (index) {
        reject("revocation");
        layer.close(index);
      }
    });
  });

  //转交
  $(".operateBtn .deliver").click(function () {
    layer.open({
      content: '您确定转交吗？'
      , btn: ['确认', '取消']
      , yes: function (index) {

        layer.close(index);
        window.location.href = './chooseApproval.html?chooseType=' + 2 + '&leaveId=' + leaveId + '&userId=' + userId;
      }
    });
  });

//同意
  $(".operateBtn .agree").click(function () {
    $(".rejectBox").show();
    $(".rejectBox .title").html("是否同意此申请？")
    //确认弹框
    $(".rejectBox .certainBtn ").click(function () {
      var value=$(".rejectBox .reason").val();
      $(".rejectBox").hide();
      reject("agree",value);
    })

  });

  //拒绝
  $(".operateBtn .reject").click(function () {
    $(".rejectBox").show();
    $(".rejectBox .title").html("是否拒绝此申请？")

    //确认弹框
    $(".rejectBox .certainBtn ").click(function () {
      var values=$(".rejectBox .reason").val();
      $(".rejectBox").hide();
      reject("reject",values);

    })
  });

  // 提交归档
  $(".operateBtn .archive").click(function () {
    layer.open({
      content: '您确定提交归档吗？'
      , btn: ['确认', '取消']
      , yes: function (index) {
        layer.close(index);
        var parem = {
          userId: userId,
          leaveId: leaveId
        }
        reqAjaxAsync(RESULT_URL.FILING, JSON.stringify(parem)).done(function (res) {
          if (res.code == 1) {
            layerMsg("操作成功");
            setTimeout(function(){  window.location.href = './leaveList.html?userId=' + userId;},1000);

          }
        })
      }
    });
  });

  //查看大图
  $("#leaveList").on("click", ".real", function () {
    var src = $(this).attr("src");
    $(".motai").show();
    $(".motaiimg").attr("src", src);




    /***禁止滑动***/
    // function stop(){
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",mo,false);//禁止页面滑动
    // }

  });

  $(".motai").on("click",function(){
    $(this).hide();
      document.body.style.overflow='';//出现滚动条
      document.removeEventListener("touchmove",mo,false);
  });
  //关闭按钮
  // $(".motai").on("click", "#close", function () {
  //   $(this).parents(".motai").hide();
  //
  //   document.body.style.overflow='';//出现滚动条
  //   document.removeEventListener("touchmove",mo,false);
  // });



  //撤销，拒绝，同意请假单
  function reject(type, opinion) {


    var parem = {
      leaveId: leaveId,//请假单id
      userId: userId,
      operateType: type,//类型
      opinion: opinion//意见
    }
    reqAjaxAsync(RESULT_URL.REJECT, JSON.stringify(parem)).done(function (res) {
      if (res.code == 1) {
        layerMsg("操作成功")
        setTimeout(function(){ window.location.href = './leaveList.html?userId=' + userId;},1000);
      }
    })
  }

  //获取详情
  function getBox() {

    var param = {
      userId: userId,
      leaveId: leaveId
    }
    //审批详情
    reqAjaxAsync(RESULT_URL.DETAILS, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {
          // getToptable(res)
          var v = res.data;
          var html = '';
          html += '<div class="topPart" data-createId="' + v.createBy + '">' +
            '<img src="img/createType/haveAccepted.png" class="showType haveAccepted">' +
            '<img src="img/createType/haveRejected.png" class="showType haveRejected">' +
            '<img src="img/createType/haveRelease.png" class="showType haveRelease">' +
            '      <div class="topHead">\n' +
            '          <div class="headImg">\n' +
            '            <span class="nameImg">' + getImgPic(v.createByName) + '</span>\n' +
            '          </div>\n' +
            '        <div class="rightPart">\n' +
            '            <p class="nameTitle">\n' +
            '              <span>' + v.createByName + '</span>\n' +
            '             ' + levelType(v.priorityLevel) + ' ' +
            '            </p>\n' +
            '            <p class="timePrompt"> ' + v.createDate + ' 提交</p>\n' +
            '        </div>\n' +
            '      </div>\n' +
            '    <ul class="sencondHead">\n' +
            '        <li>\n' +
            '          <span>审批类型</span>\n' +
            '          <span>请假审批</span>\n' +
            '\n' +
            '        </li>\n' +
            '      <li>\n' +
            '        <span>请假类型</span>\n' +
            '        <span>' + getLeaveType(v.leaveType) + '</span>\n' +
            '      </li>\n' +
            '      <li >\n' +
            '        <span>开始时间</span>\n' +
            '        <span class="time">' + v.startTime + ' </span>\n' +
            '      </li>\n' +
            '      <li >\n' +
            '        <span>结束时间</span>\n' +
            '        <span class="time">' + v.endTime + '</span>\n' +
            '      </li>\n' +
            '      <li>\n' +
            '        <p class="reasonType">请假原因</p>\n' +
            '        <p class="reasonText">' + v.reason + '</p>\n' +
            '      </li>\n' +
            '      <li class="imgTips">\n' +
            '        <span>图片</span>\n' +
            '' + getImg(v.picUrl) + '' +
            '      </li>\n' +
            '    </ul>\n' +
            '  </div>'
          $(".topBox").html(html);


          //审批记录
          reqAjaxAsync(RESULT_URL.RECORDING, JSON.stringify(param))
            .done(function (res) {
              if (res.code == 1) {
                if (res.code == 1) {
                  console.log(res);
                  var data = res.data;
                  var html = '';
                  $.each(data, function (i, v) {
                    html += '<li>\n' +
                      '        <p class="oneTab">\n' +
                      '          <span class="dotImg"></span>\n' +
                      '          <span>' + v.sysBackUserName + '</span>\n' +
                      '          <span class="type_' + v.operateType + '">' + recordTyep(v.operateType) + '</span>\n' +
                      '          <span class="time"> ' + v.approvalTime + '</span>\n' +
                      '        </p>\n' +
                      '        <p class="reason">' + reasonText(v.opinion) + '</p>\n' +
                      '      </li>'
                  });

                  $(".approvalPath").html(html);

                  //判断是否同意或者拒绝
                  var type = data[0].operateType;
                  console.log(type);
                  //显示同意图片
                  if (type == 3) {
                    $(".haveAccepted").show()
                  }
                  //显示拒绝图片
                  if (type == 4) {
                    norejuctBtn = "true";
                    $(".haveRejected").show();

                    $(".typeOne").hide();
                  }
                  //显示撤销图片
                  if (type == 6) {
                    $(".haveRelease").show()
                  }


                  //按钮显示
                  reqAjaxAsync(RESULT_URL.ROLE, JSON.stringify(param))
                    .done(function (res) {
                      if (res.code == 1) {
                        var data = res.data;
                        var createId = $(".topPart").attr("data-createId");
                        if (data == 1) {

                          $(".typeOne").show();

                          if (norejuctBtn == "true") {
                            $(".typeOne .release").hide();
                          }

                        } else if (data == 2) {
                          $(".TypeTwo").show();
                        } else if (data == 3) {
                          $(".typeThree").show();
                          if (createId == userId) {
                            $(".typeThree .reject").hide()
                          } else {
                            $(".typeThree .release").hide()
                          }
                        } else if (data == 4) {
                          $(".typeFour").show();
                          if (createId == userId) {
                            $(".typeFour .reject").hide()
                          } else {
                            $(".typeFour .release").hide()
                          }
                        } else if (data == 5) {
                          $(".typeFive").show();
                        } else if (data == 6) {
                          $(".typeSix").show();
                        }

                        if (norejuctBtn == "true") {
                          $(".typeOne .release").hide();
                        }
                      }
                    })

                }
              }
            })

        }
      })
  }

  //审批详情


  //审批记录


  //拒绝理由
  function reasonText(d) {
    var m = ''
    if (!d) {
      m = ""
    } else {
      m = d
    }
    return m
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
      html = "已提交归档"
    }
    return html;
  }

  //详情图片
  function getImgPic(d) {

    var html = d.slice(0, 1);
    return html
  }

  //请假类型
  function getLeaveType(d) {
    var html = '';
    if (d == 1) {
      html = '事假'
    } else if (d == 2) {
      html = '病假'
    } else if (d == 3) {
      html = '调休'
    } else if (d == 4) {
      html = '婚假'
    } else if (d == 5) {
      html = '丧假'
    } else if (d == 6) {
      html = '工伤假'
    }
    return html
  }

  //过滤数组空值
  function bouncer(arr) {
    // Don't show a false ID to this bouncer.
    return arr.filter(function (val) {
      return !(!val || val === "");
    });
  }


  //详情获取图片
  function getImg(url) {
    var html = ''
    if (url == "[]") {
      html = "无"
    } else {
      url = JSON.parse(url);
      url = bouncer(url)
      $.each(url, function (i, v) {
        html += '<img class="real" src=' + v + '> '
      })
    }
    return html
  }

})(jQuery)