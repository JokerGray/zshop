(function ($) {
var userId=getUrlParams("userId")||10110;
var nextApprover=getUrlParams("nextApprover");
var name=getUrlParams("name");
var clickNum=getUrlParams("clickNum");//1.1为已经选择过审批人；2.否则没有选择

  function initial() {


      // initUpload({
    //   //图片上传
    //   btn: 'imgUploadBtn',
    //   flag: 'image',
    //   type: '3',
    // });
   var user = JSON.parse(localStorage.getItem('userinfo'));
      console.log(user);
    //选择完审批人重新渲染页面
  if(clickNum==1&&user){

    //请假类型
    if(user.nameType){
      $(".typeName").html(user.name).attr("data-value", user.nameType);
    }
    if(user.startTime){
      //请假时间
      $("#date4 ").html( user.startTime);
    }
   if(user.endTime){
     $("#date5").html(user.endTime );
   }
    if(user.reason){
      //请假理由
      $(".inputReason").val(user.reason);
    }
  if(user.imgUrl){
    //图片
    var imgUrl=user.imgUrl;
    var html='';
    $.each(imgUrl,function (i,v) {
      html+='<div class="imgBox" data-fileurl="'+v+'">\n' +
        '      <img src="'+v+'" class="addCommom">\n' +
        '      <span class="deletPicBtn">\n' +
        '      <img src="img/createType/delPic.png" alt="">\n' +
        '      </span>\n' +
        '      </div>'
    })
    $(".havechoosedImg").prepend(html);
  }

    //选择类型
    $(".levelType .level-item").eq(0).removeClass("level-one");
    var level=user.levelType;
    $(".levelType").attr("data-level",level);
    if(level==1){
      $(".levelType .level-item").eq(0).addClass("level-one");
    }else if(level==2){
      $(".levelType .level-item").eq(1).addClass(".level-two")
    }else if(level==3){
      $(".levelType .level-item").eq(2).addClass(".level-two")
    }

    //跳转完显示名字
    $(".chooseProvalPerson").attr("data-id",nextApprover);
    var str=name.slice(0,1)
    $(".dotImg span").html(str);
    $(".haveChoosed .name").html(name);

    //隐藏审批人按钮
    $(".addPersonBtn").hide();
    $(".haveChoosed").show();

    //删除记录
    localStorage.removeItem('userinfo');
   }else{

    console.log(11111)
    //判断是否有默认审批人

    //查询默认审批人
    var prem={
      bussTypeId: 1,//业务类型，3为日报，1为请假审批人,11为请假的默认转发人
      userId: userId//我的用户主键(后台用户主键)
    }
    reqAjaxAsync(RESULT_URL.DefaultNext,JSON.stringify(prem))
      .done(function (res) {
        getdefaultapproval(res)
      })

  }
  }


   initial();



  //返回主页面
  $(".commonback_tab").click(function () {
    window.location.href='./leaveList.html';
  });

  //默认审批人
  function getdefaultapproval(res) {
    if(res.code==1){
      var data=res.data;
      console.log(data.length);
      if(data&&data.length>0){
        $(".addPersonBtn").hide();
        $(".haveChoosed").show();
        var id=res.data[0].id;
        //显示姓名
        var name=res.data[0].username;
        $(".haveChoosed .name").html(name);
        //显示姓
        var str=name.slice(0,1);
        $(".dotImg span").html(str);
        //下一审批人id
        $(".chooseProvalPerson").attr("data-id",id)
      }else {
        $(".haveChoosed").hide();
        $(".addPersonBtn").show();
      }
    }
  }

  //选择请假类型
  $(".leaveType").click(function () {
    $("#chooseType").show();
  })

  //弹框选择请假类型
  $("#chooseType").on("click", "li", function () {
    $("#chooseType").hide();
    var valueType = $(this).val();
    var typeNme = $(this).text();
    $(".leaveType .typeName").html(typeNme).attr("data-value", valueType);
  });

  //上传图片
  // $("#imgUploadBtn").click(function () {
  //   //判断图片数量，大于3不能点击
  //   var len = $(".havechoosedImg").find(".imgBox").length;
  //   console.log(len);
  //   if (len == 3) {
  //     $(".addPinBtn").css("cursor", "not-allowed")
  //     return layerMsg("只能上传3张图片");
  //   } else {
  //     $(".addPinBtn").css("cursor", "pointer")
  //   }
  //   // $("#imgUploadBtn").click();
  // });
    //上传图片原生回调
  $("#imgUploadBtn").click(function () {
    //判断图片数量，大于3不能点击
    var len = $(".havechoosedImg").find(".imgBox").length;
    console.log(len);
    if (len == 3) {
      $(".addPinBtn").css("cursor", "not-allowed")
      return layerMsg("只能上传3张图片");
    } else {
      $(".addPinBtn").css("cursor", "pointer")
    }

    window.location.href = "startupload://uploadimage";
    // $("#imgUploadBtn").click();
  });


  //上传图片成功回调
  window.getImageUrl = function(src){
    if(!src){
      return layerMsg("上传失败")
    }else{
      $('.havechoosedImg').prepend('<div class="imgBox" data-fileUrl="'+src+'"> <img src="'+src+'" class="addCommom"> <span class="deletPicBtn"> <img src="img/createType/delPic.png" alt=""></span> </div>')
    }
  }

  //删除图片
  $(".havechoosedImg").on("click",".deletPicBtn",function () {
    $(this).parent().remove();
    var len = $(".havechoosedImg .imgBox").length;
    len--;
    if (len < 3) {
      $(".addPinBtn").css("cursor", "pointer")
    }
  });

  //选择审批人
  $(".addPersonBtn").click(function () {

    //图片
    var arrImg=[];
    $(".havechoosedImg .imgBox").each(function () {
      arrImg.push($(this).attr("data-fileurl"))
    })

    //本地存储值方便
    var user = {};
    user.name = $(".typeName").html();
    user.nameType  = $(".typeName").attr("data-value");


    //开始时间
    if($('#date4').children().is('.wordTips')){
      user.startTime="请选择开始时间"
    }else{
      user.startTime = $("#date4").html();
    }
    //结束时间
    if($('#date5').children().is('.wordTips')){
      user.endTime="请选择结束时间"
    }else{
      user.endTime = $("#date5").html();
    }
    // user.endTime = $("#date5").html();
    user.reason = $(".inputReason").val();
    user.imgUrl = arrImg;
    user.levelType = $(".levelType").attr("data-level");

    localStorage.setItem('userinfo',JSON.stringify(user));

    window.location.href='./chooseApproval.html?chooseType='+1+'&userId='+userId;

  })

  //删除审批人
  $(".haveChoosed").click(function () {
      $(this).remove();
      $(".addPersonBtn").show();
      $(".chooseProvalPerson").attr("data-id",'');
  })

  //选择优先级

  $(".levelType").on("click", ".level-item", function () {
    var level = $(this).attr("data-priorityLevel");
    $(".levelType").attr("data-level", level);
    var index = $(this).index();
    if (index == 1) {
      $(this).addClass("level-one").siblings().removeClass("level-two").removeClass("level-three");
    } else if (index == 2) {
      $(this).addClass("level-two").siblings().removeClass("level-one").removeClass("level-three");
    } else if (index == 3) {
      $(this).addClass("level-three").siblings().removeClass("level-one").removeClass("level-two");
    }
  });

  //发布按钮
  $(".pulishBtn").click(function () {

    //选择类型
    var type = $(".typeName").attr("data-value");
    if (!type) {

      return layerMsg("请填写请假类型")
    }

    //请假时间
    //开始时间
    if($('#date4').children().is('.wordTips')||$('#date4')=="请选择开始时间"){
      return layerMsg("请填写开始时间")
    }
    //结束时间
    if($('#date5').children().is('.wordTips')||$('#date5')=="请选择结束时间"){
      return layerMsg("请填写结束时间")
    }

    //判断时间大小
    var startTime = $("#date4").html();
    var endTime = $("#date5").html();
    var days = new Date(startTime).getTime() - new Date(endTime).getTime();
    if (days > 0) {
      return layerMsg("开始时间不能大于结束时间")
    }

    //请假事由
    var reason=$(".inputReason").val();
    if(!reason){
      return layerMsg("请填写请假事由")
    }
    //图片
    var arrImg=[];
    $(".havechoosedImg .imgBox").each(function () {
      arrImg.push($(this).attr("data-fileurl"))
    })

    //下一个审批人
    var nextApprover=$(".chooseProvalPerson").attr("data-id");
    if(!nextApprover){
      return layerMsg("请选择下一审批人")
    }
    var param = {
      startTime:startTime,
      reason: reason,
      leaveTime: 0,
      endTime: endTime,
      priorityLevel:$('.levelType').attr("data-level"),
      leaveType: 1,
      userId: userId,
      nextApprover:nextApprover,
      picUrl: arrImg,
    }
    reqAjaxAsync(RESULT_URL.SUBMITPROVAL, JSON.stringify(param))
      .done(function (res) {
          if(res.code==1){
            layerMsg("发布成功");
            window.location.href='./leaveList.html'
        }
      })
  })

})(jQuery)