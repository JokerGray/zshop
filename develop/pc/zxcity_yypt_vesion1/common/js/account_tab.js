	function change(tab,content){
		var $tab =  $(tab);
		$tab.find("li").eq(0).addClass("now");
		$tab.find("li").on("click",function(){
			var index = $(this).index();
			$(this).addClass("now").siblings().removeClass("now");
			$(content).children("div").eq(index).show().siblings().hide();
		})
	}
	change("#echartsTab","#echartsList");