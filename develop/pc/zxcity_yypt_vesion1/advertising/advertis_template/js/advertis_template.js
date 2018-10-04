(function($) {
	var page = 1;
	var rows = 8;
	var userno = yyCache.get("userno") || "";
	var username = yyCache.get('username') || "";
	var locked = true;
	var USER_URL = {
		 AD_LIST: 'operations/queryTAd'//广告
		, REGION_LIST: 'operations/queryBySetUp' //区域列表 setup 1-未设置 0-已设置
		, MODULE_ADD: "operations/addModel"  //设置模板
		, REGION_SET: "operations/queryModule" // 区域的模板设置
		, ADINFO : 'operations/adInfo'//查询广告详情
		, QUERYADVER : 'operations/queryAdSpace' //(查询广告位宽高)
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})

		$(function(){ //初始化
			getadverSet();
		});

	//查询广告位宽高
	function getadverSet(){
		var param = {};
		reqAjaxAsync(USER_URL.QUERYADVER, JSON.stringify(param)).done(function (res) {
			if (res.code == 1) {
				var row = res.data;
				$(".show-box .left-img").attr("data-width",row[0].width);
				$(".show-box .left-img").attr("data-height",row[0].height);
				$(".show-box .right-img").attr("data-width",row[1].width);
				$(".show-box .right-img").attr("data-height",row[1].height);
				$(".show-box .left-img").width((row[0].width/100)*34);
				$(".show-box .left-img").height((row[0].height/100)*34);
				$(".show-box .right-img").width((row[1].width/100)*34);
				$(".show-box .right-img").height((row[1].height/100)*34);
			}else{
				layer.msg(res.msg);
			}
		})
	}


	//列表初始化
	function source(res,inx,level){
		var sHtml = "";
		if(res.data.length>0){
			if(level==1){//level 1-一级 2-二级
				for(var i=0;i<res.data.length;i++){
					var row = res.data[i];
					var downlist =row.downlist||"";
					if(inx==row.regoinId){
						sHtml += '<div class="item-list">' +
						'<div data-muodule_regionid="'+ row.muodule_regionid +'" data-setUp="' + row.setUp + '" class="item-h4 avl" data-id="'+row.regoinId+'" data-region_group_code="' + row.regoinId + '">' + row.regoinName + '</div>'
						if(downlist!=""){
							sHtml +='<ul class="item-list">'
							for(var k=0;k<downlist.length;k++){
								var raw = downlist[k];
								if(raw.setUp==0){//已设置
									sHtml += '<li class="setal" data-muodule_regionid="'+ raw.muodule_regionid +'" data-setUp="' + raw.setUp + '" data-id="'+raw.regoinId+'" data-region_group_code="'+ raw.parentId +'">' + raw.regoinName + '</li>'
								}else{
									sHtml += '<li data-muodule_regionid="'+ raw.muodule_regionid +'" data-setUp="' + raw.setUp + '" data-id="'+raw.regoinId+'" data-region_group_code="'+ raw.parentId +'">' + raw.regoinName + '</li>'
								}
							}
							sHtml +=	'</ul>'
						}
						sHtml +='</div>';
						$(".savetmp").attr("data-muodule_regionid",row.muodule_regionid);
					}else{
						sHtml += '<div class="item-list">' +
						'<div data-muodule_regionid="'+ row.muodule_regionid +'" data-setUp="' + row.setUp + '" class="item-h4" data-id="'+row.regoinId+'" data-region_group_code="' + row.regoinId + '">' + row.regoinName + '</div>'
						if(downlist!=""){
							sHtml +='<ul class="item-list">'
							for(var k=0;k<downlist.length;k++){
								var raw = downlist[k];
								if(raw.setUp==0){//已设置
									sHtml += '<li class="setal" data-muodule_regionid="'+ raw.muodule_regionid +'" data-setUp="' + raw.setUp + '" data-id="'+raw.regoinId+'" data-region_group_code="'+ raw.parentId +'">' + raw.regoinName + '</li>'
								}else{
									sHtml += '<li data-muodule_regionid="'+ raw.muodule_regionid +'" data-setUp="' + raw.setUp + '" data-id="'+raw.regoinId+'" data-region_group_code="'+ raw.parentId +'">' + raw.regoinName + '</li>'
								}
							}
							sHtml +=	'</ul>'
						}
						sHtml +='</div>';
					}
				}
			}else{//二级
				for(var i=0;i<res.data.length;i++){
					var row = res.data[i];
					var downlist =row.downlist||"";
						sHtml += '<div class="item-list">' +
						'<div data-muodule_regionid="'+ row.muodule_regionid +'" data-setUp="' + row.setUp + '" class="item-h4" data-id="'+row.regoinId+'" data-region_group_code="' + row.regoinId + '">' + row.regoinName + '</div>'
						if(downlist!=""){
							sHtml +='<ul class="item-list">'
							for(var k=0;k<downlist.length;k++){
								var raw = downlist[k];
								if(inx==raw.regoinId) {//已设置
									if (raw.setUp == 0) {
										sHtml += '<li class="setal avl" data-muodule_regionid="'+ raw.muodule_regionid +'"  data-setUp="' + raw.setUp + '" data-id="' + raw.regoinId + '" data-region_group_code="' + raw.parentId + '">' + raw.regoinName + '</li>'
									} else {
										sHtml += '<li class="avl" data-muodule_regionid="'+ raw.muodule_regionid +'"  data-setUp="' + raw.setUp + '" data-id="' + raw.regoinId + '" data-region_group_code="' + raw.parentId + '">' + raw.regoinName + '</li>'
									}
									$(".savetmp").attr("data-muodule_regionid",raw.muodule_regionid);
								}else{
									if (raw.setUp == 0) {//已设置
										sHtml += '<li data-muodule_regionid="'+ raw.muodule_regionid +'"  class="setal" data-setUp="' + raw.setUp + '" data-id="' + raw.regoinId + '" data-region_group_code="' + raw.parentId + '">' + raw.regoinName + '</li>'
									} else {
										sHtml += '<li data-muodule_regionid="'+ raw.muodule_regionid +'"  data-setUp="' + raw.setUp + '" data-id="' + raw.regoinId + '" data-region_group_code="' + raw.parentId + '">' + raw.regoinName + '</li>'
									}
								}
							}
							sHtml +=	'</ul>'
						}
						sHtml +='</div>';
				}
			}
			$(".layui-tab-content .layui-show").find(".showlist").html(sHtml);
		}

	}

	//加载区域列表
	function getSource(provincial,cityCode,regointype,tit,inx,level){ //level 1-一级 2-二级 inx 会传region-id 相同的会加avl
		var param = {
			"provincial":provincial,
			"regoinname":tit,
			"city":cityCode,
			"regointype":regointype
		}
		reqAjaxAsync(USER_URL.REGION_LIST,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				if(res.data.length>0){
					source(res,inx,level);
				}else{
					$(".layui-tab-content .layui-show").find(".showlist").html("");
				}
			} else {
				layer.msg(res.msg);
			}
		})
	}

	//tab切换
	layui.use('element', function(){
		var element = layui.element;
		element.on('tab(test1)', function(){
			$("#searchName").val("");
			$(".show-box").fadeOut();
			$(".layui-tab-content .layui-show").find(".showlist").html("");
			var type = this.getAttribute('lay-id');
			var txtx =  this.getAttribute('lay-val');
			$(".title-type").text(txtx);
			var cityCode = $(".area-name").attr("data-city");
			var provincial = $(".area-name").attr("data-pro");
			var provincename = $(".area-name").attr("data-proname");
			var cityname = $(".area-name").text();
			getSource(provincial,cityCode,type,"","","");
		});
	});

	//首页搜索
	$("#search").click(function(){
		var tit = $.trim($("#searchName").val());
		var cityCode = $(".area-name").attr("data-city");
		var provincial = $(".area-name").attr("data-pro");
		var regointype = $("#tabNav").find("li.layui-this").attr("data-id");
		var provincename = $(".area-name").attr("data-proname");
		var cityname = $(".area-name").text();
		getSource(provincial,cityCode,regointype,tit,"","");
	});

	//省市监听
	$(".area-name").bind('DOMNodeInserted',
		function(e) {
			$("#searchName").val("");
			var cityCode = $(".area-name").attr("data-city");
			var provincial = $(".area-name").attr("data-pro");
			var provincename = $(".area-name").attr("data-proname");
			var cityname = $(".area-name").text();
			$("#tabNav").find("li").removeClass("layui-this");
			$("#tabNav").find("li").eq(0).addClass("layui-this");
			getSource(provincial,cityCode,1,"","","");
	});

	//广告方法
	function adverlist(res){
		var sHtml="";
		for(var i=0;i<res.data.length;i++){
			var row = res.data[i];
			var imgarr = row.res_list || "";
			var imgs = [];
			for(var a=0;a<imgarr.length;a++){
				imgs.push(imgarr[a].url);
			}
			var urls = imgs.join(";");
			sHtml += '<li data-id="' + row.id + '" data-resType="' + row.res_type + '">'+
				'<div class="look">' +
				'<i class="layui-icon">&#xe615;</i>'+
				'</div>'+
			'<div class="iminfo">'+
				'<div class="adverimg">'
					if(row.res_type==1){
						if(imgarr!=""){
							sHtml +='<img src="' + row.res_list[0].url+ '">';
						}else{
							sHtml +='<img src="../common/img/default_img.png">';
						}

					}else{
						sHtml +='<img src="../common/img/video_01.png">';
					}

			sHtml +=	'</div>'+
				'<span class="detail-name">' + row.name + '</span>' +
				'<input class="imglist" type="hidden" value="'+ urls +'">'+
			'</div>'+
			'</li>';
		}
		$(".detail").html(sHtml);
	}

	//加载广告
	function getAdver(height,width){
		var param = {
			"height": height,
			"page": page,
			"width": width,
			"rows":rows
		}
		reqAjaxAsync(USER_URL.AD_LIST,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				var row = res.data || "";
				if(row==""||row.length==0){
					$(".nodataad").show();
					$(".havadata").hide();
				}else{
					$(".nodataad").hide();
					$(".havadata").show();
					adverlist(res);
					//分页
					layui.use('laypage', function(){
						var laypage = layui.laypage;

						//执行一个laypage实例
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
									reqAjaxAsync(USER_URL.AD_LIST,JSON.stringify(param)).done(function(res){
										if(res.code==1){
											adverlist(res);
										}else{
											layer.msg(res.msg);
										}
									})
								}
							}
						});

					});
				}
			} else {
				layer.msg(res.msg);
			}
		})
	}

	//通过区域查询模板
	function model(region_group_code,regionId,type){
			var param = {
				"type":type,
				"region_id":regionId,
				"region_group_code" :region_group_code
			}

		reqAjaxAsync(USER_URL.REGION_SET,JSON.stringify(param)).done(function(res){
			if(res.code==1){
				if(res.data.length>0){
					var row = res.data[0];
					var lfimg = row.main_res_urls||"";
					var rgtimg =row.side_res_urls||"";
					var leftimg = lfimg.split(";");
					var rigtimg = rgtimg.split(";");
					console.log(leftimg);
					$(".show-box").find(".lfimg").attr("data-urltype",row.main_res_type);
					$(".show-box").find(".rgtimg").attr("data-urltype",row.side_res_type);
					if(row.main_res_type==1){
						if(lfimg!=""){
							$(".show-box").find(".lfimg").css({"background":"url('"+ leftimg[0] +"') no-repeat","background-size":"100%","background-position":"center"});
							$(".show-box").find(".lfimg").attr("data-url",lfimg);
						}else{
							$(".show-box").find(".lfimg").css({"background":"url('../common/img/default_img.png') no-repeat","background-size":"100%","background-position":"center"});
							$(".show-box").find(".lfimg").attr("data-url","");
						}
					}else if(row.main_res_type==2){
						$(".show-box").find(".lfimg").css({"background":"url('../common/img/video_01.png') no-repeat","background-size":"100%","background-position":"center"});
						$(".show-box").find(".lfimg").attr("data-url",lfimg);
					}else{
						$(".show-box").find(".lfimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
						$(".show-box").find(".lfimg").attr("data-url","");
					};
					if(row.side_res_type==1){
						if(rgtimg!=""){
							$(".show-box").find(".rgtimg").css({"background":"url('"+ rigtimg[0] +"') no-repeat","background-size":"100%","background-position":"center"});
							$(".show-box").find(".rgtimg").attr("data-url",rgtimg);
						}else{
							$(".show-box").find(".rgtimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
							$(".show-box").find(".rgtimg").attr("data-url","");
						}
					}else if(row.side_res_type==2){
						$(".show-box").find(".rgtimg").css({"background":"url('../common/img/video_02.png') no-repeat","background-size":"100%","background-position":"center"});
						$(".show-box").find(".rgtimg").attr("data-url",rgtimg);
					}else{
						$(".show-box").find(".rgtimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
						$(".show-box").find(".rgtimg").attr("data-url","");
					}
				}else{
					$(".show-box").find(".lfimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
					$(".show-box").find(".lfimg").attr("data-url","");
					$(".show-box").find(".rgtimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
					$(".show-box").find(".rgtimg").attr("data-url","");
					$(".show-box").find(".lfimg").attr("data-urltype",0);
					$(".show-box").find(".rgtimg").attr("data-urltype",0);
				}
			}else{
				layer.msg(res.msg);
			}
		})
	}

	//选择区域设置模板(二级)
	$(".showlist").on("click",".item-list li",function(){
		$(".show-box").fadeIn();
		$(".showlist .item-list li").removeClass("avl");
		$(this).addClass("avl");
		var type = $("#tabNav").find("li.layui-this").attr("lay-id");
		var regionId = $(this).attr("data-id");
		var region_group_code = $(this).attr("data-region_group_code");
		var setup = $(this).attr("data-setUp");
		var muodule_regionid = $(this).attr("data-muodule_regionid");
		$(".savetmp").attr("data-tpe",2);
		$(".savetmp").attr("data-set",setup);
		$(".savetmp").attr("data-muodule_regionid",muodule_regionid);
		if(setup==0){
			model(region_group_code,regionId,type);
		}else{
			$(".show-box").find(".rgtimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
			$(".show-box").find(".lfimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
			$(".rgtimg").attr("data-url","");
			$(".rgtimg").attr("data-urltype","");
			$(".lfimg").attr("data-url","");
			$(".lfimg").attr("data-urltype","");
		}
	});

	//选择区域设置模板(一级)
	$(".showlist").on("click",".item-list .item-h4",function(){
		$(".show-box").fadeIn();
		$(".showlist .item-list .item-h4").removeClass("avl");
		$(this).addClass("avl");
		var type = $("#tabNav").find("li.layui-this").attr("lay-id");
		var regionId = $(this).attr("data-id");
		var region_group_code = $(this).attr("data-region_group_code");
		var setup = $(this).attr("data-setUp");
		var muodule_regionid = $(this).attr("data-muodule_regionid");
		$(".savetmp").attr("data-tpe",1);
		$(".savetmp").attr("data-set",setup);
		$(".savetmp").attr("data-muodule_regionid",muodule_regionid);
		$(".showlist .item-list li").removeClass("avl");
		if(setup==0){
			model(region_group_code,regionId,type);
		}else{
			$(".show-box").find(".rgtimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
			$(".show-box").find(".lfimg").css({"background":"url('img/default.png') no-repeat","background-position":"center"});
			$(".rgtimg").attr("data-url","");
			$(".rgtimg").attr("data-urltype","");
			$(".lfimg").attr("data-url","");
			$(".lfimg").attr("data-urltype","");
		}
	});

	//点击设置模板
	$(".show-box").on("click","div",function(){
		$(".adver-up").slideUp();
		$(".setting").slideDown();
		var width = $(this).attr("data-width");
		var height = $(this).attr("data-height");
		var id = $(this).attr("data-id");
		var name = $(this).attr("class");
		$(".savetmp").attr("data-id",id);
		$(".savetmp").attr("data-width",width);
		$(".savetmp").attr("data-height",height);
		getAdver(height,width);
		if(name=="left-img"){
			$(".savetmp").attr("data-nums",1); //广告位1
		}else{
			$(".savetmp").attr("data-nums",2);//广告位2
		}

	});

	//取消
	$(".cance").click(function(){
		$(".adver-up").slideDown();
		$(".setting").slideUp();
		$(".detail li").removeClass("avl");
		$(".savetmp").attr("data-id",0);
	});

	//选中广告
	$(".detail").on("click","li",function(){
		$(".detail li").removeClass("avl");
		$(this).addClass("avl");
	});

	//详情方法(预览详情)
	function imgInfo(res,ltyp){// 1-图片
		var sHtml = "";
		var row = res.data;
		if(ltyp==1){
			$("#carousel .leftvideo").hide();
			$("#carousel #carousel_1").show();
			for(var i=0;i<row.resData.length;i++){
				var raw = row.resData[i];
				sHtml += '<div><img src="'+ raw.resUrl +'" /></div>';
			}
			$("#carousel .imgs .lfu").html(sHtml);
			layui.use('carousel', function(){
				var carousel = layui.carousel;
				//建造实例
				carousel.render({
					elem: '#carousel_1'
					,width: '100%' //设置容器宽度
					,height:'100%'
					/*,arrow: 'always' //始终显示箭头*/
					//,anim: 'updown' //切换动画方式
				});
			});
		}else{
			$("#carousel .leftvideo").show();
			$("#carousel #carousel_1").hide();
			for(var k=0;k<row.resData.length;k++){
				var rbw = row.resData[k];
				sHtml += '<div class="videos"><video controls="controls" width="100%" height="100%" src="' + rbw.resUrl + '"></video></div>'
			}
			$("#carousel .leftvideo").html(sHtml);
		}
	}

	//广告详情加载
	function getImgInfo(id,layero){
		var param = {
			"id":id
		}
		reqAjaxAsync(USER_URL.ADINFO,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				var row = res.data;
				if(row.resType==2){
					setTimeout(function() {
						$(layero).removeClass('layer-anim');
					}, 0);
				}
				imgInfo(res,row.resType);
			}else{
				layer.msg(res.msg);
			}
		})
	}



	//点击查看详情
	$(".detail").on("click",".look",function(){
			/*$(".detail li").removeClass("avl");
			$(this).parents("li").addClass("avl");*/
		var id = $(this).parent("li").attr("data-id");
			layer.open({
				type: 1,
				title: ['广告详情', 'font-size:12px;background-color:#0678CE;color:#fff'],
				content:$('#carousel'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['900px', '600px'],
				shade: [0.1, '#fff'],
				end:function(){
					$('#carousel').hide();
				},
				success:function(layero){
					getImgInfo(id,layero)
				}
			});
	});

	//设置广告方法（广告位）
	function updateAd(isall,setup,main_res_urls,main_res_width,main_res_height,main_res_type,side_res_urls,side_res_width,side_res_height,side_res_type,address1,address2,province,city,type,region_id,region_group_code,inx,level){
		var param = {
			"isall": isall, //所有的设置模板时为1,单个设置为0
			"muodule_regionid": setup,//1未设置 0已设置
			"main_res_urls": main_res_urls,
			"main_res_width": main_res_width,
			"main_res_height": main_res_height,
			"main_res_type": main_res_type,
			"side_res_urls":side_res_urls,
			"side_res_width":side_res_width,
			"side_res_height":side_res_height,
			"side_res_type":side_res_type,
			"address1": address1,
			"address2": address2,
			"province": province,
			"city": city,
			"username":username,
			"type":type,
			"region_id":region_id,
			"region_group_code":region_group_code
		}
		reqAjaxAsync(USER_URL.MODULE_ADD,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				layer.msg(res.msg);
				$(".adver-up").slideDown();
				$(".setting").slideUp();
				$(".detail li").removeClass("avl");
				var cityCode = $(".area-name").attr("data-city");
				var provincial = $(".area-name").attr("data-pro");
				var regointype = $("#tabNav").find("li.layui-this").attr("data-id");
				var provincename = $(".area-name").attr("data-proname");
				var cityname = $(".area-name").text();
				var tit = $.trim($("#searchName").val());
				getSource(provincial,cityCode,regointype,tit,inx,level);
				$(".show-box").fadeIn();
				if(level==1){ //一级
					var region_group_code =$(".layui-tab-content .layui-show").find(".showlist .item-h4.avl").attr("data-id");
					model(region_group_code,region_group_code,type);
				}else{//2级
					var region_group_code =$(".showlist").find("li.avl").attr("data-region_group_code");
					var regoinId = $(".showlist").find("li.avl").attr("data-id");
					model(region_group_code,regoinId,type);
				}

			}else{
				layer.msg(res.msg);
			}
		})
	}

		 //设置广告
		 $('.savetmp').on('click',function(){
			 var tpe = $(this).attr("data-tpe"); //1-一级 2-二级 所有的设置模板时为1,单个设置为0
			 var num = $(".savetmp").attr("data-nums"); //1-广告位1 2-广告位2
			 var setup =$(".savetmp").attr("data-set");//是否设置 0未设置1已设置
			 var url = $(".detail .avl").find(".imglist").val();
			 var resType = $(".detail .avl").attr("data-resType");
			 var width = $(".savetmp").attr("data-width");
			 var height = $(".savetmp").attr("data-height");
			 var province = $(".area-name").attr("data-proname");
			 var city = $(".area-name").text();
			 var type = $("#tabNav").find("li.layui-this").attr("data-id");//区域类型
			 var isCheck = $(".detail .avl").index()||"";
			 var muodule_regionid = $(".savetmp").attr("data-muodule_regionid");
			 if(isCheck==-1){
				 layer.msg("请选择广告");
			 }else{
				 if(tpe==1){ //一级
					 var region_id = $(".showlist .item-list .item-h4.avl").attr("data-id");
					 var region_group_code = $(".showlist .item-list .item-h4.avl").attr("data-region_group_code");
					 var address1 = $(".showlist .item-list .item-h4.avl").text();
					 var address2 = "";
					 if(num==1){//广告位1
						 var rwidth = $(".right-img").attr("data-width");
						 var rheight = $(".right-img").attr("data-height");
						 var rimg = $(".rgtimg").attr("data-url")||"";
						 var rurltype = $(".show-box").find(".rgtimg").attr("data-urltype") ||0;
						 updateAd(1,muodule_regionid,url,width,height,resType,rimg,rwidth,rheight,rurltype,address1,address2,province,city,type,region_id,region_group_code,region_id,1);
					 }else{//广告位2
						 var lwidth= $(".left-img").attr("data-width");
						 var lheight = $(".left-img").attr("data-height");
						 var limg = $(".lfimg").attr("data-url")||"";
						 var lurltype = $(".lfimg").attr("data-urltype")||0;
						 updateAd(1,muodule_regionid,limg,lwidth,lheight,lurltype,url,width,height,resType,address1,address2,province,city,type,region_id,region_group_code,region_id,1);
					 }

				 }else{//2级
					 var region_id = $(".layui-show .showlist .item-list li.avl").attr("data-id");
					 var region_group_code = $(".layui-show .showlist .item-list li.avl").attr("data-region_group_code");
					 var address1 = $(".layui-show .showlist li.avl").parent().prev().text();
					 var address2 = $(".layui-show .showlist li.avl").text();
					 if(num==1){//广告位1
						 var rwidth = $(".right-img").attr("data-width");
						 var rheight = $(".right-img").attr("data-height");
						 var rimg = $(".rgtimg").attr("data-url")||"";
						 var rurltype = $(".show-box").find(".rgtimg").attr("data-urltype")||0;
						 updateAd(0,muodule_regionid,url,width,height,resType,rimg,rwidth,rheight,rurltype,address1,address2,province,city,type,region_id,region_group_code,region_id,2);
					 }else{
						 var lwidth= $(".left-img").attr("data-width");
						 var lheight = $(".left-img").attr("data-height");
						 var limg = $(".lfimg").attr("data-url")||"";
						 var lurltype = $(".lfimg").attr("data-urltype")||0;
						 updateAd(0,muodule_regionid,limg,lwidth,lheight,lurltype,url,width,height,resType,address1,address2,province,city,type,region_id,region_group_code,region_id,2);
					 }
				 }
			 }
		 });


})(jQuery)