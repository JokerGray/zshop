$(function(){
		var cmd1="game/findGoodsCategory",    //查询所有的板块
			cmd2="game/findGoodsList",       //查询板块下对应的物品
			cmd3="game/goodsManager";
		var username=sessionStorage.getItem("username");  //平台用户的用户名
		var laypage=layui.page;
		var moduleNo="";
		var regNum=/^([1-9]\d*|[0]{1,1})$/; //正整数正则
		 // 上传图片
		runupload($("#newImg"),$("#newGoodsImg"));
		runupload($("#fixImg"),$("#mdGoodsImg"));
		// ajax公共方法
		function reqAjaxAsync(cmd, data, callback) {
		var apikey = sessionStorage.getItem('apikey') || "test"; //获取缓存 通行证码
		var version = sessionStorage.getItem('version') || "1"; //获取缓存 版本号
	    var inputdata = data;
	    $.ajax({
	      type: "POST",
	      url: "/zxcity_restful/ws/rest",
	      dataType: "json",
	      async: true, //默认为异步
	      data: {
	        "cmd": cmd,
	        "data": data || "",
	        "version": version
	      },
	      beforeSend: function (request) {
	        request.setRequestHeader("apikey", apikey);
	      },
	      success: function (res) {
	        callback(res, inputdata);
	      },
	      error: function (err) {
	        layer.msg("请求出错！");
	        console.log(err);
	      }
	    });
	  }
	  // 查询所有的模块
	  getStart();
	  function getStart(){
	  	reqAjaxAsync(cmd1,'{}',showList);
	  		$(".items").find(".item").eq(0).trigger("click");
	  }
	  // 展示所有模块
	  function showList(re){
	  	console.log(re);
	  	var itemHtml="";
	  	for(var i=0;i<re.data.list.length;i++){
	  		itemHtml+='<li class="item" moduleno="'+re.data.list[i].moduleNo+'">'+re.data.list[i].moduleName+'</li>'
	  	}
	  	$(".items").html(itemHtml);
		  // 模块间样式切换，数据展示
		  $(".item").on("click",function(){
		  		$(this).addClass("active").siblings().removeClass("active");
		  		moduleNo=$(this).attr("moduleno");
		  		// 获取页码信息
		  		var pageObj={
		  			goodsCategory:moduleNo,
		  			page:0,
		  			row:6
		  		}
		  		var pagedata=JSON.stringify(pageObj);
		  		reqAjaxAsync(cmd2,pagedata,showPage);
		  });
		  $(".item").eq(0).trigger("click");
		  // 新增商品接口
		  $("#adGs").on("click",function(){
		  	var moduleNo=$(".item.active").attr("moduleno"),
		  		module=$(".item.active").text();
		  		console.log(moduleNo);
		  		$("#newCtId").val(moduleNo);
		  		$("#newGoodsCategory").val(module);
		  		$("#newGoodsName").val("");
		  		$("#newGoodsPrice").val("");
		  		$("#newGoodsImg").html("");
		  		$("#newGoodsImg").hide();

		  		$("#addgd").modal("show");
				$("#newGoodsPrice").on("input",function(){
					if(!regNum.test($(this).val())){
						layer.msg("请输入0或正整数！",{time:1000});
						$(this).val("");
						return false;
					}
				});
		  		$("#newSave").unbind("click");
		  		$("#newSave").on("click",function(){
					var categoryId_n=$("#newCtId").val(),	
						goodsName_n=$("#newGoodsName").val(),
						goodsPrice_n=$("#newGoodsPrice").val(),
						goodsPic_n=$("#newGoodsImg").find("img").attr("src");
						if(goodsName_n==""){
							layer.msg("商品名不能为空！",{time:1000});
							return false;
						}	
						if(goodsPrice_n==""){
							layer.msg("商品价格不能为空！",{time:1000});
							return false;
						}	
						if(typeof(goodsPic_n)=="undefined"){
							layer.msg("请上传商品图片！",{time:1000});
							return false;
						}																
						// console.log(categoryId_n);
						// console.log(goodsName_n);
						// console.log(goodsPrice_n);
						// console.log(goodsPic_n);
						var datas={
							type:1,
							userCode:username,
							goodsCategory:categoryId_n,
							goodsPic:goodsPic_n,
							goodsName:goodsName_n,
							goodsPrice:Number(goodsPrice_n)							
						}
						console.log(datas);
						var data=JSON.stringify(datas);
						reqAjaxAsync(cmd3, data, successFix);
		  		});
		  });


	  }
	  
	  // 展示分页信息
	  function showPage(re){
	  	var total=re.data.total,
	  		totalPage=Math.ceil(total/6);
	  	$("#totals").text(total);
	  	layui.use(['laypage'],function(){
	  		var laypage=layui.laypage;
		  	  laypage({
			    cont: 'pages',
			    pages:totalPage, //总页数
			    groups:5, //连续显示分页数
			    jump:function(obj){
			          var curr = obj.curr;
			          var currNum=curr-1;
			          console.log(re.data.list.length);
					  var newdatas={
						"goodsCategory":moduleNo,
						"page":currNum,
						"row":6
					 };
					 var data=JSON.stringify(newdatas);
					  reqAjaxAsync(cmd2,data,showTables);
					}
				});
	  	});
	  
	  }

	  function showTables(re){
	  	 var list=re.data.list;
	  	 console.log(list);
	  	 var tbHeadHtml='<table class="table table-bordered table-striped"><tbody><tr><th>序号</th><th>名称</th><th>图片</th><th>单价(智币)</th><th>操作</th></tr>';
	  	 var tbFtHtml='</tbody></table>';
	  	 var nodataHtml='<table class="table table-bordered table-striped"><tbody>'+
				        '<tr><th>序号</th><th>名称</th><th>图片</th><th>单价(智币)</th><th>操作</th></tr>'+
				        '</tbody></table><div class="no-data">暂无数据~</div>';
		if(list.length){
			var tbCont="";
			for(var i=0;i<list.length;i++){
				tbCont+='<tr id="'+list[i].id+'"><td>'+(i+1)+'</td><td class="gdname">'+list[i].goodsName+'</td>'+
				'<td><div class="showImg"><img src="'+list[i].goodsPic+'"/></div></td><td class="gdprice">'+list[i].goodsPrice+'</td><td><button class="btn btn-success fixg">修改</button>'+
				'<button class="btn btn-danger delg"  style="margin-left:10px;">删除</button></td></tr>';
			}
			var tableHtml=tbHeadHtml+tbCont+tbFtHtml;
		}else{
			var tableHtml=nodataHtml;
		}	
		$("#tablelist").html(tableHtml);
		// 定义修改点击事件
		$(".fixg").on("click",function(){
			var tr=$(this).parent().parent();
			var goodsId=Number(tr.attr("id")),
				goodsName=tr.find(".gdname").text(),
				goodsPrice=tr.find(".gdprice").text(),
				goodsPic=tr.find("img").attr("src");
			$("#mdGoodsId").val(goodsId);	
			$("#mdGoodsName").val(goodsName);
			$("#mdGoodsPrice").val(goodsPrice);
			$("#mdGoodsImg").html('<img src="'+goodsPic+'">');
			console.log(goodsId);
			console.log(goodsName);
			console.log(goodsPrice);
			console.log(goodsPic);
			$("#fixgd").modal("show");

			$("#mdGoodsPrice").on("input",function(){
				if(!regNum.test($(this).val())){
					layer.msg("请输入0或正整数！",{time:1000});
					$(this).val("");
					return false;
				}
			});
			// 获取修改后的商品信息
			$("#mdSave").unbind("click");
			$("#mdSave").on("click",function(){
				if($("#mdGoodsName").val()==""){
					layer.msg("商品名不能为空！",{time:500});
					return false;
				}
				if($("#mdGoodsPrice").val()==""){
					layer.msg("价格不能为空",{time:500});
					return false;
				}				
			var goodsId_d=$("#mdGoodsId").val(),	
				goodsName_d=$("#mdGoodsName").val(),
				goodsPrice_d=$("#mdGoodsPrice").val(),
				goodsPic_d=$("#mdGoodsImg").find("img").attr("src");
				// console.log(goodsId_d);
				// console.log(goodsName_d);
				// console.log(goodsPrice_d);
				// console.log(goodsPic_d);
				var datas={
					type:1,
					userCode:username,
					id:Number(goodsId_d),
					goodsPic:goodsPic_d,
					goodsName:goodsName_d,
					goodsPrice:Number(goodsPrice_d)
				}
				console.log(datas);
				var data=JSON.stringify(datas);
				reqAjaxAsync(cmd3, data, successFix);
			});
		});
		// 删除物品
		$(".delg").on("click",function(){
			var tr=$(this).parent().parent(),
				goodsId=tr.attr("id");
			$("#delId").val(goodsId);
			$("#delgd").modal("show");
			$("#delGoods").unbind("click");
			$("#delGoods").on("click",function(){
				var datas={
					type:2,
					userCode:username,
					id:Number(goodsId)
				}
				var data=JSON.stringify(datas);
				reqAjaxAsync(cmd3, data, successFix);				
			});
		});
	  }
		// 修改成功回调
		function  successFix(re){
			layer.msg(re.msg,{time:1000});
			$("#newSave").unbind("click");
			$("#mdSave").unbind("click");
			$("#delGoods").unbind("click");
			setTimeout(function(){
				var index = layer.load(0, {shade: false});
				setTimeout(function(){
					layer.close(index);
					window.location.reload();
				},500);
			},1000);
		}
});