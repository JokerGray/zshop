// 购买日期开始
var startTime = "";
var endTime = "";
var qBeginTime = "";
var qEndTime = "";
// 校验时间前后
function checkDate(startTime, endTime) {
	if ((endTime && startTime) && (endTime < startTime)) {
		layer.msg("开始日期不能晚于截止日期，请重新选择！");
		return true;
	}
	return false;
}
// 开始时间
$('#qBeginTime').datepicker({
	todayBtn : "linked",
	clearBtn : true,
	autoclose : true,
	todayHighlight : true,
	language : "zh-CN",
	endDate : new Date()
}).on('changeDate', function(e) {
	startTime = e.date;
	// $('#qEndTime').datepicker('setStartDate',startTime);
	if (checkDate(startTime, endTime)) {
		$('#qBeginTime').val(null);
		startTime = null;
	}
});
// 结束时间
$('#qEndTime').datepicker({
	todayBtn : "linked",
	clearBtn : true,
	autoclose : true,
	todayHighlight : true,
	language : "zh-CN",
	endDate : new Date()
}).on('changeDate', function(e) {
	endTime = e.date;
	// $('#qBeginTime').datepicker('setEndDate',endTime);
	if (checkDate(startTime, endTime)) {
		$('#qEndTime').val(null);
		endTime = null;
	}
});

$('#stratTime').datepicker({
	todayBtn : "linked",
	todayHighlight : true,
	weekStart : 1,
	autoclose : true,
	startView : 1,
	minViewMode : 1,
	maxViewMode : 2,
	forceParse : false,
	language : 'zh-CN'
}).on('changeDate', function(e) {
	qBeginTime = e.date;
	$('#endTime').datepicker('setStartDate', qBeginTime);
});
$('#endTime').datepicker({
	todayBtn : "linked",
	todayHighlight : true,
	weekStart : 1,
	autoclose : true,
	startView : 1,
	minViewMode : 1,
	maxViewMode : 2,
	forceParse : false,
	language : 'zh-CN'
}).on('changeDate', function(e) {
	qEndTime = e.date;
	$('#stratTime').datepicker('setEndDate', qEndTime);
});

// 面包屑导航
$('.hovers:last').click(
		function() {
			if ($(".toggle").is(":hidden")) {
				if ($(".toggle dd").length == 1) {
					$(".toggle").hide(); // 如果元素为显现,则将其隐藏
					$('.cr-top .nav li .hovers i').attr('class',
							'glyphicon glyphicon-triangle-bottom');
				} else {
					$(".toggle").show(); // 如果元素为隐藏,则将它显现
					$('.cr-top .nav li .hovers i').attr('class',
							'glyphicon glyphicon-triangle-top');
				}
			} else {
				$(".toggle").hide(); // 如果元素为显现,则将其隐藏
				$('.cr-top .nav li .hovers i').attr('class',
						'glyphicon glyphicon-triangle-bottom');
			}
		});

// ajax请求
function reqAjax(cmd, data) {
	var reData;
	$.ajax({
		type : "POST",
		url : "/zxcity_restful/ws/rest",
		dataType : "json",
		async : false,
		data : {
			"cmd" : cmd,
			"data" : data,
			"version" : version
		},
		beforeSend : function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success : function(re) {
			// layer.closeAll('loading');
			reData = re;
		},
		error : function(re) {
			// layer.closeAll('loading');
			var str1 = JSON.stringify(re);
			re.code = 9;
			re.msg = str1;
			reData = re;
		}
	});
	return reData;
}


    //ajax请求调用  {"module":{"status":"0"}}
    var param = '{"module":{"status":"1"}}';
    var res =reqAjax('commonConfig/selBasePublicModule',param);
    var x=res.data;

    // 所属版块select开始
    var tempAjax="";
    $('#selectview').selectpicker({});
    $('#selectplate').selectpicker({});
    $('#selectview1').selectpicker({});
    $('#selectview2').selectpicker({});
    tempAjax += "<option value=''>--全部--</option>";
    $.each(x, function(n) {
        tempAjax += "<option value='"+this.moduleNo+"'>"+this.moduleName+"</option>";
     });
    $("#selectview").empty();
    $("#selectview").append(tempAjax);
    $('#selectview').selectpicker('render');
    $('#selectview').selectpicker('refresh');
    $('.selein ul.selectpicker:first').css({
       'max-height' : '200px',
       'height' : '150px',
       'min-height': '80px'
    });
    $('.selein .bs-searchbox input').attr('maxlength', '10');




//根据参数名获取地址栏URL里的参数
function getUrlParams(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
		r[2] = r[2].replace(new RegExp("%", 'g'), "%25");
		return decodeURI(decodeURIComponent(r[2]));
	}
	return "";
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




	/*

	if(merchantId && merchantId){
		var html, res;

		//读取前端模板 并且 ajax读取用户信息
		res = reqAjax('payStatistics/selectUserInfo', JSON.stringify({
    		id: merchantId
    	}));
		if(res.code == 1){
			//加载模板
			html = template('selectUserInfoTpl', res.data);
			//打开弹窗
	        layer.open({
	            type:1,
	            title: '商户账户详细信息',
	            area:['800px', '500px'],
	            btn:['关闭'],
	            bthAlign:'c',
	            content:html,
	            //弹窗加载成功的时候
	            success: function(){

	            },
	            yes: function(index, layero){

	            	layer.close(index);
	            }
	        });
		}else{
			layer.msg(res.msg);
		}

	}else{
		layer.msg('商户ID异常, 请联系客服');
	}
	*/


}


// 所属版块select开始
var tempAjax = "";
$('#selectview').selectpicker({});
$('#selectplate').selectpicker({});
$('#selectview1').selectpicker({});
$('#selectview2').selectpicker({});
tempAjax += "<option value=''>--全部--</option>";
$.each(x, function(n) {
	tempAjax += "<option value='" + this.moduleNo + "'>" + this.moduleName
			+ "</option>";
});
$("#selectview").empty();
$("#selectview").append(tempAjax);
$('#selectview').selectpicker('render');
$('#selectview').selectpicker('refresh');
$('.selein ul.selectpicker:first').css({
	'max-height' : '200px',
	'height' : '150px',
	'min-height' : '80px'
});
$('.selein .bs-searchbox input').attr('maxlength', '10');
