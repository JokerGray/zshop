(function($) {
	var page = 1;
	var rows = 8;
	var userno = yyCache.get("userno") || "";
	var locked = true;
	var USER_URL = {
		RESOURCE : 'operations/adRunList',//(查询广告投放)//0-待投放 1-已投放
		INPUTHISTORY : 'operations/adRunHistoryList', //查询广告机的投放历史
		QUERYADVER : 'operations/queryAdSpace' //(查询广告位宽高)
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})
	getadverSet();
	//查询广告位宽高
	function getadverSet(){
		var param = {};
		reqAjaxAsync(USER_URL.QUERYADVER, JSON.stringify(param)).done(function (res) {
			if (res.code == 1) {
				var row = res.data;
				$(".show-box .imgs").attr("data-width",row[0].width);
				$(".show-box .imgs").attr("data-height",row[0].height);
				$(".show-box .video").attr("data-width",row[1].width);
				$(".show-box .video").attr("data-height",row[1].height);
				$(".show-box .imgs").width((row[0].width/100)*60);
				$(".show-box .imgs").height((row[0].height/100)*60);
				$(".show-box .video").width((row[1].width/100)*60);
				$(".show-box .video").height((row[1].height/100)*60);
				$("#inputAd").attr("data-width",parseInt((row[0].width/100)*60+(row[1].width/100)*60)+100);
				$("#inputAd").attr("data-height",parseInt((row[0].height/100)*60)+80);
			}else{
				layer.msg(res.msg);
			}
		})
	}


		//广告初始化方法
		function advertis(res,statu){
			var sHtml = "";
			for(var i=0;i<res.data.length;i++){
				var row = res.data[i];
				var img = row.mainResUrls.split(",");
				sHtml += '<li data-id="' + row.id + '">' +
							'<div class="detail-info" data-rtype="'+ row.sideResType +'" data-ltyp="'+row.mainResType+'" data-rgturl="' + row.sideResUrls + '" data-lfurl="' + row.mainResUrls + '">' +
								'<span class="detail-name">' + row.equipmentSN + '</span>' +
								'<span class="input-statu">' + row.runStateText + '</span>' +
								'<span class="detail-area">' + row.address1 + row.address2 + row.address3 + '</span>' +
							'</div>' +
							'<div class="mainimg">'
							if(row.mainResType==1){
								if(img[0]=="" || img[0]==0){
									sHtml +='<img src="../common/img/default_img.png">';
								}else{
									sHtml +='<img src="' + img[0] + '">';
								}
							}else{
								sHtml +='<img src="../common/img/video_01.png">';
							}

				sHtml +=	'</div>'
						'</li>'
			}
			if(statu==0){
				$("#inputAd").html(sHtml);
				$("#inputAd").find("li").css({"background":"#f1f1f1","cursor":"pointer"})
			}else{
				$("#alInputAd").html(sHtml);
				$("#alInputAd").find("li").css({"background":"#fff","cursor":"pointer"})
			}

		}

		//加载广告
		function getAdver(statu,address,equipmentSN){
			var param = {
				"address" : address,
				"page": page,
				"rows": rows,
				"equipmentSN":equipmentSN,
				"sort": "t1.create_time",
				"order": "desc",
				"runState": statu //0-待投放 1-已投放
			}
			reqAjaxAsync(USER_URL.RESOURCE,JSON.stringify(param)).done(function(res){
				if(res.code==1){
					if(res.data.length>0){
						advertis(res,statu);
						$(".nodata2").hide();
						$(".addmore").show();
						$(".havedata").show();
						//分页
						layui.use('laypage', function(){
							var laypage = layui.laypage;
							if(statu==0){
								$(".common-page1").hide();
								$(".common-page").show();
								//执行一个laypage实例 （待）
								laypage.render({
									elem: 'paging-box-count' //注意，这里的 test1 是 ID，不用加 # 号
									,count: res.total //数据总数，从服务端得到
									,groups:10
									,limit:rows
									,prev:'<'
									,next:'>'
									,jump: function(obj, first){
										//首次不执行
										if(!first){
											param.page=obj.curr;
											reqAjaxAsync(USER_URL.RESOURCE,JSON.stringify(param)).done(function(res){
												if(res.code==1){
													advertis(res,statu);
												}else{
													layer.msg(res.msg);
												}
											})
										}
									}
								});

							}else{
								$(".common-page1").show();
								$(".common-page").hide();
								//执行一个laypage实例 (已)
								laypage.render({
									elem: 'paging-box-count1' //注意，这里的 test1 是 ID，不用加 # 号
									,count: res.total //数据总数，从服务端得到
									,groups:10
									,limit:rows
									,prev:'<'
									,next:'>'
									,jump: function(obj, first){
										//首次不执行
										if(!first){
											param.page=obj.curr;
											reqAjaxAsync(USER_URL.RESOURCE,JSON.stringify(param)).done(function(res){
												if(res.code==1){
													advertis(res,statu);
												}else{
													layer.msg(res.msg);
												}
											})
										}
									}
								});
							}
						});
					}else{
						$(".nodata2").show();
						$(".addmore").hide();
						$(".havedata").hide();
					}

				}else{
					layer.msg(res.msg);
				}
			})
		}

	//切换投放状态
	$(".tab-change").on("click",".tablist",function(){
		var address = $(".area-name").text();
		var equipmentSN = $.trim($("#searchName").val());
		var type = $(this).index();
		$(".tab-change .tablist").removeClass("acv");
		$(this).addClass("acv");
		$(".content-all .detail").removeClass("acv");
		$(".content-all .detail").eq(type).addClass("acv");
		getAdver(type,address,equipmentSN);
	});

	//搜索
	$("#search").click(function(){
		var equipmentSN = $.trim($("#searchName").val());
		var statu = $(".tab-change .tablist.acv").index();
		var address = $(".area-name").text();
		getAdver(statu,address,equipmentSN);
		$(".tab-change .tablist.acv").attr("data-type",0);
		$(".tab-change .tablist.acv").siblings().attr("data-type",1);
	});

	//监听省市如果改变广告也改变
	$(".area-name").bind('DOMNodeInserted',
		function(e) {
			var address = $(".area-name").text();
			var equipmentSN = $.trim($("#searchName").val());
			var type =$(".content-all .detail.acv").attr("data-type");
			$(".tab-change .tablist.acv").attr("data-type",0);
			$(".tab-change .tablist.acv").siblings().attr("data-type",1);
			getAdver(type,address,equipmentSN);
	});

	//待投放广告查看详情
	$("#inputAd").on("click","li",function(){
		var ltype = $(this).find(".detail-info").attr("data-ltyp");
		var rtype = $(this).find(".detail-info").attr("data-rtype");
		var lurl = $(this).find(".detail-info").attr("data-lfurl")||"";
	    var rurl = $(this).find(".detail-info").attr("data-rgturl")||"";
		var widt = $("#inputAd").attr("data-width") + "px";
		var hgt = $("#inputAd").attr("data-height") + "px";
		if(lurl==0){
			var lurls = "../common/img/default_img.png";
		}else if(lurl.indexOf(";")==-1){
			var lurls = lurl;
		}else{
			var lurls = lurl.split(";");
		}
		if(rurl==0){
			var rurls = "../common/img/default_rgtimg.png";
		}else if(rurl.indexOf(";")==-1){
			var rurls = rurl;
		}
		else{
			var rurls = rurl.split(";");
		}
		layer.open({
			title: ["待投放详情", 'font-size:14px;background-color:#e7f2ff;color:#4aa0fe;text-align:center'],
			type: 1,
			content: $('#carousel'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: [widt, hgt],
			shade: [0.1, '#fff'],
			end: function () {
				$('#carousel').hide();
			},
			success: function (layero) {
				var sHtml="";
				if(ltype==1){
					$(".leftvideo").hide();
					$("#carousel_1").show();
					$(".noimg").hide();
					if(lurl!=""){
						if(lurl.indexOf(";")!=-1){
							sHtml="";
							for(var i=0;i<lurls.length;i++){
								sHtml += '<div><img src="'+ lurls[i] +'" /></div>';
							}
						}else{
							sHtml = '<div><img src="' + lurls + '" /></div>';
						}

						$("#carousel_1 .lfu").html(sHtml);
						form.render();
						layui.use('carousel', function(){
							var carousel = layui.carousel;
							//建造实例
							carousel.render({
								elem: '#carousel_1'
								,width: '100%' //设置容器宽度
								,height:'100%'
							});
						});

					}else{
						$(".leftvideo").hide();
						$("#carousel_1").hide();
						$(".noimg").show();
					}
				}else if(ltype==2){
					$(".leftvideo").show();
					$("#carousel_1").hide();
					$(".noimg").hide();
					if(lurl==0) {
						$("#carousel_1 .lfu").html("");
						$(".leftvideo").hide();
						$("#carousel_1").show();
						$(".noimg").hide();
						sHtml = '<div><img src="' + lurls + '" /></div>';
						$("#carousel_1 .lfu").html(sHtml);
						form.render();
						layui.use('carousel', function(){
							var carousel = layui.carousel;
							//建造实例
							carousel.render({
								elem: '#carousel_1'
								,width: '100%' //设置容器宽度
								,height:'100%'
							});
						});
					}
					else if(lurl.indexOf(";")!=-1) {
						$(".leftvideo").attr("src", lurls[0]);
					}
					else{
						$(".leftvideo").attr("src",lurls);
					}
				}
				else{
					$(".leftvideo").hide();
					$("#carousel_1").hide();
					$(".noimg").show();
				}
				if(rtype==1){
					if(rurl!=""){

						if(rurl==0) {
							sHtml = '<div><img src="' + rurls + '" /></div>';
						}else if(rurl.indexOf(";")!=-1){
							sHtml="";
							for (var i = 0; i < rurls.length; i++) {
								sHtml += '<div><img src="' + rurls[i] + '" /></div>';
							}
						} else{
							sHtml = '<div><img src="' + rurls + '" /></div>';
						}
						console.log(sHtml)
							$("#carousel_2 .lfu").html(sHtml);
							form.render();
							layui.use('carousel', function(){
								var carousel = layui.carousel;
								//建造实例
								carousel.render({
									elem: '#carousel_2'
									,width: '100%' //设置容器宽度
									,height:'100%'
								});
							});
						$(".noimg1").hide();
						$(".rightvid").hide();
						$("#carousel_2").show();
					}
					else{
						$(".rightvid").hide();
						$("#carousel_2").hide();
						$(".noimg1").show();
					}
				}else if(rtype==2){
					$(".noimg1").hide();
					$(".rightvid").show();
					$("#carousel_2").hide();
					if(rurl==0) {
						$(".noimg1").hide();
						$(".rightvid").hide();
						$("#carousel_2").show();
						sHtml = '<div><img src="' + rurls + '" /></div>';
						$("#carousel_2 .lfu").html(sHtml);
						form.render();
						layui.use('carousel', function(){
							var carousel = layui.carousel;
							//建造实例
							carousel.render({
								elem: '#carousel_2'
								,width: '100%' //设置容器宽度
								,height:'100%'
							});
						});
					}else if(rurl.indexOf(";")!=-1){
						$(".rightvid").attr("src",rurls[0]);
					}
					else{
						$(".rightvid").attr("src",rurls);
					}
				}
				else{
					$(".rightvid").hide();
					$("#carousel_2").hide();
					$(".noimg1").show();
				}
			}
		})
	});

	//广告投放历史方法
	$("#alInputAd").on("click","li",function(){
		var adress = $(".area-name").text();
		var equipmentSN = $(this).find(".detail-name").text();
		layer.open({
			title: [equipmentSN, 'font-size:14px;background-color:#e7f2ff;color:#4aa0fe;text-align:center'],
			type: 1,
			content: $('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: ['800px', '560px'],
			shade: [0.1, '#fff'],
			end: function () {
				$('#demo111').hide();
			},
			success: function (layero) {
				//渲染表单

				var obj = tableInit('table', [
						[ {
							title: '广告',
							/*sort: true,*/
							align: 'left',
							templet:'#img',
							width: 150
						},
							/*{
							title: '优先级',
							*//*sort: true,*//*
							align: 'left',
							field: 'priorityText',
							width: 80
						},*/ {
							title: '投放开始时间',
							/*sort: true,*/
							align: 'left',
							field: 'servingStartTime',
							width: 180
						},/* {
							title: '投放结束时间',
							*//*sort: true,*//*
							align: 'left',
							field: 'servingEndTime',
							width: 180
						},*/{
							title: '位置',
							/*sort: true,*/
							align: 'left',
							field: 'location',
							width: 150
						},]
					],
					pageCallback
				);

				/* 表格初始化
				 * tableId:
				 * cols: []
				 * pageCallback: 同步调用接口方法
				 */
				function tableInit(tableId, cols, pageCallback, test) {
					var tableIns, tablePage;
					//1.表格配置
					tableIns = table.render({
						id: tableId,
						elem: '#' + tableId,
						height:'460',
						cols: cols,
						page: false,
						even: true,
						skin: 'nob',
						size:'lg'
					});

					//2.第一次加载
					var res = pageCallback(1, 5,adress,equipmentSN);
					//第一页，一页显示15条数据
					if(res) {
						if(res.code == 1) {
							tableIns.reload({
								data: res.data
							})
						} else {
							layer.msg(res.msg)
						}
					}

					//3.left table page
					layui.use('laypage');

					var page_options = {
						elem: 'laypageLeft',
						count: res ? res.total : 0,
						layout: [ 'prev', 'page', 'next'],
						limits: [15, 30],
						limit: 5
					}
					page_options.jump = function(obj, first) {
						tablePage = obj;

						//首次不执行
						if(!first) {
							var resTwo = pageCallback(obj.curr, obj.limit,adress,equipmentSN);
							if(resTwo && resTwo.code == 1)
								tableIns.reload({
									data: resTwo.data
								});
							else
								layer.msg(resTwo.msg);
						}
					}


					layui.laypage.render(page_options);

					return {
						tablePage,
						tableIns
					};
				}

				//左侧表格数据处理
				function getData(url, parms) {

					var res = reqAjax(url, parms);

					var data = res.data;

					return res;
				}

				//pageCallback回调
				function pageCallback(index, limit ,address,equipmentSN) {
					var param = {
						"enable": "1",// 0 待投放 1 已投放
						"page": index,
						"rows": limit,
						"sort": "servingStartTime",
						"order": "desc",
						"address": address, // 地址
						"equipmentSN": equipmentSN // 设备编号
					}
					return getData(USER_URL.INPUTHISTORY , JSON.stringify(param));
				}
			}
		})
	});


})(jQuery)