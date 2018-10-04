var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
$(function() {
	var title = $(".title").text();
	var newtype = $(".news-type").text();
	$.ajax({
		type: "POST",
		url: "/zxcity_restful/ws/rest",
		async: true,
		data: {
			"cmd": "cms_new/queryArticelListByUserId",
			"data": "{ 'pagination' :  { 'page' : 1 , 'rows' : 10 }, 'releaseId' : 60 }",
			"version": 1
		},
		beforeSend: function(request) {
			request.setRequestHeader("apikey", apikey);
		},
		success: function(res) {
			var sHtml = '';
			if(res.code == 1) {
				var obj = res.data;
				console.log(obj);
				if(obj.length <= 0) {
					$(".right-content").html("<span class='alert'>亲,内容被你删完了</span>");
				}
				if(obj.length > 0) {
					for(var i = 0; i < obj.length; i++) {
						sHtml += '<div class="newsitem clearfix" id="' + obj[i].articleId + '">' +
							'<img class="news-img" src="images/1.jpg" />' +
							'<div class="news-content">' +
							'<div class="title">' + obj[i].articleTitle
						if(obj[i].stick == 0) {
							sHtml += '<span class="tags top ">置顶</span>'
						} else {
							sHtml += '<span class="tags top">置顶</span>'
						}
						if(obj[i].isExamine == 0) {
							sHtml += '<span class="tags published hidden">已发表</span>'
						} else {
							sHtml += '<span class="tags published">已发表</span>'
						}

						sHtml += '<div class="item-dt"><span class="news-type">' + obj[i].scSysUser.username + '</span><span class="date">' + obj[i].releaseTime + '</span></div>' +
							'<div class="item-dd"><em class="reader">阅读：1.1万</em>' +
							'<em class="line">|</em><em class="commentes">评论：30</em>' +
							'<em class="line">|</em><em class="translate">转发：10</em>' +
							'<em class="line">|</em><em class="collect">收藏：20</em>' +
							'<em class="line">|</em><em><a class="share"><i class="fa fa-share-alt"></i>分享</a></em></div>' +
							'</div>' +
							'<div class="news-operate">' +
							'<ul>'
						if(obj[i].stick == 1) {
							sHtml += '<li class="posts-cancel"><a data-flag="1" title="取消置顶">取消置顶 <i class="fa fa-hand-o-down"></i></a></li>'
						} else {
							sHtml += '<li class="posts-cancel"><a data-flag="0" title="置顶">置顶 <i class="fa fa-hand-o-down"></i></a></li>'
						}
						sHtml += '<li class="modify"><a title="修改">修改 <i class="fa fa-pencil"></i></a></li>' +
							'<li class="more"><a title="删除">删除 <i class="fa fa-trash-o"></i></a></li>' +
							'</ul>' +
							'</div>' +
							'</div>';
						'<nav aria-label=""><ul class="pagination">' +
						'<li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>' +
						'<li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li>' +
						'<li><a href="#">2</a></li>' +
						'<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>' +
						'</ul>' +
						'</nav>';
					}
					$(".right-content").html(sHtml);
				}
			} else {
				alert(res.msg);
			}

		}
	});
	$(".right-content").delegate(".newsitem .news-operate .modify a", "click", function() {
		var articleId = $(this).parents('.newsitem').attr("id");
	}).delegate(".newsitem .news-operate .more a", "click", function() {
		var articleId = $(this).parents('.newsitem').attr("id");
		//var b=articleId.removeAttr("articleId");
		$(this).closest('.newsitem').remove();
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			async: true,
			data: {
				"cmd": "cms_back/deleteArticle",
				"data": "{'articleId' : " + articleId + "}",
				"version": 1
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(res) {
				if(res.code == 1) {
					alert("删除成功");
				}
			}
		});
	});
	$(".right-content").delegate(".news-content .news-operate .posts-cancel", "click", function() {
			sHtml += '<li class="posts-cancel"><a data-flag="0" title="置顶">置顶 <i class="fa fa-hand-o-down"></i></a></li>'
		} else {
			sHtml += '<li class="posts-cancel"><a data-flag="1" title="取消置顶">取消置顶 <i class="fa fa-hand-o-down"></i></a></li>'
		}
	}) $.ajax({
	type: "POST",
	url: "/zxcity_restful/ws/rest",
	async: true,
	data: {
		"cmd": "cms_back/stickArticle",
		"data": '{"articleId" : "' + 600 + '" , "stick" : "' + 1 + '"}',
		"version": 1
	},
	beforeSend: function(request) {
		request.setRequestHeader("apikey", apikey);
	},
	//		success: function(res) {
	//			if(res.code == 1) {
	//				var obj = res.data;
	//				console.log(obj);
	//				
	//				//				$(".posts-cancel a").click(function() {
	//				//					alert("aaa")
	//				//					if(obj[i].stick == 1) {
	//				//						sHtml += '<li class="posts-cancel"><a data-flag="0" title="置顶">置顶 <i class="fa fa-hand-o-down"></i></a></li>'
	//				//					} else {
	//				//						sHtml += '<li class="posts-cancel"><a data-flag="1" title="取消置顶">取消置顶 <i class="fa fa-hand-o-down"></i></a></li>'
	//				//					}
	//				//				})
	//			}
	//		}
})

})