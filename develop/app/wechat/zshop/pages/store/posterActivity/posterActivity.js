import util from '../../../utils/util.js';

const app = getApp();

Page({
  // 页面数据
  data: {
    url: '',
    goodsId: null,
    shopId: null,
    actionId: null,
    activityData: null,
    scale: null,
    temp: null,
    signed: false,
    signType: null,
    loginType:0,
    shareViewShow: false,
    details: {},
    list: {
      time: '2018.09.25-2018.10.06',
      shopName: '',
      pictureUrl: '',
      goodsName: '',
      descTitle: ''
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let url = util.SHARE_URL+'/yueba/yundian/posterTemplate/posterTemplate.html?&goodsId=' + options.goodsId + '&shopId=' + options.shopId + '&customerId=' + options.customerId
    var _this = this;

    this.setData({
      url: url,
      goodsId: options.goodsId,
      shopId: options.shopId,
      // phone: wx.getStorageSync('scSysUser').phone,
      signType: options.signType,
      actionId: options.actionId
    });
    this.setCanvasSize()

   
    if (options && options.q) {
      var uri = decodeURIComponent(options.q)
      var p = util.getParams(uri)
      let shopId = p.shopId
      wx.setStorageSync('shopId', shopId);
      this.setData({
        shopId: shopId
      })
    } else {
      if (options && options.shopId) {
        wx.setStorageSync('shopId', options.shopId);
        this.setData({
          shopId: options.shopId
        })
      }
    }
    // 获取店铺信息
    // var user = wx.getStorageSync('scSysUser');
    // util.getShop(user.id, options.shopId).then((res) => {
    //   wx.setStorageSync('shop', res.data.data.shopInfo);
    // })
    //获取报名信息
    this.getAct(options.goodsId, options.shopId)
    if (wx.getStorageSync('scSysUser')){
      let params = {
        actionId: options.actionId,
        userId: wx.getStorageSync('scSysUser').id
      }
      this.setData({
        params: params
      })
      this.getSignList(_this.data.params);
      
    }else{
      this.setData({
        actionId: options.actionId
      })
    }
   
    // this.getSignList(params);
  },
  //登录注册回调
  resmevent: function (e) {
    if (wx.getStorageSync('scSysUser')) {
      this.setData({
        loginType: 0,
        phone: wx.getStorageSync('scSysUser').phone
      })
      app.util.getShop(wx.getStorageSync('scSysUser').id, this.data.shopId).then((res) => {
        // debugger
        if (res.data.code == 1) {
          wx.setStorageSync('shop', res.data.data.shopInfo)
          wx.setStorageSync('shop', res.data.data.shopInfo);
          //活动
          wx.setStorageSync('goodsInfos', res.data.data.goodsInfos);
          // 所有信息
          wx.setStorageSync('shopInformation', res.data.data);
          let params = {
            actionId: this.data.actionId,
            userId: wx.getStorageSync('scSysUser').id
          }
          this.setData({
            params: params
          })
          this.getSignList(this.data.params);
          this.getAct(options.goodsId, options.shopId)
        }
      })
     
      
      // this.getData(this.data.parm)
      // this.loadFn(wx.getStorageSync('scSysUser').id)
    }
  },
  //获取用户信息回调
  resusermevent: function (e) {
    // debugger
    // if (!wx.getStorageSync('scSysUser')) {
    //   this.setData({
    //     loginType: 1
    //   })

    // }
  },
  //报名
  sign: function () {
    this.setData({
      signShow: true,
      unscroll: true
    })
  },
  signHide: function () {
    this.setData({
      signShow: false,
      unscroll: false
    })
  },
  inputSet: function (e) {
    this.setData({
      userName: e.detail.value
    })
    console.log(this.data.userName);
  },
  textSet: function (e) {
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  },
  //提交
  submit: function () {
    let _this = this;
    setTimeout(function () {
      if (_this.data.userName == undefined || _this.data.userName == '') {
        wx.showToast({
          title: '请完善信息',
          icon: 'none'
        })
        return
      }
      if (_this.data.userName) {//用户名校验
        let userFormatExp = new RegExp("^[\u4e00-\u9fa5A-Za-z]+$");
        if (!userFormatExp.test(_this.data.userName)) {
          wx.showToast({
            title: '用户名只能输入中英文',
            icon: 'none'
          });
          return
        }
        var userName = _this.data.userName.replace(/\s+/g, '');
      }
      if (_this.data.remark) {//备注校验
        let remarkFormatExp = new RegExp("[~'!@#￥$%^&*()-+_=:]");
        if (remarkFormatExp.test(_this.data.remark)) {
          wx.showToast({
            title: '备注只能输入中英文和数字',
            icon: 'none'
          });
          return
        }
        var ranges = [
          '\ud83c[\udf00-\udfff]',
          '\ud83d[\udc00-\ude4f]',
          '\ud83d[\ude80-\udeff]'
        ],
        remark = _this.data.remark.replace(new RegExp(ranges.join('|'), 'g'), '').replace(/\s+/g, '');
      }
     
      let params = {
        phone: _this.data.phone,
        remark: remark,
        userId: wx.getStorageSync('scSysUser').id,
        userName: userName,
        actionId: _this.data.actionId
      }
      app.util.reqAsync('shop/addActionUserInfo', params).then((res) => {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if (res.data.code == 1 ) {//报名成功||已报名
          _this.setData({
            signed: true,
            signShow: false,
            unscroll: false
          })
          _this.getSignList(_this.data.params);
        }
      }).catch((err) => {
        console.log(err);
      })
    }, 500)
  },
  //获取报名信息
  getSignList: function (params) {
    app.util.reqAsync('shop/getActionUserInfo', params).then((res) => {
      if (res.data.data) {
        if (res.data.data.isSignUp == 1) { // 已报名
          this.setData({
            signed: true
          })
        }
        if (res.data.data.isTime == 1) {//活动已过期
          this.setData({
            passed: true
          })
        }else{
          this.setData({
            passed: false
          })
        }
        this.setData({
          load: 'done'
        })
        if (res.data.data.userList.length > 0) {
          this.setData({
            userList: res.data.data.userList,
            signNum: res.data.data.signNum,
          })
          console.log(this.data.signNum)
        }
      }
    }).catch((err) => {
      console.log(err);
    })
  },
  onShow: function () { //缓存店铺信息（分享切店铺）
    var _this = this;

    util.checkWxLogin('share').then((loginRes) => {
      console.log(loginRes)
      if (loginRes.status == 0) {
        // if (wx.getStorageSync('isAuth') == 'no') {
        //   this.setData({
        //     loginType: 2
        //   })
        // } else if (wx.getStorageSync('isAuth') == 'yes') {
          this.setData({
            loginType: 1
          })
        // }
      } else {
        _this.setData({
          phone: loginRes.phone
        })
        var shopId = this.data.shopId
        if (!shopId) {
          shopId = wx.getStorageSync('shopId');
        }
        // var shop = wx.getStorageSync('shop')

        util.getShop(wx.getStorageSync('scSysUser').id, shopId).then(res => {
          if (res.data.code == 1) {
            wx.setStorageSync('shop', res.data.data.shopInfo)
            wx.setStorageSync('shop', res.data.data.shopInfo);
            //活动
            wx.setStorageSync('goodsInfos', res.data.data.goodsInfos);
            // 所有信息
            wx.setStorageSync('shopInformation', res.data.data);
            this.getAct(this.data.goodsId, this.data.shopId)

          }
        })

        // 判断是否有缓存店铺，没有就缓存，有就看是否需要替换


        // wx.removeStorageSync('shopId');

      }
    })
   
  },
  getAct: function (goodsId, shopId){
    var _this = this
    app.util.reqAsync('shop/goodsDetail', {
      goodsId: goodsId,
      shopId: shopId
    }).then((res) => {
      console.log(999)
      console.log(res)
      console.log(999)
      if (res.data.data) {
        res.data.data.startTime = app.util.formatActivityDate(res.data.data.startTime);
        res.data.data.endTime = app.util.formatActivityDate(res.data.data.endTime)
        _this.data.details = res.data.data;
        console.log(_this.data.details, '所有数据')
        var time = app.util.formatActivityDate(res.data.data.startTime) + '-' + app.util.formatActivityDate(res.data.data.endTime);
        this.setData({
          activityData: res.data.data,
          list: {
            time: time,
            shopName: _this.data.details.shopName,
            pictureUrl: _this.data.details.pictureUrl,
            goodsName: _this.data.details.goodsName,
            descTitle: _this.data.details.descTitle
          }
        })
        if (wx.getStorageSync('shop')){
          wx.downloadFile({//缓存网络图片，直接使用网络路径真机无法显示或绘制
            url: wx.getStorageSync('shop').logoUrl,
            success: function (downRes) {
              console.log(downRes.tempFilePath)
              _this.setData({
                logo: downRes.tempFilePath
              })
              wx.downloadFile({//缓存网络图片，直接使用网络路径真机无法显示或绘制
                url: res.data.data.pictureUrl,
                success: function (newRes) {
                  console.log(newRes.tempFilePath)
                  _this.setData({
                    proPic: newRes.tempFilePath
                  })
                  _this.drawCanvas()
                }
              })
            }
          })
        }                   
      }
    }).catch((err) => {
      console.log(err);
    })
  },
  drawCanvas: function () {
    let scale = this.data.scale
    var context = wx.createCanvasContext('shareCanvas')
    context.setFillStyle('#ffffff');
    context.fillRect(0, 0, 720 * scale, 568 * scale);//给画布添加背景色，无背景色真机会自动变黑
    context.drawImage(this.data.proPic, 0 * scale, 0 * scale, 345 * scale, 140 * scale);//绘制背景
    context.save()
    context.setGlobalAlpha(0.5) //半透明遮罩
    context.setFillStyle('#000')
    context.fillRect(0, 0, 345 * scale, 140 * scale)
    context.restore()

    context.save()
    context.beginPath();
    context.arc(40 * scale, 100 * scale, 18 * scale, 0, 2 * Math.PI);//绘制圆形头像画布
    context.fill();
    context.clip();
    context.drawImage(this.data.logo, 22 * scale, 80 * scale, 40 * scale, 40 * scale);//绘制logo
    context.restore()
    context.setFillStyle('#fff');
    context.setFontSize(15 * scale);
    context.fillText(this.data.activityData.shopName, 70 * scale, 108 * scale);//绘制店名
    context.drawImage('./img/zhuanfa_hdhb_up@2x.png', 300 * scale, 94 * scale, 19 * scale, 18 * scale);//绘制小图标

    context.setFillStyle('#000');
    context.setFontSize(17 * scale);
    context.fillText(this.data.activityData.goodsName, 25 * scale, 172 * scale);//绘制活动名
    // context.drawImage('./img/zhuanfa_hdhb_right@2x.png', 305 * scale, 160 * scale, 9 * scale, 15 * scale);//绘制小图标

    // context.setFillStyle('#f2f2f2');
    // context.fillRect(25, 185, 290 * scale, 1 * scale)

    if (this.data.activityData.descTitle.length > 16) {
      var string2 = this.data.activityData.descTitle.substring(0, 16)
      string2 = string2 + '...'
    } else {
      var string2 = this.data.activityData.descTitle
    }
    context.setFillStyle('#999');
    context.fillText(string2, 25 * scale, 232 * scale);//绘制口号
    context.drawImage('./img/zhuanfa_hdhb_clock@2x.png', 25 * scale, 260 * scale, 16 * scale, 16 * scale);//绘制小图标

    var stringTime = this.data.activityData.startTime + ' - ' + this.data.activityData.endTime
    context.setFillStyle('#999');
    context.setFontSize(16 * scale);
    context.fillText(stringTime, 50 * scale, 275 * scale);//绘制时间

    let _that = this
    context.draw(false, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 720,
        height: 568,
        destWidth: 720,
        destHeight: 568,
        fileType: 'jpg',
        canvasId: 'shareCanvas',
        success: function (res) {
          _that.setData({
            temp: res.tempFilePath
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    })

  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
      this.setData({
        scale: res.windowWidth / 375
      })
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log()
    }

    return {
      title: '[' + this.data.activityData.shopName + ']'  + this.data.activityData.descTitle,
      path: "pages/store/posterActivity/posterActivity?shopId=" + this.data.shopId + '&goodsId=' + this.data.goodsId + '&actionId=' + this.data.actionId + '&signType=' + this.data.signType,
      imageUrl: this.data.temp,
      success: function (res) {
        _this.updateforwardingAmount(_this.data.goodsId) // 用户转发点击量统计
      }
    }
  },
  goback: function () {//回到首页按钮
    wx.switchTab({
      url: '../../index/index?shopId=' + this.data.shopId
    })
  },
  // 用户转发点击量统计
  updateforwardingAmount(goodsId){
    app.util.reqAsync('shop/updateforwardingAmount', {
      goodsId: goodsId,
      type: 0     // 0:增加    1:减少
    }).then((res) => {

    })
  },
  // 关于活动海报的
  // 点击分享后 点击取消
  shareBtn: function () {
    this.setData({
      shareViewShow: !this.data.shareViewShow
    })
  },
  // 生成海报
  saveImg: function () {
    console.log('生成海报po');
    console.log(this.data.list, '我是list')
    this.setData({
      shareViewShow: !this.data.shareViewShow,
      shareShow: !this.data.shareShow
    })
  },
  btn_img: function () {
    console.log('点击了。。。po')
    //创建节点选择器
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.every3').boundingClientRect(function (rect) {
      that.setData({
        oW3: rect.width
      })
      that.draw3()
    }).exec();
  },
  draw3: function () {
    var size = this.setCanvasSize3();//动态设置画布大小
    var scale = this.data.scale3;
    var _this = this
    var context = wx.createCanvasContext('myCanvas3');
    // 背景图
    context.drawImage('../../../images/bg3.png', 0, 0, 351 * scale, 702 * scale);
    // 内容背景
    context.drawImage('../../../images/bg8.png', 24 * scale, 28 * scale, 314 * scale, 361 * scale);
    // 扫码 
    context.drawImage('../../../images/saoma.png', 150 * scale, 412 * scale, 150 * scale, 75 * scale);
    // 活动模板
    context.save()
    context.beginPath()
    // context.arc(50, 50, 25, 0, 2 * Math.PI)
    // context.arc(50, 150, 25, 0, 2 * Math.PI)
    // context.clip()
    // context.drawImage(_this.data.list.pictureUrl, 13 * scale, 38 * scale, 310 * scale, 130 * scale);
    context.restore()
    // 时间
    context.setFontSize(12 * scale);
    context.setFillStyle('#FE732D');
    context.fillText('活动时间：' + _this.data.list.time, (size.w - context.measureText('活动时间：' + _this.data.list.time).width) / 2, 200 * scale);
    context.setFontSize(18 * scale);
    context.setFillStyle('#333333');
    context.fillText(_this.data.list.goodsName, (size.w - context.measureText(_this.data.list.goodsName).width) / 2, 230 * scale);
    context.setStrokeStyle('#FB452C');
    context.setLineWidth(3 * scale)
    context.moveTo(155 * scale, 250 * scale)
    context.lineTo(195 * scale, 250 * scale)
    context.stroke()
    // 活动口号
    context.setFontSize(13 * scale);
    context.setFillStyle('#999999');
    context.fillText(_this.data.list.descTitle, (size.w - context.measureText(_this.data.list.descTitle).width) / 2, 275 * scale);
    // 详情描述
    var st = '每日中午12—14时，凡在我餐厅就餐5人以上的顾客，每人均赠河豚一条，数量有限，每日送完为止，可预约。';
    var arr = st.split('');
    var st1 = '';
    var st2 = '';
    var st3 = '';
    var st1Len = 0;
    var st2Len = 0;
    var st3Len = 0;
    var flg = false
    arr.forEach(function (item, index) {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (st1Len < 17) {
        st1 += item
        if (reg.test(item)) {
          st1Len += 1;
        } else {
          st1Len += 0.5;
        }
      } else {
        if (st2Len < 17) {
          st2 += item
          if (reg.test(item)) {
            st2Len += 1;
          } else {
            st2Len += 0.5;
          }
        } else {
          if (st3Len < 17) {
            st3 += item
            if (reg.test(item)) {
              st3Len += 1;
            } else {
              st3Len += 0.5;
            }
          } else {
            if (flg === false) {
              st3 += '...';
              flg = true;
            }
          }
        }
      }
    });
    context.setFillStyle('#666666');
    context.fillText(st1, (size.w - context.measureText(st1).width) / 2, 300 * scale);
    context.fillText(st2, (size.w - context.measureText(st2).width) / 2, 320 * scale);
    context.fillText(st3, (size.w - context.measureText(st3).width) / 2, 340 * scale);
    this.foundRect(context, 20, 40, 305, 130, 28);
    // 标题
    context.drawImage('../../../images/bg9.png', 43 * scale, 19 * scale, 149 * scale, 37 * scale);
    context.setFontSize(16 * scale);
    context.setFillStyle('#FB452C');
    var title = _this.data.list.shopName;
    if (title.length > 6) {
      title = title.substring(0, 6) + '...';
    }
    context.fillText(title, 67 * scale, 42 * scale);
    context.draw(false, function () {
      wx.canvasToTempFilePath({//绘制完成执行保存回调
        x: 0,
        y: 0,
        width: 351,
        height: 531,
        destWidth: 702,
        destHeight: 1062,
        fileType: 'jpg',
        canvasId: 'myCanvas3',
        success: function (res) {
          console.log(res.tempFilePath)
          // 保存图片到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
            }
          })
        }
      })
    });
  },
  //适配不同屏幕大小的canvas
  setCanvasSize3: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      // var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var scale = res.windowWidth / this.data.oW3;
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
      this.setData({
        scale3: res.windowWidth / 375
      })
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  // 圆角
  foundRect: function (ctx, x, y, w, h, r) {
    ctx.save();
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    ctx.beginPath();
    ctx.setStrokeStyle('#fff');
    ctx.setLineWidth(1);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.clip();
    ctx.drawImage(this.data.list.pictureUrl, 20, 40, 305, 130);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  
})