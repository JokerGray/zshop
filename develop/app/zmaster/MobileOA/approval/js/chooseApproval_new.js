(function ($) {
  var userId = getUrlParams("userId") || 10073;
  var page = 1;
  var rows = 4;
  var leaveId = getUrlParams("leaveId");
  var chooseType = getUrlParams("chooseType");//1.发起时下一个审批人，2.转交
  var bussTypeId;//判断默认审批人还是默认转交人//1.审批 11.转交
  var havechoosed = getUrlParams("havechoosed");//在发起审批跳转进来是否带值
  var defaultId = getUrlParams("defaultId");//发起审批带进来的id
  var defaultname = getUrlParams("defaultname");//发起审批带进来的name

  var havedefaultSubmit;//默认转交人


  $(function () {
    //页面初始化先判断类型

    if (chooseType == 1) {
      bussTypeId = 1;
      $('.title_tab .name').text("下一审批人");
      $(".defaultPerson .to_choose").hide();
      // $(".defaultPerson .tips").text("默认审批人");

      //没有默认选择人隐藏当前选择人
      if (havechoosed == "false") {
        $(".defaultPerson").hide();
      }
    } else if (chooseType == 2) {
      bussTypeId = 11;
      $('.title_tab .name').text("转交");
      //显示当前转交人右边选择按钮
      $(".defaultPerson .to_choose").show();
    }
    initial();
  })


  function initial() {
    getTree()
  }


  //返回按钮返回时的转态
  $(".back_imgBtn").click(function () {
    console.log(chooseType);
    console.log(havedefaultSubmit);

    //有带审批人时返回时
    if (havechoosed == "true" && chooseType == 1) {

      var name = $(".defaultPerson .name").html();
      var id = $(".defaultPerson .name").attr("data-id");
      window.location.href = './createApproval.html?nextApprover=' + id + '&name=' + name + '&clickNum=' + 1 + '&userId=' + userId + "&haveDefaultPerson=" + true;
      //没有默认审批人直接返回时,
    } else if (havechoosed == "false" && chooseType == 1) {

      //直接跳回发起审批页面
      window.location.href = './createApproval.html?clickNum=' + 1 + '&userId=' + userId + '&haveDefaultPerson=' + false;

      //有默认转交人时返回请假单
    } else if (havedefaultSubmit && chooseType == 2) {
      window.location.href = './leaveDetails.html?userId=' + userId + '&leaveId=' + leaveId;
      //没有默认转交人也返回请假单
    } else if (!havedefaultSubmit && chooseType == 2) {
      window.location.href = './leaveDetails.html?userId=' + userId + '&leaveId=' + leaveId;
    }
  })

  function getTree() {

    //审批页面进来
    if (chooseType == 1) {
      //带了审批人
      if (havechoosed == "true") {
        $(".defaultPerson").show();
        $(".defaultPerson .name").html(defaultname);
        $(".defaultPerson .name").attr("data-id", defaultId);
      } else {
        $(".defaultPerson").hide();
      }

      getTreeOrg()
      //转交页面进来
    } else if (chooseType == 2) {

      var prem = {
        bussTypeId: bussTypeId,//业务类型，3为日报，1为请假审批人,11为请假的默认转发人
        userId: userId//我的用户主键(后台用户主键)
      }
      reqAjaxAsync(RESULT_URL.DefaultNext, JSON.stringify(prem))
        .done(function (res) {
          getdefaultapproval(res)
        })
    }


  }


  function getTreeOrg() {
    //查询树形组织机构
    var param = {
      userId: userId
    }
    reqAjaxAsync(RESULT_URL.GETTREE, JSON.stringify(param)).done(
      function (res) {
        var data = res.data;
        var arrName = data.orgName;
        // var arr=data.subOrgList;

        //下属店铺列表组织,过滤掉没有人员的店铺
        var arr = res.data.subOrgList.filter(function (item) {
          return item.userList.length != 0;
        })

        if (res.code == 1) {
          //部门成员
          var html = '';
          $(".shopName").html(arrName);
          $.each(arr, function (i, v) {
            html += '<div class="shopTab" data-id="' + v.orgId + '">\n' +
              '        <p class="shopTitle">\n' +
              '          <span class="triangle-right chooseperson"></span>\n' +
              '          <span>' + v.orgName + '</span>\n' +
              '        </p>\n' +
              '<ul class="personUl">' + getPersonList(v.userList) + '</ul>' +
              '      </div>'
          })
          $(".treeDepartment").html(html);


          var shtml = '';
          //最后一节字符位管理员树枝（不属于任何部门）
          var userList = data.userList;
          userList = userList.filter(function (item) {
            return item.id != userId;
          })

          if (userList.length > 0) {
            $.each(userList, function (i, v) {
              shtml += '<li data-id="' + v.id + '">\n' +
                '    <img src="img/createType/personImg.png" class="personImg">\n' +
                '    <span class="name">' + v.username + '</span>\n' +
                '    <span class="sex">' + v.phone + '</span>\n' +
                '    <span class="chooseBtn">选择</span>\n' +
                '  </li>'
            })

            //管理员树干
            var sshtml = '<div class="shopTab" data-id="">\n' +
              '        <p class="shopTitle">\n' +
              '          <span class="triangle-right chooseperson"></span>\n' +
              '          <span>管理员</span>\n' +
              '        </p>\n' +
              '<ul class="personUl">' + shtml + '</ul>' +
              '      </div>'

            $(".treeDepartment").append(sshtml);
          }
        }
      }
    )
  }

  //默认审批人
  function getdefaultapproval(res) {
    if (res.code == 1) {
      var data = res.data;
      if (data && data.length > 0) {

        //有默认转交人
        havedefaultSubmit = true;

        $(".defaultPerson").show();
        var name = res.data[0].username;
        var id = res.data[0].id;
        $(".defaultPerson .name").html(name);
        $(".defaultPerson .name").attr("data-id", id);
      } else {

        //无默认转交人
        havedefaultSubmit = false;

        $(".defaultPerson").hide();
      }

      getTreeOrg()
    }
  }


  //加载人员方法
  function getPersonList(data) {
    data = data.filter(function (item) {
      return item.id != userId;
    })
    var html = "";
    $.each(data, function (i, v) {
      html += '<li data-id="' + v.id + '">\n' +
        '    <img src="img/createType/personImg.png" class="personImg">\n' +
        '    <span class="name">' + v.username + '</span>\n' +
        '    <span class="sex">' + v.phone + '</span>\n' +
        '    <span class="chooseBtn">选择</span>\n' +
        '  </li>'
    })
    return html;
  }

  //加载人员选项
  $(".treeDepartment").on("click", ".shopTitle", function () {
    var dom = $(this);
    var aims = dom.siblings(".personUl");
    var type = aims.css("display");
    if (type == "none") {
      aims.show();
      //li出现
      dom.siblings(".personUl").find("li").each(function () {
        $(this).show();
      })
      //转换三角形
      dom.children(".chooseperson").addClass("triangle-down")
        .removeClass("triangle-right");
    } else {
      aims.hide();
      dom.children(".chooseperson").addClass("triangle-right")
        .removeClass("triangle-down");
    }
  });

  //选择转交人
  $(".treeDepartment").on("click", ".chooseBtn", function () {
    var nextApprover = $(this).parent().attr("data-id");
    var name = $(this).parent().find(".name").html();

    $(".treeDepartment .chooseBtn").each(function () {
      $(this).removeClass("active");
    });
    $(this).addClass("active");
    $(".defaultPerson .to_choose").removeClass("active");

    if (chooseType == 1) {
      layer.open({
        content: '是否确定所选人'
        , btn: ['确认', '取消']
        , yes: function (index) {
          layer.close(index);
          //1.发起时下一个审批人
          // if(chooseType==1 ){
          window.location.href = './createApproval.html?nextApprover=' + nextApprover + '&name=' + name + '&clickNum=' + 1 + '&userId=' + userId + '&haveDefaultPerson=' + true;
          //转交
          // }
          // else if(chooseType==2){

          // }
        }
      });
    } else if (chooseType == 2) {
      $(".rejectBox").show();
      $(".rejectBox .title").html("是否确定选择此人？")

      //确认弹框
      $(".rejectBox .certainBtn ").click(function () {
        $(".rejectBox").hide();
        var values = $(".rejectBox .reason").val();
        certainBtn(nextApprover, values)

      })
    }

  });

  //默认转交人选择事件
  $(".defaultPerson .to_choose").click(function () {
    var nextApprover = $(".defaultPerson .name").attr("data-id");
    $(".treeDepartment .chooseBtn").each(function () {
      $(this).removeClass("active");
    });
    $(this).addClass("active");

    $(".rejectBox").show();
    $(".rejectBox .title").html("是否确定选择此人？")

    //确认弹框
    $(".rejectBox .certainBtn ").click(function () {
      $(".rejectBox").hide();
      var values = $(".rejectBox .reason").val();
      certainBtn(nextApprover, values)

    })
  })

  //确认转交
  function certainBtn(nextApprover, opinion) {

    var param = {
      userId: userId,
      leaveId: leaveId,
      nextApprover: nextApprover,
      opinion: opinion,
    }
    reqAjaxAsync(RESULT_URL.NEXTPROVAL, JSON.stringify(param))
      .done(function (res) {
        if (res.code == 1) {
          layerMsg("操作成功");
          setTimeout(function () {
            window.location.href = './leaveList.html?userId=' + userId;
          }, 1000);
        }
      })
  }

  //enter搜索员工
  $(".searchBox input").on("keyup", function () {
    var value = $.trim($(".searchBox input").val());
    if (event.keyCode == 13) {
      if (!value) {
        //收起人员
        $(".shopTab .personUl").each(function () {
          $(this).hide();
          $(this).siblings(".shopTitle").find(".chooseperson").addClass("triangle-right")
            .removeClass("triangle-down");
        });
      } else {
        //收起人员
        $(".shopTab .personUl").each(function () {
          $(this).hide();
          $(this).siblings(".shopTitle").find(".chooseperson").addClass("triangle-right")
            .removeClass("triangle-down");
        });

        $('.personUl li:contains(' + value + ')').each(function () {
          console.log($(this))
          $(this).parents(".personUl").show();
          $(this).siblings().hide();
          $(this).parents(".personUl").prev(".shopTitle ").find(".chooseperson").addClass("triangle-down")
            .removeClass("triangle-right");
        })
      }
    }
    //撤销按钮
    if (event.keyCode == 8) {
      if (!value) {
        $(".shopTab .personUl").each(function () {
          $(this).hide();
          $(this).siblings(".shopTitle").find(".chooseperson").addClass("triangle-right")
            .removeClass("triangle-down");
        });
      }
    }

  })

  //按钮搜索员工
  $(".searchPeronBtn").click(function () {
    var value = $.trim($(".searchBox input").val());
    if (!value) {
      //收起人员
      $(".shopTab .personUl").each(function () {
        $(this).hide();
        $(this).siblings(".shopTitle").find(".chooseperson").addClass("triangle-right")
          .removeClass("triangle-down");
      });
    } else {
      //收起人员
      $(".shopTab .personUl").each(function () {
        $(this).hide();
        $(this).siblings(".shopTitle").find(".chooseperson").addClass("triangle-right")
          .removeClass("triangle-down");
      });

      $('.personUl li:contains(' + value + ')').each(function () {
        console.log($(this))
        $(this).parents(".personUl").show();
        $(this).siblings().hide();
        $(this).parents(".personUl").prev(".shopTitle ").find(".chooseperson").addClass("triangle-down")
          .removeClass("triangle-right");
      })
    }
  })

})(jQuery)
