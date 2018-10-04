var frontLogInfoArray = []; //前端记录日志的数组
var backLogInfoArray = [];  //后台记录日志的数组
var userInfoArray = [];//用户数组
var countMoney = 0;    //总计
var unfinishedTotal = 0;//未完成总余额
var methodArray=[];    // 方法的数组  每个方法有个编号id
var dataLogObjInfoArray=[];//前台操作数据对象数组 dataLogObjInfo
var systemRecordId = 1;
var payTotal = 0;//充值总额
var unconfirmedPayment = 0;//未确认款项
var totalMoney = 0;//总收入
var wjzqArray=[];
var wjzqCount = 1;

$(window).on('load', function () {
    $('#selectOneId').selectpicker({
       style: 'btn-info',
       maxOptions: 1,
       size: 5
    });
});

$(window).on('load', function () {
    $('#selectTwoId').selectpicker({
       style: 'btn-info',
       maxOptions: 1,
     size: 5
    });
});

//selectOneId 监听
function selectOneListen(){
  if($("#selectOneId").val()){
      $("#selectTwoId").removeAttr("disabled");
      $('#selectTwoId').selectpicker('refresh');
      initSelectTwo();
  }else{

  }
}

//selectTwo监听
function selectTwoListen(){
    //  $("#startCeShiId").removeAttr("disabled");
}

function initSelectOne(){
  var selectOneHtml = '';
  selectOneHtml+='<option value="1">1</option>';
  selectOneHtml+='<option value="2">2</option>';
  selectOneHtml+='<option value="3">3</option>';
  $("#selectOneId").empty().append(selectOneHtml);
  $('#selectOneId').selectpicker('refresh');

  var oneIdClass = $("#oneId div button").attr('class');
  if(oneIdClass=='btn dropdown-toggle bs-placeholder btn-default btn-info'){
       $("#oneId div button").attr('class', 'btn dropdown-toggle bs-placeholder btn-default');
  }else if (oneIdClass=='btn dropdown-toggle btn-default bs-placeholder btn-info') {
      $("#oneId div button").attr('class', 'btn dropdown-toggle btn-default bs-placeholder');
  }

}

function initSelectTwo(){
  var selectOneIdVal = $("#selectOneId").val()[0];
  var selectTwoHtml = '';
  for (var i = 1; i <=selectOneIdVal; i++) {
    selectTwoHtml+='<option value="'+i+'">'+i+'</option>';
  }

  $("#selectTwoId").empty().append(selectTwoHtml);
  $('#selectTwoId').selectpicker('refresh');

  var twoIdClass = $("#twoId div button").attr('class');
  if(twoIdClass=='btn dropdown-toggle bs-placeholder btn-default btn-info'){
       $("#twoId div button").attr('class', 'btn dropdown-toggle bs-placeholder btn-default');
  }else if (twoIdClass=='btn dropdown-toggle btn-default bs-placeholder btn-info') {
      $("#twoId div button").attr('class', 'btn dropdown-toggle btn-default bs-placeholder');
  }
}

$(function(){
  // $(".dataTables-example-one").dataTable();
  // $(".dataTables-example-two").dataTable();

  initSelectOne();
  // initSelectTwo();
  //refreshFrontLoginInfo();//日志
  initUserInfo();//初始化用户信息
  showUserList();//显示用户列表
  showBonusPool();//显示奖金池

  initMethodInfo();

  // dataInit(1);
  //console.log(methodArray);

  // var RandomBusinessArray2 = createRandom2(4 , 0, 8);
  // console.log(RandomBusinessArray2);
});

//数据初始化
function dataInit(hideId){
  var flag = '数据初始化';
  // frontLogInfoArray = []; //前端记录日志的数组
  // backLogInfoArray = [];  //后台记录日志的数组
  // userInfoArray = [];//用户数组
  // countMoney = 0;    //总计
  // unfinishedTotal = 0;
  //
  // initUserInfo();//初始化用户信息
  // showUserList();//显示用户列表
  // showBonusPool();//显示奖金池
  // $("#textareaId").empty().append('');
  // $("#textareaTwoId").empty().append('');
  //
  // initSelectOne();
  // initSelectTwo();
  var hideIdS = 2;
  if(hideId==1){
    hideIdS==1;
  }
  //调用后台接口
  var cmd = 'paySimulation/initialization';
  var data = '{"flag":"'+flag+'","type":"数据初始化","hideIdS":"'+hideIdS+'"}'
  reqAjax(cmd,data);
}

//开始测试
function startCeShi(){
   var selectOneVal=$("#selectOneId").val();// 业务数
   var selectTwoVal=$("#selectTwoId").val();// 线程数
  if(selectOneVal){
      if(selectTwoVal){
          swal({
            //title: '标题',
            text: '选中：随机业务：'+selectOneVal[0]+' , 线程数：'+selectTwoVal[0],
            //timer:2000,
            confirmButtonText:'开始',//确认按钮上的文本。
            confirmButtonColor:'#76a277',//确认按钮的颜色
            showCancelButton: true,//显示取消按钮
            cancelButtonText:'取消',//取消按钮上的文本。
            cancelButtonColor:'#b96664',//取消按钮的颜色
            type: 'info'
          }).then(function(isConfirm) {
            if (isConfirm === true) {

            var typeId;
            var  randomBusiness= createRandom2(selectOneVal[0] , 0, 3);
            if(randomBusiness[0]==1){
              typeId=2070;
            }else if (randomBusiness[0]==2) {
              typeId=2080;
            }else if (randomBusiness[0]==3) {
              typeId=65;
            }else if (randomBusiness[0]==4) {
              typeId=1070;
            }
            balancePay(typeId);

            //得到  selectOneVal业务数  和   selectTwoVal线程数
            for (var i = 0; i < randomBusiness.length; i++) {

              // 业务1   消费下单    确认收货   收货退货    只对客户
              if(randomBusiness[i]==1){

              }
              //业务2   消费下单    消费退货        只对客户
              if(randomBusiness[i]==2){

              }

              //业务3   充值余额      支持  客户 和 商户
              if(randomBusiness[i]==3){

              }

              //

            }


            }
          });
      }else{
         swal({
            // title: '暂无订单',
            text: '线程数不能为空',
            confirmButtonText:'关闭',//确认按钮上的文本
            confirmButtonColor: '#f8bb86',
            type: 'warning'
          })
      }
  }else{
     swal({
        // title: '暂无订单',
        text: '业务数不能为空',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#f8bb86',
        type: 'warning'
      })
  }
}

