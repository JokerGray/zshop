(function ($) {
  var REQUEST_URL = {
    SELECTRECSCAPPROVALPAGE: 'userDaily/selectRecScApprovalPage',//日报(dh)---分页展示我收到的审批单(日报)列表
    SELECTDAILYSCAPPROVALPAGE: 'userDaily/selectDailyScApprovalPage',//日报(dh)---分页展示我提交的审批单(日报)列表
  }

  var userId = getUrlParams('userId') || 10430,
    isFormDetails=getUrlParams('isFormDetails'),//1.1代表从详情页面跳转过来
    index=0,
    isWhatISend=getUrlParams('isWhatISend'),//0.代表我收到的，1.代表我提交的
    bussTypeId = 3;

    function intitial() {
      if(isFormDetails==1&&isWhatISend==1){
        getUl(REQUEST_URL.SELECTDAILYSCAPPROVALPAGE);
        $('#lookDaily .topNav li:nth-child(2)').addClass("active").siblings().removeClass("active");
      }else{
        getUl(REQUEST_URL.SELECTRECSCAPPROVALPAGE);
        $('#lookDaily .topNav li:first-child').addClass("active").siblings().removeClass("active");
      }
  }

  $(function () {
    intitial()
  })

  //看日报-我发出的,我收到的
  $('#lookDaily .topNav li').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('#lookDaily .daily-list ul').html('');

    index = $(this).index();
    //我收到的
    if (index == 0) {
      getUl(REQUEST_URL.SELECTRECSCAPPROVALPAGE);
      //我提交的
    } else if (index == 1) {
      getUl(REQUEST_URL.SELECTDAILYSCAPPROVALPAGE);
    }
  });

    function getUl(indexNum) {
      var param = {
        bussTypeId: bussTypeId,
        pagination: {
          page: 1,
          rows: 10
        },
        userId: userId
      };
      reqAjaxAsync(indexNum, JSON.stringify(param)).done(function (res) {
        if (res.data.length == 0) {
          $('#lookDaily .daily-list').attr('class', 'daily-list slot');
        } else {
          $('#lookDaily .daily-list').attr('class', 'daily-list');
          dailyList(res);
        }
      })
    }

  // 判断是否安卓、ios且在app内部
  function isAndroid () {
    var u = window.navigator.userAgent;
    return (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1)  > -1;
  }
  function isIOS () {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  }




  //跳转日报详情页面
  $('#lookDaily .daily-list').on('click', 'li', function () {
    var approvalId = $(this).attr('data-id');

    var ua = navigator.userAgent.toLowerCase();
    //如果为苹果
    if (/iphone|ipad|ipod/.test(ua)) {
      window.webkit.messageHandlers.iOS.postMessage([approvalId,userId,index]);
    }


    //如果为安卓
    if(isAndroid()){

      window.android.postMessage(approvalId,userId,index);

    } else if(isIOS()){


    } else{
      layerMsg('错误')
    }

  })


  //日报列表渲染方法
  function dailyList(res) {
    if (res.code == 1) {
      var sHtml = '';
      for (var i = 0; i < res.data.length; i++) {
        var data = res.data[i],
          content = JSON.parse(res.data[i].content);
        sHtml +=
          '<li class="daily-item" data-id="' + data.id + '">\n' +
          '        <p class="name">' + data.createUserInfo.username + '</p>\n' +
          '        <p class="date">' + data.updateDate + '</p>\n' +
          '        <div class="details">\n' +
          '          <label>今日完成工作：</label>\n' +
          '          <p class="text">' + isNull(content.today) + '</p>\n' +
          '        </div>\n' +
          '        <div class="details">\n' +
          '          <label>需协调工作：</label>\n' +
          '          <p class="text">' + isNull(content.coordinate) + '</p>\n' +
          '        </div>\n' +
          '        <div class="details">\n' +
          '          <label>次日工作安排：</label>\n' +
          '          <p class="text">' + isNull(content.nextDay) + '</p>\n' +
          '        </div>\n' +
          '        <div class="details">\n' +
          '          <label>备注：</label>\n' +
          '          <p class="to_remark">' + isNull(data.remarks) + '</p>\n' +
          '        </div>\n' +
          '      </li>';
      }
      $('#lookDaily .daily-list ul').html(sHtml);
    } else {
      layerMsg(res.msg);
    }
  }

})(jQuery)