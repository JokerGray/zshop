$(function () {
  //ios快速点击初始化
  FastClick.attach(document.body);
})

var orderNo = getUrlParams('orderNo') || '';
var expNo = getUrlParams('expNo') || '';

//初始化方法
function getList(orderNo, expNo) {
  var GETTRACKQUERY = 'shop/getTrackQuery';
  var param = {
    orderNo: orderNo,
    expNo: expNo
  };
  expNo1 = expNo;
  reqAjaxAsync(GETTRACKQUERY, JSON.stringify(param)).done(function (res) {
    init(res);
  })
}

//页面渲染方法
function init(res) {
  if (res.code == 1) {
    $('.commodity-img').css('backgroundImage', 'url(' + res.data.firstGoodsPic + ')');
    $('.company').html(res.data.shipperName + '：' + expNo1);
    var Traces = JSON.parse(res.data.logisticsInfo).Traces;
    if (Traces == '' || Traces.length == 0) {
      $('.details').attr('class', 'details noRecipient');
      return;
    } else {
      var sHtml = '<ul>';
      for (var i = Traces.length - 1; i >= 0; i--) {
        var data = Traces[i],
          date = data.AcceptTime;
        sHtml +=
          '<li>' +
          '<div class="process-details">' +
          '<div class="time">' +
          '<div class="time-content">' +
          '<p class="date">' + formatDate(date) + '</p>' +
          '<p class="hours">' + formatDateTime(date) + '</p>' +
          '</div></div>' +
          '<div class="address-change">' +
          '<div class="content">' +
          '<p class="real-time"></p>' +
          '<p class="change">' + replacePhone(data.AcceptStation) + '</p>' +
          '</div></div></div></li>';
      }
      sHtml += '</ul>';
      $('.details').html(sHtml).attr('class', 'details');
      var State = JSON.parse(res.data.logisticsInfo).State;
      switch (State) {
        case 0:
          $('.details').addClass('noRecipient');
        case 1:
          $('.status').html('已发货');
          break;
        case '2':
          $('.status').html('运输中');
          $('.details li:first-child .address-change').addClass('status2End');
          break;
        case '3':
          $('.status').html('已签收');
          $('.details li:first-child .address-change').addClass('status3');
          break;
      }
    }
  } else {
    layer.open({
      content: res.msg,
      skin: 'msg',
      time: 2
    });
  }
}

function replacePhone(val) {
  var s = val.match(/1[3,5,8]{1}[0-9]{9}/g);
  //判断为android
  if (navigator.userAgent.match(/android/i)) {
    var value = val.replace(/1[3,5,8]{1}[0-9]{9}/g, '<a onclick="callAndroid(' + s + ')" style="color: blue;">' + s + '</a>');
  } else if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
    var value = val.replace(/1[3,5,8]{1}[0-9]{9}/g, '<a href="tel:' + s + '" style="color: blue;">' + s + '</a>');
  }
  return value;
}

function callAndroid(phone) {
  window.logistics.callPhone("" + phone)
}

if (orderNo && expNo) {
  getList(orderNo, expNo)
}

/*getList('ZXCSSHOP201801061415036090006', 538604303339)*/
