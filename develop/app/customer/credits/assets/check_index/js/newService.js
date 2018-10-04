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
			$(".navbar").getNiceScroll().hide();
			
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
			});		
			
			//鼠标悬浮左侧导航图标样式变化
			$('.lis').each(function(){
				$(this).mouseover(function(){
					if($(this).hasClass('on')==false){
						$(this).find('img').attr('src',ctx+'/assets/check_index/images/gukeguanlilv.png');
					}
				});
				$(this).mouseout(function(){
					if($(this).hasClass('on')==false){
						$(this).find('img').attr('src',ctx+'/assets/check_index/images/gukeguanli.png');
					}
				})
			});
			
			//返回首页样式变化
			$('.back').mouseover(function(){
				$(this).find('img').attr('src',ctx+'/assets/check_index/images/fanhuishouyelv.png');
			})
			$('.back').mouseout(function(){
				$(this).find('img').attr('src',ctx+'/assets/check_index/images/fanhuishouye.png');
			})
			
			//点击导航样式变化与导航子菜单显示隐藏
			$('.lis').each(function(i){
				$(this).click(function(){
					$('.lis').find('img').attr('src',ctx+'/assets/check_index/images/gukeguanli.png');
					$(this).find('img').attr('src',ctx+'/assets/check_index/images/gukeguanlilv.png');
					$('.lis').removeClass('on');
					$(this).addClass('on');
					$('.li-menu').slideUp();
					if($(this).next('.li-menu').size()!=0){
						if($(this).next('.li-menu').css('display')=='none'){
							$(this).next('.li-menu').slideDown();
						}else{
							$(this).next('.li-menu').slideUp();
						}
					}
				})
			})
						
			//服务选项卡
			//判断导航栏是否有子菜单
			$('.lis').each(function(){
				$(this).click(function(){
					if($(this).next('.li-menu').size()!=0){
						$(this).next('.li-menu').find('dd').each(function(){
//						$(this).click(function(){
						$(this).off('click').on('click',function(){
							$(".content-body").find('iframe').attr('src',$(this).find("a").attr("href"));
							$(this).removeClass('cardt');
							$('.li-menu dd').find('span').removeClass('on');
							$(this).find('span').addClass('on');
							var txt=$(this).text();
							var cl=$(this).attr('class');
							//判断选项卡栏是否为空
							if($('.card .row').html()==''){
								$('.card .row').append("<span class='card1 col-sm-1 on ecard ecard1'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
								//选项卡绑定关闭事件
								$('.ecard1 .iconfont13').click(function(){
									if($(this).parent('span').hasClass('on')){
										$(this).parent('span').remove();
										$('.lis').removeClass('on');
										$('.li-menu dd').find('span').removeClass('on');
										$(".content-body").find('iframe').attr('src',"");
										change();
									}
//									$(this).parent('span').remove();
//									$('.lis').removeClass('on');
//									$('.li-menu dd').find('span').removeClass('on');
//									$(".content-body").find('iframe').attr('src',"");
//									alert('没有进1')
								});
							}
							else{
								$('.card .card1').removeClass('on')
								$('.card1').each(function(i){
									//判断导航子菜单所对应的选项卡是否已经存在
									if($(this).find('.cardt').hasClass(cl)){
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
										$('.card .row').append("<span class='card1 col-sm-1 on ecard'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
										//判断已存在选项卡的长度
										var amounts=$('.card1').size();
										var cw1=cw/12;
										var ml=(amounts-12)*cw1;
										if(amounts>12){
											if(amounts>24){
												layer.msg('请先关闭一些选项卡再添加吧')
												$('.card1').width(cw1);
											}else{
												$('.iconfont14').animate({'opacity':'1'});
												$('.iconfont15').animate({'opacity':'1'});
												//容器row的宽度随选项卡数量动态增加，
												$('.card .row').width(cw1*amounts);
												//保持单个选项卡宽度保持原来宽度
												$('.card1').width(cw1);
												//容器向左滑动
												$('.card .row').animate({'marginLeft':'-'+ml+'px'});
											}	
										}	
										//当前选项卡绑定关闭事件与关闭后下一个选项卡样式变化并绑定导航样式
										$('.ecard .iconfont13').each(function(){
											$(this).click(function(){
											var index=$(this).parent('span').index();
												//判断当前选项卡是否是选中状态
												if($(this).parent('span').hasClass('on')){
													var len=$('.card1').size();
													$('.card1').each(function(){
														$('.card1').removeClass('on');
														//判断当前所选中的选项卡是否在最后位置
														if(index==len-1){
															$('.li-menu').css('display','none');
															var cl2=$('.card1').find('.cardt').eq(index-1).attr('class');
															//在最后位置时，关闭则前一个选项卡被自动选中
															$('.card1').eq(index-1).addClass('on');
															//前一个选项卡对应的是导航一级菜单
															$('.lis span').each(function(a){
																$('.lis span').addClass('cardt');
																if($('.lis span').eq(a).hasClass(cl2)){
//																	alert(11)
																	//导航随选项卡样式变化
																	$('.lis').removeClass('on');
																	$('.li-menu dd').find('span').removeClass('on');
																	$('.lis span').eq(a).parent('.lis').addClass('on');
																	//绑定ifrem点击事件
																	$(".content-body").find('iframe').attr('src',$('.lis').eq(a).find('a').attr('href'));
																	change();
																}
															})
															//前一个选项卡对应的是导航二级菜单
															$('.li-menu dd').each(function(b){
																$(this).addClass('cardt');
																if($('.li-menu dd').eq(b).hasClass(cl2)){
//																	alert(22)
																	//导航随选项卡动态变化
																	$('.lis').removeClass('on');
																	$('.li-menu dd').find('span').removeClass('on');
																	$('.li-menu dd').eq(b).parent('.li-menu').prev('.lis').addClass('on');
																	$('.li-menu dd').eq(b).parent('.li-menu').css('display','block');
																	$('.li-menu dd').eq(b).find('span').addClass('on');
																	//绑定ifrem点击事件
																	$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(b).find('a').attr('href'));
																	change();
																}
															})		
														}else{
															$('.li-menu').css('display','none');
															var cl2=$('.card1').find('.cardt').eq(index+1).attr('class');
															//不在最后位置，关闭则后一个选项卡被自动选中
															$('.card1').eq(index+1).addClass('on');
															//后一个选项卡对应的是导航一级菜单
															$('.lis span').each(function(a){
																$('.lis span').addClass('cardt');
																if($('.lis span').eq(a).hasClass(cl2)){
																	//导航随选项卡样式变化
																	$('.lis').removeClass('on');
																	$('.li-menu dd').find('span').removeClass('on');
																	$('.lis span').eq(a).parent('.lis').addClass('on');
																	//绑定ifrem点击事件
																	$(".content-body").find('iframe').attr('src',$('.lis').eq(a).find('a').attr('href'));
																	change();
																}
															});
															//后一个选项卡对应的是导航二级菜单
															$('.li-menu dd').each(function(b){
																$(this).addClass('cardt');
																if($('.li-menu dd').eq(b).hasClass(cl2)){
																	//导航随选项卡动态变化
																	$('.lis').removeClass('on');
																	$('.li-menu dd').find('span').removeClass('on');
																	$('.li-menu dd').eq(b).parent('.li-menu').prev('.lis').addClass('on');
																	$('.li-menu dd').eq(b).parent('.li-menu').css('display','block');
																	$('.li-menu dd').eq(b).find('span').addClass('on');
																	//绑定ifrem点击事件
																	$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(b).find('a').attr('href'));
																	change();
																}
															});
														}
														
													});
//													//判断关闭的是不是最后一个选项卡
//													if($('.card .row').html()==''){
//														$(".content-body").find('iframe').attr('src',"");
//													}
													$(this).parent('span').remove();
													//根据选项卡数量改变左右按钮的显示隐藏
													var butts=$('.card1').size();
													if(butts<13){
														$('.iconfont14').animate({'opacity':'0'});
														$('.iconfont15').animate({'opacity':'0'});
													}
												}
												//判断是不是最后一个选项卡
												if($('.card .row').html()==''){
													$('.lis').removeClass('on');
													$('.li-menu dd').find('span').removeClass('on');
													$(".content-body").find('iframe').attr('src',"");
													change();
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
										$('.ecard').each(function(){
											$(this).on('click',function(){
												$('.li-menu').css('display','none');
												$('.lis').removeClass('on');
												$('.card1').removeClass('on');
												$(this).addClass('on');
												var cl3=$(this).find('.cardt').attr('class');
												//点击选项卡对应的是导航二级菜单
												$('.li-menu dd').each(function(j){
													$(this).addClass('cardt');
													if($('.li-menu dd').eq(j).hasClass(cl3)){
														$('.li-menu dd').find('span').removeClass('on');
														$('.li-menu dd').eq(j).parent('.li-menu').css('display','block');
														$('.li-menu dd').eq(j).parent('.li-menu').prev('.lis').addClass('on');
														$('.li-menu dd').eq(j).find('span').addClass('on');
														//绑定ifrem点击事件
														$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(j).find('a').attr('href'));
														change();
													}
												});
												return false
											});
										});
										return false
									}
								})	
							}
						});
					});
				}else{
					$(".content-body").find('iframe').attr('src',$(this).find("a").attr("href"));
					$(this).find('span').removeClass('cardt');
					var txt=$(this).find('span').text();
					var cl=$(this).find('span').attr('class');
					//判断选项卡栏是否为空
					if($('.card .row').html()==''){
						$('.card .row').append("<span class='card1 col-sm-1 on fcard fcard1'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
						//选项卡绑定关闭事件
						service();
						//样式变化
						change();
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
								return false;
							}
							else if($('.card1').find('.cardt').hasClass(cl)==false){
								$('.card .row').append("<span class='card1 col-sm-1 on fcard'><i class='"+cl+" cardt'>"+txt+"</i><i class='iconfont iconfont13'>&#xe6d0;</i></span>");
								//判断已存在选项卡的长度
								var amounts=$('.card1').size();
								var cw1=cw/12;
								var ml=(amounts-12)*cw1;
								if(amounts>12){
									if(amounts>24){
										layer.msg('请先关闭一些选项卡再添加吧')
										$('.card1').width(cw1);
									}else{
										$('.iconfont14').animate({'opacity':'1'});
										$('.iconfont15').animate({'opacity':'1'});
										//容器row的宽度随选项卡数量动态增加，
										$('.card .row').width(cw1*amounts);
										//保持单个选项卡宽度保持原来宽度
										$('.card1').width(cw1);
										//容器向左滑动
										$('.card .row').animate({'marginLeft':'-'+ml+'px'});
									}	
								}	
								service();
								return false
							}
						})	
					}
				}
				return false;

				});
			});
			
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

});

