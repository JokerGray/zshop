(function($) {
	var page = 1;
	var rows = 10;
	var USER_URL = {
		PROVINCE: 'operations/getProvinceList'//省市接口
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})

	//初始化
	$(function(){
		loadArea(0,".selectprovince"); //加载省
		$(".area-name").attr("data-proname","湖北省");
		$(".area-name").text("武汉市");
		$(".area-name").attr("data-pro","42");
		$(".area-name").attr("data-city","4201");
	})

		//点击选择
		$(".change").click(function(){
			$(".advertising-topbox").hide();
			$(".hide-ctronl").show();
			$(".hide-ctronl .layui-form-item").show();
			$(".select-num").show();
			$(".next").show();
			$(".ctronl-search").show();
			$(".chaeck").show();
			$("#sue").hide();
		});

		//取消
		$("#cancel").click(function(){
			$(".hide-ctronl").hide();
			$(".chaeck").hide();
			$(".advertising-topbox").show();
		});

		//地域选择
		$(".area-input").click(function(){ 
			var num = $(this).attr("data-num");
			if(num==0){
				$(this).attr("data-num",1);
				$(".area-all").show();
			}
			/*if(num==1){
				$(this).attr("data-num",0);
				$(".area-all").fadeOut(1000);
			}*/
		});

		//关闭地域
		$(".close").click(function(){
			var cityname = $(".city-name").text();
			var province = $(".provice-name").text();
			if(cityname=="-请选择-"){
				$(".area-input").attr("data-num",0);
				$(".area-all").hide();
			}else{
				$(".area-name").text(cityname);
				$(".area-input").attr("data-num",0);
				$(".area-all").hide();
			}
		});

	//省市初始化方法
	function areaInfo(res,e){
		var sHtml="";
		for(var i=0;i<res.data.length;i++){
			var row = res.data[i];
			sHtml += '<li >' +
						'<a data-id="' + row.code + '">' +
				 			'<span class="name" >' + row.areaname+ '</span>' +
						'</a>' +
			'</li>'
		}
		$(e).find("ul").html(sHtml);
	}


		 //省市加载
		function loadArea(code,e){
			var param = {
				"parentcode":code
			}

			reqAjaxAsync(USER_URL.PROVINCE, JSON.stringify(param)).done(function (res) {
				if (res.code == 1) {
					areaInfo(res,e)
				} else {
					layer.msg(res.msg);
				}
			})
		}

	//省市切换
	$(".selectarea").on("click","ul li",function(){
		$(".selectarea ul li").removeClass("actv");
		$(this).addClass("actv");
		var inx = $(this).index();
		var list = $(".area-all .arealist");
		list.removeClass("actv");
		list.eq(inx).addClass("actv");
		var code = $(".provice-name").attr("data-id");//省id
		if(inx==1){
			loadArea(code,".selectcity");//调用市的接口
		}
	});

	//省选择
	$(".selectprovince").on("click","li a",function(){
		var id = $(this).attr("data-id");
		var name = $(this).find("span").text();
		$(".selectprovince").find("li a span").css({"color":"#8c8e8c"});
		$(this).find("span").css({"color":"#3b9bff"});
		$(".provice-name").text(name);
		$(".provice-name").attr("data-id",id);
		$(".city-name").text("-请选择-");
		$(".city-name").attr("data-id","");
		$(".selectarea ul li").removeClass("actv");
		$(".selectarea ul li").eq(1).addClass("actv");
		loadArea(id,".selectcity");//调用市的接口
		var list = $(".area-all .arealist");
		list.removeClass("actv");
		list.eq(1).addClass("actv");
	});

	//市选择
	$(".selectcity").on("click","li a",function(){
		var id = $(this).attr("data-id");
		var name = $(this).find("span").text();
		var namse = $(".provice-name").text();
		var ids = $(".provice-name").attr("data-id")
		$(".selectcity").find("li a span").css({"color":"#8c8e8c"});
		$(this).find("span").css({"color":"#3b9bff"});
		$(".city-name").text(name);
		$(".city-name").attr("data-id",id);
		$(".area-name").attr("data-city",id);
		$(".area-name").attr("data-pro",ids);
		$(".area-name").attr("data-proname",namse);
		$(".area-name").text(name);
		$(".area-input").attr("data-num",0);
		$(".area-all").hide();

	});


})(jQuery)