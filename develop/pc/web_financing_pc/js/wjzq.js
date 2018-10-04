// 玩家挣钱模块

// 优惠券制作 数组对象
var shopId = 49;
var couponNameArray = ['易大师-拉面','青鱼嘴一日游','武器大师-热干面','八爪喵-热狗','枕头汪-生鲜'];
var couponDemandArray = ['优惠券说明-京东商城-simulation','优惠券说明-天猫、、456-simulation','优惠券说明-今晚打老虎-simulation','优惠券说明-智享城市-simulation'];
var couponOriginalPriceArray = [88,124,400,200,100];
var YHJ_NAME ='优惠券：';
var discountCouponArray = [];//优惠券对象
var FXDiscountCouponArray = [];//分享优惠券数组
var yhjCount = 1;//优惠券 自增id  每添加一条就增加
var purchaseCountCouponArray = [];//购买优惠券 数组
var purchaseCountCouponCount = 1;//购买优惠券优惠券 自增id  每添加一条就增加

//获得 优惠券
function getCouponName(){
    var randomNumber= createRandom2(1,-1,couponNameArray.length-1);
    return YHJ_NAME+couponNameArray[randomNumber[0]];
}

//获得优惠券说明
function getCouponDemand(){
  var randomNumber = createRandom2(1,-1,couponDemandArray.length-1);
  return couponDemandArray[randomNumber[0]];
}

// 获得原始价格
function getCouponOriginalPrice(){
  var randomNumber = createRandom2(1,-1,couponOriginalPriceArray.length-1);
  return couponOriginalPriceArray[randomNumber[0]];

}

// 分享赚   用户
function shareGain(typeId){
  var flag = '分享赚';


}

//优惠券制作   商户制作
function discountCouponMake(typeId){
  var flag = '优惠券制作';

  var couponOriginalPrice = getCouponOriginalPrice();//原始价格
  var couponPresentPrice = couponOriginalPrice/2; //支付价格 取原始价钱的一般
  var couponCashback = couponPresentPrice/2;      //返现金额 取支付价钱的一般

  var userInfo =findUserInfo(typeId);

  var discountCouponMakeInfo = {
      flag:flag,
      //前端 自定义数据
      yhjId:0,                     //优惠券唯一id
      yhjFxUserId:0,              //优惠券分享id
      yhjCount:yhjCount,          //自增
      gmDiscountCouponStatus:false,     //购买优惠券状态 false  没有购买   true 表示购买
      purchaseCountCouponUserId:0,    //购买优惠券 用户id
      purchaseCountCouponCount:purchaseCountCouponCount, //购买优惠券 自增
      useDiscountCouponStatus:false,  // false未使用   true已使用  只有购买了才能使用
      shareNumber:0,//分享次数
      yjfxUserId:0,//已经分享的id

      //请求参数
      serialNumber:0,             //购买后  后台会返回  用户到手的优惠券
      couponName:getCouponName(),                   //优惠券标题
      couponDemand:getCouponDemand(),               //优惠券说明
      couponOriginalPrice:couponOriginalPrice,   //原始价格
      couponPresentPrice:couponPresentPrice,     //支付价格  要小于原始价格  优惠券的面额
      couponCashback:couponCashback,             //返现金额  要小于 支付金额
      shopId:shopId,                                //店铺主键 测试用49
      userId:typeId,                                //优惠券制作者ID
      cityId:4201                                   //店铺所在城市
  };

  var currentTime = getCurrentTime();
  frontLogInfoArray.push(flag+'   '+userInfo.username+'制作成功'+'   时间：'+currentTime);

  //刷新 用户列表
  showUserList();
  refreshFrontLoginInfo ();
  showBonusPool();

  //将优惠券对象添加到优惠券数组中
  discountCouponArray.push(discountCouponMakeInfo);
  console.log(discountCouponMakeInfo);

  var cmd = 'paySimulation/addCoupon';
  var data = JSON.stringify(discountCouponMakeInfo);
  reqAjax(cmd,data);
}