function service(){
	//当前选项卡绑定关闭事件与关闭后下一个选项卡样式变化并绑定导航样式
	$('.fcard .iconfont13').each(function(){
		$(this).click(function(){
//		alert('进了2')
		var index=$(this).parent('span').index();
			//判断当前选项卡是否是选中状态
			if($(this).parent('span').hasClass('on')){
				var len=$('.card1').size();
				$('.card1').each(function(){
					$('.card1').removeClass('on');
					//判断当前所选中的选项卡是否在最后位置
					if(index==len-1){
						var cl2=$('.card1').find('.cardt').eq(index-1).attr('class');
						//在最后位置时，关闭则前一个选项卡被自动选中
						$('.card1').eq(index-1).addClass('on');
						//前一个选项卡对应的是导航一级菜单
						$('.lis span').each(function(a){
							$('.lis span').addClass('cardt');
							if($('.lis span').eq(a).hasClass(cl2)){
//								alert(1)
								//导航随选项卡动态变化
								$('.lis').removeClass('on');
								$('.li-menu dd').find('span').removeClass('on');
								$('.nav li span').eq(a).parent().addClass('on');
								//绑定ifrem点击事件
								$(".content-body").find('iframe').attr('src',$('.nav li').eq(a).find('a').attr('href'));
								change();
							}
						})	
						//前一个选项卡对应的是导航二级菜单
						$('.li-menu dd').each(function(b){
							$(this).addClass('cardt');
							if($('.li-menu dd').eq(b).hasClass(cl2)){
//								alert(2)
								//导航随选项卡动态变化
								$('.lis').removeClass('on');
								$('.li-menu dd').find('span').removeClass('on');
								$('.li-menu dd').eq(b).parent('.li-menu').prev('.lis').addClass('on');
								$('.li-menu dd').eq(b).parent('.li-menu').css('display','block');
								$('.li-menu dd').eq(b).find('span').addClass('on');
								//绑定ifrem点击事件
								$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(b).find('a').attr('href'));
								change();
							}
						})	
					}else{
						var cl2=$('.card1').find('.cardt').eq(index+1).attr('class');
						//不在最后位置，关闭则后一个选项卡被自动选中
						$('.card1').eq(index+1).addClass('on');
						//后一个选项卡对应的是导航一级菜单
						$('.lis span').each(function(a){
							$(this).addClass('cardt');
							if($('.lis span').eq(a).hasClass(cl2)){
								//导航随选项卡动态变化
								$('.lis').removeClass('on');
								$('.li-menu dd').find('span').removeClass('on');
								$('.lis').eq(a).addClass('on');
								$(".content-body").find('iframe').attr('src',$('.lis').eq(a).find('a').attr('href'));
								change();
							}
						})
						//后一个选项卡对应的是导航二级菜单
						$('.li-menu dd').each(function(b){
							$(this).addClass('cardt');
							if($('.li-menu dd').eq(b).hasClass(cl2)){
								//导航随选项卡动态变化
								$('.lis').removeClass('on');
								$('.li-menu dd').find('span').removeClass('on');
								$('.li-menu dd').eq(b).parent('.li-menu').prev('.lis').addClass('on');
								$('.li-menu dd').eq(b).parent('.li-menu').css('display','block');
								$('.li-menu dd').eq(b).find('span').addClass('on');
								$(".content-body").find('iframe').attr('src',$('.li-menu dd').eq(b).find('a').attr('href'));
								change();
							}
						})
					}
				})
				//判断关闭的是不是最后一个选项卡
//				if($('.card .row').html()==''){
//					$(".content-body").find('iframe').attr('src',"");
//				}
				$(this).parent('span').remove();
				//根据选项卡数量判断左右按钮显示隐藏
				var butts=$('.card1').size();
				if(butts<13){
					$('.iconfont14').animate({'opacity':'0'});
					$('.iconfont15').animate({'opacity':'0'});
				}
			}		
			//判断是不是最后一个选项卡
			if($('.card .row').html()==''){
				$('.lis').removeClass('on');
				$(".content-body").find('iframe').attr('src',"");
				change();
			}
			
			$(this).parent('span').remove();
			//容器row宽度随选项卡数量动态减少，同时改变位置
			var amounts2=$('.card1').size();
			var cw1=cw/12;
			if(amounts2>=12){
				$('.card .row').width(cw1*amounts2);
				if(amounts2==12){
					$('.card .row').animate({'marginLeft':'0px'});
				}
			}
			return false
		})
	})
	//当前选项卡点击样式变化事件绑定与选项卡绑定导航样式
	$('.fcard').each(function(){
		$(this).on('click',function(){
			change();
			$('.card1').removeClass('on');
			$('.li-menu').css('display','none');
			$('.li-menu dd').removeClass('on')
			$(this).addClass('on');
			var cl3=$(this).find('.cardt').attr('class');
			//点击选项卡对应的是导航一级菜单
			$('.nav li span').each(function(j){
				$(this).addClass('cardt');
				if($('.nav li span').eq(j).hasClass(cl3)){
					$('.nav li').removeClass('on');
					$('.nav li span').eq(j).parent().addClass('on');
					//绑定ifrem点击事件
					$(".content-body").find('iframe').attr('src',$('.nav li').eq(j).find('a').attr('href'));
					change();
				}
			})
			return false
		})

	});
}

//左侧导航图标变化执行函数
function change(){
	//根据on来改变导航图片路径
	$('.lis img').each(function(){
		$(this).attr('src',ctx+'/assets/check_index/images/gukeguanli.png');
		if($(this).parent().hasClass('on')){
			$(this).attr('src',ctx+'/assets/check_index/images/gukeguanlilv.png');
		}
	})
}
