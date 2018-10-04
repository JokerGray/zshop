$(function(){
	var swiper;
	function Detail(){
		this.init();
	}
	window.addEventListener('detaInteract', function(e) {
		var fn = e.prefix;
		window[fn](e);
	})

	$.extend(true, Detail.prototype, {
		init:function(){
			this.getParams();
			this.getCircleData();
		},
		getParams:function(){
            var url = location.search;
            var params = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            this.params=params;
        },
        valve:true
        ,
        ajaxAsy:function(cmd,datas,callback){
        	var _self = this ;
        	var apikey = _self.params.apikey||'test';
        	var data = JSON.stringify(datas);
        	if(_self.valve){
        		$.ajax({
        			type: "POST",
        			url: "/zxcity_restful/ws/rest",
        			dataType: "json",
        			data: {
        				cmd: cmd,
        				data: data
        			},
        			beforeSend: function(request) {
						layer.load(1,{shade:[0.2,'#fff']})
        				_self.valve = false
        				request.setRequestHeader("apikey", apikey);
        			},
        			success: function(re) {
        				_self.valve = true;
        					console.log(re)
        					callback(re);
        			},
        			error: function(re) {
        				 console.log(re);
        			},
        			complete: function() {
        					layer.closeAll();
        				_self.valve = true
        			}
        		});
        	}
 
        },
        //更新数据
        uploadCircleData:function(callback){
        	var _self = this 
        	var cmd="circle/getCCCByShopId";
        	var datas = {
                "shopId": _self.params.shopId || 347
           };
           _self.ajaxAsy(cmd,datas,function(re){
           		_self.circleData = re
           		if(callback){
           			callback()
           		}
           })
        }
		,
		//获取圈子数据
        getCircleData:function(callback){
        	var _self = this;
        	var cmd="circle/getCCCByShopId";
        	var datas = {
                "shopId": _self.params.shopId || 347
           };
            _self.ajaxAsy(cmd,datas,function(re){
            	index.circleData = re
            	_self.showCircle(re);
            	if(callback){
            		callback()
            	}
            });
        },
        swiperActiveIndex:0,
        presentCircleId:"",
        showCircle:function(re){
        		var html = template('circleHead', re);
        		$('.bgPhone').html(html);
        		swiper = new Swiper('.swiper-container', {
        			speed: 1000,
        			spaceBetween: 10,
        			initialSlide:index.swiperActiveIndex,
        			observer: true,
        			autoHeight: true,
        			onInit: function(swiper) {
						var i =index.swiperActiveIndex
						i+1>10?i=i:i="0"+i;
        				$('#num').html(i);
        			},
        			onTransitionStart: function(swiper) {
        				var i = swiper.activeIndex;
        				index.swiperActiveIndex = i;
						i+1>10?i=i:i="0"+i;
        				$('#num').html(i);
        			},
        			onClick: function(swiper){
        				var dom = swiper.clickedSlide || document.querySelector('.swiper-slide-active');
        				var data = {
        					id :$(dom).find('input[name="id"]').val().trim(),
        					activityNumber : $(dom).find('.activityNumber').text().trim(),
        					videoNumber:$(dom).find('.videoNumber').text().trim(),
        					attentionNumber:$(dom).find('.attentionNumber').text().trim(),
        					name:$(dom).find('.cirName').text().trim(),
        					markName:$(dom).find('input[name="markName"]').val().trim(),
        					title:$(dom).find('.txt').text().trim().trim(),
        					url:$(dom).find('.url').attr('src'),
        					personNumber:$(dom).find('input[name="personNumber"]').val().trim(),
        					albumNumber:$(dom).find('input[name="albumNumber"]').val().trim(),
							type:$(dom).find('input[name="type"]').val().trim()
        				};
        				
        				index.selectCircleId = "";
        				index.swiperActiveIndex = swiper.activeIndex;
        				index.datalistData = data ;
        				index.presentCircleId = data.id;
        				index.openCircleDateil(data);
        				
    				},
        			centeredSlides: true,
        			width: 305,
        			pagination: '.swiper-pagination',
        			paginationClickable: true
        		})	
        		//新建圈子
        		index.openCircle();
        		//加载该shopId下所有圈子动态
//      		index.getVideoListByShopId();
        		 //圈子opention
        		for(var i =0 ; i<re.data.length;i++ ){
        			var openlist = $('<option value="'+re.data[i].id+'">'+re.data[i].name+'</option>');
        			var activitylist = openlist.clone();
        			$('#select2').append(openlist);
        			$('#activitySelect #other').before(activitylist);
        		}
        },
        //加载该shopId下所有圈子动态
        getVideoListByShopId:function(){
        	$('.circlePlay').html('圈子动态');
        	
        	index.selectCircleId = "";
			$('#searchVideo').html("");
        	var cmd ='circle/getVideoListByShopId';
        	var data = {
        		 shopId : index.params.shopId || 347,
        		 sCurrUserId  : index.params.userId || 731,
        		 sStartpage  : 1,
        		 sPagerows : 4
        	};
        	index.ajaxAsy(cmd,data,function(re){
        		if(re.code==1){
        			index.getVideo(re);
        			//筛选
        			
        			$('#selectCircle').click(function(){
        				$('#select2').show().siblings('#activitySelect').hide();
        				$('#select2').select2("destroy")
        				$('.shadowOpen').show().click(function(e){
        					e.stopPropagation();
        					$(this).hide()
        				})
        				
        				$('#select2').select2();
        				$('#select2').select2("open");
        				$('#select2').off().on("select2-close", function(e) { 
        					$('.shadowOpen').hide();
        					$('#select2').val(null).trigger("change");
        					})
        				.on("select2-selecting", function(e){
        					$('.circlePlay').text(e.choice.text);
        					var cmd,data;
        					if(e.val != ""&&e.val != "all"){
        						 index.selectCircleId = e.val
        						 cmd = "circle/searchVideoAlbumListByParamNew20";
        						 data = {
        							videoAlbumCircleId : index.selectCircleId,
        							videoAlbumType:'1,2,3',
        							orderType:'1',
        							sStartpage:1,
        							sPagerows:4
        						}
        					}else{
        						index.selectCircleId = "";
        						 cmd = 'circle/getVideoListByShopId';
        						 data ={
        						 	 shopId : index.params.shopId || 347,
					        		 sCurrUserId  : index.params.userId || 731,
					        		 sStartpage  : 1,
					        		 sPagerows : 4
        						 }
        					}
        					index.ajaxAsy(cmd, data, function(re) {
        						if(re.code == 1) {
        							$('#searchVideo').html("");
        							index.getVideo(re);
        						}
        					})
        				})
        			})
        		}else{
        			index.sweetAlert("动态数据加载失败,请稍候再试","warning");
        		}
        		
        	})
        }
        ,
        //加载该shopId下所有圈子活动
        getActivityByShopId:function(){
        	$('.activityName1').html('圈子活动');
        	index.selectCircleId="";
        	index.selectCircleType = "";
        	$('#activityContentBox').html('');
        	var cmd = "circle/getActivityByShopId";
        	var data = {
        		shopId:index.params.shopId || 347,
        		userId : index.params.userId || 731,
        		sStartpage:1,
        		sPagerows:4
        	};
        	index.ajaxAsy(cmd,data,index.appendActivityList)
        },
        //全部圈子活动加载更多
        appendActivityList:function(re){
        	var ActivityList = template('allActivityList', re);
        	$('#activityContentBox').append(ActivityList);
        	//加载更多
        	$('#toLoadActivity').on('click', function() {
        		$(this).remove();
        		var cmd = 'circle/getActivityByShopId';
        		var sStartpage = Math.ceil($('.activityList').length / 4) + 1
        		var data = {
        			userId: index.params.userId,
        			shopId: index.params.shopId,
        			circleId: index.presentCircleId || index.selectCircleId || "",
        			type: index.selectCircleType ,
        			"sStartpage": sStartpage,
        			"sPagerows": 4
        		};
        		var callback = index.appendActivityList;
        		index.ajaxAsy(cmd, data, callback);
        	});
        	//发布活动
        	$('.pubAct').off().on('click', index.pubActivity);
        	//筛选活动
        	$('#selectCircleActivity').click(function(){
        		$('#select2').select2("destroy").hide();
        		$('#activitySelect').show().siblings('#select2').hide();
        		$('#activitySelect').select2("destroy")
        		$('.shadowOpen').show().click(function(e) {
        			e.stopPropagation();
        			$(this).hide()
        		})
        		$('#activitySelect').select2();
        		$('#activitySelect').select2("open");
        		$('#activitySelect').off().on("select2-close", function(e) {
        				$('.shadowOpen').hide();
        				$('#activitySelect').val(null).trigger("change");
        			})
        			.on("select2-selecting", function(e) {
        				$('.activityName1').text(e.choice.text);
        				var cmd, data;
        				if(e.val != "" && e.val != "all" && e.val !="other") {
        					index.selectCircleId = e.val;
        					index.selectCircleType = "";
        					cmd = "circle/getActivityByShopId";
        					data = {
        						userId: index.params.userId,
        						shopId: index.params.shopId,
        						circleId: index.selectCircleId,
        						type:index.selectCircleType,
        						sStartpage: 1,
        						sPagerows: 4
        					}
        				} else{
        					index.selectCircleId = "";
        					if(e.val == "all"){
        						index.selectCircleType = "";
        					}else{
        						index.selectCircleType = "1";
        					}
        					cmd = 'circle/getActivityByShopId';
        					data = {
        						shopId: index.params.shopId || 347,
        						userId: index.params.userId || 731,
        						type: index.selectCircleType,
        						sStartpage: 1,
        						sPagerows: 4
        					}
        				}
        				index.ajaxAsy(cmd, data, function(re) {
        					if(re.code == 1) {
        						$('#activityContentBox').html("");
        						index.appendActivityList(re);
        					}
        				})
        			})
        	})
        	//查看活动详情
        	$('.activityList').on('click', function() {
        		$('.bgPhone').addClass('set');
        		
        		var cmd = 'activityNew/getActivityDetail';
        		var data = {
        			userId: index.params.userId,
        			id: $(this).find('input[name="id"]').val()
        		}
        		index.ajaxAsy(cmd, data, function(re) {
        			if(re.code == 1) {
        				var html = template('ActivityDetalist', re);
        				$('.pubActivity').show().siblings().hide();
        				$('.pubActivity').html(html).addClass('videoContent').removeClass('pubActivity');
        				$('.videoContent .memberTitle').show();
        				$('.setName').html('活动详情');
        				$('.short').addClass('ActivityDetails')
//      				$('#myIframe').css('height', "100%").attr('src', "./activityDetalis/index.html?userId=" + index.params.userId + "&id=" + re.data.id+"&shopId="+index.params.shopId)
        				$('#aDetaBack').off().on('click', function() {
        					$('.bgPhone').removeClass('set')
        					$('.videoContent').html('').addClass('pubActivity').removeClass('videoContent').hide().siblings().show();
        					$('#myIframe').css('height', "0").attr('src', "")
        				})
        			}
        		})
        	})
        	
        }
        ,
        datalistData:'',
        circleData:"",
        //新建圈子
        openCircle:function(src){
        	var _self = this;
        	_self.html = $('.bgPhone').html();
        	$('#setCircle,.setBox').on('click',function(){
				var shopId = _self.params.shopId;
                if(shopId == undefined ){
                    index.sweetAlert("动态数据shopId加载失败,请稍候再试","warning");
                }
                var userId = _self.params.userId;
                if(userId == undefined ){
                    index.sweetAlert("动态数据userId加载失败,请稍候再试","warning");
                }			
				var src = src || "./setCircle.html?shopId="
				$('#myIframe').css('height',"100%").attr('src',"./addCircle/setCircle.html?shopId="+shopId+'&userId='+userId)
				$('.bgPhone').addClass('set');
				var set = template('setCircleShow');
				$('.bgPhone').html(set)
				//新建圈子返回
				$('#back').on('click',function(){
					_self.backCircle();
				})
        	});
        },
        //圈子详情
        openCircleDateil:function(data){
        	var _self = this;
        	$('#myIframe').css('height',"100%").attr('src','./setCircleDetalis/setCircle.html?&shopId='+index.params.shopId+'&userId='+index.params.userId+'&circleId='+index.presentCircleId)
//      	
        	console.log(data)
        	var html = template('circleParticulars');
        	$('.bgPhone').addClass('set').html(html);
        	//头部渐变
        	$('.setContent').scroll(function() {
        		var alpha = 1 - ($('#headImg').position().top + $('#headImg').height()) / $('#headImg').height();
        		$('.setTitle').css('background', 'linear-gradient(to right, rgba(250,151,36,' + alpha + '), rgba(250,76,71,' + alpha + '))');
        		$('.setTitle .setName').css('opacity', alpha);
        	})
        	$('#back').on('click', function() {
        		_self.backCircle();
        	})
        	$('#headImg').attr('src',data.url);
        	$('#setName,.setTitle .setName').html(data.name);
		
        	if(data.type==2){
        		$('.setNameBar bus').show()
        	}else{
        		$('.setNameBar bus').hide()
        	};
        	var arr = data.markName.split(',');
        	for(var i = 0 ; i<arr.length;i++){
        		var li = '<li>#'+arr[i]+'</li>';
        		$('#markName').append(li)
        	};
        	$('#titleText').text(data.title);
        	$('#menu').show();
        	$('.videoNum').text(data.videoNumber).parent('#video').data('id',data.id);
        	$('.activityNum').text(data.activityNumber).parent('#activityBtn').data('id',data.id);
        	$('.photoNum').text(data.albumNumber).parent('#album').data('id',data.id);
        	$('.personNum').text(data.personNumber).parent('#person').data('id',data.id);
        	//打开成员
      		$('#person').on('click', function() {
      				$('#myIframe').css('height',"0").attr('src',"");
        			var cmd = "circle/getPersons";
        			var data = {
        				circleId: $('#person').data('id')
        			}
        			var callback = _self.setMember;
        			_self.ajaxAsy(cmd, data, callback)
        		})
      		//打开动态
        	$('#video').on('click',function(){
        		$('#myIframe').css('height',"0").attr('src',"");
        		var cmd = 'circle/searchVideoAlbumListByParamNew20';
        		var data = {
        			'videoAlbumCircleId':$('#video').data('id'),
        			"videoAlbumType":"1,2,3",
	                "orderType":1,
	                "sStartpage":1,
	                "sPagerows":4
        		};
        		var callback = _self.getVideo;
        		_self.ajaxAsy(cmd, data, callback);
        	});
        	//打开活动
        	$('#activityBtn').on('click',function(){
        		$('#myIframe').css('height',"0").attr('src',"");
        		_self.initActivity()
        	})
        	//打开相册
        	$('#album').on('click',function(){
        		$('#myIframe').css('height',"0").attr('src',"");
        		_self.initPhoto();
        	})
        },
        //相册修改新建返回刷新
        initPhoto:function(){
        	$('#myIframe').css('height',"0").attr('src',"");
        	var cmd = 'circle/getBackPhones';
        		var data = {
        			"circleId": index.presentCircleId,
        			"type":"1"
        		}
        		var callback = index.getPhones;
        		index.ajaxAsy(cmd, data, callback);
        }
        ,
        //打开圈子活动
        initActivity:function(callback){
        	var cmd = 'circle/getActivityByShopId';
        	var data = {
        		userId : index.params.userId,
        		shopId : index.params.shopId,
        		"circleId": index.presentCircleId || "",
        		"sStartpage": 1,
        		"sPagerows": 4
        	};
        	index.ajaxAsy(cmd, data, function(re){
        		index.showActivity(re);
        		if(callback){
        			callback()
        		}
        	});
        },
        showActivity:function(re){
        	if(!$('#searchVideo')[0]) {
        		var html = template('videoContent');
        		$('.bgPhone').html(html);
        	}
        	var ActivityList = template('ActivityList',re);
        	$('#searchVideo').append(ActivityList);
        	$('.pubBtn').addClass('pubAct');
        	var cName = index.datalistData.name;
        	if(cName){
        		if(cName.length >= 3) {
        			cName = cName.substring(0, 3);
        			$('.memberTitle .setName').html(cName + '...' + '圈子活动');
        		} else {
        			$('.memberTitle .setName').html(cName + '圈子活动');
        		};
        	}else{
        		$('.memberTitle .setName').html('圈子活动');
        	}
   			//返回
   			$('#videoBack').click(function() {
   				index.openCircleDateil(index.datalistData)
   			});
   			//加载更多
   			$('#toLoad').on('click',function(){
   				$(this).remove();
 				var cmd = 'circle/getActivityByShopId';
   				var sStartpage = Math.ceil($('.activityList').length/4)+1
        		var data = {
        			userId : index.params.userId,
        			shopId : index.params.shopId,
        			circleId:index.presentCircleId || "",
	                "sStartpage":sStartpage,
	                "sPagerows":4
        		};
        		var callback = index.showActivity;
        		index.ajaxAsy(cmd, data, callback);
   			});
   			//发布活动
   			$('.pubAct').on('click',index.pubActivity)
   			//查看活动详情
   			$('.activityList').on('click',function(){
   				var cmd = 'activityNew/getActivityDetail';
   				var data = {
   					userId:index.params.userId||731,
   					id:$(this).find('input[name="id"]').val()
   				}
   				index.ajaxAsy(cmd,data,function(re){
   					if(re.code==1){
   						var html = template('ActivityDetalist',re);
   						$('.pubBtn,.dynamicCet,#videoBack').hide();
   						$('.ActivityDetails,#aDetaBack').show();
   						$('.ActivityDetails').html(html);
// 						$('#myIframe').css('height',"100%").attr('src',"./activityDetalis/index.html?userId="+index.params.userId+"&id="+re.data.id)
   						$('#aDetaBack').off().on('click',function(){
   							$('.ActivityDetails,#aDetaBack').hide();
							$('.pubBtn,.dynamicCet,#videoBack').show();
							$('#myIframe').css('height',"0").attr('src',"")
   						})
   					}
   				})
   			})
      }
        ,
        //发布活动
        pubActivity:function(){
        	var old = $('.setName').html();
        	$('.setName').html('发布活动');
        	var circleId = index.presentCircleId||"";
        	if(index.presentCircleId&&index.presentCircleId!=""){
        		$('.pubBtn,.dynamicCet,#videoBack').hide();
        		var errorMessage = $('.errorMessage').clone();
        		errorMessage.attr('id', 'activityErrorMsg')
        		$('#activityGbtn').after(errorMessage);
        		$('#aDetaBack').show().off().on('click', function() {
        			$('.setName').html(old);
        			errorMessage.remove();
        			$('#aDetaBack').hide().siblings('#videoBack').show();
        			$('.pubActivity').hide().html("");
        			$('.pubBtn,.dynamicCet').show();
        			$('#myIframe').css('height', "0").attr('src', "");
        		})
        		var html = template('pubActibityModule');
        		$('.pubActivity').show().html(html);
        		
        	}else{
        		var errorMessage = $('.errorMessage').clone();
        		errorMessage.attr('id', 'activityErrorMsg')
        		$('#activityGbtn').after(errorMessage);
        		var html = template('pubActibityModule');
        		$('.pubActivity').addClass('videoContent').removeClass('pubActivity').html(html).show().siblings().hide();
        		$('.memberTitle ').show();
        		$('.pubActivityBox').addClass('pubActivity');
        		$('#aDetaBack').off().on('click',function(){
        			errorMessage.remove();
        			$('.videoContent').html("").hide().siblings().show();
        			$('.videoContent').removeClass('videoContent').addClass('pubActivity')
        			$('#myIframe').css('height', "0").attr('src', "");
        		})
        	}
			$('#myIframe').css('height', "100%").attr('src', "./addActivity/addActivity.html?userId=" + index.params.userId + "&circleId=" + circleId + "&shopId=" + index.params.shopId);
        },
        presentPhones:"",
        getPhones:function(re){
        	index.circleData.data[index.swiperActiveIndex].albumNumber = index.datalistData.albumNumber = re.data.length;
        	index.presentPhones = re;
        	var html = template('phones',re);
        	$('.bgPhone').html(html);
        	var cName = index.datalistData.name;
        	if(cName.length >= 3) {
        		cName = cName.substring(0, 3);
        		$('.memberTitle .setName').html(cName + '...' + '圈子相册');
        	} else {
        		$('.memberTitle .setName').html(cName + '圈子相册');
        	}
        	$('.cover').hover(function(e) {
        		$(this).find('.tier').show();
        	}, function(e) {
        		$(this).find('.tier').hide();
        	})
        	$('.removeP').on('click',function(e){
        		e.stopPropagation();
        		var $dom = $(this).parents('.cover'),
        		cmd='circle/delBackAlbums',
        		data = {
        			id: $dom.find('input[name="id"]').val(),
        			albumId: $dom.find('input[name="albumId"]').val(),
        			circleId: $dom.find('input[name="circleId"]').val(),
        			userId :$dom.find('input[name="userId"]').val()
        		};
				return swal({
					title: null,
					text: '确定要删除该相册吗',
					icon: 'warning', // warning
					className: 'mien',
					buttons: ['删除', '取消']
				}).then(function(willDelete) {
					if(!willDelete) {
						index.ajaxAsy(cmd,data,function(re){
							index.sweetAlert(re.msg,"success")
							index.initPhoto();
						})
					}
				})		
        	});
        	$('.album').on('click',function(e){
        		var albumId =  $(this).find('input[name="albumId"]').val();
        		var circleId = $(this).find('input[name="circleId"]').val();
        		var userId = $(this).find('input[name="userId"]').val();
        		var id = $(this).find('input[name="id"]').val();
        		$('.keep').show();
      			$('#myIframe').css('height',"100%").attr('src',"./photoDetails/photoDetails.html?albumId="+albumId+"&userId="+userId+"&circleId="+circleId+"&id="+id);
        	})
        $('.compile').on('click',function(e){
        	e.stopPropagation();
        	var $dom = $(this).parents('.cover'),
        		userId = $dom.find('input[name="userId"]').val(),
        		id = $dom.find('input[name="id"]').val(),
        		albumId = $dom.find('input[name="albumId"]').val(),
        		circleId = $dom.find('input[name="circleId"]').val(),
        		data = {
        			userName:$dom.find('.creator').text().trim(),
        			albumName:$dom.find('.photoName').text().trim(),
        			albumUrl:$dom.find('.fansPhoto').attr('src'),userId,albumId,circleId,id
        		}
        		index.pubPhoto(data);
        })
        	$(' .pubPhoto').on('click',function(){
        		index.pubPhoto();
        	})
        	$('#videoBack').click(function(){
				index.openCircleDateil(index.datalistData)
 			});
        },
       //新建相册
        pubPhoto:function(data){
			var html = template('pubPhotoModule');
        	$('.bgPhone').html(html);
        	if(data){
        		$('#pubShowImg,.hoverImg').attr('src',data.albumUrl);
        		$('.creator').html(data.userName);
				$('.pubAlbumName,.photoName').text(data.albumName);
				$('#myIframe').css('height',"100%").attr('src',"./addPhoto/photoPub.html?albumId="+data.albumId+"&userId="+data.userId+"&circleId="+data.circleId+"&id="+data.id)
        	}else{
				$('#myIframe').css('height',"100%").attr('src',"./addPhoto/photoPub.html?circleId="+index.datalistData.id+"&userId"+index.params.userId)
        	}
          	//创建相册返回
        	$('#videoBack').click(function(){
        		$('#myIframe').css('height',"0").attr('src',"");
				index.getPhones(index.presentPhones);
        	})
        }
        ,
        //成员展示
        setMember:function(re){
        	var html = template('memberTem',re);
        	$('.bgPhone').html(html);
        	var cName = $('.setTitle .setName').text();
        			if(cName.length >= 3) {
        				cName = cName.substring(0, 3);
        				$('.memberTitle .setName').html(cName + '...' + '圈子成员');
        			}else{
        				$('.memberTitle .setName').html(cName  + '圈子成员');
        			}

        	var SortList = $('.sortList');
        	var SortBox = $(".sortBox");
        	SortList.sort(asc_sort).appendTo('.sortBox');
        	
        	function asc_sort(a, b) {
        		return makePy($(b).find('.numName').text().trim().charAt(0))[0].toUpperCase() < makePy($(a).find('.numName').text().trim().charAt(0))[0].toUpperCase() ? 1 : -1;
        	}
        	var initials = [];
        	var num = 0;
        	SortList.each(function(i) {
        		var initial = makePy($(this).find('.numName').text().trim().charAt(0))[0].toUpperCase();
        		if(initial >= 'A' && initial <= 'Z') {
        			if(initials.indexOf(initial) === -1)
        				initials.push(initial);
        		} else {
        			num++;
        		}
        	
        	});
        	$.each(initials, function(index, value) { //添加首字母标签
        		SortBox.append('<div class="sortLetter" id="' + value + '">' + value + '(<span>' + 0 + '</span>人)</div>');
        		$('.initials ul').append('<li>'+value+'</li>');
        	});
        	if(num != 0) {
        		SortBox.append('<div class="sortLetter" id="default">#</div>');
        		$('.initials ul').append('<li>#</li>');
        	}
        	
        	for(var i = 0; i < SortList.length; i++){ //插入到对应的首字母后面
        		var letter = makePy(SortList.eq(i).find('.numName').text().trim().charAt(0))[0].toUpperCase();
        		switch(letter) {
        			case "A":
        				var aSum = $('#A').find('span').text() - 0;
        				aSum++
        				$('#A').after(SortList.eq(i)).find('span').text(aSum);
        				break;
        			case "B":
        				var bSum = $('#B').find('span').text() - 0;
        				bSum++
        				$('#B').after(SortList.eq(i)).find('span').text(bSum);
        				break;
        			case "C":
        				var cSum = $('#C').find('span').text() - 0;
        				cSum++
        				$('#C').after(SortList.eq(i)).find('span').text(cSum);
        				break;
        			case "D":
        				var dSum = $('#D').find('span').text() - 0;
        				dSum++
        				$('#D').after(SortList.eq(i)).find('span').text(dSum);
        				break;
        			case "E":
        				var eSum = $('#E').find('span').text() - 0;
        				eSum++
        				$('#E').after(SortList.eq(i)).find('span').text(eSum);
        				break;
        			case "F":
        				var fSum = $('#F').find('span').text() - 0;
        				fSum++
        				$('#F').after(SortList.eq(i)).find('span').text(fSum);
        				break;
        			case "G":
        				var gSum = $('#G').find('span').text() - 0;
        				gSum++
        				$('#G').after(SortList.eq(i)).find('span').text(gSum);
        				break;
        			case "H":
        				var hSum = $('#H').find('span').text() - 0;
        				hSum++
        				$('#H').after(SortList.eq(i)).find('span').text(hSum);
        				break;
        			case "I":
        				var iSum = $('#I').find('span').text() - 0;
        				iSum++
        				$('#I').after(SortList.eq(i)).find('span').text(iSum);
        				break;
        			case "J":
        				var jSum = $('#J').find('span').text() - 0;
        				jSum++
        				$('#J').after(SortList.eq(i)).find('span').text(jSum);
        				break;
        			case "K":
        				var kSum = $('#K').find('span').text() - 0;
        				kSum++
        				$('#K').after(SortList.eq(i)).find('span').text(kSum);
        				break;
        			case "L":
        				var lSum = $('#L').find('span').text() - 0;
        				lSum++
        				$('#L').after(SortList.eq(i)).find('span').text(lSum);
        				break;
        			case "M":
        				var mSum = $('#M').find('span').text() - 0;
        				mSum++
        				$('#M').after(SortList.eq(i)).find('span').text(mSum);
        				break;
        			case "N":
        				var nSum = $('#N').find('span').text() - 0;
        				nSum++
        				$('#N').after(SortList.eq(i)).find('span').text(nSum);
        				break;
        			case "O":
        				var oSum = $('#O').find('span').text() - 0;
        				oSum++
        				$('#O').after(SortList.eq(i)).find('span').text(oSum);
        				break;
        			case "P":
        				var pSum = $('#P').find('span').text() - 0;
        				pSum++
        				$('#P').after(SortList.eq(i)).find('span').text(pSum);
        				break;
        			case "Q":
        				var qSum = $('#Q').find('span').text() - 0;
        				qSum++
        				$('#Q').after(SortList.eq(i)).find('span').text(qSum);
        				break;
        			case "R":
        				var rSum = $('#R').find('span').text() - 0;
        				rSum++
        				$('#R').after(SortList.eq(i)).find('span').text(rSum);
        				break;
        			case "S":
        				var sSum = $('#S').find('span').text() - 0;
        				sSum++
        				$('#S').after(SortList.eq(i)).find('span').text(sSum);
        				break;
        			case "T":
        				var tSum = $('#T').find('span').text() - 0;
        				tSum++
        				$('#T').after(SortList.eq(i)).find('span').text(tSum);
        				break;
        			case "U":
        				var uSum = $('#U').find('span').text() - 0;
        				uSum++
        				$('#U').after(SortList.eq(i)).find('span').text(uSum);
        				break;
        			case "V":
        				var vSum = $('#V').find('span').text() - 0;
        				vSum++
        				$('#V').after(SortList.eq(i)).find('span').text(vSum);
        				break;
        			case "W":
        				var wSum = $('#W').find('span').text() - 0;
        				wSum++
        				$('#W').after(SortList.eq(i)).find('span').text(wSum);
        				break;
        			case "X":
        				var xSum = $('#X').find('span').text() - 0;
        				xSum++
        				$('#X').after(SortList.eq(i)).find('span').text(xSum);
        				break;
        			case "Y":
        				var ySum = $('#Y').find('span').text() - 0;
        				ySum++
        				$('#Y').after(SortList.eq(i)).find('span').text(ySum);
        				break;
        			case "Z":
        				var zSum = $('#Z').find('span').text() - 0;
        				zSum++
        				$('#Z').after(SortList.eq(i)).find('span').text(zSum);
        				break;
        			default:
        				var Sum = $('#default').find('span').text() - 0;
        				Sum++
        				$('#default').after(SortList.eq(i)).find('span').text(Sum);
        				break;
        		}
        	};
        	if($(".initials ul li").length<=1){
        		$(".initials ul li").hide()
        	}else{
        		$(".initials ul li").show();
        		$(".initials ul li").off().on('click', function() {
        		var LetterHtml = $(this).html().trim();
        		if(LetterHtml!=""){
        			var pos = Math.floor($("#" + LetterHtml).position().top);
        			$('.memberContent').animate({marginTop:(pos*-1)+'px'})
        		}else{
        			$('.memberContent').animate({marginTop:'0'})
        		}
        		})
        	}

        	$('#memberBack').on('click', function() {
        		index.openCircleDateil(index.datalistData);
        	})
        },
        //打开动态界面
 		getVideo:function(re){
 			if(!$('#searchVideo')[0]){
 				var html = template('videoContent');
 				$('.bgPhone').html(html)
 			}
 			var videoHtml = template('videoAlbumList',re);
 			index.presentVideoData = re
 			$('#searchVideo').append(videoHtml);
 			if(index.datalistData.name){
 				var cName = index.datalistData.name;
 				if(cName.length >= 3) {
 					cName = cName.substring(0, 3);
 					$('.memberTitle .setName').html(cName + '...' + '圈子动态');
 				} else {
 					$('.memberTitle .setName').html(cName + '圈子动态');
 				}
 			}

   			//动态详情
   			$('.mienBox').on('click',function(){
   				$(this).addClass('active').siblings('.mienBox').removeClass('active');
   				var videoAlbumId = $(this).find('input[name="videoId"]').val();
   				var userId = index.params.userId||371;
   				$('#myIframe').css('height', "100%").attr('src', './dynamicDetails/dynamicDetails.html?videoAlbumId=' + videoAlbumId + '&userId=' + userId)
   			})
 			//视频播放;
 			$('.videoBox,.pictureBox img').on('click', function(e) {
						e.stopPropagation();
					})
 			$('.playVideo').on('click', function(e) {
 				var that = $(this)
 				that.hide();
 				that.siblings('video')[0].play();
 				$('.dynamicCet').scroll(function() {
 					if(that.siblings('video').offset().top < 50 || that.siblings('video').offset().top > 750) {
 						that.siblings('video')[0].pause();
 						that.show()
 					}
 				})
 				that.siblings('video')[0].addEventListener('click', function(e) {
 					e.stopPropagation();
 					that.siblings('video')[0].pause();
 					that.show()
 				})
 				that.siblings('video')[0].onended = function() {
 					this.load();
 					$(this).siblings('.playVideo').show()
 				}
 				e.stopPropagation();
 			})
 			$('#toLoad').on('click',function(){
 				$(this).remove();
 				var cmd,data;
 				var sStartpage = Math.ceil($('.mienBox').length/4)+1
 				if(index.presentCircleId==""&&index.selectCircleId==""){
 					//没有当前圈子ID 
 					cmd = "circle/getVideoListByShopId"
 					data = {
 						shopId:index.params.shopId||347,
 						sCurrUserId:index.params.userId||731,
 						sStartpage:sStartpage,
 						sPagerows:4
 					}
 				}else if(index.selectCircleId!=""){
						cmd = 'circle/searchVideoAlbumListByParamNew20';
						data = {
		        			'videoAlbumCircleId':index.selectCircleId,
		        			"videoAlbumType":"1,2,3",
			                "orderType":1,
			                "sStartpage":sStartpage,
			                "sPagerows":4
		        		};
 				}else{
 					cmd = 'circle/searchVideoAlbumListByParamNew20';
 					data = {
 						'videoAlbumCircleId': $('input[name="videoAlbumCircleId"]').val(),
 						"videoAlbumType": "1,2,3",
 						"orderType": 1,
 						"sStartpage": sStartpage,
 						"sPagerows": 4
 					};
 				}
        		var callback = index.getVideo;
        		index.ajaxAsy(cmd, data, callback);
 			})
 			$('#videoBack').click(function(){
 				index.openCircleDateil(index.datalistData);
 			});
 			//发布动态
 			$('.pubBtn').off().on('click',function(){
 				index.pubVideo();
 			})
 			
 		},

 		//发布动态回调
 		pubVideo:function(){
 			var userId = index.params.userId||731;
 			var shopId = index.params.shopId || 347;
 			var circleId = index.presentCircleId || "";
 			$('#myIframe').css('height',"100%").attr('src','./pubVideo/mienPub.html?userId='+userId+'&circleId='+circleId+'&shopId='+shopId);
 			var html = template('pubVideoShow');
 			$('.pubVideo').html(html).show().siblings().hide();
 			$('#pubVideoBack').click(function(){
 				if(index.presentCircleId&&index.presentCircleId!=""){
 					$('.pubVideo').html("").hide().siblings().show();
 				}else{
 					$('.pubVideo').html("").hide();
 					$('.phoneContent,.phoneNav').show();
 				}
 				$('#myIframe').css('height',"0").attr('src','');
 			})
 		},
 		//发布动态返回
 		pubVideoCancel:function(){
 			$('#myIframe').css('height', "0").attr('src', "");
 			if($('#pubVideoBack')[0]){
 				$('#pubVideoBack').trigger('click')
 			}else{
 				$('.pubBg').html('').hide().siblings('.bgPhone').show();
 				$('#dynamicBtn').removeClass('active').siblings('#setTeam').addClass('active')
 			}
 		}
 		,
 		//发布动态成功
 		pubVideoSuccess:function(){
 			$('#myIframe').css('height', "0").attr('src', "");
 			$('#pubVideoBack').trigger('click');
   			$('#searchVideo').html("");
 			if(index.presentCircleId!=""){
 				var cmd = 'circle/searchVideoAlbumListByParamNew20';
 				var data = {
 					'videoAlbumCircleId': index.presentCircleId,
 					"videoAlbumType": "1,2,3",
 					"orderType": 1,
 					"sStartpage": 1,
 					"sPagerows": 4
 				};
 				index.ajaxAsy(cmd, data, function(re){
 					index.getVideo(re);
 					index.sweetAlert('发布成功', 'success');
 				});
 				//更改动态数量
 				index.circleData.data[index.swiperActiveIndex].videoNumber = index.datalistData.videoNumber = index.datalistData.videoNumber - 0 + 1;
 			}else{
 				$('#dynamicBtn').removeClass('active').siblings('#setTeam').addClass('active');
 				$('.pubBg').html('').hide().siblings('.bgPhone').show();
// 				layer.load(1,{shade:[0.2,'#fff']})
 				index.getCircleData(function(){
 					$('#getVideoListByShopId a').trigger('click');
 					index.sweetAlert('发布成功', 'success');
 				});
 				
 			}

 		}
 		,
   		//发布活动成功回调
   		pubActivityCallback:function(){
 			$('#aDetaBack').trigger('click');
 			$('.bgPhone').html('');
 			if(index.presentCircleId!=""||index.presentCircleId){
 				index.initActivity(function(){
 						index.sweetAlert('发布成功', 'success');
 						index.circleData.data[index.swiperActiveIndex].activityNumber = index.datalistData.activityNumber = index.datalistData.activityNumber -0 +1;
 				});
 				}else{
 					$('#setTeam').trigger('click')
 					index.getCircleData(function(){
 					$('#getActivityByShopId a').trigger('click');
 					index.sweetAlert('发布成功', 'success');
 				});
 				};
   			
   		}
   		,
 	
        backCircle:function(code){
        	var _self = this;
        	$('.errorMessage').html("");
        	$('#myIframe').css('height',"0").attr('src',"");
        	$('.bgPhone').removeClass('set');
        	_self.showCircle(_self.circleData);
        	//储存的数据归零
        	_self.presentCircleId = "";
        	if(code == 1){
        		window.location.reload()
        	}
        },
        sweetAlert:function(hint,icon){
        	return swal({
        		title: null,
        		text: hint,
        		icon: icon,
        		showConfirmButton: true,
        		confirmButtonColor: '#ff847f',
        		button: {
        			text: "关闭"
        		}
        	})
        },
        confirm:function(res,icon,callback){
        	return swal({
        		title: null,
        		text: res,
        		icon: icon, // warning
        		className: 'mien',
        		buttons: ['删除', '取消']
        	}).then(function(willDelete) {
        		if(!willDelete) {
					//确定删除
					if(callback){
						callback();
					}
        		}
        	})
        },
        //上传照片滚动条
        progress:function(up,files,callback){
        	var $dom = $('#progressContent').clone();
        	$dom.attr('id', "");
        	$('body').append($dom)
        	layer.open({
        		title: false,
        		type: 1,
        		skin: 'progressLayer',
        		content: $dom,
        		area: ['380px'],
        		btn: "取消",
        		btnAlign: 'c',
        		closeBtn: 0,
        		success: function(layero, index) {
        			up.bind('UploadProgress', function(up, files) {
        				$(layero).find('.progress .progress-bar').css('width', up.total.percent + "%");
        				$(layero).find('.progress-text').html(up.total.percent + '%');
        			});
        			up.bind('UploadComplete', function(up, files) {
        				setTimeout(layer.closeAll(), 1000);
        			});
        		},
        		yes: function(index, layero) {
        			up.stop();
        			for(var i = files.length - 1; i >= 0; i--) {
        				up.removeFile(files[i]);
        			}
        			up.refresh();
        			if(callback){
        				callback()
        			}
        			layer.close(index);
        		},
        		end: function() {
        			$dom.remove()
        		}
        	})
        },
        //相册详情返回
        prisBack:function(){
        	$('#myIframe').css('height',0).attr('src',"");
        	$('.keep').hide();
        	index.initPhoto()
        },
        //打开图片,
        openImg:function(data){
        	if(index.valve){
        		index.valve = false;
        		var $dom = $('#imgContent').clone();
        		$dom.find('.useName').text(data.userName);
        		var dowUrl = data.url;
        		$dom.attr('id', "").find('.priShow').attr('src', data.url + '?x-oss-process=image/resize,m_lfit,h_700,w_500');
        		$dom.find('.useName').text(data.albumName);
        		$dom.find('.priDate').text(data.albumTime);
        		$dom.find('input[name="aid"]').val(data.id);
        		//      	var aid = data.id;
        		$('body').append($dom);
        		$dom.find('.priShow')[0].onload = function() {
        			layer.open({
        				title: false,
        				type: 1,
        				area: '580px',
        				closeBtn: 2,
        				move: ".layui-layer-content",
        				zIndex: 11,
        				btnAlign: 'c',
        				btn: ['删除', '下载'],
        				skin: 'imgShow',
        				content: $dom.show(),
        				success :function(){
        					index.valve = true;
        				},
        				yes: function() {
        					//删除
        					swal({
        						title: null,
        						text: '你确定要删除该图片吗',
        						icon: "warning",
        						className: 'mien',
        						buttons: ['删除', '取消']
        					}).then(function(willDelete) {
        						console.log(willDelete);
        						if(!willDelete) {
        							var cmd = "circle/delBackPhotos",
        								reData = {
        									id: data.id,
        									circleId: data.circleId,
        									userId: data.userId
        								};
        							index.ajaxAsy(cmd, reData, function(re) {
        								$('#myIframe')[0].contentWindow.$('.opened').remove()
        								layer.closeAll();
        							})
        						}
        		
        					})
        				},
        				btn2: function(index, layero) {
        					var a = document.createElement('a');
        					a.setAttribute('download', '');
        					a.href = dowUrl;
        					document.body.appendChild(a);
        					a.click();
        					a.remove();
        				},
        				end: function() {
        					$dom.remove();
        					$('#myIframe')[0].contentWindow.$('.opened').removeClass('opened')
        				}
        			})
        		}
        	}

        }
	});
	window.index = new Detail();
	//发布活动
	$('#dynamicBtn').click(function(){
		$('.errorMessage').empty();
		$('#activityErrorMsg').remove();
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('.pubBg').show().siblings('.bgPhone').hide();
		var userId = index.params.userId;
		var shopId = index.params.shopId;
		circleId = "";
		$('#myIframe').css('height',"100%").attr('src','./pubVideo/mienPub.html?userId='+userId+'&circleId='+circleId+'&shopId='+shopId);
		var html = template('pubVideoShow');
		$('.pubBg').html(html);
		$('#pubVideoBack').remove();
	});
	$('#activityGbtn').click(function(){
		$('.errorMessage').empty();
		$('#activityErrorMsg').remove();
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('.pubBg').show().siblings('.bgPhone').hide();
		var errorMessage = $('.errorMessage').clone();
		errorMessage.attr('id', 'activityErrorMsg')
		$('#activityGbtn').after(errorMessage);
		var html = template('pubActibityModule');
		$('.pubBg').html('').append('<div class="videoContent"></div>');
		$('.videoContent').html(html);
		$('.memberTitle ').show().siblings('.pubActivityBox').addClass('pubActivity');
		$('#aDetaBack').remove();
		$('#myIframe').css('height', "100%").attr('src', "./addActivity/addActivity.html?userId=" + index.params.userId + "&circleId=" + "" + "&shopId=" + index.params.shopId);
	})
	$('#setTeam').click(function(){
		$('.errorMessage').empty();
		$(this).addClass('active').siblings('.btn').removeClass('active');
		$('.pubBg').hide().siblings('.bgPhone').show();
		$('#myIframe').css('height','0').attr('src',"");
		$('#activityErrorMsg').remove();
		$('.bgPhone').removeClass('set')
		index.showCircle(index.circleData);
	})
})
function setCircle(e) {
	console.log(e)
	if(e.params.url == "") {
		$('.errorImg').remove()
		$('.errorMessage').append('<li class="caution errorImg">未上传圈子头像</li>')
	} else {
		$('.errorImg').remove()
	}
	if(e.params.name == "" || e.params.name.length <= 2) {
		$('.errorName').remove()
		$('.errorMessage').append('<li class="caution errorName">圈子名称填写错误</li>')
	} else {
		$('.errorName').remove()
	}
	if(e.params.markName != "") {
		$('.errorMark').remove()
		var arr = e.params.markName.split(',');
		$('#markName').empty();
		for(var i = 0; i < arr.length; i++) {
			var li = '<li>#' + arr[i] + '</li>';
			$('#markName').append(li);
		}
	} else {
		$('.errorMark').remove()
		$('.errorMessage').append('<li class="caution errorMark">未选择标签</li>')
	}
	if(e.params.title == "") {
		$('.errorTitle').remove()
		$('.errorMessage').append('<li class="caution errorTitle">圈子介绍未填写</li>')
	} else {
		$('.errorTitle').remove()
	}
	$('#headImg').attr('src', e.params.url + '?x-oss-process=image/resize,m_fill,w_340,h_220,limit_0');
	$('#setName').html(e.params.name);
	$('#storeName').html(e.params.storeName);
	$('#titleText').html(e.params.title);
}
function addPhoto(e){
	$('#pubShowImg,.hoverImg').attr('src',e.params.bgImgs);
	$('.pubAlbumName,.photoName').text(e.params.mienText);
}

