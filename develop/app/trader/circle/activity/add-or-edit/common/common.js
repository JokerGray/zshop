
var towpointer = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
//清除input中的\t等特殊字符
function clearSpecialStr(element) {
	var inputList = $('#' + element + ' input'); //.children('input');
	inputList.each(function(i, n) {
		var obj = $(n);
		var str = obj.val();
		obj.val(str.replace(/[\t\v\f]/g, ''));
	});
	inputList = null;
	inputList = $('#' + element + ' textarea'); //.children('input');
	inputList.each(function(i, n) {
		var obj = $(n);
		var str = obj.val();
		obj.val(str.replace(/[\t\v\f]/g, ''));
	});
}

function postData(url, data, callBack) {
	$.post(url, data, callBack);
}

function loginCheck() {
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.ERROR == '未登录') { //(data.total == 0 && data.ERROR == 'No Login!')
				alerts('登录超时,请重新登录!');
				relogin();
			}
			if (data.total == 0 && data.STATUS) {
				//$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '还未开办会员卡');
			}
			$('#dg12345').datagrid('doCellTip', {
				onlyShowInterrupt: false, //是否只有在文字被截断时才显示tip，默认值为false             
				position: 'bottom', //tip的位置，可以为top,botom,right,left
				cls: {
					'background-color': '#FFF'
				}, //tip的样式D1EEEE
				delay: 100 //tip 响应时间
			});
		},
		onLoadError: function() {
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '网络连接错误！');
		},
		onHeaderContextMenu: function(e, field) {
			e.preventDefault();
			if (!cmenu) {
				createColumnMenu();
			}
			cmenu.menu('show', {
				left: e.pageX,
				top: e.pageY
			});
		}
	});
}

function msgLoading(close) {
	var loading = '<div id="loadingCir" style="position:absolute;z-index:9999;background-color:#fff;opacity:0.4;top:0;left:0;right:0;bottom:0;"><img style="display:block;position:absolute;width:50px;margin-left:-15px;margin-top:-15px;left:50%;top:50%;" src="js/themes/common/loading.gif" alt="" /></div>';
	if (close == 'close') {
		$('#loadingCir').remove();
	} else {
		$('body').append(loading);
	}
}

function dateTest(date) {
	var pattern = /((((1[6-9]|[2-9]\d)\d{2})-(1[02]|0?[13578])-([12]\d|3[01]|0?[1-9]))|(((1[6-9]|[2-9]\d)\d{2})-(1[012]|0?[13456789])-([12]\d|30|0?[1-9]))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(1\d|2[0-8]|0?[1-9]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))/;
	return pattern.test(date);
}

