//获取当前店铺的code码
//var kid = localStorage.getItem('provinceCode');
var REQUEST_URL = {
    queryScCmsAdvIndex: "cms_new/queryScCmsAdvIndex", //广告页面初始化
    queryScCmsAdvProvinces: "cms_new/queryScCmsAdvProvinces",//省市联动
    deliveryScCmsAdv:"cms_new/deliveryScCmsAdv"//投放广告
};
var $website = /^((http:\/\/)|(https:\/\/))[0-9a-zA-Z-.\/]{1,90}$/; //网址
var platForm=1001;//投放后台
var userID=localStorage.getItem("userId");
// userID=20;
var innerObj=new Object();
var TagArr=[];
var advStyleRes=new Object();
var SHOPID="";
var params=getParam();
console.log(params.m);
// if(params.m==1){
// 	platForm=1002;
// }
console.log(platForm);
//数组序号
Array.prototype.indexOf = function(val) {
for (var i = 0; i < this.length; i++) {
if (this[i] == val) return i;
}
return -1;
};
//数组删除
Array.prototype.remove = function(val) {
var index = this.indexOf(val);
if (index > -1) {
this.splice(index, 1);
}
};
//ajax封装
function getAjax(cmd,data,callback){
		var version = localStorage.getItem('version') || "1", //获取缓存 版本号
			  apikey = localStorage.getItem('apikey') || "test"; //获取缓存 通行证码	
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: true,
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
				callback(re);
			},
			error: function(re) {
				console.log(re);
			}
		});
}
// 不需要参数的ajax
function getAjax2(cmd,callback){
		var version = localStorage.getItem('version') || "1", //获取缓存 版本号
			  apikey = localStorage.getItem('apikey') || "test"; //获取缓存 通行证码	
		$.ajax({
			type: "POST",
			url: "/zxcity_restful/ws/rest",
			dataType: "json",
			async: true,
			data: {
				"cmd": cmd,
				"version": version
			},
			beforeSend: function(request) {
				request.setRequestHeader("apikey", apikey);
			},
			success: function(re) {
				console.log(re);
				callback(re);
			},
			error: function(re) {
				console.log(re);
			}
		});
}

function getParam(url) {
    var url = location.search;
    var params = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return params;
}
 //格式化视频长度
    function formatSeconds(value) {
        var theTime = parseInt(value); // 秒
        var theTime0 = 0; //秒
        var theTime1 = 0; //分
        var theTime2 = 0; //小时
        theTime0 = parseInt(theTime % 60);
        if (theTime > 3600) {
            theTime1 = parseInt(theTime / 60 % 60);
            theTime2 = parseInt(theTime / 60 / 60);
        } else {
            theTime1 = parseInt(theTime / 60);
        }
        var result = "" + parseInt(theTime0);
        if (theTime0 < 10) {
            result = "0" + result;
        }
        result = "" + parseInt(theTime1) + ":" + result;
        if (theTime1 < 10) {
            result = "0" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + ":" + result;
            if (theTime2 < 10) {
                result = "0" + result;
            }
        }
        return result;
    }


