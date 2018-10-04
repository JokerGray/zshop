//index.js
import util from '../../utils/util.js'

// import indexJson from './index.json'
var USER_URL = {
  GETUSER: 'newservice/getServiceUserInfo', //获取头部列表
  GETENSHRINEVIDEO: 'newservice/findVideoEnshrineListForProgram', //收藏列表
  QUERYVIDEO: 'newservice/findNewServiceVideoListByUserIdForProgram', //视频查询
  // LOOKUPSHOP: 'newservice/findVideoShopByUserId', //查看店铺
  LOOKUPSHOP: 'shop/getMercartIdShopList', // 新的查看店铺
  LOOKPOWDER: 'newservice/findServiceVideoFollowListForFollow', //个人页的粉丝和关注查询
  GETFANSLIST: 'newservice/findServiceVideoFollowListForFans', //获取粉丝列表
  DELETEVIDEO: 'newservice/deleteServiceVideo', //删除视频
  REVISEVIDEO: 'newservice/updateServiceVideo', //修改视频
  CONLLECT: 'newservice/insertVideoEnshrine', //收藏视频
  DELCONLLECT: 'newservice/delVideoEnshrine', //取消收藏
  MOHE_COMMENT: 'newservice/findServiceVideoCommentListByVideoId',//视频id评论查询列表接口
  ADD_COMMENT: 'newservice/insertServiceVideoComment', //新增评论接口
}

