$(function(){
	var apikey = sessionStorage.getItem('apikey') == null ? "test" : sessionStorage.getItem('apikey');	//获取缓存 通行证码
    var version = sessionStorage.getItem('version') == null ? "1" : sessionStorage.getItem('version');	//获取缓存 版本号
    //判断设备联网类型
	var connection = navigator.connection||navigator.mozConnection||navigator.webkitConnection||{tyep:'unknown'};
//	var type_text = ['unknown','ethernet','wifi','2g','3g','4g','none'];
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var userId = theRequest['userId']==undefined?null:theRequest['userId'];
	var articleId = theRequest['articleId']==undefined?null:theRequest['articleId'];
	var praiseUser = theRequest['praiseUser']==undefined?null:theRequest['praiseUser'];
	var commentId = theRequest['commentId']==undefined?null:theRequest['commentId'];
	var page = theRequest['page']==undefined?null:theRequest['page'];
	var rows = theRequest['rows']==undefined?null:theRequest['rows'];

	//文章
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"cms_new/queryArticleDetail",
			"version":version,
			"data":"{'userId':'"+userId+"','articleId':'"+articleId+"','praiseUser':'"+praiseUser+"'}"
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
//			console.log(res)
			var sHtml='';
			if(res.code==1){
				if(res.data.typeCode==1001){
					$('.content .article').html(res.data.articleContent);
					//去掉复制文章里面图片的行内样式
					$('.article img').each(function(){
						$(this).removeAttr('style').css('width','100%');
					})
				}else if(res.data.typeCode==1002){
					for(var i=0;i<res.data.scCmsResourcesList.length-1;i++){
						sHtml+="<p>"+res.data.scCmsResourcesList[i].resourcesRemarks+"</p><img src="+res.data.scCmsResourcesList[i].resourcesUrl+">"
					}
					$('.content .article').html(sHtml);
				}else if(res.data.typeCode==1003){
					$('.content .article').html("<p>"+res.data.articleContent+"</p><div class='videoCover'><img src='"+res.data.scCmsResourcesList[0].resourcesUrl+"'><span id='play' flag='false'></span></div><video style='display:none' controls class='video1'><source src="+res.data.scCmsResourcesList[0].videoUrl+" type='video/mp4'></source></video>")
					$('.video1').css({'width':'100%','height':'200px'});
				}
				//无头像使用默认头像
				if(res.data.scSysUser.userpic==null||res.data.scSysUser.userpic==''){
					$('.pic img').attr('src','images/touxiang.png');
				}else{
					$('.pic img').attr('src',res.data.scSysUser.userpic);
				}
				$('.id').text(res.data.scSysUser.username);
				$('.p-time').text(res.data.releaseTime);
				$('.content .title').text(res.data.articleTitle);
			}else{
				var tip=res.msg;
				window.location.href="article-blank.html?tip="+tip;
			}
		},
		error:function(res){
			var tip=res.msg;
			window.location.href="article-blank.html?tip="+tip;
		}
	});
	
	//播放视频
	$('.article').on('click','#play',function(){
		if($(this).attr('flag')=='false'){
			if(connection.type!='wifi'){
				layer.confirm('当前网络为移动网络,是否继续观看?',
					{title:false,closeBtn:0,btn:['取消','确定']},function(index){
					layer.close(index);
				},function(){
					$('#play').attr('flag','true');
					$('.videoCover').hide();
					$('.video1').show().trigger('play');
				})
				return false;
			}
		}
		$('.videoCover').hide();
		$('.video1').show().trigger('play');
	})
	
	//一级评论
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd":"cms_new/selectTimeNewCmsComment",
			"version":version,
			"data":"{'pagination': {'page': '"+page+"','rows': '"+rows+"'},'userId':'"+userId+"','articleId':'"+articleId+"'}"
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(res){
//			console.log(res.data)
			if(res.code==1){
				var sHtml='';
				$('#total').text(res.data.totalCount);
				for(var i=0;i<res.data.scCmsCommentList.length;i++){
					if(res.data.scCmsCommentList[i].userImgUrl==null||res.data.scCmsCommentList[i].userImgUrl==''){
						res.data.scCmsCommentList[i].userImgUrl="images/touxiang.png";
					}
					sHtml+="<li class='list'>"
							+"<div class='row'><div class='reply-headpic col-xs-2'>"
							+"<img src='"+res.data.scCmsCommentList[i].userImgUrl+"'/></div><div class='reply-id col-xs-6'>"+res.data.scCmsCommentList[i].userName+"</div></div>"
							+"<div class='reply-content col-xs-offset-2'><p>"+res.data.scCmsCommentList[i].commentComment+"</p></div>"
							+"<div class='time col-xs-offset-2'>"+res.data.scCmsCommentList[i].commentTime+"</div>"
							+"<div class='replyNum col-xs-offset-2'><span class='replyShow' comment='"+res.data.scCmsCommentList[i].id+"'><span>"+res.data.scCmsCommentList[i].commentReplyNum+"</span>条回复</span><dl></dl></div>"
							+"</li>"
					$('.reply-list').html(sHtml);
				}
			}else{
				console.log(res.msg);
			}
		},
		error:function(res){
			console.log(res.msg);
		}
	});
	
	//二级评论
	$('.reply-list').on('click','.replyNum .replyShow',function(){
		var commentId=$(this).attr('comment');
		var commentComment=$(this).parent().find('dl');
		if(commentComment.html()==''){
			$.ajax({
				type:"POST",
				url:"/zxcity_restful/ws/rest",
				dataType:"json",
				data:{
					"cmd":"cms_new/selectTimeNewCmsComment",
					"version":version,
					"data":"{'pagination': {'page': '"+page+"','rows': '"+rows+"'},'userId':'"+userId+"','articleId':'"+articleId+"','commentId':'"+commentId+"'}"
				},
				beforeSend:function(request){
					request.setRequestHeader("apikey", apikey);
				},
				success:function(res){
					if(res.code==1){
//						console.log(res.data)
						var sHtml='';
						var commentList=res.data.scCmsCommentList;
						for(var i=0;i<res.data.scCmsCommentList.length;i++){
							if(commentList[i].userImgUrl==null||commentList[i].userImgUrl==''){
								commentList[i].userImgUrl="images/touxiang.png";
							}
							sHtml+="<dd><div class='row'>"
							+"<div class='col-xs-2 reply-headpic'><img src='"+commentList[i].userImgUrl+"'></div>"
							+"<div class='col-xs-7'><span class='reply-id'>"+commentList[i].userName+"</span><br/><span class='p-time'>"+commentList[i].commentTime+"</span></div>"
							+"<div class='col-xs-offset-2 col-xs-10 commentComment'>"+commentList[i].commentComment+"</div>"
							+"</div></dd>"
						}
						commentComment.append(sHtml);
					}else{
						console.log(res.msg);
					}
				},
				error:function(res){
					console.log(res.msg);
				}
			});
		}else{
			commentComment.html('');
		}
	})
	
})