//测试弹窗按钮
function demotest(falg){
  swal({
    //title: '标题',
    text: '文字内容',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(function(isConfirm) {
    if (isConfirm === true) {//true：代表Confirm（确认）按钮。
      swal(
        '开始',
        //'Your imaginary file has been deleted.',
        'success'
      );
    }
  });
}

//方法对象
function addMethodInfo(id,name,functionName){
  var methodInfo = {
      id:id,//方法编号id
      name:name,//方法名字  如 支付订单  、  充值
      functionName:functionName //函数名字
  }
  return methodInfo;
}
//初始化
function initMethodInfo(){
    methodArray.push(addMethodInfo(1,'支付订单','payOrder()'));
    methodArray.push(addMethodInfo(2,'充值','recharge()'));
}


//用户对象   客户 与 商户
function addUserInfo(typeId,id,username,alipay,balance,coin,wjzqZzh,consume,shiftto,rollout,pay) {
  var userInfo = {
      typeId:typeId,		//类型    1表示是 客户  2表示 商户
      id:id,						//用户id  标识唯一性
      username:username,//用户名称
      alipay:alipay,		//支付宝
      balance:balance,  //余额
      coin:coin,        //智币量
      wjzqZzh:wjzqZzh, //玩家挣钱 子账户
      consume:consume,	//消费
      shiftto:shiftto,	//收入
      rollout:rollout,	//转出
      pay:pay						//充值
  }
  return userInfo;
}

//初始化用户信息
function initUserInfo() {
  userInfoArray.push(addUserInfo(1,2070,'A',45000,0,0,0,0,0,0,0));
  userInfoArray.push(addUserInfo(1,2080,'B',45000,0,0,0,0,0,0,0));
  userInfoArray.push(addUserInfo(2,65,'C',150000,0,0,0,0,0,0,0));
  userInfoArray.push(addUserInfo(2,1070,'D',150000,0,0,0,0,0,0,0));
}

// 数据日志对象
function dataLogObjInfo(systemRecordId,functionButton,clientName,clientNumber,merchantName,merchantNumber,consume,income,stayIncome,recharge,orderState,createTime){
  var dataLogInfo = {
      systemRecordId:systemRecordId,	//系统记录   系统编号id
      functionButton:functionButton,  //功能按钮	支付订单充值
      clientName:clientName,		  	  //客户名称
      clientNumber:clientNumber,      //客户编号
      merchantName:merchantName,	  	//商户名称
      merchantNumber:merchantNumber,  //商户编号
      consume:consume,    				    //消费
      income:income,				          //收入
      stayIncome:stayIncome,			    //待收入  或者是  扣税
      recharge:recharge,			        //充值   或者是  佣金
      orderState:orderState,         //订单状态
      createTime:createTime			      //创建时间
    }
    return dataLogInfo;
}

//显示 用户 和 客户 信息列表
function showUserList() {
  // 数据加载进度圈
  //var dataLoadingHtml = '<div class="text-center" style="height:229px;"><img src="img/5-121204193R0-50.gif" style="position:relative;top:50%;transform:translateY(-50%);"/>';
  //$("#userListId").empty().append(dataLoadingHtml);

  // setTimeout(function () {
    var userListHtml='';
    var typeName='';
    for (var i = 0; i < userInfoArray.length; i++) {
      userListHtml += '<div class="item-group col-md-6 col-lg-3 col-xs-12">';
      userListHtml += '<div class="item-group-content">';

      userListHtml += '<div class="row text-info">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<label>编号：'+userInfoArray[i].id+'</label>';
      userListHtml += '</div>',
      userListHtml += '</div>';

      userListHtml += '<div class="row text-info" style="margin-top: 5px;margin-bottom: 5px;">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      if(userInfoArray[i].typeId==1){
          userListHtml += '<label class="alert-warning">客户：'+userInfoArray[i].username+'</label>';
      }else if(userInfoArray[i].typeId==2){
          userListHtml += '<label class="alert-warning">商户：'+userInfoArray[i].username+'</label>';
      }
      userListHtml += '</div>',
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      if(userInfoArray[i].alipay<=0){
          userListHtml += '<label class="alert-error">支付宝：0 </label>';
      }else if(userInfoArray[i].alipay>0){
          userListHtml += '<label class="alert-warning">支付宝：'+userInfoArray[i].alipay+'</label>';
      }
      userListHtml += '</div>';
      userListHtml += '</div>';

      userListHtml += '<div class="row text-info" style="margin-top: 5px;margin-bottom: 5px;">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>余额：'+userInfoArray[i].balance+'</p>';
      userListHtml += '</div>';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>智币量：'+userInfoArray[i].coin+'</p>';
      userListHtml += '</div>';
      userListHtml += '</div>';


      userListHtml += '<div class="row text-info" style="margin-top: 5px;margin-bottom: 5px;">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>玩家挣钱-子账户：'+userInfoArray[i].wjzqZzh+'</p>';
      userListHtml += '</div>';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p></p>';
      userListHtml += '</div>';
      userListHtml += '</div>';

      userListHtml += '<div class="hr-line" style="background-color: #ccc;height: 2px;margin-top: 10px;margin-bottom: 10px;"></div>';
      userListHtml += '<div class="row" style="margin-top: 5px;margin-bottom: 5px;">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>充值：'+userInfoArray[i].pay	+'</p>';
      userListHtml += '</div>';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>消费：'+userInfoArray[i].consume+'</p>';
      userListHtml += '</div>';
      userListHtml += '</div>';
      userListHtml += '<div class="row" style="margin-top: 5px;margin-bottom: 5px;">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>转出：'+userInfoArray[i].rollout	+'</p>';
      userListHtml += '</div>';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>转入：'+userInfoArray[i].shiftto	+'</p>';
      userListHtml += '</div>';
      userListHtml += '</div>';
      userListHtml += '<div class="row" style="margin-top: 5px;margin-bottom: 5px;">';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>提现结算：0</p>';
      userListHtml += '</div>';
      userListHtml += '<div class="col-md-6 col-lg-6 col-xs-6">';
      userListHtml += '<p>提现退回：0</p>';
      userListHtml += '</div>';
      userListHtml += '</div>';

      userListHtml += '</div>';
      userListHtml += '</div>'
    }
    $("#userListId").empty().append(userListHtml);
    // }, 500);
}

//奖金池列表
function showBonusPool(){
  var merchantTotal = 0;// 商户总余额
  var clientTotal = 0;//客户总余额
  var withdrawDepositTotal = 0;//提现额度
  var difference = 0;//差额
  var alipay = 0;//支付宝

    countMoney=0;//总计
    for (var i = 0; i < userInfoArray.length; i++) {
      userInfoArray[i]
      if(userInfoArray[i].typeId==1){
          clientTotal = clientTotal+userInfoArray[i].balance;
          // payTotal+=userInfoArray[i].pay;
          alipay += userInfoArray[i].alipay;

          //总计
          countMoney += userInfoArray[i].balance;
      }else if (userInfoArray[i].typeId==2) {
          merchantTotal = merchantTotal+userInfoArray[i].balance;
          totalMoney = totalMoney + userInfoArray[i].shiftto;
          // payTotal+=userInfoArray[i].pay;
          alipay += userInfoArray[i].alipay;

          //总计
          countMoney += userInfoArray[i].balance;
      }
      //
    }
    //个人 和 商户  加起来  减去 总额  就等于差额   这个算法有问题
    //difference=countMoney-(clientTotal+merchantTotal);

    var bonusPoolOneHtml = '';
    bonusPoolOneHtml += '<td class="text-center">'+merchantTotal+'</td>';
    bonusPoolOneHtml += '<td class="text-center">'+clientTotal+'</td>';
    bonusPoolOneHtml += '<td class="text-center">'+unfinishedTotal+'</td>';
    bonusPoolOneHtml += '<td class="text-center">'+unconfirmedPayment+'</td>';
    bonusPoolOneHtml += '<td class="text-center">'+totalMoney+'</td>';
    bonusPoolOneHtml += '<td class="text-center">'+countMoney+'</td>';
    bonusPoolOneHtml += '<td class="text-center">'+alipay+'</td>';
    $("#bonusPoolTbodyOneId").empty().append(bonusPoolOneHtml);

    var bonusPoolTwoHtml = '';
    bonusPoolTwoHtml += '<td class="text-center">'+payTotal+'</td>';
    bonusPoolTwoHtml += '<td class="text-center">'+withdrawDepositTotal+'</td>';
    bonusPoolTwoHtml += '<td class="text-center">0</td>';
    // bonusPoolTwoHtml += '<td class="text-center label label-primary radius">正常</td>';
    bonusPoolTwoHtml += '<td class="text-center"><span class="label label-success radius">正常</span></td>';
    $("#bonusPoolTbodyTwoId").empty().append(bonusPoolTwoHtml);

}

//更新 前台系统记录
function refreshFrontLoginInfo () {
  textareaHtml = '';
  var logCount =frontLogInfoArray.length; //记录日志的长度
  for (var i = 0; i < frontLogInfoArray.length; i++) {
    if(logCount==(i-1)){
      textareaHtml+='系统记录'+(i+1)+'：'+frontLogInfoArray[i]
    }else{
      textareaHtml+='系统记录'+(i+1)+'：'+frontLogInfoArray[i]+'\n';
    }
  }
  $("#textareaId").empty().append(textareaHtml);
}

//更新 后台 系统记录
function refreshBackLoginInfo(){
  textareaHtml = '';
  var logCount =backLogInfoArray .length; //记录日志的长度
  for (var i = 0; i < backLogInfoArray .length; i++) {
    if(logCount==(i-1)){
      textareaHtml+='系统记录'+(i+1)+'：'+backLogInfoArray[i]
    }else{
      textareaHtml+='系统记录'+(i+1)+'：'+backLogInfoArray[i]+'\n';
    }
  }
  $("#textareaTwoId").empty().append(textareaHtml);
}


  //数据初始化 初始化 paySimulation/initialization


  //云店消费下单  paySimulation/shoppingPay
  function consumeOrders(id){
      var flag = '支付订单';
      var customerId = id;
      var money = createRandom(1 ,1 ,500);
      var merchantId;

      //临时的客户信息
      var clientInfo;
      //临时的商户信息
      var merchantInfo;
      if(id){
        clientInfo=findUserInfo(id);
        if(id==2070){
            merchantId = 65;
            merchantInfo=findUserInfo(merchantId);
        }else if (id=2080) {
          merchantId = 1070;
          merchantInfo=findUserInfo(merchantId);
        }
      }else{
          clientInfo = findRandomClient();
          merchantInfo=findUserInfo(merchantId);
      }
      if(clientInfo.balance>money[0]){
        //刷新 日志列表
        var currentTime = getCurrentTime();
        frontLogInfoArray.push(flag+'  '+clientInfo.username+'    消费金额：+'+money[0]+'   未完成总金额：+'+money[0]+'  '+merchantInfo.username+'   待收入金额：+'+money[0]+'    时间：'+currentTime);

        //systemRecordId = 0; 自增
        dataLogObjInfoArray.push(dataLogObjInfo(systemRecordId++,flag,clientInfo.username,clientInfo.id,merchantInfo.username,merchantInfo.id,money[0],0,0,0,0,currentTime));

        //减去  客户中的余额
        clientInfo.balance = clientInfo.balance - money[0];
        clientInfo.consume = clientInfo.consume + money[0]
        //添加 商户的收入
        // merchantInfo.balance = merchantInfo.balance + money[0];
        // merchantInfo.shiftto = merchantInfo.shiftto + money[0];

        //增加
        unfinishedTotal = unfinishedTotal + money[0];//未完成总余额

        //刷新 用户列表
        showUserList();
        refreshFrontLoginInfo ();
        showBonusPool();

        // var reData = '{"total":0,"code":1,"msg":"ok","data":{"orderState":0,"orderNo":"ZXCSSHOP20170728simulation0000","customerId":65,"money":34.0,"merchantId":1070,"orderTime":"2017-07-28 10:50:48"}}';
        // console.log(reData);
        // var reDataObj=$.parseJSON(reData);
        // console.log(reDataObj.msg);
        // console.log(JSON.parse(reData));
        // $("#resultDiv").empty().append('<textarea id="data" class="info" style="height:309px;width: 405px;" readonly="readonly">' +JSON.stringify(reDataObj, null, 4)+ '</textarea>');
        //
        // // var backLogInfo = flag+;
        // backLogInfoArray.push(reData);
        // refreshBackLoginInfo();

        var cmd = 'paySimulation/shoppingPay';
        var data = '{"flag":"'+flag+'","customerId":"'+customerId+'","money":"'+money+'","merchantId":"'+merchantId+'"}';
        reqAjax(cmd,data);
        // if(reData.msg=="ok"){
        //   backLogInfoArray.push(JSON.stringify(reData.data));
        //   refreshBackLoginInfo();
        // }
      }else{
        swal({
          // title: '用户金额不足，请充值！',
          text: '客户'+clientInfo.username+':金额不足'+money[0]+'，请充值！',
          type: 'error'
        })
     }
  }


  //云店消费确认收货(完成)  paySimulation/shoppingFinish
  function confirmReceipt(typeId){
    var flag = '确认收货';
    var booleanExists = false;
    //根据客户id查询该客户是否 有支付订单
    if(dataLogObjInfoArray.length>0){
      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
          if(dataLogObjInfoArray[i].clientNumber==typeId&&dataLogObjInfoArray[i].functionButton&&dataLogObjInfoArray[i].orderState==0){
            //刷新 日志列表
            var currentTime = getCurrentTime();
            frontLogInfoArray.push(flag+'  未完成总金额：-'+dataLogObjInfoArray[i].consume+'  '+dataLogObjInfoArray[i].merchantName+' 余额：+'+dataLogObjInfoArray[i].consume+'    时间：'+currentTime);

            //减去
            unfinishedTotal = unfinishedTotal - dataLogObjInfoArray[i].consume;//未完成总余额
            //商户金额增加
            var merchantInfo=findUserInfo(dataLogObjInfoArray[i].merchantNumber);
            merchantInfo.balance=merchantInfo.balance+dataLogObjInfoArray[i].consume;

            //刷新 用户列表
            showUserList();
            refreshFrontLoginInfo ();
            showBonusPool();

            dataLogObjInfoArray[i].orderState+=2;

            var cmd = 'paySimulation/shoppingFinish';
            var data = '{"flag":"'+flag+'"}';
            reqAjax(cmd,data);
            booleanExists=true;
            break;
          }
      }
      if(booleanExists==false){
          var typeName;
          if(typeId==2070){
              typeName='A';
          }else if(typeId==2080){
              typeName='B';
          }
          swal({
            // title: '暂无订单',
            text: typeName+'-暂无订单、请先下单',
            confirmButtonText:'关闭',//确认按钮上的文本
            confirmButtonColor: '#ed5565',
            type: 'error'
          })
      }
    }else{
      var typeName;
      if(typeId==2070){
          typeName='A';
      }else if(typeId==2080){
          typeName='B';
      }
      swal({
        // title: '暂无订单',
        text: typeName+'暂无订单、请先消费下单',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#ed5565',
        type: 'error'
      })
    }
  }

  // 云店消费退货   paySimulation/shoppingReject
  function consumerReturn(typeId){
    var flag = '消费退货';
    var booleanExists = false;
    if(dataLogObjInfoArray.length>0){
      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
          if(dataLogObjInfoArray[i].clientNumber==typeId&&dataLogObjInfoArray[i].functionButton&&dataLogObjInfoArray[i].orderState==0){

            //刷新 日志列表
            var currentTime = getCurrentTime();
            frontLogInfoArray.push(flag+'  '+dataLogObjInfoArray[i].clientName+'   余额：+'+dataLogObjInfoArray[i].consume+'  未完成总金额：-'+dataLogObjInfoArray[i].consume+'    时间：'+currentTime);

            //减去未完成总金额
            unfinishedTotal = unfinishedTotal - dataLogObjInfoArray[i].consume;//未完成总余额
            //给客户返回金额
            var clientInfo=findUserInfo(dataLogObjInfoArray[i].clientNumber);
            clientInfo.balance=clientInfo.balance+dataLogObjInfoArray[i].consume;
            clientInfo.consume=clientInfo.consume-dataLogObjInfoArray[i].consume;
            //刷新 用户列表
            showUserList();
            refreshFrontLoginInfo ();
            showBonusPool();

            dataLogObjInfoArray[i].orderState+=6;

            var cmd = 'paySimulation/shoppingReject';
            var data = '{"flag":"'+flag+'"}';
            reqAjax(cmd,data);
            booleanExists=true;
            break;
          }
        }
        if(booleanExists==false){
          var typeName;
          if(typeId==2070){
            typeName='A';
          }else if(typeId==2080){
            typeName='B';
          }
          swal({
            // title: '暂无订单',
            text: typeName+'-暂无订单、请先消费下单',
            confirmButtonText:'关闭',//确认按钮上的文本
            confirmButtonColor: '#ed5565',
            type: 'error'
          })
        }
    }else{
      swal({
        // title: '暂无订单',
        text: '暂无订单、请先消费下单',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#ed5565',
        type: 'error'
      })
    }
  }

  // 收货退货
  function theGoodsReturn(typeId){
    var flag = '收货退货';
    var booleanExists = false;

    if(dataLogObjInfoArray.length>0){
      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
          if(dataLogObjInfoArray[i].clientNumber==typeId&&dataLogObjInfoArray[i].functionButton&&dataLogObjInfoArray[i].orderState==2){

            //刷新 日志列表
            var currentTime = getCurrentTime();
            frontLogInfoArray.push(flag+'  '+dataLogObjInfoArray[i].clientName+'   余额：+'+dataLogObjInfoArray[i].consume+'   '+dataLogObjInfoArray[i].merchantName+'  余额：-'+dataLogObjInfoArray[i].consume+'    时间：'+currentTime);

            //减去商户的收入
            var merchanInfo=findUserInfo(dataLogObjInfoArray[i].merchantNumber);
            merchanInfo.balance=merchanInfo.balance-dataLogObjInfoArray[i].consume;

            //减去客户的消费  增加商户的余额
            var clientInfo=findUserInfo(dataLogObjInfoArray[i].clientNumber);
            clientInfo.balance=clientInfo.balance+dataLogObjInfoArray[i].consume;
            clientInfo.consume=clientInfo.consume-dataLogObjInfoArray[i].consume;
            //刷新 用户列表
            showUserList();
            refreshFrontLoginInfo ();
            showBonusPool();

            dataLogObjInfoArray[i].orderState+=6;

            var cmd = 'paySimulation/refundAfterConfirmOrder';
            var data = '{"flag":"'+flag+'"}';
            reqAjax(cmd,data);
            booleanExists=true;
            break;
          }
        }
        if(booleanExists==false){
          var typeName;
          if(typeId==2070){
            typeName='A';
          }else if(typeId==2080){
            typeName='B';
          }
          swal({
            // title: '暂无订单',
            text: typeName+'-暂无收货、请先收货',
            confirmButtonText:'关闭',//确认按钮上的文本
            confirmButtonColor: '#ed5565',
            type: 'error'
          })
        }
    }else{
      swal({
        // title: '暂无订单',
        text: '暂无订单、请先消费下单',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#ed5565',
        type: 'error'
      })
    }
  }

  //余额充值
  function balancePay(typeId){
      var flag = '充值余额';
      var rechargeAmount = createRandom(1 ,500,4000);;//充值金额
      var userInfo=findUserInfo(typeId);
    if(userInfo.alipay>rechargeAmount[0]){
      //刷新 日志列表
      var currentTime = getCurrentTime();

      frontLogInfoArray.push(flag+'   '+userInfo.username+'  充值：'+rechargeAmount[0]+'   支付宝：-'+rechargeAmount[0]+'  余额：+'+rechargeAmount[0]+'    时间：'+currentTime);

      //减去 支付宝金额  余额增加
      userInfo.alipay=userInfo.alipay-rechargeAmount[0];
      userInfo.balance=userInfo.balance+rechargeAmount[0];
      userInfo.pay=userInfo.pay+rechargeAmount[0];
      //资金池 充值总额
      payTotal=payTotal+rechargeAmount[0];

      //刷新 用户列表
      showUserList();
      refreshFrontLoginInfo ();
      showBonusPool();

      var cmd = 'paySimulation/rechargeAccount';
      var data = '{"flag":"'+flag+'","customerId":"'+typeId+'","money":"'+rechargeAmount+'","merchantId":"'+typeId+'"}';
      reqAjax(cmd,data);
    }else if (userInfo.alipay<rechargeAmount[0]) {
      swal({
        // title: '暂无订单',
        text: userInfo.username+'-支付宝不足：'+rechargeAmount[0],
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#ed5565',
        type: 'error'
      })
    }
  }

  //商户升级 对象
  function upgradeBusinessObjInfo(functionButton,merchantId,upgradeType,upgradeAmount,referrerUserId,amount,taxation,auditState,time){
      var upgradeBusinessInfo={
        functionButton:functionButton,  //按钮名字
        merchantId:merchantId,		      //商户id
        upgradeType:upgradeType,		    //升级类型 1-普通商户 2-合作商户 3-代理商户
        upgradeAmount:upgradeAmount,		//商户升级费用
        referrerUserId:referrerUserId,	//推荐人id
      	amount:amount,                 //推荐人分成金额
        taxation:taxation,		           //税费
        auditState:auditState,          //审核状态
        time:time                        //时间

      }
      return upgradeBusinessInfo;
  }

  // 佣金支付  客户
  function commissionPayment(typeId){
    var flag = '佣金支付';
    var booleanExists = true;

    var merchantNumberId;

    // 需要 判断当前客户 是谁  根据当前客户得到 商户
    if(typeId==2070){
      merchantNumberId=65;
    }else if (typeId==2080) {
      merchantNumberId=1070;
    }

    if(dataLogObjInfoArray.length>0){
      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
          if(dataLogObjInfoArray[i].merchantNumber==merchantNumberId&&(dataLogObjInfoArray[i].functionButton=='合作商户升级'||dataLogObjInfoArray[i].functionButton=='代理商户升级')){
            if(dataLogObjInfoArray[i].orderState==7){
              swal({
                text: '暂未审核',
                confirmButtonText:'关闭',//确认按钮上的文本
                confirmButtonColor: '#ed5565',
                type: 'error'
              })
              booleanExists=false;
              break;
            }else if (dataLogObjInfoArray[i].orderState==8) {
              dataLogObjInfoArray[i].orderState=9;
              var userInfo=findUserInfo(dataLogObjInfoArray[i].clientNumber);

              // 从未确认款项 减去 佣金：88  扣税：25   未确认款项 到总收入里面
              // 从未确认款项 减去 佣金：88  扣税：25   未确认款项 到总收入里面

              unconfirmedPayment=unconfirmedPayment-dataLogObjInfoArray[i].consume;
              totalMoney=totalMoney+(dataLogObjInfoArray[i].consume-dataLogObjInfoArray[i].recharge);
              userInfo.balance=userInfo.balance+dataLogObjInfoArray[i].recharge

              //刷新 日志列表
              var currentTime = getCurrentTime();
              frontLogInfoArray.push(flag+'    '+userInfo.username+'  余额：+'+dataLogObjInfoArray[i].recharge+'   未确认款项:-'+dataLogObjInfoArray[i].consume+'  总收入：+'+(dataLogObjInfoArray[i].consume-dataLogObjInfoArray[i].recharge)+'    时间：'+currentTime);
            //  frontLogInfoArray.push(flag+userInfo.username+'    余额：+'+dataLogObjInfoArray[i].recharge+'    未确认款项：-'+dataLogObjInfoArray[i].consume-dataLogObjInfoArray[i].recharge+'  总收入：+'+dataLogObjInfoArray[i].consume-dataLogObjInfoArray[i].recharge+'    时间：'+currentTime);

              //刷新 用户列表
              showUserList();
              refreshFrontLoginInfo ();
              showBonusPool();

              var cmd = 'merchantUpgrade/incomeAllocation';
              var data = '{"flag":"'+flag+'","reId":"'+typeId+'"}';
              reqAjax(cmd,data);
              booleanExists=false;
              break;
            }else if (dataLogObjInfoArray[i].orderState==9) {
              swal({
                text: '佣金已支付',
                confirmButtonText:'关闭',//确认按钮上的文本
                confirmButtonColor: '#ed5565',
                type: 'error'
              })
              booleanExists=false;
              break;
            }
          }
      }
      if(booleanExists==true){
        swal({
          text: '商户未升级',
          confirmButtonText:'关闭',//确认按钮上的文本
          confirmButtonColor: '#ed5565',
          type: 'error'
        })
      }
    }else{
      swal({
        text: '商户未升级',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#ed5565',
        type: 'error'
      })
    }
  }

  //商户升级申请  upgradeApplyFor(65) 升级申请
  function upgradeApplyFor(typeId,upgradeType){
    var flag;
    var booleanExists=true;
    var amount;
    var taxation =25 ;
    if(upgradeType==2){
        flag='合作商户升级';
    }else if (upgradeType==3) {
        flag='代理商户升级';
    }
    var upgradeAmount;
    if(upgradeType==2){
      upgradeAmount=3650;
      amount=1095;
    }else if (upgradeType==3) {
      upgradeAmount=100000;
      amount=30000;
    }
    var cmd = 'merchantUpgrade/merchantUpgradeApply';

    var referrerUserId;
    if(typeId==65){
      referrerUserId=2070;
    }else if (typeId==1070) {
      referrerUserId=2080;
    }
    var userInfo=findUserInfo(typeId);
    // if(userInfo.balance<upgradeAmount){
    //   swal({
    //     text: userInfo.username+'-余额不足:'+upgradeAmount+' 请充值',
    //     confirmButtonText:'关闭',//确认按钮上的文本
    //     confirmButtonColor: '#5bc0de',
    //     type: 'info'
    //   })
    //
    // }else{

    if(dataLogObjInfoArray.length>0){
      // 判断
      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
          if(dataLogObjInfoArray[i].functionButton==flag){

            if(dataLogObjInfoArray[i].orderState==7){
              //表示已经升级过
              swal({
                text: userInfo.username+'-'+flag+'-在审核中',
                confirmButtonText:'关闭',//确认按钮上的文本
                confirmButtonColor: '#5bc0de',
                type: 'info'
              })
              booleanExists=false;
              break;
            }else if (dataLogObjInfoArray[i].orderState==8) {
              //表示已经升级过
              swal({
                text: userInfo.username+'-已完成升级',
                confirmButtonText:'关闭',//确认按钮上的文本
                confirmButtonColor: '#5bc0de',
                type: 'info'
              })
              booleanExists=false;
                break;
          }else if (dataLogObjInfoArray[i].orderState==9) {
            //表示已经升级过
            swal({
                text: userInfo.username+'-已完成升级',
                confirmButtonText:'关闭',//确认按钮上的文本
                confirmButtonColor: '#5bc0de',
                type: 'info'
              })
              booleanExists=false;
            }
            break;
          }
      }
      if(booleanExists==true){

        if(userInfo.alipay<upgradeAmount){
          swal({
            text: userInfo.username+'-余额不足:'+upgradeAmount+' 请充值',
            confirmButtonText:'关闭',//确认按钮上的文本
            confirmButtonColor: '#5bc0de',
            type: 'info'
          })

        }else{
        //刷新 日志列表
        var currentTime = getCurrentTime();
        frontLogInfoArray.push(flag+'   '+userInfo.username+'  升级费用：'+upgradeAmount+'   支付宝：-'+upgradeAmount+'   未确认款项：+'+upgradeAmount+'    时间：'+currentTime);

        //商户 余额 减少 -   消费增加
        userInfo.alipay=userInfo.alipay-upgradeAmount;
        //userInfo.consume=userInfo.consume+upgradeAmount;

        // 未确认款项 +
        unconfirmedPayment=unconfirmedPayment+upgradeAmount;

        // 记录操作日志 对象    orderState  7 表示在审核中   8表示审核通过
        dataLogObjInfoArray.push(dataLogObjInfo(systemRecordId++,flag,null,referrerUserId,userInfo.username,userInfo.id,upgradeAmount,0,taxation,amount,7,currentTime));
        //刷新 用户列表
        showUserList();
        refreshFrontLoginInfo ();
        showBonusPool();


        //   入参:
        // "merchantId"		  //商户id
        // "upgradeType"		//升级类型 1-普通商户 2-合作商户 3-代理商户
        // "upgradeAmount"	//商户升级费用
        // "referrerUserId"	//推荐人id
        // "amount"		      //推荐人分成金额
        // "taxation"		    //税费
        // 出参:
        // "reId"			//推荐人申请id
        // "meId"			//商户升级申请id
        var data = '{"flag":"'+flag+'","merchantId":"'+typeId+'","upgradeType":"'+upgradeType+'","upgradeAmount":"'+upgradeAmount+'","referrerUserId":"'+referrerUserId+'","amount":"'+amount+'","taxation":"'+taxation+'"}';
        reqAjax(cmd,data);
      }
    }
    }else {
      if(userInfo.alipay<upgradeAmount){
        swal({
          text: userInfo.username+'-余额不足:'+upgradeAmount+' 请充值',
          confirmButtonText:'关闭',//确认按钮上的文本
          confirmButtonColor: '#5bc0de',
          type: 'info'
        })

      }else{

      //刷新 日志列表
      var currentTime = getCurrentTime();
      frontLogInfoArray.push(flag+'   '+userInfo.username+'  升级费用：'+upgradeAmount+'   支付宝：-'+upgradeAmount+'   未确认款项：+'+upgradeAmount+'    时间：'+currentTime);

      //商户 余额 减少 -   消费增加
      userInfo.alipay=userInfo.alipay-upgradeAmount;
      //userInfo.consume=userInfo.consume+upgradeAmount;

      // 未确认款项 +
      unconfirmedPayment=unconfirmedPayment+upgradeAmount;

      // 记录操作日志 对象    orderState  7 表示在审核中   8表示审核通过
      // upgradeBusinessObjInfo(flag,referrerUserId,upgradeType,upgradeAmount);
      dataLogObjInfoArray.push(dataLogObjInfo(systemRecordId++,flag,null,referrerUserId,userInfo.username,userInfo.id,upgradeAmount,0,taxation,amount,7,currentTime));

      //刷新 用户列表
      showUserList();
      refreshFrontLoginInfo ();
      showBonusPool();


      //   入参:
      // "merchantId"		  //商户id
      // "upgradeType"		//升级类型 1-普通商户 2-合作商户 3-代理商户
      // "upgradeAmount"	//商户升级费用
      // "referrerUserId"	//推荐人id
      // "amount"		      //推荐人分成金额
      // "taxation"		    //税费
      //   出参:
      // "reId"			//推荐人申请id
      // "meId"			//商户升级申请id
      var data = '{"flag":"'+flag+'","merchantId":"'+typeId+'","upgradeType":"'+upgradeType+'","upgradeAmount":"'+upgradeAmount+'","referrerUserId":"'+referrerUserId+'","amount":"'+amount+'","taxation":"'+taxation+'"}';
      reqAjax(cmd,data);
    }
  }
  }

  // 审核通过
  function passTheAudit(typeId){
    var flag = '审核通过';
    var booleanExists = true;
    var userInfo=findUserInfo(typeId);

    //刷新 日志列表
    var currentTime = getCurrentTime();

    if(dataLogObjInfoArray.length>0){
      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
          if(dataLogObjInfoArray[i].merchantNumber==typeId&&(dataLogObjInfoArray[i].functionButton=='合作商户升级'||dataLogObjInfoArray[i].functionButton=='代理商户升级')){
            if(dataLogObjInfoArray[i].orderState==7){
              dataLogObjInfoArray[i].orderState=8;

              frontLogInfoArray.push(flag+'    '+userInfo.username+'    时间：'+currentTime);

              //刷新 用户列表
              showUserList();
              refreshFrontLoginInfo ();
              showBonusPool();

              var cmd = 'merchantUpgrade/merchantUpgradeAudit';
              var data = '{"flag":"'+flag+'","meId":"'+typeId+'"}';
              reqAjax(cmd,data);
              booleanExists=false;
              break;
            }else if (dataLogObjInfoArray[i].orderState==8||dataLogObjInfoArray[i].orderState==9) {
              swal({
                text: userInfo.username+'-审核已通过',
                confirmButtonText:'关闭',//确认按钮上的文本
                confirmButtonColor: '#5bc0de',
                type: 'info'
              })
              booleanExists=false;
              break;
            }

          }
      }
    if(booleanExists==true){
      swal({
        text: userInfo.username+'-商户未升级',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#5bc0de',
        type: 'info'
      })

    }
    }else {
      swal({
        text: userInfo.username+'-商户未升级',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#5bc0de',
        type: 'info'
      })
    }
  }

  // 玩家挣钱对象
  function addWjzqInfo(id,typeName,merchantId,taskTotalMoney,taskPrice,reprintId,acceptAMissionId){
    var wjzqInfo = {
      id:id,// id
      typeName:typeName,  //类型名称
      merchantId:merchantId, // 商户id
      taskTotalMoney:taskTotalMoney,  //任务总报酬
      taskPrice:taskPrice,  //单次点击报酬
      reprintId:reprintId, // 版本编号
      acceptAMissionId:acceptAMissionId
    }
    return wjzqInfo;
  }

  // 玩家挣钱
  // 转文赚发布   商户
  function zhuanWenEarn(typeId){
    var flag = '转文赚发布';
    console.log('zhuanwen'+typeId);
    var userInfo =findUserInfo(typeId);
    console.log(userInfo);

    var zhengWenMoney = 300;
    if(userInfo.balance>zhengWenMoney){
      //刷新 日志列表
      var currentTime = getCurrentTime();
      frontLogInfoArray.push(flag+'   '+userInfo.username+'消费了:'+zhengWenMoney+'    时间：'+currentTime);

      //减去商户的余额
      userInfo.balance=userInfo.balance-zhengWenMoney;

      //玩家挣钱子账户  增加
      userInfo.wjzqZzh=userInfo.wjzqZzh+zhengWenMoney;

      //刷新 用户列表
      showUserList();
      refreshFrontLoginInfo ();
      showBonusPool();

      var taskTitle ='模拟系统-转文赚发布-simulation';       // 任务标题
      var taskUrl ='http://192.168.3.186:1088/zxcity/news/articledetail.html?apikey=test&typeCode=1002&articleId=153';         // 需求详情信息
      var taskPrice =100;       // 单次点击报酬
      var taskTotalMoney = zhengWenMoney; // 任务总报酬
      var merchantId  =0;     // 商户ID
      var userName   ='女人花一枝花';      // 发布人名称
      var userPhone  ='16816816816';      // 发布人电话号码
      var userCode   ='13554536332';      // 发布人账号（云信id）

      wjzqArray.push(addWjzqInfo(wjzqCount,flag,userInfo.id,zhengWenMoney,taskPrice,0,0))
      var cmd = 'paySimulation/publishReprintInfo';
      var data = '{"flag":"'+flag+'","taskTitle":"'+taskTitle+'","taskUrl":"'+taskUrl+'","taskPrice":"'
                  +taskPrice+'","taskTotalMoney":"'+taskTotalMoney+'","merchantId":"'+merchantId
                  +'","userName":"'+userName+'","userPhone":"'+userPhone+'","userCode":"'+userCode+'","userId":"'+
                  userInfo.id+'","taskPic":"hangzhou.aliyuncs.com/tsnrhapp/user/photos/02a3a2d7b6ba93a713d3ff893aa50833.png","taskTotalReadnum":"'+3+'"}';
      reqAjax(cmd,data);

    }else{
      swal({
        text: userInfo.username+'-余额不足:'+zhengWenMoney+' 请充值、发布转文失败',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#5bc0de',
        type: 'info'
      })
    }
  }

  // 转文赚转发 客户
  function zhuanWenZhengFaBu(typeId){
    var flag = '转文赚转发';
    console.log(typeId);
    var booleanExists=true;
    var userInfo =findUserInfo(typeId);
    console.log(userInfo);

    console.log(wjzqArray.length);
    if(wjzqArray.length>0){
      for (var i = 0; i < wjzqArray.length; i++) {
          var faBuRen =findUserInfo(wjzqArray[i].merchantId);
          if(wjzqArray[i].acceptAMissionId==0){
            wjzqArray[i].acceptAMissionId=userInfo.id;
            //刷新 日志列表
            var currentTime = getCurrentTime();
            frontLogInfoArray.push(flag+'   '+userInfo.username+' 成功'+'  时间：'+currentTime);

            //刷新 用户列表
            showUserList();
            refreshFrontLoginInfo ();
            showBonusPool();

            // updateReadnum  查看按钮
            // userId 1
            // reprintId 1
            // macId  mac地址 随便传 吧
            var cmd = 'paySimulation/addReprintBidInfo';
            var data = '{"flag":"'+flag+'","userId":"'+userInfo.id+'","reprintId":"'+wjzqArray[i].reprintId+'","status":"'+1+'"}';
            reqAjax(cmd,data);
            booleanExists=false;
            break;
          }
      }
      if(booleanExists==true){
        swal({
          text: '暂无-转文赚转发',
          confirmButtonText:'关闭',//确认按钮上的文本
          confirmButtonColor: '#5bc0de',
          type: 'info'
        })
      }

    }else{
      swal({
        text: '暂无-转文赚发布',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#5bc0de',
        type: 'info'
      })
    }
  }

  // 转文挣查看  商户 和 客户
  // 转文挣查看  商户 和 客户
  function ZhuanWenZhengChaKan(typeId){
    var flag = '转文赚查看';
    var userInfo =findUserInfo(typeId);
    var booleanExists=true;
    var taskPrice = 100;//单次点击报酬
    //谁转发谁挣钱、 md
    if(wjzqArray.length>0){
      for (var i = 0; i < wjzqArray.length; i++) {
          // if(wjzqArray[i].acceptAMissionId==0){
          if(wjzqArray[i].acceptAMissionId!=0){
                //if(wjzqArray[i].reprintId){
                var faBuRen =findUserInfo(wjzqArray[i].merchantId);
                //减去玩家挣钱 发布人 子账户中的 金额
                if(wjzqArray[i].taskTotalMoney>=taskPrice){
                  console.log(wjzqArray[i]);
                  var acceptAMissionUserInfo = findUserInfo(wjzqArray[i].acceptAMissionId);
                  console.log(acceptAMissionUserInfo);

                  faBuRen.wjzqZzh=faBuRen.wjzqZzh-taskPrice;

                  acceptAMissionUserInfo.wjzqZzh=acceptAMissionUserInfo.wjzqZzh+taskPrice;
                  // 修改数组中的金额
                  wjzqArray[i].taskTotalMoney = wjzqArray[i].taskTotalMoney-taskPrice;

                  //刷新 日志列表
                  var currentTime = getCurrentTime();
                  frontLogInfoArray.push(flag+'   '+userInfo.username+'查看成功   转发人：'+acceptAMissionUserInfo.username+'玩家挣钱-子账户:+'+taskPrice+'   发布人：'+faBuRen.username+' 玩家挣钱-子账户:-'+taskPrice+'   时间：'+currentTime);
                }else{
                  //刷新 日志列表
                  var currentTime = getCurrentTime();
                  frontLogInfoArray.push(flag+'   '+userInfo.username+'查看成功'+'  玩家挣钱-子账户:+'+0+'   发布人：'+faBuRen.username+' 玩家挣钱-子账户:-'+0+'   时间：'+currentTime);
                }
                //刷新 用户列表
                showUserList();
                refreshFrontLoginInfo ();
                showBonusPool();
                // updateReadnum  查看按钮
                // userId 1
                // reprintId 1
                // macId  mac地址 随便传 吧
                var macId =createRandom(1,25000,50000);

                var cmd = 'paySimulation/updateReadnum';
                var data = '{"flag":"'+flag+'","userId":"'+wjzqArray[i].acceptAMissionId+'","reprintId":"'+wjzqArray[i].reprintId+'","macId":"'+macId[0]+'"}';
                reqAjax(cmd,data);
                booleanExists=false;
                break;
            }
      }
      if(booleanExists==true){
        swal({
          text: '暂无-转文赚查看',
          confirmButtonText:'关闭',//确认按钮上的文本
          confirmButtonColor: '#5bc0de',
          type: 'info'
        })
      }
    }else{
      swal({
        text: '暂无-转文赚发布',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#5bc0de',
        type: 'info'
      })
    }
  }


  //通用接口 ajax   cmd  和  data
  function reqAjax(cmd, data) {
    var myAlertStart;
    var dataObj=JSON.parse(data);
    var version = '1';
    var reData;
    $.ajax({
      type : "POST",
      url : "/zxcity_restful/ws/rest",
      dataType : "json",
      timeout: 3000, //超时时间：30秒
      // async : false,
      data : {
        "cmd" : cmd,
        "data" : data,
        "version" : version
      },
      beforeSend : function(xml) {
        xml.setRequestHeader("apikey","test");
      },
      success : function(re) {
        reData = re;
        if(dataObj.flag=='数据初始化'){
          frontLogInfoArray = []; //前端记录日志的数组
          backLogInfoArray = [];  //后台记录日志的数组
          userInfoArray = [];//用户数组
          countMoney = 0;    //总计
          unfinishedTotal = 0;
          systemRecordId = 1;
          dataLogObjInfoArray=[];
          payTotal=0;
          totalMoney = 0;
          unconfirmedPayment=0;
          wjzqArray=[];
          wjzqCount = 1;
          discountCouponArray = [];
          FXDiscountCouponArray = [];
          purchaseCountCouponArray = [];
          yhjCount =1;
          purchaseCountCouponCount=1;
          $("#myAlert").attr('class','');
          $("#myAlert").empty().append('');

          initUserInfo();//初始化用户信息
          showUserList();//显示用户列表
          showBonusPool();//显示奖金池
          $("#textareaId").empty().append('');
          $("#textareaTwoId").empty().append('');
          initSelectOne();
          // initSelectTwo();

          if(dataObj.hideIdS==2){
            swal({
              text: '数据初始化完毕',
              confirmButtonText:'成功',//确认按钮上的文本
              timer:3000,
              type: 'success'
            });
          }

        }else{
          var backLogInfoHtml;
          if(reData.code==1&&reData.msg=='ok'||reData.msg=='成功'){
            if(dataObj.flag=='支付订单'){
              backLogInfoHtml=dataObj.flag+'   订单编号：'+reData.data.orderNo+'  客户编号：'+reData.data.customerId+'   订单状态：'+getOrderStateName(reData.data.orderState)+'  支付金额：'+reData.data.money+'   时间：'+reData.data.orderTime;
            }else if (dataObj.flag=='确认收货') {
              backLogInfoHtml=dataObj.flag+'   订单编号：'+reData.data.orderNo+'  商户编号：'+reData.data.merchantId+'   订单状态：'+getOrderStateName(reData.data.orderState)+'  收入金额：'+reData.data.money+'   时间：'+reData.data.orderTime;
            }else if (dataObj.flag=='消费退货') {
              backLogInfoHtml=dataObj.flag+'   订单编号：'+reData.data.orderNo+'  客户编号：'+reData.data.customerId+'   订单状态：'+getOrderStateName(reData.data.orderState)+'  退款金额：'+reData.data.money+'   时间：'+reData.data.orderTime;
            }else if (dataObj.flag=='收货退货') {
              backLogInfoHtml=dataObj.flag+'   订单编号：'+reData.data.orderNo+'  客户编号：'+reData.data.customerId+'   订单状态：'+getOrderStateName(reData.data.orderState)+'  退款金额：'+reData.data.money+'   时间：'+reData.data.orderTime;
            }else if (dataObj.flag=='充值余额') {
              backLogInfoHtml=dataObj.flag+'  充值金额：'+reData.data.money+'   时间：'+reData.data.rechargeTime;
            }else if (dataObj.flag=='合作商户升级'||dataObj.flag=='代理商户升级') {
              backLogInfoHtml=dataObj.flag+'  商户编号：'+reData.data.meId+'   升级金额：'+reData.data.upgradeAmount+'  推荐人编号：'+reData.data.reId +'   描述：'+reData.data.info+'   时间：'+reData.data.time;
            }else if (dataObj.flag=='佣金支付') {
              backLogInfoHtml=dataObj.flag+'   客户编号：'+reData.data.reId+'   佣金：'+reData.data.amount+'   描述：'+reData.data.info+'   时间：'+reData.data.time;
            }else if (dataObj.flag=='审核通过') {
              backLogInfoHtml=dataObj.flag+'   商户编号：'+reData.data.meId+'   描述：'+reData.data.info+'   时间：'+reData.data.time;
            }else if (dataObj.flag=='转文赚发布') {
              backLogInfoHtml=dataObj.flag+' 成功'+'   转文赚发布ID：'+reData.data.reprintId+'  时间：'+reData.data.createTime;
              for (var i = 0; i < wjzqArray.length; i++) {
                if(wjzqArray[i].id==wjzqCount){
                  wjzqArray[i].reprintId=reData.data.reprintId;
                  console.log(wjzqArray[i]);
                  wjzqCount++;
                  break;
                }
              }
            }else if (dataObj.flag=='转文赚转发') {
              backLogInfoHtml=dataObj.flag+' 成功  '+'   转文赚发布ID：'+dataObj.reprintId+'  时间：'+reData.data.createTime;
            }else if (dataObj.flag=='转文赚查看') {

              backLogInfoHtml=dataObj.flag+' 成功   '+'   转文赚发布ID：'+dataObj.reprintId+'  时间：'+reData.data.time;

            }else if (dataObj.flag=='优惠券制作') {
              backLogInfoHtml=dataObj.flag+' 成功    '+dataObj.flag+'ID:'+reData.data.id+'  时间：'+reData.data.createTime;
              for (var i = 0; i < discountCouponArray.length; i++) {
                //取出当前 制作优惠券 添加 后台优惠券生成的id
                if(discountCouponArray[i].yhjCount==yhjCount){
                  discountCouponArray[i].yhjId=reData.data.id;
                  yhjCount++;
                  break;
                }
              }
            }else if (dataObj.flag=='分享优惠券') {
              backLogInfoHtml=dataObj.flag+' 成功 优惠券ID:'+dataObj.couponId+'  时间：'+reData.data.time;

            }else if (dataObj.flag=='购买优惠券') {
              backLogInfoHtml=dataObj.flag+' 成功 优惠券ID:'+dataObj.couponId+'  时间：'+reData.data.time;
              for (var i = 0; i < purchaseCountCouponArray.length; i++) {
                if(purchaseCountCouponArray[i].purchaseCountCouponCount==purchaseCountCouponCount){
                    purchaseCountCouponArray[i].serialNumber=reData.data.serNo;
                    console.log(purchaseCountCouponArray[i]);
                    purchaseCountCouponCount++;
                    break;
                }
              }

            }else if (dataObj.flag=='使用优惠券') {
              backLogInfoHtml=dataObj.flag+' 成功 优惠券ID:'+dataObj.couponId+'  时间：'+reData.data.time;
            }else{
              backLogInfoHtml=dataObj.flag+'------一切正常、此操作、正在努力调试';
            }
            backLogInfoArray.push(backLogInfoHtml);
            refreshBackLoginInfo();
            //成功样式
            myAlertStart='   成功';
            $("#myAlert").attr('class', 'alert alert-success pull-right');
          }else if (reData.code==9||reData.code==7&&reData.msg!='ok') {
            backLogInfoArray.push(dataObj.flag+'   '+reData.msg);
            refreshBackLoginInfo();
            // 错误样式
            myAlertStart='   失败   '+reData.msg;
            $("#myAlert").attr('class', 'alert alert-danger pull-right');
          }
            $("#myAlert").empty().append('<a href="#" class="close" data-dismiss="alert">&times;</a><strong>'+dataObj.flag+'</strong> '+myAlertStart+'');
            setTimeout(function () {
              $("#myAlert").attr('class','');
              $("#myAlert").empty().append('');
            }, 6000);
        }
      },
      error : function(re) {
        if(re.statusText=='timeout'){
          if(dataObj.flag=='数据初始化'){
            swal({
              // title: '连接超时',
              text: '连接超时-数据初始化失败',
              confirmButtonText:'关闭',//确认按钮上的文本
              confirmButtonColor: '#ed5565',
              type: 'error'
            })
          }else{
            backLogInfoArray.push(dataObj.flag+'   连接超时、服务异常。'+re.statusText);
            refreshBackLoginInfo();
          }
        }else {
          if(dataObj.flag=='数据初始化'){
            swal({
              // title: '连接超时',
              text: '数据初始化失败',
              confirmButtonText:'关闭',//确认按钮上的文本
              confirmButtonColor: '#ed5565',
              type: 'error'
            })
          }
          if(dataObj.flag!='数据初始化'){
            backLogInfoArray.push(dataObj.flag+'  未知异常：'+re.statusText);
            refreshBackLoginInfo();
          }
        }
        // layer.closeAll('loading');
        // var str1 = JSON.stringify(re);
        // re.code = 9;
        // re.msg = str1;
        // reData = re;
        // console.log('链接超时！！');
        // return reData;
      }
    });
  }

  //调用后台接口的ajax方法
  function interfaceCall(cmd,data){
      $.ajax({
        url: '/path/to/file',
        type: 'POST',
        dataType: 'JSON',
        data: {param1: 'value1'}
      })
      .done(function() {

      })
      .fail(function() {
      })
      .always(function() {
      });
  }

  //测速ajax请求
  function ajaxtest(flag){
    $.ajax({
      // url:'/csyd-manage/demo/show',
      url : "/zxcity_restful/ws/rest",
      type: 'POST',
      dataType: 'JSON',
      timeout: 3000, //超时时间：30秒
      // data: {param1:'ceshi ajax请求'}
      data: {'cmd':'paySimulation/shoppingPay','data':'{"aaa":"222"}','version':'1'}
    })
    .done(function(data) {

      alert(JSON.stringify(data));
    })
    .fail(function(data) {
      alert('异常');
    })
    // .always(function(data) {
    //   console.log("complete-完成"+JSON.stringify(data));
    // });
  }

  //通过订单 状态得到定下描述
  function getOrderStateName(orderState){
    var orderStateName;
    if(orderState==0){
      return '待发货';
    }else if (orderState==1) {
      return '配送中';
    }else if (orderState==2) {
      return '已收货';
    }else if (orderState==3) {
      return '配送失败';
    }else if (orderState==4) {
      return '取消';
    }else if (orderState==5) {
      return '异常订单';
    }else if (orderState==6) {
      return '已退货';
    }else{
      return '订单状态异常';
    }
  }

  
