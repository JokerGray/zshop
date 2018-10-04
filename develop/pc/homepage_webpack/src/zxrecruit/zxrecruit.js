import './zxRecruit.scss';
import util from '../util/util.js';
import '../common/iconfonts/iconfont.css';

//菜单变色
$(".nav-list li").removeClass("active");
$(".nav-list").find("li").eq(2).addClass("active");
var _left = $('.nav-header .nav-list>li.active').offset().left - $('.nav-container .nav-line-block').offset().left;
$('.nav-container .nav-line').css('left', _left);

var mySwiper = new Swiper('.swiper-container', {
    autoplay: true,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function(i, className){
            return '<span class="'+className+'"><i></i></span>'
        }
    }
})

// 筛选栏 选择效果
$('.filter-content>li').on('mouseover',function(){
    $($(this).children()[2]).show();
});
$('.filter-content>li').on('mouseout',function(){
    $($(this).children()[2]).hide();
})

$('.filter-content li ul li').on('click',function(){
    $(this).addClass('active').siblings().removeClass('active').parent().parent().find('span').text($(this).text()).addClass('active').parent().find('ul').hide();
    // this指向问题
    var that = $(this).parent().parent().siblings();
    $(this).parent().parent().siblings().each(function(i,v){
        if(i > 0){
            $(that[i]).find('span').removeClass('active').text($(that[i]).find('ul li').first().text()).parent().find('ul li').removeClass('active');
        }
    });
});

//招聘信息展开折叠
$('#listCont').on('click','li .drop-dowm',function(){
	$(this).parent().parent().hide().siblings('.job-detail').slideDown();
})
$('#listCont').on('click','li .drop-up',function(){
	$(this).parent().parent().slideUp().siblings('.list-row').slideDown();
})


//获取数据
function getData(){
	var parm={
		workType:$('.filter-content li span.active').eq(1).text(),
		src:'gw',
		city:'武汉'
	};
	util.reqAjax('operations/findScRecruitTalent',parm).then(function(res){
		var data=res.data;
		var divstring="";
		$('.pull-right span').text(res.total)
		$.each(data, function(i,item) {
		    divstring+=`
                <li class="list-item">
                    <div class="list-row">
                        <div class="col-sm-3">
                            <a href="#" target="_blank">`+item.positionName+`</a>
                        </div>
                        <div class="col-sm-2">`+item.workType+`</div>
                        <div class="col-sm-2">`+item.city+`</div>
                        <div class="col-sm-2">`+item.recruitNum+`位</div>
                        <div class="col-sm-3">
                            `+item.createTime.slice(0,9)+`
                            <a class="drop-dowm pull-right glyphicon glyphicon-menu-down"></a>
                        </div>
                    </div>
                    <div class="job-detail" style="display: none;">
                        <div class="job-demand">
                            <span>`+item.positionName+`/<span class="demand-count">`+item.recruitNum+`</span>人</span>
                            <a class="drop-up pull-right glyphicon glyphicon-menu-up"></a>
                        </div>
                        <div class="job-duty">
                            <h3>岗位职责：</h3>
                            <p>
                               	`+item.workDuty+`
                            </p>
                            <h3>任职要求：</h3>
                            <p>
                               `+item.workRestd+`
                            </p>
                        </div>
                        <div class="job-send">
                            <span class="pack-up pull-left">收起</span>
                            <!-- <a href="/" class="pull-right">投个简历</a> -->
                        </div>
                    </div>
                </li>				
			`
		});
		$('#listCont').html(divstring);
		if(data.length==0){
			$('#layPage').hide();
		}else{
			// 分页
			$('#layPage').show();
			layui.use('laypage', function(){
				var data=[];
				for(var i=0;i<$('#listCont .list-item').length;i++){
					data.push($('#listCont .list-item')[i].innerHTML)
				}
				var laypage=layui.laypage
				laypage.render({
					elem:'layPage',
					count:$('#listCont .list-item').length,
					theme:'#d70c2a',
					prev:'<i class="iconfont icon-left"></i>',
					next:'<i class="iconfont icon-right"></i>',
					jump:function(obj){
						//渲染
						document.getElementById('listCont').innerHTML=function(){
							var arr=[]
							,thisData=data.concat().splice(obj.curr*obj.limit-obj.limit,obj.limit);
							layui.each(thisData,function(index,item){
								arr.push('<li class="list-item">'+item+'</li>')
							});
							return arr.join('');
						}();
					}
				})			
			});			
		}
		
		
	});
};
getData();

$('.down-menu').click('li',function(){
	getData();
})
