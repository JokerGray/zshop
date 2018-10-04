(function($) {
	var page = 1;
	var rows = 10;
	var userno = yyCache.get("userno") || "";
	var username = yyCache.get('username') || "";
	var locked = true;
	var USER_URL = {
		ZDMANAGE : 'operations/dictItemsGroupByType',//(字典管理获取视频限制大小)
		QUERTYSOURCE : 'operations/pageQueryResource',//(广告资源查询) restype 1-图片 2-视频 status -1删除  0禁用  1待审核 2 审核通过  4审核未通过
		ADDRESOURCE : 'operations/addAdResourceOne',//(新增)
		DELUSER : 'operations/deleteAdResource', //(删除)
		QUERYADVER : 'operations/queryAdSpace' //(查询广告位宽高)
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})

	$(function(){ //初始化
		var adtype = sessionStorage.getItem("adtype") ||"";
		getadver();
		if(adtype==""){
			getSource("1");//首次加载图片
		}else{
			$("#searchName").val("");
			$(".tab-change .tablist").removeClass("acv");
			$(".tab-change .tablist").eq(parseInt(adtype)-1).addClass("acv");
			getSource(adtype);
		}
	});

		//查询广告位宽高
		function getadver(){
			var param = {};
			reqAjaxAsync(USER_URL.QUERYADVER, JSON.stringify(param)).done(function (res) {
				if (res.code == 1) {
					$(".imgarr").attr("data-width1",res.data[0].width);
					$(".imgarr").attr("data-height1",res.data[0].height);
					$(".imgarr").attr("data-width2",res.data[1].width || "a");
					$(".imgarr").attr("data-height2",res.data[1].height || "a");
				}else{
					layer.msg(res.msg);
				}
			})
		}

		//调用字典获得视频限制大小
		function getVideo(){
			var param = {
			'code':'GK_SPDX'
			}
			reqAjaxAsync(USER_URL.ZDMANAGE, JSON.stringify(param)).done(function (res) {
				if (res.code == 1) {
					$(".video-size").text(res.data[0].val + "mb");
				}else{
					layer.msg(res.msg);
				}
			})
		}

	//列表初始化
	function source(res,type){
		var sHtml = "";
		if(res.data.length>0){
			$(".havadata").show();
			$(".nodata2").hide();
			layui.use('form', function() {
				form = layui.form;
				for (var i = 0; i < res.data.length; i++) {
					var row = res.data[i];
					if(type==1){
						var url = row.url;
					}else{
						var url = "";
					}
					sHtml += '<li data-id="' + row.id + '" data-resType="' + row.resType + '" data-statu = "' + row.status + '" data-time="' + row.createtime + '">' +
					'<div class="chaeck layui-form-item">' +
					'<input class="checkboxinpu" type="checkbox" name="like" lay-filter="advermer">' +
					'</div>' +
					'<div class="iminfo">'
					if(type==1){
						sHtml +='<img src="' + row.url + '">';
					}else{
						sHtml +='<img data-video="' + row.url + '" src="../common/img/video_01.png">';
					}
					sHtml +='<span class="detail-name">' + row.resName + '</span>' +
					'<span class="detail-size">' + row.resWidth + 'x' + row.resHight + '</span>' +
					'</div>'+
					'</li>';
				}
				$(".detail").html(sHtml);
				form.render();
			})
		}else{
			$(".havadata").hide();
			$(".nodata2").show();
		}

	}

	//加载资源列表
	function getSource(type,tit){
		var param = {
			"restype" :type,
			"page":page,
			"rows":rows,
			"resname":tit
		}
		reqAjaxAsync(USER_URL.QUERTYSOURCE,JSON.stringify(param)).done(function(res) {
			if (res.code == 1) {
				source(res,type);

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
								reqAjaxAsync(USER_URL.QUERTYSOURCE,JSON.stringify(param)).done(function(res){
									if(res.code==1){
										source(res,type);
										$("#selectall").find(".layui-unselect").removeClass("layui-form-checked");
										$("#selectall").find(".allcheck").checked = false;
										$(".selnum").text(0);
										var numss = $(".change").attr("data-num");
										if(numss==1){
											$(".detail li").find(".chaeck").show();
										}else{
											$(".detail li").find(".chaeck").hide();
										}
									}else{
										layer.msg(res.msg);
									}
								})
							}
						}
					});

				});
			} else {
				layer.msg(res.msg);
			}
		})
	}

	//tab切换
	$(".tab-change").on("click",".tablist",function(){
		$(".tab-change .tablist").removeClass("acv");
		var inx = $(this).index();
		$(this).addClass("acv");
		$("#searchName").val("");
		getSource(parseInt(inx)+1);
		sessionStorage.setItem("adtype",parseInt(inx)+1);
	});

	//首页搜索
	$("#search").click(function(){
		var tit = $.trim($("#searchName").val());
		var inx = $(".tab-change .acv").index();
		getSource(parseInt(inx)+1,tit);
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
				$(".detail li").addClass("avl");
			}
		if(data.elem.checked==false){
				$(".selnum").text(0);
				var chs = document.getElementsByClassName("checkboxinpu");
				for (var i = 0; i < chs.length; i++) {
					chs[i].checked = false;
				}
				var chlist = $(".detail li").find(".layui-form-checked");
				for (var i = 0; i < chlist.length; i++) {
					chlist[i].className = "layui-unselect layui-form-checkbox";
				}
				$(".detail li").removeClass("avl");
			}
			var num = $(".selnum").text();
	});

	//勾选其中某几个
	form.on('checkbox(advermer)', function(data){
		var a=$(".selnum").text();
		console.log(data.elem.checked); //是否被选中，true或者false
		if(data.elem.checked){
			a++;
			if(a>0){
				$("#selectall").find(".layui-unselect").addClass("layui-form-checked");
				$("#selectall").find(".allcheck").checked = true;
			}
			$(".selnum").text(a);
			$(this).parents("li").addClass("avl");
		}else{
			a--;
			$(".selnum").text(a);
			$(this).parents("li").removeClass("avl");
			if(a==0){
				$("#selectall").find(".layui-unselect").removeClass("layui-form-checked");
				$("#selectall").find(".allcheck").checked = false;
			}
		}
	})

	//选择之后的删除
	$("#del").click(function(){
		var list = $(".detail li.avl");
		var arr = [];
		for(var i=0;i<list.length;i++){
			arr.push(list.eq(i).attr("data-id"));
		}
		var listarr = arr.join(",");
		console.log(listarr);
		getDel(listarr,2);
	});

	//选择页面搜索
	$("#ctronlSearch").click(function(){
		var val = $.trim($("#selectName").val());
		var inx =$(".tab-change .acv").index();
		if(inx==0){
			getSource("1",val);
		}else{
			getSource("2",val);
		}
		$(".detail li").find(".chaeck").show();
	});

	//点击取消
	$("#cancel").click(function(){
		var shtml = '<input type="checkbox" name="" title="本页全选" lay-skin="primary" lay-filter="all">';
		$(".advertising-topbox").show();
		$(".hide-ctronl").fadeOut();
		$(".selnum").text(0);
		$(".change").attr("data-num",0);
		$("#selectall").html(shtml);
		form.render();
		$(".detail li").removeClass("avl");
		$(".detail li").show();
		var list = $(".detail").find(".layui-unselect");
		for(var i=0;i<list.length;i++){
			list.eq(i).removeClass("layui-form-checked");
		}
	});

	//点击选择
	$(".change").click(function(){
		$(this).attr("data-num",1);
		$(".detail li").find(".chaeck").show();
		});

	//点击查看详情
	$(".detail").on("click",".iminfo",function(){
		var non = $(".change").attr("data-num");
		if(non==0){
			$(".detail li").removeClass("acv");
			$(this).parents("li").addClass("acv");
			layer.open({
				title: false,
				type: 1,
				content:$('#info'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				area: ['870px', '380px'],
				shade: [0.1, '#fff'],
				end:function(){
					$('#info').hide();
				},
				success:function(layero){
					setTimeout(function() {
						 $(layero).removeClass('layer-anim');
					}, 0);
					var parent = $(".detail .acv");
					var img = parent.find("img").attr("src");
					var vides = parent.find("img").attr("data-video");
					var name =parent.find(".detail-name").text();
					var id = parent.attr("data-id");
					var status = parent.attr("data-statu");
					var resType = parent.attr("data-resType");
					var time = parent.attr("data-time");
					$(".source-name").text(name);
					$(".source-time").text(time);
					/*if(status==-1){
						$(".source-statu").text("删除");
					}else if(status==0){
						$(".source-statu").text("禁用");
					}else if(status==1){
						$(".source-statu").text("待审核");
					}else if(status==2){
						$(".source-statu").text("审核通过");
					}else if(status==4){
						$(".source-statu").text("审核未通过");
					}*/
					if(resType==1){
						$(".source-type").text("图片");
						$("#imgs").attr("src",img);
						$("#vids").hide();
						$("#vids").attr("src","");
						$("#imgs").show();
					}else{
						$(".source-type").text("视频");
						$("#vids").attr("src","");
						$("#vids").attr("src",vides);
						$("#imgs").hide();
						$("#vids").show();
					}
					//删除
					$(".dels").click(function(){
						getDel(id,1);
					});
				}
			});
		}
	});

		//删除
		function getDel(id,type){ //type 1-详情时删除 2-选择删除
			if(id==""){
				layer.msg("请选择后在删除");
				return false;
			}
			var param = {
				"id":id
			}
			layer.confirm("确认删除？",{icon:3,title:"提示",shade: [0.2, '#fff']}, function (index) {
				reqAjaxAsync(USER_URL.DELUSER,JSON.stringify(param)).done(function(res) {
					if (res.code == 1) {
						var num = $(".tab-change .acv").index();
						var tit = $.trim($("#searchName").val());
						$(".hide-ctronl").hide();
						$(".advertising-topbox").show();
						if(type==1){
							layer.closeAll();
							layer.msg("删除成功");
							if(num==0){
								getSource("1",tit);
							}else{
								getSource("2",tit);
							}
						}
						if(type==2){
							layer.closeAll();
							layer.msg("删除成功");
							if(num==0){
								getSource("1",tit);
							}else{
								getSource("2",tit);
							}
						}
						$(".change").attr("data-num",0);
					} else {
						layer.msg(res.msg);
					}
				})
			})
		}

	//裁剪通用
	function cutImg(e,width,height){
		$(e).click(function(){
			var len = $("#previews .editor_img").length;
			if(len==0){
				layer.msg("请先上传图片");
			}else{
				var oldwidth = $("#previews").find(".editor_img").width();
				var oldheight = $("#previews").find(".editor_img").height();
				//图片裁剪
					if(e=="#cutbtn"){
						$("#cutbtn1").hide();
						$("#cutbtn").hide();
					}
					if(e=="#cutbtn1"){
						$("#cutbtn").hide();
						$("#cutbtn1").hide();
					}
				/*var newwid = width/2;
				var newhrt = height/2;*/
				$(".editor_img").hide();
				$(".editor_imghid").show();
					var jcropApi;
					$('.editor_imghid').Jcrop({
						setImage: function(){
							console.log(this.getBounds())
						},
						setSelect: [ 0, 0, width, height],
						allowSelect:false,
						allowResize:false,
						allowMove:true,
						bgFade:false,
						removeFilter:true,
						onSelect: function (obj){
							$("#x1").val(obj.x);
							$("#y1").val(obj.y);
							$("#x2").val(obj.x2);
							$("#y2").val(obj.y2);
							$("#w").val(obj.w);
							$("#h").val(obj.h);
							// var ratio = this.getBounds()[0] / 690;
							var srcStr = $("#previews .editor_imghid").attr('src');
							if(srcStr.indexOf('?') != -1) {
								srcStr = srcStr.substring(0, srcStr.indexOf('?'));
							}
							srcStr = srcStr + '?x-oss-process=image/crop,x_'+ Math.floor(obj.x) +',y_'+ Math.floor(obj.y) +',w_'+ Math.floor(width) +',h_'+ Math.floor(height) +',g_nw';
							console.log(srcStr)
							$("#previews .editor_img").attr('data-src', srcStr);
							$("#previews .editor_img").attr("data-width",width);
							$("#previews .editor_img").attr("data-height",height);
						},
						//*aspectRatio: 16/9,
						maxSize: [width, height],
						minSize: [width, height],
						boxWidth: 600
					}, function() {
						jcropApi = this;
						console.log(jcropApi.getBounds())
					});

			}
		});
	}


		 //新增
		 $('#addsource').on('click',function(){
			 var txt = $(".tab-change .acv").index();
  			layer.open({
			  title: ['新增资源', 'font-size:12px;background-color:#0678CE;color:#fff'],
			  btn: ['添加', '取消'],
			  type: 1,
			  content:$('#demo111'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			  area: ['1000px', '700px'],
				shade: [0.1, '#fff'],
			  end:function(){
			  	$('#demo111').hide();
				  $('.imgarr').html("");
				  $(".videos").html("");
			  },
				success:function(layero){
					$(layero).find('#previews').text("");
					$(layero).find('#reason').val("");
					$(".cutbtn").show();
					$(".videoHide").html("");
					$("#videoProgress").html("");
					getVideo();//获取视频限制大小
					//给保存按钮添加form属性
					$("div.layui-layer-page").addClass("layui-form");
					$("a.layui-layer-btn0").attr("lay-submit","");
					$("a.layui-layer-btn0").attr("lay-filter","formdemo");
					var hml = '';
					if(txt==0){ //图片
						var leftwidth = $(".imgarr").attr("data-width1");
						var leftheight = $(".imgarr").attr("data-height1");
						var rgtwidth = $(".imgarr").attr("data-width2");
						var rgtheight =$(".imgarr").attr("data-height2");
						hml += '<div class="layui-input-block flex imgtype">' +
									'<a class="localUpload" id="selectfiles">上传图片</a>'+
									'<span class="tip">备注：图片不超过1m</span>' +
									'<a class="cutbtn" id="cutbtn">点击进行裁剪（<span class="leftwidth">'+ leftwidth +'</span>px x <span class="leftheight">'+ leftheight +'</span>px）</a>'
								if(rgtwidth !="a"){
									hml += '<a class="cutbtn" id="cutbtn1">点击进行裁剪（<span class="rgtwidth">'+ rgtwidth +'</span>px x <span class="rgtheight">'+ rgtheight +'</span>px）</a>'
								}
						hml +=		'<div id="ossfile" style="display: none"></div>' +
									/*'<div class="redtip">温馨提示：已上传8张了哟</div>' +*/
								'</div>' +
								'<div class="showimg">' +
									'<div id="previews"></div>' +
								'</div>'+
								'<div id="btn"></div>' +
								'<div id="localBtn"></div>';
						$(layero).find('#sourcetp').val("图片");
						$(layero).find('#sourcetp').attr("data-num",1);
						$(layero).find('.imgarr').html(hml);
						$(".imgarr").show();
						$(".videos").hide();
						$(".videoHide").html("");
						$(".videoProgress").html("");
						//上传本地图片点击事件
						$("#selectfiles").click(function() {
							$("#localBtn").click();
							/*var len = $("#previews .editor_img").length;
							 if (len >= 8) {
							 $(".redtip").show();
							 }
							 if(len<8){
							 $(".redtip").hide();
							 $("#localBtn").click();
							 }*/
						});

						//裁剪
						cutImg("#cutbtn",leftwidth,leftheight);
						cutImg("#cutbtn1",rgtwidth,rgtheight);

						//图片上传
						uploadOss({
							btn: 'localBtn',
							imgDom: "previews",
							flag: "sendLocal",
							size:'1mb'
						});

						//选中img标签事件
						$("#previews").on('click', '.imglist i', function() {
							$(this).parent().remove();
						});

					}else{
						hml += '<div class="layui-input-block flex videotype">' +
									'<a class="btn form-btn btn-submit ">上传视频<input type="file " class="video-btn " id="uploadVideo" /></a>'+
									' <div class="form-sign">备注：支持绝大多数视频文件格式，大小不超过<span class="video-size">50mb</span>，较大的视频请压缩后上传</div>' +
								'</div>'+
								'<div class="video-wrap ">'+
									'<h4>您所选择的文件列表：</h4>' +
									'<div id="videoProgress"></div>' +
									' <div id="videoHide" class="videoHide"></div>'+
								'</div>';
						$(layero).find('#sourcetp').attr("data-num",2);
						$(layero).find('#sourcetp').val("视频");
						$(layero).find('#previews').text("");
						$(layero).find('.videos').html(hml);
						$(".imgarr").hide();
						$(".videos").show();
						var videoSize = $(".video-size").text().toString();
						//视频上传
						//上传视频
						uploadOss({
							btn: "uploadVideo",
							flag: "video",
							size: videoSize
						});
						$(layero).find('#sourcetp').text("视频");
						$(layero).find('#sourcetp').attr("data-num",2);
					}

				},
			  yes:function(index, layero){
				  //form监听事件
				  form.on('submit(formdemo)',function(data){
					  if(data){
						  var restype = parseInt(txt)+1;
						  var remark = $(layero).find('#reason').val();
							if(restype==1){
								var list = $("#previews").find(".editor_img");
								if(list.length>0){
									/*var urlarr = [];
									for(var i=0;i<list.length;i++){
										urlarr.push(list.eq(i).find("img").attr("src"));
									}
									var url = urlarr.join(",");*/
									var nawurl = $("#previews").find(".editor_img").attr("data-src") || "";
									if(nawurl==""){
										var url = $("#previews").find(".editor_img").attr("src");
									}else{
										var url = nawurl;
									}
									var cutwidth = $("#previews .editor_img").attr("data-width") ||"";
									var cutheight = $("#previews .editor_img").attr("data-height") ||"";
									if(cutwidth==""){
										var reswidth = $("#previews").find(".editor_img").width();
									}else{
										var reswidth = $("#previews .editor_img").attr("data-width");
									}
									if(cutheight==""){
										var reshigth = $("#previews").find(".editor_img").height();
									}else{
										var reshigth = $("#previews .editor_img").attr("data-height");
									}
									var param ={
										"username" : username,
										"resname" : remark,
										"restype" : restype,
										"url" : url,
										"reswidth" : parseInt(reswidth),
										"reshight" :parseInt(reshigth)
									}
									if(locked){
										locked = false;
										reqAjaxAsync(USER_URL.ADDRESOURCE,JSON.stringify(param)).done(function(res){
											if(res.code == 1){
													var tit = $.trim($("#inquireInput").val());
													var type = parseInt($(".tab-change .acv").index())+1;
													sessionStorage.setItem("adtype",type);
													layer.close(index);
													layer.msg(res.msg);
													location.reload();

												$(".change").attr("data-num",0);
											}else{
												layer.msg(res.msg);
												locked = true;
											}
										});
									}
								}else{
									layer.msg("请上传资源");
								}
							};
						  if(restype==2){ //视频
							  var list = $("#videoHide").find("video");
							  var per = $("#videoProgress").find("b").text();
							  if(per=="100%"){
								  if($("#videoHide").html()!="") {
									  var url = list.attr("src");
									  var param = {
										  "username": username,
										  "resname": remark,
										  "restype": restype,
										  "url": url
									  }
									  if (locked) {
										  locked = false;
										  reqAjaxAsync(USER_URL.ADDRESOURCE, JSON.stringify(param)).done(function (res) {
											  if (res.code == 1) {
												  var tit = $.trim($("#inquireInput").val());
												  var type = parseInt($(".tab-change .acv").index()) + 1;
												  sessionStorage.setItem("adtype", type);
												  layer.close(index);
												  layer.msg(res.msg);
												  location.reload();
												  $(".change").attr("data-num", 0);
											  } else {
												  layer.msg(res.msg);
												  locked = true;
											  }
										  });
									  }
								  }else{
									  layer.msg("资源加载中请稍候！");
								  }
							  } else{
								  layer.msg("请上传资源");
							  }

						  }

					  }
					  return false;
				  });
			  }
		 })
		 });


})(jQuery)