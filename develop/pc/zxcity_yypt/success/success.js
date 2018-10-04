(function($){
	const   FINDANNOUNCEMNETS = 'operations/findAnnouncements',//查询公告
			MERCHANCOUMT='operations/merchantCountOf12Months'
	//滚动条优化
	 $('.ul-content').niceScroll({
                cursorcolor: "#ccc",//#CC0071 光标颜色
                cursoropacitymax: 0.5, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
                touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
                cursorwidth: "5px", //像素光标的宽度
                cursorborder: "0", // 	游标边框css定义
                cursorborderradius: "5px",//以像素为光标边界半径
                autohidemode: true //是否隐藏滚动条
            });
	
	//公告通知
	function commercialDetail(res) {
		        var sHtml = "";
		        var data = res.data;
		        if (res.code == 1) {
		           $.each(data,function(i,item){
		                sHtml += `<li data-toggle="modal">
		    					<p class="p-caption">`+item.caption+`</p>
		    					<p class="p-source" style="display:none">`+item.source+`</p>
		    					<p class="time">`+item.createTime.substring(0,16)+`</p>
		    					<div class="content" style="display:none">`+item.content+`</div>
    						     </li>`
		           })
			            $("#noticeUl").html(sHtml) 			
			        } else {
			            layer.msg(res.msg);
			        }
			}	
	function list(){
		var parms ="{'page':1,'rows':10000}"
		var res =reqAjax(FINDANNOUNCEMNETS,parms);
		commercialDetail(res)
	}
	list()
	
	
	//折线图数据
	var xAxisData = [];
	var seriesData = [];
	function detail(){
		var parms = {};
		var res =reqAjax(MERCHANCOUMT,parms);
		var data = res.data;
		$.each(data, function(i,item) {
			xAxisData.push(item.dt)
		});
		$.each(data, function(i,item) {
			seriesData.push(item.num)
		});
	}
	detail();
	console.log(xAxisData +"+++++"+seriesData)
	
	//客户统计折线图
		var myEchars = echarts.init(document.getElementById('myEchars'));
    	var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    magicType:{
                    	 type: ['line', 'bar']
                    }
                }
            },
            grid: {
                left: '3%',
                right:'3%',
                bottom: '3%',
                containLabel: true
            },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: xAxisData,
				axisLabel: {
					textStyle: {
						color: '#999', 
					},
					interval:0
				},
				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#eee'
					}
				}
			},

			yAxis: {
				type: 'value',
				axisLabel: {
					textStyle: {
						color: '#999', 
					},
					interval:0
				},
				axisLine: {
					lineStyle: {
						color: '#eee'
					}
				},
				splitLine:{  
			    	show:true,
			        lineStyle:{
				    	color:'#eee',
				    	width:1
			    	}
			   }
			},
			series: [{
				type: 'line',
				data:seriesData,
				symbolSize: 10,
				itemStyle: {
					normal: {
						color: '#f6c0c0',
						label: {
							show: true,
						},
						lineStyle: {
							normal: {
								width: 10,
								color: '#2ed9cd'
							}

						},
						areaStyle: {
							backgroundColor:'#2ed9cd'
						},
					}
				},

			}],

		}
    	myEchars.setOption(option);
    	window.onresize = myEchars.resize;//屏幕变化重新绘图
    	
    	
	//点击展示详情
	$('#noticeUl').on('click','li',function(){
		$(this).attr('data-target','#showNotice')
		var content = $(this).children('.content').html();
		var source = $(this).children('.p-source').html();
		var caption = $(this).children('.p-caption').html();
		var time = $(this).children('.time').html();
		var sHtml = `<h2 id="noticeTitle">`+caption+`</h2>
					<div class="noticeFrom">
						<div class="iBox">
							<span class="first">来源:<span id="from">`+source+`</span></span>
							<span>`+time.substring(0,16)+`</span>
						</div>
					</div>
					<div id="noticeContent">
						`+content+`
					</div>`
			$('#showNotice').on('show.bs.modal', function () {
						$('#showNotice .modal-body').html(sHtml)
        	})
		
	})
	
	
	//公告跳页
	$('#amore').on('click',function(){
		location.href = 'message_notice.html'
		$menuTree = window.top.$('#menu-tree');
		$menuTree.children('li').removeClass("act");
		$menuTree.children('li').children('a').removeClass("accv");
		$menuTree.children('li').children('dl').css("display","none");
		$menuTree.children('li').children('dl').children('dd').removeClass("actact");
		var $celveLi = $menuTree.children('li[data-num="6212e1b6-cc66-4c9a-bd04-f230f48441ea"]')
		$celveLi.addClass("act");
		$celveLi.children('a').addClass("accv");
		$celveLi.children('dl').css("display","block");
		$celveLi.children('dl').children('dd').addClass("actact");
	})

	
})(jQuery)
