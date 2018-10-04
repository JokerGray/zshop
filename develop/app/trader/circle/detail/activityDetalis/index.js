$(document).ready(function(){
    initMenu();
    initTable();
    initShare();
    initBusinessInfo();
});

// 初始化菜单点击
function initMenu() {
    $('.nav-menu').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('.content').eq($(this).index()).addClass('active').siblings().removeClass('active');
    });
    $('.nav-menu').eq(2).click();
}

// 初始化表格
// 获取一次数据，然后前端查询
function initTable() {
    $('#table').dataTable({
        processing: true,
        language: language,
        ordering: false,
        ajax: {
            url: '/zxcity_restful/ws/rest',
            type: 'post',
            headers:{
                apikey: 'test'
            },
            timeout: 10000,
            data: function ( d ) {
              return {
                cmd: 'circle/showParticipantListByActivityId',
                data: JSON.stringify({
                	activityId:params.id
                })
              };
            },
            dataSrc: function(result){
                if(result.code != 1){
                    layer.msg(result.msg, {icon: 2});
                    result.recordsTotal = 0;
                    result.recordsFiltered = 0;
                    return [];
                }
                result.recordsTotal = result.total;
                result.recordsFiltered = result.total;
                return result.data;
            },
            error: function(err){
                layer.msg('连接失败！请检查网络或稍后再试！', {icon: 2});
            }
        },
        columns: [
            { title: '序号', data: 'prizeTitle', render: function(data, type, row, meta) {
                return meta.row + 1;
            } },
            { title: '头像', data: "prizeTitle" },
            { title: '名称', data: "prizeStyle", render:function(data, type, full, mega){
                return ' <img src="'+data+'">';
            }},
            { title: '电话号码', data: "phone" },
            { title: '报名时间', data: "createTime" },
            { title: '备注', data: "orderStatus", render:function(data, type, full, mega){
                return '状态'+data;
            }}
        ]
    });
}

// 初始化分享信息
function initShare(){
    swiper = new Swiper('.swiper-container', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
    });
    swiper.appendSlide('<div class="swiper-slide">Slide 10</div>');
    swiper.appendSlide('<div class="swiper-slide">Slide 10</div>');
}

function initBusinessInfo(){
	var cmd = "activityNew/getBusinessInfo";
	var datas = {
		cmd,
		data:JSON.stringify({
		activityId : params.id,
		userId : params.userId,
		shopId : params.shopId
		})
	}
	var apikey = params.apikey || "test"
	ajaxAsync(datas,apikey).then(function(re){
		console.log(re)
	})
}
// 通用异步请求
function ajaxAsync(params, apikey) {
    var def = $.Deferred();
    $.ajax({
        url: '/zxcity_restful/ws/rest',
        type: 'post',
        dataType: "json",
        headers: {
            apikey: apikey
        },
        data: params,
        success: function(data) {
            def.resolve(data)
        },
        error: function(err) {
            layer.msg('连接失败！请检查网络或稍后再试！', {icon: 2});
            def.reject(err);
        }
    });
    return def;
}

function getParams(){
	var url = location.search;
	var params = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return params
}
params = getParams();