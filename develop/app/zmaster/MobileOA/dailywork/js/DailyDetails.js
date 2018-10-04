(function ($) {
  var REQUEST_URL = {
    DETAILSCAPPROVAL: 'userDaily/detailScApproval',//日报(dh)---审批单主键查看审批单详情
    REPLAYDAILYAPPROVAL: 'userDaily/replayDailyApproval',//日报(dh)---回复日报
    QUERYSCAPPROVALPROCESSLIST: 'userDaily/queryScApprovalProcessList'//日报(dh)---查看日报回复记录列表
  }

  var userId = getUrlParams('userId') || 10430,
    approvalId = getUrlParams('approvalId')||144,
    index = getUrlParams('index'),
    lock = true;


  $(function () {
    intitial()
  })

  function intitial() {
    initDetails(approvalId, index);
    replyList(approvalId);
  }

  //日报详情渲染方法
  function initDetails(approvalId, index) {
    var param = {approvalId: approvalId};
    reqAjaxAsync(REQUEST_URL.DETAILSCAPPROVAL, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        var data = res.data;
        var content = JSON.parse(res.data.content);
        $('#dailyDetails').attr('data-approvalId', approvalId);
        $('#dailyDetails .title span').html(data.createUserInfo.username + '的日报');
        $('#dailyDetails .name').html(data.createUserInfo.username);
        $('#dailyDetails .date').html(data.updateDate);
        $('#dailyDetails .details-item:eq(0) p:eq(1)').html(content.today);
        $('#dailyDetails .details-item:eq(1) p:eq(1)').html(isNull(content.coordinate));
        $('#dailyDetails .details-item:eq(2) p:eq(1)').html(content.nextDay);
        $('#dailyDetails .details-item:eq(3) p:eq(1)').html(isNull(data.remarks));
        $("#send .item-list").html(getAPPROVAL(data.nextApproverUserList));
        if (index == 0) {
          //是我收到的
          $('#reply').show();
        } else if (index == 1) {
          //我发出的,不需要回复
          $('#reply').hide();
        }
        $('#lookDaily,#bottomNav').hide();
        $('#dailyDetails').show();
      } else {
        layerMsg(res.msg);
      }
    })
  };

  //日报接收人
  
  function getAPPROVAL(data) {
    var html='';
    $.each(data,function (i,v) {
      html+='<div class="item">\n' +
        '          <i>'+getFirstName(v.username)+'</i>\n' +
        '          <p>'+v.username+'</p>\n' +
        '        </div>'
    })
    return html;
  }

  function getFirstName(data) {
    return data.slice(0,1)
  }

  //回复输入框上浮
    setTimeout(function(){
      document.body.scrollTop = document.body.scrollHeight;
    },300);

  $('#dailyDetails').css('height', $(window).height() - 39);
  $("#to_replay").on('focus', function () {
        setTimeout(function () {
                       window.scrollTo(0, 1000000);
           }, 200);
      });

  // $("#to_replay").on("focus",function(){
  //
  //   setTimeout(function(){
  //     document.body.scrollTop = document.body.scrollHeight;
  //   },300);
  // });

  // var oHeight = $(document).height(); //浏览器当前的高度
  // $(window).resize(function(){
  //
  //   if($(document).height() < oHeight){
  //
  //     $("#footer").css("position","static");
  //   }else{
  //
  //     $("#footer").css("position","absolute");
  //   }
  //
  // });

//document.activeElement.scrollIntoViewIfNeeded();
//   $("#to_replay").click(function () {
//     setTimeout(function(){
//       document.getElementById("to_replay").scrollIntoViewIfNeeded();;// 参数可以是true， false, 空参数
//     }, 300);
//   })
    // setTimeout(function(){
    //   document.body.scrollTop = document.body.scrollHeight;
    // },300);



  //日报回复列表渲染
  function replyList(approvalId) {
    var param = {approvalId: approvalId};
    $('#dailyDetails .content ul').html('');
    $('#dailyDetails .content p').html('共有0条回复');
    $('#dailyDetails .reply-list').hide();

    reqAjaxAsync(REQUEST_URL.QUERYSCAPPROVALPROCESSLIST, JSON.stringify(param)).done(function (res) {
      if (res.code == 1) {
        if (res.data.length != 0) {
          var sHtml = '';
          for (var i = 0; i < res.data.length; i++) {
            var data = res.data[i];
            sHtml +=
              '<li>' +
              '<i class="icon">' + data.approvalUserInfo.username.slice(0, 1) + '</i>' +
              '<dl><dt>' + data.approvalUserInfo.username + '</dt><dd>' + data.opinion + '</dd></dl>' +
              '<span>' + dateFormat(data.approvalTime) + '</span>' +
              '</li>';
          }
          $('#dailyDetails .content ul').html(sHtml);
          $('#dailyDetails .content p').html('共有' + res.data.length + '条回复');
          $('#dailyDetails .reply-list').show();
        } else {
          console.log(res.msg);
        }
      } else {
        layerMsg(res.msg);
      }
    })
  }

  //回复日报
  $('#reply button').on('click', function () {
    var $this = $(this);
    var approvalId = $('#dailyDetails').attr('data-approvalId');
    var opinion = $.trim($(this).siblings('input').val());
    var param = {
      userId: userId,
      approvalId: approvalId,
      opinion: opinion
    }

    if (lock) {
      lock = false;
      reqAjaxAsync(REQUEST_URL.REPLAYDAILYAPPROVAL, JSON.stringify(param)).done(function (res) {
        if (res.code == 1) {
          layerMsg(res.msg);
          lock = true;
          $this.siblings('input').val('');
          setTimeout(function () {
            replyList(approvalId);
          }, 500)
        } else {
          layerMsg(res.msg);
          lock = true;
        }
      })
    }
  })


  //详情页返回列表页
  $('#dailyDetails .back').on('click', function () {
    window.location.href='./DailyList.html?isFormDetails='+1+'&userId='+userId+'&isWhatISend='+index;
  })

  //时间过滤
  function dateFormat(val) {
    return val.split(' ').slice(0, 1);
  }

})(jQuery)