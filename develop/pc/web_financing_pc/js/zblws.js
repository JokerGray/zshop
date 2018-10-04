// 主播劳务税js
var shopId = 49;//店铺id


//劳务申请
function laborApplication(userId){
  var flag = '劳务申请';
  var currentTime = getCurrentTime();
  var userInfo =findUserInfo(userId);
  var laborUserInfo =getUserInfo();//获取劳务税用户信息

  //劳务申请对象
  var scGameAccountsRecordInfo = {
      id:0,                               //主键，ID',
      userId:userId,                      //用户Id',
      shopId:shopId,                      //店铺Id',
      money:createRandom2(1,800,3000)[0], //提现金额',
      createTime:currentTime,             //创建时间',
      modifyTime:"",                      //修改时间',
      status:0,                           //状态，默认0审核中,1通过，2未通过',
      comment:"模拟系统-劳务申请数据",      //备注',
      taxType:"劳务报税",                  //报税方式:劳务报税，企业报税',
      name:laborUserInfo.name,            //姓名',
      idNumber:laborUserInfo.idNumber,    //身份证号',
      phone:laborUserInfo.phone,          //手机号',
      invoiceNumber:"",                   //发票编号',
      corporationName:"",                 //企业名',
      creditCode:"",                      //信用代码',
      serialNo:""                         //流水号
  }

  console.log(scGameAccountsRecordInfo);

  frontLogInfoArray.push(flag+'   '+userInfo.username+'申请成功'+'   时间：'+currentTime);

  //刷新 用户列表
  showUserList();
  refreshFrontLoginInfo ();
  showBonusPool();

  var cmd = 'paySimulation/liveCommissionApplication';
  var data = JSON.stringify(scGameAccountsRecordInfo);
  zblwsAjax(cmd,data,flag);

}


//企业申请
function enterpriseApplication(userId){
  var index = layer.open({
      type: 1 ,//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层
      title: '主播劳务税',
      area: ['850px', '550px'],
      skin: 'layui-layer-lan',
      maxmin: true,
      shadeClose:false,
      content:'<label class="col-sm-3 control-label">分类级别：</label>',
      btn: ['确认关闭', '立即添加'],
    btn1: function(){
      layer.close(index);
      },
      btn2: function(){


      },
      cancel: function(){

      },
      success: function(layero){


      }
  });
}


//发票审核
function invoiceReview(userId){




}


//主播劳务税   ajax
function zblwsAjax(cmd,data,flag){
  $.ajax({
    type : "POST",
    url : "/zxcity_restful/ws/rest",
    dataType : "json",
    //async : false,
    data : {"cmd" : cmd,"data" : data,"version" : 1},
    beforeSend : function(request) {
      request.setRequestHeader("apikey","test");
    },
    success : function(responseData) {
      console.log(responseData);
      

    },
    error : function(responseData) {
      console.log(responseData);
      if(responseData.statusText=="Not Found"){
        backLogInfoArray.push(flag+'  访问异常......'+responseData.statusText+'......请联系管理员');
      }
      if(responseData.statusText=='timeout'){
        backLogInfoArray.push(flag+'  连接超时...系统繁忙...'+responseData.statusText);
      }
      refreshBackLoginInfo();
    }
  });
}
