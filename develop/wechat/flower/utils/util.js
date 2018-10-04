//时间格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const URL = 'https://wxappprod.izxcs.com/zxcity_restful/ws/rest';
// const URL = 'http://appmain.izxcs.com:81/zxcity_restful/ws/rest';
// const URL = '195.168.185/zxcity_restful/ws/rest';
//兼容IOS时间格式转换
const formatIOS = date => {
  const arr = date.split(/[- :]/);
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}

function getVideoShouList(par) {
  console.log(JSON.stringify(par))
  util.reqAsync(USER_URL.GETENSHRINEVIDEO, par).then(res => {
    var datas = res.data;
    if (datas.code == 1 && datas.data.length) {
      var dataes = datas.data;
      console.log('收藏列表开始', dataes)
    }
  })
  return dataes;
}



/**
 * 检测字符串类型
 * str: 传入待验证的字符串
 * type: 检测类型
 *       string-number : 仅限字母、数字
 *       string-number-hanzi : 仅限中文、字母、汉字
 */
function validStringType(str, type) {
  let result = null
  switch (type) {
    case 'string-number':
      result = /^[A-Za-z0-9]+$/.test(str)
      break
    case 'string-number-hanzi':
      result = /^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(str)
      break
    case 'email':
      result = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str)
      break
    case 'phone':
      result = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str)
      break
    default:
      break
  }
  return result
}

//封装小程序异步请求
const reqAsync = (cmd, data) => {
  var p = new Promise((resolve, reject) => {
    wx.request({
      url: URL,
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        apikey: wx.getStorageSync('apikey') || 'test'
      },
      dataType: 'json',
      data: {
        cmd: cmd,
        data: JSON.stringify(data),
        version: 1
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  });
  return p;
}

//检查登录是否过期

const boolCheckSession = () => {
  var hasUser = false
  let promi = new Promise((resolve, reject) => {
    wx.checkSession({//检查小程序登录是否过期
      success: (res) => {//未过期
        if (!isAppUser()) {
          // hasUser = false
          // return
          resolve({
            hasUser: false
          })
        }
        resolve({
          hasUser: true
        })
        // hasUser = true
      },
      fail: (res) => {//已过期重新登录小程序
        // hasUser = false
        resolve({
          hasUser: false
        })
      }
    })
  })
  return promi
}
//判断是否登录成功
const checkWxLogin = () => {
  let promi = new Promise((resolve, reject) => {
    
    boolCheckSession().then((res) => {
      // console.log(13,res);
      if (res.hasUser) {
        var user = wx.getStorageSync('scSysUser');
        resolve(user)
      } else {
        wx.login({
          success: (res) => {
            var params = {
                code:res.code,
                source:1,
                platform:0
            }
            // 后台登陆app账户
            reqAsync('payBoot/wx/miniapp/login', params).then((res) => {
              // console.log(res,'看下我的值');
              // console.log('登录app', res.data.data.scSysUser)
              console.log(res.data.data);
              wx.setStorageSync('loginToken', res.data.data.loginToken);
              // 失败则跳到注册页
              if (res.data.code != 1) {
                loginFailed()
                //  wx.navigateTo({ url: '/pages/reg/reg' })
                wx.reLaunch({
                  url: '/pages/reg/reg',
                })
                return
              }
              // 未注册用户跳转到注册页面
              if (res.data.data.scSysUser == null) {
                    //  wx.navigateTo({ url: '/pages/reg/reg' })
                wx.reLaunch({
                  url: '/pages/reg/reg',
                })
              }
              else {
                wx.setStorageSync('scSysUser', res.data.data.scSysUser);
                console.log(res.data.data.scSysUser,'我要看的数据');
                resolve(res.data.data.scSysUser)
                //因index获取店铺信息接口调用时取不到userid，所以在此添加访问记录
                // if (hasShop()){
                //   reqAsync('shop/addVisitorShopRecord', {
                //     customerId: res.data.data.scSysUser.id,
                //     visitFrom: 3,
                //     shopId: hasShop()
                //   })
                // }
              }
            })
          },
          fail: () => {
            reject({
              title: '登陆失败，请稍后再试！',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }

    })
  })
  return promi
}

// 登陆失败处理
const loginFailed = () => {
  wx.hideLoading();
  wx.showToast({
    title: '登陆失败，请稍后再试！',
    icon: 'none',
    duration: 2000
  })
}

//判断是否为app用户
const isAppUser = () => {
  var scSysUser = wx.getStorageSync('scSysUser');
  return scSysUser && scSysUser.id
}



function getRandomColor() {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
}


//时间转换成多少天

function formatMsgTime(modifyTime,timespan) {
  var timeSpanStr = '';
  var milliseconds = '';
  var now = new Date();
  // var modifyTime = new Date(modifyTime.replace(/-/g, '/'));
  var timespan = new Date(timespan.replace(/-/g, '/'));
  // var modifyTime = modifyTime.getTime(); //转换成时间戳
  var timespan = timespan.getTime(); //转换成时间戳
  // console.log(modifyTime-timespan);
  milliseconds = (modifyTime - timespan);
  var now = new Date();
  //时间挫转换成 年月 日
  var time = new Date(timespan);
  var year = time.getFullYear();   //年，
  // var month = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1); //月
  var month = time.getMonth()+1;
  var day = time.getDate();       //日
  var hour = time.getHours();
  var minute = time.getMinutes();
  if (milliseconds <=  1000 * 60 * 1) {
    timeSpanStr = '刚刚';
  }
  else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
  }
  else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
  }
  else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24*15 ) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
  }
  else if (milliseconds > 1000 * 60 * 60 * 24 * 15 ) {
    // timeSpanStr = month + '-' + day + '-' + hour + ':' + minute;
    timeSpanStr = month + '月' + day + '号';
  }
   else {
    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  }
  return timeSpanStr;
}


//多少米，显示 距离

function distance(distance, videoCity){
  if(videoCity==null){
    videoCity='';
  }
  var distance;
  var distanceNUM = (Math.round(distance / 100) / 10).toFixed(1)
  if(distance<1000){
    distance = Math.floor(distance)+'M'
  } else if (distance > 1000 && distanceNUM<50){
    distance = (Math.round(distance / 100) / 10).toFixed(1) + "KM"
  }else {
    distance = videoCity;
  }
  return distance;
}

// //判断是否为ios系统
// function isIos(app) {
//     var platform = app.globalData.systemInfo.platform;
//     platform = platform.toLowerCase();
//     console.log("isIos", platform);
//     return platform.indexOf("ios") >= 0;
// }


// /**
//  * 解决苹果端startPullDownRefresh不能触发onPullDownRefresh的问题
//  * that  js文件的this
//  * app 
//  */
// function cusStartPullDownRefreh(that, app) {
//     wx.startPullDownRefresh({});
//     if (isIos(app)) {
//         that.onPullDownRefresh();
//     }
// }



module.exports = {
  validStringType: validStringType,
  formatMsgTime: formatMsgTime,
  formatTime: formatTime,
  formatIOS: formatIOS,
  reqAsync: reqAsync,
  isAppUser:isAppUser,
  boolCheckSession: checkWxLogin,
  checkWxLogin: checkWxLogin,
  getRandomColor: getRandomColor,
  URL: URL,
  distance: distance
//   isIos: isIos,
//   cusStartPullDownRefreh: cusStartPullDownRefreh
}
