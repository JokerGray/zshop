// pages/spelldetails/spelldetails.js
const app = getApp();

Page({
  data: {
    isMaster: false, //是否拼主 0不是1是  #int  
    groupId: '', //拼团id
    pictureUrl: '', //商品图片
    goodsTitle: '',  //商品名称
    discountPrice: '',//拼团价格
    descTitle: '',  //商品描述
    endTime: '',     //结束时间
    timeStatus: '', //拼团状态 0进行中 1成团 2过期失败#int
    lackUser: '', //成团缺少人数#int
    moreGroupList: [], //推荐更多拼团商品list
    groupOrderList: [], //已加入拼团用户list
    groupOrderListLength: '',
    showStock: false,
    loading: false,

    shopId: '',
    goodId: '',
    population: '', //几人团
    spellUser: '',
    orderStatusVo: '', //付款状态 
    stockId: '', //商品是否有默认规格，默认规格 不返回 stockId
    timer: '',
    count: '',
    total: 0,//总价
    balance: 0,
    select: 0,//商品规模
    number: 1,//商品数量
    smallGroupId: '',
    stockPrice: 0,//商品单价
    flag: false,//控制弹框渲染
    d: '',
    h: '',
    m: '',
    s: '',
    shopData: {},//订单数据
    shopList: [],
    parm: {},//数据模板
    userId: ''//当前用户ID
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

    console.log(wx.getStorageSync('scSysUser'));

    this.setData({
      userId: wx.getStorageSync('scSysUser').id,
      groupId: options.groupId,
      orderNo: options.orderNo,
      population: options.population,
      shopId: options.shopId,
      cUser: options.cUser,
      orderStatusVo: options.orderStatusVo,
      stockId: options.stockId
    })
    app.util.getShop(wx.getStorageSync('scSysUser').id, options.shopId).then((res) => {
      // debugger
      if (res.data.code == 1) {
        wx.setStorageSync('shop', res.data.data.shopInfo)
      }
    })
    console.log('orderStatusVo:' + this.data.orderStatusVo);
    app.util.reqAsync('shopSecondskilActivity/getServerNowTime').then((res) => {
      console.log(res.data.data)
      if (res.data.data) {
        this.setData({
          nowTime: app.util.formatIOS(res.data.data)
        })
      }
    })

    console.log('stockId:' + this.data.stockId);
    app.util.reqAsync('shop/getGroupBuyOrderDetail', {
      groupId: this.data.groupId, //拼团id
      orderNo: this.data.orderNo, //订单编号
      pageNo: 1,
      shopId: this.data.shopId,//店铺id
      pageSize: 10,
      cUser: this.data.cUser//拼团用户
    }).then((res) => {
      // debugger;

      var data = res.data.data;
      console.log(data)

      for (var i = 0; i < data.groupOrderList.length; i++) {
        if (data.groupOrderList[i].id == this.data.userId) {
          this.setData({
            isMaster: true
          })
        }
      }
      if (data.endTime) {
        this.setData({
          endTime: app.util.formatIOS(data.endTime),

        })
      }
      this.setData({
        groupId: data.groupId,
        loading: true,
        pictureUrl: data.pictureUrl,
        goodsTitle: data.goodsTitle,
        descTitle: data.descTitle,
        discountPrice: data.discountPrice,
        timeStatus: data.timeStatus,
        lackUser: data.lackUser ? data.lackUser : 0,
        moreGroupList: data.moreGroupList,
        groupOrderList: data.groupOrderList,
        groupOrderListLength: data.groupOrderList.length,
        goodId: data.goodsId,
        smallGroupId: data.smallGroupId
      })

      var parms = {
        shopId: this.data.shopId,
        goodsId: this.data.goodId,
        customerId: wx.getStorageSync('scSysUser').id
      };
      this.setData({
        parm: parms

      })
      this.getData(this.data.parm)
      console.log(this.data.endTime)
      console.log(this.data.nowTime)
      let count = this.data.endTime - this.data.nowTime;
      console.log('goodId:' + this.data.goodId);
      this.setData({
        count: count
      })
    })
    let _this = this
    clearInterval(_this.data.timer)
    this.data.timer = setInterval(function () {
      _this.count()
    }, 1000)
    // 刷新页面
    this.refreshRequest();
  },
  onShow: function (e) {
    //调接口
    app.util.reqAsync('shop/getGroupBuyOrderDetail', {
      groupId: this.data.groupId, //拼团id
      orderNo: this.data.orderNo, //订单编号
      pageNo: 1,
      shopId: this.data.shopId,//店铺id
      pageSize: 10,
      cUser: this.data.cUser//拼团用户
    }).then((res) => {
      // debugger;
      console.log(res);
      if (res.data.data.endTime) {
        this.setData({
          endTime: app.util.formatIOS(res.data.data.endTime),
        })
      }
      if (res.data.code == 1) {
        var data = res.data.data;
        this.setData({
          // isMaster: data.isMaster,
          groupId: data.groupId,
          pictureUrl: data.pictureUrl,
          goodsTitle: data.goodsTitle,
          descTitle: data.descTitle,
          discountPrice: data.discountPrice,
          timeStatus: data.timeStatus,
          lackUser: data.lackUser ? data.lackUser : 0,
          moreGroupList: data.moreGroupList,
          groupOrderList: data.groupOrderList,
          groupOrderListLength: data.groupOrderList.length
        })
        this.setData({
          data: data
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch((err) => {
      console.log(err)
      wx.showToast({
        title: '失败。。',
        icon: 'none'
      })
    })

  },
  showRule: function () {
    this.setData({
      showStock: true
    });
  },
  closeMask: function () {
    this.setData({
      showStock: false
    });
  },
  //获取订单数据
  getData: function (parm) {
    this.setData({
      number: 1,
      select: 0,
      total: 0,
      stockPrice: 0,
      balance: 0
    })
    app.util.reqAsync('shop/goodsDetailAddGroupBuying', parm).then((res) => {//获取商品详情数据
      if (res.data.data) {
        console.log(res.data.data)
      
        this.setData({
          shopData: res.data.data,
          shopList: res.data.data.scShopGoodsStockList,
          balance: res.data.data.scShopGoodsStockList ? res.data.data.scShopGoodsStockList[0].stockNum : 0,
          stockPrice: res.data.data.scShopGoodsStockList ? res.data.data.scShopGoodsStockList[0].stockBatchPrice : 0,
          total: res.data.data.scShopGoodsStockList ? (res.data.data.scShopGoodsStockList[0].stockBatchPrice * this.data.number).toFixed(2) : 0      
        })

      }
      // wx.hideLoading();
      let _this = this
      wx.downloadFile({//缓存商品图片，直接使用网络路径真机无法显示或绘制
        url: this.data.pictureUrl,
        success: function (res) {
          console.log(res.tempFilePath)
          _this.setData({
            proPic: res.tempFilePath
          })
          //canvas绘图
          if (_this.data.status == 1) {//拼团
            _this.drawPicGroup();
          } else if (_this.data.status == 2) {//秒杀
            _this.drawPicSeckill();
          }
        }
      })
    })
  },
  //改变数量
  change: function (e) {//规格弹窗增加减少商品数量
    var option = e.currentTarget.id,
      number = this.data.number,
      // secondKillInfo = this.data.data.secondKillInfo[this.data.select],
      num;
    if (option == 'add') {//加数量
      number += 1;
      num = 1;
      // if (this.data.status == 1 && this.data.spellingType == 0 && (this.data.data.limitNum > 0 && number > this.data.data.limitNum)) {//拼团限购数量
      if (number > this.data.shopData.scShopGoodsStockList[this.data.select].stockNum) {
        wx.showToast({
          title: '已超过最大购买数量',
          icon: 'none'
        })
        return
      }
    } else if (option == 'minus') {//减数量
      number -= 1;
      num = -1;
      if (number < 1) {
        number = 1
        return
      }
    }
    // var price //规格价格
    console.log()
    this.setData({
      number: this.data.number + num,
      stockPrice: this.data.shopData.scShopGoodsStockList[this.data.select].stockBatchPrice,
      total: (this.data.stockPrice * number).toFixed(2) //价格保留两位小数
    })
  },
  //下单
  buyNow: function () {
    let urls = '../secKillBuy/secKillBuy?realMoney=' + this.data.total + '&goodsId=' + this.data.shopData.scShopGoodsStockList[0].goodsId + '&goodsPrice=' + this.data.stockPrice + '&goodsType=' + this.data.shopData.goodsType + '&remake=' + this.data.shopData.scShopGoodsStockList[this.data.select].stockName + '&stockId=' + this.data.shopData.scShopGoodsStockList[this.data.select].id + '&goodsName=' + this.data.shopData.goodsName + '&stockName=' + this.data.shopData.scShopGoodsStockList[this.data.select].stockName + '&goodsNum=' + this.data.number + '&pictureUrl=' + this.data.shopData.pictureUrl + '&deliveryCalcContent=' + this.data.shopData.deliveryCalcContent + '&isSeckill=' + 0 + '&groupId=' + this.data.shopData.isGroupBuying + '&limitNum=' + this.data.shopData.limitNum + '&SmallGroupId=' + this.data.smallGroupId + "&spellingType=" + 1;
    console.log(urls)
    console.log(this.data.smallGroupId + '===============')
    wx.navigateTo({
      url: urls,
    })
  },
  //选规模
  chose: function (e) {//选择规格
    this.setData({
      select: e.currentTarget.dataset.index,
      balance: this.data.shopData.scShopGoodsStockList[e.currentTarget.dataset.index].stockNum
    })
  },
  preventTouchMove: function () {

  },
  closeMask: function () {//关闭遮罩
    this.setData({
      flag: false
      // untouch: 'touch'
    })
    this.getData(this.data.parm)

    // this.getData(this.data.parm)
  },
  // 参与拼单
  participate: function (e) {
    this.setData({
      flag: true
    })
   
  },
  // 再次发起拼单
  // 1 拼团 2 秒杀 3 普通商品
  againInitiate: function (e) {
    // debugger;

    // return
    if (this.data.stockId) {
      wx.navigateTo({
        url: '../goodsDetial/goodsDetial?shopId=' + this.data.shopId + '&goodsId=' + this.data.goodId
      })
    } else {
      wx.navigateTo({
        url: '../goodsDetial/goodsDetial?shopId=' + this.data.shopId + '&goodsId=' + this.data.goodId
      })
    }
  },
  // 跳转商品详情
  // 1 拼团 2 秒杀 3 普通商品
  goToGroupBuy: function (e) {
    var goodsid = e.currentTarget.dataset['goodsid']
    var groupId = e.currentTarget.dataset['groupid']
    var shopId = e.currentTarget.dataset['shopid']
    console.log(goodsid);
    console.log(groupId);
    console.log(shopId);
    var user = wx.getStorageSync('scSysUser')
    wx.navigateTo({
      url: '../goodsDetial/goodsDetial?goodsId=' + goodsid + '&shopId=' + shopId,
      success: function (res) {
        // success
      }
    })
  },
  // 倒计时方法
  count: function () {
    let leftTime = this.data.count;
    leftTime -= 1000;
    if (leftTime <= 0) {
      leftTime = 0;
    }
    let d = Math.floor(leftTime / 1000 / 60 / 60 / 24),
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24),
      m = Math.floor(leftTime / 1000 / 60 % 60),
      s = Math.floor(leftTime / 1000 % 60)
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    this.setData({
      count: leftTime,
      d: d,
      h: h,
      m: m,
      s: s
    })
  },
  // 定时2分钟自动请求服务器一次
  refreshRequest: function () {
    var refreshTimer;
    refreshTimer = setInterval(this.onShow, 120000);
  },
  primary: function () {
    wx.switchTab({
      url: '../index/index',
    })
  }

})