function mienPubDetail(e){
	console.log(e.params)
	var data= e.params
	$('.videoAlbumDescription').val(data.mienText);
	$('.selectCircleName').text(data.selectCircle);
	if(data.taskImgs.length>0){
		$('.pictureBox').show().siblings().hide();
		$('.pictureBox').empty();
		for(var i = 0 ;i < data.taskImgs.length ; i++){
			var list = '<li class="pubImg" ><img src="'+data.taskImgs[i]+'"/></li>'
			$('.pictureBox').append(list);
		}
	}else{
		$('.pictureBox').hide();
	};
	if(data.videoUrl!=""){
		$('.videoBox').show().siblings().hide();
		$('.videoBox').find('video').attr({"src":data.videoUrl,"poster":data.videoPoster});
		$('.playVideo').on('click', function(e) {
			var that = $(this)
			that.hide();
			that.siblings('video')[0].play();
			that.siblings('video')[0].addEventListener('click', function(e) {
				e.stopPropagation();
				that.siblings('video')[0].pause();
				that.show()
			})
			that.siblings('video')[0].onended = function() {
				this.load();
				$(this).siblings('.playVideo').show()
			}
			e.stopPropagation();
		})
	}else{
		$('.videoBox').hide();
	}
}

function addActivity(e){
	console.log(e.params)
	var data= e.params
	if(data.cover==""){
		//左侧提醒
		$('.errorImg').remove()
		$('#activityErrorMsg').append('<li class="caution errorImg">未上传背景照片</li>')
		$('.activityDetailsH img').attr('src','./image/noSrc.png');
	}else{
		$('.errorImg').remove()
		$('.activityDetailsH img').attr('src',data.cover);
	};
	if(data.applyQualification==1){
		$('.isJoin').show()
	}else{
		$('.isJoin').hide()
	};
	if(data.name==""){
		$('.errorName').remove()
		$('#activityErrorMsg').append('<li class="caution errorName">未填写活动名称</li>')
	}else{
		$('.errorName').remove()
		$('.actName').html(data.name).show();
	}
	if(data.startTime==""){
		$('.errorTime').remove();
		$('.StartTime').html("").hide();
		$('#activityErrorMsg').append('<li class="caution errorTime">未选择活动开始时间</li>')
	}else{
		$('.errorTime').remove();
		$('.StartTime').show().html('活动时间:'+data.startTime+'开始')
	};
	if(data.address==""){
		$('.errorAddress').remove();
		$('.activityAddress').html("").hide();
		$('#activityErrorMsg').append('<li class="caution errorAddress">未选择活动开始时间</li>')
	}else{
		$('.errorAddress').remove();
		$('.activityAddress').show().html('活动地址:'+data.address);
	}
	if(data.avePrice==""){
		$('.avePrice').html("").hide()
		$('.errorAvePrice').remove()
		$('#activityErrorMsg').append('<li class="caution errorAvePrice">未填写人均价格</li>')
	}else{
		$('.errorAvePrice').remove()
		if(data.avePrice != 0) {
			$('.avePrice').html('¥' + data.avePrice).show()
		} else {
			$('.avePrice').html('免费').show()
		}
	};
	$('.circleBar>img').attr('src',data.circleLogo);
	$('.actCircleName').html(data.circleName);
	if(data.content==""){
		$('.errorContent').remove()
		$('#activityErrorMsg').append('<li class="caution errorContent>未填写活动介绍</li>')
		$('.contentTitle').html("")
	}else{
		$('.errorContent').remove();
		$('.contentTitle').html(data.content)
	}
	if(data.contentVideo==""){
		$('videoBox').hide();
	}else{
		$('videoBox').show();
		$('video').attr('src',data.contentVideo);
	}
	
	$('.activityImgList').empty();
	for(var i = 0 ; i < data.contentUrl.length;i++){
		var list = $('<li><img src="'+data.contentUrl[i]+'"></li>');
		$('.activityImgList').append(list);
	}
}
