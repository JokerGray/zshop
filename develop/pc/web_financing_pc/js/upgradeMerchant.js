// 商户升级模块

/*var frontLogInfoArray = []; //前端记录日志的数组
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
*/

//商户升级 对象
  function upgradeMerchantObjInfo(functionButton,merchantId,upgradeType,upgradeAmount,referenceUserId,referenceAmount,taxation,auditState,time,onOffLine,serialNo){
      var upgradeBusinessInfo={
        functionButton:functionButton,  //按钮名字
        merchantId:merchantId,		      //商户id
        upgradeType:upgradeType,		    //升级类型 1-普通商户 2-合作商户 3-代理商户
        upgradeAmount:upgradeAmount,		 //商户升级费用
        referenceUserId:referenceUserId,	//推荐人id
        referenceAmount:referenceAmount,     //推荐人分成金额
        taxation:taxation,		            //税费
        auditState:auditState,             //审核状态
        time:time,                        //时间
        onOffLine:onOffLine	,			 //升级方式  1-线上升级   2-线下升级 
        serialNo:"zfblshwy6688"			//唯一流水号
      }
      return upgradeBusinessInfo;
  }

//商户升级线上升级申请 
  function upgradeMerchantApply(typeId,upgradeType){
	    var flag;
	    var booleanExists=true;
	    var referenceAmount;
	    var taxation =25 ;
	    var serialNo = 6688;
	    if(upgradeType==3){
	        flag='合作商户升级';
	    }else if (upgradeType==4) {
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
	    var cmd = 'paySimulation/onlineMerchantUpgradeApply';

	    var referenceUserId;
	    if(typeId==65){
	      referenceUserId=2070;
	    }else if (typeId==1070) {
	      referenceUserId=2080;
	    }
	    var userInfo=findUserInfo(typeId);

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
	        dataLogObjInfoArray.push(dataLogObjInfo(systemRecordId++,flag,null,referenceUserId,userInfo.username,userInfo.id,upgradeAmount,0,taxation,referenceAmount,7,currentTime));
	        //刷新 用户列表
	        showUserList();
	        refreshFrontLoginInfo ();
	        showBonusPool();


	        //   参数:
	        // "userId"		  //商户id
	        // "upgradeType"		//升级类型 1-普通商户 2-合作商户 3-代理商户
	        // "upgradeAmount"	//商户升级费用
	        // "referenceUserId"	//推荐人id
	        // "amount"		      //推荐人分成金额
	        // "onOffLine" 		//升级方式  1-线上升级  2-线下升级
	        // "serialNo"		//唯一流水号

	        var data = '{"flag":"'+flag+'","userId":"'+typeId+'","upgradeType":"'+upgradeType+'","upgradeAmount":"'+upgradeAmount+'","referenceUserId":"'+referenceUserId+'","referenceAmount":"'+referenceAmount+'","serialNo":"'+serialNo+'"}';
	        merchantAjax(cmd,data);
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
	      // upgradeBusinessObjInfo(flag,referenceUserId,upgradeType,upgradeAmount);
	      dataLogObjInfoArray.push(dataLogObjInfo(systemRecordId++,flag,null,referenceUserId,userInfo.username,userInfo.id,upgradeAmount,0,taxation,referenceAmount,7,currentTime));

	      //刷新 用户列表
	      showUserList();
	      refreshFrontLoginInfo ();
	      showBonusPool();


	      //   参数:
	      // "merchantId"		  //商户id
	      // "upgradeType"		//升级类型 1-普通商户 2-合作商户 3-代理商户
	      // "upgradeAmount"	//商户升级费用
	      // "referenceUserId"	//推荐人id
	      // "referenceAmount"	//推荐人分成金额
	      // "levelTypeId"		//商户续费需要用到的参数  续费等级ID	升级类型 1-普通商户 2-合作商户 3-代理商户 4-合作商户续费 5-代理商户续费
	      // "onOffLine" 		//升级方式  1-线上升级  2-线下升级
	    
	      var data = '{"flag":"'+flag+'","merchantId":"'+typeId+'","upgradeType":"'+upgradeType+'","upgradeAmount":"'+upgradeAmount+'","referenceUserId":"'+referenceUserId+'","referenceAmount":"'+referenceAmount+'","levelTypeId":"'+upgradeType+'","serialNo":"'+serialNo+'"}';
	      merchantAjax(cmd,data);
	    }
	  }
	  }

	  // 线上升级财务审核通过
	  function onLineAudit(typeId){
	    var flag = '审核通过';
	    var booleanExists = true;
	    var userInfo=findUserInfo(typeId);

	    var currentTime = getCurrentTime();

	    if(dataLogObjInfoArray.length>0){
	      for (var i = 0; i < dataLogObjInfoArray.length; i++) {
	          if(dataLogObjInfoArray[i].merchantNumber==typeId&&(dataLogObjInfoArray[i].functionButton=='合作商户升级'||dataLogObjInfoArray[i].functionButton=='代理商户升级')){
	            if(dataLogObjInfoArray[i].orderState==7){
	              dataLogObjInfoArray[i].orderState=8;

	              frontLogInfoArray.push(flag+'    '+userInfo.username+'    时间：'+currentTime);

	              //刷新 用户列表
	              showUserList();
	              //更新前台记录方法
	              refreshFrontLoginInfo();
	              //奖金池列表方法
	              showBonusPool();

	              var cmd = 'paySimulation/merchantUpgradeAudit';
	              var data = '{"flag":"'+flag+'","merchantId":"'+typeId+'"}';
	              merchantAjax(cmd,data);
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
  
	  //商户升级推荐人佣金审核通过
	  function referenceAmountAudit(referenceUserId){
		  var flag = '商户升级推荐人佣金审核通过';
		  var booleanExists = true;
		  var userInfo = findUserInfo(ref);   //获取商户信息  
		  var currentTime = getCurrentTime(); //获取时间
		  
		  var upgradeMerchantObjInfo = upgradeMerchantObjInfo();
		  
		  if(dataLogInfoArray.length>0){
			  for(var i = 0;i < dataLogObjInfoArray.length; i++){
				  if(dataLogObjInfoArray[i].orderState == 7){
					dataLogObjInfoArray[i].orderState = 8;
					frontLogInfoArray.push(flag+' ' + userInfo.username + ' 时间：'+currentTime);
					
					//刷新系统页面显示
					showUserList();
					//刷新前台记录
					refreshFrontLoginInfo();
					//刷新资金池列表方法 
					showBonusPool();
					
					var cmd = 'paySimulation/referenceCommissionAudit';
					var data = JSON.stringify(upgradeMerchantObjInfo);
					merchantAjax(cmd , data);					
				  }
			  }			  
		  }		  
	  }
	  
	//ajax 连接后台的方法      参数：cmd data
	  function merchantAjax(cmd,data){
		 $.ajax({
			 type : "POST",
			 url: "/zxcity_restful/ws/rest",
			 dataType:"json",
			 data : {"cmd" : cmd, "data" : data ,"version" : 1},
			 beforeSend : function(request){
				 request.setRequestHeader("apikey","test");
			 },
			 success: function(responseData){
				 console.log(responseData);
			 },
			 error : function(responseData){
			 		console.log(responseData);
			 		if(responseData.statusText == "Not Found"){
			 			backLogInfoArray.push(flag+' 访问异常.....'+responseData.statusText+'  请联系管理员')
			 		}
			 		if(responseData.statusText == "timeout"){
							backLogInfoArray.push(flag+'  连接超时 ....系统繁忙...' + responseData.statusText)		 			
			 		}
			 		//更新后台 系统记录
			 		refreshBackLoginInfo();
			 }
 		});
	  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  