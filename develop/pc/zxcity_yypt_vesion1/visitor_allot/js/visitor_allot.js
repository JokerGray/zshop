(function($) {
	var page = 1;
	var rows = 10;
	var userno = yyCache.get("userno") || "";
	var locked = true;
	var USER_URL = {
		RESOURLIST : 'operations/findVisitorDistribution', //(查询访客分配) enable是状态 0为未启用 1为启用
		UPDATESERVICE : 'operations/updateVisitorDistribution' //(修改客服分配)
	};
		
		
		var layer = layui.layer;
		var table = layui.table;
  		layui.use('form', function(){
  			 form = layui.form;
  		})

	//初始化
	$(function(){
		getSollt();
	})

		//初始化方法
		function sollt(res){
			var sHtml ='';
			layui.use('form', function(){
				form = layui.form;

			for(var i=0;i<res.data.length;i++){
				var row = res.data[i];
				var content = row.content ||"";
				sHtml += '<div data-id="'+ row.id +'" class="new-sollt">' +
							'<h4>' + row.title + '</h4>' +
							'<div class="layui-form-item">' +
								'<div class="layui-input-block">'
								if(row.enable==0){
									sHtml +='<input value="'+ row.id +'" lay-filter="switc" type="checkbox" name="switch" lay-skin="switch" lay-text="开启|关闭">'
								}else{
									sHtml +='<input value="'+ row.id +'" lay-filter="switc" type="checkbox" name="switch" lay-skin="switch" lay-text="开启|关闭" checked>'
								}
				sHtml += '</div>' +
							'<div class="tip">' + content+ '</div>' +
						'</div>' +
					'</div>'
			}
			$("#solltContent").html(sHtml);
				form.render();
			})
		}

	//加载访客分配
	function getSollt(){
		reqAjaxAsync(USER_URL.RESOURLIST,"").done(function(res){
			if(res.code == 1){
				sollt(res);
			}else{
				layer.msg(res.msg);
			}
		})
	}

	//修改访客分配
	form.on('switch(switc)', function(data){
		console.log(data.elem); //得到checkbox原始DOM对象
		console.log(data.elem.checked); //开关是否开启，true或者false
		console.log(data.value); //开关value值，也可以通过data.elem.value得到
		console.log(data.othis); //得到美化后的DOM对象
		var id = data.value;
		if(data.elem.checked){
			var enable = '1';
		}else{
			var enable = '0';
		}
		var param = {
			'id': id,
			'enable' :enable
		}
		reqAjaxAsync(USER_URL.UPDATESERVICE,JSON.stringify(param)).done(function(res){
			if(res.code == 1){
				layer.msg(res.msg);
			}else{
				layer.msg(res.msg);
			}
		})
	});


})(jQuery)