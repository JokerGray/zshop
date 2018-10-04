(function ($) {
var userId=getUrlParams("userId")||10073;
var nextApprover=getUrlParams("nextApprover");
var name=getUrlParams("name");
var clickNum=getUrlParams("clickNum");//1.1是在审批人页面跳转过来（方便渲染页面）；2.否则是从主页面跳转回来
var haveDefaultPerson=getUrlParams("haveDefaultPerson")//1.true是在审批人页面跳转过来带了审批人;2.false没有带审批人
  // var fromMenuDefault;//从主页进来是否有审批人

  function initial() {
    $('body').css('overflow', 'auto');
    //判断从首页进来是否有审批人
    // var prem={
    //   bussTypeId: 1,//业务类型，3为日报，1为请假审批人,11为转发人
    //   userId: userId//我的用户主键(后台用户主键)
    // }
    // reqAjaxAsync(RESULT_URL.DefaultNext,JSON.stringify(prem))
    //   .done(function (res) {
    //         if(res.code==1){
    //           var data=res.data;
    //           if(data&&data.length>0){
    //             fromMenuDefault=true;
    //           }else{
    //             fromMenuDefault=false;
    //           }
    //         }
    //   })




    //1.页面在主页跳转进来时判断是否有默认审批人
  if(clickNum!=1){
    //查询默认审批人
    var prem={
      bussTypeId: 1,//业务类型，3为日报，1为请假审批人,11为转发人
      userId: userId//我的用户主键(后台用户主键)
    }
    reqAjaxAsync(RESULT_URL.DefaultNext,JSON.stringify(prem))
      .done(function (res) {
        getdefaultapproval(res)
      })
  }

  var user = JSON.parse(localStorage.getItem('userinfo'));
    //选择完审批人进来时重新渲染页面
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
      $(".levelType .level-item").eq(1).addClass("level-two")
    }else if(level==3){
      $(".levelType .level-item").eq(2).addClass("level-three")
    }

    //如果有选择审批人
    if(haveDefaultPerson=="true"){
      //隐藏选择审批人按钮
      $(".addPersonBtn").hide();
      $(".haveChoosed").show();
//跳转完显示名字
      $(".chooseProvalPerson").attr("data-id",nextApprover);
      var str=name.slice(0,1)
      $(".dotImg span").html(str);
      $(".haveChoosed .name").html(name);
    }else{
      //显示选择审批人按钮
      $(".addPersonBtn").show();
      $(".haveChoosed").hide();
      $(".chooseProvalPerson").attr("data-id",'');
      $(".chooseProvalPerson .wordTips").html("(点击头像选择审批人)");
    }
    //删除记录
    localStorage.removeItem('userinfo');
   }

  }

   initial();

  //返回主页面
  $(".back_imgBtn").click(function () {
    window.location.href='./leaveList.html?userId='+userId;
  });

  //默认审批人
  function getdefaultapproval(res) {
    if(res.code==1){
      var data=res.data;
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
        $(".chooseProvalPerson").attr("data-id",id);

        // fromMenuDefault=true;

      }else {
        $(".haveChoosed").hide();
        $(".addPersonBtn").show();
        $(".chooseProvalPerson").attr("data-id",'');
        $(".chooseProvalPerson .wordTips").html("(点击头像选择审批人)");
        // fromMenuDefault=false;
      }
    }
  }

  //选择请假类型
  $(".leaveType").click(function () {
    $("#chooseType").show();
    //静止滚动
    $("body").css("overflow", "hidden");
  });

  $("#chooseType").on("click",function(){
    $(this).hide();
  });

  //弹框选择请假类型
  $("#chooseType").on("click", "li", function () {
    $("#chooseType").hide();
    //允许滚动
    $('body').css('overflow', 'auto');
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

  //存储选择好的状态，
  function setseession() {
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
    //优先级
    user.levelType = $(".levelType").attr("data-level");

    localStorage.setItem('userinfo',JSON.stringify(user));

  }
  
  //选择审批人
  $(".addPersonBtn").click(function () {

    setseession();
    // if(!fromMenuDefault){
    //   window.location.href='./chooseApproval.html?chooseType='+1+'&userId='+userId+'&havechoosed='+false+'&fromMenuDefault='+false;
    // }


    window.location.href='./chooseApproval.html?chooseType='+1+'&userId='+userId+'&havechoosed='+false;

  })

  //点击审批人直接进入转交审批人界面
  $(".haveChoosed").click(function () {
    //下一审批人id,name
    var defaultId= $(".chooseProvalPerson").attr("data-id");
    var defaultname= $(".haveChoosed .name").html();
    setseession()
    window.location.href='./chooseApproval.html?chooseType='+1+'&userId='+userId+'&defaultId='+defaultId+'&defaultname='+defaultname+'&havechoosed='+true;

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
    var type = $(".leaveType  .typeName").attr("data-value");
    if (!type) {

      return layerMsg("请填写请假类型")
    }

    //请假时间
    //开始时间
    if($('#date4').children().is('.wordTips')||$('#date4').html()=="请选择开始时间"){
      return layerMsg("请填写开始时间")
    }
    //结束时间
    if($('#date5').children().is('.wordTips')||$('#date5').html()=="请选择结束时间"){
      return layerMsg("请填写结束时间")
    }

    //判断时间大小
    var startTime = $("#date4").html();
    var endTime = $("#date5").html();
    var days = new Date(startTime).getTime() - new Date(endTime).getTime();

    console.log(days);
    if (days > 0) {
      return layerMsg("开始时间不能大于结束时间");
    }else if(days==0){
      return   layerMsg("开始时间不能等于结束时间");
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
      leaveType: type,
      userId: userId,
      nextApprover:nextApprover,
      picUrl: arrImg,
    }
    reqAjaxAsync(RESULT_URL.SUBMITPROVAL, JSON.stringify(param))
      .done(function (res) {
          if(res.code==1){
            layerMsg('发布成功');
            setTimeout(function(){ window.location.href='./leaveList.html?userId='+userId},1000);

        }
      })
  })

})(jQuery)