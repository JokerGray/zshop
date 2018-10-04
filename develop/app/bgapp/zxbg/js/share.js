$(function(){
	var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
	var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
2	//判断设备联网类型
	var connection = navigator.connection||navigator.mozConnection||navigator.webkitConnection||{tyep:'unknown'};
	var type_text = ['unknown','ethernet','wifi','2g','3g','4g','none'];
	 
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	var dyId = theRequest['dynamicId']==undefined?null:theRequest['dynamicId'];
	var crUser = theRequest['createUser']==undefined?null:theRequest['createUser'];
	
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd" : "shop/dynamicDetail",
			"version" : "1",
			"data" : "{'dynamicId': '"+dyId+"','createUser' : '"+crUser+"'}"
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(re){
			console.log(re)
			if(re.code==1){
				console.log(re.data)
				$('.pic img').attr('src',re.data.shopDynamicInfo.scSysUser.userpic);
				$('.id').text(re.data.shopDynamicInfo.scSysUser.username);
				$('.p-time').text(re.data.shopDynamicInfo.createTime);
				var picList1=re.data.shopDynamicInfo.dynamicUploadList;
				var type=re.data.shopDynamicInfo.dynamicType;
				if(picList1.length<2){
					if(type=='image'){
							$('.share').append("<figure class='pic1 col-xs-7'><a href="+picList1[0].filePath+"><img src="+picList1[0].filePath+"></a></figure>");
						}
					else if(type=='video'){
							$('.share').append("<div class='videoCover'><img src='"+picList1[0].videoCoverImage+"'><span id='play' flag='false'></span></div><video class='video1' controls style='display:none'><source src="+picList1[0].filePath+" type='video/mp4'></video>");
							$('.video1').css({'width':'100%','height':'200px'});
							//播放视频
							$('#play').click(function(){
								// if($(this).attr('flag')=='false'){
								// 	if(connection.type!='wifi'){
								// 		layer.confirm('当前网络为移动网络,是否继续观看?',{btn:['取消','确定']},function(index){
								// 			$('#play').attr('flag','true');
								// 			layer.close(index);
								// 		},function(){
								// 			$('.videoCover').hide();
								// 			$('.video1').show().trigger('play');
								// 		})
								// 		return false;
								// 	}
								// }
								$('.videoCover').hide();
								$('.video1').show().trigger('play');
							})
						}
				 	}
				else{
				 	  for(var i=0;i<picList1.length;i++){
				 	  	var picList2=picList1[i].filePath;
				 			if(picList1[0].fileType=='image'){
				 				if(picList1.length==2){
									$('.share').append("<figure class='pic1 col-xs-6'><a href="+picList2+"><img src="+picList2+"></a></figure>");
								}
							 	if(picList1.length>=3){
							 		$('.share').append("<figure class='pic1 col-xs-4'><a href="+picList2+"><img src="+picList2+"></a></figure>");
									$('.pic1 img').css('height','110px');
							 	}
							}
							
				 		}	
				 	}
				$(".share figure img").each(function(i) {
					var imgs = new Image();
					imgs.src=$(this).attr("src"); 
						imgs.onload=function(){
							var w=imgs.width;
							var h=imgs.height;
							$(".share figure img").eq(i).parent("a").attr("data-size",w+"x"+h);
							initPhotoSwipeFromDOM('.share');
					}
				});
				$('.article p').text(re.data.shopDynamicInfo.dynamicText);
				$('.read-amounts .num').text(re.data.shopDynamicInfo.numView);
				$('#collect-amounts').text(re.data.shopDynamicInfo.numCollect);
				$('#like-amounts').text(re.data.shopDynamicInfo.numLike);
				$('.reply .li1 .number').text(re.data.shopDynamicInfo.numComment);
				if(picList1.length==0){
					weixin(re.data.shopDynamicInfo.scSysUser.username,re.data.shopDynamicInfo.scSysUser.userpic,re.data.shopDynamicInfo.dynamicText,apikey,version);
				}else{
					if(type=='video'){
						weixin(re.data.shopDynamicInfo.scSysUser.username,picList1[0].videoCoverImage,re.data.shopDynamicInfo.dynamicText,apikey,version);
					}else{
						weixin(re.data.shopDynamicInfo.scSysUser.username,picList1[0].filePath,re.data.shopDynamicInfo.dynamicText,apikey,version);
					}
				}
			}else{
				$('.allWrapper').html("<div id='blankBox' style='display:flex;flex-direction:column;justify-content:center;align-items:center;'><img src='images/tongji@2x.png' id='blank' style='width:170px;height:180px;'/><p>暂时没动态</p></div>")
			}
		},
		error:function(re){
		   	 console.log("数据获取失败")
		  }
	});
	
	$.ajax({
		type:"POST",
		url:"/zxcity_restful/ws/rest",
		dataType:"json",
		data:{
			"cmd" : "shop/dynamicCommentList",
			"version" : "1",
			"data" : "{'dynamicId': '"+dyId+"'}"
		},
		beforeSend:function(request){
			request.setRequestHeader("apikey", apikey);
		},
		success:function(re){
			if(re.code==1){
				var sHtml='';
				for(var i=0;i<re.data.length;i++){
					sHtml+="<li class='lis'><div class='reply-headpic'><img src="+re.data[i].memberImgName+"></div>"
						+"<div class='reply-id'>"+re.data[i].userCode+"<br/><span class='time'>"+re.data[i].commentDate+"</span></div>"
						+"<div class='reply-content'><p>"+re.data[i].commentContent+"</p></div>";
					var endHtml = "</li>";
					var nHtml = "";
					if(re.data[i].commentReplyList!=null){
						for(var j=0;j<re.data[i].commentReplyList.length;j++){
							nHtml +="<div class='other-reply'><span class='other-id'>"+re.data[i].commentReplyList[j].replyUserCode+"</span>回复:<span class='other-content'>"+re.data[i].commentReplyList[j].replyContent+"</span></div>";
						}
					}
					sHtml +=nHtml+endHtml;
					$('.reply ul').html(sHtml);
				}
//				var sHtml='';
//				var mHtml='';
//				for(var i=0;i<re.data.length;i++){
//					mHtml="<li class='lis'><div class='reply-headpic'><img src="+re.data[i].memberImgName+"></div>"
//						+"<div class='reply-id'>"+re.data[i].userCode+"<br/><span class='time'>"+re.data[i].commentDate+"</span></div>"
//						+"<div class='reply-content'><p>"+re.data[i].commentContent+"</p></div>";
//					var endHtml = "</li>";
//					var nHtml = "";
//					if(re.data[i].commentReplyList!=null){
//						for(var j=0;j<re.data[i].commentReplyList.length;j++){
//							nHtml +="<div class='other-reply'><span class='other-id'>"+re.data[i].commentReplyList[j].replyUserCode+"</span>回复:<span class='other-content'>"+re.data[i].commentReplyList[j].replyContent+"</span></div>";
//						}
//					}
//					sHtml +=mHtml+nHtml+endHtml;
//					$('.reply ul').html(sHtml);
//				}
		 	}else{
		 		console.log(re.msg)
		 	}
		},
		error:function(re){
		   	console.log("数据获取失败")
		  }
	});
	
	
	//图片点击全屏拖拽浏览
	var initPhotoSwipeFromDOM = function(gallerySelector) {
		// parse slide data (url, title, size ...) from DOM elements 
		// (children of gallerySelector)
		var parseThumbnailElements = function(el) {
		    var thumbElements = el.childNodes,
		        numNodes = thumbElements.length,
		        items = [],
		        figureEl,
		        childElements,
		        linkEl,
		        size,
		        item;
	
		    for(var i = 0; i < numNodes; i++) {
		        figureEl = thumbElements[i]; // <figure> element
		        // include only element nodes 
		        if(figureEl.nodeType !== 1) {
					continue;
		        }
				linkEl = figureEl.children[0]; // <a> element
		        size = linkEl.getAttribute('data-size').split('x');
		        // create slide object
		        item = {
					src: linkEl.getAttribute('href'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
		        };
		        if(figureEl.children.length > 1) {
		        	// <figcaption> content
		          	item.title = figureEl.children[1].innerHTML; 
		        }
		        if(linkEl.children.length > 0) {
		        	// <img> thumbnail element, retrieving thumbnail url
					item.msrc = linkEl.children[0].getAttribute('src');
		        } 
				item.el = figureEl; // save link to element for getThumbBoundsFn
		        items.push(item);
		    }
	
		    return items;
		};
	
		// find nearest parent element
		var closest = function closest(el, fn) {
		    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
		};
	
		// triggers when user clicks on thumbnail
		var onThumbnailsClick = function(e) {
		    e = e || window.event;
		    e.preventDefault ? e.preventDefault() : e.returnValue = false;
		    var eTarget = e.target || e.srcElement;
		    var clickedListItem = closest(eTarget, function(el) {
		        return el.tagName === 'FIGURE';
		    });
	
		    if(!clickedListItem) {
		        return;
		    }
	
		    // find index of clicked item
		    var clickedGallery = clickedListItem.parentNode,
		    	childNodes = clickedListItem.parentNode.childNodes,
		        numChildNodes = childNodes.length,
		        nodeIndex = 0,
		        index;
	
		    for (var i = 0; i < numChildNodes; i++) {
		        if(childNodes[i].nodeType !== 1) { 
		            continue; 
		        }
	
		        if(childNodes[i] === clickedListItem) {
		            index = nodeIndex;
		            break;
		        }
		        nodeIndex++;
		    }
	
		    if(index >= 0) {
		        openPhotoSwipe( index, clickedGallery );
		    }
		    return false;
		};
	
		// parse picture index and gallery index from URL (#&pid=1&gid=2)
		var photoswipeParseHash = function() {
			var hash = window.location.hash.substring(1),
		    params = {};
		    if(hash.length < 5) {
		        return params;
		    }
		    var vars = hash.split('&');
		    for (var i = 0; i < vars.length; i++) {
		        if(!vars[i]) {
		            continue;
		        }
		        var pair = vars[i].split('=');  
		        if(pair.length < 2) {
		            continue;
		        }           
		        params[pair[0]] = pair[1];
		    }
		    if(params.gid) {
		    	params.gid = parseInt(params.gid, 10);
		    }
		    if(!params.hasOwnProperty('pid')) {
		        return params;
		    }
		    params.pid = parseInt(params.pid, 10);
		    return params;
		};
	
		var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
		    var pswpElement = document.querySelectorAll('.pswp')[0],
		        gallery,
		        options,
		        items;
			items = parseThumbnailElements(galleryElement);
		    // define options (if needed)
		    options = {
		        index: index,
				// define gallery index (for URL)
		        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
		        getThumbBoundsFn: function(index) {
		            // See Options -> getThumbBoundsFn section of docs for more info
		            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
		                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
		                rect = thumbnail.getBoundingClientRect(); 
		            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		        },
		        // history & focus options are disabled on CodePen
	           	// remove these lines in real life: 
			   historyEnabled: false,
			   focus: false	
	
		    };
	
		    if(disableAnimation) {
		        options.showAnimationDuration = 0;
		    }
		    // Pass data to PhotoSwipe and initialize it
		    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		    gallery.init();
		};
		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll( gallerySelector );
		for(var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i+1);
			galleryElements[i].onclick = onThumbnailsClick;
		}
		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if(hashData.pid > 0 && hashData.gid > 0) {
			openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
		}
	};
})
    