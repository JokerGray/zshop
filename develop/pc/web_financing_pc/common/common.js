//***********名称和身份证号码数组长度得一一对应   注意***************
//名称  数组
var nameAry =  ['在下、豹子头-零冲','王大锤','张三','李四','脆皮鸡-大表哥'];
//身份证号 数组
var idNumberAry = ['4201151999999999995','4201151999999999996','4201151999999999997','4201151999999999998','4201151999999999999'];
//手机号数组
var phoneAry = ['17710300414','17710300415','17710300416','17710300417','17710300418'];

//城市 数组
var cityArray = ['北京-望京西','武汉-青鱼嘴','上海-榔头','哈尔滨-黑龙江','陕西-西安'];

//获得名称 、身份证号、手机号
function getUserInfo(){
    var randomNumber= createRandom2(1,-1,nameAry.length-1);
    var nameVar = nameAry[randomNumber[0]];
    var idNumberVar= idNumberAry[randomNumber[0]];
    var phoneVar= phoneAry[randomNumber[0]];

    var userinfo = {
        name:nameVar,
        idNumber:idNumberVar,
        phone:phoneVar
    }
    return userinfo;  
}

//获得城市
function getCity(){
    var randomNumber= createRandom2(1,-1,cityArray.length-1);
    return cityArray[randomNumber[0]];
}


//获得随机客户
function findRandomClient(){
  var clientInfo = '';
  //获取随机用户   客户 1   和 客户2
  var randomClient=createRandom2(1,0,2);
  for (var i = 0; i < userInfoArray.length; i++) {
    if(userInfoArray[i].id==randomClient[0]){
        clientInfo=userInfoArray[i];
        break;
    }
  }
  return clientInfo;
}

//获得随机商户
function findRandomMerchant(){
  var merchantInfo = '';
  //获取随机商户   商户3   和 商户4
  var randomMerchant=createRandom2(1,2,4);
  if(randomMerchant[0]==3){
    randomMerchant[0]=65;
  }else if (randomMerchant[0]==4) {
    randomMerchant[0]=1070;
  }
  for (var i = 0; i < userInfoArray.length; i++) {
    if(userInfoArray[i].id==randomMerchant[0]){
        merchantInfo=userInfoArray[i];
        break;
    }
  }
  return merchantInfo;
}

//获得随机的 客户 或者 商户
function findRandomClientOrMerchant(){
  var RandomClientOrMerchantInfo = '';
  //获取随机商户   商户3   和 商户4
  var randomMerchant=createRandom2(1,0,4);
  if(randomMerchant[0]==3){
    randomMerchant[0]=65;
  }else if (randomMerchant[0]==4) {
    randomMerchant[0]=1070;
  }
  for (var i = 0; i < userInfoArray.length; i++) {
    if(userInfoArray[i].id==randomMerchant[0]){
        RandomClientOrMerchantInfo = userInfoArray[i];
        break;
    }
  }
  return RandomClientOrMerchantInfo;
}

//根据id 获得 客货 或者 商户 信息
function findUserInfo(id){
var userInfo = '';
for (var i = 0; i < userInfoArray.length; i++) {
  if(userInfoArray[i].id==id){
      userInfo = userInfoArray[i];
      break;
  }
}
return userInfo;
}

/*
num 要产生多少个随机数
from 产生随机数的最小值
to 产生随机数的最大值
*/
function createRandom(num ,from ,to ){
  var arr=[];
  for(var i=from;i<=to;i++)
      arr.push(i);
  arr.sort(function(){
      return 0.5-Math.random();
  });
  arr.length=num;
  return arr;
}
function createRandom2(num , from , to){
  var arr=[];
  var json={};
  while(arr.length<num){
      //产生单个随机数
      var ranNum=Math.ceil(Math.random()*(to-from))+from;
      //通过判断json对象的索引值是否存在 来标记 是否重复
      if(!json[ranNum]){
          json[ranNum]=1;
          arr.push(ranNum);
      }
  }
  return arr;
}

/*
* 获取当前时间
*/
function p(s) {
  return s < 10 ? '0' + s: s;
}
function getCurrentTime () {
var myDate = new Date();        //获取当前年
var year=myDate.getFullYear();  //获取当前月
var month=myDate.getMonth()+1;  //获取当前日
var date=myDate.getDate();
var h=myDate.getHours();       //获取当前小时数(0-23)
var m=myDate.getMinutes();     //获取当前分钟数(0-59)
var s=myDate.getSeconds();
return now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
}
