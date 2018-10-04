/**
 * author:  
 * name:    公用js
 * date:    2017/4/18
 * version: 1.0.0
 */

/**
 * 去掉null空字符
 */
function newStr(str) {
	if (str == '' || str == null || str == undefined) {
		str = '';
	} 
    return trim(str);
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

function isNullOrEmpty(strVal) {
	if (strVal == '' || strVal == null || strVal == undefined) {
		return true;
	} else {
		return false;
	}
}

function trim(str){ //删除左右两端的空格
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
}

function ltrim(str){ //删除左边的空格
　　     return str.replace(/(^\s*)/g,"");
}

function rtrim(str){ //删除右边的空格
　　     return str.replace(/(\s*$)/g,"");
}


/**
 * 去掉null空字符，且返回N个字符
 */
function getYMDHmm(value){ //将超过18位的日期转为18位
	if(value==null){
		return "";
	}else{
		 if (value.length > 19) {
			value = value.substring(0,19);
		 }
		 return value;
	}
}
