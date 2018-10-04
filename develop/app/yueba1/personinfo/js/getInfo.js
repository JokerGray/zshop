function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

var browers;
var isSmartCity = false;

function GetBrower() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	isSmartCity = u.indexOf('SmartCity') > -1; //是否在APP内部
	if (isAndroid)
		return "android" + (isSmartCity ? ".sc" : "");
	if (isiOS)
		return "ios" + (isSmartCity ? ".sc" : "");

	return "else";
}

var GetInfo = function () {
	var swiperType; //技能滑动条
	var swiperImg; //证书滚动
	var jsondata;
	var dropload;
	var userid;
	var skillid;
	var comment_num; //临时使用
	var now_page;
	var initSwipers = function () {
		swiperType = new Swiper('.swiper-container', {
				slidesPerView: 3,
				loop: false,
				onClick: function (swiper) {
					if (!$(swiperType.clickedSlide).find('div').hasClass('slide-active')) {
						$('.swiper-container>.swiper-wrapper>.swiper-slide>.slide-active').removeClass('slide-active');
						$(swiperType.clickedSlide).find('div').addClass('slide-active');
						updateSkillInfo(swiperType.clickedIndex);
						if (browers == "android.sc") {
							window.jsObj.changeSkill(jsondata.skillList[swiperType.clickedIndex].serviceId, jsondata.skillList[swiperType.clickedIndex].serviceName, jsondata.skillList[swiperType.clickedIndex].categoryId, jsondata.skillList[swiperType.clickedIndex].serviceMode);
						} else if (browers == "ios.sc") {
							changeSkill(jsondata.skillList[swiperType.clickedIndex].serviceId, jsondata.skillList[swiperType.clickedIndex].serviceName, jsondata.skillList[swiperType.clickedIndex].categoryId, jsondata.skillList[swiperType.clickedIndex].serviceMode);
						}
					}
				}
			});
		swiperImg = new Swiper('.swiper-container1', {
				slidesPerView: 1,
				autoplay: 2000,
				autoplayDisableOnInteraction: false,
				loop: true,
				onTouchMove: function (swiper) {
					var img_name = $(".swiper-container1 .swiper-wrapper").find(".swiper-slide-active div img").attr("name");
					console.log(img_name);
					$("#gray_alpha span").html(img_name);
				}
			});
	}
	var updateSkillInfo = function (index) {
		//根据传入索引及jsondata，加载技能相关
		//暂无，模拟数据
		var skill = jsondata.skillList[index];
		skillid = skill.serviceId;
		//技能背景图
		var back_image_src = skill.resourceList[0].resourceUrl
			 + '?x-oss-process=image/resize,m_fill,w_800,h_450,limit_0';
		$("#back_image>img").attr("src", back_image_src);
		//技能证书加载
		swiperImg.removeAllSlides();
		var certificate_array = skill.certList;
		var len = certificate_array.length;
		if (len != 0) {
			$('.swiper-container1').show();
			for (var i = 0; i < len; i++) {
				str = '<div class="swiper-slide"><div class="title" align="center"><img class="img-responsive" src="'
					+certificate_array[i].certUrl +
					'" name="' + certificate_array[i].certName + '"/><div class="gray_alpha">' + certificate_array[i].certName + '</div></div></div>';
				swiperImg.appendSlide(str);
			}
			swiperImg.slideTo(0);
		} else {
			$('.swiper-container1').hide();
		}
		//技能信息加载
		$('#service1').html(skill.servicePrice + "元/" + skill.serviceUnit);

		$('#service_score img').remove();
		var star = skill.startLevel;
		var whole_star = parseInt(star);
		var half_star = Math.round(star) - parseInt(star);
		var none_star = 5 - whole_star - half_star;
		for (var i = 0; i < whole_star; i++) {
			$('#service_score').append('<img src="images/yipingjia@2x.png" />');
		}
		if (half_star != 0)
			$('#service_score').append('<img src="images/bangexing.png" />');
		for (var j = 0; j < none_star; j++) {
			$('#service_score').append('<img src="images/pingjia@2x.png" />');
		}

		$('#service2').html(skill.orderNumber + "次");
		$('#service3').html(skill.collection + "次");
		var timestr = '';
		var times = skill.serviceTime.split(',');
		$.each(times, function (index, value) {
			switch (value) {
			case '1':
				timestr += '周一至周日 ';
				break;
			case '2':
				timestr += '非周末 ';
				break;
			case '3':
				timestr += '只周末 ';
				break;
			case '4':
				timestr += '全天 ';
				break;
			case '5':
				timestr += '只白天 ';
				break;
			case '6':
				timestr += '只晚上 ';
			}
		});
		$('#service4').html(timestr);

		var servicemodal = '';
		var servicesmodals = skill.serviceMode.split(',');
		$('#service_range').html('');
		$('#service_address').html('');
		$('range_div').hide();
		$('address_div').hide();
		$.each(servicesmodals, function (index, value) {
			switch (value) {
			case '1':
				servicemodal += '可上门服务 ';
				$('#service_range').html(skill.serviceRange);
				$('range_div').show();
				break;
			case '2':
				servicemodal += '可到店服务 ';
				$('#service_address').html(skill.serviceAddress);
				$('address_div').show();
				break;
			case '3':
				servicemodal += '可线上服务 ';
				break;
			}
		});
		$('#service5').html(servicemodal);

		$('#service8').html(skill.serviceComment);
		$('#service9').html(skill.characteristic);
		$('#comment_num').html('0');
		$('#commentlist').empty();
		now_page = 1;
		$('.dropload-down').remove();
		handleDropload();
		dropload.manualload('up');
	}

	var updateHeadInfo = function () {
		//从jsondata中获取头部数
		//暂无，模拟数据


		//头像
		var touxiang_src = jsondata.userPic + '?x-oss-process=image/resize,m_fill,w_300,h_300,limit_0';
		$("#touxiang>img").attr("src", touxiang_src);

		//用户名字
		var username = jsondata.userName;
		$("#user_name>div>span").html(username);

		//用户性别
		var user_sex;
		if (jsondata.userSex == '男') {
			user_sex = "images/nan.png";
		} else {
			user_sex = "images/nv@2x.png";
		}
		$("#user_name>div>img").attr("src", user_sex);

		if (browers == "android.sc") {
			//$('#testtext').html("in android's setUserInfo:" + jsondata.userName+jsondata.userSex+jsondata.userPic);
			window.jsObj.setUserInfo(jsondata.userName, jsondata.userSex, jsondata.userPic);
		} else if (browers == "ios.sc") {
			setUserInfo(jsondata.userName, jsondata.userSex, jsondata.userPic);
		}

		//用户技能类别
		var skills = jsondata.skillList;
		swiperType.removeAllSlides();
		var skillid = GetQueryString('skillid');
		var skillindex = 0;
		for (var i = 0, len = skills.length; i < len; i++) {
			if (skills[i].serviceId == skillid) {
				str = '<div class="swiper-slide"><div class="title slide-active">'
					+skills[i].serviceName +
					'</div></div>';
				skillindex = i;
			} else
				str = '<div class="swiper-slide"><div class="title">'
					+skills[i].serviceName +
					'</div></div>';
			swiperType.appendSlide(str);
		}

		if (skills.length != 0) {
			$('#skills').show();
			$('.infofooter').show();
			$('#none_skill').hide();
			swiperType.slideTo(skillindex);
			updateSkillInfo(skillindex); //初始加载第1个技能

			if (browers == "android.sc") {
				//$('#testtext').append("in android's changeSkill:" + jsondata.skillList[skillindex].serviceId+jsondata.skillList[skillindex].serviceName+jsondata.skillList[skillindex].categoryId);
				window.jsObj.changeSkill(jsondata.skillList[skillindex].serviceId, jsondata.skillList[skillindex].serviceName, jsondata.skillList[skillindex].categoryId,jsondata.skillList[skillindex].serviceMode);
			} else if (browers == "ios.sc") {
				changeSkill(jsondata.skillList[skillindex].serviceId, jsondata.skillList[skillindex].serviceName, jsondata.skillList[skillindex].categoryId,jsondata.skillList[skillindex].serviceMode);
			}
		} else {
			//此用户无技能
			$('#skills').hide();
			$('.infofooter').hide();
			$('#none_skill').show();

		}

	}
	var ajaxquery = function () {
		//ajax请求
		//暂无，模拟数据
		//jsondata=json;

		$.ajax({
			type: 'POST',
			url: '/zxcity_restful/ws/rest',
			data: {
				'cmd': 'newservice/getUserSkillDetailInfo',
				'data': "{'userId':" + userid + "}",
				'version': 1
			},
			dataType: 'json',
			success: function (data) {
				if (data.code == 1) {
					jsondata = data.data;
					if (browers == "android.sc") {
						window.jsObj.merchantInfo(data.isMerchant,data.shopId);
					} else if (browers == "ios.sc") {
						merchantInfo(data.isMerchant,data.shopId);
					}
					updateHeadInfo(); //加载头部数据
				} else {
					if (browers == "android.sc") {
						window.jsObj.htmlError("personinfo:code is " + data.code + " and msg is " + data.msg);
					} else if (browers == "ios.sc") {
						htmlError("personinfo:code is " + data.code + " and msg is " + data.msg);
					}
				}
			},
			error: function (xhr, type) {
				if (browers == "android.sc") {
					window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
				} else if (browers == "ios.sc") {
					htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
				}
				console.log('请求失败！请检查网络连接');
			}
		});

	}

	var handleDropload = function () {
		dropload = $("#resetcomment").dropload({
				scrollArea: window, //滑屏范围
				distance: 50, //拉动距离
				domDown: {
					domClass: 'dropload-down',
					domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
					domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
					domNoData: '<div class="dropload-noData">暂无数据</div>'
				},
				loadDownFn: function (me) { //上拉函数
					$.ajax({
						type: 'POST',
						url: '/zxcity_restful/ws/rest',
						data: {
							'cmd': 'newservice/getCommentList',
							'data': "{'userId':" + userid + ",'serviceId':" + skillid + ",'pagination':{'page':" + now_page + ",'rows':5}}",
							'version': 3
						},
						dataType: 'json',
						success: function (data) {
							if (data.code != 1) {
								$('#comment_num').html('0');
								me.noData(true);
								me.resetload();
								return;
							}
							$('#comment_num').html(data.total);
							var tmpstr = '';
							for (var i = 0; i < data.data.length; i++) {
								tmpstr += '  <div class="comment_detail">' +
								'	<div class="row">' +
								'		  <div class="col-xs-3">' +
								'				<img class="round_image" src="' +
								data.data[i].userImgUrl +
								'?x-oss-process=image/resize,m_fill,w_300,h_300,limit_0" />' +
								'			  </div>' +
								'			  <div class="col-xs-9 date1">' +
								'				<div class="row">' +
								'				<div class="col-xs-6" style="padding-left:0px">' +
								'				<b>' + data.data[i].userName + '</b>&nbsp;' +
								'				<img src="images/nv@2x.png" />' +
								'               </div>' +
								'			  <div class="col-xs-6 star_core">';
								var star = data.data[i].startLevel;
								var whole_star = parseInt(star);
								var half_star = Math.round(star) - parseInt(star);
								var none_star = 5 - whole_star - half_star;
								for (var j = 0; j < whole_star; j++) {
									tmpstr += '<img src="images/yipingjia@2x.png" />';
								}
								if (half_star != 0)
									tmpstr += '<img src="images/bangexing.png" />';
								for (var k = 0; k < none_star; k++) {
									tmpstr += '<img src="images/pingjia@2x.png" />';
								}
								tmpstr +=
								'			  </div>' +
								'				</div>' +
								'				<div class="row">' +
								'				<span style="display:block;padding-top:0.6rem;">' + data.data[i].commentTime + '</span></b>' +
								'				</div>' +

								'			  </div>' +

								'			</div>' +
								'			<div class="row">' +
								'			  <div class="col-xs-3"></div>' +
								'			  <div class="col-xs-9 text_p">' +
								data.data[i].content +
								'			 </div>' +
								'			</div>' +
								'		  </div>';

							};
							$('#commentlist').append(tmpstr);
							now_page++;
							if (now_page * 5 > data.total)
								me.noData(true);
							me.resetload();
						},
						error: function (xhr, type) {
							if (browers == "android.sc") {
								window.jsObj.htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
							} else if (browers == "ios.sc") {
								htmlError("personinfo:ajax error is " + xhr.status + " / " + xhr.statusText);
							}
							// 即使加载出错，也得重置
							me.resetload();
						}
					});
				}
			});

	}

	return {
		//main function to initiate the module
		init: function () {
			browers = GetBrower();
			userid = GetQueryString("userid");
			initSwipers();
			//handleDropload();
			ajaxquery();

		}

	};
}
();