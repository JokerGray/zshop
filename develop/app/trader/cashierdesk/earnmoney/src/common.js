// 时间格式化
Date.prototype.Format = function(fmt){
  var o = {
    "y+" : this.getFullYear(),
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};

// 提示语句
function toast(msg){
    return layer.open({type: 0,content: msg, style:"color:#fff;background-color:rgba(0,0,0,0.7);font-size:14px;letter-spacing: 1px;", shade:"background-color:rgba(0,0,0,0.1)"})
}

// 获取url地址信息
function getQueryString (name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	var r = window.location.search.substr(1).match(reg)
	return r !== null ? encodeURI(r[2]) : ''
}

// 弹窗太小，提示语太长，可能导致表格下工具栏错位，因此修改一下提示语
! function(a) {
	"use strict";
	a.fn.bootstrapTable.locales["zh-CN"] = {
		formatLoadingMessage: function() {
			return "正在努力地加载数据中，请稍候……"
		},
		formatRecordsPerPage: function(a) {
			return "每页 " + a + " 条"
		},
		formatShowingRows: function(a, b, c) {
			return "第" + a + "到第" + b + "条记录，共" + c + "条记录"
		},
		formatSearch: function() {
			return "搜索"
		},
		formatNoMatches: function() {
			return "没有找到匹配的记录"
		},
		formatPaginationSwitch: function() {
			return "隐藏/显示分页"
		},
		formatRefresh: function() {
			return "刷新"
		},
		formatToggle: function() {
			return "切换"
		},
		formatColumns: function() {
			return "列"
		},
		formatExport: function() {
			return "导出数据"
		},
		formatClearFilters: function() {
			return "清空过滤"
		}
	}, a.extend(a.fn.bootstrapTable.defaults, a.fn.bootstrapTable.locales["zh-CN"])
}(jQuery);


// 通用ajax调用
function reqAjax(cmd, data){
	var loadIndex=layer.load();
	setTimeout(function(){
		layer.close(loadIndex);
	},5000);
    var deferred = $.Deferred();
    $.ajax({
        type:"post",
        dataType: 'json',
        url:"/zxcity_restful/ws/rest",
        headers: {
            apikey: sessionStorage.getItem('apikey') || 'test'
        },
        data: {
            cmd: cmd,
            data: JSON.stringify(data),
            version: 2 // 版本号根据情况默认
        },
        success: function(data){
			layer.close(loadIndex);
            deferred.resolve(data)
        },
        error: function(){
            // 这里的 error 一般都是网络问题，500了也检查不出来
            layer.close(loadIndex);
            toast('连接出错，请检查网络或稍后再试！');
            deferred.reject()
        }
    });
    return deferred;
}