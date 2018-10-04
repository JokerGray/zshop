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


// 获取url地址信息
function getQueryString (name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	var r = window.location.search.substr(1).match(reg)
	return r !== null ? encodeURI(r[2]) : ''
}


// 通用ajax调用
function reqAjax(cmd, data){
	var loadIndex=layer.load();
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
            version: 1 // 版本号根据情况默认
        },
        success: function(data){
			layer.close(loadIndex);
            deferred.resolve(data)
        },
        error: function(){
            // 这里的 error 一般都是网络问题，500了也检查不出来
            layer.close(loadIndex);
            parent.layer.msg('连接出错，请检查网络或稍后再试！',{icon:2});
            deferred.reject()
        }
    });
    return deferred;
}

// 动态 给nav 添加 文件路径
var merchantId = getQueryString('merchantId');
$('.base_salary').attr({'href':'salarySet.html?merchantId='+merchantId});
$('.recruitment_salary').attr({'href':'recruitment.html?merchantId='+merchantId});
$('.talk_salary').attr({'href':'tooKeen.html?merchantId='+merchantId});
$('.service_salary').attr({'href':'service.html?merchantId='+merchantId});
$('.management_salary').attr({'href':'management.html?merchantId='+merchantId});
$('.activity_salary').attr({'href':'activity.html?merchantId='+merchantId});

// 六大薪资板块菜单列表  接口联调
var def = reqAjax('shop/newsalary/getSixSalaryPlate', {
    merchantId : merchantId
});
def.then(function(data){
    var data = data.data;
    for(var i = 0;i < data.length;i++){
        $($('.navs a')[i]).text(data[i].plateName).attr({'id':data[i].id,'isEnable':data[i].isEnable});
    }
})