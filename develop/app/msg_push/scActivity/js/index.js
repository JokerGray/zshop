$(function() {

  var user = {};
  var arr = location.search.substr(1).split('&'); //分离的参数 数组
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i].split('='); //参数 名  值 
    user[item[0]] = item[1]

  }
  console.log(user)
  console.log(user.id)
    // var users = {
    //   "id": 16,
    //   "userId": 15
    // }
  var userId = JSON.stringify(user)
  console.log(userId)

  reqAjaxAsync("activity/getScActivityById", userId).done(function(res) {
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

    

    

    // 收藏 star  状态显示
  

  })




  // 收藏 star 点击  发送ajax 请求数据·


  
  // 报名 button

})
