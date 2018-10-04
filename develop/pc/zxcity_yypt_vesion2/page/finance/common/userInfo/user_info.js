$(function(){
  var userId=getRequestAddressUrlParameter('userId');
  if(userId){
      getAppUserInfo(userId);
      setTimeout(function () {
          getExtendUserInfo(userId);
      }, 1000);
  }
});

// 获得app用户信息
function getAppUserInfo(userId){
  var cmd = 'userInfo/appUser';
  var data = JSON.stringify({userId:userId});
  var resData= queryAjax(cmd,data);
  if(resData.code==1&&resData.data){
      var form = layui.form();
      $("#appuser input[name=username]").val(resData.data.username);
      $("#appuser input[name=phone]").val(resData.data.phone);
      $("#appuser input[name=userbirth]").val(resData.data.userbirth);
      $("#appuser input[name=cityId]").val(resData.data.cityId==null?"城市编码："+"":"城市编码："+resData.data.cityId);
      $("#appuser input[name=cityName]").val(resData.data.cityName);
      $("#appuser input[name=residence]").val(resData.data.residence);
      // active_status  激活状态    0-已激活；1-未激活
      var activeStatus = resData.data.activeStatus;
      if(activeStatus||activeStatus==0){
        if(activeStatus==0){
            $("#appuser input[name=activeStatus0]").attr("checked","checked");
        }else if (activeStatus==1) {
            $("#appuser input[name=activeStatus1]").attr("checked","checked");
        }
      }
      // ismerchant    用户性质   0 平台用户/1 商户
      var ismerchant = resData.data.ismerchant;
      if(ismerchant||ismerchant==0){
        if(ismerchant==0){
           $("#appuser input[name=ismerchant0]").attr("checked","checked");
        }else if (ismerchant==1) {
           $("#appuser input[name=ismerchant1]").attr("checked","checked");
        }
      }
      // usersex 性别
      var usersex = resData.data.usersex;
      if(usersex){
        if(usersex=="男"){
            $("#appuser input[name=usersex1]").attr("checked","checked");
        }else if (usersex=="女") {
           $("#appuser input[name=usersex2]").attr("checked","checked");
        }
      }

      // locked  是否锁定  0 未锁/1 已锁
      var locked = resData.data.locked;
      if(locked||locked==0){
        if(locked==0){
            $("#appuser input[name=locked]").attr("checked","checked");
        }
      }
      // isdel  是否删除   0 未删 /1 已删除
      var isdel = resData.data.isdel;
      if(isdel||isdel==0){
        if(isdel==0){
            $("#appuser input[name=isdel]").attr("checked","checked");
        }
      }   
      // 用户类型   0 操作员/1 管理员
      var isadmin = resData.data.isadmin;
      if(isadmin||isadmin==0){
        if(isadmin==0){
           $("#appuser input[name=isadmin00]").attr("checked","checked");
        }else if (isadmin==1) {
           $("#appuser input[name=isadmin11]").attr("checked","checked");
        }
      }
      // isrealname	 实名认证 -1 审核不通过/0 未认证/1 待审核/2 已认证
      var isrealname = resData.data.isrealname;
      if(isrealname||isrealname==0){
        if(isrealname==-1){
            $("#appuser input[name=isrealname0]").attr("checked","checked");
        }else if (isrealname==0) {
            $("#appuser input[name=isrealname1]").attr("checked","checked");
        }else if (isrealname==1) {
            $("#appuser input[name=isrealname2]").attr("checked","checked");
        }else if (isrealname==2) {
            $("#appuser input[name=isrealname3]").attr("checked","checked");
        }
      }

      // 注册方式  0 APP注册/1 商户注册/2 商户会员/3商户员工
      var regMode = resData.data.regMode;
      if(regMode){
          if(regMode==1){
            $("#appuser input[name=app]").attr("checked","checked");
          }else if (regMode==2) {
            $("#appuser input[name=merchantZc]").attr("checked","checked");
          }else if (regMode==3) {
            $("#appuser input[name=merchantHy]").attr("checked","checked");
          }else if (regMode==4) {
            $("#appuser input[name=merchantYg]").attr("checked","checked");
          }
      }
      $("#appuser input[name=createtime]").val(resData.data.bindingMerchantId);
      $("#appuser input[name=lasttime]").val(resData.data.bindingShopId);
      $("#appuser input[name=createtime]").val(resData.data.createtime);
      $("#appuser input[name=lasttime]").val(resData.data.lasttime);
      // 用户头像
      var userpic = resData.data.userpic;
      if(userpic){
        $("#appuser #userpic").attr('layer-src', userpic);
        $("#appuser #userpic").attr('src', userpic);
      }
      form.render();
  }else {
      $("#appuser #userpic").hide();
  }
}

//获取 用户扩展信息
function getExtendUserInfo(userId){
    var cmd = 'userInfo/extendUserInfo';
    var data = JSON.stringify({userId:userId});
    var resData= queryAjax(cmd,data);
    if(resData.code==1&&resData.data){
      // shop 云店   未开通  和  已开通
      if(resData.data.shopInfo!=false){
        $("#shop input[name=shop2]").attr("checked","checked");
      }else {
        $("#shop input[name=shop1]").attr("checked","checked");
      }
      // headline  头条
      if(resData.data.headline!=false){
        $("#headline input[name=headline2]").attr("checked","checked");
      }else {
        $("#headline input[name=headline1]").attr("checked","checked");
      }
      // game  脸圈  type0主脸，1主播
      if(resData.data.gameInfo!=false){
        if(resData.data.gameInfo.type==0){
           $("#game input[name=type1]").attr("checked","checked");
        }else if (resData.data.gameInfo.type==1) {
           $("#game input[name=type2]").attr("checked","checked");
        }
      }

      var form = layui.form();
      form.render();
    }else {
        $("#game #frontUrl").hide();
        $("#game #contraryUrl").hide();
    }
}

function queryAjax(cmd,data){
  var resData;
  $.ajax({
    type : "POST",
    url : "/zxcity_restful/ws/rest",
    dataType : "json",
    async : false,
    data : {"cmd" : cmd,"data" : data,"version" :"1"},
    beforeSend : function(request) {
      request.setRequestHeader("apikey", "test");
    },
    success : function(re) {
        resData=re;
    },
    error : function(re) {
       resData=re;
    }
  });
  return resData;
}

// app用户头像
layer.ready(function(){ //为了layer.ext.js加载完毕再执行
  layer.photos({
    photos: '#layer-photos-appUser'
    ,shift: 5 //0-6的选择，指定弹出图片动画类型，默认随机
  });
});
