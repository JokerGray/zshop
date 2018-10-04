$(function(){
	var cmd1="game/findAudit",
		cmd2="game/auditPass",
		cmd3="game/auditFailed";
	/*
	**@param 初始化查询
	*/
	var datas={
		"shopName":null,
		"page":0,
		"row":5
	};
	var data=JSON.stringify(datas);
	reqAjaxAsync(cmd1,data,showRes);

	$("#searchBtn").on("click",function(){
		var showName=$("#inputName").val();
		var datas={
			"shopName":showName || null,
			"page":0,
			"row":5
		};
		var data=JSON.stringify(datas);
		reqAjaxAsync(cmd1,data,showRes);
	});
	$("#pageChange").on("change",function(){
		var showName=$("#inputName").val();
		var row=Number($(this).val());
		var datas={
			"shopName":showName || null,
			"page":0,
			"row":row
		};
		var data=JSON.stringify(datas);
		reqAjaxAsync(cmd1,data,showRes);
	});


  function reqAjaxAsync(cmd, data, callback) {
	var apikey = yyCache.get("apikey") || "test"; //获取缓存 通行证码
	var version = yyCache.get('version') || "1"; //获取缓存 版本号
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
  	function showRes(re,inputdata){
  		//console.log(re);
  		var datas=JSON.parse(inputdata);
  		//console.log(datas);
  		$("#msgNum").text(re.total);
		  //	更改分页select
		  var optionsHtml = "";
		  for (var i = 3; i <6; i++) {

		    if (i ==datas.row) {
		      optionsHtml += '<option selected="selected" value="' + i + '">' + i + '</option>';
		    } else {
		      optionsHtml += '<option value="' + i + '">' + i + '</option>';
		    }
		  }
		$("#pageChange").html(optionsHtml);
		$("#pageEnd").text(datas.row);
		showPage(re,datas);

  	}
	/*
	**@param
	**@function laypage:翻页插件
	*/
	function showPage(re,datas){
		//console.log(datas);
		layui.use(['laypage', 'layer'], function(){
		  var laypage = layui.laypage,
		 		layer = layui.layer;

		  laypage({
		    cont: 'pageBtns',
		    pages:Math.ceil(re.total/datas.row),//总页数
		    groups:5, //连续显示分页数
		    jump: function (obj) {
	          var curr = obj.curr;
	          var currNum=curr-1;
	         /// console.log(re.data.list.length);
			  var newdatas={
				"shopName":datas.shopName,
				"page":currNum,
				"row":datas.row
			 };
			 var data=JSON.stringify(newdatas);
			  reqAjaxAsync(cmd1,data,showTables);
			}
		})
		})
	}

	function  showTables(re){
		var table="";
	      var tableHeader='<table class="table table-bordered table-striped"><tbody>'+
	    	'<tr><th>序号</th><th>姓名</th><th>所属店铺</th><th>店铺ID</th><th>店铺地址</th><th>身份证正面</th><th>身份证反面</th><th>操作</th></tr>';
	      var tablefooter="</tbody></table>";
			if(re.data.list.length){
				var tableCont="";
				for(var i=0;i<re.data.list.length;i++){
					tableCont+='<tr id="'+re.data.list[i].ids+'" data-shopId="'+re.data.list[i].shopId+'" data-userId="'+re.data.list[i].userId+'" data-type="'+re.data.list[i].type+'">'
					+'<td>'+(i+1)+'</td><td>'+re.data.list[i].name+'</td><td>'+re.data.list[i].shopName+'</td><td>'+re.data.list[i].shopId+'</td><td>'+re.data.list[i].shopAddress+'</td>'+
					'<td><div class="showImg"><img src="'+re.data.list[i].frontUrl+'"/></div></td>'+
					'<td><div class="showImg"><img src="'+re.data.list[i].contraryUrl+'"/></div></td>'+
					'<td><button class="btn btn-success passCheck">通过</button><button class="btn btn-danger unpassCheck"  style="margin-left:10px;">不通过</button></td></tr>';
				}
				table=tableHeader+tableCont+tablefooter;
				$("#tablelist").html(table);
			}else{
				table='<table class="table table-bordered table-striped"><tbody>'+
		        '<tr><th>序号</th><th>姓名</th><th>所属店铺</th><th>店铺ID</th><th>店铺地址</th><th>身份证正面</th><th>身份证反面</th></tr>'+
		        '</tbody></table><div class="no-data">暂无数据~</div>';
		        $("#tablelist").html(table);
			}
			/*
			**@param layer.open：加载弹出图片事件
			**@function
			*/
			$(".showImg").on("click",function(){
				var img=$(this).children("img");
				layer.open({
				  type: 1,
				  title: false,
				  closeBtn: 0,
				  area: '650px',
				  skin: 'layui-layer-nobg', //没有背景色
				  shadeClose: true,
				  content:img
				});
			})
			// 通过审核
			$(".passCheck").on("click",function(){
				var id=Number($(this).parents("tr").attr("id"));
				var shopId = Number($(this).parents("tr").attr("data-shopId")),
				userId = Number($(this).parents("tr").attr("data-userId")),
				type = Number($(this).parents("tr").attr("data-type"));
				var datas={
					'userId':userId,
					'shopId':shopId,
					'type':type
				};
				var data=JSON.stringify(datas);
				layer.confirm('确认通过吗？', {
					  btn: ['确认','取消'] //按钮
					}, function(){
					  reqAjaxAsync(cmd2,data,checkPass);
					}, function(){
				});

			});
			$(".unpassCheck").on("click",function(){
				  var id=Number($(this).parents("tr").attr("id"));
				layer.prompt({title:"请输入审核不通过原因",formType:2,maxlength:30},function(val, index){
				  var cause=val;
				  var datas={
				  	"id":id,
				  	"cause":cause
				  }
				  var data=JSON.stringify(datas);
				  reqAjaxAsync(cmd3,data,checkPass);
				  layer.close(index);
				});
			});
	}

	function checkPass(re){
		layer.msg(re.msg);
		setTimeout(function(){
			window.location.reload();
		},2000);
	}
})
