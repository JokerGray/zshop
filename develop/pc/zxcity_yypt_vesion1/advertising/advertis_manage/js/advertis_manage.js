(function($) {
	var page = 1;
	var rows = 8;
	var userno = yyCache.get("userno") || "";
	var locked = true;
	var oneArr=[];//第一步
	var oneArrsn = [];
	var oneadress1=[];
	var oneadress2=[];
	var oneadress3=[];
	var twoArr=[];//第二步id
	var twoas=[];//第二步 restype
	var USER_URL = {
		RESOURLIST : 'operations/adEquipmentList', //(查询广告机列表)
		ADVERISTINFO : 'operations/adRunInfo',//(	查询广告机详情)
		QUERYTRAD : 'operations/queryByType',//(查询商圈)
		QUERYADVERSIT :'operations/adList', //（查询广告列表）
		INPUTAD :'operations/adRunAdd', //(投放)
		THREETWO : 'operations/queryAdSpace',//(第三步（广告机宽高）)
		THREEINPUT : 'operations/adInfo', //(第三步(资源))
		AREALIST : 'operations/queryRegoinByDown', //查询区域列表
		QUERYADVERMG : 'operations/queryAdEquipmentByRegion' //通过区域查询广告机
	};

		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})
	//初始化
	$(function(){
		getWidth();//广告位宽高
	})

		//广告机列表方法
		function merchaineList(res){
			var sHtml = "";
			if(res.data.length>0){
				layui.use('form', function(){
					form = layui.form;
					for(var i=0;i<res.data.length;i++){
						var row = res.data[i];
						sHtml += '<li data-equipmentSN="' + row.equipmentSN + '" data-id="' + row.id + '">' +
						'<div class="chaeck layui-form-item">' +
							'<input class="checkboxinpu" type="checkbox" lay-filter="advermer">' +
						'</div>' +
						'<div class="stepone-detail">'	+
						'<img src="img/advice_icon.png">' +
						'<div class="machine-info">' +
						'<span class="machine-name">' + row.equipmentSN + '</span>' +
						'<span class="machine-area">' + row.address1 + '</span>'+
						 '<span class="machine-address">' + row.address2 + '</span>'+
						'<span class="machine-specific">'	+ row.address3 + '</span>'+
						'<span class="machine-version">APP版本' + row.appVersion + '</span>' +
						'<span class="machine-statu" data-statu="' + row.connectionState + '">'
						if(row.connectionState==1){ //正常
							sHtml += '<i class="green-statu"></i>'
						}else{
							sHtml += '<i class="red-statu"></i>'
						}
						sHtml += '连接状态</span>'
						if(row.isServing>0){
							sHtml +=	'<span class="machine-send">正在投放</span>'
						}
						sHtml += '</div>' +
						'</div>'+
						'</li>'
					}
				$(".stepone").html(sHtml);
				form.render();
				$(".nodata2").hide();
				$(".addmore").show();
				})
			}else{
				$(".nodata2").show();
				$(".stepone").html("");
				$(".addmore").hide();
			}
		}

	//广告机列表初始化
	function getMerchaineList(address,status,equipmentSN){
		var param = {
			"address": address,// 市
			"order": "desc",
			"page": page,
			"rows": rows
		}
		if(status!=""){
			param.connectionState=status;//1连接 0未连接
		}
		if(equipmentSN!=""){
			param.equipmentSN=equipmentSN;//名称
		}
		reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res){
			if(res.code==1){
				if(res.data.length>0){
					$("#addarea").show();
					$("#addsource").show();
					$(".stepone").show();
					$(".addmore").show();
					merchaineList(res);
					$(".nodata2").hide();
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
									reqAjaxAsync(USER_URL.RESOURLIST,JSON.stringify(param)).done(function(res){
										if(res.code==1){
											merchaineList(res);
											backstatu();
											var step = $("#cancel").attr("data-step");
											var num = $(".selnum").text();
											if(num>0){
												$("#selectall").find(".layui-unselect").addClass("layui-form-checked");
												$("#selectall").find(".allcheck").checked = true;
											}else{
												$("#selectall").find(".layui-unselect").removeClass("layui-form-checked");
												$("#selectall").find(".allcheck").checked = false;
											}
											if(step==1){
												$(".stepone .chaeck").show();
											}else{
												$(".stepone .chaeck").hide();
											}

										}else{
											layer.msg(res.msg);
										}
									})
								}
							}
						});

					});
				}else{
					$("#addarea").hide();
					$("#addsource").hide();
					$(".nodata2").show();
					$(".stepone").hide();
					$(".addmore").hide();
				}

			}else{
				layer.msg(res.msg);
			}
		})
	}

	//通用记录第一步广告机选择以及移除
	function commonAd(statu,e,id,adres1,adres2,adres3,name){
		if(statu==0){
			oneArr=[];
			oneadress1=[];
			oneadress2=[];
			oneadress3=[];
			oneArrsn=[];
		}else{
			if(e==""){
				oneArr.push(id);
				oneadress1.push(adres1);
				oneadress2.push(adres2);
				oneadress3.push(adres3);
				oneArrsn.push(name);
			}else{
				for(var k=0;k<oneArr.length;k++){
					if(oneArr[k]==e){
						oneArr.splice(k, 1);
						oneArrsn.splice(k, 1);
						oneadress1.splice(k, 1);
						oneadress2.splice(k, 1);
						oneadress3.splice(k, 1);
						break;
					}
				}

			}

			$(".step").attr("data-oneid",unique(oneArr));
			$(".step").attr("data-onesn",unique(oneArrsn));
			$(".step").attr("data-oneads1",oneadress1);
			$(".step").attr("data-oneads2",oneadress2);
			$(".step").attr("data-oneads3",oneadress3);
		}

	}

	//去掉重复
	function unique(arr){
		// 遍历arr，把元素分别放入tmp数组(不存在才放)
		var tmp = new Array();
		for(var i in arr){
		//该元素在tmp内部不存在才允许追加
			if(tmp.indexOf(arr[i])==-1){
				tmp.push(arr[i]);
			}
		}
		return tmp;
	}

	//翻页时遍历状态(第一步)
	function backstatu(){
		var newlist = $(".stepone li");
		var oldone = $(".step").attr("data-oneid");
		var nums = $(".selnum").text();
		if(nums!=1){
			var oneArr = $(".step").attr("data-oneid").split(",");
		}else{
			var oneArr = $(".step").attr("data-oneid")
		}
		var newarr = [];
		for(var i=0;i<newlist.length;i++){
			newarr.push(newlist.eq(i).attr("data-id"));
		}
		/*var unix = new Array();
		for (var i = 0; i < oneArr.length; i++) {
			if($.inArray(oneArr[i] ,newarr) != -1){
				unix.push(oneArr[i]);
			}
		}*/
		console.log(unix);
		if(nums!=1){
			for(var j=0;j<oneArr.length;j++){
				for(var k=0;k<newlist.length;k++){
					if(oneArr[j]==newlist.eq(k).attr("data-id")){
						newlist.eq(k).addClass("avl");
						newlist.eq(k).find(".layui-unselect").className = "layui-unselect layui-form-checkbox layui-form-checked";
						newlist.eq(k).find("input").attr('checked', true);
						form.render();
					}
				}
			}
		}else{
			for(var k=0;k<newlist.length;k++){
				if(oneArr==newlist.eq(k).attr("data-id")){
					newlist.eq(k).addClass("avl");
					newlist.eq(k).find(".layui-unselect").className = "layui-unselect layui-form-checkbox layui-form-checked";
					newlist.eq(k).find("input").attr('checked', true);
					form.render();
				}
			}
		}

	}

	//第二步选择以及移除
	function commonAdtwo(statu,e,id,restype){
		if(statu==0){
			twoas=[];
			twoArr=[];
		}else{
			if(e=="") {
				twoArr.push(id);
				twoas.push(restype);

			}else{
				for(var k=0;k<twoArr.length;k++){
					if(twoArr[k]==e){
						twoArr.splice(k, 1);
						twoas.splice(k, 1);
						break;
					}
				}
			}

			$(".step").attr("data-twoid", unique(twoArr));
			$(".step").attr("data-twotype", twoas);
		}
	}

	//翻页时遍历状态(第2步)
	function backstatuTwo(){
		var newlist = $(".steptwo li");
		var oldtwo = $(".step").attr("data-twoid");
		var nms = $(".hidetip").attr("data-num");
		if(nms!=1){
			var twoArr = $(".step").attr("data-twoid").split(",");
		}else{
			var twoArr = $(".step").attr("data-twoid");
		}
		var newarr = [];
		for(var i=0;i<newlist.length;i++){
			newarr.push(newlist.eq(i).attr("data-id"));
		}
		if(nms!=1){
			for(var j=0;j<twoArr.length;j++){
				for(var k=0;k<newlist.length;k++){
					if(twoArr[j]==newlist.eq(k).attr("data-id")){
						newlist.eq(k).addClass("avl");
						newlist.eq(k).find(".layui-unselect").className = "layui-unselect layui-form-checkbox layui-form-checked";
						newlist.eq(k).find("input").attr('checked', true);
						form.render();
					}
				}
			}
		}else{
			for(var k=0;k<newlist.length;k++){
				if(twoArr==newlist.eq(k).attr("data-id")){
					newlist.eq(k).addClass("avl");
					newlist.eq(k).find(".layui-unselect").className = "layui-unselect layui-form-checkbox layui-form-checked";
					newlist.eq(k).find("input").attr('checked', true);
					form.render();
				}
			}
		}

	}


	//切换连接状态
	form.on('select(linestatu)', function(data){
		console.log(data.value); //复选框value值，也可以通过data.elem.value得到
		var address= $.trim($("#searchName").val());
		var address1 = $(".area-name").text();
		var ads = $("#searchName").attr("data-cicle")||"";
		var address2 = address1+ads;
		getMerchaineList(address2,data.value,address);
	});

	//初始页点击搜索
	$("#search").click(function(){
		var address= $.trim($("#searchName").val());
		var adress1 = $(".area-name").text();
		var statu = $("#linestt").find("dl dd.layui-this").attr("lay-value") || "";
		var ads = $("#searchName").attr("data-cicle")||"";
		var address2 = adress1+ads;
		getMerchaineList(address2,statu,address);
	});



	//监听省市如果改变广告机也改变
	$(".area-name").bind('DOMNodeInserted',
		function(e) {
			var nums = $(this).attr("data-typ");
			var address = $(this).text();
			var statu = $("#linestt").find("dl dd.layui-this").attr("lay-value") || "";
			var address1= $.trim($("#searchName").val());
				getMerchaineList(address,statu,address1);
			var provincial = $(".provice-name").attr("data-id");
			var city = $(".city-name").attr("data-id");
			gettrad("1",provincial,city);
			$("#searchName").attr("data-cicle","");
			$(".areaname").text("全部 >");

		});

	//详情方法(预览详情)
	function imgInfo(res,ltyp,rtyp) {// 1-图片
		var lwidth = $("#sue").attr("data-lwidth");
		var rwidth = $("#sue").attr("data-rwidth");
		var sHtml = "";
		var row = res.data;
		if(lwidth==0){
			$(".rft1").hide();
			$(".lft1").show();
			$(".rightimginfo").show();
			$(".leftimginfo").hide();
			if (rtyp == 1) {
				if (row.sideResUrls != "") {
					$("#carousel .rightvid").hide();
					$("#carousel #carousel_2").show();
					$(".video .noimg1").hide();
					if (row.sideResUrls.indexOf(";") == -1) {
						sHtml += '<div><img src="' + row.sideResUrls + '" /></div>';
					} else {
						var raw = row.sideResUrls.split(";");
						for (var i = 0; i < raw.length; i++) {
							sHtml += '<div><img src="' + raw[i] + '" /></div>';
						}
					}
					$("#carousel .video .lfu").html(sHtml);
					layui.use('carousel', function () {
						var carousel = layui.carousel;
						//建造实例
						carousel.render({
							elem: '#carousel_2'
							, width: '100%' //设置容器宽度
							, height: '100%'
							/*,arrow: 'always' //始终显示箭头*/
							//,anim: 'updown' //切换动画方式
						});
					});
				} else {
					$("#carousel .rightvid").show();
					$("#carousel #carousel_2").hide();
					$(".video .noimg1").show();
				}
			}else if(rtyp == 2){
				if(row.sideResUrls != ""){
					$("#carousel .rightvid").show();
					$("#carousel #carousel_2").hide();
					$(".video .noimg1").hide();
					if (row.sideResUrls.indexOf(";") == -1) {
						$(".rightvid").attr("src",row.sideResUrls);
					} else {
						var raw = row.sideResUrls.split(";");
						$(".rightvid").attr("src",row.raw[i]);
					}
				}else {
					$("#carousel .rightvid").show();
					$("#carousel #carousel_2").hide();
					$(".video .noimg1").show();
				}
			}else{
				$("#carousel .rightvid").show();
				$("#carousel #carousel_2").hide();
				$(".video .noimg1").show();
			}
		}else if(rwidth==0){
			$(".rft1").show();
			$(".lft1").hide();
			$(".rightimginfo").hide();
			$(".leftimginfo").show();
			if (ltyp == 1) {
				$("#carousel .leftvideo").hide();
				$("#carousel #carousel_1").show();
				$(".imgs .noimg").hide();
				if (row.mainResUrls != "") {
					if (row.mainResUrls.indexOf(";") == -1) {
						sHtml += '<div><img src="' + row.mainResUrls + '" /></div>';
					} else {
						var raw = row.mainResUrls.split(";");
						for (var i = 0; i < raw.length; i++) {
							sHtml += '<div><img src="' + raw[i] + '" /></div>';
						}
					}
					$("#carousel .imgs .lfu").html(sHtml);
					layui.use('carousel', function () {
						var carousel = layui.carousel;
						//建造实例
						carousel.render({
							elem: '#carousel_1'
							, width: '100%' //设置容器宽度
							, height: '100%'
							/*,arrow: 'always' //始终显示箭头*/
							//,anim: 'updown' //切换动画方式
						});
					});
				} else {
					$("#carousel .leftvideo").hide();
					$("#carousel #carousel_1").hide();
					$(".imgs .noimg").show();
				}
			} else if (ltyp == 2) {
				$("#carousel .leftvideo").show();
				$("#carousel #carousel_1").hide();
				$(".imgs .noimg").hide();
				if (row.mainResUrls != "") {
					if (row.mainResUrls.indexOf(";") == -1) {
						$(".leftvideo").attr("src", row.mainResUrls);
					} else {
						var raw = row.mainResUrls.split(";");
						$(".leftvideo").attr("src", raw[0]);
					}
				} else {
					$("#carousel .leftvideo").hide();
					$("#carousel #carousel_1").hide();
					$(".imgs .noimg").show();
				}
			} else {
				$("#carousel .leftvideo").hide();
				$("#carousel #carousel_1").hide();
				$(".imgs .noimg").show();
			}
		}else if(lwidth!=0&&rwidth!=0){
			$(".rft1").hide();
			$(".lft1").hide();
			$(".rightimginfo").show();
			$(".leftimginfo").show();
			if (ltyp == 1) {
				$("#carousel .leftvideo").hide();
				$("#carousel #carousel_1").show();
				$(".imgs .noimg").hide();
				if (row.mainResUrls != "") {
					if (row.mainResUrls.indexOf(";") == -1) {
						sHtml += '<div><img src="' + row.mainResUrls + '" /></div>';
					} else {
						var raw = row.mainResUrls.split(";");
						for (var i = 0; i < raw.length; i++) {
							sHtml += '<div><img src="' + raw[i] + '" /></div>';
						}
					}
					$("#carousel .imgs .lfu").html(sHtml);
					layui.use('carousel', function () {
						var carousel = layui.carousel;
						//建造实例
						carousel.render({
							elem: '#carousel_1'
							, width: '100%' //设置容器宽度
							, height: '100%'
							/*,arrow: 'always' //始终显示箭头*/
							//,anim: 'updown' //切换动画方式
						});
					});
				} else {
					$("#carousel .leftvideo").hide();
					$("#carousel #carousel_1").hide();
					$(".imgs .noimg").show();
				}
			} else if (ltyp == 2) {
				$("#carousel .leftvideo").show();
				$("#carousel #carousel_1").hide();
				$(".imgs .noimg").hide();
				if (row.mainResUrls != "") {
					if (row.mainResUrls.indexOf(";") == -1) {
						$(".leftvideo").attr("src", row.mainResUrls);
					} else {
						var raw = row.mainResUrls.split(";");
						$(".leftvideo").attr("src", raw[0]);
					}
				} else {
					$("#carousel .leftvideo").hide();
					$("#carousel #carousel_1").hide();
					$(".imgs .noimg").show();
				}
			} else {
				$("#carousel .leftvideo").hide();
				$("#carousel #carousel_1").hide();
				$(".imgs .noimg").show();
			}
			if (rtyp == 1) {
				if (row.sideResUrls != "") {
					$("#carousel .rightvid").hide();
					$("#carousel #carousel_2").show();
					$(".video .noimg1").hide();
					if (row.sideResUrls.indexOf(";") == -1) {
						sHtml += '<div><img src="' + row.sideResUrls + '" /></div>';
					} else {
						var raw = row.sideResUrls.split(";");
						for (var i = 0; i < raw.length; i++) {
							sHtml += '<div><img src="' + raw[i] + '" /></div>';
						}
					}
					$("#carousel .video .lfu").html(sHtml);
					layui.use('carousel', function () {
						var carousel = layui.carousel;
						//建造实例
						carousel.render({
							elem: '#carousel_2'
							, width: '100%' //设置容器宽度
							, height: '100%'
							/*,arrow: 'always' //始终显示箭头*/
							//,anim: 'updown' //切换动画方式
						});
					});
				} else {
					$("#carousel .rightvid").show();
					$("#carousel #carousel_2").hide();
					$(".video .noimg1").show();
				}
			}else if(rtyp == 2){
				if(row.sideResUrls != ""){
					$("#carousel .rightvid").show();
					$("#carousel #carousel_2").hide();
					$(".video .noimg1").hide();
					if (row.sideResUrls.indexOf(";") == -1) {
						$(".rightvid").attr("src",row.sideResUrls);
					} else {
						var raw = row.sideResUrls.split(";");
						$(".rightvid").attr("src",row.raw[i]);
					}
				}else {
					$("#carousel .rightvid").show();
					$("#carousel #carousel_2").hide();
					$(".video .noimg1").show();
				}
			}else{
				$("#carousel .rightvid").show();
				$("#carousel #carousel_2").hide();
				$(".video .noimg1").show();
			}
		}

	}

	//广告机详情加载
	function getImgInfo(id,layero){
		var param = {
			"equipmentSN": id
		}
		reqAjaxAsync(USER_URL.ADVERISTINFO,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				var row = res.data || "";
				if(row!=""){
					$(".noda").hide();
					$(".imgInfo").show();
					$(".imgs").show();
					$(".video").show();
					$(".machine-sn").text(row.equipmentSN);
					$(".machine-cityname").text(row.city);
					$(".machine-typename").text(row.city+row.address1+row.address2+row.address3);
					$(".machine-stat").text(row.runStateText);
					$(".machine-createtime").text(row.createTime);
					var mainResType = row.mainResType; //1-图片 2-视频
					var sideResType = row.sideResType;
					var mainResUrls = row.mainResUrls;
					var sideResUrls = row.sideResUrls;
					//预览详情
					var slw = $("#sue").attr("data-slwidth");
					var slh = $("#sue").attr("data-slheight");
					var srw = $("#sue").attr("data-srwidth");
					var srh = $("#sue").attr("data-srheight");
					$("#carousel .leftimginfo").css({"width":parseInt(slw)+60,"height":parseInt(slh)+65});
					$("#carousel .lft1").css({"width":parseInt(slw)+60,"height":parseInt(slh)+65,"text-align":"center","line-height":parseInt(slh)+65+"px"});
					$("#carousel .leftvideo").css({"width":parseInt(slw)+40,"height":parseInt(slh)+40});
					$("#carousel .imgs").css({"width":parseInt(slw)+80,"height":parseInt(slh)+85});
					$("#carousel .rightimginfo").css({"width":parseInt(srw)+60,"height":parseInt(srh)+65});
					$("#carousel .rft1").css({"width":parseInt(srw)+60,"height":parseInt(srh)+65,"text-align":"center","line-height":parseInt(slh)+65+"px"});
					$("#carousel .video").css({"width":parseInt(srw)+80,"height":parseInt(srh)+85});
					$("#carousel .rightvid").css({"width":parseInt(srw)+40,"height":parseInt(srh)+40});

					if(mainResType==2){
						setTimeout(function() {
							$(layero).removeClass('layer-anim');
						}, 0);

					}
					if(sideResType==2){
						setTimeout(function() {
							$(layero).removeClass('layer-anim');
						}, 0);
					}
					imgInfo(res,mainResType,sideResType);
				}else{
					$(".noda").show();
					$(".imgInfo").hide();
					$(".imgs").hide();
					$(".video").hide();
				}
			}else{
				layer.msg(res.msg);
			}
		})
	}



	//点击广告机列表查看详情
	$(".stepone").on("click","li .stepone-detail",function(){
		$(".stepone li").removeClass("actv");
		$(this).parent().addClass("actv");
		var equipmentSN = $(this).parent().attr("data-equipmentSN");
		var infowidth= $("#sue").attr("data-sfumw")+"px";
		var infoheight = $("#sue").attr("data-sfumh")+"px";
		layer.open({
			title: ['广告预览', 'font-size:12px;background-color:#0678CE;color:#fff'],
			type: 1,
			content: $('#carousel'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			area: [infowidth, infoheight],
			shade: [0.1, '#fff'],
			end: function () {
				$('#carousel').hide();
			},
			success: function (layero) {
				setTimeout(function() {
					$(layero).removeClass('layer-anim');
				}, 0);
				getImgInfo(equipmentSN);
			}
		})
	});



	//点击投放-全部消失
	$("#addsource").on("click",function(){
		$(".areaname").hide();
		$(".onlyinput").show();
		$(".areainput").hide();
		$(".step0").hide();
		$(".step1").show();
		$("#cancel").attr("data-step",1);
	});

	//取消方法
	function cencal(){
		var shtml = '<input class="allcheck" type="checkbox" name="" title="本页全选" lay-skin="primary" lay-filter="all">';
		$(".areaname").show();
		commonAdtwo(0);
		commonAd(0);
		$(".step").attr("data-oneid","");
		$(".step").attr("data-twoid","");
		$(".step").attr("data-twotype","");
		$(".step").attr("data-rgtimg","");
		$(".step").attr("data-lfimg","");
		$(".hidetip").attr("data-num",0);
		$(".step").attr("data-oneads1","");
		$(".step").attr("data-oneads2","");
		$(".step").attr("data-oneads3","");
		$(".step").attr("data-onesn","");
		$("#cancel").attr("data-step",1);
		$(".step2 i").attr("class","stept");
		$(".step3 i").attr("class","stepr");
		$(".step4 i").attr("class","stepf");
		$(".content-all").find(".detail").hide();
		$(".selnum").text(0);
		$("#selectall").find(".layui-unselect").removeClass("layui-form-checked");
		$(".allcheck").checked = false;
		$("#selectall").html(shtml);
		form.render();
		$(".steptwo li").removeClass("avl");
		$(".areainput").hide();
		$(".onlyinput").show();
		var list = $(".stepone").find(".layui-unselect");
		var lsi = $(".steptwo").find(".layui-unselect");
		for(var i=0;i<list.length;i++){
			list.eq(i).removeClass("layui-form-checked");
		}
		for(var i=0;i<lsi.length;i++){
			lsi.eq(i).removeClass("layui-form-checked");
		}
		var onetxt = $(".nodata2").css("display");
		if(onetxt=="block"){
			$(".addmore").fadeOut();
		}else{
			$(".content-all .detail").eq(0).fadeIn();
			$(".addmore").fadeIn();
			$(".stepone li").show();
			var address= $.trim($("#searchName").val());
			var adress1 = $(".area-name").text();
			var statu = $("#linestt").find("dl dd.layui-this").attr("lay-value") || "";
			var ads = $("#searchName").attr("data-cicle")||"";
			var address2 = adress1+ads;
			getMerchaineList(address2,statu,address);
		}
	}

	//点击取消
	$("#cancel").click(function(){
		cencal();

	});

	//投放广告点击
	$("#addsource").click(function(){
		$(".stepone li").removeClass("actv");
	});

	//点击下一步
	$("#next").on("click",function(){
		var step =  $("#cancel").attr("data-step");
		if(step==0){//选择区域
			var arealis = $(".area-box").find(".area-child .avl");
			var areaArr = [];
			for(var k=0;k<arealis.length;k++){
				areaArr.push(arealis.eq(k).attr("data-id"));
			}
			var areastr = areaArr.join(",");
			console.log(areastr)
			ajaxadver(areastr);
		}
		if(step==1){ //投放选择广告机
			var len = $(".merchine").attr("data-num");
			if(len==0){
				layer.msg("请选择广告机");
			}else{
				$("#cancel").attr("data-step",2);
				$(".step2 i").attr("class","steptacv");
				$(".stepone").fadeOut();
				$(".addmore").fadeOut();
				setTimeout(function(){
					$(".steptwo").fadeIn();
					getAdversiting();//第二步
					$("#prev").fadeIn();
					$(".addmore").fadeIn();
				},1000)
			}
		}
		if(step==2){
				var list = $(".step").attr("data-twoid");
				var listarr = list.split(",");
				var types = $(".step").attr("data-twotype");
				var typearr= types.split(",");
			console.log(typearr)
			var nums = $(".hidetip span").text();
			if(nums==1){
				if(typearr.length==1){
					for(var i=0;i<listarr.length;i++){
						getImg(listarr[i],i,typearr[i]);//第三步
					}
					$(".step3 i").attr("class","stepracv");
					$("#cancel").attr("data-step",3);
					$(".steptwo").fadeOut();
					$(".addmore").fadeOut();
					$(".hidetip").fadeOut();
					$("#next").fadeOut();
					$(".prev").fadeOut();
					setTimeout(function(){
						$(".stepthree").fadeIn();
						$(".sue").fadeIn();
					},1000)
				}else{
					layer.msg("必须选择两个哟");
				}
			}else{
				if(typearr.length==2){
					for(var i=0;i<listarr.length;i++){
						getImg(listarr[i],i,typearr[i]);//第三步
					}
					$(".step3 i").attr("class","stepracv");
					$("#cancel").attr("data-step",3);
					$(".steptwo").fadeOut();
					$(".addmore").fadeOut();
					$(".hidetip").fadeOut();
					$("#next").fadeOut();
					$(".prev").fadeOut();
					setTimeout(function(){
						$(".stepthree").fadeIn();
						$(".sue").fadeIn();
					},1000)
				}else{
					layer.msg("必须选择两个哟");
				}
			}

		}
		/*if(step==3){
			$(".stepthree").fadeOut();
			$("#next").fadeOut();
			$(".step4 i").attr("class","stepfacv");
			$(".stepone li").hide();
			$(".stepone li").find(".chaeck").hide();
			setTimeout(function(){
				$(".stepone").fadeIn();
				$(".stepone .avl").fadeIn();

			},1000)
		}*/
	});

	//上一步
	$("#prev").on("click",function(){
		$("#cancel").attr("data-step",1);
		$(".hidetip").fadeOut();
		$(".steptwo").fadeOut();
		$(".twotip").fadeOut();
		$(".prev").fadeOut();
		setTimeout(function(){
			$(".stepone").fadeIn();
			$("#selectall").fadeIn();
			$(".select-num").fadeIn();
		},1000)
	});


	//本页全选
	form.on('checkbox(all)', function(data){
		if(data.elem.checked){
			var ch = document.getElementsByClassName("checkboxinpu");
			$(".selnum").text(ch.length);
			for (var i = 0; i < ch.length; i++) {
					ch[i].checked = true;
			}
			var ch = document.getElementsByClassName("layui-unselect layui-form-checkbox");

			for (var i = 0; i < ch.length; i++) {
					ch[i].className = "layui-unselect layui-form-checkbox layui-form-checked";
			}
			$(".stepone li").addClass("avl");
			var list = $(".stepone li");
			for(var a=0;a<list.length;a++){
				var adres1 = list.eq(a).find(".machine-area").text();
				var adres2 = list.eq(a).find(".machine-address").text();
				var adres3 = list.eq(a).find(".machine-specific").text();
				var name = list.eq(a).find(".machine-name").text();
				commonAd(1,"",list.eq(a).attr("data-id"),adres1,adres2,adres3,name);
			}
		}else{
			$(".selnum").text(0);
			var chs = document.getElementsByClassName("checkboxinpu");
			for (var i = 0; i < chs.length; i++) {
				chs[i].checked = false;
			}
			var chlist = $(".stepone li").find(".layui-form-checked");
			for (var i = 0; i < chlist.length; i++) {
				chlist[i].className = "layui-unselect layui-form-checkbox";
			}
			$(".stepone li").removeClass("avl");
		}
		var num = $(".selnum").text();
		$(".merchine").attr("data-num",num);
		var list = $(".stepone li");
		for(var a=0;a<list.length;a++){
			var adres1 = list.eq(a).find(".machine-area").text();
			var adres2 = list.eq(a).find(".machine-address").text();
			var adres3 = list.eq(a).find(".machine-specific").text();
			var name = list.eq(a).find(".machine-name").text();
			commonAd(1,list.eq(a).attr("data-id"),adres1,adres2,adres3,name);
		}
	});

	//点击全部选择
	$(".tablist").click(function(){
		var type = $(this).attr("data-num");
		if(type==0){
			$(".alllist").show();
			$(this).attr("data-num",1);
		}
		if(type==1){
			$(".alllist").hide();
			$(this).attr("data-num",0);
		}
	});

	//广告机勾选其中某几个
	form.on('checkbox(advermer)', function(data){
		var a=$(".merchine").attr("data-num");
		console.log(data.elem.checked); //是否被选中，true或者false
		if(data.elem.checked){
			a++;
			$(".selnum").text(a);
			$(".merchine").attr("data-num",a);
			$(this).parents("li").addClass("avl");
			$("#selectall").find(".layui-unselect").addClass("layui-form-checked");
			$("#selectall").find(".allcheck").checked = true;
			var id = $(this).parents("li").attr("data-id");
			var adres1 = $(this).parents("li").find(".machine-area").text();
			var adres2 = $(this).parents("li").find(".machine-address").text();
			var adres3 = $(this).parents("li").find(".machine-specific").text();
			var name = $(this).parents("li").find(".machine-name").text();
			commonAd(1,"",id,adres1,adres2,adres3,name);
		}else{
			a--;
			$(".selnum").text(a);
			$(".merchine").attr("data-num",a);
			$(this).parents("li").removeClass("avl");
			var text = $(this).parents("li").attr("data-id");
			var adres1 = $(this).parents("li").find(".machine-area").text();
			var adres2 = $(this).parents("li").find(".machine-address").text();
			var adres3 = $(this).parents("li").find(".machine-specific").text();
			var name = $(this).parents("li").find(".machine-name").text();
			commonAd(1,text,"",adres1,adres2,adres3,name);
			if(a==0){
				$("#selectall").find(".layui-unselect").removeClass("layui-form-checked");
				$("#selectall").find(".allcheck").checked = false;
			}
		}
	})



	//点击关闭全部弹窗关闭
	$(".all-info").on("click",".closebtn",function(){
			$(".alllist").hide();
			$(".tablist").attr("data-num",0);
	});

	//商圈及其他通用初始化方法
	function trading(res,regointype){
		$(".listinfo ul").html("");

			var sHtml = "";
			for(var i=0;i<res.data.length;i++){
				var row = res.data[i];
				var regoinName = row.regoinName || "暂无";
				if(regointype!=2 && regointype!=3){
					sHtml += '<li class="nochild">' + regoinName + '<span></span></li>';
				}else{
					sHtml += '<li class="chlid"><h4>' + regoinName + '</h4>' +
					'<ul>'
					for(var a=0;a<row.downlist.length;a++){
						var raw = row.downlist[a];
						var chlidname = raw.regoinName||"暂无";
						sHtml += '<li class="childlist">' + chlidname + '</li>';
					}
					sHtml +=	'</ul>' +
					'</h4>'	+
					'</li>'
				}
			}
			$(".listinfo ul").html(sHtml);

	}

	//加载商圈等
	function gettrad(regointype,provincial,city){
		var param = {
			"provincial": provincial,
			"regointype": regointype,
			"city": city
		};
		reqAjaxAsync(USER_URL.QUERYTRAD,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				trading(res,regointype);
			}else{
				layer.msg(res.msg);
			}
		})
	}



	//点击全部中某一个分类
	$("#allClassify").on("click","li",function(){
		$(".listnav ul li").removeClass("actv");
		$(this).addClass("actv");
		var regointype = $(this).attr("data-id");
		var provincial = $(".selectarea").find(".provice-name").attr("data-id");
		var city = $(".selectarea").find(".city-name").attr("data-id");
		if(city=="-请选择-"){
			gettrad(regointype,provincial,"");
		}else{
			gettrad(regointype,provincial,city);
		}
	});




	//点击某个商圈广告机跳转
	$(".listinfo").on("click",".nochild",function(){
		$(".areaname").text("全部 > ");
		$(".listinfo ul li").removeClass("actv");
		$(this).addClass("actv");
		var val = $(this).text();
		var pval = $("#allClassify .actv").text();
		$(".areaname").append(pval+" > "+val);
		var address = $(".area-name").text()+val;
		var equipmentSN = $.trim($("#searchName").val());
		var status =$("#linestt").find("dl dd.layui-this").attr("lay-value") || "";
		$("#searchName").attr("data-cicle",val);
		$(".alllist").hide();
		getMerchaineList(address,status,equipmentSN);
		$(".tablist").attr("data-num",0);
	});

	//点击某个商圈广告机跳转（有第二层）
	$(".listinfo").on("click",".chlid .childlist",function(){
		$(".areaname").text("全部 > ");
		$(".listinfo ul li").removeClass("actv");
		$(this).addClass("actv");
		var val = $(this).text();
		var pval = $("#allClassify .actv").text();
		$(".areaname").append(pval+" > "+val);
		var address = $(".area-name").text()+val;
		var equipmentSN = $.trim($("#searchName").val());
		var status =$("#linestt").find("dl dd.layui-this").attr("lay-value") || "";
		$("#searchName").attr("data-cicle",val);
		$(".alllist").hide();
		getMerchaineList(address,status,equipmentSN);
		$(".tablist").attr("data-num",0);
	});

	//第三步轮播
	function thImgInfo(res,inx,type){// 1-图片
		var sHtml = "";
		var row = res.data.resData;
		if(inx==0){ //左边
			if(type==1){
				var imglf = [];
				$(".stepthree .leftvideos").hide();
				$(".stepthree #carousel_3").show();
				if(row.length>0){
					for(var i=0;i<row.length;i++){
						sHtml += '<div><img src="'+ row[i].resUrl +'" /></div>';
						imglf.push(row[i].resUrl);
					}
					$("#carousel_3 .lfu").html(sHtml);
					form.render();
					layui.use('carousel', function(){
						var carousel = layui.carousel;
						//建造实例
						carousel.render({
							elem: '#carousel_3'
							,width: '100%' //设置容器宽度
							,height:'100%'
							//,arrow: 'always' //始终显示箭头
							//,anim: 'updown' //切换动画方式
						});
					});
					if(row.length==1){
						$(".step").attr("data-lfimg",row[0].resUrl);
					}else{
						$(".step").attr("data-lfimg",imglf.join(";"));
					}
				}
			}else{
				$(".stepthree .leftvideos").show();
				$(".stepthree #carousel_3").hide();
				$(".stepthree .leftvideos").attr("src",row[0].resUrl);
				$(".step").attr("data-lfimg",row[0].resUrl);
			}
		}else if(inx==1){ //右边
			if(type==1){
				$(".stepthree .rgtvideo").hide();
				$(".stepthree #carousel_4").show();
				var rgtimg = [];
				if(row.length>0){
					for(var i=0;i<row.length;i++){
						sHtml += '<div><img src="'+ row[i].resUrl +'" /></div>';
						rgtimg.push(row[i].resUrl);
					}
					$("#carousel_4 .lfu").html(sHtml);
					form.render();
					layui.use('carousel', function(){
						var carousel = layui.carousel;
						//建造实例
						carousel.render({
							elem: '#carousel_4'
							,width: '100%' //设置容器宽度
							,height:'100%'
							//,arrow: 'always' //始终显示箭头
							//,anim: 'updown' //切换动画方式
						});
					});



					if(row.length==1){
						$(".step").attr("data-rgtimg",row[0].resUrl);
					}else{
						$(".step").attr("data-rgtimg",rgtimg.join(";"));
					}
				}
			}else{
				$(".stepthree .rgtvideo").show();
				$(".stepthree #carousel_4").hide();
				$(".stepthree .rgtvideo").attr("src",row[0].resUrl);
				$(".step").attr("data-rgtimg",row[0].resUrl);
			}
		}
	}





	//广告投放第三步(资源)
	function getImg(id,inx,type){
		var param = {
			"id":id
		}
		reqAjaxAsync(USER_URL.THREEINPUT,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				thImgInfo(res,inx,type);
			}else{
				layer.msg(res.msg);
			}
		})
	}

	//广告投放第三步（广告机宽高）
	function getWidth(){
		var param={};
		reqAjaxAsync(USER_URL.THREETWO,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				var row = res.data;
				var rwith = row[1].width || 0;
				var lwid = row[0].width || 0;
				if(rwith!=0&&lwid!=0){
					$(".hidetip span").text(2);
				}else{
					$(".hidetip span").text(1);
				}
				$("#sue").attr("data-lwidth",row[0].width || 0);
				$("#sue").attr("data-lheight",row[0].height || 0);
				$("#sue").attr("data-rwidth",row[1].width || 0);
				$("#sue").attr("data-rheight",row[1].height || 0);
				$("#sue").attr("data-slwidth",(row[0].width/100)*50);
				$("#sue").attr("data-slheight",(row[0].height/100)*50);
				$("#sue").attr("data-srwidth",(row[1].width/100)*50);
				$("#sue").attr("data-srheight",(row[1].height/100)*50);
				$("#sue").attr("data-blwidth",(row[0].width/100)*80);
				$("#sue").attr("data-blheight",(row[0].height/100)*80);
				$("#sue").attr("data-brwidth",(row[1].width/100)*80);
				$("#sue").attr("data-brheight",(row[1].height/100)*80);
				var infowidth = (row[0].width/100)*50 + (row[1].width/100)*50 + 200; //预览总宽
				var infoheight = (row[0].height/100)*50 + 300; //预览总高
				$("#sue").attr("data-sfumw",infowidth);
				$("#sue").attr("data-sfumh",infoheight);

				if(rwith==0){
					$(".stepthree .rightvideo").hide();
					$(".stepthree .leftimg").show();
					$(".stepthree .leftimg").css({"width":(row[0].width/100)*100 + 20,"height":(row[0].height/100)*100 + 20});
					$(".stepthree").height((row[0].height/100)*100 +20);
					$(".stepthree").width((row[0].width/100)*100 + 20);
				}else if(lwid==0){
					$(".stepthree .leftimg").hide();
					$(".stepthree .rightvideo").show();
					$(".stepthree .rightvideo").css({"width":(row[1].width/100)*100 + 20,"height":(row[1].height/100)*100 + 20});
					$(".stepthree").height((row[1].height/100)*100 +20);
					$(".stepthree").width((row[1].width/100)*100 + 20);
				}else{
					$(".stepthree .leftimg").show();
					$(".stepthree .rightvideo").show();
					$(".stepthree .leftimg").css({"width":(row[0].width/100)*90 + 20,"height":(row[0].height/100)*90 + 20});
					$(".stepthree .rightvideo").css({"width":(row[1].width/100)*90 + 20,"height":(row[1].height/100)*90 +20});
					$(".stepthree").height((row[0].height/100)*90 +60);
					$(".stepthree").width(1380);
				}
			}else{
				layer.msg(res.msg);
			}
		})
	}

	//查询广告列表方法
	function adversiting(res){
		var sHtml="";
		$(".hidetip").show();
		$(".hide-ctronl .layui-form-item").hide();
		$(".select-num").hide();
		if(res.data.length>0){
			layui.use('form', function() {
				form = layui.form;
				for (var i = 0; i < res.data.length; i++) {
					var row = res.data[i];
					sHtml += '<li data-id="' + row.id + '" data-resType="'+ row.resType +'">' +
					'<div class="chaeck layui-form-item">' +
					'<input class="checkboxad" type="checkbox" lay-filter="adverlis">' +
					'</div>' +
					'<div class="adver-img">'
						if(row.resType==1){
							if(row.coverUrl!=""){
								sHtml +=	'<img src="' + row.coverUrl + '">'
							}else{
								sHtml +=	'<img src="../common/img/default_img.png">'
							}
						}else{
							sHtml +=	'<img src="../common/img/video_01.png">'
						}

					sHtml +='</div>' +
					'<span class="detail-name">' + row.name + '</span>' +
					'<span class="detail-size">创建时间：' + row.createTime + '</span>' +
					' </li>'
				}
				$(".steptwo").html(sHtml);
				form.render();
				$(".twotip").hide();
				$(".steptwo li .chaeck").show();
			})
		}else{
			$(".steptwo").html("");
			$(".twotip").show();
		}

	}


	//加载广告列表
	function getAdversiting(address){
		var param = {
			"page": page,
			"rows": rows,
			"sort": "createTime",
			"order": "desc",
			"name": address// 广告名称
		}
		reqAjaxAsync(USER_URL.QUERYADVERSIT,JSON.stringify(param)).done(function(res){
			if(res.code==1){
				adversiting(res);
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
								reqAjaxAsync(USER_URL.QUERYADVERSIT,JSON.stringify(param)).done(function(res){
									if(res.code==1){
										adversiting(res);
										backstatuTwo();//第二步
									}else{
										layer.msg(res.msg);
									}
								})
							}
						}
					});

				});
			}else{
				layer.msg(res.msg);
			}
		})
	}

	//广告选择某两个
	form.on('checkbox(adverlis)', function(data){
		var a=$(".hidetip").attr("data-num");
		var nums = $(".hidetip span").text();
		if(data.elem.checked){
			if(nums==1){
				if(a<1){
					a++;
					$(".hidetip").attr("data-num",a);
					$(this).parents("li").addClass("avl");
					if(a>1){
						layer.msg("只能选中一个哟");
						$(this).parents("li").removeClass("avl");
						$(this).parents("li").find(".layui-unselect").className = "layui-unselect layui-form-checkbox";
						$(this).attr('checked', false);
						form.render();
					}else{
						var id= $(this).parents("li").attr("data-id");
						var restype = $(this).parents("li").attr("data-restype");
						commonAdtwo(1,"",id,restype);
					}
				}else{
					layer.msg("只能选中一个哟");
					$(this).parents("li").removeClass("avl");
					$(this).parents("li").find(".layui-unselect").className = "layui-unselect layui-form-checkbox";
					$(this).attr('checked', false);
					form.render();
				}
			}else{
				if(a<2){
					a++;
					$(".hidetip").attr("data-num",a);
					$(this).parents("li").addClass("avl");
					if(a>2){
						layer.msg("只能选中两个哟");
						$(this).parents("li").removeClass("avl");
						$(this).parents("li").find(".layui-unselect").className = "layui-unselect layui-form-checkbox";
						$(this).attr('checked', false);
						form.render();
					}else{
						var id= $(this).parents("li").attr("data-id");
						var restype = $(this).parents("li").attr("data-restype");
						commonAdtwo(1,"",id,restype);
					}
				}else{
					layer.msg("只能选中两个哟");
					$(this).parents("li").removeClass("avl");
					$(this).parents("li").find(".layui-unselect").className = "layui-unselect layui-form-checkbox";
					$(this).attr('checked', false);
					form.render();
				}
			}
		}else{
			a--;
			$(".hidetip").attr("data-num",a);
			$(this).parents("li").removeClass("avl");
			var text=$(this).parents("li").attr("data-id");
			var restype = $(this).parents("li").attr("data-restype")||1;
			commonAdtwo(1,text,"",restype);
		}
	})

	//确定投放
	$("#sue").click(function(){
		var id = $(".step").attr("data-oneid");//第一步广告机
		var sn = $(".step").attr("data-onesn");
		var mainResUrls = $(".step").attr("data-lfimg");//左侧地址
		var mainResWidth = $("#sue").attr("data-lwidth");
		var mainResHeight = $("#sue").attr("data-lheight");
		var sideResUrls = $(".step").attr("data-rgtimg");
		var sideResWidth =  $("#sue").attr("data-rwidth");
		var sideResHeight = $("#sue").attr("data-rheight");
		var resttype = $(".step").attr("data-twotype").split(",");
		var address1 =$(".step").attr("data-oneads1");
		var address2 = $(".step").attr("data-oneads2");
		var address3 = $(".step").attr("data-oneads3");
		var province = $(".area-name").attr("data-proname");
		var city = $(".area-name").text();
		var param = {
			"equipmentId":id,
			"runState":0,
			"mainResUrls":mainResUrls,
			"mainResWidth":mainResWidth,
			"mainResHeight":mainResHeight,
			"sideResUrls" :sideResUrls,
			"sideResWidth" :sideResWidth,
			"sideResHeight" :sideResHeight,
			"mainResType":resttype[0],
			"sideResType":resttype[1],
			"address1":address1,
			"address2":address2,
			"address3":address3,
			"equipmentSN":sn,
			"province":province,
			"city":city,
			"region":""
		}
		layer.confirm("确认投放？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
			reqAjaxAsync(USER_URL.INPUTAD, JSON.stringify(param)).done(function (res) {
				if (res.code == 1) {
					layer.close(index);
					layer.msg("投放成功");
					$(".hidetip").attr("data-num",0);
					var address1 = $(".area-name").text();
					var ads = $("#searchName").attr("data-cicle")||"";
					var address = address1+ads;
					var equipmentSN = $.trim($("#searchName").val());
					var statu = $("#linestt").find("dl dd.layui-this").attr("lay-value") || "";
					$(".hide-ctronl").hide();
					$(".advertising-topbox").show();
					$(".stepthree").hide();
					$(".stepone").show();
					getMerchaineList(address,statu,equipmentSN);
					commonAdtwo(0);
					commonAd(0);
					cencal();
				} else {
					layer.msg(res.msg);
				}
			})
		})
	});

	//查询区域列表
	function adverArea(res){
		var sHtml="";
		if(res.data.length>0){
			layui.use('form', function() {
				form = layui.form;
				for (var i = 0; i < res.data.length; i++) {
					var row = res.data[i];
					var raw = row.downlist || "";
					sHtml += '<div data-num="0" class="area-first data-id="'+row.regoinId+'">' +
						'<div class="areacheck"><i class="checks"></i>'+ row.regoinName +':</div>'+
					'<div class="area-child">'
						if(raw!=""){
							for(var k=0;k<raw.length;k++){
								sHtml +='<div data-num="0" data-id="' + raw[k].regoinId + '" ><i class="checks"></i>'+ raw[k].regoinName +'</div>'
							}
						}
					sHtml +=	'</div>' +
						'</div>'
				}
				$(".area-box").html(sHtml);
				form.render();
			})
		}else{
			$(".area-box").html("暂无数据");
		}

	}

	//加载区域
	function getArea(provincial,city){
		var param={
			"provincial":provincial,
			"city":city
		}
		reqAjaxAsync(USER_URL.AREALIST, JSON.stringify(param)).done(function (res) {
			if (res.code == 1) {
				adverArea(res);
			}else{
				layer.msg(res.msg);
			}
		})
	}



	//区域投放
	$("#addarea").click(function(){
		$(".areainput").show();
		$(".onlyinput").hide();
		$(".step1").hide();
		$(".step0").show();
		$("#cancel").attr("data-step",0);
		$(".advertising-topbox").hide();
		$(".hide-ctronl").show();
		$(".hide-ctronl .layui-form-item").show();
		$(".select-num").hide();
		$(".next").show();
		$(".ctronl-search").show();
		$(".chaeck").show();
		$("#selectall").hide();
		$("#sue").hide();
		var provincial =$(".area-name").attr("data-pro");
		var city = $(".area-name").attr("data-city");
		$(".addmore").hide();
		getArea(provincial,city); //查询区域
	});


	//区域全选反选
	$(".area-box").on("click",".areacheck .checks",function(){
		var num = $(this).parents(".area-first").attr("data-num");
		if(num==0){//全选
			$(this).parent().addClass("avl");
			$(this).parent().next().find("div").addClass("avl");
			$(this).parent().next().find("div").attr("data-num",1);
			$(this).parents(".area-first").attr("data-num",1);
		}else{//反选
			$(this).parent().removeClass("avl");
			$(this).parent().next().find("div").removeClass("avl");
			$(this).parent().next().find("div").attr("data-num",0);
			$(this).parents(".area-first").attr("data-num",0);
		}
	});

	//区域单个选择
	$(".area-box").on("click",".area-child .checks",function(){
		var num = $(this).parent().attr("data-num");
		if(num==0){ //选中
			$(this).parent().addClass("avl");
			$(this).parent().attr("data-num",1);
			var row = $(this).parents(".area-child").find("div");
			for(var i=0;i<row.length;i++){
				if(row.eq(i).attr("data-num")==0){
					return false;
				}
			}
			$(this).parents(".area-child").prev(".areacheck").addClass("avl");
			$(this).parents(".area-first").attr("data-num",1);
		}else{
			$(this).parent().removeClass("avl");
			$(this).parent().attr("data-num",0);
			$(this).parents(".area-child").prev(".areacheck").removeClass("avl");
			$(this).parents(".area-first").attr("data-num",0);
		}
	});

	//通过区域加载广告机
	function ajaxadver(str){
		var param = {
			"regionids": str
		}
		reqAjaxAsync(USER_URL.QUERYADVERMG, JSON.stringify(param)).done(function (res) {
			if (res.code == 1) {
				if(res.data.length>0){
					var oneidarr = [];
					var onesn = [];
					var oneads1 = [];
					var oneads2 = [];
					var oneads3 = [];
					for(var i=0;i<res.data.length;i++){
						var row = res.data[i];
						oneidarr.push(row.id);
						onesn.push(row.equipment_sn);
						oneads1.push(row.address1);
						oneads2.push(row.address2);
						oneads3.push(row.address3);
					}
					$(".step").attr("data-oneid",oneidarr);
					$(".step").attr("data-onesn",onesn);
					$(".step").attr("data-oneads1",oneads1);
					$(".step").attr("data-oneads2",oneads2);
					$(".step").attr("data-oneads3",oneads3);
					$("#cancel").attr("data-step",2);
					$(".step2 i").attr("class","steptacv");
					$(".areainput").fadeOut();
					setTimeout(function(){
						$(".steptwo").fadeIn();
						getAdversiting();//第二步
					//	$("#prev").fadeIn();
						$(".addmore").fadeIn();
					},1000)

				}else{
					layer.msg(res.msg);
				}
			}else{
				layer.msg(res.msg);
			}
		})
	}

})(jQuery)