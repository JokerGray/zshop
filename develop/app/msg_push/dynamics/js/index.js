$(function () {
  var user = {};
  var arr = location.search.substr(1).split('&'); //分离的参数 数组
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i].split('='); //参数 名  值
    user[item[0]] = item[1];
  }
  function getUrlParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
      return decodeURI(decodeURIComponent(r[2]));
    }
    return "";
  }
  var numberId = getUrlParams("userId");
  var param={
    numberId:numberId,
  }
  reqAjaxAsync("msgpush/getMsgpushDynamicsByNumberId", JSON.stringify(param)).done(function (res) {
    var data = res.data;
    $(".userName").text(data.userName);
    var imgface = '<img class="m_pic" src=' + data.userFacePic + '>'
    $(imgface).insertBefore(".m_about")
    // 活动时间拆分
    var start = data.createTime.split(" ");

    console.log(start[0]);
    //活动时间
    $(".time").text(start[0])
    // 内容
    $(".m_info-title").text(data.content);
    var videoUrl = data.videoUrl;
    //图片地址
    var imgUrl=data.picUrl;
    imgUrl=JSON.parse(imgUrl);
    var imgUrlLEN=imgUrl.length;
    if (videoUrl) {
      var videoFace = '<video controls="controls" width="400" height="400" src=' + videoUrl + ' >您的浏览器不支持视频播放。' + '</video>';
      $(".m_info-cont").html(videoFace);
    }else if(imgUrlLEN==1){

      $("#de_address").text(data.publishAddr)
      var imgSrc = '<img  alt="" src="' + imgUrl[0] + '">'
      $(".m_info-cont").addClass("oneimg").html(imgSrc)
    }else if(imgUrlLEN==2){
      $("#de_address").text(data.publishAddr)
      var imgSrc = '<img  src="' + imgUrl[0] + '"><img src="' + imgUrl[1] + '">'
      $(".m_info-cont").addClass("twoimg").html(imgSrc)
    }else {
      var imgSrc = "";
      $.each(imgUrl,function (i,v) {
        imgSrc+= '<img  src=' +v + '>';
        console.log(v);
      })
      $(".m_info-cont").html(imgSrc)
    }
  })


})
