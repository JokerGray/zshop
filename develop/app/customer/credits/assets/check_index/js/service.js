$(function(){
			//iframe框架高度动态变化
			var h1=$('.content-head').height();
			var h2=$('.card-option').height();
			var h=$(window).height();
			$('.content-body').height(h-h1-h2);
			//滚动条插件
			$(".navbar").niceScroll({
				cursorcolor: "transparent",
				cursoropacitymax: 1,
				touchbehavior: false,
				cursorwidth: "2px",
				cursorborder: "0",
				cursorborderradius: "5px"
			});
			
			//左侧导航隐藏显示
			$('.show-hide').click(function(){
				if($('.navbar').css('width')!='0px'){
					$('.navbar .logo').css('opacity','0');
					$('.navbar .nav').css('opacity','0');
					$('.navbar').animate({'width':'0px'});
					$('.content').animate({'width':'100%'});
					$(this).find('img').attr('src',ctx+'/assets/check_index/images/zhankai.png');
					$(this).find('img').attr('title','展开菜单');
				}else{
					$('.navbar').animate({'width':'8.33%'});
					$('.content').animate({'width':'91.67%'});
					$('.navbar .logo').css('opacity','1');
					$('.navbar .nav').css('opacity','1');
					$(this).find('img').attr('src',ctx+'/assets/check_index/images/shouqi.png');
					$(this).find('img').attr('title','收起菜单');
				}
			})
			
			//导航样式变化与导航子菜单显示隐藏
			$('.navbar .nav li').each(function(m){
				$(this).click(function(){
					$('.navbar .nav li').removeClass('on');
					$(this).addClass('on');
					$('.li-menu').each(function(){
						if($('.li-menu').eq(m).css('display')=='none'){
							$('.li-menu').css('display','none');
							$('.li-menu').eq(m).slideDown();
							return false
						}else{
							$('.li-menu').eq(m).slideUp();
							return false
						}
					})
				})
			})
						
			//服务选项卡
			//判断是否有子菜单
			if($('.li-menu').size()!=0){
					$('.li-menu dd').each(function(){
					$(this).click(function(){
						$(this).removeClass('cardt');
						$('.li-menu dd').find('span').removeClass('on');
						$(this).find('span').addClass('on');
						var txt=$(this).text();
						var cl=$(this).attr('class');
						//判断选项卡栏是否为空
						if($('.card .row').html()==''){
							$('.card .row').append("<span class='card1 col-sm-1 on'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
							//选项卡绑定关闭事件
							$('.iconfont13').each(function(){
								$(this).on('click',function(){
									$(this).parent('span').remove();
								})
							})	
						}
						else{
							$('.card .card1').removeClass('on')
							$('.card1').each(function(i){
								//判断导航子菜单所对应的选项卡是否已经存在
								if($('.card1').eq(i).find('.cardt').hasClass(cl)){		
									$('.card1').eq(i).addClass('on');
									//判断导航子菜单对应已存在的选项卡位置是否在可视位置
									var cw1=cw/12;
									cw2=Math.floor(cw1);
									cw3=Math.ceil($('.card1').eq(i).position().left);
									cw4=Math.floor(cw);
									if(cw3<=-cw2){
										//前12个选项卡非可视情况,row回到初始位置
										$('.card .row').animate({'marginLeft':'0px'});
									}else if(cw3>=cw4){
										//后12个选项卡非可视情况，row滑到最左
										$('.card .row').animate({'marginLeft':'-'+cw+'px'});
									}
									return false
								}
								else if($('.card1').find('.cardt').hasClass(cl)==false){
									$('.card .row').append("<span class='card1 col-sm-1 on'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
									
									//判断已存在选项卡的长度
									var amounts=$('.card1').size();
									var cw1=cw/12;
									var ml=(amounts-12)*cw1;
									if(amounts>12){
										if(amounts>24){
											layer.msg('请先关闭一些选项卡再添加吧')
											$('.card1').width(cw1);
										}else{
											//容器row的宽度随选项卡数量动态增加，
											$('.card .row').width(cw1*amounts);
											//保持单个选项卡宽度保持原来宽度
											$('.card1').width(cw1);
											//容器向左滑动
											$('.card .row').animate({'marginLeft':'-'+ml+'px'});
										}	
									}		
									//当前选项卡绑定关闭事件与关闭后下一个选项卡样式变化并绑定导航样式
									$('.iconfont13').each(function(){
										$(this).on('click',function(){
										var index=$(this).parent('span').index();
											//判断当前选项卡是否是选中状态
											if($(this).parent('span').hasClass('on')){
												$('.lis').removeClass('on');
												$('.li-menu dd').find('span').removeClass('on');
												var len=$('.card1').size();
												$('.card1').each(function(){
													$('.card1').removeClass('on');
													//判断当前所选中的选项卡是否在最后位置
													if(index==len-1){
														$('.li-menu').css('display','none');
														var cl2=$('.card1').find('.cardt').eq(index-1).attr('class');
														//在最后位置时，关闭则前一个选项卡被自动选中
														$('.card1').eq(index-1).addClass('on');
														$('.li-menu dd').each(function(a){
															$(this).addClass('cardt');
															if($('.li-menu dd').eq(a).hasClass(cl2)){
																//导航随选项卡动态变化
																$('.li-menu dd').find('span').removeClass('on');
																$('.li-menu dd').eq(a).parent('.li-menu').css('display','block');
																$('.li-menu dd').eq(a).parent('.li-menu').prev('.lis').addClass('on');
																$('.li-menu dd').eq(a).find('span').addClass('on');
																//绑定ifrem点击事件
																$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(a).find('a').attr('href'));
																return false
															}
														})		
													}else{
														$('.li-menu').css('display','none');
														var cl2=$('.card1').find('.cardt').eq(index+1).attr('class');
														//不在最后位置，关闭则后一个选项卡被自动选中
														$('.card1').eq(index+1).addClass('on');
														$('.li-menu dd').each(function(a){
															$(this).addClass('cardt');
															if($('.li-menu dd').eq(a).hasClass(cl2)){
																//导航随选项卡动态变化
																$('.li-menu dd').find('span').removeClass('on');
																$('.li-menu dd').eq(a).parent('.li-menu').css('display','block');
																$('.li-menu dd').eq(a).parent('.li-menu').prev('.lis').addClass('on');
																$('.li-menu dd').eq(a).find('span').addClass('on');
																//绑定ifrem点击事件
																$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(a).find('a').attr('href'));
																return false
															}
														})
													}	
													
												})
												//判断关闭的是不是最后一个选项卡
												if($('.card .row').html()==''){
													$(".content-body").find('iframe').attr('src',"");
												}
												$(this).parent('span').remove();
											}		
											//判断关闭的是不是最后一个选项卡
											if($('.card .row').html()==''){
												$(".content-body").find('iframe').attr('src',"");
											}
											$(this).parent('span').remove();
											//容器row宽度随选项卡数量动态减少，同时改变位置
											var amounts1=$('.card1').size();
												if(amounts1>=12){
													$('.card .row').width(cw1*amounts1);
													if(amounts1==12){
														$('.card .row').animate({'marginLeft':'0px'});
													}
												}
											return false
										})
									})
									//当前选项卡点击样式变化事件绑定与选项卡绑定导航样式
									$('.card1').each(function(){
										$(this).on('click',function(){
											$('.li-menu').css('display','none');
											$('.lis').removeClass('on');
											$('.card1').removeClass('on');
											$(this).addClass('on');
											var cl3=$(this).find('.cardt').attr('class');
											$('.li-menu dd').each(function(j){
												$(this).addClass('cardt');
												if($('.li-menu dd').eq(j).hasClass(cl3)){
													$('.li-menu dd').find('span').removeClass('on');
													$('.li-menu dd').eq(j).parent('.li-menu').css('display','block');
													$('.li-menu dd').eq(j).parent('.li-menu').prev('.lis').addClass('on');
													$('.li-menu dd').eq(j).find('span').addClass('on');
													//绑定ifrem点击事件
													$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(j).find('a').attr('href'));
//										$(this).on('click',function(){
//											$('.li-menu').css('display','none');
//											$('.card1').removeClass('on');
//											$(this).addClass('on');
//											var cl3=$(this).find('.cardt').attr('class');
//											$('.li-menu dd').each(function(j){
//												$(this).addClass('cardt');
//												if($('.li-menu dd').eq(j).hasClass(cl3)){
//													$('.li-menu dd').find('span').removeClass('on');
//													$('.li-menu dd').eq(j).parent('.li-menu').css('display','block');
//													$('.li-menu dd').eq(j).find('span').addClass('on');
												}
											});
											return false
										});
									});
									return false
								}
							})	
						}
						
					})
				})	
			}
			else{
				$('.nav li').each(function(){
					$(this).click(function(){
						$(this).find('span').removeClass('cardt');
						var txt=$(this).find('span').text();
						var cl=$(this).find('span').attr('class');
					//判断选项卡栏是否为空
					if($('.card .row').html()==''){
						$('.card .row').append("<span class='card1 col-sm-1 on'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
						//选项卡绑定关闭事件
						$('.iconfont13').each(function(){
							$(this).on('click',function(){
								$(this).parent('span').remove();
								if($('.card .row').html()==''){
									$(".content-body").find('iframe').attr('src',"");
								}
							});
						})	
					}
					else{
						$('.card .card1').removeClass('on')
						$('.card1').each(function(i){
							//判断导航子菜单所对应的选项卡是否已经存在
							if($('.card1').eq(i).find('.cardt').hasClass(cl)){	
								$('.card1').eq(i).addClass('on');
								return false
								
							}
							else if($('.card1').find('.cardt').hasClass(cl)==false){
								$('.card .row').append("<span class='card1 col-sm-1 on'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
								//当前选项卡绑定关闭事件与关闭后下一个选项卡样式变化并绑定导航样式
								$('.iconfont13').each(function(){
									$(this).on('click',function(){
									var index=$(this).parent('span').index();
										//判断当前选项卡是否是选中状态
										if($(this).parent('span').hasClass('on')){
											$('.lis').removeClass('on');
											var len=$('.card1').size();
											$('.card1').each(function(){
												$('.card1').removeClass('on');
												//判断当前所选中的选项卡是否在最后位置
												if(index==len-1){
													var cl2=$('.card1').find('.cardt').eq(index-1).attr('class');
													//在最后位置时，关闭则前一个选项卡被自动选中
													$('.card1').eq(index-1).addClass('on');
													$('.nav li span').each(function(a){
														$(this).addClass('cardt');
														if($('.nav li span').eq(a).hasClass(cl2)){
															//导航随选项卡动态变化
															$('.nav li').removeClass('on');
															$('.nav li').eq(a).addClass('on');
															//绑定ifrem点击事件
															$(".content-body").find('iframe').attr('src',$('.nav li').eq(a).find('a').attr('href'));
															return false
														}
													});		
												}else{
													var cl2=$('.card1').find('.cardt').eq(index+1).attr('class');
													//不在最后位置，关闭则后一个选项卡被自动选中
													$('.card1').eq(index+1).addClass('on');
													$('.nav li span').each(function(a){
														$(this).addClass('cardt');
														if($('.nav li span').eq(a).hasClass(cl2)){
															//导航随选项卡动态变化
															$('.nav li').removeClass('on');
															$('.nav li').eq(a).addClass('on');
															//绑定ifrem点击事件
															$(".content-body").find('iframe').attr('src',$('.nav li').eq(a).find('a').attr('href'));
															return false
														}
													})
												}	
												
											});
											$(this).parent('span').remove();
										}		
										//判断关闭的是不是最后一个选项卡
										if($('.card .row').html()==''){
											$(".content-body").find('iframe').attr('src',"");
										}
										$(this).parent('span').remove();
										return false
									})
								})
								//当前选项卡点击样式变化事件绑定与选项卡绑定导航样式
								$('.card1').each(function(){
									$(this).on('click',function(){
										$('.card1').removeClass('on');
										$(this).addClass('on');
										var cl3=$(this).find('.cardt').attr('class');
										$('.nav li span').each(function(j){
											$(this).addClass('cardt');
											if($('.nav li span').eq(j).hasClass(cl3)){
												$('.nav li').removeClass('on');
												$('.nav li').eq(j).addClass('on');
												//绑定ifrem点击事件
												$(".content-body").find('iframe').attr('src',$('.nav li').eq(j).find('a').attr('href'));
											}
										});
										return false
									});
									
								})
								return false
							}
						})	
					}
					})
				})
			}

			//选项卡div左右移动操作
			var cw=$('.card .row').width();
			//点击向左滑动
			$('.iconfont14').click(function(){
				var marl=parseInt($('.card .row').css('marginLeft'))
					if(marl<0){
							$('.card .row').animate({'marginLeft':'0'})
						}
				})
			//点击向右滑动
			$('.iconfont15').click(function(){
				var amounts=$('.card1').size();
				var marl=parseInt($('.card .row').css('marginLeft'))
				if(amounts>12){
					if(marl==0){
							$('.card .row').animate({'marginLeft':'-'+cw+'px'})
						}
					}
			})
			
			//操作关闭其他选项卡和关闭全部选项卡
			$('.close-rest').click(function(){
				$('.card1').each(function(k){
					if($(this).hasClass('on')==false){
						$(this).remove();
						$('.card .row').animate({'marginLeft':'0'})
					}
				})
			})
			$('.close-all').click(function(){
				$('.card1').each(function(k){
					$('.card1').remove();
					$(".content-body").find('iframe').attr('src',"");
				})
			})
			
			//点击给iframe添加src
			$('.li1').each(function(){
				$(this).click(function(){
					var hr=$(this).find('a').attr('href');
					$(".content-body").find('iframe').attr('src',hr);
				})
			})
			$('.li-menu').each(function(){
				$(this).find('dd').click(function(){
					var hr=$(this).find('a').attr('href');
					$(".content-body").find('iframe').attr('src',hr);
				})
			})
			var menuID = $("#checkedId").val();
			$("."+menuID).click();
})
