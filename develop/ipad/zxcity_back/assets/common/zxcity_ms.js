$(document).ready(function() {
	/**
	 * 初始化check选择框的样式
	 */
	$(".i-checks").iCheck({
		checkboxClass : "icheckbox_square-green",
		radioClass : "iradio_square-green",
	});
});



//打开对话框(添加修改)
function openDialog(title,url,width,height,target){
	top.layer.open({
	    type: 2,  
	    area: [width+'px', height+'px'],
	    title: title,
        maxmin: true, //开启最大化最小化按钮
	    content: url ,
	    btn: ['确定', '关闭'],
	    yes: function(index, layero){
	    	 //获取到弹框里面的body
	    	 var body = top.layer.getChildFrame('body', index);
	         var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
	         var inputForm = body.find('#inputForm');
	         var top_iframe;
	         if(target){
	        	 top_iframe = target;//如果指定了iframe，则在改frame中跳转
	         }else{
	        	 top_iframe = top.getActiveTab().attr("name");//获取当前active的tab的iframe 
	         }
	         inputForm.attr("target",top_iframe);//表单提交成功后，从服务器返回的url在当前tab中展示
//	         console.log(inputForm);
//	         console.log(top_iframe);
	         //提交
	         iframeWin.contentWindow.doSubmit();
		  },
		  cancel: function(index){ 
	       }
	}); 	
	
}

//打开对话框(查看)
function openDialogView(title,url,width,height){
	top.layer.open({
	    type: 2,  
	    area: [width+'px', height+'px'],
	    title: title,
        maxmin: true, //开启最大化最小化按钮
	    content: url ,
	    btn: ['关闭'],
	    cancel: function(index){ 
	       }
	}); 	
	
}

//cookie操作
function cookie(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

function getActiveTab(){
	return $(".J_iframe:visible");
}


/**
 * 显示加载框
 */
function loading(mess){
	if (mess == undefined || mess == ""){
		mess = "正在提交，请稍等...";
	}
	layer.msg(mess, {icon: 4});
}

/**
 * 增改页面
 */
// 初始化验证(用于弹框)
function initValidateForm(){
	return $("#inputForm").validate({
		/*
		 * submit提交表单，验证都通过的时候调用的方法
		 */
		submitHandler : function(form) {
			loading('正在提交，请稍等...');
			form.submit();
		},
		errorElement : "font",//
		errorPlacement : function(error, element) {//错误信息放置的地方
			error.appendTo(element.parent().find(".tipinfo"));
		}
	});
}

//关闭窗口
function cacelWin(){
	var index = top.layer.getFrameIndex(window.name);
	top.layer.close(index);
}

// 刷新table
function refParTable(){
	try {
		var ifr = top.$(".J_iframe:visible");
		$(ifr)[0].contentWindow.refreshTable();
	} catch (e) {
	}
	
}

/*
 * 遮罩效果
 */
function shadeEffect(){
	top.layer.msg('提交中', {
		icon : 16,
		shade : [ 0.5, '#f5f5f5' ],
		scrollbar : false,
		time : 20000
	});
}

/*
 * 1000s的遮罩效果
 */
function shadeEffect2(){
	top.layer.msg('提交中', {
		icon : 16,
		shade : [ 0.5, '#f5f5f5' ],
		scrollbar : false,
		time : 1000000
	});
}
