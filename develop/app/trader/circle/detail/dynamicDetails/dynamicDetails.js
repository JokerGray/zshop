$(function(){
	params = getParams();
	init();
	
})

function getParams(){
	var url = location.search;
    var params = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
         }
    return params
}
var params ,valve = true;

function ajaxAsy(cmd,data,callback){
	var apikey =params.apikey || 'test';
	var data = JSON.stringify(data);
	if(valve) {
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			data: {
				cmd: cmd,
				data: data
			},
			beforeSend: function(request) {
				valve = false
				request.setRequestHeader("apikey", apikey);
			},
			success: function(re) {
			valve = true;
				if(re.code == 1) {
					console.log(re)
					callback(re);
				} else {
					console.log(re)
				}
			},
			error: function(re) {
                 console.log(re);
			},
			complete: function() {
			valve = true
			}
		});
	}
}

//
function init(){
	var cmd ='circle/getVAByIdNew20';
	var videoAlbumId = params.videoAlbumId;
	var userId = params.userId;
	ajaxAsy(cmd,{videoAlbumId,userId},setData);
}

function setData(re){
	var html = template('init',re);
	$('.mienContent').html(html);
	if(re.data.videoAlbum.isAdmin==0){
		$('#cancel').hide();
	}
	//删除评论
	$('.reviewerRe').on('click',function(){
		var dom = this
		var sId =  $(this).siblings('input[name="sId"]').val();
		var cmd='circle/delComment';
		parent.layer.confirm('是否删除评论', {
			  btn: ['确定','取消'] //按钮
			}, function(){
				ajaxAsy(cmd,{sId},function(){
					$(dom).parents('.discussList').remove();
					parent.layer.closeAll();
					var num =  parent.window.$('.mienBox.active .subinfoRgt span').text();
					parent.window.$('.mienBox.active .subinfoRgt span').text(num-1)
			 });  
			}, function(){
				return
			});

	});
	//删除回复
	$('.reviewerLscrr').on('click',function(){
		var dom  = this; 
		var sId =  $(this).siblings('input[name="sId"]').val();
		var replyId = $(this).siblings('input[name="replyId"]').val();
		var cmd = 'circle/delReply'
		parent.layer.confirm('是否删除回复', {
			  btn: ['确定','取消'] //按钮
			}, function(){
				ajaxAsy(cmd,{sId,replyId},function(){
					$(dom).parents('.reviewer').remove();
					parent.layer.closeAll();
			 });  
			}, function(){
				return
			});
	});
	//删除动态
	$('#cancel').on('click',function(){
		var isAdmin = $('input[name="isAdmin"]').val();
		if(isAdmin!=0){
			var videoAlbumId = $('input[name="videoAlbumId"]').val();
			var videoAlbumCircleId = $('input[name="videoAlbumCircleId"]').val();
			var userId = params.userId;
			var cmd  = 'circle/delVAById20';
			parent.layer.confirm('是否删除动态', {
				  btn: ['确定','取消'] //按钮
			}, function(){
					ajaxAsy(cmd,{videoAlbumId,videoAlbumCircleId,userId},function(re){
						if(re.code==1){
							parent.window.$('#myIframe').css('height',"0").attr('src',"");
							parent.window.$('.mienBox.active').remove();
							if(parent.window.$('.mienBox').length<4){
								parent.$('#toLoad').trigger();
							}
							if(parent.window.index.presentCircleId&&parent.window.index.presentCircleId!=""){
									parent.window.index.circleData.data[parent.window.index.swiperActiveIndex].videoNumber = parent.window.index.datalistData.videoNumber = parent.window.index.datalistData.videoNumber - 1;
							}
							parent.layer.closeAll();
						}else{
							parent.layer.msg(re.msg);
						}
	
				 });  
				}, function(){
					return
				});
		}else{
			return layer.msg('当前用户无权限')
		}

	});
	//加载更多
	$('#loadMore').on('click',function(){
		$(this).remove();
	});
	//返回
	$('#back').on('click',function(){
		parent.window.$('#myIframe').css('height',"0").attr('src',"");
		parent.window.$('.mienBox.active').removeClass('active');
	})
}