function timeTest(time) {
	var pattern = /([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d/;
	return pattern.test(time);
}

function formatRemark(value) {
	var content = value;
	if (value == '' || !value) {
		return '-'
	} else {
		content = content.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "");
	};
	if (content.length > 8) {
		content = content.substring(0, 8) + '...';
		value = value.replace(/\[/g, "").replace(/\]/g, "").replace(/\"/g, "");
		return '<span style="position:relative;" onmouseover="titelShow(\'' + value + '\',$(this))" onmouseout="titelShow(\'' + value + '\',$(this),1)">' + content + '<textarea class="titelhow" rows="3" disabled="disabled" style="position:absolute;box-sizing:border-box;width:100%;font-size:12px;background-color:white;top:0px;left:0;z-index:1;color: black;  padding: 0 5px;  border: 1px solid #eee;  border-radius: 3px;resize:none;display:none;">' + value + '</textarea></span>';
	} else {
		return '<span style="position:relative;" >' + content + '</span>';
	}
}

//禁止输入框输入非数字和小于0的数，用法在input输入框加属性onkeyup="isnum(this)" onafterpaste="delunum(this)"即可
function isnum(e){
	if(e.value.length==1){e.value=e.value.replace(/[^0-9]/g,'')}else{e.value=e.value.replace(/\D/g,'')}
}
function delunum(e){
	if(e.value.length==1){e.value=e.value.replace(/[^0-9]/g,'')}else{e.value=e.value.replace(/\D/g,'')}
}

function checkLogin(data){
	if(data.INFO == "权限验证不通过"){
		alerts('登陆超时请重新登陆！');
		relogin();
		return false;
	}
}

function isTelephone(obj){
	var pattern = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
	if (pattern.test(obj)) {
		return true;
	} else {
		return false;
	}
}


function alerts(s, t, btn) {
	var t = t ? t : 1500;
	var btn = btn ? true : false;
	if (btn) {
		layer.msg(s, { time: t, btn: ['确定'] });
	} else {
		layer.msg(s, { time: t });
	}
}
/* 鼠标移动上去出现提示--- start */
/*
	@param 
	ele: 需要提示的jquery元素对象
	text: 提示文字
	使用方法： 例：tips( $('#head'), '我就是提示文字');
*/
function tips(ele,text){
	ele.mouseover(function(){			
		layer.tips(text, ele, {
		  tipsMore: true,
		  tips: [2, 'rgba(0,0,0,0.8)'],
		  time: 1000
		});
	})
}
/* 鼠标移动上去出现提示--end */





/* 图片上传----start */
/* 使用方方式：
	1.在html中直接粘贴一下两行html代码即可，
		<a onclick="clickInputFile(this)" class="headicon">+</a>
		<input type="file" name="image" style="opacity:0;filter:alpha(opacity=0);" id="inputfile" accept="image/jpeg, image/png, image/jpg, image/webp"/>
		<input type="hidden" value="" id="getimgurl">
	2.获取上传成功的后的图片地址的方法：
		var imgurl = getImgUrl();
		此时imgrul就是上传成功后的图片地址：
		imgrul = 'xxxxxxx.jpg'
*/
var currentImgClick = '';
function clickInputFile(e) {
 	currentImgClick = $(e);
    $('#inputfile').click();
}

//获取对应时间的年月日时分秒,index对应说明: 1=>年月日时分秒 2=>月份 3=>日期 4=>星期 5=>年月日 6=>时分 7=>时分秒 8=>年 9=>年月日拼接完整格式
function getSec(val,index){
	var _date = new Date(val);
	var nowYear = _date.getFullYear();
	var nowMonth = _date.getMonth() + 1;
	var nowDate = _date.getDate();
	var nowHours = _date.getHours();
	var nowMinutes = _date.getMinutes();
	var nowSeconds = _date.getSeconds();
	var nowDay = _date.getDay();
	if(nowMonth < 10){
		nowMonth = '0' + nowMonth;
	}
	if(nowDate < 10){
		nowDate = '0' + nowDate;
	}
	if(nowHours < 10){
		nowHours = '0' + nowHours;
	}
	if(nowMinutes < 10){
		nowMinutes = '0' + nowMinutes;
	}
	if(nowSeconds < 10){
		nowSeconds = '0' + nowSeconds;
	}
	if(index == 1){
		return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
	}else if(index == 2){
		return nowMonth;
	}else if(index == 3){
		return nowDate;
	}else if(index == 4){
		return nowDay;
	}else if(index == 5){
		return nowYear + '-' + nowMonth + '-' + nowDate;
	}else if(index == 6){
		return nowHours + ':' + nowMinutes;
	}else if(index == 7){
		return nowHours + ':' + nowMinutes + ':' + nowSeconds;
	}else if(index == 8){
		return nowYear;
	}else if(index == 9){
		return nowYear + '-' + nowMonth + '-' + nowDate + ' 00:00:00';
	}
	return nowYear + '-' + nowMonth + '-' + nowDate + ' ' + nowHours + ':' + nowMinutes + ':' + nowSeconds;
}

/*-------------oss 图片上传 ====start====  ----------------*/
/*
		使用方法： 
		var viewFiles = document.getElementById("file_title_img"); //js获取input[type=file]的文件元素
		var viewFiles = $('#file_title_img')[0]; /jquery获取input[type=file]的文件元素
		Common.uploadFile(viewFiles.files[0],{
			progress: function(e) { //文件进度
				console.log(e);
			},
			success: function(e) {  //文件上传成功回掉
				console.log(e);
			},
			error: function(e) {  //文件上传失败
				console.log(e);
			}
		});
*/


function Common(){};
Common.uploadFile = function (file, callback) {
	if(typeof(file) == 'undefined'){
		msgLoading('close');
		return false;
	}
	if(typeof(file.name) == "undefined"){
        file.name = 'camera.png'
    }
    var index1 = file.name.lastIndexOf(".");
    var index2 = file.name.length;
    var suffix = file.name.substring(index1 + 1, index2);

    Common.getFileInfo(file, {
        success: function (md5) {
            //获取上传链接
            $.ajax({
                type: 'post',
                url: '../file/FileAction!getUploadUrl.zk',
                data: {
                    md5: md5,
                    type: suffix,
                    // AdminToken: Common.getAdminToken()
                },
                dataType: 'json',
                success: function (data) {
                    var url = data.url;
                    var key = data.key;

                    var fileData = {
                        key: key,
                        size: file.size,
                        type: file.type,
                        format: suffix
                    };

                    var xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = function (evt) {
                    	 if (evt.lengthComputable) {  
		                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);    
		                    console.log("正在提交."+percentComplete.toString() + '%');        //在控制台打印上传进度  
		                    callback.progress(percentComplete.toString() + '%')
		                }  
                        // callback.progress((e.loaded / e.total * 100).toFixed(1));
                    };
                    xhr.upload.onload = function (e) {
                        var jsonStr = JSON.stringify(fileData);
                        callback.success(jsonStr);
                    };
                    xhr.onerror = function (e) {
                        callback.error('上传失败');
                    };
                    xhr.open("PUT", url);
                    xhr.setRequestHeader('Content-Type', 'application/file');
                    xhr.send(file);
                },
                error: function (xhr, type, error) {
                    Common.checkError(xhr);
                    callback.error('上传失败');
                }
            });
        },
        error: function () {
            callback.error('上传失败');
        }
    });
};

Common.getFileInfo = function (file, callback) {
    var tmp_md5;
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 8097152,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    fileReader.onload = function (e) {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
            loadNext();
        } else {
            tmp_md5 = spark.end();
            callback.success(tmp_md5);
        }
    };

    fileReader.onerror = function () {
        callback.error();
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
};

/*-------------oss 图片上传 ====end====  ----------------*/