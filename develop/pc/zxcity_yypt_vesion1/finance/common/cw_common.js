//获取地址栏带过来的参数  根据key取值
function getRequestAddressUrlParameter(name){
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if(r!=null){
     return  decodeURIComponent(unescape(r[2]));
   }
   return null;
}

//获取地址栏带过来的参数  根据key取值(参数中有中文时, 需对url编码, 然后在此方法中解码, 以防乱码)
function getUrlParams(name){
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var params = window.location.search;
   if(params){
	   params = decodeURI(params);
	   var r = params.substr(1).match(reg);
	   if(r!=null){
	     return  decodeURIComponent(unescape(r[2]));
	   }
   }
   return null;
}


// 财务组鼠标回车事件   只针对 #searchbtn
function keyDownEnter() {
  if(event.keyCode==13){
    $("#searchbtn").click();
  }
}

// 加载用户信息
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

function getStartTime() {
  $('#startTime').datetimepicker({
    language: 'zh-CN', //中文
    format: "yyyy - mm - dd", //格式 yyyy-mm-dd hh:mm:ss
    endDate: new Date(),
    clearBtn: true, // 自定义属性,true 显示 清空按钮 false 隐藏 默认:true
    weekStart: 1,
    todayBtn: true,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    showMeridian: 1
  }).on('changeDate', function(e) {
    startTime = $('#startTime').val();
    if (startTime > endTime) {
      layer.msg('开始时间不能大于结束时间');
      $('#startTime').val("");
      return false;
    }
  });
}

function getEndTime() {
  $('#endTime').datetimepicker({
    language: 'zh-CN', //中文
    format: "yyyy - mm - dd", //格式 yyyy-mm-dd hh:mm:ss
    endDate: new Date(),
    clearBtn: true, // 自定义属性,true 显示 清空按钮 false 隐藏 默认:true
    weekStart: 1,
    todayBtn: true,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    showMeridian: 1
  }).on('changeDate', function(e) {
    endTime = $('#endTime').val();
    if (endTime < startTime) {
      layer.msg('结束时间不能小于开始时间');
      $('#endTime').val("");
      return false;
    }
  });
}

//在子页面里面点击 顶部会相应增加tab
function addTabs(url,name){
    //$("#pageFrame", window.parent.document).attr("src", url);

	window.top.misc.openTab(name, url);
	return;

    window.top.admin.current(url +"?v=" + new Date().getMilliseconds());
		if(name.length>5){
				var newname = name.substr(0,4)+'...';
		}else{
				var newname = name;
		}
		var str="";
		str += '<li class="head-add ave">' +
		'<a title="'+ name +'" data-href="' + url + '">' +
		'<span class="head-menus"></span><span class="head-txt">' + newname + '</span>' +
		'</a>' +
		'<i class="nav-close"></i>' +
		'</li>';
		//遍历是否重复存在
		var names = $(".menu-head li",window.parent.document);
		var arr = [];
		for(var i=0;i<names.length;i++){
			arr.push(names.eq(i).find("a").attr("title"));
			if(name == names.eq(i).find("a").attr("title")){
				names.removeClass("ave");
				names.eq(i).addClass("ave");
			}
		}

		if($.inArray(name,arr) == -1){
				var num = sessionStorage.getItem("indx");
				$(".menu-nav li",window.parent.document).eq(num).addClass("ave");
				$(".menu-head li",window.parent.document).removeClass("ave");
				$(".menu-head",window.parent.document).append(str);
				moretab();
				topmenu();
		}
}

//顶部菜单效果
function topmenu(){
		var menulist = $(".menu-head li",window.parent.document);
		for(var i=1;i<menulist.length;i++){
				if(i==1){
						menulist.eq(i).css("z-index",98-i);
						menulist.eq(i).css("left",200);
				}else{
						var offsetwith = menulist.eq(i-1).offset().left;
						menulist.eq(i).css("z-index",98-i);
						menulist.eq(i).css("left",offsetwith+148);
				}
		}
}

//顶部tab超过8个就关闭倒数第二个
function moretab(){
		var lengs = $(".menu-head li",window.parent.document).length;
		if(lengs>8){
				$(".menu-head li",window.parent.document).eq(7).remove();
		}
}
