layui.use(['jquery','table','form','laypage'], function() {
    $=layui.jquery,table=layui.table,form=layui.form,laypage=layui.laypage,layer=layui.layer;;
})
var page = 1;
var rows = 15;
var AREA = ['90%', '90%'];
var TITLE = ['', 'font-size:12px;background-color:rgb(66, 70, 81);color:#fff'];
var SHADE = [0.2, '#000'];

var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号

var mobileExp = /^1[3,5,7-8][0-9]{9}$/i; //手机正则
var passwordExp = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9a-zA-Z]{6,16}$/; //密码正则
var messageExp = /^[0-9]{6}$/; //验证码正则
var nameExp = /^[\u4E00-\u9FA5]{2,10}$/; //真实姓名
var emailExp = /^[a-z0-9]+([._\-]*[a-z0-9])*@([-a-z0-9]*[a-z0-9]+.){2,63}[a-z0-9]+$/i; //邮箱绑定
var videoExp = /[·\~\`\!\^\￥\……\！\$\@\(\)\（\）\_\——\#\+\*\/\-\=\$%\^&\*]{1,20}$/g; //视频
var address = /^[A-Za-z0-9#\(\)（）\u4E00-\u9FA5]{1,50}$/; //地址
var amountExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/; //金额
var idcard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //身份证
var $company_name = /^[A-Za-z\u4E00-\u9FA5]{1,90}$/; //企业名称
var $website = /^((http:\/\/)|(https:\/\/))[0-9a-zA-Z-.]{1,90}$/; //网址

//校验正则表达式
function reg(val, exp) {
	if(!exp.test(val)) {
		return false;
	} else {
		return true;
	}
}
//判断视频名称
function is_video(val) {
	return reg(val, videoExp);
}
//判断地址
function is_address(val) {
	return reg(val, address);
}
//判断金额
function is_amount(val) {
	return reg(val, amountExp);
}
//判断真实姓名正则
function is_name(val) {
	return reg(val, nameExp);
}
//判断手机正则
function is_mobile(val) {
	return reg(val, mobileExp);
}
//判断密码正则
function is_password(val) {
	return reg(val, passwordExp);
}
//判断验证码正则
function is_message(val) {
	return reg(val, messageExp);
}
//判断推荐码正则
function is_okey(val) {
	return reg(val, okeyExp);
}
//判断邮箱正则
function is_email(val) {
	if(val.length > 50) {
		return false;
	}
	return reg(val, emailExp);
}
//判断企业名称
function is_company_name(val) {
	return reg(val, $company_name);
}
//判断省份
function is_province(val) {
	return reg(val, $province);
}
//判断城市
function is_city(val) {
	return reg(val, $city);
}
//判断身份证方法
function is_identity(id) {
	var strlen = id.length;
	if(strlen != 18) {
		return false;
	}
	var set = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var ver = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'];
	var arr = id.split("");
	var sum = 0;
	for(var i = 0; i < 17; i++) {
		if(isNaN(arr[i])) {
			return false;
		}
		sum += arr[i] * set[i];
	}
	var mod = sum % 11;
	if(ver[mod] != arr[17]) {
		if(mod == 2) {
			if(arr[17] == "X" || arr[17] == "x") {
				return true;
			}
		}
		return false;
	}
	return true;
}

//计算倒计时,dom&时间戳
function countdown(dom, closeTime) {
	var displayTime;

	function showTime() {
		var day = Math.floor(closeTime / (60 * 60 * 24));
		var hour = Math.floor(closeTime / (3600)) - (day * 24);
		var minute = Math.floor(closeTime / (60)) - (day * 24 * 60) - (hour * 60);
		var second = Math.floor(closeTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
		closeTime -= 1;
		var html = day + '天' + hour + '小时' + minute + '分' + second + '秒';
		dom.html(html);
		if(closeTime == -1) {
			clearInterval(displayTime);
			document.location.href = document.location.href;
			return;
		}
	}
	showTime();
	displayTime = setInterval(function() {
		showTime();
	}, 1000)
}

//把数组字符串转换为数字
function strToNum(arr) {
	var json = [];
	for(var i = 0; i < arr.length; i++) {
		json.push(arr[i] - 0);
	}
	return json;
}

//判断正整数加".00"
function isPositiveNum(s) {
	var re = /^[0-9]*[1-9][0-9]*$/;
	if(re.test(s)) {
		s = s + ".00";
	}
	return s;
}

/**
 * 操作cookie
 * @param key 
 * @param val
 * @param exp 有效期单位为秒
 */
function setCookie(key, val, exp) {
	var d = new Date();
	d.setTime(d.getTime() + exp * 1000); //1000为毫秒
	var expires = "expires=" + d.toUTCString();
	document.cookie = key + "=" + val + ";" + expires + ";path=/";
}

function getCookie(key) {
	var cookieArr = document.cookie.split(';');
	for(var i = 0; i < cookieArr.length; i++) {
		var u = cookieArr[i];
		u = u.replace(/(^\s*)|(\s*$)/g, '');
		var d = u.split('=');
		if(key == d[0]) {
			return d[1];
		}
	}
}

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

// 数字动画
function countUp(dom, val) {
	var options = {  
		useEasing: true,
		useGrouping: true,
		separator: ',',
		decimal: '.',
		prefix: '',
		suffix: ''
	};
	var val = val - 0;
	var demo = new CountUp(dom, 0, val, 0, 1, options);
	demo.start();
}

//判断input输入长度
function inputLen(inputStar) {
	var bytesCount = 0;
	for(var i = 0; i < inputStar.length; i++) {
		var c = inputStar.charAt(i);
		bytesCount += 1;
	}
	return bytesCount;
}

//判断是否为空
function isNull(val) {
	if(val == null || val == "null" || val == undefined || val == "") {
		return true;
	}
	return false;
}

//删除数组指定元素
function removeByValue(arr, val) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}
/**
 * 获取地址栏URL里的参数集
 */
function getParams(url) {
	// var url = location.search;
	var params = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return params;
}

/**
 * 根据参数名获取地址栏URL里的参数
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

/**
 * 通用接口同步调用方法
 * @param cmd 接口访问地址 
 * @param data 接入参数
 */
function reqAjax(cmd, data) {
	var reData;
	$.ajax({
		type: "POST",
		url: "/zxcity_restful/ws/rest",
		dataType: "json",
		async: false,
		data: {
			"cmd": cmd,
			"data": data,
			"version": version
		},
		beforeSend: function(request) {
			layer.load(0, {
				shade: [0.1, '#fff']
			});
			request.setRequestHeader("apikey", apikey);
		},
		success: function(re) {
			layer.closeAll('loading');
			reData = re;
		},
		error: function(re) {
			layer.closeAll('loading');
			var str1 = JSON.stringify(re);
			re.code = 9;
			re.msg = str1;
			reData = re;
		}
	});
	return reData;
}


/**
 * 通用接口同步调用方法
 * @param cmd 接口访问地址 
 * @param data 接入参数
 */

function reqAjaxAsync(cmd, data, async) {
	var defer = $.Deferred();
	$.ajax({
		type: "POST",
		url: "/zxcity_restful/ws/rest",
		dataType: "json",
		async: async || true, //默认为异步
		data: {
			"cmd": cmd,
			"data": data || "",
			"version": version
		},
		beforeSend: function(request) {
			layer.load(1, {
				shade: [0.1, '#fff']
			});
			request.setRequestHeader("apikey", apikey);
		},
		success: function(data) {
			layer.closeAll('loading');
			defer.resolve(data);
		},
		error: function(err) {
			layer.closeAll('loading');
			layer.msg("系统繁忙，请稍后再试!");
			console.log(err.status + ":" + err.statusText);
		}
	});
	return defer.promise();
}

/**
 * @desc 将时间戳转换为YYYY-MM-DD格式
 * @access public
 * @param 时间戳
 * @return string
 */
function formatDate(now) {
	var d = new Date(now * 1000);
	var month = parseInt(d.getMonth()) + 1;
	var day = parseInt(d.getDate());
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	return d.getFullYear() + "-" + month + "-" + day;
}

/**
 * @desc 将时间戳转换为YYYY-MM-DD HH:ii
 * @access public
 * @param
 * @return string
 */
function formatDateTime(now) {
	var d = new Date(now * 1000);
	var hour = parseInt(d.getHours());
	var minute = parseInt(d.getMinutes());
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minute < 10) {
		minute = "0" + minute;
	}
	return formatDate(now) + " " + hour + ":" + minute;
}

/*动态加载js css*/
function jsorcss(type, url) {
	try {
		var s = "";
		var date = new Date();
		date = date.getMilliseconds();
		date = date.toString();
		if(type == 'css') {
			s = "<link rel='stylesheet' href=" + url + ".css?v=" + date + " media='all'/>"
			$(s).appendTo('head');
		} else if(type == 'js') {
			s = "<script type='text/javascript' src=" + url + ".js?v=" + date + "></script>";
			$(s).appendTo('body');
		}
	} catch(e) {
		console.log(e)
	}
}

	/*导出excel*/
	function downloadFile(url,parms) {
		//定义要下载的excel文件路径名
		var excelFilePathName = "";
		//1. 发送下载请求 , 业务不同，向server请求的地址不同
		reqAjaxAsync(url,parms).then(function(excelUrl) {
				if(excelUrl.code != 1) {
					layer.msg(excelUrl.msg);
				} else {
					//2.获取下载URL
					excelFilePathName = excelUrl.data;
					//3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
					if("" != excelFilePathName) {
						var aIframe = document.createElement("iframe");
						aIframe.src = excelFilePathName;
						aIframe.style.display = "none";
						document.body.appendChild(aIframe);
					}
				}
	
			})
		}
	
	//禁止用F5键 
//	document.onkeydown = function(e){
//	    e = window.event || e;
//	    var keycode = e.keyCode || e.which;
//	    if(keycode == 116){
//	        if(window.event){// ie
//	            try{e.keyCode = 0;}catch(e){}
//	            e.returnValue = false;
//	        }else{// firefox
//	            e.preventDefault();
//	        }
//	    }
//	} 
//
//表格



/**
 * @desc 金额转换，保留2位小数并四舍五入
 * @author：qiurui
 * @param  num / string : 1000.59
 * @return string : 1,000.60
 */
function getMoneyFormat(number) {
    number = number + ''; //数字转换成字符串
    number = number.replace(/\,/g, ""); //将 , 转换为空
    //判断是否是数字
    if (isNaN(number) || number == "") {
        return "";
    }
    //四舍五入,保留2位
    number = Math.round(number * 100) / 100;
    //是否是负数
    if (number < 0) {
        return '-' + getFormatYuan(Math.floor(Math.abs(number) - 0) + '') + getFormatCents(Math.abs(number) - 0);
    } else {
        return getFormatYuan(Math.floor(number - 0) + '') + getFormatCents(number - 0);
    }
    //格式化整数
    function getFormatYuan(number) {
        //判断是否是0.几几
        if (number.length <= 3) {
            return (number == '' ? '0' : number);
        } else {
            var mod = number.length % 3; //求余
            //截取字符开头的数字
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                //mod==0 && i==0 说明数字的长度被3整除；第一次循环的时候截取（0,3）位
                if ((mod == 0) && (i == 0)) {
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                } else {
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
            }
            return (output);
        }
    }
    //格式化小数
    function getFormatCents(amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);
    }
}


//渲染数据
function setDatas(demo,data){
    var inputArr = demo.find('input');
    var imgArr = demo.find('img');
    var selectArr = demo.find('select');
    var textarea = demo.find('textarea');
    setArr(inputArr,data);
    setArr(imgArr,data,'');
    setArr(selectArr,data);
    setArr(textarea,data);
    form.render()

}
//遍历数组，填充数据
function setArr(arr,data,img){
    var ids = '';
    $.each(arr,function (index, item) {
        ids = $(this).attr('id');
        if(data.hasOwnProperty(ids)){
            if(img !== undefined){
                $(this).attr('src',data[ids] || '../../common/images/placeholder.png')
            }else{
                $(this).val(data[ids]);
            }
        }
    })
}
//清空数据
function emptyInput(demo){
    demo.find('textarea,input,select').val('');
    demo.find('img').attr('src','');
    demo.find('input,select,textarea').attr('disabled',false)
    form.render()
}
//给保存按钮添加form属性
function setForms(form){
    $("div.layui-layer-page").addClass("layui-form");
    $("a.layui-layer-btn0").attr("lay-submit","");
    $("a.layui-layer-btn0").attr("lay-filter",form);
}
//点击变色
$('body').on('click', 'tbody tr', function() {
    $(this).addClass('layui-table-click').siblings().removeClass('layui-table-click');
})
//表格模板
function tableInit(tableId, cols, pageCallback, pageLeft) {
    var tableIns, tablePage;
    //1.表格配置
    tableIns = table.render({
        id: tableId,
        elem: '#' + tableId,
        height: 'full',
        cols: cols,
        page: false,
        even: true,
        skin: 'row',
        limit: 15,
    });

    //2.第一次加载
    pageCallback(page,rows).done(function (res) {
        //第一页，一页显示15条数据
        if(res.code == 1) {
            tableIns.reload({
                data: res.data
            })
        } else {
            layer.msg(res.msg)
        }
        //3.left table page
        var page_options = {
            elem: pageLeft,
            count: res ? res.total : 0,
            layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
            limits: [15, 30],
            limit: 15
        }
        page_options.jump = function(obj, first) {
            tablePage = obj;

            //首次不执行
            if(!first) {
                	pageCallback(obj.curr, obj.limit).done(function (resTwo) {
                    if(resTwo && resTwo.code == 1)
                        tableIns.reload({
                            data: resTwo.data,
                            limit:obj.limit
                        });
                    else
                        layer.msg(resTwo.msg);
                })

            }
        }

        laypage.render(page_options);

        return {
            tablePage,
            tableIns
        };
    });

}
//弹出层分封装
//如果确定有回调 就传
var _index = 0;
function layerOpen(title,el,forName,pageCallback){
    TITLE[0] = title;
    layer.open({
        title: TITLE,
        type: 1,
        content: el, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        area: AREA,
		shade:SHADE,
        btn:['确认','取消'],
        end: function (layero,index) {
            layer.close(index);
            emptyInput(el);
        },
        success:function (layero,index) {
            setForms(forName)
        },
        yes:function (index) {
        	if(pageCallback == undefined){
                layer.close(index);
			}else{
                _index=index;
			}
        },
        btn1:function(){
            layer.close(index);
        },

    })
}
/*导出excel*/
function downloadFile(url,parms) {
    //定义要下载的excel文件路径名
    var excelFilePathName = "";
    //1. 发送下载请求 , 业务不同，向server请求的地址不同
    reqAjaxAsync(url,parms).then(function(excelUrl) {
        if(excelUrl.code != 1) {
            layer.msg(excelUrl.msg);
        } else {
            //2.获取下载URL
            excelFilePathName = excelUrl.data;
            //3.下载 (可以定义1个名字，创建前先做删除；以下代码不动也可以用)
            if("" != excelFilePathName) {
                var aIframe = document.createElement("iframe");
                aIframe.src = excelFilePathName;
                aIframe.style.display = "none";
                document.body.appendChild(aIframe);
            }
        }

    })
}
//设置省市
function proviceSelect(cmd,prvid,cityid) {
    function getProvice(pid,ids) {
        return reqAjaxAsync(cmd,JSON.stringify({'parentcode':pid})).done(function (res) {
            if(res.code == 1){
                var datas =  res.data;
                console.log(datas)
                var pstr = '<option value="">请选择</option>'
                if(ids == cityid){
                    pstr = ''
                }
                $.each(datas,function (i, item) {
                    pstr+='<option value="'+item.code+'">'+item.areaname+'</option>'
                })
                ids.html(pstr)

                form.render()
            }
        })
    }
    getProvice(0,prvid);
    form.on('select(provinceSelector)',function (obj) {
        var value = obj.value;
        if(value){
            cityid.removeAttr('disabled');
            getProvice(value,cityid);
        }else{
            cityid.html('').attr('disabled',true)
        }
        form.render()
    })
}

//取消冒泡
function stopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}