//获取应用实例
const app = getApp()
Page({
  data: {
    page: 1,
    row: 10,
    longitude: "", //经纬度
    latitude: "", //经纬度
    showCartList: false, //查看店铺
    userInfo: {},
    hasUserInfo: false,
    left: '105rpx',
    maxHeight: 0,
    dataData: {}, //个人信息
    userData: {}, //个人信息
    scrollTop: 100,
    bottom: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [], // 作品数据 和 收藏数据
    itemsCollect: [], //  个人收藏 存数据
    isGohome: 1, //初始值
    isGoshop: 1,
    isPartner: 1,
    isShowShop: 1,
    idx: 1,
    showImgPoint: true, //显示三个小点
    userID: 0, //本人用户ID
    itemsOneself: [], //个人作品的初始值
  },
  onShow: function(e) {
    wx.setStorageSync('types', 1)
    this.setData({
      left: '105rpx',
      showImgPoint: true
    })
    if (this.data.items.length == 0) {
      this.setData({
        showOpus: true,
        showCollect: false
      })
    }
    //显示我的作品
    var types = wx.getStorageSync('types')

    // //个人作品展示
    this.getUpVideo();
    //个人收藏 展示
    var paramsCollection = {
      "page": "0",
      "userId": this.data.userID,
      "longitude": this.data.longitude,
      "latitude": this.data.latitude,
      "row": "50",
      "queryUserId": this.data.userID
    }
    this.userCollection(paramsCollection);
    //个人关注
    var paramsfans = {
      "userId": this.data.userID, //用户Id，必填
      // "queryUserId": "2232", //登录用户Id，选填
      "page": "0", //分页数，起始0，必填
      "row": "50" //行数，必填
    }
    //个人关注
    this.UserConcern(paramsfans);

    //个人粉丝
    this.UserPowder(paramsfans);


  },
  //在上面，拉刷新
  //下拉刷新（在上面刷新）
  onPullDownRefresh: function(e) {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var types = wx.getStorageSync('worksTypes')
    if (types == 3) {
      this.getUpVideo();
      console.log('我是刷新')
      // wx.removeStorageSync('worksTypes')
    } else {
      console.log('已经在show里面触发');
    }
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {

    var that = this;
    var types = wx.getStorageSync('worksTypes')

    if (types == 3) {
      if (this.data.items.length % 10 != 0 || this.data.items.length == 0) {
        this.setData({
          bottom: true,
          showOpus: false,
          showCollect: false
        })
      } else {
        this.getOneselfWorks();
      }

    } else {
      console.log('已经在show里面触发')
    }

  },
  //点击跳转关注与粉丝
  navigateToAll: function(e) {

    let url = e.target.dataset.url;
    wx.navigateTo({
      url: url + '&userID=' + this.data.userID
    })
  },
  //菜单栏
  windowTab: function(e) {
    let types = e.target.dataset.type
    if (types == 1) {
      wx.setStorageSync('types', types)
      wx.setStorageSync('worksTypes', 3)
      //如果点击删除了，就刷新，新的数据
      this.setData({
        left: '105rpx',
        showImgPoint: true,
        page: 1,
        items: this.data.itemsOneself
      })
      //展示个人作品
      this.getUpVideo();
      // listData
      if (this.data.items.length == 0) {
        this.setData({
          showOpus: true,
          showCollect: false
        })
      }
    } else {
      wx.setStorageSync('types', types)
      wx.removeStorageSync('worksTypes')
      // this.videoContext.pause();
      this.setData({
        left: '480rpx',
        items: this.data.itemsCollect,
        showImgPoint: false
      })
      if (this.data.itemsCollect.length == 0) {
        this.setData({
          showCollect: true,
          showOpus: false,
        })
      }
    }
    this.setData({
      aaaa: false
    })

  },
  onLoad: function(e) {
    var lon = wx.getStorageSync('jd');
    this.data.longitude = lon.longitude;
    this.data.latitude = lon.latitude;

    //获取用户信息
    var scSysUser = wx.getStorageSync('scSysUser')
    console.log(scSysUser, '获取用户信息')
    this.setData({
      userID: scSysUser.id
    })
    var that = this
    let params = {
      userId: scSysUser.id,
      queryUserId: scSysUser.id,
    }
    //用户信息查询
    this.userinfo(params)

    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          height: res.windowHeight - 10 + 'px'
        })
      }
    })
    //请求
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //方法1,用户信息查询
  userinfo: function(params) {
    var that = this
    util.reqAsync(USER_URL.GETUSER, params).then(res => {
      console.log(res.data)
      if (res.data.code == 1) {
        var datas = res.data.data;

        var userisGoHome = datas.isGoHome == 'true' ? true : false
        var userisPartner = datas.isPartner == 'true' ? true : false
        console.log('个人信息接口开始', datas)
        var userData = datas.scSysUser;
        that.setData({
          dataData: datas,
          userData: userData,
          userisGoHome: userisGoHome,
          userisPartner: userisPartner
        })
        console.log('个人信息接口结束')
      }
    })
  },
  //方法2，个人关注
  UserConcern: function(paramsfans) {
    util.reqAsync(USER_URL.LOOKPOWDER, paramsfans).then(res => {
      if (res.data.code == 1) {
        this.setData({
          followLength: res.data.data.length
        })
      }
    })
  },
  //方法3 个人粉丝
  UserPowder: function(paramspowder) {
    util.reqAsync(USER_URL.GETFANSLIST, paramspowder).then(res => {
      if (res.data.code == 1) {
        this.setData({
          userpowderlength: res.data.data.length
        })
      }
    })
  },
  //方法4，个人收藏
  userCollection: function(params) {

    // console.log(params, '123')
    let types = wx.getStorageSync('types');
    util.reqAsync(USER_URL.GETENSHRINEVIDEO, params).then(res => {
      //获取当前的时间撮
      var timestamp = (new Date()).valueOf();

      if (res.data.code == 1 && res.data.data.length >= 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          var timeSpanStr = util.formatMsgTime(timestamp, res.data.data[i].createTime)
          res.data.data[i].timeSpanStr = timeSpanStr; //时间
          var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity) //距离
          res.data.data[i].distance = distance; //距离
        }
        this.data.itemsCollect = res.data.data;

        if(types==1){
          this.setData({
            itemsCollectLength: res.data.total
          })
        }else{
          this.setData({
            items: res.data.data,
            itemsCollectLength: res.data.total
          })
        }
       
      }
    })
  },


  //最终的收藏
  collectA: function(e) {
    //个人收藏参数
    let paramsCollection = {
      "page": "0",
      "userId": this.data.userID,
      "longitude": this.data.longitude,
      "latitude": this.data.latitude,
      "row": "50",
      "queryUserId": this.data.userID
    }

    console.log(wx.getStorageSync('types'))
    let types = wx.getStorageSync('types');
    console.log(e, '我是收藏');
    var that = this;
    // let userId = e.currentTarget.dataset.userid;
    let userId = this.data.userID;
    let serviceVideoIds = e.currentTarget.dataset.id;
    var arr = this.data.items;
    let collection = e.currentTarget.dataset.collection;
    if (collection) {  //取消收藏
      let params = {
        userId: userId,
        serviceVideoIds: [serviceVideoIds]
      }
      util.reqAsync(USER_URL.DELCONLLECT, params).then(res => {
        if (res.data.code == 1) {
          var itemsOneself = that.data.items;
          for (var i = 0; i < itemsOneself.length; i++) {
            if (serviceVideoIds == itemsOneself[i].id) {
              itemsOneself[i].collection = false;
            }
          }
          // console.log(itemsOneself[i].id)
          console.log(serviceVideoIds,'1323');
          //如果在作品里面
          console.log(itemsOneself,'我是最后的数据')
          if (types==1){
            console.log('我是取消')
            that.setData({
              items: itemsOneself,
              itemsOneself: itemsOneself
            })
          }
          this.userCollection(paramsCollection);
          
        }
      })
    } else {
      let params = {
        serviceVideoId: serviceVideoIds,
        userId: userId
      }
      util.reqAsync(USER_URL.CONLLECT, params).then(res => {
        if (res.data.code == 1) {
          var itemsOneself = that.data.items;
          for (var i = 0; i < itemsOneself.length; i++) {
            if (serviceVideoIds == itemsOneself[i].id) {
              itemsOneself[i].collection = true;
            }
          }
          //如果在作品里面
          if (types == 1) {
            that.setData({
              items: itemsOneself,
              itemsOneself:itemsOneself
            })
            }
            this.userCollection(paramsCollection);
        } 
      })
    }
    // this.setData({
    //   items: arr
    // })
  },

  //点击评论
  collectComment: function (e) {
    wx.removeStorageSync('replyC')
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)

    var userId = e.currentTarget.dataset.id; // 视频id
    var videoId = e.currentTarget.dataset.userid; //用户id 用户id
    wx.setStorageSync('userIdIndex', userId) //视频id
    wx.setStorageSync('videoIdIndex', videoId)
    var params = {
      page: 0,
      userId: videoId, //用户id
      videoId: userId, //视频id
      row: 50
    };
    util.reqAsync(USER_URL.MOHE_COMMENT, params).then(res => {
      // console.log(params, 'ddd')
      if (res.data.code == 1) {
        this.setData({
          replycomment: res.data.data,
          commentlength: res.data.data.length,
          showCommentCartList: true,
          aaaa: false,
          focusReply: false
        })
      }
    })
  },
  //评论回复
  replyComment: function (e) {
    // console.log(e);
    wx.setStorageSync('replyC', e.currentTarget.dataset.reply);
    wx.setStorageSync('itemreply', e.currentTarget.dataset.itemreply);
    // console.log(this.);
    this.setData({
      focusReply: true,
      scrollTopComment: 10000
    })

  },
  //点击完成触发 发送评论
  bindOnclick: function (e) {
    var replyC = wx.getStorageSync('replyC')
    var itemreply = wx.getStorageSync('itemreply')
    console.log(itemreply, '我是什么ID')
    //判断如果返回的是1,那么就是回复
    if (replyC == 1) {
      console.log('我是回复')
      var paramsReply = {
        "userId": this.data.userID,  //用户id, 必填
        "type": 1,  //类型0评论1回复，必填
        "videoId": itemreply.videoId, //视频Id，必填
        "commentId": itemreply.id, //回复Id，type = 1时必填
        "commentcontent": e.detail.value//必填
      }
      console.log(paramsReply, '回复数据')
      util.reqAsync(USER_URL.ADD_COMMENT, paramsReply).then(res => {
        // console.log(res.data.code, '新增评论')
        if (res.data.code == 1) {
          console.log(res.data.data, '我是评论成功')
          // console.log('视频新增成功')
          // replycomment:res.data.data
          var paramsComment = {
            page: 0,
            userId: itemreply.userId,
            videoId: itemreply.videoId,
            row: 50
          };
          //查看评论
          util.reqAsync(USER_URL.MOHE_COMMENT, paramsComment).then(res => {
            console.log(res.data.data, '我是回复后来的数据')
            if (res.data.code == 1) {
              this.setData({
                replycomment: res.data.data,
                commentlength: res.data.data.length,
                scrollTopComment: 0,
                inputReply: ''
              })
              wx.removeStorageSync('replyC')
            }
            // console.log(this.data.replycomment, '查看评论数据')
          })
        }
      })

    } else {

      // 获取头像
      //获取时间戳
      var videoId = wx.getStorageSync('userIdIndex'); // 视频id
      var userId = wx.getStorageSync('videoIdIndex'); //用户id
      var params = {
        "userId": this.data.userID, //用户id, 必填
        "type": 0, //类型0评论1回复，必填
        "videoId": videoId, //视频Id，必填
        // "commentId": "587", //回复Id，type = 1时必填,对象的id
        "commentcontent": e.detail.value //必填
      }
      // console.log(params)
      util.reqAsync(USER_URL.ADD_COMMENT, params).then(res => {
        if (res.data.code == 1) {
          var paramsComment = {
            page: 0,
            userId: userId,
            videoId: videoId,
            row: 50
          };
          //查看评论
          util.reqAsync(USER_URL.MOHE_COMMENT, paramsComment).then(res => {
            // console.log(res.data.data)
            if (res.data.code == 1) {
              this.setData({
                replycomment: res.data.data,
                commentlength: res.data.data.length,
                scrollTopComment: 0,
                inputReply: ''
              })
            }
          })
        }
      })
    }

  },

  onPageScroll: function(e) { // 获取滚动条当前位置
    var idx = this.data.idx - 1;
    if ((e.scrollTop - 300) > (550 * this.data.idx)) {
      // this.videoContext.pause();
      this.setData({
        aaaa: false
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //处理  video 遮挡层
  onReady: function(e) { //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo');
  },
  //点击按钮，显示播放
  videoPlay: function(e) {
    console.log(e, '点击播放视频');
    this.setData({
      aaaa: true,
      curr_id: e.currentTarget.dataset.id,
      idx: e.currentTarget.dataset.idx + 1
    })
    this.videoContext.play()
  },
  //我是第二次点击播放
  videoTwoPlay: function(e) {
    this.setData({
      aaaa: true
    })
    this.videoContext.play();
  },
  tapVideo: function() {
    wx.navigateTo({
      url: '../video/video',
    })
  },
  //点击查看店铺详情
  lookShopDetailed: function(e) {
    console.log(e);
    var that = this;
    var userId = e.currentTarget.dataset.id;
    var params = {
      page: "0",
      userId: userId,
      row: "10"
    };
    //查看店铺
    util.reqAsync(USER_URL.LOOKUPSHOP, params).then(res => {
      if (res.data.code == 1) {
        console.log('店铺查询成功', res.data.data);
        // if(res.data.data.length>0){
        this.setData({
          LookShopItem: res.data.data,
          showCartList: true,
          aaaa: false
        })
        // }
      }
    })
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)

  },
  //打开另一个小程序
  loolshopIn: function(e) {
    wx.setStorageSync('shopId', e.currentTarget.dataset.id)
    console.log(e)
    if (this.data.LookShopItem[e.currentTarget.dataset.index].address == null) {
      wx.showToast({
        title: '该店铺已经下线',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wxd471bb4262ac7505',
        path: 'pages/index/index?shopId=' + e.currentTarget.dataset.id,
        extraData: {},
        envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
    }
  },
  // 点击后，进入店铺详情
  onShopdetails: function(e) {
    console.log(e.currentTarget.dataset.item, 1);
    wx.setStorageSync('itemShopdetails', e.currentTarget.dataset.item)

    if (this.data.LookShopItem[e.currentTarget.dataset.index].address == null) {
      wx.showToast({
        title: '该店铺已经下线',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '../shopdetails/shopdetails'
      })
    }

  },
  //启动动画
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  //关闭动画
  fadeDown: function() {
    this.animation.translateY(350).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  //点击多个小点点，编辑视频
  userinfoShopImg: function(e) {
    // console.log(e.currentTarget.dataset,'获取视频ID');

    //首先查看是否有店铺
    this.LookIsShowShop(e.currentTarget.dataset.userid);

    var switchList = e.currentTarget.dataset.itema

    this.setData({
      isGoshop: switchList.isGoshop,
      isGohome: switchList.isGohome,
      isPartner: switchList.isPartner
    })

    wx.setStorageSync('deleteUserId', e.currentTarget.dataset)
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)
    this.setData({
      aaaa: false,
      edioVedio: true,
      switchList: switchList
    })
  },
  //查看是否有店铺，然后显示是否隐藏
  LookIsShowShop: function(userId) {
    var that = this;
    var params = {
      page: "0",
      userId: userId,
      row: "10"
    };
    //查看店铺
    util.reqAsync(USER_URL.LOOKUPSHOP, params).then(res => {
      if (res.data.code == 1) {
        console.log('店铺查询成功', res.data.data);
        this.setData({
          LookShopItem: res.data.data
        })
      }
    })
  },

  //是否到店，是否找店，目前都是默认值
  switchCheck: function(e) {
    let name = e.target.dataset.i
    // console.log(e,'12345612346')
    if (e.detail.value) {
      if (name == 'home') { //到家
        this.setData({
          isGohome: 1
        })
      } else if (name == 'shop') { //合作
        this.setData({
          isShowShop: 1
        })
      } else if (name == 'merchant') { //到店
        // debugger
        this.setData({
          isPartner: 1
        })
      }
    } else {
      if (name == 'home') {
        this.setData({
          isGohome: 0,

        })
      } else if (name == 'shop') {
        this.setData({
          isShowShop: 0,
        })
      } else if (name == 'merchant') {
        // debugger
        this.setData({
          isPartner: 0,
        })
      }
    }

  },
  //删除视频
  deleteVideo: function() {
    var deleteUserId = wx.getStorageSync('deleteUserId')
    console.log(deleteUserId);
    var params = {
      "userId": this.data.userID,
      "idList": [deleteUserId.id] //视频Id
    }
    var that = this;
    wx.showModal({
      title: '是否删除视频？',
      success: function(res) {
        if (res.confirm) {
          util.reqAsync(USER_URL.DELETEVIDEO, params).then(res => {
            console.log(res, '123');
            if (res.data.code == 1) {
              wx.showToast({
                title: '视频删除成功'
              })
              console.log(123);
              // 然后刷新初始数据
              // that.getUpVideo();
              //更新数据，从数组中删除
              that.data.itemsOneself = that.data.items;

              //通过视频id找到对应的视频
              for (var i = 0; i < that.data.itemsOneself.length; i++) {
                if (deleteUserId.id == that.data.itemsOneself[i].id) {
                  that.data.itemsOneself.splice(i, 1)
                }
              }
              that.data.itemsLength = that.data.itemsLength - 1
              if (that.data.itemsOneself.length == 0) {
                that.setData({
                  showOpus: true,
                  showCollect: false
                })
              }
              that.setData({
                items: that.data.itemsOneself,
                itemsLength: that.data.itemsLength
              })

              //动画
              var animation = wx.createAnimation({
                duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
                timingFunction: 'ease', //动画的效果 默认值是linear
              })
              that.animation = animation
              that.fadeDown(); //调用隐藏动画
              setTimeout(function() {
                  that.setData({
                    edioVedio: false
                  })
                },
                720)
            }
          })
        } else {
          that.setData({
            edioVedio: false
          })
        }
      }
    })
  },
  //点击修改视频
  clickAmendVideo: function(e) {

    var deleteUserId = wx.getStorageSync('deleteUserId')

    if (this.data.LookShopItem.length > 0) {
      this.data.isShowShop == 1 ? 1 : 0
    } else {
      this.data.isShowShop = 0;
    }

    var params = {
      "isGoshop": this.data.isGoshop, //到店
      "isPartner": this.data.isPartner, //合作
      "isGohome": this.data.isGohome, //到家
      // "videoHeight": deleteUserId.itema.videoHeight,
      // "videoIntroduce": deleteUserId.itema.videoIntroduce,
      "isShowShop": this.data.isShowShop,
      // "coverUrl": deleteUserId.itema.coverUrl,
      // "videoUrl": deleteUserId.itema.videoUrl,
      // "videoPhone": [],
      "userId": this.data.userID,
      "serviceVideoId": deleteUserId.id,
      // "videoWidth": deleteUserId.itema.videoWidth,
      // "longitude": deleteUserId.itema.longitude,
      // "latitude": deleteUserId.itema.latitude
    }
    console.log(params, '传递的参数');

    util.reqAsync(USER_URL.REVISEVIDEO, params).then(res => {
      var goHome = params.isGohome == 1 ? 1 : 0
      var Partner = params.isPartner == 1 ? 1 : 0
      // var ShowShop = params.isShowShop == 1 ? 1 : 0

      if (this.data.LookShopItem.length > 0) {
        var ShowShop = params.isShowShop == 1 ? 1 : 0
      } else {
        var ShowShop = 0;
      }

      // console.log(goHome,Partner,ShowShop,'获取的id')
      var that = this;
      if (res.data.code == 1) {
        wx.showToast({
          title: '视频修改成功',
          icon: 'success',
          duration: 1000
        })
        // 然后刷新初始数据
        // this.getUpVideo();
        // this.data.page=1
        // 获取所有数据
        //更新数据，从数组中删除
        this.data.itemsOneself = that.data.items;
        //通过视频id找到对应的视频
        for (var i = 0; i < this.data.itemsOneself.length; i++) {
          if (deleteUserId.id == this.data.itemsOneself[i].id) {
            this.data.itemsOneself[i].isGohome = goHome;
            this.data.itemsOneself[i].isPartner = Partner;
            this.data.itemsOneself[i].isShowShop = ShowShop;
          }
        }
        that.setData({
          items: this.data.itemsOneself
        })

        //动画
        var animation = wx.createAnimation({
          duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
          timingFunction: 'ease', //动画的效果 默认值是linear
        })
        this.animation = animation
        that.fadeDown(); //调用隐藏动画
        setTimeout(function() {
            that.setData({
              edioVedio: false
            })
          },
          720)
      }
    })
  },
  //灰色背景点击关闭关联店铺
  showCartList: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画
    setTimeout(function() {
        that.setData({
          showCartList: false,
          showCommentCartList: false,
          edioVedio: false
        })
      },
      720)
    //先执行下滑动画，再隐藏模块
    // this.setData({
    //   showCartList: false,
    //   showCommentCartList: false,
    //   replycomment: []
    //   // aaaa:true
    // })
  },
  //点击跳转到页面详情
  onClickMoveDetails: function(e) {
    let userid = e.currentTarget.dataset.userid;
    let videoId = e.currentTarget.dataset.id;
    let lon = wx.getStorageSync('jd')
    let latitude = lon.latitude;
    let longitude = lon.longitude;
    console.log(e)
    wx.navigateTo({
      url: "../moveshopdetails/moveshopdetails?userid=" + this.data.userID + '&videoId=' + videoId + '&infoFollow=' + false + '&sharedetails=' + true + '&latitude=' + latitude + '&longitude=' + longitude,
    })

  },
  //我的作品，请求加载我的作品，下拉
  getOneselfWorks: function() {
    var that = this;
    var params = {
      page: this.data.page,
      row: 10,
      userId: this.data.userID,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
    }
    // console.log(params,'下拉加载的数据')
    var timestamp = new Date().getTime();
    util.reqAsync(USER_URL.QUERYVIDEO, params).then(res => {

      if (res.data.code == 1 && res.data.data.length) {
        for (var i = 0; i < res.data.data.length; i++) {
          // var timeSpanStr = util.formatMsgTime(timestamp, res.data.data[i].createTime)
          // res.data.data[i].timeSpanStr = timeSpanStr;
          var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity) //距离
          res.data.data[i].distance = distance; //距离
        }
        var datas = res.data.data;
        var pages = that.data.page += 1;
        this.setData({
          //追加数据
          items: that.data.items.concat(datas),
          page: pages
          // itemsLength: this.data.items.length + datas.length
        })
      }
    })
  },
  //上拉刷新 个人作品
  getUpVideo: function() {
    var that = this;
    var lon = wx.getStorageSync('jd');
    var params = {
      "userId": this.data.userID, //用户Id，选填
      "page": 0, // 分页数，起始0，必填
      "row": 10, //行数，必填
      "longitude": lon.longitude, //经度，必填
      "latitude": lon.latitude //纬度，必填
    }
    var timestamp = new Date().getTime();
    util.reqAsync(USER_URL.QUERYVIDEO, params).then(res => {
      // console.log(res.data, '查看查询视频的数据');
      if (res.data.code == 1 && res.data.data.length >= 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          var timeSpanStr = util.formatMsgTime(timestamp, res.data.data[i].createTime)
          res.data.data[i].timeSpanStr = timeSpanStr; //时间
          var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity) //距离
          res.data.data[i].distance = distance; //距离
        }
        this.data.itemsOneself = res.data.data;
        this.setData({
          //数据追加
          items: this.data.itemsOneself,
          itemsLength: res.data.total
        })
        if (res.data.data.length == 0) {
          this.setData({
            showOpus: true,
            showCollect: false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // console.log(12346)
    this.setData({
      edioVedio: false,
      showCartList: false,
      aaaa: false
    })
    // this.videoContext = wx.createVideoContext('myVideo');
    // this.videoContext.pause();
  },
  //点击分享
  onShareAppMessage: function(res) {
    // console.log(res);
    var _this = this;
    //判断点击的那个按钮
    var dataId = res.target.dataset.id;
    var dataItmes = _this.data.items;
    let lon = wx.getStorageSync('jd')
    let latitude = lon.latitude;
    let longitude = lon.longitude;
    // console.log(infoFollow)
    for (var i = 0; i < dataItmes.length; i++) {
      if (dataId == dataItmes[i].id) {
        var dataItem = dataItmes[i].userName;
        var userid = dataItmes[i].userId
        var videoId = dataItmes[i].id
        var userPic = dataItmes[i].coverUrl
      }
    }
    console.log(userid, videoId, userPic, dataItem);
    // console.log(dataItem)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(infoFollow)
    }
    return {
      title: '更多精彩视频尽在[' + dataItem + ']的个人主页' + '点击查看！',
      path: "pages/moveshopdetails/moveshopdetails?userid=" + userid + '&videoId=' + videoId  + '&sharedetails=' + true + '&latitude=' + latitude + '&longitude=' + longitude,
      imageUrl: userPic,
      success: function (res) { }
    }
  }
})