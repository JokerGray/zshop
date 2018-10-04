var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码

$(function() {
	//		封装了一个上传图片的对象,并且new了一个新的对象来运行
	//	function FileupLoad() {
	//		this.init();
	//	}
	//	FileupLoad.prototype.init = function() {
	//		var input = document.getElementsByClassName(".file_input")[0];
	//		var getOnloadFunc = function(aImg) {
	//			return function(evt) {
	//				aImg.src = evt.target.result;
	//			};
	//		}
	//		$("input[type=file]").change(function(evt) {
	//			for (var i = 0, numFiles = this.files.length; i < numFiles; i++) {
	//				var file = this.files[i];
	//				var imageType = /image.*/;
	//				if (!file.type.match(imageType)) {
	//					continue;
	//				}
	//				$(this).next().empty();
	//				var img = document.createElement("img");
	//				$(this).next().append(img);
	//				$(img).css("width", 346);
	//				$(img).css("height", 210);
	//				$(img).attr("class", "img-rounded");
	//				var reader = new FileReader();
	//				reader.onload = getOnloadFunc(img);
	//				reader.readAsDataURL(file);
	//			}
	//		});
	//	}
	//	var fileObj = new FileupLoad();
	//		年月日对象
		var tomorrow = new Date();
		tomorrow.setTime(tomorrow.getTime()+24*60*60*1000);
		var tomYear=tomorrow.getFullYear(),
			tomMon=tomorrow.getMonth()+1,
			tomDay=tomorrow.getDate();
	  new YMDselect('year1','month1','day1',tomYear,tomMon,tomDay);
		$("#distpicker").distpicker({
		  province: "湖北省",
		  city: "武汉市",
		  district: "武昌区"
		});
	//	日历插件的js文件
	function Datetime() {
		$('.form_datetime').datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			todayBtn: 1,
			clearBtn:1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			showMeridian: 1
		});
		$('.form_date').datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			todayBtn: 1,
			clearBtn:1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0
		});
		$('.form_time').datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			todayBtn: 1,
			clearBtn:1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 1,
			minView: 0,
			maxView: 1,
			forceParse: 0
		});
	}
	var datetime = new Datetime();
	//input radio样式美化
	function RadioType() {
		$("input[type=radio]").on("click", function() {
			$(this).parent().siblings().removeClass("radio-active");
			$(this).parent().addClass("radio-active");
		});
		//下拉按钮的下拉回填数据
		$(".dropdown-menu>li").on("click", function() {
			var texts = $(this).children().text();
			$("#alls-button").text(texts);
		});
	}
	var radioType = new RadioType();

	//展示栏大小跟随变动
	function Resizes() {
		this.init();
	}
	Resizes.prototype.init = function() {
		resizeBox();
		$(window).resize(function() {
			resizeBox();
		});

		function resizeBox() {
			var contentBoxWid = $(".content_box").width();
			$(".content_box").height(contentBoxWid);
			var boxWid = $(".two-column>div>div").width();
			$(".two-column>div>div").height(boxWid * 0.633);
		}
	}

	function Showcontent() {
		this.apikey = sessionStorage.getItem('apikey') || "test";
		this.version = sessionStorage.getItem('version') || "1";
		this.init();
	}
	Showcontent.prototype = {
		init: function() {
			this.getParams();
			this.getContentList();
		},
		/**
		 * @method 获取地址栏参数
		 * @param {Object} obj :获取数据的参数
		 * @param {function} cb:回调函数
		 */
		getParams: function() {
			var url = location.search;
			var params = new Object();
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				var strs = str.split("&");
				for (var i = 0; i < strs.length; i++) {
					params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
				}
			}
			this.params = params;
		},
		getContentList: function() {
			var that = this;
			console.log(this.params);
			if(that.params.qx1==="false"){
				$(".btn-navlist>.navbtn1").remove();
				$(".btn-navlist>.navbtn2").remove();
				$(".btn-navlist>.navbtn3").remove();				
			}
			if(that.params.qx2==="false"){
				$(".btn-navlist>.navbtn4").remove();				
			}
			//	拿到所有的导航按钮并改变样式
			var navbtn = $(".btn-navlist>button");


			that.navbtnClasschange(navbtn);
			var searchbtn = $(".btn-sear");
			searchbtn.on("click", function() {
				$(".nav_left").empty();
				$(".show_apply").hide();
				$("#personalInfo").hide();
				$("#applyChart").hide();
				var status = $(".btn-navlist>.btn-active").index() + 1;
				console.log("当前选中状态："+status);
				var readtext = $("#alls-button").text();
				var readstatus = -1;
				if (readtext == "全部") {
					readstatus = -1;
				} else if (readtext == "已读") {
					readstatus = 1;
				} else if (readtext == "未读") {
					readstatus = 0;
				}
				var topdate = $("#topdate").val();
				if(status==1||status==2||status==3){
					that.getLeftList(status, topdate, readstatus);
				}else if(status==4){
					console.log(topdate);
					that.getLeftList2(topdate);					
				}
			});
			$(".navbtn1").on("click", function() {
				var qx3=that.params.qx3;
				if(qx3==="true"){
					showRightDelete();
				}else{
					hideRightDelete();
				}
				$(".nav_left").empty();
				$(".show_apply").hide();
				$("#personalInfo").hide();
				$("#applyChart").hide();
				that.getLeftList(1, "", -1);
			});
			$(".navbtn2").on("click", function() {
				var qx3=that.params.qx3;
				if(qx3==="true"){
					showRightDelete();
				}else{
					hideRightDelete();
				}
				$(".nav_left").empty();
				$(".show_apply").hide();
				$("#personalInfo").hide();
				$("#applyChart").hide();
				that.getLeftList(2, "", -1);
			});
			$(".navbtn3").on("click", function() {
				var qx3=that.params.qx3;
				if(qx3==="true"){
					showRightDelete();
				}else{
					hideRightDelete();
				}
				$(".nav_left").empty();
				$(".show_apply").hide();
				$("#personalInfo").hide();
				$("#applyChart").hide();
				that.getLeftList(3, "", -1);
			});
			$(".navbtn4").on("click", function() {
				hideRightDelete();
				$(".nav_left").empty();
				$(".show_apply").hide();
				$("#personalInfo").hide();
				$("#applyChart").hide();
				that.getLeftList2();
			});
			// 根据权限判断来初始化点击哪个按钮
			if(that.params.qx1==="false"){
				$(".navbtn4").trigger("click");				
			}else{
				$(".navbtn1").trigger("click");
			}			
		},
		//		点击时出现样式更改
		navbtnClasschange: function($btnChange) {
			var that = this;
			$btnChange[0] && $btnChange.on("click", function() {
				$(this).siblings().removeClass("btn-active");
				$(this).siblings().addClass("btn-default");
				$(this).removeClass("btn-default");
				$(this).addClass("btn-active");
			});
		},
		//		展示左侧栏接口函数
		getLeftList: function(status, day, read) {
			var that = this;
			var cmd = "game/showLeft";
			var version = that.version;
			var datas = {
				"shopId": Number(that.params.shopId),
				"type": Number(that.params.type),
				"status": status,
				"day": day,
				"read": read
			}
			console.log(datas);
			var data = JSON.stringify(datas);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",

				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					layer.load(0,{
						shade:[0.3,"#000"]
					});
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					layer.closeAll("loading");
					$("#kongbai").remove();
					$(".nav_left").show();
					console.log(re);
					console.log(re.data.begLogList.length);
					var liLength = re.data.begLogList.length;
					if (liLength == 0) {
						showKong();
					}

					var html = template('leftList', re);
					document.getElementById("nav_left").innerHTML = html;

					$(".nav_info").on("click", function() {
						$(this).siblings().removeClass("choosed");
						$(this).addClass("choosed");
						$(this).children(".apply_point").hide();
						var begId = $(this).attr("begId"),
							userId = $(this).attr("userId"),
							liType;
						if ($(this).hasClass("applyNoRead")) {
							liType = 0;
						} else if ($(this).hasClass("applied")) {
							liType = 1;
						} else if ($(this).hasClass("review")) {
							liType = 2;
						} else if ($(this).hasClass("confirm")) {
							liType = 3;
						} else if ($(this).hasClass("confirmed")) {
							liType = 4;
						}

						console.log("leftlitype:" + liType);
						that.showRight(begId, userId, liType);
						//						console.log($(".nav_info").length);
					});

					$(".nav_info").eq(0).trigger("click");
				},
				error: function(re) {
					layer.closeAll("loading");
					console.log(re);
				}
			});
		},
		getLeftList2: function(topdate) {
			console.log(topdate);
			var that = this;
			var cmd = "game/showRenZheng";
			var version = that.version;
			var datas = {
				"shopId": Number(that.params.shopId),
				"type": Number(that.params.type),
				"day":topdate
			}
			console.log(datas);
			var data = JSON.stringify(datas);		
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",

				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
					layer.load(0,{
						shade:[0.3,"#000"]
					});
				},
				success: function(re) {
					layer.closeAll("loading");
					$("#kongbai").remove();
					$(".nav_left").show();
					console.log(re);
					var liLength = re.data.attestationUsers.length;
					if (liLength == 0) {
						showKong();
					}


					var html = template('leftList2', re);
					document.getElementById("nav_left").innerHTML = html;

					$(".nav_info").on("click", function() {
						$(".nav_info").removeClass("choosed");
						$(this).addClass("choosed");
						$(".show_apply").hide();
						$("#personalInfo").hide();
						$("#applyChart").show();

						var userId = $(".nav_infoList").children(".choosed").attr("userId"),
							shopId = that.params.shopId,
							type = that.params.type;
						//						右侧页面展示表格
						that.showRight2(userId, shopId, type);

					});

					$(".nav_info").eq(0).trigger("click");
				},
				error: function(re) {
					layer.closeAll("loading");
					console.log(re);
				}
			});
		},
		//		展示右侧个人信息栏
		showRight: function(begId, userId, liType) {
			var that = this;
			console.log("runliType" + liType);
			var cmd = "game/showRight",
				version = that.version,
				datas = {
					"begId": Number(begId),
					"userId": Number(userId),
					"status": Number(liType)
				};
			var data = JSON.stringify(datas);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					console.log(re);
					switch (liType) {
						case 0:
							$(".show_apply").hide();
							$("#personalInfo").show();
							var html = template('personalInfoList', re);
							document.getElementById("personalInfo").innerHTML = html;
							var resize = new Resizes();
							that.sliderImg();
							//							邀约信息填写
							$("#sendYaoyue").on("click", function() {
								that.yaoyueForm();
							});
							break;
						case 1:
							$("#personalInfo").hide();
							$(".show_apply").show();
							console.log(re);
//							查看主脸或主播，判断是否有默认信息
							if(re.data.identification){
								var html = template('applyForm1', re);
								document.getElementById("showapplyForm").innerHTML = html;
								var datetime = new Datetime();
								var radioType = new RadioType();
								//							发送申请按钮
								var uploadbtn1 = $("#idcardbtn1");
								var uploadbtn2 = $("#idcardbtn2");
								runupload(uploadbtn1);
								runupload(uploadbtn2);
								$("#sendApply").on("click", function() {
									that.sendApply(1);
								});
								break;								
							}else{
								var html = template('applyForm', re);							
								document.getElementById("showapplyForm").innerHTML = html;
								var datetime = new Datetime();
								var radioType = new RadioType();
								//							发送申请按钮
								var uploadbtn1 = $("#idcardbtn1");
								var uploadbtn2 = $("#idcardbtn2");
								runupload(uploadbtn1);
								runupload(uploadbtn2);
								$("#sendApply").on("click", function() {
									that.sendApply(0);
								});
								break;
							}

						case 2:
							$("#personalInfo").hide();
							$(".show_apply").show();
							console.log(re);
							var html = template('applyFormFix', re);
							document.getElementById("showapplyForm").innerHTML = html;
							break;
						case 3:
							$("#personalInfo").hide();
							$(".show_apply").show();
							console.log(re);
							var html = template('applyFormFix', re);
							document.getElementById("showapplyForm").innerHTML = html;
							$("#ensureBtn").on("click", function() {
								var status = $(this).attr("status");
								that.affirmResult(status);
							});
							break;
						case 4:
							$("#personalInfo").hide();
							$(".show_apply").show();
							console.log(re);
							var html = template('applyFormHalfFix', re);
							document.getElementById("showapplyForm").innerHTML = html;
							var datetime = new Datetime();
							var radioType = new RadioType();
							var uploadbtn3 = $("#idcardbtn3"),
								uploadbtn4 = $("#idcardbtn4");
							runupload(uploadbtn3);
							runupload(uploadbtn4);
							$("#reApply").on("click", function() {
								that.sendApply(1);
							});
							break;
					}
				},
				error: function(re) {
					console.log(re);
				}
			});
		},
		sliderImg: function() {
			var sliderIndex = 1;
			this.showImg(sliderIndex);
		},
		showImg: function(nowindex) {
			$(".carousel-inner>div").removeClass("active");
			$(".carousel-inner>div").eq(nowindex - 1).addClass("active");
			$(".carousel-indicators>li").removeClass("active");
			$(".carousel-indicators>li").eq(nowindex - 1).addClass("active");
		},
		yaoyueForm: function() {
			var that = this;
			//			判断用户填写的信息是否完整
			var contentFlag = true;
			var year = $("#applyYear").val(),
				month = $("#applyMonth").val(),
				day = $("#applyDay").val(),
				time = $("#applyTime").val(),
				userId = $(".nav_infoList").find(".choosed").attr("userid");
			var myApplyTime = year + "-" + month + "-" + day + " " + time;
			console.log(myApplyTime);
			var province = $("#province1").val(),
				city = $("#city1").val(),
				district = $("#district1").val(),
				addressDetail = $("#address_detail").val();
			console.log("注意判断：");
			console.log(province=="");
			var myAddress = province + city + district + addressDetail;
			console.log(addressDetail == "");
			console.log(myAddress);
			var myComment = $("#applyComment").val();
			contentFlag = year == 0 || month == 0 || day == 0 || time == 0 ||province==""||city==""||district=="" ||addressDetail == "" || myComment == "";
			var begId = $(".nav_infoList").find(".choosed").attr("begid");
			var datas = {
				"userId": Number(userId),
				"begId": Number(begId),
				"comment": myComment,
				"site": myAddress,
				"time": myApplyTime
			};
			var data = JSON.stringify(datas);
			console.log(data);
			var cmd = "game/sendYaoyue",
				version = that.version;
			if (contentFlag) {
				layer.msg("请填写完整信息喔！")
			} else {
				$.ajax({
					type: "POST",
					url: "/zxcity_restful/ws/rest",
					dataType: "json",
					data: {
						"cmd": cmd,
						"data": data,
						"version": version
					},
					beforeSend: function(request) {
						request.setRequestHeader("apikey", apikey);
					},
					success: function(re) {
						console.log(re);
						layer.msg(re.msg);
						$(".modal-content").children(".close").trigger("click");
						setTimeout(function() {
							window.location.reload();
							$(".btn-navlist").children(".btn-active").trigger("click");
						}, 2000);
					},
					error: function(re) {
						console.log(re.msg);
						layer.msg(re.msg);
					}
				});
			}
		},
		//		发送申请按钮
		sendApply: function(ifreapply) {
			var that = this;
			var imgsArr = [];
			//			判断信息是否完整
			var datasFlag = 1;
			console.log("发送申请");

			var datas = {
				begId: Number($(".nav_infoList").find(".choosed").attr("begid")),
				userId: Number($(".nav_infoList").find(".choosed").attr("userid")),
				name: $("#formUserName1").val(),
				sex: $("input[name='sex']:checked").val(),
				hobby: $("#formUserHobby1").val(),
				profession: $("#formUserProfession1").val(),
				birth: $("#formUserBirth1").val(),
				maritalStatus: $("input[name='marry']:checked").val()
			}
			var imghidden1 = $(".typehidden1"),
				imghidden2 = $(".typehidden2");
			if (!ifreapply) {
				var imgurl1 = imghidden1.attr("imgsrcs"),
					imgurl2 = imghidden2.attr("imgsrcs");
			} else {
				var imgurl1 = imghidden1.attr("imgsrcs") || $($(".idcardback")[0]).children("img").attr("src"),
					imgurl2 = imghidden2.attr("imgsrcs") || $($(".idcardback")[1]).children("img").attr("src");
			}
			console.log(imgurl1 == "");
			datas.frontUrl = imgurl1;
			datas.contraryUrl = imgurl2;

			console.log(datas);
			for (var p in datas) {
				if (datas[p] == "") {
					datasFlag = 0;
					layer.msg("请上传完整信息！");
				}
			}
			console.log(datasFlag);
			if (datasFlag == 1) {
				var data = JSON.stringify(datas);
				var cmd = "game/sendIdentification";
				var version = that.version;
				$.ajax({
					type: "POST",
					url: "/zxcity_restful/ws/rest",
					dataType: "json",
					data: {
						"cmd": cmd,
						"data": data,
						"version": version
					},
					beforeSend: function(request) {
						request.setRequestHeader("apikey", apikey);
					},
					success: function(re) {
						console.log(re);
						if (ifreapply) {
							$("#sorryNopass").html("  ");
						}
						layer.msg(re.msg);
						setTimeout(function() {
							$(".btn-navlist").children(".btn-active").trigger("click");
						}, 2000)
					},
					error: function(re) {
						console.log(re);
						layer.msg(re.msg);
					}
				});
			}

		},
		affirmResult: function(status) {
			var that = this;
			var begId = $(".nav_infoList").find(".choosed").attr("begid"),
				userId = $(".nav_infoList").find(".choosed").attr("userid"),
				status = status,
				shopId = that.params.shopId,
				type = that.params.type;
			var datas = {
				"begId": Number(begId),
				"userId": Number(userId),
				"status": Number(status),
				"shopId": Number(shopId),
				"type": Number(type)
			};
			var data = JSON.stringify(datas);
			var cmd = "game/affirmResult";
			var version = that.version;
			console.log(datas);

			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					console.log(re);
					layer.msg(re.msg);
					setTimeout(function() {
						$(".btn-navlist").children(".btn-active").trigger("click");
					}, 2000);
				},
				error: function(re) {
					console.log(re);
					layer.msg(re.msg);
				}
			});
		},
		//		个人收入表格
		incomeChart: function(dataXArr, dataArr, yMax) {
			var myChart = echarts.init(document.getElementById('income'));

			option = {
				tooltip:{
					trigger:'axis',
					formatter:"收益：{c}只"
				},
				title: {
					text: '个人收益趋势',
					padding: [20, 70],
					subtext: '',
					textStyle: {
						fontSize: 18,
						fontWeight: '200'
					}
				},
				xAxis: {
					type:"category",
					data: dataXArr,
					boundaryGap:['20%','20%'],
					axisLabel: {
						interval: 0,
						textStyle: {
							color: '#999'
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					},
					z: 10
				},
				yAxis: {
					type:"value",
					boundaryGap:['20%','20%'],
					min:0,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						textStyle: {
							color: '#999'
						}
					}
				},
				dataZoom: [{
					type: 'inside'
				}],
				series: [{
					type: 'bar',
					barWidth:22,
					data:dataArr,
					itemStyle: {
						normal: {
							barBorderRadius: [30, 30, 0, 0],
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1, [{
									offset: 0.1,
									color: '#2ed9cd'
								}, {
									offset: 0.5,
									color: '#34c6d9'
								}, {
									offset: 1,
									color: '#38b8e2'
								}]
							)
						},
						emphasis: {
							barBorderRadius: [30, 30, 0, 0],
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1, [{
									offset: 0,
									color: '#2378f7'
								}, {
									offset: 0.7,
									color: '#2378f7'
								}, {
									offset: 1,
									color: '#83bff6'
								}]
							)
						}
					}
				}]
			};
			// Enable data zoom when user click bar.
			var zoomSize = 6;
			myChart.on('click', function(params) {
				console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
				myChart.dispatchAction({
					type: 'dataZoom',
					startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
					endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
				});
			});

			myChart.setOption(option);
			window.addEventListener("resize",function(){
				setTimeout(function(){
					myChart.resize();
				},200)
			});			
		},
		RankChart: function(ranknum, rankingNowDay) {
			var myChart = echarts.init(document.getElementById('ranking'));
			var labelFromatter = {
				normal: {
					label: {
						formatter: function(params) {},
						textStyle: {
							baseline: 'bottom'
						}
					}
				}
			}
			var labelBottom = {
				normal: {
					color: '#b0b0b0',
					label: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: 35,
							color: '#000',
						}
					},
					labelLine: {
						show: false,
					}
				}
			};
			var labelTop = {
				normal: {
					color: '#36BDDF',
					label: {
						show: true,
						position: 'center',
						formatter: '{b}',
						textStyle: {
							baseline: 'top',
							color: '#ADADAD',
							textStyle: {
								fontSize:10,
							}
						}

					},
					labelLine: {
						show: false
					}
				}
			};
			var radius = [110, 100];
			option = {
				// tooltip:{
				// 	trigger:"item",
				// 	formatter:"收益占比：{c}%"
				// },
				title: {
					text: '今日贡献排名',
					textStyle: {
						fontSize: 20,
						fontWeight: 200,
						color: '#999',
					},
					padding: [40, 40],
					subtext: rankingNowDay,
					subtextStyle: {
						fontSize: 40,
						fontWeight: 200,
						color: '#1DCFBD',
					},
					x: 'center'
				},
				series: [{
					type: 'pie',
					center: ['50%', '60%'],
					radius: radius,
//					itemStyle: labelFromatter,
					hoverAnimation:false,
					data: [{
						name: ranknum + '%',
						value:100-ranknum,
						itemStyle: labelBottom
					}, {
						name: '打败了' + ranknum + '%的主脸',
						value: ranknum,
						itemStyle: labelTop
					}]
				}]
			};
			// 为echarts对象加载数据
			myChart.setOption(option);
			window.addEventListener("resize",function(){
				setTimeout(function(){
					myChart.resize();
				},200)
			});				
		},
		rankTide: function(dataxArr, datayArr, yVal) {
			var myChart = echarts.init(document.getElementById('rankingtide'));
			var dataAxis = dataxArr;
			var dataYxis = datayArr;
			var dataranking = yVal;
			var maxN = eval("Math.max(" + dataranking.join() + ")");
			if(maxN<4){maxN=4}
			var option = {
				title: {
					text: '个人历史排名趋势',
					padding: [25, 86],
					textStyle: {
						fontSize: 18,
						fontWeight: 200,

					}
				},
				tooltip:{
					trigger:"axis",
					formatter:"排名：{c}"
				},
				xAxis: {
					type: 'category',
					data: dataAxis,
					axisLabel: {
						textStyle: {
							color: '#999'
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#eee'
						}
					},

				},
				yAxis: {
					type: 'value',
					// data: dataYxis,
					inverse:true,
					splitNumber:4,
					min:1,
					max:maxN,
					minInterval:1,
					boundaryGap:["20%","20%"],
					axisLabel: {
						textStyle: {
							color: '#999'
						},
						formatter:"第{value}名"
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#eee'
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: '#eee'
						}
					},

				},
				series: [{
					type: 'line',
					data: dataranking,
					symbolSize: 5,
					itemStyle: {
						normal: {
							color: '#2ed9cd',
							label: {
								show: false,
							},
							lineStyle: {
								normal: {
									width: 50,
									color: '#2ed9cd'
								}

							},
						}
					},
					formatter:"{c}"

				}]

			}
			myChart.setOption(option);
			window.addEventListener("resize",function(){
				setTimeout(function(){
					myChart.resize();
				},200)
			});				
		},
		showRight2: function(userId, shopId, type) {
			var that = this,
				cmd = "game/showRZDetails",
				datas = {
					"userId": Number(userId),
					"shopId": Number(shopId),
					"type": Number(type)
				},
				version = that.version;
			var data = JSON.stringify(datas);

			console.log(userId + ":" + shopId + ":" + type);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					console.log("右侧成功展示");
					console.log(re);
					var html = template('showCharts', re);
					document.getElementById("applyChart").innerHTML = html;
					console.log(datas);
					var percentum = re.data.percentum,
						rankingNowDay = re.data.rankingNowDay;
					that.RankChart(percentum, rankingNowDay);
					var month1btn=$("#month1"),
						week1btn=$("#week1"),					
						day1btn=$("#day1"),					
						month2btn=$("#month2"),
						week2btn=$("#week2"),
						day2btn=$("#day2");
					that.navbtnClasschange(month1btn);
					that.navbtnClasschange(week1btn);
					that.navbtnClasschange(day1btn);
					that.navbtnClasschange(month2btn);					
					that.navbtnClasschange(week2btn);					
					that.navbtnClasschange(day2btn);					

					$("#month1").on("click", function() {
						that.requestIncomechart(datas, 1)
					});
					$("#week1").on("click", function() {
						that.requestIncomechart(datas, 2)
					});
					$("#day1").on("click", function() {
						that.requestIncomechart(datas, 3)
					});
					$("#day1").trigger("click");
					that.requestTidechart(datas, 3);
					$("#month2").on("click", function() {
						that.requestTidechart(datas, 1)
					});
					$("#week2").on("click", function() {
						that.requestTidechart(datas, 2)
					});
					$("#day2").on("click", function() {
						that.requestTidechart(datas, 3)
					});
					$("#day2").trigger("click");
				},
				error: function(re) {
					console.log(re);
				}
			});
		},
		requestIncomechart: function(datas, num) {
			var that = this,
				cmd = "game/showRZDetails2",
				version = that.version;
			datas.num = num;
			console.log(datas);
			var data = JSON.stringify(datas);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					console.log(re);
					if (num == 1) {
						var earningObj = {
							x: re.data.dateTime,
							y: re.data.earnings,
							yMax: re.data.max
						};
						that.incomeChart(earningObj.x, earningObj.y, earningObj.yMax);
					} else if (num == 2) {
						var earningObj = {
							x: re.data.dateTime,
							y: re.data.earnings,
							yMax: re.data.max
						};
						that.incomeChart(earningObj.x, earningObj.y, earningObj.yMax);
					} else if (num == 3) {
						var earningObj = {
							x: re.data.dateTime,
							y: re.data.earnings,
							yMax: re.data.max
						};
						that.incomeChart(earningObj.x, earningObj.y, earningObj.yMax);
					}
				},
				error: function(re) {
					console.log(re);
				}
			});
		},
		requestTidechart: function(datas, num) {
			var that = this,
				cmd = "game/showRZDetails3",
				version = that.version;
			datas.num = num;
			console.log(datas);
			var data = JSON.stringify(datas);
			$.ajax({
				type: "POST",
				url: "/zxcity_restful/ws/rest",
				dataType: "json",
				data: {
					"cmd": cmd,
					"data": data,
					"version": version
				},
				beforeSend: function(request) {
					request.setRequestHeader("apikey", apikey);
				},
				success: function(re) {
					console.log(re);
					if (num == 1) {
						var tideObj = {
							x: re.data.dateTime,
							y: re.data.number,
							yMax: re.data.rankings
						};
						that.rankTide(tideObj.x, tideObj.y, tideObj.yMax);
					} else if (num == 2) {
						var tideObj = {
							x:  re.data.dateTime,
							y: re.data.number,
							yMax: re.data.rankings
						};
						that.rankTide(tideObj.x, tideObj.y, tideObj.yMax);
					} else if (num == 3) {
						var tideObj = {
							x: re.data.dateTime,
							y: re.data.number,
							yMax: re.data.rankings
						};
						that.rankTide(tideObj.x, tideObj.y, tideObj.yMax);
					}
				},
				error: function(re) {
					console.log(re);
				}
			});
		}

	}
	var newcontent = new Showcontent();

	function DeleteUser() {
		this.version = sessionStorage.getItem('version') || "1";
		this.init();
	}
	DeleteUser.prototype = {
		init: function() {
			var that = this;
			$("#deleteBtn").on("click", function() {
				var liLength = $(".nav_infoList").children("li").length;
				if (liLength == 0) {
					showKong();
				}
				var begId = $(".nav_infoList").find(".choosed").attr("begid");
				var datas = {
					"begId": Number(begId)
				};
				var data = JSON.stringify(datas);
				var cmd = "game/deleteApply",
					version = that.version;
				layer.confirm("您确认删除选中内容嘛？", {
					btn: ["确认", "取消"],
					title: ["删除"]
				}, function() {
					$.ajax({
						type: "POST",
						url: "/zxcity_restful/ws/rest",
						dataType: "json",
						data: {
							"cmd": cmd,
							"data": data,
							"version": version
						},
						beforeSend: function(request) {
							request.setRequestHeader("apikey", apikey);
						},
						success: function(re) {
							console.log(re);
							layer.msg("删除成功！", {
								time: 2000
							});
							$(".nav_infoList").find(".choosed").remove();
							var liLength = $(".nav_infoList").children("li").length;
							$(".nav_info").eq(0).trigger("click");
						},
						error: function(re) {
							console.log(re);
						}
					});

				}, function() {
					layer.close();
				});

			})
		}
	}
	var deletes = new DeleteUser();

	function showKong() {
		$(".nav_left").hide();
		$(".apply_content").hide();
		$(".show_apply").hide();
		$(".apply_form").hide();
		$("body").append("<div id='kongbai'><img src='img/nodata.png'/></div>");
	}
//右侧显示栏显示隐藏或清空
	function showRightDelete() {
		$("#alls-button").text("全部");
		$("#topdate").val("");
		$(".btn-delete").show();
		$(".btn-searchs").show();
		$(".btn-alls").show();
	}

	function hideRightDelete() {
		$("#alls-button").text("全部");
		$("#topdate").val("");		
		$(".btn-delete").hide();
		$(".btn-alls").hide();
	}



});