//分享优惠券   用户
function shareDiscountCoupon(typeId){
  var flag = '分享优惠券';
  var booleanExists=true;
  var whether_fx_yhj = true;//是否分享优惠券
  var userInfo =findUserInfo(typeId);
  if(discountCouponArray.length > 0){
    //优惠券有
    for (var i = 0; i < discountCouponArray.length; i++) {
      if(whether_fx_yhj==false){

        break;
      }

      var FXDiscountCouponInfo = Object.assign({}, discountCouponArray[i]);//用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      FXDiscountCouponInfo.yhjFxUserId = typeId;
      console.log(FXDiscountCouponInfo);
      var shareDiscountCouponInfo = {
        flag:flag,
        couponId:discountCouponArray[i].yhjId,        //couponId 优惠券ID
        shareUserId:typeId,                          //shareUserId 分享人ID
        status:1                                      //status 1-发布，2-取消
      };

      if(discountCouponArray[i].yhjId!=0){
          if(FXDiscountCouponArray.length > 0){

            if(discountCouponArray[i].yjfxUserId!=0){
              if(discountCouponArray[i].yjfxUserId==typeId){
                continue;
              }else{
                discountCouponArray[i].yjfxUserId=typeId;
                discountCouponArray[i].shareNumber=discountCouponArray[i].shareNumber+1;
                var currentTime = getCurrentTime();
                frontLogInfoArray.push(flag+'   '+userInfo.username+'分享优惠券ID：'+FXDiscountCouponInfo.yhjId+' 成功 '+'   时间：'+currentTime);

                //刷新 用户列表
                showUserList();
                refreshFrontLoginInfo ();
                showBonusPool();
                //表示第一次
                console.log(FXDiscountCouponInfo);
                FXDiscountCouponArray.push(FXDiscountCouponInfo);
                var cmd = 'paySimulation/addsharecouponBidinfo';
                var data = JSON.stringify(shareDiscountCouponInfo);
                reqAjax(cmd,data);
                booleanExists=false;
                if(discountCouponArray[i].shareNumber==2){
                  discountCouponArray.splice(0,1);
                }
                break;
              }
            }else{
                discountCouponArray[i].yjfxUserId=typeId;
                discountCouponArray[i].shareNumber=discountCouponArray[i].shareNumber+1;
                var currentTime = getCurrentTime();
                frontLogInfoArray.push(flag+'   '+userInfo.username+'分享优惠券ID：'+FXDiscountCouponInfo.yhjId+' 成功 '+'   时间：'+currentTime);

                //刷新 用户列表
                showUserList();
                refreshFrontLoginInfo ();
                showBonusPool();
                //表示第一次
                FXDiscountCouponArray.push(FXDiscountCouponInfo);
                var cmd = 'paySimulation/addsharecouponBidinfo';
                var data = JSON.stringify(shareDiscountCouponInfo);
                reqAjax(cmd,data);
                booleanExists=false;
                whether_fx_yhj=false;
                if(discountCouponArray[i].shareNumber==2){
                  discountCouponArray.splice(0,1);
                }
                break;
            }
          }else{
              discountCouponArray[i].yjfxUserId=typeId;
              discountCouponArray[i].shareNumber=discountCouponArray[i].shareNumber+1;
              var currentTime = getCurrentTime();
              frontLogInfoArray.push(flag+'   '+userInfo.username+'分享优惠券ID：'+FXDiscountCouponInfo.yhjId+' 成功 '+'   时间：'+currentTime);

              //刷新 用户列表
              showUserList();
              refreshFrontLoginInfo ();
              showBonusPool();
              //表示第一次
              FXDiscountCouponArray.push(FXDiscountCouponInfo);
              var cmd = 'paySimulation/addsharecouponBidinfo';
              var data = JSON.stringify(shareDiscountCouponInfo);
              reqAjax(cmd,data);
              booleanExists=false;
              break;
          }

        // }
      }else{
        swal({
          text: '异常-优惠券',
          confirmButtonText:'关闭',//确认按钮上的文本
          confirmButtonColor: '#ed5565',
          type: 'error'
        })
      }
    }
    //暂无新的优惠券
   if(booleanExists==true){
     swal({
       text: '暂无新的-优惠券',
       confirmButtonText:'关闭',//确认按钮上的文本
       confirmButtonColor: '#ed5565',
       type: 'error'
     })
   }
  }else{
    swal({
      text: '暂无优惠券-分享',
      confirmButtonText:'关闭',//确认按钮上的文本
      confirmButtonColor: '#ed5565',
      type: 'error'
    })
  }
}

