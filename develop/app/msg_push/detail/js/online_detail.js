$(function() {

  var user = {};
  var arr = location.search.substr(1).split('&'); //分离的参数 数组
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i].split('='); //参数 名  值 
    user[item[0]] = item[1]

  }
  console.log(user)
  console.log(user.userId)
    // var users = {
    //   "id": 16,
    //   "userId": 15
    // }
  var userId = JSON.stringify(user)


  reqAjaxAsync("activity/getScActivityByParam", userId).done(function(res) {
    console.log(res)
    console.log(res.data)
    var data = res.data

    // 活动背景
    $("#detail_img").attr("src", data.coverUrl)
      // 活动标题
    $("#de_title").text(data.activityName)
      // 活动时间拆分
    var start = data.startTime.split(" "),
      end = data.endTime.split(" ");
    var Smonth = start[0].split("-").splice(1).join("月") + "日";
    var Emonth = end[0].split("-").splice(1).join("月") + "日";

    var sHours = start[1].substr(0, start[1].length - 3)
    var eHours = end[1].split(":").splice(0, 2).join(":")
    if (Smonth[0] == "0") {
      Smonth = Smonth.substr(1)
    }
    if (Emonth[0] == "0") {
      Emonth = Emonth.substr(1)
    }
    //活动时间
    $("#de_time").text(Smonth + ' ' + sHours + '-' + Emonth + ' ' + eHours)
      // 活动地点
    $("#de_address").text(data.address)
      // 活动发起人
    $("#de_initiator").text(data.initiator)
      // 活动介绍
    $("#de_introduction").text(data.introduction)
      // $("#de_introduction").text("")

    // 报名人员
    var userlist = data.scSysUserList,
      i = 0,
      len = userlist.length,
      str = "";
    for (; i < len; i++) {
      var list = userlist[i]
      str += '<div class="m_some">' +
        '<div class="m_single">' +
        '<img src=' + list.userPic + ' class="m_pic"></i>' +
        '<span>' + list.userName + '</span>' +
        '</div>' +
        '</div>'
    }
    //'<button class="" userId=' + list.id + '>添加</button>' +
    $(".manAll").html(str)
     if(data.isValid===0){
        $(".star").hide()
        $('.person').hide()
        $(".sing button").hide()
        $(".reason").show()
        $(".reasonlist").html(data.failureReason)
    }
    // 判断是否是用户本人
    if (user.userId != data.userId &&data.isValid===1) {
      // 初始化 判断是否 用户本人的活动
      // console.log(userName)
      $(".sign").show() //btn
      $(".star").show() //btn
    }

    // 收藏 star  状态显示
    console.log(data.collectNum)
    if (data.collectNum) {
      $(".star").addClass("starhide")
    }
    // 参加 sign button 状态显示
    if (data.canjiaNum) {
      $(".sign button").addClass("btndcd").text("已报名")
    }


  })




  // 收藏 star 点击  发送ajax 请求数据·


  $(".star").on("touchstart", function() {
    if ($(this).hasClass("starhide")) {
      console.log("已收藏=>取消收藏·")
      var cancelStar = {
        activityId: user.id,
        userId: user.userId
      }
      console.log(cancelStar)
      var cancel = reqAjaxAsync("activity/cancelCollection", JSON.stringify(cancelStar))
      console.log(cancel)
      $(this).removeClass('starhide')
    } else {
      $(this).addClass("starhide")
      var star = {
        activityId: user.id,
        userId: user.userId,
        type: "0"
      }
      var res1 = reqAjaxAsync("activity/operationScActivity", JSON.stringify(star))
      console.log("未收藏-->收藏")
    }
  })

  // 报名 button
  $(".sign button").on("touchstart", function() {
    if ($(this).hasClass("btndcd")) {
      console.log("参加")
      return false
    }
    console.log("未参加")
    $(this).addClass("btndcd").text("已报名")
    var join = {
      activityId: user.id,
      userId: user.userId,
      type: "1"
    };
    console.log(join)
    reqAjaxAsync("activity/operationScActivity", JSON.stringify(join)).done(function() {
        reqAjaxAsync("activity/getScActivityByParam", userId).done(function(res) {
          var data = res.data
            // 报名人员
          var userlist = data.scSysUserList,
            i = 0,
            len = userlist.length,
            str = "";
          for (; i < len; i++) {
            var list = userlist[i]
            str += '<div class="m_some">' +
              '<div class="m_single">' +
              '<img src=' + list.userPic + ' class="m_pic"></i>' +
              '<span>' + list.userName + '</span>' +
              '</div>' +
              '</div>'
          }
          $(".manAll").html(str)
        })
      })
      // console.log(res2)
    console.log("未参加-->参加")
      // ======================================
      // reqAjaxAsync("activity/getScActivityByParam", userId).done(function(res) {
      //   console.log(res)
      //   console.log(res.data)
      //   var data = res.data
      //     // 报名人员
      //   var userlist = data.scSysUserList,
      //     i = 0,
      //     len = userlist.length,
      //     str = "";
      //   for (; i < len; i++) {
      //     var list = userlist[i]
      //     str += '<div class="m_some">' +
      //       '<div class="m_single">' +
      //       '<img src=' + list.userPic + ' class="m_pic"></i>' +
      //       '<span>' + list.userName + '</span>' +
      //       '</div>' +
      //       '</div>'
      //   }
      //   //'<button class="" userId=' + list.id + '>添加</button>' +
      //   $(".manAll").html(str)
      // })

    // ======================================
    // location.replace(location.href)
    // location.reload()

  })

})
