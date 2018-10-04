// 获取url中的参数
function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  return r !== null ? unescape(r[2]) : null
}

// 判断是否安卓且在app内部
function isAndroid () {
  var u = window.navigator.userAgent
  return (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && u.indexOf('SmartCity') > -1
}

// 判断是否IOS且在app内部
function isIOS () {
  var u = window.navigator.userAgent
  return !!u.match(/\(i[^;]+;( u;)? CPU.+Mac OS X/) && u.indexOf('SmartCity') > -1
}

// H5支付
function webPay () {
  console.log('H5支付')
}