$(function(){
//	获取初始化数据
	if(platForm==1001){
		var getData=JSON.stringify({"platForm":platForm,"userId":0});
	}else{
		var getData=JSON.stringify({"platForm":platForm,"userId":userID});
	}

	getAjax(REQUEST_URL.queryScCmsAdvIndex,getData,showData);

	layui.use('layer', function(){
	  var layer = layui.layer;
	});
//	页面初始化
	function showData(re){
		showAdvPlaces(re);
		showAdvStyles(re);
		showAdvSources(re);
		showTags(re);
		showCity(re);
	}
	
	function showCity(re){
		var flag=JSON.stringify(re.data.code)=="{}";
		if(flag){
			$(".cityList1").show();
			var provData=JSON.stringify({"code":0});	
			getAjax(REQUEST_URL.queryScCmsAdvProvinces,provData,getProvince);
			var cityData=JSON.stringify({"code":11});	
			getAjax(REQUEST_URL.queryScCmsAdvProvinces,cityData,getCity);	
			function getProvince(re){
				showCityList(re,"prov1");
				showCityList(re,"prov2");		
			}
			function getCity(re){
				showCityList(re,"city1");		
			}
			
			function showCityList(re,id){
				$("#"+id).html("");
				var proArr=re.data;
				var optionHtml="";
				for(var i=0;i<proArr.length;i++){
					optionHtml+='<option value="'+proArr[i].code+'">'+proArr[i].areaname+'</option>';
				}
				$("#"+id).append(optionHtml);
				$("#"+id).parent().parent().attr("code",proArr[0].code);
			}
			$("#prov1").on("change",function(){
				var code=Number($(this).val());
				console.log(code);
				var newData=JSON.stringify({"code":code});
				getAjax(REQUEST_URL.queryScCmsAdvProvinces,newData,getCity);
			});
			$("#city1").on("change",function(){
				$(this).parent().parent().attr("code",$(this).val());
			});
			$("#prov2").on("change",function(){
				$(this).parent().parent().attr("code",$(this).val());
			});	
		}else{
			console.log(re.data.code);
			var mycode=re.data.code;
			$(".cityList2").find(".shopCity").attr("code",mycode.cityCode.code);
			$(".cityList2").find(".shopCity").find("label").html(mycode.cityCode.areaname);
			$(".cityList2").find(".shopPro").attr("code",mycode.provinceCode.code);
			$(".cityList2").find(".shopPro").find("label").html(mycode.provinceCode.areaname);
			$(".cityList2").show();			
		}
	}
	
//	展示投放广告位
	function showAdvPlaces(re){
		var advPlaces=re.data.advPlaces;
		var lihtml="";
		for(var i=0;i<advPlaces.length;i++){
			lihtml+='<li class="adtype_li" scCmsAdvPlaceId="'+advPlaces[i].scCmsAdvPlaceId+'">'+
							'<span class="mul_icon"></span>'+
							'<span class="adtype_txt">'+advPlaces[i].scCmsAdvPlaceName+'</span>'+
							'<span class="qus_icon" bgImg="'+advPlaces[i].scCmsAdvPlaceImg+'"></span>'+
					'</li>';
		}
		$("#adType").html(lihtml);
		//投放广告位的样式切换
		$(".mul_icon").on("click",function(){
			$(this).parent().siblings().removeClass("adtype_li_active");
			$(this).parent().addClass("adtype_li_active");
		});
		$(".mul_icon").eq(0).trigger("click");	
		$(".qus_icon").on("mousemove",function(){
			var imgSrc=$(this).attr("bgImg");
			$(".phone_model").html("<img src='"+imgSrc+"'/>");
			$(".phone_model").fadeIn("slow");
			$(".phone_model").on("click",function(){
				$(this).hide();
			});
			$(".phone_model").find("img").on("click",function(e){
				return false;
			});
		});
	}
//	展示投放广告的样式
	function showAdvStyles(re){
		var advStyles=re.data.advStyles;
		var lihtml="";
		for(var i=0;i<advStyles.length;i++){
			lihtml+='<li class="adStyle_li">'+
						'<span class="sig_icon" scCmsAdvStyleType="'+advStyles[i].scCmsAdvStyleType+'"></span>'+
						'<span class="adstyle_txt">'+advStyles[i].scCmsAdvStyleName+'</span>'+
					'</li>';
		}
		$("#adStyle").html(lihtml);
//		填入背景图
		for(var i=0;i<advStyles.length;i++){
			console.log(advStyles[i].scCmsAdvStyleImg);
			if(advStyles[i].scCmsAdvStyleType==6){
				console.log($(".adShow1").find(".showImg1").length);
				$(".adShow1").find(".showImg1").css({
					"background":"url("+advStyles[i].scCmsAdvStyleImg+") no-repeat center center",
					"background-size":"100% 100%"
				});
			}else if(advStyles[i].scCmsAdvStyleType==7){
				$(".adShow3").find(".showImg3").css({
					"background":"url("+advStyles[i].scCmsAdvStyleImg+") no-repeat center center",
					"background-size":"100% 100%"
				});				
			}else if(advStyles[i].scCmsAdvStyleType==8){
				$(".adShowV").find(".video-wrap").css({
					"background":"url("+advStyles[i].scCmsAdvStyleImg+") no-repeat center center",
					"background-size":"100% 100%"
				});				
			}
		}

		// 投放广告样式的切换
		$(".sig_icon").on("click",function(){
			advStyleRes={};
			$(this).parent().siblings().removeClass("adStyle_li_active");
			$(this).parent().addClass("adStyle_li_active");
			var index=$(this).parent().index();
			$(".adStyle_cont").hide();
			$("#adStyle"+(index+1)).show();
		});
		$(".sig_icon").eq(0).trigger("click");
//		图片上传插件加载
		$("#upload1,#upload2,#upload3,#upload4,#upload5,#upVedio").on("click",function(){
			advStyleRes={};
		});
		$("#sgTitle,#thrTitle,#vdTitle").on("input",function(){
			advStyleRes={};
		});
		runupload($("#upload1"),"imgLoad");
		runupload($("#upload2"),"imgLoad");		
		runupload($("#upload3"),"imgLoad");		
		runupload($("#upload4"),"imgLoad");		
		runupload($("#upVedio"),"videoLoad");
		runupload($("#upload5"),"imgLoad");	
//		点击预览
		$("#subStyle1").on("click",function(){
			advStyleRes={};
			if($("#upload1").find("img").length==0){
				layer.msg("请上传图片！");
				return false;
			}else{
				var sigImg=$("#upload1").find("img").attr("src");
				if($("#sgTitle").val()==""){
					layer.msg("请输入标题！");
					return false;
				}else{
					var sgTitle=$("#sgTitle").val();
				}
			}
			$(".adShow1").find(".adshow_tit").text(sgTitle);
			var imgH='<img src="'+sigImg+'"/>';
			$(".adShow1").find(".showImg1").html(imgH);
			var scCmsAdvStyleId=$(".adStyle_li_active").find(".sig_icon").attr("sccmsadvstyletype");
			scCmsAdvStyleId=Number(scCmsAdvStyleId);
			advStyleRes={
				scCmsAdvStyleResJson:
					[{
						resourcesName:"",
						resourcesUrl:sigImg,
						resourcesType:"cover",
						videoPlayTime:"",
						videoUrl:""
					}],
				scCmsAdvStyleId:scCmsAdvStyleId,
				scCmsAdvStyleResTitle:sgTitle
			}
		});
		
		$("#subStyle2").on("click",function(){
			advStyleRes={};
			if(($("#upload2").find("img").length==0)||($("#upload3").find("img").length==0)||($("#upload4").find("img").length==0)){
				layer.msg("请上传三张图片！");
				return false;
			}else{
				var imgArr=[];
				imgArr.push($("#upload2").find("img").attr("src"));
				imgArr.push($("#upload3").find("img").attr("src"));				
				imgArr.push($("#upload4").find("img").attr("src"));				
				if($("#thrTitle").val()==""){
					layer.msg("请输入标题！");
					return false;
				}else{
					var thrTitle=$("#thrTitle").val();
				}
			}
			$(".adShow3").find(".adshow_tit").text(thrTitle);
			for(var i=0;i<imgArr.length;i++){
				var imgH='<img src="'+imgArr[i]+'"/>';
				$(".adShow3").find(".showImg3").eq(i).html(imgH);			
			}
			var scCmsAdvStyleId=$(".adStyle_li_active").find(".sig_icon").attr("sccmsadvstyletype");
			scCmsAdvStyleId=Number(scCmsAdvStyleId);			
			advStyleRes={
				scCmsAdvStyleResJson:
					[
						{
							resourcesName:"",
							resourcesUrl:imgArr[0],
							resourcesType:"cover",
							videoPlayTime:"",
							videoUrl:""
						},
						{
							resourcesName:"",
							resourcesUrl:imgArr[1],
							resourcesType:"cover",
							videoPlayTime:"",
							videoUrl:""
						},					
						{
							resourcesName:"",
							resourcesUrl:imgArr[2],
							resourcesType:"cover",
							videoPlayTime:"",
							videoUrl:""
						}					
					],
				scCmsAdvStyleId:scCmsAdvStyleId,
				scCmsAdvStyleResTitle:thrTitle
			}
		});		

		$("#subStyle3").on("click",function(){
			advStyleRes={};
			if($(".vedioUrl").find("a").length==0){
				layer.msg("请上传视频！");
				return false;
			}else{
				var videoUrl=$(".vedioUrl").find("a").attr("href");
				if($("#upload5").find("img").length==0){
					layer.msg("请上传视频封面！");
					return false;
				}else{
					var vdImg=$("#upload5").find("img").attr("src");
					if($("#vdTitle").val()==""){
						layer.msg("请输入标题！");
						return false;
					}else{
						var vdTitle=$("#vdTitle").val();
					}
				}				
			}
			$(".adShowV").find(".adshow_tit").text(vdTitle);
			$(".play-video").html("").hide();
			var vdH='<video width="450" src="'+videoUrl+'" controls="controls"></video>';
			$(".play-video").html(vdH);
			var video=$("#vdhid")[0];
			var	times=formatSeconds(video.duration);
			var vedioContrl='<span id="play"></span><span class="vd_dur">'+times+'</span><img src="'+vdImg+'"/>';
			$(".adShowV").find(".video-wrap").html(vedioContrl);
			$(".adShowV").find(".video-wrap").show();
			$("#play").on("click",function(){
				$(this).parent().hide();
				$(".play-video").show();
				$(".play-video").find("video")[0].play();				
			});
			
			var scCmsAdvStyleId=$(".adStyle_li_active").find(".sig_icon").attr("sccmsadvstyletype");
			scCmsAdvStyleId=Number(scCmsAdvStyleId);			
			advStyleRes={
				scCmsAdvStyleResJson:
					[
						{
							resourcesName:"",
							resourcesUrl:vdImg,
							resourcesType:"video",
							videoPlayTime:times,
							videoUrl:videoUrl
						}									
					],
				scCmsAdvStyleId:scCmsAdvStyleId,
				scCmsAdvStyleResTitle:vdTitle
			}			
			layer.msg("展示成功");
		});
		
	}
	
	
//	展示广告来源
	function showAdvSources(re){
		var advSources=re.data.advSources;
//		判断是否有内部，外部广告
		var innerType=false,
			outerType=false;
		for(var a in advSources){
			if(advSources[a].scCmsAdvSourceType==2001){
				var innerType=true;
			}
			if(advSources[a].scCmsAdvSourceType==2002){
				var outerType=true;
			}
		}
//		App内部广告展示
		if(innerType){
			var innerli="";
			for(var i=0;i<advSources.length;i++){			
				if(advSources[i].scCmsAdvSourceType==2001){
					var typeObj=JSON.parse(advSources[i].scCmsAdvSourceUrl);
					console.log(typeObj);
					var type=typeObj.type;
					innerli+='<li class="inner_sorceli clear" adname="'+advSources[i].scCmsAdvSourceName+'" sccmsadvsourceid="'+advSources[i].scCmsAdvSourceId+'" type="'+type+'">'+
					  			'<span class="ad_stitle_icon" adname="'+advSources[i].scCmsAdvSourceName+'"></span><span class="ad_stitle_txt">'+advSources[i].scCmsAdvSourceName+'</span>'+
					  		'</li>';				
				}
				}
				var innerliBox="";
				innerliBox+='<li class="ad_sorceli clear innerSour">'+
					  '<div class="ad_stitle clear">'+
					  	'<span class="ad_stitle_icon"></span><span class="ad_stitle_txt">App内部广告</span>'+
					  '</div>'+
					  '<ul class="inner_sorce clear">'+innerli+
					  '</ul><div class="xz_ad" style="display:none;">已选择：云店广告</div>'+
					'</li>';
				$(".ad_sorce").append(innerliBox);
	//		内部广告切换
			$(".inner_sorceli>.ad_stitle_icon").on("click",function(){
				$(this).parent().parent().siblings(".ad_stitle").find(".ad_stitle_icon").trigger("click");
				$(this).parent().siblings().removeClass("inner_sorceli_active");
				$(this).parent().addClass("inner_sorceli_active");
				var typeName=$(this).parent().attr("type");
				chooseAdSorce(typeName,advSources,platForm);
			});	

				
		   }
		if(outerType){
			for(var i=0;i<advSources.length;i++){			
				if(advSources[i].scCmsAdvSourceType==2002){
					var outerliBox="";
					outerliBox+='<li class="ad_sorceli clear outerSour" sccmsadvsourceid="'+advSources[i].scCmsAdvSourceId+'">'+
						  '<div class="ad_stitle clear">'+
						  	'<span class="ad_stitle_icon"></span><span class="ad_stitle_txt">外部广告</span>'+
						  '</div>'+
						  '<div class="outer_source">请输入跳转链接：<input type="text" id="outerLink" placeholder="http或https开头的网址"></div>'
						'</li>';
					$(".ad_sorce").append(outerliBox);			
				}
				}			
		}
//		内部外部广告切换
		$(".ad_sorceli>.ad_stitle>.ad_stitle_icon").on("click",function(){
			$(".inner_sorce").find(".inner_sorceli").removeClass("inner_sorceli_active");
			$(this).parent().parent().addClass("ad_sorceli_active").siblings().removeClass("ad_sorceli_active");
		});		
		$(".ad_sorceli>.ad_stitle>.ad_stitle_icon").eq(0).trigger("click");	
		if(!isNull($("#outerLink"))){
			$("#outerLink").on("blur",function(){
				var value=$(this).val();
				if(value){
					if(!reg(value,$website)){
						layer.msg("请正确输入网址！");
						$(this).val("");
					}
				}
			});
		}		
	}
	
	// 针对不同的平台处理
	function  chooseAdSorce(type,advSources,playForm){
		innerObj={};
		if(playForm==1001){
			chooseAd1001(type,advSources);
		}else{
			chooseAdSorce1002(type);			
		}
	}  

	/*
	*function:1001平台下的弹出窗
	*param:type 弹出窗类型
	*/
	function chooseAd1001(type){
		console.log(type);
		switch(type){
			case "merchant":
				showListAndSearch1001("cms_new/selectAllMerchant");
				$("#brandSure").unbind("click");
				$("#brandSure").on("click",function(){
					var activeli=$("#brand .result_wrap").find(".result_active"),
						len=activeli.length,
						merchantId=activeli.attr("id"),
						orgName=activeli.attr("name");
						if(len){
							innerObj={
								type:"merchant",
								shopStatus:0,
								merchantId:merchantId
							}
							layer.msg("选择成功！");
							$("#brand").modal("hide");
						}else{
							layer.msg("请先选择品牌！");
							return false;
						}
				});
				break;
			case "cloud":
				showListAndSearch1001("cms_new/selectAllMerchant");
				$("#brandSure").unbind("click");
				$("#brandSure").on("click",function(){
					var activeli=$("#brand .result_wrap").find(".result_active"),
						len=activeli.length,
						merchantId=activeli.attr("id"),
						orgName=activeli.attr("name");
						if(len){
							innerObj={
								type:"merchant",
								shopStatus:0,
								merchantId:merchantId
							}							
							layer.msg("选择成功！");
							$("#brand").modal("hide");
							setTimeout(function(){
								showListAndSearch1001("shop/getUserManageShop");
								$("#brandSure").unbind("click");
								$("#brandSure").on("click",function(){
									var activeli=$("#brand .result_wrap").find(".result_active"),
										len=activeli.length,
										shopId=activeli.attr("id"),
										shopName=activeli.attr("name");
										if(len){
											innerObj={
												type:"cloud",
												shopId:shopId,
												shopName:shopName
											}
											layer.msg("选择成功！");
											$("#brand").modal("hide");
										}else{
											layer.msg("请先选择商铺！");
											return false;
										}
								});
							},1500);
						}else{
							layer.msg("请先选择品牌！");
							return false;
						}
				});				
				break;
			case "good":
				showListAndSearch1001("cms_new/selectAllMerchant");
				$("#brandSure").unbind("click");
				$("#brandSure").on("click",function(){
					var activeli=$("#brand .result_wrap").find(".result_active"),
						len=activeli.length,
						merchantId=activeli.attr("id"),
						orgName=activeli.attr("name");
						if(len){
							innerObj={
								type:"merchant",
								shopStatus:0,
								merchantId:merchantId
							}							
							layer.msg("选择成功！");
							$("#brand").modal("hide");
							setTimeout(function(){
								showListAndSearch1001("shop/getUserManageShop");
								$("#brandSure").unbind("click");
								$("#brandSure").on("click",function(){
									var activeli=$("#brand .result_wrap").find(".result_active"),
										len=activeli.length,
										shopId=activeli.attr("id"),
										shopName=activeli.attr("name");
										if(len){
											innerObj={
												type:"cloud",
												shopId:shopId,
												shopName:shopName
											}
											layer.msg("选择成功！");
											$("#brand").modal("hide");
											setTimeout(function(){
												showListAndSearch1001("shop/getShopOnShelfGoods");
												$("#brandSure").unbind("click");
												$("#brandSure").on("click",function(){
													var activeli=$("#brand .result_wrap").find(".result_active"),
														len=activeli.length,
														goodsId=activeli.attr("id"),
														goodsName=activeli.attr("name");
														if(len){
															innerObj={
																type:"good",
																id:goodsId,
																goodsName:goodsName,
																shopId:shopId
															}
															layer.msg("选择成功！");
															$("#brand").modal("hide");
														}else{
															layer.msg("请先选择品牌！");
															return false;
														}
												});
											},1500);
										}else{
											layer.msg("请先选择商铺！");
											return false;
										}
								});
							},1500);
						}else{
							layer.msg("请先选择品牌！");
							return false;
						}
				});	
				break;
			default:
				break;
		}
	}
	/*
	*function:1002平台下的弹出窗
	*param:type 弹出窗类型
	*/

	function  chooseAdSorce1002(type){
		switch(type){
			case "merchant":
				innerObj={
					type:"merchant",
					shopStatus:0,
					merchantId:params.merchantId
				}
				break;
			case "cloud":
				showListAndSearch1002("shop/getUserManageShop");
				$("#brandSure").unbind("click");
				$("#brandSure").on("click",function(){
					var activeli=$("#brand .result_wrap").find(".result_active"),
						len=activeli.length,
						shopId=activeli.attr("id"),
						shopName=activeli.attr("name");
						if(len){
							innerObj={
								userId:userID,
								type:"cloud",
								shopId:shopId,
								shopName:shopName
							}
							layer.msg("选择成功！");
							$("#brand").modal("hide");
						}else{
							layer.msg("请先选择云店！");
							return false;
						}
				});
				break;
			case "good":
				showListAndSearch1002("shop/getUserManageShop");
				$("#brandSure").unbind("click");
				$("#brandSure").on("click",function(){
					var activeli=$("#brand .result_wrap").find(".result_active"),
						len=activeli.length,
						shopId=activeli.attr("id"),
						shopName=activeli.attr("name");
						if(len){
							innerObj={
								type:"cloud",
								shopId:shopId,
								shopName:shopName
							}
							layer.msg("选择成功！");
							$("#brand").modal("hide");
							setTimeout(function(){
								showListAndSearch1002("shop/getShopOnShelfGoods");
								$("#brandSure").unbind("click");
								$("#brandSure").on("click",function(){
									var activeli=$("#brand .result_wrap").find(".result_active"),
										len=activeli.length,
										goodsId=activeli.attr("id"),
										goodsName=activeli.attr("name");
										if(len){
											innerObj={
												type:"cloud",
												id:shopId,
												goodsName:goodsName,
												shopId:shopId
											}
											layer.msg("选择成功！");
											$("#brand").modal("hide");
										}else{
											layer.msg("请先选择商品！");
											return false;
										}
								});								
							},1500);
						}else{
							layer.msg("请先选择云店！");
							return false;
						}
				});
				break;
			default:
				break;
		}

	}

	// 弹出页面的初始化和搜索事件
	function showListAndSearch1001(cmd){
		$("#brand").find("#searchBox").val("");
		if(cmd=="shop/getUserManageShop"){
			var userId=innerObj.merchantId;
			var parameter={
				isOnline:1,
				shopName:"",
				userId:userId
			}
			var parameters=JSON.stringify(parameter);
			getAjax(cmd,parameters,shopShow);
			$("#brand").find(".search").unbind("click");
			$("#brand").find(".search").on("click",function(){
				var value=$(this).prev().val();
				var parameter={
					isOnline:1,
					shopName:value,
					userId:userId
				}
				var parameters=JSON.stringify(parameter);
				getAjax(cmd,parameters,shopShow);				
			});
		}else if(cmd=="shop/getShopOnShelfGoods"){
			var shopId=innerObj.shopId;
			var parameter={
				shopId:shopId,
				goodsName:"",
			}
			var parameters=JSON.stringify(parameter);
			getAjax(cmd,parameters,goodsShow);
			$("#brand").find(".search").unbind("click");
			$("#brand").find(".search").on("click",function(){
				var value=$(this).prev().val();
				var parameter={
					shopId:shopId,
					goodsName:value,
				}
				var parameters=JSON.stringify(parameter);
				getAjax(cmd,parameters,goodsShow);				
			});
		}else if(cmd=="cms_new/selectAllMerchant"){
			var parameter={
				orgName:""
			}
			var parameters=JSON.stringify(parameter);
			getAjax(cmd,parameters,brandShow);
			$("#brand").find(".search").unbind("click");
			$("#brand").find(".search").on("click",function(){
				var value=$(this).prev().val();
				var parameter={
					orgName:value
				}
				var parameters=JSON.stringify(parameter);
				getAjax(cmd,parameters,brandShow);				
			});	
		}
	}

	// 弹出页面的初始化和搜索事件
	function showListAndSearch1002(cmd){
		$("#brand").find("#searchBox").val("");
		if(cmd=="shop/getUserManageShop"){
			var parameter={
				isOnline:1,
				shopName:"",
				userId:params.merchantId
			}
			var parameters=JSON.stringify(parameter);
			getAjax(cmd,parameters,shopShow);
			$("#brand").find(".search").unbind("click");
			$("#brand").find(".search").on("click",function(){
				var value=$(this).prev().val();
				var parameter={
					isOnline:1,
					shopName:value,
					userId:params.merchantId
				}
				var parameters=JSON.stringify(parameter);
				getAjax(cmd,parameters,shopShow);				
			});
		}else if(cmd=="shop/getShopOnShelfGoods"){
			var shopId=innerObj.shopId;
			var parameter={
				shopId:shopId,
				goodsName:"",
			}
			var parameters=JSON.stringify(parameter);
			getAjax(cmd,parameters,goodsShow);
			$("#brand").find(".search").unbind("click");
			$("#brand").find(".search").on("click",function(){
				var value=$(this).prev().val();
				var parameter={
					shopId:shopId,
					goodsName:value,
				}
				var parameters=JSON.stringify(parameter);
				getAjax(cmd,parameters,goodsShow);				
			});
		}
	}


	// 弹出品牌选择
	function brandShow(re){
		console.log(re);
		innerObj={};
		$("#brand").find(".modal-header").text("请选择品牌");
		var lihtml="";
		for(var i=0;i<re.data.length;i++){
			lihtml+='<li id="'+re.data[i].merchantId+'" name="'+re.data[i].orgName+'"><span></span>'+re.data[i].orgName+'</li>';
		}
		toggleChoose(lihtml);
	}
	// 弹出商店选择
	function shopShow(re){
		innerObj={};
		$("#brand").find(".modal-header").text("请选择商铺");
		var lihtml="";
		for(var i=0;i<re.data.length;i++){
			lihtml+='<li id="'+re.data[i].shopId+'" name="'+re.data[i].shopName+'"><span></span>'+re.data[i].shopName+'</li>';
		}	
		toggleChoose(lihtml);
	}
	// 弹出商品选择	
	function goodsShow(re){
		innerObj={};
		$("#brand").find(".modal-header").text("请选择商品");
		var lihtml="";
		for(var i=0;i<re.data.length;i++){
			lihtml+='<li id="'+re.data[i].id+'" name="'+re.data[i].goodsName+'"><span></span>'+re.data[i].goodsName+'</li>';
		}
		toggleChoose(lihtml);
	}	
	// 生成的选择样式切换
	function toggleChoose(lihtml){
		$("#brand").find(".result_wrap").html(lihtml);
		$("#brand").modal("show");
		$("#brand").find(".result_wrap>li").find("span").on("click",function(){
			$(this).parent().toggleClass("result_active").siblings().removeClass("result_active");
		});		
	}



	function showTags(re){
//		弹出窗加入标签
		var cmsFrequencies=re.data.cmsFrequencies;
	
		$("#chooseTags").on("click",function(){
			var	newTagArr=[].concat(TagArr);
			$("#tags").modal("show");
		   function hasTag1(str){
				for(var a in newTagArr){
					if(str==newTagArr[a]){
						return true;
					}
				}
				return false;
		   }


			var tagsli="";
			for(var i=0;i<cmsFrequencies.length;i++){
				if(hasTag1(cmsFrequencies[i].labelName)){
					tagsli+='<li class="result_active"><span></span>'+cmsFrequencies[i].labelName+'</li>';						
				}else{
					tagsli+='<li><span></span>'+cmsFrequencies[i].labelName+'</li>';
				}
			}
			$("#optionalTags").html(tagsli);
			$("#optionalTags>li>span").on("click",function(){
					var thisLi=$(this).parent(),
						flag=thisLi.hasClass("result_active"),
						thisTxt=thisLi.text(),
						len=newTagArr.length;
					if(flag){
						thisLi.removeClass("result_active");
						newTagArr.remove(thisTxt);
					}else{
						if(len<5){
						  thisLi.addClass("result_active");
						  newTagArr.push(thisTxt);
						}else{
							layer.msg("标签数小于5");
							return false;
						}
					}
			});	
			$("#addTag1").unbind("click");
			$("#addTag1").on("click",function(){
				TagArr=newTagArr;
				showTagArr();
				$("#tags").modal("hide");					
			});
		});

//		自己输入标签
		$("#inputTag").on("input",function(){
			var value=$(this).val();
			if(/(,|，)/i.test(value)){
				layer.msg("请不要包含，");
				$(this).val("");
			}
		});
		$(".tag_sub").on("click",function(){
			var tagNum=TagArr.length;
			var inputVal=$("#inputTag").val();
			if(tagNum<5){
				if(inputVal){
					if(!hasTag2(inputVal)){
						TagArr.push(inputVal);
						var index=TagArr.length-1;
					}else{
						layer.msg("已有的标签！");
						return false;
					};
					showTagArr();
					$("#inputTag").val("");			
				}else{
					layer.msg("请输入自定义标签！");
				}
			}else if(tagNum>=5){
				layer.msg("不要超过5个标签！");
			}

			function hasTag2(str){
				for(var a in TagArr){
					if(str==TagArr[a]){
						return true;
					}
				}
				return false;
			}
				
		});
	}
	
	function showTagArr(){
		var tagHtml="";
		for(var i=0;i<TagArr.length;i++){
			tagHtml+='<span class="tag">'+TagArr[i]+'<i></i></span>';
		}	
		$(".showTags").html(tagHtml);
	    $(".showTags").delegate("i","click",function(){
				$(this).parent().remove();
				var text=$(this).parent().text();
				TagArr.remove(text);
		});			
	}

	
	//	投放区域切换
	$(".ad_areali>span").on("click",function(){
		$(this).parent().siblings().removeClass("ad_areali_active");
		$(this).parent().addClass("ad_areali_active");		
	})
	
	$("#submit").on("click",function(){
//		$("#showModel").modal("show");
		var subObj=new Object();
		//判断广告类型为自营或非自营
		subObj["ScCmsAdvType"] = 0;
//		寻找页面广告类型
		var $adtype=$(".adtype_li_active");
		subObj["scCmsAdvPlaceId"]=Number($adtype.attr("sccmsadvplaceid"));
		var scCmsAdvPlaceName=$adtype.find(".adtype_txt").text();
//选择广告投放样式
		var styleName=$("#adStyle").find(".adStyle_li_active").text();
		if(JSON.stringify(advStyleRes)=="{}"){
			layer.msg("请提交预览上传的广告投放样式！");
			return false;
		}
		subObj["advStyleRes"]=advStyleRes;
//		寻找页面广告来源
		var sourceName="";
		var $adSour=$(".ad_sorceli_active");
		if($adSour.hasClass("innerSour")){
			if(!$(".inner_sorceli_active").length){
				layer.msg("请选择内部广告类型！");
				return false;
			}else{
				var scCmsAdvSourceId=$(".inner_sorceli_active").attr("sccmsadvsourceid");
				sourceName=$(".inner_sorceli_active").attr("adname");
				if(JSON.stringify(innerObj)=="{}"){
					layer.msg("请输入云店或商品！");
					return false;
				}
				subObj["scCmsAdvSourceId"]=scCmsAdvSourceId;
				subObj["scCmsAdvjump"]=innerObj;
			}
		}else if($adSour.hasClass("outerSour")){
			var outlink=$("#outerLink").val();
			if(outlink==""){
				layer.msg("请输入外部链接地址！");
				return false;
			}else{
				subObj["scCmsAdvSourceId"]=Number($adSour.attr("sccmsadvsourceid"));
				subObj["scCmsAdvjump"]={
					type:"url",
					url:outlink
				}
			}
			sourceName="外部广告";
		}
//		选择城市
		// 判断城市是自选还是展示
		var hide1=$(".cityList1").is(":hidden");
		var hide2=$(".cityList2").is(":hidden");
		if(hide1){
			var scCmsAdvCity=Number($(".cityList2").find(".ad_areali_active").attr("code"));
		}else{
			var scCmsAdvCity=Number($(".cityList1").find(".ad_areali_active").attr("code"));
		}
		subObj["scCmsAdvCity"]=scCmsAdvCity;
		var startVal=$("#startTime").val(),
			endVal=$("#endTime").val(),
			startTime=startVal+" 00:00:00",
			endTime=endVal+" 23:59:59";
		if(startVal==""){
			layer.msg("请输入广告投放时间！");
			return false;
		}
		if(endVal==""){
			layer.msg("请输入广告投放时间！");
			return false;
		}		
		subObj["scCmsAdvStart"]=startTime;
		subObj["scCmsAdvEnd"]=endTime;
		console.log(subObj);
//		判断是否有标签
		if(TagArr.length==0){
			layer.msg("请输入标签");
			return false;			
		}
		var tagStr=TagArr.join(",");
		subObj["scCmsAdvLable"]=tagStr;	
		subObj["scCmsAdvPlatForm"]=platForm;
		subObj["scCmsAdvRelease"]=userID;
		subObj["scCmsAdvExamine"]=1;
		subObj["scCmsAdvState"]=1;
		console.log(subObj);
		console.log(scCmsAdvPlaceName);
		$("#showModel").find(".items1").text(scCmsAdvPlaceName);
		$("#showModel").find(".items2").text(sourceName);		
		$("#showModel").find(".items3").text(startVal+"~"+endVal);	
		var tagsHtml="";
		for(var i=0;i<TagArr.length;i++){
			tagsHtml+='<span class="tag">'+TagArr[i]+'</span>';
		}
		$("#showModel").find(".items4").html(tagsHtml);
		$("#showModel").find(".showAd").html('<div class="showAd_title"></div>');
		$("#showModel").find(".showAd_title").html('广告样式'+'<span style="color:blue;">['+styleName+']</span>')
		if(styleName=="单图"){
			$("#showModel").find(".showAd").append($("#adStyle1").find(".adShow1").clone(true));
		}else if(styleName=="三图"){
			$("#showModel").find(".showAd").append($("#adStyle2").find(".adShow3").clone(true));			
		}else if(styleName=="视频"){
			$("#showModel").find(".showAd").append($("#adStyle3").find(".adShowV").clone(true));
			$("#showModel").find(".showAd").find(".video-wrap").show();
			$("#showModel").find(".showAd").find(".play-video").hide();
			$("#showModel").find("#play").unbind("click");
			$("#showModel").find("#play").on("click",function(){
				$(this).parent().hide();
				$("#showModel").find(".showAd").find(".play-video").show();
				$("#showModel").find(".showAd").find(".play-video").find("video")[0].play();
			});				
		}
		$("#showModel").modal("show");
		$("#showModel").on("hidden.bs.modal",function(){
			$(".play-video").hide();
			$(".video-wrap").show();
		});
		var subdata=JSON.stringify(subObj);
		$("#showModel").find(".ensure_btn").unbind("click");
		$("#showModel").find(".ensure_btn").on("click",function(){
			getAjax(REQUEST_URL.deliveryScCmsAdv,subdata,submitShow);
		});
	});
		
		function submitShow(re){
			layer.msg(re.msg);
			$("#showModel").find(".ensure_btn").unbind("click");
			if(re.code == 1) {
				setTimeout(function(){
					var index = layer.load(0, {shade: false});
				},1000);
				setTimeout(function(){
					window.location.reload();
				},2000);
			}
		}
		
		//点击日期获取时间
		if ($("#startTime") != undefined) {
			var setOpt={
		    format: 'yyyy-mm-dd',
		    minView: 'month',
		    language: 'zh-CN',
		    autoclose: true,
		    pickerPosition: 'top-right',
		    startDate: new Date()
		 };
		  $("#startTime").datetimepicker(setOpt).on("changeDate", function () {
		  	var choosedDate=$(this).val();
		  	console.log(choosedDate);
		  	$("#endTime").datetimepicker("remove");
		  	$("#endTime").datetimepicker(setOpt);
		    $("#endTime").datetimepicker("setStartDate",choosedDate);	
		    $("#endTime").datetimepicker("setEndDate",getNextMonth(choosedDate));
		  });
		  $("#endTime").datetimepicker(setOpt).on("changeDate", function () {
		  	var choosedDate=$(this).val();
		  	$("#startTime").datetimepicker("remove");
		  	$("#startTime").datetimepicker(setOpt);
		    $("#startTime").datetimepicker("setStartDate",moreToday(getPreMonth(choosedDate)));	
		    $("#startTime").datetimepicker("setEndDate",choosedDate);		  	
		  });
		}
//		    获取上一个月
   			function getPreMonth(date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        }
        /**
         * 获取下一个月
         *
         * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
         */        
        function getNextMonth(date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中的月的天数
            var year2 = year;
            var month2 = parseInt(month) + 1;
            if (month2 == 13) {
                year2 = parseInt(year2) + 1;
                month2 = 1;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        }	
        function moreToday(data){
        	var data1=new Date(data);
        	var data2=new Date();
        	var t1=data1.getTime();
        	var t2=data2.getTime();
        	if(t1>t2){
        		return data1;
        	}else{
        		return data2;
        	}
        }

	
})
