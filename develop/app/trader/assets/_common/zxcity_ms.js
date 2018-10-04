$(document).ready(function() {
	/**
	 * 初始化check选择框的样式
	 */
	$(".i-checks").iCheck({
		checkboxClass : "icheckbox_square-green",
		radioClass : "iradio_square-green",
	});
	//截取字符串长度（适配用）
	var admin=$('.head .user strong');
	if(admin.text().length>5){
		admin.text(admin.text().substring(0,5));
		admin.html(admin.html()+'..');
	}
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
	    offset: '80px',
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

//文本框 与 提示信息框不在同一个div中时：
function initNewValidateForm(){
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
			error.appendTo(element.parent().next(".tipinfo"));
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

//解决bootstrap table带条件查询不在第一页时强制初始化页码
function ImpList_Init(tableId){
    $('#'+tableId).bootstrapTable('refreshOptions',{pageNumber:1});
}

//云店图片裁剪处理公共js方法。。。
function openImgCropPage(imgObj, $this,imgHiddenObj) {
	  top.layer.open({
	    type: 2,
	    area: ['900px', '500px'],
	    title: ['图片裁剪', 'background:#353b53;color:#fff;'],
	    shade: 0.5,
	    closeBtn: 1,
	    shadeClose: false,
	    scrollbar: false,
	    btn: ['确定', '取消'],
	    btnAlign: 'r',
	    content: ctx + '/store/scShopInfo/toImageCrop.do?imgWidth='+$this.width()+'&imgHeight='+$this.height() ,
	    yes: function (index, layero) {
	      var iframeWin = layero.find('iframe')[0]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
	      //提交回调处理
	      iframeWin.contentWindow.sub(imgObj, imgHiddenObj);
	      
	    },cancel:function(index,layero){
	    	 top.layer.close(index);
	    }
	  });
	}

/**
 * 后台整改点击选择店铺处理公共方法js，如果有不统一（比如点击选择店铺的下拉选id必须为shopId而且选择全部店铺那条option值必须为空，双击店铺后刷新页面方法名为refParTable）
 * 的地方需要自己在自己相关的代码处重写此方法不要使用此方法，
 * 并修改方法名即可    2017/11/7   hzj   ----------------------start-------------------
 */
//用于点击选择店铺弹出table选择店铺页面
function showTableCheckShop(){
	layer.open({
		type:	2,
		area:	['800px','620px'],
		title:	'选择店铺',
		closeBtn:	1,//0表示不显示关闭按钮
		content:	ctx+'/live/checkShopShows.do',
		btn:	['全部'],
		yes:	function(index,layero){
			$("#shopId").val("");
			getCheckShopData("");
	        refParTable();
	       	layer.close(index);
		},
		cancel:function(index){
		}
	});
}
//用于选择店铺双击回调
function getCheckShopData(shop_id,orgName){
	 $("#shopId").val(shop_id);
	 refParTable();
}
//------------------------------end---------------------------------------