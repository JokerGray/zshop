$(function(){
	var backUserId = theRequest['backUserId']==undefined?null:theRequest['backUserId'];
	var params1={backUserId:backUserId},
		params2={backUserId:backUserId,type:1};
	
	//查询团队下员工列表
	reqAjaxAsync('masterStatistics/getTeamBackUserList',JSON.stringify(params1)).done(function(res){
		if(res.code==1){
			var sHtml='';
			for(var i=0;i<res.data.length;i++){
				sHtml+="<div class='swiper-slide employer' id='"+res.data[i].id+"'>"+res.data[i].username+"</div>"
			}
			$('.swiper-wrapper').html(sHtml);
			//顶部选择团队插件
			var swiper = new Swiper('.swiper-container', {
		        slidesPerView: 5,
		        freeMode: true,
		    });
		}else{
			console.log(res.msg);
		}
	})
	
	//团队销售业绩/团队消耗业绩 
	function lineInit(params){
		reqAjaxAsync('masterStatistics/getTeamAchievement',JSON.stringify(params)).done(function(res){
			if(res.code==1){
				var arr1=new Array();
				var arr2=new Array();
				var arr3=new Array();
				for(var i=0;i<res.data.length;i++){
					arr1[i]=res.data[i].salePrice;
					arr2[i]=res.data[i].consumePrice;
					arr3[i]=res.data[i].time;
				}
				line1(arr3,arr1);
				line2(arr3,arr2);
			}else{
				console.log(res.msg);
			}
		})
	}
	lineInit(params2);
	
	//员工销售业绩/员工消耗业绩
	$('.header .swiper-wrapper').on('click','.employer',function(){
    	$('.header .swiper-wrapper div').removeClass('on');
    	$(this).addClass('on');
    	var emId=$(this).attr('id');
		var params3={backUserId:emId,type:2};
		lineInit(params3);
		$('#memberSale').text($(this).text());
		$('#memberConsume').text($(this).text());
    })
	
	//新客分析/赠送统计
	reqAjaxAsync('masterStatistics/getTeamNewAccount',JSON.stringify(params2)).done(function(res){
		if(res.code==1){
			var todayRegister=res.data.todayRegister;
			var monthRegister=res.data.monthRegister;
			var todayLargess=res.data.todayLargess;
			var monthLargess=res.data.monthLargess;
			if(monthRegister==0){
				var percent1=0;
			}else{
				var percent1=Math.floor(todayRegister/monthRegister*100);
			}
			if(monthLargess==0){
				var percent2=0;
			}else{
				var percent2=Math.floor(todayLargess/monthLargess*100);
			}
			$('#todayAmount .amounts').text(todayRegister);
			$('#monthAmount .amounts').text(monthRegister);
			$('#todayGifts .amounts').text(todayLargess);
			$('#monthGifts .amounts').text(monthLargess);
			//新客分析圆环图
			$('#circle1').attr('data-text',percent1+"%");
			$('#circle1').attr('data-percent',percent1);
			$('#circle1').circliful();
			//赠送统计圆环图
			$('#circle2').attr('data-text',percent2+"%");
			$('#circle2').attr('data-percent',percent2);
			$('#circle2').circliful();
		}else{
			console.log(res.msg);
		}
	})
	
})
