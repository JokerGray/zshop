(function ($) {
  var page = 1;
  var pageNo = 10;
  var userId = getUrlParams("userId") || 10429;
  var itemType = getUrlParams("itemType");//1.我提交的2.待我审批3.我已审批

  function initial() {
    //1.我提交的
    if (itemType == 1) {
      submitted();
      // $(".submitted").click();
      // $(".approvaledTab").hide();
      // getUl(RESULT_URL.HASPROVALED,1);
    }//2.待我审批的
    else if (itemType == 2) {
      getapprovaled()
      // $(".approvaled").click();
      // $(".toApprovalBtn").click();
      // getUl(RESULT_URL.TOPROVAL,2);
      //我已审批
    } else if (itemType == 3) {

      havedApprovalBtn()
      // $(".approvaled").click();
      // $(".havedApprovalBtn ").click();
      // getUl(RESULT_URL.PROVALDONE,3);
    } else {

      $(".submitted").click();
      $(".approvaledTab").hide();
      getUl(RESULT_URL.HASPROVALED, 1);
    }
  }

  initial();


  //返回app页面

  $(".back_imgBtn").click(function () {
    window.location.href = 'backZmasterApp://';
  })

  //发起申请
  $(".title_tab .createBtn").click(function () {
    window.location.href = './createApproval.html?userId=' + userId;
  })

  //我提交的方法
  function submitted() {
    $(".approvaledTab").hide();
    $(".submitted").addClass("active").siblings(".approvaled").removeClass("active");
    getUl(RESULT_URL.HASPROVALED, 1);
  }

  //我提交的
  $(".submitted").click(function () {
    submitted()
  });

  //我审批的方法
  function getapprovaled() {
    $(".approvaled").addClass("active").siblings(".submitted").removeClass("active");
    $(".approvaledTab").show();
    $(".toApprovalBtn ").addClass("active");
    $(".toApprovalBtn img").attr("src", "img/createType/noCheackActive.png");
    $(".havedApprovalBtn ").removeClass("active");
    $(".havedApprovalBtn img").attr("src", "img/createType/haveCheacked.png");
    getUl(RESULT_URL.TOPROVAL, 2);
  }

  //我审批的
  $(".approvaled").click(function () {
    getapprovaled()
  })

  //待审批
  function toApprovalBtn() {
    $(".approvaled").addClass("active").siblings(".submitted").removeClass("active");
    $(".toApprovalBtn ").addClass("active").siblings(".havedApprovalBtn").removeClass("active");
    $(".toApprovalBtn img").attr("src", "img/createType/noCheackActive.png");
    $(".havedApprovalBtn img").attr("src", "img/createType/haveCheacked.png");
    getUl(RESULT_URL.TOPROVAL, 2);
  }

  //待审批
  $(".toApprovalBtn ").click(function () {
    toApprovalBtn()
  });

  //已审批
  function havedApprovalBtn() {
    $(".approvaled").addClass("active").siblings(".submitted").removeClass("active");
    $(".havedApprovalBtn ").addClass("active").siblings(".toApprovalBtn").removeClass("active");
    $(".toApprovalBtn img").attr("src", "img/createType/noCheack.png");
    $(".havedApprovalBtn img").attr("src", "img/createType/haveCheackedActive.png");
    getUl(RESULT_URL.PROVALDONE, 3);
  }

  //已审批
  $(".havedApprovalBtn ").click(function () {
    havedApprovalBtn()
  });

  //点击查看单个详情
  $(".submitList").on("click", ".detailBox", function () {
    var itemType = $(this).attr("data-type");//1.我提交的2.待我审批3.我已审批
    var id = $(this).attr("data-id");
    window.location.href = './leaveDetails.html?leaveId=' + id + '&itemType=' + itemType + "&userId=" + userId;
  });


  //获取每个申请列表
  function getUl(url, type) {
    var param = {
      page: page,
      rows: pageNo,
      userId: userId
    }
    reqAjaxAsync(url, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        getList(res, type)
      }
    })
  }


  function getList(res, type) {
    if (res.code == 1) {
      var data = res.data;
      var html = '';
      if (data.length > 0) {
        $.each(data, function (i, v) {
          html += ' <ul class="detailBox" data-id="' + v.id + '" data-type="' + type + '">\n' +
            '<img src="img/createType/haveAccepted.png" class="showType haveAccepted">' +
            '<img src="img/createType/haveRejected.png" class="showType haveRejected">' +
            '<img src="img/createType/haveRelease.png" class="showType haveRelease">' +
            '      <li class="oneList">\n' +
            '        <img src="img/createType/incon-' + v.approvalStatus + '.png" alt="">\n' +
            '      </li>\n' +
            '      <li class="sencondList">\n' +
            '        <a class="nameBlue" >' + v.createByName + '</a>\n' +
            '        <span class="time">' + v.createDate + ' 提交了</span>\n' +
            '      </li>\n' +
            '      <li class="thirdList">\n' +
            '        <a href="">请假申请：</a>\n' +
            '        <span class="time">' + getTime(v.startTime) + ' 至 ' + getTime(v.endTime) + '</span>\n' +
            '      </li>\n' +
            '      <li class="levelList">\n' +
            '      ' + levelType(v.priorityLevel) + '' +
            '      </li>\n' +
            '      <li data-approvalStatus="' + v.approvalStatus + '">\n' +
            '      ' + typeProval(v.approvalStatus) + '' +
            '      </li>\n' +
            '    </ul>'
        });
        $(".submitList").html(html);

        $(".detailBox").each(function (i, v) {
          var approvalStatus = $(this).children("li:last-child").attr("data-approvalStatus");
          if (approvalStatus == 3) {
            $(this).children(".haveAccepted").show();
          } else if (approvalStatus == 5) {
            $(this).children(".haveRejected").show();
          } else if (approvalStatus == 4) {
            $(this).children(".haveRelease").show();
          }
        })


      } else {
        var html = ' <div class="blankPage">\n' +
          '    <img src="img/createType/blankPage_' + type + '.png" class="blankPageImg">\n' +
          '  </div>'
        $(".submitList").html(html);
      }
    }
  }


  //获取时间
  function getTime(value) {
    var arr = value.split(' ');
    //计算时间差
    var start = arr[0];
    return start;
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


})(jQuery)