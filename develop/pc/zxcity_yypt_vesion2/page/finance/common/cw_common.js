//获取地址栏带过来的参数  根据key取值
function getRequestAddressUrlParameter(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null){
       return  decodeURIComponent(unescape(r[2]));
     }    
     return null;
}

//财务组鼠标回车事件   只针对 #searchbtn
function keyDownEnter() {
  if(event.keyCode==13){
    $("#searchbtn").click();
  }
}

// 金额格式化
function fmoney(s, n) {
	if(null == s || undefined == s) {
		return "";
	}
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
};

//加载用户信息
function showUserInfo(id,type){
  var location = "";
  if(!type){
    location = '../common/userInfo/user_info.html?userId='+id;
  }else if(type==2) {
    location = '../../common/userInfo/user_info.html?userId='+id;
  }
  var index =layer.open({
      type: 2,
      area: ['980px', '600px'],
      fix: false, //不固定
      maxmin: true,
      // shade: 0,
      // skin: 'layui-layer-lan',//layer内置的skin有：layui-layer-lan layui-layer-molv
      title : "用户详情",
      content: location,
      //btn: ['立即关闭', '确认支付'], //只是为了演示
      // btn1: function(){
      //     layer.close(index);
      // },
      // btn2: function(){
      //
      // },
      // 弹窗加载成功的时候
      success : function() {

      },
   });
}

function openInfoView(type, merchantId){
	
	if(merchantId == '' || merchantId == null || merchantId == undefined){
		layer.msg("用户ID错误！");
		return false;
	}

	if(type == 1){	// 商户
		/**
		 * iframe层
		 */
		layer.open({
		  type: 2,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "商户账户详细信息",
		  content: "../common/merchantInfo.html?type=1&merchantId=" + merchantId
		});

	} else if(type == 0) {	// 平台用户

		/**
		 * iframe层
		 */
		layer.open({
		  type: 2,
		  area: ['800px', '500px'],
		  fix: false, //不固定
		  maxmin: false,
		  title : "用户账户详细信息",
		  content: "../common/userInfo.html?type=0&merchantId=" + merchantId
		});


	}else if (type == 3) {//主播
		/**
		 * iframe层
		 */
		layer.open({
			type: 2,
			area: ['800px', '500px'],
			fix: false, //不固定
			maxmin: false,
			title : "主播详细信息",
			content: "../common/anchorInfo.html?type=1&merchantId=" + merchantId
		 });
	}

}


//限制只能输入数字 和 2位小数
function clearNoNum(obj){
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value= parseFloat(obj.value);
    }
}

function trim(str){ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 去掉null空字符，且返回N个字符
 */
function newStrByNum(str,num) { 
	if (str == '' || str == null || str == undefined) {
		str = '';
	} 
	str = trim(str);
	if(str.length>=num){
		return str.substring(0,num);
	}
    return str;
}

