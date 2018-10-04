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
$(function(){
    $(".page-title").text(getUrlParams("title"))
});

function initLoad(data){
    var str = '';
    if(data.length > 0){
        for(var i=0; i<data.length; i++){
            str += '<li id="'+data[i].id+'" data-sort="'+data[i].sort+'" data-count="'+data[i].count+'">'
				+ '<a href="javascript:;" class="remove-btn"></a>'
                + '<p class="num">'+data[i].sort+'</p>'
				+ '<p class="desc">人数：<span>'+data[i].count+'</span></p></li>';
        }
    }
    $(".detail-list ul").html(str);
}

//删除
$(".detail-list ul").delegate("li .remove-btn", "click", function(){
    var id = $(this).parent().attr("id");
    $(this).parent().remove();
});

//修改
$(".detail-list ul").delegate("li", "click", function(){
    var id = $(this).parent().attr("id"),
		sort = $(this).parent().attr("data-sort"),
		count = $(this).parent().attr("data-count");
    editDetailInfo(id, sort, count);
})

function editDetailInfo(_id, _sort, _count){
	var title = '添加桌台';
	if(_id){
		title = '修改桌台信息';
	}
	_sort = _sort ? _sort : "";
	_count = _count ? _count : "";
    var sHtml = '<div class="pop-layer">'
        + '<p class="title">'+title+'</p>'
        + '<form>'
        + '<div class="form-group form-inline">'
        + '<label class="control-label">编号：</label>'
        + '<input type="text" name="order-num" placeholder="请输入数字" value="'+_sort+'" class="form-control"></div>'
        + '<div class="form-group form-inline">'
        + '<label class="control-label">人数：</label>'
        + '<input type="text" name="people-count" placeholder="请输入数字" value="'+_count+'" class="form-control"></div>'
        + '</form>'
        + '<div class="handle-btn">'
        + '<a class="submit-btn" href="javascript:void(0);">确认</a>'
        + '<a class="cancel-btn" href="javascript:void(0);">取消</a>'
        + '</div></div>';
    layer.open({
        title: false,
        type: 1,
        area: ['250px', '300px'], //宽高
        content: sHtml,
        success: function(layero, index){
            $(".pop-layer .submit-btn").click(function(){
                var orderNum = $("input[name=order-num]").val();
                var peopleCount = $("input[name=people-count]").val();
                var reg = /^[1-9]\d*$/;
                if($.trim(orderNum) == "" || !reg.test(orderNum)){
                    layer.msg("请输入编号！");
                    return ;
                }
                if($.trim(peopleCount) == "" || !reg.test(peopleCount)){
                    layer.msg("请输入人数！");
                    return ;
                }
				if(_id){
					$(".detail-list ul").find("li[id='"+_id+"']").attr("data-sort", orderNum);
					$(".detail-list ul").find("li[id='"+_id+"']").attr("data-count", peopleCount);
					$(".detail-list ul").find("li[id='"+_id+"'] .num").text(orderNum);
					$(".detail-list ul").find("li[id='"+_id+"'] .desc span").text(peopleCount)
				}else{
					var sHtml = '<li><a href="javascript:;" class="remove-btn"></a><p class="num">'+orderNum+'</p><p class="desc">人数：'+peopleCount+'</p></li>';
	                $(".detail-list ul").append();
				}

                layer.close(index);
            });
            $(".pop-layer .cancel-btn").click(function(){
                layer.close(index);
            });
        }
    });
}

//添加
$(".add-detail-link").click(function(){
    editDetailInfo();
});
