/**
 * jquery.validate相关扩展验证
 */

//验证用户名       
jQuery.validator.addMethod("userNameCheck", function(value, element) {       
    return this.optional(element) || /^[a-zA-Z]\w{3,18}$/.test(value);       
}, "请输入4-18位字母开头的字母数字下划线");

//字符验证       
jQuery.validator.addMethod("stringCheck", function(value, element) {       
    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);       
}, "只能包括中文字、英文字母、数字和下划线");  

//电子邮箱验证       
jQuery.validator.addMethod("isEmail", function(value, element) {       
    return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/.test(value);     
}, "请正确填写邮箱格式");
		
//手机号码验证       
jQuery.validator.addMethod("isMobile", function(value, element) {       
    var length = value.length;   
    var mobile = /(^(13|14|15|18|17)\d{9}$)/;     
    return this.optional(element) || (length == 11 && mobile.test(value));       
}, "请正确填写您的手机号码");       
     
//电话号码验证       
jQuery.validator.addMethod("isTel", function(value, element) {       
    var tel = /^\d{3,4}-?\d{7,9}$/;    //电话号码格式010-12345678   
    return this.optional(element) || (tel.test(value));       
}, "请正确填写您的座机号码"); 

//联系电话(手机/电话皆可)验证   
jQuery.validator.addMethod("isPhone", function(value,element) {   
    var length = value.length;   
    var mobile = /(^(13|14|15|18)\d{9}$)|(^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$)/;    
    var tel = /^\d{3,4}-?\d{7,9}$/;   
    return this.optional(element) || (tel.test(value) || mobile.test(value));   
  
}, "请正确填写您的联系电话");


//验证中文和英文  
jQuery.validator.addMethod("chinaEnglish", function(value, element) {       
    return this.optional(element) || /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z\u4e00-\u9fa5]*$/i.test(value);      
}, "请输入中文或者英文");

//验证英文  
jQuery.validator.addMethod("englishName", function(value, element) {       
    return this.optional(element) || /^[a-zA-Z]{4,32}$/i.test(value);   
}, "请输入4-32位英文");


jQuery.validator.addMethod("lessTenThousands", function(value, element) {       
    return this.optional(element) || /^(\d{1,4}|10000)$/i.test(value);  
}, "请输入1到10000的整数");

jQuery.validator.addMethod("idCard", function(value, element) {       
    return this.optional(element) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i.test(value);  
}, "请输入正确的18位身份证号");

jQuery.validator.addMethod("oneToNight", function(value, element) {       
    return this.optional(element) || /^[1-9]$/i.test(value);  
}, "请输入1-9");

jQuery.validator.addMethod("oneToNightNight", function(value, element) {       
    return this.optional(element) || /^([1-9]\d{0,1})$/i.test(value);  
}, "请输入1-99范围内的整数");
jQuery.validator.addMethod("oneToNightNightNight", function(value, element) {       
    return this.optional(element) || /^([1-9]\d{0,2})$/i.test(value);  
}, "请输入1-999范围内的整数");
jQuery.validator.addMethod("oneToNightNightNightNightNightNight", function(value, element) {       
    return this.optional(element) || /^([1-9]\d{0,5})$/i.test(value);  
}, "请输入1-999999范围内的整数");


jQuery.validator.addMethod("ipAddress", function(value, element) {       
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/i.test(value);  
}, "请输入正确的ipv4地址");

jQuery.validator.addMethod("ipAddress2", function(value, element) {       
    return this.optional(element) || /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/i.test(value);  
}, "请输入正确的ipv4地址");


jQuery.validator.addMethod("chinaEnglishNum", function(value, element) {       
    return this.optional(element) || /^[0-9a-zA-Z\u4e00-\u9fa5][0-9a-zA-Z\u4e00-\u9fa5]*$/i.test(value); 
}, "请输入中文、英文或数字");


jQuery.validator.addMethod("sixToEighteen", function(value, element) {       
    return this.optional(element) || (value.length>5 && value.length <19); 
}, "请输入6-18位密码");

//验证输入的金额格式
jQuery.validator.addMethod("isMoney", function(value, element) {       
    return this.optional(element) || /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/i.test(value); 
}, "请输入正确格式的金额");

jQuery.validator.addMethod("url", function(value, element) { 
	var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var objExp=new RegExp(Expression);
    return this.optional(element) || objExp.test(value); ; 
}, "请输入正确的url");

jQuery.validator.addMethod("notNegativeFloat", function(value, element) { 
	var Expression=/^\+{0,1}\d+(\.\d{1,2})?$/;
	var objExp=new RegExp(Expression);
	return this.optional(element) || objExp.test(value); ; 
}, "请输入非负浮点数，最多两位小数");

jQuery.validator.addMethod("notNegativeNumber", function(value, element) {
	if(value=='0'){
		return true;
	}
	return this.optional(element) || /^([1-9]\d{0,7})$/i.test(value);  
}, "请输入非负整数");

jQuery.validator.addMethod("notNegativeNumber2", function(value, element) { 
	var Expression="^([1-9][0-9]*)$";
	var objExp=new RegExp(Expression);
	return this.optional(element) || objExp.test(value); 
}, "请输入非零正整数");

jQuery.validator.addMethod("englishOrNum", function(value, element) {       
    return this.optional(element) || /^[0-9a-zA-Z][0-9a-zA-Z]*$/i.test(value); 
}, "请输入英文或数字");

jQuery.validator.addMethod("sixWeiNum", function(value, element) {       
    return this.optional(element) || /^\d{6}$/i.test(value); 
}, "请输入六位数字");

jQuery.validator.addMethod("lessNineNineNineNine", function(value, element) {       
    return this.optional(element) || /^([1-9]\d{0,3})$/i.test(value);  
}, "请输入1到9999的整数");