//购买优惠券	 用户
function buyDiscountCoupon(typeId){
  var flag = '购买优惠券';
  var userInfo =findUserInfo(typeId);
  var randomNumber = createRandom2(1,-1,FXDiscountCouponArray.length-1);// 取到 分享优惠券中的 一张优惠券购买
  //从分享优化卷中取  一个用户可以购买很多次 同一张优惠券
  if(FXDiscountCouponArray.length>0){

    for (var i = 0; i < FXDiscountCouponArray.length; i++) {

      if(i==randomNumber[0]){

        // 判断当前用户  的余额  是否能购买 足够优惠券
        if(userInfo.alipay>FXDiscountCouponArray[i].couponPresentPrice){

          var purchaseCountCouponInfo=Object.assign({}, FXDiscountCouponArray[i]);//用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
          console.log(purchaseCountCouponInfo);

          purchaseCountCouponInfo.purchaseCountCouponCount=purchaseCountCouponCount;
          purchaseCountCouponInfo.gmDiscountCouponStatus=true;
          purchaseCountCouponInfo.purchaseCountCouponUserId=userInfo.id;
          purchaseCountCouponArray.push(purchaseCountCouponInfo);

          //减去用户的余额
          userInfo.alipay=userInfo.alipay-FXDiscountCouponArray[i].couponPresentPrice;

          //商户余额增加
          var merchantInfo =findUserInfo(FXDiscountCouponArray[i].userId);
          merchantInfo.wjzqZzh=merchantInfo.wjzqZzh+FXDiscountCouponArray[i].couponPresentPrice;

          var currentTime = getCurrentTime();
          frontLogInfoArray.push(flag+'   '+userInfo.username+'购买优惠券ID:'+FXDiscountCouponArray[i].yhjId+' 成功  '+userInfo.username+'支付宝：-'+FXDiscountCouponArray[i].couponPresentPrice+'   商户'+merchantInfo.username+' 玩家挣钱-子账户：+'+FXDiscountCouponArray[i].couponPresentPrice+'   时间：'+currentTime);

          //刷新 用户列表
          showUserList();
          refreshFrontLoginInfo ();
          showBonusPool();

          var buyDiscountCouponInfo = {
            flag:flag,
            couponId:FXDiscountCouponArray[i].yhjId,        //couponId 优惠券ID
            shareUserId:2080,                               //shareUserId 分享人ID
            userPhone:17710300418                           //userPhone 用户电话
          };
          //getCouponOrder返回serNo字段就是serialNumber
          var cmd = 'paySimulation//getCouponOrder';
          var data = JSON.stringify(buyDiscountCouponInfo);
          reqAjax(cmd,data);
          break;

        }else{
          swal({
            // title: '暂无订单',
            text: '余额不足:'+FXDiscountCouponArray[i].couponPresentPrice+' 购买失败',
            confirmButtonText:'关闭',//确认按钮上的文本
            confirmButtonColor: '#ed5565',
            type: 'error'
          })

        }
      }else{
        continue;
      }
    }

  }else{
    swal({
      // title: '暂无订单',
      text: '暂无优惠券-购买',
      confirmButtonText:'关闭',//确认按钮上的文本
      confirmButtonColor: '#ed5565',
      type: 'error'
    })
  }
}

//使用优惠券		 用户
function tryOutDiscountCoupon(typeId){
  var flag = '使用优惠券';
  var booleanExists=true;
  var userInfo =findUserInfo(typeId);
  var randomNumber = createRandom2(1,-1,purchaseCountCouponArray.length-1);// 取到 分享优惠券中的 一张优惠券购买

  if(purchaseCountCouponArray.length>0){
    for (var i = 0; i < purchaseCountCouponArray.length; i++) {

      if(i==randomNumber[0]){
        if(purchaseCountCouponArray[i].purchaseCountCouponUserId==userInfo.id&&purchaseCountCouponArray[i].useDiscountCouponStatus==false){

          //分享优惠券的 余额 增加
          var yhjFxUserInfo =findUserInfo(purchaseCountCouponArray[i].yhjFxUserId);
          yhjFxUserInfo.wjzqZzh=yhjFxUserInfo.wjzqZzh+purchaseCountCouponArray[i].couponCashback;

          //商户余额增加
          var merchantInfo =findUserInfo(purchaseCountCouponArray[i].userId);
          merchantInfo.wjzqZzh=merchantInfo.wjzqZzh-purchaseCountCouponArray[i].couponCashback;

          var currentTime = getCurrentTime();
          frontLogInfoArray.push(flag+'   '+userInfo.username+'使用优惠券ID:'+purchaseCountCouponArray[i].yhjId+' 成功  '+'  商户'+merchantInfo.username+'玩家挣钱-子账户：-'+purchaseCountCouponArray[i].couponCashback+'   分享优惠券用户'+yhjFxUserInfo.username+'玩家挣钱-子账户：+'+purchaseCountCouponArray[i].couponCashback+'   时间：'+currentTime);

          //刷新 用户列表
          showUserList();
          refreshFrontLoginInfo ();
          showBonusPool();

          purchaseCountCouponArray[i].useDiscountCouponStatus=true;

          //serialNumber
          var tryOutDiscountCouponInfo = {
              flag:flag,
              couponId:purchaseCountCouponArray[i].yhjId,
              serialNumber:purchaseCountCouponArray[i].serialNumber
          };

          var cmd = 'paySimulation/checkresult';
          var data = JSON.stringify(tryOutDiscountCouponInfo);
          reqAjax(cmd,data);
          booleanExists=false;
          if(purchaseCountCouponArray[i].useDiscountCouponStatus==true){
            purchaseCountCouponArray.splice(i,1);
          }

          break;
        }

      }else{
        continue;
      }
    }
    if(booleanExists==true){
      swal({
        // title: '暂无订单',
        text: '暂无优惠券-使用',
        confirmButtonText:'关闭',//确认按钮上的文本
        confirmButtonColor: '#ed5565',
        type: 'error'
      })
    }
  }else{
    swal({
      // title: '暂无订单',
      text: '暂无优惠券-使用',
      confirmButtonText:'关闭',//确认按钮上的文本
      confirmButtonColor: '#ed5565',
      type: 'error'
    })
  }
}
